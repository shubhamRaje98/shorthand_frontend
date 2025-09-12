// src\components\super-admin\HallticketsGeneration.js
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
  Modal
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
  FaInfoCircle
} from 'react-icons/fa';
import * as XLSX from 'xlsx';

function HallticketsGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  
  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setExcelFile(file);
    setUploadStatus('selected');
  };

  // Upload Excel file to server
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
      
      // Upload file to server directly to localhost:3000
      const response = await axios.post('http://localhost:3001/upload-student-data', formData, {
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

          // Map Excel data to required format
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

          // Extract unique institutes
          const uniqueInstitutes = [...new Set(mappedStudents.map(student => student.instituteId))];
          
          setStudents(mappedStudents);
          setFilteredStudents(mappedStudents);
          setInstitutes(uniqueInstitutes);
          setTotalStudents(mappedStudents.length);
          setSuccess('Excel file processed successfully! ' + mappedStudents.length + ' students loaded.');
          setActiveTab('generate');
        } catch (error) {
          console.error('Excel processing error:', error);
          setError('Failed to process Excel file. Please check the format.');
        } finally {
          setLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      setError('Failed to read Excel file.');
      setLoading(false);
    }
  };

  // Filter students by institute ID
  const filterStudentsByInstitute = (instituteId) => {
    setSelectedInstitute(instituteId);
    
    if (instituteId === 'all') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => student.instituteId === instituteId);
      setFilteredStudents(filtered);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (selectedInstitute === 'all') {
      const filtered = students.filter(student => 
        student.candidateName.toLowerCase().includes(term) || 
        student.seatNo.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    } else {
      const filtered = students.filter(student => 
        student.instituteId === selectedInstitute && 
        (student.candidateName.toLowerCase().includes(term) || 
         student.seatNo.toLowerCase().includes(term))
      );
      setFilteredStudents(filtered);
    }
  };

  // Download single hall ticket
  const downloadSingleHallTicket = async (student) => {
    try {
      console.log('Starting hall ticket download...');
      console.log('Student object received:', student);

      setLoading(true);
      setError(null);
      
      const url = `http://localhost:3001/download-student-hall-ticket/${student.seatNo}`;
      console.log('Generated download URL:', url);

      // Open the download URL in a new tab
      window.open(url, '_blank');
      
      const successMessage = `Hall ticket download initiated for student ID: ${student.seatNo}`;
      console.log(successMessage);
      setSuccess(successMessage);
    } catch (error) {
      console.error('Error downloading hall ticket:', error);
      setError(`Failed to download hall ticket: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('Download function finished (loading false).');
    }
  };


  // Download all hall tickets
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

      // Open direct download link to localhost:3000
      window.open('http://localhost:3001/download-all-hall-tickets', '_blank');
      
      // Finish progress after a delay
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
  };

  // Show student preview
  const openPreview = (student) => {
    setPreviewStudent(student);
    setShowPreviewModal(true);
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

  // Render student preview modal
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
          <Modal.Title>Student Preview</Modal.Title>
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

  // Render upload tab
  const renderUploadTab = () => (
    <Row>
      <Col md={12}>
        <Card className="mb-4">
          <Card.Header>
            <FaFileExcel className="me-2" />
            Upload Student Data
          </Card.Header>
          <Card.Body>
            <p className="mb-3">
              Upload an Excel file containing student data for hall ticket generation. The file should include the following fields:
            </p>
            <Row className="mb-4">
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>student_id</strong>: Seat number</ListGroup.Item>
                  <ListGroup.Item><strong>InstituteId</strong>: Institute code</ListGroup.Item>
                  <ListGroup.Item><strong>fullname</strong>: Student's full name</ListGroup.Item>
                  <ListGroup.Item><strong>mothername</strong>: Mother's name</ListGroup.Item>
                  <ListGroup.Item><strong>center</strong>: Center number</ListGroup.Item>
                  <ListGroup.Item><strong>subjectsId</strong>: Subject code</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item><strong>batchNo</strong>: Batch number</ListGroup.Item>
                  <ListGroup.Item><strong>batchdate</strong>: Exam date</ListGroup.Item>
                  <ListGroup.Item><strong>start_time</strong>: Exam start time</ListGroup.Item>
                  <ListGroup.Item><strong>password</strong>: Student password</ListGroup.Item>
                  <ListGroup.Item><strong>SUBNAME</strong>: Subject name</ListGroup.Item>
                  <ListGroup.Item><strong>base64</strong>: Student photo (base64)</ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select Excel File</Form.Label>
              <Form.Control 
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
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button 
                variant="primary" 
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

  // Render generate tab
  const renderGenerateTab = () => (
    <Row>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Header>
            <FaFilter className="me-2" />
            Filter Options
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Filter by Institute</Form.Label>
              <Form.Select 
                value={selectedInstitute} 
                onChange={(e) => filterStudentsByInstitute(e.target.value)}
                disabled={loading || institutes.length === 0}
              >
                <option value="all">All Institutes</option>
                {institutes.map(institute => (
                  <option key={institute} value={institute}>
                    Institute ID: {institute}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Search Students</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Search by name or seat no" 
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
            Generate Hall Tickets
          </Card.Header>
          <Card.Body>
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
                This will generate PDFs for all students grouped by institute and compress them into a single ZIP file.
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
                Student List
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
                <p className="mt-3">Processing student data...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">
                  {students.length === 0 ? 
                    'No student data available. Please upload an Excel file.' : 
                    'No students match your filter criteria.'}
                </p>
              </div>
            ) : (
              <ListGroup variant="flush">
                {filteredStudents.map((student, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{student.candidateName}</strong>
                      <div>
                        <small>Seat No: {student.seatNo}</small>
                      </div>
                      <div>
                        <small>Institute ID: {student.instituteId}</small>
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
  );

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">
        <FaFilePdf className="me-2" />
        Hall Tickets Generation
      </h2>

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

export default HallticketsGeneration;