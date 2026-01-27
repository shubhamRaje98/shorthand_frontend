// // // src/components/super-admin/add-new/AddNewExamCenter.js
// // import React, { useState } from 'react';
// // import {
// //   Container, Row, Col, Card, Form, Button, Alert, Spinner,
// //   Tabs, Tab
// // } from 'react-bootstrap';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import './AddNewExamCenter.css';

// // const AddNewExamCenter = () => {
// //   const [manualFormData, setManualFormData] = useState({
// //     center: '',
// //     centerpass: '',
// //     center_name: '',
// //     center_address: '',
// //     pc_count: '',
// //     max_pc: '',
// //     attendanceroll: '',
// //     absenteereport: '',
// //     answersheet: '',
// //     blankanswersheet: ''
// //   });
  
// //   const [excelFile, setExcelFile] = useState(null);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [loading, setLoading] = useState(false);
// //   const [bulkLoading, setBulkLoading] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const [uploadResult, setUploadResult] = useState(null);

// //   const navigate = useNavigate();

// //   // Manual form handlers
// //   const handleManualChange = (e) => {
// //     const { name, value } = e.target;
// //     setManualFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleManualSubmit = async (e) => {
// //     e.preventDefault();
    
// //     // Basic validation
// //     if (!manualFormData.center || !manualFormData.center_name || !manualFormData.center_address || 
// //         !manualFormData.pc_count || !manualFormData.max_pc) {
// //       setMessage('Please fill all required fields');
// //       return;
// //     }

// //     setLoading(true);
// //     setMessage('');

// //     try {
// //       const response = await axios.post('http://checking.shorthandonlineexam.in/api/new-department/exam-centers', {
// //         ...manualFormData,
// //         pc_count: parseInt(manualFormData.pc_count),
// //         max_pc: parseInt(manualFormData.max_pc)
// //       });
      
// //       setMessage('Exam center created successfully!');
      
// //       // Reset form
// //       setManualFormData({
// //         center: '',
// //         centerpass: '',
// //         center_name: '',
// //         center_address: '',
// //         pc_count: '',
// //         max_pc: '',
// //         attendanceroll: '',
// //         absenteereport: '',
// //         answersheet: '',
// //         blankanswersheet: ''
// //       });

// //     } catch (err) {
// //       console.error('Error creating exam center:', err);
// //       setMessage(err.response?.data?.message || 'Error creating exam center');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Bulk upload handlers
// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       const allowedTypes = ['.xlsx', '.xls', '.csv'];
// //       const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
// //       if (!allowedTypes.includes(fileExtension)) {
// //         setMessage('Please select .xlsx, .xls, or .csv files only');
// //         return;
// //       }
      
// //       setExcelFile(file);
// //       setMessage('');
// //     }
// //   };

// //   const handleBulkUpload = async (e) => {
// //     e.preventDefault();
    
// //     if (!excelFile) {
// //         setMessage('Please select an Excel file to upload');
// //         return;
// //     }

// //     setBulkLoading(true);
// //     setMessage('');
// //     setUploadProgress(0);
// //     setUploadResult(null);

// //     const formData = new FormData();
// //     formData.append('excelFile', excelFile);

// //     try {
// //         console.log('Starting bulk upload...');
// //         const response = await axios.post(
// //             'http://checking.shorthandonlineexam.in/api/new-department/exam-centers-new/bulk-upload', 
// //             formData, 
// //             {
// //                 headers: {
// //                     'Content-Type': 'multipart/form-data',
// //                 },
// //                 timeout: 30000, // 30 second timeout
// //                 onUploadProgress: (progressEvent) => {
// //                     if (progressEvent.total) {
// //                         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
// //                         setUploadProgress(percentCompleted);
// //                     }
// //                 }
// //             }
// //         );

// //         console.log('Upload response:', response.data);
// //         setUploadResult(response.data);
        
// //         if (response.data.errors && response.data.errors.length > 0) {
// //             setMessage(`Upload completed with ${response.data.errors.length} errors. Please check the results below.`);
// //         } else {
// //             setMessage(`Successfully uploaded ${response.data.summary?.successful} exam centers!`);
// //         }
        
// //         setExcelFile(null);

// //     } catch (err) {
// //         console.error('Error during bulk upload:', err);
        
// //         let errorMessage = 'Error during bulk upload';
        
// //         if (err.response) {
// //             // Server responded with error status
// //             errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
// //             console.error('Server response:', err.response.data);
// //         } else if (err.request) {
// //             // Request was made but no response received
// //             errorMessage = 'No response from server. Please check your connection.';
// //         } else {
// //             // Something else happened
// //             errorMessage = err.message;
// //         }
        
// //         setMessage(errorMessage);
// //     } finally {
// //         setBulkLoading(false);
// //         setUploadProgress(0);
// //     }
// // };

// //   const handleDownloadTemplate = async () => {
// //     try {
// //       const response = await axios.get('http://checking.shorthandonlineexam.in/api/new-department/exam-centers-new/download-template', {
// //         responseType: 'blob'
// //       });

// //       // Create blob link to download
// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement('a');
// //       link.href = url;
// //       link.setAttribute('download', 'exam_centers_template.xlsx');
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
// //       window.URL.revokeObjectURL(url);

// //     } catch (err) {
// //       console.error('Error downloading template:', err);
// //       setMessage('Error downloading template');
// //     }
// //   };

// //   return (
// //     <Container className="add-new-exam-center">
// //       <Row className="justify-content-center">
// //         <Col lg={10}>
// //           <div className="page-header">
// //             <h1>Add Exam Center</h1>
// //             <p>Create single exam center manually or upload multiple centers via Excel</p>
// //           </div>

// //           {message && (
// //             <Alert variant={message.includes('successfully') || message.includes('completed') ? 'success' : 'danger'}>
// //               {message}
// //             </Alert>
// //           )}

// //           <Card className="main-card">
// //             <Card.Body>
// //               <Tabs defaultActiveKey="manual" className="custom-tabs">
// //                 {/* Manual Form Tab */}
// //                 <Tab eventKey="manual" title="Manual Entry">
// //                   <Form onSubmit={handleManualSubmit}>
// //                     <Row className="g-3">
// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>Center ID *</Form.Label>
// //                           <Form.Control
// //                             type="number"
// //                             name="center"
// //                             value={manualFormData.center}
// //                             onChange={handleManualChange}
// //                             placeholder="Unique center ID"
// //                             required
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>Center Password</Form.Label>
// //                           <Form.Control
// //                             type="text"
// //                             name="centerpass"
// //                             value={manualFormData.centerpass}
// //                             onChange={handleManualChange}
// //                             placeholder="Center access password"
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col xs={12}>
// //                         <Form.Group>
// //                           <Form.Label>Center Name *</Form.Label>
// //                           <Form.Control
// //                             type="text"
// //                             name="center_name"
// //                             value={manualFormData.center_name}
// //                             onChange={handleManualChange}
// //                             placeholder="e.g., Mumbai Main Center"
// //                             required
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col xs={12}>
// //                         <Form.Group>
// //                           <Form.Label>Center Address *</Form.Label>
// //                           <Form.Control
// //                             as="textarea"
// //                             rows={3}
// //                             name="center_address"
// //                             value={manualFormData.center_address}
// //                             onChange={handleManualChange}
// //                             placeholder="Full address of the exam center"
// //                             required
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>PC Count *</Form.Label>
// //                           <Form.Control
// //                             type="number"
// //                             name="pc_count"
// //                             value={manualFormData.pc_count}
// //                             onChange={handleManualChange}
// //                             placeholder="Number of available PCs"
// //                             required
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>Max PC Capacity *</Form.Label>
// //                           <Form.Control
// //                             type="number"
// //                             name="max_pc"
// //                             value={manualFormData.max_pc}
// //                             onChange={handleManualChange}
// //                             placeholder="Maximum PC capacity"
// //                             required
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       {/* Optional Fields */}
// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>Attendance Roll</Form.Label>
// //                           <Form.Control
// //                             type="text"
// //                             name="attendanceroll"
// //                             value={manualFormData.attendanceroll}
// //                             onChange={handleManualChange}
// //                             placeholder="Attendance roll data"
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>Absentee Report</Form.Label>
// //                           <Form.Control
// //                             type="text"
// //                             name="absenteereport"
// //                             value={manualFormData.absenteereport}
// //                             onChange={handleManualChange}
// //                             placeholder="Absentee report data"
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>Answer Sheet</Form.Label>
// //                           <Form.Control
// //                             type="text"
// //                             name="answersheet"
// //                             value={manualFormData.answersheet}
// //                             onChange={handleManualChange}
// //                             placeholder="Answer sheet data"
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col md={6}>
// //                         <Form.Group>
// //                           <Form.Label>Blank Answer Sheet</Form.Label>
// //                           <Form.Control
// //                             type="text"
// //                             name="blankanswersheet"
// //                             value={manualFormData.blankanswersheet}
// //                             onChange={handleManualChange}
// //                             placeholder="Blank answer sheet data"
// //                           />
// //                         </Form.Group>
// //                       </Col>

// //                       <Col xs={12} className="mt-4">
// //                         <div className="form-actions">
// //                           <Button 
// //                             variant="secondary" 
// //                             onClick={() => navigate('/super-admin/dashboard')}
// //                           >
// //                             Back to Dashboard
// //                           </Button>
                          
// //                           <Button 
// //                             variant="primary" 
// //                             type="submit" 
// //                             disabled={loading}
// //                           >
// //                             {loading ? (
// //                               <>
// //                                 <Spinner as="span" animation="border" size="sm" className="me-2" />
// //                                 Creating...
// //                               </>
// //                             ) : (
// //                               'Create Exam Center'
// //                             )}
// //                           </Button>
// //                         </div>
// //                       </Col>
// //                     </Row>
// //                   </Form>
// //                 </Tab>

// //                 {/* Bulk Upload Tab */}
// //                 <Tab eventKey="bulk" title="Bulk Upload">
// //                   <div className="bulk-upload-section">
// //                     <div className="template-section">
// //                       <h5>Download Template</h5>
// //                       <p>Download our Excel template to ensure proper formatting</p>
// //                       <Button variant="outline-primary" onClick={handleDownloadTemplate}>
// //                         Download Excel Template
// //                       </Button>
// //                     </div>

// //                     <div className="upload-section">
// //                       <h5>Upload Excel File</h5>
// //                       <Form onSubmit={handleBulkUpload}>
// //                         <Form.Group>
// //                           <Form.Label>Select Excel File (.xlsx, .xls, .csv)</Form.Label>
// //                           <Form.Control
// //                             type="file"
// //                             accept=".xlsx,.xls,.csv"
// //                             onChange={handleFileChange}
// //                           />
// //                           <Form.Text className="text-muted">
// //                             Maximum file size: 10MB. Supported formats: .xlsx, .xls, .csv
// //                           </Form.Text>
// //                         </Form.Group>

// //                         {excelFile && (
// //                           <div className="file-info">
// //                             <strong>Selected file:</strong> {excelFile.name}
// //                           </div>
// //                         )}

// //                         {uploadProgress > 0 && uploadProgress < 100 && (
// //                           <div className="progress-section">
// //                             <div className="progress">
// //                               <div 
// //                                 className="progress-bar" 
// //                                 style={{ width: `${uploadProgress}%` }}
// //                               >
// //                                 {uploadProgress}%
// //                               </div>
// //                             </div>
// //                           </div>
// //                         )}

// //                         <div className="upload-actions">
// //                           <Button 
// //                             variant="success" 
// //                             type="submit" 
// //                             disabled={!excelFile || bulkLoading}
// //                           >
// //                             {bulkLoading ? (
// //                               <>
// //                                 <Spinner as="span" animation="border" size="sm" className="me-2" />
// //                                 Uploading...
// //                               </>
// //                             ) : (
// //                               'Upload Excel File'
// //                             )}
// //                           </Button>
// //                         </div>
// //                       </Form>
// //                     </div>

// //                     {/* Upload Results */}
// //                     {uploadResult && (
// //                       <div className="upload-results">
// //                         <h6>Upload Summary</h6>
// //                         <div className="result-stats">
// //                           <span className="stat-success">Successful: {uploadResult.summary?.successful}</span>
// //                           <span className="stat-failed">Failed: {uploadResult.summary?.failed}</span>
// //                           <span className="stat-total">Total: {uploadResult.summary?.totalProcessed}</span>
// //                         </div>

// //                         {uploadResult.errors && uploadResult.errors.length > 0 && (
// //                           <div className="error-list">
// //                             <h6>Errors:</h6>
// //                             <ul>
// //                               {uploadResult.errors.map((error, index) => (
// //                                 <li key={index}>{error}</li>
// //                               ))}
// //                             </ul>
// //                           </div>
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </Tab>
// //               </Tabs>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default AddNewExamCenter;


// // src/components/super-admin/add-new/AddNewExamCenter.js
// import React, { useState } from 'react';
// import {
//   Container, Row, Col, Card, Form, Button, Alert, Spinner,
//   Tabs, Tab
// } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './AddNewExamCenter.css';

// const AddNewExamCenter = () => {
//   const [manualFormData, setManualFormData] = useState({
//     center: '',
//     centerpass: '',
//     center_name: '',
//     center_address: '',
//     pc_count: '',
//     max_pc: '',
//     attendanceroll: '',
//     absenteereport: '',
//     answersheet: '',
//     blankanswersheet: ''
//   });
  
//   const [excelFile, setExcelFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [bulkLoading, setBulkLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState(''); // Added to track message type
//   const [uploadResult, setUploadResult] = useState(null);

//   const navigate = useNavigate();

//   // Manual form handlers
//   const handleManualChange = (e) => {
//     const { name, value } = e.target;
//     setManualFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!manualFormData.center || !manualFormData.center_name || !manualFormData.center_address || 
//         !manualFormData.pc_count || !manualFormData.max_pc) {
//       setMessage('Please fill all required fields');
//       setMessageType('error'); // Set error type
//       return;
//     }

//     setLoading(true);
//     setMessage('');
//     setMessageType('');

//     try {
//       const response = await axios.post('http://checking.shorthandonlineexam.in/api/new-department/exam-centers', {
//         ...manualFormData,
//         pc_count: parseInt(manualFormData.pc_count),
//         max_pc: parseInt(manualFormData.max_pc)
//       });
      
//       setMessage('Exam center created successfully!');
//       setMessageType('success'); // Set success type
      
//       // Reset form
//       setManualFormData({
//         center: '',
//         centerpass: '',
//         center_name: '',
//         center_address: '',
//         pc_count: '',
//         max_pc: '',
//         attendanceroll: '',
//         absenteereport: '',
//         answersheet: '',
//         blankanswersheet: ''
//       });

//     } catch (err) {
//       console.error('Error creating exam center:', err);
//       setMessage(err.response?.data?.message || 'Error creating exam center');
//       setMessageType('error'); // Set error type
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Bulk upload handlers
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const allowedTypes = ['.xlsx', '.xls', '.csv'];
//       const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
//       if (!allowedTypes.includes(fileExtension)) {
//         setMessage('Please select .xlsx, .xls, or .csv files only');
//         setMessageType('error'); // Set error type
//         return;
//       }
      
//       setExcelFile(file);
//       setMessage('');
//       setMessageType('');
//     }
//   };

//   const handleBulkUpload = async (e) => {
//     e.preventDefault();
    
//     if (!excelFile) {
//         setMessage('Please select an Excel file to upload');
//         setMessageType('error'); // Set error type
//         return;
//     }

//     setBulkLoading(true);
//     setMessage('');
//     setMessageType('');
//     setUploadProgress(0);
//     setUploadResult(null);

//     const formData = new FormData();
//     formData.append('excelFile', excelFile);

//     try {
//         console.log('Starting bulk upload...');
//         const response = await axios.post(
//             'http://checking.shorthandonlineexam.in/api/new-department/exam-centers-new/bulk-upload', 
//             formData, 
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 timeout: 30000, // 30 second timeout
//                 onUploadProgress: (progressEvent) => {
//                     if (progressEvent.total) {
//                         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                         setUploadProgress(percentCompleted);
//                     }
//                 }
//             }
//         );

//         console.log('Upload response:', response.data);
//         setUploadResult(response.data);
        
//         if (response.data.errors && response.data.errors.length > 0) {
//             setMessage(`Upload completed with ${response.data.errors.length} errors. Please check the results below.`);
//             setMessageType('warning'); // Set warning type for partial success
//         } else {
//             setMessage(`Successfully uploaded ${response.data.summary?.successful} exam centers!`);
//             setMessageType('success'); // Set success type
//         }
        
//         setExcelFile(null);

//     } catch (err) {
//         console.error('Error during bulk upload:', err);
        
//         let errorMessage = 'Error during bulk upload';
        
//         if (err.response) {
//             // Server responded with error status
//             errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
//             console.error('Server response:', err.response.data);
//         } else if (err.request) {
//             // Request was made but no response received
//             errorMessage = 'No response from server. Please check your connection.';
//         } else {
//             // Something else happened
//             errorMessage = err.message;
//         }
        
//         setMessage(errorMessage);
//         setMessageType('error'); // Set error type
//     } finally {
//         setBulkLoading(false);
//         setUploadProgress(0);
//     }
// };

//   const handleDownloadTemplate = async () => {
//     try {
//       const response = await axios.get('http://checking.shorthandonlineexam.in/api/new-department/exam-centers-new/download-template', {
//         responseType: 'blob'
//       });

//       // Create blob link to download
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'exam_centers_template.xlsx');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       console.error('Error downloading template:', err);
//       setMessage('Error downloading template');
//       setMessageType('error'); // Set error type
//     }
//   };

//   // Function to determine alert variant based on message type
//   const getAlertVariant = () => {
//     switch (messageType) {
//       case 'success':
//         return 'success'; // Green
//       case 'error':
//         return 'danger'; // Red
//       case 'warning':
//         return 'warning'; // Yellow/Orange
//       default:
//         return 'info'; // Blue
//     }
//   };

//   return (
//     <Container className="add-new-exam-center">
//       <Row className="justify-content-center">
//         <Col lg={10}>
//           <div className="page-header">
//             <h1>Add Exam Center</h1>
//             <p>Create single exam center manually or upload multiple centers via Excel</p>
//           </div>

//           {message && (
//             <Alert variant={getAlertVariant()}>
//               {message}
//             </Alert>
//           )}

//           <Card className="main-card">
//             <Card.Body>
//               <Tabs defaultActiveKey="manual" className="custom-tabs">
//                 {/* Manual Form Tab */}
//                 <Tab eventKey="manual" title="Manual Entry">
//                   <Form onSubmit={handleManualSubmit}>
//                     <Row className="g-3">
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Center ID *</Form.Label>
//                           <Form.Control
//                             type="number"
//                             name="center"
//                             value={manualFormData.center}
//                             onChange={handleManualChange}
//                             placeholder="Unique center ID"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Center Password</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="centerpass"
//                             value={manualFormData.centerpass}
//                             onChange={handleManualChange}
//                             placeholder="Center access password"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col xs={12}>
//                         <Form.Group>
//                           <Form.Label>Center Name *</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="center_name"
//                             value={manualFormData.center_name}
//                             onChange={handleManualChange}
//                             placeholder="e.g., Mumbai Main Center"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col xs={12}>
//                         <Form.Group>
//                           <Form.Label>Center Address *</Form.Label>
//                           <Form.Control
//                             as="textarea"
//                             rows={3}
//                             name="center_address"
//                             value={manualFormData.center_address}
//                             onChange={handleManualChange}
//                             placeholder="Full address of the exam center"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>PC Count *</Form.Label>
//                           <Form.Control
//                             type="number"
//                             name="pc_count"
//                             value={manualFormData.pc_count}
//                             onChange={handleManualChange}
//                             placeholder="Number of available PCs"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Max PC Capacity *</Form.Label>
//                           <Form.Control
//                             type="number"
//                             name="max_pc"
//                             value={manualFormData.max_pc}
//                             onChange={handleManualChange}
//                             placeholder="Maximum PC capacity"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       {/* Optional Fields */}
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Attendance Roll</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="attendanceroll"
//                             value={manualFormData.attendanceroll}
//                             onChange={handleManualChange}
//                             placeholder="Attendance roll data"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Absentee Report</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="absenteereport"
//                             value={manualFormData.absenteereport}
//                             onChange={handleManualChange}
//                             placeholder="Absentee report data"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Answer Sheet</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="answersheet"
//                             value={manualFormData.answersheet}
//                             onChange={handleManualChange}
//                             placeholder="Answer sheet data"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Blank Answer Sheet</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="blankanswersheet"
//                             value={manualFormData.blankanswersheet}
//                             onChange={handleManualChange}
//                             placeholder="Blank answer sheet data"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col xs={12} className="mt-4">
//                         <div className="form-actions">
//                           <Button 
//                             variant="secondary" 
//                             onClick={() => navigate('/super-admin/dashboard')}
//                           >
//                             Back to Dashboard
//                           </Button>
                          
//                           <Button 
//                             variant="primary" 
//                             type="submit" 
//                             disabled={loading}
//                           >
//                             {loading ? (
//                               <>
//                                 <Spinner as="span" animation="border" size="sm" className="me-2" />
//                                 Creating...
//                               </>
//                             ) : (
//                               'Create Exam Center'
//                             )}
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Tab>

//                 {/* Bulk Upload Tab */}
//                 <Tab eventKey="bulk" title="Bulk Upload">
//                   <div className="bulk-upload-section">
//                     <div className="template-section">
//                       <h5>Download Template</h5>
//                       <p>Download our Excel template to ensure proper formatting</p>
//                       <Button variant="outline-primary" onClick={handleDownloadTemplate}>
//                         Download Excel Template
//                       </Button>
//                     </div>

//                     <div className="upload-section">
//                       <h5>Upload Excel File</h5>
//                       <Form onSubmit={handleBulkUpload}>
//                         <Form.Group>
//                           <Form.Label>Select Excel File (.xlsx, .xls, .csv)</Form.Label>
//                           <Form.Control
//                             type="file"
//                             accept=".xlsx,.xls,.csv"
//                             onChange={handleFileChange}
//                           />
//                           <Form.Text className="text-muted">
//                             Maximum file size: 10MB. Supported formats: .xlsx, .xls, .csv
//                           </Form.Text>
//                         </Form.Group>

//                         {excelFile && (
//                           <div className="file-info">
//                             <strong>Selected file:</strong> {excelFile.name}
//                           </div>
//                         )}

//                         {uploadProgress > 0 && uploadProgress < 100 && (
//                           <div className="progress-section">
//                             <div className="progress">
//                               <div 
//                                 className="progress-bar" 
//                                 style={{ width: `${uploadProgress}%` }}
//                               >
//                                 {uploadProgress}%
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         <div className="upload-actions">
//                           <Button 
//                             variant="success" 
//                             type="submit" 
//                             disabled={!excelFile || bulkLoading}
//                           >
//                             {bulkLoading ? (
//                               <>
//                                 <Spinner as="span" animation="border" size="sm" className="me-2" />
//                                 Uploading...
//                               </>
//                             ) : (
//                               'Upload Excel File'
//                             )}
//                           </Button>
//                         </div>
//                       </Form>
//                     </div>

//                     {/* Upload Results */}
//                     {uploadResult && (
//                       <div className="upload-results">
//                         <h6>Upload Summary</h6>
//                         <div className="result-stats">
//                           <span className="stat-success">Successful: {uploadResult.summary?.successful}</span>
//                           <span className="stat-failed">Failed: {uploadResult.summary?.failed}</span>
//                           <span className="stat-total">Total: {uploadResult.summary?.totalProcessed}</span>
//                         </div>

//                         {uploadResult.errors && uploadResult.errors.length > 0 && (
//                           <div className="error-list">
//                             <h6>Errors:</h6>
//                             <ul>
//                               {uploadResult.errors.map((error, index) => (
//                                 <li key={index}>{error}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </Tab>
//               </Tabs>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddNewExamCenter;



// src/components/super-admin/add-new/AddNewExamCenter.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner,
  Tabs, Tab, Table, Badge, Pagination
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddNewExamCenter.css';

