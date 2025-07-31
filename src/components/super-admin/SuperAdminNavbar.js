import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SuperAdminNavbar.css';

const SuperAdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminType, setAdminType] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
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
              <Link to="/super-admin/track-dashboard" onClick={closeDropdowns} className="sa-navbar__link">Track Dashboard</Link>
            </li>
          ) : (
            <>
              <li className={location.pathname === "/super-admin/dashboard" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
                <Link to="/super-admin/dashboard" onClick={closeDropdowns} className="sa-navbar__link">Dashboard</Link>
              </li>

              <li className={location.pathname === "/super-admin/halltickets-generation" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
                <Link to="/super-admin/halltickets-generation" onClick={closeDropdowns} className="sa-navbar__link">Halltickets Generation</Link>
              </li>

              <li className={location.pathname === "/super-admin/submit-done" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
                <Link to="/super-admin/submit-done" onClick={closeDropdowns} className="sa-navbar__link">Submit and Done</Link>
              </li>


              {/* Data Management Dropdown */}
              <li className="sa-navbar__item sa-navbar__item--dropdown">
                <button
                  className="sa-navbar__dropdown-toggle"
                  onClick={() => toggleDropdown('data')}
                >
                  Management
                  <span className="sa-navbar__dropdown-arrow"></span>
                </button>
                <ul className={`sa-navbar__dropdown ${activeDropdown === 'data' ? 'sa-navbar__dropdown--active' : ''}`}>
                  <li>
                    <Link to="/super-admin/fetch-update-table" onClick={closeDropdowns}>Data Update</Link>
                  </li>
                  <li>
                    <Link to="/super-admin/student-data" onClick={closeDropdowns}>Student Reset</Link>
                  </li>
                  <li>
                    <Link to="/super-admin/student-info" onClick={closeDropdowns}>Student Data</Link>
                  </li>
                  <li>
                    <Link to="/super-admin/batch-management" onClick={closeDropdowns}>Batch Management</Link>
                  </li>

                </ul>
              </li>

              {/* Expert Management Dropdown */}
              <li className="sa-navbar__item sa-navbar__item--dropdown">
                <button
                  className="sa-navbar__dropdown-toggle"
                  onClick={() => toggleDropdown('expert')}
                >
                  Expert Management
                  <span className="sa-navbar__dropdown-arrow"></span>
                </button>
                <ul className={`sa-navbar__dropdown ${activeDropdown === 'expert' ? 'sa-navbar__dropdown--active' : ''}`}>
                  <li>
                    <Link to="/super-admin/expert-review" onClick={closeDropdowns}>Expert Review</Link>
                  </li>
                  <li>
                    <Link to="/super-admin/expert-management" onClick={closeDropdowns}>Expert Management</Link>
                  </li>
                  <li>
                    <Link to="/super-admin/expert-assign" onClick={closeDropdowns}>Expert Assign</Link>
                  </li>
                  <li>
                    <Link to="/super-admin/expert-summary" onClick={closeDropdowns}>Expert Summary</Link>
                  </li>
                </ul>
              </li>

              {/* Reports Dropdown */}
              <li className="sa-navbar__item sa-navbar__item--dropdown">
                <button
                  className="sa-navbar__dropdown-toggle"
                  onClick={() => toggleDropdown('reports')}
                >
                  Reports
                  <span className="sa-navbar__dropdown-arrow"></span>
                </button>
                <ul className={`sa-navbar__dropdown ${activeDropdown === 'reports' ? 'sa-navbar__dropdown--active' : ''}`}>
                  <li>
                    <Link to="/superadmin-student-count" onClick={closeDropdowns}>Students Count</Link>
                  </li>
                  <li>
                    <Link to="/superadmin-pc" onClick={closeDropdowns}>PC Registration Count</Link>
                  </li>
                  <li>
                    <Link to="/super-admin/track-dashboard" onClick={closeDropdowns} className="sa-navbar__link">Track Dashboard</Link>
                  </li>
                </ul>
              </li>
            </>
          )}
          <li className="sa-navbar__item sa-navbar__item--logout">
            <button className="sa-navbar__logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;