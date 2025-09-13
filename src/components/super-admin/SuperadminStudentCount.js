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
    const [filteredAggregatedSubjects, setFilteredAggregatedSubjects] = useState([]);
    const [filteredBatchTotals, setFilteredBatchTotals] = useState({});

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
        if (allData.length > 0) {
            aggregateSubjects();
            calculateBatchTotals();
            calculateFilteredAggregations();
        }
    }, [allData, center, departmentId, batchNo]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:3004/super-admin-student-track-dashboard';
            
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
            let url = `http://localhost:3004/get-super-admin-student-count`
            if(batchNo || center || departmentId){
                url += '?';
                if(batchNo) url += `batchNo=${batchNo}&`;
                if(center) url += `center=${center}&`;
                if(departmentId) url += `departmentId=${departmentId}&`;
                url = url.slice(0, -1);
            }
        
            const response = await axios.get(url, { withCredentials: true });
            if (response.data && response.data.results && Array.isArray(response.data.results)) {
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

    const calculateFilteredAggregations = () => {
        // Filter data based on current filters
        let filteredData = allData;
        
        if (batchNo) {
            filteredData = filteredData.filter(item => item.batchNo === batchNo);
        }
        if (center) {
            filteredData = filteredData.filter(item => item.center === center);
        }
        if (departmentId) {
            filteredData = filteredData.filter(item => item.departmentId === departmentId);
        }

        // Calculate filtered subject aggregations
        const subjectMap = new Map();
        filteredData.forEach(item => {
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
        setFilteredAggregatedSubjects(Array.from(subjectMap.values()));

        // Calculate filtered batch totals
        const batchTotals = {};
        filteredData.forEach(item => {
            if (!batchTotals[item.batchNo]) {
                batchTotals[item.batchNo] = {
                    totalStudents: 0,
                    loggedInStudents: 0,
                    completedStudents: 0
                };
            }
            batchTotals[item.batchNo].totalStudents += parseInt(item.total_students) || 0;
            batchTotals[item.batchNo].loggedInStudents += parseInt(item.logged_in_students) || 0;
            batchTotals[item.batchNo].completedStudents += parseInt(item.completed_student) || 0;
        });
        setFilteredBatchTotals(batchTotals);
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === "invalid date" || dateString === "0") {
            return "";
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const calculateTotals = (subjects) => {
        return subjects.reduce((totals, subject) => {
            totals.count += subject.count || 0;
            totals.loggedIn += subject.loggedIn || 0;
            totals.completed += subject.completed || 0;
            return totals;
        }, { count: 0, loggedIn: 0, completed: 0 });
    };

    const calculateMainTableTotals = () => {
        return allData.reduce((totals, item) => {
            totals.totalStudents += parseInt(item.total_students) || 0;
            totals.loggedInStudents += parseInt(item.logged_in_students) || 0;
            totals.completedStudents += parseInt(item.completed_student) || 0;
            return totals;
        }, { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 });
    };

    // Determine which subjects to show based on filters
    const getSubjectsToShow = () => {
        if (center && allData.length > 0 && allData[0]?.subjects) {
            return allData[0].subjects;
        }
        return (batchNo || center || departmentId) ? filteredAggregatedSubjects : aggregatedSubjects;
    };

    // Determine which batch totals to show based on filters
    const getBatchTotalsToShow = () => {
        return (batchNo || center || departmentId) ? filteredBatchTotals : batchTotals;
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
                
                {/* Subjects Table - Always show if data exists */}
                {!loading && !error && allData.length > 0 && getSubjectsToShow().length > 0 && (
                    <div className="sac-subjects-section">
                        <h4 className="sac-subtitle">
                            Subjects
                            {batchNo ? ` - Batch ${batchNo}` : ''}
                            {center ? ` - Center ${center}` : ''}
                            {departmentId ? ` - Department ${departmentId}` : ''}:
                        </h4>
                        <div className="sac-table-wrapper">
                            <table className="sac-table sac-subjects-table">
                                <thead>
                                    <tr>
                                        <th>Subject ID</th>
                                        <th>Subject Name</th>
                                        <th>Count</th>
                                        <th>Logged In</th>
                                        <th>Completed</th>
                                        <th>Pending</th>
                                        <th>Absent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSubjectsToShow()
                                        .filter(subject => subject.count > 0)
                                        .map((subject, index) => (
                                        <tr key={index}>
                                            <td>{subject.id}</td>
                                            <td>{subject.name}</td>
                                            <td>{subject.count || 0}</td>
                                            <td>{subject.loggedIn || 0}</td>
                                            <td>{subject.completed || 0}</td>
                                            <td>{(subject.loggedIn - subject.completed) || 0}</td>
                                            <td>{(subject.count - subject.loggedIn) || 0}</td>
                                        </tr>
                                    ))}
                                    {(() => {
                                        const subjects = getSubjectsToShow().filter(subject => subject.count > 0);
                                        const totals = calculateTotals(subjects);
                                        return (
                                            <tr className="sac-totals-row">
                                                <td colSpan="2"><strong>Total</strong></td>
                                                <td><strong>{totals.count}</strong></td>
                                                <td><strong>{totals.loggedIn}</strong></td>
                                                <td><strong>{totals.completed}</strong></td>
                                                <td><strong>{(totals.loggedIn - totals.completed)}</strong></td>
                                                <td><strong>{(totals.count - totals.loggedIn)}</strong></td>
                                            </tr>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Batch Totals Table - Show when no specific batch is selected and data exists */}
                {!loading && !error && !batchNo && allData.length > 0 && Object.keys(getBatchTotalsToShow()).length > 0 && (
                    <div className="sac-batch-totals-section">
                        <h4 className="sac-subtitle">
                            Batch-wise Totals
                            {center ? ` - Center ${center}` : ''}
                            {departmentId ? ` - Department ${departmentId}` : ''}:
                        </h4>
                        <div className="sac-table-wrapper">
                            <table className="sac-table sac-batch-totals-table">
                                <thead>
                                    <tr>
                                        <th>Batch No</th>
                                        <th>Total Students</th>
                                        <th>Logged In Students</th>
                                        <th>Completed Students</th>
                                        <th>Pending Students</th>
                                        <th>Absent Students</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(getBatchTotalsToShow()).map(([batch, totals]) => (
                                        <tr key={batch}>
                                            <td>{batch}</td>
                                            <td>{totals.totalStudents || 0}</td>
                                            <td>{totals.loggedInStudents || 0}</td>
                                            <td>{totals.completedStudents || 0}</td>
                                            <td>{(totals.loggedInStudents - totals.completedStudents) || 0}</td>
                                            <td>{(totals.totalStudents - totals.loggedInStudents) || 0}</td>
                                        </tr>
                                    ))}
                                    {(() => {
                                        const grandTotals = Object.values(getBatchTotalsToShow()).reduce((acc, totals) => {
                                            acc.totalStudents += totals.totalStudents || 0;
                                            acc.loggedInStudents += totals.loggedInStudents || 0;
                                            acc.completedStudents += totals.completedStudents || 0;
                                            return acc;
                                        }, { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 });
                                        
                                        return (
                                            <tr className="sac-totals-row">
                                                <td><strong>Grand Total</strong></td>
                                                <td><strong>{grandTotals.totalStudents}</strong></td>
                                                <td><strong>{grandTotals.loggedInStudents}</strong></td>
                                                <td><strong>{grandTotals.completedStudents}</strong></td>
                                                <td><strong>{(grandTotals.loggedInStudents - grandTotals.completedStudents)}</strong></td>
                                                <td><strong>{(grandTotals.totalStudents - grandTotals.loggedInStudents)}</strong></td>
                                            </tr>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Main Data Table - Always show if data exists */}
                {!loading && !error && allData.length > 0 && (
                    <div className="sac-data-table">
                        <h3 className="sac-subtitle">
                            Detailed View -
                            {batchNo ? ` Batch ${batchNo}` : ' All Batches'} 
                            {center ? ` - Center ${center}` : ''} 
                            {departmentId ? ` - Department ${departmentId}` : ''}
                        </h3>
                        <div className="sac-table-wrapper">
                            <table className="sac-table">
                                <thead>
                                    <tr>
                                        <th>Center</th>
                                        <th>Batch No</th>
                                        <th>Total Students</th>
                                        <th>Logged In Students</th>
                                        <th>Completed Students</th>
                                        <th>Pending Students</th>
                                        <th>Absent Students</th>
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
                                            <td>{(item.logged_in_students - item.completed_student) || 0}</td>
                                            <td>{(item.total_students - item.logged_in_students) || 0}</td>
                                            <td>{item.start_time}</td>
                                            <td>{item.batchdate}</td>
                                        </tr>
                                    ))}
                                    {allData.length > 0 && (() => {
                                        const totals = calculateMainTableTotals();
                                        return (
                                            <tr className="sac-totals-row">
                                                <td colSpan="2"><strong>Total</strong></td>
                                                <td><strong>{totals.totalStudents}</strong></td>
                                                <td><strong>{totals.loggedInStudents}</strong></td>
                                                <td><strong>{totals.completedStudents}</strong></td>
                                                <td><strong>{(totals.loggedInStudents - totals.completedStudents)}</strong></td>
                                                <td><strong>{(totals.totalStudents - totals.loggedInStudents)}</strong></td>
                                                <td colSpan="2"></td>
                                            </tr>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Show message when no data is available */}
                {!loading && !error && allData.length === 0 && (
                    <div className="sac-no-data">
                        <p>No data available for the selected filters.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SuperAdminCount;