// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import './ExpertManagement.css';

// // // const ExpertManagement = () => {
// // //   const [experts, setExperts] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');
// // //   const [success, setSuccess] = useState('');
// // //   const [newExpert, setNewExpert] = useState({ expertId: '', expert_name: '', password: '' });
// // //   const [updateExpert, setUpdateExpert] = useState({ paper_check: '', paper_mod: '', super_mod: '' });
// // //   const [showModal, setShowModal] = useState(false);
// // //   const [selectedExperts, setSelectedExperts] = useState([]);

// // //   useEffect(() => {
// // //     fetchExperts();
// // //   }, []);

// // //   const fetchExperts = async () => {
// // //     setLoading(true);
// // //     setError('');
// // //     try {
// // //       const response = await axios.get('http://localhost:3000/get-experts');
// // //       setExperts(response.data.results || []);
// // //       // console.log(response.data);
// // //     } catch (err) {
// // //       setError('Error fetching experts.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleInsertExpert = async () => {
// // //     try {
// // //       const response = await axios.post('http://localhost:3000/insert-expert', newExpert);
// // //       setSuccess(response.data.message);
// // //       setNewExpert({ expertId: '', expert_name: '', password: '' });
// // //       fetchExperts();
// // //     } catch (err) {
// // //       setError('Error inserting expert.');
// // //     }
// // //   };

// // //   const handleUpdateExperts = async (updateAll = false) => {
// // //     try {
// // //       const response = await axios.post('http://localhost:3000/update-experts', {
// // //         experts: updateAll ? [] : selectedExperts,
// // //         paper_check: updateExpert.paper_check === 'true',
// // //         paper_mod: updateExpert.paper_mod === 'true',
// // //         super_mod: updateExpert.super_mod === 'true',
// // //         updateAll: updateAll
// // //       });
// // //       setSuccess(response.data.message);
// // //       fetchExperts();
// // //       setShowModal(false);
// // //     } catch (err) {
// // //       setError('Error updating experts.');
// // //     }
// // //   };

// // //   const toggleExpertSelection = (expertId) => {
// // //     setSelectedExperts(prevSelected => 
// // //       prevSelected.includes(expertId)
// // //         ? prevSelected.filter(id => id !== expertId)
// // //         : [...prevSelected, expertId]
// // //     );
// // //   };

// // //   return (
// // //     <div className="em-container">
// // //       <h1 className="em-title">Expert Management</h1>

// // //       <div className="em-table-container">
// // //         <h2 className="em-table-title">Expert Data</h2>
// // //         <table className="em-table">
// // //           <thead>
// // //             <tr>
// // //               <th>Expert ID</th>
// // //               <th>Expert Name</th>
// // //               <th>Password</th>
// // //               <th>Paper Check</th>
// // //               <th>Paper Mod</th>
// // //               <th>Super Mod</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {experts.map((expert) => (
// // //               <tr key={expert.expertId}>
// // //                 <td>{expert.expertId}</td>
// // //                 <td>{expert.expert_name}</td>
// // //                 <td>{expert.password}</td>
// // //                 <td>{expert.paper_check ? 'Yes' : 'No'}</td>
// // //                 <td>{expert.paper_mod ? 'Yes' : 'No'}</td>
// // //                 <td>{expert.super_mod ? 'Yes' : 'No'}</td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
      
// // //       <div className="em-insert-section">
// // //         <h2 className="em-section-title">Insert New Expert</h2>
// // //         <input
// // //           type="text"
// // //           placeholder="Expert ID"
// // //           value={newExpert.expertId}
// // //           onChange={(e) => setNewExpert({ ...newExpert, expertId: e.target.value })}
// // //           className="em-input"
// // //         />
// // //         <input
// // //           type="text"
// // //           placeholder="Expert Name"
// // //           value={newExpert.expert_name}
// // //           onChange={(e) => setNewExpert({ ...newExpert, expert_name: e.target.value })}
// // //           className="em-input"
// // //         />
// // //         <input
// // //           type="password"
// // //           placeholder="Password"
// // //           value={newExpert.password}
// // //           onChange={(e) => setNewExpert({ ...newExpert, password: e.target.value })}
// // //           className="em-input"
// // //         />
// // //         <button onClick={handleInsertExpert} className="em-button">Insert Expert</button>
// // //       </div>

// // //       <div className="em-update-section">
// // //         <h2 className="em-section-title">Update Experts</h2>
// // //         <select
// // //           value={updateExpert.paper_check}
// // //           onChange={(e) => setUpdateExpert({ ...updateExpert, paper_check: e.target.value })}
// // //           className="em-select"
// // //         >
// // //           <option value="">Select Paper Check</option>
// // //           <option value="true">True</option>
// // //           <option value="false">False</option>
// // //         </select>
// // //         <select
// // //           value={updateExpert.paper_mod}
// // //           onChange={(e) => setUpdateExpert({ ...updateExpert, paper_mod: e.target.value })}
// // //           className="em-select"
// // //         >
// // //           <option value="">Select Paper Mod</option>
// // //           <option value="true">True</option>
// // //           <option value="false">False</option>
// // //         </select>
// // //         <select
// // //           value={updateExpert.super_mod}
// // //           onChange={(e) => setUpdateExpert({ ...updateExpert, super_mod: e.target.value })}
// // //           className="em-select"
// // //         >
// // //           <option value="">Select Super Mod</option>
// // //           <option value="true">True</option>
// // //           <option value="false">False</option>
// // //         </select>
// // //         <button onClick={() => setShowModal(true)} className="em-button">Update Experts</button>
// // //       </div>

// // //       {loading && <p className="em-loading">Loading...</p>}
// // //       {error && <p className="em-error">{error}</p>}
// // //       {success && <p className="em-success">{success}</p>}

// // //       {showModal && (
// // //         <div className="em-modal">
// // //           <div className="em-modal-content">
// // //             <h2 className="em-modal-title">Select Experts to Update</h2>
// // //             <div className="em-expert-list">
// // //               {experts.map((expert) => (
// // //                 <label key={expert.expertId} className="em-expert-item">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={selectedExperts.includes(expert.expertId)}
// // //                     onChange={() => toggleExpertSelection(expert.expertId)}
// // //                     className="em-checkbox"
// // //                   /> {expert.expert_name}
// // //                 </label>
// // //               ))}
// // //             </div>
// // //             <div className="em-modal-buttons">
// // //               <button onClick={() => handleUpdateExperts(false)} className="em-button">Update Selected</button>
// // //               <button onClick={() => handleUpdateExperts(true)} className="em-button">Update All</button>
// // //               <button onClick={() => setShowModal(false)} className="em-button">Cancel</button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ExpertManagement;

//-----------------------------above code is old code olny for reference-----------------------------


//------------------------------below is new code with enhanced UI/UX-----------------------------


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import {
// //   Container,
// //   Paper,
// //   Typography,
// //   Box,
// //   Grid,
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   TextField,
// //   Button,
// //   Switch,
// //   FormControlLabel,
// //   Chip,
// //   Avatar,
// //   IconButton,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Alert,
// //   Snackbar,
// //   Tooltip,
// //   Badge,
// //   Stack,
// //   Divider,
// //   Accordion,
// //   AccordionSummary,
// //   AccordionDetails,
// //   Fade,
// //   Zoom,
// //   CircularProgress,
// //   useTheme,
// //   alpha,
// //   ButtonGroup,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Checkbox,
// //   ListItemText
// // } from '@mui/material';
// // import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
// // import {
// //   Person as PersonIcon,
// //   Security as SecurityIcon,
// //   AdminPanelSettings as AdminIcon,
// //   Edit as EditIcon,
// //   Add as AddIcon,
// //   Update as UpdateIcon,
// //   Visibility as ViewIcon,
// //   VisibilityOff as HideIcon,
// //   SupervisorAccount as SuperIcon,
// //   Assignment as PaperIcon,
// //   Check as CheckIcon,
// //   Close as CloseIcon,
// //   ExpandMore as ExpandMoreIcon,
// //   Group as GroupIcon,
// //   Key as KeyIcon,
// //   Shield as ShieldIcon,
// //   Refresh as RefreshIcon
// // } from '@mui/icons-material';
// // import { styled } from '@mui/material/styles';
// // import { Visibility, VisibilityOff } from '@mui/icons-material';
// // // Enhanced styled components
// // const StyledContainer = styled(Container)(({ theme }) => ({
// //   background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
// //   minHeight: '100vh',
// //   paddingTop: theme.spacing(3),
// //   paddingBottom: theme.spacing(3),
// // }));

// // const GlassmorphismCard = styled(Card)(({ theme }) => ({
// //   background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
// //   backdropFilter: 'blur(20px)',
// //   border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
// //   borderRadius: '16px',
// //   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
// //   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
// //   '&:hover': {
// //     transform: 'translateY(-4px)',
// //     boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
// //   }
// // }));

// // const ActionCard = styled(Card)(({ theme }) => ({
// //   background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}03 100%)`,
// //   borderRadius: '16px',
// //   transition: 'all 0.3s ease',
// //   cursor: 'pointer',
// //   '&:hover': {
// //     transform: 'translateY(-2px)',
// //     boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
// //   }
// // }));

// // const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
// //   border: 'none',
// //   borderRadius: '16px',
// //   '& .MuiDataGrid-main': {
// //     borderRadius: '16px',
// //   },
// //   '& .MuiDataGrid-columnHeaders': {
// //     backgroundColor: alpha(theme.palette.primary.main, 0.05),
// //     borderRadius: '16px 16px 0 0',
// //     fontWeight: 700,
// //     fontSize: '0.95rem',
// //     color: theme.palette.primary.main,
// //   },
// //   '& .MuiDataGrid-cell': {
// //     borderColor: alpha(theme.palette.divider, 0.3),
// //   },
// //   '& .MuiDataGrid-row': {
// //     transition: 'all 0.2s ease',
// //     '&:hover': {
// //       backgroundColor: alpha(theme.palette.primary.main, 0.04),
// //       transform: 'scale(1.001)',
// //     }
// //   }
// // }));

// // const QuickActionButton = styled(Button)(({ theme }) => ({
// //   borderRadius: '12px',
// //   fontWeight: 600,
// //   textTransform: 'none',
// //   padding: '10px 20px',
// //   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
// //   transition: 'all 0.2s ease',
// //   '&:hover': {
// //     transform: 'translateY(-1px)',
// //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
// //   }
// // }));

// // // Permission Toggle Component
// // const PermissionToggle = ({ permission, value, onChange, icon, label, color }) => (
// //   <Box sx={{ 
// //     display: 'flex', 
// //     alignItems: 'center', 
// //     justifyContent: 'space-between',
// //     p: 2,
// //     bgcolor: alpha(color, 0.05),
// //     borderRadius: 2,
// //     border: `1px solid ${alpha(color, 0.2)}`,
// //     transition: 'all 0.2s ease',
// //     '&:hover': {
// //       bgcolor: alpha(color, 0.1),
// //     }
// //   }}>
// //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //       <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}>
// //         {icon}
// //       </Avatar>
// //       <Typography variant="body2" sx={{ fontWeight: 500 }}>
// //         {label}
// //       </Typography>
// //     </Box>
// //     <Switch
// //       checked={value === 'true' || value === true}
// //       onChange={(e) => onChange(permission, e.target.checked ? 'true' : 'false')}
// //       color="primary"
// //     />
// //   </Box>
// // );

// // // Stats Card Component
// // const StatsCard = ({ title, value, icon, color, subtitle }) => (
// //   <ActionCard>
// //     <CardContent>
// //       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// //         <Box>
// //           <Typography variant="body2" color="text.secondary" gutterBottom>
// //             {title}
// //           </Typography>
// //           <Typography variant="h3" component="div" sx={{ color: color, fontWeight: 700, mb: 0.5 }}>
// //             {value}
// //           </Typography>
// //           {subtitle && (
// //             <Typography variant="caption" color="text.secondary">
// //               {subtitle}
// //             </Typography>
// //           )}
// //         </Box>
// //         <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
// //           {icon}
// //         </Avatar>
// //       </Box>
// //     </CardContent>
// //   </ActionCard>
// // );

// // // Custom Toolbar
// // const CustomToolbar = ({ onRefresh, expertCount }) => (
// //   <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between' }}>
// //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //       <SecurityIcon color="primary" />
// //       <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
// //         Expert Directory ({expertCount} experts)
// //       </Typography>
// //     </Box>
// //     <Box sx={{ display: 'flex', gap: 1 }}>
// //       <GridToolbarFilterButton />
// //       <GridToolbarExport />
// //       <QuickActionButton onClick={onRefresh} startIcon={<RefreshIcon />} size="small">
// //         Refresh
// //       </QuickActionButton>
// //     </Box>
// //   </GridToolbarContainer>
// // );

// // const ExpertManagement = () => {
// //   const theme = useTheme();
// //   const [experts, setExperts] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
// //   const [showPassword, setShowPassword] = useState({});
  
// //   // Form states
// //   const [newExpert, setNewExpert] = useState({ expertId: '', expert_name: '', password: '' });
// //   const [updateExpert, setUpdateExpert] = useState({ paper_check: '', paper_mod: '', super_mod: '' });
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedExperts, setSelectedExperts] = useState([]);
// //   const [quickUpdateMode, setQuickUpdateMode] = useState(false);

