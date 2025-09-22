// // src\components\super-admin\ExpertReview.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ExpertReview.css';

// const ExpertReview = () => {
//   const [message, setMessage] = useState('');
//   const [loadingExpertLogs, setLoadingExpertLogs] = useState(false);
//   const [loadingModLogs, setLoadingModLogs] = useState(false);
//   const [error, setError] = useState('');
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [expertReviewLogs, setExpertReviewLogs] = useState([]);
//   const [modReviewLogs, setModReviewLogs] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [logsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [allColumns, setAllColumns] = useState([]);
//   const [activeTab, setActiveTab] = useState('expert');
//   const [loadingExpertTable, setLoadingExpertTable] = useState(false);
//   const [loadingModTable, setLoadingModTable] = useState(false);

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   useEffect(() => {
//     if (selectedDepartment) {
//       fetchExpertReviewLogs();
//       fetchModReviewLogs();
//     }
//   }, [selectedDepartment, currentPage]);

//   useEffect(() => {
//     if (activeTab === 'expert' && expertReviewLogs.length > 0) {
//       const columns = Object.keys(expertReviewLogs[0]);
//       setAllColumns(columns);
//       setSelectedColumns(columns);
//     } else if (activeTab === 'mod' && modReviewLogs.length > 0) {
//       const columns = Object.keys(modReviewLogs[0]);
//       setAllColumns(columns);
//       setSelectedColumns(columns);
//     }
//   }, [expertReviewLogs, modReviewLogs, activeTab]);

//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/get-departments-students');
      
//       if (response.status === 201) {
//         setDepartments(response.data);
//         if (response.data.length > 0) {
//           setSelectedDepartment(response.data[0].departmentId);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       setError('An error occurred while fetching departments. Please refresh the page.');
//     }
//   };

//   const fetchExpertReviewLogs = async () => {
//     setLoadingExpertTable(true);
//     setError('');
//     setMessage('');

//     try {
//       const response = await axios.get(`http://localhost:3000/get-expert-review-logs?department=${selectedDepartment}&page=${currentPage}&limit=${logsPerPage}`);
      
//       if (response.status === 201) {
//         setExpertReviewLogs(response.data);
//         setMessage(`Successfully fetched expert review logs for department ${selectedDepartment}`);
//       } else if (response.status === 404) {
//         setExpertReviewLogs([]);
//         setMessage("No expert review logs found for this department.");
//       }
//     } catch (error) {
//       console.error('Error fetching expert review logs:', error);
//       // setError('An error occurred while fetching expert review logs. Please try again.');
//     } finally {
//       setLoadingExpertTable(false);
//     }
//   };

//   const fetchModReviewLogs = async () => {
//     setLoadingModTable(true);
//     setError('');
//     setMessage('');

//     try {
//       const response = await axios.get(`http://localhost:3000/get-mod-review-logs?department=${selectedDepartment}&page=${currentPage}&limit=${logsPerPage}`);
     
//       if (response.status === 201) {
//         setModReviewLogs(response.data);
//         setMessage(`Successfully fetched mod review logs for department ${selectedDepartment}`);
//       } else if (response.status === 404) {
//         setModReviewLogs([]);
//         setMessage("No mod review logs found for this department.");
//       }
//     } catch (error) {
//       console.error('Error fetching mod review logs:', error);
//       setError('An error occurred while fetching mod review logs. Please try again.');
//     } finally {
//       setLoadingModTable(false);
//     }
//   };

//   const handleExpertLogs = async () => {
//     console.log(`[${new Date().toISOString()}] handleExpertLogs initiated`);
    
//     if (!selectedDepartment) {
//         const errorMsg = 'Please select a department';
//         console.error(`[${new Date().toISOString()}] Validation error: ${errorMsg}`);
//         setError(errorMsg);
//         return;
//     }

//     console.log(`[${new Date().toISOString()}] Selected department: ${selectedDepartment}`);
//     setLoadingExpertLogs(true);
//     setError('');
//     setMessage('');

//     try {
//         console.log(`[${new Date().toISOString()}] Making API request to populate expert review log`);
//         const response = await axios.post('http://localhost:3000/populate-expert-review-log', {
//             department: selectedDepartment
//         });
        
//         console.log(`[${new Date().toISOString()}] API response received`, {
//             status: response.status,
//             data: response.data
//         });
        
//         if (response.status === 200) {
//             const successMsg = response.data.message;
//             console.log(`[${new Date().toISOString()}] Success: ${successMsg}`);
//             setMessage(successMsg);
//             console.log(`[${new Date().toISOString()}] Triggering fetchExpertReviewLogs`);
//             fetchExpertReviewLogs();
//         } else if (response.status === 201) {
//             const infoMsg = "No data found for the specified department.";
//             console.log(`[${new Date().toISOString()}] Info: ${infoMsg}`);
//             setMessage(infoMsg);
//         }
//     } catch (error) {
//         const errorMsg = 'An error occurred while populating expert logs. Please try again.';
//         console.error(`[${new Date().toISOString()}] Error in handleExpertLogs:`, {
//             error: error.response ? error.response.data : error.message,
//             stack: error.stack
//         });
//         setError(errorMsg);
//     } finally {
//         console.log(`[${new Date().toISOString()}] handleExpertLogs completed`);
//         setLoadingExpertLogs(false);
//     }
// };

//   const handleModLogs = async () => {
//     if (!selectedDepartment) {
//       setError('Please select a department');
//       return;
//     }

//     setLoadingModLogs(true);
//     setError('');
//     setMessage('');

//     try {
//       const response = await axios.post('http://localhost:3000/populate-mod-review-log', {
//         department: selectedDepartment
//       });
     
//       if (response.status === 200) {
//         setMessage(response.data.message);
//         fetchModReviewLogs();
//       } else if (response.status === 201) {
//         setMessage("No data found for the specified department.");
//       }
//     } catch (error) {
//       console.error('Error fetching logs:', error);
//       setError('An error occurred while fetching logs. Please try again.');
//     } finally {
//       setLoadingModLogs(false);
//     }
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleColumnSelection = (column) => {
//     setSelectedColumns((prevColumns) =>
//       prevColumns.includes(column)
//         ? prevColumns.filter((c) => c !== column)
//         : [...allColumns.filter(c => prevColumns.includes(c) || c === column)]
//     );
//   };

//   const filteredLogs = activeTab === 'expert'
//     ? expertReviewLogs.filter((log) =>
//         Object.values(log).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       )
//     : modReviewLogs.filter((log) =>
//         Object.values(log).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );

//   const indexOfLastLog = currentPage * logsPerPage;
//   const indexOfFirstLog = indexOfLastLog - logsPerPage;
//   const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const renderPaginationButtons = () => {
//     const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
//     const maxButtons = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
//     let endPage = Math.min(totalPages, startPage + maxButtons - 1);

//     if (endPage - startPage + 1 < maxButtons) {
//       startPage = Math.max(1, endPage - maxButtons + 1);
//     }

//     const pageNumbers = [];

//     if (startPage > 1) {
//       pageNumbers.push(1);
//       if (startPage > 2) {
//         pageNumbers.push('...');
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }

//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         pageNumbers.push('...');
//       }
//       pageNumbers.push(totalPages);
//     }

//     return pageNumbers.map((number, index) =>
//       number === '...' ? (
//         <span key={`ellipsis-${index}`}>...</span>
//       ) : (
//         <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'er-active' : ''}>
//           {number}
//         </button>
//       )
//     );
//   };

//   return (
//     <div className="er-expert-review-content">
//       <h1>Populate Tables</h1>
//       <div className="er-department-selector">
//         <label htmlFor="department-select">Select Department:</label>
//         <select
//           id="department-select"
//           value={selectedDepartment}
//           onChange={(e) => setSelectedDepartment(e.target.value)}
//         >
//           <option value="">Select a department</option>
//           {departments.map((dept) => (
//             <option key={dept.departmentId} value={dept.departmentId}>
//               {dept.departmentId}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="er-buttons-container">
//         <div className="er-buttons">
//           <button
//             onClick={handleExpertLogs}
//             className="er-fetch-logs-button"
//             disabled={!selectedDepartment}
//           >
//             {loadingExpertLogs ? 'Fetching...' : 'Populate Expert Logs'}
//           </button>
//           <button
//             onClick={handleModLogs}
//             className="er-fetch-logs-button"
//             disabled={loadingModLogs || !selectedDepartment}
//           >
//             {loadingModLogs ? 'Fetching...' : 'Populate Mod Logs'}
//           </button>
//         </div>
//       </div>

//       {message && <p className="er-success-message">{message}</p>}
//       {error && <p className="er-error-message">{error}</p>}
      
//       <div className="er-review-logs">
//         <div className="er-tab-buttons">
//           <button
//             className={activeTab === 'expert' ? 'er-active' : ''}
//             onClick={() => setActiveTab('expert')}
//           >
//             Expert Review Logs
//           </button>
//           <button
//             className={activeTab === 'mod' ? 'er-active' : ''}
//             onClick={() => setActiveTab('mod')}
//           >
//             Mod Review Logs
//           </button>
//         </div>
//         <h2>{activeTab === 'expert' ? 'Expert' : 'Mod'} Review Logs for Department {selectedDepartment}</h2>
//         <div className="er-search-bar">
//           <input
//             type="text"
//             placeholder="Search logs..."
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </div>
//         <div className="er-column-selector">
//           <label>Select columns to display:</label>
//           {allColumns.map((column) => (
//             <label key={column}>
//               <input
//                 type="checkbox"
//                 checked={selectedColumns.includes(column)}
//                 onChange={() => handleColumnSelection(column)}
//               />
//               {column}
//             </label>
//           ))}
//         </div>
//         <div className="er-table-container">
//           {activeTab === 'expert' && loadingExpertTable && <p>Loading Expert Review Logs...</p>}
//           {activeTab === 'mod' && loadingModTable && <p>Loading Mod Review Logs...</p>}
//           {!loadingExpertTable && !loadingModTable && (
//             <>
//               {currentLogs.length > 0 ? (
//                 <table className="er-table">
//                   <thead>
//                     <tr>
//                       {selectedColumns.map((column) => (
//                         <th key={column} className={['passageA', 'passageB', 'ansPassageA', 'ansPassageB'].includes(column) ? 'er-wide-column' : 'er-narrow-column'}>
//                           {column}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentLogs.map((log) => (
//                       <tr key={log.id}>
//                         {selectedColumns.map((column) => (
//                           <td key={column} className={['passageA', 'passageB', 'ansPassageA', 'ansPassageB'].includes(column) ? 'er-wide-column er-wrap-text' : 'er-narrow-column'}>
//                             {log[column]}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No logs available for the selected department.</p>
//               )}
//             </>
//           )}
//         </div>
//         {currentLogs.length > 0 && (
//           <div className="er-pagination">
//             {renderPaginationButtons()}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExpertReview;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  useTheme,
  alpha,
  Fade,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
  Assessment as AnalyticsIcon,
  Person as ExpertIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  PlayArrow as PopulateIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  TableChart as TableIcon,
  Business as DepartmentIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  PersonSearch as StudentSearchIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Full-width container
const StyledContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  padding: theme.spacing(3),
  width: '100%',
}));

const AnalyticsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
  }
}));

const ActionCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  marginBottom: theme.spacing(3),
  width: '100%',
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '0',
  backgroundColor: 'transparent',
  fontFamily: theme.typography.fontFamily,
  width: '100%',
  height: '100%',
  '& .MuiDataGrid-main': {
    borderRadius: '0',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    fontWeight: 700,
    fontSize: '0.95rem',
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
    }
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.2),
    fontSize: '0.9rem',
    padding: theme.spacing(1),
  },
  '& .MuiDataGrid-row': {
    minHeight: '60px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    }
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minHeight: '48px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  }
}));

// Enhanced Dialog for viewing large content
const ContentViewDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
    backdropFilter: 'blur(20px)',
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: '8px',
  padding: theme.spacing(2),
  maxHeight: '60vh',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '0.95rem',
  lineHeight: 1.6,
  fontFamily: 'monospace'
}));

// Custom Toolbar
const CustomToolbar = ({ title, count, onRefresh, activeTab, searchResultsCount, isSearching }) => (
  <GridToolbarContainer sx={{ 
    p: 3, 
    justifyContent: 'space-between',
    borderBottom: '1px solid',
    borderColor: 'divider'
  }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      {activeTab === 'expert' ? (
        <ExpertIcon color="primary" sx={{ fontSize: 32 }} />
      ) : (
        <AnalyticsIcon color="secondary" sx={{ fontSize: 32 }} />
      )}
      <Box>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: activeTab === 'expert' ? 'primary.main' : 'secondary.main',
          fontSize: '1.2rem'
        }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {isSearching ? (
            <>
              {searchResultsCount} of {count} records match search • Click cells to view full content
            </>
          ) : (
            <>
              {count} records found • Click on cells to view full content
            </>
          )}
        </Typography>
      </Box>
    </Stack>
    <Stack direction="row" spacing={1}>
      <GridToolbarFilterButton sx={{ borderRadius: 2 }} />
      <GridToolbarExport sx={{ borderRadius: 2 }} />
      {onRefresh && (
        <IconButton onClick={onRefresh} sx={{ borderRadius: 2 }}>
          <RefreshIcon />
        </IconButton>
      )}
    </Stack>
  </GridToolbarContainer>
);

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ExpertReview = () => {
  const theme = useTheme();
  
  // State management
  const [message, setMessage] = useState('');
  const [loadingExpertLogs, setLoadingExpertLogs] = useState(false);
  const [loadingModLogs, setLoadingModLogs] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [expertReviewLogs, setExpertReviewLogs] = useState([]);
  const [modReviewLogs, setModReviewLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingExpertTable, setLoadingExpertTable] = useState(false);
  const [loadingModTable, setLoadingModTable] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  // New state for content dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchExpertReviewLogs();
      fetchModReviewLogs();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    const currentLogs = activeTab === 0 ? expertReviewLogs : modReviewLogs;
    if (currentLogs.length > 0) {
      const columns = Object.keys(currentLogs[0]);
      setAllColumns(columns);
      setSelectedColumns(columns);
    }
  }, [expertReviewLogs, modReviewLogs, activeTab]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-departments-students');
      
      if (response.status === 201) {
        setDepartments(response.data);
        if (response.data.length > 0) {
          setSelectedDepartment(response.data[0].departmentId);
        }
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('An error occurred while fetching departments. Please refresh the page.');
    }
  };

  const fetchExpertReviewLogs = async () => {
    setLoadingExpertTable(true);
    try {
      const response = await axios.get(`http://localhost:3000/get-expert-review-logs?department=${selectedDepartment}&page=1&limit=1000`);
      
      if (response.status === 201) {
        setExpertReviewLogs(response.data);
      } else {
        setExpertReviewLogs([]);
      }
    } catch (error) {
      console.error('Error fetching expert review logs:', error);
      setExpertReviewLogs([]);
    } finally {
      setLoadingExpertTable(false);
    }
  };

  const fetchModReviewLogs = async () => {
    setLoadingModTable(true);
    try {
      const response = await axios.get(`http://localhost:3000/get-mod-review-logs?department=${selectedDepartment}&page=1&limit=1000`);
     
      if (response.status === 201) {
        setModReviewLogs(response.data);
      } else {
        setModReviewLogs([]);
      }
    } catch (error) {
      console.error('Error fetching mod review logs:', error);
      setModReviewLogs([]);
    } finally {
      setLoadingModTable(false);
    }
  };

  const handleExpertLogs = async () => {
    if (!selectedDepartment) {
      setError('Please select a department');
      return;
    }
    
    setLoadingExpertLogs(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:3000/populate-expert-review-log', {
        department: selectedDepartment
      });
      
      if (response.status === 200) {
        setMessage(response.data.message);
        setSnackbarOpen(true);
        fetchExpertReviewLogs();
      } else if (response.status === 201) {
        setMessage("No data found for the specified department.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error populating expert logs:', error);
      setError('An error occurred while populating expert logs. Please try again.');
    } finally {
      setLoadingExpertLogs(false);
    }
  };

  const handleModLogs = async () => {
    if (!selectedDepartment) {
      setError('Please select a department');
      return;
    }
    
    setLoadingModLogs(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:3000/populate-mod-review-log', {
        department: selectedDepartment
      });
     
      if (response.status === 200) {
        setMessage(response.data.message);
        setSnackbarOpen(true);
        fetchModReviewLogs();
      } else if (response.status === 201) {
        setMessage("No data found for the specified department.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error populating mod logs:', error);
      setError('An error occurred while populating mod logs. Please try again.');
    } finally {
      setLoadingModLogs(false);
    }
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle cell click to open content dialog
  const handleCellClick = (params) => {
    const content = params.value || '';
    const columnName = params.field;
    const rowId = params.row.id;
    
    if (content && content.toString().length > 50) { // Only show dialog for longer content
      setDialogContent(content.toString());
      setDialogTitle(`${columnName.charAt(0).toUpperCase() + columnName.slice(1)} - Row ${rowId}`);
      setDialogOpen(true);
    }
  };

  // Copy content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(dialogContent).then(() => {
      setMessage('Content copied to clipboard!');
      setSnackbarOpen(true);
    });
  };

  // Check if content is long
  const isLongContent = (content) => {
    return content && content.toString().length > 100;
  };

  // Enhanced filter data based on search term - focusing on student ID and common identifying fields
  const filterData = (logs) => {
    if (!searchTerm.trim()) return logs;
    
    const searchLower = searchTerm.toLowerCase();
    
    return logs.filter((log) => {
      // Priority search fields - student ID and other identifying fields
      const priorityFields = [
        'studentId', 'student_id', 'id', 'rollNo', 'roll_no', 'registrationNo', 'registration_no',
        'enrollmentNo', 'enrollment_no', 'admissionNo', 'admission_no'
      ];
      
      // Check priority fields first (exact and partial matches)
      for (const field of priorityFields) {
        if (log[field]) {
          const fieldValue = log[field].toString().toLowerCase();
          if (fieldValue.includes(searchLower)) {
            return true;
          }
        }
      }
      
      // If no priority field matches, check all other fields
      return Object.entries(log).some(([key, value]) => {
        // Skip priority fields as they were already checked
        if (priorityFields.includes(key)) return false;
        
        // Search in other fields
        return value && value.toString().toLowerCase().includes(searchLower);
      });
    });
  };

  // Process data for DataGrid
  const processLogsForGrid = (logs) => {
    const filteredLogs = filterData(logs);
    return filteredLogs.map((log, index) => ({
      id: log.id || index,
      ...log
    }));
  };

  // Generate columns for DataGrid with enhanced cell rendering
  const generateColumns = (logs) => {
    if (!logs || logs.length === 0) return [];
    
    return selectedColumns.map(column => {
      // Highlight student ID columns
      const isStudentIdColumn = ['studentId', 'student_id', 'id', 'rollNo', 'roll_no', 'registrationNo', 'registration_no'].includes(column);
      
      return {
        field: column,
        headerName: column.charAt(0).toUpperCase() + column.slice(1),
        flex: ['passageA', 'passageB', 'ansPassageA', 'ansPassageB'].includes(column) ? 2 : 1,
        minWidth: ['passageA', 'passageB', 'ansPassageA', 'ansPassageB'].includes(column) ? 300 : 150,
        renderHeader: () => (
          <Stack direction="row" alignItems="center" spacing={1}>
            {isStudentIdColumn && <StudentSearchIcon fontSize="small" color="primary" />}
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 700,
              color: isStudentIdColumn ? 'primary.main' : 'inherit'
            }}>
              {column.charAt(0).toUpperCase() + column.slice(1)}
            </Typography>
          </Stack>
        ),
        renderCell: (params) => {
          const content = params.value || '';
          const isLong = isLongContent(content);
          const displayContent = isLong ? content.toString().substring(0, 100) + '...' : content;
          
          // Highlight matching search terms for student ID fields
          const isHighlighted = searchTerm && isStudentIdColumn && 
            content.toString().toLowerCase().includes(searchTerm.toLowerCase());
          
          return (
            <Box 
              sx={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                maxHeight: 100,
                overflow: 'hidden',
                py: 1,
                cursor: isLong ? 'pointer' : 'default',
                position: 'relative',
                backgroundColor: isHighlighted ? alpha(theme.palette.warning.main, 0.2) : 'transparent',
                borderRadius: isHighlighted ? '4px' : '0',
                px: isHighlighted ? 1 : 0,
                fontWeight: isStudentIdColumn ? 600 : 'normal',
                color: isStudentIdColumn ? theme.palette.primary.main : 'inherit',
                '&:hover': isLong ? {
                  backgroundColor: isHighlighted 
                    ? alpha(theme.palette.warning.main, 0.3)
                    : alpha(theme.palette.primary.main, 0.08),
                  borderRadius: '4px'
                } : {}
              }}
              onClick={() => isLong && handleCellClick(params)}
            >
              {displayContent}
              {isLong && (
                <Tooltip title="Click to view full content">
                  <ZoomInIcon 
                    sx={{ 
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      fontSize: 16,
                      color: 'primary.main',
                      opacity: 0.7
                    }} 
                  />
                </Tooltip>
              )}
              {isHighlighted && (
                <Chip
                  label="Match"
                  size="small"
                  color="warning"
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    height: '16px',
                    fontSize: '0.6rem'
                  }}
                />
              )}
            </Box>
          );
        }
      };
    });
  };

  const expertGridData = processLogsForGrid(expertReviewLogs);
  const modGridData = processLogsForGrid(modReviewLogs);
  const expertColumns = generateColumns(expertReviewLogs);
  const modColumns = generateColumns(modReviewLogs);

  // Calculate search results count
  const getSearchResultsCount = (originalLogs, filteredData) => {
    return searchTerm ? filteredData.length : originalLogs.length;
  };

  return (
    <StyledContainer>
      <Fade in={true} timeout={800}>
        <Box sx={{ width: '100%' }}>
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              mb: 4, 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <Stack alignItems="center" spacing={3}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '50%', 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DashboardIcon sx={{ fontSize: '4rem', color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  Expert Review Management
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    fontWeight: 400,
                    maxWidth: '700px',
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  Populate and manage expert and moderator review logs with comprehensive analytics
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Department Selection and Actions */}
          <ActionCard>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '8px', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1) 
                }}>
                  <DepartmentIcon color="primary" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Department Actions
                </Typography>
              </Stack>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Select Department</InputLabel>
                    <Select
                      value={selectedDepartment}
                      label="Select Department"
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.departmentId} value={dept.departmentId}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <DepartmentIcon fontSize="small" />
                            <span>Department {dept.departmentId}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2}>
                    <StyledButton
                      variant="contained"
                      onClick={handleExpertLogs}
                      disabled={!selectedDepartment || loadingExpertLogs}
                      startIcon={loadingExpertLogs ? <CircularProgress size={20} /> : <PopulateIcon />}
                      sx={{ 
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        color: 'white'
                      }}
                    >
                      {loadingExpertLogs ? 'Populating...' : 'Populate Expert Logs'}
                    </StyledButton>
                    
                    <StyledButton
                      variant="contained"
                      onClick={handleModLogs}
                      disabled={!selectedDepartment || loadingModLogs}
                      startIcon={loadingModLogs ? <CircularProgress size={20} /> : <PopulateIcon />}
                      sx={{ 
                        background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
                        color: 'white'
                      }}
                    >
                      {loadingModLogs ? 'Populating...' : 'Populate Mod Logs'}
                    </StyledButton>
                  </Stack>
                </Grid>
              </Grid>
              
              {/* Progress indicators */}
              {(loadingExpertLogs || loadingModLogs) && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                </Box>
              )}
            </CardContent>
          </ActionCard>

          {/* Enhanced Search and Column Selection */}
          <ActionCard>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by Student ID, Roll Number, or any field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StudentSearchIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={`${getSearchResultsCount(
                                activeTab === 0 ? expertReviewLogs : modReviewLogs,
                                activeTab === 0 ? expertGridData : modGridData
                              )} found`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <IconButton onClick={clearSearch} edge="end" size="small">
                              <ClearIcon />
                            </IconButton>
                          </Stack>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: '12px' }
                    }}
                    helperText="Search prioritizes Student ID fields (highlighted with 🔍). Results show exact and partial matches."
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Accordion sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <VisibilityIcon fontSize="small" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Column Selection ({selectedColumns.length}/{allColumns.length})
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup row>
                        {allColumns.map((column) => {
                          const isStudentIdColumn = ['studentId', 'student_id', 'id', 'rollNo', 'roll_no'].includes(column);
                          return (
                            <FormControlLabel
                              key={column}
                              control={
                                <Checkbox
                                  checked={selectedColumns.includes(column)}
                                  onChange={() => handleColumnToggle(column)}
                                  size="small"
                                />
                              }
                              label={
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                  {isStudentIdColumn && <StudentSearchIcon fontSize="small" color="primary" />}
                                  <Typography 
                                    variant="body2"
                                    sx={{ 
                                      fontWeight: isStudentIdColumn ? 600 : 'normal',
                                      color: isStudentIdColumn ? 'primary.main' : 'inherit'
                                    }}
                                  >
                                    {column.charAt(0).toUpperCase() + column.slice(1)}
                                  </Typography>
                                </Stack>
                              }
                              sx={{ minWidth: '200px' }}
                            />
                          );
                        })}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </CardContent>
          </ActionCard>

          {/* Data Tables */}
          <AnalyticsCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ px: 3, pt: 2 }}
              >
                <Tab 
                  icon={<Badge badgeContent={expertReviewLogs.length} color="primary"><ExpertIcon /></Badge>} 
                  label="Expert Review Logs" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Badge badgeContent={modReviewLogs.length} color="secondary"><AnalyticsIcon /></Badge>} 
                  label="Mod Review Logs" 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Expert Review Logs Tab */}
            <TabPanel value={activeTab} index={0}>
              {loadingExpertTable ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                  <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={60} />
                    <Typography variant="h6">Loading Expert Review Logs...</Typography>
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ height: '70vh', width: '100%' }}>
                  <StyledDataGrid
                    rows={expertGridData}
                    columns={expertColumns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50, 100]}
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    checkboxSelection={false}
                    rowSelection={false}
                    onCellClick={handleCellClick}
                    slots={{
                      toolbar: () => (
                        <CustomToolbar 
                          title={`Expert Review Logs - Department ${selectedDepartment}`}
                          count={expertReviewLogs.length}
                          searchResultsCount={expertGridData.length}
                          isSearching={!!searchTerm}
                          onRefresh={fetchExpertReviewLogs}
                          activeTab="expert"
                        />
                      )
                    }}
                    sx={{ 
                      '& .MuiDataGrid-cell': {
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Box>
              )}
            </TabPanel>

            {/* Mod Review Logs Tab */}
            <TabPanel value={activeTab} index={1}>
              {loadingModTable ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                  <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={60} />
                    <Typography variant="h6">Loading Mod Review Logs...</Typography>
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ height: '70vh', width: '100%' }}>
                  <StyledDataGrid
                    rows={modGridData}
                    columns={modColumns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50, 100]}
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    checkboxSelection={false}
                    rowSelection={false}
                    onCellClick={handleCellClick}
                    slots={{
                      toolbar: () => (
                        <CustomToolbar 
                          title={`Mod Review Logs - Department ${selectedDepartment}`}
                          count={modReviewLogs.length}
                          searchResultsCount={modGridData.length}
                          isSearching={!!searchTerm}
                          onRefresh={fetchModReviewLogs}
                          activeTab="mod"
                        />
                      )
                    }}
                    sx={{ 
                      '& .MuiDataGrid-cell': {
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Box>
              )}
            </TabPanel>
          </AnalyticsCard>

          {/* Content View Dialog */}
          <ContentViewDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {dialogTitle}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Copy to clipboard">
                    <IconButton onClick={copyToClipboard} size="small">
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => setDialogOpen(false)} size="small">
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <ContentBox>
                {dialogContent}
              </ContentBox>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Content length: {dialogContent.length} characters
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </ContentViewDialog>

          {/* Success/Error Messages */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSnackbarOpen(false)} 
              severity={error ? 'error' : 'success'}
              sx={{ width: '100%' }}
              icon={error ? <ErrorIcon /> : <SuccessIcon />}
            >
              {error || message}
            </Alert>
          </Snackbar>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                borderRadius: '12px'
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default ExpertReview;