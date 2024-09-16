import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentTable.css';
import NavBar from '../navBar/navBar';
import * as XLSX from 'xlsx';

const StudentTable = () => {
    const [data, setData] = useState([]);
    const [batchNo, setBatchNo] = useState('');
    const [subject, setSubject] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [exam_type , setExam_type] = useState('');
    const [batchDate, setBatchDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updateInterval, setUpdateInterval] = useState(100000);
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [batchDates, setBatchDates] = useState([]);

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
            let url = 'http://localhost:3000/track-students-on-exam-center-code';
            if (batchNo) {
                url += `/${batchNo}`;
            }
            
            const params = new URLSearchParams();
            if (subject) params.append('subject_name', subject);
            if (loginStatus) params.append('loginStatus', loginStatus);
            if (exam_type) params.append('exam_type',exam_type);
            if (batchDate) {
                const date = new Date(batchDate);
                const offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
                params.append('batchDate', date.toISOString().split('T')[0]);
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
    }, [batchNo, subject, loginStatus, batchDate, updateInterval , exam_type]);

    const getCellClass = (value) => {
        let backgroundClass = '';
        let textColorClass = 'text-white';

        if (value === true) {
            backgroundClass = 'cell-green';
        } else if (value === false || isNaN(Number(value)) || Number(value) <= 10) {
            backgroundClass = 'cell-red';
        } else if (Number(value) > 10 && Number(value) < 90) {
            backgroundClass = 'cell-yellow';
            textColorClass = 'text-black';
        } else if (Number(value) >= 90) {
            backgroundClass = 'cell-green';
        }

        return `${backgroundClass} ${textColorClass}`;
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            "Batch Number": item.batchNo,
            "Seat No": item.student_id,
            "Login": item.loginTime,
            "Trial": formatDateTime(item.trial_time),
            "Audio Track A": formatDateTime(item.audio1_time),
            "Passage A": formatDateTime(item.passage1_time),
            "Audio Track B": formatDateTime(item.audio2_time),
            "Passage B": formatDateTime(item.passage2_time),
            "Feedback": formatDateTime(item.feedback_time)
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
        XLSX.writeFile(workbook, "student_data.xlsx");
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
                            <button className="btn btn-primary mt-4" onClick={exportToExcel}>Export to Excel</button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : data.length > 0 ? (
                        <div className="table-container">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Batch Number</th>
                                        <th>Seat No</th>
                                        <th>Login</th>
                                        <th>Trial</th>
                                        <th>Audio Track A</th>
                                        <th>Passage A</th>
                                        <th>Audio Track B</th>
                                        <th>Passage B</th>
                                        <th>Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.batchNo}</td>
                                            <td>{item.student_id}</td>
                                            <td>{item.loginTime}</td>
                                            <td className={getCellClass(item.trial)}>{formatDateTime(item.trial_time)}</td>
                                            <td className={getCellClass(item.passageA)}>{formatDateTime(item.audio1_time)}</td>
                                            <td>{formatDateTime(item.passage1_time)}</td>
                                            <td className={getCellClass(item.passageB)}>{formatDateTime(item.audio2_time)}</td>
                                            <td>{formatDateTime(item.passage2_time)}</td>
                                            <td>{formatDateTime(item.feedback_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No records found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentTable;