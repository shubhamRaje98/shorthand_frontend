// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useParams, Route, Routes } from 'react-router-dom';
// // import NavBar from '../navBar/navBar';
// // import AttendanceDownload from '../attendanceDownload/attendanceDownload';
// // import AbsenteeRoll from '../attendeeRoll/attendeeRoll';
// // import TrackStudentsExam from '../studentExamTracking/StudentTable';
// // import CenterwiseStudentCount from '../centerwiseStudentExamCountTracking/centerwiseCountReport';
// // import './home.css';

// // const Home = () => {
// //     const { center } = useParams();
// //     const [centerDetails, setCenterDetails] = useState(null);
// //     const [pcCount, setPcCount] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState('');

// //     useEffect(() => {
// //         const fetchCenterDetails = async () => {
// //             try {
// //                 console.log(`Fetching details for center: ${center}`);
                
// //                 const response = await axios.get(`http://localhost:3000/get-center-details`);
// //                 console.log("API Response:", response.data);

// //                 if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
// //                     setCenterDetails(response.data.examCenterDTO[0]);
// //                     setPcCount(response.data.pcCount);
// //                     console.log("Center details:", response.data.examCenterDTO[0]);
// //                     console.log("PC Count:", response.data.pcCount);
// //                 } else {
// //                     setCenterDetails(null);
// //                     setPcCount(null);
// //                     console.log("No center details found");
// //                 }
// //                 setLoading(false);
// //             } catch (error) {
// //                 setError('Failed to fetch center details');
// //                 console.error("Error fetching center details:", error);
// //                 setLoading(false);
// //             }
// //         };

// //         fetchCenterDetails();
// //     }, [center]);

// //     if (loading) {
// //         return <p>Loading...</p>;
// //     }

// //     if (error) {
// //         return <p>{error}</p>;
// //     }

// //     return (
// //         <div className="home-wrapper">
// //             <NavBar />
// //             <div className="home-container">
// //                 <div className="content">
// //                     <Routes>
// //                         <Route path="/" element={
// //                             <div className="center-details">
// //                                 <h1>Center Admin</h1>
// //                                 {centerDetails ? (
// //                                     <div className="details-grid">
// //                                         <div className="detail-item">
// //                                             <span className="detail-label">Center Code:</span>
// //                                             <span className="detail-value">{centerDetails.center}</span>
// //                                         </div>
// //                                         <div className="detail-item">
// //                                             <span className="detail-label">Center Name:</span>
// //                                             <span className="detail-value">{centerDetails.center_name}</span>
// //                                         </div>
// //                                         <div className="detail-item">
// //                                             <span className="detail-label">Center Address:</span>
// //                                             <span className="detail-value">{centerDetails.center_address}</span>
// //                                         </div>
// //                                         <div className="detail-item">
// //                                             <span className="detail-label">Max PC:</span>
// //                                             <span className="detail-value">{centerDetails.max_pc}</span>
// //                                         </div>
// //                                         <div className="detail-item">
// //                                             <span className="detail-label">PC Count:</span>
// //                                             <span className="detail-value">{centerDetails.pc_count}</span>
// //                                         </div>
// //                                         <div className="detail-item">
// //                                             <span className="detail-label">Registered PCs:</span>
// //                                             <span className="detail-value">{pcCount}</span>
// //                                         </div>
// //                                     </div>
// //                                 ) : (
// //                                     <p className="no-details">No details available for this center.</p>
// //                                 )}
// //                             </div>
// //                         } />
// //                         <Route path="/attendance-download" element={<AttendanceDownload />} />
// //                         <Route path="/absentee-roll" element={<AbsenteeRoll />} />
// //                         <Route path="/student-table" element={<TrackStudentsExam />} />
// //                         <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
// //                     </Routes>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Home;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, Route, Routes } from 'react-router-dom';
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Paper,
//   Chip,
//   CircularProgress,
//   Alert,
//   Divider,
//   Avatar,
//   useTheme,
//   alpha
// } from '@mui/material';
// import {
//   Business as BusinessIcon,
//   LocationOn as LocationIcon,
//   Computer as ComputerIcon,
//   Assessment as AssessmentIcon,
//   CheckCircle as CheckCircleIcon,
//   Info as InfoIcon
// } from '@mui/icons-material';
// import NavBar from '../navBar/navBar';
// import AttendanceDownload from '../attendanceDownload/attendanceDownload';
// import AbsenteeRoll from '../attendeeRoll/attendeeRoll';
// import TrackStudentsExam from '../studentExamTracking/StudentTable';
// import CenterwiseStudentCount from '../centerwiseStudentExamCountTracking/centerwiseCountReport';

