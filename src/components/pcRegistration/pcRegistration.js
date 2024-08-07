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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:3000/get-pcregistration`);
                
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
                    <h2 className="mt-3">Pc Registration Table</h2>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">{error}</p>}
                    {!loading && !error && Array.isArray(data) && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Center</th>
                                        <th scope="col">Ip Address</th>
                                        <th scope="col">Disk Id</th>
                                        <th scope="col">Mac Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.center}</td>
                                            <td>{item.ip_address}</td>
                                            <td>{item.disk_id}</td>
                                            <td>{item.mac_address}</td>
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
