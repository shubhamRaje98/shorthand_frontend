import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrentStudentDetails.css';
import NavBar from '../navBar/navBar';
import moment from 'moment-timezone';

const CurrentStudentDetails = () => {
    const [batchNo, setBatchNo] = useState('');
    const [batches, setBatches] = useState([]);
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
        fetchAllData();
    }, [batchNo]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:3000/track-students-on-exam-center-code';
            
            console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort();
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("No students found for provided filter parameters. Please check the parameters!");
        }
        setLoading(false);
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = `http://localhost:3000/get-current-student-details`
            if(batchNo){
                url = `http://localhost:3000/get-current-student-details?batchNo=${batchNo}`
            }
            const response = await axios.get(url, { withCredentials: true });
            if (response.data && response.data.results && Array.isArray(response.data.results)) {
                console.log(response.data)
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
                <div className="batch-select-container">
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

                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}

                <div className="data-table">
                    <h3>{batchNo ? `Batch ${batchNo}` : 'All Batches'}</h3>
                    <table>
                        <thead>
                            <tr>
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
                                    <td>{item.batchNo}</td>
                                    <td>{item.total_students || 0}</td>
                                    <td>{item.logged_in_students || 0}</td>
                                    <td>{item.completed_student || 0}</td>
                                    <td>{formatDateTime(item.start_time)}</td>
                                    <td>{formatDate(item.batchdate)}</td>
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
                                </tr>
                            </thead>
                            <tbody>
                                {allData[0].subjects.filter(subject => subject.count > 0).map((subject, index) => (
                                    <tr key={index}>
                                        <td>{subject.id}</td>
                                        <td>{subject.name}</td>
                                        <td>{subject.count}</td>
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