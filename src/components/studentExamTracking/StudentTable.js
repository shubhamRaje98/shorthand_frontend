// src/components/StudentTable.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentTable.css'; // Import custom CSS
import NavBar from '../navBar/navBar';

const StudentTable = () => {
    const [data, setData] = useState([]);
    const [examCenterCode, setExamCenterCode] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updateInterval, setUpdateInterval] = useState(100000);
    
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
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Failed to fetch data ' + error);
        }
        setLoading(false);
    };

    const handleFetch = () => {
        let url = 'http://shorthandonlineexam.in:3000/track-students-on-exam-center-code';
        if (examCenterCode && batchNo) {
            url += `/${examCenterCode}/${batchNo}`;
        } else if (examCenterCode) {
            url += `/${examCenterCode}`;
        } else if (batchNo) {
            url += `/0/${batchNo}`;
        }
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
    }, [handleFetch, updateInterval]);

    useEffect(() => {
        handleFetch(); // Initial fetch when component mounts
    }, []);

    const getCellClass = (value) => {
        if(value === true){
            return 'cell-green';
        }
        if(value===false){
            return 'cell-red';
        }
        const numValue = Number(value);
        if (isNaN(numValue)) return 'cell-red';
        if (numValue === 0) return 'cell-red';
        if (numValue > 0 && numValue < 100) {
            return 'cell-yellow';
        }
        if (numValue === 100) return 'cell-green';
        return '';
    };

    return (
        <div>
            <NavBar />
            <div className="home-container">
                <div className="container-fluid">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label htmlFor="examCenterCode" className="form-label">Exam Center Code:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="examCenterCode" 
                                value={examCenterCode} 
                                onChange={(e) => setExamCenterCode(e.target.value)} 
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="batchNo" className="form-label">Batch Number:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="batchNo" 
                                value={batchNo} 
                                onChange={(e) => setBatchNo(e.target.value)} 
                            />
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button onClick={handleFetch} className="btn btn-primary w-100">Fetch Data</button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : data.length > 0 ? (
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Exam Center Code</th>
                                    <th>Batch Number</th>
                                    <th>Seat No</th>
                                    <th>Login</th>
                                    <th>Trial</th>
                                    <th>Audio Track A</th>
                                    <th>Passage A</th>
                                    <th>Audio Track B</th>
                                    <th>Passage B</th>
                                    <th>Feedback</th>
                                    <th>Logout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.center}</td>
                                        <td>{item.batchNo}</td>
                                        <td>{item.student_id}</td>
                                        <td className={getCellClass(item.login)}>{item.loginTime}</td>
                                        <td className={getCellClass(item.trial)}>{formatDateTime(item.trial_time)}</td>
                                        <td className={getCellClass(item.passageA)}>{formatDateTime(item.audio1_time)}</td>
                                        <td>{formatDateTime(item.passage1_time)}</td>
                                        <td className={getCellClass(item.passageB)}>{formatDateTime(item.audio2_time)}</td>
                                        <td>{formatDateTime(item.passage2_time)}</td>
                                        <td>{formatDateTime(item.feedback_time)}</td>
                                        <td>{formatDateTime(item.logout_time)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No records found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentTable;