const AddNewExamCenter = () => {
  const [manualFormData, setManualFormData] = useState({
    center: '',
    centerpass: '',
    center_name: '',
    center_address: '',
    pc_count: '',
    max_pc: '',
    attendanceroll: '',
    absenteereport: '',
    answersheet: '',
    blankanswersheet: ''
  });
  
  const [excelFile, setExcelFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  
  // States for displaying exam centers
  const [examCenters, setExamCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [centersError, setCentersError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [centersPerPage, setCentersPerPage] = useState(10); // Default to 10
  
  // Track newly added centers
  const [newlyAddedCenters, setNewlyAddedCenters] = useState(new Set());

  const navigate = useNavigate();

  // Fetch exam centers on component mount
  useEffect(() => {
    fetchExamCenters();
  }, []);

  // Reset to first page when centersPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [centersPerPage]);

  // Function to fetch all exam centers with proper error handling
  const fetchExamCenters = async () => {
    setCentersLoading(true);
    setCentersError('');
    
    try {
      console.log('Fetching exam centers...');
      const response = await axios.get('http://checking.shorthandonlineexam.in/api/new-department/exam-centers');
      console.log('API Response:', response.data);
      
      // Handle different response structures
      let centersData = [];
      
      if (Array.isArray(response.data)) {
        centersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        centersData = response.data.data;
      } else if (response.data && Array.isArray(response.data.centers)) {
        centersData = response.data.centers;
      } else if (response.data && response.data.examCenters && Array.isArray(response.data.examCenters)) {
        centersData = response.data.examCenters;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        centersData = [];
      }
      
      setExamCenters(centersData);
      console.log('Centers set to:', centersData);
      
    } catch (err) {
      console.error('Error fetching exam centers:', err);
      setCentersError('Failed to load exam centers. Please check if the API endpoint exists.');
      setExamCenters([]);
    } finally {
      setCentersLoading(false);
    }
  };

  // Function to refresh the centers list
  const refreshCenters = async () => {
    setRefreshing(true);
    await fetchExamCenters();
    setRefreshing(false);
  };

  // Manual form handlers
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!manualFormData.center || !manualFormData.center_name || !manualFormData.center_address || 
        !manualFormData.pc_count || !manualFormData.max_pc) {
      setMessage('Please fill all required fields');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.post('http://checking.shorthandonlineexam.in/api/new-department/exam-centers', {
        ...manualFormData,
        pc_count: parseInt(manualFormData.pc_count),
        max_pc: parseInt(manualFormData.max_pc)
      });
      
      setMessage('Exam center created successfully!');
      setMessageType('success');
      
      // Mark this center as newly added
      const centerId = response.data?.id || manualFormData.center;
      setNewlyAddedCenters(prev => new Set([...prev, centerId]));
      
      // Reset form
      setManualFormData({
        center: '',
        centerpass: '',
        center_name: '',
        center_address: '',
        pc_count: '',
        max_pc: '',
        attendanceroll: '',
        absenteereport: '',
        answersheet: '',
        blankanswersheet: ''
      });

      // Refresh the centers list to show the new center
      await fetchExamCenters();

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);

    } catch (err) {
      console.error('Error creating exam center:', err);
      setMessage(err.response?.data?.message || 'Error creating exam center');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Bulk upload handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        setMessage('Please select .xlsx, .xls, or .csv files only');
        setMessageType('error');
        return;
      }
      
      setExcelFile(file);
      setMessage('');
      setMessageType('');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    
    if (!excelFile) {
        setMessage('Please select an Excel file to upload');
        setMessageType('error');
        return;
    }

    setBulkLoading(true);
    setMessage('');
    setMessageType('');
    setUploadProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('excelFile', excelFile);

    try {
        console.log('Starting bulk upload...');
        const response = await axios.post(
            'http://checking.shorthandonlineexam.in/api/new-department/exam-centers-new/bulk-upload', 
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            }
        );

        console.log('Upload response:', response.data);
        setUploadResult(response.data);
        
        // Mark all successfully uploaded centers as new
        if (response.data.successfulCenters) {
          const newCenterIds = response.data.successfulCenters.map(center => center.id || center.center);
          setNewlyAddedCenters(prev => new Set([...prev, ...newCenterIds]));
        }
        
        if (response.data.errors && response.data.errors.length > 0) {
            setMessage(`Upload completed with ${response.data.errors.length} errors. Please check the results below.`);
            setMessageType('warning');
        } else {
            setMessage(`Successfully uploaded ${response.data.summary?.successful} exam centers!`);
            setMessageType('success');
        }
        
        setExcelFile(null);

        // Refresh the centers list to show newly added centers
        await fetchExamCenters();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 5000);

    } catch (err) {
        console.error('Error during bulk upload:', err);
        
        let errorMessage = 'Error during bulk upload';
        
        if (err.response) {
            errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
            console.error('Server response:', err.response.data);
        } else if (err.request) {
            errorMessage = 'No response from server. Please check your connection.';
        } else {
            errorMessage = err.message;
        }
        
        setMessage(errorMessage);
        setMessageType('error');
    } finally {
        setBulkLoading(false);
        setUploadProgress(0);
    }
};

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get('http://checking.shorthandonlineexam.in/api/new-department/exam-centers-new/download-template', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exam_centers_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error downloading template:', err);
      setMessage('Error downloading template');
      setMessageType('error');
    }
  };

  // Function to determine alert variant based on message type
  const getAlertVariant = () => {
    switch (messageType) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Safe array check for examCenters
  const safeExamCenters = Array.isArray(examCenters) ? examCenters : [];

  // Pagination logic
  const indexOfLastCenter = currentPage * centersPerPage;
  const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
  const currentCenters = safeExamCenters.slice(indexOfFirstCenter, indexOfLastCenter);
  const totalPages = Math.ceil(safeExamCenters.length / centersPerPage);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item 
          key={page} 
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  // Function to check if a center is newly added (within last 5 minutes)
  const isCenterNew = (center) => {
    const centerId = center.id || center.center;
    const isMarkedAsNew = newlyAddedCenters.has(centerId);
    
    // Also check if created within last 5 minutes
    const createdAt = center.created_at || center.createdAt;
    if (createdAt) {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInMinutes = (now - created) / (1000 * 60);
      return isMarkedAsNew || diffInMinutes < 5;
    }
    
    return isMarkedAsNew;
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setCentersPerPage(parseInt(e.target.value));
  };

  return (
    <Container fluid className="add-new-exam-center">
      <Row className="justify-content-center">
        <Col xs={12}>
          <div className="page-header">
            <h1>Add Exam Center</h1>
            <p>Create single exam center manually or upload multiple centers via Excel</p>
          </div>

          {message && (
            <div className="custom-alert-container">
              <Alert variant={getAlertVariant()} className="custom-alert">
                <div className="alert-content">
                  <strong>
                    {messageType === 'success' && '✅ Success! '}
                    {messageType === 'error' && '❌ Error! '}
                    {messageType === 'warning' && '⚠️ Warning! '}
                  </strong>
                  {message}
                </div>
              </Alert>
            </div>
          )}

          {/* Side by Side Layout */}
          <Row className="main-content-row">
            {/* Left Side - Forms */}
            <Col lg={6} className="form-column">
              <Card className="main-card">
                <Card.Body>
                  <Tabs defaultActiveKey="manual" className="custom-tabs">
                    {/* Manual Form Tab */}
                    <Tab eventKey="manual" title="Manual Entry">
                      <Form onSubmit={handleManualSubmit}>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Center ID *</Form.Label>
                              <Form.Control
                                type="number"
                                name="center"
                                value={manualFormData.center}
                                onChange={handleManualChange}
                                placeholder="Unique center ID"
                                required
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Center Password</Form.Label>
                              <Form.Control
                                type="text"
                                name="centerpass"
                                value={manualFormData.centerpass}
                                onChange={handleManualChange}
                                placeholder="Center access password"
                              />
                            </Form.Group>
                          </Col>

                          <Col xs={12}>
                            <Form.Group>
                              <Form.Label>Center Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="center_name"
                                value={manualFormData.center_name}
                                onChange={handleManualChange}
                                placeholder="e.g., Mumbai Main Center"
                                required
                              />
                            </Form.Group>
                          </Col>

                          <Col xs={12}>
                            <Form.Group>
                              <Form.Label>Center Address *</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="center_address"
                                value={manualFormData.center_address}
                                onChange={handleManualChange}
                                placeholder="Full address of the exam center"
                                required
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>PC Count *</Form.Label>
                              <Form.Control
                                type="number"
                                name="pc_count"
                                value={manualFormData.pc_count}
                                onChange={handleManualChange}
                                placeholder="Number of available PCs"
                                required
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Max PC Capacity *</Form.Label>
                              <Form.Control
                                type="number"
                                name="max_pc"
                                value={manualFormData.max_pc}
                                onChange={handleManualChange}
                                placeholder="Maximum PC capacity"
                                required
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Attendance Roll</Form.Label>
                              <Form.Control
                                type="text"
                                name="attendanceroll"
                                value={manualFormData.attendanceroll}
                                onChange={handleManualChange}
                                placeholder="Attendance roll data"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Absentee Report</Form.Label>
                              <Form.Control
                                type="text"
                                name="absenteereport"
                                value={manualFormData.absenteereport}
                                onChange={handleManualChange}
                                placeholder="Absentee report data"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Answer Sheet</Form.Label>
                              <Form.Control
                                type="text"
                                name="answersheet"
                                value={manualFormData.answersheet}
                                onChange={handleManualChange}
                                placeholder="Answer sheet data"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Blank Answer Sheet</Form.Label>
                              <Form.Control
                                type="text"
                                name="blankanswersheet"
                                value={manualFormData.blankanswersheet}
                                onChange={handleManualChange}
                                placeholder="Blank answer sheet data"
                              />
                            </Form.Group>
                          </Col>

                          <Col xs={12} className="mt-4">
                            <div className="form-actions">
                              <Button 
                                variant="secondary" 
                                onClick={() => navigate('/super-admin/dashboard')}
                              >
                                Back to Dashboard
                              </Button>
                              
                              <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Creating...
                                  </>
                                ) : (
                                  'Create Exam Center'
                                )}
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </Tab>

                    {/* Bulk Upload Tab */}
                    <Tab eventKey="bulk" title="Bulk Upload">
                      <div className="bulk-upload-section">
                        <div className="template-section">
                          <h5>Download Template</h5>
                          <p>Download our Excel template to ensure proper formatting</p>
                          <Button variant="outline-primary" onClick={handleDownloadTemplate}>
                            Download Excel Template
                          </Button>
                        </div>

                        <div className="upload-section">
                          <h5>Upload Excel File</h5>
                          <Form onSubmit={handleBulkUpload}>
                            <Form.Group>
                              <Form.Label>Select Excel File (.xlsx, .xls, .csv)</Form.Label>
                              <Form.Control
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                              />
                              <Form.Text className="text-muted">
                                Maximum file size: 10MB. Supported formats: .xlsx, .xls, .csv
                              </Form.Text>
                            </Form.Group>

                            {excelFile && (
                              <div className="file-info">
                                <strong>Selected file:</strong> {excelFile.name}
                              </div>
                            )}

                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <div className="progress-section">
                                <div className="progress">
                                  <div 
                                    className="progress-bar" 
                                    style={{ width: `${uploadProgress}%` }}
                                  >
                                    {uploadProgress}%
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="upload-actions">
                              <Button 
                                variant="success" 
                                type="submit" 
                                disabled={!excelFile || bulkLoading}
                              >
                                {bulkLoading ? (
                                  <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Uploading...
                                  </>
                                ) : (
                                  'Upload Excel File'
                                )}
                              </Button>
                            </div>
                          </Form>
                        </div>

                        {uploadResult && (
                          <div className="upload-results">
                            <h6>Upload Summary</h6>
                            <div className="result-stats">
                              <span className="stat-success">Successful: {uploadResult.summary?.successful || 0}</span>
                              <span className="stat-failed">Failed: {uploadResult.summary?.failed || 0}</span>
                              <span className="stat-total">Total: {uploadResult.summary?.totalProcessed || 0}</span>
                            </div>

                            {uploadResult.errors && Array.isArray(uploadResult.errors) && uploadResult.errors.length > 0 && (
                              <div className="error-list">
                                <h6>Errors:</h6>
                                <ul>
                                  {uploadResult.errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Side - Exam Centers Display */}
            <Col lg={6} className="centers-column">
              <Card className="centers-display-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Existing Exam Centers ({safeExamCenters.length})</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={refreshCenters}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Refreshing...
                      </>
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </Card.Header>
                <Card.Body className="centers-card-body">
                  {centersLoading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      <p className="mt-2 text-muted">Loading exam centers...</p>
                    </div>
                  ) : centersError ? (
                    <div className="text-center py-4">
                      <Alert variant="warning">
                        <h6>Unable to load exam centers</h6>
                        <p>{centersError}</p>
                        <Button variant="outline-warning" onClick={refreshCenters}>
                          Try Again
                        </Button>
                      </Alert>
                    </div>
                  ) : safeExamCenters.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <h6>No exam centers found</h6>
                      <p>Add your first exam center using the form on the left.</p>
                    </div>
                  ) : (
                    <>
                      {/* Rows per page selector */}
                      <div className="table-controls">
                        <div className="rows-per-page">
                          <Form.Label className="me-2 mb-0">Show:</Form.Label>
                          <Form.Select 
                            size="sm" 
                            value={centersPerPage} 
                            onChange={handleRowsPerPageChange}
                            style={{ width: 'auto', display: 'inline-block' }}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </Form.Select>
                          <span className="ms-2 text-muted small">entries per page</span>
                        </div>
                      </div>

                      <div className="table-responsive">
                        <Table striped bordered hover className="centers-table">
                          <thead className="table-dark">
                            <tr>
                              <th>Center ID</th>
                              <th>Center Name</th>
                              <th>PC Count</th>
                              <th>Max Capacity</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentCenters.map((center, index) => (
                              <tr key={center.id || center.center || index}>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <Badge bg="primary">{center.center || 'N/A'}</Badge>
                                    {isCenterNew(center) && (
                                      <Badge bg="danger" className="new-badge blink">
                                        <i className="fas fa-star me-1"></i>NEW
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="center-name-cell">
                                    <strong>{center.center_name || 'Unnamed Center'}</strong>
                                    <small className="text-muted d-block">
                                      {center.center_address && center.center_address.length > 40 
                                        ? `${center.center_address.substring(0, 40)}...` 
                                        : center.center_address || 'No address'}
                                    </small>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <Badge bg="info">{center.pc_count || 0}</Badge>
                                </td>
                                <td className="text-center">
                                  <Badge bg="success">{center.max_pc || 0}</Badge>
                                </td>
                                <td className="text-center">
                                  <Badge 
                                    bg={center.pc_count === center.max_pc ? 'warning' : 'success'}
                                  >
                                    {center.pc_count === center.max_pc ? 'Full' : 'Available'}
                                  </Badge>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {formatDate(center.created_at || center.createdAt)}
                                  </small>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="pagination-container">
                          <Pagination className="custom-pagination">
                            <Pagination.Prev 
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage(currentPage - 1)}
                            />
                            {renderPaginationItems()}
                            <Pagination.Next 
                              disabled={currentPage === totalPages}
                              onClick={() => setCurrentPage(currentPage + 1)}
                            />
                          </Pagination>
                          
                          <div className="pagination-info">
                            <small className="text-muted">
                              Showing {indexOfFirstCenter + 1} to {Math.min(indexOfLastCenter, safeExamCenters.length)} of {safeExamCenters.length} centers
                            </small>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <div className="centers-summary">
                        <small className="text-muted">
                          <strong>Summary:</strong> {safeExamCenters.length} Centers | 
                          Total Capacity: <strong>{safeExamCenters.reduce((sum, center) => sum + (center.max_pc || 0), 0)}</strong> | 
                          Available PCs: <strong>{safeExamCenters.reduce((sum, center) => sum + (center.pc_count || 0), 0)}</strong>
                        </small>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AddNewExamCenter;