// const Home = () => {
//     const { center } = useParams();
//     const [centerDetails, setCenterDetails] = useState(null);
//     const [pcCount, setPcCount] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const theme = useTheme();

//     useEffect(() => {
//         const fetchCenterDetails = async () => {
//             try {
//                 console.log(`Fetching details for center: ${center}`);
                
//                 const response = await axios.get(`http://localhost:3000/get-center-details`);
//                 console.log("API Response:", response.data);
//                 if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
//                     setCenterDetails(response.data.examCenterDTO[0]);
//                     setPcCount(response.data.pcCount);
//                     console.log("Center details:", response.data.examCenterDTO[0]);
//                     console.log("PC Count:", response.data.pcCount);
//                 } else {
//                     setCenterDetails(null);
//                     setPcCount(null);
//                     console.log("No center details found");
//                 }
//                 setLoading(false);
//             } catch (error) {
//                 setError('Failed to fetch center details');
//                 console.error("Error fetching center details:", error);
//                 setLoading(false);
//             }
//         };
//         fetchCenterDetails();
//     }, [center]);

//     const getDetailIcon = (index) => {
//         const icons = [
//             <BusinessIcon sx={{ color: theme.palette.primary.main }} />,
//             <InfoIcon sx={{ color: theme.palette.secondary.main }} />,
//             <LocationIcon sx={{ color: theme.palette.success.main }} />,
//             <ComputerIcon sx={{ color: theme.palette.warning.main }} />,
//             <AssessmentIcon sx={{ color: theme.palette.info.main }} />,
//             <CheckCircleIcon sx={{ color: theme.palette.error.main }} />
//         ];
//         return icons[index] || <InfoIcon />;
//     };

//     const getDetailColor = (index) => {
//         const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
//         return colors[index] || 'primary';
//     };

//     if (loading) {
//         return (
//             <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 minHeight="100vh"
//                 sx={{
//                     background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
//                 }}
//             >
//                 <Paper
//                     elevation={8}
//                     sx={{
//                         p: 4,
//                         borderRadius: 3,
//                         textAlign: 'center',
//                         background: alpha(theme.palette.background.paper, 0.95)
//                     }}
//                 >
//                     <CircularProgress size={48} sx={{ mb: 2 }} />
//                     <Typography variant="h6" color="text.secondary">
//                         Loading Center Details...
//                     </Typography>
//                 </Paper>
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Container maxWidth="md" sx={{ mt: 4 }}>
//                 <Alert 
//                     severity="error" 
//                     variant="filled"
//                     sx={{ 
//                         borderRadius: 2,
//                         fontSize: '1.1rem'
//                     }}
//                 >
//                     {error}
//                 </Alert>
//             </Container>
//         );
//     }

//     return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
//                 pb: 4
//             }}
//         >
//             <NavBar />
            
//             <Container maxWidth="xl" sx={{ pt: 3 }}>
//                 <Routes>
//                     <Route path="/" element={
//                         <Box>
//                             {/* Header Section */}
//                             <Paper
//                                 elevation={8}
//                                 sx={{
//                                     mb: 4,
//                                     borderRadius: 3,
//                                     background: alpha(theme.palette.background.paper, 0.95),
//                                     overflow: 'hidden'
//                                 }}
//                             >
//                                 <Box
//                                     sx={{
//                                         background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//                                         color: 'white',
//                                         py: 3,
//                                         px: 4,
//                                         textAlign: 'center'
//                                     }}
//                                 >
//                                     <Avatar
//                                         sx={{
//                                             width: 64,
//                                             height: 64,
//                                             mx: 'auto',
//                                             mb: 2,
//                                             bgcolor: alpha(theme.palette.common.white, 0.2),
//                                             fontSize: '2rem'
//                                         }}
//                                     >
//                                         <BusinessIcon fontSize="large" />
//                                     </Avatar>
//                                     <Typography
//                                         variant="h3"
//                                         component="h1"
//                                         gutterBottom
//                                         sx={{
//                                             fontWeight: 700,
//                                             letterSpacing: 1,
//                                             textShadow: '0 2px 4px rgba(0,0,0,0.3)'
//                                         }}
//                                     >
//                                         Center Admin Dashboard
//                                     </Typography>
//                                     <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                                         Comprehensive Center Management System
//                                     </Typography>
//                                 </Box>
//                             </Paper>

//                             {/* Center Details Section */}
//                             {centerDetails ? (
//                                 <Paper
//                                     elevation={8}
//                                     sx={{
//                                         borderRadius: 3,
//                                         overflow: 'hidden',
//                                         background: alpha(theme.palette.background.paper, 0.95)
//                                     }}
//                                 >
//                                     <Box
//                                         sx={{
//                                             background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
//                                             py: 2,
//                                             px: 3,
//                                             borderBottom: `1px solid ${theme.palette.divider}`
//                                         }}
//                                     >
//                                         <Typography
//                                             variant="h5"
//                                             component="h2"
//                                             sx={{
//                                                 fontWeight: 600,
//                                                 color: theme.palette.primary.main,
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: 1
//                                             }}
//                                         >
//                                             <AssessmentIcon />
//                                             Center Information Overview
//                                         </Typography>
//                                     </Box>

//                                     <Box sx={{ p: 3 }}>
//                                         <Grid container spacing={3}>
//                                             {[
//                                                 { label: 'Center Code', value: centerDetails.center },
//                                                 { label: 'Center Name', value: centerDetails.center_name },
//                                                 { label: 'Center Address', value: centerDetails.center_address },
//                                                 { label: 'Maximum PC Capacity', value: centerDetails.max_pc },
//                                                 { label: 'Current PC Count', value: centerDetails.pc_count },
//                                                 { label: 'Registered PCs', value: pcCount }
//                                             ].map((detail, index) => (
//                                                 <Grid item xs={12} sm={6} md={4} key={index}>
//                                                     <Card
//                                                         elevation={4}
//                                                         sx={{
//                                                             height: '100%',
//                                                             borderRadius: 2,
//                                                             transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                                             cursor: 'pointer',
//                                                             border: `1px solid ${alpha(theme.palette[getDetailColor(index)].main, 0.2)}`,
//                                                             '&:hover': {
//                                                                 transform: 'translateY(-8px)',
//                                                                 boxShadow: theme.shadows[12],
//                                                                 borderColor: theme.palette[getDetailColor(index)].main
//                                                             }
//                                                         }}
//                                                     >
//                                                         <CardContent sx={{ p: 3 }}>
//                                                             <Box
//                                                                 sx={{
//                                                                     display: 'flex',
//                                                                     alignItems: 'center',
//                                                                     mb: 2,
//                                                                     gap: 2
//                                                                 }}
//                                                             >
//                                                                 <Avatar
//                                                                     sx={{
//                                                                         bgcolor: alpha(theme.palette[getDetailColor(index)].main, 0.1),
//                                                                         width: 48,
//                                                                         height: 48
//                                                                     }}
//                                                                 >
//                                                                     {getDetailIcon(index)}
//                                                                 </Avatar>
//                                                                 <Box sx={{ flex: 1 }}>
//                                                                     <Typography
//                                                                         variant="body2"
//                                                                         color="text.secondary"
//                                                                         sx={{
//                                                                             textTransform: 'uppercase',
//                                                                             fontSize: '0.75rem',
//                                                                             fontWeight: 600,
//                                                                             letterSpacing: 1
//                                                                         }}
//                                                                     >
//                                                                         {detail.label}
//                                                                     </Typography>
//                                                                 </Box>
//                                                             </Box>
                                                            
//                                                             <Divider sx={{ my: 2 }} />
                                                            
