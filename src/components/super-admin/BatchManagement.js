import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BatchManagement.css';

// Import the ToggleSwitch component
const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={isOn === 1}
                onChange={(e) => onToggle(e.target.checked)}
            />
            <span className="switch" />
        </label>
    );
};

const BatchManagement = () => {
    // Helper functions defined first
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    // State declarations
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        departmentId: '',
        batchNo: '',
        date: ''
    });

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await axios.get('https://checking.shorthandonlineexam.in/get-all-batches');
            setBatches(response.data.data);
            console.log(response.data)
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch batches');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (batchNo, status, departmentId) => {
        try {
            const response = await axios.post('https://checking.shorthandonlineexam.in/update-batch-status', {
                batchNo,
                departmentId,
                status: Boolean(status)
            });
            
            if (response.data.success) {
                fetchBatches();
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update batch status');
            fetchBatches();
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Get unique values for dropdowns
    const uniqueDepartments = [...new Set(batches.map(batch => batch.departmentId))];
    const uniqueBatchNos = [...new Set(batches.map(batch => batch.batchNo))];
    const uniqueDates = [...new Set(batches.map(batch => formatDate(batch.batchdate)))];

    const filteredBatches = batches.filter(batch => {
        const departmentMatch = filters.departmentId === '' || batch.departmentId.toString() === filters.departmentId;
        const batchMatch = filters.batchNo === '' || batch.batchNo.toString() === filters.batchNo;
        const dateMatch = filters.date === '' || formatDate(batch.batchdate) === filters.date;
        
        return departmentMatch && batchMatch && dateMatch;
    });

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="batch-management">
            <h1>Batch Management</h1>
            
            {/* Filter Section */}
            <div className="filters-row">
                <div className="filter-item">
                    <select
                        name="departmentId"
                        value={filters.departmentId}
                        onChange={handleFilterChange}
                    >
                        <option value="">Select Department</option>
                        {uniqueDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <select
                        name="batchNo"
                        value={filters.batchNo}
                        onChange={handleFilterChange}
                    >
                        <option value="">Select Batch No</option>
                        {uniqueBatchNos.map(batch => (
                            <option key={batch} value={batch}>{batch}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <select
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                    >
                        <option value="">Select Date</option>
                        {uniqueDates.map(date => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Department Id</th>
                            <th>Batch No</th>
                            <th>Date</th>
                            <th>Reporting Time</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBatches.map((batch) => (
                            <tr key={batch.batchNo}>
                                <td>{batch.departmentId}</td>
                                <td>{batch.batchNo}</td>
                                <td>{formatDate(batch.batchdate)}</td>
                                <td>{formatTime(batch.reporting_time)}</td>
                                <td>{formatTime(batch.start_time)}</td>
                                <td>{formatTime(batch.end_time)}</td>
                                <td className={batch.batchstatus === 1 ? 'status-active' : 'status-inactive'}>
                                    {batch.batchstatus === 1 ? 'Active' : 'Inactive'}
                                </td>
                                <td>
                                    <ToggleSwitch
                                        isOn={batch.batchstatus}
                                        onToggle={(status) => handleStatusUpdate(batch.batchNo, status, batch.departmentId)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BatchManagement;