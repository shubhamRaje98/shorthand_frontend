import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExpertAdmin = () => {
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (studentId) {
            navigate(`/expertDashboard/placeholder/placeholder/${studentId}`);
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