// //   useEffect(() => {
// //     fetchExperts();
// //   }, []);

// //   const fetchExperts = async () => {
// //     setLoading(true);
// //     setError('');
// //     try {
// //       const response = await axios.get('http://localhost:3000/get-experts');
// //       setExperts(response.data.results || []);
// //     } catch (err) {
// //       setError('❌ Error fetching experts');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleInsertExpert = async () => {
// //     if (!newExpert.expertId || !newExpert.expert_name || !newExpert.password) {
// //       setError('❌ Please fill all required fields');
// //       return;
// //     }

// //     try {
// //       const response = await axios.post('http://localhost:3000/insert-expert', newExpert);
// //       setSuccess(`✅ ${response.data.message}`);
// //       setNewExpert({ expertId: '', expert_name: '', password: '' });
// //       fetchExperts();
// //     } catch (err) {
// //       setError('❌ Error inserting expert');
// //     }
// //   };

// //   const handleUpdateExperts = async (updateAll = false) => {
// //     try {
// //       const response = await axios.post('http://localhost:3000/update-experts', {
// //         experts: updateAll ? [] : selectedExperts,
// //         paper_check: updateExpert.paper_check === 'true',
// //         paper_mod: updateExpert.paper_mod === 'true',
// //         super_mod: updateExpert.super_mod === 'true',
// //         updateAll: updateAll
// //       });
// //       setSuccess(`✅ ${response.data.message}`);
// //       fetchExperts();
// //       setShowModal(false);
// //       setSelectedExperts([]);
// //     } catch (err) {
// //       setError('❌ Error updating experts');
// //     }
// //   };

// //   const handlePermissionChange = (permission, value) => {
// //     setUpdateExpert(prev => ({ ...prev, [permission]: value }));
// //   };

// //   const togglePasswordVisibility = (expertId) => {
// //     setShowPassword(prev => ({
// //       ...prev,
// //       [expertId]: !prev[expertId]
// //     }));
// //   };

// //   const toggleExpertSelection = (expertId) => {
// //     setSelectedExperts(prevSelected => 
// //       prevSelected.includes(expertId)
// //         ? prevSelected.filter(id => id !== expertId)
// //         : [...prevSelected, expertId]
// //     );
// //   };

// //   // Statistics calculation
// //   const stats = {
// //     total: experts.length,
// //     paperCheck: experts.filter(e => e.paper_check).length,
// //     paperMod: experts.filter(e => e.paper_mod).length,
// //     superMod: experts.filter(e => e.super_mod).length
// //   };

// //   // DataGrid columns
// //   const columns = [
// //     {
// //       field: 'expertId',
// //       headerName: 'Expert ID',
// //       width: 130,
// //       renderCell: (params) => (
// //         <Chip
// //           avatar={<PersonIcon />}
// //           label={params.value}
// //           size="small"
// //           color="primary"
// //           variant="outlined"
// //         />
// //       )
// //     },
// //     {
// //       field: 'expert_name',
// //       headerName: 'Expert Name',
// //       width: 180,
// //       renderCell: (params) => (
// //         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //           <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
// //             {params.value?.charAt(0)?.toUpperCase()}
// //           </Avatar>
// //           <Typography variant="body2" sx={{ fontWeight: 500 }}>
// //             {params.value}
// //           </Typography>
// //         </Box>
// //       )
// //     },
// //     {
// //       field: 'password',
// //       headerName: 'Password',
// //       width: 150,
// //       renderCell: (params) => (
// //         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //           <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
// //             {showPassword[params.row.expertId] ? params.value : '••••••••'}
// //           </Typography>
// //           <IconButton 
// //             size="small" 
// //             onClick={() => togglePasswordVisibility(params.row.expertId)}
// //           >
// //             {showPassword[params.row.expertId] ? <VisibilityOff /> : <ViewIcon />}
// //           </IconButton>
// //         </Box>
// //       )
// //     },
// //     {
// //       field: 'paper_check',
// //       headerName: 'Paper Check',
// //       width: 130,
// //       renderCell: (params) => (
// //         <Chip
// //           icon={params.value ? <CheckIcon /> : <CloseIcon />}
// //           label={params.value ? 'Enabled' : 'Disabled'}
// //           color={params.value ? 'success' : 'error'}
// //           size="small"
// //         />
// //       )
// //     },
// //     {
// //       field: 'paper_mod',
// //       headerName: 'Paper Mod',
// //       width: 130,
// //       renderCell: (params) => (
// //         <Chip
// //           icon={params.value ? <CheckIcon /> : <CloseIcon />}
// //           label={params.value ? 'Enabled' : 'Disabled'}
// //           color={params.value ? 'success' : 'error'}
// //           size="small"
// //         />
// //       )
// //     },
// //     {
// //       field: 'super_mod',
// //       headerName: 'Super Mod',
// //       width: 130,
// //       renderCell: (params) => (
// //         <Chip
// //           icon={params.value ? <CheckIcon /> : <CloseIcon />}
// //           label={params.value ? 'Enabled' : 'Disabled'}
// //           color={params.value ? 'success' : 'error'}
// //           size="small"
// //         />
// //       )
// //     },
// //     {
// //       field: 'actions',
// //       headerName: 'Quick Actions',
// //       width: 120,
// //       sortable: false,
// //       renderCell: (params) => (
// //         <Box sx={{ display: 'flex', gap: 0.5 }}>
// //           <Tooltip title="Select for bulk update">
// //             <Checkbox
// //               size="small"
// //               checked={selectedExperts.includes(params.row.expertId)}
// //               onChange={() => toggleExpertSelection(params.row.expertId)}
// //             />
// //           </Tooltip>
// //         </Box>
// //       )
// //     }
// //   ];

// //   return (
// //     <StyledContainer maxWidth="xl">
// //       <Fade in={true} timeout={600}>
// //         <Box>
// //           {/* Header */}
// //           <Box sx={{ mb: 4, textAlign: 'center' }}>
// //             <Typography
// //               variant="h3"
// //               sx={{
// //                 fontWeight: 700,
// //                 background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
// //                 WebkitBackgroundClip: 'text',
// //                 WebkitTextFillColor: 'transparent',
// //                 mb: 1,
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 justifyContent: 'center',
// //                 gap: 2
// //               }}
// //             >
// //               <SecurityIcon sx={{ fontSize: '2.5rem', color: '#1976d2' }} />
// //               Expert Management
// //             </Typography>
// //             <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
// //               Manage expert accounts, permissions, and access controls
// //             </Typography>
// //           </Box>

// //           {/* Statistics Dashboard */}
// //           <Grid container spacing={3} sx={{ mb: 4 }}>
// //             <Grid item xs={12} sm={6} md={3}>
// //               <StatsCard
// //                 title="Total Experts"
// //                 value={stats.total}
// //                 icon={<GroupIcon />}
// //                 color="#1976d2"
// //                 subtitle="Registered experts"
// //               />
// //             </Grid>
// //             <Grid item xs={12} sm={6} md={3}>
// //               <StatsCard
// //                 title="Paper Check"
// //                 value={stats.paperCheck}
// //                 icon={<PaperIcon />}
// //                 color="#2e7d32"
// //                 subtitle="Can check papers"
// //               />
// //             </Grid>
// //             <Grid item xs={12} sm={6} md={3}>
// //               <StatsCard
// //                 title="Paper Mod"
// //                 value={stats.paperMod}
// //                 icon={<EditIcon />}
// //                 color="#ed6c02"
// //                 subtitle="Can moderate papers"
// //               />
// //             </Grid>
// //             <Grid item xs={12} sm={6} md={3}>
// //               <StatsCard
// //                 title="Super Mod"
// //                 value={stats.superMod}
// //                 icon={<SuperIcon />}
// //                 color="#d32f2f"
// //                 subtitle="Super moderators"
// //               />
// //             </Grid>
// //           </Grid>

// //           <Grid container spacing={3}>
// //             {/* Left Column - Actions */}
// //             <Grid item xs={12} lg={4}>
// //               <Stack spacing={3}>
// //                 {/* Add New Expert */}
// //                 <GlassmorphismCard>
// //                   <CardHeader
// //                     avatar={<Avatar sx={{ bgcolor: 'success.main' }}><AddIcon /></Avatar>}
// //                     title="Add New Expert"
// //                     titleTypographyProps={{ fontWeight: 600 }}
// //                     subheader="Create a new expert account"
// //                   />
// //                   <CardContent>
// //                     <Stack spacing={2}>
// //                       <TextField
// //                         fullWidth
// //                         size="small"
// //                         label="Expert ID"
// //                         placeholder="Enter expert ID"
// //                         value={newExpert.expertId}
// //                         onChange={(e) => setNewExpert({ ...newExpert, expertId: e.target.value })}
// //                         InputProps={{
// //                           startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
// //                         }}
// //                       />
// //                       <TextField
// //                         fullWidth
// //                         size="small"
// //                         label="Expert Name"
// //                         placeholder="Enter full name"
// //                         value={newExpert.expert_name}
// //                         onChange={(e) => setNewExpert({ ...newExpert, expert_name: e.target.value })}
// //                       />
// //                       <TextField
// //                         fullWidth
// //                         size="small"
// //                         type="password"
// //                         label="Password"
// //                         placeholder="Enter secure password"
// //                         value={newExpert.password}
// //                         onChange={(e) => setNewExpert({ ...newExpert, password: e.target.value })}
// //                         InputProps={{
// //                           startAdornment: <KeyIcon sx={{ mr: 1, color: 'action.active' }} />
// //                         }}
// //                       />
// //                       <QuickActionButton
// //                         fullWidth
// //                         variant="contained"
// //                         color="success"
// //                         onClick={handleInsertExpert}
// //                         startIcon={<AddIcon />}
// //                         disabled={!newExpert.expertId || !newExpert.expert_name || !newExpert.password}
// //                       >
// //                         Create Expert
// //                       </QuickActionButton>
// //                     </Stack>
// //                   </CardContent>
// //                 </GlassmorphismCard>

// //                 {/* Quick Permission Update */}
// //                 <GlassmorphismCard>
// //                   <CardHeader
// //                     avatar={<Avatar sx={{ bgcolor: 'warning.main' }}><ShieldIcon /></Avatar>}
// //                     title="Quick Permission Update"
// //                     titleTypographyProps={{ fontWeight: 600 }}
// //                     subheader="Set permissions for selected experts"
// //                   />
// //                   <CardContent>
// //                     <Stack spacing={2}>
// //                       <PermissionToggle
// //                         permission="paper_check"
// //                         value={updateExpert.paper_check}
// //                         onChange={handlePermissionChange}
// //                         icon={<PaperIcon fontSize="small" />}
// //                         label="Paper Check"
// //                         color="#2e7d32"
// //                       />
// //                       <PermissionToggle
// //                         permission="paper_mod"
// //                         value={updateExpert.paper_mod}
// //                         onChange={handlePermissionChange}
// //                         icon={<EditIcon fontSize="small" />}
// //                         label="Paper Mod"
// //                         color="#ed6c02"
// //                       />
// //                       <PermissionToggle
// //                         permission="super_mod"
// //                         value={updateExpert.super_mod}
// //                         onChange={handlePermissionChange}
// //                         icon={<SuperIcon fontSize="small" />}
// //                         label="Super Mod"
// //                         color="#d32f2f"
// //                       />
                      
// //                       <Divider />
                      
// //                       <ButtonGroup variant="contained" fullWidth>
// //                         <QuickActionButton
// //                           onClick={() => setShowModal(true)}
// //                           startIcon={<UpdateIcon />}
// //                           disabled={selectedExperts.length === 0}
// //                         >
// //                           Update Selected ({selectedExperts.length})
// //                         </QuickActionButton>
// //                         <QuickActionButton
// //                           onClick={() => handleUpdateExperts(true)}
// //                           color="warning"
// //                           startIcon={<GroupIcon />}
// //                         >
// //                           Update All
// //                         </QuickActionButton>
// //                       </ButtonGroup>
// //                     </Stack>
// //                   </CardContent>
// //                 </GlassmorphismCard>
// //               </Stack>
// //             </Grid>

// //             {/* Right Column - Data Grid */}
// //             <Grid item xs={12} lg={8}>
// //               <GlassmorphismCard sx={{ height: 650 }}>
// //                 <StyledDataGrid
// //                   rows={experts}
// //                   columns={columns}
// //                   getRowId={(row) => row.expertId}
// //                   initialState={{
// //                     pagination: { paginationModel: { pageSize: 10 } },
// //                   }}
// //                   pageSizeOptions={[5, 10, 25, 50]}
// //                   loading={loading}
// //                   slots={{
// //                     toolbar: () => <CustomToolbar onRefresh={fetchExperts} expertCount={experts.length} />
// //                   }}
// //                   density="comfortable"
// //                   disableRowSelectionOnClick
// //                 />
// //               </GlassmorphismCard>
// //             </Grid>
// //           </Grid>

// //           {/* Confirmation Dialog */}
// //           <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
// //             <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.main', color: 'white' }}>
// //               <UpdateIcon />
// //               Confirm Permission Update
// //             </DialogTitle>
// //             <DialogContent sx={{ mt: 2 }}>
// //               <Typography variant="body1" gutterBottom>
// //                 You are about to update permissions for <strong>{selectedExperts.length}</strong> selected experts:
// //               </Typography>
// //               <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
// //                 {selectedExperts.map(expertId => {
// //                   const expert = experts.find(e => e.expertId === expertId);
// //                   return (
// //                     <Chip
// //                       key={expertId}
// //                       label={expert?.expert_name || expertId}
// //                       size="small"
// //                       sx={{ mr: 1, mb: 1 }}
// //                     />
// //                   );
// //                 })}
// //               </Box>
// //               <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
// //                 This action cannot be undone. Are you sure you want to continue?
// //               </Typography>
// //             </DialogContent>
// //             <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
// //               <QuickActionButton onClick={() => setShowModal(false)} variant="outlined">
// //                 Cancel
// //               </QuickActionButton>
// //               <QuickActionButton
// //                 onClick={() => handleUpdateExperts(false)}
// //                 variant="contained"
// //                 color="primary"
// //                 startIcon={<UpdateIcon />}
// //               >
// //                 Update Selected
// //               </QuickActionButton>
// //             </DialogActions>
// //           </Dialog>

// //           {/* Notifications */}
// //           <Snackbar
// //             open={!!success}
// //             autoHideDuration={4000}
// //             onClose={() => setSuccess('')}
// //             anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
// //           >
// //             <Alert onClose={() => setSuccess('')} severity="success" variant="filled" sx={{ borderRadius: '12px' }}>
// //               {success}
// //             </Alert>
// //           </Snackbar>

// //           <Snackbar
// //             open={!!error}
// //             autoHideDuration={6000}
// //             onClose={() => setError('')}
// //             anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
// //           >
// //             <Alert onClose={() => setError('')} severity="error" variant="filled" sx={{ borderRadius: '12px' }}>
// //               {error}
// //             </Alert>
// //           </Snackbar>
// //         </Box>
// //       </Fade>
// //     </StyledContainer>
// //   );
// // };

// // export default ExpertManagement;

//----------------------------------------------------------------------------------------------------------------------------



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Switch,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  Divider,
  Fade,
  useTheme,
  alpha,
  ButtonGroup,
  Chip,
  Checkbox,
  useMediaQuery,
  Hidden
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Update as UpdateIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  SupervisorAccount as SuperIcon,
  Assignment as PaperIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Key as KeyIcon,
  Shield as ShieldIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Full-width container
const StyledContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  padding: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  }
}));

// Centered content wrapper
const CenteredBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  }
}));

const GlassmorphismCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const ActionCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}03 100%)`,
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  }
}));

// Enhanced DataGrid with full width utilization
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '16px',
  width: '100%',
  height: '100%',
  '& .MuiDataGrid-main': {
    borderRadius: '16px',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: '16px 16px 0 0',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    }
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.3),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
      padding: theme.spacing(0.5),
    }
  },
  '& .MuiDataGrid-row': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      transform: 'scale(1.001)',
    }
  }
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  padding: '10px 20px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    fontSize: '0.8rem',
  },
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}));

// Helper Components
const PermissionToggle = ({ permission, value, onChange, icon, label, color }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: isMobile ? 1 : 1.5,
      bgcolor: alpha(color, 0.05),
      borderRadius: 2,
      border: `1px solid ${alpha(color, 0.2)}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: alpha(color, 0.1),
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ 
          bgcolor: color, 
          width: isMobile ? 24 : 28, 
          height: isMobile ? 24 : 28 
        }}>
          {icon}
        </Avatar>
        <Typography variant="body2" sx={{ 
          fontWeight: 500, 
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          {label}
        </Typography>
      </Box>
      <Switch
        checked={value === 'true' || value === true}
        onChange={(e) => onChange(permission, e.target.checked ? 'true' : 'false')}
        color="primary"
        size="small"
      />
    </Box>
  );
};

const StatsCard = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <ActionCard>
      <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ 
              fontSize: isMobile ? '0.7rem' : '0.75rem' 
            }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ 
              color: color, 
              fontWeight: 700, 
              mb: 0.5, 
              fontSize: isMobile ? '1.4rem' : '1.8rem'
            }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ 
                fontSize: isMobile ? '0.6rem' : '0.65rem' 
              }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ 
            bgcolor: color, 
            width: isMobile ? 36 : 42, 
            height: isMobile ? 36 : 42 
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </ActionCard>
  );
};

const ExpertManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [newExpert, setNewExpert] = useState({ expertId: '', expert_name: '', password: '' });
  const [updateExpert, setUpdateExpert] = useState({ paper_check: '', paper_mod: '', super_mod: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedExperts, setSelectedExperts] = useState([]);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3000/get-experts');
      setExperts(response.data.results || []);
    } catch (err) {
      setError('❌ Error fetching experts');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertExpert = async () => {
    if (!newExpert.expertId || !newExpert.expert_name || !newExpert.password) {
      setError('❌ Please fill all required fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/insert-expert', newExpert);
      setSuccess(`✅ ${response.data.message}`);
      setNewExpert({ expertId: '', expert_name: '', password: '' });
      fetchExperts();
    } catch (err) {
      setError('❌ Error inserting expert');
    }
  };

  const handleUpdateExperts = async (updateAll = false) => {
    try {
      const response = await axios.post('http://localhost:3000/update-experts', {
        experts: updateAll ? [] : selectedExperts,
        paper_check: updateExpert.paper_check === 'true',
        paper_mod: updateExpert.paper_mod === 'true',
        super_mod: updateExpert.super_mod === 'true',
        updateAll: updateAll
      });
      setSuccess(`✅ ${response.data.message}`);
      fetchExperts();
      setShowModal(false);
      setSelectedExperts([]);
    } catch (err) {
      setError('❌ Error updating experts');
    }
  };

  const handlePermissionChange = (permission, value) => {
    setUpdateExpert(prev => ({ ...prev, [permission]: value }));
  };

  const togglePasswordVisibility = (expertId) => {
    setShowPassword(prev => ({
      ...prev,
      [expertId]: !prev[expertId]
    }));
  };

  const toggleExpertSelection = (expertId) => {
    setSelectedExperts(prevSelected => 
      prevSelected.includes(expertId)
        ? prevSelected.filter(id => id !== expertId)
        : [...prevSelected, expertId]
    );
  };

  // Statistics calculation
  const stats = {
    total: experts.length,
    paperCheck: experts.filter(e => e.paper_check).length,
    paperMod: experts.filter(e => e.paper_mod).length,
    superMod: experts.filter(e => e.super_mod).length
  };

  // Responsive DataGrid columns
  const getColumns = () => {
    const baseColumns = [
      {
        field: 'expertId',
        headerName: 'ID',
        flex: isMobile ? 0.6 : 0.8,
        minWidth: isMobile ? 60 : 100,
        renderCell: (params) => (
          <Chip
            avatar={<PersonIcon />}
            label={params.value}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
          />
        )
      },
      {
        field: 'expert_name',
        headerName: 'Name',
        flex: isMobile ? 1.2 : 1.5,
        minWidth: isMobile ? 100 : 150,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0.5 : 1 }}>
            <Avatar sx={{ 
              width: isMobile ? 24 : 32, 
              height: isMobile ? 24 : 32, 
              bgcolor: 'primary.main',
              fontSize: isMobile ? '0.7rem' : '1rem'
            }}>
              {params.value?.charAt(0)?.toUpperCase()}
            </Avatar>
            {!isMobile && (
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                {params.value}
              </Typography>
            )}
          </Box>
        )
      }
    ];

    // Add password column for larger screens
    if (!isMobile) {
      baseColumns.push({
        field: 'password',
        headerName: 'Password',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ 
              fontFamily: 'monospace',
              fontSize: isTablet ? '0.7rem' : '0.8rem'
            }}>
              {showPassword[params.row.expertId] ? params.value : '••••••••'}
            </Typography>
            <IconButton
              size="small"
              onClick={() => togglePasswordVisibility(params.row.expertId)}
            >
              {showPassword[params.row.expertId] ? <HideIcon fontSize="small" /> : <ViewIcon fontSize="small" />}
            </IconButton>
          </Box>
        )
      });
    }

    // Add permission columns for medium+ screens
    if (!isTablet) {
      baseColumns.push(
        {
          field: 'paper_check',
          headerName: 'Paper Check',
          flex: 0.8,
          minWidth: 110,
          renderCell: (params) => (
            <Chip
              icon={params.value ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
              label={params.value ? 'On' : 'Off'}
              color={params.value ? 'success' : 'error'}
              size="small"
              sx={{ fontSize: '0.7rem' }}
            />
          )
        },
        {
          field: 'paper_mod',
          headerName: 'Paper Mod',
          flex: 0.8,
          minWidth: 110,
          renderCell: (params) => (
            <Chip
              icon={params.value ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
              label={params.value ? 'On' : 'Off'}
              color={params.value ? 'success' : 'error'}
              size="small"
              sx={{ fontSize: '0.7rem' }}
            />
          )
        },
        {
          field: 'super_mod',
          headerName: 'Super Mod',
          flex: 0.8,
          minWidth: 110,
          renderCell: (params) => (
            <Chip
              icon={params.value ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
              label={params.value ? 'On' : 'Off'}
              color={params.value ? 'success' : 'error'}
              size="small"
              sx={{ fontSize: '0.7rem' }}
            />
          )
        }
      );
    }

    // Always add actions column
    baseColumns.push({
      field: 'actions',
      headerName: 'Select',
      flex: 0.4,
      minWidth: isMobile ? 50 : 70,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Select for bulk update">
          <Checkbox
            size="small"
            checked={selectedExperts.includes(params.row.expertId)}
            onChange={() => toggleExpertSelection(params.row.expertId)}
          />
        </Tooltip>
      )
    });

    return baseColumns;
  };

  // Custom Toolbar
  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ 
      p: isMobile ? 1.5 : 2, 
      justifyContent: 'space-between', 
      flexWrap: 'wrap', 
      gap: 1 
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecurityIcon color="primary" sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
        <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ 
          fontWeight: 600, 
          color: 'primary.main',
          fontSize: isMobile ? '0.9rem' : '1.25rem'
        }}>
          {isMobile ? `Experts (${experts.length})` : `Expert Directory (${experts.length} experts)`}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        <GridToolbarFilterButton size="small" />
        <GridToolbarExport size="small" />
        <QuickActionButton 
          onClick={fetchExperts} 
          startIcon={<RefreshIcon fontSize="small" />} 
          size="small"
        >
          {isMobile ? '' : 'Refresh'}
        </QuickActionButton>
      </Box>
    </GridToolbarContainer>
  );

  return (
    <StyledContainer>
      <Fade in={true} timeout={600}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: isMobile ? 2 : 3, textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h5' : 'h3'}
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? 1 : 2,
                flexDirection: isMobile ? 'column' : 'row'
              }}
            >
              <SecurityIcon sx={{ 
                fontSize: isMobile ? '1.5rem' : '2.5rem', 
                color: '#1976d2' 
              }} />
              Expert Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ 
              fontSize: isMobile ? '0.85rem' : '1.1rem',
              px: isMobile ? 1 : 0
            }}>
              Manage expert accounts, permissions, and access controls
            </Typography>
          </Box>

          {/* Centered Statistics Dashboard */}
          <CenteredBox>
            <Box sx={{ 
              maxWidth: isMobile ? '100%' : '900px', 
              width: '100%' 
            }}>
              <Grid container spacing={isMobile ? 1 : 2} justifyContent="center">
                <Grid item xs={6} sm={3}>
                  <StatsCard title="Total" value={stats.total} icon={<GroupIcon />} color="#1976d2" subtitle="Registered experts"/>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <StatsCard title="Paper Check" value={stats.paperCheck} icon={<PaperIcon />} color="#2e7d32" subtitle="Can check papers"/>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <StatsCard title="Paper Mod" value={stats.paperMod} icon={<EditIcon />} color="#ed6c02" subtitle="Can moderate papers"/>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <StatsCard title="Super Mod" value={stats.superMod} icon={<SuperIcon />} color="#d32f2f" subtitle="Super moderators"/>
                </Grid>
              </Grid>
            </Box>
          </CenteredBox>

          {/* Centered Action Cards - Above Table */}
          <CenteredBox>
            <Box sx={{ 
              maxWidth: isMobile ? '100%' : '1000px', 
              width: '100%' 
            }}>
              <Grid container spacing={isMobile ? 1 : 2} justifyContent="center">
                {/* Add New Expert Card */}
                <Grid item xs={12} md={6}>
                  <GlassmorphismCard>
                    <CardHeader 
                      avatar={
                        <Avatar sx={{ 
                          bgcolor: 'success.main', 
                          width: isMobile ? 28 : 36, 
                          height: isMobile ? 28 : 36 
                        }}>
                          <AddIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </Avatar>
                      } 
                      title="Add New Expert" 
                      titleTypographyProps={{ 
                        fontWeight: 600, 
                        fontSize: isMobile ? '0.9rem' : '1.1rem' 
                      }} 
                      subheader="Create a new expert account"
                      subheaderTypographyProps={{ 
                        fontSize: isMobile ? '0.75rem' : '0.8rem' 
                      }}
                      sx={{ pb: isMobile ? 0.5 : 1 }}
                    />
                    <CardContent sx={{ pt: 0, px: isMobile ? 2 : 3 }}>
                      <Stack spacing={isMobile ? 1 : 1.5}>
                        <TextField 
                          fullWidth 
                          size="small" 
                          label="Expert ID" 
                          placeholder="Enter expert ID" 
                          value={newExpert.expertId} 
                          onChange={(e) => setNewExpert({ ...newExpert, expertId: e.target.value })} 
                          InputProps={{ 
                            startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                            sx: { fontSize: isMobile ? '0.8rem' : '0.875rem' }
                          }}
                        />
                        <TextField 
                          fullWidth 
                          size="small" 
                          label="Expert Name" 
                          placeholder="Enter full name" 
                          value={newExpert.expert_name} 
                          onChange={(e) => setNewExpert({ ...newExpert, expert_name: e.target.value })}
                          InputProps={{
                            sx: { fontSize: isMobile ? '0.8rem' : '0.875rem' }
                          }}
                        />
                        <TextField 
                          fullWidth 
                          size="small" 
                          type="password" 
                          label="Password" 
                          placeholder="Enter secure password" 
                          value={newExpert.password} 
                          onChange={(e) => setNewExpert({ ...newExpert, password: e.target.value })} 
                          InputProps={{ 
                            startAdornment: <KeyIcon sx={{ mr: 1, color: 'action.active' }} />,
                            sx: { fontSize: isMobile ? '0.8rem' : '0.875rem' }
                          }}
                        />
                        <QuickActionButton 
                          fullWidth 
                          variant="contained" 
                          color="success" 
                          onClick={handleInsertExpert} 
                          startIcon={<AddIcon fontSize="small" />} 
                          disabled={!newExpert.expertId || !newExpert.expert_name || !newExpert.password}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Create Expert
                        </QuickActionButton>
                      </Stack>
                    </CardContent>
                  </GlassmorphismCard>
                </Grid>

                {/* Permission Update Card */}
                <Grid item xs={12} md={6}>
                  <GlassmorphismCard>
                    <CardHeader 
                      avatar={
                        <Avatar sx={{ 
                          bgcolor: 'warning.main', 
                          width: isMobile ? 28 : 36, 
                          height: isMobile ? 28 : 36 
                        }}>
                          <ShieldIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </Avatar>
                      } 
                      title="Permission Update" 
                      titleTypographyProps={{ 
                        fontWeight: 600, 
                        fontSize: isMobile ? '0.9rem' : '1.1rem' 
                      }} 
                      subheader="Set permissions for experts"
                      subheaderTypographyProps={{ 
                        fontSize: isMobile ? '0.75rem' : '0.8rem' 
                      }}
                      sx={{ pb: isMobile ? 0.5 : 1 }}
                    />
                    <CardContent sx={{ pt: 0, px: isMobile ? 2 : 3 }}>
                      <Stack spacing={isMobile ? 1 : 1.5}>
                        <PermissionToggle 
                          permission="paper_check" 
                          value={updateExpert.paper_check} 
                          onChange={handlePermissionChange} 
                          icon={<PaperIcon fontSize="small" />} 
                          label="Paper Check" 
                          color="#2e7d32"
                        />
                        <PermissionToggle 
                          permission="paper_mod" 
                          value={updateExpert.paper_mod} 
                          onChange={handlePermissionChange} 
                          icon={<EditIcon fontSize="small" />} 
                          label="Paper Mod" 
                          color="#ed6c02"
                        />
                        <PermissionToggle 
                          permission="super_mod" 
                          value={updateExpert.super_mod} 
                          onChange={handlePermissionChange} 
                          icon={<SuperIcon fontSize="small" />} 
                          label="Super Mod" 
                          color="#d32f2f"
                        />
                        <Divider sx={{ my: 0.5 }} />
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <QuickActionButton 
                              fullWidth
                              onClick={() => setShowModal(true)} 
                              startIcon={<UpdateIcon fontSize="small" />} 
                              disabled={selectedExperts.length === 0}
                              variant="contained"
                              size={isMobile ? 'small' : 'medium'}
                            >
                              Update Selected ({selectedExperts.length})
                            </QuickActionButton>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <QuickActionButton 
                              fullWidth
                              onClick={() => handleUpdateExperts(true)} 
                              color="warning" 
                              startIcon={<GroupIcon fontSize="small" />}
                              variant="contained"
                              size={isMobile ? 'small' : 'medium'}
                            >
                              Update All Experts
                            </QuickActionButton>
                          </Grid>
                        </Grid>
                      </Stack>
                    </CardContent>
                  </GlassmorphismCard>
                </Grid>
              </Grid>
            </Box>
          </CenteredBox>

          {/* Full Width Data Grid */}
          <Box sx={{ mb: 2 }}>
            <GlassmorphismCard sx={{ 
              height: isMobile ? '50vh' : isTablet ? '60vh' : '65vh' 
            }}>
              <StyledDataGrid
                rows={experts}
                columns={getColumns()}
                getRowId={(row) => row.expertId}
                initialState={{ 
                  pagination: { 
                    paginationModel: { 
                      pageSize: isMobile ? 5 : isTablet ? 10 : 15 
                    } 
                  } 
                }}
                pageSizeOptions={
                  isMobile ? [5, 10] : 
                  isTablet ? [5, 10, 15] : 
                  [10, 15, 25, 50]
                }
                loading={loading}
                slots={{ toolbar: CustomToolbar }}
                density={isMobile ? "compact" : "comfortable"}
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    minHeight: isMobile ? '40px' : '56px',
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: isMobile ? '0.7rem' : '0.875rem',
                  }
                }}
              />
            </GlassmorphismCard>
          </Box>

          {/* Confirmation Dialog */}
          <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              fontSize: isMobile ? '1rem' : '1.25rem',
              p: isMobile ? 2 : 3
            }}>
              <UpdateIcon />
              Confirm Permission Update
            </DialogTitle>
            <DialogContent sx={{ mt: 2, p: isMobile ? 2 : 3 }}>
              <Typography variant="body1" gutterBottom sx={{
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}>
                You are about to update permissions for <strong>{selectedExperts.length}</strong> selected experts:
              </Typography>
              <Box sx={{ 
                mt: 2, 
                p: isMobile ? 1.5 : 2, 
                bgcolor: 'grey.50', 
                borderRadius: 2, 
                maxHeight: '200px', 
                overflow: 'auto' 
              }}>
                {selectedExperts.map(expertId => {
                  const expert = experts.find(e => e.expertId === expertId);
                  return (
                    <Chip 
                      key={expertId} 
                      label={expert?.expert_name || expertId} 
                      size="small" 
                      sx={{ 
                        mr: 0.5, 
                        mb: 0.5,
                        fontSize: isMobile ? '0.7rem' : '0.75rem'
                      }}
                    />
                  );
                })}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ 
                mt: 2,
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }}>
                This action cannot be undone. Are you sure you want to continue?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ 
              p: isMobile ? 2 : 3, 
              bgcolor: 'grey.50', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: 1 
            }}>
              <QuickActionButton 
                onClick={() => setShowModal(false)} 
                variant="outlined"
                fullWidth={isMobile}
                size={isMobile ? 'small' : 'medium'}
              >
                Cancel
              </QuickActionButton>
              <QuickActionButton 
                onClick={() => handleUpdateExperts(false)} 
                variant="contained" 
                color="primary" 
                startIcon={<UpdateIcon />}
                fullWidth={isMobile}
                size={isMobile ? 'small' : 'medium'}
              >
                Update Selected
              </QuickActionButton>
            </DialogActions>
          </Dialog>

          {/* Notifications */}
          <Snackbar 
            open={!!success} 
            autoHideDuration={4000} 
            onClose={() => setSuccess('')} 
            anchorOrigin={{ 
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Alert onClose={() => setSuccess('')} severity="success" variant="filled" sx={{ 
              borderRadius: '12px',
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}>
              {success}
            </Alert>
          </Snackbar>
          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={() => setError('')} 
            anchorOrigin={{ 
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Alert onClose={() => setError('')} severity="error" variant="filled" sx={{ 
              borderRadius: '12px',
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}>
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default ExpertManagement;
