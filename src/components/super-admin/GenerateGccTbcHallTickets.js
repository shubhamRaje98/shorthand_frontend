// // // src/components/super-admin/GenerateGccTbcHallTickets.js
// // import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// // import axios from 'axios';
// // import { 
// //   Button, 
// //   Card, 
// //   Container, 
// //   Row, 
// //   Col, 
// //   Form, 
// //   Spinner,
// //   Alert,
// //   ListGroup,
// //   ProgressBar,
// //   Modal,
// //   Badge
// // } from 'react-bootstrap';
// // import { 
// //   FaFilePdf, 
// //   FaFileExcel, 
// //   FaFileArchive, 
// //   FaDownload, 
// //   FaFilter, 
// //   FaSearch, 
// //   FaUniversity, 
// //   FaUpload,
// //   FaEye,
// //   FaInfoCircle,
// //   FaArrowLeft
// // } from 'react-icons/fa';
// // import * as XLSX from 'xlsx';
// // import { useNavigate } from 'react-router-dom';


// // function GenerateGccTbcHallTickets() {
// //   const navigate = useNavigate();
// //   const searchInputRef = useRef(null);
  
// //   // Separate loading states to prevent search input from being disabled
// //   const [fileLoading, setFileLoading] = useState(false);
// //   const [downloadLoading, setDownloadLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(null);
// //   const [students, setStudents] = useState([]);
// //   const [institutes, setInstitutes] = useState([]);
// //   const [selectedInstitute, setSelectedInstitute] = useState('all');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
// //   const [progress, setProgress] = useState(0);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [excelFile, setExcelFile] = useState(null);
// //   const [uploadStatus, setUploadStatus] = useState(null);
// //   const [showPreviewModal, setShowPreviewModal] = useState(false);
// //   const [previewStudent, setPreviewStudent] = useState(null);
// //   const [totalStudents, setTotalStudents] = useState(0);
// //   const [activeTab, setActiveTab] = useState('upload');


// //   // Debounce effect for search term (300ms for fast response)
// //   useEffect(() => {
// //     const handler = setTimeout(() => {
// //       setDebouncedSearchTerm(searchTerm);
// //     }, 300);

// //     return () => {
// //       clearTimeout(handler);
// //     };
// //   }, [searchTerm]);


// //   // Memoized filtered students - only recalculates when dependencies change
// //   const filteredStudents = useMemo(() => {
// //     if (students.length === 0) return [];

// //     const term = debouncedSearchTerm.toLowerCase().trim();
    
// //     let filtered = students;

// //     // Filter by institute first
// //     if (selectedInstitute !== 'all') {
// //       filtered = filtered.filter(student => student.instituteId === selectedInstitute);
// //     }

// //     // Then filter by search term
// //     if (term) {
// //       filtered = filtered.filter(student => 
// //         student.candidateName.toLowerCase().includes(term) || 
// //         student.seatNo.toLowerCase().includes(term)
// //       );
// //     }

// //     return filtered;
// //   }, [debouncedSearchTerm, selectedInstitute, students]);


// //   // Memoized callback for file upload
// //   const handleFileUpload = useCallback((event) => {
// //     const file = event.target.files[0];
// //     if (!file) return;
    
// //     setExcelFile(file);
// //     setUploadStatus('selected');
// //   }, []);


// //   // Upload Excel file to server
// //   const uploadExcelFile = useCallback(async () => {
// //     if (!excelFile) {
// //       setError('Please select an Excel file first');
// //       return;
// //     }

// //     try {
// //       setFileLoading(true);
// //       setError(null);
// //       setUploadStatus('uploading');
      
// //       const formData = new FormData();
// //       formData.append('excelFile', excelFile);
      
// //       const response = await axios.post('http://localhost:3000/upload-student-data', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data'
// //         }
// //       });
      
// //       setUploadStatus('success');
// //       setSuccess('Excel file uploaded successfully!');
// //       readExcelFile(excelFile);
// //     } catch (error) {
// //       console.error('Error uploading file:', error);
// //       setError('Failed to upload Excel file. ' + (error.response?.data?.error || error.message));
// //       setUploadStatus('failed');
// //     } finally {
// //       setFileLoading(false);
// //     }
// //   }, [excelFile]);


// //   // Function to read Excel file locally for preview
// //   const readExcelFile = useCallback(async (file) => {
// //     try {
// //       setFileLoading(true);
// //       setError(null);
      
// //       const reader = new FileReader();
// //       reader.onload = async (e) => {
// //         try {
// //           const data = new Uint8Array(e.target.result);
// //           const workbook = XLSX.read(data, { type: 'array' });
// //           const sheetName = workbook.SheetNames[0];
// //           const worksheet = workbook.Sheets[sheetName];
// //           const excelData = XLSX.utils.sheet_to_json(worksheet);

// //           const mappedStudents = excelData.map(row => ({
// //             seatNo: row['student_id']?.toString() || '',
// //             instituteId: row['InstituteId']?.toString() || '',
// //             candidateName: row['fullname'] || '',
// //             motherName: row['mothername'] || '',
// //             centerNo: row['center']?.toString() || '',
// //             handicap: row['Handicap'] || 'No',
// //             subjectCode: row['subjectsId']?.toString() || '',
// //             batch: row['batchNo']?.toString() || '',
// //             date: row['batchdate'] || '',
// //             examTime: row['start_time'] || '',
// //             password: row['password']?.toString() || '',
// //             instituteCode: row['InstituteId']?.toString() || '',
// //             subject: row['SUBNAME'] || '',
// //             reportingTime: row['reporting_time'] || '',
// //             examCenter: row['center_name'] || '',
// //             centerAddress: row['center_address'] || '',
// //             image: row["base64"] ? 
// //                 (row["base64"].startsWith('data:') ? 
// //                   row["base64"] : 
// //                   `data:image/jpeg;base64,${row["base64"]}`
// //                 ) : ''
// //           }));

// //           const uniqueInstitutes = [...new Set(mappedStudents.map(student => student.instituteId))];
          
// //           setStudents(mappedStudents);
// //           setInstitutes(uniqueInstitutes);
// //           setTotalStudents(mappedStudents.length);
// //           setSuccess('Excel file processed successfully! ' + mappedStudents.length + ' students loaded.');
// //           setActiveTab('generate');
// //         } catch (error) {
// //           console.error('Excel processing error:', error);
// //           setError('Failed to process Excel file. Please check the format.');
// //         } finally {
// //           setFileLoading(false);
// //         }
// //       };
      
// //       reader.readAsArrayBuffer(file);
// //     } catch (error) {
// //       console.error('Error reading Excel file:', error);
// //       setError('Failed to read Excel file.');
// //       setFileLoading(false);
// //     }
// //   }, []);


// //   // Memoized callback for institute filter
// //   const filterStudentsByInstitute = useCallback((instituteId) => {
// //     setSelectedInstitute(instituteId);
// //   }, []);


// //   // Memoized callback for search - CRITICAL: Never causes re-render of input
// //   const handleSearch = useCallback((e) => {
// //     setSearchTerm(e.target.value);
// //   }, []);


// //   // Download single hall ticket - uses separate loading state
// //   const downloadSingleHallTicket = useCallback(async (student) => {
// //     try {
// //       console.log('Starting hall ticket download...');
// //       console.log('Student object received:', student);

// //       setDownloadLoading(true);
// //       setError(null);
      
// //       const url = `http://localhost:3000/download-student-hall-ticket/${student.seatNo}`;
// //       console.log('Generated download URL:', url);

// //       window.open(url, '_blank');
      
// //       const successMessage = `Hall ticket download initiated for student ID: ${student.seatNo}`;
// //       console.log(successMessage);
// //       setSuccess(successMessage);
// //     } catch (error) {
// //       console.error('Error downloading hall ticket:', error);
// //       setError(`Failed to download hall ticket: ${error.message}`);
// //     } finally {
// //       setDownloadLoading(false);
// //       console.log('Download function finished.');
// //     }
// //   }, []);


// //   // Download all hall tickets
// //   const downloadAllHallTickets = useCallback(async () => {
// //     try {
// //       setIsProcessing(true);
// //       setProgress(0);
// //       setError(null);
      
// //       const progressInterval = setInterval(() => {
// //         setProgress(prev => {
// //           if (prev >= 90) {
// //             clearInterval(progressInterval);
// //             return 90;
// //           }
// //           return prev + 10;
// //         });
// //       }, 500);

// //       window.open('http://localhost:3000/download-all-hall-tickets', '_blank');
      
// //       setTimeout(() => {
// //         clearInterval(progressInterval);
// //         setProgress(100);
// //         setSuccess('Hall tickets download initiated successfully!');
// //         setIsProcessing(false);
// //       }, 3000);
      
// //     } catch (error) {
// //       console.error('Error downloading hall tickets:', error);
// //       setError(`Failed to download hall tickets: ${error.message}`);
// //       setIsProcessing(false);
// //     }
// //   }, []);


// //   // Show student preview
// //   const openPreview = useCallback((student) => {
// //     setPreviewStudent(student);
// //     setShowPreviewModal(true);
// //   }, []);


// //   // Close preview modal
// //   const closePreviewModal = useCallback(() => {
// //     setShowPreviewModal(false);
// //   }, []);


// //   // Navigate back to department selection
// //   const navigateToDepartmentSelection = useCallback(() => {
// //     navigate('/super-admin/halltickets-department-selection');
// //   }, [navigate]);


// //   // Clear alerts after some time
// //   useEffect(() => {
// //     if (success || error) {
// //       const timer = setTimeout(() => {
// //         setSuccess(null);
// //         setError(null);
// //       }, 5000);
      
// //       return () => clearTimeout(timer);
// //     }
// //   }, [success, error]);


// //   // Render student preview modal
// //   const renderPreviewModal = () => {
// //     if (!previewStudent) return null;
    
// //     return (
// //       <Modal 
// //         show={showPreviewModal} 
// //         onHide={closePreviewModal}
// //         size="lg"
// //         centered
// //       >
// //         <Modal.Header closeButton>
// //           <Modal.Title>Student Preview - GCC TBC</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <Row>
// //             <Col md={8}>
// //               <h5>{previewStudent.candidateName}</h5>
// //               <p><strong>Seat No:</strong> {previewStudent.seatNo}</p>
// //               <p><strong>Mother's Name:</strong> {previewStudent.motherName}</p>
// //               <p><strong>Institute ID:</strong> {previewStudent.instituteId}</p>
// //               <p><strong>Center No:</strong> {previewStudent.centerNo}</p>
// //               <p><strong>Subject:</strong> {previewStudent.subject} ({previewStudent.subjectCode})</p>
// //               <p><strong>Batch:</strong> {previewStudent.batch}</p>
// //               <p><strong>Date:</strong> {previewStudent.date}</p>
// //               <p><strong>Exam Time:</strong> {previewStudent.examTime}</p>
// //               <p><strong>Reporting Time:</strong> {previewStudent.reportingTime}</p>
// //               <p><strong>Exam Center:</strong> {previewStudent.examCenter}</p>
// //               <p><strong>Center Address:</strong> {previewStudent.centerAddress}</p>
// //               <p><strong>Password:</strong> {previewStudent.password}</p>
// //               <p><strong>Department:</strong> <Badge variant="primary">GCC TBC</Badge></p>
// //             </Col>
// //             <Col md={4} className="text-center">
// //               {previewStudent.image ? (
// //                 <div>
// //                   <img 
// //                     src={previewStudent.image.startsWith('data:') ? 
// //                       previewStudent.image : 
// //                       `data:image/jpeg;base64,${previewStudent.image}`
// //                     } 
// //                     alt="Student" 
// //                     className="img-thumbnail" 
// //                     style={{ maxWidth: '100%', maxHeight: '200px' }}
// //                     onError={(e) => {
// //                       console.log('Image load error:', e);
// //                       e.target.style.display = 'none';
// //                       e.target.nextSibling.style.display = 'block';
// //                     }}
// //                   />
// //                   <div className="border p-3 text-center" style={{ display: 'none' }}>
// //                     <FaInfoCircle size={50} className="text-muted mb-2" />
// //                     <p>Image failed to load</p>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="border p-3 text-center">
// //                   <FaInfoCircle size={50} className="text-muted mb-2" />
// //                   <p>No image available</p>
// //                 </div>
// //               )}
// //             </Col>
// //           </Row>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={closePreviewModal}>
// //             Close
// //           </Button>
// //           <Button 
// //             variant="primary" 
// //             onClick={() => {
// //               closePreviewModal();
// //               downloadSingleHallTicket(previewStudent);
// //             }}
// //           >
// //             <FaDownload className="me-1" /> Download Hall Ticket
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     );
// //   };


