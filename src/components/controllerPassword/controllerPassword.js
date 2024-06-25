// src/components/ControllerPassword.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ControllerPassword.css'; // Import custom CSS
import NavBar from '../navBar/navBar'; // Adjust the path as necessary
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ControllerPassword = () => {
    const { center } = useParams();
    const [data, setData] = useState([]); // Initialize state as an empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://shorthandonlineexam.in:3000/get-controller-pass`);
                
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to fetch data');
            }
            setLoading(false);
        };

        fetchData();
    }, [center]);

    return (
        <div className="container-fluid">
            <div className="row">
                <NavBar />
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <h2 className="mt-3">Controller Password Table</h2>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">{error}</p>}
                    {!loading && !error && Array.isArray(data) && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Center</th>
                                        <th scope="col">Batch No</th>
                                        <th scope="col">Controller Password</th>
                                        <th scope="col">Start Time</th>
                                        <th scope="col">End Time</th>
                                        <th scope="col">Batch Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.center}</td>
                                            <td>{item.batchNo}</td>
                                            <td>{item.controllerPass}</td>
                                            <td>{item.startTime}</td>
                                            <td>{item.endTime}</td>
                                            <td>{item.batchStatus}</td>
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

export default ControllerPassword;
