// expertAdmin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpertAdmin = () => {
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://13.127.206.181:3000/get-student-passages', { studentId }, { withCredentials: true });
            
            if (response.status === 200 && response.data) {
                const { subjectId, qset } = response.data;
                navigate(`/expertDashboard/${subjectId}/${qset}`);
            } else {
                setError('No matching record found for this Student ID');
            }
        } catch (err) {
            console.error('Error fetching student details:', err);
            setError('An error occurred while fetching student details');
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
                {message && <p className="success-message">{message}</p>}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default ExpertAdmin;