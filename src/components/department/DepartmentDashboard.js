import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartmentDashboard.css';
import NavBar from '../navBar/navBar';

const DepartmentDashboard = () => {
    const [data, setData] = useState([]);
    const [batchNo, setBatchNo] = useState('');
    const [subject, setSubject] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
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
    }, [batchNo, subject, loginStatus, batchDate, updateInterval, center]);

    const getCellClass = (value) => {
        let backgroundClass = '';
        let textColorClass = 'dept-text-white';
    
        if (value === true) {
            backgroundClass = 'dept-cell-green';
        } else if (value === false || isNaN(Number(value)) || Number(value) <= 10) {
            backgroundClass = 'dept-cell-red';
        } else if (Number(value) > 10 && Number(value) < 90) {
            backgroundClass = 'dept-cell-yellow';
            textColorClass = 'dept-text-black';
        } else if (Number(value) >= 90) {
            backgroundClass = 'dept-cell-green';
        }
    
        return `${backgroundClass} ${textColorClass}`;
    };

    return (
        <div>
            <NavBar />
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
                                            <td className="batch-number-column">{item.batchNo}</td>
                                            <td>{item.center}</td>
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

export default DepartmentDashboard;