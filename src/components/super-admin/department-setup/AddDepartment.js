// src/components/super-admin/department-setup/AddDepartment.js
import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    departmentId: '',
    departmentName: '',
    departmentPassword: '',
    logo: '',
    departmentStatus: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setMessage('File size must be less than 10MB');
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.departmentId || !formData.departmentName || !formData.departmentPassword) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/new-department/departments', formData);
      
      setMessage('Department created successfully!');
      
      // Redirect to next step after 2 seconds
      setTimeout(() => {
        navigate('/super-admin/add-exam-center');
      }, 2000);

    } catch (err) {
      console.error('Error creating department:', err);
      setMessage(err.response?.data?.message || 'Error creating department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Step 1: Add Department</h4>
              <small>Create a new department to conduct exams</small>
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
                      <Form.Label>Department ID *</Form.Label>
                      <Form.Control
                        type="number"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        placeholder="Enter unique department ID"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Department Status</Form.Label>
                      <Form.Check
                        type="switch"
                        name="departmentStatus"
                        checked={formData.departmentStatus}
                        onChange={handleChange}
                        label={formData.departmentStatus ? 'Active' : 'Inactive'}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Department Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="departmentName"
                        value={formData.departmentName}
                        onChange={handleChange}
                        placeholder="e.g., PWD Skill Test, Forest Department"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Department Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="departmentPassword"
                        value={formData.departmentPassword}
                        onChange={handleChange}
                        placeholder="Set department password"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Department Logo</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      <Form.Text className="text-muted">
                        Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
                      </Form.Text>
                    </Form.Group>

                    {formData.logo && (
                      <div className="mt-2">
                        <img 
                          src={formData.logo} 
                          alt="Logo preview" 
                          style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                        />
                      </div>
                    )}
                  </Col>

                  <Col xs={12} className="mt-4">
                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="secondary" 
                        onClick={() => navigate('/super-admin/department-setup')}
                      >
                        Back to Dashboard
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
                          'Create Department & Continue'
                        )}
                      </Button>
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

export default AddDepartment;