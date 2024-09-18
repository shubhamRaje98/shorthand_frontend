import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuperAdminLogin = () => {
    const [userId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/admin_login', {
                userId,
                password
            }, {
                withCredentials: true
            });
            if (response.status === 200 && userId == 'pune') {
                navigate('/super-admin-track-dashboard');
            }
            else if(response.status === 200){
                navigate('/superAdminDashboard')
            }
        } catch (err) {
            setError('Invalid Admin ID or Password');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Super Admin Login</h2>
                <div className="form-group">
                    <label htmlFor="adminId">Admin ID</label>
                    <input
                        type="text"
                        id="adminId"
                        className="form-control"
                        value={userId}
                        onChange={(e) => setAdminId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default SuperAdminLogin;