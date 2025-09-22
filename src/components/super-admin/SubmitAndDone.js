// // // //src\components\super-admin\SubmitAndDone.js
// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import './SubmitAndDone.css';

// // // const SubmitAndDone = () => {
// // //   const [filters, setFilters] = useState({
// // //     subjectId: '',
// // //     qset: '',
// // //     expertId: '',
// // //     resetType: 'subject',
// // //   });
// // //   const [logs, setLogs] = useState([]);
// // //   const [options, setOptions] = useState({
// // //     subjects: [],
// // //     experts: [],
// // //     qsets: []
// // //   });
// // //   const [message, setMessage] = useState('');
// // //   const [loading, setLoading] = useState(false);

// // //   // Fetch initial subjects and experts
// // //   useEffect(() => {
// // //     const fetchInitialOptions = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const res = await axios.get('http://localhost:3000/review-logs/filter-options', {
// // //           params: { table: 'expertreviewlog' }
// // //         });
// // //         setOptions({
// // //           subjects: res.data.data?.subjects || [],
// // //           experts: res.data.data?.experts || [],
// // //           qsets: []
// // //         });
// // //       } catch (err) {
// // //         console.error('Failed to load options:', err);
// // //         setMessage('Error loading initial options');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchInitialOptions();
// // //   }, []);

// // //   // Fetch logs when expertId changes
// // //   useEffect(() => {
// // //     if (filters.expertId) {
// // //       fetchLogsWithFilters(filters);
// // //     }
// // //   }, [filters.expertId]);

// // //   // Fetch logs when subjectId changes
// // //   const handleSubjectChange = async (e) => {
// // //     const newSubjectId = e.target.value;
// // //     const updatedFilters = { ...filters, subjectId: newSubjectId, qset: '' };
// // //     setFilters(updatedFilters);
// // //     setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
// // //   };

// // //   // Manual fetch function
// // //   const fetchLogsWithFilters = async (customFilters) => {
// // //     setLoading(true);
// // //     try {
// // //       const params = {
// // //         qset: customFilters.qset || undefined,
// // //         expertId: customFilters.expertId || undefined,
// // //         subm_done: 1
// // //       };

// // //       if (customFilters.subjectId && customFilters.subjectId !== 'ALL') {
// // //         params.subjectId = customFilters.subjectId;
// // //       }

// // //       const res = await axios.get('http://localhost:3000/expert-review-logs', { params });

// // //       setLogs(res.data.data || []);

// // //       if (res.data.subjectQsets && customFilters.subjectId !== 'ALL') {
// // //         const existingQsets = res.data.subjectQsets
// // //           .filter(q => q.exists)
// // //           .map(q => ({
// // //             qset: q.qset,
// // //             displayText: `${customFilters.subjectId} - QSet ${q.qset}`
// // //           }));

// // //         setOptions(prev => ({
// // //           ...prev,
// // //           qsets: existingQsets
// // //         }));
// // //       } else {
// // //         setOptions(prev => ({
// // //           ...prev,
// // //           qsets: []
// // //         }));
// // //       }

// // //       setMessage(res.data.message || '');
// // //     } catch (err) {
// // //       console.error('Failed to fetch logs:', err);
// // //       setLogs([]);
// // //       setMessage(err.response?.data?.message || 'Error fetching logs');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Reset logs
// // //   const resetLogs = async () => {
// // //     if (!filters.subjectId || filters.subjectId === 'ALL') {
// // //       setMessage('Please select a specific subject to reset');
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       const backendResetType = filters.resetType === 'subject' && filters.qset
// // //         ? 'qset'
// // //         : filters.resetType;

// // //       const data = {
// // //         subjectId: filters.subjectId,
// // //         qset: filters.qset || undefined,
// // //         expertId: filters.expertId || undefined,
// // //         resetType: backendResetType
// // //       };

// // //       const res = await axios.post('http://localhost:3000/expert-review-logs/reset', data);
// // //       setMessage(res.data.message || 'Reset successful');
// // //       fetchLogsWithFilters(filters);
// // //     } catch (err) {
// // //       console.error('Failed to reset logs:', err);
// // //       setMessage(err.response?.data?.message || 'Error resetting logs');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="submit-container">
// // //       <h2>Submit and Done</h2>

// // //       <div className="filters">
// // //         <div className="filter-group">
// // //           <select
// // //             value={filters.subjectId}
// // //             onChange={handleSubjectChange}
// // //             disabled={loading}
// // //           >
// // //             <option value="">Select Subject</option>
// // //             <option value="ALL">All Subjects</option>
// // //             {options.subjects.map((id) => (
// // //               <option key={`subject-${id}`} value={id}>
// // //                 {id}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         <div className="filter-group">
// // //           <select
// // //             value={filters.qset}
// // //             onChange={(e) => {
// // //               const newQset = e.target.value;
// // //               const updatedFilters = { ...filters, qset: newQset };
// // //               setFilters(updatedFilters);

// // //               if (filters.subjectId && filters.subjectId !== 'ALL' && newQset) {
// // //                 setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
// // //               }
// // //             }}
// // //             disabled={
// // //               !filters.subjectId ||
// // //               filters.subjectId === 'ALL' ||
// // //               loading ||
// // //               options.qsets.length === 0
// // //             }
// // //           >
// // //             <option value="">Select QSet</option>
// // //             {options.qsets.map((q) => (
// // //               <option key={`qset-${q.qset}`} value={q.qset}>
// // //                 {q.displayText}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         <div className="filter-group">
// // //           <select
// // //             value={filters.expertId}
// // //             onChange={(e) => {
// // //               const newExpertId = e.target.value;
// // //               setFilters({ ...filters, expertId: newExpertId });
// // //             }}
// // //             disabled={loading}
// // //           >
// // //             <option value="">Select Expert</option>
// // //             {options.experts.map((id) => (
// // //               <option key={`expert-${id}`} value={id}>
// // //                 {id}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         {/* <div className="filter-group">
// // //           <select
// // //             value={filters.resetType}
// // //             onChange={(e) => setFilters({ ...filters, resetType: e.target.value })}
// // //             disabled={loading}
// // //           >
// // //             <option value="subject">By Subject</option>
// // //             <option value="qset">By QSet</option>
// // //             <option value="expert">By Expert</option>
// // //           </select>
// // //         </div> */}

// // //         <div className="filter-group button-group">
// // //           <button
// // //             onClick={resetLogs}
// // //             disabled={!filters.subjectId || filters.subjectId === 'ALL' || loading}
// // //             className="reset-button"
// // //           >
// // //             {loading ? 'Processing...' : 'Reset Done Status'}
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {message && (
// // //         <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
// // //           {message}
// // //         </div>
// // //       )}

// // //       <div className="log-table">
// // //         {logs.length > 0 ? (
// // //           <table>
// // //             <thead>
// // //               <tr>
// // //                 <th>ID</th>
// // //                 <th>Expert</th>
// // //                 <th>Subject</th>
// // //                 <th>QSet</th>
// // //                 <th>Status</th>
// // //                 <th>Submitted</th>
// // //                 <th>Logged In</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {logs.map((log) => (
// // //                 <tr key={log.id}>
// // //                   <td>{log.id}</td>
// // //                   <td>{log.expertId}</td>
// // //                   <td>{log.subjectId}</td>
// // //                   <td>{log.qset}</td>
// // //                   <td>{log.status}</td>
// // //                   <td>{log.subm_time || '-'}</td>
// // //                   <td>{log.loggedin || '-'}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         ) : (
// // //           <p className="no-logs">
// // //             {filters.subjectId
// // //               ? 'No logs found for selected criteria'
// // //               : 'Please select a subject'}
// // //           </p>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SubmitAndDone;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Container, Row, Col, Form, Button, Table, Spinner, Alert, Card,
//   Pagination
// } from 'react-bootstrap';
// import './SubmitAndDone.css';

// const SubmitAndDone = () => {
//   const [filters, setFilters] = useState({
//     subjectId: '',
//     qset: '',
//     expertId: '',
//   });
//   const [logs, setLogs] = useState([]);
//   const [options, setOptions] = useState({
//     subjects: [],
//     experts: [],
//     qsets: []
//   });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [logsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch initial subjects and experts
//   useEffect(() => {
//     const fetchInitialOptions = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('http://localhost:3000/review-logs/filter-options', {
//           params: { table: 'expertreviewlog' }
//         });
//         setOptions({
//           subjects: res.data.data?.subjects || [],
//           experts: res.data.data?.experts || [],
//           qsets: []
//         });
//       } catch (err) {
//         console.error('Failed to load options:', err);
//         setMessage('Error loading initial options');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialOptions();
//   }, []);

//   // Fetch logs when expertId changes
//   useEffect(() => {
//     if (filters.expertId) {
//       fetchLogsWithFilters(filters);
//     }
//   }, [filters.expertId]);

//   // Fetch logs when subjectId changes
//   const handleSubjectChange = async (e) => {
//     const newSubjectId = e.target.value;
//     const updatedFilters = { ...filters, subjectId: newSubjectId, qset: '' };
//     setFilters(updatedFilters);
//     setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
//   };

//   const fetchLogsWithFilters = async (customFilters) => {
//     setLoading(true);
//     try {
//       const params = {
//         qset: customFilters.qset || undefined,
//         expertId: customFilters.expertId || undefined,
//         subm_done: 1
//       };

//       if (customFilters.subjectId && customFilters.subjectId !== 'ALL') {
//         params.subjectId = customFilters.subjectId;
//       }

//       const res = await axios.get('http://localhost:3000/expert-review-logs', { params });
//       setLogs(res.data.data || []);
//       setCurrentPage(1); // Reset to the first page when filters change

//       if (res.data.subjectQsets && customFilters.subjectId !== 'ALL') {
//         const existingQsets = res.data.subjectQsets
//           .filter(q => q.exists)
//           .map(q => ({ qset: q.qset, displayText: `QSet ${q.qset}` }));
//         setOptions(prev => ({ ...prev, qsets: existingQsets }));
//       } else {
//         setOptions(prev => ({ ...prev, qsets: [] }));
//       }

//       setMessage(res.data.message || '');
//     } catch (err) {
//       console.error('Failed to fetch logs:', err);
//       setLogs([]);
//       setMessage(err.response?.data?.message || 'Error fetching logs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetLogs = async () => {
//     if (!filters.subjectId || filters.subjectId === 'ALL') {
//       setMessage('Please select a specific subject to reset');
//       return;
//     }

//     setLoading(true);
//     try {
//       const backendResetType = filters.qset ? 'qset' : 'subject';
//       const data = {
//         subjectId: filters.subjectId,
//         qset: filters.qset || undefined,
//         expertId: filters.expertId || undefined,
//         resetType: backendResetType
//       };

//       const res = await axios.post('http://localhost:3000/expert-review-logs/reset', data);
//       setMessage(res.data.message || 'Reset successful');
//       fetchLogsWithFilters(filters);
//     } catch (err) {
//       console.error('Failed to reset logs:', err);
//       setMessage(err.response?.data?.message || 'Error resetting logs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination Logic
//   const filteredLogs = logs.filter(log =>
//     log.id.toString().includes(searchTerm.toLowerCase())
//   );
//   const indexOfLastLog = currentPage * logsPerPage;
//   const indexOfFirstLog = indexOfLastLog - logsPerPage;
//   const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
//   const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <Container className="my-4">
//       <h2 className="text-center mb-4">Submit and Done</h2>

//       <Card className="p-4 mb-4 shadow">
//         <Form>
//           <Row className="g-3 align-items-end">
//             <Col xs={12} md={3}>
//               <Form.Group>
//                 <Form.Label>Subject</Form.Label>
//                 <Form.Select
//                   value={filters.subjectId}
//                   onChange={handleSubjectChange}
//                   disabled={loading}
//                 >
//                   <option value="">Select Subject</option>
//                   <option value="ALL">All Subjects</option>
//                   {options.subjects.map((id) => (
//                     <option key={`subject-${id}`} value={id}>{id}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col xs={12} md={3}>
//               <Form.Group>
//                 <Form.Label>QSet</Form.Label>
//                 <Form.Select
//                   value={filters.qset}
//                   onChange={(e) => {
//                     const newQset = e.target.value;
//                     const updatedFilters = { ...filters, qset: newQset };
//                     setFilters(updatedFilters);
//                     if (filters.subjectId && filters.subjectId !== 'ALL' && newQset) {
//                       setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
//                     }
//                   }}
//                   disabled={!filters.subjectId || filters.subjectId === 'ALL' || loading || options.qsets.length === 0}
//                 >
//                   <option value="">Select QSet</option>
//                   {options.qsets.map((q) => (
//                     <option key={`qset-${q.qset}`} value={q.qset}>{q.displayText}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col xs={12} md={3}>
//               <Form.Group>
//                 <Form.Label>Expert</Form.Label>
//                 <Form.Select
//                   value={filters.expertId}
//                   onChange={(e) => setFilters({ ...filters, expertId: e.target.value })}
//                   disabled={loading}
//                 >
//                   <option value="">Select Expert</option>
//                   {options.experts.map((id) => (
//                     <option key={`expert-${id}`} value={id}>{id}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col xs={12} md={3}>
//               <Button
//                 variant="danger"
//                 onClick={resetLogs}
//                 disabled={!filters.subjectId || filters.subjectId === 'ALL' || loading}
//                 className="w-100"
//               >
//                 {loading ? (
//                   <>
//                     <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
//                     <span className="ms-2">Processing...</span>
//                   </>
//                 ) : (
//                   'Reset Done Status'
//                 )}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Card>

//       {message && (
//         <Alert variant={message.includes('Error') ? 'danger' : 'success'}>
//           {message}
//         </Alert>
//       )}

//       <Card className="shadow">
//         <Card.Header className="d-flex justify-content-between align-items-center">
//           <h4 className="mb-0">Logs Table</h4>
//           <Form.Group className="mb-0">
//             <Form.Control
//               type="text"
//               placeholder="Search by Student ID"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1); // Reset page on search
//               }}
//             />
//           </Form.Group>
//         </Card.Header>
//         <Card.Body>
//           <div className="table-responsive">
//             <Table striped bordered hover className="mb-0">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Expert</th>
//                   <th>Subject</th>
//                   <th>QSet</th>
//                   <th>Status</th>
//                   <th>Submitted</th>
//                   <th>Logged In</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentLogs.length > 0 ? (
//                   currentLogs.map((log) => (
//                     <tr key={log.id}>
//                       <td>{log.id}</td>
//                       <td>{log.expertId}</td>
//                       <td>{log.subjectId}</td>
//                       <td>{log.qset}</td>
//                       <td>{log.status}</td>
//                       <td>{log.subm_time || '-'}</td>
//                       <td>{log.loggedin || '-'}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       {loading ? (
//                         <Spinner animation="border" />
//                       ) : (
//                         filters.subjectId ? 'No logs found for selected criteria' : 'Please select a subject'
//                       )}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//         <Card.Footer>
//           <div className="d-flex justify-content-center">
//             <Pagination className="mb-0">
//               <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
//               <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
//               {[...Array(totalPages)].map((_, index) => (
//                 <Pagination.Item
//                   key={index + 1}
//                   active={index + 1 === currentPage}
//                   onClick={() => paginate(index + 1)}
//                 >
//                   {index + 1}
//                 </Pagination.Item>
//               ))}
//               <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
//               <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
//             </Pagination>
//           </div>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };

// export default SubmitAndDone;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Chip,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Fab,
  Fade,
  Zoom,
  useTheme,
  alpha
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  RestartAlt as ResetIcon,
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components for enhanced aesthetics
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: theme.palette.text.primary,
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  padding: '12px 24px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  }
}));

