import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrentStudentDetails.css';
import NavBar from '../navBar/navBar';
import moment from 'moment-timezone';

const CurrentStudentDetails = () => {
    const [batchNo, setBatchNo] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [batches, setBatches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDepartments();
        fetchData();
        fetchAllData();

        // Auto-refresh every 30 seconds
        const intervalId = setInterval(() => {
            fetchAllData();  // Refreshing data every 30 seconds
        }, 30000);  // 30,000 milliseconds = 30 seconds

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [batchNo, departmentId]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://checking.shorthandonlineexam.in/departments', { withCredentials: true });
            if (response.data && Array.isArray(response.data.departments)) {
                setDepartments(response.data.departments);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            setError("Failed to fetch departments. Please try again!");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://checking.shorthandonlineexam.in/center-batches';
            if (departmentId) {
                url += `?departmentId=${departmentId}`;
            }
            
            console.log("Fetching data from URL:", url);
            const response = await axios.get(url, { withCredentials: true });
            
            if (response.data && Array.isArray(response.data)) {
                const distinctBatches = response.data.map(item => item.batchNo);
                setBatches(prevBatches => {
                    const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                    return newBatches.sort((a, b) => a - b);
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch batch numbers. Please try again!");
        }
        setLoading(false);
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = `http://checking.shorthandonlineexam.in/get-current-student-details`;
            const params = new URLSearchParams();
            
            if (batchNo) {
                params.append('batchNo', batchNo);
            }
            if (departmentId) {
                params.append('departmentId', departmentId);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, { withCredentials: true });
            if (response.data && response.data.results && Array.isArray(response.data.results)) {
                console.log(response.data);
                setAllData(response.data.results);
            } else {
                setError('Received unexpected data format from server');
            }
        } catch (error) {
            console.error('Error fetching all data:', error);
            setError(error.response?.data?.message || 'Failed to fetch all data');
        }
        setLoading(false);
    };

    const handleDepartmentChange = (e) => {
        setDepartmentId(e.target.value);
        setBatchNo(''); // Reset batch selection when department changes
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        return moment(dateTimeString, 'hh:mm:ss A').format('hh:mm:ss A');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return moment(dateString, 'DD MM YYYY').format('DD-MM-YYYY');
    };

    return (
        <div>
            <NavBar />
            <div className="current-student-details-container">
                <h2>Current Student Details</h2>
                
                <div className="filters-container">
                    <div className="filter-group">
                        <label htmlFor="departmentId">Select Department:</label>
                        <select 
                            id="departmentId" 
                            value={departmentId} 
                            onChange={handleDepartmentChange}
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="batchNo">Select Batch Number:</label>
                        <select 
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
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}

                <div className="data-table">
                    <h3>
                        {departmentId && departments.find(d => d.departmentId == departmentId) 
                            ? `${departments.find(d => d.departmentId == departmentId).department_name} - ` 
                            : 'All Departments - '}
                        {batchNo ? `Batch ${batchNo}` : 'All Batches'}
                    </h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Batch No</th>
                                <th>Total Students</th>
                                <th>Logged In Students</th>
                                <th>Completed Students</th>
                                <th>Start Time</th>
                                <th>Batch Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.department_name}</td>
                                    <td>{item.batchNo}</td>
                                    <td>{item.total_students || 0}</td>
                                    <td>{item.logged_in_students || 0}</td>
                                    <td>{item.completed_student || 0}</td>
                                    <td>{item.start_time}</td>
                                    <td>{item.batchdate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {batchNo && allData.length > 0 && allData[0].subjects && Array.isArray(allData[0].subjects) && (
                    <div className="subjects-section">
                        <h4>Subjects:</h4>
                        <table className="subjects-table">
                            <thead>
                                <tr>
                                    <th>Subject ID</th>
                                    <th>Subject Name</th>
                                    <th>Count</th>
                                    <th>Logged In</th>
                                    <th>Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allData[0].subjects.filter(subject => subject.count > 0).map((subject, index) => (
                                    <tr key={index}>
                                        <td>{subject.id}</td>
                                        <td>{subject.name}</td>
                                        <td>{subject.count}</td>
                                        <td>{subject.loggedIn}</td>
                                        <td>{subject.completed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentStudentDetails;



