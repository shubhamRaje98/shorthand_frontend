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
    <nav className="sa-navbar">
      <div className="sa-navbar__container">
        <div className="sa-navbar__brand">Super Admin Panel</div>
        <button className="sa-navbar__menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`sa-navbar__nav ${isMenuOpen ? 'sa-navbar__nav--active' : ''}`}>
          {adminType === 'trackAdmin' ? (
            <li className={location.pathname === "/super-admin/track-dashboard" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
              <Link to="/super-admin/track-dashboard" onClick={() => setIsMenuOpen(false)} className="sa-navbar__link">Track Dashboard</Link>
            </li>
          ) : (
            <>
              <li className={location.pathname === "/super-admin/dashboard" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
                <Link to="/super-admin/dashboard" onClick={() => setIsMenuOpen(false)} className="sa-navbar__link">Dashboard</Link>
              </li>
              <li className={location.pathname === "/super-admin/fetch-update-table" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
                <Link to="/super-admin/fetch-update-table" onClick={() => setIsMenuOpen(false)} className="sa-navbar__link">Data Update</Link>
              </li>
            </>
          )}
          <li className={location.pathname === "/super-admin/students-count" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
            <Link to="/superadmin-student-count" onClick={() => setIsMenuOpen(false)} className="sa-navbar__link">Students Count</Link>
          </li>
          <li className={location.pathname === "/PcRegistrationCount" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
            <Link to="/superadmin-pc" onClick={() => setIsMenuOpen(false)} className="sa-navbar__link">PC Registration Count</Link>
          </li>
          <li className={location.pathname === "/student-data" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
            <Link to="/super-admin/student-data" onClick={() => setIsMenuOpen(false)} className="sa-navbar__link">Student Data</Link>
          </li>
          <li className="sa-navbar__item sa-navbar__item--logout">
            <button className="sa-navbar__logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;