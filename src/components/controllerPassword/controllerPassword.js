import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ControllerPassword.css';
import NavBar from '../navBar/navBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const ControllerPassword = () => {
    const { center } = useParams();
    const [info, setInfo] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departmentLoading, setDepartmentLoading] = useState(false);

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            setDepartmentLoading(true);
            try {
                const response = await axios.get('https://www.shorthandonlineexam.in/get-active-departments');
                setDepartments(response.data);
                console.log('Departments fetched:', response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                setError("Failed to fetch departments. Please try again later.");
            }
            setDepartmentLoading(false);
        };

        fetchDepartments();
    }, []);

    // Fetch controller passwords whenever department selection changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                let url = 'https://www.shorthandonlineexam.in/get-controller-pass';
                
                // Add department filter if not 'all'
                if (selectedDepartment && selectedDepartment !== 'all') {
                    url += `?departmentId=${selectedDepartment}`;
                }
                
                const response = await axios.get(url);
                console.log('Controller passwords response:', response.data);
                
                if (response.data.controllerPassDto) {
                    setInfo(response.data.controllerPassDto);
                    
                    // Show message if no data but request was successful
                    if (response.data.controllerPassDto.length === 0) {
                        setError(response.data.message || 'No Controller passwords available at this time (passwords are shown 30 minutes before batch start)');
                    }
                } else {
                    setInfo([]);
                    setError('No Controller passwords available at this time');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response?.status === 404) {
                    setError('No Controller passwords available at this time');
                } else {
                    setError('Error fetching controller passwords. Please try again.');
                }
                setInfo([]);
            }
            setLoading(false);
        };

        // Only fetch data if departments have been loaded (to avoid calling with undefined departmentId)
        if (!departmentLoading) {
            fetchData();
        }
    }, [selectedDepartment, departmentLoading]);

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        setError(''); // Clear previous errors when changing department
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <NavBar />
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <h2 className="mt-3">Controller Password Table</h2>
                    
                    {/* Department Filter Dropdown */}
                    <div className="mb-3">
                        <label htmlFor="departmentSelect" className="form-label">
                            <strong>Filter by Department:</strong>
                        </label>
                        <select 
                            id="departmentSelect"
                            className="form-select" 
                            value={selectedDepartment} 
                            onChange={handleDepartmentChange}
                            disabled={departmentLoading}
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                        {departmentLoading && <small className="text-muted">Loading departments...</small>}
                    </div>

                    {/* Loading and Error States */}
                    {loading && <div className="alert alert-info">Loading controller passwords...</div>}
                    {error && <div className="alert alert-warning">{error}</div>}
                    
                    {/* Controller Password Table */}
                    {!loading && !error && Array.isArray(info) && info.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Center</th>
                                        <th scope="col">Batch No</th>
                                        <th scope="col">Department</th>
                                        <th scope="col">Controller Password</th>
                                        <th scope="col">Batch Date</th>
                                        <th scope="col">Start Time</th>
                                        <th scope="col">End Time</th>
                                        <th scope="col">Batch Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map((item, index) => (
                                        <tr key={`${item.center}-${item.batchNo}-${item.departmentId}`}>
                                            <td>{item.center}</td>
                                            <td>{item.batchNo}</td>
                                            <td>{item.departmentName}</td>
                                            <td>
                                                <strong className="text-primary">
                                                    {item.controllerPass}
                                                </strong>
                                            </td>
                                            <td>{item.batchDate}</td>
                                            <td>{item.startTime}</td>
                                            <td>{item.endTime}</td>
                                            <td>
                                                <span className={`badge ${item.batchStatus === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                    {item.batchStatus === 1 ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* No Data Message */}
                    {!loading && !error && (!info || info.length === 0) && (
                        <div className="alert alert-info">
                            <h5>No Controller Passwords Available</h5>
                            <p>Controller passwords are only displayed 30 minutes before the batch start time.</p>
                            <small>Please check back closer to your batch start time.</small>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ControllerPassword;