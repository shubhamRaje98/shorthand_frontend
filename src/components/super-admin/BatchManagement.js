// src/components/BatchManagement/BatchManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BatchManagement.css';

// Import the ToggleSwitch component
const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={isOn === 1} // Convert 1/0 to boolean
                onChange={(e) => onToggle(e.target.checked ? 1 : 0)} // Convert boolean to 1/0
            />
            <span className="switch" />
        </label>
    );
};

const BatchManagement = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await axios.get('https://www.shorthandonlineexam.in/get-all-batches');
            setBatches(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch batches');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (batchNo, status) => {
        try {
            await axios.post('https://www.shorthandonlineexam.in/update-batch-status', {
                batchNo,
                status: status ? true : false  // Convert boolean to 1/0
            });
            fetchBatches(); // Refresh data after update
        } catch (err) {
            setError('Failed to update batch status');
            fetchBatches(); // Refresh to revert UI if update failed
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="batch-management">
            <h1>Batch Management</h1>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
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
                        {batches.map((batch) => (
                            <tr key={batch.batchNo}>
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
                                        onToggle={(status) => handleStatusUpdate(batch.batchNo, status)}
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