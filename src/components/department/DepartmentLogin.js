//expertLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DepartmentLogin = () => {
    const [departmentId, setDepartmentId] = useState(0);
    const [password, setDepartmentPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/department-login', {
                departmentId,
                password
            }, {
                withCredentials: true
            });
            if (response.data) {
               alert(response.data);
            }
        } catch (err) {
            setError('Invalid Expert Code or Password');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Expert Login</h2>
                <div className="form-group">
                    <label htmlFor="expertId">Department Code</label>
                    <input
                        type="text"
                        id="expertId"
                        className="form-control"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Department Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setDepartmentPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default DepartmentLogin;
