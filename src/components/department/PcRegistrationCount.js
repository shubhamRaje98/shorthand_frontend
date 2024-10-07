import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PcRegistrationCount.css';
import DepartmentNavBar from './DepartmentNavBar';

const PcRegistrationCount = () => {
    const [pcData, setPcData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://www.shorthandonlineexam.in/get-center-pcregistration-details');
                setPcData(response.data.results);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="pcrc-loading">Loading...</div>;
    if (error) return <div className="pcrc-error">{error}</div>;

    return (
        <>
        <DepartmentNavBar/>
        
        <div className="pcrc-container">
            <h2 className="pcrc-title">PC Registration Count</h2>
            <div className="pcrc-table-container">
                <table className="pcrc-table">
                    <thead>
                        <tr>
                            <th className="pcrc-th">Center</th>
                            <th className="pcrc-th">Max PCs</th>
                            <th className="pcrc-th">PC Count</th>
                            <th className="pcrc-th">Registered PC Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pcData.map((row, index) => (
                            <tr key={index} className="pcrc-tr">
                                <td className="pcrc-td">{row.center}</td>
                                <td className="pcrc-td">{row.max_pc}</td>
                                <td className="pcrc-td">{row.pc_count}</td>
                                <td className="pcrc-td">{row.registered_pc_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default PcRegistrationCount;