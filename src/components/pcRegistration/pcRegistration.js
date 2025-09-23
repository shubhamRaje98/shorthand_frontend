// // // src/components/ControllerPassword.js

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useParams } from 'react-router-dom';

// // import NavBar from '../navBar/navBar'; // Adjust the path as necessary
// // import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// // const PCRegistration = () => {
// //     const { center } = useParams();
// //     const [data, setData] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState('');
// //     const [successMessage, setSuccessMessage] = useState('');

// //     useEffect(() => {
// //         fetchData();
// //     }, [center]);

// //     const fetchData = async () => {
// //         setLoading(true);
// //         setError('');
// //         try {
// //             const response = await axios.get(`http://localhost:3000/get-pcregistration`);
// //             setData(response.data);
// //         } catch (error) {
// //             console.error("Error fetching data:", error);
// //             setError('No PC registered');
// //         }
// //         setLoading(false);
// //     };

// //     const handleDelete = async (item) => {
// //         // Show confirmation dialog
// //         const isConfirmed = window.confirm(`Are you sure you want to delete the PC registration for:\n\nIP Address: ${item.ip_address}\nMAC Address: ${item.mac_address}\nDisk ID: ${item.disk_id}\n\nThis action cannot be undone.`);

// //         if (!isConfirmed) {
// //             return; // If user cancels, do nothing
// //         }

// //         try {
// //             const response = await axios.post('http://localhost:3000/delete-pcregistration', {
// //                 ip_address: item.ip_address,
// //                 disk_id: item.disk_id,
// //                 mac_address: item.mac_address
// //             });
            
// //             if (response.status === 200) {
// //                 setError('');
// //                 setSuccessMessage('PC registration deleted successfully.');
// //                 fetchData(); // Refresh the data
                
// //                 // Clear success message after 3 seconds
// //                 setTimeout(() => setSuccessMessage(''), 3000);
// //             } else {
// //                 setError(`Unexpected response: ${response.status} ${response.statusText}`);
// //             }
// //         } catch (error) {
// //             if (error.response) {
// //                 if (error.response.status === 404) {
// //                     setError('No matching PC registration found. The item may have already been deleted.');
// //                 } else {
// //                     setError(`Error: ${error.response.data.message || 'An unexpected error occurred'}`);
// //                 }
// //             } else if (error.request) {
// //                 setError('No response received from server. Please check your connection.');
// //             } else {
// //                 setError(`Error: ${error.message}`);
// //             }
// //             console.error("Error deleting item:", error);
// //         }
// //     };

// //     return (
// //         <div className="container-fluid">
// //             <div className="row">
// //                 <NavBar />
// //                 <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
// //                     <h2 className="mt-3">PC Registration Table</h2>
// //                     {loading && <p>Loading...</p>}
// //                     {error && <div className="alert alert-danger" role="alert">{error}</div>}
// //                     {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
// //                     {!loading && !error && Array.isArray(data) && (
// //                         <div className="table-responsive">
// //                             <table className="table table-bordered table-hover">
// //                                 <thead className="thead-dark">
// //                                     <tr>
// //                                         <th scope="col">Center</th>
// //                                         <th scope="col">IP Address</th>
// //                                         <th scope="col">Disk ID</th>
// //                                         <th scope="col">MAC Address</th>
                                     
// //                                     </tr>
// //                                 </thead>
// //                                 <tbody>
// //                                     {data.map((item, index) => (
// //                                         <tr key={index}>
// //                                             <td>{item.center}</td>
// //                                             <td>{item.ip_address}</td>
// //                                             <td>{item.disk_id}</td>
// //                                             <td>{item.mac_address}</td>
// //                                             {/* <td>
// //                                                 <button className = "red" onClick={()=>{
// //                                                     handleDelete(item);
// //                                                 }}>
// //                                                     Delete
// //                                                 </button>
// //                                             </td> */}
// //                                         </tr>
// //                                     ))}
// //                                 </tbody>
// //                             </table>
// //                         </div>
// //                     )}
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };

// // export default PCRegistration;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Card,
//   CardContent,
//   CardHeader,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Alert,
//   CircularProgress,
//   Chip,
//   Avatar,
//   Divider,
//   Grid,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   useTheme,
//   alpha,
//   createTheme,
//   ThemeProvider,
//   Fade,
//   IconButton,
//   Tooltip,
//   Snackbar,
//   AlertTitle
// } from '@mui/material';
// import {
//   Computer as ComputerIcon,
//   NetworkWifi as NetworkIcon,
//   Memory as MemoryIcon,
//   Router as RouterIcon,
//   Business as BusinessIcon,
//   Refresh as RefreshIcon,
//   Delete as DeleteIcon,
//   Info as InfoIcon,
//   CheckCircle as CheckCircleIcon,
//   Storage as StorageIcon,
//   Analytics as AnalyticsIcon,
//   Devices as DevicesIcon
// } from '@mui/icons-material';
// import NavBar from '../navBar/navBar';

// // Enhanced light theme with modern colors
// const modernTheme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#3b82f6', // Modern blue
//       light: '#60a5fa',
//       dark: '#2563eb',
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       main: '#8b5cf6', // Purple
//       light: '#a78bfa',
//       dark: '#7c3aed',
//       contrastText: '#ffffff',
//     },
//     success: {
//       main: '#10b981', // Emerald
//       light: '#34d399',
//       dark: '#059669',
//       contrastText: '#ffffff',
//     },
//     warning: {
//       main: '#f59e0b', // Amber
//       light: '#fbbf24',
//       dark: '#d97706',
//       contrastText: '#ffffff',
//     },
//     info: {
//       main: '#06b6d4', // Cyan
//       light: '#22d3ee',
//       dark: '#0891b2',
//       contrastText: '#ffffff',
//     },
//     error: {
//       main: '#ef4444', // Red
//       light: '#f87171',
//       dark: '#dc2626',
//       contrastText: '#ffffff',
//     },
//     background: {
//       default: '#f8fafc',
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#0f172a',
//       secondary: '#64748b',
//     },
//     grey: {
//       50: '#f8fafc',
//       100: '#f1f5f9',
//       200: '#e2e8f0',
//       300: '#cbd5e1',
//       400: '#94a3b8',
//       500: '#64748b',
//     }
//   },
//   shape: {
//     borderRadius: 16,
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 700,
//       fontSize: '2rem',
//     },
//     h5: {
//       fontWeight: 600,
//       fontSize: '1.5rem',
//     },
//     h6: {
//       fontWeight: 600,
//       fontSize: '1.25rem',
//     },
//     body1: {
//       fontSize: '1rem',
//       lineHeight: 1.6,
//     }
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
//           '&:hover': {
//             boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
//           },
//         },
//       },
//     },
//     MuiTableCell: {
//       styleOverrides: {
//         head: {
//           fontWeight: 600,
//           fontSize: '0.875rem',
//           textTransform: 'uppercase',
//           letterSpacing: '0.05em',
//         },
//       },
//     },
//   },
// });

// // Analytics Card Component
// const AnalyticsCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
//   const theme = useTheme();
  
//   return (
//     <Card
//       sx={{
//         background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.08)} 0%, ${alpha(theme.palette[color].main, 0.03)} 100%)`,
//         border: `1px solid ${alpha(theme.palette[color].main, 0.12)}`,
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: `0 12px 40px ${alpha(theme.palette[color].main, 0.2)}`,
//         }
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box sx={{ flex: 1 }}>
//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: 800,
//                 color: `${color}.main`,
//                 mb: 0.5,
//                 fontSize: '2.25rem',
//               }}
//             >
//               {value}
//             </Typography>
//             <Typography
//               variant="h6"
//               sx={{
//                 color: 'text.primary',
//                 fontWeight: 600,
//                 mb: subtitle ? 0.5 : 0,
//               }}
//             >
//               {title}
//             </Typography>
//             {subtitle && (
//               <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                 {subtitle}
//               </Typography>
//             )}
//             {trend && (
//               <Chip
//                 label={trend}
//                 size="small"
//                 sx={{
//                   mt: 1,
//                   backgroundColor: alpha(theme.palette.success.main, 0.1),
//                   color: 'success.main',
//                   fontWeight: 600,
//                 }}
//               />
//             )}
//           </Box>
//           <Avatar
//             sx={{
//               background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
//               width: 64,
//               height: 64,
//               boxShadow: `0 8px 32px ${alpha(theme.palette[color].main, 0.3)}`,
//             }}
//           >
//             <Icon sx={{ fontSize: 32, color: 'white' }} />
//           </Avatar>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// // PC Info Display Component
// const PCInfoChip = ({ label, value, icon: Icon, color = 'primary' }) => {
//   const theme = useTheme();
  
//   return (
//     <Box
//       sx={{
//         display: 'inline-flex',
//         alignItems: 'center',
//         gap: 1,
//         backgroundColor: alpha(theme.palette[color].main, 0.08),
//         color: `${color}.main`,
//         px: 2,
//         py: 1,
//         borderRadius: 3,
//         fontFamily: 'monospace',
//         fontWeight: 600,
//         fontSize: '0.875rem',
//         border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
//         minWidth: 0,
//         maxWidth: '100%',
//       }}
//     >
//       <Icon sx={{ fontSize: 16, flexShrink: 0 }} />
//       <Box sx={{ 
//         overflow: 'hidden', 
//         textOverflow: 'ellipsis',
//         whiteSpace: 'nowrap',
//         minWidth: 0,
//       }}>
//         <Typography component="span" variant="caption" sx={{ fontWeight: 500, opacity: 0.8, mr: 0.5 }}>
//           {label}:
//         </Typography>
//         {value}
//       </Box>
//     </Box>
//   );
// };

// // Delete Confirmation Dialog
// const DeleteDialog = ({ open, onClose, onConfirm, pcInfo }) => {
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//         }
//       }}
//     >
//       <DialogTitle sx={{ pb: 1 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <DeleteIcon color="error" />
//           <Typography variant="h6" component="div">
//             Confirm PC Registration Deletion
//           </Typography>
//         </Box>
//       </DialogTitle>
//       <DialogContent>
//         <DialogContentText sx={{ mb: 2 }}>
//           Are you sure you want to delete the PC registration? This action cannot be undone.
//         </DialogContentText>
//         {pcInfo && (
//           <Box sx={{ 
//             backgroundColor: 'grey.50', 
//             p: 2, 
//             borderRadius: 2,
//             border: '1px solid',
//             borderColor: 'grey.200'
//           }}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//               PC Registration Details:
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <PCInfoChip label="IP" value={pcInfo.ip_address} icon={NetworkIcon} color="info" />
//               <PCInfoChip label="MAC" value={pcInfo.mac_address} icon={RouterIcon} color="warning" />
//               <PCInfoChip label="Disk" value={pcInfo.disk_id} icon={StorageIcon} color="secondary" />
//             </Box>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose} variant="outlined" color="inherit">
//           Cancel
//         </Button>
//         <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
//           Delete Registration
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const PCRegistration = () => {
//   const theme = useTheme();
//   const { center } = useParams();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Analytics calculations
//   const totalPCs = data.length;
//   const uniqueCenters = [...new Set(data.map(item => item.center))].length;
//   const uniqueNetworks = [...new Set(data.map(item => item.ip_address.split('.').slice(0, 3).join('.')))].length;

//   useEffect(() => {
//     fetchData();
//   }, [center]);

//   const fetchData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.get(`http://localhost:3000/get-pcregistration`);
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError('No PC registered');
//     }
//     setLoading(false);
//   };

//   const handleDeleteClick = (item) => {
//     setDeleteDialog({ open: true, item });
//   };

//   const handleDeleteConfirm = async () => {
//     const item = deleteDialog.item;
    
//     try {
//       const response = await axios.post('http://localhost:3000/delete-pcregistration', {
//         ip_address: item.ip_address,
//         disk_id: item.disk_id,
//         mac_address: item.mac_address
//       });
      
//       if (response.status === 200) {
//         setError('');
//         setSnackbar({
//           open: true,
//           message: 'PC registration deleted successfully.',
//           severity: 'success'
//         });
//         fetchData(); // Refresh the data
//       } else {
//         setSnackbar({
//           open: true,
//           message: `Unexpected response: ${response.status} ${response.statusText}`,
//           severity: 'error'
//         });
//       }
//     } catch (error) {
//       let errorMessage = 'An unexpected error occurred';
      
//       if (error.response) {
//         if (error.response.status === 404) {
//           errorMessage = 'No matching PC registration found. The item may have already been deleted.';
//         } else {
//           errorMessage = error.response.data.message || 'An unexpected error occurred';
//         }
//       } else if (error.request) {
//         errorMessage = 'No response received from server. Please check your connection.';
//       } else {
//         errorMessage = error.message;
//       }
      
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: 'error'
//       });
//       console.error("Error deleting item:", error);
//     }
    
//     setDeleteDialog({ open: false, item: null });
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialog({ open: false, item: null });
//   };

//   const handleRefresh = () => {
//     fetchData();
//   };

//   const handleSnackbarClose = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   return (
//     <ThemeProvider theme={modernTheme}>
//       <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
//         <NavBar />
        
//         <Container maxWidth="xl" sx={{ py: 4 }}>
//           <Fade in timeout={800}>
//             <Box>
//               {/* Header Section */}
//               <Box sx={{ mb: 4, textAlign: 'center' }}>
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     fontWeight: 700,
//                     color: 'text.primary',
//                     mb: 2,
//                     background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
//                     backgroundClip: 'text',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent',
//                   }}
//                 >
//                   PC Registration Management
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
//                   Monitor and manage registered computer systems across examination centers
//                 </Typography>
//               </Box>

//               {/* Analytics Cards */}
//               {!loading && data.length > 0 && (
//                 <Grid container spacing={3} sx={{ mb: 4 }}>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="Total PCs"
//                       value={totalPCs}
//                       icon={ComputerIcon}
//                       color="primary"
//                       subtitle="Registered systems"
//                       trend="+12% this week"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="Centers"
//                       value={uniqueCenters}
//                       icon={BusinessIcon}
//                       color="success"
//                       subtitle="Active locations"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="Networks"
//                       value={uniqueNetworks}
//                       icon={NetworkIcon}
//                       color="info"
//                       subtitle="Network segments"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="System Health"
//                       value="98.5%"
//                       icon={AnalyticsIcon}
//                       color="warning"
//                       subtitle="Uptime average"
//                     />
//                   </Grid>
//                 </Grid>
//               )}

//               {/* Controls Section */}
//               <Card sx={{ mb: 4, borderRadius: 4 }}>
//                 <CardHeader
//                   avatar={
//                     <Avatar sx={{ bgcolor: 'primary.main' }}>
//                       <DevicesIcon />
//                     </Avatar>
//                   }
//                   title={
//                     <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                       System Overview
//                     </Typography>
//                   }
//                   subheader="Registered PC systems and hardware information"
//                   action={
//                     <Tooltip title="Refresh Data">
//                       <IconButton
//                         onClick={handleRefresh}
//                         disabled={loading}
//                         sx={{
//                           bgcolor: alpha(theme.palette.primary.main, 0.1),
//                           '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
//                         }}
//                       >
//                         <RefreshIcon />
//                       </IconButton>
//                     </Tooltip>
//                   }
//                 />
//               </Card>

//               {/* Loading State */}
//               {loading && (
//                 <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
//                   <CircularProgress size={60} sx={{ mb: 2 }} />
//                   <Typography variant="h6" color="text.secondary">
//                     Loading PC registrations...
//                   </Typography>
//                 </Card>
//               )}

//               {/* Error State */}
//               {error && !loading && (
//                 <Alert
//                   severity="info"
//                   icon={<InfoIcon />}
//                   sx={{
//                     borderRadius: 4,
//                     mb: 3,
//                   }}
//                 >
//                   <AlertTitle>No PC Registrations Found</AlertTitle>
//                   {error}
//                 </Alert>
//               )}

//               {/* Data Table */}
//               {!loading && !error && Array.isArray(data) && data.length > 0 && (
//                 <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
//                   <CardHeader
//                     title={
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                           Registered PC Systems
//                         </Typography>
//                         <Chip
//                           label={`${data.length} systems`}
//                           color="primary"
//                           size="small"
//                           sx={{ fontWeight: 600 }}
//                         />
//                       </Box>
//                     }
//                     subheader="Hardware information and network details for registered systems"
//                   />
//                   <Divider />
//                   <TableContainer>
//                     <Table>
//                       <TableHead sx={{ backgroundColor: 'grey.50' }}>
//                         <TableRow>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <BusinessIcon sx={{ fontSize: 16 }} />
//                               Center
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <NetworkIcon sx={{ fontSize: 16 }} />
//                               IP Address
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <StorageIcon sx={{ fontSize: 16 }} />
//                               Disk ID
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <RouterIcon sx={{ fontSize: 16 }} />
//                               MAC Address
//                             </Box>
//                           </TableCell>
//                           <TableCell align="center">Actions</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {data.map((item, index) => (
//                           <TableRow
//                             key={index}
//                             sx={{
//                               '&:hover': {
//                                 backgroundColor: alpha(theme.palette.primary.main, 0.04),
//                               },
//                               '&:nth-of-type(even)': {
//                                 backgroundColor: 'grey.50',
//                               }
//                             }}
//                           >
//                             <TableCell>
//                               <Chip
//                                 label={item.center}
//                                 sx={{
//                                   backgroundColor: alpha(theme.palette.success.main, 0.1),
//                                   color: 'success.main',
//                                   fontWeight: 600,
//                                 }}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <PCInfoChip 
//                                 label="IP" 
//                                 value={item.ip_address} 
//                                 icon={NetworkIcon} 
//                                 color="info" 
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <PCInfoChip 
//                                 label="Disk" 
//                                 value={item.disk_id} 
//                                 icon={StorageIcon} 
//                                 color="secondary" 
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <PCInfoChip 
//                                 label="MAC" 
//                                 value={item.mac_address} 
//                                 icon={RouterIcon} 
//                                 color="warning" 
//                               />
//                             </TableCell>
//                             <TableCell align="center">
//                               <Tooltip title="Delete PC Registration">
//                                 <IconButton
//                                   onClick={() => handleDeleteClick(item)}
//                                   sx={{
//                                     color: 'error.main',
//                                     '&:hover': {
//                                       backgroundColor: alpha(theme.palette.error.main, 0.1),
//                                     }
//                                   }}
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Tooltip>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Card>
//               )}

//               {/* No Data State */}
//               {!loading && !error && data.length === 0 && (
//                 <Paper
//                   sx={{
//                     p: 6,
//                     textAlign: 'center',
//                     borderRadius: 4,
//                     background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
//                     border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
//                   }}
//                 >
//                   <Avatar
//                     sx={{
//                       width: 80,
//                       height: 80,
//                       bgcolor: alpha(theme.palette.info.main, 0.1),
//                       color: 'info.main',
//                       mx: 'auto',
//                       mb: 3,
//                     }}
//                   >
//                     <ComputerIcon sx={{ fontSize: 40 }} />
//                   </Avatar>
//                   <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
//                     No PC Registrations Found
//                   </Typography>
//                   <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
//                     There are currently no registered PC systems in the database.
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                     PC systems will appear here once they complete the registration process.
//                   </Typography>
//                 </Paper>
//               )}

//               {/* Delete Confirmation Dialog */}
//               <DeleteDialog
//                 open={deleteDialog.open}
//                 onClose={handleDeleteCancel}
//                 onConfirm={handleDeleteConfirm}
//                 pcInfo={deleteDialog.item}
//               />

//               {/* Success/Error Snackbar */}
//               <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//               >
//                 <Alert
//                   onClose={handleSnackbarClose}
//                   severity={snackbar.severity}
//                   sx={{ width: '100%', borderRadius: 2 }}
//                 >
//                   {snackbar.message}
//                 </Alert>
//               </Snackbar>
//             </Box>
//           </Fade>
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default PCRegistration;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
  Snackbar,
  AlertTitle,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Computer as ComputerIcon,
  NetworkWifi as NetworkIcon,
  Memory as MemoryIcon,
  Router as RouterIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Storage as StorageIcon,
  Analytics as AnalyticsIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import NavBar from '../navBar/navBar';

// Enhanced light theme with modern colors
const modernTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6', // Modern blue
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6', // Purple
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    info: {
      main: '#06b6d4', // Cyan
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Red
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
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
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
          padding: '12px 16px', // Reduced padding for compact header
        },
        body: {
          padding: '8px 16px', // Compact padding for body cells
        },
      },
    },
  },
});

// Analytics Card Component
const AnalyticsCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
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

// Compact Technical Field Component - Optimized for table cells
const CompactTechnicalField = ({ label, value, icon: Icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: 1.5,
        backgroundColor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200',
        transition: 'all 0.2s ease',
        minHeight: 40, // Compact height
        '&:hover': {
          backgroundColor: 'grey.100',
          borderColor: 'grey.300',
        }
      }}
    >
      <Icon 
        sx={{ 
          fontSize: 18, 
          color: 'text.secondary',
          flexShrink: 0
        }} 
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            display: 'block',
            lineHeight: 1,
            fontSize: '0.65rem' // Slightly smaller label
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            fontFamily: 'monospace',
            fontSize: '0.95rem', // Increased from 0.875rem for better readability
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mt: 0.25,
            lineHeight: 1.2
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

// Enhanced Technical Field for Dialog - Larger version
const DialogTechnicalField = ({ label, value, icon: Icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        backgroundColor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'grey.100',
          borderColor: 'grey.300',
        }
      }}
    >
      <Icon 
        sx={{ 
          fontSize: 20, 
          color: 'text.secondary',
          flexShrink: 0
        }} 
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'block',
            lineHeight: 1
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            fontFamily: 'monospace',
            fontSize: '1rem', // Larger for dialog
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mt: 0.25
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

// Delete Confirmation Dialog
const DeleteDialog = ({ open, onClose, onConfirm, pcInfo }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6" component="div">
            Confirm PC Registration Deletion
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to delete the PC registration? This action cannot be undone.
        </DialogContentText>
        {pcInfo && (
          <Box sx={{ 
            backgroundColor: 'grey.50', 
            p: 2, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              PC Registration Details:
            </Typography>
            <Stack spacing={1}>
              <DialogTechnicalField label="IP Address" value={pcInfo.ip_address} icon={NetworkIcon} />
              <DialogTechnicalField label="MAC Address" value={pcInfo.mac_address} icon={RouterIcon} />
              <DialogTechnicalField label="Disk ID" value={pcInfo.disk_id} icon={StorageIcon} />
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          Delete Registration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PCRegistration = () => {
  const theme = useTheme();
  const { center } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Analytics calculations
  const totalPCs = data.length;
  const uniqueCenters = [...new Set(data.map(item => item.center))].length;
  const uniqueNetworks = [...new Set(data.map(item => item.ip_address.split('.').slice(0, 3).join('.')))].length;

  // Pagination calculations
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    fetchData();
  }, [center]);

  // Reset to first page when data changes
  useEffect(() => {
    setPage(1);
  }, [data, rowsPerPage]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:3000/get-pcregistration`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('No PC registered');
    }
    setLoading(false);
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    const item = deleteDialog.item;
    
    try {
      const response = await axios.post('http://localhost:3000/delete-pcregistration', {
        ip_address: item.ip_address,
        disk_id: item.disk_id,
        mac_address: item.mac_address
      });
      
      if (response.status === 200) {
        setError('');
        setSnackbar({
          open: true,
          message: 'PC registration deleted successfully.',
          severity: 'success'
        });
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: `Unexpected response: ${response.status} ${response.statusText}`,
          severity: 'error'
        });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'No matching PC registration found. The item may have already been deleted.';
        } else {
          errorMessage = error.response.data.message || 'An unexpected error occurred';
        }
      } else if (error.request) {
        errorMessage = 'No response received from server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      console.error("Error deleting item:", error);
    }
    
    setDeleteDialog({ open: false, item: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

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
                  PC Registration Management
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                  Monitor and manage registered computer systems across examination centers
                </Typography>
              </Box>

              {/* Analytics Cards */}
              {!loading && data.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}justifyContent={"center"}>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Total PCs"
                      value={totalPCs}
                      icon={ComputerIcon}
                      color="primary"
                      subtitle="Registered systems"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <AnalyticsCard
                      title="Centers"
                      value={uniqueCenters}
                      icon={BusinessIcon}
                      color="success"
                      subtitle="Active locations"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Controls Section */}
              <Card sx={{ mb: 4, borderRadius: 4 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <DevicesIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      System Overview
                    </Typography>
                  }
                  subheader="Registered PC systems and hardware information"
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
              </Card>

              {/* Loading State */}
              {loading && (
                <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                  <CircularProgress size={60} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Loading PC registrations...
                  </Typography>
                </Card>
              )}

              {/* Error State */}
              {error && !loading && (
                <Alert
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{
                    borderRadius: 4,
                    mb: 3,
                  }}
                >
                  <AlertTitle>No PC Registrations Found</AlertTitle>
                  {error}
                </Alert>
              )}

              {/* Compact Data Table with Pagination */}
              {!loading && !error && Array.isArray(data) && data.length > 0 && (
                <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Registered PC Systems
                          </Typography>
                          <Chip
                            label={`${data.length} systems`}
                            color="primary"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Rows per page</InputLabel>
                          <Select
                            value={rowsPerPage}
                            label="Rows per page"
                            onChange={handleRowsPerPageChange}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    }
                    subheader={`Showing ${Math.min((page - 1) * rowsPerPage + 1, data.length)}-${Math.min(page * rowsPerPage, data.length)} of ${data.length} systems`}
                  />
                  <Divider />
                  
                  {/* Compact Table with Light Scrollbar */}
                  <TableContainer 
                    sx={{ 
                      maxHeight: 500, // Reduced height for more compact view
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
                      '&::-webkit-scrollbar-corner': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Table stickyHeader size="small"> {/* Added size="small" for compact table */}
                      <TableHead>
                        <TableRow>
                          <TableCell 
                            sx={{ 
                              backgroundColor: 'grey.50',
                              borderBottom: `2px solid ${theme.palette.grey[200]}`,
                              py: 1.5 // Reduced padding
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Center</Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              backgroundColor: 'grey.50',
                              borderBottom: `2px solid ${theme.palette.grey[200]}`,
                              py: 1.5
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <NetworkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>IP Address</Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              backgroundColor: 'grey.50',
                              borderBottom: `2px solid ${theme.palette.grey[200]}`,
                              py: 1.5
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <StorageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Disk ID</Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              backgroundColor: 'grey.50',
                              borderBottom: `2px solid ${theme.palette.grey[200]}`,
                              py: 1.5
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <RouterIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>MAC Address</Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{ 
                              backgroundColor: 'grey.50',
                              borderBottom: `2px solid ${theme.palette.grey[200]}`,
                              py: 1.5
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Actions</Typography>
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
                              borderBottom: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
                              height: 60, // Fixed compact row height
                            }}
                          >
                            <TableCell sx={{ py: 1 }}>
                              <Chip
                                label={item.center}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                                  color: 'success.main',
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  fontSize: '0.8rem', // Slightly larger text
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <CompactTechnicalField 
                                label="IP" 
                                value={item.ip_address} 
                                icon={NetworkIcon} 
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <CompactTechnicalField 
                                label="Disk" 
                                value={item.disk_id} 
                                icon={StorageIcon} 
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <CompactTechnicalField 
                                label="MAC" 
                                value={item.mac_address} 
                                icon={RouterIcon} 
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1 }}>
                              <Tooltip title="Delete PC Registration">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(item)}
                                  sx={{
                                    color: 'error.main',
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                                      transform: 'scale(1.05)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
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
                      p: 2, // Reduced padding
                      borderTop: `1px solid ${theme.palette.grey[200]}`,
                      backgroundColor: 'grey.50'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Showing {Math.min((page - 1) * rowsPerPage + 1, data.length)}-{Math.min(page * rowsPerPage, data.length)} of {data.length} systems
                    </Typography>
                    
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      size="medium" // Changed from large to medium for compact view
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                          fontWeight: 600,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Card>
              )}

              {/* No Data State */}
              {!loading && !error && data.length === 0 && (
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
                    <ComputerIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    No PC Registrations Found
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    There are currently no registered PC systems in the database.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    PC systems will appear here once they complete the registration process.
                  </Typography>
                </Paper>
              )}

              {/* Delete Confirmation Dialog */}
              <DeleteDialog
                open={deleteDialog.open}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                pcInfo={deleteDialog.item}
              />

              {/* Success/Error Snackbar */}
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert
                  onClose={handleSnackbarClose}
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

export default PCRegistration;
