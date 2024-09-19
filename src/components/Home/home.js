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
    const { center } = useParams();
    const [centerDetails, setCenterDetails] = useState(null);
    const [pcCount, setPcCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCenterDetails = async () => {
            try {
                console.log(`Fetching details for center: ${center}`);
                
                const response = await axios.get(`https://shorthandonlineexam.in/get-center-details`);
                console.log("API Response:", response.data);

                if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
                    setCenterDetails(response.data.examCenterDTO[0]);
                    setPcCount(response.data.pcCount);
                    console.log("Center details:", response.data.examCenterDTO[0]);
                    console.log("PC Count:", response.data.pcCount);
                } else {
                    setCenterDetails(null);
                    setPcCount(null);
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
        <div className="home-wrapper">
            <NavBar />
            <div className="home-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={
                            <div className="center-details">
                                <h1>Center Admin</h1>
                                {centerDetails ? (
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Center Code:</span>
                                            <span className="detail-value">{centerDetails.center}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Center Name:</span>
                                            <span className="detail-value">{centerDetails.center_name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Center Address:</span>
                                            <span className="detail-value">{centerDetails.center_address}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Max PC:</span>
                                            <span className="detail-value">{centerDetails.max_pc}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">PC Count:</span>
                                            <span className="detail-value">{centerDetails.pc_count}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Registered PCs:</span>
                                            <span className="detail-value">{pcCount}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="no-details">No details available for this center.</p>
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