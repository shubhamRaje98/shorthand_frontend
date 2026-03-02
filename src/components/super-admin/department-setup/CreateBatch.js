// src/components/super-admin/department-setup/CreateBatch.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDepartmentSetupPersistence } from '../../../hooks/useDepartmentSetupPersistence';

const CreateBatch = () => {
  const {
    formData,
    setFormData,
    updateCurrentStep,
    clearStepData
  } = useDepartmentSetupPersistence('batchData', {
    departmentId: '',
    batchNo: '',
    batchdate: '',
    reporting_time: '',
    start_time: '',
    end_time: '',
    batchstatus: true
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetchingDepartments, setFetchingDepartments] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    updateCurrentStep(3);
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://www.shorthandonlineexam.in/api/new-department/departments');
      setDepartments(response.data.data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setMessage('Error loading departments');
    } finally {
      setFetchingDepartments(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.departmentId || !formData.batchNo || !formData.batchdate || 
        !formData.reporting_time || !formData.start_time || !formData.end_time) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/batches', formData);
      
      setMessage('Batch created successfully!');
      clearStepData();
      updateCurrentStep(4);
      
      setTimeout(() => {
        navigate('/super-admin/assign-controller');
      }, 2000);

    } catch (err) {
      console.error('Error creating batch:', err);
      setMessage(err.response?.data?.message || 'Error creating batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-warning text-dark">
              <h4 className="mb-0">Step 3: Create Batch</h4>
              <small>Schedule exam batches with dates and timings</small>
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
                        disabled={fetchingDepartments}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.departmentName} ({dept.departmentId})
                          </option>
                        ))}
                      </Form.Select>
                      {fetchingDepartments && (
                        <Form.Text className="text-muted">
                          Loading departments...
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Batch Number *</Form.Label>
                      <Form.Control
                        type="number"
                        name="batchNo"
                        value={formData.batchNo}
                        onChange={handleChange}
                        placeholder="Enter batch number"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Batch Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="batchdate"
                        value={formData.batchdate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Batch Status</Form.Label>
                      <Form.Check
                        type="switch"
                        name="batchstatus"
                        checked={formData.batchstatus}
                        onChange={handleChange}
                        label={formData.batchstatus ? 'Active' : 'Inactive'}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Reporting Time *</Form.Label>
                      <Form.Control
                        type="time"
                        name="reporting_time"
                        value={formData.reporting_time}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Start Time *</Form.Label>
                      <Form.Control
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>End Time *</Form.Label>
                      <Form.Control
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
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
                          onClick={() => navigate('/super-admin/add-exam-center')}
                          className="me-2"
                        >
                          Previous Step
                        </Button>
                        
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={loading || fetchingDepartments}
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Creating...
                            </>
                          ) : (
                            'Create Batch & Continue'
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

export default CreateBatch;