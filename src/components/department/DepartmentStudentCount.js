import React, { useState, useEffect } from 'react';
import "./DepartmentDashboard.css";
import DepartmentNavBar from './DepartmentNavBar';

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
            let url = 'https://checking.shorthandonlineexam.in/track-students-on-department-code';

            console.log("Fetching data from URL:", url);
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();

            const distinctBatches = [...new Set(data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort();
            });
            const distinctCenters = [...new Set(data.map(item => item.center))];
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
            let url = `https://checking.shorthandonlineexam.in/get-department-batch-student-count`
            if (batchNo || center) {
                url += '?';
                if (batchNo) url += `batchNo=${batchNo}&`;
                if (center) url += `center=${center}&`;
                url = url.slice(0, -1);
            }

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });
            const responseData = await response.json();

            if (responseData && responseData.results && Array.isArray(responseData.results)) {
                console.log(responseData)
                setAllData(responseData.results);
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

    // Calculate totals for the main table
    const calculateMainTableTotals = () => {
        return allData.reduce((totals, item) => {
            totals.totalStudents += parseInt(item.total_students, 10) || 0;
            totals.loggedInStudents += parseInt(item.logged_in_students, 10) || 0;
            totals.completedStudents += parseInt(item.completed_student, 10) || 0;
            return totals;
        }, { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 });
    };

    // Calculate totals for the subjects table
    const calculateSubjectTotals = () => {
        const subjects = center ? (allData[0]?.subjects || []) : aggregatedSubjects;
        return subjects
            .filter(subject => subject.count > 0)
            .reduce((totals, subject) => {
                totals.count += parseInt(subject.count, 10) || 0;
                totals.loggedIn += parseInt(subject.loggedIn, 10) || 0;
                totals.completed += parseInt(subject.completed, 10) || 0;
                return totals;
            }, { count: 0, loggedIn: 0, completed: 0 });
    };

    // FIXED: Updated formatting functions to handle backend format correctly
    const formatDateTime = (timeString) => {
        if (!timeString) return '';
        // Backend sends time in HH:mm:ss format, convert to 12-hour format with AM/PM
        const [hours, minutes, seconds] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Backend sends date in DD-MM-YYYY format, keep it as is
        return dateString;
    };

    const mainTableTotals = calculateMainTableTotals();
    const subjectTotals = calculateSubjectTotals();

    // ... (existing imports and component logic)

    return (
        <div>
            <DepartmentNavBar />
            <div className="home-container">
                <div className="dept-container-fluid">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Current Student Details</h2>

                    <div className="dept-row mb-3">
                        <div className="dept-col-md-3 dept-col-sm-6 mb-2">
                            <label htmlFor="batchNo" className="dept-form-label">
                                Batch Number:
                            </label>
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
                            <label htmlFor="center" className="dept-form-label">
                                Center Number:
                            </label>
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

                    {loading && <div className="text-center p-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading data...</p>
                    </div>}

                    {error && <div className="alert alert-warning" role="alert">{error}</div>}

                    <div className="dept-table-container mb-4">
                        <div className="bg-light px-3 py-2 border-bottom">
                            <h5 className="mb-0 text-dark">
                                {batchNo ? `Batch ${batchNo}` : 'All Batches'} {center ? `- Center ${center}` : ''}
                            </h5>
                        </div>
                        <table className="dept-table dept-table-bordered dept-table-striped dept-table-hover">
                            <thead>
                                <tr>
                                    <th>Center</th>
                                    <th>Batch No</th>
                                    <th>Total Students</th>
                                    <th>Logged In Students</th>
                                    <th>Completed Students</th>
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
                                    </tr>
                                ))}
                                {allData.length > 0 && (
                                    <tr className="table-primary fw-bold">
                                        <td colSpan="2">TOTAL</td>
                                        <td>{mainTableTotals.totalStudents}</td>
                                        <td>{mainTableTotals.loggedInStudents}</td>
                                        <td>{mainTableTotals.completedStudents}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {allData.length > 0 && (
                        <div className="dept-table-container">
                            <div className="bg-light px-3 py-2 border-bottom">
                                <h5 className="mb-0 text-dark">Subjects:</h5>
                            </div>
                            <table className="dept-table dept-table-bordered dept-table-striped dept-table-hover">
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
                                    {(center ? allData[0]?.subjects || [] : aggregatedSubjects)
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
                                    {/* Total row for subjects table */}
                                    {((center ? allData[0]?.subjects || [] : aggregatedSubjects).filter(subject => subject.count > 0).length > 0) && (
                                        <tr className="table-success fw-bold">
                                            <td colSpan="2">TOTAL</td>
                                            <td>{subjectTotals.count}</td>
                                            <td>{subjectTotals.loggedIn}</td>
                                            <td>{subjectTotals.completed}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentStudentCount;