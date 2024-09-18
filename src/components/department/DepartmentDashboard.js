import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartmentDashboard.css';
import NavBar from '../navBar/navBar';
import * as XLSX from 'xlsx';

const DepartmentDashboard = () => {
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
    const [center, setCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [batchDates, setBatchDates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleString();
    }

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

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:3000/track-students-on-department-code';

            const params = new URLSearchParams();
            if (subject) params.append('subject_name', subject);
            if (loginStatus) params.append('loginStatus', loginStatus);
            if (batchNo) params.append('batchNo', batchNo);
            if (center) params.append('center', center);
            if(exam_type) params.append('exam_type', exam_type);
            if (batchDate) {
                params.append('bathdate',batchDate);
            }
            
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

            const distinctCenters = [...new Set(response.data.map(item => item.center))];
            setCenters(prevCenters => {
                const newCenters = [...new Set([...prevCenters, ...distinctCenters])];
                return newCenters.sort();
            });
            
            const distinctSubjects = [...new Set(response.data.map(item => item.subject_name))];
            setSubjects(distinctSubjects);
    
            const distinctBatchDates = [...new Set(response.data
                .filter(item => item.batchdate && typeof item.batchdate === 'string')
                .map(item => {
                    const date = new Date(item.batchdate);
                    return date.toISOString().split('T')[0];
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
        fetchData();
        const interval = setInterval(fetchData, updateInterval);
        return () => clearInterval(interval);
    }, [batchNo, subject, loginStatus, batchDate, updateInterval, center, exam_type]);

    const isValidData = (value) => {
        return value && value !== "invalid date" && value !== "0" && !isNaN(new Date(value).getTime());
    };

    const getCellClass = (item, field) => {
        const stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
        const currentStageIndex = stages.indexOf(field);
        
        if (currentStageIndex === -1) return '';
        
        if (isValidData(item[field])) {
            return 'dept-cell-green dept-text-white';
        } else if (currentStageIndex > 0 && isValidData(item[stages[currentStageIndex - 1]])) {
            return 'dept-cell-yellow dept-text-black';
        } else {
            return 'dept-cell-red dept-text-white';
        }
    };

    const exportToExcel = () => {
        const visibleColumns = [
            { key: 'batchNo', header: 'Batch Number' },
            { key: 'center', header: 'Center' },
            { key: 'student_id', header: 'Seat No' },
            { key: 'loginTime', header: 'Login' },
            ...(exam_type !== 'typewriting' ? [{ key: 'trial_time', header: 'Trial' }] : []),
            ...(exam_type !== 'typewriting' ? [
                { key: 'audio1_time', header: 'Audio Track A' },
                { key: 'passage1_time', header: 'Passage A' },
            ] : []),
            ...(exam_type !== 'shorthand' ? [
                { key: 'audio2_time', header: 'Audio Track B' },
                { key: 'passage2_time', header: 'Passage B' },
            ] : []),
        ];
         const exportData = data.map(item => {
            const newItem = {};
            visibleColumns.forEach(col => {
                newItem[col.header] = item[col.key];
            });
            return newItem;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students Data");
        XLSX.writeFile(wb, "students_data.xlsx");
    };

    // Pagination
    const indexOfLastItem = itemsPerPage === 'all' ? data.length : currentPage * Number(itemsPerPage);
    const indexOfFirstItem = itemsPerPage === 'all' ? 0 : indexOfLastItem - Number(itemsPerPage);
    const currentItems = itemsPerPage === 'all' ? data : data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / (itemsPerPage === 'all' ? data.length : Number(itemsPerPage))); i++) {
        pageNumbers.push(i);
    }

    const renderPaginationButtons = () => {
        const totalPages = pageNumbers.length;
        const maxButtonsToShow = 5;
    
        if (totalPages <= maxButtonsToShow) {
            return pageNumbers.map(number => (
                <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                    {number}
                </button>
            ));
        }
    
        let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
        let endPage = startPage + maxButtonsToShow - 1;
    
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }
    
        const buttons = [];
    
        if (startPage > 1) {
            buttons.push(
                <button key={1} onClick={() => paginate(1)}>1</button>,
                <span key="ellipsis1">...</span>
            );
        }
    
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button key={i} onClick={() => paginate(i)} className={currentPage === i ? 'active' : ''}>
                    {i}
                </button>
            );
        }
    
        if (endPage < totalPages) {
            buttons.push(
                <span key="ellipsis2">...</span>,
                <button key={totalPages} onClick={() => paginate(totalPages)}>{totalPages}</button>
            );
        }
    
        return buttons;
    };

    return (
        <div>
            {/* <NavBar /> */}
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
                            <label htmlFor="itemsPerPage" className="dept-form-label">Rows per page:</label>
                            <select 
                                className="dept-form-select" 
                                id="itemsPerPage" 
                                value={itemsPerPage} 
                                onChange={(e) => {
                                    setItemsPerPage(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <button onClick={exportToExcel} className="dept-btn dept-btn-primary dept-export-btn">
                                Export to Excel
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : data.length > 0 ? (
                        <div>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="batch-number-column">{item.batchNo}</td>
                                                <td>{item.center}</td>
                                                <td>{item.student_id}</td>
                                                <td className={getCellClass(item, 'loginTime')}>{formatDateTime(item.loginTime)}</td>
                                                {exam_type !== 'typewriting' && <td className={getCellClass(item, 'trial_time')}>{formatDateTime(item.trial_time)}</td>}
                                                {exam_type !== 'typewriting' && (
                                                    <>
                                                        <td className={getCellClass(item, 'audio1_time')}>{formatDateTime(item.audio1_time)}</td>
                                                        <td className={getCellClass(item, 'passage1_time')}>{formatDateTime(item.passage1_time)}</td>
                                                    </>
                                                )}
                                                {exam_type !== 'shorthand' && (
                                                    <>
                                                        <td className={getCellClass(item, 'audio2_time')}>{formatDateTime(item.audio2_time)}</td>
                                                        <td className={getCellClass(item, 'passage2_time')}>{formatDateTime(item.passage2_time)}</td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p>No records found</p>
                    )}
                    {itemsPerPage !== 'all' && (
                        <div className="pagination">
                            {renderPaginationButtons()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentDashboard;