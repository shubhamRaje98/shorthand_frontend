// NavBar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

    useEffect(() => {
        const fetchCenterDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/get-center-details`);
                // console.log("API Response:", response.data[0].examCenterDTO[0]);

                if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
                    setCenterDetails(response.data.examCenterDTO[0]);
                    localStorage.setItem("center",response.data.examCenterDTO[0].center);
                    // console.log("Center details:", response.data[0]);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <nav className="ca-navbar">
        <div className="ca-navbar-container">
            <div className="ca-navbar-logo">
                <img src={logo} alt="Logo" className="ca-logo" />
                <div className="ca-logo-text">
                    <strong>MSCE PUNE COMPUTER SKILLTEST</strong><br />
                    <span>{centerDetails.center} - {centerDetails.center_name}</span>
                </div>
            </div>
                <button className={`ca-navbar-toggler ${isMenuOpen ? 'is-active' : ''}`} onClick={toggleMenu}>
                    <span className="ca-navbar-toggler-icon"></span>
                </button>
                <div className={`ca-navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
                    <div className="ca-navbar-brand-container">
                        {/* <Link to="/home" className="ca-navbar-brand">Center Admin</Link> */}
                        {/* {centerDetails && centerDetails.center_name && (
                            <span className="ca-center-name">{centerDetails.center_name}</span>
                        )} */}
                    </div>
                    <Link to="/home" className="ca-navbar-item">Home</Link>
                    <div className="ca-navbar-item has-dropdown">
                        <button className="ca-navbar-link" onClick={() => handleDropdownClick('downloads')}>
                            Downloads
                        </button>
                        <div className={`ca-navbar-dropdown ${showDownloads ? 'is-active' : ''}`}>
                            <Link to="/attendance-download" className="ca-navbar-item">PDFs</Link>
                            <Link to="/download-apps" className="ca-navbar-item">Download App</Link>
                        </div>
                    </div>
                    <div className="ca-navbar-item has-dropdown">
                        <button className="ca-navbar-link" onClick={() => handleDropdownClick('dashboards')}>
                            Dashboards
                        </button>
                        <div className={`ca-navbar-dropdown ${showDashboards ? 'is-active' : ''}`}>
                            <Link to="/student-table" className="ca-navbar-item">Track Students Exam</Link>
                        </div>
                    </div>
                    <Link to="/controller-password" className="ca-navbar-item">Controller-Password</Link>
                    <Link to="/fetch-pc-registration" className="ca-navbar-item">PC Registrations</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;