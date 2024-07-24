import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExpertAdmin = () => {
    const [studentId, setStudentId] = useState('');
    const [subjectId, setSubjectId] = useState(''); // Add this line
    const [qset, setQset] = useState(''); // Add this line
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (studentId && subjectId && qset) { // Check all required fields
            navigate(`/expertDashboard/${subjectId}/${qset}/${studentId}`);
        } else {
            setError('Please enter all required fields');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Expert Admin Dashboard</h2>
                <div className="form-group">
                    <label htmlFor="subjectId">Subject ID</label>
                    <input
                        type="text"
                        id="subjectId"
                        className="form-control"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="qset">QSet</label>
                    <input
                        type="text"
                        id="qset"
                        className="form-control"
                        value={qset}
                        onChange={(e) => setQset(e.target.value)}
                        required
                    />
                </div>
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