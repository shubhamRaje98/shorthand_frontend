// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import './ControllerPassword.css';
// import NavBar from '../navBar/navBar';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ControllerPassword = () => {
//     const { center } = useParams();
//     const [info, setInfo] = useState([]);
//     const [departments, setDepartments] = useState([]);
//     const [selectedDepartment, setSelectedDepartment] = useState('all');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [departmentLoading, setDepartmentLoading] = useState(false);

//     // Fetch departments on component mount
//     useEffect(() => {
//         const fetchDepartments = async () => {
//             setDepartmentLoading(true);
//             try {
//                 const response = await axios.get('http://localhost:3000/get-active-departments');
//                 setDepartments(response.data);
//                 console.log('Departments fetched:', response.data);
//             } catch (error) {
//                 console.error("Error fetching departments:", error);
//                 setError("Failed to fetch departments. Please try again later.");
//             }
//             setDepartmentLoading(false);
//         };

//         fetchDepartments();
//     }, []);

//     // Fetch controller passwords whenever department selection changes
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             setError('');
//             try {
//                 let url = 'http://localhost:3000/get-controller-pass';
                
//                 // Add department filter if not 'all'
//                 if (selectedDepartment && selectedDepartment !== 'all') {
//                     url += `?departmentId=${selectedDepartment}`;
//                 }
                
//                 const response = await axios.get(url);
//                 console.log('Controller passwords response:', response.data);
                
//                 if (response.data.controllerPassDto) {
//                     setInfo(response.data.controllerPassDto);
                    
//                     // Show message if no data but request was successful
//                     if (response.data.controllerPassDto.length === 0) {
//                         setError(response.data.message || 'No Controller passwords available at this time (passwords are shown 30 minutes before batch start)');
//                     }
//                 } else {
//                     setInfo([]);
//                     setError('No Controller passwords available at this time');
//                 }
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 if (error.response?.status === 404) {
//                     setError('No Controller passwords available at this time');
//                 } else {
//                     setError('Error fetching controller passwords. Please try again.');
//                 }
//                 setInfo([]);
//             }
//             setLoading(false);
//         };

//         // Only fetch data if departments have been loaded (to avoid calling with undefined departmentId)
//         if (!departmentLoading) {
//             fetchData();
//         }
//     }, [selectedDepartment, departmentLoading]);

//     const handleDepartmentChange = (e) => {
//         setSelectedDepartment(e.target.value);
//         setError(''); // Clear previous errors when changing department
//     };

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <NavBar />
//                 <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
//                     <h2 className="mt-3">Controller Password Table</h2>
                    
//                     {/* Department Filter Dropdown */}
//                     <div className="mb-3">
//                         <label htmlFor="departmentSelect" className="form-label">
//                             <strong>Filter by Department:</strong>
//                         </label>
//                         <select 
//                             id="departmentSelect"
//                             className="form-select" 
//                             value={selectedDepartment} 
//                             onChange={handleDepartmentChange}
//                             disabled={departmentLoading}
//                         >
//                             <option value="all">All Departments</option>
//                             {departments.map(dept => (
//                                 <option key={dept.departmentId} value={dept.departmentId}>
//                                     {dept.departmentName}
//                                 </option>
//                             ))}
//                         </select>
//                         {departmentLoading && <small className="text-muted">Loading departments...</small>}
//                     </div>

//                     {/* Loading and Error States */}
//                     {loading && <div className="alert alert-info">Loading controller passwords...</div>}
//                     {error && <div className="alert alert-warning">{error}</div>}
                    
//                     {/* Controller Password Table */}
//                     {!loading && !error && Array.isArray(info) && info.length > 0 && (
//                         <div className="table-responsive">
//                             <table className="table table-bordered table-hover">
//                                 <thead className="thead-dark">
//                                     <tr>
//                                         <th scope="col">Center</th>
//                                         <th scope="col">Batch No</th>
//                                         <th scope="col">Department</th>
//                                         <th scope="col">Controller Password</th>
//                                         <th scope="col">Batch Date</th>
//                                         <th scope="col">Start Time</th>
//                                         <th scope="col">End Time</th>
//                                         <th scope="col">Batch Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {info.map((item, index) => (
//                                         <tr key={`${item.center}-${item.batchNo}-${item.departmentId}`}>
//                                             <td>{item.center}</td>
//                                             <td>{item.batchNo}</td>
//                                             <td>{item.departmentName}</td>
//                                             <td>
//                                                 <strong className="text-primary">
//                                                     {item.controllerPass}
//                                                 </strong>
//                                             </td>
//                                             <td>{item.batchDate}</td>
//                                             <td>{item.startTime}</td>
//                                             <td>{item.endTime}</td>
//                                             <td>
//                                                 <span className={`badge ${item.batchStatus === 1 ? 'bg-success' : 'bg-secondary'}`}>
//                                                     {item.batchStatus === 1 ? "Active" : "Inactive"}
//                                                 </span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     {/* No Data Message */}
//                     {!loading && !error && (!info || info.length === 0) && (
//                         <div className="alert alert-info">
//                             <h5>No Controller Passwords Available</h5>
//                             <p>Controller passwords are only displayed 30 minutes before the batch start time.</p>
//                             <small>Please check back closer to your batch start time.</small>
//                         </div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default ControllerPassword;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  useTheme,
  alpha,
  createTheme,
  ThemeProvider,
  Fade,
  Skeleton,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Password as PasswordIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import NavBar from '../navBar/navBar';

// Modern light theme with sophisticated colors
const sophisticatedTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
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
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#64748b'
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        }
      }
    }
  },
});

