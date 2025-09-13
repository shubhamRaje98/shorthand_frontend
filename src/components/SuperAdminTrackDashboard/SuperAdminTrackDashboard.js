import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NavBar from '../navBar/navBar';
import * as XLSX from 'xlsx';
import './SuperAdminTrackDashboard.css'
import moment from 'moment-timezone'

// Importing the utility functions
const isValidData = (value) => {
    return value && value !== "invalid date" && value !== "0" && !isNaN(new Date(value).getTime());
};

const getCellClass = (item, field, exam_type) => {
    let stages; 
    if (exam_type === 'shorthand') {
        stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
    } else if (exam_type === 'typewriting') {
        stages = ['loginTime', 'trial_passage_time', 'typing_passage_time', 'feedback_time'];
    }else {
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
            if (prevCellGreen && nextCellRed ) {
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
    const [exam_type, setExam_type] = useState('shorthand');
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

const formatDate = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
        return "";
    }
    
    // Treat as string and extract components
    const dateStr = String(dateString);
    
    // Handle different date string formats
    let parsedDate;
    
    // Try to extract date and time components from string
    // Common formats: "2025-07-14T10:30:00" or "2025-07-14 10:30:00" etc.
    const dateTimeMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):?(\d{2})?/);
    
    if (dateTimeMatch) {
        const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
        
        // Convert to DD/MM/YYYY format
        const formattedDate = `${day}/${month}/${year}`;
        
        // Convert 24-hour to 12-hour format with AM/PM
        let hour = parseInt(hours, 10);
        const minute = minutes;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        
        // Convert hour to 12-hour format
        if (hour === 0) {
            hour = 12; // 00:xx becomes 12:xx AM
        } else if (hour > 12) {
            hour = hour - 12; // 13:xx becomes 1:xx PM, etc.
        }
        
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
        
        return `${formattedDate} ${formattedTime}`;
    }
    
    // If no regex match, return original string
    return dateStr;
};

