// // // src/components/super-admin/department-setup/AddDepartment.js
// // import React, { useState } from 'react';
// // import {
// //   Container, Row, Col, Card, Form, Button, Alert, Spinner
// // } from 'react-bootstrap';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';

// // const AddDepartment = () => {
// //   const [formData, setFormData] = useState({
// //     departmentId: '',
// //     departmentName: '',
// //     departmentPassword: '',
// //     logo: '',
// //     departmentStatus: true
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const [logoFile, setLogoFile] = useState(null);

// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value
// //     }));
// //   };

// //   const handleLogoChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > 10 * 1024 * 1024) { // 10MB limit
// //         setMessage('File size must be less than 10MB');
// //         return;
// //       }
      
// //       setLogoFile(file);
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setFormData(prev => ({
// //           ...prev,
// //           logo: reader.result
// //         }));
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!formData.departmentId || !formData.departmentName || !formData.departmentPassword) {
// //       setMessage('Please fill all required fields');
// //       return;
// //     }

// //     setLoading(true);
// //     setMessage('');

// //     try {
// //       const response = await axios.post('http://localhost:3000/api/new-department/departments', formData);
      
// //       setMessage('Department created successfully!');
      
// //       // Redirect to next step after 2 seconds
// //       setTimeout(() => {
// //         navigate('/super-admin/add-exam-center');
// //       }, 2000);

// //     } catch (err) {
// //       console.error('Error creating department:', err);
// //       setMessage(err.response?.data?.message || 'Error creating department');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Container className="my-4">
// //       <Row className="justify-content-center">
// //         <Col md={8} lg={6}>
// //           <Card className="shadow">
// //             <Card.Header className="bg-primary text-white">
// //               <h4 className="mb-0">Step 1: Add Department</h4>
// //               <small>Create a new department to conduct exams</small>
// //             </Card.Header>
// //             <Card.Body className="p-4">
// //               {message && (
// //                 <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
// //                   {message}
// //                 </Alert>
// //               )}

// //               <Form onSubmit={handleSubmit}>
// //                 <Row className="g-3">
// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Department ID *</Form.Label>
// //                       <Form.Control
// //                         type="number"
// //                         name="departmentId"
// //                         value={formData.departmentId}
// //                         onChange={handleChange}
// //                         placeholder="Enter unique department ID"
// //                         required
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Department Status</Form.Label>
// //                       <Form.Check
// //                         type="switch"
// //                         name="departmentStatus"
// //                         checked={formData.departmentStatus}
// //                         onChange={handleChange}
// //                         label={formData.departmentStatus ? 'Active' : 'Inactive'}
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col xs={12}>
// //                     <Form.Group>
// //                       <Form.Label>Department Name *</Form.Label>
// //                       <Form.Control
// //                         type="text"
// //                         name="departmentName"
// //                         value={formData.departmentName}
// //                         onChange={handleChange}
// //                         placeholder="e.g., PWD Skill Test, Forest Department"
// //                         required
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col xs={12}>
// //                     <Form.Group>
// //                       <Form.Label>Department Password *</Form.Label>
// //                       <Form.Control
// //                         type="password"
// //                         name="departmentPassword"
// //                         value={formData.departmentPassword}
// //                         onChange={handleChange}
// //                         placeholder="Set department password"
// //                         required
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col xs={12}>
// //                     <Form.Group>
// //                       <Form.Label>Department Logo</Form.Label>
// //                       <Form.Control
// //                         type="file"
// //                         accept="image/*"
// //                         onChange={handleLogoChange}
// //                       />
// //                       <Form.Text className="text-muted">
// //                         Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
// //                       </Form.Text>
// //                     </Form.Group>

// //                     {formData.logo && (
// //                       <div className="mt-2">
// //                         <img 
// //                           src={formData.logo} 
// //                           alt="Logo preview" 
// //                           style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
// //                         />
// //                       </div>
// //                     )}
// //                   </Col>

// //                   <Col xs={12} className="mt-4">
// //                     <div className="d-flex justify-content-between">
// //                       <Button 
// //                         variant="secondary" 
// //                         onClick={() => navigate('/super-admin/department-setup')}
// //                       >
// //                         Back to Dashboard
// //                       </Button>
                      
// //                       <Button 
// //                         variant="primary" 
// //                         type="submit" 
// //                         disabled={loading}
// //                       >
// //                         {loading ? (
// //                           <>
// //                             <Spinner as="span" animation="border" size="sm" className="me-2" />
// //                             Creating...
// //                           </>
// //                         ) : (
// //                           'Create Department & Continue'
// //                         )}
// //                       </Button>
// //                     </div>
// //                   </Col>
// //                 </Row>
// //               </Form>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default AddDepartment;


// src/components/super-admin/department-setup/AddDepartment.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner,
  Accordion, ButtonGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import modular components
import DepartmentForms from './DepartmentForms';
import DepartmentTables from './DepartmentTables';

const AddDepartment = () => {
  // State management
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [controllers, setControllers] = useState([]);
  const [newlyAddedBatches, setNewlyAddedBatches] = useState([]);
  const [newlyAddedControllers, setNewlyAddedControllers] = useState([]);
  const [message, setMessage] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('new');
  const [fetchingDepartments, setFetchingDepartments] = useState(true);
  
  // Table visibility states - controlled by buttons
  const [activeTable, setActiveTable] = useState(''); // 'departments', 'batches', 'controllers', or ''

  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    loadPersistedData();
    fetchDepartments();
  }, []);

  // Reset table visibility when leaving component or route change
  useEffect(() => {
    return () => {
      setActiveTable(''); // Clear table when component unmounts
    };
  }, []);

  const loadPersistedData = () => {
    try {
      const persisted = localStorage.getItem('departmentSetupData');
      if (persisted) {
        const data = JSON.parse(persisted);
        if (data.activeAccordion) setActiveAccordion(data.activeAccordion);
        if (data.newlyAddedBatches) setNewlyAddedBatches(data.newlyAddedBatches);
        if (data.newlyAddedControllers) setNewlyAddedControllers(data.newlyAddedControllers);
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const persistFormData = (data) => {
    try {
      const dataToPersist = {
        ...data,
        activeAccordion,
        newlyAddedBatches,
        newlyAddedControllers,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('departmentSetupData', JSON.stringify(dataToPersist));
    } catch (error) {
      console.error('Error persisting data:', error);
    }
  };

  const clearPersistedData = () => {
    localStorage.removeItem('departmentSetupData');
  };

  // API functions
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/new-department/departments');
      setDepartments(response.data.data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setMessage('Error loading departments');
    } finally {
      setFetchingDepartments(false);
    }
  };

  const fetchBatches = async (departmentId = null) => {
    try {
      const url = departmentId 
        ? `http://localhost:3000/api/new-department/batches/${departmentId}`
        : 'http://localhost:3000/api/new-department/batches';
      
      const response = await axios.get(url);
      const fetchedBatches = response.data.data || [];
      
      // Sort batches to show newest first
      const sortedBatches = sortBatchesByNewest(fetchedBatches);
      setBatches(sortedBatches);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setMessage('Error loading batches');
    }
  };

  const fetchControllers = async (departmentId = null, batchNo = null) => {
    try {
      let url = 'http://localhost:3000/api/new-department/controllers';
      
      if (departmentId && batchNo) {
        url = `http://localhost:3000/api/new-department/controllers/department/${departmentId}/batch/${batchNo}`;
      } else if (departmentId) {
        url = `http://localhost:3000/api/new-department/controllers/department/${departmentId}`;
      }
      
      const response = await axios.get(url);
      const fetchedControllers = response.data.data || [];
      
      // Sort controllers to show newest first
      const sortedControllers = sortControllersByNewest(fetchedControllers);
      setControllers(sortedControllers);
    } catch (err) {
      console.error('Error fetching controllers:', err);
      setMessage('Error loading controllers');
    }
  };

  // Sorting functions
  const sortBatchesByNewest = (batchList) => {
    return batchList.sort((a, b) => {
      const aIsNew = newlyAddedBatches.some(newBatch => 
        newBatch.batchNo == a.batchNo && 
        newBatch.batchdate === a.batchdate &&
        newBatch.departmentId == a.departmentId
      );
      const bIsNew = newlyAddedBatches.some(newBatch => 
        newBatch.batchNo == b.batchNo && 
        newBatch.batchdate === b.batchdate &&
        newBatch.departmentId == b.departmentId
      );

      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;

      const dateA = new Date(a.batchdate);
      const dateB = new Date(b.batchdate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB - dateA;
      }

      return parseInt(b.batchNo) - parseInt(a.batchNo);
    });
  };

  const sortControllersByNewest = (controllerList) => {
    return controllerList.sort((a, b) => {
      const aIsNew = newlyAddedControllers.some(newController => 
        newController.controller_code == a.controller_code && 
        newController.departmentId == a.departmentId &&
        newController.batchNo == a.batchNo
      );
      const bIsNew = newlyAddedControllers.some(newController => 
        newController.controller_code == b.controller_code && 
        newController.departmentId == b.departmentId &&
        newController.batchNo == b.batchNo
      );

      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;

      return parseInt(b.controller_code) - parseInt(a.controller_code);
    });
  };

  // Table control functions
  const handleShowDepartments = async () => {
    setActiveTable('departments');
    await fetchDepartments();
  };

  const handleShowBatches = async () => {
    setActiveTable('batches');
    await fetchBatches();
  };

  const handleShowControllers = async () => {
    setActiveTable('controllers');
    await fetchControllers();
  };

  const handleContinueToNextStep = () => {
    navigate('/super-admin/add-exam-center');
  };

  // Check functions for newly added items
  const isNewlyAddedBatch = (batch) => {
    return newlyAddedBatches.some(newBatch => 
      newBatch.batchNo == batch.batchNo && 
      newBatch.batchdate === batch.batchdate &&
      newBatch.departmentId == batch.departmentId
    );
  };

  const isNewlyAddedController = (controller) => {
    return newlyAddedControllers.some(newController => 
      newController.controller_code == controller.controller_code && 
      newController.departmentId == controller.departmentId &&
      newController.batchNo == controller.batchNo
    );
  };

  // Calculate layout sizes
  const getLeftColSize = () => {
    return activeTable ? 8 : 12;
  };

  const getRightColSize = () => {
    return 4;
  };

  return (
    <Container fluid className="my-4">
      <Row className="g-4">
        {/* Left Side - Forms */}
        <Col lg={getLeftColSize()}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">Step 1: Department Management</h4>
                  <small>Create department, add batches, and assign center controllers</small>
                </div>
                
                {/* Table Control Buttons */}
                <ButtonGroup size="sm">
                  <Button 
                    variant={activeTable === 'departments' ? 'success' : 'outline-light'}
                    onClick={handleShowDepartments}
                  >
                    📋 Departments
                  </Button>
                  <Button 
                    variant={activeTable === 'batches' ? 'info' : 'outline-light'}
                    onClick={handleShowBatches}
                  >
                    📅 Batches
                  </Button>
                  <Button 
                    variant={activeTable === 'controllers' ? 'warning' : 'outline-light'}
                    onClick={handleShowControllers}
                  >
                    👤 Controllers
                  </Button>
                  {activeTable && (
                    <Button 
                      variant="outline-light"
                      onClick={() => setActiveTable('')}
                    >
                      ✕
                    </Button>
                  )}
                </ButtonGroup>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {message && (
                <Alert variant={message.includes('successfully') || message.includes('✅') ? 'success' : 'danger'}>
                  {message}
                </Alert>
              )}

              <DepartmentForms
                activeAccordion={activeAccordion}
                setActiveAccordion={setActiveAccordion}
                departments={departments}
                setDepartments={setDepartments}
                setMessage={setMessage}
                fetchDepartments={fetchDepartments}
                fetchBatches={fetchBatches}
                fetchControllers={fetchControllers}
                newlyAddedBatches={newlyAddedBatches}
                setNewlyAddedBatches={setNewlyAddedBatches}
                newlyAddedControllers={newlyAddedControllers}
                setNewlyAddedControllers={setNewlyAddedControllers}
                persistFormData={persistFormData}
                clearPersistedData={clearPersistedData}
                navigate={navigate}
                fetchingDepartments={fetchingDepartments}
                onDepartmentSuccess={() => setActiveTable('departments')}
                onBatchSuccess={() => setActiveTable('batches')}
                onControllerSuccess={() => setActiveTable('controllers')}
              />

              {/* Continue Button */}
              {activeTable && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={handleContinueToNextStep}
                  >
                    Continue to Next Step (Add Exam Center) →
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side - Table Display */}
        {activeTable && (
          <Col lg={getRightColSize()}>
            <DepartmentTables
              activeTable={activeTable}
              departments={departments}
              batches={batches}
              controllers={controllers}
              fetchDepartments={fetchDepartments}
              fetchBatches={fetchBatches}
              fetchControllers={fetchControllers}
              newlyAddedBatches={newlyAddedBatches}
              newlyAddedControllers={newlyAddedControllers}
              isNewlyAddedBatch={isNewlyAddedBatch}
              isNewlyAddedController={isNewlyAddedController}
              loading={fetchingDepartments}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AddDepartment;
