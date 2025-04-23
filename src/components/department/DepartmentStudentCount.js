import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartmentStudentCount.css'
import DepartmentNavBar from './DepartmentNavBar';
import moment from 'moment-timezone';

const DepartmentStudentCount = () => {
    const [batchNo, setBatchNo] = useState('');
    const [batches, setBatches] = useState([]);
    const [center, setCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [allData, setAllData] = useState([]);
    const [aggregatedSubjects, setAggregatedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
        fetchAllData();

          // Auto-refresh every 30 seconds
          const intervalId = setInterval(() => {
            fetchAllData();
        }, 30000); // 30,000 milliseconds = 30 seconds

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [batchNo, center]);




    useEffect(() => {
        aggregateSubjects();
    }, [allData, center]);

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
            let url = `http://localhost:3000/get-department-batch-student-count`
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

    const aggregateSubjects = () => {
        if (allData.length === 0) return;

        const subjectMap = new Map();

        allData.forEach(item => {
            if (item.subjects && Array.isArray(item.subjects)) {
                item.subjects.forEach(subject => {
                    const subjectId = subject.id.toString();
                    const count = parseInt(subject.count, 10) || 0;
                    const loggedIn = parseInt(subject.loggedIn, 10) || 0;
                    const completed = parseInt(subject.completed, 10) || 0;
                    
                    if (subjectMap.has(subjectId)) {
                        const existingSubject = subjectMap.get(subjectId);
                        existingSubject.count += count;
                        existingSubject.loggedIn += loggedIn;
                        existingSubject.completed += completed;
                    } else {
                        subjectMap.set(subjectId, { 
                            ...subject, 
                            count, 
                            loggedIn, 
                            completed 
                        });
                    }
                });
            }
        });

        const aggregatedSubjectsArray = Array.from(subjectMap.values());
        setAggregatedSubjects(aggregatedSubjectsArray);
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
            <DepartmentNavBar />
            <div className="dsc-container">
                <h2 className="dsc-title">Current Student Details</h2>

                <div className="dsc-filter-container">
                    <div className="dsc-select-wrapper">
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

                    <div className="dsc-select-wrapper">
                        <label htmlFor="center">Select Center Number:</label>
                        <select 
                            id="center" 
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

                {loading && <p className="dsc-loading">Loading...</p>}
                {error && <p className="dsc-error">{error}</p>}

                <div className="dsc-data-table">
                    <h3>{batchNo ? `Batch ${batchNo}` : 'All Batches'} {center ? `- Center ${center}` : ''}</h3>
                    <div className="dsc-table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Center</th>
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
                                        <td>{item.center}</td>
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

                {allData.length > 0 && (
                    <div className="dsc-subjects-section">
                        <h4>Subjects:</h4>
                        <div className="dsc-table-wrapper">
                            <table className="dsc-subjects-table">
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
                                    {(center ? allData[0].subjects : aggregatedSubjects)
                                        .filter(subject => subject.count > 0)
                                        .map((subject, index) => (
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentStudentCount;