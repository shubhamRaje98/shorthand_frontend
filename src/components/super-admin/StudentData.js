// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './StudentData.css';
// import ResetStudentProgress from './ResetStudentProgress';
// // import ResetStudentProgress from './ResetStudentProgress ';

// const StudentData = () => {
//     const [studentId, setStudentId] = useState('');
//     const [resetId, setResetId] = useState('');
//     const [studentData, setStudentData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [resetRequests, setResetRequests] = useState([]);
//     const [resetError, setResetError] = useState('');
//     const [centers, setCenters] = useState([]);
//     const [selectedCenter, setSelectedCenter] = useState('');
//     const [refresh,setRefresh] = useState(false);


//     useEffect(() => {
//         const fetchCenters = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/reset-centers');
//                 const centersData = Array.isArray(response.data.result) ? response.data.result : [];
//                 setCenters(centersData);
//                 console.log(response.data);
//             } catch (err) {
//                 console.error('Error fetching centers:', err);
//             }
//         };

//         fetchCenters();
//     }, [selectedCenter]);

//     useEffect(() => {
//         const fetchResetRequests = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/get-pending-requests?center=${selectedCenter}`);
//                 setResetRequests(response.data);
//             } catch (err) {
//                 setResetError('Failed to fetch reset requests. Please try again.');
//                 console.error('Error fetching reset requests:', err);
//             }
//         };

//         fetchResetRequests();
//     }, [selectedCenter]);

//     const handleSubmit = async (id) => {
//         setStudentId(id);
//         setLoading(true);
//         setError('');
//         try {
//             const response = await axios.post('http://localhost:3000/admin/student-data', { student_id: id });
//             console.log(response.data);
//             setStudentData(response.data);
        
//         } catch (err) {
//             setError('Failed to fetch student data. Please try again.');
//             console.error('Error fetching student data:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const fetchResetRequests = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/get-pending-requests?center=${selectedCenter}`);
//                 setResetRequests(response.data);
//             } catch (err) {
//                 setResetError('Failed to fetch reset requests. Please try again.');
//                 console.error('Error fetching reset requests:', err);
//             }
//         };

//         fetchResetRequests();
//     }, [selectedCenter,refresh]);

//     const handleDelete = async (student_id , reset_id) => {
//         setLoading(true);
//         setError('');
//         try {
//             const response = await axios.post('http://localhost:3000/reject-reset-request', { student_id: student_id.toString() ,reset_id:reset_id.toString() });
//             setRefresh((prev) => !prev);
//             alert(response.data.message);   
//         } catch (err) {
//             setError('Error Rejecting Request!!!');
//             console.error('Error fetching student data:', err);
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <>
//             <div className="sd-container">
//                 <h1 className="sd-title">Student Data</h1>
//                 {/* Dropdown for Centers */}
//                 <div className="sd-center-selector">
//                     <label htmlFor="center-dropdown">Select Center:</label>
//                     <select
//                         id="center-dropdown"
//                         value={selectedCenter}
//                         onChange={(e) => setSelectedCenter(e.target.value)}
//                         className="sd-dropdown"
//                     >
//                         <option value="">Select a Center</option>
//                         {Array.isArray(centers) &&
//                             centers.map((center) => (
//                                 <option key={center.id} value={center.id}>
//                                     {center.center}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>

//                 <section className="sd-section reset-requests-section">
//                     <h2 className="sd-subtitle">Reset Requests</h2>
//                     {resetError && <p className="sd-error">{resetError}</p>}
//                     <table className="sd-table">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Student ID</th>
//                                 <th>Reason</th>
//                                 <th>Reset Type</th>
//                                 <th>Center</th>
//                                 <th>Time</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {resetRequests.map((request) => (
//                                 <tr key={request.id}>
//                                     <td>{request.id}</td>
//                                     <td>{request.student_id}</td>
//                                     <td>{request.reason}</td>
//                                     <td>{request.reset_type}</td>
//                                     <td>{request.center}</td>
//                                     <td>{request.time}</td>
//                                     <td>
//                                         <button
//                                             onClick={() => {
//                                                 setResetId(request.id)
//                                                 handleSubmit(request.student_id)
//                                             }}
//                                             className="sd-button reset-button"
//                                         >
//                                             Reset
//                                         </button>
                                    
//                                         <button
//                                             onClick={() => {
//                                                 handleDelete(request.student_id , request.id)
//                                             }}
//                                             className="sd-button reject-button"
//                                         >
//                                             Reject
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </section>
//                 {loading && <p className="sd-loading">Loading...</p>}
//                 {error && <p className="sd-error">{error}</p>}