// //   // Render upload tab
// //   const renderUploadTab = () => (
// //     <Row>
// //       <Col md={12}>
// //         <Card className="mb-4">
// //           <Card.Header>
// //             <FaFileExcel className="me-2" />
// //             Upload Student Data - GCC TBC
// //           </Card.Header>
// //           <Card.Body>
// //             <p className="mb-3">
// //               Upload an Excel file containing student data for GCC TBC hall ticket generation. The file should include the following fields:
// //             </p>
// //             <Row className="mb-4">
// //               <Col md={6}>
// //                 <ListGroup variant="flush" className="small">
// //                   <ListGroup.Item><strong>student_id</strong>: Seat number</ListGroup.Item>
// //                   <ListGroup.Item><strong>InstituteId</strong>: Institute code</ListGroup.Item>
// //                   <ListGroup.Item><strong>fullname</strong>: Student's full name</ListGroup.Item>
// //                   <ListGroup.Item><strong>mothername</strong>: Mother's name</ListGroup.Item>
// //                   <ListGroup.Item><strong>center</strong>: Center number</ListGroup.Item>
// //                   <ListGroup.Item><strong>subjectsId</strong>: Subject code</ListGroup.Item>
// //                 </ListGroup>
// //               </Col>
// //               <Col md={6}>
// //                 <ListGroup variant="flush" className="small">
// //                   <ListGroup.Item><strong>batchNo</strong>: Batch number</ListGroup.Item>
// //                   <ListGroup.Item><strong>batchdate</strong>: Exam date</ListGroup.Item>
// //                   <ListGroup.Item><strong>start_time</strong>: Exam start time</ListGroup.Item>
// //                   <ListGroup.Item><strong>password</strong>: Student password</ListGroup.Item>
// //                   <ListGroup.Item><strong>SUBNAME</strong>: Subject name</ListGroup.Item>
// //                   <ListGroup.Item><strong>base64</strong>: Student photo (base64)</ListGroup.Item>
// //                 </ListGroup>
// //               </Col>
// //             </Row>
// //             <Form.Group controlId="formFile" className="mb-3">
// //               <Form.Label>Select Excel File</Form.Label>
// //               <Form.Control 
// //                 type="file" 
// //                 accept=".xlsx, .xls" 
// //                 onChange={handleFileUpload}
// //                 disabled={fileLoading || uploadStatus === 'uploading'}
// //               />
// //               <Form.Text className="text-muted">
// //                 Only .xlsx or .xls files are supported
// //               </Form.Text>
// //             </Form.Group>
            
// //             {uploadStatus === 'selected' && (
// //               <Alert variant="info">
// //                 <FaInfoCircle className="me-2" />
// //                 File selected: {excelFile.name} ({(excelFile.size / 1024 / 1024).toFixed(2)} MB)
// //               </Alert>
// //             )}
            
// //             <div className="d-grid gap-2 d-md-flex justify-content-md-end">
// //               <Button 
// //                 variant="primary" 
// //                 onClick={uploadExcelFile}
// //                 disabled={fileLoading || !excelFile || uploadStatus === 'uploading'}
// //               >
// //                 {uploadStatus === 'uploading' ? (
// //                   <>
// //                     <Spinner animation="border" size="sm" className="me-2" />
// //                     Uploading...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <FaUpload className="me-2" />
// //                     Process Excel File
// //                   </>
// //                 )}
// //               </Button>
// //             </div>
// //           </Card.Body>
// //         </Card>
// //       </Col>
// //     </Row>
// //   );


// //   // Memoized student list - prevents unnecessary re-renders
// //   const StudentListItems = useMemo(() => {
// //     if (fileLoading) {
// //       return (
// //         <div className="text-center py-5">
// //           <Spinner animation="border" role="status">
// //             <span className="visually-hidden">Loading...</span>
// //           </Spinner>
// //           <p className="mt-3">Processing student data...</p>
// //         </div>
// //       );
// //     }

// //     if (filteredStudents.length === 0) {
// //       return (
// //         <div className="text-center py-5">
// //           <p className="text-muted">
// //             {students.length === 0 ? 
// //               'No student data available. Please upload an Excel file.' : 
// //               'No students match your filter criteria.'}
// //           </p>
// //         </div>
// //       );
// //     }

// //     return (
// //       <ListGroup variant="flush">
// //         {filteredStudents.map((student, index) => (
// //           <ListGroup.Item 
// //             key={`${student.seatNo}-${student.instituteId}-${index}`} 
// //             className="d-flex justify-content-between align-items-center"
// //           >
// //             <div>
// //               <strong>{student.candidateName}</strong>
// //               <div>
// //                 <small>Seat No: {student.seatNo}</small>
// //               </div>
// //               <div>
// //                 <small>Institute ID: {student.instituteId}</small>
// //               </div>
// //               <div>
// //                 <small>
// //                   Department: <Badge variant="primary" className="ms-1">
// //                     GCC TBC
// //                   </Badge>
// //                 </small>
// //               </div>
// //             </div>
// //             <div className="d-flex gap-2">
// //               <Button 
// //                 variant="outline-secondary" 
// //                 size="sm"
// //                 onClick={() => openPreview(student)}
// //               >
// //                 <FaEye className="me-1" />
// //                 Preview
// //               </Button>
// //               <Button 
// //                 variant="outline-primary" 
// //                 size="sm"
// //                 onClick={() => downloadSingleHallTicket(student)}
// //                 disabled={downloadLoading}
// //               >
// //                 <FaDownload className="me-1" />
// //                 {downloadLoading ? 'Downloading...' : 'Download'}
// //               </Button>
// //             </div>
// //           </ListGroup.Item>
// //         ))}
// //       </ListGroup>
// //     );
// //   }, [filteredStudents, fileLoading, students.length, downloadLoading, openPreview, downloadSingleHallTicket]);


// //   // Render generate tab
// //   const renderGenerateTab = () => (
// //     <Row>
// //       <Col md={4}>
// //         <Card className="mb-4">
// //           <Card.Header>
// //             <FaFilter className="me-2" />
// //             Filter Options - GCC TBC
// //           </Card.Header>
// //           <Card.Body>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Filter by Institute</Form.Label>
// //               <Form.Select 
// //                 value={selectedInstitute} 
// //                 onChange={(e) => filterStudentsByInstitute(e.target.value)}
// //                 disabled={institutes.length === 0}
// //               >
// //                 <option value="all">All Institutes ({totalStudents} students)</option>
// //                 {institutes.map(institute => (
// //                   <option key={institute} value={institute}>
// //                     Institute ID: {institute}
// //                   </option>
// //                 ))}
// //               </Form.Select>
// //             </Form.Group>

// //             <Form.Group className="mb-3">
// //               <Form.Label>
// //                 <FaSearch className="me-2" />
// //                 Search Students
// //               </Form.Label>
// //               <Form.Control 
// //                 ref={searchInputRef}
// //                 type="text" 
// //                 placeholder="Type name or seat number..." 
// //                 value={searchTerm}
// //                 onChange={handleSearch}
// //                 disabled={students.length === 0}
// //                 autoComplete="off"
// //                 onBlur={(e) => {
// //                   // Keep focus on input even after clicking elsewhere (except other inputs)
// //                   if (e.relatedTarget === null || e.relatedTarget?.tagName !== 'INPUT') {
// //                     // Small delay to allow other interactions to complete first
// //                     setTimeout(() => {
// //                       if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
// //                         // Only refocus if user was actively searching
// //                         if (searchTerm.length > 0) {
// //                           searchInputRef.current.focus();
// //                         }
// //                       }
// //                     }, 100);
// //                   }
// //                 }}
// //               />
// //               <div className="mt-2" style={{ minHeight: '20px' }}>
// //                 {searchTerm && searchTerm !== debouncedSearchTerm && (
// //                   <Form.Text className="text-info">
// //                     <Spinner animation="border" size="sm" className="me-1" />
// //                     <small>Searching...</small>
// //                   </Form.Text>
// //                 )}
// //                 {searchTerm && searchTerm === debouncedSearchTerm && filteredStudents.length > 0 && (
// //                   <Form.Text className="text-success">
// //                     <FaSearch className="me-1" />
// //                     <small>Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</small>
// //                   </Form.Text>
// //                 )}
// //                 {searchTerm && searchTerm === debouncedSearchTerm && filteredStudents.length === 0 && (
// //                   <Form.Text className="text-warning">
// //                     <FaInfoCircle className="me-1" />
// //                     <small>No students found</small>
// //                   </Form.Text>
// //                 )}
// //               </div>
// //             </Form.Group>
// //           </Card.Body>
// //         </Card>

// //         <Card>
// //           <Card.Header>
// //             <FaFileArchive className="me-2" />
// //             Generate Hall Tickets - GCC TBC
// //           </Card.Header>
// //           <Card.Body>
// //             <Button 
// //               variant="primary" 
// //               className="w-100 mb-3"
// //               onClick={downloadAllHallTickets}
// //               disabled={isProcessing || filteredStudents.length === 0}
// //             >
// //               {isProcessing ? (
// //                 <>
// //                   <Spinner animation="border" size="sm" className="me-2" />
// //                   Processing...
// //                 </>
// //               ) : (
// //                 <>
// //                   <FaDownload className="me-2" />
// //                   Download All Hall Tickets (ZIP)
// //                 </>
// //               )}
// //             </Button>
            
// //             {isProcessing && (
// //               <ProgressBar 
// //                 now={progress} 
// //                 label={`${progress}%`} 
// //                 animated 
// //                 className="mb-3" 
// //               />
// //             )}
            
// //             <div className="text-muted">
// //               <small>
// //                 This will generate PDFs for all {filteredStudents.length} GCC TBC student{filteredStudents.length !== 1 ? 's' : ''} and compress them into a ZIP file.
// //               </small>
// //             </div>
// //           </Card.Body>
// //         </Card>
// //       </Col>
      
// //       <Col md={8}>
// //         <Card>
// //           <Card.Header>
// //             <Row className="align-items-center">
// //               <Col>
// //                 <FaUniversity className="me-2" />
// //                 Student List - GCC TBC
// //               </Col>
// //               <Col className="text-end">
// //                 <Badge bg="primary">
// //                   {filteredStudents.length} of {totalStudents} students
// //                 </Badge>
// //               </Col>
// //             </Row>
// //           </Card.Header>
// //           <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
// //             {StudentListItems}
// //           </Card.Body>
// //         </Card>
// //       </Col>
// //     </Row>
// //   );


