// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './CurrentStudentDetails.css';
// import NavBar from '../navBar/navBar';
// import moment from 'moment-timezone';

// const CurrentStudentDetails = () => {
//     const [batchNo, setBatchNo] = useState('');
//     const [departmentId, setDepartmentId] = useState('');
//     const [batches, setBatches] = useState([]);
//     const [departments, setDepartments] = useState([]);
//     const [allData, setAllData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchDepartments();
//         fetchData();
//         fetchAllData();

//         // Auto-refresh every 30 seconds
//         const intervalId = setInterval(() => {
//             fetchAllData();  // Refreshing data every 30 seconds
//         }, 30000);  // 30,000 milliseconds = 30 seconds

//         // Cleanup interval on unmount
//         return () => clearInterval(intervalId);
//     }, [batchNo, departmentId]);

//     const fetchDepartments = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/departments', { withCredentials: true });
//             if (response.data && Array.isArray(response.data.departments)) {
//                 setDepartments(response.data.departments);
//             }
//         } catch (error) {
//             console.error("Error fetching departments:", error);
//             setError("Failed to fetch departments. Please try again!");
//         }
//     };

//     const fetchData = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             let url = 'http://localhost:3000/center-batches';
//             if (departmentId) {
//                 url += `?departmentId=${departmentId}`;
//             }
            
//             console.log("Fetching data from URL:", url);
//             const response = await axios.get(url, { withCredentials: true });
            
//             if (response.data && Array.isArray(response.data)) {
//                 const distinctBatches = response.data.map(item => item.batchNo);
//                 setBatches(prevBatches => {
//                     const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
//                     return newBatches.sort((a, b) => a - b);
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setError("Failed to fetch batch numbers. Please try again!");
//         }
//         setLoading(false);
//     };

//     const fetchAllData = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             let url = `http://localhost:3000/get-current-student-details`;
//             const params = new URLSearchParams();
            
//             if (batchNo) {
//                 params.append('batchNo', batchNo);
//             }
//             if (departmentId) {
//                 params.append('departmentId', departmentId);
//             }
            
//             if (params.toString()) {
//                 url += `?${params.toString()}`;
//             }

//             const response = await axios.get(url, { withCredentials: true });
//             if (response.data && response.data.results && Array.isArray(response.data.results)) {
//                 console.log(response.data);
//                 setAllData(response.data.results);
//             } else {
//                 setError('Received unexpected data format from server');
//             }
//         } catch (error) {
//             console.error('Error fetching all data:', error);
//             setError(error.response?.data?.message || 'Failed to fetch all data');
//         }
//         setLoading(false);
//     };

//     const handleDepartmentChange = (e) => {
//         setDepartmentId(e.target.value);
//         setBatchNo(''); // Reset batch selection when department changes
//     };

//     const formatDateTime = (dateTimeString) => {
//         if (!dateTimeString) return '';
//         return moment(dateTimeString, 'hh:mm:ss A').format('hh:mm:ss A');
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return '';
//         return moment(dateString, 'DD MM YYYY').format('DD-MM-YYYY');
//     };

//     return (
//         <div>
//             <NavBar />
//             <div className="current-student-details-container">
//                 <h2>Current Student Details</h2>
                
//                 <div className="filters-container">
//                     <div className="filter-group">
//                         <label htmlFor="departmentId">Select Department:</label>
//                         <select 
//                             id="departmentId" 
//                             value={departmentId} 
//                             onChange={handleDepartmentChange}
//                         >
//                             <option value="">All Departments</option>
//                             {departments.map((dept) => (
//                                 <option key={dept.departmentId} value={dept.departmentId}>
//                                     {dept.department_name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="filter-group">
//                         <label htmlFor="batchNo">Select Batch Number:</label>
//                         <select 
//                             id="batchNo" 
//                             value={batchNo} 
//                             onChange={(e) => setBatchNo(e.target.value)}
//                         >
//                             <option value="">All Batches</option>
//                             {batches.map((batch, index) => (
//                                 <option key={index} value={batch}>{batch}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {loading && <p>Loading...</p>}
//                 {error && <p className="error">{error}</p>}

//                 <div className="data-table">
//                     <h3>
//                         {departmentId && departments.find(d => d.departmentId == departmentId) 
//                             ? `${departments.find(d => d.departmentId == departmentId).department_name} - ` 
//                             : 'All Departments - '}
//                         {batchNo ? `Batch ${batchNo}` : 'All Batches'}
//                     </h3>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Department</th>
//                                 <th>Batch No</th>
//                                 <th>Total Students</th>
//                                 <th>Logged In Students</th>
//                                 <th>Completed Students</th>
//                                 <th>Start Time</th>
//                                 <th>Batch Date</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {allData.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.department_name}</td>
//                                     <td>{item.batchNo}</td>
//                                     <td>{item.total_students || 0}</td>
//                                     <td>{item.logged_in_students || 0}</td>
//                                     <td>{item.completed_student || 0}</td>
//                                     <td>{item.start_time}</td>
//                                     <td>{item.batchdate}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {batchNo && allData.length > 0 && allData[0].subjects && Array.isArray(allData[0].subjects) && (
//                     <div className="subjects-section">
//                         <h4>Subjects:</h4>
//                         <table className="subjects-table">
//                             <thead>
//                                 <tr>
//                                     <th>Subject ID</th>
//                                     <th>Subject Name</th>
//                                     <th>Count</th>
//                                     <th>Logged In</th>
//                                     <th>Completed</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {allData[0].subjects.filter(subject => subject.count > 0).map((subject, index) => (
//                                     <tr key={index}>
//                                         <td>{subject.id}</td>
//                                         <td>{subject.name}</td>
//                                         <td>{subject.count}</td>
//                                         <td>{subject.loggedIn}</td>
//                                         <td>{subject.completed}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CurrentStudentDetails;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  createTheme,
  ThemeProvider,
  Fade,
  IconButton,
  Tooltip,
  Pagination,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Login as LoginIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Book as BookIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import NavBar from '../navBar/navBar';
import moment from 'moment-timezone';

// Enhanced light theme with modern colors
const modernTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
    }
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '12px 16px',
        },
        body: {
          padding: '8px 16px',
        },
      },
    },
  },
});

// Analytics Card Component
const AnalyticsCard = ({ title, value, icon: Icon, color = 'primary', subtitle, progress, trend }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.08)} 0%, ${alpha(theme.palette[color].main, 0.03)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.12)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${alpha(theme.palette[color].main, 0.2)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: `${color}.main`,
                mb: 0.5,
                fontSize: '2.25rem',
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: subtitle ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
            {progress !== undefined && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette[color].main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette[color].main,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {progress}% completion
                </Typography>
              </Box>
            )}
            {trend && (
              <Chip
                label={trend}
                size="small"
                sx={{
                  mt: 1,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
              width: 64,
              height: 64,
              boxShadow: `0 8px 32px ${alpha(theme.palette[color].main, 0.3)}`,
            }}
          >
            <Icon sx={{ fontSize: 32, color: 'white' }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

// Clean Select Component
const CleanSelect = ({ label, value, onChange, options, disabled = false, fullWidth = true }) => {
  const theme = useTheme();
  
  return (
    <FormControl 
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: theme.palette.grey[50],
          borderRadius: 3,
          border: `1px solid ${theme.palette.grey[200]}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: '#ffffff',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
          '&.Mui-focused': {
            borderColor: theme.palette.primary.main,
            backgroundColor: '#ffffff',
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
          '& fieldset': {
            border: 'none',
          }
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
          fontWeight: 500,
          '&.Mui-focused': {
            color: theme.palette.primary.main,
            fontWeight: 600,
          }
        }
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={onChange}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 3,
              mt: 1,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -6px rgb(0 0 0 / 0.1)',
              border: `1px solid ${theme.palette.grey[200]}`,
              '& .MuiMenuItem-root': {
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                minHeight: 44,
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  }
                }
              }
            }
          }
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Progress Bar Component
const ProgressBar = ({ value, total, color = 'primary', label }) => {
  const theme = useTheme();
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: `${color}.main`, fontWeight: 600 }}>
          {value}/{total}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: alpha(theme.palette[color].main, 0.1),
          '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette[color].main,
            borderRadius: 4,
          },
        }}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {percentage.toFixed(1)}%
      </Typography>
    </Box>
  );
};

const CurrentStudentDetails = () => {
  const theme = useTheme();
  const [batchNo, setBatchNo] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [batches, setBatches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [subjectPage, setSubjectPage] = useState(1);
  const [subjectRowsPerPage, setSubjectRowsPerPage] = useState(5);

  // Analytics calculations
  const totalStudents = allData.reduce((sum, item) => sum + (item.total_students || 0), 0);
  const totalLoggedIn = allData.reduce((sum, item) => sum + (item.logged_in_students || 0), 0);
  const totalCompleted = allData.reduce((sum, item) => sum + (item.completed_student || 0), 0);
  const completionRate = totalStudents > 0 ? ((totalCompleted / totalStudents) * 100).toFixed(1) : 0;

  // Pagination calculations
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const paginatedData = allData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Subject pagination
  const subjects = batchNo && allData.length > 0 && allData[0].subjects && Array.isArray(allData[0].subjects) 
    ? allData[0].subjects.filter(subject => subject.count > 0) 
    : [];
  const subjectTotalPages = Math.ceil(subjects.length / subjectRowsPerPage);
  const paginatedSubjects = subjects.slice((subjectPage - 1) * subjectRowsPerPage, subjectPage * subjectRowsPerPage);

  useEffect(() => {
    fetchDepartments();
    fetchData();
    fetchAllData();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchAllData();  // Refreshing data every 30 seconds
    }, 30000);  // 30,000 milliseconds = 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [batchNo, departmentId]);

  // Reset to first page when data changes
  useEffect(() => {
    setPage(1);
    setSubjectPage(1);
  }, [allData, rowsPerPage, subjectRowsPerPage]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/departments', { withCredentials: true });
      if (response.data && Array.isArray(response.data.departments)) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to fetch departments. Please try again!");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:3000/center-batches';
      if (departmentId) {
        url += `?departmentId=${departmentId}`;
      }
      
      console.log("Fetching data from URL:", url);
      const response = await axios.get(url, { withCredentials: true });
      
      if (response.data && Array.isArray(response.data)) {
        const distinctBatches = response.data.map(item => item.batchNo);
        setBatches(prevBatches => {
          const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
          return newBatches.sort((a, b) => a - b);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch batch numbers. Please try again!");
    }
    setLoading(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `http://localhost:3000/get-current-student-details`;
      const params = new URLSearchParams();
      
      if (batchNo) {
        params.append('batchNo', batchNo);
      }
      if (departmentId) {
        params.append('departmentId', departmentId);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, { withCredentials: true });
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        console.log(response.data);
        setAllData(response.data.results);
      } else {
        setError('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Error fetching all data:', error);
      setError(error.response?.data?.message || 'Failed to fetch all data');
    }
    setLoading(false);
  };

  const handleDepartmentChange = (e) => {
    setDepartmentId(e.target.value);
    setBatchNo(''); // Reset batch selection when department changes
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSubjectPageChange = (event, newPage) => {
    setSubjectPage(newPage);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    return moment(dateTimeString, 'hh:mm:ss A').format('hh:mm:ss A');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString, 'DD MM YYYY').format('DD-MM-YYYY');
  };

  // Prepare options for dropdowns
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map(dept => ({
      value: dept.departmentId,
      label: dept.department_name
    }))
  ];

  const batchOptions = [
    { value: '', label: 'All Batches' },
    ...batches.map(batch => ({
      value: batch,
      label: `Batch ${batch}`
    }))
  ];

  return (
    <ThemeProvider theme={modernTheme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <NavBar />
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={800}>
            <Box>
              {/* Header Section */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 2,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Current Student Details
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                  Real-time monitoring of student progress and batch activities
                </Typography>
              </Box>

              {/* Analytics Cards */}
              {!loading && allData.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}justifyContent={"center"}>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Total Students"
                      value={totalStudents}
                      icon={PersonIcon}
                      color="primary"
                      subtitle="Across all batches"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Logged In"
                      value={totalLoggedIn}
                      icon={LoginIcon}
                      color="info"
                      subtitle="Currently active"
                      progress={totalStudents > 0 ? (totalLoggedIn / totalStudents) * 100 : 0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Completed"
                      value={totalCompleted}
                      icon={CheckCircleIcon}
                      color="success"
                      subtitle="Finished exams"
                      progress={totalStudents > 0 ? (totalCompleted / totalStudents) * 100 : 0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Completion Rate"
                      value={`${completionRate}%`}
                      icon={TrendingUpIcon}
                      color="warning"
                      subtitle="Overall progress"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Filters Section */}
              <Card sx={{ mb: 4, borderRadius: 4 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <DashboardIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Filter Options
                    </Typography>
                  }
                  subheader="Select department and batch to filter student details"
                  action={
                    <Tooltip title="Refresh Data">
                      <IconButton
                        onClick={handleRefresh}
                        disabled={loading}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <CleanSelect
                        label="Department"
                        value={departmentId}
                        onChange={handleDepartmentChange}
                        options={departmentOptions}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CleanSelect
                        label="Batch Number"
                        value={batchNo}
                        onChange={(e) => setBatchNo(e.target.value)}
                        options={batchOptions}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Loading State */}
              {loading && (
                <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                  <CircularProgress size={60} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Loading student details...
                  </Typography>
                </Card>
              )}

              {/* Error State */}
              {error && !loading && (
                <Alert severity="error" sx={{ borderRadius: 4, mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Main Data Table */}
              {!loading && !error && allData.length > 0 && (
                <Card sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {departmentId && departments.find(d => d.departmentId == departmentId) 
                              ? `${departments.find(d => d.departmentId == departmentId).department_name} - ` 
                              : 'All Departments - '}
                            {batchNo ? `Batch ${batchNo}` : 'All Batches'}
                          </Typography>
                          <Chip
                            label={`${allData.length} batches`}
                            color="primary"
                            size="small"
                            sx={{ mt: 1, fontWeight: 600 }}
                          />
                        </Box>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Rows per page</InputLabel>
                          <Select
                            value={rowsPerPage}
                            label="Rows per page"
                            onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    }
                    subheader={`Showing ${Math.min((page - 1) * rowsPerPage + 1, allData.length)}-${Math.min(page * rowsPerPage, allData.length)} of ${allData.length} batches`}
                  />
                  <Divider />
                  
                  <TableContainer 
                    sx={{ 
                      maxHeight: 500,
                      '&::-webkit-scrollbar': {
                        width: 8,
                        height: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: alpha(theme.palette.grey[300], 0.3),
                        borderRadius: 4,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.3),
                        borderRadius: 4,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.5),
                        },
                      },
                    }}
                  >
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Department</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Batch No</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Total Students</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LoginIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Logged In</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Completed</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Start Time</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Batch Date</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedData.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              },
                              '&:nth-of-type(even)': {
                                backgroundColor: alpha(theme.palette.grey[50], 0.5),
                              },
                              height: 60,
                            }}
                          >
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.department_name}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Chip
                                label={item.batchNo}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  color: 'primary.main',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.total_students || 0}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Box sx={{ minWidth: 120 }}>
                                <ProgressBar
                                  value={item.logged_in_students || 0}
                                  total={item.total_students || 0}
                                  color="info"
                                  label="Login"
                                />
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Box sx={{ minWidth: 120 }}>
                                <ProgressBar
                                  value={item.completed_student || 0}
                                  total={item.total_students || 0}
                                  color="success"
                                  label="Complete"
                                />
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                {item.start_time}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.batchdate}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination Controls */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      borderTop: `1px solid ${theme.palette.grey[200]}`,
                      backgroundColor: 'grey.50'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Showing {Math.min((page - 1) * rowsPerPage + 1, allData.length)}-{Math.min(page * rowsPerPage, allData.length)} of {allData.length} batches
                    </Typography>
                    
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      size="medium"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                </Card>
              )}

              {/* Subjects Table */}
              {batchNo && allData.length > 0 && allData[0].subjects && Array.isArray(allData[0].subjects) && subjects.length > 0 && (
                <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Subject Details
                          </Typography>
                          <Chip
                            label={`${subjects.length} subjects`}
                            color="secondary"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Rows per page</InputLabel>
                          <Select
                            value={subjectRowsPerPage}
                            label="Rows per page"
                            onChange={(e) => setSubjectRowsPerPage(parseInt(e.target.value, 10))}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    }
                    subheader={`Showing ${Math.min((subjectPage - 1) * subjectRowsPerPage + 1, subjects.length)}-${Math.min(subjectPage * subjectRowsPerPage, subjects.length)} of ${subjects.length} subjects`}
                  />
                  <Divider />
                  
                  <TableContainer 
                    sx={{ 
                      maxHeight: 400,
                      '&::-webkit-scrollbar': {
                        width: 8,
                        height: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: alpha(theme.palette.grey[300], 0.3),
                        borderRadius: 4,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(theme.palette.secondary.main, 0.3),
                        borderRadius: 4,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.secondary.main, 0.5),
                        },
                      },
                    }}
                  >
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Subject ID</Typography>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BookIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Subject Name</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Count</Typography>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Logged In</Typography>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Completed</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedSubjects.map((subject, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.secondary.main, 0.04),
                              },
                              '&:nth-of-type(even)': {
                                backgroundColor: alpha(theme.palette.grey[50], 0.5),
                              },
                              height: 60,
                            }}
                          >
                            <TableCell sx={{ py: 1 }}>
                              <Chip
                                label={subject.id}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                  color: 'secondary.main',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {subject.name}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {subject.count}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Box sx={{ minWidth: 100 }}>
                                <ProgressBar
                                  value={subject.loggedIn}
                                  total={subject.count}
                                  color="info"
                                  label="Login"
                                />
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Box sx={{ minWidth: 100 }}>
                                <ProgressBar
                                  value={subject.completed}
                                  total={subject.count}
                                  color="success"
                                  label="Complete"
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Subject Pagination Controls */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      borderTop: `1px solid ${theme.palette.grey[200]}`,
                      backgroundColor: 'grey.50'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Showing {Math.min((subjectPage - 1) * subjectRowsPerPage + 1, subjects.length)}-{Math.min(subjectPage * subjectRowsPerPage, subjects.length)} of {subjects.length} subjects
                    </Typography>
                    
                    <Pagination
                      count={subjectTotalPages}
                      page={subjectPage}
                      onChange={handleSubjectPageChange}
                      color="secondary"
                      shape="rounded"
                      size="medium"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                </Card>
              )}

              {/* No Data State */}
              {!loading && !error && allData.length === 0 && (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: 'info.main',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    No Student Data Available
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    There are currently no student details matching your filter criteria.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Try adjusting your filters or check back later.
                  </Typography>
                </Paper>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CurrentStudentDetails;
