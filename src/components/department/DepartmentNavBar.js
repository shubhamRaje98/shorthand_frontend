// DepartmentNavBar.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './DepartmentNavBar.css';
import logo from './../../Logo.ico'; // Make sure this path is correct

const DepartmentNavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [departmentDetails, setDepartmentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartmentDetails = async () => {
            try {
                const response = await axios.get(`http://43.205.192.129:3000/get-department-details`);
                if (response.data) {
                    console.log(response.data.departmentDetails)
                    setDepartmentDetails(response.data.departmentDetails);
                    console.log(departmentDetails);
                }
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch department details');
                console.error("Error fetching department details:", error);
                setLoading(false);
            }
        };

        fetchDepartmentDetails();
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        console.log("Department user logged out");
        navigate('/department-login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <nav className="dept-navbar">
            <div className="dept-navbar__container">
                <div className="dept-navbar__logo-section">
                    <img
                        src={`data:image/png;base64,${departmentDetails?.logo}`||logo}
                        alt="Logo"
                        className="dept-navbar__logo"
                    />
                    <div className="dept-navbar__logo-text">
                        <strong>MSCE PUNE COMPUTER EXAMINATION</strong><br />
                        <span>{departmentDetails?.departmentName || 'Department'}</span>
                    </div>
                </div>
                <button className={`dept-navbar__toggler ${isMenuOpen ? 'is-active' : ''}`} onClick={toggleMenu}>
                    <span className="dept-navbar__toggler-icon"></span>
                </button>
                <div className={`dept-navbar__menu ${isMenuOpen ? 'is-active' : ''}`}>
                    <Link to="/department-dashboard" className="dept-navbar__menu-item">Dashboard</Link>
                    <Link to="/pc-registration-count" className="dept-navbar__menu-item">PC Registration Count</Link>
                    <Link to="/department-student-count" className="dept-navbar__menu-item">Department Student Count</Link>
                    <button className="dept-navbar__logout-button dept-navbar__menu-item" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default DepartmentNavBar;