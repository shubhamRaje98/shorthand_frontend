import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SuperAdminStudentCount.css'
import SuperAdminNavbar from './SuperAdminNavbar';
import moment from 'moment-timezone';

const SuperAdminCount = () => {
    const [batchNo, setBatchNo] = useState('');
    const [batches, setBatches] = useState([]);
    const [center, setCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
        fetchAllData();
    }, [batchNo, center]);

   
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:3000/track-students-on-department-code';
            
            console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
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
            let url = `http://localhost:3000/get-super-admin-student-count`
            if(batchNo || center){
                url += '?';
                if(batchNo) url += `batchNo=${batchNo}&`;
                if(center) url += `center=${center}&`;
                url = url.slice(0, -1);
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
        <div className="sac-page">
            <SuperAdminNavbar />
            <div className="sac-container">
                <h2 className="sac-title">Current Student Details</h2>

                <div className="sac-filter-container">
                    <div className="sac-select-wrapper">
                        <label htmlFor="batchNo" className="sac-label">Select Batch Number:</label>
                        <select 
                            id="batchNo" 
                            className="sac-select"
                            value={batchNo} 
                            onChange={(e) => setBatchNo(e.target.value)}
                        >
                            <option value="">All Batches</option>
                            {batches.map((batch, index) => (
                                <option key={index} value={batch}>{batch}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sac-select-wrapper">
                        <label htmlFor="center" className="sac-label">Select Center Number:</label>
                        <select 
                            id="center" 
                            className="sac-select"
                            value={center} 
                            onChange={(e) => setCenter(e.target.value)}
                        >
                            <option value="">All Centers</option>
                            {centers.map((center, index) => (
                                <option key={index} value={center}>{center}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && <p className="sac-loading">Loading...</p>}
                {error && <p className="sac-error">{error}</p>}

                <div className="sac-data-table">
                    <h3 className="sac-subtitle">{batchNo ? `Batch ${batchNo}` : 'All Batches'} {center ? `- Center ${center}` : ''}</h3>
                    <div className="sac-table-wrapper">
                        <table className="sac-table">
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
                </div>

                {(batchNo || center) && allData.length > 0 && allData[0].subjects && Array.isArray(allData[0].subjects) && (
                    <div className="sac-subjects-section">
                        <h4 className="sac-subtitle">Subjects:</h4>
                        <div className="sac-table-wrapper">
                            <table className="sac-table sac-subjects-table">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminCount;