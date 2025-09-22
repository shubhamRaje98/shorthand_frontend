// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import './BatchManagement.css';

// // // Import the ToggleSwitch component
// // const ToggleSwitch = ({ isOn, onToggle }) => {
// //     return (
// //         <label className="toggle-switch">
// //             <input
// //                 type="checkbox"
// //                 checked={isOn === 1}
// //                 onChange={(e) => onToggle(e.target.checked)}
// //             />
// //             <span className="switch" />
// //         </label>
// //     );
// // };

// // const BatchManagement = () => {
// //     // Helper functions defined first
// //     const formatDate = (dateString) => {
// //         return new Date(dateString).toLocaleDateString();
// //     };

// //     const formatTime = (timeString) => {
// //         if (!timeString) return '';
// //         return timeString.substring(0, 5);
// //     };

// //     // State declarations
// //     const [batches, setBatches] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [filters, setFilters] = useState({
// //         departmentId: '',
// //         batchNo: '',
// //         date: ''
// //     });

// //     useEffect(() => {
// //         fetchBatches();
// //     }, []);

// //     const fetchBatches = async () => {
// //         try {
// //             const response = await axios.get('http://localhost:3000/get-all-batches');
// //             setBatches(response.data.data);
// //             console.log(response.data)
// //             setLoading(false);
// //         } catch (err) {
// //             setError('Failed to fetch batches');
// //             setLoading(false);
// //         }
// //     };

// //     const handleStatusUpdate = async (batchNo, status, departmentId) => {
// //         try {
// //             const response = await axios.post('http://localhost:3000/update-batch-status', {
// //                 batchNo,
// //                 departmentId,
// //                 status: Boolean(status)
// //             });
            
// //             if (response.data.success) {
// //                 fetchBatches();
// //             } else {
// //                 setError(response.data.message);
// //             }
// //         } catch (err) {
// //             setError(err.response?.data?.message || 'Failed to update batch status');
// //             fetchBatches();
// //         }
// //     };

// //     const handleFilterChange = (e) => {
// //         const { name, value } = e.target;
// //         setFilters(prev => ({
// //             ...prev,
// //             [name]: value
// //         }));
// //     };

// //     // Get unique values for dropdowns
// //     const uniqueDepartments = [...new Set(batches.map(batch => batch.departmentId))];
// //     const uniqueBatchNos = [...new Set(batches.map(batch => batch.batchNo))];
// //     const uniqueDates = [...new Set(batches.map(batch => formatDate(batch.batchdate)))];

// //     const filteredBatches = batches.filter(batch => {
// //         const departmentMatch = filters.departmentId === '' || batch.departmentId.toString() === filters.departmentId;
// //         const batchMatch = filters.batchNo === '' || batch.batchNo.toString() === filters.batchNo;
// //         const dateMatch = filters.date === '' || formatDate(batch.batchdate) === filters.date;
        
// //         return departmentMatch && batchMatch && dateMatch;
// //     });

// //     if (loading) return <div className="loading">Loading...</div>;
// //     if (error) return <div className="error">{error}</div>;

// //     return (
// //         <div className="batch-management">
// //             <h1>Batch Management</h1>
            
// //             {/* Filter Section */}
// //             <div className="filters-row">
// //                 <div className="filter-item">
// //                     <select
// //                         name="departmentId"
// //                         value={filters.departmentId}
// //                         onChange={handleFilterChange}
// //                     >
// //                         <option value="">Select Department</option>
// //                         {uniqueDepartments.map(dept => (
// //                             <option key={dept} value={dept}>{dept}</option>
// //                         ))}
// //                     </select>
// //                 </div>

// //                 <div className="filter-item">
// //                     <select
// //                         name="batchNo"
// //                         value={filters.batchNo}
// //                         onChange={handleFilterChange}
// //                     >
// //                         <option value="">Select Batch No</option>
// //                         {uniqueBatchNos.map(batch => (
// //                             <option key={batch} value={batch}>{batch}</option>
// //                         ))}
// //                     </select>
// //                 </div>

// //                 <div className="filter-item">
// //                     <select
// //                         name="date"
// //                         value={filters.date}
// //                         onChange={handleFilterChange}
// //                     >
// //                         <option value="">Select Date</option>
// //                         {uniqueDates.map(date => (
// //                             <option key={date} value={date}>{date}</option>
// //                         ))}
// //                     </select>
// //                 </div>
// //             </div>

// //             <div className="table-container">
// //                 <table>
// //                     <thead>
// //                         <tr>
// //                             <th>Department Id</th>
// //                             <th>Batch No</th>
// //                             <th>Date</th>
// //                             <th>Reporting Time</th>
// //                             <th>Start Time</th>
// //                             <th>End Time</th>
// //                             <th>Status</th>
// //                             <th>Action</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {filteredBatches.map((batch) => (
// //                             <tr key={batch.batchNo}>
// //                                 <td>{batch.departmentId}</td>
// //                                 <td>{batch.batchNo}</td>
// //                                 <td>{formatDate(batch.batchdate)}</td>
// //                                 <td>{formatTime(batch.reporting_time)}</td>
// //                                 <td>{formatTime(batch.start_time)}</td>
// //                                 <td>{formatTime(batch.end_time)}</td>
// //                                 <td className={batch.batchstatus === 1 ? 'status-active' : 'status-inactive'}>
// //                                     {batch.batchstatus === 1 ? 'Active' : 'Inactive'}
// //                                 </td>
// //                                 <td>
// //                                     <ToggleSwitch
// //                                         isOn={batch.batchstatus}
// //                                         onToggle={(status) => handleStatusUpdate(batch.batchNo, status, batch.departmentId)}
// //                                     />
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };

// // export default BatchManagement;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Switch,
//   FormControlLabel,
//   TextField,
//   MenuItem,
//   Button,
//   Alert,
//   Snackbar,
//   CircularProgress,
//   Fab,
//   Tooltip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   InputAdornment,
// } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import {
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Refresh as RefreshIcon,
//   Add as AddIcon,
//   Dashboard as DashboardIcon,
//   Schedule as ScheduleIcon,
//   Group as GroupIcon,
//   Assessment as AssessmentIcon,
//   Download as DownloadIcon,
//   Visibility as VisibilityIcon,
//   Edit as EditIcon,
// } from '@mui/icons-material';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import './BatchManagement.css';

// // Modern theme configuration
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//       light: '#42a5f5',
//       dark: '#1565c0',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//     background: {
//       default: '#f5f7fa',
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#2d3748',
//       secondary: '#4a5568',
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 700,
//       color: '#2d3748',
//     },
//     h6: {
//       fontWeight: 600,
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//           borderRadius: 12,
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: 'none',
//           fontWeight: 600,
//         },
//       },
//     },
//   },
// });

// // Enhanced Toggle Switch Component
// const ModernToggleSwitch = ({ isOn, onToggle, loading = false }) => (
//   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//     <FormControlLabel
//       control={
//         <Switch
//           checked={isOn === 1}
//           onChange={(e) => onToggle(e.target.checked)}
//           disabled={loading}
//           color="primary"
//           size="medium"
//         />
//       }
//       label=""
//     />
//     {loading && <CircularProgress size={16} />}
//   </Box>
// );

// // Stats Card Component
// const StatsCard = ({ title, value, icon, color, subtitle }) => (
//   <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}>
//     <CardContent>
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             {title}
//           </Typography>
//           <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 700 }}>
//             {value}
//           </Typography>
//           {subtitle && (
//             <Typography variant="caption" color="text.secondary">
//               {subtitle}
//             </Typography>
//           )}
//         </Box>
//         <Box sx={{ color: color, opacity: 0.8 }}>
//           {icon}
//         </Box>
//       </Box>
//     </CardContent>
//   </Card>
// );

