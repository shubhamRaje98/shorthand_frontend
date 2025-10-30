// src/components/super-admin/GenerateSkillTestHallTicketsFromDB.js
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
  FaFileArchive, 
  FaDownload, 
  FaFilter, 
  FaSearch, 
  FaDatabase,
  FaEye,
  FaInfoCircle,
  FaArrowLeft,
  FaTrash
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

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
  // ✅ NEW: State to track customization
  const [customization, setCustomization] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const departmentId = queryParams.get('departmentId');
  const qrType = queryParams.get('qrType') || 'both';
  
  // ✅ Initialize customization from sessionStorage
  useEffect(() => {
    const storedCustomization = JSON.parse(sessionStorage.getItem('hallticket_customization')) || null;
    setCustomization(storedCustomization);
    
    console.log('🔍 Component loaded with:');
    console.log('Department ID:', departmentId);
    console.log('QR Type:', qrType);
    console.log('Customization from sessionStorage:', storedCustomization);
  }, []);

  // Load initial data on component mount
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
        `http://localhost:3000/api/skilltest-halltickets/db/centers?departmentId=${departmentId}`
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
        `http://localhost:3000/api/skilltest-halltickets/db/batches?departmentId=${departmentId}`
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

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!departmentId) {
        setError('Department ID is required');
        setLoading(false);
        return;
      }

      let url = `http://localhost:3000/api/skilltest-halltickets/db/students?departmentId=${departmentId}`;
      
      if (selectedCenter !== 'all') {
        url += `&center=${selectedCenter}`;
      }
      if (selectedBatch !== 'all') {
        url += `&batchNo=${selectedBatch}`;
      }
      if (searchTerm) {
        url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      }

      console.log('Fetching students with URL:', url);

      const response = await axios.get(url);
      
      if (response.data.success) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
        setTotalStudents(response.data.data.length);
        setSuccess(`Loaded ${response.data.data.length} students from database for department ${departmentId}`);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Failed to load students from database: ' + (error.response?.data?.message || error.message));
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
  }, [selectedCenter, selectedBatch, searchTerm]);

  const downloadSingleHallTicket = async (student) => {
    try {
      console.log('🚀 Starting DB hall ticket download...');
      console.log('Student ID:', student.student_id);
      console.log('Department ID:', departmentId);
      console.log('QR Type:', qrType);
      console.log('Customization:', customization);

      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `http://localhost:3000/api/skilltest-halltickets/db/download-hall-ticket/${student.student_id}?departmentId=${departmentId}&qrType=${qrType}`,
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
      console.log('Department ID:', departmentId);
      console.log('QR Type:', qrType);
      console.log('Customization:', customization);

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

      let url = `http://localhost:3000/api/skilltest-halltickets/db/download-all-hall-tickets?departmentId=${departmentId}&qrType=${qrType}`;
      
      if (selectedCenter !== 'all') {
        url += `&center=${selectedCenter}`;
      }
      if (selectedBatch !== 'all') {
        url += `&batchNo=${selectedBatch}`;
      }

      console.log('Bulk download URL:', url);
      
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
        console.log('✅ Bulk download successful');
        console.log('Folder:', response.data.folderPath);
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

  // ✅ FIXED: Clear customization without reload
  const clearCustomization = () => {
    console.log('🗑️ Clearing customization...');
    sessionStorage.removeItem('hallticket_customization');
    setCustomization(null); // ✅ Update state immediately
    setSuccess('✅ Customization cleared. Using default hall ticket now.');
    console.log('✅ Customization cleared');
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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
          <Modal.Title>Student Preview - Database</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <h5>{previewStudent.fullname}</h5>
              <p><strong>Student ID (Seat No):</strong> {previewStudent.student_id}</p>
              <p><strong>Application No:</strong> {previewStudent.APPLICATION_NUMBER}</p>
              <p><strong>Changed Name:</strong> {previewStudent.newname}</p>
              <p><strong>Center:</strong> {previewStudent.center_name}</p>
              <p><strong>Center Address:</strong> {previewStudent.center_address}</p>
              <p><strong>Subject:</strong> {previewStudent.subject_name}</p>
              <p><strong>Disability:</strong> {previewStudent.disability}</p>
              <p><strong>Disability Type:</strong> {previewStudent.disability_type}</p>
              <p><strong>Exam Date:</strong> {previewStudent.batchdate}</p>
              <p><strong>Batch No:</strong> {previewStudent.batchNo}</p>
              <p><strong>Start Time:</strong> {previewStudent.start_time}</p>
              <p><strong>Reporting Time:</strong> {previewStudent.reporting_time}</p>
              <p><strong>Gate Closure Time:</strong> {previewStudent.gate_closure_time}</p>
              <p><strong>Department:</strong> <Badge bg="info" className="ms-1">Database Source</Badge></p>
              {departmentId && (
                <p><strong>Department ID:</strong> {departmentId}</p>
              )}
            </Col>
            <Col md={4} className="text-center">
              <div className="border p-3 text-center">
                <FaDatabase size={50} className="text-info mb-2" />
                <p>From Database</p>
                <small className="text-muted">
                  Photo: {previewStudent.photoBase64 ? 'Available' : 'Not available'}
                </small>
                <br />
                <small className="text-muted">
                  Signature: {previewStudent.signBase64 ? 'Available' : 'Not available'}
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
            variant="primary" 
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

  return (
    <Container fluid className="mt-4">
      {/* Header with Department Info */}
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
            {/* ✅ FIXED: Show customization status with clear button */}
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
                    Will download hall tickets for all students matching current filters.
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
                  <p className="mt-3">Loading students from database...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-5">
                  <FaInfoCircle size={50} className="text-muted mb-3" />
                  <p className="text-muted">
                    {students.length === 0 ? 
                      'No student data found in database for selected filters.' : 
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
    </Container>
  );
}

export default GenerateSkillTestHallTicketsFromDB;
