import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DepartmentLogin.css';  // Import the CSS file

const DepartmentLogin = () => {
    const [departmentId, setDepartmentId] = useState('');
    const [password, setDepartmentPassword] = useState('');
    const [error, setError] = useState('');
     const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://www.shorthandonlineexam.in/department-login', {
                departmentId,
                password
            }, {
                withCredentials: true
            });
            if (response.data) {
                console.log(response.data)
                navigate("/department-dashboard");
               alert(response.data.message);
            }
        } catch (err) {
            setError('Invalid Department code or Password');
        }
    };

    return (
        <div className="department-login-container">
            <div className="department-content-wrapper">
                <form onSubmit={handleLogin} className="department-login-form">
                    <h2 className="department-title">Department Login</h2>
                    <div className="department-form-group">
                        <label htmlFor="expertId" className="department-form-label">Department Code</label>
                        <input
                            type="text"
                            id="expertId"
                            className="department-form-control"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="department-form-group">
                        <label htmlFor="password" className="department-form-label">Department Password</label>
                        <input
                            type="password"
                            id="password"
                            className="department-password-control"  // Unique classname
                            value={password}
                            onChange={(e) => setDepartmentPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="department-error-message">{error}</p>}
                    <div className="department-button-group">
                        <button type="submit" className="department-login-btn">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentLogin;
