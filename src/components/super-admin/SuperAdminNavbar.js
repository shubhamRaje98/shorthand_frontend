// SuperAdminNavbar.js

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SuperAdminNavbar.css';

const SuperAdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminType, setAdminType] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedAdminType = localStorage.getItem('adminType');
    if (storedAdminType) {
      setAdminType(storedAdminType);
    } else {
      // If no admin type is found, redirect to login
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminType');
    navigate('/admin-login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="super-admin-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">Super Admin Panel</div>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
          {adminType === 'trackAdmin' ? (
            <li className={location.pathname === "/super-admin/track-dashboard" ? "active" : ""}>
              <Link to="/super-admin/track-dashboard" onClick={() => setIsMenuOpen(false)}>Track Dashboard</Link>
            </li>
          ) : (
            <>
              <li className={location.pathname === "/super-admin/dashboard" ? "active" : ""}>
                <Link to="/super-admin/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              </li>
              <li className={location.pathname === "/super-admin/fetch-update-table" ? "active" : ""}>
                <Link to="/super-admin/fetch-update-table" onClick={() => setIsMenuOpen(false)}>Data Update</Link>
              </li>
            </>
          )}
          <li className={location.pathname === "/super-admin/students-count" ? "active" : ""}>
            <Link to="/superadmin-student-count" onClick={() => setIsMenuOpen(false)}>Students Count</Link>
          </li>
          <li className={location.pathname === "/PcRegistrationCount" ? "active" : ""}>
            <Link to="/superadmin-pc" onClick={() => setIsMenuOpen(false)}>PC Registration Count</Link>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;