// //   return (
// //     <Container fluid className="mt-4">
// //       <Row className="align-items-center mb-4">
// //         <Col>
// //           <h2 className="mb-0">
// //             <FaFilePdf className="me-2" />
// //             Hall Tickets Generation - GCC TBC
// //           </h2>
// //         </Col>
// //         <Col xs="auto">
// //           <div className="d-flex align-items-center">
// //             <Badge bg="primary" className="fs-6 me-3">
// //               Department: GCC TBC
// //             </Badge>
// //             <Button 
// //               variant="outline-secondary" 
// //               size="sm"
// //               onClick={navigateToDepartmentSelection}
// //             >
// //               <FaArrowLeft className="me-1" />
// //               Change Department
// //             </Button>
// //           </div>
// //         </Col>
// //       </Row>

// //       {error && (
// //         <Alert variant="danger" dismissible onClose={() => setError(null)}>
// //           {error}
// //         </Alert>
// //       )}
// //       {success && (
// //         <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
// //           {success}
// //         </Alert>
// //       )}
      
// //       <Card className="mb-4">
// //         <Card.Header>
// //           <ul className="nav nav-tabs card-header-tabs">
// //             <li className="nav-item">
// //               <a 
// //                 className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`} 
// //                 href="#"
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   setActiveTab('upload');
// //                 }}
// //               >
// //                 <FaUpload className="me-2" />
// //                 Upload Data
// //               </a>
// //             </li>
// //             <li className="nav-item">
// //               <a 
// //                 className={`nav-link ${activeTab === 'generate' ? 'active' : ''} ${students.length === 0 ? 'disabled' : ''}`} 
// //                 href="#"
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   if (students.length > 0) {
// //                     setActiveTab('generate');
// //                   }
// //                 }}
// //               >
// //                 <FaFilePdf className="me-2" />
// //                 Generate Hall Tickets
// //                 {students.length > 0 && (
// //                   <Badge bg="light" text="dark" className="ms-2">{totalStudents}</Badge>
// //                 )}
// //               </a>
// //             </li>
// //           </ul>
// //         </Card.Header>
// //         <Card.Body>
// //           {activeTab === 'upload' ? renderUploadTab() : renderGenerateTab()}
// //         </Card.Body>
// //       </Card>
      
// //       {renderPreviewModal()}
// //     </Container>
// //   );
// // }

// // export default React.memo(GenerateGccTbcHallTickets);



// src/components/super-admin/GenerateGccTbcHallTickets.js
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Modal,
  Badge,
  Table
} from 'react-bootstrap';
import { 
  FaFilePdf, 
  FaFileExcel, 
  FaFileArchive, 
  FaDownload, 
  FaFilter, 
  FaSearch, 
  FaUniversity, 
  FaUpload,
  FaEye,
  FaInfoCircle,
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';



function GenerateGccTbcHallTickets() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  
  // Separate loading states to prevent search input from being disabled
  const [fileLoading, setFileLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  
  // New validation states
  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationSummary, setValidationSummary] = useState(null);



  // Define required fields mapping
  const requiredFields = {
    'student_id': 'Student ID / Seat Number',
    'InstituteId': 'Institute ID',
    'fullname': 'Full Name',
    'mothername': 'Mother Name',
    'center': 'Center Number',
    'subjectsId': 'Subject Code',
    'batchNo': 'Batch Number',
    'batchdate': 'Batch Date',
    'start_time': 'Exam Start Time',
    'password': 'Password',
    'SUBNAME': 'Subject Name',
    'base64': 'Student Photo (Base64)',
    'reporting_time': 'Reporting Time',
    'center_name': 'Center Name',
    'center_address': 'Center Address'
  };



  // Validation function
  const validateExcelData = useCallback((excelData) => {
    const errors = [];
    const fieldErrors = {};
    
    // Initialize field error counters
    Object.keys(requiredFields).forEach(field => {
      fieldErrors[field] = 0;
    });


    excelData.forEach((row, index) => {
      const rowNumber = index + 2; // Excel row number (accounting for header)
      const missingFields = [];
      
      // Check each required field
      Object.keys(requiredFields).forEach(field => {
        const value = row[field];
        
        // Check if field is missing, empty, null, or undefined
        if (value === null || value === undefined || value === '' || 
            (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(requiredFields[field]);
          fieldErrors[field]++;
        }
      });
      
      // If this row has missing fields, add to errors
      if (missingFields.length > 0) {
        errors.push({
          rowNumber,
          studentId: row['student_id'] || 'N/A',
          studentName: row['fullname'] || 'Unknown',
          missingFields
        });
      }
    });
    
    // Create summary
    const summary = {
      totalRows: excelData.length,
      errorCount: errors.length,
      successCount: excelData.length - errors.length,
      fieldErrors: Object.entries(fieldErrors)
        .filter(([_, count]) => count > 0)
        .map(([field, count]) => ({
          field: requiredFields[field],
          count
        }))
        .sort((a, b) => b.count - a.count)
    };
    
    return { errors, summary, isValid: errors.length === 0 };
  }, []);



  // Debounce effect for search term (300ms for fast response)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);


    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);



  // Memoized filtered students - only recalculates when dependencies change
  const filteredStudents = useMemo(() => {
    if (students.length === 0) return [];


    const term = debouncedSearchTerm.toLowerCase().trim();
    
    let filtered = students;


    // Filter by institute first
    if (selectedInstitute !== 'all') {
      filtered = filtered.filter(student => student.instituteId === selectedInstitute);
    }


    // Then filter by search term
    if (term) {
      filtered = filtered.filter(student => 
        student.candidateName.toLowerCase().includes(term) || 
        student.seatNo.toLowerCase().includes(term)
      );
    }


    return filtered;
  }, [debouncedSearchTerm, selectedInstitute, students]);



  // Memoized callback for file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setExcelFile(file);
    setUploadStatus('selected');
    // Clear previous validation errors
    setValidationErrors([]);
    setValidationSummary(null);
  }, []);



  // Upload Excel file to server
  const uploadExcelFile = useCallback(async () => {
    if (!excelFile) {
      setError('Please select an Excel file first');
      return;
    }


    try {
      setFileLoading(true);
      setError(null);
      setUploadStatus('uploading');
      
      const formData = new FormData();
      formData.append('excelFile', excelFile);
      
      const response = await axios.post('http://localhost:3000/upload-student-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadStatus('success');
      setSuccess('Excel file uploaded successfully!');
      readExcelFile(excelFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload Excel file. ' + (error.response?.data?.error || error.message));
      setUploadStatus('failed');
    } finally {
      setFileLoading(false);
    }
  }, [excelFile]);



  // Function to read Excel file locally for preview
  const readExcelFile = useCallback(async (file) => {
    try {
      setFileLoading(true);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);

          // Validate the data
          const validation = validateExcelData(excelData);
          
          if (!validation.isValid) {
            // Show validation errors
            setValidationErrors(validation.errors);
            setValidationSummary(validation.summary);
            setShowValidationModal(true);
            setError(`Validation failed: ${validation.errors.length} row(s) have missing or empty fields. Please check the validation report.`);
            setFileLoading(false);
            return;
          }

          const mappedStudents = excelData.map(row => ({
            seatNo: row['student_id']?.toString() || '',
            instituteId: row['InstituteId']?.toString() || '',
            candidateName: row['fullname'] || '',
            motherName: row['mothername'] || '',
            centerNo: row['center']?.toString() || '',
            handicap: row['Handicap'] || 'No',
            subjectCode: row['subjectsId']?.toString() || '',
            batch: row['batchNo']?.toString() || '',
            date: row['batchdate'] || '',
            examTime: row['start_time'] || '',
            password: row['password']?.toString() || '',
            instituteCode: row['InstituteId']?.toString() || '',
            subject: row['SUBNAME'] || '',
            reportingTime: row['reporting_time'] || '',
            examCenter: row['center_name'] || '',
            centerAddress: row['center_address'] || '',
            image: row["base64"] ? 
                (row["base64"].startsWith('data:') ? 
                  row["base64"] : 
                  `data:image/jpeg;base64,${row["base64"]}`
                ) : ''
          }));


          const uniqueInstitutes = [...new Set(mappedStudents.map(student => student.instituteId))];
          
          setStudents(mappedStudents);
          setInstitutes(uniqueInstitutes);
          setTotalStudents(mappedStudents.length);
          setSuccess('✓ Excel file validated and processed successfully! ' + mappedStudents.length + ' students loaded with all required fields.');
          setActiveTab('generate');
        } catch (error) {
          console.error('Excel processing error:', error);
          setError('Failed to process Excel file. Please check the format.');
        } finally {
          setFileLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      setError('Failed to read Excel file.');
      setFileLoading(false);
    }
  }, [validateExcelData]);



  // Memoized callback for institute filter
  const filterStudentsByInstitute = useCallback((instituteId) => {
    setSelectedInstitute(instituteId);
  }, []);



  // Memoized callback for search - CRITICAL: Never causes re-render of input
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);



  // Download single hall ticket - uses separate loading state
  const downloadSingleHallTicket = useCallback(async (student) => {
    try {
      console.log('Starting hall ticket download...');
      console.log('Student object received:', student);


      setDownloadLoading(true);
      setError(null);
      
      const url = `http://localhost:3000/download-student-hall-ticket/${student.seatNo}`;
      console.log('Generated download URL:', url);


      window.open(url, '_blank');
      
      const successMessage = `Hall ticket download initiated for student ID: ${student.seatNo}`;
      console.log(successMessage);
      setSuccess(successMessage);
    } catch (error) {
      console.error('Error downloading hall ticket:', error);
      setError(`Failed to download hall ticket: ${error.message}`);
    } finally {
      setDownloadLoading(false);
      console.log('Download function finished.');
    }
  }, []);



  // Download all hall tickets
  const downloadAllHallTickets = useCallback(async () => {
    try {
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


      window.open('http://localhost:3000/download-all-hall-tickets', '_blank');
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setSuccess('Hall tickets download initiated successfully!');
        setIsProcessing(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error downloading hall tickets:', error);
      setError(`Failed to download hall tickets: ${error.message}`);
      setIsProcessing(false);
    }
  }, []);



  // Show student preview
  const openPreview = useCallback((student) => {
    setPreviewStudent(student);
    setShowPreviewModal(true);
  }, []);



  // Close preview modal
  const closePreviewModal = useCallback(() => {
    setShowPreviewModal(false);
  }, []);
  
  
  
  // Close validation modal
  const closeValidationModal = useCallback(() => {
    setShowValidationModal(false);
  }, []);



  // Navigate back to department selection
  const navigateToDepartmentSelection = useCallback(() => {
    navigate('/super-admin/halltickets-department-selection');
  }, [navigate]);



  // Clear alerts after some time
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  
  
  
  // Render validation errors modal
  const renderValidationModal = () => {
    if (!validationSummary) return null;
    
    return (
      <Modal 
        show={showValidationModal} 
        onHide={closeValidationModal}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaExclamationTriangle className="me-2" />
            Excel Validation Failed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Summary Section */}
          <Alert variant="danger" className="mb-4">
            <Row>
              <Col md={4}>
                <div className="text-center">
                  <h4 className="mb-0">{validationSummary.totalRows}</h4>
                  <small>Total Rows</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <h4 className="mb-0 text-danger">{validationSummary.errorCount}</h4>
                  <small>Rows with Errors</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <h4 className="mb-0 text-success">{validationSummary.successCount}</h4>
                  <small>Valid Rows</small>
                </div>
              </Col>
            </Row>
          </Alert>
          
          {/* Field-wise Error Summary */}
          {validationSummary.fieldErrors.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <strong>Missing Fields Summary</strong>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Field Name</th>
                      <th className="text-center">Missing Count</th>
                      <th className="text-center">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationSummary.fieldErrors.map((fieldError, index) => (
                      <tr key={index}>
                        <td>{fieldError.field}</td>
                        <td className="text-center">
                          <Badge bg="danger">{fieldError.count}</Badge>
                        </td>
                        <td className="text-center">
                          {((fieldError.count / validationSummary.totalRows) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
          
          {/* Detailed Error List */}
          <Card>
            <Card.Header>
              <strong>Detailed Error Report ({validationErrors.length} rows)</strong>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {validationErrors.map((error, index) => (
                  <ListGroup.Item key={index} variant="danger">
                    <Row>
                      <Col md={3}>
                        <strong>Row {error.rowNumber}</strong>
                        <br />
                        <small className="text-muted">ID: {error.studentId}</small>
                        <br />
                        <small className="text-muted">{error.studentName}</small>
                      </Col>
                      <Col md={9}>
                        <strong>Missing Fields:</strong>
                        <div className="mt-2">
                          {error.missingFields.map((field, idx) => (
                            <Badge 
                              key={idx} 
                              bg="danger" 
                              className="me-2 mb-2"
                              style={{ fontSize: '0.85em' }}
                            >
                              <FaTimes className="me-1" />
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          
          {/* Instructions */}
          <Alert variant="info" className="mt-4 mb-0">
            <FaInfoCircle className="me-2" />
            <strong>How to fix:</strong> Please update your Excel file to fill in all missing fields for the rows listed above, then upload the file again.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeValidationModal}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              closeValidationModal();
              // Reset to allow new file upload
              setExcelFile(null);
              setUploadStatus(null);
              document.getElementById('formFile').value = '';
            }}
          >
            <FaUpload className="me-1" />
            Upload Corrected File
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };



  // Render student preview modal
  const renderPreviewModal = () => {
    if (!previewStudent) return null;
    
    return (
      <Modal 
        show={showPreviewModal} 
        onHide={closePreviewModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Preview - GCC TBC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <h5>{previewStudent.candidateName}</h5>
              <p><strong>Seat No:</strong> {previewStudent.seatNo}</p>
              <p><strong>Mother's Name:</strong> {previewStudent.motherName}</p>
              <p><strong>Institute ID:</strong> {previewStudent.instituteId}</p>
              <p><strong>Center No:</strong> {previewStudent.centerNo}</p>
              <p><strong>Subject:</strong> {previewStudent.subject} ({previewStudent.subjectCode})</p>
              <p><strong>Batch:</strong> {previewStudent.batch}</p>
              <p><strong>Date:</strong> {previewStudent.date}</p>
              <p><strong>Exam Time:</strong> {previewStudent.examTime}</p>
              <p><strong>Reporting Time:</strong> {previewStudent.reportingTime}</p>
              <p><strong>Exam Center:</strong> {previewStudent.examCenter}</p>
              <p><strong>Center Address:</strong> {previewStudent.centerAddress}</p>
              <p><strong>Password:</strong> {previewStudent.password}</p>
              <p><strong>Department:</strong> <Badge variant="primary">GCC TBC</Badge></p>
            </Col>
            <Col md={4} className="text-center">
              {previewStudent.image ? (
                <div>
                  <img 
                    src={previewStudent.image.startsWith('data:') ? 
                      previewStudent.image : 
                      `data:image/jpeg;base64,${previewStudent.image}`
                    } 
                    alt="Student" 
                    className="img-thumbnail" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                    onError={(e) => {
                      console.log('Image load error:', e);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="border p-3 text-center" style={{ display: 'none' }}>
                    <FaInfoCircle size={50} className="text-muted mb-2" />
                    <p>Image failed to load</p>
                  </div>
                </div>
              ) : (
                <div className="border p-3 text-center">
                  <FaInfoCircle size={50} className="text-muted mb-2" />
                  <p>No image available</p>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePreviewModal}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              closePreviewModal();
              downloadSingleHallTicket(previewStudent);
            }}
          >
            <FaDownload className="me-1" /> Download Hall Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };



  // Render upload tab
  const renderUploadTab = () => (
    <Row>
      <Col md={12}>
        <Card className="mb-4">
          <Card.Header>
            <FaFileExcel className="me-2" />
            Upload Student Data - GCC TBC
          </Card.Header>
          <Card.Body>
            <p className="mb-3">
              Upload an Excel file containing student data for GCC TBC hall ticket generation. The file should include the following fields:
            </p>
            <Row className="mb-4">
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>student_id</strong>: Seat number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>InstituteId</strong>: Institute code <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>fullname</strong>: Student's full name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>mothername</strong>: Mother's name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>center</strong>: Center number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>subjectsId</strong>: Subject code <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>batchNo</strong>: Batch number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>batchdate</strong>: Exam date <Badge bg="danger">Required</Badge></ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>start_time</strong>: Exam start time <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>password</strong>: Student password <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>SUBNAME</strong>: Subject name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>base64</strong>: Student photo (base64) <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>reporting_time</strong>: Reporting time <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>center_name</strong>: Center name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>center_address</strong>: Center address <Badge bg="danger">Required</Badge></ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            
            <Alert variant="warning">
              <FaExclamationTriangle className="me-2" />
              <strong>Important:</strong> All fields marked as "Required" must have values. Empty cells will cause validation errors.
            </Alert>
            
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select Excel File</Form.Label>
              <Form.Control 
                id="formFile"
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
                disabled={fileLoading || uploadStatus === 'uploading'}
              />
              <Form.Text className="text-muted">
                Only .xlsx or .xls files are supported
              </Form.Text>
            </Form.Group>
            
            {uploadStatus === 'selected' && (
              <Alert variant="info">
                <FaInfoCircle className="me-2" />
                File selected: {excelFile.name} ({(excelFile.size / 1024 / 1024).toFixed(2)} MB)
              </Alert>
            )}
            
            {validationSummary && validationSummary.errorCount === 0 && (
              <Alert variant="success">
                <FaCheckCircle className="me-2" />
                Last validation: All {validationSummary.totalRows} rows passed validation!
              </Alert>
            )}
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button 
                variant="primary" 
                onClick={uploadExcelFile}
                disabled={fileLoading || !excelFile || uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="me-2" />
                    Process Excel File
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );



  // Memoized student list - prevents unnecessary re-renders
  const StudentListItems = useMemo(() => {
    if (fileLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Processing student data...</p>
        </div>
      );
    }


    if (filteredStudents.length === 0) {
      return (
        <div className="text-center py-5">
          <p className="text-muted">
            {students.length === 0 ? 
              'No student data available. Please upload an Excel file.' : 
              'No students match your filter criteria.'}
          </p>
        </div>
      );
    }


    return (
      <ListGroup variant="flush">
        {filteredStudents.map((student, index) => (
          <ListGroup.Item 
            key={`${student.seatNo}-${student.instituteId}-${index}`} 
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{student.candidateName}</strong>
              <div>
                <small>Seat No: {student.seatNo}</small>
              </div>
              <div>
                <small>Institute ID: {student.instituteId}</small>
              </div>
              <div>
                <small>
                  Department: <Badge variant="primary" className="ms-1">
                    GCC TBC
                  </Badge>
                </small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => openPreview(student)}
              >
                <FaEye className="me-1" />
                Preview
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => downloadSingleHallTicket(student)}
                disabled={downloadLoading}
              >
                <FaDownload className="me-1" />
                {downloadLoading ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }, [filteredStudents, fileLoading, students.length, downloadLoading, openPreview, downloadSingleHallTicket]);



  // Render generate tab
  const renderGenerateTab = () => (
    <Row>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Header>
            <FaFilter className="me-2" />
            Filter Options - GCC TBC
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Filter by Institute</Form.Label>
              <Form.Select 
                value={selectedInstitute} 
                onChange={(e) => filterStudentsByInstitute(e.target.value)}
                disabled={institutes.length === 0}
              >
                <option value="all">All Institutes ({totalStudents} students)</option>
                {institutes.map(institute => (
                  <option key={institute} value={institute}>
                    Institute ID: {institute}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>
                <FaSearch className="me-2" />
                Search Students
              </Form.Label>
              <Form.Control 
                ref={searchInputRef}
                type="text" 
                placeholder="Type name or seat number..." 
                value={searchTerm}
                onChange={handleSearch}
                disabled={students.length === 0}
                autoComplete="off"
                onBlur={(e) => {
                  // Keep focus on input even after clicking elsewhere (except other inputs)
                  if (e.relatedTarget === null || e.relatedTarget?.tagName !== 'INPUT') {
                    // Small delay to allow other interactions to complete first
                    setTimeout(() => {
                      if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
                        // Only refocus if user was actively searching
                        if (searchTerm.length > 0) {
                          searchInputRef.current.focus();
                        }
                      }
                    }, 100);
                  }
                }}
              />
              <div className="mt-2" style={{ minHeight: '20px' }}>
                {searchTerm && searchTerm !== debouncedSearchTerm && (
                  <Form.Text className="text-info">
                    <Spinner animation="border" size="sm" className="me-1" />
                    <small>Searching...</small>
                  </Form.Text>
                )}
                {searchTerm && searchTerm === debouncedSearchTerm && filteredStudents.length > 0 && (
                  <Form.Text className="text-success">
                    <FaSearch className="me-1" />
                    <small>Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</small>
                  </Form.Text>
                )}
                {searchTerm && searchTerm === debouncedSearchTerm && filteredStudents.length === 0 && (
                  <Form.Text className="text-warning">
                    <FaInfoCircle className="me-1" />
                    <small>No students found</small>
                  </Form.Text>
                )}
              </div>
            </Form.Group>
          </Card.Body>
        </Card>


        <Card>
          <Card.Header>
            <FaFileArchive className="me-2" />
            Generate Hall Tickets - GCC TBC
          </Card.Header>
          <Card.Body>
            <Button 
              variant="primary" 
              className="w-100 mb-3"
              onClick={downloadAllHallTickets}
              disabled={isProcessing || filteredStudents.length === 0}
            >
              {isProcessing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FaDownload className="me-2" />
                  Download All Hall Tickets (ZIP)
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
                This will generate PDFs for all {filteredStudents.length} GCC TBC student{filteredStudents.length !== 1 ? 's' : ''} and compress them into a ZIP file.
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
                <FaUniversity className="me-2" />
                Student List - GCC TBC
              </Col>
              <Col className="text-end">
                <Badge bg="primary">
                  {filteredStudents.length} of {totalStudents} students
                </Badge>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {StudentListItems}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );



  return (
    <Container fluid className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="mb-0">
            <FaFilePdf className="me-2" />
            Hall Tickets Generation - GCC TBC
          </h2>
        </Col>
        <Col xs="auto">
          <div className="d-flex align-items-center">
            <Badge bg="primary" className="fs-6 me-3">
              Department: GCC TBC
            </Badge>
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


      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header>
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`} 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('upload');
                }}
              >
                <FaUpload className="me-2" />
                Upload Data
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === 'generate' ? 'active' : ''} ${students.length === 0 ? 'disabled' : ''}`} 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (students.length > 0) {
                    setActiveTab('generate');
                  }
                }}
              >
                <FaFilePdf className="me-2" />
                Generate Hall Tickets
                {students.length > 0 && (
                  <Badge bg="light" text="dark" className="ms-2">{totalStudents}</Badge>
                )}
              </a>
            </li>
          </ul>
        </Card.Header>
        <Card.Body>
          {activeTab === 'upload' ? renderUploadTab() : renderGenerateTab()}
        </Card.Body>
      </Card>
      
      {renderPreviewModal()}
      {renderValidationModal()}
    </Container>
  );
}

export default React.memo(GenerateGccTbcHallTickets);
