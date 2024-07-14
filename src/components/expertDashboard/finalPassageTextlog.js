import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './finalPassageTextlog.css';
import { useParams } from 'react-router-dom';

const FinalPassageTextlog = () => {
    const { studentId } = useParams();
    const [passages, setPassages] = useState({ 
        passageA: '', 
        passageB: '', 
        ansPassageA: '', 
        ansPassageB: '' 
    });
    const [activePassage, setActivePassage] = useState('A');

    useEffect(() => {
        const fetchPassages = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/student-passages/${studentId}`, { withCredentials: true });
                if (response.status === 200) {
                    console.log("Raw data:", JSON.stringify(response.data));
                    setPassages(response.data);
                }
            } catch (err) {
                console.error('Error fetching passages:', err);
            }
        };
    
        fetchPassages();
    }, [studentId]);

    const handlePassageChange = (passage) => {
        setActivePassage(passage);
    };

    return (
        <div className="final-passage-container">
            <div className="passage-buttons">
                <button 
                    className={`passage-button ${activePassage === 'A' ? 'active' : ''}`}
                    onClick={() => handlePassageChange('A')}
                >
                    Passage A
                </button>
                <button 
                    className={`passage-button ${activePassage === 'B' ? 'active' : ''}`}
                    onClick={() => handlePassageChange('B')}
                >
                    Passage B
                </button>
            </div>
            <div className="grid-item">
                <h2 className="column-header">Model Answer</h2>
                <pre className="preformatted-text">{passages[`ansPassage${activePassage}`]}</pre>
            </div>
            <div className="grid-item">
                <h2 className="column-header">Difference Passage</h2>
                <pre className="preformatted-text">{passages[`passage${activePassage}`]}</pre>
            </div>
            <div className="grid-item">
                <h2 className="column-header">Ignore Words</h2>
                <div>Column 3 Content</div>
            </div>
        </div>
    );
};

export default FinalPassageTextlog;