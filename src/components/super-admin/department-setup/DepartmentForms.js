// src/components/super-admin/department-setup/DepartmentForms.js
import React, { useState, useEffect } from 'react';
import {
  Accordion, Row, Col, Form, Button, Spinner, Card, Alert, Badge, Table
} from 'react-bootstrap';
import axios from 'axios';

const DepartmentForms = ({
  activeAccordion,
  setActiveAccordion,
  departments,
  setDepartments,
  setMessage,
  fetchDepartments,
  fetchBatches,
  fetchControllers,
  newlyAddedBatches,
  setNewlyAddedBatches,
  newlyAddedControllers,
  setNewlyAddedControllers,
  persistFormData,
  clearPersistedData,
  navigate,
  fetchingDepartments,
  onDepartmentSuccess,
  onBatchSuccess,
  onControllerSuccess
}) => {
  // Create Department Form State
  const [formData, setFormData] = useState({
    departmentId: '',
    departmentName: '',
    departmentPassword: '',
    logo: '',
    departmentStatus: false
  });
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  // Add Batches Form State
  const [existingDeptData, setExistingDeptData] = useState({
    departmentId: '',
    batches: [{
      batchNo: '',
      batchdate: '',
      reporting_time: '',
      start_time: '',
      end_time: '',
      batchstatus: true
    }]
  });
  const [existingDeptLoading, setExistingDeptLoading] = useState(false);
  const [refreshingDepartments, setRefreshingDepartments] = useState(false);

  // Batch Excel Upload State with manual department selection
  const [batchFileData, setBatchFileData] = useState({
    file: null,
    fileName: '',
    uploading: false,
    uploadResult: null,
    manualDepartmentId: '' // manual department selection (optional)
  });

  // Add Controllers Form State
  const [centerControllerData, setCenterControllerData] = useState({
    departmentId: '',
    batchNo: '',
    controllers: [{
      controller_code: '',
      controller_contact: '',
      controller_email: '',
      controller_name: '',
      controller_pass: '',
      district: '',
      center: ''
    }]
  });
  const [controllerLoading, setControllerLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [fetchingBatches, setFetchingBatches] = useState(false);

  // Controller Excel Upload State
  const [controllerFileData, setControllerFileData] = useState({
    file: null,
    fileName: '',
    uploading: false,
    uploadResult: null
  });

  // Persist form data
  useEffect(() => {
    persistFormData({ formData, existingDeptData, centerControllerData });
  }, [formData, existingDeptData, centerControllerData]);

  // Fetch batches when department is selected for controllers
  useEffect(() => {
    if (centerControllerData.departmentId) {
      fetchBatchesByDepartment(centerControllerData.departmentId);
    }
  }, [centerControllerData.departmentId]);

  // Create Department Handlers
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
      if (file.size > 10 * 1024 * 1024) {
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

  const handleNewDepartmentSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentId || !formData.departmentName || !formData.departmentPassword) {
      setMessage('Please fill all required fields');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:3000/api/new-department/departments', formData);
      const newDepartmentId = formData.departmentId;
      const newDepartmentName = formData.departmentName;
      setFormData({
        departmentId: '',
        departmentName: '',
        departmentPassword: '',
        logo: '',
        departmentStatus: true
      });
      setLogoFile(null);
      clearPersistedData();
      await fetchDepartments();
      setMessage(`✅ Department "${newDepartmentName}" created successfully! Click "Departments" button to view all departments.`);
      setActiveAccordion("existing");
      onDepartmentSuccess(newDepartmentId);
    } catch (err) {
      console.error('Error creating department:', err);
      setMessage(err.response?.data?.message || 'Error creating department');
    } finally {
      setLoading(false);
    }
  };

  // Add Batches Handlers
  const handleExistingDeptChange = (e) => {
    const { name, value } = e.target;
    setExistingDeptData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBatchChange = (index, field, value) => {
    const updatedBatches = [...existingDeptData.batches];
    updatedBatches[index] = {
      ...updatedBatches[index],
      [field]: value
    };
    setExistingDeptData(prev => ({
      ...prev,
      batches: updatedBatches
    }));
  };

  const addBatch = () => {
    setExistingDeptData(prev => ({
      ...prev,
      batches: [
        ...prev.batches,
        {
          batchNo: '',
          batchdate: '',
          reporting_time: '',
          start_time: '',
          end_time: '',
          batchstatus: true
        }
      ]
    }));
  };

  const removeBatch = (index) => {
    if (existingDeptData.batches.length > 1) {
      const updatedBatches = existingDeptData.batches.filter((_, i) => i !== index);
      setExistingDeptData(prev => ({
        ...prev,
        batches: updatedBatches
      }));
    }
  };

  const handleRefreshDepartments = async () => {
    setRefreshingDepartments(true);
    await fetchDepartments();
    setRefreshingDepartments(false);
  };

  // Batch File Upload Handlers with manual department selection
  const handleBatchFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }
      setBatchFileData(prev => ({
        ...prev,
        file: file,
        fileName: file.name,
        uploadResult: null
      }));
    }
  };

  const handleBatchBulkDepartmentChange = (e) => {
    setBatchFileData(prev => ({
      ...prev,
      manualDepartmentId: e.target.value
    }));
  };

  const handleBatchFileUpload = async (e) => {
    e.preventDefault();
    if (!batchFileData.file) {
      setMessage('Please select a file');
      return;
    }
    setBatchFileData(prev => ({ ...prev, uploading: true }));
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', batchFileData.file);
      if (batchFileData.manualDepartmentId) {
        formData.append('manualDepartmentId', batchFileData.manualDepartmentId);
      }
      const response = await axios.post(
        'http://localhost:3000/api/new-department/batches/bulk-upload-complete',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setBatchFileData(prev => ({
        ...prev,
        uploadResult: response.data,
        file: null,
        fileName: '',
        manualDepartmentId: ''
      }));
      setMessage(`✅ Batch file uploaded successfully! ${response.data.summary.successful} batches added, ${response.data.summary.failed} failed.`);
      onBatchSuccess();
    } catch (err) {
      console.error('Error uploading batch file:', err);
      setMessage(err.response?.data?.message || 'Error uploading batch file');
    } finally {
      setBatchFileData(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleExistingDeptSubmit = async (e) => {
    e.preventDefault();
    if (!existingDeptData.departmentId) {
      setMessage('Please select a department');
      return;
    }
    const invalidBatches = existingDeptData.batches.filter(batch =>
      !batch.batchNo || !batch.batchdate || !batch.reporting_time || !batch.start_time || !batch.end_time
    );
    if (invalidBatches.length > 0) {
      setMessage('Please fill all required fields for all batches');
      return;
    }
    setExistingDeptLoading(true);
    setMessage('');
    try {
      await axios.post(
        'http://localhost:3000/api/new-department/existing-department/batches',
        existingDeptData
      );
      const selectedDepartment = departments.find(dept => dept.departmentId == existingDeptData.departmentId);
      const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      const newBatches = existingDeptData.batches.map(batch => ({
        ...batch,
        departmentId: existingDeptData.departmentId,
        timestamp: new Date().toISOString()
      }));
      setNewlyAddedBatches(prev => [...prev, ...newBatches]);
      setMessage(`✅ Batches added successfully to "${departmentName}"! Click "Batches" button to view all batches (newest batches shown first).`);
      setActiveAccordion("controllers");
      setExistingDeptData({
        departmentId: '',
        batches: [{
          batchNo: '',
          batchdate: '',
          reporting_time: '',
          start_time: '',
          end_time: '',
          batchstatus: true
        }]
      });
      onBatchSuccess(existingDeptData.departmentId);
    } catch (err) {
      console.error('Error adding batches:', err);
      setMessage(err.response?.data?.message || 'Error adding batches');
    } finally {
      setExistingDeptLoading(false);
    }
  };

  // Controllers Handlers
  const fetchBatchesByDepartment = async (departmentId) => {
    setFetchingBatches(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/new-department/controllers/batches/department/${departmentId}`);
      const fetchedBatches = response.data.data || [];
      setBatches(fetchedBatches);
    } catch (err) {
      console.error('Error fetching batches by department:', err);
    } finally {
      setFetchingBatches(false);
    }
  };

  const handleCenterControllerChange = (e) => {
    const { name, value } = e.target;
    setCenterControllerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleControllerChange = (index, field, value) => {
    const updatedControllers = [...centerControllerData.controllers];
    updatedControllers[index] = {
      ...updatedControllers[index],
      [field]: value
    };
    setCenterControllerData(prev => ({
      ...prev,
      controllers: updatedControllers
    }));
  };

  const addController = () => {
    setCenterControllerData(prev => ({
      ...prev,
      controllers: [
        ...prev.controllers,
        {
          controller_code: '',
          controller_contact: '',
          controller_email: '',
          controller_name: '',
          controller_pass: '',
          district: '',
          center: ''
        }
      ]
    }));
  };

  const removeController = (index) => {
    if (centerControllerData.controllers.length > 1) {
      const updatedControllers = centerControllerData.controllers.filter((_, i) => i !== index);
      setCenterControllerData(prev => ({
        ...prev,
        controllers: updatedControllers
      }));
    }
  };

  const getAvailableBatches = () => {
    if (!centerControllerData.departmentId) return [];
    return batches.filter(batch => batch.departmentId == centerControllerData.departmentId);
  };

  // Controller File Upload Handlers
  const handleControllerFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }
      setControllerFileData(prev => ({
        ...prev,
        file: file,
        fileName: file.name,
        uploadResult: null
      }));
    }
  };

  const handleControllerFileUpload = async (e) => {
    e.preventDefault();
    if (!controllerFileData.file) {
      setMessage('Please select a file');
      return;
    }
    setControllerFileData(prev => ({ ...prev, uploading: true }));
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', controllerFileData.file);
      const response = await axios.post(
        'http://localhost:3000/api/new-department/controllers/bulk-upload-complete',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setControllerFileData(prev => ({
        ...prev,
        uploadResult: response.data,
        file: null,
        fileName: ''
      }));
      setMessage(`✅ Controller file uploaded successfully! ${response.data.summary.successful} controllers added, ${response.data.summary.failed} failed.`);
      onControllerSuccess();
    } catch (err) {
      console.error('Error uploading controller file:', err);
      setMessage(err.response?.data?.message || 'Error uploading controller file');
    } finally {
      setControllerFileData(prev => ({ ...prev, uploading: false }));
    }
  };

  // Optional null handling for controller_code and district
  const processControllersForSubmission = (controllers) => {
    return controllers.map(controller => ({
      ...controller,
      controller_code: (controller.controller_code || '').trim() === '' ? null : controller.controller_code,
      district: (controller.district || '').trim() === '' ? null : controller.district
    }));
  };

  const handleCenterControllerSubmit = async (e) => {
    e.preventDefault();
    if (!centerControllerData.departmentId || !centerControllerData.batchNo) {
      setMessage('Please select a department and batch number');
      return;
    }
    const invalidControllers = centerControllerData.controllers.filter(controller =>
      !controller.controller_contact ||
      !controller.controller_email || !controller.controller_name ||
      !controller.controller_pass || !controller.center
    );
    if (invalidControllers.length > 0) {
      setMessage('Please fill all required fields for all controllers (Controller Code and District are optional, Center is required)');
      return;
    }
    setControllerLoading(true);
    setMessage('');
    try {
      const processedControllers = processControllersForSubmission(centerControllerData.controllers);
      await axios.post('http://localhost:3000/api/new-department/controllers', {
        departmentId: centerControllerData.departmentId,
        batchNo: centerControllerData.batchNo,
        controllers: processedControllers
      });
      const selectedDepartment = departments.find(dept => dept.departmentId == centerControllerData.departmentId);
      const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      const newControllers = centerControllerData.controllers.map(controller => ({
        ...controller,
        departmentId: centerControllerData.departmentId,
        batchNo: centerControllerData.batchNo,
        timestamp: new Date().toISOString()
      }));
      setNewlyAddedControllers(prev => [...prev, ...newControllers]);
      setMessage(`✅ Center Controllers added successfully to "${departmentName}" - Batch ${centerControllerData.batchNo}! Click "Controllers" button to view all controllers (newest controllers shown first).`);
      setCenterControllerData({
        departmentId: '',
        batchNo: '',
        controllers: [{
          controller_code: '',
          controller_contact: '',
          controller_email: '',
          controller_name: '',
          controller_pass: '',
          district: '',
          center: ''
        }]
      });
      onControllerSuccess(centerControllerData.departmentId, centerControllerData.batchNo);
    } catch (err) {
      console.error('Error adding controllers:', err);
      const errorMessage = err.response?.data?.message || 'Error adding controllers';
      setMessage(errorMessage);
    } finally {
      setControllerLoading(false);
    }
  };

  return (
    <Accordion activeKey={activeAccordion} onSelect={(key) => setActiveAccordion(key)}>
      {/* Create New Department */}
      <Accordion.Item eventKey="new">
        <Accordion.Header>
          <h5 className="mb-0">Create New Department</h5>
        </Accordion.Header>
        <Accordion.Body>
          <Form onSubmit={handleNewDepartmentSubmit}>
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
                    value=""
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
                      'Create Department'
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Accordion.Body>
      </Accordion.Item>

      {/* Add Batches to Existing Department */}
      <Accordion.Item eventKey="existing">
        <Accordion.Header>
          <h5 className="mb-0">
            Add Batches to Existing Department
            {refreshingDepartments && (
              <Spinner as="span" animation="border" size="sm" className="ms-2" />
            )}
          </h5>
        </Accordion.Header>
        <Accordion.Body>
          {/* Bulk Upload Batches */}
          <Card className="mb-4 border-success">
            <Card.Header className="bg-success-subtle">
              <h6 className="mb-0">📊 Bulk Upload Batches via Excel/CSV</h6>
              <small className="text-muted">Upload complete batch data with optional department selection</small>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleBatchFileUpload}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Alert variant="info" className="mb-3">
                      <strong>📌 Note:</strong> If your Excel file doesn't contain a <code>departmentId</code> column,
                      select a department below to apply to all batches in the file.
                    </Alert>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>
                        Select Department (Optional)
                        {departments.length > 0 && (
                          <span className="text-muted ms-2">({departments.length} available)</span>
                        )}
                      </Form.Label>
                      <Form.Select
                        value={batchFileData.manualDepartmentId}
                        onChange={handleBatchBulkDepartmentChange}
                        disabled={fetchingDepartments || refreshingDepartments}
                      >
                        <option value="">
                          {fetchingDepartments || refreshingDepartments
                            ? 'Loading departments...'
                            : 'Select department (if Excel has no departmentId column)'}
                        </option>
                        {departments.map(dept => (
                          <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.departmentName} (ID: {dept.departmentId})
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        ℹ️ Leave empty if your Excel file already contains <code>departmentId</code> column
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Upload Batch Excel/CSV File *</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleBatchFileSelect}
                        required
                      />
                      <Form.Text className="text-muted">
                        Excel (.xlsx, .xls) or CSV (.csv) files only. Max size: 5MB<br />
                        <strong>Required columns:</strong> batchNo, batchdate, reporting_time, start_time, end_time<br />
                        <strong>Optional column:</strong> departmentId (use dropdown above if not in Excel)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <div className="d-flex gap-2 w-100">
                      <Button
                        variant="success"
                        type="submit"
                        disabled={batchFileData.uploading || !batchFileData.file}
                        className="flex-grow-1"
                      >
                        {batchFileData.uploading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Uploading...
                          </>
                        ) : (
                          '📊 Upload Batches'
                        )}
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/templates/batch_complete_template.xlsx';
                          link.download = 'batch_complete_template.xlsx';
                          link.click();
                        }}
                      >
                        📥 Template
                      </Button>
                    </div>
                  </Col>
                  {batchFileData.fileName && (
                    <Col xs={12}>
                      <Alert variant="info" className="mb-3">
                        <strong>Selected File:</strong> {batchFileData.fileName}
                      </Alert>
                    </Col>
                  )}
                  {batchFileData.uploadResult && (
                    <Col xs={12}>
                      <Alert variant="success">
                        <h6>Upload Results:</h6>
                        <ul className="mb-0">
                          <li>✅ Successful: {batchFileData.uploadResult.summary?.successful || 0}</li>
                          <li>❌ Failed: {batchFileData.uploadResult.summary?.failed || 0}</li>
                          <li>📊 Total Processed: {batchFileData.uploadResult.summary?.totalProcessed || 0}</li>
                          {batchFileData.uploadResult.summary?.usedManualDepartment && (
                            <li>🎯 Used Manual Department Selection</li>
                          )}
                        </ul>
                        {batchFileData.uploadResult.errors && batchFileData.uploadResult.errors.length > 0 && (
                          <details className="mt-2">
                            <summary>View Errors</summary>
                            <ul className="mt-2 mb-0">
                              {batchFileData.uploadResult.errors.slice(0, 5).map((error, index) => (
                                <li key={index} className="text-danger small">{error}</li>
                              ))}
                              {batchFileData.uploadResult.errors.length > 5 && (
                                <li className="text-muted small">... and {batchFileData.uploadResult.errors.length - 5} more errors</li>
                              )}
                            </ul>
                          </details>
                        )}
                      </Alert>
                    </Col>
                  )}
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Existing Manual Batch Addition Form */}
          <Card className="border-secondary">
            <Card.Header className="bg-secondary-subtle">
              <h6 className="mb-0">✏️ Manual Batch Entry</h6>
              <small className="text-muted">Add batches to a selected department</small>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleExistingDeptSubmit}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>
                        Select Existing Department *
                        {departments.length > 0 && (
                          <span className="text-muted ms-2">({departments.length} available)</span>
                        )}
                      </Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Select
                          name="departmentId"
                          value={existingDeptData.departmentId}
                          onChange={handleExistingDeptChange}
                          required
                          disabled={fetchingDepartments || refreshingDepartments}
                        >
                          <option value="">
                            {fetchingDepartments || refreshingDepartments
                              ? 'Loading departments...'
                              : 'Choose a department'}
                          </option>
                          {departments.map(dept => (
                            <option key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName} (ID: {dept.departmentId})
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="outline-secondary"
                          onClick={handleRefreshDepartments}
                          disabled={refreshingDepartments}
                        >
                          {refreshingDepartments ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-1" />
                              Refreshing...
                            </>
                          ) : (
                            '🔄 Refresh'
                          )}
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Batches</h6>
                      <Button variant="outline-success" size="sm" onClick={addBatch}>
                        + Add Batch
                      </Button>
                    </div>
                  </Col>

                  {existingDeptData.batches.map((batch, index) => (
                    <Col xs={12} key={index}>
                      <Card className="mb-3">
                        <Card.Header className="py-2 d-flex justify-content-between align-items-center">
                          <span>Batch {index + 1}</span>
                          {existingDeptData.batches.length > 1 && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeBatch(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-2">
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Batch No *</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={batch.batchNo}
                                  onChange={(e) => handleBatchChange(index, 'batchNo', e.target.value)}
                                  placeholder="Batch number"
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Date *</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={batch.batchdate}
                                  onChange={(e) => handleBatchChange(index, 'batchdate', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>Reporting *</Form.Label>
                                <Form.Control
                                  type="time"
                                  value={batch.reporting_time}
                                  onChange={(e) => handleBatchChange(index, 'reporting_time', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>Start *</Form.Label>
                                <Form.Control
                                  type="time"
                                  value={batch.start_time}
                                  onChange={(e) => handleBatchChange(index, 'start_time', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>End *</Form.Label>
                                <Form.Control
                                  type="time"
                                  value={batch.end_time}
                                  onChange={(e) => handleBatchChange(index, 'end_time', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mt-1">
                                <Form.Label className="me-2">Status</Form.Label>
                                <Form.Check
                                  type="switch"
                                  id={`batchstatus-${index}`}
                                  checked={!!batch.batchstatus}
                                  onChange={(e) => handleBatchChange(index, 'batchstatus', e.target.checked)}
                                  label={batch.batchstatus ? 'Active' : 'Inactive'}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}

                  <Col xs={12} className="mt-2">
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => setActiveAccordion('new')}
                      >
                        Back
                      </Button>
                      <Button
                        variant="success"
                        type="submit"
                        disabled={existingDeptLoading || !existingDeptData.departmentId}
                      >
                        {existingDeptLoading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Adding Batches...
                          </>
                        ) : (
                          'Add Batches to Department'
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>

      {/* Add Center Controllers */}
      <Accordion.Item eventKey="controllers">
        <Accordion.Header>
          <h5 className="mb-0">Add Center Controllers</h5>
        </Accordion.Header>
        <Accordion.Body>
          {/* Bulk Upload Controllers */}
          <Card className="mb-4 border-primary">
            <Card.Header className="bg-primary-subtle">
              <h6 className="mb-0">📦 Bulk Upload Controllers via Excel/CSV</h6>
              <small className="text-muted">Upload controller data for any department/batch specified in your file</small>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleControllerFileUpload}>
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Upload Controllers Excel/CSV File *</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleControllerFileSelect}
                        required
                      />
                      <Form.Text className="text-muted">
                        Required columns: departmentId, batchNo, center, controller_name, controller_contact, controller_email, controller_pass<br />
                        Optional columns: controller_code, district
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <div className="d-flex gap-2 w-100">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={controllerFileData.uploading || !controllerFileData.file}
                        className="flex-grow-1"
                      >
                        {controllerFileData.uploading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Uploading...
                          </>
                        ) : (
                          '📦 Upload Controllers'
                        )}
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/templates/controllers_complete_template.xlsx';
                          link.download = 'controllers_complete_template.xlsx';
                          link.click();
                        }}
                      >
                        📥 Template
                      </Button>
                    </div>
                  </Col>
                  {controllerFileData.fileName && (
                    <Col xs={12}>
                      <Alert variant="info" className="mb-3">
                        <strong>Selected File:</strong> {controllerFileData.fileName}
                      </Alert>
                    </Col>
                  )}
                  {controllerFileData.uploadResult && (
                    <Col xs={12}>
                      <Alert variant="success">
                        <h6>Upload Results:</h6>
                        <ul className="mb-0">
                          <li>✅ Successful: {controllerFileData.uploadResult.summary?.successful || 0}</li>
                          <li>❌ Failed: {controllerFileData.uploadResult.summary?.failed || 0}</li>
                          <li>📊 Total Processed: {controllerFileData.uploadResult.summary?.totalProcessed || 0}</li>
                        </ul>
                        {controllerFileData.uploadResult.errors && controllerFileData.uploadResult.errors.length > 0 && (
                          <details className="mt-2">
                            <summary>View Errors</summary>
                            <ul className="mt-2 mb-0">
                              {controllerFileData.uploadResult.errors.slice(0, 5).map((error, index) => (
                                <li key={index} className="text-danger small">{error}</li>
                              ))}
                              {controllerFileData.uploadResult.errors.length > 5 && (
                                <li className="text-muted small">... and {controllerFileData.uploadResult.errors.length - 5} more errors</li>
                              )}
                            </ul>
                          </details>
                        )}
                      </Alert>
                    </Col>
                  )}
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Manual Controllers Entry */}
          <Card className="border-secondary">
            <Card.Header className="bg-secondary-subtle">
              <h6 className="mb-0">✍️ Manual Controllers Entry</h6>
              <small className="text-muted">Add controllers to a specific department and batch</small>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleCenterControllerSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Department *</Form.Label>
                      <Form.Select
                        name="departmentId"
                        value={centerControllerData.departmentId}
                        onChange={handleCenterControllerChange}
                        required
                        disabled={fetchingDepartments}
                      >
                        <option value="">{fetchingDepartments ? 'Loading departments...' : 'Choose department'}</option>
                        {departments.map(dept => (
                          <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.departmentName} (ID: {dept.departmentId})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Batch No *</Form.Label>
                      <Form.Select
                        name="batchNo"
                        value={centerControllerData.batchNo}
                        onChange={handleCenterControllerChange}
                        required
                        disabled={!centerControllerData.departmentId || fetchingBatches}
                      >
                        <option value="">{fetchingBatches ? 'Loading batches...' : 'Choose batch'}</option>
                        {getAvailableBatches().map(b => (
                          <option key={b.batchNo} value={b.batchNo}>
                            {b.batchNo}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Controllers</h6>
                      <Button variant="outline-success" size="sm" onClick={addController}>
                        + Add Controller
                      </Button>
                    </div>
                  </Col>

                  {centerControllerData.controllers.map((controller, index) => (
                    <Col xs={12} key={index}>
                      <Card className="mb-3">
                        <Card.Header className="py-2 d-flex justify-content-between align-items-center">
                          <span>Controller {index + 1}</span>
                          {centerControllerData.controllers.length > 1 && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeController(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-2">
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Controller Code (optional)</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={controller.controller_code || ''}
                                  onChange={(e) => handleControllerChange(index, 'controller_code', e.target.value)}
                                  placeholder="e.g., C123"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Controller Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={controller.controller_name || ''}
                                  onChange={(e) => handleControllerChange(index, 'controller_name', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Contact *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={controller.controller_contact || ''}
                                  onChange={(e) => handleControllerChange(index, 'controller_contact', e.target.value)}
                                  placeholder="10-15 digits"
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Email *</Form.Label>
                                <Form.Control
                                  type="email"
                                  value={controller.controller_email || ''}
                                  onChange={(e) => handleControllerChange(index, 'controller_email', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Password *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={controller.controller_pass || ''}
                                  onChange={(e) => handleControllerChange(index, 'controller_pass', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>District (optional)</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={controller.district || ''}
                                  onChange={(e) => handleControllerChange(index, 'district', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Center *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={controller.center || ''}
                                  onChange={(e) => handleControllerChange(index, 'center', e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}

                  <Col xs={12} className="mt-2">
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => setActiveAccordion('existing')}
                      >
                        Back
                      </Button>
                      <Button
                        variant="success"
                        type="submit"
                        disabled={
                          controllerLoading ||
                          !centerControllerData.departmentId ||
                          !centerControllerData.batchNo ||
                          centerControllerData.controllers.length === 0
                        }
                      >
                        {controllerLoading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Adding Controllers...
                          </>
                        ) : (
                          'Add Controllers'
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default DepartmentForms;
