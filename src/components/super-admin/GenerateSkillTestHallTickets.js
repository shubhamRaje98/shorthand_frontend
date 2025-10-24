// // src/components/super-admin/GenerateSkillTestHallTickets.js
// import React from 'react';
// import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
// import { FaCogs, FaArrowLeft, FaTools } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// function GenerateSkillTestHallTickets() {
//   const navigate = useNavigate();

//   const navigateToDepartmentSelection = () => {
//     navigate('/super-admin/halltickets-department-selection');
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row className="align-items-center mb-4">
//         <Col>
//           <h2 className="mb-0">
//             <FaCogs className="me-2" />
//             Skill Test Hall Tickets Generation
//           </h2>
//         </Col>
//         <Col xs="auto">
//           <div className="d-flex align-items-center">
//             <span className="badge bg-success fs-6 me-3">
//               Department: Skill Test
//             </span>
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

//       <Alert variant="info" className="mb-4">
//         <FaTools className="me-2" />
//         <strong>Skill Test Hall Ticket Generation</strong> - This module is currently under development. 
//         The functionality for generating Skill Test hall tickets will be implemented separately with 
//         department-specific fields and logic.
//       </Alert>

//       <Row className="justify-content-center">
//         <Col md={8}>
//           <Card className="text-center">
//             <Card.Header>
//               <h4 className="mb-0">Coming Soon</h4>
//             </Card.Header>
//             <Card.Body className="p-5">
//               <FaCogs size={80} className="text-muted mb-4" />
//               <h5 className="text-muted">Skill Test Hall Ticket Generation</h5>
//               <p className="text-muted mb-4">
//                 This module will have completely separate form fields, logic, and hall ticket 
//                 structure specifically designed for the Skill Test department requirements.
//               </p>
//               <Button 
//                 variant="success" 
//                 onClick={navigateToDepartmentSelection}
//                 className="me-3"
//               >
//                 Back to Department Selection
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default GenerateSkillTestHallTickets;


// src/components/super-admin/GenerateSkillTestHallTickets.js
import React, { useState, useEffect } from 'react';
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
  Badge
} from 'react-bootstrap';
import { 
  FaFilePdf, 
  FaFileExcel, 
  FaFileArchive, 
  FaDownload, 
  FaFilter, 
  FaSearch, 
  FaCogs, 
  FaUpload,
  FaEye,
  FaInfoCircle,
  FaArrowLeft
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate, useLocation } from 'react-router-dom';

function GenerateSkillTestHallTickets() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');

  // Get department ID from URL params if available
  const queryParams = new URLSearchParams(location.search);
  const departmentId = queryParams.get('departmentId');

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setExcelFile(file);
    setUploadStatus('selected');
  };

  // Upload Excel file to server for Skill Test
  const uploadExcelFile = async () => {
    if (!excelFile) {
      setError('Please select an Excel file first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadStatus('uploading');
      
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append('excelFile', excelFile);
      
      // Upload file to server for Skill Test
      const response = await axios.post('http://localhost:3000/api/skilltest-halltickets/upload-skilltest-student-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadStatus('success');
      setSuccess('Skill Test Excel file uploaded successfully!');
      readExcelFile(excelFile);
    } catch (error) {
      console.error('Error uploading Skill Test file:', error);
      setError('Failed to upload Skill Test Excel file. ' + (error.response?.data?.error || error.message));
      setUploadStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  // Function to read Excel file locally for preview
  const readExcelFile = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);

          // Map Excel data to required format for Skill Test
          const mappedStudents = excelData.map(row => ({
            applicationNo: row['APPLICATION_NUMBER']?.toString() || '',
            fullname: row['fullname'] || '',
            newname: row['newname'] || '',
            student_id: row['student_id']?.toString() || '',
            photo: row['photo'] || '',
            sign: row['sign'] || '',
            center_name: row['center_name'] || '',
            center_address: row['center_address'] || '',
            subject_name: row['subject_name'] || '',
            disability: row['disability'] || 'No',
            disability_type: row['disability_type'] || '',
            batchdate: row['batchdate'] || '',
            reporting_time: row['reporting_time'] || '',
            gate_closure_time: row['gate_closure_time'] || '',
            batchNo: row['batchNo']?.toString() || '',
            start_time: row['start_time'] || '',
            examType: 'Skill Test'
          }));

          // Extract unique centers
          const uniqueCenters = [...new Set(mappedStudents.map(student => student.center_name))].filter(Boolean);
          
          setStudents(mappedStudents);
          setFilteredStudents(mappedStudents);
          setCenters(uniqueCenters);
          setTotalStudents(mappedStudents.length);
          setSuccess('Skill Test Excel file processed successfully! ' + mappedStudents.length + ' students loaded.');
          setActiveTab('generate');
        } catch (error) {
          console.error('Skill Test Excel processing error:', error);
          setError('Failed to process Skill Test Excel file. Please check the format.');
        } finally {
          setLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading Skill Test Excel file:', error);
      setError('Failed to read Skill Test Excel file.');
      setLoading(false);
    }
  };

  // Filter students by center
  const filterStudentsByCenter = (centerName) => {
    setSelectedCenter(centerName);
    
    if (centerName === 'all') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => student.center_name === centerName);
      setFilteredStudents(filtered);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (selectedCenter === 'all') {
      const filtered = students.filter(student => 
        student.fullname.toLowerCase().includes(term) || 
        student.applicationNo.toLowerCase().includes(term) ||
        student.student_id.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    } else {
      const filtered = students.filter(student => 
        student.center_name === selectedCenter && 
        (student.fullname.toLowerCase().includes(term) || 
         student.applicationNo.toLowerCase().includes(term) ||
         student.student_id.toLowerCase().includes(term))
      );
      setFilteredStudents(filtered);
    }
  };

  // Download single Skill Test hall ticket
  const downloadSingleHallTicket = async (student) => {
    try {
      console.log('Starting Skill Test hall ticket download...');
      console.log('Student object received:', student);

      setLoading(true);
      setError(null);
      
      const url = `http://localhost:3000/api/skilltest-halltickets/download-skilltest-hall-ticket/${student.applicationNo}`;
      console.log('Generated Skill Test download URL:', url);

      // Open the download URL in a new tab
      window.open(url, '_blank');
      
      const successMessage = `Skill Test hall ticket download initiated for application No: ${student.applicationNo}`;
      console.log(successMessage);
      setSuccess(successMessage);
    } catch (error) {
      console.error('Error downloading Skill Test hall ticket:', error);
      setError(`Failed to download Skill Test hall ticket: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('Skill Test download function finished (loading false).');
    }
  };

  // Download all Skill Test hall tickets
  const downloadAllHallTickets = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Open direct download link for Skill Test
      window.open('http://localhost:3000/api/skilltest-halltickets/download-all-skilltest-hall-tickets', '_blank');
      
      // Finish progress after a delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setSuccess('Skill Test hall tickets download initiated successfully!');
        setIsProcessing(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error downloading Skill Test hall tickets:', error);
      setError(`Failed to download Skill Test hall tickets: ${error.message}`);
      setIsProcessing(false);
    }
  };

  // Show student preview
  const openPreview = (student) => {
    setPreviewStudent(student);
    setShowPreviewModal(true);
  };

  // Navigate back to department selection
  const navigateToDepartmentSelection = () => {
    navigate('/super-admin/halltickets-department-selection');
  };

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

  // Render student preview modal for Skill Test
  const renderPreviewModal = () => {
    if (!previewStudent) return null;
    
    return (
      <Modal 
        show={showPreviewModal} 
        onHide={() => setShowPreviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Preview - Skill Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <h5>{previewStudent.fullname}</h5>
              <p><strong>Application No:</strong> {previewStudent.applicationNo}</p>
              <p><strong>Seat No:</strong> {previewStudent.student_id}</p>
              <p><strong>Changed Name:</strong> {previewStudent.newname || 'N/A'}</p>
              <p><strong>Center:</strong> {previewStudent.center_name}</p>
              <p><strong>Center Address:</strong> {previewStudent.center_address}</p>
              <p><strong>Subject:</strong> {previewStudent.subject_name}</p>
              <p><strong>Disability:</strong> {previewStudent.disability}</p>
              <p><strong>Disability Type:</strong> {previewStudent.disability_type}</p>
              <p><strong>Batch Date:</strong> {previewStudent.batchdate}</p>
              <p><strong>Batch No:</strong> {previewStudent.batchNo}</p>
              <p><strong>Start Time:</strong> {previewStudent.start_time}</p>
              <p><strong>Reporting Time:</strong> {previewStudent.reporting_time}</p>
              <p><strong>Gate Closure Time:</strong> {previewStudent.gate_closure_time}</p>
              <p><strong>Department:</strong> <Badge variant="success" className="ms-1">Skill Test</Badge></p>
              {departmentId && (
                <p><strong>Department ID:</strong> {departmentId}</p>
              )}
            </Col>
            <Col md={4} className="text-center">
              <div className="border p-3 text-center">
                <FaCogs size={50} className="text-success mb-2" />
                <p>Skill Test Student</p>
                <small className="text-muted">
                  Photo: {previewStudent.photo || 'Not available'}
                </small>
                <br />
                <small className="text-muted">
                  Signature: {previewStudent.sign || 'Not available'}
                </small>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
          <Button 
            variant="success" 
            onClick={() => {
              setShowPreviewModal(false);
              downloadSingleHallTicket(previewStudent);
            }}
          >
            <FaDownload className="me-1" /> Download Hall Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Render upload tab for Skill Test
  const renderUploadTab = () => (
    <Row>
      <Col md={12}>
        <Card className="mb-4">
          <Card.Header>
            <FaFileExcel className="me-2" />
            Upload Student Data - Skill Test
          </Card.Header>
          <Card.Body>
            <p className="mb-3">
              Upload an Excel file containing student data for Skill Test hall ticket generation. The file should include the following fields:
            </p>
            <Row className="mb-4">
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>APPLICATION_NUMBER</strong>: Application number</ListGroup.Item>
                  <ListGroup.Item><strong>fullname</strong>: Student's full name</ListGroup.Item>
                  <ListGroup.Item><strong>newname</strong>: Changed name (if any)</ListGroup.Item>
                  <ListGroup.Item><strong>student_id</strong>: Seat number</ListGroup.Item>
                  <ListGroup.Item><strong>photo</strong>: Photo filename</ListGroup.Item>
                  <ListGroup.Item><strong>sign</strong>: Signature filename</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>center_name</strong>: Exam center name</ListGroup.Item>
                  <ListGroup.Item><strong>center_address</strong>: Center address</ListGroup.Item>
                  <ListGroup.Item><strong>subject_name</strong>: Subject name</ListGroup.Item>
                  <ListGroup.Item><strong>disability</strong>: Disability status</ListGroup.Item>
                  <ListGroup.Item><strong>disability_type</strong>: Type of disability</ListGroup.Item>
                  <ListGroup.Item><strong>batchdate</strong>: Exam date</ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select Excel File for Skill Test</Form.Label>
              <Form.Control 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
                disabled={loading || uploadStatus === 'uploading'}
              />
              <Form.Text className="text-muted">
                Only .xlsx or .xls files are supported. Must include Skill Test specific fields.
              </Form.Text>
            </Form.Group>
            
            {uploadStatus === 'selected' && (
              <Alert variant="info">
                <FaInfoCircle className="me-2" />
                File selected: {excelFile.name} ({(excelFile.size / 1024 / 1024).toFixed(2)} MB)
              </Alert>
            )}
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button 
                variant="success" 
                onClick={uploadExcelFile}
                disabled={loading || !excelFile || uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="me-2" />
                    Process Skill Test Excel File
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Render generate tab for Skill Test
  const renderGenerateTab = () => (
    <Row>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Header>
            <FaFilter className="me-2" />
            Filter Options - Skill Test
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Filter by Center</Form.Label>
              <Form.Select 
                value={selectedCenter} 
                onChange={(e) => filterStudentsByCenter(e.target.value)}
                disabled={loading || centers.length === 0}
              >
                <option value="all">All Centers</option>
                {centers.map(center => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Search Students</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Search by name, application no, or seat no" 
                value={searchTerm}
                onChange={handleSearch}
                disabled={loading || students.length === 0}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <FaFileArchive className="me-2" />
            Generate Hall Tickets - Skill Test
          </Card.Header>
          <Card.Body>
            <Button 
              variant="success" 
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
                This will generate PDFs for all Skill Test students grouped by center and compress them into a single ZIP file.
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
                <FaCogs className="me-2" />
                Student List - Skill Test
              </Col>
              <Col className="text-end">
                <small>
                  {filteredStudents.length} of {totalStudents} students
                </small>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Processing Skill Test student data...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">
                  {students.length === 0 ? 
                    'No Skill Test student data available. Please upload an Excel file.' : 
                    'No Skill Test students match your filter criteria.'}
                </p>
              </div>
            ) : (
              <ListGroup variant="flush">
                {filteredStudents.map((student, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{student.fullname}</strong>
                      <div>
                        <small>Application No: {student.applicationNo}</small>
                      </div>
                      <div>
                        <small>Seat No: {student.student_id}</small>
                      </div>
                      <div>
                        <small>Center: {student.center_name}</small>
                      </div>
                      <div>
                        <small>
                          Department: <Badge variant="success" className="ms-1">
                            Skill Test
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
                        variant="outline-success" 
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
  );

  return (
    <Container fluid className="mt-4">
      {/* Header with Department Info */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="mb-0">
            <FaFilePdf className="me-2" />
            Hall Tickets Generation - Skill Test
          </h2>
        </Col>
        <Col xs="auto">
          <div className="d-flex align-items-center">
            <Badge variant="success" className="fs-6 me-3">
              Department: Skill Test
            </Badge>
            {departmentId && (
              <Badge variant="info" className="fs-6 me-3">
                Department ID: {departmentId}
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

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

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
              </a>
            </li>
          </ul>
        </Card.Header>
        <Card.Body>
          {activeTab === 'upload' ? renderUploadTab() : renderGenerateTab()}
        </Card.Body>
      </Card>

      {renderPreviewModal()}
    </Container>
  );
}

export default GenerateSkillTestHallTickets;