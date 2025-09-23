// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import NavBar from '../navBar/navBar';
// // import './AttendanceDownload.css';

// // const AttendanceDownload = () => {
// //     const [departmentId, setDepartmentId] = useState('');
// //     const [batchNo, setBatchNo] = useState('');
// //     const [loadingButton, setLoadingButton] = useState('');
// //     const [error, setError] = useState('');
// //     const [departments, setDepartments] = useState([]);
// //     const [batches, setBatches] = useState([]);
// //     const [controller, setController] = useState('');
// //     const [isControllerPasswordVisible, setIsControllerPasswordVisible] = useState(false);
// //     const [center, setCenter] = useState();

// //     useEffect(() => {
// //         fetchDepartments();
// //         setCenter(localStorage.getItem('center'));
// //     }, []);

// //     useEffect(() => {
// //         console.log('Department useEffect triggered, departmentId:', departmentId);
// //         if (departmentId) {
// //             console.log('Department selected, calling fetchBatches');
// //             fetchBatches();
// //             setBatchNo(''); // Reset batch selection when department changes
// //             setIsControllerPasswordVisible(false);
// //         } else {
// //             console.log('No department selected, clearing batches');
// //             setBatches([]);
// //             setBatchNo('');
// //             setIsControllerPasswordVisible(false);
// //         }
// //     }, [departmentId]);

// //     useEffect(() => {
// //         if (batchNo && departmentId) {
// //             fetchController();
// //         } else {
// //             setIsControllerPasswordVisible(false);
// //         }
// //     }, [batchNo, departmentId]);

// //     const fetchDepartments = async () => {
// //         console.log('fetchDepartments called');
// //         try {
// //             console.log('Making request to:', 'http://localhost:3000/get-active-departments');
// //             const response = await axios.get('http://localhost:3000/get-active-departments');
// //             console.log('Departments response received:', response.data);
// //             setDepartments(response.data);
// //         } catch (error) {
// //             console.error("Error fetching departments:", error);
// //             console.error("Error response:", error.response);
// //             setError("Failed to fetch departments. Please try again later.");
// //         }
// //     };

// //     const fetchController = async () => {
// //         try {
// //             const response = await axios.post('http://localhost:3000/get-batch-controller-password', {
// //                 batchNo,
// //                 departmentId
// //             });
// //             if (response.data && response.data.results.length > 0) {
// //                 setController(response.data.results[0].controller_pass);
// //                 setIsControllerPasswordVisible(true);
// //             } else {
// //                 setIsControllerPasswordVisible(false);
// //             }
// //         } catch (error) {
// //             console.log(error);
// //             setIsControllerPasswordVisible(false);
// //         }
// //     };

// //     const fetchBatches = async () => {
// //         console.log('fetchBatches function called with departmentId:', departmentId);
// //         try {
// //             console.log('Making POST request to get batches...');
// //             const response = await axios.post('http://localhost:3000/track-students-on-exam-center-code', {
// //                 departmentId
// //             });
// //             console.log('Batches response:', response.data);
            
// //             // Fix: Since response.data is already an array of batch numbers, use it directly
// //             const distinctBatches = [...new Set(response.data)].sort((a, b) => a - b);
// //             setBatches(distinctBatches);
// //             console.log('Processed batches:', distinctBatches);
// //         } catch (error) {
// //             console.error("Error fetching batches:", error);
// //             console.error("Error details:", error.response?.data);
// //             setError("No batches available.");
// //             setBatches([]);
// //         }
// //     };

// //     const handleDownload = async (reportType) => {
// //         setLoadingButton(reportType);
// //         setError('');

// //         try {
// //             const response = await axios({
// //                 url: `http://localhost:3000/center/${reportType}-pdf-download`,
// //                 method: 'POST',
// //                 data: { batchNo, departmentId },
// //                 responseType: 'blob',
// //             });

// //             const contentType = response.headers['content-type'];
// //             if (contentType === 'application/pdf') {
// //                 const file = new Blob([response.data], { type: 'application/pdf' });
// //                 const fileURL = URL.createObjectURL(file);
// //                 const link = document.createElement('a');
// //                 link.href = fileURL;
// //                 link.setAttribute('download', `${reportType}_report_batch_${batchNo}_center_${localStorage.getItem('center')}.pdf`);
// //                 document.body.appendChild(link);
// //                 link.click();
// //                 link.remove();
// //                 URL.revokeObjectURL(fileURL);
// //             } else {
// //                 const reader = new FileReader();
// //                 reader.onload = function() {
// //                     setError("Download is not available at this time.");
// //                 };
// //                 reader.readAsText(response.data);
// //             }
// //         } catch (err) {
// //             console.error(`Error downloading the ${reportType} PDF:`, err);
// //             setError("Download is not available at this time.");
// //         } finally {
// //             setLoadingButton('');
// //         }
// //     };

// //     const handleExcelDownload = async () => {
// //         setLoadingButton('excel');
// //         setError('');

// //         try {
// //             const response = await axios({
// //                 url: 'http://localhost:3000/center/studentId-password',
// //                 method: 'POST',
// //                 data: { batchNo, departmentId },
// //                 responseType: 'blob',
// //                 headers: {
// //                     'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //                 }
// //             });

// //             const contentType = response.headers['content-type'];
// //             if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
// //                 const file = new Blob([response.data], { type: contentType });
// //                 const fileURL = URL.createObjectURL(file);
// //                 const link = document.createElement('a');
// //                 link.href = fileURL;
// //                 link.setAttribute('download', `studentId_password_batch_${batchNo}.xlsx`);
// //                 document.body.appendChild(link);
// //                 link.click();
// //                 link.remove();
// //                 URL.revokeObjectURL(fileURL);
// //             } else {
// //                 const reader = new FileReader();
// //                 reader.onload = function() {
// //                     setError("Excel download is not available at this time.");
// //                 };
// //                 reader.readAsText(response.data);
// //             }
// //         } catch (err) {
// //             console.error('Error downloading the Excel file:', err);
// //             setError("Excel download is not available at this time.");
// //         } finally {
// //             setLoadingButton('');
// //         }
// //     };

// //     return (
// //         <div>
// //             <NavBar />
// //             <div className="attendance-download">
// //                 <div className="attendance-download__wrapper">
// //                     <h2 className="attendance-download__title">Download Reports</h2>
// //                     <form className="attendance-download__form">
// //                         <div className="attendance-download__form-group">
// //                             <label htmlFor="departmentId" className="attendance-download__label">Department:</label>
// //                             <select
// //                                 className="attendance-download__select"
// //                                 id="departmentId"
// //                                 value={departmentId}
// //                                 onChange={(e) => {
// //                                     console.log('Department dropdown changed to:', e.target.value);
// //                                     setDepartmentId(e.target.value);
// //                                 }}
// //                                 required
// //                             >
// //                                 <option value="">Select a department</option>
// //                                 {departments.map((department) => (
// //                                     <option key={department.departmentId} value={department.departmentId}>
// //                                         {department.departmentName}
// //                                     </option>
// //                                 ))}
// //                             </select>
// //                         </div>
                        
// //                         <div className="attendance-download__form-group">
// //                             <label htmlFor="batchNo" className="attendance-download__label">Batch Number:</label>
// //                             <select
// //                                 className="attendance-download__select"
// //                                 id="batchNo"
// //                                 value={batchNo}
// //                                 onChange={(e) => setBatchNo(e.target.value)}
// //                                 required
// //                                 disabled={!departmentId}
// //                             >
// //                                 <option value="">
// //                                     {!departmentId ? "Please select a department first" : "Select a batch number"}
// //                                 </option>
// //                                 {batches.map((batch) => (
// //                                     <option key={batch} value={batch}>
// //                                         {batch}
// //                                     </option>
// //                                 ))}
// //                             </select>
// //                         </div>
                        
// //                         <div className="attendance-download__button-group">
// //                             <button 
// //                                 type="button" 
// //                                 className="attendance-download__btn"
// //                                 disabled={loadingButton !== '' || !batchNo || !departmentId}
// //                                 onClick={() => handleDownload('absentee')}
// //                             >
// //                                 {loadingButton === 'absentee' ? 'Generating...' : 'Download Absentee Report'}
// //                             </button>
// //                             <button 
// //                                 type="button" 
// //                                 className="attendance-download__btn"
// //                                 disabled={loadingButton !== '' || !batchNo || !departmentId}
// //                                 onClick={() => handleDownload('attendance')}
// //                             >
// //                                 {loadingButton === 'attendance' ? 'Generating...' : 'Download Attendance Report'}
// //                             </button>
                           
// //                             <button 
// //                                 type="button" 
// //                                 className="attendance-download__btn"
// //                                 disabled={loadingButton !== '' || !batchNo || !departmentId}
// //                                 onClick={() => handleDownload('answer-sheet')}
// //                             >
// //                                 {loadingButton === 'answer-sheet' ? 'Generating...' : 'Download Student Answersheet'}
// //                             </button>
// //                             <button 
// //                                 type="button" 
// //                                 className="attendance-download__btn"
// //                                 disabled={loadingButton !== '' || !batchNo || !departmentId}
// //                                 onClick={() => handleDownload('blank-answer-sheet')}
// //                             >
// //                                 {loadingButton === 'blank-answer-sheet' ? 'Generating...' : 'Download Blank Answersheet'}
// //                             </button>
// //                             <button 
// //                                 type="button" 
// //                                 className="attendance-download__btn"
// //                                 disabled={loadingButton !== '' || !batchNo || !departmentId}
// //                                 onClick={() => handleDownload('seating-arrangement')}
// //                             >
// //                                 {loadingButton === 'seating-arrangement' ? 'Generating...' : 'Download Seating Arrangement'}
// //                             </button>
// //                             <button 
// //                                 type="button" 
// //                                 className="attendance-download__btn"
// //                                 disabled={loadingButton !== '' || !batchNo || !departmentId}
// //                                 onClick={() => handleDownload('studnetId-password')}
// //                             >
// //                                 {loadingButton === 'studnetId-password' ? 'Generating...' : 'Download Student Id and Password(PDF)'}
// //                             </button>
// //                             <button 
// //                                 type="button" 
// //                                 className="attendance-download__btn"
// //                                 disabled={loadingButton !== '' || !batchNo || !departmentId}
// //                                 onClick={handleExcelDownload}
// //                             >
// //                                 {loadingButton === 'excel' ? 'Generating...' : 'Download Student Id and Password(Excel)'}
// //                             </button>
// //                         </div>
// //                     </form>
// //                     {error && <div className="attendance-download__alert">{error}</div>}
// //                 </div>
// //                 {isControllerPasswordVisible && (
// //                     <div className="attendance-download__controller-password">
// //                         Controller Password for this Batch is: {controller}
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default AttendanceDownload;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Grid,
//   Alert,
//   Paper,
//   Chip,
//   Container,
//   CircularProgress,
//   Divider,
//   Fade,
//   Zoom,
//   useTheme,
//   alpha,
//   Stack
// } from '@mui/material';
// import {
//   Download as DownloadIcon,
//   People as PeopleIcon,
//   Assignment as AssignmentIcon,
//   EventSeat as EventSeatIcon,
//   Description as DescriptionIcon,
//   TableChart as TableChartIcon,
//   Password as PasswordIcon,
//   School as SchoolIcon,
//   Security as SecurityIcon,
//   FileDownload as FileDownloadIcon,
//   CheckCircle as CheckCircleIcon
// } from '@mui/icons-material';
// import NavBar from '../navBar/navBar';

// const AttendanceDownload = () => {
//     const theme = useTheme();
//     const [departmentId, setDepartmentId] = useState('');
//     const [batchNo, setBatchNo] = useState('');
//     const [loadingButton, setLoadingButton] = useState('');
//     const [error, setError] = useState('');
//     const [departments, setDepartments] = useState([]);
//     const [batches, setBatches] = useState([]);
//     const [controller, setController] = useState('');
//     const [isControllerPasswordVisible, setIsControllerPasswordVisible] = useState(false);
//     const [center, setCenter] = useState();

//     useEffect(() => {
//         fetchDepartments();
//         setCenter(localStorage.getItem('center'));
//     }, []);

//     useEffect(() => {
//         console.log('Department useEffect triggered, departmentId:', departmentId);
//         if (departmentId) {
//             console.log('Department selected, calling fetchBatches');
//             fetchBatches();
//             setBatchNo(''); // Reset batch selection when department changes
//             setIsControllerPasswordVisible(false);
//         } else {
//             console.log('No department selected, clearing batches');
//             setBatches([]);
//             setBatchNo('');
//             setIsControllerPasswordVisible(false);
//         }
//     }, [departmentId]);

//     useEffect(() => {
//         if (batchNo && departmentId) {
//             fetchController();
//         } else {
//             setIsControllerPasswordVisible(false);
//         }
//     }, [batchNo, departmentId]);

//     const fetchDepartments = async () => {
//         console.log('fetchDepartments called');
//         try {
//             console.log('Making request to:', 'http://localhost:3000/get-active-departments');
//             const response = await axios.get('http://localhost:3000/get-active-departments');
//             console.log('Departments response received:', response.data);
//             setDepartments(response.data);
//         } catch (error) {
//             console.error("Error fetching departments:", error);
//             console.error("Error response:", error.response);
//             setError("Failed to fetch departments. Please try again later.");
//         }
//     };

//     const fetchController = async () => {
//         try {
//             const response = await axios.post('http://localhost:3000/get-batch-controller-password', {
//                 batchNo,
//                 departmentId
//             });
//             if (response.data && response.data.results.length > 0) {
//                 setController(response.data.results[0].controller_pass);
//                 setIsControllerPasswordVisible(true);
//             } else {
//                 setIsControllerPasswordVisible(false);
//             }
//         } catch (error) {
//             console.log(error);
//             setIsControllerPasswordVisible(false);
//         }
//     };

//     const fetchBatches = async () => {
//         console.log('fetchBatches function called with departmentId:', departmentId);
//         try {
//             console.log('Making POST request to get batches...');
//             const response = await axios.post('http://localhost:3000/track-students-on-exam-center-code', {
//                 departmentId
//             });
//             console.log('Batches response:', response.data);
            
//             // Fix: Since response.data is already an array of batch numbers, use it directly
//             const distinctBatches = [...new Set(response.data)].sort((a, b) => a - b);
//             setBatches(distinctBatches);
//             console.log('Processed batches:', distinctBatches);
//         } catch (error) {
//             console.error("Error fetching batches:", error);
//             console.error("Error details:", error.response?.data);
//             setError("No batches available.");
//             setBatches([]);
//         }
//     };

//     const handleDownload = async (reportType) => {
//         setLoadingButton(reportType);
//         setError('');

//         try {
//             const response = await axios({
//                 url: `http://localhost:3000/center/${reportType}-pdf-download`,
//                 method: 'POST',
//                 data: { batchNo, departmentId },
//                 responseType: 'blob',
//             });

//             const contentType = response.headers['content-type'];
//             if (contentType === 'application/pdf') {
//                 const file = new Blob([response.data], { type: 'application/pdf' });
//                 const fileURL = URL.createObjectURL(file);
//                 const link = document.createElement('a');
//                 link.href = fileURL;
//                 link.setAttribute('download', `${reportType}_report_batch_${batchNo}_center_${localStorage.getItem('center')}.pdf`);
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
//                 URL.revokeObjectURL(fileURL);
//             } else {
//                 const reader = new FileReader();
//                 reader.onload = function() {
//                     setError("Download is not available at this time.");
//                 };
//                 reader.readAsText(response.data);
//             }
//         } catch (err) {
//             console.error(`Error downloading the ${reportType} PDF:`, err);
//             setError("Download is not available at this time.");
//         } finally {
//             setLoadingButton('');
//         }
//     };

//     const handleExcelDownload = async () => {
//         setLoadingButton('excel');
//         setError('');

//         try {
//             const response = await axios({
//                 url: 'http://localhost:3000/center/studentId-password',
//                 method: 'POST',
//                 data: { batchNo, departmentId },
//                 responseType: 'blob',
//                 headers: {
//                     'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//                 }
//             });

//             const contentType = response.headers['content-type'];
//             if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//                 const file = new Blob([response.data], { type: contentType });
//                 const fileURL = URL.createObjectURL(file);
//                 const link = document.createElement('a');
//                 link.href = fileURL;
//                 link.setAttribute('download', `studentId_password_batch_${batchNo}.xlsx`);
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
//                 URL.revokeObjectURL(fileURL);
//             } else {
//                 const reader = new FileReader();
//                 reader.onload = function() {
//                     setError("Excel download is not available at this time.");
//                 };
//                 reader.readAsText(response.data);
//             }
//         } catch (err) {
//             console.error('Error downloading the Excel file:', err);
//             setError("Excel download is not available at this time.");
//         } finally {
//             setLoadingButton('');
//         }
//     };

//     const downloadButtons = [
//         {
//             id: 'absentee',
//             label: 'Absentee Report',
//             icon: <PeopleIcon />,
//             color: 'error',
//             handler: () => handleDownload('absentee')
//         },
//         {
//             id: 'attendance',
//             label: 'Attendance Report',
//             icon: <CheckCircleIcon />,
//             color: 'success',
//             handler: () => handleDownload('attendance')
//         },
//         {
//             id: 'answer-sheet',
//             label: 'Student Answersheet',
//             icon: <AssignmentIcon />,
//             color: 'info',
//             handler: () => handleDownload('answer-sheet')
//         },
//         {
//             id: 'blank-answer-sheet',
//             label: 'Blank Answersheet',
//             icon: <DescriptionIcon />,
//             color: 'secondary',
//             handler: () => handleDownload('blank-answer-sheet')
//         },
//         {
//             id: 'seating-arrangement',
//             label: 'Seating Arrangement',
//             icon: <EventSeatIcon />,
//             color: 'warning',
//             handler: () => handleDownload('seating-arrangement')
//         },
//         {
//             id: 'studnetId-password',
//             label: 'Student ID & Password (PDF)',
//             icon: <PasswordIcon />,
//             color: 'primary',
//             handler: () => handleDownload('studnetId-password')
//         },
//         {
//             id: 'excel',
//             label: 'Student ID & Password (Excel)',
//             icon: <TableChartIcon />,
//             color: 'success',
//             handler: handleExcelDownload
//         }
//     ];

//     const isFormValid = batchNo && departmentId;

//     return (
//         <Box>
//             <NavBar />
//             <Container maxWidth="lg" sx={{ py: 4 }}>
//                 <Fade in timeout={800}>
//                     <Paper 
//                         elevation={0} 
//                         sx={{ 
//                             background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
//                             borderRadius: 4,
//                             overflow: 'hidden'
//                         }}
//                     >
//                         {/* Header Section */}
//                         <Box 
//                             sx={{ 
//                                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                                 color: 'white',
//                                 py: 4,
//                                 px: 3,
//                                 textAlign: 'center'
//                             }}
//                         >
//                             <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
//                                 <FileDownloadIcon sx={{ fontSize: '2rem', mr: 2, verticalAlign: 'middle' }} />
//                                 Download Reports
//                             </Typography>
//                             <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                                 Generate and download examination reports for your center
//                             </Typography>
//                             {center && (
//                                 <Chip 
//                                     label={`Center: ${center}`} 
//                                     sx={{ 
//                                         mt: 2, 
//                                         bgcolor: alpha(theme.palette.common.white, 0.2),
//                                         color: 'white',
//                                         fontWeight: 'bold'
//                                     }} 
//                                 />
//                             )}
//                         </Box>

//                         <CardContent sx={{ p: 4 }}>
//                             {/* Selection Form */}
//                             <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
//                                 <CardContent sx={{ p: 3 }}>
//                                     <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                                         <SchoolIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
//                                         Select Department & Batch
//                                     </Typography>
                                    
//                                     <Grid container spacing={3} alignItems="center">
//                                         <Grid item xs={12} md={5}>
//                                             <FormControl fullWidth variant="outlined">
//                                                 <InputLabel id="department-label">Department</InputLabel>
//                                                 <Select
//                                                     labelId="department-label"
//                                                     value={departmentId}
//                                                     onChange={(e) => {
//                                                         console.log('Department dropdown changed to:', e.target.value);
//                                                         setDepartmentId(e.target.value);
//                                                     }}
//                                                     label="Department"
//                                                     sx={{ 
//                                                         '& .MuiOutlinedInput-root': {
//                                                             borderRadius: 2
//                                                         }
//                                                     }}
//                                                 >
//                                                     <MenuItem value="">
//                                                         <em>Select a department</em>
//                                                     </MenuItem>
//                                                     {departments.map((department) => (
//                                                         <MenuItem key={department.departmentId} value={department.departmentId}>
//                                                             {department.departmentName}
//                                                         </MenuItem>
//                                                     ))}
//                                                 </Select>
//                                             </FormControl>
//                                         </Grid>

//                                         <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
//                                             <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
//                                             <Divider sx={{ width: '100%', display: { xs: 'block', md: 'none' } }} />
//                                         </Grid>

//                                         <Grid item xs={12} md={5}>
//                                             <FormControl fullWidth variant="outlined">
//                                                 <InputLabel id="batch-label">Batch Number</InputLabel>
//                                                 <Select
//                                                     labelId="batch-label"
//                                                     value={batchNo}
//                                                     onChange={(e) => setBatchNo(e.target.value)}
//                                                     label="Batch Number"
//                                                     disabled={!departmentId}
//                                                     sx={{ 
//                                                         '& .MuiOutlinedInput-root': {
//                                                             borderRadius: 2
//                                                         }
//                                                     }}
//                                                 >
//                                                     <MenuItem value="">
//                                                         <em>{!departmentId ? "Please select a department first" : "Select a batch number"}</em>
//                                                     </MenuItem>
//                                                     {batches.map((batch) => (
//                                                         <MenuItem key={batch} value={batch}>
//                                                             Batch {batch}
//                                                         </MenuItem>
//                                                     ))}
//                                                 </Select>
//                                             </FormControl>
//                                         </Grid>
//                                     </Grid>

//                                     {isFormValid && (
//                                         <Zoom in timeout={500}>
//                                             <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
//                                                 <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
//                                                     <CheckCircleIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
//                                                     Ready to generate reports for Department ID: {departmentId}, Batch: {batchNo}
//                                                 </Typography>
//                                             </Box>
//                                         </Zoom>
//                                     )}
//                                 </CardContent>
//                             </Card>

//                             {/* Download Buttons Grid */}
//                             <Card elevation={3} sx={{ borderRadius: 3 }}>
//                                 <CardContent sx={{ p: 3 }}>
//                                     <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                                         <DownloadIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
//                                         Available Reports
//                                     </Typography>
                                    
//                                     <Grid container spacing={2}>
//                                         {downloadButtons.map((button) => (
//                                             <Grid item xs={12} sm={6} md={4} key={button.id}>
//                                                 <Button
//                                                     fullWidth
//                                                     variant="contained"
//                                                     color={button.color}
//                                                     size="large"
//                                                     onClick={button.handler}
//                                                     disabled={loadingButton !== '' || !isFormValid}
//                                                     startIcon={
//                                                         loadingButton === button.id ? 
//                                                         <CircularProgress size={20} color="inherit" /> : 
//                                                         button.icon
//                                                     }
//                                                     sx={{
//                                                         py: 2,
//                                                         borderRadius: 2,
//                                                         textTransform: 'none',
//                                                         fontSize: '0.95rem',
//                                                         fontWeight: 600,
//                                                         boxShadow: 2,
//                                                         '&:hover': {
//                                                             boxShadow: 4,
//                                                             transform: 'translateY(-2px)'
//                                                         },
//                                                         transition: 'all 0.2s ease-in-out'
//                                                     }}
//                                                 >
//                                                     {loadingButton === button.id ? 'Generating...' : button.label}
//                                                 </Button>
//                                             </Grid>
//                                         ))}
//                                     </Grid>
//                                 </CardContent>
//                             </Card>

//                             {/* Error Alert */}
//                             {error && (
//                                 <Fade in timeout={300}>
//                                     <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
//                                         {error}
//                                     </Alert>
//                                 </Fade>
//                             )}

//                             {/* Controller Password */}
//                             {isControllerPasswordVisible && (
//                                 <Zoom in timeout={500}>
//                                     <Card 
//                                         elevation={4}
//                                         sx={{ 
//                                             mt: 4,
//                                             borderRadius: 3,
//                                             border: `2px solid ${theme.palette.warning.main}`,
//                                             background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.1)} 100%)`
//                                         }}
//                                     >
//                                         <CardContent sx={{ p: 3, textAlign: 'center' }}>
//                                             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                                 <SecurityIcon sx={{ mr: 2, color: theme.palette.warning.main }} />
//                                                 Controller Password
//                                             </Typography>
//                                             <Chip 
//                                                 label={controller}
//                                                 size="large"
//                                                 sx={{
//                                                     fontSize: '1.2rem',
//                                                     fontWeight: 'bold',
//                                                     bgcolor: theme.palette.warning.main,
//                                                     color: 'white',
//                                                     px: 3,
//                                                     py: 1,
//                                                     letterSpacing: 2
//                                                 }}
//                                             />
//                                             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                                                 Please keep this password secure and share only with authorized personnel
//                                             </Typography>
//                                         </CardContent>
//                                     </Card>
//                                 </Zoom>
//                             )}
//                         </CardContent>
//                     </Paper>
//                 </Fade>
//             </Container>
//         </Box>
//     );
// };

// export default AttendanceDownload;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Button,
  Grid,
  Alert,
  Chip,
  Avatar,
  Divider,
  Paper,
  Fade,
  CircularProgress,
  useTheme,
  alpha,
  createTheme,
  ThemeProvider,
  ListItemIcon,
  ListItemText,
  InputAdornment
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  TableChart as TableChartIcon,
  EventSeat as SeatIcon,
  AccountBox as AccountBoxIcon,
  CloudDownload as CloudDownloadIcon,
  Password as PasswordIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon, // ← Changed from BatchIcon to GroupsIcon
  ArrowDropDown as ArrowDropDownIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

import NavBar from '../navBar/navBar';

// Same light theme as home component
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    }
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    }
  }
});

const EnhancedSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  disabled, 
  placeholder, 
  icon: Icon,
  color = 'primary'
}) => {
  const theme = useTheme();
  
  return (
    <FormControl 
      fullWidth 
      disabled={disabled}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          background: alpha(theme.palette[color].main, 0.02),
          minHeight: 56,
          fontSize: '1.1rem',
          border: `2px solid ${alpha(theme.palette[color].main, 0.15)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: alpha(theme.palette[color].main, 0.4),
            background: alpha(theme.palette[color].main, 0.04),
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.15)}`,
          },
          '&.Mui-focused': {
            borderColor: theme.palette[color].main,
            borderWidth: 2,
            background: alpha(theme.palette[color].main, 0.06),
            boxShadow: `0 6px 20px ${alpha(theme.palette[color].main, 0.25)}`,
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            background: alpha(theme.palette.grey[300], 0.1),
          },
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '14px 16px',
          }
        },
        '& .MuiInputLabel-root': {
          fontSize: '1.1rem',
          fontWeight: 500,
          color: theme.palette[color].main,
          '&.Mui-focused': {
            color: theme.palette[color].main,
            fontWeight: 600,
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
          }
        }
      }}
    >
      <InputLabel 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          '& .MuiSvgIcon-root': {
            fontSize: 20
          }
        }}
      >
        <Icon fontSize="small" />
        {label}
      </InputLabel>
      <Select
        value={value}
        label={label}
        onChange={onChange}
        IconComponent={ArrowDropDownIcon}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 3,
              mt: 1,
              boxShadow: `0 8px 32px ${alpha(theme.palette[color].main, 0.2)}`,
              border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
              '& .MuiMenuItem-root': {
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                minHeight: 48,
                fontSize: '1rem',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette[color].main, 0.08),
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette[color].main, 0.12),
                  color: theme.palette[color].main,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette[color].main, 0.16),
                  }
                }
              }
            }
          }
        }}
      >
        <MenuItem value="">
          <ListItemIcon>
            <Icon fontSize="small" sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText>
            <em>{placeholder}</em>
          </ListItemText>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon>
              {value === option.value ? (
                <CheckCircleIcon fontSize="small" sx={{ color: `${color}.main` }} />
              ) : (
                <Icon fontSize="small" sx={{ color: 'text.secondary' }} />
              )}
            </ListItemIcon>
            <ListItemText>
              {option.label}
            </ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const DownloadButton = ({ 
  title, 
  icon: Icon, 
  color, 
  loading, 
  disabled, 
  onClick,
  variant = 'contained' 
}) => {
  const theme = useTheme();
  
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} /> : <Icon />}
      sx={{
        minHeight: 48,
        px: 3,
        py: 1.5,
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        background: variant === 'contained' 
          ? `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`
          : 'transparent',
        border: variant === 'outlined' ? `2px solid ${alpha(theme.palette[color].main, 0.3)}` : 'none',
        color: variant === 'contained' ? 'white' : `${color}.main`,
        boxShadow: variant === 'contained' ? `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}` : 'none',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: variant === 'contained' 
            ? `0 8px 20px ${alpha(theme.palette[color].main, 0.4)}`
            : `0 4px 12px ${alpha(theme.palette[color].main, 0.2)}`,
          background: variant === 'contained' 
            ? `linear-gradient(135deg, ${theme.palette[color].light}, ${theme.palette[color].main})`
            : alpha(theme.palette[color].main, 0.04),
        },
        '&:disabled': {
          transform: 'none',
          opacity: 0.6,
        }
      }}
    >
      {loading ? 'Generating...' : title}
    </Button>
  );
};

const AttendanceDownload = () => {
  const theme = useTheme();
  const [departmentId, setDepartmentId] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [loadingButton, setLoadingButton] = useState('');
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [controller, setController] = useState('');
  const [isControllerPasswordVisible, setIsControllerPasswordVisible] = useState(false);
  const [center, setCenter] = useState();

  useEffect(() => {
    fetchDepartments();
    setCenter(localStorage.getItem('center'));
  }, []);

  useEffect(() => {
    console.log('Department useEffect triggered, departmentId:', departmentId);
    if (departmentId) {
      console.log('Department selected, calling fetchBatches');
      fetchBatches();
      setBatchNo('');
      setIsControllerPasswordVisible(false);
    } else {
      console.log('No department selected, clearing batches');
      setBatches([]);
      setBatchNo('');
      setIsControllerPasswordVisible(false);
    }
  }, [departmentId]);

  useEffect(() => {
    if (batchNo && departmentId) {
      fetchController();
    } else {
      setIsControllerPasswordVisible(false);
    }
  }, [batchNo, departmentId]);

  const fetchDepartments = async () => {
    console.log('fetchDepartments called');
    try {
      console.log('Making request to:', 'http://localhost:3000/get-active-departments');
      const response = await axios.get('http://localhost:3000/get-active-departments');
      console.log('Departments response received:', response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      console.error("Error response:", error.response);
      setError("Failed to fetch departments. Please try again later.");
    }
  };

  const fetchController = async () => {
    try {
      const response = await axios.post('http://localhost:3000/get-batch-controller-password', {
        batchNo,
        departmentId
      });
      if (response.data && response.data.results.length > 0) {
        setController(response.data.results[0].controller_pass);
        setIsControllerPasswordVisible(true);
      } else {
        setIsControllerPasswordVisible(false);
      }
    } catch (error) {
      console.log(error);
      setIsControllerPasswordVisible(false);
    }
  };

  const fetchBatches = async () => {
    console.log('fetchBatches function called with departmentId:', departmentId);
    try {
      console.log('Making POST request to get batches...');
      const response = await axios.post('http://localhost:3000/track-students-on-exam-center-code', {
        departmentId
      });
      console.log('Batches response:', response.data);
      
      const distinctBatches = [...new Set(response.data)].sort((a, b) => a - b);
      setBatches(distinctBatches);
      console.log('Processed batches:', distinctBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      console.error("Error details:", error.response?.data);
      setError("No batches available.");
      setBatches([]);
    }
  };

  const handleDownload = async (reportType) => {
    setLoadingButton(reportType);
    setError('');

    try {
      const response = await axios({
        url: `http://localhost:3000/center/${reportType}-pdf-download`,
        method: 'POST',
        data: { batchNo, departmentId },
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'];
      if (contentType === 'application/pdf') {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `${reportType}_report_batch_${batchNo}_center_${localStorage.getItem('center')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL);
      } else {
        const reader = new FileReader();
        reader.onload = function() {
          setError("Download is not available at this time.");
        };
        reader.readAsText(response.data);
      }
    } catch (err) {
      console.error(`Error downloading the ${reportType} PDF:`, err);
      setError("Download is not available at this time.");
    } finally {
      setLoadingButton('');
    }
  };

  const handleExcelDownload = async () => {
    setLoadingButton('excel');
    setError('');

    try {
      const response = await axios({
        url: 'http://localhost:3000/center/studentId-password',
        method: 'POST',
        data: { batchNo, departmentId },
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      const contentType = response.headers['content-type'];
      if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const file = new Blob([response.data], { type: contentType });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `studentId_password_batch_${batchNo}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL);
      } else {
        const reader = new FileReader();
        reader.onload = function() {
          setError("Excel download is not available at this time.");
        };
        reader.readAsText(response.data);
      }
    } catch (err) {
      console.error('Error downloading the Excel file:', err);
      setError("Excel download is not available at this time.");
    } finally {
      setLoadingButton('');
    }
  };

  const downloadButtons = [
    { 
      key: 'absentee', 
      title: 'Download Absentee Report', 
      icon: AssignmentIcon, 
      color: 'warning',
      onClick: () => handleDownload('absentee')
    },
    { 
      key: 'attendance', 
      title: 'Download Attendance Report', 
      icon: SchoolIcon, 
      color: 'success',
      onClick: () => handleDownload('attendance')
    },
    { 
      key: 'answer-sheet', 
      title: 'Download Student Answersheet', 
      icon: DescriptionIcon, 
      color: 'info',
      onClick: () => handleDownload('answer-sheet')
    },
    { 
      key: 'blank-answer-sheet', 
      title: 'Download Blank Answersheet', 
      icon: DescriptionIcon, 
      color: 'primary',
      onClick: () => handleDownload('blank-answer-sheet')
    },
    { 
      key: 'seating-arrangement', 
      title: 'Download Seating Arrangement', 
      icon: SeatIcon, 
      color: 'secondary',
      onClick: () => handleDownload('seating-arrangement')
    },
    { 
      key: 'studnetId-password', 
      title: 'Download Student ID & Password (PDF)', 
      icon: AccountBoxIcon, 
      color: 'info',
      onClick: () => handleDownload('studnetId-password')
    },
    { 
      key: 'excel', 
      title: 'Download Student ID & Password (Excel)', 
      icon: TableChartIcon, 
      color: 'success',
      onClick: handleExcelDownload
    }
  ];

  // Prepare department options for enhanced select
  const departmentOptions = departments.map(dept => ({
    value: dept.departmentId,
    label: dept.departmentName
  }));

  // Prepare batch options for enhanced select
  const batchOptions = batches.map(batch => ({
    value: batch,
    label: `Batch ${batch}`
  }));

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ 
        flexGrow: 1, 
        backgroundColor: 'background.default', 
        minHeight: '100vh' 
      }}>
        <NavBar />
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={800}>
            <Box>
              {/* Header Section - Centered */}
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  mb: 4
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main',
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  Download Reports
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.secondary',
                    mb: 3,
                    textAlign: 'center'
                  }}
                >
                  Center: {center}
                </Typography>
                
        
              </Box>

              {/* Centered Selection Form */}
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 4 
                }}
              >
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  maxWidth: '800px',
                  width: '100%'
                }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`
                      }}>
                        <CloudDownloadIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        Report Configuration
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        Select department and batch to generate reports
                      </Typography>
                    }
                    sx={{ textAlign: 'center', pb: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={4} justifyContent="center">
                      <Grid item xs={12} md={6}>
                        <EnhancedSelect
                          label="Department"
                          value={departmentId}
                          onChange={(e) => {
                            console.log('Department dropdown changed to:', e.target.value);
                            setDepartmentId(e.target.value);
                          }}
                          options={departmentOptions}
                          placeholder="Choose a department"
                          icon={BusinessIcon}
                          color="primary"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <EnhancedSelect
                          label="Batch Number"
                          value={batchNo}
                          onChange={(e) => setBatchNo(e.target.value)}
                          options={batchOptions}
                          disabled={!departmentId}
                          placeholder={!departmentId ? "Select department first" : "Choose a batch number"}
                          icon={GroupsIcon} // ← Changed from BatchIcon to GroupsIcon
                          color="secondary"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>

              {/* Controller Password Display - Centered */}
              {isControllerPasswordVisible && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: 3,
                    border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    background: alpha(theme.palette.success.main, 0.04),
                    maxWidth: '400px',
                    width: '100%'
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: 'success.main',
                          width: 64,
                          height: 64,
                          mx: 'auto',
                          mb: 2,
                          border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`
                        }}
                      >
                        <PasswordIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Controller Password
                      </Typography>
                      <Chip 
                        label={controller} 
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.15),
                          color: 'success.main',
                          fontWeight: 600,
                          fontSize: '1.2rem',
                          px: 3,
                          py: 1.5,
                          height: 'auto'
                        }}
                      />
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Download Buttons Section */}
              <Paper sx={{ 
                p: 4, 
                borderRadius: 3, 
                boxShadow: 2,
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
              }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: 'text.primary'
                    }}
                  >
                    Available Reports
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      maxWidth: '500px', 
                      mx: 'auto',
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                    }}
                  >
                    Download various examination reports and documents
                  </Typography>
                </Box>
                
                <Grid container spacing={3} justifyContent={"center"}>
                  {downloadButtons.map((button, index) => (
                    <Grid item xs={12} sm={6} md={4} key={button.key}>
                      <DownloadButton
                        title={button.title}
                        icon={button.icon}
                        color={button.color}
                        loading={loadingButton === button.key}
                        disabled={loadingButton !== '' || !batchNo || !departmentId}
                        onClick={button.onClick}
                        variant="contained"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Error Display */}
              {error && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      maxWidth: '600px',
                      '& .MuiAlert-message': {
                        fontSize: '1rem'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AttendanceDownload;
