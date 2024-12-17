import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SuperAdminLogin.css';

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
            if (response.status === 200) {
                if (userId === '1234') {
                    localStorage.setItem('adminType', 'trackAdmin');
                    navigate('/super-admin/track-dashboard');
                } else {
                    localStorage.setItem('adminType', 'regularAdmin');
                    navigate('/super-admin/dashboard');
                }
            }
        } catch (err) {
            setError('Invalid Admin ID or Password');
        }
    };

    return (
        <div className="sa-login-container">
            <div className="sa-login-card">
                <form onSubmit={handleLogin} className="sa-login-form">
                    <h2 className="sa-login-title">Super Admin Login</h2>
                    <div className="sa-form-group">
                        <label htmlFor="adminId" className="sa-form-label">Admin ID</label>
                        <input
                            type="text"
                            id="adminId"
                            className="sa-form-input"
                            value={userId}
                            onChange={(e) => setAdminId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="sa-form-group">
                        <label htmlFor="password" className="sa-form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="sa-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="sa-error-message">{error}</p>}
                    <button type="submit" className="sa-login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminLogin;