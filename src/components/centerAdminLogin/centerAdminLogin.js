// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [centerId, setCenterCode] = useState('');
    const [password, setCenterPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://shorthandonlineexam.in/center_admin_login', {
                centerId,
                password
            }, {
                withCredentials: true
            });
            if (response.status === 200) {
                navigate(`/home`, { replace: true });
            }
        } catch (err) {
            setError('Invalid Center Code or Password');
        }
    };

    return (
        <div className="login-container-unique">
            <form onSubmit={handleLogin} className="login-form-unique">
                <h2>Login</h2>
                <div className="form-group-unique">
                    <label htmlFor="centerId">Center Code</label>
                    <input
                        type="text"
                        id="centerId"
                        className="form-control-unique"
                        value={centerId}
                        onChange={(e) => setCenterCode(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-unique">
                    <label htmlFor="password">Center Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control-unique"
                        value={password}
                        onChange={(e) => setCenterPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message-unique">{error}</p>}
                <button type="submit" className="btn-primary-unique">Login</button>
            </form>
        </div>
    );
};

export default Login;