// // Advanced Filter Panel Component
// const FilterPanel = ({ filters, onFilterChange, uniqueDepartments, uniqueBatchNos, uniqueDates, onReset }) => (
//   <Card sx={{ mb: 3 }}>
//     <CardContent>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//         <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
//         <Typography variant="h6">Advanced Filters</Typography>
//       </Box>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             select
//             label="Department"
//             name="departmentId"
//             value={filters.departmentId}
//             onChange={onFilterChange}
//             variant="outlined"
//             size="small"
//           >
//             <MenuItem value="">All Departments</MenuItem>
//             {uniqueDepartments.map(dept => (
//               <MenuItem key={dept} value={dept}>Department {dept}</MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             select
//             label="Batch Number"
//             name="batchNo"
//             value={filters.batchNo}
//             onChange={onFilterChange}
//             variant="outlined"
//             size="small"
//           >
//             <MenuItem value="">All Batches</MenuItem>
//             {uniqueBatchNos.map(batch => (
//               <MenuItem key={batch} value={batch}>Batch {batch}</MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             select
//             label="Date"
//             name="date"
//             value={filters.date}
//             onChange={onFilterChange}
//             variant="outlined"
//             size="small"
//           >
//             <MenuItem value="">All Dates</MenuItem>
//             {uniqueDates.map(date => (
//               <MenuItem key={date} value={date}>{date}</MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
//             <Button
//               variant="outlined"
//               onClick={onReset}
//               startIcon={<RefreshIcon />}
//               size="small"
//             >
//               Reset
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </CardContent>
//   </Card>
// );

// const BatchManagement = () => {
//   // Helper functions
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // State management
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState('');
//   const [switchLoading, setSwitchLoading] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     departmentId: '',
//     batchNo: '',
//     date: ''
//   });
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);

