// expertDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './expertDash.css';
import { useNavigate, Outlet, useParams } from 'react-router-dom';

const ExpertDashboard = () => {
    const [expertDetails, setExpertDetails] = useState(null);
    const navigate = useNavigate();
    const { subjectId, qset } = useParams();

    useEffect(() => {
        const fetchExpertDetails = async () => {
            try {
                const response = await axios.get('http://localhost:3000/expert-details', { withCredentials: true });
                if (response.status === 200) {
                    setExpertDetails(response.data);
                }
            } catch (err) {
                console.error('Error fetching expert details:', err);
            }
        };

        fetchExpertDetails();
    }, []);

    const handleBackClick = () => {
        if (qset) {
            navigate(`/expertDashboard/${subjectId}`);
        } else if (subjectId) {
            navigate('/expertDashboard');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="box">
                {(subjectId || qset) && (
                    <button className="back-button" onClick={handleBackClick}>Back</button>
                )}
                {expertDetails ? (
                    <div className="expert-details">
                        <h5 className="expert-id">Expert ID: {expertDetails.expertId}</h5>
                        <h5 className="expert-name">Expert Name: {expertDetails.expert_name}</h5>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="box dynamic-content">
                <Outlet />
            </div>
        </div>
    );
};

export default ExpertDashboard;