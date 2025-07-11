import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExpertLogin.css';

const ExpertLogin = () => {
    const [expertId, setExpertCode] = useState('');
    const [password, setExpertPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://www.shorthandonlineexam.in/expert-login', {
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
        <div className="expert-login-container">
            <form onSubmit={handleLogin} className="expert-login-form">
                <h2 className="expert-login-title">Expert Login</h2>
                <div className="expert-form-group">
                    <label htmlFor="expertId" className="expert-form-label">Expert Code</label>
                    <input
                        type="text"
                        id="expertId"
                        className="expert-form-input"
                        value={expertId}
                        onChange={(e) => setExpertCode(e.target.value)}
                        required
                    />
                </div>
                <div className="expert-form-group">
                    <label htmlFor="password" className="expert-form-label">Expert Password</label>
                    <input
                        type="password"
                        id="password"
                        className="expert-form-input"
                        value={password}
                        onChange={(e) => setExpertPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="expert-error-message">{error}</p>}
                <button type="submit" className="expert-submit-btn">Login</button>
            </form>
        </div>
    );
};

export default ExpertLogin;