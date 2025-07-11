// expertAdmin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExpertAdmin = () => {
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (studentId) {
            try {
                const response = await axios.post('https://www.shorthandonlineexam.in/get-student-passages', { studentId }, { withCredentials: true });
                if (response.status === 200 && response.data) {
                    if (response.data.expertId === 8 || response.data.expertId === 100){
                        const {subjectId, qset } = response.data;
                        navigate(`/expertDashboard/${subjectId}/${qset}/${studentId}`);
                    }
                    else if(response.data.expertId === 101){
                        const {subjectId, qset } = response.data;
                        navigate(`/student-assignment-report/${subjectId}/${qset}/${studentId}`);
                    }
                } else {
                    setError('No matching record found for this Student ID');
                }
            } catch (err) {
                console.error('Error fetching student passages:', err);
                setError('Error fetching student data. Please try again.');
            }
        } else {
            setError('Please enter the Student ID');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Expert Admin Dashboard</h2>
                <div className="form-group">
                    <label htmlFor="studentId">Student ID</label>
                    <input
                        type="text"
                        id="studentId"
                        className="form-control"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default ExpertAdmin;