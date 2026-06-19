// src/components/super-admin/HallticketsDepartmentSelection.js
import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaUniversity, FaCogs, FaArrowRight, FaDatabase, FaCheckCircle, FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomizationChoiceModal from './CustomizationChoiceModal'; // ✅ Import
import HallTicketCustomizationModal from './HallTicketCustomizationModal'; // ✅ Import


function HallticketsDepartmentSelection() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [detectedExamType, setDetectedExamType] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');


  // QR Code Selection Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRType, setSelectedQRType] = useState('both');
  const [pendingNavigation, setPendingNavigation] = useState(null);


  // ✅ NEW: Customization Modals State
  const [showCustomizationChoiceModal, setShowCustomizationChoiceModal] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customizationData, setCustomizationData] = useState(null);


  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/hallticket-departments/departments');

        if (response.data.success) {
          setDepartments(response.data.data);
        } else {
          setError('Failed to fetch departments');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Error loading departments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);


  const handleDepartmentSelect = (departmentId) => {
    if (!departmentId) {
      setSelectedDepartment('');
      setDetectedExamType('');
      return;
    }

    setSelectedDepartment(departmentId);

    try {
      const selectedDept = departments.find(dept => dept.departmentId.toString() === departmentId);

      if (selectedDept && selectedDept.examType) {
        setDetectedExamType(selectedDept.examType);
        setError('');
      } else {
        setError('Exam type not found for selected department');
        setDetectedExamType('');
      }
    } catch (err) {
      console.error('Error processing department selection:', err);
      setError('Error processing selection. Please try again.');
      setDetectedExamType('');
    }
  };


  // ✅ UPDATED: Show QR Modal for Excel Upload with Exam Type Check
  const handleProceedToHallTickets = () => {
    if (!selectedDepartment || !detectedExamType) {
      alert('Please select a valid department first');
      return;
    }

    setPendingNavigation({ type: 'excel', examType: detectedExamType, departmentId: selectedDepartment });
    
    // ✅ NEW: Check exam type - skip modals for GCC
    if (detectedExamType === 'GCC') {
      console.log('📌 GCC Exam Type - Skipping QR and Customization modals');
      setSelectedQRType('both'); // Set default QR type for GCC
      proceedToGeneration(null); // Direct navigation without modals
    } else if (detectedExamType === 'SKILL') {
      console.log('📌 SKILL Exam Type - Showing QR modal');
      setShowQRModal(true); // Show QR modal only for SKILL
    }
  };


  // ✅ UPDATED: Show QR Modal for Database Generation with Exam Type Check
  const handleGenerateFromDatabase = () => {
    if (!selectedDepartment || !detectedExamType) {
      alert('Please select a valid department first');
      return;
    }

    setPendingNavigation({ type: 'database', examType: detectedExamType, departmentId: selectedDepartment });
    
    // ✅ NEW: Check exam type - skip modals for GCC
    if (detectedExamType === 'GCC') {
      console.log('📌 GCC Exam Type - Skipping QR and Customization modals');
      setSelectedQRType('both'); // Set default QR type for GCC
      proceedToGeneration(null); // Direct navigation without modals
    } else if (detectedExamType === 'SKILL') {
      console.log('📌 SKILL Exam Type - Showing QR modal');
      setShowQRModal(true); // Show QR modal only for SKILL
    }
  };


  // ✅ UPDATED: Handle QR Type Selection Confirmation with Exam Type Check
  const handleQRModalConfirm = () => {
    if (!pendingNavigation) return;

    setShowQRModal(false); // Close QR modal
    
    // ✅ NEW: Check exam type - skip customization modal for GCC (already bypassed at button level)
    // This condition is redundant here since GCC won't reach this, but kept for safety
    if (detectedExamType === 'GCC') {
      console.log('📌 GCC - Proceeding without customization');
      proceedToGeneration(null);
    } else if (detectedExamType === 'SKILL') {
      console.log('📌 SKILL - Showing customization choice modal');
      setShowCustomizationChoiceModal(true); // Open customization choice modal only for SKILL
    }
  };


  // Handle Modal Close
  const handleQRModalClose = () => {
    setShowQRModal(false);
    setPendingNavigation(null);
    setSelectedQRType('both');
  };


  // ✅ NEW: Handle Customization Choice
  const handleCustomizeChoice = () => {
    setShowCustomizationChoiceModal(false);
    setShowCustomizationModal(true); // Open customization modal
  };


  // ✅ NEW: Handle Use Default Choice
  const handleUseDefaultChoice = () => {
    setShowCustomizationChoiceModal(false);
    proceedToGeneration(null); // Proceed without customization
  };


  // ✅ NEW: Handle Apply Customization
  const handleApplyCustomization = (customization) => {
    console.log('Customization applied:', customization);
    setCustomizationData(customization);
    setShowCustomizationModal(false);
    proceedToGeneration(customization); // Proceed with customization
  };


  // ✅ UPDATED: Proceed to Hall Ticket Generation with Exam Type Routing
  const proceedToGeneration = (customization) => {
    if (!pendingNavigation) return;

    setRedirecting(true);

    setTimeout(() => {
      // ✅ Route based on exam type
      if (pendingNavigation.examType === 'GCC') {
        console.log('🎨 Routing to GCC TBC - No customization, default QR');
        
        // ✅ For GCC: Always use 'both' as default QR type, no customization
        if (pendingNavigation.type === 'database') {
          navigate(
            `/super-admin/generate-halltickets-db?departmentId=${pendingNavigation.departmentId}&qrType=both`
          );
        } else {
          navigate(
            `/super-admin/halltickets-generation/gcc-tbc?departmentId=${pendingNavigation.departmentId}&qrType=both`
          );
        }
      } else if (pendingNavigation.examType === 'SKILL') {
        console.log('🎨 Routing to SKILL Test - With customization and selected QR');
        
        // ✅ For SKILL: Use selected QR type and customization
        const customizationParam = customization 
          ? `&customization=${encodeURIComponent(JSON.stringify(customization))}`
          : '';

        if (pendingNavigation.type === 'database') {
          navigate(
            `/super-admin/generate-halltickets-db?departmentId=${pendingNavigation.departmentId}&qrType=${selectedQRType}${customizationParam}`
          );
        } else {
          redirectToHallTicketForm(
            pendingNavigation.examType, 
            pendingNavigation.departmentId, 
            selectedQRType,
            customization
          );
        }
      }
      
      setRedirecting(false);
      setPendingNavigation(null);
    }, 500);
  };


  const redirectToHallTicketForm = (examType, departmentId, qrType, customization) => {
    const examTypeParam = examType.toLowerCase() === 'gcc' ? 'gcc-tbc' : 'skill-test';
    const customizationParam = customization 
      ? `&customization=${encodeURIComponent(JSON.stringify(customization))}`
      : '';

    if (examTypeParam === 'gcc-tbc') {
      navigate(`/super-admin/halltickets-generation/gcc-tbc?departmentId=${departmentId}&qrType=both`);
    } else if (examTypeParam === 'skill-test') {
      navigate(`/super-admin/halltickets-generation/skill-test?departmentId=${departmentId}&qrType=${qrType}${customizationParam}`);
    }
  };


  const handleCustomizationChoiceClose = () => {
    setShowCustomizationChoiceModal(false);
  };


  const handleCustomizationModalClose = () => {
    setShowCustomizationModal(false);
    setShowCustomizationChoiceModal(true); // Go back to choice modal
  };


  const getSelectedDepartmentName = () => {
    const dept = departments.find(dept => dept.departmentId.toString() === selectedDepartment);
    return dept ? dept.departmentName : '';
  };


  const getExamTypeDisplayName = (examType) => {
    return examType === 'GCC' ? 'GCC TBC' : 'Skill Test';
  };


  if (loading) {
    return (
      <Container fluid className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Loading departments...</span>
        </div>
      </Container>
    );
  }


  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4 text-center">Hall Tickets Generation</h2>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Header>
              <h4 className="mb-0">
                <FaDatabase className="me-2" />
                Select Department for Hall Ticket Generation
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted mb-4">
                Select a department and the system will automatically detect the exam type
              </p>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Department Selection */}
              <Row className="g-4 mb-4">
                <Col md={12}>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <FaUniversity className="me-2" />
                        Choose Department
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group>
                        <Form.Label>Department Selection</Form.Label>
                        <Form.Select
                          value={selectedDepartment}
                          onChange={(e) => handleDepartmentSelect(e.target.value)}
                          size="lg"
                          disabled={redirecting}
                        >
                          <option value="">Select a department</option>
                          {departments.map((dept) => (
                            <option key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName} ({dept.examType ? getExamTypeDisplayName(dept.examType) : 'No Exam Type'})
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          {departments.length} departments available • Exam types will be detected automatically
                        </Form.Text>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Auto-Detection Result & Proceed Button */}
              {selectedDepartment && detectedExamType && (
                <Row className="g-4 mb-4">
                  <Col md={12}>
                    <Card className="shadow-sm border-success">
                      <Card.Header className="bg-light-success">
                        <h5 className="mb-0 text-success">
                          <FaCheckCircle className="me-2" />
                          Exam Type Detected Successfully
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center">
                          <div className="mb-3">
                            {detectedExamType === 'GCC' ? (
                              <FaUniversity size={50} className="text-primary" />
                            ) : (
                              <FaCogs size={50} className="text-success" />
                            )}
                          </div>

                          <h4 className="mb-3">
                            <strong>{getSelectedDepartmentName()}</strong>
                          </h4>

                          <div className="d-flex align-items-center justify-content-center mb-4">
                            <span className="text-muted me-2">Detected Exam Type:</span>
                            <span className={`badge ${detectedExamType === 'GCC' ? 'bg-primary' : 'bg-success'} fs-6`}>
                              {getExamTypeDisplayName(detectedExamType)}
                            </span>
                          </div>

                          <div className="d-flex justify-content-center gap-3 mb-3">
                            <Button
                              variant={detectedExamType === 'GCC' ? 'primary' : 'success'}
                              size="lg"
                              onClick={handleProceedToHallTickets}
                              disabled={redirecting}
                              className="px-4 py-3"
                            >
                              {redirecting && pendingNavigation?.type === 'excel' ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Redirecting...
                                </>
                              ) : (
                                <>
                                  <FaQrcode className="me-2" />
                                  Generate from Excel
                                  <FaArrowRight className="ms-2" />
                                </>
                              )}
                            </Button>

                            <Button
                              variant="info"
                              size="lg"
                              onClick={handleGenerateFromDatabase}
                              disabled={redirecting}
                              className="px-4 py-3"
                            >
                              {redirecting && pendingNavigation?.type === 'database' ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Redirecting...
                                </>
                              ) : (
                                <>
                                  <FaDatabase className="me-2" />
                                  Generate from Database
                                  <FaArrowRight className="ms-2" />
                                </>
                              )}
                            </Button>
                          </div>

                          <p className="text-muted mt-3 mb-0">
                            {detectedExamType === 'GCC' 
                              ? '⚡ GCC exam detected - will proceed directly to generation'
                              : '🎨 Skill Test detected - select QR codes and customization options'
                            }
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Information Card */}
              <Row>
                <Col md={12}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="mb-2">
                        <FaDatabase className="me-2" />
                        How It Works
                      </h6>
                      <ul className="text-muted mb-0 text-start">
                        <li><strong>GCC Exam:</strong> Select department → Proceed directly to generation (no QR/customization choice)</li>
                        <li><strong>Skill Test Exam:</strong> Select department → Choose QR codes → Choose customization → Generate</li>
                        <li>The system automatically detects the exam type from the database</li>
                        <li>Choose generation method (Excel Upload or Database)</li>
                        <li>Hall tickets will be generated with your selected options</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ========== QR Code Selection Modal - Only for SKILL ========== */}
      {detectedExamType === 'SKILL' && (
        <Modal 
          show={showQRModal} 
          onHide={handleQRModalClose}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaQrcode className="me-2" />
              Select QR Code Type
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-3">
              Choose which QR code(s) you want to include in the hall tickets:
            </p>

            <Form>
              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="qr-sh"
                  name="qrType"
                  value="sh"
                  checked={selectedQRType === 'sh'}
                  onChange={(e) => setSelectedQRType(e.target.value)}
                  label={
                    <div>
                      <strong>लघुलेखन (Shorthand)</strong>
                      <div className="text-muted small">Only Shorthand QR code</div>
                    </div>
                  }
                />
              </div>

              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="qr-tw"
                  name="qrType"
                  value="tw"
                  checked={selectedQRType === 'tw'}
                  onChange={(e) => setSelectedQRType(e.target.value)}
                  label={
                    <div>
                      <strong>टंकलेखन (Typewriting)</strong>
                      <div className="text-muted small">Only Typewriting QR code</div>
                    </div>
                  }
                />
              </div>

              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="qr-both"
                  name="qrType"
                  value="both"
                  checked={selectedQRType === 'both'}
                  onChange={(e) => setSelectedQRType(e.target.value)}
                  label={
                    <div>
                      <strong>Both QR Codes</strong>
                      <div className="text-muted small">Include both Shorthand and Typewriting QR codes</div>
                    </div>
                  }
                />
              </div>
            </Form>

            <Alert variant="info" className="mt-3 mb-0">
              <small>
                <strong>Note:</strong> Selected QR code(s) will appear at the bottom of the hall ticket.
              </small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleQRModalClose}>
              Cancel
            </Button>
            <Button 
              variant="success" 
              onClick={handleQRModalConfirm}
            >
              <FaCheckCircle className="me-2" />
              Confirm & Continue
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* ========== ✅ Customization Choice Modal - Only for SKILL ========== */}
      {detectedExamType === 'SKILL' && (
        <CustomizationChoiceModal
          show={showCustomizationChoiceModal}
          onHide={handleCustomizationChoiceClose}
          onCustomize={handleCustomizeChoice}
          onUseDefault={handleUseDefaultChoice}
        />
      )}

      {/* ========== ✅ Customization Modal - Only for SKILL ========== */}
      {detectedExamType === 'SKILL' && (
        <HallTicketCustomizationModal
          show={showCustomizationModal}
          onHide={handleCustomizationModalClose}
          onApplyCustomization={handleApplyCustomization}
        />
      )}
    </Container>
  );
}

export default HallticketsDepartmentSelection;
