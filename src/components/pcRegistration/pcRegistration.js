// src/components/ControllerPassword.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import NavBar from '../navBar/navBar'; // Adjust the path as necessary
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const PCRegistration = () => {
    const { center } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [center]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`https://shorthandonlineexam.in/get-pcregistration`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('No PC registered');
        }
        setLoading(false);
    };

    const handleDelete = async (item) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm(`Are you sure you want to delete the PC registration for:\n\nIP Address: ${item.ip_address}\nMAC Address: ${item.mac_address}\nDisk ID: ${item.disk_id}\n\nThis action cannot be undone.`);

        if (!isConfirmed) {
            return; // If user cancels, do nothing
        }

        try {
            const response = await axios.post('https://shorthandonlineexam.in/delete-pcregistration', {
                ip_address: item.ip_address,
                disk_id: item.disk_id,
                mac_address: item.mac_address
            });
            
            if (response.status === 200) {
                setError('');
                setSuccessMessage('PC registration deleted successfully.');
                fetchData(); // Refresh the data
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(`Unexpected response: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setError('No matching PC registration found. The item may have already been deleted.');
                } else {
                    setError(`Error: ${error.response.data.message || 'An unexpected error occurred'}`);
                }
            } else if (error.request) {
                setError('No response received from server. Please check your connection.');
            } else {
                setError(`Error: ${error.message}`);
            }
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <NavBar />
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <h2 className="mt-3">PC Registration Table</h2>
                    {loading && <p>Loading...</p>}
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
                    {!loading && !error && Array.isArray(data) && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Center</th>
                                        <th scope="col">IP Address</th>
                                        <th scope="col">Disk ID</th>
                                        <th scope="col">MAC Address</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.center}</td>
                                            <td>{item.ip_address}</td>
                                            <td>{item.disk_id}</td>
                                            <td>{item.mac_address}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PCRegistration;