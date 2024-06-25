import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import NavBar from '../navBar/navBar';
const AttendanceDownload = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:3000/get-pdfs');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to fetch data');
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div>
            <NavBar/>
            <div className="container mt-5">
                <h2>Download Attendance and Reports</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loading && !error && Array.isArray(data) && data.length > 0 && (
                    <div className="list-group">
                        {data.map((item, index) => (
                            <div key={index} className="list-group-item">
                                <h5>Attendance Roll</h5>
                                <a href={item.attendanceroll} target="_blank" rel="noopener noreferrer" className="btn btn-primary mb-2">Download Attendance Roll</a>
                                <h5>Absentee Report</h5>
                                <a href={item.absenteereport} target="_blank" rel="noopener noreferrer" className="btn btn-primary mb-2">Download Absentee Report</a>
                                <h5>Answer Sheet</h5>
                                <a href={item.answersheet} target="_blank" rel="noopener noreferrer" className="btn btn-primary mb-2">Download Answer Sheet</a>
                                <h5>Blank Answer Sheet</h5>
                                <a href={item.blankanswersheet} target="_blank" rel="noopener noreferrer" className="btn btn-primary mb-2">Download Blank Answer Sheet</a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceDownload;
