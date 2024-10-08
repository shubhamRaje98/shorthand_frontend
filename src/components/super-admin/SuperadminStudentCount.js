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
    const [departmentId, setDepartmentId] = useState('');
    const [departments, setDepartments] = useState([]);
    const [aggregatedSubjects, setAggregatedSubjects] = useState([]);
    const [batchTotals, setBatchTotals] = useState({});

    useEffect(() => {
        fetchData();
        fetchAllData();

        // Set interval for fetching data every 30 seconds
        const intervalId = setInterval(() => {
            fetchAllData();
        }, 30000); // 30,000 milliseconds = 30 seconds

        // Cleanup on component unmount
        return () => clearInterval(intervalId);
    }, [batchNo, center, departmentId]);

    useEffect(() => {
        if (allData.length > 0 && !center) {
            aggregateSubjects();
            calculateBatchTotals();
        }
    }, [allData, center, departmentId]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'https://www.shorthandonlineexam.in/super-admin-student-track-dashboard';
            
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
            const distinctDepartments = [...new Set(response.data.map(item => item.departmentId))];
            setDepartments(prevDepartments => {
                const newDepartments = [...new Set([...prevDepartments, ...distinctDepartments])];
                return newDepartments.sort();
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
            let url = `https://www.shorthandonlineexam.in/get-super-admin-student-count`
            if(batchNo || center || departmentId){
                url += '?';
                if(batchNo) url += `batchNo=${batchNo}&`;
                if(center) url += `center=${center}&`;
                if(departmentId) url += `departmentId=${departmentId}&`;
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
        const subjectMap = new Map();

        allData.forEach(item => {
            if (item.subjects && Array.isArray(item.subjects)) {
                item.subjects.forEach(subject => {
                    if (subjectMap.has(subject.id)) {
                        const existingSubject = subjectMap.get(subject.id);
                        existingSubject.count += parseInt(subject.count) || 0;
                        existingSubject.loggedIn += parseInt(subject.loggedIn) || 0;
                        existingSubject.completed += parseInt(subject.completed) || 0;
                    } else {
                        subjectMap.set(subject.id, {
                            ...subject,
                            count: parseInt(subject.count) || 0,
                            loggedIn: parseInt(subject.loggedIn) || 0,
                            completed: parseInt(subject.completed) || 0
                        });
                    }
                });
            }
        });

        setAggregatedSubjects(Array.from(subjectMap.values()));
    };

    const calculateBatchTotals = () => {
        const totals = {};
        allData.forEach(item => {
            if (!totals[item.batchNo]) {
                totals[item.batchNo] = {
                    totalStudents: 0,
                    loggedInStudents: 0,
                    completedStudents: 0
                };
            }
            totals[item.batchNo].totalStudents += parseInt(item.total_students) || 0;
            totals[item.batchNo].loggedInStudents += parseInt(item.logged_in_students) || 0;
            totals[item.batchNo].completedStudents += parseInt(item.completed_student) || 0;
        });
        setBatchTotals(totals);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        return moment(dateTimeString, 'hh:mm:ss A').format('hh:mm:ss A');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return moment(dateString, 'DD MM YYYY').format('DD-MM-YYYY');
    };

    const calculateTotals = (subjects) => {
        return subjects.reduce((totals, subject) => {
            totals.count += subject.count;
            totals.loggedIn += subject.loggedIn;
            totals.completed += subject.completed;
            return totals;
        }, { count: 0, loggedIn: 0, completed: 0 });
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
                    <div className="sac-select-wrapper">
                        <label htmlFor="departmentId" className="sac-label">Select Department:</label>
                        <select 
                            id="departmentId" 
                            className="sac-select"
                            value={departmentId} 
                            onChange={(e) => setDepartmentId(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map((department, index) => (
                                <option key={index} value={department}>{department}</option>
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

                {((batchNo || !center) && aggregatedSubjects.length > 0) && (
                    <div className="sac-subjects-section">
                        <h4 className="sac-subtitle">Subjects:</h4>
                        <div className="sac-table-wrapper">
                            <table className="sac-table sac-subjects-table">
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
                                    {(center && allData[0]?.subjects ? allData[0].subjects : aggregatedSubjects)
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
                                    {(() => {
                                        const subjects = center && allData[0]?.subjects ? allData[0].subjects : aggregatedSubjects;
                                        const totals = calculateTotals(subjects.filter(subject => subject.count > 0));
                                        return (
                                            <tr className="sac-totals-row">
                                                <td colSpan="2"><strong>Total</strong></td>
                                                <td><strong>{totals.count}</strong></td>
                                                <td><strong>{totals.loggedIn}</strong></td>
                                                <td><strong>{totals.completed}</strong></td>
                                            </tr>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!batchNo && !center && (
                    <div className="sac-batch-totals-section">
                        <h4 className="sac-subtitle">Batch-wise Totals:</h4>
                        <div className="sac-table-wrapper">
                            <table className="sac-table sac-batch-totals-table">
                                <thead>
                                    <tr>
                                        <th>Batch No</th>
                                        <th>Total Students</th>
                                        <th>Logged In Students</th>
                                        <th>Completed Students</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(batchTotals).map(([batch, totals]) => (
                                        <tr key={batch}>
                                            <td>{batch}</td>
                                            <td>{totals.totalStudents}</td>
                                            <td>{totals.loggedInStudents}</td>
                                            <td>{totals.completedStudents}</td>
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