const ResetButton = styled(StyledButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #ee5a52 0%, #ff6b6b 100%)',
  },
  '&:disabled': {
    background: alpha(theme.palette.action.disabled, 0.12),
  }
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '16px',
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  '& .MuiDataGrid-main': {
    borderRadius: '16px',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '16px 16px 0 0',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: theme.palette.primary.main,
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.3),
    fontSize: '0.9rem',
  },
  '& .MuiDataGrid-row': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      transform: 'scale(1.001)',
    }
  },
  '& .MuiDataGrid-footerContainer': {
    borderRadius: '0 0 16px 16px',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  }
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    transform: 'scale(1.1)',
  }
}));

const SubmitAndDone = () => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    subjectId: '',
    qset: '',
    expertId: '',
  });
  const [logs, setLogs] = useState([]);
  const [options, setOptions] = useState({
    subjects: [],
    experts: [],
    qsets: []
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetch initial subjects and experts
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/review-logs/filter-options', {
          params: { table: 'expertreviewlog' }
        });
        setOptions({
          subjects: res.data.data?.subjects || [],
          experts: res.data.data?.experts || [],
          qsets: []
        });
      } catch (err) {
        console.error('Failed to load options:', err);
        setMessage('Error loading initial options');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialOptions();
  }, []);

  // Fetch logs when expertId changes
  useEffect(() => {
    if (filters.expertId) {
      fetchLogsWithFilters(filters);
    }
  }, [filters.expertId]);

  // Fetch logs when subjectId changes
  const handleSubjectChange = async (e) => {
    const newSubjectId = e.target.value;
    const updatedFilters = { ...filters, subjectId: newSubjectId, qset: '' };
    setFilters(updatedFilters);
    setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
  };

  const fetchLogsWithFilters = async (customFilters) => {
    setLoading(true);
    try {
      const params = {
        qset: customFilters.qset || undefined,
        expertId: customFilters.expertId || undefined,
        subm_done: 1
      };
      if (customFilters.subjectId && customFilters.subjectId !== 'ALL') {
        params.subjectId = customFilters.subjectId;
      }

      const res = await axios.get('http://localhost:3000/expert-review-logs', { params });
      setLogs(res.data.data || []);
      setPaginationModel(prev => ({ ...prev, page: 0 })); // Reset to first page

      if (res.data.subjectQsets && customFilters.subjectId !== 'ALL') {
        const existingQsets = res.data.subjectQsets
          .filter(q => q.exists)
          .map(q => ({ qset: q.qset, displayText: `QSet ${q.qset}` }));
        setOptions(prev => ({ ...prev, qsets: existingQsets }));
      } else {
        setOptions(prev => ({ ...prev, qsets: [] }));
      }
      setMessage(res.data.message || '');
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setLogs([]);
      setMessage(err.response?.data?.message || 'Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  const resetLogs = async () => {
    if (!filters.subjectId || filters.subjectId === 'ALL') {
      setMessage('Please select a specific subject to reset');
      return;
    }
    setLoading(true);
    try {
      const backendResetType = filters.qset ? 'qset' : 'subject';
      const data = {
        subjectId: filters.subjectId,
        qset: filters.qset || undefined,
        expertId: filters.expertId || undefined,
        resetType: backendResetType
      };

      const res = await axios.post('http://localhost:3000/expert-review-logs/reset', data);
      setMessage(res.data.message || 'Reset successful');
      fetchLogsWithFilters(filters);
    } catch (err) {
      console.error('Failed to reset logs:', err);
      setMessage(err.response?.data?.message || 'Error resetting logs');
    } finally {
      setLoading(false);
    }
  };

  // Filter logs based on search term
  const filteredLogs = logs.filter(log =>
    log.id.toString().includes(searchTerm.toLowerCase())
  );

  // DataGrid columns configuration
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    {
      field: 'expertId',
      headerName: 'Expert',
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'subjectId',
      headerName: 'Subject',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SubjectIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'qset',
      headerName: 'QSet',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={`Q${params.value}`}
          size="small"
          color="secondary"
          variant="filled"
        />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'completed' ? 'success' : 'warning'}
          icon={<CheckCircleIcon fontSize="small" />}
        />
      )
    },
    {
      field: 'subm_time',
      headerName: 'Submitted',
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || '-'}</Typography>
        </Box>
      )
    },
    {
      field: 'loggedin',
      headerName: 'Logged In',
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LoginIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || '-'}</Typography>
        </Box>
      )
    }
  ];

  // Custom toolbar for DataGrid
  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <DashboardIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Review Logs ({filteredLogs.length})
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <GridToolbarExport />
        </Box>
      </Box>
    </GridToolbarContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                // background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                color: '#1976d2',
                // WebkitBackgroundClip: 'text',
                // WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Submit and Done
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Monitor and manage expert review submissions
            </Typography>
          </Box>

          {/* Filters Card */}
          <Zoom in={true} timeout={600}>
            <StyledCard sx={{ mb: 4 }}>
              <CardHeader
                avatar={<FilterIcon color="primary" />}
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Filters & Controls
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Grid container spacing={3} alignItems="end">
                  <Grid item xs={12} sm={6} md={3}>
                    <StyledFormControl fullWidth size="small">
                      <InputLabel>Subject</InputLabel>
                      <Select
                        value={filters.subjectId}
                        label="Subject"
                        onChange={handleSubjectChange}
                        disabled={loading}
                        startAdornment={<SubjectIcon sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        <MenuItem value="">Select Subject</MenuItem>
                        <MenuItem value="ALL">All Subjects</MenuItem>
                        {options.subjects.map((id) => (
                          <MenuItem key={`subject-${id}`} value={id}>{id}</MenuItem>
                        ))}
                      </Select>
                    </StyledFormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <StyledFormControl fullWidth size="small">
                      <InputLabel>QSet</InputLabel>
                      <Select
                        value={filters.qset}
                        label="QSet"
                        onChange={(e) => {
                          const newQset = e.target.value;
                          const updatedFilters = { ...filters, qset: newQset };
                          setFilters(updatedFilters);
                          if (filters.subjectId && filters.subjectId !== 'ALL' && newQset) {
                            setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
                          }
                        }}
                        disabled={!filters.subjectId || filters.subjectId === 'ALL' || loading || options.qsets.length === 0}
                        startAdornment={<AssignmentIcon sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        <MenuItem value="">Select QSet</MenuItem>
                        {options.qsets.map((q) => (
                          <MenuItem key={`qset-${q.qset}`} value={q.qset}>{q.displayText}</MenuItem>
                        ))}
                      </Select>
                    </StyledFormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <StyledFormControl fullWidth size="small">
                      <InputLabel>Expert</InputLabel>
                      <Select
                        value={filters.expertId}
                        label="Expert"
                        onChange={(e) => setFilters({ ...filters, expertId: e.target.value })}
                        disabled={loading}
                        startAdornment={<PersonIcon sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        <MenuItem value="">Select Expert</MenuItem>
                        {options.experts.map((id) => (
                          <MenuItem key={`expert-${id}`} value={id}>{id}</MenuItem>
                        ))}
                      </Select>
                    </StyledFormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <ResetButton
                      fullWidth
                      size="large"
                      onClick={resetLogs}
                      disabled={!filters.subjectId || filters.subjectId === 'ALL' || loading}
                      startIcon={<ResetIcon />}
                    >
                      {loading ? 'Processing...' : 'Reset Status'}
                    </ResetButton>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Zoom>

          {/* Message Alert */}
          {message && (
            <Fade in={Boolean(message)} timeout={400}>
              <Alert
                severity={message.includes('Error') ? 'error' : 'success'}
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                }}
                onClose={() => setMessage('')}
              >
                {message}
              </Alert>
            </Fade>
          )}

          {/* Search and Data Table Card */}
          <Zoom in={true} timeout={800}>
            <StyledCard>
              <CardContent sx={{ p: 0 }}>
                {/* Search Header */}
                <Box sx={{ p: 3, pb: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      placeholder="Search by Student ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        }
                      }}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                    <Tooltip title="Refresh Data">
                      <IconButton
                        onClick={() => filters.subjectId && fetchLogsWithFilters(filters)}
                        disabled={loading}
                        sx={{
                          borderRadius: '12px',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Data Grid */}
                <Box sx={{ height: 600, px: 3, pb: 3 }}>
                  <StyledDataGrid
                    rows={filteredLogs}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25, 50]}
                    loading={loading}
                    disableRowSelectionOnClick
                    slots={{
                      toolbar: CustomToolbar,
                    }}
                    sx={{ fontSize: '0.9rem' }}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10 },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>

          {/* Floating Action Button */}
          <FloatingActionButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <RefreshIcon />
          </FloatingActionButton>
        </Box>
      </Fade>
    </Container>
  );
};

export default SubmitAndDone;
