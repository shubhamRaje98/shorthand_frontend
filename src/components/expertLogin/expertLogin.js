//expertLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExpertLogin = () => {
    const [expertId, setExpertCode] = useState('');
    const [password, setExpertPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/expert-login', {
                expertId,
                password
            }, {
                withCredentials: true
            });
            if (response.status === 200) {
                if (response.data.expertId === 8 || response.data.expertId === 100 || response.data.expertId === 101){
                    navigate(`/expertAdmin`);
                }
                else{
                    navigate(`/expertDashboard`);
                }
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
                    <label htmlFor="expertId">Expert Code</label>
                    <input
                        type="text"
                        id="expertId"
                        className="form-control"
                        value={expertId}
                        onChange={(e) => setExpertCode(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Expert Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setExpertPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default ExpertLogin;
