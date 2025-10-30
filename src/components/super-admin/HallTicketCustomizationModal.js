// src/components/super-admin/HallTicketCustomizationModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Card } from 'react-bootstrap';
import { FaUpload, FaTrash, FaCog, FaCheckCircle, FaImage, FaFont } from 'react-icons/fa';

function HallTicketCustomizationModal({ show, onHide, onApplyCustomization }) {
  const [leftLogo, setLeftLogo] = useState(null);
  const [leftLogoPreview, setLeftLogoPreview] = useState(null);
  
  const [rightLogo, setRightLogo] = useState(null);
  const [rightLogoPreview, setRightLogoPreview] = useState(null);
  
  const [invigilatorImage, setInvigilatorImage] = useState(null);
  const [invigilatorImagePreview, setInvigilatorImagePreview] = useState(null);

  const [invigilatorTitle, setInvigilatorTitle] = useState('नियंत्रक अधिकारी');
  const [invigilatorLine1, setInvigilatorLine1] = useState('मुख्य अभियंता');
  const [invigilatorLine2, setInvigilatorLine2] = useState('सा.बां.प्रादेशिक विभाग मुंबई तथा,');
  const [invigilatorLine3, setInvigilatorLine3] = useState('अध्यक्ष राज्यस्तरीय समन्वय समिती.');

  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload only image files (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      const base64 = await convertToBase64(file);
      
      if (imageType === 'left') {
        setLeftLogo(base64);
        setLeftLogoPreview(base64);
      } else if (imageType === 'right') {
        setRightLogo(base64);
        setRightLogoPreview(base64);
      } else if (imageType === 'invigilator') {
        setInvigilatorImage(base64);
        setInvigilatorImagePreview(base64);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Image conversion error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageType) => {
    if (imageType === 'left') {
      setLeftLogo(null);
      setLeftLogoPreview(null);
    } else if (imageType === 'right') {
      setRightLogo(null);
      setRightLogoPreview(null);
    } else if (imageType === 'invigilator') {
      setInvigilatorImage(null);
      setInvigilatorImagePreview(null);
    }
  };

  const handleApply = () => {
    const customization = {
      leftLogoBase64: leftLogo,
      rightLogoBase64: rightLogo,
      invigilatorImageBase64: invigilatorImage,
      invigilatorText: {
        title: invigilatorTitle,
        line1: invigilatorLine1,
        line2: invigilatorLine2,
        line3: invigilatorLine3
      }
    };

    console.log('💾 Storing customization in sessionStorage');
    sessionStorage.setItem('hallticket_customization', JSON.stringify(customization));
    console.log('✅ Customization saved to sessionStorage');
    console.log('Customization details:', customization);
    
    onApplyCustomization(customization);
  };

  const handleReset = () => {
    setLeftLogo(null);
    setLeftLogoPreview(null);
    setRightLogo(null);
    setRightLogoPreview(null);
    setInvigilatorImage(null);
    setInvigilatorImagePreview(null);
    setInvigilatorTitle('नियंत्रक अधिकारी');
    setInvigilatorLine1('मुख्य अभियंता');
    setInvigilatorLine2('सा.बां.प्रादेशिक विभाग मुंबई तथा,');
    setInvigilatorLine3('अध्यक्ष राज्यस्तरीय समन्वय समिती.');
    setError(null);
  };

  // ✅ NEW: Clear customization from sessionStorage
  const clearCustomizationFromSession = () => {
    console.log('🗑️ Clearing customization from sessionStorage');
    sessionStorage.removeItem('hallticket_customization');
    console.log('✅ Customization cleared');
    handleReset();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCog className="me-2" />
          Customize Hall Ticket
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Alert variant="info" className="mb-4">
          <small>
            <strong>📌 Note:</strong> All customizations are temporary and will be applied only to the current download session. 
            Images are not saved to the database.
          </small>
        </Alert>

        {/* IMAGE CUSTOMIZATION SECTION */}
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">
              <FaImage className="me-2" />
              Image Customization
            </h6>
          </Card.Header>
          <Card.Body>
            {/* Left Logo */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Left Logo (PWD Logo Position)
              </Form.Label>
              <Row className="align-items-center">
                <Col md={8}>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'left')}
                    disabled={uploading}
                  />
                  <Form.Text className="text-muted">
                    Recommended: 100x90px • PNG/JPG • Max 2MB
                  </Form.Text>
                </Col>
                <Col md={4} className="text-end">
                  {leftLogoPreview ? (
                    <div className="d-flex align-items-center justify-content-end">
                      <img 
                        src={leftLogoPreview} 
                        alt="Left Logo" 
                        height="60" 
                        className="me-2 border rounded p-1" 
                        style={{ objectFit: 'contain' }}
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => removeImage('left')}
                        title="Remove image"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted small">No image uploaded</span>
                  )}
                </Col>
              </Row>
            </Form.Group>

            {/* Right Logo */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Right Logo (Ashok Stambh / Department Logo Position)
              </Form.Label>
              <Row className="align-items-center">
                <Col md={8}>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'right')}
                    disabled={uploading}
                  />
                  <Form.Text className="text-muted">
                    Recommended: 100x90px • PNG/JPG • Max 2MB
                  </Form.Text>
                </Col>
                <Col md={4} className="text-end">
                  {rightLogoPreview ? (
                    <div className="d-flex align-items-center justify-content-end">
                      <img 
                        src={rightLogoPreview} 
                        alt="Right Logo" 
                        height="60" 
                        className="me-2 border rounded p-1"
                        style={{ objectFit: 'contain' }}
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => removeImage('right')}
                        title="Remove image"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted small">No image uploaded</span>
                  )}
                </Col>
              </Row>
            </Form.Group>

            {/* Invigilator Image */}
            <Form.Group className="mb-0">
              <Form.Label className="fw-bold">
                Invigilator Signature Image
              </Form.Label>
              <Row className="align-items-center">
                <Col md={8}>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'invigilator')}
                    disabled={uploading}
                  />
                  <Form.Text className="text-muted">
                    Recommended: 72px height, auto width • PNG/JPG • Max 2MB
                  </Form.Text>
                </Col>
                <Col md={4} className="text-end">
                  {invigilatorImagePreview ? (
                    <div className="d-flex align-items-center justify-content-end">
                      <img 
                        src={invigilatorImagePreview} 
                        alt="Invigilator" 
                        height="60" 
                        className="me-2 border rounded p-1"
                        style={{ objectFit: 'contain' }}
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => removeImage('invigilator')}
                        title="Remove image"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted small">No image uploaded</span>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* TEXT CUSTOMIZATION SECTION */}
        <Card>
          <Card.Header className="bg-light">
            <h6 className="mb-0">
              <FaFont className="me-2" />
              Invigilator Section Text
            </h6>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Title (Line 1)</Form.Label>
              <Form.Control
                type="text"
                value={invigilatorTitle}
                onChange={(e) => setInvigilatorTitle(e.target.value)}
                placeholder="नियंत्रक अधिकारी"
              />
              <Form.Text className="text-muted">
                This appears as the main title above the signature
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Line 2</Form.Label>
              <Form.Control
                type="text"
                value={invigilatorLine1}
                onChange={(e) => setInvigilatorLine1(e.target.value)}
                placeholder="मुख्य अभियंता"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Line 3</Form.Label>
              <Form.Control
                type="text"
                value={invigilatorLine2}
                onChange={(e) => setInvigilatorLine2(e.target.value)}
                placeholder="सा.बां.प्रादेशिक विभाग मुंबई तथा,"
              />
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Label className="fw-bold">Line 4</Form.Label>
              <Form.Control
                type="text"
                value={invigilatorLine3}
                onChange={(e) => setInvigilatorLine3(e.target.value)}
                placeholder="अध्यक्ष राज्यस्तरीय समन्वय समिती."
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Preview Section */}
        {(leftLogoPreview || rightLogoPreview || invigilatorImagePreview) && (
          <Card className="mt-4 bg-light">
            <Card.Body>
              <h6 className="mb-3">📷 Preview</h6>
              <Row>
                {leftLogoPreview && (
                  <Col md={4} className="text-center mb-3">
                    <small className="text-muted d-block mb-2">Left Logo</small>
                    <img 
                      src={leftLogoPreview} 
                      alt="Left Preview" 
                      style={{ maxWidth: '100px', maxHeight: '90px', objectFit: 'contain' }}
                      className="border rounded bg-white p-2"
                    />
                  </Col>
                )}
                {rightLogoPreview && (
                  <Col md={4} className="text-center mb-3">
                    <small className="text-muted d-block mb-2">Right Logo</small>
                    <img 
                      src={rightLogoPreview} 
                      alt="Right Preview" 
                      style={{ maxWidth: '100px', maxHeight: '90px', objectFit: 'contain' }}
                      className="border rounded bg-white p-2"
                    />
                  </Col>
                )}
                {invigilatorImagePreview && (
                  <Col md={4} className="text-center mb-3">
                    <small className="text-muted d-block mb-2">Invigilator Signature</small>
                    <img 
                      src={invigilatorImagePreview} 
                      alt="Invigilator Preview" 
                      style={{ maxWidth: '120px', height: '72px', objectFit: 'contain' }}
                      className="border rounded bg-white p-2"
                    />
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* ✅ NEW: Clear Customization Button */}
        <Button 
          variant="outline-warning" 
          onClick={clearCustomizationFromSession}
          title="Clear all customizations and use default hall ticket"
        >
          <FaTrash className="me-2" />
          Clear Customization
        </Button>
        
        <Button variant="outline-secondary" onClick={handleReset}>
          <FaTrash className="me-2" />
          Reset Form
        </Button>
        
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleApply}
          disabled={uploading}
        >
          <FaCheckCircle className="me-2" />
          Apply Customization
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HallTicketCustomizationModal;
