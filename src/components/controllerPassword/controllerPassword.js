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

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/get-departments`);
                setDepartments(response.data.departments || []);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);

    // Fetch controller passwords
    const fetchControllerPasswords = async (departmentId = 'all') => {
        setLoading(true);
        setError('');
        try {
            // Make POST request with departmentId in body
            const response = await axios.post(`http://localhost:3000/get-controller-pass`, {
                departmentId: departmentId
            });
            console.log(response.data.controllerPassDto);
            setInfo(response.data.controllerPassDto || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response && error.response.status === 404) {
                setError('No Controller password available at this time');
            } else {
                setError('Error fetching controller passwords');
            }
        }
        setLoading(false);
    };

    // Initial fetch
    useEffect(() => {
        fetchControllerPasswords();
    }, [center]);

    // Handle department filter change
    const handleDepartmentChange = (e) => {
        const selectedDept = e.target.value;
        setSelectedDepartment(selectedDept);
        fetchControllerPasswords(selectedDept);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <NavBar />
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <h2 className="mt-3">Controller Password Table</h2>
                    
                    {/* Department Filter */}
                    <div className="mb-3">
                        <label htmlFor="departmentSelect" className="form-label">Filter by Department:</label>
                        <select 
                            id="departmentSelect"
                            className="form-select" 
                            value={selectedDepartment} 
                            onChange={handleDepartmentChange}
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">{error}</p>}
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
                                        <tr key={index}>
                                            <td>{item.center}</td>
                                            <td>{item.batchNo}</td>
                                            <td>{item.departmentName}</td>
                                            <td>{item.controllerPass}</td>
                                            <td>{item.batchDate}</td>
                                            <td>{item.startTime}</td>
                                            <td>{item.endTime}</td>
                                            <td>{item.batchStatus === 1 ? "Active" : "Inactive"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!loading && !error && (!info || info.length === 0) && (
                        <p className="text-info">No controller passwords available at this time.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ControllerPassword;