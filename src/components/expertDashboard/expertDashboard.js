// expertDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './expertDash.css';
import { useNavigate, Outlet, useParams } from 'react-router-dom';

const ExpertDashboard = () => {
    const [expertDetails, setExpertDetails] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const navigate = useNavigate();
    const { subjectId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expertResponse, subjectsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/expert-details', { withCredentials: true }),
                    axios.get('http://localhost:3000/all-subjects', { withCredentials: true })
                ]);

                if (expertResponse.status === 200) {
                    setExpertDetails(expertResponse.data);
                }

                if (subjectsResponse.status === 200) {
                    setSubjects(subjectsResponse.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (subjectId) {
            setSelectedSubject(subjectId);
        }
    }, [subjectId]);

    const handleSubjectClick = (subjectId) => {
        setSelectedSubject(subjectId);
        navigate(`/expertDashboard/${subjectId}`, {replace: true});
    };

    const handleBackClick = () => {
        setSelectedSubject(null);
        navigate('/expertDashboard', {replace: true});
    };

    return (
        <div className="dashboard-container">
            <div className="box">
                {selectedSubject && (
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
                {selectedSubject ? (
                    <Outlet />
                ) : (
                    subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <button
                                key={subject.subjectId}
                                className={`item-button ${selectedSubject === subject.subjectId ? 'selected' : ''}`}
                                onClick={() => handleSubjectClick(subject.subjectId)}
                            >
                                <div className="item-title">{subject.subject_name}</div>
                            </button>
                        ))
                    ) : (
                        <p>Loading items...</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ExpertDashboard;