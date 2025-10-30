// src/components/super-admin/CustomizationChoiceModal.js
import React from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';
import { FaCog, FaCheckCircle, FaPaintBrush, FaRocket } from 'react-icons/fa';

function CustomizationChoiceModal({ show, onHide, onCustomize, onUseDefault }) {
  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaPaintBrush className="me-2" />
          Hall Ticket Customization
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4 text-center">
          Would you like to customize the hall ticket or use the default template?
        </p>

        <Row className="g-3">
          {/* Option 1: Customize */}
          <Col md={6}>
            <Card 
              className="h-100 shadow-sm hover-card cursor-pointer" 
              onClick={onCustomize}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <FaCog size={60} className="text-primary" />
                </div>
                <h5 className="mb-3">Customize Hall Ticket</h5>
                <p className="text-muted mb-3">
                  Upload custom logos and modify invigilator section text
                </p>
                <ul className="text-start text-muted small">
                  <li>Change left & right logos</li>
                  <li>Update invigilator signature</li>
                  <li>Edit text in invigilator section</li>
                  <li>Preview before generating</li>
                </ul>
                <Button 
                  variant="primary" 
                  className="w-100 mt-3"
                  onClick={onCustomize}
                >
                  <FaCog className="me-2" />
                  Customize Now
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Option 2: Use Default */}
          <Col md={6}>
            <Card 
              className="h-100 shadow-sm hover-card cursor-pointer" 
              onClick={onUseDefault}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <FaRocket size={60} className="text-success" />
                </div>
                <h5 className="mb-3">Use Default Template</h5>
                <p className="text-muted mb-3">
                  Proceed with standard hall ticket format
                </p>
                <ul className="text-start text-muted small">
                  <li>Standard logos & layout</li>
                  <li>Default invigilator text</li>
                  <li>Quick generation</li>
                  <li>No additional setup needed</li>
                </ul>
                <Button 
                  variant="success" 
                  className="w-100 mt-3"
                  onClick={onUseDefault}
                >
                  <FaRocket className="me-2" />
                  Use Default
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Go Back
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomizationChoiceModal;
