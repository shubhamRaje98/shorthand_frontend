import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../navBar/navBar';
import * as XLSX from 'xlsx';
import './SuperAdminTrackDashboard.css'
import moment from 'moment-timezone'

// Importing the utility functions
const isValidData = (value) => {
    return value && value !== "invalid date" && value !== "0" && !isNaN(new Date(value).getTime());
};


const getCellClass = (item, field) => {
    const stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'trial_passage_time', 'typing_passage_time', 'feedback_time'];
    const currentStageIndex = stages.indexOf(field);
    
    if (currentStageIndex === -1) return '';
    
    if (field === 'loginTime' || field === 'feedback_time') {
        return isValidData(item[field]) ? 'dept-cell-green dept-text-white' : 'dept-cell-red dept-text-white';
    }

    if (isValidData(item[field])) {
        // Check if it's the last field or if the next field has valid data
        if (currentStageIndex === stages.length - 1 || isValidData(item[stages[currentStageIndex + 1]])) {
            return 'dept-cell-green dept-text-white';
        } else if (currentStageIndex > 0 && currentStageIndex < stages.length - 1) {
            // Check if the previous cell is green and the next cell is red
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';

        // Parse the dateTimeString and convert it to Asia/Kolkata timezone
        const dateTime = moment(dateTimeString).tz('Asia/Kolkata');
    
        // Format the date as dd-mm-yy hh:mm:ss
        return dateTime.format('DD-MM-YY hh:mm:ss A');
    }

    const formatDate = (dateString) => {
        if (!dateString || dateString === "invalid date" || dateString === "0") {
            return "";
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString; // Return original string if it's not a valid date
        }
        
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    const fetchSubjects = async () => {
        try {
            const response = await axios.get('https://www.shorthandonlineexam.in/subjects');
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
        const response = await axios.post('https://www.shorthandonlineexam.in/total-login-count',{
            center,batchNo,department:departmentId
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
            let url = 'https://www.shorthandonlineexam.in/super-admin-student-track-dashboard';

            const params = new URLSearchParams();
            if (subject) params.append('subject_name', subject);
            if (loginStatus) params.append('loginStatus', loginStatus);
            if (batchNo) params.append('batchNo', batchNo);
            if (center) params.append('center', center);
            if (exam_type) params.append('exam_type', exam_type);
            if (departmentId) params.append('deprtmentId', departmentId);
            if (batchDate) {
                params.append('batchDate',batchDate);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
            console.log("Response:", response.data);
            setData(response.data);
            setTotalPages(Math.ceil(response.data.length / rowsPerPage));

            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort();
            });

            const distinctCenters = [...new Set(response.data.map(item => item.center))];
            setCenters(prevCenters => {
                const newCenters = [...new Set([...prevCenters, ...distinctCenters])];
                return newCenters.sort();
            });
            const distinctDepartments = [...new Set(response.data.map(item => item.departmentId))];
            setDepartments(prevDepartments => {
                const newDepartments = [...new Set([...prevDepartments, ...distinctDepartments])];
                return newDepartments.sort();
            });
            const distinctSubjects = [...new Set(response.data.map(item => item.subject_name))];
            setSubjects(distinctSubjects);

            const distinctBatchDates = [...new Set(response.data
                .filter(item => item.batchdate && typeof item.batchdate === 'string')
                .map(item => {
                   
                    return item.batchdate
                })
            )];
            setBatchDates(prevDates => {
                const newDates = [...new Set([...prevDates, ...distinctBatchDates])];
                return newDates.sort().reverse();
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("No students found for provided filter parameters. Please check the parameters!");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubjects();
        fetchTotalLoginCount();
        fetchData();
        const interval = setInterval(fetchData, updateInterval);
        return () => clearInterval(interval);
    }, [batchNo, subject, loginStatus, batchDate, updateInterval, center, exam_type, departmentId]);

    useEffect(() => {
        setTotalPages(Math.ceil(data.length / rowsPerPage));
        setCurrentPage(1);
    }, [data, rowsPerPage]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            "Batch Number": item.batchNo,
            "Seat No": item.student_id,
            "Login": formatDate(item.loginTime),
            "Trial": formatDate(item.trial_time),
            "Audio Track A": formatDate(item.audio1_time),
            "Passage A": formatDate(item.passage1_time),
            "Trial Passage": formatDate(item.typing_passage_time),
            "Typing Passage": formatDate(item.trial_passage_time),
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
                            <label htmlFor="loginStatus" className="dept-form-label">Exam Status:</label>
                            <select
                                className="dept-form-select"
                                id="loginStatus"
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
                                    <option key={index} value={date}>{date}</option>
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
                                defaultValue="all"
                            >
                                <option value="all">All</option>
                                <option value="5">5</option>
                                {/* <option value="10">10</option> */}
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                
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
                                        <th>Batch Number</th>
                                        <th>Center</th>
                                        <th>Seat No</th>
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
                        <td className={getCellClass(item, 'loginTime')}>{formatDate(item.loginTime)}</td>
                        {exam_type !== 'typewriting' && <td className={getCellClass(item, 'trial_time')}>{formatDate(item.trial_time)}</td>}
                        {exam_type !== 'typewriting' && (
                            <>
                                <td className={getCellClass(item, 'audio1_time')}>{formatDate(item.audio1_time)}</td>
                                <td className={getCellClass(item, 'passage1_time')}>{formatDate(item.passage1_time)}</td>
                            </>
                        )}
                        {exam_type !== 'shorthand' && (
                            <>
                                <td className={getCellClass(item, 'trial_passage_time')}>{formatDate(item.trial_passage_time)}</td>
                                <td className={getCellClass(item, 'typing_passage_time')}>{formatDate(item.typing_passage_time)}</td>
                            </>
                        )}
                        <td className={getCellClass(item, 'feedback_time')}>{formatDate(item.feedback_time)}</td>
                    </tr>
                ))}
            </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No records found</p>
                    )}
                    {data.length > 0 && (
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