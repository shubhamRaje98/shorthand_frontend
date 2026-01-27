// // src/components/super-admin/GenerateSkillTestHallTicketsFromDB.js
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { 
//   Button, 
//   Card, 
//   Container, 
//   Row, 
//   Col, 
//   Form, 
//   Spinner,
//   Alert,
//   ListGroup,
//   ProgressBar,
//   Modal,
//   Badge,
//   Collapse,
//   Table
// } from 'react-bootstrap';
// import { 
//   FaFilePdf, 
//   FaFileArchive, 
//   FaDownload, 
//   FaFilter, 
//   FaSearch, 
//   FaDatabase,
//   FaEye,
//   FaInfoCircle,
//   FaArrowLeft,
//   FaTrash,
//   FaChevronDown,
//   FaChevronUp,
//   FaExclamationTriangle,
//   FaTimes,
//   FaCheckCircle
// } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';

// function GenerateSkillTestHallTicketsFromDB() {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [selectedCenter, setSelectedCenter] = useState('all');
//   const [selectedBatch, setSelectedBatch] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [progress, setProgress] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [previewStudent, setPreviewStudent] = useState(null);
//   const [totalStudents, setTotalStudents] = useState(0);
//   const [customization, setCustomization] = useState(null);
//   const [showFieldInfo, setShowFieldInfo] = useState(false);
  
//   // ✅ NEW: Validation states (EXACT same as Excel component)
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [showValidationModal, setShowValidationModal] = useState(false);
//   const [validationSummary, setValidationSummary] = useState(null);

//   const queryParams = new URLSearchParams(location.search);
//   const departmentId = queryParams.get('departmentId');
//   const qrType = queryParams.get('qrType') || 'both';
  
//   // ✅ Required fields for database validation
//   const requiredFields = {
//     'student_id': 'Student ID',
//     'fullname': 'Full Name',
//     'center_name': 'Center Name',
//     'batchNo': 'Batch Number',
//     'batchdate': 'Batch Date',
//     'reporting_time': 'Reporting Time',
//     'start_time': 'Start Time',
//     'center_address': 'Center Address',
//     'subject_name': 'Subject Name'
//   };
  
//   useEffect(() => {
//     const storedCustomization = JSON.parse(sessionStorage.getItem('hallticket_customization')) || null;
//     setCustomization(storedCustomization);
    
//     console.log('🔍 Component loaded with:');
//     console.log('Department ID:', departmentId);
//     console.log('QR Type:', qrType);
//     console.log('Customization from sessionStorage:', storedCustomization);
//   }, []);

//   useEffect(() => {
//     if (departmentId) {
//       loadCenters();
//       loadBatches();
//       loadStudents();
//     } else {
//       setError('Department ID is required. Please select a department first.');
//     }
//   }, [departmentId]);

//   const loadCenters = async () => {
//     try {
//       const response = await axios.get(
//         `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/centers?departmentId=${departmentId}`
//       );
//       if (response.data.success) {
//         setCenters(response.data.data);
//         console.log(`✓ Loaded ${response.data.data.length} centers for department ${departmentId}`);
//       }
//     } catch (error) {
//       console.error('Error loading centers:', error);
//       setError('Failed to load centers for this department');
//     }
//   };

//   const loadBatches = async () => {
//     try {
//       const response = await axios.get(
//         `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/batches?departmentId=${departmentId}`
//       );
//       if (response.data.success) {
//         setBatches(response.data.data);
//         console.log(`✓ Loaded ${response.data.data.length} batches for department ${departmentId}`);
//       }
//     } catch (error) {
//       console.error('Error loading batches:', error);
//       setError('Failed to load batches for this department');
//     }
//   };

//   // ✅ STRICT VALIDATION - EXACT same as Excel component
//   const validateStudentData = useCallback((studentsData) => {
//     const errors = [];
//     const fieldErrors = {};
    
//     // Initialize field error counters
//     Object.keys(requiredFields).forEach(field => {
//       fieldErrors[field] = 0;
//     });

//     console.log('🔍 Starting database validation on', studentsData?.length || 0, 'records');

//     studentsData.forEach((student, index) => {
//       const rowNumber = index + 1;
//       const missingFields = [];
      
//       // Check each required field
//       Object.keys(requiredFields).forEach(field => {
//         const value = student[field];
        
//         // ✅ STRICT CHECK: Empty string, null, undefined, or whitespace only
//         if (value === null || value === undefined || value === '' || 
//             (typeof value === 'string' && value.trim() === '')) {
//           missingFields.push(requiredFields[field]);
//           fieldErrors[field]++;
//         }
//       });
      
//       // If this row has missing fields, add to errors
//       if (missingFields.length > 0) {
//         errors.push({
//           rowNumber,
//           studentId: student.student_id || 'N/A',
//           studentName: student.fullname || 'Unknown',
//           missingFields
//         });
//       }
//     });
    
//     // Create summary
//     const summary = {
//       totalRows: studentsData.length,
//       errorCount: errors.length,
//       successCount: studentsData.length - errors.length,
//       fieldErrors: Object.entries(fieldErrors)
//         .filter(([_, count]) => count > 0)
//         .map(([field, count]) => ({
//           field: requiredFields[field],
//           count
//         }))
//         .sort((a, b) => b.count - a.count)
//     };
    
//     console.log('✅ Validation complete:', { totalRows: summary.totalRows, errorCount: summary.errorCount });
    
//     return { errors, summary, isValid: errors.length === 0 };
//   }, [requiredFields]);

//   const loadStudents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setSuccess(null);
//       setValidationErrors([]);
//       setShowValidationModal(false);

//       if (!departmentId) {
//         setError('Department ID is required');
//         setLoading(false);
//         return;
//       }

//       let url = `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/students?departmentId=${departmentId}`;
      
//       if (selectedCenter !== 'all') {
//         url += `&center=${selectedCenter}`;
//       }
//       if (selectedBatch !== 'all') {
//         url += `&batchNo=${selectedBatch}`;
//       }
//       if (searchTerm) {
//         url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
//       }

//       console.log('📊 Fetching students from URL:', url);

//       const response = await axios.get(url);
      
//       if (response.data.success) {
//         console.log('✅ Received', response.data.data.length, 'students from database');
        
//         // ✅ RUN STRICT VALIDATION (EXACT same as Excel)
//         const validation = validateStudentData(response.data.data);

//         console.log('🔍 Validation result:', {
//           isValid: validation.isValid,
//           errorCount: validation.summary.errorCount,
//           successCount: validation.summary.successCount
//         });

//         // ✅ If validation FAILED - show modal and BLOCK
//         if (!validation.isValid) {
//           console.log('❌ Validation FAILED - showing error modal');
          
//           // Set validation data (EXACT same format as Excel)
//           setValidationErrors(validation.errors);
//           setValidationSummary(validation.summary);
          
//           // Show modal
//           setShowValidationModal(true);
          
//           // Show error alert
//           setError(`Database Validation Failed: ${validation.errors.length} row(s) have missing or empty fields. Please check the validation report.`);
          
//           // CLEAR student lists - PREVENT PDF generation
//           setStudents([]);
//           setFilteredStudents([]);
//           setTotalStudents(0);
//           setLoading(false);
//           return;  // STOP processing
//         }

//         // ✅ If validation PASSED - continue
//         console.log('✅ Validation PASSED - loading students');
        
//         setStudents(response.data.data);
//         setFilteredStudents(response.data.data);
//         setTotalStudents(response.data.data.length);
        
//         setSuccess(
//           <div>
//             <strong>✅ Database Validation Passed!</strong>
//             <br />
//             <small>All {response.data.data.length} students have valid data. Ready to generate hall tickets.</small>
//           </div>
//         );
//       }
//     } catch (error) {
//       console.error('❌ Error loading students:', error);
//       setError('Failed to load students from database: ' + (error.response?.data?.message || error.message));
//       setStudents([]);
//       setFilteredStudents([]);
//       setTotalStudents(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterStudentsByCenter = (centerValue) => {
//     setSelectedCenter(centerValue);
//   };

//   const filterStudentsByBatch = (batchValue) => {
//     setSelectedBatch(batchValue);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   useEffect(() => {
//     if (departmentId) {
//       loadStudents();
//     }
//   }, [selectedCenter, selectedBatch, searchTerm]);

//   const downloadSingleHallTicket = async (student) => {
//     try {
//       console.log('🚀 Starting DB hall ticket download...');
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.post(
//         `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/download-hall-ticket/${student.student_id}?departmentId=${departmentId}&qrType=${qrType}`,
//         { customization },
//         { 
//           responseType: 'blob',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `hallticket_${student.student_id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setSuccess(`✅ Hall ticket downloaded for student ID: ${student.student_id}`);
//       console.log('✅ Download successful');
//     } catch (error) {
//       console.error('❌ Error downloading hall ticket:', error);
      
//       let errorMsg = 'Failed to download hall ticket';
//       if (error.response?.status === 413) {
//         errorMsg = 'Payload too large. Try without customization or refresh the page.';
//       } else if (error.response?.status === 404) {
//         errorMsg = 'Student not found or API endpoint incorrect';
//       } else if (error.response?.status === 500) {
//         errorMsg = 'Server error. Check backend logs.';
//       } else if (error.message === 'Network Error') {
//         errorMsg = 'Network error. Check if backend server is running.';
//       }
      
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadAllHallTickets = async () => {
//     try {
//       if (!departmentId) {
//         setError('Department ID is required');
//         return;
//       }

//       console.log('🚀 Starting bulk DB hall ticket download...');

//       setIsProcessing(true);
//       setProgress(0);
//       setError(null);
      
//       const progressInterval = setInterval(() => {
//         setProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 500);

//       let url = `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/download-all-hall-tickets?departmentId=${departmentId}&qrType=${qrType}`;
      
//       if (selectedCenter !== 'all') {
//         url += `&center=${selectedCenter}`;
//       }
//       if (selectedBatch !== 'all') {
//         url += `&batchNo=${selectedBatch}`;
//       }

//       const response = await axios.post(
//         url,
//         { customization },
//         { 
//           responseType: 'json',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       clearInterval(progressInterval);
//       setProgress(100);

//       if (response.data.success) {
//         setSuccess(`✅ Generated ${response.data.totalFiles} hall tickets successfully! Folder: ${response.data.folderName}`);
//       }
      
//       setIsProcessing(false);
      
//     } catch (error) {
//       console.error('❌ Error downloading hall tickets:', error);
      
//       let errorMsg = 'Failed to download hall tickets';
//       if (error.response?.status === 413) {
//         errorMsg = 'Payload too large. Try without customization.';
//       } else if (error.response?.status === 404) {
//         errorMsg = 'API endpoint not found';
//       } else if (error.response?.status === 500) {
//         errorMsg = 'Server error. Check backend logs.';
//       }
      
//       setError(errorMsg);
//       setIsProcessing(false);
//     }
//   };

//   const openPreview = (student) => {
//     setPreviewStudent(student);
//     setShowPreviewModal(true);
//   };

//   const navigateToDepartmentSelection = () => {
//     navigate('/super-admin/halltickets-department-selection');
//   };

//   const clearCustomization = () => {
//     console.log('🗑️ Clearing customization...');
//     sessionStorage.removeItem('hallticket_customization');
//     setCustomization(null);
//     setSuccess('✅ Customization cleared. Using default hall ticket now.');
//   };

//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess(null);
//         setError(null);
//       }, 5000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   // ✅ NEW: Validation Modal (EXACT same as Excel component)
//   const renderValidationModal = () => {
//     if (!validationSummary) return null;
    
//     return (
//       <Modal 
//         show={showValidationModal} 
//         onHide={() => setShowValidationModal(false)}
//         size="xl"
//         centered
//       >
//         <Modal.Header closeButton className="bg-danger text-white">
//           <Modal.Title>
//             <FaExclamationTriangle className="me-2" />
//             Database Validation Failed
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Summary Section */}
//           <Alert variant="danger" className="mb-4">
//             <Row>
//               <Col md={4}>
//                 <div className="text-center">
//                   <h4 className="mb-0">{validationSummary.totalRows}</h4>
//                   <small>Total Rows</small>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center">
//                   <h4 className="mb-0 text-danger">{validationSummary.errorCount}</h4>
//                   <small>Rows with Errors</small>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center">
//                   <h4 className="mb-0 text-success">{validationSummary.successCount}</h4>
//                   <small>Valid Rows</small>
//                 </div>
//               </Col>
//             </Row>
//           </Alert>
          
//           {/* Field-wise Error Summary */}
//           {validationSummary.fieldErrors.length > 0 && (
//             <Card className="mb-4">
//               <Card.Header>
//                 <strong>Missing Fields Summary</strong>
//               </Card.Header>
//               <Card.Body>
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>Field Name</th>
//                       <th className="text-center">Missing Count</th>
//                       <th className="text-center">Percentage</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {validationSummary.fieldErrors.map((fieldError, index) => (
//                       <tr key={index}>
//                         <td>{fieldError.field}</td>
//                         <td className="text-center">
//                           <Badge bg="danger">{fieldError.count}</Badge>
//                         </td>
//                         <td className="text-center">
//                           {((fieldError.count / validationSummary.totalRows) * 100).toFixed(1)}%
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           )}
          
//           {/* Detailed Error List */}
//           <Card>
//             <Card.Header>
//               <strong>Detailed Error Report ({validationErrors.length} rows)</strong>
//             </Card.Header>
//             <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
//               <ListGroup variant="flush">
//                 {validationErrors.map((error, index) => (
//                   <ListGroup.Item key={index} variant="danger">
//                     <Row>
//                       <Col md={3}>
//                         <strong>Row {error.rowNumber}</strong>
//                         <br />
//                         <small className="text-muted">ID: {error.studentId}</small>
//                         <br />
//                         <small className="text-muted">{error.studentName}</small>
//                       </Col>
//                       <Col md={9}>
//                         <strong>Missing Fields:</strong>
//                         <div className="mt-2">
//                           {error.missingFields.map((field, idx) => (
//                             <Badge 
//                               key={idx} 
//                               bg="danger" 
//                               className="me-2 mb-2"
//                               style={{ fontSize: '0.85em' }}
//                             >
//                               <FaTimes className="me-1" />
//                               {field}
//                             </Badge>
//                           ))}
//                         </div>
//                       </Col>
//                     </Row>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card.Body>
//           </Card>
          
//           {/* Instructions */}
//           <Alert variant="info" className="mt-4 mb-0">
//             <FaInfoCircle className="me-2" />
//             <strong>How to fix:</strong> Please update your database to fill in all missing fields for the rows listed above, then reload and retry.
//           </Alert>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowValidationModal(false)}>
//             Close
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={() => {
//               setShowValidationModal(false);
//               window.location.reload();
//             }}
//           >
//             Reload Page
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   };

//   // ✅ PREVIEW MODAL WITH IMAGE DISPLAY
//   const renderPreviewModal = () => {
//     if (!previewStudent) return null;
    
//     return (
//       <Modal 
//         show={showPreviewModal} 
//         onHide={() => setShowPreviewModal(false)}
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton className="bg-light">
//           <Modal.Title>
//             <FaDatabase className="me-2" />
//             Student Preview - Database Source
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col md={8}>
//               <h5 className="mb-3">{previewStudent.fullname}</h5>
              
//               {/* ✅ Student Identification */}
//               <div className="mb-3">
//                 <h6 className="text-muted mb-2">
//                   <FaInfoCircle className="me-2" />
//                   Identification
//                 </h6>
//                 <p><strong>Student ID (Seat No):</strong> <Badge bg="primary">{previewStudent.student_id}</Badge></p>
//                 <p><strong>Application No:</strong> <Badge bg="info">{previewStudent.APPLICATION_NUMBER}</Badge></p>
//                 <p><strong>Changed Name:</strong> {previewStudent.newname || 'N/A'}</p>
//               </div>

//               <hr />

//               {/* ✅ Exam Details */}
//               <div className="mb-3">
//                 <h6 className="text-muted mb-2">
//                   <FaDatabase className="me-2" />
//                   Exam Details
//                 </h6>
//                 <p><strong>Subject:</strong> {previewStudent.subject_name || 'N/A'}</p>
//                 <p><strong>Exam Date:</strong> {previewStudent.batchdate}</p>
//                 <p><strong>Batch No:</strong> {previewStudent.batchNo}</p>
//                 <p><strong>Start Time:</strong> {previewStudent.start_time}</p>
//                 <p><strong>Reporting Time:</strong> {previewStudent.reporting_time}</p>
//                 <p><strong>Gate Closure Time:</strong> {previewStudent.gate_closure_time}</p>
//               </div>

//               <hr />

//               {/* ✅ Center & Location Details */}
//               <div className="mb-3">
//                 <h6 className="text-muted mb-2">
//                   <FaDatabase className="me-2" />
//                   Exam Center
//                 </h6>
//                 <p><strong>Center Name:</strong> {previewStudent.center_name}</p>
//                 <p><strong>Center Address:</strong> {previewStudent.center_address}</p>
//               </div>

//               <hr />

//               {/* ✅ Additional Info */}
//               <div>
//                 <h6 className="text-muted mb-2">
//                   <FaInfoCircle className="me-2" />
//                   Additional Info
//                 </h6>
//                 <p><strong>Disability:</strong> 
//                   {previewStudent.disability === 'Yes' ? (
//                     <Badge bg="danger" className="ms-2">Yes</Badge>
//                   ) : (
//                     <Badge bg="success" className="ms-2">No</Badge>
//                   )}
//                 </p>
//                 <p><strong>Disability Type:</strong> {previewStudent.disability_type || 'N/A'}</p>
//                 <p><strong>Department ID:</strong> {departmentId || 'N/A'}</p>
//                 <p><strong>Source:</strong> <Badge bg="info" className="ms-1">Database</Badge></p>
//               </div>
//             </Col>
            
//             <Col md={4} className="text-center">
//               {/* ✅ Display actual student photo */}
//               <div className="mb-4">
//                 <h6>
//                   <strong>📸 Student Photo</strong>
//                 </h6>
                
//                 {previewStudent.photoBase64 ? (
//                   <div className="border p-2 rounded mb-3" style={{ backgroundColor: '#f8f9fa' }}>
//                     <img 
//                       src={previewStudent.photoBase64} 
//                       alt="Student Photo" 
//                       style={{ 
//                         maxWidth: '100%', 
//                         maxHeight: '200px', 
//                         objectFit: 'cover',
//                         borderRadius: '4px'
//                       }}
//                       onError={(e) => {
//                         console.log('Photo load error');
//                         e.target.style.display = 'none';
//                         e.target.parentElement.innerHTML = `
//                           <div style="padding: 30px; text-align: center; color: #999;">
//                             <div style="font-size: 40px; margin-bottom: 10px;">📷</div>
//                             <div>Photo not found or corrupted</div>
//                           </div>
//                         `;
//                       }}
//                     />
//                     <div className="mt-2">
//                       <Badge bg="success">✓ Available</Badge>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="border p-4 rounded mb-3" style={{ backgroundColor: '#f8f9fa' }}>
//                     <div style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
//                     <p className="text-muted mb-0 small">No photo available</p>
//                     <Badge bg="warning" className="mt-2">Not Available</Badge>
//                   </div>
//                 )}
//               </div>

//               {/* ✅ Display signature */}
//               <div className="mb-4">
//                 <h6>
//                   <strong>✍️ Signature</strong>
//                 </h6>
                
//                 {previewStudent.signBase64 ? (
//                   <div className="border p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
//                     <img 
//                       src={previewStudent.signBase64} 
//                       alt="Student Signature" 
//                       style={{ 
//                         maxWidth: '100%', 
//                         maxHeight: '120px', 
//                         objectFit: 'cover',
//                         borderRadius: '4px'
//                       }}
//                       onError={(e) => {
//                         console.log('Signature load error');
//                         e.target.style.display = 'none';
//                         e.target.parentElement.innerHTML = `
//                           <div style="padding: 20px; text-align: center; color: #999;">
//                             <div style="font-size: 30px; margin-bottom: 5px;">✍️</div>
//                             <div style="font-size: 12px;">Signature not found</div>
//                           </div>
//                         `;
//                       }}
//                     />
//                     <div className="mt-2">
//                       <Badge bg="success">✓ Available</Badge>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="border p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
//                     <div style={{ fontSize: '30px', marginBottom: '5px' }}>✍️</div>
//                     <p className="text-muted mb-0 small">No signature available</p>
//                     <Badge bg="warning" className="mt-2">Not Available</Badge>
//                   </div>
//                 )}
//               </div>

//               {/* ✅ QR Type Info */}
//               {qrType && (
//                 <Card className="bg-light mt-3">
//                   <Card.Body>
//                     <h6 className="mb-2">
//                       <Badge bg="info">Configuration</Badge>
//                     </h6>
//                     <small>
//                       <strong>QR Code Type:</strong> 
//                       <div className="mt-1">
//                         {qrType === 'both' && <Badge bg="success">Both QR Codes</Badge>}
//                         {qrType === 'sh' && <Badge bg="primary">Shorthand Only</Badge>}
//                         {qrType === 'tw' && <Badge bg="primary">Typewriting Only</Badge>}
//                       </div>
//                     </small>
//                   </Card.Body>
//                 </Card>
//               )}

//               {/* ✅ Customization Status */}
//               {customization && (
//                 <Card className="bg-light mt-2">
//                   <Card.Body>
//                     <h6 className="mb-2">
//                       <Badge bg="success">✓ Customization</Badge>
//                     </h6>
//                     <small className="text-success">
//                       Custom hall ticket active
//                     </small>
//                   </Card.Body>
//                 </Card>
//               )}
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button 
//             variant="secondary" 
//             onClick={() => setShowPreviewModal(false)}
//           >
//             Close Preview
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={() => {
//               setShowPreviewModal(false);
//               downloadSingleHallTicket(previewStudent);
//             }}
//           >
//             <FaDownload className="me-1" /> 
//             Download Hall Ticket
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row className="align-items-center mb-4">
//         <Col>
//           <h2 className="mb-0">
//             <FaDatabase className="me-2" />
//             Hall Tickets Generation - Database Source
//           </h2>
//         </Col>
//         <Col xs="auto">
//           <div className="d-flex align-items-center gap-2">
//             <Badge bg="info" className="fs-6">
//               Source: Database
//             </Badge>
//             {departmentId ? (
//               <Badge bg="secondary" className="fs-6">
//                 Department ID: {departmentId}
//               </Badge>
//             ) : (
//               <Badge bg="danger" className="fs-6">
//                 No Department Selected
//               </Badge>
//             )}
//             {customization ? (
//               <>
//                 <Badge bg="success" className="fs-6">
//                   ✅ Custom Hall Ticket Active
//                 </Badge>
//                 <Button 
//                   variant="outline-warning" 
//                   size="sm"
//                   onClick={clearCustomization}
//                   title="Click to use default hall ticket"
//                 >
//                   <FaTrash className="me-1" />
//                   Use Default
//                 </Button>
//               </>
//             ) : (
//               <Badge bg="secondary" className="fs-6">
//                 📄 Default Hall Ticket
//               </Badge>
//             )}
//             <Button 
//               variant="outline-secondary" 
//               size="sm"
//               onClick={navigateToDepartmentSelection}
//             >
//               <FaArrowLeft className="me-1" />
//               Change Department
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {!departmentId && (
//         <Alert variant="danger">
//           <FaInfoCircle className="me-2" />
//           Department ID is required. Please go back and select a department first.
//         </Alert>
//       )}

//       {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
//       {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

//       {/* ✅ Database Structure Information Section */}
//       <Card className="mb-4">
//         <Card.Header 
//           className="d-flex align-items-center justify-content-between"
//           style={{ cursor: 'pointer' }}
//           onClick={() => setShowFieldInfo(!showFieldInfo)}
//         >
//           <span>
//             <FaDatabase className="me-2" />
//             Database Structure Information
//           </span>
//           {showFieldInfo ? <FaChevronUp /> : <FaChevronDown />}
//         </Card.Header>
//         <Collapse in={showFieldInfo}>
//           <Card.Body>
//             <p className="mb-3">
//               The following fields are <strong>required in the database</strong> and <strong>CANNOT be empty</strong> to generate hall tickets:
//             </p>
//             <Row>
//               <Col md={6}>
//                 <ListGroup variant="flush" className="small">
//                   <ListGroup.Item><strong>student_id</strong>: Student/Seat number <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item><strong>fullname</strong>: Student's full name <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item><strong>center_name</strong>: Exam center name <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item><strong>batchNo</strong>: Batch number <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item><strong>batchdate</strong>: Exam date <Badge bg="danger">Required</Badge></ListGroup.Item>
//                 </ListGroup>
//               </Col>
//               <Col md={6}>
//                 <ListGroup variant="flush" className="small">
//                   <ListGroup.Item><strong>reporting_time</strong>: Reporting time <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item><strong>start_time</strong>: Start time <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item><strong>center_address</strong>: Center address <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item><strong>subject_name</strong>: Subject name <Badge bg="danger">Required</Badge></ListGroup.Item>
//                   <ListGroup.Item className="bg-light"><strong>Note:</strong> Validation will BLOCK PDF generation if any field is empty, NULL, or whitespace only.</ListGroup.Item>
//                 </ListGroup>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Collapse>
//       </Card>

//       <Row>
//         <Col md={4}>
//           <Card className="mb-4">
//             <Card.Header>
//               <FaFilter className="me-2" />
//               Filter Options
//             </Card.Header>
//             <Card.Body>
//               <Form.Group className="mb-3">
//                 <Form.Label>Filter by Center</Form.Label>
//                 <Form.Select 
//                   value={selectedCenter} 
//                   onChange={(e) => filterStudentsByCenter(e.target.value)}
//                   disabled={loading || centers.length === 0}
//                 >
//                   <option value="all">All Centers ({centers.length})</option>
//                   {centers.map(center => (
//                     <option key={center.center} value={center.center}>
//                       {center.center_name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Filter by Batch</Form.Label>
//                 <Form.Select 
//                   value={selectedBatch} 
//                   onChange={(e) => filterStudentsByBatch(e.target.value)}
//                   disabled={loading || batches.length === 0}
//                 >
//                   <option value="all">All Batches ({batches.length})</option>
//                   {batches.map(batch => (
//                     <option key={batch.batchNo} value={batch.batchNo}>
//                       Batch {batch.batchNo} - {new Date(batch.batchdate).toLocaleDateString()}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Search Students</Form.Label>
//                 <Form.Control 
//                   type="text" 
//                   placeholder="Search by name or student ID" 
//                   value={searchTerm}
//                   onChange={handleSearch}
//                   disabled={loading}
//                 />
//               </Form.Group>

//               <Button 
//                 variant="outline-primary" 
//                 className="w-100"
//                 onClick={loadStudents}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Spinner animation="border" size="sm" className="me-2" />
//                     Loading...
//                   </>
//                 ) : (
//                   <>
//                     <FaSearch className="me-2" />
//                     Apply Filters
//                   </>
//                 )}
//               </Button>
//             </Card.Body>
//           </Card>

//           <Card>
//             <Card.Header>
//               <FaFileArchive className="me-2" />
//               Bulk Download
//             </Card.Header>
//             <Card.Body>
//               <div className="mb-3">
//                 <Alert variant="info" className="mb-3">
//                   <FaInfoCircle className="me-2" />
//                   <small>
//                     Will download hall tickets for all students matching current filters. All data must pass validation first.
//                   </small>
//                 </Alert>
//               </div>

//               <Button 
//                 variant="primary" 
//                 className="w-100 mb-3"
//                 onClick={downloadAllHallTickets}
//                 disabled={isProcessing || loading || filteredStudents.length === 0}
//               >
//                 {isProcessing ? (
//                   <>
//                     <Spinner animation="border" size="sm" className="me-2" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <FaDownload className="me-2" />
//                     Download All ({filteredStudents.length}) Hall Tickets
//                   </>
//                 )}
//               </Button>
              
//               {isProcessing && (
//                 <ProgressBar 
//                   now={progress} 
//                   label={`${progress}%`} 
//                   animated 
//                   className="mb-3" 
//                 />
//               )}
              
//               <div className="text-muted">
//                 <small>
//                   All PDFs will be saved to a folder on the server.
//                 </small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
        
//         <Col md={8}>
//           <Card>
//             <Card.Header>
//               <Row className="align-items-center">
//                 <Col>
//                   <FaDatabase className="me-2" />
//                   Student List - Database
//                 </Col>
//                 <Col className="text-end">
//                   <small>
//                     {filteredStudents.length} of {totalStudents} students
//                   </small>
//                 </Col>
//               </Row>
//             </Card.Header>
//             <Card.Body style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </Spinner>
//                   <p className="mt-3">Loading and validating students from database...</p>
//                 </div>
//               ) : filteredStudents.length === 0 ? (
//                 <div className="text-center py-5">
//                   <FaInfoCircle size={50} className="text-muted mb-3" />
//                   <p className="text-muted">
//                     {students.length === 0 ? 
//                       'No student data found in database for selected filters. Check validation errors.' : 
//                       'No students match your filter criteria.'}
//                   </p>
//                 </div>
//               ) : (
//                 <ListGroup variant="flush">
//                   {filteredStudents.map((student, index) => (
//                     <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <strong>{student.fullname}</strong>
//                         <div>
//                           <small>Student ID: {student.student_id}</small>
//                         </div>
//                         <div>
//                           <small>Batch: {student.batchNo} | Date: {student.batchdate}</small>
//                         </div>
//                         <div>
//                           <small>Center: {student.center_name}</small>
//                         </div>
//                         <div>
//                           <small>
//                             Source: <Badge bg="info" className="ms-1">
//                               Database
//                             </Badge>
//                           </small>
//                         </div>
//                       </div>
//                       <div>
//                         <Button 
//                           variant="outline-secondary" 
//                           size="sm"
//                           className="me-2"
//                           onClick={() => openPreview(student)}
//                         >
//                           <FaEye className="me-1" />
//                           Preview
//                         </Button>
//                         <Button 
//                           variant="outline-primary" 
//                           size="sm"
//                           onClick={() => downloadSingleHallTicket(student)}
//                           disabled={loading}
//                         >
//                           <FaDownload className="me-1" />
//                           Download
//                         </Button>
//                       </div>
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {renderPreviewModal()}
//       {renderValidationModal()}
//     </Container>
//   );
// }

// export default GenerateSkillTestHallTicketsFromDB;


// src/components/super-admin/GenerateSkillTestHallTicketsFromDB.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Button, 
  Card, 
  Container, 
  Row, 
  Col, 
  Form, 
  Spinner,
  Alert,
  ListGroup,
  ProgressBar,
  Badge,
  Collapse
} from 'react-bootstrap';
import { 
  FaFilePdf, 
  FaFileArchive, 
  FaDownload, 
  FaFilter, 
  FaSearch, 
  FaDatabase,
  FaEye,
  FaInfoCircle,
  FaArrowLeft,
  FaTrash,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import ExcelValidationModal from '../../utils/ExcelValidationModal'; // ✅ IMPORT REUSABLE MODAL


function GenerateSkillTestHallTicketsFromDB() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [centers, setCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [customization, setCustomization] = useState(null);
  const [showFieldInfo, setShowFieldInfo] = useState(false);

  // ✅ NEW: Validation Modal States (for reusable component)
  const [validationData, setValidationData] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);


  const queryParams = new URLSearchParams(location.search);
  const departmentId = queryParams.get('departmentId');
  const qrType = queryParams.get('qrType') || 'both';
  
  // ✅ Required fields for database validation
  const requiredFields = {
    'student_id': 'Student ID',
    'fullname': 'Full Name',
    'center_name': 'Center Name',
    'batchNo': 'Batch Number',
    'batchdate': 'Batch Date',
    'reporting_time': 'Reporting Time',
    'start_time': 'Start Time',
    'center_address': 'Center Address',
    'subject_name': 'Subject Name'
  };
  
  useEffect(() => {
    const storedCustomization = JSON.parse(sessionStorage.getItem('hallticket_customization')) || null;
    setCustomization(storedCustomization);
    
    console.log('🔍 Component loaded with:');
    console.log('Department ID:', departmentId);
    console.log('QR Type:', qrType);
    console.log('Customization from sessionStorage:', storedCustomization);
  }, []);


  useEffect(() => {
    if (departmentId) {
      loadCenters();
      loadBatches();
      loadStudents();
    } else {
      setError('Department ID is required. Please select a department first.');
    }
  }, [departmentId]);


  const loadCenters = async () => {
    try {
      const response = await axios.get(
        `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/centers?departmentId=${departmentId}`
      );
      if (response.data.success) {
        setCenters(response.data.data);
        console.log(`✓ Loaded ${response.data.data.length} centers for department ${departmentId}`);
      }
    } catch (error) {
      console.error('Error loading centers:', error);
      setError('Failed to load centers for this department');
    }
  };


  const loadBatches = async () => {
    try {
      const response = await axios.get(
        `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/batches?departmentId=${departmentId}`
      );
      if (response.data.success) {
        setBatches(response.data.data);
        console.log(`✓ Loaded ${response.data.data.length} batches for department ${departmentId}`);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
      setError('Failed to load batches for this department');
    }
  };


  // ✅ Validation function (reusable logic)
  const validateStudentData = useCallback((studentsData) => {
    const errors = [];
    const fieldErrors = {};
    
    Object.keys(requiredFields).forEach(field => {
      fieldErrors[field] = 0;
    });


    console.log('🔍 Starting database validation on', studentsData?.length || 0, 'records');


    studentsData.forEach((student, index) => {
      const rowNumber = index + 1;
      const missingFields = [];
      
      Object.keys(requiredFields).forEach(field => {
        const value = student[field];
        
        // ✅ STRICT CHECK: Empty string, null, undefined, or whitespace only
        if (value === null || value === undefined || value === '' || 
            (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(requiredFields[field]);
          fieldErrors[field]++;
        }
      });
      
      if (missingFields.length > 0) {
        errors.push({
          rowNumber,
          identifier: student.student_id || 'N/A',
          name: student.fullname || 'Unknown',
          missingFields
        });
      }
    });
    
    const summary = {
      totalRows: studentsData.length,
      errorCount: errors.length,
      successCount: studentsData.length - errors.length,
      fieldErrors: Object.entries(fieldErrors)
        .filter(([_, count]) => count > 0)
        .map(([field, count]) => ({
          field: requiredFields[field],
          count,
          percentage: ((count / studentsData.length) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
    };
    
    console.log('✅ Validation complete:', { totalRows: summary.totalRows, errorCount: summary.errorCount });
    
    return { errors, summary, isValid: errors.length === 0 };
  }, [requiredFields]);


  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);


      if (!departmentId) {
        setError('Department ID is required');
        setLoading(false);
        return;
      }


      let url = `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/students?departmentId=${departmentId}`;
      
      if (selectedCenter !== 'all') {
        url += `&center=${selectedCenter}`;
      }
      if (selectedBatch !== 'all') {
        url += `&batchNo=${selectedBatch}`;
      }
      if (searchTerm) {
        url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      }


      console.log('📊 Fetching students from URL:', url);


      const response = await axios.get(url);
      
      if (response.data.success) {
        console.log('✅ Received', response.data.data.length, 'students from database');
        
        // ✅ RUN VALIDATION - Check data
        const validation = validateStudentData(response.data.data);


        console.log('🔍 Validation result:', {
          isValid: validation.isValid,
          errorCount: validation.summary.errorCount,
          successCount: validation.summary.successCount
        });


        // ✅ If validation FAILED - show VALIDATION MODAL (using reusable component)
        if (!validation.isValid) {
          console.log('❌ Validation FAILED - showing modal');
          
          // ✅ Set data for reusable modal
          setValidationData(validation);
          setShowValidationModal(true);
          
          // Also show error alert
          setError(
            <div>
              <strong>❌ Database Validation Failed!</strong>
              <br />
              <small>{validation.errors.length} row(s) have missing or empty fields. Please check the validation report below.</small>
            </div>
          );
          
          // CLEAR student lists - PREVENT PDF generation
          setStudents([]);
          setFilteredStudents([]);
          setTotalStudents(0);
          setLoading(false);
          return;
        }


        // ✅ If validation PASSED - continue loading
        console.log('✅ Validation PASSED - loading students');
        
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
        setTotalStudents(response.data.data.length);
        
        setSuccess(
          <div>
            <strong>✅ Database Validation Passed!</strong>
            <br />
            <small>All {response.data.data.length} students have valid data. Ready to generate hall tickets.</small>
          </div>
        );
      }
    } catch (error) {
      console.error('❌ Error loading students:', error);
      setError('Failed to load students from database: ' + (error.response?.data?.message || error.message));
      setStudents([]);
      setFilteredStudents([]);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };


  const filterStudentsByCenter = (centerValue) => {
    setSelectedCenter(centerValue);
  };


  const filterStudentsByBatch = (batchValue) => {
    setSelectedBatch(batchValue);
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  useEffect(() => {
    if (departmentId) {
      loadStudents();
    }
  }, [selectedCenter, selectedBatch, searchTerm, departmentId]);


  const downloadSingleHallTicket = async (student) => {
    try {
      console.log('🚀 Starting DB hall ticket download...');
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/download-hall-ticket/${student.student_id}?departmentId=${departmentId}&qrType=${qrType}`,
        { customization },
        { 
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );


      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hallticket_${student.student_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess(`✅ Hall ticket downloaded for student ID: ${student.student_id}`);
      console.log('✅ Download successful');
    } catch (error) {
      console.error('❌ Error downloading hall ticket:', error);
      
      let errorMsg = 'Failed to download hall ticket';
      if (error.response?.status === 413) {
        errorMsg = 'Payload too large. Try without customization or refresh the page.';
      } else if (error.response?.status === 404) {
        errorMsg = 'Student not found or API endpoint incorrect';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Check backend logs.';
      } else if (error.message === 'Network Error') {
        errorMsg = 'Network error. Check if backend server is running.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  const downloadAllHallTickets = async () => {
    try {
      if (!departmentId) {
        setError('Department ID is required');
        return;
      }


      console.log('🚀 Starting bulk DB hall ticket download...');


      setIsProcessing(true);
      setProgress(0);
      setError(null);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);


      let url = `http://checking.shorthandonlineexam.in/api/skilltest-halltickets/db/download-all-hall-tickets?departmentId=${departmentId}&qrType=${qrType}`;
      
      if (selectedCenter !== 'all') {
        url += `&center=${selectedCenter}`;
      }
      if (selectedBatch !== 'all') {
        url += `&batchNo=${selectedBatch}`;
      }


      const response = await axios.post(
        url,
        { customization },
        { 
          responseType: 'json',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      clearInterval(progressInterval);
      setProgress(100);


      if (response.data.success) {
        setSuccess(`✅ Generated ${response.data.totalFiles} hall tickets successfully! Folder: ${response.data.folderName}`);
      }
      
      setIsProcessing(false);
      
    } catch (error) {
      console.error('❌ Error downloading hall tickets:', error);
      
      let errorMsg = 'Failed to download hall tickets';
      if (error.response?.status === 413) {
        errorMsg = 'Payload too large. Try without customization.';
      } else if (error.response?.status === 404) {
        errorMsg = 'API endpoint not found';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Check backend logs.';
      }
      
      setError(errorMsg);
      setIsProcessing(false);
    }
  };


  const openPreview = (student) => {
    setPreviewStudent(student);
    setShowPreviewModal(true);
  };


  const navigateToDepartmentSelection = () => {
    navigate('/super-admin/halltickets-department-selection');
  };


  const clearCustomization = () => {
    console.log('🗑️ Clearing customization...');
    sessionStorage.removeItem('hallticket_customization');
    setCustomization(null);
    setSuccess('✅ Customization cleared. Using default hall ticket now.');
  };


  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);


  // ✅ Preview Modal
  const renderPreviewModal = () => {
    if (!previewStudent) return null;
    
    return (
      <div className="modal fade show" style={{ display: showPreviewModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">
                <FaDatabase className="me-2" />
                Student Preview - Database Source
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowPreviewModal(false)}></button>
            </div>
            <div className="modal-body">
              <Row>
                <Col md={8}>
                  <h5 className="mb-3">{previewStudent.fullname}</h5>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <FaInfoCircle className="me-2" />
                      Identification
                    </h6>
                    <p><strong>Student ID (Seat No):</strong> <Badge bg="primary">{previewStudent.student_id}</Badge></p>
                    <p><strong>Application No:</strong> <Badge bg="info">{previewStudent.APPLICATION_NUMBER}</Badge></p>
                    <p><strong>Changed Name:</strong> {previewStudent.newname || 'N/A'}</p>
                  </div>


                  <hr />


                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <FaDatabase className="me-2" />
                      Exam Details
                    </h6>
                    <p><strong>Subject:</strong> {previewStudent.subject_name || 'N/A'}</p>
                    <p><strong>Exam Date:</strong> {previewStudent.batchdate}</p>
                    <p><strong>Batch No:</strong> {previewStudent.batchNo}</p>
                    <p><strong>Start Time:</strong> {previewStudent.start_time}</p>
                    <p><strong>Reporting Time:</strong> {previewStudent.reporting_time}</p>
                    <p><strong>Gate Closure Time:</strong> {previewStudent.gate_closure_time}</p>
                  </div>


                  <hr />


                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <FaDatabase className="me-2" />
                      Exam Center
                    </h6>
                    <p><strong>Center Name:</strong> {previewStudent.center_name}</p>
                    <p><strong>Center Address:</strong> {previewStudent.center_address}</p>
                  </div>


                  <hr />


                  <div>
                    <h6 className="text-muted mb-2">
                      <FaInfoCircle className="me-2" />
                      Additional Info
                    </h6>
                    <p><strong>Disability:</strong> 
                      {previewStudent.disability === 'Yes' ? (
                        <Badge bg="danger" className="ms-2">Yes</Badge>
                      ) : (
                        <Badge bg="success" className="ms-2">No</Badge>
                      )}
                    </p>
                    <p><strong>Disability Type:</strong> {previewStudent.disability_type || 'N/A'}</p>
                    <p><strong>Department ID:</strong> {departmentId || 'N/A'}</p>
                    <p><strong>Source:</strong> <Badge bg="info" className="ms-1">Database</Badge></p>
                  </div>
                </Col>
                
                <Col md={4} className="text-center">
                  <div className="mb-4">
                    <h6><strong>📸 Student Photo</strong></h6>
                    {previewStudent.photoBase64 ? (
                      <div className="border p-2 rounded mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <img 
                          src={previewStudent.photoBase64} 
                          alt="Student Photo" 
                          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div className="mt-2">
                          <Badge bg="success">✓ Available</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="border p-4 rounded mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
                        <p className="text-muted mb-0 small">No photo available</p>
                        <Badge bg="warning" className="mt-2">Not Available</Badge>
                      </div>
                    )}
                  </div>


                  <div className="mb-4">
                    <h6><strong>✍️ Signature</strong></h6>
                    {previewStudent.signBase64 ? (
                      <div className="border p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <img 
                          src={previewStudent.signBase64} 
                          alt="Student Signature" 
                          style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div className="mt-2">
                          <Badge bg="success">✓ Available</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="border p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <div style={{ fontSize: '30px', marginBottom: '5px' }}>✍️</div>
                        <p className="text-muted mb-0 small">No signature available</p>
                        <Badge bg="warning" className="mt-2">Not Available</Badge>
                      </div>
                    )}
                  </div>


                  {qrType && (
                    <Card className="bg-light mt-3">
                      <Card.Body>
                        <h6 className="mb-2">
                          <Badge bg="info">Configuration</Badge>
                        </h6>
                        <small>
                          <strong>QR Code Type:</strong> 
                          <div className="mt-1">
                            {qrType === 'both' && <Badge bg="success">Both QR Codes</Badge>}
                            {qrType === 'sh' && <Badge bg="primary">Shorthand Only</Badge>}
                            {qrType === 'tw' && <Badge bg="primary">Typewriting Only</Badge>}
                          </div>
                        </small>
                      </Card.Body>
                    </Card>
                  )}


                  {customization && (
                    <Card className="bg-light mt-2">
                      <Card.Body>
                        <h6 className="mb-2">
                          <Badge bg="success">✓ Customization</Badge>
                        </h6>
                        <small className="text-success">
                          Custom hall ticket active
                        </small>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
            <div className="modal-footer">
              <Button 
                variant="secondary" 
                onClick={() => setShowPreviewModal(false)}
              >
                Close Preview
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowPreviewModal(false);
                  downloadSingleHallTicket(previewStudent);
                }}
              >
                <FaDownload className="me-1" /> 
                Download Hall Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <Container fluid className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="mb-0">
            <FaDatabase className="me-2" />
            Hall Tickets Generation - Database Source
          </h2>
        </Col>
        <Col xs="auto">
          <div className="d-flex align-items-center gap-2">
            <Badge bg="info" className="fs-6">
              Source: Database
            </Badge>
            {departmentId ? (
              <Badge bg="secondary" className="fs-6">
                Department ID: {departmentId}
              </Badge>
            ) : (
              <Badge bg="danger" className="fs-6">
                No Department Selected
              </Badge>
            )}
            {customization ? (
              <>
                <Badge bg="success" className="fs-6">
                  ✅ Custom Hall Ticket Active
                </Badge>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={clearCustomization}
                  title="Click to use default hall ticket"
                >
                  <FaTrash className="me-1" />
                  Use Default
                </Button>
              </>
            ) : (
              <Badge bg="secondary" className="fs-6">
                📄 Default Hall Ticket
              </Badge>
            )}
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={navigateToDepartmentSelection}
            >
              <FaArrowLeft className="me-1" />
              Change Department
            </Button>
          </div>
        </Col>
      </Row>


      {!departmentId && (
        <Alert variant="danger">
          <FaInfoCircle className="me-2" />
          Department ID is required. Please go back and select a department first.
        </Alert>
      )}


      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}


      {/* Database Structure Information Section */}
      <Card className="mb-4">
        <Card.Header 
          className="d-flex align-items-center justify-content-between"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowFieldInfo(!showFieldInfo)}
        >
          <span>
            <FaDatabase className="me-2" />
            Database Structure Information
          </span>
          {showFieldInfo ? <FaChevronUp /> : <FaChevronDown />}
        </Card.Header>
        <Collapse in={showFieldInfo}>
          <Card.Body>
            <p className="mb-3">
              The following fields are <strong>required in the database</strong> and <strong>CANNOT be empty</strong> to generate hall tickets:
            </p>
            <Row>
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>student_id</strong>: Student/Seat number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>fullname</strong>: Student's full name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>center_name</strong>: Exam center name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>batchNo</strong>: Batch number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>batchdate</strong>: Exam date <Badge bg="danger">Required</Badge></ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>reporting_time</strong>: Reporting time <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>start_time</strong>: Start time <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>center_address</strong>: Center address <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>subject_name</strong>: Subject name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item className="bg-light"><strong>Note:</strong> Validation will BLOCK PDF generation if any field is empty, NULL, or whitespace only.</ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Collapse>
      </Card>


      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <FaFilter className="me-2" />
              Filter Options
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Filter by Center</Form.Label>
                <Form.Select 
                  value={selectedCenter} 
                  onChange={(e) => filterStudentsByCenter(e.target.value)}
                  disabled={loading || centers.length === 0}
                >
                  <option value="all">All Centers ({centers.length})</option>
                  {centers.map(center => (
                    <option key={center.center} value={center.center}>
                      {center.center_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>Filter by Batch</Form.Label>
                <Form.Select 
                  value={selectedBatch} 
                  onChange={(e) => filterStudentsByBatch(e.target.value)}
                  disabled={loading || batches.length === 0}
                >
                  <option value="all">All Batches ({batches.length})</option>
                  {batches.map(batch => (
                    <option key={batch.batchNo} value={batch.batchNo}>
                      Batch {batch.batchNo} - {new Date(batch.batchdate).toLocaleDateString()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>Search Students</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Search by name or student ID" 
                  value={searchTerm}
                  onChange={handleSearch}
                  disabled={loading}
                />
              </Form.Group>


              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={loadStudents}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Apply Filters
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>


          <Card>
            <Card.Header>
              <FaFileArchive className="me-2" />
              Bulk Download
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <Alert variant="info" className="mb-3">
                  <FaInfoCircle className="me-2" />
                  <small>
                    Will download hall tickets for all students matching current filters. All data must pass validation first.
                  </small>
                </Alert>
              </div>


              <Button 
                variant="primary" 
                className="w-100 mb-3"
                onClick={downloadAllHallTickets}
                disabled={isProcessing || loading || filteredStudents.length === 0}
              >
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaDownload className="me-2" />
                    Download All ({filteredStudents.length}) Hall Tickets
                  </>
                )}
              </Button>
              
              {isProcessing && (
                <ProgressBar 
                  now={progress} 
                  label={`${progress}%`} 
                  animated 
                  className="mb-3" 
                />
              )}
              
              <div className="text-muted">
                <small>
                  All PDFs will be saved to a folder on the server.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <FaDatabase className="me-2" />
                  Student List - Database
                </Col>
                <Col className="text-end">
                  <small>
                    {filteredStudents.length} of {totalStudents} students
                  </small>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body style={{ maxHeight: '700px', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="mt-3">Loading and validating students from database...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-5">
                  <FaInfoCircle size={50} className="text-muted mb-3" />
                  <p className="text-muted">
                    {students.length === 0 ? 
                      'No student data found in database for selected filters. Check error messages.' : 
                      'No students match your filter criteria.'}
                  </p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {filteredStudents.map((student, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{student.fullname}</strong>
                        <div>
                          <small>Student ID: {student.student_id}</small>
                        </div>
                        <div>
                          <small>Batch: {student.batchNo} | Date: {student.batchdate}</small>
                        </div>
                        <div>
                          <small>Center: {student.center_name}</small>
                        </div>
                        <div>
                          <small>
                            Source: <Badge bg="info" className="ms-1">
                              Database
                            </Badge>
                          </small>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          className="me-2"
                          onClick={() => openPreview(student)}
                        >
                          <FaEye className="me-1" />
                          Preview
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => downloadSingleHallTicket(student)}
                          disabled={loading}
                        >
                          <FaDownload className="me-1" />
                          Download
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>


      {renderPreviewModal()}
      
      {/* ✅ REUSABLE VALIDATION MODAL */}
      <ExcelValidationModal
        show={showValidationModal}
        onHide={() => setShowValidationModal(false)}
        errors={validationData?.errors || []}
        summary={validationData?.summary || {}}
        title="Database Validation Report"
      />
    </Container>
  );
}


export default GenerateSkillTestHallTicketsFromDB;
