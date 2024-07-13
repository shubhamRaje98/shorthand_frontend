import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './finalPassageTextlog.css'; // Import the CSS file
import { useParams } from 'react-router-dom'; // Import useParams to get the URL parameter

const FinalPassageTextlog = () => {
    const { studentId } = useParams(); // Get the studentId from the URL
    const [passages, setPassages] = useState({ passageA: '', passageB: '' });

    useEffect(() => {
        const fetchPassages = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/student-passages/${studentId}`, { withCredentials: true });
                if (response.status === 200) {
                    console.log("Raw passageA:", JSON.stringify(response.data.passageA));
                    setPassages(response.data);
                }
            } catch (err) {
                console.error('Error fetching passages:', err);
            }
        };
    
        fetchPassages();
    }, [studentId]);

    return (
        <div className="final-passage-container">
            <div className="grid-item">Column 1 Content for Student ID: {studentId}</div>
            <div className="grid-item">
                <pre className="preformatted-text">{passages.passageA}</pre>
            </div>
            <div className="grid-item">Column 3 Content</div>
        </div>
    );
};

export default FinalPassageTextlog;