//   // Effects
//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   // API Functions
//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:3000/get-all-batches');
//       setBatches(response.data.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch batches');
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (batchNo, status, departmentId) => {
//     const key = `${batchNo}_${departmentId}`;
//     setSwitchLoading(prev => ({ ...prev, [key]: true }));
    
//     try {
//       const response = await axios.post('http://localhost:3000/update-batch-status', {
//         batchNo,
//         departmentId,
//         status: Boolean(status)
//       });
      
//       if (response.data.success) {
//         await fetchBatches();
//         setSuccess(`Batch ${batchNo} status updated successfully`);
//       } else {
//         setError(response.data.message);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update batch status');
//       await fetchBatches();
//     } finally {
//       setSwitchLoading(prev => ({ ...prev, [key]: false }));
//     }
//   };

//   // Event Handlers
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleResetFilters = () => {
//     setFilters({ departmentId: '', batchNo: '', date: '' });
//     setSearchTerm('');
//   };

//   const handleViewBatch = (batch) => {
//     setSelectedBatch(batch);
//     setOpenDialog(true);
//   };

//   // Data processing
//   const uniqueDepartments = [...new Set(batches.map(batch => batch.departmentId))];
//   const uniqueBatchNos = [...new Set(batches.map(batch => batch.batchNo))];
//   const uniqueDates = [...new Set(batches.map(batch => formatDate(batch.batchdate)))];

//   const filteredBatches = batches.filter(batch => {
//     const departmentMatch = filters.departmentId === '' || batch.departmentId.toString() === filters.departmentId;
//     const batchMatch = filters.batchNo === '' || batch.batchNo.toString() === filters.batchNo;
//     const dateMatch = filters.date === '' || formatDate(batch.batchdate) === filters.date;
//     const searchMatch = searchTerm === '' || 
//       Object.values(batch).some(value => 
//         value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       );
    
//     return departmentMatch && batchMatch && dateMatch && searchMatch;
//   });

//   // Statistics
//   const stats = {
//     total: batches.length,
//     active: batches.filter(b => b.batchstatus === 1).length,
//     inactive: batches.filter(b => b.batchstatus === 0).length,
//     departments: uniqueDepartments.length
//   };

//   // DataGrid columns configuration
//   const columns = [
//     {
//       field: 'departmentId',
//       headerName: 'Department',
//       width: 130,
//       renderCell: (params) => (
//         <Chip 
//           label={`Dept ${params.value}`} 
//           size="small" 
//           variant="outlined" 
//           color="primary"
//         />
//       ),
//     },
//     {
//       field: 'batchNo',
//       headerName: 'Batch No',
//       width: 120,
//       renderCell: (params) => (
//         <Typography variant="body2" fontWeight="bold">
//           #{params.value}
//         </Typography>
//       ),
//     },
//     {
//       field: 'batchdate',
//       headerName: 'Date',
//       width: 130,
//       renderCell: (params) => formatDate(params.value),
//     },
//     {
//       field: 'reporting_time',
//       headerName: 'Reporting Time',
//       width: 140,
//       renderCell: (params) => (
//         <Chip 
//           label={formatTime(params.value)} 
//           size="small" 
//           color="info" 
//           variant="outlined"
//         />
//       ),
//     },
//     {
//       field: 'start_time',
//       headerName: 'Start Time',
//       width: 130,
//       renderCell: (params) => formatTime(params.value),
//     },
//     {
//       field: 'end_time',
//       headerName: 'End Time',
//       width: 130,
//       renderCell: (params) => formatTime(params.value),
//     },
//     {
//       field: 'batchstatus',
//       headerName: 'Status',
//       width: 120,
//       renderCell: (params) => (
//         <Chip
//           label={params.value === 1 ? 'Active' : 'Inactive'}
//           color={params.value === 1 ? 'success' : 'error'}
//           size="small"
//           variant="filled"
//         />
//       ),
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 180,
//       sortable: false,
//       renderCell: (params) => {
//         const key = `${params.row.batchNo}_${params.row.departmentId}`;
//         return (
//           <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//             <ModernToggleSwitch
//               isOn={params.row.batchstatus}
//               onToggle={(status) => handleStatusUpdate(params.row.batchNo, status, params.row.departmentId)}
//               loading={switchLoading[key]}
//             />
//             <Tooltip title="View Details">
//               <IconButton size="small" onClick={() => handleViewBatch(params.row)}>
//                 <VisibilityIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         );
//       },
//     },
//   ];

//   if (loading) {
//     return (
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//           <CircularProgress size={60} />
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           minHeight: '100vh',
//           backgroundColor: 'background.default',
//         }}
//       >
//         <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, maxWidth: 1200 }}>
//           {/* Header */}
//           <Box sx={{ mb: 4 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
//               <Typography variant="h4" component="h1" gutterBottom>
//                 Batch Management Dashboard
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, md: 0 } }}>
//               </Box>
//             </Box>

//             {/* Statistics Cards */}
//             <Grid container spacing={3} sx={{ mb: 3 }}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatsCard
//                   title="Total Batches"
//                   value={stats.total}
//                   icon={<ScheduleIcon sx={{ fontSize: 40 }} />}
//                   color="#1976d2"
//                   subtitle="All batches"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatsCard
//                   title="Active Batches"
//                   value={stats.active}
//                   icon={<GroupIcon sx={{ fontSize: 40 }} />}
//                   color="#2e7d32"
//                   subtitle={`${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% active`}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatsCard
//                   title="Inactive Batches"
//                   value={stats.inactive}
//                   icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
//                   color="#d32f2f"
//                   subtitle={`${stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% inactive`}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <StatsCard
//                   title="Departments"
//                   value={stats.departments}
//                   icon={<DashboardIcon sx={{ fontSize: 40 }} />}
//                   color="#7b1fa2"
//                   subtitle="Total departments"
//                 />
//               </Grid>
//             </Grid>

//             {/* Search Bar */}
//             <Box sx={{ mb: 3 }}>
//               <TextField
//                 fullWidth
//                 placeholder="Search batches..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{ maxWidth: { xs: '100%', sm: 500 } }}
//               />
//             </Box>

