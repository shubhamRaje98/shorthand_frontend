import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Route, Routes } from 'react-router-dom';
import NavBar from '../navBar/navBar';
import AttendanceDownload from '../attendanceDownload/attendanceDownload';
import AbsenteeRoll from '../attendeeRoll/attendeeRoll';
import TrackStudentsExam from '../studentExamTracking/StudentTable';
import CenterwiseStudentCount from '../centerwiseStudentExamCountTracking/centerwiseCountReport';
import './home.css';

const Home = () => {
    const { center } = useParams();
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="home-wrapper">
            <NavBar />
            <div className="home-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={
                            <div className="center-details">
                                <h1>Center Admin</h1>
                                {centerDetails ? (
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Center Code:</span>
                                            <span className="detail-value">{centerDetails.center}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Center Name:</span>
                                            <span className="detail-value">{centerDetails.center_name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Center Address:</span>
                                            <span className="detail-value">{centerDetails.center_address}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Max PC:</span>
                                            <span className="detail-value">{centerDetails.max_pc}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">PC Count:</span>
                                            <span className="detail-value">{centerDetails.pc_count}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Registered PCs:</span>
                                            <span className="detail-value">{pcCount}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="no-details">No details available for this center.</p>
                                )}
                            </div>
                        } />
                        <Route path="/attendance-download" element={<AttendanceDownload />} />
                        <Route path="/absentee-roll" element={<AbsenteeRoll />} />
                        <Route path="/student-table" element={<TrackStudentsExam />} />
                        <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Home;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, Route, Routes } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Alert,
//   CircularProgress,
//   Chip,
//   LinearProgress,
//   Tooltip,
//   IconButton,
//   Fab,
//   Paper,
//   useTheme,
//   alpha,
//   Fade,
//   Zoom,
//   Stack,
//   Divider,
//   Button,
//   Skeleton
// } from '@mui/material';
// import {
//   Business as CenterIcon,
//   Computer as ComputerIcon,
//   LocationOn as LocationIcon,
//   Memory as MaxPcIcon,
//   CheckCircle as RegisteredIcon,
//   Dashboard as DashboardIcon,
//   Assessment as AnalyticsIcon,
//   Refresh as RefreshIcon,
//   TrendingUp as TrendingUpIcon,
//   Speed as SpeedIcon,
//   DevicesOther as DevicesIcon,
//   Download as DownloadIcon,
//   Group as GroupIcon,
//   Assignment as AssignmentIcon,
//   BarChart as ChartIcon
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import CountUp from 'react-countup';
// import NavBar from '../navBar/navBar';
// import AttendanceDownload from '../attendanceDownload/attendanceDownload';
// import AbsenteeRoll from '../attendeeRoll/attendeeRoll';
// import TrackStudentsExam from '../studentExamTracking/StudentTable';
// import CenterwiseStudentCount from '../centerwiseStudentExamCountTracking/centerwiseCountReport';

// // Enhanced styled components
// const StyledContainer = styled(Container)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
//   minHeight: '100vh',
//   paddingTop: theme.spacing(3),
//   paddingBottom: theme.spacing(3),
// }));

// const AnalyticsCard = styled(Card)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
//   backdropFilter: 'blur(20px)',
//   border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
//   borderRadius: '20px',
//   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
//   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   overflow: 'hidden',
//   '&:hover': {
//     transform: 'translateY(-4px)',
//     boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
//   }
// }));

// const MetricCard = styled(Card)(({ theme }) => ({
//   background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
//   backdropFilter: 'blur(15px)',
//   borderRadius: '20px',
//   border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//   transition: 'all 0.3s ease',
//   cursor: 'pointer',
//   overflow: 'hidden',
//   position: 'relative',
//   height: '100%',
//   '&:hover': {
//     transform: 'translateY(-6px) scale(1.02)',
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
//   }
// }));

// const QuickActionButton = styled(Button)(({ theme }) => ({
//   borderRadius: '16px',
//   textTransform: 'none',
//   fontWeight: 600,
//   fontSize: '1rem',
//   padding: theme.spacing(2, 3),
//   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//   color: 'white',
//   boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
//     background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
//   }
// }));

// const FloatingActionButton = styled(Fab)(({ theme }) => ({
//   position: 'fixed',
//   bottom: 24,
//   right: 24,
//   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//   boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
//   '&:hover': {
//     background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
//     transform: 'scale(1.1)',
//     boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
//   }
// }));

// // Enhanced Metric Card Component
// const EnhancedMetricCard = ({ title, value, icon, color, percentage, subtitle, trend }) => {
//   const theme = useTheme();
  
//   return (
//     <MetricCard>
//       <CardContent sx={{ 
//         p: 3, 
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         position: 'relative'
//       }}>
//         {/* Background decorative element */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             right: 0,
//             width: '100px',
//             height: '100px',
//             background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
//             borderRadius: '50%',
//             transform: 'translate(35px, -35px)',
//           }}
//         />
        
//         {/* Header with icon */}
//         <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, zIndex: 1 }}>
//           <Box sx={{ flex: 1 }}>
//             <Typography 
//               variant="subtitle2" 
//               color="text.secondary" 
//               sx={{ 
//                 fontWeight: 600, 
//                 mb: 1,
//                 fontSize: '0.8rem',
//                 letterSpacing: '0.5px',
//                 textTransform: 'uppercase'
//               }}
//             >
//               {title}
//             </Typography>
//           </Box>
          
//           <Box sx={{ 
//             p: 1.5, 
//             borderRadius: '16px', 
//             bgcolor: `${color}12`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minWidth: '56px',
//             minHeight: '56px'
//           }}>
//             {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
//           </Box>
//         </Stack>
        
//         {/* Value and subtitle */}
//         <Box sx={{ mb: 2, zIndex: 1 }}>
//           <Typography 
//             variant="h3" 
//             sx={{ 
//               fontWeight: 800, 
//               color, 
//               mb: 0.5,
//               fontSize: { xs: '1.8rem', sm: '2.2rem' },
//               lineHeight: 1.1,
//               fontFamily: 'inherit'
//             }}
//           >
//             {typeof value === 'number' ? (
//               <CountUp end={value} duration={2.5} separator="," />
//             ) : (
//               value
//             )}
//           </Typography>
//           {subtitle && (
//             <Typography 
//               variant="body2" 
//               color="text.secondary"
//               sx={{
//                 fontSize: '0.875rem',
//                 lineHeight: 1.4,
//                 fontWeight: 500
//               }}
//             >
//               {subtitle}
//             </Typography>
//           )}
//         </Box>
        
//         {/* Progress section */}
//         {percentage && (
//           <Box sx={{ mt: 'auto', zIndex: 1 }}>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
//               <Typography 
//                 variant="caption" 
//                 color="text.secondary"
//                 sx={{ fontSize: '0.75rem', fontWeight: 600 }}
//               >
//                 Utilization
//               </Typography>
//               <Typography 
//                 variant="caption" 
//                 sx={{ 
//                   fontWeight: 700, 
//                   color,
//                   fontSize: '0.8rem'
//                 }}
//               >
//                 {percentage.toFixed(1)}%
//               </Typography>
//             </Stack>
//             <LinearProgress
//               variant="determinate"
//               value={percentage}
//               sx={{
//                 height: 8,
//                 borderRadius: 4,
//                 backgroundColor: alpha(color, 0.15),
//                 '& .MuiLinearProgress-bar': {
//                   backgroundColor: color,
//                   borderRadius: 4,
//                 }
//               }}
//             />
//           </Box>
//         )}
        
//         {/* Trend indicator */}
//         {trend && (
//           <Box sx={{ 
//             position: 'absolute', 
//             top: 16, 
//             right: 16,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 0.5,
//             bgcolor: 'success.main',
//             color: 'white',
//             px: 1,
//             py: 0.5,
//             borderRadius: 1,
//             fontSize: '0.75rem',
//             zIndex: 2
//           }}>
//             <TrendingUpIcon sx={{ fontSize: 14 }} />
//             <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
//               {trend}
//             </Typography>
//           </Box>
//         )}
//       </CardContent>
//     </MetricCard>
//   );
// };

// const Home = () => {
//   const { center } = useParams();
//   const theme = useTheme();
//   const [centerDetails, setCenterDetails] = useState(null);
//   const [pcCount, setPcCount] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const fetchCenterDetails = async () => {
//     try {
//       setLoading(true);
//       console.log(`Fetching details for center: ${center}`);
      
//       const response = await axios.get(`http://localhost:3000/get-center-details`);
//       console.log("API Response:", response.data);
      
//       if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
//         setCenterDetails(response.data.examCenterDTO[0]);
//         setPcCount(response.data.pcCount);
//         console.log("Center details:", response.data.examCenterDTO[0]);
//         console.log("PC Count:", response.data.pcCount);
//       } else {
//         setCenterDetails(null);
//         setPcCount(null);
//         console.log("No center details found");
//       }
//       setError('');
//     } catch (error) {
//       setError('Failed to fetch center details');
//       console.error("Error fetching center details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCenterDetails();
//   }, [center]);

//   // Calculate metrics
//   const metrics = React.useMemo(() => {
//     if (!centerDetails) return null;
    
//     const maxPc = parseInt(centerDetails.max_pc) || 0;
//     const totalPc = parseInt(centerDetails.pc_count) || 0;
//     const registeredPc = parseInt(pcCount) || 0;
//     const availablePc = Math.max(totalPc - registeredPc, 0);
//     const utilizationPercentage = totalPc > 0 ? (registeredPc / totalPc) * 100 : 0;
//     const capacityUtilization = maxPc > 0 ? (totalPc / maxPc) * 100 : 0;

//     return {
//       maxPc,
//       totalPc,
//       registeredPc,
//       availablePc,
//       utilizationPercentage,
//       capacityUtilization
//     };
//   }, [centerDetails, pcCount]);

//   // Quick action items
//   const quickActions = [
//     {
//       title: 'Attendance Download',
//       icon: <DownloadIcon />,
//       path: '/attendance-download',
//       color: '#1976d2',
//       description: 'Download student attendance reports'
//     },
//     {
//       title: 'Absentee Roll',
//       icon: <GroupIcon />,
//       path: '/absentee-roll',
//       color: '#d32f2f',
//       description: 'View and manage absent students'
//     },
//     {
//       title: 'Student Tracking',
//       icon: <AssignmentIcon />,
//       path: '/student-table',
//       color: '#2e7d32',
//       description: 'Track student exam progress'
//     },
//     {
//       title: 'Centerwise Count',
//       icon: <ChartIcon />,
//       path: '/centerwise-student-count',
//       color: '#ed6c02',
//       description: 'View center-wise statistics'
//     }
//   ];

//   if (loading) {
//     return (
//       <div>
//         <NavBar />
//         <StyledContainer maxWidth="xl">
//           <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '20px' }}>
//             <CircularProgress size={80} thickness={4} sx={{ mb: 3 }} />
//             <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
//               Loading Center Details...
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Fetching latest center information and PC status
//             </Typography>
//           </Paper>
//         </StyledContainer>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <NavBar />
//         <StyledContainer maxWidth="xl">
//           <Alert 
//             severity="error" 
//             sx={{ 
//               borderRadius: '16px', 
//               fontSize: '1.1rem',
//               py: 3
//             }}
//             action={
//               <IconButton onClick={fetchCenterDetails} color="inherit">
//                 <RefreshIcon />
//               </IconButton>
//             }
//           >
//             <Typography variant="h6" sx={{ mb: 1 }}>
//               Error Loading Center Details
//             </Typography>
//             {error}
//           </Alert>
//         </StyledContainer>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <NavBar />
//       <StyledContainer maxWidth="xl">
//         <Fade in={true} timeout={800}>
//           <Box>
//             <Routes>
//               <Route path="/" element={
//                 <Box>
//                   {/* Header */}
//                   <Paper 
//                     elevation={0}
//                     sx={{ 
//                       mb: 4, 
//                       p: 4, 
//                       textAlign: 'center',
//                       background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
//                       borderRadius: '20px',
//                       border: '1px solid',
//                       borderColor: alpha(theme.palette.primary.main, 0.1)
//                     }}
//                   >
//                     <Stack alignItems="center" spacing={3}>
//                       <Box sx={{ 
//                         p: 3, 
//                         borderRadius: '50%', 
//                         bgcolor: alpha(theme.palette.primary.main, 0.1),
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                       }}>
//                         <DashboardIcon sx={{ fontSize: '4rem', color: 'primary.main' }} />
//                       </Box>
//                       <Box>
//                         <Typography
//                           variant="h3"
//                           sx={{
//                             fontWeight: 800,
//                             background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//                             WebkitBackgroundClip: 'text',
//                             WebkitTextFillColor: 'transparent',
//                             mb: 2,
//                             fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
//                           }}
//                         >
//                           Center Admin Dashboard
//                         </Typography>
//                         {centerDetails && (
//                           <Typography 
//                             variant="h6" 
//                             color="text.secondary" 
//                             sx={{ 
//                               fontSize: { xs: '1rem', sm: '1.2rem' },
//                               fontWeight: 400,
//                               maxWidth: '700px',
//                               mx: 'auto',
//                               lineHeight: 1.6
//                             }}
//                           >
//                             {centerDetails.center_name} - Center {centerDetails.center}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Stack>
//                   </Paper>

//                   {centerDetails ? (
//                     <>
//                       {/* Center Details Cards */}
//                       {metrics && (
//                         <Grid container spacing={3} sx={{ mb: 5 }}>
//                           <Grid item xs={12} sm={6} md={4}>
//                             <EnhancedMetricCard
//                               title="Center Code"
//                               value={centerDetails.center}
//                               icon={<CenterIcon />}
//                               color="#1976d2"
//                               subtitle="Unique center identifier"
//                             />
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={4}>
//                             <EnhancedMetricCard
//                               title="Max PC Capacity"
//                               value={metrics.maxPc}
//                               icon={<MaxPcIcon />}
//                               color="#7b1fa2"
//                               subtitle="Maximum theoretical capacity"
//                             />
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={4}>
//                             <EnhancedMetricCard
//                               title="Available PCs"
//                               value={metrics.totalPc}
//                               icon={<ComputerIcon />}
//                               color="#2e7d32"
//                               subtitle={`${metrics.capacityUtilization.toFixed(1)}% of max capacity`}
//                               percentage={metrics.capacityUtilization}
//                             />
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={6}>
//                             <EnhancedMetricCard
//                               title="Registered PCs"
//                               value={metrics.registeredPc}
//                               icon={<RegisteredIcon />}
//                               color="#1565c0"
//                               subtitle={`${metrics.utilizationPercentage.toFixed(1)}% utilization rate`}
//                               percentage={metrics.utilizationPercentage}
//                             />
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={6}>
//                             <EnhancedMetricCard
//                               title="Free PCs"
//                               value={metrics.availablePc}
//                               icon={<SpeedIcon />}
//                               color="#ed6c02"
//                               subtitle="Available for registration"
//                             />
//                           </Grid>
//                         </Grid>
//                       )}

//                       {/* Center Address Card */}
//                       <AnalyticsCard sx={{ mb: 4 }}>
//                         <CardContent sx={{ p: 4 }}>
//                           <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
//                             <Box sx={{ 
//                               p: 1.5, 
//                               borderRadius: '12px', 
//                               bgcolor: alpha(theme.palette.primary.main, 0.1) 
//                             }}>
//                               <LocationIcon color="primary" sx={{ fontSize: 28 }} />
//                             </Box>
//                             <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
//                               Center Information
//                             </Typography>
//                           </Stack>
                          
//                           <Grid container spacing={3}>
//                             <Grid item xs={12} md={8}>
//                               <Box>
//                                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
//                                   {centerDetails.center_name}
//                                 </Typography>
//                                 <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
//                                   {centerDetails.center_address}
//                                 </Typography>
//                               </Box>
//                             </Grid>
//                             <Grid item xs={12} md={4}>
//                               <Stack spacing={2}>
//                                 <Chip 
//                                   label={`Center ${centerDetails.center}`} 
//                                   color="primary" 
//                                   variant="outlined"
//                                   sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
//                                 />
//                                 <Box>
//                                   <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
//                                     Last Updated
//                                   </Typography>
//                                   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                                     {new Date().toLocaleString()}
//                                   </Typography>
//                                 </Box>
//                               </Stack>
//                             </Grid>
//                           </Grid>
//                         </CardContent>
//                       </AnalyticsCard>

//                       {/* Quick Actions */}
//                       <AnalyticsCard>
//                         <CardContent sx={{ p: 4 }}>
//                           <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
//                             <Box sx={{ 
//                               p: 1.5, 
//                               borderRadius: '12px', 
//                               bgcolor: alpha(theme.palette.secondary.main, 0.1) 
//                             }}>
//                               <AnalyticsIcon color="secondary" sx={{ fontSize: 28 }} />
//                             </Box>
//                             <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
//                               Quick Actions
//                             </Typography>
//                           </Stack>
                          
//                           <Grid container spacing={3}>
//                             {quickActions.map((action, index) => (
//                               <Grid item xs={12} sm={6} md={3} key={index}>
//                                 <Zoom in={true} timeout={600 + index * 100}>
//                                   <Card sx={{ 
//                                     height: '100%',
//                                     transition: 'all 0.3s ease',
//                                     cursor: 'pointer',
//                                     '&:hover': {
//                                       transform: 'translateY(-8px)',
//                                       boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
//                                     }
//                                   }}>
//                                     <CardContent sx={{ p: 3, textAlign: 'center' }}>
//                                       <Box sx={{ 
//                                         p: 2, 
//                                         borderRadius: '16px', 
//                                         bgcolor: alpha(action.color, 0.1),
//                                         display: 'inline-flex',
//                                         mb: 2
//                                       }}>
//                                         {React.cloneElement(action.icon, { 
//                                           sx: { fontSize: 32, color: action.color } 
//                                         })}
//                                       </Box>
//                                       <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
//                                         {action.title}
//                                       </Typography>
//                                       <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                                         {action.description}
//                                       </Typography>
//                                       <QuickActionButton
//                                         fullWidth
//                                         onClick={() => window.location.hash = `#${action.path}`}
//                                         startIcon={action.icon}
//                                         sx={{ 
//                                           background: `linear-gradient(135deg, ${action.color} 0%, ${alpha(action.color, 0.8)} 100%)` 
//                                         }}
//                                       >
//                                         Open
//                                       </QuickActionButton>
//                                     </CardContent>
//                                   </Card>
//                                 </Zoom>
//                               </Grid>
//                             ))}
//                           </Grid>
//                         </CardContent>
//                       </AnalyticsCard>
//                     </>
//                   ) : (
//                     <Alert 
//                       severity="info" 
//                       sx={{ 
//                         borderRadius: '16px',
//                         fontSize: '1.1rem',
//                         textAlign: 'center',
//                         py: 4
//                       }}
//                     >
//                       <Typography variant="h6" sx={{ mb: 1 }}>
//                         No Center Details Available
//                       </Typography>
//                       <Typography variant="body1">
//                         No details available for this center. Please check your configuration or contact support.
//                       </Typography>
//                     </Alert>
//                   )}
//                 </Box>
//               } />
//               <Route path="/attendance-download" element={<AttendanceDownload />} />
//               <Route path="/absentee-roll" element={<AbsenteeRoll />} />
//               <Route path="/student-table" element={<TrackStudentsExam />} />
//               <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
//             </Routes>

//             {/* Floating Action Button */}
//             <FloatingActionButton onClick={fetchCenterDetails}>
//               <RefreshIcon sx={{ fontSize: 28 }} />
//             </FloatingActionButton>
//           </Box>
//         </Fade>
//       </StyledContainer>
//     </div>
//   );
// };

// export default Home;