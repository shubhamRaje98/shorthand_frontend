import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './SuperAdminTrackDashboard.css'
import moment from 'moment-timezone'

const isValidData = (value) => {
    // Check for obviously invalid values first
    if (!value || value === "invalid date" || value === "0" || value === "" || value === null || value === undefined) {
        return false;
    }

    // If it's already a formatted string with time, consider it valid
    // Pattern: DD/MM/YYYY HH:MM AM/PM
    const formattedPattern = /^\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{2}\s(AM|PM)$/;
    if (formattedPattern.test(value)) {
        return true;
    }

    // For other formats, try to parse as date
    try {
        const date = new Date(value);
        return !isNaN(date.getTime());
    } catch (error) {
        return false;
    }
};
const getCellClass = (item, field, exam_type) => {
    let stages;
    if (exam_type === 'shorthand' || exam_type === '') { // GCC with both passages
        stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
    } else if (exam_type === 'typewriting') { // GCC typewriting only
        stages = ['loginTime', 'trial_passage_time', 'typing_passage_time', 'feedback_time'];
    } else if (exam_type === 'skill') { // SKILL exam type
        stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'feedback_time'];
    } else {
        stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
    }
    const currentStageIndex = stages.indexOf(field);

    if (currentStageIndex === -1) return '';

    if (field === 'loginTime') {
        return isValidData(item[field]) ? 'dept-cell-green dept-text-white' : 'dept-cell-red dept-text-white';
    }

    if (field === 'feedback_time') {
        if (isValidData(item[field])) {
            return 'dept-cell-green dept-text-white';
        } else {
            return 'dept-cell-red dept-text-white';
        }
    }

    if (isValidData(item[field])) {
        if (currentStageIndex === stages.length - 1 || isValidData(item[stages[currentStageIndex + 1]])) {
            return 'dept-cell-green dept-text-white';
        } else if (currentStageIndex > 0 && currentStageIndex < stages.length - 1) {
            const prevCellGreen = isValidData(item[stages[currentStageIndex - 1]]);
            const nextCellRed = !isValidData(item[stages[currentStageIndex + 1]]);
            if (prevCellGreen && nextCellRed) {
                return 'dept-cell-yellow dept-text-black';
            } else {
                return 'dept-cell-green dept-text-white';
            }
        } else {
            return 'dept-cell-green dept-text-white';
        }
    } else if (currentStageIndex > 0 && isValidData(item[stages[currentStageIndex - 1]])) {
        return 'dept-cell-red dept-text-black';
    } else {
        return 'dept-cell-red dept-text-white';
    }
};

