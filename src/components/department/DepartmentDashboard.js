import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './DepartmentDashboard.css';
import DepartmentNavBar from './DepartmentNavBar';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';

// Importing the utility functions
const isValidData = (value) => {
    return value && value !== "invalid date" && value !== "0" && !isNaN(new Date(value).getTime());
};

const getCellClass = (item, field, exam_type) => {
    let stages;
    if (exam_type === 'shorthand') {
        stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'feedback_time'];
    } else if (exam_type === 'typewriting') {
        stages = ['loginTime', 'trial_passage_time', 'typing_passage_time', 'feedback_time'];
    } else {
        stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'feedback_time'];
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

const DepartmentDashboard = () => {
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

    const normalizeDateForFilter = (dateString) => {
        if (!dateString || dateString === "invalid date" || dateString === "0") {
            return null;
        }
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return null;
            }
            return date.toISOString().split('T')[0];
        } catch (error) {
            return null;
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
            const response = await axios.post('http://localhost:3000/track-students-on-department-code', {}, { withCredentials: true });
            
            if (response.data && response.data.length > 0) {
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

                const uniqueSubjects = [...new Set(response.data
                    .map(item => item.subject_name)
                    .filter(subject => subject && subject !== "" && subject !== null && subject !== undefined)
                )];
                setSubjects(uniqueSubjects);

                const uniqueBatchDates = [...new Set(response.data
                    .filter(item => item.batchdate && item.batchdate !== "invalid date" && item.batchdate !== "0")
                    .map(item => normalizeDateForFilter(item.batchdate))
                    .filter(date => date !== null)
                )].sort().reverse();
                setBatchDates(uniqueBatchDates);
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:3000/subjects');
            if (response.data.subjects) {
                setAllSubjects(response.data.subjects);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError('Failed to fetch subjects');
        }
    };

    // Updated fetchTotalLoginCount with ALL filters for department
    const fetchTotalLoginCount = async (filters = currentFilters) => {
        try {
            const requestBody = {
                center: filters.center,
                batchNo: filters.batchNo,
                subject_name: filters.subject,
                loginStatus: filters.loginStatus,
                exam_type: filters.exam_type,
                batchDate: filters.batchDate
            };

            console.log('Fetching department login count with filters:', requestBody);

            const response = await axios.post('http://localhost:3000/total-login-count', requestBody, { withCredentials: true });
            
            if (response.data) {
                setTotal_login_count(response.data.total_count);
            }
        } catch (error) {
            console.log('Error fetching login count:', error);
            setTotal_login_count(0);
        }
    };

    // Updated fetchData function that sends filters to backend
    const fetchData = async (preserveFilters = false) => {
        setLoading(true);
        setError('');
        
        // Use current state values or preserved filters
        const filters = preserveFilters ? currentFilters : {
            subject,
            loginStatus,
            batchNo,
            center,
            exam_type,
            batchDate
        };

        try {
            // Build query parameters for GET request
            const params = new URLSearchParams();
            
            if (filters.subject) params.append('subject_name', filters.subject);
            if (filters.loginStatus) params.append('loginStatus', filters.loginStatus);
            if (filters.batchNo) params.append('batchNo', filters.batchNo);
            if (filters.center) params.append('center', filters.center);
            if (filters.exam_type) params.append('exam_type', filters.exam_type);
            if (filters.batchDate) params.append('batchDate', filters.batchDate);

            let url = 'http://localhost:3000/track-students-on-department-code';
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log("Fetching department filtered data from URL:", url);
            
            const response = await axios.post(url, {}, { withCredentials: true });
            console.log("Department filtered response:", response.data);
            
            setData(response.data);
            setTotalPages(Math.ceil(response.data.length / rowsPerPage));

            // Update current filters for refresh
            if (!preserveFilters) {
                setCurrentFilters(filters);
            }

        } catch (error) {
            console.error("Error fetching department filtered data:", error);
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

    // Debounced fetch data for filter changes
    const debouncedFetchData = useCallback(debounce(() => fetchData(false), 500), []);

    // Refresh function that preserves filters
    const refreshData = useCallback(() => {
        console.log("Refreshing department data with current filters:", currentFilters);
        fetchData(true); // Preserve current filters
        fetchTotalLoginCount(currentFilters);
    }, [currentFilters]);

    // Filter change handlers
    const handleFilterChange = (filterName, value) => {
        console.log(`Department filter changed: ${filterName} = ${value}`);
        
        const newFilters = { ...currentFilters, [filterName]: value };
        setCurrentFilters(newFilters);
        
        // Update individual state
        switch (filterName) {
            case 'batchNo': setBatchNo(value); break;
            case 'subject': setSubject(value); break;
            case 'loginStatus': setLoginStatus(value); break;
            case 'exam_type': setExam_type(value); break;
            case 'batchDate': setBatchDate(value); break;
            case 'center': setCenter(value); break;
        }
        
        // Reset to first page when filters change
        setCurrentPage(1);
        
        // Trigger debounced fetch with new filters
        setTimeout(() => {
            fetchData(false);
            fetchTotalLoginCount(newFilters);
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
        setCurrentFilters({});
        setCurrentPage(1);
        
        // Fetch data without any filters
        setTimeout(() => {
            fetchData(false);
            fetchTotalLoginCount({});
        }, 100);
    };

    useEffect(() => {
        fetchSubjects();
        fetchFilterOptions();
        setTimeout(() => {
            fetchData(false);
            fetchTotalLoginCount();
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
            "Seat No": item.student_id,
            "Student Name": item.fullname,
            "Subject": item.subject_name,
            "Batch Date": formatDateForDisplay(item.batchdate),
            "Login": formatDate(item.loginTime),
            "Trial": formatDate(item.trial_time),
            "Audio Track A": formatDate(item.audio1_time),
            "Passage A": formatDate(item.passage1_time),
            "Trial Typing": formatDate(item.trial_passage_time),
            "Typing Passage": formatDate(item.typing_passage_time),
            "Feedback": formatDate(item.feedback_time)
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
        XLSX.writeFile(workbook, `department_student_data_${new Date().toISOString().split('T')[0]}.xlsx`);
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
            <DepartmentNavBar />
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
                                onChange={(e) => handleFilterChange('loginStatus', e.target.value)}
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
                                onChange={(e) => handleFilterChange('exam_type', e.target.value)}
                            >
                        
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
                            <div className="dept-total-count-container ms-3 mb-2">
                                <span className="dept-total-count-label">Total students: {data.length} | </span>
                                <span className="dept-total-count-label">Total logged in: </span>
                                <span className="dept-total-count-value">{total_login_count}</span>
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
                                        {exam_type !== 'typewriting' && <th>Trial</th>}
                                        {exam_type !== 'typewriting' && (
                                            <>
                                                <th>Audio Track A</th>
                                                <th>Passage A</th>
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
};

export default DepartmentDashboard;