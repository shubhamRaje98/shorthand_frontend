// src/components/StudentTable.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentTable.css';
import NavBar from '../navBar/navBar';

const StudentTable = () => {
    const [data, setData] = useState([]);
    const [batchNo, setBatchNo] = useState('');
    const [subject, setSubject] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updateInterval, setUpdateInterval] = useState(100000);
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleString();
    }

    const fetchData = async (url) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(url);
            console.log("response: ", response);
            setData(response.data);
            
            // Extract distinct batch numbers from the data
            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(distinctBatches);
            
            // Extract distinct subjects (if available in the data)
            if (response.data[0] && response.data[0].subject) {
                const distinctSubjects = [...new Set(response.data.map(item => item.subject))];
                setSubjects(distinctSubjects);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Failed to fetch data ' + error);
        }
        setLoading(false);
    };

    const handleFetch = () => {
        let url = 'http://localhost:3000/track-students-on-exam-center-code';
        if (batchNo) {
            url += `/${batchNo}`;
        }
        // Add query parameters for additional filters
        url += `?subject=${subject}&loginStatus=${loginStatus}`;
        fetchData(url);
    };

    useEffect(() => {
        console.log("Setting interval with updateInterval:", updateInterval);
        const interval = setInterval(() => {
            console.log("Fetching data...");
            handleFetch();
        }, updateInterval);

        return () => {
            console.log("Clearing interval...");
            clearInterval(interval);
        };
    }, [updateInterval, batchNo, subject, loginStatus]);

    useEffect(() => {
        handleFetch();
    }, []);

    const getCellClass = (value) => {
        let backgroundClass = '';
        let textColorClass = 'text-white'; // Default to white text

        if (value === true) {
            backgroundClass = 'cell-green';
        } else if (value === false || isNaN(Number(value)) || Number(value) <= 10) {
            backgroundClass = 'cell-red';
        } else if (Number(value) > 10 && Number(value) < 90) {
            backgroundClass = 'cell-yellow';
            textColorClass = 'text-black'; // Black text for yellow background
        } else if (Number(value) >= 90) {
            backgroundClass = 'cell-green';
        }

        return `${backgroundClass} ${textColorClass}`;
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
                                {subjects.map((subj, index) => (
                                    <option key={index} value={subj}>{subj}</option>
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
                                <option value="logged_in">Logged In</option>
                                <option value="logged_out">Logged Out</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-2 d-flex align-items-end">
                            <button onClick={handleFetch} className="btn btn-primary w-100">Fetch Data</button>
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