//             {/* Advanced Filters */}
//             <FilterPanel
//               filters={filters}
//               onFilterChange={handleFilterChange}
//               uniqueDepartments={uniqueDepartments}
//               uniqueBatchNos={uniqueBatchNos}
//               uniqueDates={uniqueDates}
//               onReset={handleResetFilters}
//             />
//           </Box>

//           {/* Data Table */}
//           <Card sx={{ height: 600 }}>
//             <CardContent sx={{ height: '100%', p: 0 }}>
//               <DataGrid
//                 rows={filteredBatches}
//                 columns={columns}
//                 pageSize={10}
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 checkboxSelection
//                 disableSelectionOnClick
//                 getRowId={(row) => `${row.batchNo}_${row.departmentId}`}
//                 sx={{
//                   border: 'none',
//                   '& .MuiDataGrid-cell': {
//                     borderColor: '#f0f0f0',
//                   },
//                   '& .MuiDataGrid-columnHeaders': {
//                     backgroundColor: '#fafafa',
//                     borderBottom: '2px solid #e0e0e0',
//                   },
//                   '& .MuiDataGrid-row:hover': {
//                     backgroundColor: '#f8f9fa',
//                   },
//                 }}
//               />
//             </CardContent>
//           </Card>

//           {/* Batch Details Dialog */}
//           <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
//             <DialogTitle>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <ScheduleIcon color="primary" />
//                 Batch Details - #{selectedBatch?.batchNo}
//               </Box>
//             </DialogTitle>
//             <DialogContent>
//               {selectedBatch && (
//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <Typography variant="body2" color="text.secondary">Department</Typography>
//                     <Typography variant="body1">Department {selectedBatch.departmentId}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="body2" color="text.secondary">Batch Number</Typography>
//                     <Typography variant="body1">#{selectedBatch.batchNo}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="body2" color="text.secondary">Date</Typography>
//                     <Typography variant="body1">{formatDate(selectedBatch.batchdate)}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="body2" color="text.secondary">Status</Typography>
//                     <Chip
//                       label={selectedBatch.batchstatus === 1 ? 'Active' : 'Inactive'}
//                       color={selectedBatch.batchstatus === 1 ? 'success' : 'error'}
//                       size="small"
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Typography variant="body2" color="text.secondary">Reporting Time</Typography>
//                     <Typography variant="body1">{formatTime(selectedBatch.reporting_time)}</Typography>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Typography variant="body2" color="text.secondary">Start Time</Typography>
//                     <Typography variant="body1">{formatTime(selectedBatch.start_time)}</Typography>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Typography variant="body2" color="text.secondary">End Time</Typography>
//                     <Typography variant="body1">{formatTime(selectedBatch.end_time)}</Typography>
//                   </Grid>
//                 </Grid>
//               )}
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenDialog(false)}>Close</Button>
//               {/* <Button variant="contained" startIcon={<EditIcon />}>
//                 Edit Batch
//               </Button> */}
//             </DialogActions>
//           </Dialog>

//           {/* Floating Action Button */}
//           <Fab
//             color="primary"
//             aria-label="refresh"
//             onClick={fetchBatches}
//             sx={{
//               position: 'fixed',
//               bottom: 16,
//               right: 16,
//             }}
//           >
//             <RefreshIcon />
//           </Fab>

//           {/* Snackbar for notifications */}
//           <Snackbar
//             open={!!success}
//             autoHideDuration={6000}
//             onClose={() => setSuccess('')}
//           >
//             <Alert onClose={() => setSuccess('')} severity="success">
//               {success}
//             </Alert>
//           </Snackbar>

//           <Snackbar
//             open={!!error}
//             autoHideDuration={6000}
//             onClose={() => setError('')}
//           >
//             <Alert onClose={() => setError('')} severity="error">
//               {error}
//             </Alert>
//           </Snackbar>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default BatchManagement;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Switch,
  FormControlLabel,
  TextField,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Badge,
  Stack,
  Divider,
  Container,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Avatar,
  ButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Business as DeptIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  PrintIcon,
  FileDownload as ExportIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Enhanced styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const GlassmorphismCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
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