// Custom hook for data fetching
const useFetchData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Enhanced Select Component
const EnhancedSelect = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  icon: Icon
}) => {
  const theme = useTheme();

  return (
    <FormControl
      fullWidth
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
      <InputLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {Icon && <Icon sx={{ fontSize: 18 }} />}
          {label}
        </Box>
      </InputLabel>
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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const isActive = status === 1;
  const label = isActive ? 'Active' : 'Inactive';
  const color = isActive ? 'success' : 'grey';
  const icon = isActive ? <CheckCircleIcon /> : <CancelIcon />;

  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        backgroundColor: isActive ? 'success.main' : 'grey.400',
        color: 'white',
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: 'inherit',
        }
      }}
    />
  );
};

// Password Display Component
const PasswordDisplay = ({ password }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      backgroundColor: alpha('#6366f1', 0.1),
      color: '#4f46e5',
      px: 2,
      py: 1,
      borderRadius: 2,
      fontFamily: 'monospace',
      fontWeight: 700,
      fontSize: '1rem',
      border: '2px solid',
      borderColor: alpha('#6366f1', 0.2),
    }}
  >
    <PasswordIcon sx={{ fontSize: 18 }} />
    {password}
  </Box>
);

// Statistics Card Component
const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)} 0%, ${alpha(theme.palette[color].main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 10px 40px ${alpha(theme.palette[color].main, 0.2)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: `${color}.main`,
                mb: 0.5,
                fontSize: '2.5rem',
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

// Skeleton Loader Component
const SkeletonTable = () => (
  <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
    <CardHeader
      title={<Skeleton width="60%" />}
      subheader={<Skeleton width="80%" />}
    />
    <Divider />
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={100} /></TableCell>
            <TableCell><Skeleton width={120} /></TableCell>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={80} /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
);

const ControllerPassword = () => {
  const theme = useTheme();
  const { center } = useParams(); // Using `center` is fine, but not used in the code
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Fetch departments using custom hook
  const {
    data: departments,
    loading: departmentLoading,
    error: departmentError,
  } = useFetchData(async () => {
    const response = await axios.get('http://localhost:3000/get-active-departments');
    return response.data;
  }, []);

  // Fetch controller passwords based on selected department
  const fetchPasswords = useCallback(async () => {
    let url = 'http://localhost:3000/get-controller-pass';
    if (selectedDepartment && selectedDepartment !== 'all') {
      url += `?departmentId=${selectedDepartment}`;
    }
    const response = await axios.get(url);
    if (!response.data.controllerPassDto) {
      throw new Error('No Controller passwords available at this time.');
    }
    return response.data.controllerPassDto;
  }, [selectedDepartment]);

  const {
    data: info,
    loading: passwordLoading,
    error: passwordError,
    refetch: refreshPasswords
  } = useFetchData(fetchPasswords, [fetchPasswords]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleRefresh = () => {
    refreshPasswords();
  };

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map(dept => ({
      value: dept.departmentId,
      label: dept.departmentName
    }))
  ];

  // Statistics
  const activePasswords = info.filter(item => item.batchStatus === 1).length;
  const totalDepartments = [...new Set(info.map(item => item.departmentName))].length;
  const todayPasswords = info.filter(item => {
    const today = new Date().toISOString().split('T')[0];
    return item.batchDate === today;
  }).length;

  const renderContent = () => {
    if (passwordLoading) {
      return (
        <SkeletonTable />
      );
    }

    if (passwordError) {
      return (
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{
            borderRadius: 4,
            mb: 3,
            '& .MuiAlert-message': {
              fontSize: '1rem',
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No Controller Passwords Available
          </Typography>
          <Typography variant="body2">
            {passwordError}
          </Typography>
        </Alert>
      );
    }

    if (info && info.length > 0) {
      return (
        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Controller Passwords
                </Typography>
                <Badge badgeContent={info.length} color="primary" />
              </Box>
            }
            subheader="Active controller credentials for examination batches"
          />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Center</TableCell>
                  <TableCell>Batch No</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Batch Date</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {info.map((item) => (
                  <TableRow
                    key={`${item.center}-${item.batchNo}-${item.departmentId}`}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: 'grey.50',
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{item.center}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.batchNo}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.departmentName}</TableCell>
                    <TableCell>
                      <PasswordDisplay password={item.controllerPass} />
                    </TableCell>
                    <TableCell>{item.batchDate}</TableCell>
                    <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>
                      {item.startTime}
                    </TableCell>
                    <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>
                      {item.endTime}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.batchStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
    }

    return (
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
          <InfoIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          No Controller Passwords Available
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          Controller passwords are only displayed 30 minutes before the batch start time.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please check back closer to your batch start time.
        </Typography>
      </Paper>
    );
  };

  return (
    <ThemeProvider theme={sophisticatedTheme}>
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
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Controller Password Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                  Secure access credentials for examination batch controllers
                </Typography>
              </Box>

              {/* Statistics Cards */}
              {!passwordLoading && info.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Total Passwords"
                      value={info.length}
                      icon={PasswordIcon}
                      color="primary"
                      subtitle="Available credentials"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Active Sessions"
                      value={activePasswords}
                      icon={CheckCircleIcon}
                      color="success"
                      subtitle="Currently active"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Departments"
                      value={totalDepartments}
                      icon={BusinessIcon}
                      color="info"
                      subtitle="With active batches"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Today's Batches"
                      value={todayPasswords}
                      icon={CalendarIcon}
                      color="secondary"
                      subtitle="Scheduled today"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Controls Section */}
              <Card sx={{ mb: 4, borderRadius: 4 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SchoolIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Filter & Controls
                    </Typography>
                  }
                  subheader="Select department and manage controller passwords"
                  action={
                    <Tooltip title="Refresh Data">
                      <IconButton
                        onClick={handleRefresh}
                        disabled={passwordLoading}
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
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <EnhancedSelect
                        label="Filter by Department"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        options={departmentOptions}
                        disabled={departmentLoading}
                        icon={BusinessIcon}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      {departmentLoading && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="body2" color="text.secondary">
                            Loading departments...
                          </Typography>
                        </Box>
                      )}
                      {departmentError && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                          <ErrorOutlineIcon size={16} />
                          <Typography variant="body2">
                            Error loading departments.
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Data Table */}
              {renderContent()}

            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ControllerPassword;