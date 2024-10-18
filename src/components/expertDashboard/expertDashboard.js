// expertDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './expertDash.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from './DashboardContext';

const ExpertDashboard = () => {
    const [expertDetails, setExpertDetails] = useState(null);
    const { selectedSubject, selectedQSet, setSelectedSubject, setSelectedQSet } = useDashboard();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchExpertDetails = async () => {
            try {
                const response = await axios.get('https://www.shorthandonlineexam.in/expert-details', { withCredentials: true });
                if (response.status === 200) {
                    setExpertDetails(response.data);
                }
            } catch (err) {
                console.error('Error fetching expert details:', err);
            }
        };

        fetchExpertDetails();
    }, []);

    useEffect(() => {
        // Reset selected subject and QSet based on the current URL
        const path = location.pathname.split('/');
        if (path.length === 2) { // At /expertDashboard/
            setSelectedSubject(null);
            setSelectedQSet(null);
        } else if (path.length === 3) { // At /expertDashboard/:subjectId
            setSelectedQSet(null);
        }
    }, [location, setSelectedSubject, setSelectedQSet]);

    const handleLogout = async () => {
        try {
            await axios.post('https://www.shorthandonlineexam.in/expert-logout', {}, { withCredentials: true });
            navigate('/expert-login', {replace: true});
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="box">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                {expertDetails ? (
                    <div className="expert-details">
                        <h5 className="expert-id">Expert ID: {expertDetails.expertId}</h5>
                        <h5 className="expert-name">Expert Name: {expertDetails.expert_name}</h5>
                        {selectedSubject && (
                            <>
                                <h5 className="selected-subject">Selected Subject: {selectedSubject.subject_name}</h5>
                            </>
                        )}
                        {selectedQSet && (
                            <>
                                <h5 className="selected-qset">Selected QSet: {selectedQSet.qset}</h5>
                                <h5 className="qset-student-count">Student Count: {selectedQSet.incomplete_count}/{selectedQSet.total_count}</h5>
                            </>
                        )}
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
