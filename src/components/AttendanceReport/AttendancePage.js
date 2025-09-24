import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../navBar/navBar';
import './AttendancePage.css';

const AttendancePage = () => {
    const [batches, setBatches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
        fetchReports();
        fetchAllBatches();
    }, []);

    // Simple approach to fetch all batches
    const fetchAllBatches = async () => {
        try {
            // Use the working endpoint with "all" parameter
            const response = await axios.post(
                'http://localhost:3000/track-students-on-exam-center-code/all',
                {},
                { withCredentials: true }
            );
            
            if (response.data && response.data.length > 0) {
                const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
                setBatches(distinctBatches.filter(batch => batch).sort((a, b) => a - b));
                console.log("Fetched batches:", distinctBatches);
            }
        } catch (error) {
            console.error("Error fetching batches:", error);
            setError("Failed to fetch batches. Please try again later.");
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/get-active-departments');
            setDepartments(response.data || []);
        } catch (error) {
            setError("Failed to fetch departments. Please try again later.");
        }
    };

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:3000/get-attendance-report');
            setReports(response.data.Reports || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setError("Attendance Reports Not added yet!!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSuccess = () => {
        fetchReports();
        fetchAllBatches(); // Refresh batches after upload
    };

    const handleDeleteReport = async (batchNo, departmentId) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm(
            `Are you sure you want to delete the attendance report for Batch ${batchNo} in Department ${departmentId}?`
        );

        if (!isConfirmed) {
            return;
        }

        try {
            console.log(`Attempting to delete report for batch: ${batchNo}, department: ${departmentId}`);
            
            const response = await axios.post('http://localhost:3000/delete-atttendance', { 
                batchNo, 
                departmentId 
            }, { withCredentials: true });

            console.log("Delete response:", response);

            // Check for successful deletion (might be 200 or 201)
            if (response.status === 200 || response.status === 201) {
                alert(response.data.message || "Report deleted successfully!");
                
                // Update state by removing the deleted report
                setReports(prevReports => 
                    prevReports.filter(report => 
                        !(report.batchNo == batchNo && report.departmentId == departmentId)
                    )
                );
                
                // Also refresh the reports from server to ensure consistency
                setTimeout(() => {
                    fetchReports();
                }, 500);
            } else {
                alert("Unexpected response. Please refresh the page to see current status.");
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || 
                                   `Server error: ${error.response.status}`;
                alert(`Failed to delete report: ${errorMessage}`);
            } else if (error.request) {
                // Network error
                alert("Network error. Please check your connection and try again.");
            } else {
                // Other error
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="ap-loading-container">
                <div className="ap-loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className="ap-attendance-page">
                <h1 className="ap-main-title">Attendance Management</h1>
                {error && <div className="ap-error-message">{error}</div>}
                <AttendanceUploadForm 
                    batches={batches} 
                    departments={departments}
                    onUploadSuccess={handleUploadSuccess}
                />
                <AttendanceReportList reports={reports} onDeleteReport={handleDeleteReport} />
            </div>
        </>
    );
};

const AttendanceUploadForm = ({ batches, departments, onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        batchNo: '',
        departmentId: '',
        present_count: '',
        absent_count: '',
        file: null
    });
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [uploadError, setUploadError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Update filtered batches when batches or department changes
    useEffect(() => {
        filterBatchesByDepartment();
    }, [batches, formData.departmentId]);

    const filterBatchesByDepartment = async () => {
        if (!formData.departmentId || !departments.length) {
            setFilteredBatches(batches);
            return;
        }

        try {
            // Get students for the specific department to find available batches
            const response = await axios.post(
                'http://localhost:3000/track-students-on-exam-center-code/all',
                {},
                { 
                    withCredentials: true,
                    params: { departmentId: formData.departmentId }
                }
            );
            
            if (response.data && response.data.length > 0) {
                // Filter data by department ID and get unique batches
                const deptStudents = response.data.filter(student => 
                    student.departmentId == formData.departmentId
                );
                const deptBatches = [...new Set(deptStudents.map(item => item.batchNo))];
                setFilteredBatches(deptBatches.filter(batch => batch).sort((a, b) => a - b));
                console.log(`Batches for department ${formData.departmentId}:`, deptBatches);
            } else {
                setFilteredBatches([]);
            }
        } catch (error) {
            console.error("Error filtering batches by department:", error);
            // Fallback to showing all batches
            setFilteredBatches(batches);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'departmentId') {
            // Reset batch selection when department changes
            setFormData(prevState => ({
                ...prevState,
                batchNo: '',
                [name]: value
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: files ? files[0] : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError(null);
        setIsLoading(true);

        const data = new FormData();
        data.append('batchNo', formData.batchNo);
        data.append('departmentId', formData.departmentId);
        data.append('present_count', formData.present_count);
        data.append('absent_count', formData.absent_count);
        data.append('attendance', formData.file);

        try {
            const response = await axios.post('http://localhost:3000/upload-attendance', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
            onUploadSuccess();
            setFormData({ batchNo: '', departmentId: '', present_count: '', absent_count: '', file: null });
        } catch (error) {
            console.log(error);
            setUploadError("An error occurred while uploading. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ap-form-container">
            <form onSubmit={handleSubmit} className="ap-attendance-upload-form">
                <h2 className="ap-form-title">Upload Attendance Report</h2>
                {uploadError && <div className="ap-error-message">{uploadError}</div>}
                
                <div className="ap-form-row">
                    <div className="ap-form-group">
                        <label htmlFor="departmentId" className="ap-form-label">Department:</label>
                        <select
                            id="departmentId"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleChange}
                            required
                            className="ap-form-select"
                        >
                            <option value="">Select a department</option>
                            {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="ap-form-group">
                        <label htmlFor="batchNo" className="ap-form-label">Batch:</label>
                        <select
                            id="batchNo"
                            name="batchNo"
                            value={formData.batchNo}
                            onChange={handleChange}
                            required
                            className="ap-form-select"
                        >
                            <option value="">
                                {filteredBatches.length === 0 ? "No batches available" : "Select a batch"}
                            </option>
                            {filteredBatches.map(batch => (
                                <option key={batch} value={batch}>
                                    {batch}
                                </option>
                            ))}
                        </select>
                        {filteredBatches.length === 0 && formData.departmentId && (
                            <small className="ap-warning-text">No batches found for selected department</small>
                        )}
                    </div>
                </div>

                <div className="ap-form-row">
                    <div className="ap-form-group">
                        <label htmlFor="present_count" className="ap-form-label">Present Count:</label>
                        <input
                            type="number"
                            id="present_count"
                            name="present_count"
                            value={formData.present_count}
                            onChange={handleChange}
                            required
                            min="0"
                            className="ap-form-input"
                        />
                    </div>
                    <div className="ap-form-group">
                        <label htmlFor="absent_count" className="ap-form-label">Absent Count:</label>
                        <input
                            type="number"
                            id="absent_count"
                            name="absent_count"
                            value={formData.absent_count}
                            onChange={handleChange}
                            required
                            min="0"
                            className="ap-form-input"
                        />
                    </div>
                </div>

                <div className="ap-form-group ap-file-group">
                    <label htmlFor="file" className="ap-form-label">Attendance Report PDF:</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleChange}
                        accept=".pdf"
                        required
                        className="ap-form-file-input"
                    />
                    <small className="ap-file-note">File size must be below 1MB.</small>
                </div>

                <button type="submit" className="ap-submit-button" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="ap-button-spinner"></span>
                            Uploading...
                        </>
                    ) : (
                        'Upload Report'
                    )}
                </button>
            </form>
        </div>
    );
};

const AttendanceReportList = ({ reports, onDeleteReport }) => {
    const [deletingReports, setDeletingReports] = useState(new Set());

    const handleDelete = async (batchNo, departmentId) => {
        const reportKey = `${batchNo}-${departmentId}`;
        setDeletingReports(prev => new Set([...prev, reportKey]));
        
        try {
            await onDeleteReport(batchNo, departmentId);
        } finally {
            setDeletingReports(prev => {
                const newSet = new Set(prev);
                newSet.delete(reportKey);
                return newSet;
            });
        }
    };

    return (
        <div className="ap-reports-container">
            <h2 className="ap-list-title">Uploaded Attendance Reports</h2>
            {reports.length === 0 ? (
                <div className="ap-no-reports">
                    <p>No reports uploaded yet.</p>
                </div>
            ) : (
                <div className="ap-table-wrapper">
                    <table className="ap-report-table">
                        <thead>
                            <tr>
                                <th className="ap-table-header">Department</th>
                                <th className="ap-table-header">Batch No</th>
                                <th className="ap-table-header">Date</th>
                                <th className="ap-table-header">Present</th>
                                <th className="ap-table-header">Absent</th>
                                <th className="ap-table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => {
                                const reportKey = `${report.batchNo}-${report.departmentId}`;
                                const isDeleting = deletingReports.has(reportKey);
                                
                                return (
                                    <tr key={`${report.id}-${report.departmentId}`} className="ap-table-row">
                                        <td className="ap-table-cell">{report.departmentName}</td>
                                        <td className="ap-table-cell">{report.batchNo}</td>
                                        <td className="ap-table-cell">
                                            {new Date(report.report_date).toLocaleDateString()}
                                        </td>
                                        <td className="ap-table-cell ap-count-cell">{report.present_count}</td>
                                        <td className="ap-table-cell ap-count-cell">{report.absent_count}</td>
                                        <td className="ap-table-cell ap-actions-cell">
                                            <div className="ap-action-buttons">
                                                <a
                                                    href={`http://checking.shorthandonlineexam.in${report.attendance_pdf}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ap-view-button"
                                                >
                                                    📄 View
                                                </a>
                                                <button
                                                    className={`ap-delete-button ${isDeleting ? 'ap-deleting' : ''}`}
                                                    onClick={() => handleDelete(report.batchNo, report.departmentId)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? (
                                                        <>
                                                            <span className="ap-button-spinner"></span>
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        '🗑️ Delete'
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
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
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
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
//   Pagination,
//   Stack,
//   LinearProgress,
//   Snackbar
// } from '@mui/material';
// import {
//   School as SchoolIcon,
//   Group as GroupIcon,
//   Person as PersonIcon,
//   PersonOff as PersonOffIcon,
//   Upload as UploadIcon,
//   Business as BusinessIcon,
//   CloudUpload as CloudUploadIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   CalendarToday as CalendarIcon,
//   Analytics as AnalyticsIcon,
//   Assessment as AssessmentIcon,
//   PictureAsPdf as PdfIcon,
//   CheckCircle as CheckCircleIcon
// } from '@mui/icons-material';
// import NavBar from '../navBar/navBar';

// // Enhanced light theme with modern colors
// const modernTheme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#3b82f6',
//       light: '#60a5fa',
//       dark: '#2563eb',
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       main: '#8b5cf6',
//       light: '#a78bfa',
//       dark: '#7c3aed',
//       contrastText: '#ffffff',
//     },
//     success: {
//       main: '#10b981',
//       light: '#34d399',
//       dark: '#059669',
//       contrastText: '#ffffff',
//     },
//     warning: {
//       main: '#f59e0b',
//       light: '#fbbf24',
//       dark: '#d97706',
//       contrastText: '#ffffff',
//     },
//     info: {
//       main: '#06b6d4',
//       light: '#22d3ee',
//       dark: '#0891b2',
//       contrastText: '#ffffff',
//     },
//     error: {
//       main: '#ef4444',
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
//     }
//   },
//   components: {
//     MuiTableCell: {
//       styleOverrides: {
//         head: {
//           fontWeight: 600,
//           fontSize: '0.875rem',
//           textTransform: 'uppercase',
//           letterSpacing: '0.05em',
//           padding: '12px 16px',
//         },
//         body: {
//           padding: '8px 16px',
//         },
//       },
//     },
//   },
// });

// // Analytics Card Component
// const AnalyticsCard = ({ title, value, icon: Icon, color = 'primary', subtitle, progress }) => {
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
//             {progress !== undefined && (
//               <Box sx={{ mt: 1 }}>
//                 <LinearProgress
//                   variant="determinate"
//                   value={progress}
//                   sx={{
//                     height: 6,
//                     borderRadius: 3,
//                     backgroundColor: alpha(theme.palette[color].main, 0.1),
//                     '& .MuiLinearProgress-bar': {
//                       backgroundColor: theme.palette[color].main,
//                     },
//                   }}
//                 />
//                 <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
//                   {progress.toFixed(1)}% attendance rate
//                 </Typography>
//               </Box>
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

// // Clean Select Component
// const CleanSelect = ({ label, value, onChange, options, disabled = false, fullWidth = true, error = false, helperText }) => {
//   const theme = useTheme();
  
//   return (
//     <FormControl 
//       fullWidth={fullWidth}
//       disabled={disabled}
//       error={error}
//       sx={{
//         '& .MuiOutlinedInput-root': {
//           backgroundColor: theme.palette.grey[50],
//           borderRadius: 3,
//           border: `1px solid ${error ? theme.palette.error.main : theme.palette.grey[200]}`,
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           '&:hover': {
//             borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
//             backgroundColor: '#ffffff',
//             boxShadow: `0 4px 12px ${alpha(error ? theme.palette.error.main : theme.palette.primary.main, 0.15)}`,
//           },
//           '&.Mui-focused': {
//             borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
//             backgroundColor: '#ffffff',
//             boxShadow: `0 0 0 3px ${alpha(error ? theme.palette.error.main : theme.palette.primary.main, 0.1)}`,
//           },
//           '& fieldset': {
//             border: 'none',
//           }
//         },
//         '& .MuiInputLabel-root': {
//           color: error ? theme.palette.error.main : theme.palette.text.secondary,
//           fontWeight: 500,
//           '&.Mui-focused': {
//             color: error ? theme.palette.error.main : theme.palette.primary.main,
//             fontWeight: 600,
//           }
//         }
//       }}
//     >
//       <InputLabel>{label}</InputLabel>
//       <Select
//         value={value}
//         label={label}
//         onChange={onChange}
//         MenuProps={{
//           PaperProps: {
//             sx: {
//               borderRadius: 3,
//               mt: 1,
//               boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -6px rgb(0 0 0 / 0.1)',
//               border: `1px solid ${theme.palette.grey[200]}`,
//               '& .MuiMenuItem-root': {
//                 borderRadius: 2,
//                 mx: 1,
//                 my: 0.5,
//                 minHeight: 44,
//                 fontSize: '0.95rem',
//                 fontWeight: 500,
//                 transition: 'all 0.2s ease-in-out',
//                 '&:hover': {
//                   backgroundColor: alpha(theme.palette.primary.main, 0.08),
//                   transform: 'translateX(4px)',
//                 },
//                 '&.Mui-selected': {
//                   backgroundColor: alpha(theme.palette.primary.main, 0.12),
//                   color: theme.palette.primary.main,
//                   fontWeight: 600,
//                   '&:hover': {
//                     backgroundColor: alpha(theme.palette.primary.main, 0.16),
//                   }
//                 }
//               }
//             }
//           }
//         }}
//       >
//         {options.map((option, index) => (
//           <MenuItem key={index} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//       {helperText && (
//         <Typography variant="caption" sx={{ color: error ? 'error.main' : 'text.secondary', mt: 0.5 }}>
//           {helperText}
//         </Typography>
//       )}
//     </FormControl>
//   );
// };

// // File Upload Component
// const FileUploadBox = ({ onChange, accept, required, error, helperText }) => {
//   const theme = useTheme();
//   const [dragOver, setDragOver] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     onChange(event);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setDragOver(true);
//   };

//   const handleDragLeave = () => {
//     setDragOver(false);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setDragOver(false);
//     const file = event.dataTransfer.files[0];
//     if (file && file.type === 'application/pdf') {
//       setSelectedFile(file);
//       const syntheticEvent = {
//         target: {
//           name: 'file',
//           files: [file]
//         }
//       };
//       onChange(syntheticEvent);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         border: `2px dashed ${dragOver ? theme.palette.primary.main : error ? theme.palette.error.main : theme.palette.grey[300]}`,
//         borderRadius: 3,
//         p: 4,
//         textAlign: 'center',
//         backgroundColor: dragOver ? alpha(theme.palette.primary.main, 0.05) : error ? alpha(theme.palette.error.main, 0.05) : theme.palette.grey[50],
//         transition: 'all 0.3s ease',
//         cursor: 'pointer',
//         '&:hover': {
//           borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
//           backgroundColor: alpha(error ? theme.palette.error.main : theme.palette.primary.main, 0.05),
//         }
//       }}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//       onClick={() => document.getElementById('file-upload').click()}
//     >
//       <input
//         type="file"
//         id="file-upload"
//         accept={accept}
//         required={required}
//         onChange={handleFileChange}
//         style={{ display: 'none' }}
//       />
//       <CloudUploadIcon 
//         sx={{ 
//           fontSize: 48, 
//           color: error ? 'error.main' : 'primary.main', 
//           mb: 2 
//         }} 
//       />
//       <Typography variant="h6" sx={{ mb: 1, color: error ? 'error.main' : 'text.primary' }}>
//         {selectedFile ? selectedFile.name : 'Drop your PDF file here or click to browse'}
//       </Typography>
//       <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//         Supported format: PDF • Max size: 1MB
//       </Typography>
//       {helperText && (
//         <Typography variant="caption" sx={{ color: error ? 'error.main' : 'text.secondary', mt: 1, display: 'block' }}>
//           {helperText}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// // Delete Confirmation Dialog
// const DeleteDialog = ({ open, onClose, onConfirm, reportInfo }) => {
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
//             Confirm Report Deletion
//           </Typography>
//         </Box>
//       </DialogTitle>
//       <DialogContent>
//         <DialogContentText sx={{ mb: 2 }}>
//           Are you sure you want to delete this attendance report? This action cannot be undone.
//         </DialogContentText>
//         {reportInfo && (
//           <Box sx={{ 
//             backgroundColor: 'grey.50', 
//             p: 2, 
//             borderRadius: 2,
//             border: '1px solid',
//             borderColor: 'grey.200'
//           }}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//               Report Details:
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 0.5 }}>
//               <strong>Batch:</strong> {reportInfo.batchNo}
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 0.5 }}>
//               <strong>Department:</strong> {reportInfo.departmentName}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Date:</strong> {new Date(reportInfo.report_date).toLocaleDateString()}
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>
//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose} variant="outlined" color="inherit">
//           Cancel
//         </Button>
//         <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
//           Delete Report
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Upload Form Component
// const AttendanceUploadForm = ({ batches, departments, onUploadSuccess }) => {
//   const theme = useTheme();
//   const [formData, setFormData] = useState({
//     batchNo: '',
//     departmentId: '',
//     present_count: '',
//     absent_count: '',
//     file: null
//   });
//   const [filteredBatches, setFilteredBatches] = useState([]);
//   const [uploadError, setUploadError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Update filtered batches when batches or department changes
//   useEffect(() => {
//     filterBatchesByDepartment();
//   }, [batches, formData.departmentId]);

//   const filterBatchesByDepartment = async () => {
//     if (!formData.departmentId || !departments.length) {
//       setFilteredBatches(batches);
//       return;
//     }

//     try {
//       // Get students for the specific department to find available batches
//       const response = await axios.post(
//         'http://localhost:3000/track-students-on-exam-center-code/all',
//         {},
//         { 
//           withCredentials: true,
//           params: { departmentId: formData.departmentId }
//         }
//       );
      
//       if (response.data && response.data.length > 0) {
//         // Filter data by department ID and get unique batches
//         const deptStudents = response.data.filter(student => 
//           student.departmentId == formData.departmentId
//         );
//         const deptBatches = [...new Set(deptStudents.map(item => item.batchNo))];
//         setFilteredBatches(deptBatches.filter(batch => batch).sort((a, b) => a - b));
//         console.log(`Batches for department ${formData.departmentId}:`, deptBatches);
//       } else {
//         setFilteredBatches([]);
//       }
//     } catch (error) {
//       console.error("Error filtering batches by department:", error);
//       // Fallback to showing all batches
//       setFilteredBatches(batches);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
    
//     if (name === 'departmentId') {
//       // Reset batch selection when department changes
//       setFormData(prevState => ({
//         ...prevState,
//         batchNo: '',
//         [name]: value
//       }));
//     } else {
//       setFormData(prevState => ({
//         ...prevState,
//         [name]: files ? files[0] : value
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUploadError(null);
//     setIsLoading(true);

//     const data = new FormData();
//     data.append('batchNo', formData.batchNo);
//     data.append('departmentId', formData.departmentId);
//     data.append('present_count', formData.present_count);
//     data.append('absent_count', formData.absent_count);
//     data.append('attendance', formData.file);

//     try {
//       const response = await axios.post('http://localhost:3000/upload-attendance', data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setSnackbar({
//         open: true,
//         message: response.data.message || 'Report uploaded successfully!',
//         severity: 'success'
//       });
//       onUploadSuccess();
//       setFormData({ batchNo: '', departmentId: '', present_count: '', absent_count: '', file: null });
//     } catch (error) {
//       console.log(error);
//       setUploadError("An error occurred while uploading. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const departmentOptions = [
//     { value: '', label: 'Select a department' },
//     ...departments.map(dept => ({
//       value: dept.departmentId,
//       label: dept.departmentName
//     }))
//   ];

//   const batchOptions = [
//     { 
//       value: '', 
//       label: filteredBatches.length === 0 ? "No batches available" : "Select a batch" 
//     },
//     ...filteredBatches.map(batch => ({
//       value: batch,
//       label: `Batch ${batch}`
//     }))
//   ];

//   return (
//     <Card sx={{ borderRadius: 4, mb: 4 }}>
//       <CardHeader
//         avatar={
//           <Avatar sx={{ bgcolor: 'primary.main' }}>
//             <UploadIcon />
//           </Avatar>
//         }
//         title={
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Upload Attendance Report
//           </Typography>
//         }
//         subheader="Upload PDF attendance reports with student count details"
//       />
//       <Divider />
//       <CardContent sx={{ p: 4 }}>
//         {uploadError && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//             {uploadError}
//           </Alert>
//         )}
        
//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <CleanSelect
//                 label="Department"
//                 value={formData.departmentId}
//                 onChange={handleChange}
//                 name="departmentId"
//                 options={departmentOptions}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <CleanSelect
//                 label="Batch Number"
//                 value={formData.batchNo}
//                 onChange={handleChange}
//                 name="batchNo"
//                 options={batchOptions}
//                 disabled={!formData.departmentId}
//                 error={filteredBatches.length === 0 && formData.departmentId}
//                 helperText={filteredBatches.length === 0 && formData.departmentId ? "No batches found for selected department" : ""}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Present Count"
//                 name="present_count"
//                 type="number"
//                 value={formData.present_count}
//                 onChange={handleChange}
//                 required
//                 inputProps={{ min: 0 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 3,
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Absent Count"
//                 name="absent_count"
//                 type="number"
//                 value={formData.absent_count}
//                 onChange={handleChange}
//                 required
//                 inputProps={{ min: 0 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 3,
//                   }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <FileUploadBox
//                 onChange={handleChange}
//                 accept=".pdf"
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 size="large"
//                 disabled={isLoading}
//                 startIcon={isLoading ? <CircularProgress size={20} /> : <UploadIcon />}
//                 sx={{
//                   borderRadius: 3,
//                   py: 1.5,
//                   px: 4,
//                   fontWeight: 600,
//                   textTransform: 'none',
//                 }}
//               >
//                 {isLoading ? 'Uploading...' : 'Upload Report'}
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </CardContent>
      
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: '100%', borderRadius: 2 }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Card>
//   );
// };

// // Report List Component
// const AttendanceReportList = ({ reports, onDeleteReport }) => {
//   const theme = useTheme();
//   const [deletingReports, setDeletingReports] = useState(new Set());
//   const [deleteDialog, setDeleteDialog] = useState({ open: false, report: null });
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // Pagination calculations
//   const totalPages = Math.ceil(reports.length / rowsPerPage);
//   const paginatedReports = reports.slice((page - 1) * rowsPerPage, page * rowsPerPage);

//   const handleDeleteClick = (report) => {
//     setDeleteDialog({ open: true, report });
//   };

//   const handleDeleteConfirm = async () => {
//     const report = deleteDialog.report;
//     const reportKey = `${report.batchNo}-${report.departmentId}`;
//     setDeletingReports(prev => new Set([...prev, reportKey]));
    
//     try {
//       await onDeleteReport(report.batchNo, report.departmentId);
//     } finally {
//       setDeletingReports(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(reportKey);
//         return newSet;
//       });
//       setDeleteDialog({ open: false, report: null });
//     }
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   return (
//     <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
//       <CardHeader
//         title={
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Uploaded Attendance Reports
//               </Typography>
//               <Chip
//                 label={`${reports.length} reports`}
//                 color="secondary"
//                 size="small"
//                 sx={{ fontWeight: 600 }}
//               />
//             </Box>
//             <FormControl size="small" sx={{ minWidth: 120 }}>
//               <InputLabel>Rows per page</InputLabel>
//               <Select
//                 value={rowsPerPage}
//                 label="Rows per page"
//                 onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
//               >
//                 <MenuItem value={5}>5</MenuItem>
//                 <MenuItem value={10}>10</MenuItem>
//                 <MenuItem value={25}>25</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         }
//         subheader={reports.length === 0 ? "No reports uploaded yet" : `Showing ${Math.min((page - 1) * rowsPerPage + 1, reports.length)}-${Math.min(page * rowsPerPage, reports.length)} of ${reports.length} reports`}
//       />
//       <Divider />
      
//       {reports.length === 0 ? (
//         <Box sx={{ p: 6, textAlign: 'center' }}>
//           <Avatar
//             sx={{
//               width: 80,
//               height: 80,
//               bgcolor: alpha(theme.palette.info.main, 0.1),
//               color: 'info.main',
//               mx: 'auto',
//               mb: 3,
//             }}
//           >
//             <AssessmentIcon sx={{ fontSize: 40 }} />
//           </Avatar>
//           <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
//             No Reports Available
//           </Typography>
//           <Typography variant="body1" sx={{ color: 'text.secondary' }}>
//             Upload your first attendance report to get started.
//           </Typography>
//         </Box>
//       ) : (
//         <>
//           <TableContainer 
//             sx={{ 
//               maxHeight: 500,
//               '&::-webkit-scrollbar': {
//                 width: 8,
//                 height: 8,
//               },
//               '&::-webkit-scrollbar-track': {
//                 backgroundColor: alpha(theme.palette.grey[300], 0.3),
//                 borderRadius: 4,
//               },
//               '&::-webkit-scrollbar-thumb': {
//                 backgroundColor: alpha(theme.palette.secondary.main, 0.3),
//                 borderRadius: 4,
//                 '&:hover': {
//                   backgroundColor: alpha(theme.palette.secondary.main, 0.5),
//                 },
//               },
//             }}
//           >
//             <Table stickyHeader size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Department</Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Batch No</Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Date</Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Present</Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <PersonOffIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Absent</Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell align="center" sx={{ backgroundColor: 'grey.50', py: 1.5 }}>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Actions</Typography>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedReports.map((report) => {
//                   const reportKey = `${report.batchNo}-${report.departmentId}`;
//                   const isDeleting = deletingReports.has(reportKey);
//                   const totalStudents = report.present_count + report.absent_count;
//                   const attendanceRate = totalStudents > 0 ? (report.present_count / totalStudents) * 100 : 0;
                  
//                   return (
//                     <TableRow
//                       key={`${report.id}-${report.departmentId}`}
//                       sx={{
//                         '&:hover': {
//                           backgroundColor: alpha(theme.palette.secondary.main, 0.04),
//                         },
//                         '&:nth-of-type(even)': {
//                           backgroundColor: alpha(theme.palette.grey[50], 0.5),
//                         },
//                         height: 60,
//                       }}
//                     >
//                       <TableCell sx={{ py: 1 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                           {report.departmentName}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Chip
//                           label={report.batchNo}
//                           size="small"
//                           sx={{
//                             backgroundColor: alpha(theme.palette.secondary.main, 0.1),
//                             color: 'secondary.main',
//                             fontWeight: 600,
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                           {new Date(report.report_date).toLocaleDateString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Chip
//                             label={report.present_count}
//                             size="small"
//                             sx={{
//                               backgroundColor: alpha(theme.palette.success.main, 0.1),
//                               color: 'success.main',
//                               fontWeight: 600,
//                             }}
//                           />
//                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                             ({attendanceRate.toFixed(1)}%)
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Chip
//                           label={report.absent_count}
//                           size="small"
//                           sx={{
//                             backgroundColor: alpha(theme.palette.error.main, 0.1),
//                             color: 'error.main',
//                             fontWeight: 600,
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="center" sx={{ py: 1 }}>
//                         <Stack direction="row" spacing={1} justifyContent="center">
//                           <Tooltip title="View Report">
//                             <IconButton
//                               component="a"
//                               href={`http://checking.shorthandonlineexam.in${report.attendance_pdf}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               size="small"
//                               sx={{
//                                 color: 'info.main',
//                                 backgroundColor: alpha(theme.palette.info.main, 0.1),
//                                 border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.info.main, 0.2),
//                                 },
//                               }}
//                             >
//                               <VisibilityIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete Report">
//                             <IconButton
//                               onClick={() => handleDeleteClick(report)}
//                               disabled={isDeleting}
//                               size="small"
//                               sx={{
//                                 color: 'error.main',
//                                 backgroundColor: alpha(theme.palette.error.main, 0.1),
//                                 border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
//                                 '&:hover': {
//                                   backgroundColor: alpha(theme.palette.error.main, 0.2),
//                                 },
//                               }}
//                             >
//                               {isDeleting ? (
//                                 <CircularProgress size={16} color="error" />
//                               ) : (
//                                 <DeleteIcon fontSize="small" />
//                               )}
//                             </IconButton>
//                           </Tooltip>
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination Controls */}
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center',
//               p: 2,
//               borderTop: `1px solid ${theme.palette.grey[200]}`,
//               backgroundColor: 'grey.50'
//             }}
//           >
//             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//               Showing {Math.min((page - 1) * rowsPerPage + 1, reports.length)}-{Math.min(page * rowsPerPage, reports.length)} of {reports.length} reports
//             </Typography>
            
//             <Pagination
//               count={totalPages}
//               page={page}
//               onChange={handlePageChange}
//               color="secondary"
//               shape="rounded"
//               size="medium"
//               showFirstButton
//               showLastButton
//             />
//           </Box>
//         </>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <DeleteDialog
//         open={deleteDialog.open}
//         onClose={() => setDeleteDialog({ open: false, report: null })}
//         onConfirm={handleDeleteConfirm}
//         reportInfo={deleteDialog.report}
//       />
//     </Card>
//   );
// };

// // Main Component
// const AttendancePage = () => {
//   const theme = useTheme();
//   const [batches, setBatches] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Analytics calculations
//   const totalReports = reports.length;
//   const totalPresent = reports.reduce((sum, report) => sum + report.present_count, 0);
//   const totalAbsent = reports.reduce((sum, report) => sum + report.absent_count, 0);
//   const totalStudents = totalPresent + totalAbsent;
//   const overallAttendanceRate = totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;

//   useEffect(() => {
//     fetchDepartments();
//     fetchReports();
//     fetchAllBatches();
//   }, []);

//   // Simple approach to fetch all batches
//   const fetchAllBatches = async () => {
//     try {
//       // Use the working endpoint with "all" parameter
//       const response = await axios.post(
//         'http://localhost:3000/track-students-on-exam-center-code/all',
//         {},
//         { withCredentials: true }
//       );
      
//       if (response.data && response.data.length > 0) {
//         const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
//         setBatches(distinctBatches.filter(batch => batch).sort((a, b) => a - b));
//         console.log("Fetched batches:", distinctBatches);
//       }
//     } catch (error) {
//       console.error("Error fetching batches:", error);
//       setError("Failed to fetch batches. Please try again later.");
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/get-active-departments');
//       setDepartments(response.data || []);
//     } catch (error) {
//       setError("Failed to fetch departments. Please try again later.");
//     }
//   };

//   const fetchReports = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/get-attendance-report');
//       setReports(response.data.Reports || []);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       setError("Attendance Reports Not added yet!!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUploadSuccess = () => {
//     fetchReports();
//     fetchAllBatches(); // Refresh batches after upload
//   };

//   const handleDeleteReport = async (batchNo, departmentId) => {
//     try {
//       console.log(`Attempting to delete report for batch: ${batchNo}, department: ${departmentId}`);
      
//       const response = await axios.post('http://localhost:3000/delete-atttendance', { 
//         batchNo, 
//         departmentId 
//       }, { withCredentials: true });

//       console.log("Delete response:", response);

//       // Check for successful deletion (might be 200 or 201)
//       if (response.status === 200 || response.status === 201) {
//         // Update state by removing the deleted report
//         setReports(prevReports => 
//           prevReports.filter(report => 
//             !(report.batchNo == batchNo && report.departmentId == departmentId)
//           )
//         );
        
//         // Also refresh the reports from server to ensure consistency
//         setTimeout(() => {
//           fetchReports();
//         }, 500);
//       }
//     } catch (error) {
//       console.error("Error deleting report:", error);
//       throw error; // Re-throw to be handled by the calling component
//     }
//   };

//   if (isLoading) {
//     return (
//       <ThemeProvider theme={modernTheme}>
//         <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
//           <NavBar />
//           <Container maxWidth="xl" sx={{ py: 4 }}>
//             <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
//               <CircularProgress size={60} sx={{ mb: 2 }} />
//               <Typography variant="h6" color="text.secondary">
//                 Loading attendance management...
//               </Typography>
//             </Card>
//           </Container>
//         </Box>
//       </ThemeProvider>
//     );
//   }

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
//                   Attendance Management
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
//                   Upload, manage and track attendance reports across all examination batches
//                 </Typography>
//               </Box>

//               {/* Error Alert */}
//               {error && (
//                 <Alert severity="warning" sx={{ borderRadius: 4, mb: 3 }}>
//                   {error}
//                 </Alert>
//               )}

//               {/* Analytics Cards */}
//               {!isLoading && reports.length > 0 && (
//                 <Grid container spacing={3} sx={{ mb: 4 }}justifyContent={"center"}>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="Total Reports"
//                       value={totalReports}
//                       icon={AssessmentIcon}
//                       color="primary"
//                       subtitle="Uploaded reports"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="Present Students"
//                       value={totalPresent}
//                       icon={PersonIcon}
//                       color="success"
//                       subtitle="Attended exams"
//                       progress={overallAttendanceRate}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="Absent Students"
//                       value={totalAbsent}
//                       icon={PersonOffIcon}
//                       color="error"
//                       subtitle="Missed exams"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6} md={3}>
//                     <AnalyticsCard
//                       title="Attendance Rate"
//                       value={`${overallAttendanceRate.toFixed(1)}%`}
//                       icon={AnalyticsIcon}
//                       color="info"
//                       subtitle="Overall rate"
//                     />
//                   </Grid>
//                 </Grid>
//               )}

//               {/* Upload Form */}
//               <AttendanceUploadForm 
//                 batches={batches} 
//                 departments={departments}
//                 onUploadSuccess={handleUploadSuccess}
//               />

//               {/* Reports List */}
//               <AttendanceReportList 
//                 reports={reports} 
//                 onDeleteReport={handleDeleteReport} 
//               />
//             </Box>
//           </Fade>
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AttendancePage;
