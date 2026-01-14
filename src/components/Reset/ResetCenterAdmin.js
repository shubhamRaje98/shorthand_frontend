// import React, { useState, useEffect } from 'react';
// import NavBar from '../navBar/navBar';
// import axios from 'axios';

// const ResetCenterAdmin = () => {
//   const [formData, setFormData] = useState({
//     student_id: '',
//     reason: '',
//     reset_type: ''
//   });
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState('');

//   const resetTypes = [
//     'Shorthand Passage A Reset',
//     'Audio A Reset',
//     'Shorthand Passage B Reset',
//     'Audio B Reset',
//     'Trial Audio Reset'
//   ];

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('https://www.shorthandonlineexam.in/centerrequest', formData);
//       fetchRequests(); // Fetch updated requests after submission
//       setFormData({ student_id: '', reason: '', reset_type: '' }); // Clear form
//       setError('');
//     } catch (err) {
//       console.error('Error submitting request:', err);
//       setError(err.response?.data?.message || 'An error occurred while submitting the request');
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const response = await axios.get('https://www.shorthandonlineexam.in/center-request-data');
//       setRequests(response.data);
//     } catch (err) {
//       console.error('Error fetching requests:', err);
//       setError(err.response?.data?.message || 'An error occurred while fetching requests');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://www.shorthandonlineexam.in/centerrequest/${id}`);
//       fetchRequests(); // Fetch updated requests after deletion
//       setError('');
//     } catch (err) {
//       console.error('Error deleting request:', err);
//       setError(err.response?.data?.message || 'An error occurred while deleting the request');
//     }
//   };

//   return (
//     <>
//       <NavBar />
//       <div className="container mt-4">
//         <h2>Reset Center Admin</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="student_id" className="form-label">Student ID:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="student_id"
//               name="student_id"
//               value={formData.student_id}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="reason" className="form-label">Reason:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="reason"
//               name="reason"
//               value={formData.reason}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="reset_type" className="form-label">Reset Type:</label>
//             <select
//               className="form-select"
//               id="reset_type"
//               name="reset_type"
//               value={formData.reset_type}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Reset Type</option>
//               {resetTypes.map((type, index) => (
//                 <option key={index} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>
//           <button type="submit" className="btn btn-primary">Submit</button>
//         </form>

//         {error && <div className="alert alert-danger mt-3">{error}</div>}

//         {requests.length > 0 && (
//           <div className="mt-4">
//             <h3>Reset Requests</h3>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Student ID</th>
//                   <th>Reason</th>
//                   <th>Reset Type</th>
//                   <th>Reseted By</th>
//                   <th>Approval Status</th>
//                   <th>Time</th>
//                   {/* <th>Action</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {requests.map((request) => (
//                   <tr key={request.id}>
//                     <td>{request.id}</td>
//                     <td>{request.student_id}</td>
//                     <td>{request.reason}</td>
//                     <td>{request.reset_type}</td>
//                     <td>{request.reseted_by}</td>
//                     <td>{request.approved}</td>
//                     <td>{request.time}</td>
//                     {/* <td>
//                       <button 
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDelete(request.id)}
//                       >
//                         Delete
//                       </button>
//                     </td> */}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ResetCenterAdmin;


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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
  createTheme,
  ThemeProvider,
  Fade,
  IconButton,
  Tooltip,
  Pagination,
  Stack,
  LinearProgress,
  Snackbar
} from '@mui/material';
import {
  RestartAlt as ResetIcon,
  Person as PersonIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  AdminPanelSettings as AdminIcon,
  AudioFile as AudioIcon,
  TextFields as TextIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import NavBar from '../navBar/navBar';

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
const AnalyticsCard = ({ title, value, icon: Icon, color = 'primary', subtitle, progress }) => {
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
                  {progress.toFixed(1)}% approved
                </Typography>
              </Box>
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
const CleanSelect = ({ label, value, onChange, options, disabled = false, fullWidth = true, error = false, helperText }) => {
  const theme = useTheme();
  
  return (
    <FormControl 
      fullWidth={fullWidth}
      disabled={disabled}
      error={error}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: theme.palette.grey[50],
          borderRadius: 3,
          border: `1px solid ${error ? theme.palette.error.main : theme.palette.grey[200]}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            backgroundColor: '#ffffff',
            boxShadow: `0 4px 12px ${alpha(error ? theme.palette.error.main : theme.palette.primary.main, 0.15)}`,
          },
          '&.Mui-focused': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            backgroundColor: '#ffffff',
            boxShadow: `0 0 0 3px ${alpha(error ? theme.palette.error.main : theme.palette.primary.main, 0.1)}`,
          },
          '& fieldset': {
            border: 'none',
          }
        },
        '& .MuiInputLabel-root': {
          color: error ? theme.palette.error.main : theme.palette.text.secondary,
          fontWeight: 500,
          '&.Mui-focused': {
            color: error ? theme.palette.error.main : theme.palette.primary.main,
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
      {helperText && (
        <Typography variant="caption" sx={{ color: error ? 'error.main' : 'text.secondary', mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    
    if (statusLower === 'approved') {
      return {
        color: 'success',
        icon: CheckCircleIcon,
        label: 'Approved'
      };
    } else if (statusLower === 'rejected' || statusLower === 'denied') {
      return {
        color: 'error',
        icon: CancelIcon,
        label: 'Rejected'
      };
    } else if (statusLower === 'pending') {
      return {
        color: 'warning',
        icon: PendingIcon,
        label: 'Pending'
      };
    } else {
      return {
        color: 'info',
        icon: ScheduleIcon,
        label: status || 'Unknown'
      };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <Chip
      icon={<IconComponent sx={{ fontSize: 16 }} />}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: alpha(modernTheme.palette[config.color].main, 0.1),
        color: `${config.color}.main`,
        fontWeight: 600,
        border: `1px solid ${alpha(modernTheme.palette[config.color].main, 0.2)}`,
      }}
    />
  );
};

// Reset Type Icon Component
const ResetTypeIcon = ({ resetType }) => {
  const type = resetType?.toLowerCase();
  
  if (type?.includes('audio')) {
    return <AudioIcon sx={{ fontSize: 16, color: 'info.main' }} />;
  } else if (type?.includes('passage') || type?.includes('shorthand')) {
    return <TextIcon sx={{ fontSize: 16, color: 'secondary.main' }} />;
  } else {
    return <ResetIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
  }
};

const ResetCenterAdmin = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    student_id: '',
    reason: '',
    reset_type: ''
  });
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const resetTypes = [
    'Shorthand Passage A Reset',
    'Audio A Reset',
    'Shorthand Passage B Reset',
    'Audio B Reset',
    'Trial Audio Reset'
  ];

  // Analytics calculations
  const totalRequests = requests.length;
  const approvedRequests = requests.filter(req => req.approved?.toLowerCase() === 'approved').length;
  const pendingRequests = requests.filter(req => req.approved?.toLowerCase() === 'pending').length;
  const approvalRate = totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0;

  // Pagination calculations
  const totalPages = Math.ceil(requests.length / rowsPerPage);
  const paginatedRequests = requests.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Reset types analytics
  const resetTypeStats = resetTypes.map(type => ({
    type,
    count: requests.filter(req => req.reset_type === type).length
  })).sort((a, b) => b.count - a.count);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('https://www.shorthandonlineexam.in/centerrequest', formData);
      fetchRequests(); // Fetch updated requests after submission
      setFormData({ student_id: '', reason: '', reset_type: '' }); // Clear form
      setError('');
      setSnackbar({
        open: true,
        message: 'Reset request submitted successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error submitting request:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while submitting the request';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Reset to first page when data changes
  useEffect(() => {
    setPage(1);
  }, [requests, rowsPerPage]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('https://www.shorthandonlineexam.in/center-request-data');
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching requests');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://www.shorthandonlineexam.in/centerrequest/${id}`);
      fetchRequests(); // Fetch updated requests after deletion
      setError('');
      setSnackbar({
        open: true,
        message: 'Request deleted successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting request:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while deleting the request';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const resetTypeOptions = [
    { value: '', label: 'Select Reset Type' },
    ...resetTypes.map(type => ({ value: type, label: type }))
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
                  Reset Center Admin
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                  Manage student exam reset requests and track approval status
                </Typography>
              </Box>

              {/* Analytics Cards */}
              {requests.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}justifyContent={"center"}>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Total Requests"
                      value={totalRequests}
                      icon={AssignmentIcon}
                      color="primary"
                      subtitle="All reset requests"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Approved"
                      value={approvedRequests}
                      icon={CheckCircleIcon}
                      color="success"
                      subtitle="Completed requests"

                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Pending"
                      value={pendingRequests}
                      icon={PendingIcon}
                      color="warning"
                      subtitle="Awaiting approval"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Approval Rate"
                      value={`${approvalRate.toFixed(1)}%`}
                      icon={AnalyticsIcon}
                      color="info"
                      subtitle="Success rate"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Submit Form */}
              <Card sx={{ borderRadius: 4, mb: 4 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <ResetIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Submit Reset Request
                    </Typography>
                  }
                  subheader="Create a new reset request for student exam sections"
                  action={
                    <Tooltip title="Refresh Requests">
                      <IconButton
                        onClick={fetchRequests}
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
                <CardContent sx={{ p: 4 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}
                  
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Student ID"
                          name="student_id"
                          value={formData.student_id}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              backgroundColor: theme.palette.grey[50],
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Reason for Reset"
                          name="reason"
                          value={formData.reason}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              backgroundColor: theme.palette.grey[50],
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CleanSelect
                          label="Reset Type"
                          value={formData.reset_type}
                          onChange={(e) => handleInputChange({ target: { name: 'reset_type', value: e.target.value } })}
                          options={resetTypeOptions}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={isLoading}
                          startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            px: 4,
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          {isLoading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

              {/* Requests Table */}
              {requests.length > 0 && (
                <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Reset Requests
                          </Typography>
                          <Chip
                            label={`${requests.length} requests`}
                            color="secondary"
                            size="small"
                            sx={{ fontWeight: 600 }}
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
                            <MenuItem value={50}>50</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    }
                    subheader={`Showing ${Math.min((page - 1) * rowsPerPage + 1, requests.length)}-${Math.min(page * rowsPerPage, requests.length)} of ${requests.length} requests`}
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
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5, minWidth: 80 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>ID</Typography>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5, minWidth: 120 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Student ID</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5, minWidth: 200 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Reason</Typography>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5, minWidth: 180 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ResetIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Reset Type</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5, minWidth: 120 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AdminIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Reset By</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5, minWidth: 120 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status</Typography>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5, minWidth: 140 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Time</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedRequests.map((request) => (
                          <TableRow
                            key={request.id}
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
                                label={request.id}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                                  color: 'info.main',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                {request.student_id}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: 200
                                }}
                                title={request.reason}
                              >
                                {request.reason}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ResetTypeIcon resetType={request.reset_type} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {request.reset_type}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {request.reseted_by || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <StatusChip status={request.approved} />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {request.time}
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
                      Showing {Math.min((page - 1) * rowsPerPage + 1, requests.length)}-{Math.min(page * rowsPerPage, requests.length)} of {requests.length} requests
                    </Typography>
                    
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
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
              {requests.length === 0 && (
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
                    <AssignmentIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    No Reset Requests
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    There are currently no reset requests in the system.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Submit a new request using the form above to get started.
                  </Typography>
                </Paper>
              )}

              {/* Success/Error Snackbar */}
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  severity={snackbar.severity}
                  sx={{ width: '100%', borderRadius: 2 }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ResetCenterAdmin;