const SuperAdminTrackDashboard = () => {
    const [data, setData] = useState([]);
    const [batchNo, setBatchNo] = useState('');
    const [subject, setSubject] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [exam_type, setExam_type] = useState('');
    const [batchDate, setBatchDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updateInterval, setUpdateInterval] = useState(100000);
    const [batches, setBatches] = useState([]);
    const [departmentId, setDepartmentId] = useState('');
    const [departments, setDepartments] = useState([]);
    const [center, setCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [batchDates, setBatchDates] = useState([]);
    const [total_login_count, setTotal_login_count] = useState(0);
    const [stageCounts, setStageCounts] = useState({});

    // 'typewriting' in UI means SKILL exam; map to 'skill' for table rendering
    const effectiveExamType = exam_type === 'typewriting' ? 'skill' : exam_type;

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Current filters state for refresh
    const [currentFilters, setCurrentFilters] = useState({});

    const formatDate = (dateString) => {
        if (!dateString || dateString === "invalid date" || dateString === "0") {
            return "";
        }

        const dateStr = String(dateString);
        const dateTimeMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):?(\d{2})?/);

        if (dateTimeMatch) {
            const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
            const formattedDate = `${day}/${month}/${year}`;

            let hour = parseInt(hours, 10);
            const minute = minutes;
            const ampm = hour >= 12 ? 'PM' : 'AM';

            if (hour === 0) {
                hour = 12;
            } else if (hour > 12) {
                hour = hour - 12;
            }

            const formattedTime = `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
            return `${formattedDate} ${formattedTime}`;
        }

        return dateStr;
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString || dateString === "invalid date" || dateString === "0") {
            return dateString;
        }

        try {
            const dateStr = String(dateString);
            const datePart = dateStr.split('T')[0] || dateStr.split(' ')[0];
            const [year, month, day] = datePart.split('-');
            return `${day}/${month}/${year}`;
        } catch (error) {
            return dateString;
        }
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Fetch all filter options from backend
    const fetchFilterOptions = async () => {
        try {
            console.log("🔍 Fetching filter options...");
            const response = await axios.post(
                'https://checking.shorthandonlineexam.in/super-admin-student-track-dashboard',
                {}, // Empty request body to get all data
                { withCredentials: true }
            );

            if (response.data && response.data.length > 0) {
                console.log("📊 Total records received:", response.data.length);

                // Process dates WITHOUT timezone conversion
                const processedDates = response.data
                    .filter(item => {
                        const date = item.batchdate;
                        const isValid = date &&
                            date !== "invalid date" &&
                            date !== "0" &&
                            date !== "" &&
                            date !== null &&
                            date !== undefined;
                        return isValid;
                    })
                    .map(item => {
                        const date = item.batchdate;

                        // Handle string dates
                        if (typeof date === 'string') {
                            // If it's already in YYYY-MM-DD format
                            if (date.match(/^\d{4}-\d{2}-\d{2}/)) {
                                return date.split('T')[0]; // Remove time part if exists
                            }
                            // If it's in DD/MM/YYYY format
                            if (date.includes('/')) {
                                const [day, month, year] = date.split('/');
                                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            }
                        }

                        // Handle Date objects
                        if (date instanceof Date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        }

                        // Try to parse as date but avoid timezone issues
                        try {
                            const parsed = new Date(date);
                            if (!isNaN(parsed.getTime())) {
                                const year = parsed.getFullYear();
                                const month = String(parsed.getMonth() + 1).padStart(2, '0');
                                const day = String(parsed.getDate()).padStart(2, '0');
                                return `${year}-${month}-${day}`;
                            }
                        } catch (e) {
                            console.error('Error parsing date:', date, e);
                        }

                        return null;
                    })
                    .filter(date => date !== null);

                const uniqueBatchDates = [...new Set(processedDates)].sort().reverse();
                setBatchDates(uniqueBatchDates);

                const uniqueBatches = [...new Set(response.data
                    .map(item => item.batchNo)
                    .filter(batch => batch && batch !== "" && batch !== null && batch !== undefined)
                )].sort();
                setBatches(uniqueBatches);

                const uniqueCenters = [...new Set(response.data
                    .map(item => item.center)
                    .filter(center => center && center !== "" && center !== null && center !== undefined)
                )].sort();
                setCenters(uniqueCenters);

                const uniqueDepartments = [...new Set(response.data
                    .map(item => item.departmentId)
                    .filter(dept => dept && dept !== "" && dept !== null && dept !== undefined)
                )].sort();
                setDepartments(uniqueDepartments);

                const uniqueSubjects = [...new Set(response.data
                    .map(item => item.subject_name)
                    .filter(subject => subject && subject !== "" && subject !== null && subject !== undefined)
                )];
                setSubjects(uniqueSubjects);
            }
        } catch (error) {
            console.error('❌ Error fetching filter options:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('https://checking.shorthandonlineexam.in/subjects');
            if (response.data.subjects) {
                setAllSubjects(response.data.subjects);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError('Failed to fetch subjects');
        }
    };

    // Updated fetchTotalLoginCount with ALL filters
    const fetchTotalLoginCount = async (filters = currentFilters) => {
        try {
            const requestBody = {};

            if (filters.center && filters.center.trim()) {
                requestBody.center = filters.center.trim();
            }
            if (filters.batchNo && filters.batchNo.trim()) {
                requestBody.batchNo = filters.batchNo.trim();
            }
            if (filters.departmentId && filters.departmentId.trim()) {
                requestBody.department = filters.departmentId.trim();
            }
            if (filters.subject && filters.subject.trim()) {
                requestBody.subject_name = filters.subject.trim();
            }
            if (filters.loginStatus && filters.loginStatus.trim()) {
                requestBody.loginStatus = filters.loginStatus.trim();
            }
            if (filters.exam_type && filters.exam_type.trim()) {
                requestBody.exam_type = filters.exam_type.trim();
            }
            if (filters.batchDate && filters.batchDate.trim()) {
                requestBody.batchDate = filters.batchDate.trim();
            }

            console.log('🔢 Fetching login count with filters:', requestBody);

            const response = await axios.post('https://checking.shorthandonlineexam.in/total-login-count', requestBody, { withCredentials: true });

            if (response.data) {
                console.log('🔢 Login count response:', response.data);
                setTotal_login_count(response.data.total_count);
            }
        } catch (error) {
            console.log('❌ Error fetching login count:', error);
            setTotal_login_count(0);
        }
    };

    const fetchStageCounts = async (filters = currentFilters) => {
        try {
            const requestBody = {};

            if (filters.center && filters.center.trim()) {
                requestBody.center = filters.center.trim();
            }
            if (filters.batchNo && filters.batchNo.trim()) {
                requestBody.batchNo = filters.batchNo.trim();
            }
            if (filters.departmentId && filters.departmentId.trim()) {
                requestBody.departmentId = filters.departmentId.trim();
            }
            if (filters.subject && filters.subject.trim()) {
                requestBody.subject_name = filters.subject.trim();
            }
            if (filters.loginStatus && filters.loginStatus.trim()) {
                requestBody.loginStatus = filters.loginStatus.trim();
            }
            if (filters.exam_type && filters.exam_type.trim()) {
                requestBody.exam_type = filters.exam_type.trim();
            }
            if (filters.batchDate && filters.batchDate.trim()) {
                requestBody.batchDate = filters.batchDate.trim();
            }

            const response = await axios.post(
                "https://checking.shorthandonlineexam.in/super-admin-get-stage-counts",
                requestBody,
                { withCredentials: true }
            );

            if (response.data) {
                setStageCounts(response.data);
            }
        } catch (error) {
            console.log("❌ Error fetching stage counts:", error);
            setStageCounts({});
        }
    };

    // Create a separate function that accepts filters directly
    const fetchDataWithFilters = async (filters) => {
        setLoading(true);
        setError('');

        console.log("🔍 fetchDataWithFilters called with:", filters);

        try {
            // Build request body
            const requestBody = {};

            if (filters.subject && filters.subject.trim()) {
                requestBody.subject_name = filters.subject.trim();
            }
            if (filters.loginStatus && filters.loginStatus.trim()) {
                requestBody.loginStatus = filters.loginStatus.trim();
            }
            if (filters.batchNo && filters.batchNo.trim()) {
                requestBody.batchNo = filters.batchNo.trim();
            }
            if (filters.center && filters.center.trim()) {
                requestBody.center = filters.center.trim();
            }
            if (filters.exam_type && filters.exam_type.trim()) {
                requestBody.exam_type = filters.exam_type.trim();
            }
            if (filters.departmentId && filters.departmentId.trim()) {
                requestBody.departmentId = filters.departmentId.trim();
            }
            if (filters.batchDate && filters.batchDate.trim()) {
                const dateParts = filters.batchDate.trim().split("-");
                if (dateParts.length === 3) {
                    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                    requestBody.batchDate = formattedDate;
                } else {
                    requestBody.batchDate = filters.batchDate.trim();
                }
            }

            console.log("🚀 Sending request body:", requestBody);
            console.log("🔍 BatchNo specifically:", {
                original: filters.batchNo,
                trimmed: filters.batchNo ? filters.batchNo.trim() : 'undefined',
                inRequestBody: requestBody.batchNo
            });

            const response = await axios.post(
                'https://checking.shorthandonlineexam.in/super-admin-student-track-dashboard',
                requestBody,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("📨 Response:", response.data.length, "records");

            setData(response.data);
            setTotalPages(Math.ceil(response.data.length / rowsPerPage));

        } catch (error) {
            console.error("❌ Error fetching filtered data:", error);
            if (error.response && error.response.status === 404) {
                setError("No students found for the selected filter criteria. Please try different filters.");
                setData([]);
                setTotal_login_count(0);
            } else {
                setError("Failed to fetch data. Please try again.");
            }
        }
        setLoading(false);
    };

    // Updated fetchData function
    const fetchData = async (preserveFilters = false) => {
        // Use current state values or preserved filters
        const filters = preserveFilters ? currentFilters : {
            subject,
            loginStatus,
            batchNo,
            center,
            exam_type,
            departmentId,
            batchDate
        };

        console.log("🔍 fetchData called with preserveFilters:", preserveFilters);
        console.log("🔍 Current state values:", { subject, loginStatus, batchNo, center, exam_type, departmentId, batchDate });
        console.log("🔍 Using filters:", filters);

        // Update current filters for refresh
        if (!preserveFilters) {
            setCurrentFilters(filters);
        }

        await fetchDataWithFilters(filters);
    };

    // Debounced fetch data for filter changes
    const debouncedFetchData = useCallback(debounce(() => fetchData(false), 500), []);

    // Refresh function that preserves filters
    const refreshData = useCallback(() => {
        console.log("Refreshing data with current filters:", currentFilters);
        fetchData(true); // Preserve current filters
        fetchTotalLoginCount(currentFilters);
        fetchStageCounts(currentFilters);
    }, [currentFilters]);

    // Filter change handlers
    const handleFilterChange = (filterName, value) => {
        console.log(`🔍 Filter changed: ${filterName} = ${value}`);

        // Update individual state immediately
        switch (filterName) {
            case 'batchNo': setBatchNo(value); break;
            case 'subject': setSubject(value); break;
            case 'loginStatus': setLoginStatus(value); break;
            case 'exam_type': setExam_type(value); break;
            case 'batchDate': setBatchDate(value); break;
            case 'center': setCenter(value); break;
            case 'departmentId': setDepartmentId(value); break;
        }

        // Create new filters object with the updated value
        const newFilters = {
            ...currentFilters,
            [filterName]: value
        };

        console.log(`🔍 New filters object:`, newFilters);

        setCurrentFilters(newFilters);

        // Reset to first page when filters change
        setCurrentPage(1);

        // Use the new filters directly instead of state
        setTimeout(() => {
            fetchDataWithFilters(newFilters); // Pass filters directly
            fetchTotalLoginCount(newFilters);
            fetchStageCounts(newFilters);
        }, 100);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setBatchNo('');
        setSubject('');
        setLoginStatus('');
        setExam_type('');
        setBatchDate('');
        setCenter('');
        setDepartmentId('');

        const emptyFilters = {
            batchNo: '',
            subject: '',
            loginStatus: '',
            exam_type: '',
            batchDate: '',
            center: '',
            departmentId: ''
        };

        setCurrentFilters(emptyFilters);
        setCurrentPage(1);

        // Fetch data without any filters
        setTimeout(() => {
            fetchDataWithFilters(emptyFilters);
            fetchTotalLoginCount(emptyFilters);
            fetchStageCounts(emptyFilters);
        }, 100);
    };

    useEffect(() => {
        fetchSubjects();
        fetchFilterOptions();
        setTimeout(() => {
            fetchData(false);
            fetchTotalLoginCount();
            fetchStageCounts();
        }, 500);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, updateInterval);
        return () => clearInterval(interval);
    }, [updateInterval, refreshData]);

    useEffect(() => {
        setTotalPages(Math.ceil(data.length / rowsPerPage));
        setCurrentPage(1);
    }, [data, rowsPerPage]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            "Batch Number": item.batchNo,
            "Center": item.center,
            "Department": item.departmentId,
            "Seat No": item.student_id,
            "Student Name": item.fullname,
            "Subject": item.subject_name,
            "Batch Date": formatDateForDisplay(item.batchdate),
            "Login": formatDate(item.loginTime),
            "Trial": formatDate(item.trial_time),
            "Audio Track A": formatDate(item.audio1_time),
            "Passage A": formatDate(item.passage1_time),
            "Audio Track B": formatDate(item.audio2_time),
            "Passage B": formatDate(item.passage2_time),
            "Trial Typing": formatDate(item.trial_passage_time),
            "Typing Passage": formatDate(item.typing_passage_time),
            "Feedback": formatDate(item.feedback_time)
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
        XLSX.writeFile(workbook, `student_data_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = event.target.value === 'all' ? data.length : parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const getPaginatedData = () => {
        if (rowsPerPage === 'all' || rowsPerPage >= data.length) {
            return data;
        }
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const renderPaginationButtons = () => {
        if (rowsPerPage === 'all' || rowsPerPage >= data.length) {
            return null;
        }

        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers.map((page, index) => (
            <button
                key={index}
                onClick={() => page !== '...' && handlePageChange(page)}
                className={`dept-btn ${currentPage === page ? 'dept-btn-primary' : 'dept-btn-secondary'}`}
                disabled={page === '...'}
            >
                {page}
            </button>
        ));
    };

    return (
        <div>
            <div className="home-container">
                <div className="dept-container-fluid">
                    <div className="dept-row mb-3">
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="batchNo" className="dept-form-label">Batch Number:</label>
                            <select
                                className="dept-form-select dept-scrollable-dropdown"
                                id="batchNo"
                                value={batchNo}
                                onChange={(e) => handleFilterChange('batchNo', e.target.value)}
                            >
                                <option value="">All Batches</option>
                                {batches.map((batch, index) => (
                                    <option key={index} value={batch}>{batch}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="subject" className="dept-form-label">Subject:</label>
                            <select
                                className="dept-form-select dept-scrollable-dropdown"
                                id="subject"
                                value={subject}
                                onChange={(e) => handleFilterChange('subject', e.target.value)}
                            >
                                <option value="">All Subjects</option>
                                {allSubjects.filter(subj => {
                                    if (!exam_type) return true;
                                    if (exam_type === 'shorthand') return subj.examType === 'GCC';
                                    if (exam_type === 'typewriting') return subj.examType === 'SKILL';
                                    return true;
                                }).map((subj) => (
                                    <option key={subj.subjectId} value={subj.subject_name}>
                                        {subj.subject_name} {(!exam_type || exam_type === 'both') ? `(${subj.examType})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="loginStatus" className="dept-form-label">Login Status:</label>
                            <select
                                className="dept-form-select"
                                id="loginStatus"
                                value={loginStatus}
                                onChange={(e) => handleFilterChange('loginStatus', e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="loggedin">Logged In</option>
                                <option value="loggedout">Logged Out</option>
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="examStatus" className="dept-form-label">Exam Type:</label>
                            <select
                                className="dept-form-select"
                                id="examStatus"
                                value={exam_type}
                                onChange={(e) => handleFilterChange('exam_type', e.target.value)}
                            >
                                <option value="">GCC (Default)</option>
                                <option value="shorthand">GCC</option>
                                <option value="typewriting">SKILL</option>
                                <option value="both">Both (Legacy)</option>
                            </select>
                        </div>
                    </div>
                    <div className="dept-row mb-3">
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="batchDate" className="dept-form-label">Batch Date:</label>
                            <select
                                className="dept-form-select"
                                id="batchDate"
                                value={batchDate}
                                onChange={(e) => handleFilterChange('batchDate', e.target.value)}
                            >
                                <option value="">All Dates</option>
                                {batchDates.map((date, index) => (
                                    <option key={index} value={date}>
                                        {formatDateForDisplay(date)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="center" className="dept-form-label">Center:</label>
                            <select
                                className="dept-form-select dept-scrollable-dropdown"
                                id="center"
                                value={center}
                                onChange={(e) => handleFilterChange('center', e.target.value)}
                            >
                                <option value="">All Centers</option>
                                {centers.map((centerOption, index) => (
                                    <option key={index} value={centerOption}>{centerOption}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="department" className="dept-form-label">Department:</label>
                            <select
                                className="dept-form-select dept-scrollable-dropdown"
                                id="department"
                                value={departmentId}
                                onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {departments.map((departmentOption, index) => (
                                    <option key={index} value={departmentOption}>{departmentOption}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="rowsPerPage" className="dept-form-label">Rows per page:</label>
                            <select
                                className="dept-form-select"
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                    </div>
                    <div className="dept-row mb-3">
                        <div className="dept-col-md-12 dept-col-sm-12 mb-2 d-flex align-items-center flex-wrap">
                            <button onClick={exportToExcel} className="dept-btn dept-btn-primary dept-export-btn me-3 mb-2">
                                Export to Excel
                            </button>
                            <button onClick={() => refreshData()} className="dept-btn dept-btn-secondary me-3 mb-2">
                                Refresh Now
                            </button>
                            <button onClick={clearAllFilters} className="dept-btn dept-btn-outline-secondary me-3 mb-2">
                                Clear All Filters
                            </button>
                            <div className="dept-total-count-container ms-3 mb-2 d-flex flex-wrap gap-3">
                                <div className="dept-count-item">
                                    <span className="dept-total-count-label">Total students: {data.length}</span>
                                </div>
                                <div className="dept-count-item">
                                    <span className="dept-total-count-label">Total logged in: {total_login_count}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Stage Counts Summary */}
                    <div className="dept-row mb-3">
                        <div className="dept-col-12">
                            <div className="dept-stage-counts-container p-3 border rounded bg-white shadow-sm d-flex flex-wrap justify-content-between align-items-center">
                                <div className="text-center px-2">
                                    <div className="text-muted small fw-bold">Login</div>
                                    <div className="h5 mb-0 text-primary">{stageCounts.login_count || 0}</div>
                                </div>
                                {exam_type !== "typewriting" && (
                                    <div className="text-center px-2 border-start">
                                        <div className="text-muted small fw-bold">Trial</div>
                                        <div className="h5 mb-0 text-info">{stageCounts.trial_count || 0}</div>
                                    </div>
                                )}
                                {exam_type !== "typewriting" && (
                                    <>
                                        <div className="text-center px-2 border-start">
                                            <div className="text-muted small fw-bold">Audio Track A</div>
                                            <div className="h5 mb-0 text-success">{stageCounts.audio1_count || 0}</div>
                                        </div>
                                        <div className="text-center px-2 border-start">
                                            <div className="text-muted small fw-bold">Passage A</div>
                                            <div className="h5 mb-0 text-success">{stageCounts.passage1_count || 0}</div>
                                        </div>
                                    </>
                                )}
                                {(exam_type === "shorthand" || exam_type === "" || exam_type === "both") && (
                                    <>
                                        <div className="text-center px-2 border-start">
                                            <div className="text-muted small fw-bold">Audio Track B</div>
                                            <div className="h5 mb-0 text-success">{stageCounts.audio2_count || 0}</div>
                                        </div>
                                        <div className="text-center px-2 border-start">
                                            <div className="text-muted small fw-bold">Passage B</div>
                                            <div className="h5 mb-0 text-success">{stageCounts.passage2_count || 0}</div>
                                        </div>
                                    </>
                                )}
                                <div className="text-center px-2 border-start">
                                    <div className="text-muted small fw-bold">Feedback</div>
                                    <div className="h5 mb-0 text-warning">{stageCounts.feedback_count || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading filtered data...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-warning" role="alert">
                            {error}
                        </div>
                    ) : data.length > 0 ? (
                        <div className="dept-table-container">
                            <table className="dept-table dept-table-bordered dept-table-striped dept-table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: '8%' }}>Batch No</th>
                                        <th style={{ width: '8%' }}>Center</th>
                                        <th style={{ width: '12%' }}>Seat No</th>
                                        <th>Login</th>
                                        {effectiveExamType !== 'typewriting' && <th>Trial</th>}
                                        {effectiveExamType !== 'typewriting' && <th>Audio Track A</th>}
                                        {effectiveExamType !== 'typewriting' && <th>Passage A</th>}
                                        {(effectiveExamType === 'shorthand' || effectiveExamType === '') && (
                                            <>
                                                <th>Audio Track B</th>
                                                <th>Passage B</th>
                                            </>
                                        )}
                                        {(effectiveExamType === 'typewriting' || effectiveExamType === 'both') && (
                                            <>
                                                <th>Trial Typing</th>
                                                <th>Typing Test</th>
                                            </>
                                        )}
                                        <th>Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getPaginatedData().map((item, index) => (
                                        <tr key={index}>
                                            <td className="batch-number-column">{item.batchNo}</td>
                                            <td>{item.center}</td>
                                            <td>{item.student_id}</td>
                                            <td className={getCellClass(item, 'loginTime', effectiveExamType)}>{formatDate(item.loginTime)}</td>
                                            {effectiveExamType !== 'typewriting' && <td className={getCellClass(item, 'trial_time', effectiveExamType)}>{formatDate(item.trial_time)}</td>}
                                            {effectiveExamType !== 'typewriting' && (
                                                <>
                                                    <td className={getCellClass(item, 'audio1_time', effectiveExamType)}>{formatDate(item.audio1_time)}</td>
                                                    <td className={getCellClass(item, 'passage1_time', effectiveExamType)}>{formatDate(item.passage1_time)}</td>
                                                    {(effectiveExamType === 'shorthand' || effectiveExamType === '') && (
                                                        <>
                                                            <td className={getCellClass(item, 'audio2_time', effectiveExamType)}>{formatDate(item.audio2_time)}</td>
                                                            <td className={getCellClass(item, 'passage2_time', effectiveExamType)}>{formatDate(item.passage2_time)}</td>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {(effectiveExamType === 'typewriting' || effectiveExamType === 'both') && (
                                                <>
                                                    <td className={getCellClass(item, 'trial_passage_time', effectiveExamType)}>{formatDate(item.trial_passage_time)}</td>
                                                    <td className={getCellClass(item, 'typing_passage_time', effectiveExamType)}>{formatDate(item.typing_passage_time)}</td>
                                                </>
                                            )}
                                            <td className={getCellClass(item, 'feedback_time', effectiveExamType)}>{formatDate(item.feedback_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-4">
                            <p>No records found for the selected criteria. Try adjusting your filters.</p>
                        </div>
                    )}
                    {data.length > 0 && renderPaginationButtons() && (
                        <div className="dept-pagination" style={{ marginTop: '20px' }}>
                            {renderPaginationButtons()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SuperAdminTrackDashboard;