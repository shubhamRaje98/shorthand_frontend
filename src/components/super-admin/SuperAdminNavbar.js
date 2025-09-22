// //shorthand_frontend\src\components\super-admin\SuperAdminNavbar.js

// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import './SuperAdminNavbar.css';

// const SuperAdminNavbar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [adminType, setAdminType] = useState('');
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [backupAvailable, setBackupAvailable] = useState(true);

//   useEffect(() => {
//     const storedAdminType = localStorage.getItem('adminType');
//     if (storedAdminType) {
//       setAdminType(storedAdminType);
//     } else {
//       navigate('/admin-login');
//     }
//   }, [navigate]);

//   // Simple backup status check - we'll assume it's available initially
//   // and handle any errors in the actual backup page
//   useEffect(() => {
//     if (adminType && adminType !== 'trackAdmin') {
//       // We'll assume backup is available and handle errors on the backup page
//       setBackupAvailable(true);
//     }
//   }, [adminType]);

//   const handleLogout = () => {
//     localStorage.removeItem('adminType');
//     navigate('/admin-login');
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const toggleDropdown = (dropdownName) => {
//     setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
//   };

//   const closeDropdowns = () => {
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   return (
//     <nav className="sa-navbar">
//       <div className="sa-navbar__container">
//         <div className="sa-navbar__brand">Super Admin Panel</div>
//         <button className="sa-navbar__menu-toggle" onClick={toggleMenu}>
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>
//         <ul className={`sa-navbar__nav ${isMenuOpen ? 'sa-navbar__nav--active' : ''}`}>
//           {adminType === 'trackAdmin' ? (
//             <li className={location.pathname === "/super-admin/track-dashboard" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
//               <Link to="/super-admin/track-dashboard" onClick={closeDropdowns} className="sa-navbar__link">Track Dashboard</Link>
//             </li>
//           ) : (
//             <>
//               <li className={location.pathname === "/super-admin/dashboard" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
//                 <Link to="/super-admin/dashboard" onClick={closeDropdowns} className="sa-navbar__link">Dashboard</Link>
//               </li>

//               <li className={location.pathname === "/super-admin/halltickets-generation" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
//                 <Link to="/super-admin/halltickets-generation" onClick={closeDropdowns} className="sa-navbar__link">Halltickets Generation</Link>
//               </li>

//               <li className={location.pathname === "/super-admin/submit-done" ? "sa-navbar__item sa-navbar__item--active" : "sa-navbar__item"}>
//                 <Link to="/super-admin/submit-done" onClick={closeDropdowns} className="sa-navbar__link">Submit and Done</Link>
//               </li>

//               {/* Data Management Dropdown */}
//               <li className="sa-navbar__item sa-navbar__item--dropdown">
//                 <button
//                   className="sa-navbar__dropdown-toggle"
//                   onClick={() => toggleDropdown('data')}
//                 >
//                   Management
//                   <span className="sa-navbar__dropdown-arrow"></span>
//                 </button>
//                 <ul className={`sa-navbar__dropdown ${activeDropdown === 'data' ? 'sa-navbar__dropdown--active' : ''}`}>
//                   <li>
//                     <Link to="/super-admin/fetch-update-table" onClick={closeDropdowns}>Data Update</Link>
//                   </li>
//                   <li>
//                     <Link to="/super-admin/student-data" onClick={closeDropdowns}>Student Reset</Link>
//                   </li>
//                   <li>
//                     <Link to="/super-admin/student-info" onClick={closeDropdowns}>Student Data</Link>
//                   </li>
//                   <li>
//                     <Link to="/super-admin/batch-management" onClick={closeDropdowns}>Batch Management</Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/super-admin/download-backup"
//                       onClick={closeDropdowns}
//                       className={!backupAvailable ? 'disabled-link' : ''}
//                       title={!backupAvailable ? 'Backup functionality not available' : ''}
//                     >
//                       Download Backup
//                       {!backupAvailable && <span className="feature-unavailable">⚠️</span>}
//                     </Link>
//                   </li>
//                   {/* <li>
//                     <Link to="/super-admin/download-zip" onClick={closeDropdowns}>Download Zip</Link>
//                   </li> */}
//                 </ul>
//               </li>

//               {/* Expert Management Dropdown */}
//               <li className="sa-navbar__item sa-navbar__item--dropdown">
//                 <button
//                   className="sa-navbar__dropdown-toggle"
//                   onClick={() => toggleDropdown('expert')}
//                 >
//                   Expert Management
//                   <span className="sa-navbar__dropdown-arrow"></span>
//                 </button>
//                 <ul className={`sa-navbar__dropdown ${activeDropdown === 'expert' ? 'sa-navbar__dropdown--active' : ''}`}>
//                   <li>
//                     <Link to="/super-admin/expert-review" onClick={closeDropdowns}>Expert Review</Link>
//                   </li>
//                   <li>
//                     <Link to="/super-admin/expert-management" onClick={closeDropdowns}>Expert Management</Link>
//                   </li>
//                   <li>
//                     <Link to="/super-admin/expert-assign" onClick={closeDropdowns}>Expert Assign</Link>
//                   </li>
//                   <li>
//                     <Link to="/super-admin/expert-summary" onClick={closeDropdowns}>Expert Summary</Link>
//                   </li>
//                 </ul>
//               </li>

//               {/* Reports Dropdown */}
//               <li className="sa-navbar__item sa-navbar__item--dropdown">
//                 <button
//                   className="sa-navbar__dropdown-toggle"
//                   onClick={() => toggleDropdown('reports')}
//                 >
//                   Reports
//                   <span className="sa-navbar__dropdown-arrow"></span>
//                 </button>
//                 <ul className={`sa-navbar__dropdown ${activeDropdown === 'reports' ? 'sa-navbar__dropdown--active' : ''}`}>
//                   <li>
//                     <Link to="/superadmin-student-count" onClick={closeDropdowns}>Students Count</Link>
//                   </li>
//                   <li>
//                     <Link to="/superadmin-pc" onClick={closeDropdowns}>PC Registration Count</Link>
//                   </li>
//                   <li>
//                     <Link to="/super-admin/track-dashboard" onClick={closeDropdowns} className="sa-navbar__link">Track Dashboard</Link>
//                   </li>
//                 </ul>
//               </li>
//             </>
//           )}
//           <li className="sa-navbar__item sa-navbar__item--logout">
//             <button className="sa-navbar__logout" onClick={handleLogout}>Logout</button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };
// export default SuperAdminNavbar;


import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Collapse,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  DoneAll,
  Storage,
  SupervisorAccount,
  Assessment,
  Menu as MenuIcon,
  ExitToApp,
  ExpandLess,
  ExpandMore,
  CloudDownload,
  Warning,
  Update,
  RestoreFromTrash,
  Info,
  BatchPrediction,
  Reviews,
  AssignmentInd,
  Summarize,
  PeopleAlt,
  Computer,
  DirectionsRun
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(10px)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: 70,
  padding: theme.spacing(0, 2),
}));

const BrandTypography = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontWeight: 700,
  fontSize: '1.5rem',
  background: 'linear-gradient(45deg, #fff, #e3f2fd)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  margin: theme.spacing(0, 0.5),
  borderRadius: 25,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)',
  },
  ...(active && {
    background: 'rgba(255,255,255,0.2)',
    boxShadow: '0 0 20px rgba(255,255,255,0.3)',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: 3,
      background: 'linear-gradient(90deg, transparent, #fff, transparent)',
      borderRadius: '2px 2px 0 0',
    }
  })
}));

const DropdownButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  borderRadius: 25,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)',
  }
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 15,
    marginTop: theme.spacing(1),
    minWidth: 220,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease',
  borderRadius: 10,
  margin: theme.spacing(0.5, 1),
  color: 'white',
  '&:hover': {
    background: 'rgba(255,255,255,0.15)',
    transform: 'translateX(5px)',
  }
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #f40808ff, #ee5a24)',
  borderRadius: 25,
  color: 'white',
  padding: theme.spacing(1, 2.5),
  fontWeight: 700,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #ee5a24, #c44536)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(238, 90, 36, 0.4)',
  }
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: '0 25px 25px 0',
  margin: theme.spacing(0.5, 0, 0.5, 1),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateX(10px)',
  },
  ...(active && {
    background: 'rgba(255,255,255,0.2)',
    boxShadow: '0 4px 15px rgba(255,255,255,0.1)',
  })
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: 'white',
  minWidth: 45,
}));

const NestedList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

const WarningChip = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#ff9800',
    color: 'white',
  }
}));

const SuperAdminNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [backupAvailable] = useState(true);

  useEffect(() => {
    const storedAdminType = localStorage.getItem('adminType');
    if (!storedAdminType) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminType');
    navigate('/admin-login');
  };

  const handleMenuOpen = (event, menuName) => {
    setAnchorEls({ ...anchorEls, [menuName]: event.currentTarget });
  };

  const handleMenuClose = (menuName) => {
    setAnchorEls({ ...anchorEls, [menuName]: null });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleExpandToggle = (item) => {
    setExpandedItems({ ...expandedItems, [item]: !expandedItems[item] });
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = {
    management: [
      { path: '/super-admin/fetch-update-table', label: 'Data Update', icon: <Update /> },
      { path: '/super-admin/student-data', label: 'Student Reset', icon: <RestoreFromTrash /> },
      { path: '/super-admin/student-info', label: 'Student Data', icon: <Info /> },
      { path: '/super-admin/batch-management', label: 'Batch Management', icon: <BatchPrediction /> },
      { 
        path: '/super-admin/download-backup', 
        label: 'Download Backup', 
        icon: <CloudDownload />, 
        disabled: !backupAvailable,
        warning: !backupAvailable 
      }
    ],
    expert: [
      { path: '/super-admin/expert-review', label: 'Expert Review', icon: <Reviews /> },
      { path: '/super-admin/expert-management', label: 'Expert Management', icon: <SupervisorAccount /> },
      { path: '/super-admin/expert-assign', label: 'Expert Assign', icon: <AssignmentInd /> },
      { path: '/super-admin/expert-summary', label: 'Expert Summary', icon: <Summarize /> }
    ],
    reports: [
      { path: '/superadmin-student-count', label: 'Students Count', icon: <PeopleAlt /> },
      { path: '/superadmin-pc', label: 'PC Registration Count', icon: <Computer /> },
      { path: '/super-admin/track-dashboard', label: 'Track Dashboard', icon: <DirectionsRun /> }
    ]
  };

  const renderDesktopNav = () => (
    <Box display="flex" alignItems="center">
      <NavButton
        component={Link}
        to="/super-admin/dashboard"
        active={isActive('/super-admin/dashboard')}
        startIcon={<Dashboard />}
      >
        Dashboard
      </NavButton>

      <NavButton
        component={Link}
        to="/super-admin/halltickets-generation"
        active={isActive('/super-admin/halltickets-generation')}
        startIcon={<Assignment />}
      >
        Halltickets
      </NavButton>

      <NavButton
        component={Link}
        to="/super-admin/submit-done"
        active={isActive('/super-admin/submit-done')}
        startIcon={<DoneAll />}
      >
        Submit & Done
      </NavButton>

      {/* Management Dropdown */}
      <DropdownButton
        onClick={(e) => handleMenuOpen(e, 'management')}
        startIcon={<Storage />}
        endIcon={<ExpandMore />}
      >
        Management
      </DropdownButton>
      <StyledMenu
        anchorEl={anchorEls.management}
        open={Boolean(anchorEls.management)}
        onClose={() => handleMenuClose('management')}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {menuItems.management.map((item) => (
          <StyledMenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => handleMenuClose('management')}
            disabled={item.disabled}
          >
            <StyledListItemIcon>
              {item.icon}
            </StyledListItemIcon>
            <ListItemText primary={item.label} />
            {item.warning && (
              <WarningChip badgeContent={<Warning />} />
            )}
          </StyledMenuItem>
        ))}
      </StyledMenu>

      {/* Expert Management Dropdown */}
      <DropdownButton
        onClick={(e) => handleMenuOpen(e, 'expert')}
        startIcon={<SupervisorAccount />}
        endIcon={<ExpandMore />}
      >
        Expert Mgmt
      </DropdownButton>
      <StyledMenu
        anchorEl={anchorEls.expert}
        open={Boolean(anchorEls.expert)}
        onClose={() => handleMenuClose('expert')}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {menuItems.expert.map((item) => (
          <StyledMenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => handleMenuClose('expert')}
          >
            <StyledListItemIcon>
              {item.icon}
            </StyledListItemIcon>
            <ListItemText primary={item.label} />
          </StyledMenuItem>
        ))}
      </StyledMenu>

      {/* Reports Dropdown */}
      <DropdownButton
        onClick={(e) => handleMenuOpen(e, 'reports')}
        startIcon={<Assessment />}
        endIcon={<ExpandMore />}
      >
        Reports
      </DropdownButton>
      <StyledMenu
        anchorEl={anchorEls.reports}
        open={Boolean(anchorEls.reports)}
        onClose={() => handleMenuClose('reports')}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {menuItems.reports.map((item) => (
          <StyledMenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => handleMenuClose('reports')}
          >
            <StyledListItemIcon>
              {item.icon}
            </StyledListItemIcon>
            <ListItemText primary={item.label} />
          </StyledMenuItem>
        ))}
      </StyledMenu>

      <Tooltip title="Logout">
        <LogoutButton
          onClick={handleLogout}
          startIcon={<ExitToApp />}
        >
          Logout
        </LogoutButton>
      </Tooltip>
    </Box>
  );

  const renderMobileDrawer = () => (
    <StyledDrawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
    >
      <DrawerHeader>
        <BrandTypography variant="h6">
          Super Admin Panel
        </BrandTypography>
      </DrawerHeader>
      <Divider />
      
      <List>
        <StyledListItem
          button
          component={Link}
          to="/super-admin/dashboard"
          active={isActive('/super-admin/dashboard')}
          onClick={handleDrawerToggle}
        >
          <StyledListItemIcon>
            <Dashboard />
          </StyledListItemIcon>
          <ListItemText primary="Dashboard" />
        </StyledListItem>

        <StyledListItem
          button
          component={Link}
          to="/super-admin/halltickets-generation"
          active={isActive('/super-admin/halltickets-generation')}
          onClick={handleDrawerToggle}
        >
          <StyledListItemIcon>
            <Assignment />
          </StyledListItemIcon>
          <ListItemText primary="Halltickets Generation" />
        </StyledListItem>

        <StyledListItem
          button
          component={Link}
          to="/super-admin/submit-done"
          active={isActive('/super-admin/submit-done')}
          onClick={handleDrawerToggle}
        >
          <StyledListItemIcon>
            <DoneAll />
          </StyledListItemIcon>
          <ListItemText primary="Submit & Done" />
        </StyledListItem>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '8px 0' }} />

        {/* Management Section */}
        <StyledListItem button onClick={() => handleExpandToggle('management')}>
          <StyledListItemIcon>
            <Storage />
          </StyledListItemIcon>
          <ListItemText primary="Management" />
          {expandedItems.management ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem>
        <Collapse in={expandedItems.management} timeout="auto" unmountOnExit>
          <NestedList component="div">
            {menuItems.management.map((item) => (
              <StyledListItem
                key={item.path}
                button
                component={Link}
                to={item.path}
                active={isActive(item.path)}
                onClick={handleDrawerToggle}
                disabled={item.disabled}
              >
                <StyledListItemIcon>
                  {item.icon}
                </StyledListItemIcon>
                <ListItemText primary={item.label} />
                {item.warning && (
                  <WarningChip badgeContent={<Warning />} />
                )}
              </StyledListItem>
            ))}
          </NestedList>
        </Collapse>

        {/* Expert Management Section */}
        <StyledListItem button onClick={() => handleExpandToggle('expert')}>
          <StyledListItemIcon>
            <SupervisorAccount />
          </StyledListItemIcon>
          <ListItemText primary="Expert Management" />
          {expandedItems.expert ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem>
        <Collapse in={expandedItems.expert} timeout="auto" unmountOnExit>
          <NestedList component="div">
            {menuItems.expert.map((item) => (
              <StyledListItem
                key={item.path}
                button
                component={Link}
                to={item.path}
                active={isActive(item.path)}
                onClick={handleDrawerToggle}
              >
                <StyledListItemIcon>
                  {item.icon}
                </StyledListItemIcon>
                <ListItemText primary={item.label} />
              </StyledListItem>
            ))}
          </NestedList>
        </Collapse>

        {/* Reports Section */}
        <StyledListItem button onClick={() => handleExpandToggle('reports')}>
          <StyledListItemIcon>
            <Assessment />
          </StyledListItemIcon>
          <ListItemText primary="Reports" />
          {expandedItems.reports ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem>
        <Collapse in={expandedItems.reports} timeout="auto" unmountOnExit>
          <NestedList component="div">
            {menuItems.reports.map((item) => (
              <StyledListItem
                key={item.path}
                button
                component={Link}
                to={item.path}
                active={isActive(item.path)}
                onClick={handleDrawerToggle}
              >
                <StyledListItemIcon>
                  {item.icon}
                </StyledListItemIcon>
                <ListItemText primary={item.label} />
              </StyledListItem>
            ))}
          </NestedList>
        </Collapse>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '16px 0' }} />
        
        <StyledListItem button onClick={handleLogout}>
          <StyledListItemIcon>
            <ExitToApp />
          </StyledListItemIcon>
          <ListItemText primary="Logout" />
        </StyledListItem>
      </List>
    </StyledDrawer>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <BrandTypography variant="h6">
            Super Admin Panel
          </BrandTypography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            renderDesktopNav()
          )}
        </StyledToolbar>
      </StyledAppBar>
      
      {isMobile && renderMobileDrawer()}
      
      {/* Spacer for fixed AppBar */}
      <StyledToolbar />
    </>
  );
};

export default SuperAdminNavbar;