//                                                             <Box sx={{ textAlign: 'center' }}>
//                                                                 <Chip
//                                                                     label={detail.value || 'N/A'}
//                                                                     color={getDetailColor(index)}
//                                                                     variant="outlined"
//                                                                     sx={{
//                                                                         fontSize: '1rem',
//                                                                         fontWeight: 600,
//                                                                         height: 'auto',
//                                                                         py: 1,
//                                                                         px: 2,
//                                                                         '& .MuiChip-label': {
//                                                                             px: 1
//                                                                         }
//                                                                     }}
//                                                                 />
//                                                             </Box>
//                                                         </CardContent>
//                                                     </Card>
//                                                 </Grid>
//                                             ))}
//                                         </Grid>
//                                     </Box>
//                                 </Paper>
//                             ) : (
//                                 <Paper
//                                     elevation={4}
//                                     sx={{
//                                         p: 6,
//                                         textAlign: 'center',
//                                         borderRadius: 3,
//                                         background: alpha(theme.palette.background.paper, 0.95)
//                                     }}
//                                 >
//                                     <Avatar
//                                         sx={{
//                                             width: 80,
//                                             height: 80,
//                                             mx: 'auto',
//                                             mb: 3,
//                                             bgcolor: alpha(theme.palette.warning.main, 0.1)
//                                         }}
//                                     >
//                                         <InfoIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
//                                     </Avatar>
//                                     <Typography
//                                         variant="h5"
//                                         color="text.secondary"
//                                         sx={{ fontWeight: 500 }}
//                                     >
//                                         No Center Details Available
//                                     </Typography>
//                                     <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//                                         Please check your center configuration or contact support.
//                                     </Typography>
//                                 </Paper>
//                             )}
//                         </Box>
//                     } />
//                     <Route path="/attendance-download" element={<AttendanceDownload />} />
//                     <Route path="/absentee-roll" element={<AbsenteeRoll />} />
//                     <Route path="/student-table" element={<TrackStudentsExam />} />
//                     <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
//                 </Routes>
//             </Container>
//         </Box>
//     );
// };

// export default Home;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Container,
  Paper,
  Stack,
  LinearProgress,
  Tooltip,
  Alert,
  Fade,
  useTheme,
  alpha,
  createTheme,
  ThemeProvider
} from '@mui/material';
import {
  Computer as ComputerIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  CloudDownload as CloudDownloadIcon,
  TrackChanges as TrackChangesIcon,
  Refresh as RefreshIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

import NavBar from '../navBar/navBar';
import AttendanceDownload from '../attendanceDownload/attendanceDownload';
import AbsenteeRoll from '../attendeeRoll/attendeeRoll';
import TrackStudentsExam from '../studentExamTracking/StudentTable';
import CenterwiseStudentCount from '../centerwiseStudentExamCountTracking/centerwiseCountReport';

// Light theme with soft, pleasant colors
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Soft blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0', // Soft purple
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32', // Soft green
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02', // Soft orange
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1', // Light blue
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    }
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    }
  }
});

const StatisticsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary', 
  trend, 
  trendValue,
  onClick 
}) => {
  const theme = useTheme();
  
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        background: alpha(theme.palette[color].main, 0.04),
        border: `1px solid ${alpha(theme.palette[color].main, 0.12)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        transform: 'translateY(0)',
        boxShadow: `0 2px 12px ${alpha(theme.palette[color].main, 0.08)}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.16)}`,
          borderColor: alpha(theme.palette[color].main, 0.24),
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between',
          height: '100%'
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: `${color}.main`, 
                mb: 1,
                fontSize: '2.5rem'
              }}
            >
              {value}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 600, 
                mb: 0.5 
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                lineHeight: 1.5
              }}
            >
              {subtitle}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                <TrendingUpIcon 
                  fontSize="small" 
                  color={trend === 'up' ? 'success' : 'error'} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 0.5, 
                    color: trend === 'up' ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
              width: 56,
              height: 56,
              border: `2px solid ${alpha(theme.palette[color].main, 0.12)}`,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette[color].main, 0.12)}`,
        transition: 'all 0.3s ease-in-out',
        transform: 'translateY(0)',
        background: alpha(theme.palette[color].main, 0.02),
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.15)}`,
          borderColor: alpha(theme.palette[color].main, 0.25),
          background: alpha(theme.palette[color].main, 0.04),
        }
      }}
    >
      <CardContent 
        sx={{ 
          p: 3.5, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: `${color}.main`,
            width: 64,
            height: 64,
            mb: 2.5,
            border: `2px solid ${alpha(theme.palette[color].main, 0.12)}`,
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary', 
            lineHeight: 1.6,
            textAlign: 'center',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const { center } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [centerDetails, setCenterDetails] = useState(null);
  const [pcCount, setPcCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCenterDetails = async () => {
      try {
        console.log(`Fetching details for center: ${center}`);
        
        const response = await axios.get(`http://localhost:3000/get-center-details`);
        console.log("API Response:", response.data);
        
        if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
          setCenterDetails(response.data.examCenterDTO[0]);
          setPcCount(response.data.pcCount);
          console.log("Center details:", response.data.examCenterDTO[0]);
          console.log("PC Count:", response.data.pcCount);
        } else {
          setCenterDetails(null);
          setPcCount(null);
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
  }, [center]);

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  // Updated quick actions - removed "Absentee Roll" and "Center Analytics"
  const quickActions = [
    {
      title: "Attendance Download",
      description: "Download comprehensive student attendance reports and export data in various formats",
      icon: CloudDownloadIcon,
      color: "primary",
      path: "/attendance-download"
    },
    {
      title: "Track Students",
      description: "Monitor real-time student exam progress and performance analytics dashboard",
      icon: TrackChangesIcon,
      color: "info",
      path: "/student-table"
    }
  ];

  if (loading) {
    return (
      <ThemeProvider theme={lightTheme}>
        <Box 
          sx={{ 
            width: '100%', 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.default'
          }}
        >
          <Box sx={{ width: '400px', textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                color: 'text.primary', 
                fontWeight: 600 
              }}
            >
              Loading Center Details...
            </Typography>
            <LinearProgress 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }} 
            />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={lightTheme}>
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Alert severity="error" sx={{ borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>Error Loading Data</Typography>
            {error}
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ 
        flexGrow: 1, 
        backgroundColor: 'background.default', 
        minHeight: '100vh' 
      }}>
        <NavBar />
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={
              <Fade in timeout={800}>
                <Box>
                  {centerDetails ? (
                    <>
                      {/* Header Section */}
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          mb: 4
                        }}
                      >
                        {/* Center Dashboard Title - Main Header */}
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 700, 
                            color: 'primary.main',
                            mb: 2,
                            textAlign: 'center'
                          }}
                        >
                          Center Dashboard
                        </Typography>
                        
                        {/* Center Name - Smaller size between Dashboard and Analytics */}
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700, 
                            color: 'text.secondary',
                            mb: 3,
                            textAlign: 'center'
                          }}
                        >
                          {centerDetails.center_name}
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'text.secondary',
                            maxWidth: '600px',
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                            mb: 3
                          }}
                        >
                          Comprehensive examination center management and analytics platform
                        </Typography>
                        
                        <Tooltip title="Refresh Dashboard Data">
                          <IconButton 
                            onClick={handleRefresh}
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              '&:hover': { 
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                transform: 'scale(1.05)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Center Analytics Section */}
                      <Box sx={{ mb: 6 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            textAlign: 'center', 
                            fontWeight: 600, 
                            mb: 4,
                            color: 'text.primary'
                          }}
                        >
                          Center Analytics
                        </Typography>
                        <Grid container spacing={3} justifyContent={"center"}>
                          <Grid item xs={12} sm={6} lg={3}>
                            <StatisticsCard
                              title="Center Code"
                              value={centerDetails.center}
                              subtitle="Unique center identifier code"
                              icon={BusinessIcon}
                              color="primary"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} lg={3}>
                            <StatisticsCard
                              title="Maximum PCs"
                              value={centerDetails.max_pc}
                              subtitle="Total system capacity available"
                              icon={ComputerIcon}
                              color="info"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} lg={3}>
                            <StatisticsCard
                              title="Configured PCs"
                              value={centerDetails.pc_count}
                              subtitle="Currently active and configured"
                              icon={MemoryIcon}
                              color="success"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} lg={3}>
                            <StatisticsCard
                              title="Registered PCs"
                              value={pcCount}
                              subtitle="Successfully registered systems"
                              icon={SpeedIcon}
                              color="secondary"
                              trend="up"
                              trendValue="+8.3%"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Center Information and Utilization */}
                      <Grid container spacing={4} sx={{ mb: 6 }}justifyContent={"center"}>
                        <Grid item xs={12} lg={8}>
                          <Card sx={{ 
                            borderRadius: 3, 
                            height: '100%',
                            boxShadow: 2,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`
                          }}>
                            <CardHeader
                              avatar={
                                <Avatar sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: 'primary.main',
                                  border: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`
                                }}>
                                  <SchoolIcon />
                                </Avatar>
                              }
                              title={
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                  Center Information
                                </Typography>
                              }
                              subheader={
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                  Detailed center configuration and location data
                                </Typography>
                              }
                              action={
                                <Chip 
                                  label="Online" 
                                  sx={{
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    color: 'success.main',
                                    fontWeight: 600,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                  }}
                                />
                              }
                            />
                            <Divider />
                            <CardContent sx={{ p: 4 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                <LocationIcon sx={{ 
                                  mr: 2, 
                                  mt: 0.5, 
                                  color: 'secondary.main', 
                                  fontSize: 28 
                                }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    Location Address
                                  </Typography>
                                  <Typography variant="body1" sx={{ 
                                    color: 'text.primary', 
                                    mb: 1,
                                    lineHeight: 1.6
                                  }}>
                                    {centerDetails.center_address}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Primary examination center facility address
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        {/* PC Utilization Chart */}
                        <Grid item xs={12} lg={4}>
                          <Card sx={{ 
                            borderRadius: 3, 
                            height: '100%',
                            boxShadow: 2,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
                            background: alpha(theme.palette.info.main, 0.02)
                          }}>
                            <CardHeader
                              title={
                                <Typography variant="h5" sx={{ 
                                  fontWeight: 600, 
                                  color: 'info.main' 
                                }}>
                                  System Utilization
                                </Typography>
                              }
                              subheader={
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                  Current capacity utilization analysis
                                </Typography>
                              }
                            />
                            <Divider />
                            <CardContent sx={{ p: 4 }}>
                              <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography 
                                  variant="h2" 
                                  sx={{ 
                                    fontWeight: 700, 
                                    color: 'info.main',
                                    mb: 1,
                                    fontSize: '3rem'
                                  }}
                                >
                                  {Math.round((pcCount / centerDetails.max_pc) * 100)}%
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                  color: 'text.secondary', 
                                  fontWeight: 500 
                                }}>
                                  Systems Utilized
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={(pcCount / centerDetails.max_pc) * 100}
                                sx={{ 
                                  height: 12, 
                                  borderRadius: 6,
                                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.palette.info.main,
                                    borderRadius: 6
                                  }
                                }}
                              />
                              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.secondary', 
                                  fontWeight: 500 
                                }}>
                                  {pcCount} active
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.secondary', 
                                  fontWeight: 500 
                                }}>
                                  {centerDetails.max_pc} total
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      {/* Quick Actions Section */}
                      <Paper sx={{ 
                        p: 4, 
                        borderRadius: 3, 
                        boxShadow: 2,
                        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
                      }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 2,
                              color: 'text.primary'
                            }}
                          >
                            Quick Actions
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'text.secondary', 
                              maxWidth: '500px', 
                              mx: 'auto',
                              fontSize: '1.1rem',
                              lineHeight: 1.6
                            }}
                          >
                            Access essential management tools and generate comprehensive reports
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 4,
                          flexWrap: 'wrap'
                        }}>
                          {quickActions.map((action, index) => (
                            <Box key={index} sx={{ width: { xs: '100%', sm: '300px' } }}>
                              <QuickActionCard
                                {...action}
                                onClick={() => navigate(action.path)}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </>
                  ) : (
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '400px'
                    }}>
                      <Alert 
                        severity="info" 
                        sx={{ 
                          borderRadius: 3, 
                          textAlign: 'center', 
                          py: 4,
                          px: 6,
                          maxWidth: '500px',
                          boxShadow: 2
                        }}
                      >
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                          No Center Data Available
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          Center information is currently unavailable. Please contact your system administrator or try refreshing the page.
                        </Typography>
                      </Alert>
                    </Box>
                  )}
                </Box>
              </Fade>
            } />
            <Route path="/attendance-download" element={<AttendanceDownload />} />
            <Route path="/absentee-roll" element={<AbsenteeRoll />} />
            <Route path="/student-table" element={<TrackStudentsExam />} />
            <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
