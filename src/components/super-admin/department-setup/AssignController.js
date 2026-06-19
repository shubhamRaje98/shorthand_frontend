// src/components/super-admin/department-setup/AssignController.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDepartmentSetupPersistence } from '../../../hooks/useDepartmentSetupPersistence';

const AssignController = () => {
  const {
    formData,
    setFormData,
    updateCurrentStep,
    clearStepData
  } = useDepartmentSetupPersistence('controllerData', {
    center: '',
    batchNo: '',
    departmentId: '',
    controller_name: '',
    controller_contact: '',
    controller_email: '',
    district: ''
  });

  const [departments, setDepartments] = useState([]);
  const [examCenters, setExamCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetchingData, setFetchingData] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    updateCurrentStep(4);
    fetchInitialData();
    
    // If departmentId exists in persisted data, fetch its batches
    if (formData.departmentId) {
      fetchBatchesByDepartment(formData.departmentId);
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [deptRes, centerRes] = await Promise.all([
        axios.get('http://localhost:3000/api/new-department/departments'),
        axios.get('http://localhost:3000/api/new-department/exam-centers')
      ]);

      setDepartments(deptRes.data.data || []);
      setExamCenters(centerRes.data.data || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setMessage('Error loading departments and exam centers');
    } finally {
      setFetchingData(false);
    }
  };

  const fetchBatchesByDepartment = async (departmentId) => {
    if (!departmentId) {
      setBatches([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/new-department/batches/${departmentId}`);
      setBatches(response.data.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setBatches([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'departmentId') {
      setFormData(prev => ({
        ...prev,
        departmentId: value,
        batchNo: ''
      }));
      fetchBatchesByDepartment(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.center || !formData.batchNo || !formData.departmentId || !formData.controller_name) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/new-department/controllers', formData);
      
      setMessage(`Controller assigned successfully! Password: ${response.data.data.controller_pass}`);
      clearStepData();
      updateCurrentStep(5);
      
      setTimeout(() => {
        navigate('/super-admin/register-students');
      }, 3000);

    } catch (err) {
      console.error('Error assigning controller:', err);
      setMessage(err.response?.data?.message || 'Error assigning controller');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">Step 4: Assign Controller</h4>
              <small>Assign supervisors to batch-center combinations</small>
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
                      <Form.Label>Department *</Form.Label>
                      <Form.Select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        required
                        disabled={fetchingData}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.departmentName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Batch Number *</Form.Label>
                      <Form.Select
                        name="batchNo"
                        value={formData.batchNo}
                        onChange={handleChange}
                        required
                        disabled={!formData.departmentId || batches.length === 0}
                      >
                        <option value="">Select Batch</option>
                        {batches.map(batch => (
                          <option key={`${batch.departmentId}-${batch.batchNo}`} value={batch.batchNo}>
                            Batch {batch.batchNo} - {batch.batchdate}
                          </option>
                        ))}
                      </Form.Select>
                      {formData.departmentId && batches.length === 0 && (
                        <Form.Text className="text-danger">
                          No batches found for this department
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Exam Center *</Form.Label>
                      <Form.Select
                        name="center"
                        value={formData.center}
                        onChange={handleChange}
                        required
                        disabled={fetchingData}
                      >
                        <option value="">Select Exam Center</option>
                        {examCenters.map(center => (
                          <option key={center.center} value={center.center}>
                            {center.center_name} (ID: {center.center})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Controller Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="controller_name"
                        value={formData.controller_name}
                        onChange={handleChange}
                        placeholder="Enter controller full name"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Controller Contact</Form.Label>
                      <Form.Control
                        type="tel"
                        name="controller_contact"
                        value={formData.controller_contact}
                        onChange={handleChange}
                        placeholder="Phone number"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Controller Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="controller_email"
                        value={formData.controller_email}
                        onChange={handleChange}
                        placeholder="Email address"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>District</Form.Label>
                      <Form.Control
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="District name"
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
                          onClick={() => navigate('/super-admin/create-batch')}
                          className="me-2"
                        >
                          Previous Step
                        </Button>
                        
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={loading || fetchingData}
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Assigning...
                            </>
                          ) : (
                            'Assign Controller & Continue'
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

export default AssignController;