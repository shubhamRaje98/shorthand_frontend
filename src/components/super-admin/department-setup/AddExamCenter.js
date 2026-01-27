// src/components/super-admin/department-setup/AddExamCenter.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDepartmentSetupPersistence } from '../../../hooks/useDepartmentSetupPersistence';

const AddExamCenter = () => {
  const {
    formData,
    setFormData,
    updateCurrentStep,
    clearStepData
  } = useDepartmentSetupPersistence('examCenterData', {
    center: '',
    center_name: '',
    center_address: '',
    pc_count: '',
    max_pc: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    updateCurrentStep(2);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.center || !formData.center_name || !formData.center_address || !formData.pc_count || !formData.max_pc) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://checking.shorthandonlineexam.in/api/new-department/exam-centers', {
        ...formData,
        pc_count: parseInt(formData.pc_count),
        max_pc: parseInt(formData.max_pc)
      });
      
      setMessage('Exam center created successfully!');
      clearStepData();
      updateCurrentStep(3);
      
      setTimeout(() => {
        navigate('/super-admin/create-batch');
      }, 2000);

    } catch (err) {
      console.error('Error creating exam center:', err);
      setMessage(err.response?.data?.message || 'Error creating exam center');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-info text-white">
              <h4 className="mb-0">Step 2: Add Exam Center</h4>
              <small>Define physical locations where exams will be conducted</small>
            </Card.Header>
            <Card.Body className="p-4">
              {message && (
                <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Center ID *</Form.Label>
                      <Form.Control
                        type="number"
                        name="center"
                        value={formData.center}
                        onChange={handleChange}
                        placeholder="Enter unique center ID"
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
                        value={formData.pc_count}
                        onChange={handleChange}
                        placeholder="Number of available PCs"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Center Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="center_name"
                        value={formData.center_name}
                        onChange={handleChange}
                        placeholder="e.g., Mumbai Center, Delhi Center"
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
                        value={formData.center_address}
                        onChange={handleChange}
                        placeholder="Full address of the exam center"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Maximum PC Capacity *</Form.Label>
                      <Form.Control
                        type="number"
                        name="max_pc"
                        value={formData.max_pc}
                        onChange={handleChange}
                        placeholder="Maximum PC capacity"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mt-4">
                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="secondary" 
                        onClick={() => navigate('/super-admin/department-setup')}
                      >
                        Back to Dashboard
                      </Button>
                      
                      <div>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => navigate('/super-admin/add-department')}
                          className="me-2"
                        >
                          Previous Step
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
                            'Create Center & Continue'
                          )}
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddExamCenter;