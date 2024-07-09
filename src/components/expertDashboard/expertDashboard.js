import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './expertDash.css'; // Import the CSS file

const ExpertDashboard = () => {
    const [expertDetails, setExpertDetails] = useState(null);

    useEffect(() => {
        const fetchExpertDetails = async () => {
            try {
                const response = await axios.get('http://localhost:3000/expert-details', {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setExpertDetails(response.data);
                }
            } catch (err) {
                console.error('Error fetching expert details:', err);
            }
        };

        fetchExpertDetails();
    }, []);

    // Static content for demonstration purposes
    const staticItems = [
        { title: 'Item 1', description: 'Description for item 1' },
        { title: 'Item 2', description: 'Description for item 2' },
        { title: 'Item 3', description: 'Description for item 3' },
        { title: 'Item 4', description: 'Description for item 4' },
        { title: 'Item 5', description: 'Description for item 5' },
        { title: 'Item 6', description: 'Description for item 6' },
        { title: 'Item 7', description: 'Description for item 7' },
    ];

    return (
        <div className="dashboard-container">
            <div className="box">
                {expertDetails ? (
                    <div className="expert-details">
                        <h4 className="expert-id">Expert ID: {expertDetails.expertId}</h4>
                        <h4 className="expert-name">Expert Name: {expertDetails.expert_name}</h4>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="box dynamic-content">
                {staticItems.length > 0 ? (
                    staticItems.map((item, index) => (
                        <div key={index} className="item">
                            <div className="item-title">{item.title}</div>
                            <div className="item-description">{item.description}</div>
                        </div>
                    ))
                ) : (
                    <p>Loading items...</p>
                )}
            </div>
        </div>
    );
};

export default ExpertDashboard;