const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  }
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  padding: '8px 16px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}));

const ModernToggleSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.success.main,
      }
    }
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.error.main,
  }
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '16px',
  '& .MuiDataGrid-main': {
    borderRadius: '16px',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: '16px 16px 0 0',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: theme.palette.primary.main,
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.3),
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

// Enhanced Toggle Switch Component
const EnhancedToggleSwitch = ({ isOn, onToggle, loading = false }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <ModernToggleSwitch
      checked={isOn === 1}
      onChange={(e) => onToggle(e.target.checked)}
      disabled={loading}
    />
    {loading && <CircularProgress size={16} />}
    <Chip
      label={isOn === 1 ? 'Active' : 'Inactive'}
      color={isOn === 1 ? 'success' : 'error'}
      size="small"
      variant="filled"
    />
  </Box>
);

// Enhanced Stats Card Component with animations
const EnhancedStatsCard = ({ title, value, icon, color, subtitle, trend, onClick }) => (
  <StatsCard onClick={onClick} sx={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h3" component="div" sx={{ color: color, fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend && <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />}
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </StatsCard>
);

// Compact Filter Panel
const CompactFilterPanel = ({ filters, onFilterChange, uniqueDepartments, uniqueBatchNos, uniqueDates, onReset, onQuickFilter }) => (
  <GlassmorphismCard sx={{ mb: 2 }}>
    <CardContent sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon /> Quick Filters
          </Typography>
          
          <TextField
            select
            label="Department"
            name="departmentId"
            value={filters.departmentId}
            onChange={onFilterChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueDepartments.map(dept => (
              <MenuItem key={dept} value={dept}>Dept {dept}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Batch"
            name="batchNo"
            value={filters.batchNo}
            onChange={onFilterChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueBatchNos.map(batch => (
              <MenuItem key={batch} value={batch}>#{batch}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Date"
            name="date"
            value={filters.date}
            onChange={onFilterChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Dates</MenuItem>
            {uniqueDates.map(date => (
              <MenuItem key={date} value={date}>{date}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <ButtonGroup variant="outlined" size="small">
            <QuickActionButton onClick={() => onQuickFilter('active')} color="success">
              Active Only
            </QuickActionButton>
            <QuickActionButton onClick={() => onQuickFilter('inactive')} color="error">
              Inactive Only
            </QuickActionButton>
            <QuickActionButton onClick={onReset} color="primary">
              Reset All
            </QuickActionButton>
          </ButtonGroup>
        </Box>
      </Box>
    </CardContent>
  </GlassmorphismCard>
);

// Custom Toolbar for DataGrid
const CustomToolbar = ({ onRefresh, onExport }) => (
  <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ScheduleIcon color="primary" />
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
        Batch Management
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <QuickActionButton onClick={onRefresh} startIcon={<RefreshIcon />} size="small">
        Refresh
      </QuickActionButton>
    </Box>
  </GridToolbarContainer>
);

const BatchManagement = () => {
  const theme = useTheme();
  
  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // State management
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [switchLoading, setSwitchLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    departmentId: '',
    batchNo: '',
    date: ''
  });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Effects
  useEffect(() => {
    fetchBatches();
  }, []);

  // API Functions
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/get-all-batches');
      setBatches(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch batches');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (batchNo, status, departmentId) => {
    const key = `${batchNo}_${departmentId}`;
    setSwitchLoading(prev => ({ ...prev, [key]: true }));
    
    try {
      const response = await axios.post('http://localhost:3000/update-batch-status', {
        batchNo,
        departmentId,
        status: Boolean(status)
      });
      
      if (response.data.success) {
        await fetchBatches();
        setSuccess(`✅ Batch ${batchNo} status updated successfully`);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update batch status');
      await fetchBatches();
    } finally {
      setSwitchLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Event Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ departmentId: '', batchNo: '', date: '' });
    setSearchTerm('');
  };

  const handleQuickFilter = (type) => {
    if (type === 'active') {
      // Filter logic for active batches
      setFilters(prev => ({ ...prev, status: 'active' }));
    } else if (type === 'inactive') {
      // Filter logic for inactive batches
      setFilters(prev => ({ ...prev, status: 'inactive' }));
    }
  };

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setOpenDialog(true);
  };

  // Data processing
  const uniqueDepartments = [...new Set(batches.map(batch => batch.departmentId))];
  const uniqueBatchNos = [...new Set(batches.map(batch => batch.batchNo))];
  const uniqueDates = [...new Set(batches.map(batch => formatDate(batch.batchdate)))];

  const filteredBatches = batches.filter(batch => {
    const departmentMatch = filters.departmentId === '' || batch.departmentId.toString() === filters.departmentId;
    const batchMatch = filters.batchNo === '' || batch.batchNo.toString() === filters.batchNo;
    const dateMatch = filters.date === '' || formatDate(batch.batchdate) === filters.date;
    const searchMatch = searchTerm === '' || 
      Object.values(batch).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return departmentMatch && batchMatch && dateMatch && searchMatch;
  });

  // Statistics
  const stats = {
    total: batches.length,
    active: batches.filter(b => b.batchstatus === 1).length,
    inactive: batches.filter(b => b.batchstatus === 0).length,
    departments: uniqueDepartments.length
  };

  // DataGrid columns configuration
  const columns = [
    {
      field: 'departmentId',
      headerName: 'Department',
      width: 130,
      renderCell: (params) => (
        <Badge badgeContent={params.value} color="primary" variant="standard">
          <Chip 
            avatar={<DeptIcon />}
            label={`Dept ${params.value}`} 
            size="small" 
            variant="outlined" 
            color="primary"
          />
        </Badge>
      ),
    },
    {
      field: 'batchNo',
      headerName: 'Batch No',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" sx={{ 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ScheduleIcon fontSize="small" />
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'batchdate',
      headerName: 'Date',
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={formatDate(params.value)}
          size="small"
          color="info"
          variant="outlined"
        />
      ),
    },
    {
      field: 'reporting_time',
      headerName: 'Reporting Time',
      width: 140,
      renderCell: (params) => (
        <Chip 
          avatar={<TimeIcon />}
          label={formatTime(params.value)} 
          size="small" 
          color="warning" 
          variant="filled"
        />
      ),
    },
    {
      field: 'start_time',
      headerName: 'Start Time',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimeIcon fontSize="small" color="action" />
          {formatTime(params.value)}
        </Typography>
      ),
    },
    {
      field: 'end_time',
      headerName: 'End Time',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimeIcon fontSize="small" color="action" />
          {formatTime(params.value)}
        </Typography>
      ),
    },
    {
      field: 'batchstatus',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          icon={params.value === 1 ? <ActiveIcon /> : <InactiveIcon />}
          label={params.value === 1 ? 'Active' : 'Inactive'}
          color={params.value === 1 ? 'success' : 'error'}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Quick Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => {
        const key = `${params.row.batchNo}_${params.row.departmentId}`;
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <EnhancedToggleSwitch
              isOn={params.row.batchstatus}
              onToggle={(status) => handleStatusUpdate(params.row.batchNo, status, params.row.departmentId)}
              loading={switchLoading[key]}
            />
            <Tooltip title="View Details">
              <IconButton 
                size="small" 
                onClick={() => handleViewBatch(params.row)}
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <Fade in={true} timeout={600}>
        <Box>
          {/* Header with Search */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <DashboardIcon sx={{ fontSize: '2.5rem', color: '#1976d2' }} />
                Batch Management
              </Typography>
              
              <TextField
                placeholder="🔍 Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  minWidth: 300,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  }
                }}
                size="small"
              />
            </Box>

            {/* Statistics Dashboard */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatsCard
                  title="Total Batches"
                  value={stats.total}
                  icon={<ScheduleIcon />}
                  color="#1976d2"
                  subtitle="All registered batches"
                  trend={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatsCard
                  title="Active Batches"
                  value={stats.active}
                  icon={<GroupIcon />}
                  color="#2e7d32"
                  subtitle={`${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% active rate`}
                  trend={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatsCard
                  title="Inactive Batches"
                  value={stats.inactive}
                  icon={<AssessmentIcon />}
                  color="#d32f2f"
                  subtitle={`${stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% inactive rate`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatsCard
                  title="Departments"
                  value={stats.departments}
                  icon={<DashboardIcon />}
                  color="#7b1fa2"
                  subtitle="Active departments"
                />
              </Grid>
            </Grid>

            {/* Compact Filters */}
            <CompactFilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              uniqueDepartments={uniqueDepartments}
              uniqueBatchNos={uniqueBatchNos}
              uniqueDates={uniqueDates}
              onReset={handleResetFilters}
              onQuickFilter={handleQuickFilter}
            />
          </Box>

          {/* Enhanced Data Table */}
          <GlassmorphismCard sx={{ height: 650 }}>
            <StyledDataGrid
              rows={filteredBatches}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 15 } },
              }}
              pageSizeOptions={[10, 15, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              getRowId={(row) => `${row.batchNo}_${row.departmentId}`}
              slots={{
                toolbar: () => <CustomToolbar onRefresh={fetchBatches} />
              }}
              density="comfortable"
            />
          </GlassmorphismCard>

          {/* Batch Details Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.main', color: 'white' }}>
              <ScheduleIcon />
              Batch Details - #{selectedBatch?.batchNo}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {selectedBatch && (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Department</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Department {selectedBatch.departmentId}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Batch Number</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>#{selectedBatch.batchNo}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Date</Typography>
                      <Typography variant="body1">{formatDate(selectedBatch.batchdate)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={selectedBatch.batchstatus === 1 ? <ActiveIcon /> : <InactiveIcon />}
                          label={selectedBatch.batchstatus === 1 ? 'Active' : 'Inactive'}
                          color={selectedBatch.batchstatus === 1 ? 'success' : 'error'}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Reporting Time</Typography>
                      <Typography variant="body1">{formatTime(selectedBatch.reporting_time)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Start Time</Typography>
                      <Typography variant="body1">{formatTime(selectedBatch.start_time)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">End Time</Typography>
                      <Typography variant="body1">{formatTime(selectedBatch.end_time)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
              <QuickActionButton onClick={() => setOpenDialog(false)} variant="outlined">
                Close
              </QuickActionButton>
              <QuickActionButton variant="contained" startIcon={<EditIcon />}>
                Edit Batch
              </QuickActionButton>
            </DialogActions>
          </Dialog>

          {/* Speed Dial for Quick Actions */}
          <SpeedDial
            ariaLabel="Quick Actions"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            icon={<SpeedDialIcon />}
          >
            <SpeedDialAction
              icon={<RefreshIcon />}
              tooltipTitle="Refresh Data"
              onClick={fetchBatches}
            />
            <SpeedDialAction
              icon={<ExportIcon />}
              tooltipTitle="Export Data"
              onClick={() => {/* Add export functionality */}}
            />
            <SpeedDialAction
              icon={<AddIcon />}
              tooltipTitle="Add New Batch"
              onClick={() => {/* Add new batch functionality */}}
            />
          </SpeedDial>

          {/* Enhanced Notifications */}
          <Snackbar
            open={!!success}
            autoHideDuration={4000}
            onClose={() => setSuccess('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert 
              onClose={() => setSuccess('')} 
              severity="success" 
              variant="filled"
              sx={{ borderRadius: '12px' }}
            >
              {success}
            </Alert>
          </Snackbar>
          
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert 
              onClose={() => setError('')} 
              severity="error" 
              variant="filled"
              sx={{ borderRadius: '12px' }}
            >
              ❌ {error}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default BatchManagement;
