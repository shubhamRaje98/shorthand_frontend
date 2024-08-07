// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Route, Routes } from 'react-router-dom';
import NavBar from '../navBar/navBar';
import AttendanceDownload from '../attendanceDownload/attendanceDownload';
import AbsenteeRoll from '../attendeeRoll/attendeeRoll';
import TrackStudentsExam from '../studentExamTracking/StudentTable';
import CenterwiseStudentCount from '../centerwiseStudentExamCountTracking/centerwiseCountReport';
import './home.css';

const Home = () => {
    const { center } = useParams(); // Get the 'center' parameter from the URL
    const [centerDetails, setCenterDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCenterDetails = async () => {
            try {
                console.log(`Fetching details for center: ${center}`);
                
                // Using POST request as required by your API
                const response = await axios.get(`http://52.66.236.172:3000/get-center-details`);
                console.log("API Response:", response.data);

                if (response.data && response.data.length > 0) {
                    setCenterDetails(response.data[0]);
                    console.log("Center details:", response.data[0]);
                } else {
                    setCenterDetails(null);
                    console.log("No center details found");
                }
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch center details');
                console.error("Error fetching center details:", error);
                setLoading(false);
            }
        };

        fetchCenterDetails();
    }, [center]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <NavBar />
            <div className="home-container">
                
                <div className="content">
                    <Routes>
                        <Route path="/" element={
                            <div>
                                <h1>Center Details</h1>
                                {centerDetails ? (
                                    <div>
                                        <p>Center Name: {centerDetails.center}</p>
                                        <p>Center Address: {centerDetails.center_address}</p>
                                        <p>Max PC: {centerDetails.max_pc}</p>
                                        <p>PC count: {centerDetails.pc_count}</p>
                                        
                                    </div>
                                ) : (
                                    <p>No details available for this center.</p>
                                )}
                            </div>
                        } />
                        <Route path="/attendance-download" element={<AttendanceDownload />} />
                        <Route path="/absentee-roll" element={<AbsenteeRoll />} />
                        <Route path="/student-table" element={<TrackStudentsExam />} />
                        <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Home;