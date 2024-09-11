import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDownloads, setShowDownloads] = useState(false);
    const [showDashboards, setShowDashboards] = useState(false);

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

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-brand">Center Admin</Link>
                <button className="navbar-toggler" onClick={toggleMenu}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
                    <Link to="/home" className="navbar-item">Home</Link>
                    <div className="navbar-item has-dropdown">
                        <button className="navbar-link" onClick={() => handleDropdownClick('downloads')}>
                            Downloads
                        </button>
                        <div className={`navbar-dropdown ${showDownloads ? 'is-active' : ''}`}>
                            <Link to="/attendance-download" className="navbar-item">PDFs</Link>
                        </div>
                    </div>
                    <div className="navbar-item has-dropdown">
                        <button className="navbar-link" onClick={() => handleDropdownClick('dashboards')}>
                            Dashboards
                        </button>
                        <div className={`navbar-dropdown ${showDashboards ? 'is-active' : ''}`}>
                            <Link to="/student-table" className="navbar-item">Track Students Exam</Link>
                        </div>
                    </div>
                    <Link to="/controller-password" className="navbar-item">Controller-Password</Link>
                    <Link to="/fetch-pc-registration" className="navbar-item">PC Registrations</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;