//                 {studentData && (
//                     <div className="sd-data">
//                         <section className="sd-section student-info-section">
//                             <h2 className="sd-subtitle">Student Information</h2>
//                             <div className="sd-info-container">
//                                 <div className="sd-info">
//                                     <p><strong>Student ID:</strong> {studentData.studentResults[0].student_id}</p>
//                                     <p><strong>Full Name:</strong> {studentData.studentResults[0].fullname}</p>
//                                     <p><strong>Batch No:</strong> {studentData.studentResults[0].batchNo}</p>
//                                     <p><strong>Center:</strong> {studentData.studentResults[0].center}</p>
//                                     <p><strong>Batch Date:</strong> {studentData.studentResults[0].batchdate}</p>
//                                 </div>
//                                 <div className="sd-image">
//                                     {studentData.studentResults[0].base64 ? (
//                                         <img
//                                             src={`data:image/jpeg;base64,${studentData.studentResults[0].base64}`}
//                                             alt={`${studentData.studentResults[0].fullname}'s photo`}
//                                             className="student-photo"
//                                         />
//                                     ) : (
//                                         <p>No image available</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </section>

//                         <section className="sd-section audio-logs-section">
//                             <h2 className="sd-subtitle">Audio Logs</h2>
//                             <table className="sd-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Trial</th>
//                                         <th>Passage A</th>
//                                         <th>Passage B</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {studentData.audioLogs.map((log, index) => (
//                                         <tr key={index}>
//                                             <td>{log.trial}</td>
//                                             <td>{log.passageA}</td>
//                                             <td>{log.passageB}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </section>

//                         <section className="sd-section passage-section">
//                             <h2 className="sd-subtitle">Shorthand Passage</h2>
//                             <div className="sd-passage-split">
//                                 <div className="sd-passage-half">
//                                     <h3>Passage A Log</h3>
//                                     <p>{studentData.shorthandPassage[0].passage_a_log || 'N/A'}</p>
//                                 </div>
//                                 <div className="sd-passage-half">
//                                     <h3>Final Passage A</h3>
//                                     <p>{studentData.shorthandPassage[0].final_passageA || 'N/A'}</p>
//                                 </div>
//                             </div>
//                             <div className="sd-passage-split">
//                                 <div className="sd-passage-half">
//                                     <h3>Passage B Log</h3>
//                                     <p>{studentData.shorthandPassage[0].passage_b_log || 'N/A'}</p>
//                                 </div>
//                                 <div className="sd-passage-half">
//                                     <h3>Final Passage B</h3>
//                                     <p>{studentData.shorthandPassage[0].final_passageB || 'N/A'}</p>
//                                 </div>
//                             </div>
//                         </section>

//                         <section className="sd-section passage-section">
//                             <h2 className="sd-subtitle">Typing Passage</h2>
//                             <div className="sd-passage-split">
//                                 <div className="sd-passage-half">
//                                     <h3>Typing Passage Log</h3>
//                                     <p>{studentData.typingPassage[0].typing_passage_log || 'N/A'}</p>
//                                 </div>
//                                 <div className="sd-passage-half">
//                                     <h3>Final Typing Passage</h3>
//                                     <p>{studentData.typingPassage[0].final_typing_passage || 'N/A'}</p>
//                                 </div>
//                             </div>
//                         </section>





//                         {/* Modified Student Logs section */}
//                         <section className="sd-section student-logs-section">
//                             <h2 className="sd-subtitle">Student Logs</h2>
//                             {studentData.studentLogs?.length ? (
//                                 <div className="sd-horizontal-table-wrapper">
//                                     <table className="sd-horizontal-table">
//                                         <thead>
//                                             <tr>
//                                                 {Object.keys(studentData.studentLogs[0]).map((field) => (
//                                                     <th key={field}>{field}</th>
//                                                 ))}
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             <tr>
//                                                 {Object.values(studentData.studentLogs[0]).map((value, index) => (
//                                                     <td key={index}>{value}</td>
//                                                 ))}
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             ) : (
//                                 <p>No logs available</p>
//                             )}
//                         </section>

//                         <section className="sd-section exam-stages-section">
//                             <h2 className="sd-subtitle">Exam Stages</h2>
//                             {studentData.examStages?.length ? (
//                                 <div className="sd-horizontal-table-wrapper">
//                                     <table className="sd-horizontal-table">
//                                         <thead>
//                                             <tr>
//                                                 {Object.keys(studentData.examStages[0]).map((stage) => (
//                                                     <th key={stage}>{stage}</th>
//                                                 ))}
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             <tr>
//                                                 {Object.values(studentData.examStages[0]).map((status, index) => (
//                                                     <td key={index}>{status}</td>
//                                                 ))}
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             ) : (
//                                 <p>No exam stages available</p>
//                             )}
//                         </section>


//                     </div>
//                 )}
//             </div>
//             {studentData && <ResetStudentProgress studentId={studentId} resetId={resetId} />}
//         </>
//     );
// };

// export default StudentData;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Button,
  Grid,
  Stack,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Collapse,
  CardHeader,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  RestartAlt as ResetIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Assignment as AssignmentIcon,
  AudioFile as AudioIcon,
  TextFields as TextIcon,
  Timeline as LogIcon,
  Quiz as ExamIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  AccountCircle as AccountIcon,
  Image as ImageIcon,
  Schedule as ScheduleIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ResetStudentProgress from './ResetStudentProgress';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  maxWidth: '100% !important',
}));

const ModernCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '12px',
  backgroundColor: 'transparent',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.2),
    fontSize: '0.875rem',
  },
  '& .MuiDataGrid-row': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
    }
  }
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
  borderRadius: '12px',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  }
}));

const StudentData = () => {
  const theme = useTheme();
  const [studentId, setStudentId] = useState('');
  const [resetId, setResetId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetRequests, setResetRequests] = useState([]);
  const [resetError, setResetError] = useState('');
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    audio: true,
    shorthand: true,
    typing: true,
    logs: false,
    stages: false
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, request: null });

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get('http://localhost:3000/reset-centers');
        const centersData = Array.isArray(response.data.result) ? response.data.result : [];
        setCenters(centersData);
      } catch (err) {
        console.error('Error fetching centers:', err);
      }
    };
    fetchCenters();
  }, [selectedCenter]);

  useEffect(() => {
    const fetchResetRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/get-pending-requests?center=${selectedCenter}`);
        setResetRequests(response.data);
      } catch (err) {
        setResetError('Failed to fetch reset requests. Please try again.');
        console.error('Error fetching reset requests:', err);
      }
    };
    fetchResetRequests();
  }, [selectedCenter, refresh]);

  const handleSubmit = async (id) => {
    setStudentId(id);
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/admin/student-data', { student_id: id });
      setStudentData(response.data);
    } catch (err) {
      setError('Failed to fetch student data. Please try again.');
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (student_id, reset_id) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/reject-reset-request', { 
        student_id: student_id.toString(), 
        reset_id: reset_id.toString() 
      });
      setRefresh((prev) => !prev);
      setDeleteDialog({ open: false, request: null });
      // You can add a success message state here if needed
    } catch (err) {
      setError('Error Rejecting Request!!!');
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // DataGrid columns for reset requests
  const resetRequestColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
          icon={<BadgeIcon />}
        />
      )
    },
    {
      field: 'student_id',
      headerName: 'Student ID',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 2,
      minWidth: 150,
    },
    {
      field: 'reset_type',
      headerName: 'Reset Type',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="secondary"
          variant="filled"
        />
      )
    },
    {
      field: 'center',
      headerName: 'Center',
      flex: 1,
      minWidth: 80,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      )
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 1.5,
      minWidth: 120,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Reset Student">
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<ResetIcon />}
              onClick={() => {
                setResetId(params.row.id);
                handleSubmit(params.row.student_id);
              }}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Reset
            </Button>
          </Tooltip>
          <Tooltip title="Reject Request">
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setDeleteDialog({ open: true, request: params.row })}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Reject
            </Button>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <StyledContainer>
      <Fade in={true} timeout={600}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              <SchoolIcon sx={{ fontSize: { xs: '2rem', md: '3rem' }, color: '#1976d2' }} />
              Student Data Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage student progress resets and view detailed information
            </Typography>
          </Box>

          {/* Center Selection */}
          <ModernCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <LocationIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Center Selection
                </Typography>
              </Stack>
              <FormControl fullWidth>
                <InputLabel>Select Center</InputLabel>
                <Select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  label="Select Center"
                >
                  <MenuItem value="">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationIcon fontSize="small" />
                      <span>All Centers</span>
                    </Stack>
                  </MenuItem>
                  {centers.map((center) => (
                    <MenuItem key={center.id} value={center.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationIcon fontSize="small" />
                        <span>{center.center}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </ModernCard>

          {/* Reset Requests Table */}
          <ModernCard sx={{ mb: 3 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'warning.main' }}><RefreshIcon /></Avatar>}
              title="Reset Requests"
              subheader={`${resetRequests.length} pending requests`}
              action={
                <Tooltip title="Refresh Data">
                  <IconButton onClick={() => setRefresh(!refresh)}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              {resetError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                  {resetError}
                </Alert>
              )}
              <Box sx={{ height: 400, width: '100%' }}>
                <StyledDataGrid
                  rows={resetRequests}
                  columns={resetRequestColumns}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 }
                    }
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
                  loading={loading}
                />
              </Box>
            </CardContent>
          </ModernCard>

          {/* Loading State */}
          {loading && (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px', mb: 3 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Loading student data...
              </Typography>
            </Paper>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Student Data Display */}
          {studentData && (
            <Zoom in={true} timeout={800}>
              <Box>
                {/* Student Information */}
                <ModernCard sx={{ mb: 3 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
                    title="Student Information"
                    subheader="Personal details and basic information"
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <InfoCard>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <AccountIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Student ID
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  {studentData.studentResults[0].student_id}
                                </Typography>
                              </CardContent>
                            </InfoCard>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoCard>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <PersonIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Full Name
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  {studentData.studentResults[0].fullname}
                                </Typography>
                              </CardContent>
                            </InfoCard>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoCard>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <BadgeIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Batch No
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  {studentData.studentResults[0].batchNo}
                                </Typography>
                              </CardContent>
                            </InfoCard>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoCard>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <LocationIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Center
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  {studentData.studentResults[0].center}
                                </Typography>
                              </CardContent>
                            </InfoCard>
                          </Grid>
                          <Grid item xs={12}>
                            <InfoCard>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <CalendarIcon color="primary" sx={{ fontSize: '2rem', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Batch Date
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  {studentData.studentResults[0].batchdate}
                                </Typography>
                              </CardContent>
                            </InfoCard>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: '12px',
                            background: alpha(theme.palette.primary.main, 0.02),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {studentData.studentResults[0].base64 ? (
                            <Box>
                              <Avatar
                                src={`data:image/jpeg;base64,${studentData.studentResults[0].base64}`}
                                sx={{
                                  width: 150,
                                  height: 150,
                                  mb: 2,
                                  border: '3px solid',
                                  borderColor: 'primary.main'
                                }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                Student Photo
                              </Typography>
                            </Box>
                          ) : (
                            <Box>
                              <ImageIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                              <Typography variant="body2" color="text.secondary">
                                No image available
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </ModernCard>

                {/* Audio Logs */}
                <ModernCard sx={{ mb: 3 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'success.main' }}><AudioIcon /></Avatar>}
                    title="Audio Logs"
                    subheader="Recording attempts and passages"
                    action={
                      <IconButton onClick={() => toggleSection('audio')}>
                        {expandedSections.audio ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse in={expandedSections.audio}>
                    <CardContent sx={{ pt: 0 }}>
                      <Box sx={{ height: 300, width: '100%' }}>
                        <StyledDataGrid
                          rows={studentData.audioLogs.map((log, index) => ({ ...log, id: index }))}
                          columns={[
                            { field: 'trial', headerName: 'Trial', flex: 1 },
                            { field: 'passageA', headerName: 'Passage A', flex: 2 },
                            { field: 'passageB', headerName: 'Passage B', flex: 2 }
                          ]}
                          initialState={{
                            pagination: {
                              paginationModel: { pageSize: 5 }
                            }
                          }}
                          pageSizeOptions={[5]}
                          disableRowSelectionOnClick
                        />
                      </Box>
                    </CardContent>
                  </Collapse>
                </ModernCard>

                {/* Shorthand Passage */}
                <ModernCard sx={{ mb: 3 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'info.main' }}><TextIcon /></Avatar>}
                    title="Shorthand Passage"
                    subheader="Passage logs and final submissions"
                    action={
                      <IconButton onClick={() => toggleSection('shorthand')}>
                        {expandedSections.shorthand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse in={expandedSections.shorthand}>
                    <CardContent sx={{ pt: 0 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2, borderRadius: '8px' }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Passage A
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Log:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, minHeight: '60px' }}>
                              {studentData.shorthandPassage[0].passage_a_log || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Final:
                            </Typography>
                            <Typography variant="body2" sx={{ minHeight: '60px' }}>
                              {studentData.shorthandPassage[0].final_passageA || 'N/A'}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2, borderRadius: '8px' }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Passage B
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Log:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, minHeight: '60px' }}>
                              {studentData.shorthandPassage[0].passage_b_log || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Final:
                            </Typography>
                            <Typography variant="body2" sx={{ minHeight: '60px' }}>
                              {studentData.shorthandPassage[0].final_passageB || 'N/A'}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Collapse>
                </ModernCard>

                {/* Typing Passage */}
                <ModernCard sx={{ mb: 3 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'warning.main' }}><TextIcon /></Avatar>}
                    title="Typing Passage"
                    subheader="Typing test logs and submissions"
                    action={
                      <IconButton onClick={() => toggleSection('typing')}>
                        {expandedSections.typing ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse in={expandedSections.typing}>
                    <CardContent sx={{ pt: 0 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2, borderRadius: '8px' }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Typing Passage Log
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" sx={{ minHeight: '100px' }}>
                              {studentData.typingPassage[0].typing_passage_log || 'N/A'}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2, borderRadius: '8px' }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Final Typing Passage
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" sx={{ minHeight: '100px' }}>
                              {studentData.typingPassage[0].final_typing_passage || 'N/A'}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Collapse>
                </ModernCard>

                {/* Student Logs */}
                <ModernCard sx={{ mb: 3 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><LogIcon /></Avatar>}
                    title="Student Logs"
                    subheader="Detailed activity logs"
                    action={
                      <IconButton onClick={() => toggleSection('logs')}>
                        {expandedSections.logs ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse in={expandedSections.logs}>
                    <CardContent sx={{ pt: 0 }}>
                      {studentData.studentLogs?.length ? (
                        <Box sx={{ overflowX: 'auto' }}>
                          <Paper sx={{ p: 2, borderRadius: '8px', minWidth: 600 }}>
                            {Object.entries(studentData.studentLogs[0]).map(([key, value], index) => (
                              <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                  {key.replace(/_/g, ' ').toUpperCase()}
                                </Typography>
                                <Typography variant="body2" sx={{ pl: 1 }}>
                                  {value || 'N/A'}
                                </Typography>
                                {index < Object.keys(studentData.studentLogs[0]).length - 1 && (
                                  <Divider sx={{ mt: 1 }} />
                                )}
                              </Box>
                            ))}
                          </Paper>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No logs available
                        </Typography>
                      )}
                    </CardContent>
                  </Collapse>
                </ModernCard>

                {/* Exam Stages */}
                <ModernCard sx={{ mb: 3 }}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'error.main' }}><ExamIcon /></Avatar>}
                    title="Exam Stages"
                    subheader="Examination progress and stages"
                    action={
                      <IconButton onClick={() => toggleSection('stages')}>
                        {expandedSections.stages ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                  />
                  <Collapse in={expandedSections.stages}>
                    <CardContent sx={{ pt: 0 }}>
                      {studentData.examStages?.length ? (
                        <Grid container spacing={2}>
                          {Object.entries(studentData.examStages[0]).map(([stage, status], index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Paper
                                sx={{
                                  p: 2,
                                  textAlign: 'center',
                                  borderRadius: '8px',
                                  bgcolor: status === 'completed' ? 'success.light' : 
                                           status === 'in_progress' ? 'warning.light' : 'grey.100'
                                }}
                              >
                                {status === 'completed' ? (
                                  <CheckIcon sx={{ color: 'success.main', mb: 1 }} />
                                ) : (
                                  <TimeIcon sx={{ color: 'warning.main', mb: 1 }} />
                                )}
                                <Typography variant="subtitle2" gutterBottom>
                                  {stage.replace(/_/g, ' ').toUpperCase()}
                                </Typography>
                                <Chip
                                  label={status || 'pending'}
                                  size="small"
                                  color={status === 'completed' ? 'success' : 
                                         status === 'in_progress' ? 'warning' : 'default'}
                                />
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No exam stages available
                        </Typography>
                      )}
                    </CardContent>
                  </Collapse>
                </ModernCard>
              </Box>
            </Zoom>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, request: null })}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CancelIcon color="error" />
              Confirm Rejection
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to reject the reset request for student{' '}
                <strong>{deleteDialog.request?.student_id}</strong>?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialog({ open: false, request: null })}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteDialog.request?.student_id, deleteDialog.request?.id)}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Reject Request
              </Button>
            </DialogActions>
          </Dialog>

          {/* Reset Student Progress Component */}
          {studentData && (
            <ResetStudentProgress studentId={studentId} resetId={resetId} />
          )}
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default StudentData;
