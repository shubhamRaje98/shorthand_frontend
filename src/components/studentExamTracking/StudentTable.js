import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentTable.css';
import NavBar from '../navBar/navBar';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';

const StudentTable = () => {
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
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [batchDates, setBatchDates] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleString();
    }

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

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'https://www.shorthandonlineexam.in/track-students-on-exam-center-code';
            if (batchNo) {
                url += `/${batchNo}`;
            }
            
            const params = new URLSearchParams();
            if (subject) params.append('subject_name', subject);
            if (loginStatus) params.append('loginStatus', loginStatus);
            if (exam_type) params.append('exam_type', exam_type);
            if (batchDate) params.append('batchDate', batchDate);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
            console.log("Response:", response.data);
            setData(response.data);

            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort();
            });
            
            const distinctSubjects = [...new Set(response.data.map(item => item.subject_name))];
            setSubjects(distinctSubjects);

            const distinctBatchDates = [...new Set(response.data
                .filter(item => item.batchdate)
                .map(item => item.batchdate)
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
        fetchData();
        const interval = setInterval(fetchData, updateInterval);
        return () => clearInterval(interval);
    }, [batchNo, subject, loginStatus, batchDate, updateInterval, exam_type]);

    const isValidData = (value) => {
        return value && value !== "invalid date" && value !== "0";
    };

    const getCellClass = (item, field) => {
        const stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time',  'trial_passage_time', 'typing_passage_time', 'feedback_time'];
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

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            "Batch Number": item.batchNo,
            "Seat No": item.student_id,
            "Login": formatDate(item.loginTime),
            "Trial": formatDate(item.trial_time),
            "Audio Track A": formatDate(item.audio1_time),
            "Passage A": formatDate(item.passage1_time),
            "typing trial": formatDate(item.trial_passage_time),
            "Typing passage": formatDate(item.typing_passage_time),
            "Feedback": formatDate(item.feedback_time)
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
        XLSX.writeFile(workbook, "student_data.xlsx");
    };

    // Pagination logic
    const indexOfLastRow = rowsPerPage === 'all' ? data.length : currentPage * Number(rowsPerPage);
    const indexOfFirstRow = rowsPerPage === 'all' ? 0 : indexOfLastRow - Number(rowsPerPage);
    const currentRows = rowsPerPage === 'all' ? data : data.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / (rowsPerPage === 'all' ? 1 : Number(rowsPerPage))); i++) {
        pageNumbers.push(i);
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
    const renderPaginationItems = () => {
        const totalPages = pageNumbers.length;
        const currentPageNumber = Math.min(totalPages, Math.max(1, currentPage));
        
        let items = [];
        
        items.push(
            <li key="first" className={`page-item ${currentPageNumber === 1 ? 'disabled' : ''}`}>
                <button onClick={() => paginate(1)} className="page-link">&laquo;</button>
            </li>
        );
        
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <li key={i} className={`page-item ${currentPageNumber === i ? 'active' : ''}`}>
                        <button onClick={() => paginate(i)} className="page-link">{i}</button>
                    </li>
                );
            }
        } else {
            if (currentPageNumber <= 3) {
                for (let i = 1; i <= 5; i++) {
                    items.push(
                        <li key={i} className={`page-item ${currentPageNumber === i ? 'active' : ''}`}>
                            <button onClick={() => paginate(i)} className="page-link">{i}</button>
                        </li>
                    );
                }
                items.push(<li key="ellipsis1" className="page-item disabled"><span className="page-link">...</span></li>);
            } else if (currentPageNumber >= totalPages - 2) {
                items.push(<li key="ellipsis2" className="page-item disabled"><span className="page-link">...</span></li>);
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    items.push(
                        <li key={i} className={`page-item ${currentPageNumber === i ? 'active' : ''}`}>
                            <button onClick={() => paginate(i)} className="page-link">{i}</button>
                        </li>
                    );
                }
            } else {
                items.push(<li key="ellipsis3" className="page-item disabled"><span className="page-link">...</span></li>);
                for (let i = currentPageNumber - 1; i <= currentPageNumber + 1; i++) {
                    items.push(
                        <li key={i} className={`page-item ${currentPageNumber === i ? 'active' : ''}`}>
                            <button onClick={() => paginate(i)} className="page-link">{i}</button>
                        </li>
                    );
                }
                items.push(<li key="ellipsis4" className="page-item disabled"><span className="page-link">...</span></li>);
            }
        }
        
        items.push(
            <li key="last" className={`page-item ${currentPageNumber === totalPages ? 'disabled' : ''}`}>
                <button onClick={() => paginate(totalPages)} className="page-link">&raquo;</button>
            </li>
        );
        
        return items;
    };

    return (
        <div>
            <NavBar />
            <div className="home-container">
                <div className="container-fluid">
                    <div className="row mb-3">
                        <div className="col-md-3 col-sm-6 mb-2">
                            <label htmlFor="batchNo" className="form-label">Batch Number:</label>
                            <select 
                                className="form-select scrollable-dropdown" 
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
                        <div className="col-md-3 col-sm-6 mb-2">
                            <label htmlFor="subject" className="form-label">Subject:</label>
                            <select 
                                className="form-select scrollable-dropdown" 
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
                        <div className="col-md-3 col-sm-6 mb-2">
                            <label htmlFor="loginStatus" className="form-label">Login Status:</label>
                            <select 
                                className="form-select" 
                                id="loginStatus" 
                                value={loginStatus} 
                                onChange={(e) => setLoginStatus(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="loggedin">Logged In</option>
                                <option value="loggedout">Logged Out</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-2">
                            <label htmlFor="examStatus" className="form-label">Exam Status:</label>
                            <select 
                                className="form-select" 
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
                    <div className="row mb-3">
                        <div className="col-md-3 col-sm-6 mb-2">
                            <label htmlFor="batchDate" className="form-label">Batch Date:</label>
                            <select 
                                className="form-select" 
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
                        <div className="col-md-3 col-sm-6 mb-2">
                            <label htmlFor="rowsPerPage" className="form-label">Rows per page:</label>
                            <select 
                                className="form-select" 
                                id="rowsPerPage" 
                                value={rowsPerPage} 
                                onChange={(e) => {
                                    setRowsPerPage(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-2">
                            <button className="btn btn-primary mt-4" onClick={exportToExcel}>Export to Excel</button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : data.length > 0 ? (
                        <>
                            <div className="table-container">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Batch Number</th>
                                            <th>Seat No</th>
                                            <th>Login</th>
                                            {exam_type !== 'typewriting' && <th>Trial</th>}
                                            {exam_type !== 'typewriting' && <th>Audio Track A</th>}
                                            {exam_type !== 'typewriting' && <th>Passage A</th>}
                                            {exam_type !== 'shorthand' && <th>Trial Typing</th>}
                                            {exam_type !== 'shorthand' && <th>Typing Test</th>}
                                            <th>Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRows.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.batchNo}</td>
                                                <td>{item.student_id}</td>
                                                <td className={getCellClass(item, 'loginTime')}>{formatDate(item.loginTime)}</td>
                                                {exam_type !== 'typewriting' && <td className={getCellClass(item, 'trial_time')}>{formatDate(item.trial_time)}</td>}
                                                {exam_type !== 'typewriting' && <td className={getCellClass(item, 'audio1_time')}>{formatDate(item.audio1_time)}</td>}
                                                {exam_type !== 'typewriting' && <td className={getCellClass(item, 'passage1_time')}>{formatDate(item.passage1_time)}</td>}
                                                {exam_type !== 'shorthand' && <td className={getCellClass(item, 'trial_passage_time')}>{formatDate(item.trial_passage_time)}</td>}
                                                {exam_type !== 'shorthand' && <td className={getCellClass(item, 'typing_passage_time')}>{formatDate(item.typing_passage_time)}</td>}
                                                <td className={getCellClass(item, 'feedback_time')}>{formatDate(item.feedback_time)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p>No records found</p>
                    )}
                    {data.length > rowsPerPage && rowsPerPage !== 'all' && (
                        <nav>
                            <ul className="pagination justify-content-center">
                                {renderPaginationItems()}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentTable;