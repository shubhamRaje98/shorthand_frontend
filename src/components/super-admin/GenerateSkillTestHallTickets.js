// src/components/super-admin/GenerateSkillTestHallTickets.js
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
  FaCogs, 
  FaUpload,
  FaEye,
  FaInfoCircle,
  FaArrowLeft,
  FaTrash,
  FaExclamationTriangle,
  FaTimes,
  FaCheckCircle
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
  const [customization, setCustomization] = useState(null);
  
  // ✅ NEW: Validation states (from GCC TBC)
  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationSummary, setValidationSummary] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const departmentId = queryParams.get('departmentId');
  const qrType = queryParams.get('qrType') || 'both';
  
  // ✅ Required fields definition (from GCC TBC style)
  const requiredFields = {
    'APPLICATION_NUMBER': 'Application Number',
    'fullname': 'Full Name',
    'newname': 'Changed Name',
    'student_id': 'Seat Number',
    'photo': 'Photo Filename',
    'sign': 'Signature Filename',
    'center_name': 'Center Name',
    'center_address': 'Center Address',
    'subject_name': 'Subject Name',
    'disability': 'Disability Status',
    'disability_type': 'Disability Type',
    'batchdate': 'Batch Date',
    'reporting_time': 'Reporting Time',
    'gate_closure_time': 'Gate Closure Time',
    'batchNo': 'Batch Number',
    'start_time': 'Start Time'
  };
  
  useEffect(() => {
    const storedCustomization = JSON.parse(sessionStorage.getItem('hallticket_customization')) || null;
    setCustomization(storedCustomization);
    
    console.log('🔍 Component loaded with:');
    console.log('Department ID:', departmentId);
    console.log('QR Type:', qrType);
    console.log('Customization from sessionStorage:', storedCustomization);
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setExcelFile(file);
    setUploadStatus('selected');
    // Clear previous validation errors
    setValidationErrors([]);
    setValidationSummary(null);
  }, []);

  // ✅ UPDATED: Full validation function (GCC TBC style)
  const validateExcelData = useCallback((excelData) => {
    const errors = [];
    const fieldErrors = {};
    
    // Initialize field error counters
    Object.keys(requiredFields).forEach(field => {
      fieldErrors[field] = 0;
    });

    excelData.forEach((row, index) => {
      const rowNumber = index + 2; // Excel row (header = 1, data starts at 2)
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
          studentId: row['APPLICATION_NUMBER'] || row['student_id'] || 'N/A',
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
  }, [requiredFields]);

  const uploadExcelFile = async () => {
    if (!excelFile) {
      setError('Please select an Excel file first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setUploadStatus('uploading');
      
      const formData = new FormData();
      formData.append('excelFile', excelFile);
      
      const response = await axios.post('https://www.shorthandonlineexam.in/api/skilltest-halltickets/upload-skilltest-student-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ File uploaded to backend, now validating...');
      readExcelFile(excelFile);
    } catch (error) {
      console.error('Error uploading Skill Test file:', error);
      setError('Failed to upload Skill Test Excel file. ' + (error.response?.data?.error || error.message));
      setUploadStatus('failed');
      setLoading(false);
    }
  };

  const readExcelFile = async (file) => {
    try {
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);

          // ✅ VALIDATE Excel data (GCC TBC style)
          const validation = validateExcelData(excelData);
          
          if (!validation.isValid) {
            // Show validation errors in modal
            setValidationErrors(validation.errors);
            setValidationSummary(validation.summary);
            setShowValidationModal(true);
            setError(`Validation failed: ${validation.errors.length} row(s) have missing or empty fields. Please check the validation report.`);
            setLoading(false);
            setUploadStatus('failed');
            return;
          }

          // Validation passed - map data
          const mappedStudents = excelData.map(row => ({
            APPLICATION_NUMBER: row['APPLICATION_NUMBER']?.toString() || '',
            fullname: row['fullname'] || '',
            newname: row['newname'] || '',
            student_id: row['student_id']?.toString() || '',
            photo: row['photo'] || '',
            sign: row['sign'] || '',
            center_name: row['center_name'] || '',
            center_address: row['center_address'] || '',
            subject_name: row['subject_name'] || '',
            Subject: row['Subject'] || row['subject_name'] || '',
            disability: row['disability'] || 'No',
            disability_type: row['disability_type'] || '',
            batchdate: row['batchdate'] || '',
            reporting_time: row['reporting_time'] || '',
            gate_closure_time: row['gate_closure_time'] || '',
            batchNo: row['batchNo']?.toString() || '',
            start_time: row['start_time'] || '',
            examType: 'Skill Test'
          }));

          const uniqueCenters = [...new Set(mappedStudents.map(student => student.center_name))].filter(Boolean);
          
          setStudents(mappedStudents);
          setFilteredStudents(mappedStudents);
          setCenters(uniqueCenters);
          setTotalStudents(mappedStudents.length);
          setUploadStatus('success');
          setSuccess(`✅ Skill Test Excel file validated and processed successfully! ${mappedStudents.length} students loaded with all required fields.`);
          setActiveTab('generate');
          
        } catch (error) {
          console.error('Skill Test Excel processing error:', error);
          setError('Failed to process Skill Test Excel file. Please check the format.');
          setUploadStatus('failed');
        } finally {
          setLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading Skill Test Excel file:', error);
      setError('Failed to read Skill Test Excel file.');
      setUploadStatus('failed');
      setLoading(false);
    }
  };

  const filterStudentsByCenter = (centerName) => {
    setSelectedCenter(centerName);
    
    if (centerName === 'all') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => student.center_name === centerName);
      setFilteredStudents(filtered);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (selectedCenter === 'all') {
      const filtered = students.filter(student => 
        student.fullname.toLowerCase().includes(term) || 
        student.APPLICATION_NUMBER.toLowerCase().includes(term) ||
        student.student_id.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    } else {
      const filtered = students.filter(student => 
        student.center_name === selectedCenter && 
        (student.fullname.toLowerCase().includes(term) || 
         student.APPLICATION_NUMBER.toLowerCase().includes(term) ||
         student.student_id.toLowerCase().includes(term))
      );
      setFilteredStudents(filtered);
    }
  };

  const downloadSingleHallTicket = async (student) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `https://www.shorthandonlineexam.in/api/skilltest-halltickets/download-skilltest-hall-ticket/${student.APPLICATION_NUMBER}?departmentId=${departmentId}&qrType=${qrType}`,
        { customization },
        { 
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const safeFullName = (student.fullname || '').replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').trim();
      const safeSubject = (student.Subject || '').replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').trim();
      const singleFilename = safeSubject
        ? `${student.APPLICATION_NUMBER}_${safeFullName}_${safeSubject}.pdf`
        : `${student.APPLICATION_NUMBER}_${safeFullName}.pdf`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', singleFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess(`✅ Hall ticket downloaded for application No: ${student.APPLICATION_NUMBER}`);
    } catch (error) {
      console.error('❌ Error downloading hall ticket:', error);
      setError('Failed to download hall ticket: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadAllHallTickets = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 500);

      const response = await axios.post(
        `https://www.shorthandonlineexam.in/api/skilltest-halltickets/download-all-skilltest-hall-tickets?departmentId=${departmentId}&qrType=${qrType}`,
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
      setError('Failed to download hall tickets: ' + (error.response?.data?.error || error.message));
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
    sessionStorage.removeItem('hallticket_customization');
    setCustomization(null);
    setSuccess('✅ Customization cleared. Using default hall ticket now.');
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

  // ✅ NEW: Validation Modal (from GCC TBC)
  const renderValidationModal = () => {
    if (!validationSummary) return null;
    
    return (
      <Modal 
        show={showValidationModal} 
        onHide={() => setShowValidationModal(false)}
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
          <Button variant="secondary" onClick={() => setShowValidationModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowValidationModal(false);
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
              <p><strong>Application No:</strong> {previewStudent.APPLICATION_NUMBER}</p>
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
              <p><strong>Department:</strong> <Badge bg="success">Skill Test</Badge></p>
            </Col>
            <Col md={4} className="text-center">
              <div className="border p-3 text-center">
                {previewStudent.photo ? (
                  <img
                    src={`https://www.shorthandonlineexam.in/assets/skilltest/Photo%20Sign%2012%20tribal/photo_new/${encodeURIComponent(previewStudent.photo)}`}
                    alt="Student Photo"
                    style={{ width: '100px', height: '120px', objectFit: 'cover', border: '1px solid #ccc', marginBottom: '8px' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                ) : null}
                <p style={{ display: previewStudent.photo ? 'none' : 'block', color: '#888' }}>No Photo</p>
                <small className="text-muted d-block mb-2">Photo: {previewStudent.photo || 'Not available'}</small>
                {previewStudent.sign ? (
                  <img
                    src={`https://www.shorthandonlineexam.in/assets/skilltest/Photo%20Sign%2012%20tribal/Sign_new/${encodeURIComponent(previewStudent.sign)}`}
                    alt="Student Signature"
                    style={{ width: '100px', height: '40px', objectFit: 'contain', border: '1px solid #ccc', marginBottom: '4px' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                ) : null}
                <p style={{ display: previewStudent.sign ? 'none' : 'block', color: '#888' }}>No Signature</p>
                <small className="text-muted d-block">Signature: {previewStudent.sign || 'Not available'}</small>
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
                  <ListGroup.Item><strong>APPLICATION_NUMBER</strong>: Application number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>fullname</strong>: Student's full name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>newname</strong>: Changed name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>student_id</strong>: Seat number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>photo</strong>: Photo filename <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>sign</strong>: Signature filename <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>center_name</strong>: Exam center name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>center_address</strong>: Center address <Badge bg="danger">Required</Badge></ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>subject_name</strong>: Subject name <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>disability</strong>: Disability status <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>disability_type</strong>: Disability type <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>batchdate</strong>: Exam date <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>reporting_time</strong>: Reporting time <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>gate_closure_time</strong>: Gate closure time <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>batchNo</strong>: Batch number <Badge bg="danger">Required</Badge></ListGroup.Item>
                  <ListGroup.Item><strong>start_time</strong>: Exam start time <Badge bg="danger">Required</Badge></ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            
            <Alert variant="warning">
              <FaExclamationTriangle className="me-2" />
              <strong>Important:</strong> All fields marked as "Required" must have values. Empty cells will cause validation errors.
            </Alert>
            
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select Excel File for Skill Test</Form.Label>
              <Form.Control 
                id="formFile"
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
                disabled={loading || uploadStatus === 'uploading'}
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
                  Download All Hall Tickets
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
                This will generate hall tickets for all {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}.
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
                <Badge bg="success">
                  {filteredStudents.length} of {totalStudents} students
                </Badge>
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
                        <small>Application No: {student.APPLICATION_NUMBER}</small>
                      </div>
                      <div>
                        <small>Seat No: {student.student_id}</small>
                      </div>
                      <div>
                        <small>Center: {student.center_name}</small>
                      </div>
                      <div>
                        <small>
                          Department: <Badge bg="success" className="ms-1">
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
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="mb-0">
            <FaFilePdf className="me-2" />
            Hall Tickets Generation - Skill Test
          </h2>
        </Col>
        <Col xs="auto">
          <div className="d-flex align-items-center gap-2">
            <Badge bg="success" className="fs-6">
              Department: Skill Test
            </Badge>
            {departmentId && (
              <Badge bg="info" className="fs-6">
                Department ID: {departmentId}
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

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

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
      {/* ✅ NEW: Validation Modal */}
      {renderValidationModal()}
    </Container>
  );
}

export default GenerateSkillTestHallTickets;
