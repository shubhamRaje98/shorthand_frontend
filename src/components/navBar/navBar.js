import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navBar.css';
import logo from './../../Logo.ico'; // Import the logo

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDownloads, setShowDownloads] = useState(false);
    const [showDashboards, setShowDashboards] = useState(false);
    const [centerDetails, setCenterDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Used for navigation

    useEffect(() => {
        const fetchCenterDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/get-center-details`);

                if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
                    setCenterDetails(response.data.examCenterDTO[0]);
                } else {
                    setCenterDetails(null);
                    console.log("No center details found");
                }
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch center details');
                console.error("Error fetching center details:", error);
                setLoading(false);
            }
        };

        fetchCenterDetails();
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleDropdownClick = (dropdown) => {
        if (dropdown === 'downloads') {
            setShowDownloads(!showDownloads);
            setShowDashboards(false);
        } else if (dropdown === 'dashboards') {
            setShowDashboards(!showDashboards);
            setShowDownloads(false);
        }
    };

    const handleLogout = () => {
        // Logic to handle user logout
        console.log("User logged out");
        // Redirect to login page after logout
        navigate('/');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <nav className="ca-navbar">
            <div className="ca-navbar__container">
                <div className="ca-navbar__logo-section">
                    <img src={logo} alt="Logo" className="ca-navbar__logo" />
                    <div className="ca-navbar__logo-text">
                        <strong>MSCE PUNE COMPUTER SKILLTEST</strong><br />
                        <span>{centerDetails.center} - {centerDetails.center_name}</span>
                    </div>
                </div>
                <button className={`ca-navbar__toggler ${isMenuOpen ? 'is-active' : ''}`} onClick={toggleMenu}>
                    <span className="ca-navbar__toggler-icon"></span>
                </button>
                <div className={`ca-navbar__menu ${isMenuOpen ? 'is-active' : ''}`}>
                    <Link to="/home" className="ca-navbar__item">Home</Link>
                    <div className="ca-navbar__item ca-navbar__has-dropdown">
                        <button className="ca-navbar__link" onClick={() => handleDropdownClick('downloads')}>
                            Downloads
                        </button>
                        <div className={`ca-navbar__dropdown ${showDownloads ? 'is-active' : ''}`}>
                            <Link to="/attendance-download" className="ca-navbar__dropdown-item">Reports</Link>
                            <Link to="/download-apps" className="ca-navbar__dropdown-item">Download Software</Link>
                        </div>
                    </div>
                    <div className="ca-navbar__item ca-navbar__has-dropdown">
                        <button className="ca-navbar__link" onClick={() => handleDropdownClick('dashboards')}>
                            Dashboards
                        </button>
                        <div className={`ca-navbar__dropdown ${showDashboards ? 'is-active' : ''}`}>
                            <Link to="/student-table" className="ca-navbar__dropdown-item">Track Students Exam</Link>
                        </div>
                    </div>
                    <Link to="/controller-password" className="ca-navbar__item">Controller-Password</Link>
                    <Link to="/fetch-pc-registration" className="ca-navbar__item">PC Registrations</Link>
                    {/* Logout Button */}
                    <button className=" ca-navbar__logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