const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
        return dateString;
    }
    
    try {
        const dateStr = String(dateString);
        // Extract just the date part (before T or space)
        const datePart = dateStr.split('T')[0] || dateStr.split(' ')[0];
        
        // Split YYYY-MM-DD into components
        const [year, month, day] = datePart.split('-');
        
        // Return in DD/MM/YYYY format
        return `${day}/${month}/${year}`;
    } catch (error) {
        return dateString;
    }
};

    // Helper function to normalize date for comparison
    const normalizeDateForFilter = (dateString) => {
        if (!dateString || dateString === "invalid date" || dateString === "0") {
            return null;
        }
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return null;
            }
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch (error) {
            return null;
        }
    };

    // Debounce function to prevent too many API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Fetch filter options separately for better performance
    const fetchFilterOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3004/super-admin-filter-options', { withCredentials: true });
            if (response.data) {
                // Set batches with proper filtering
                const validBatches = (response.data.batches || [])
                    .filter(batch => batch && batch !== "" && batch !== null && batch !== undefined)
                    .sort();
                setBatches(validBatches);

                // Set centers
                const validCenters = (response.data.centers || [])
                    .filter(center => center && center !== "" && center !== null && center !== undefined)
                    .sort();
                setCenters(validCenters);

                // Set departments
                const validDepartments = (response.data.departments || [])
                    .filter(dept => dept && dept !== "" && dept !== null && dept !== undefined)
                    .sort();
                setDepartments(validDepartments);
                
                // Process batch dates
                const processedDates = (response.data.batchDates || [])
                    .filter(date => date && date !== "invalid date" && date !== "0")
                    .map(date => normalizeDateForFilter(date))
                    .filter(date => date !== null);
                    
                setBatchDates([...new Set(processedDates)].sort().reverse());
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
            // Fallback to extracting from data if API doesn't exist
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:3004/subjects');
            if (response.data.subjects) {
                setAllSubjects(response.data.subjects);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError('Failed to fetch subjects');
        }
    };

    const fetchTotalLoginCount = async () => {
        try {
            const response = await axios.post('http://localhost:3004/total-login-count',{
                center, batchNo, department: departmentId
            })
            if(response.data){
                console.log(response.data);
                setTotal_login_count(response.data.total_count);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:3004/super-admin-student-track-dashboard';

            const params = new URLSearchParams();
            if (subject) params.append('subject_name', subject);
            if (loginStatus) params.append('loginStatus', loginStatus);
            if (batchNo) params.append('batchNo', batchNo);
            if (center) params.append('center', center);
            if (exam_type) params.append('exam_type', exam_type);
            if (departmentId) params.append('deprtmentId', departmentId);
            if (batchDate) {
                params.append('batchDate', batchDate);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
            console.log("Response:", response.data);
            setData(response.data);
            setTotalPages(Math.ceil(response.data.length / rowsPerPage));

            // Only extract filter options if we haven't loaded them separately
            if (batches.length === 0) {
                const distinctBatches = [...new Set(response.data
                    .map(item => item.batchNo)
                    .filter(batch => batch && batch !== "" && batch !== null && batch !== undefined)
                )];
                setBatches(distinctBatches.sort());
            }

            if (centers.length === 0) {
                const distinctCenters = [...new Set(response.data
                    .map(item => item.center)
                    .filter(center => center && center !== "" && center !== null && center !== undefined)
                )];
                setCenters(distinctCenters.sort());
            }
            
            if (departments.length === 0) {
                const distinctDepartments = [...new Set(response.data
                    .map(item => item.departmentId)
                    .filter(dept => dept && dept !== "" && dept !== null && dept !== undefined)
                )];
                setDepartments(distinctDepartments.sort());
            }
            
            const distinctSubjects = [...new Set(response.data
                .map(item => item.subject_name)
                .filter(subject => subject && subject !== "" && subject !== null && subject !== undefined)
            )];
            setSubjects(distinctSubjects);

            if (batchDates.length === 0) {
                const distinctBatchDates = [...new Set(response.data
                    .filter(item => item.batchdate && item.batchdate !== "invalid date" && item.batchdate !== "0")
                    .map(item => normalizeDateForFilter(item.batchdate))
                    .filter(date => date !== null)
                )];
                setBatchDates(distinctBatchDates.sort().reverse());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("No students found for provided filter parameters. Please check the parameters!");
        }
        setLoading(false);
    };

    // Debounced fetch data
    const debouncedFetchData = useCallback(debounce(fetchData, 300), []);

    useEffect(() => {
        fetchSubjects();
        fetchFilterOptions(); // Try to fetch filter options separately first
        fetchData();
        fetchTotalLoginCount();
    }, []); // Only run once on mount

    useEffect(() => {
        // Use debounced fetch when filters change
        debouncedFetchData();
        fetchTotalLoginCount();
    }, [batchNo, subject, loginStatus, batchDate, center, exam_type, departmentId]);

    useEffect(() => {
        // Set up interval for auto-refresh
        const interval = setInterval(() => {
            fetchData();
            fetchTotalLoginCount();
        }, updateInterval);
        return () => clearInterval(interval);
    }, [updateInterval]);

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
        XLSX.writeFile(workbook, "student_data.xlsx");
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value === 'all' ? data.length : parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const renderPaginationButtons = () => {
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
                                onChange={(e) => setBatchNo(e.target.value)}
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
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <option value="">All Subjects</option>
                                {allSubjects.map((subj) => (
                                    <option key={subj.subjectId} value={subj.subject_name}>
                                        {subj.subject_name}
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
                                onChange={(e) => setLoginStatus(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="loggedin">Logged In</option>
                                <option value="loggedout">Logged Out</option>
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="examStatus" className="dept-form-label">Exam Status:</label>
                            <select
                                className="dept-form-select"
                                id="examStatus"
                                value={exam_type}
                                onChange={(e) => setExam_type(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="shorthand">Short Hand</option>
                                <option value="typewriting">Type Writing</option>
                                <option value="both">Both</option>
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
                                onChange={(e) => setBatchDate(e.target.value)}
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
                                onChange={(e) => setCenter(e.target.value)}
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
                                onChange={(e) => setDepartmentId(e.target.value)}
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
                        <div className="dept-col-md-12 dept-col-sm-12 mb-2 d-flex align-items-center">
                            <button onClick={exportToExcel} className="dept-btn dept-btn-primary dept-export-btn me-3">
                                Export to Excel
                            </button>
                            <div className="dept-total-count-container ms-3">
                                <span className="dept-total-count-label">Total logged in students:</span>
                                <span className="dept-total-count-value">{total_login_count}</span>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : data.length > 0 ? (
                        <div className="dept-table-container">
                            <table className="dept-table dept-table-bordered dept-table-striped dept-table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: '8%' }}>Batch No</th>
                                        <th style={{ width: '8%' }}>Center</th>
                                        <th style={{ width: '12%' }}>Seat No</th>
                                        <th>Login</th>
                                        {exam_type !== 'typewriting' && <th>Trial</th>}
                                        {exam_type !== 'typewriting' && (
                                            <>
                                                <th>Audio Track A</th>
                                                <th>Passage A</th>
                                                <th>Audio Track B</th>
                                                <th>Passage B</th>
                                            </>
                                        )}
                                        {exam_type !== 'shorthand' && (
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
                                            <td className={getCellClass(item, 'loginTime', exam_type)}>{formatDate(item.loginTime)}</td>
                                            {exam_type !== 'typewriting' && <td className={getCellClass(item, 'trial_time', exam_type)}>{formatDate(item.trial_time)}</td>}
                                            {exam_type !== 'typewriting' && (
                                                <>
                                                    <td className={getCellClass(item, 'audio1_time', exam_type)}>{formatDate(item.audio1_time)}</td>
                                                    <td className={getCellClass(item, 'passage1_time', exam_type)}>{formatDate(item.passage1_time)}</td>
                                                    <td className={getCellClass(item, 'audio2_time', exam_type)}>{formatDate(item.audio2_time)}</td>
                                                    <td className={getCellClass(item, 'passage2_time', exam_type)}>{formatDate(item.passage2_time)}</td>
                                                </>
                                            )}
                                            {exam_type !== 'shorthand' && (
                                                <>
                                                    <td className={getCellClass(item, 'trial_passage_time', exam_type)}>{formatDate(item.trial_passage_time)}</td>
                                                    <td className={getCellClass(item, 'typing_passage_time', exam_type)}>{formatDate(item.typing_passage_time)}</td>
                                                </>
                                            )}
                                            <td className={getCellClass(item, 'feedback_time', exam_type)}>{formatDate(item.feedback_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No records found</p>
                    )}
                    {data.length > 0 && rowsPerPage !== 'all' && (
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