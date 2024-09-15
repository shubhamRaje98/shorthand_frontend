import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './StudentTable.css';
import NavBar from '../navBar/navBar';

const StudentTable = () => {
    const [data, setData] = useState([]);
    const [batchNo, setBatchNo] = useState('');
    const [subject, setSubject] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [batchDate, setBatchDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updateInterval, setUpdateInterval] = useState(100000);
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [batchDates, setBatchDates] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const pageSize = 20;

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

    const fetchData = async (pageNum = 1, append = false) => {
        setLoading(true);
        setError('');
        try {
            let url = `http://localhost:3000/track-students-on-exam-center-code?page=${pageNum}&pageSize=${pageSize}`;
            if (batchNo) {
                url += `&batchNo=${batchNo}`;
            }
            
            const params = new URLSearchParams();
            if (subject) params.append('subject_name', subject);
            if (loginStatus) params.append('loginStatus', loginStatus);
            if (batchDate) {
                const date = new Date(batchDate);
                const offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
                params.append('batchDate', date.toISOString().split('T')[0]);
            }
            
            if (params.toString()) {
                url += `&${params.toString()}`;
            }
    
            console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
            console.log("Response:", response.data);

            if (append) {
                setData(prevData => [...prevData, ...response.data]);
            } else {
                setData(response.data);
            }

            setHasMore(response.data.length === pageSize);
    
            // Extract distinct batch numbers from the data
            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort();
            });
            
            // Extract distinct subjects
            const distinctSubjects = [...new Set(response.data.map(item => item.subject_name))];
            setSubjects(distinctSubjects);
    
            // Extract distinct batch dates
            const distinctBatchDates = [...new Set(response.data
                .filter(item => item.batchdate && typeof item.batchdate === 'string')
                .map(item => {
                    const date = new Date(item.batchdate);
                    return date.toISOString().split('T')[0];
                })
            )];
            setBatchDates(prevDates => {
                const newDates = [...new Set([...prevDates, ...distinctBatchDates])];
                return newDates.sort().reverse(); // Sort in descending order
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
        const interval = setInterval(() => fetchData(1), updateInterval);
        return () => clearInterval(interval);
    }, [batchNo, subject, loginStatus, batchDate, updateInterval]);

    const lastElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
                fetchData(page + 1, true);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const getCellClass = (value) => {
        let backgroundClass = '';
        let textColorClass = 'st-text-white';

        if (value === true) {
            backgroundClass = 'st-cell-green';
        } else if (value === false || isNaN(Number(value)) || Number(value) <= 10) {
            backgroundClass = 'st-cell-red';
        } else if (Number(value) > 10 && Number(value) < 90) {
            backgroundClass = 'st-cell-yellow';
            textColorClass = 'st-text-black';
        } else if (Number(value) >= 90) {
            backgroundClass = 'st-cell-green';
        }

        return `${backgroundClass} ${textColorClass}`;
    };

    return (
        <div>
            <NavBar />
            <div className="st-home-container">
                <div className="st-container-fluid">
                    <div className="st-row mb-3">
                        <div className="st-col-md-3 st-col-sm-6 mb-2">
                            <label htmlFor="batchNo" className="st-form-label">Batch Number:</label>
                            <select 
                                className="form-select st-scrollable-dropdown" 
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
                        <div className="st-col-md-3 st-col-sm-6 mb-2">
                            <label htmlFor="subject" className="st-form-label">Subject:</label>
                            <select 
                                className="form-select st-scrollable-dropdown" 
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
                        <div className="st-col-md-3 st-col-sm-6 mb-2">
                            <label htmlFor="loginStatus" className="st-form-label">Login Status:</label>
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
                        <div className="st-col-md-3 st-col-sm-6 mb-2">
                            <label htmlFor="batchDate" className="st-form-label">Batch Date:</label>
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
                    </div>
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {data.length > 0 && (
                        <div className="st-table-container">
                            <table className="st-table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th className="st-th st-th-batch">Batch Number</th>
                                        <th className="st-th">Seat No</th>
                                        <th className="st-th">Login</th>
                                        <th className="st-th">Trial</th>
                                        <th className="st-th st-th-audio">Audio Track A</th>
                                        <th className="st-th st-th-passage">Passage A</th>
                                        <th className="st-th st-th-audio">Audio Track B</th>
                                        <th className="st-th st-th-passage">Passage B</th>
                                        <th className="st-th">Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index} ref={index === data.length - 1 ? lastElementRef : null}>
                                            <td className="st-td">{item.batchNo}</td>
                                            <td className="st-td">{item.student_id}</td>
                                            <td className="st-td">{item.loginTime}</td>
                                            <td className={`st-td ${getCellClass(item.trial)}`}>{formatDateTime(item.trial_time)}</td>
                                            <td className={`st-td ${getCellClass(item.passageA)}`}>{formatDateTime(item.audio1_time)}</td>
                                            <td className="st-td">{formatDateTime(item.passage1_time)}</td>
                                            <td className={`st-td ${getCellClass(item.passageB)}`}>{formatDateTime(item.audio2_time)}</td>
                                            <td className="st-td">{formatDateTime(item.passage2_time)}</td>
                                            <td className="st-td">{formatDateTime(item.feedback_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!loading && data.length === 0 && <p>No records found</p>}
                </div>
            </div>
        </div>
    );
};

export default StudentTable;