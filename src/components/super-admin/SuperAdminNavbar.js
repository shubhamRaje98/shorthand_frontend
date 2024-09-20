import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SuperAdminNavbar.css';

const SuperAdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminType, setAdminType] = useState('');

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

  return (
    <nav className="super-admin-navbar">
      <div className="navbar-brand">Super Admin Panel</div>
      <ul className="navbar-nav">
        {adminType === 'trackAdmin' ? (
          <li className={location.pathname === "/super-admin/track-dashboard" ? "active" : ""}>
            <Link to="/super-admin/track-dashboard">Track Dashboard</Link>
          </li>
        ) : (
          <>
            <li className={location.pathname === "/super-admin/dashboard" ? "active" : ""}>
              <Link to="/super-admin/dashboard">Dashboard</Link>
            </li>
            <li className={location.pathname === "/super-admin/fetch-update-table" ? "active" : ""}>
              <Link to="/super-admin/fetch-update-table">Data Update</Link>
            </li>
          </>
        )}
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default SuperAdminNavbar;