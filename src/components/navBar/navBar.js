import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navBar.css'; // Import custom CSS

const NavBar = () => {
    const [showDownloads, setShowDownloads] = useState(false);
    const [showDashboards, setShowDashboards] = useState(false);

    const handleDownloadsClick = () => {
        setShowDownloads(!showDownloads);
        setShowDashboards(false);
    };

    const handleDashboardsClick = () => {
        setShowDashboards(!showDashboards);
        setShowDownloads(false);
    };

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-light">
            <Link to="/home" className="navbar-brand">Center Admin</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/home" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <button className="nav-link dropdown-toggle btn btn-link" onClick={handleDownloadsClick} aria-expanded={showDownloads}>
                            Downloads
                        </button>
                        {showDownloads && (
                            <div className="dropdown-menu show">
                                <Link to="/attendance-download" className="dropdown-item">pdfs</Link>
                                
                            </div>
                        )}
                    </li>
                    <li className="nav-item dropdown">
                        <button className="nav-link dropdown-toggle btn btn-link" onClick={handleDashboardsClick} aria-expanded={showDashboards}>
                            Dashboards
                        </button>
                        {showDashboards && (
                            <div className="dropdown-menu show">
                                <Link to="/student-table" className="dropdown-item">Track Students Exam</Link>
                                <Link className="dropdown-item">Centerwise Student Count</Link>
                            </div>
                        )}
                    </li>
                    <li className="nav-item">
                        <Link to="/controller-password" className="nav-link">Controller-Password</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
