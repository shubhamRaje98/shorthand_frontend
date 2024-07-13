import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './expertDash.css'; // Import the CSS file
import { useNavigate, Outlet } from 'react-router-dom'; // Import the useNavigate hook
// import FinalPassage from './finalPassageTextlog'; // Import the FinalStudentPassage component

const ExpertDashboard = () => {
    const [expertDetails, setExpertDetails] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expertResponse, itemsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/expert-details', { withCredentials: true }),
                    axios.get('http://localhost:3000/expert-assignments', { withCredentials: true })
                ]);

                if (expertResponse.status === 200) {
                    setExpertDetails(expertResponse.data);
                }

                if (itemsResponse.status === 200) {
                    setItems(itemsResponse.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const handleButtonClick = (studentId) => {
        setSelectedStudentId(studentId);
        navigate(`/expertDashboard/student-passages/${studentId}`); // Navigate with parameterized URL
    };

    const handleBackClick = () => {
        setSelectedStudentId(null);
    };

    return (
        <div className="dashboard-container">
            <div className="box">
                {selectedStudentId && (
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
                {selectedStudentId ? (
                    <Outlet />
                ) : (
                    items.length > 0 ? (
                        items.map((item, index) => (
                            <button
                                key={index}
                                className={`item-button ${selectedStudentId === item.student_id ? 'selected' : ''}`}
                                onClick={() => handleButtonClick(item.student_id)}
                            >
                                <div className="item-title">{item.student_id}</div>
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
