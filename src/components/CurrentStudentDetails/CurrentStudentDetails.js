import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../navBar/navBar';
import moment from 'moment-timezone';

// Reusable Stat Card Component
const StatCard = ({ icon, bgColor, textColor, label, value }) => (
    <div className="col-6 col-md-3">
        <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body p-3">
                <div className="d-flex align-items-center">
                    <div className={`${bgColor} bg-opacity-10 rounded-3 p-2 me-2`}>
                        <i className={`bi bi-${icon} ${textColor} fs-5`}></i>
                    </div>
                    <div className="flex-grow-1">
                        <p className="text-muted small mb-0">{label}</p>
                        <h5 className="mb-0 fw-bold text-dark">{value}</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Reusable Table Row Component
const BatchTableRow = ({ item }) => (
    <tr>
        <td className="text-nowrap">{item.department_name}</td>
        <td className="text-center fw-semibold">{item.batchNo}</td>
        <td className="text-center">{item.total_students || 0}</td>
        <td className="text-center text-success fw-semibold">{item.logged_in_students || 0}</td>
        <td className="text-center text-primary fw-semibold">{item.completed_student || 0}</td>
        <td className="text-center">{item.start_time}</td>
        <td className="text-center">{item.batchdate}</td>
    </tr>
);

// Reusable Subject Row Component
const SubjectTableRow = ({ subject }) => (
    <tr>
        <td className="text-center">{subject.id}</td>
        <td>{subject.name}</td>
        <td className="text-center fw-semibold">{subject.count}</td>
        <td className="text-center text-success">{subject.loggedIn}</td>
        <td className="text-center text-primary">{subject.completed}</td>
    </tr>
);

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
            const response = await axios.get('http://localhost:3000/departments', { withCredentials: true });
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
            let url = 'http://localhost:3000/center-batches';
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
            let url = `http://localhost:3000/get-current-student-details`;
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

    // Calculate totals for stat cards
    const totals = {
        totalStudents: allData.reduce((sum, item) => sum + (item.total_students || 0), 0),
        loggedInStudents: allData.reduce((sum, item) => sum + (item.logged_in_students || 0), 0),
        completedStudents: allData.reduce((sum, item) => sum + (item.completed_student || 0), 0),
        totalBatches: allData.length
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavBar />
            <div className="flex-grow-1">
                <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
                    {/* Header Section */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-3">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                        <div className="d-flex align-items-center mb-3 mb-md-0">
                                            <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                                                <i className="bi bi-people text-primary fs-3"></i>
                                            </div>
                                            <div>
                                                <h2 className="h4 fw-bold text-dark mb-1">Current Student Details</h2>
                                                <p className="text-muted small mb-0">Real-time student examination status monitoring</p>
                                            </div>
                                        </div>
                                        <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                            <i className="bi bi-arrow-clockwise me-1"></i>
                                            Auto-refresh: 30s
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-3">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold text-dark mb-3">
                                        <i className="bi bi-funnel me-2 text-primary"></i>
                                        Filters
                                    </h5>
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="departmentId" className="form-label fw-semibold text-dark mb-2">
                                                <i className="bi bi-building me-2 text-primary"></i>
                                                Department
                                            </label>
                                            <select 
                                                id="departmentId" 
                                                className="form-select form-select-lg rounded-3 shadow-sm border-0"
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

                                        <div className="col-12 col-md-6">
                                            <label htmlFor="batchNo" className="form-label fw-semibold text-dark mb-2">
                                                <i className="bi bi-list-ol me-2 text-success"></i>
                                                Batch Number
                                            </label>
                                            <select 
                                                id="batchNo" 
                                                className="form-select form-select-lg rounded-3 shadow-sm border-0"
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted fw-medium">Loading student details...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm mb-4" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    {!loading && allData.length > 0 && (
                        <div className="row g-3 mb-4">
                            <StatCard 
                                icon="clipboard-data"
                                bgColor="bg-info"
                                textColor="text-info"
                                label="Total Batches"
                                value={totals.totalBatches}
                            />
                            <StatCard 
                                icon="people"
                                bgColor="bg-primary"
                                textColor="text-primary"
                                label="Total Students"
                                value={totals.totalStudents}
                            />
                            <StatCard 
                                icon="person-check"
                                bgColor="bg-success"
                                textColor="text-success"
                                label="Logged In"
                                value={totals.loggedInStudents}
                            />
                            <StatCard 
                                icon="check-circle"
                                bgColor="bg-warning"
                                textColor="text-warning"
                                label="Completed"
                                value={totals.completedStudents}
                            />
                        </div>
                    )}

                    {/* Main Data Table */}
                    {!loading && allData.length > 0 && (
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-white border-0 p-4">
                                <h5 className="fw-bold text-dark mb-1">
                                    <i className="bi bi-table me-2 text-primary"></i>
                                    {departmentId && departments.find(d => d.departmentId == departmentId) 
                                        ? `${departments.find(d => d.departmentId == departmentId).department_name} - ` 
                                        : 'All Departments - '}
                                    {batchNo ? `Batch ${batchNo}` : 'All Batches'}
                                </h5>
                                <p className="text-muted small mb-0">Detailed batch-wise student information</p>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="fw-semibold text-dark px-4 py-3">Department</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Batch No</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Total Students</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Logged In</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Completed</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Start Time</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Batch Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allData.map((item, index) => (
                                                <BatchTableRow key={index} item={item} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Data State */}
                    {!loading && allData.length === 0 && !error && (
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-body p-5 text-center">
                                <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                     style={{ width: '64px', height: '64px' }}>
                                    <i className="bi bi-inbox text-secondary fs-3"></i>
                                </div>
                                <h5 className="text-muted fw-medium">No Data Available</h5>
                                <p className="text-muted small mb-0">There are no student details available for the selected filters.</p>
                            </div>
                        </div>
                    )}

                    {/* Subjects Table */}
                    {batchNo && allData.length > 0 && allData[0].subjects && Array.isArray(allData[0].subjects) && (
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header bg-white border-0 p-4">
                                <h5 className="fw-bold text-dark mb-1">
                                    <i className="bi bi-book me-2 text-success"></i>
                                    Subject-wise Details
                                </h5>
                                <p className="text-muted small mb-0">Student distribution across subjects</p>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Subject ID</th>
                                                <th className="fw-semibold text-dark px-4 py-3">Subject Name</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Count</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Logged In</th>
                                                <th className="fw-semibold text-dark text-center px-4 py-3">Completed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allData[0].subjects
                                                .filter(subject => subject.count > 0)
                                                .map((subject, index) => (
                                                    <SubjectTableRow key={index} subject={subject} />
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrentStudentDetails;

