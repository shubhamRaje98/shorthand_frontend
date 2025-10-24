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


// // src/components/super-admin/department-setup/AddDepartment.js
// import React, { useState, useEffect } from 'react';
// import {
//   Container, Row, Col, Card, Form, Button, Alert, Spinner,
//   Accordion
// } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AddDepartment = () => {
//   // State for new department creation
//   const [formData, setFormData] = useState({
//     departmentId: '',
//     departmentName: '',
//     departmentPassword: '',
//     logo: '',
//     departmentStatus: true
//   });

//   // State for adding batches to existing department
//   const [existingDeptData, setExistingDeptData] = useState({
//     departmentId: '',
//     batches: [{
//       batchNo: '',
//       batchdate: '',
//       reporting_time: '',
//       start_time: '',
//       end_time: '',
//       batchstatus: true
//     }]
//   });

//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [existingDeptLoading, setExistingDeptLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [logoFile, setLogoFile] = useState(null);
//   const [fetchingDepartments, setFetchingDepartments] = useState(true);
//   const [activeTab, setActiveTab] = useState('new'); // 'new' or 'existing'

//   const navigate = useNavigate();

//   // Load persisted data and departments on component mount
//   useEffect(() => {
//     loadPersistedData();
//     fetchDepartments();
//   }, []);

//   // Persist form data whenever it changes
//   useEffect(() => {
//     persistFormData();
//   }, [formData, existingDeptData, activeTab]);

//   const loadPersistedData = () => {
//     try {
//       const persisted = localStorage.getItem('departmentSetupData');
//       if (persisted) {
//         const data = JSON.parse(persisted);
//         if (data.formData) setFormData(data.formData);
//         if (data.existingDeptData) setExistingDeptData(data.existingDeptData);
//         if (data.activeTab) setActiveTab(data.activeTab);
//       }
//     } catch (error) {
//       console.error('Error loading persisted data:', error);
//     }
//   };

//   const persistFormData = () => {
//     try {
//       const dataToPersist = {
//         formData,
//         existingDeptData,
//         activeTab,
//         timestamp: new Date().toISOString()
//       };
//       localStorage.setItem('departmentSetupData', JSON.stringify(dataToPersist));
//     } catch (error) {
//       console.error('Error persisting data:', error);
//     }
//   };

//   const clearPersistedData = () => {
//     localStorage.removeItem('departmentSetupData');
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/new-department/departments');
//       setDepartments(response.data.data || []);
//     } catch (err) {
//       console.error('Error fetching departments:', err);
//       setMessage('Error loading departments');
//     } finally {
//       setFetchingDepartments(false);
//     }
//   };

//   // Handler for new department creation
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setMessage('File size must be less than 10MB');
//         return;
//       }
      
//       setLogoFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           logo: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleNewDepartmentSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.departmentId || !formData.departmentName || !formData.departmentPassword) {
//       setMessage('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await axios.post('http://localhost:3000/api/new-department/departments', formData);
      
//       setMessage('Department created successfully!');
//       clearPersistedData(); // Clear persisted data on successful creation
      
//       // Refresh departments list
//       await fetchDepartments();
      
//       // Redirect to next step after 2 seconds
//       setTimeout(() => {
//         navigate('/super-admin/add-exam-center');
//       }, 2000);

//     } catch (err) {
//       console.error('Error creating department:', err);
//       setMessage(err.response?.data?.message || 'Error creating department');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handlers for existing department batches
//   const handleExistingDeptChange = (e) => {
//     const { name, value } = e.target;
//     setExistingDeptData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleBatchChange = (index, field, value) => {
//     const updatedBatches = [...existingDeptData.batches];
//     updatedBatches[index] = {
//       ...updatedBatches[index],
//       [field]: value
//     };
//     setExistingDeptData(prev => ({
//       ...prev,
//       batches: updatedBatches
//     }));
//   };

//   const addBatch = () => {
//     setExistingDeptData(prev => ({
//       ...prev,
//       batches: [
//         ...prev.batches,
//         {
//           batchNo: '',
//           batchdate: '',
//           reporting_time: '',
//           start_time: '',
//           end_time: '',
//           batchstatus: true
//         }
//       ]
//     }));
//   };

//   const removeBatch = (index) => {
//     if (existingDeptData.batches.length > 1) {
//       const updatedBatches = existingDeptData.batches.filter((_, i) => i !== index);
//       setExistingDeptData(prev => ({
//         ...prev,
//         batches: updatedBatches
//       }));
//     }
//   };

//   const handleExistingDeptSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!existingDeptData.departmentId) {
//       setMessage('Please select a department');
//       return;
//     }

//     // Validate batches
//     const invalidBatches = existingDeptData.batches.filter(batch => 
//       !batch.batchNo || !batch.batchdate || !batch.reporting_time || !batch.start_time || !batch.end_time
//     );

//     if (invalidBatches.length > 0) {
//       setMessage('Please fill all required fields for all batches');
//       return;
//     }

//     setExistingDeptLoading(true);
//     setMessage('');

//     try {
//       const response = await axios.post(
//         'http://localhost:3000/api/new-department/existing-department/batches', 
//         existingDeptData
//       );
      
//       setMessage(`Batches added successfully! ${response.data.message}`);
//       clearPersistedData(); // Clear persisted data on successful creation
      
//       // Reset form
//       setExistingDeptData({
//         departmentId: '',
//         batches: [{
//           batchNo: '',
//           batchdate: '',
//           reporting_time: '',
//           start_time: '',
//           end_time: '',
//           batchstatus: true
//         }]
//       });

//       // Redirect to batch management or stay on page
//       setTimeout(() => {
//         navigate('/super-admin/department-setup');
//       }, 3000);

//     } catch (err) {
//       console.error('Error adding batches:', err);
//       setMessage(err.response?.data?.message || 'Error adding batches');
//     } finally {
//       setExistingDeptLoading(false);
//     }
//   };

//   return (
//     <Container className="my-4">
//       <Row className="justify-content-center">
//         <Col md={10} lg={8}>
//           <Card className="shadow">
//             <Card.Header className="bg-primary text-white">
//               <h4 className="mb-0">Step 1: Department Management</h4>
//               <small>Create new department or add batches to existing one</small>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {message && (
//                 <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
//                   {message}
//                 </Alert>
//               )}

//               <Accordion defaultActiveKey="new">
//                 {/* Create New Department */}
//                 <Accordion.Item eventKey="new">
//                   <Accordion.Header>
//                     <h5 className="mb-0">Create New Department</h5>
//                   </Accordion.Header>
//                   <Accordion.Body>
//                     <Form onSubmit={handleNewDepartmentSubmit}>
//                       <Row className="g-3">
//                         <Col md={6}>
//                           <Form.Group>
//                             <Form.Label>Department ID *</Form.Label>
//                             <Form.Control
//                               type="number"
//                               name="departmentId"
//                               value={formData.departmentId}
//                               onChange={handleChange}
//                               placeholder="Enter unique department ID"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>

//                         <Col md={6}>
//                           <Form.Group>
//                             <Form.Label>Department Status</Form.Label>
//                             <Form.Check
//                               type="switch"
//                               name="departmentStatus"
//                               checked={formData.departmentStatus}
//                               onChange={handleChange}
//                               label={formData.departmentStatus ? 'Active' : 'Inactive'}
//                             />
//                           </Form.Group>
//                         </Col>

//                         <Col xs={12}>
//                           <Form.Group>
//                             <Form.Label>Department Name *</Form.Label>
//                             <Form.Control
//                               type="text"
//                               name="departmentName"
//                               value={formData.departmentName}
//                               onChange={handleChange}
//                               placeholder="e.g., PWD Skill Test, Forest Department"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>

//                         <Col xs={12}>
//                           <Form.Group>
//                             <Form.Label>Department Password *</Form.Label>
//                             <Form.Control
//                               type="password"
//                               name="departmentPassword"
//                               value={formData.departmentPassword}
//                               onChange={handleChange}
//                               placeholder="Set department password"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>

//                         <Col xs={12}>
//                           <Form.Group>
//                             <Form.Label>Department Logo</Form.Label>
//                             <Form.Control
//                               type="file"
//                               accept="image/*"
//                               onChange={handleLogoChange}
//                             />
//                             <Form.Text className="text-muted">
//                               Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
//                             </Form.Text>
//                           </Form.Group>

//                           {formData.logo && (
//                             <div className="mt-2">
//                               <img 
//                                 src={formData.logo} 
//                                 alt="Logo preview" 
//                                 style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
//                               />
//                             </div>
//                           )}
//                         </Col>

//                         <Col xs={12} className="mt-4">
//                           <div className="d-flex justify-content-between">
//                             <Button 
//                               variant="secondary" 
//                               onClick={() => navigate('/super-admin/department-setup')}
//                             >
//                               Back to Dashboard
//                             </Button>
                            
//                             <Button 
//                               variant="primary" 
//                               type="submit" 
//                               disabled={loading}
//                             >
//                               {loading ? (
//                                 <>
//                                   <Spinner as="span" animation="border" size="sm" className="me-2" />
//                                   Creating...
//                                 </>
//                               ) : (
//                                 'Create Department & Continue'
//                               )}
//                             </Button>
//                           </div>
//                         </Col>
//                       </Row>
//                     </Form>
//                   </Accordion.Body>
//                 </Accordion.Item>

//                 {/* Add Batches to Existing Department */}
//                 <Accordion.Item eventKey="existing">
//                   <Accordion.Header>
//                     <h5 className="mb-0">Add Batches to Existing Department</h5>
//                   </Accordion.Header>
//                   <Accordion.Body>
//                     <Form onSubmit={handleExistingDeptSubmit}>
//                       <Row className="g-3">
//                         <Col xs={12}>
//                           <Form.Group>
//                             <Form.Label>Select Existing Department *</Form.Label>
//                             <Form.Select
//                               name="departmentId"
//                               value={existingDeptData.departmentId}
//                               onChange={handleExistingDeptChange}
//                               required
//                               disabled={fetchingDepartments}
//                             >
//                               <option value="">Choose a department</option>
//                               {departments.map(dept => (
//                                 <option key={dept.departmentId} value={dept.departmentId}>
//                                   {dept.departmentName} (ID: {dept.departmentId})
//                                 </option>
//                               ))}
//                             </Form.Select>
//                           </Form.Group>
//                         </Col>

//                         <Col xs={12}>
//                           <div className="d-flex justify-content-between align-items-center mb-3">
//                             <h6>Batches</h6>
//                             <Button variant="outline-success" size="sm" onClick={addBatch}>
//                               + Add Batch
//                             </Button>
//                           </div>

//                           {existingDeptData.batches.map((batch, index) => (
//                             <Card key={index} className="mb-3">
//                               <Card.Header className="py-2">
//                                 <div className="d-flex justify-content-between align-items-center">
//                                   <span>Batch {index + 1}</span>
//                                   {existingDeptData.batches.length > 1 && (
//                                     <Button 
//                                       variant="outline-danger" 
//                                       size="sm" 
//                                       onClick={() => removeBatch(index)}
//                                     >
//                                       Remove
//                                     </Button>
//                                   )}
//                                 </div>
//                               </Card.Header>
//                               <Card.Body>
//                                 <Row className="g-2">
//                                   <Col md={3}>
//                                     <Form.Group>
//                                       <Form.Label>Batch No *</Form.Label>
//                                       <Form.Control
//                                         type="number"
//                                         value={batch.batchNo}
//                                         onChange={(e) => handleBatchChange(index, 'batchNo', e.target.value)}
//                                         placeholder="Batch number"
//                                         required
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col md={3}>
//                                     <Form.Group>
//                                       <Form.Label>Date *</Form.Label>
//                                       <Form.Control
//                                         type="date"
//                                         value={batch.batchdate}
//                                         onChange={(e) => handleBatchChange(index, 'batchdate', e.target.value)}
//                                         required
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col md={2}>
//                                     <Form.Group>
//                                       <Form.Label>Reporting *</Form.Label>
//                                       <Form.Control
//                                         type="time"
//                                         value={batch.reporting_time}
//                                         onChange={(e) => handleBatchChange(index, 'reporting_time', e.target.value)}
//                                         required
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col md={2}>
//                                     <Form.Group>
//                                       <Form.Label>Start *</Form.Label>
//                                       <Form.Control
//                                         type="time"
//                                         value={batch.start_time}
//                                         onChange={(e) => handleBatchChange(index, 'start_time', e.target.value)}
//                                         required
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                   <Col md={2}>
//                                     <Form.Group>
//                                       <Form.Label>End *</Form.Label>
//                                       <Form.Control
//                                         type="time"
//                                         value={batch.end_time}
//                                         onChange={(e) => handleBatchChange(index, 'end_time', e.target.value)}
//                                         required
//                                       />
//                                     </Form.Group>
//                                   </Col>
//                                 </Row>
//                               </Card.Body>
//                             </Card>
//                           ))}
//                         </Col>

//                         <Col xs={12} className="mt-4">
//                           <div className="d-flex justify-content-between">
//                             <Button 
//                               variant="secondary" 
//                               onClick={() => navigate('/super-admin/department-setup')}
//                             >
//                               Back to Dashboard
//                             </Button>
                            
//                             <Button 
//                               variant="success" 
//                               type="submit" 
//                               disabled={existingDeptLoading || !existingDeptData.departmentId}
//                             >
//                               {existingDeptLoading ? (
//                                 <>
//                                   <Spinner as="span" animation="border" size="sm" className="me-2" />
//                                   Adding Batches...
//                                 </>
//                               ) : (
//                                 'Add Batches to Department'
//                               )}
//                             </Button>
//                           </div>
//                         </Col>
//                       </Row>
//                     </Form>
//                   </Accordion.Body>
//                 </Accordion.Item>
//               </Accordion>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddDepartment;


// src/components/super-admin/department-setup/AddDepartment.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner,
  Accordion, Table, Badge
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddDepartment = () => {
  // State for new department creation
  const [formData, setFormData] = useState({
    departmentId: '',
    departmentName: '',
    departmentPassword: '',
    logo: '',
    departmentStatus: true
  });

  // State for adding batches to existing department
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

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingDeptLoading, setExistingDeptLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState('new');
  const [refreshingDepartments, setRefreshingDepartments] = useState(false);
  const [showDepartmentsTable, setShowDepartmentsTable] = useState(false);

  const navigate = useNavigate();

  // Load persisted data and departments on component mount
  useEffect(() => {
    loadPersistedData();
    fetchDepartments();
  }, []);

  // Persist form data whenever it changes
  useEffect(() => {
    persistFormData();
  }, [formData, existingDeptData, activeAccordion]);

  const loadPersistedData = () => {
    try {
      const persisted = localStorage.getItem('departmentSetupData');
      if (persisted) {
        const data = JSON.parse(persisted);
        if (data.formData) setFormData(data.formData);
        if (data.existingDeptData) setExistingDeptData(data.existingDeptData);
        if (data.activeAccordion) setActiveAccordion(data.activeAccordion);
        if (data.showDepartmentsTable) setShowDepartmentsTable(data.showDepartmentsTable);
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const persistFormData = () => {
    try {
      const dataToPersist = {
        formData,
        existingDeptData,
        activeAccordion,
        showDepartmentsTable,
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

  const fetchDepartments = async () => {
    setRefreshingDepartments(true);
    try {
      const response = await axios.get('http://localhost:3000/api/new-department/departments');
      setDepartments(response.data.data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setMessage('Error loading departments');
    } finally {
      setFetchingDepartments(false);
      setRefreshingDepartments(false);
    }
  };

  // Handler for new department creation
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
      const response = await axios.post('http://localhost:3000/api/new-department/departments', formData);
      
      const newDepartmentId = formData.departmentId;
      const newDepartmentName = formData.departmentName;
      
      // Clear form data
      setFormData({
        departmentId: '',
        departmentName: '',
        departmentPassword: '',
        logo: '',
        departmentStatus: true
      });
      setLogoFile(null);
      
      // Refresh departments list and show table
      await fetchDepartments();
      setShowDepartmentsTable(true);
      
      // Success message
      setMessage(`✅ Department "${newDepartmentName}" created successfully! View all departments in the table on the right.`);
      
      // Auto-select the new department in existing department dropdown
      setExistingDeptData(prev => ({
        ...prev,
        departmentId: newDepartmentId
      }));
      
      // Auto-expand the existing department accordion
      setActiveAccordion("existing");

    } catch (err) {
      console.error('Error creating department:', err);
      setMessage(err.response?.data?.message || 'Error creating department');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for existing department batches
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

  const handleExistingDeptSubmit = async (e) => {
    e.preventDefault();
    
    if (!existingDeptData.departmentId) {
      setMessage('Please select a department');
      return;
    }

    // Validate batches
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
      const response = await axios.post(
        'http://localhost:3000/api/new-department/existing-department/batches', 
        existingDeptData
      );
      
      setMessage(`✅ Batches added successfully! ${response.data.message}`);
      clearPersistedData();
      
      // Reset form
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

    } catch (err) {
      console.error('Error adding batches:', err);
      setMessage(err.response?.data?.message || 'Error adding batches');
    } finally {
      setExistingDeptLoading(false);
    }
  };

  // Manual navigation function
  const handleContinueToNextStep = () => {
    clearPersistedData();
    navigate('/super-admin/add-exam-center');
  };

  return (
    <Container fluid className="my-4">
      <Row className="g-4">
        {/* Left Side - Form */}
        <Col lg={showDepartmentsTable ? 8 : 12}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Step 1: Department Management</h4>
              <small>Create new department or add batches to existing one</small>
            </Card.Header>
            <Card.Body className="p-4">
              {message && (
                <Alert variant={message.includes('successfully') || message.includes('✅') ? 'success' : 'danger'}>
                  {message}
                </Alert>
              )}

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
                                  : 'Choose a department'
                                }
                              </option>
                              {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                  {dept.departmentName} (ID: {dept.departmentId})
                                </option>
                              ))}
                            </Form.Select>
                            <div className="mt-2">
                              <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={fetchDepartments}
                                disabled={refreshingDepartments}
                              >
                                {refreshingDepartments ? (
                                  <>
                                    <Spinner as="span" animation="border" size="sm" className="me-1" />
                                    Refreshing...
                                  </>
                                ) : (
                                  '🔄 Refresh List'
                                )}
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col xs={12}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>Batches</h6>
                            <Button variant="outline-success" size="sm" onClick={addBatch}>
                              + Add Batch
                            </Button>
                          </div>

                          {existingDeptData.batches.map((batch, index) => (
                            <Card key={index} className="mb-3">
                              <Card.Header className="py-2">
                                <div className="d-flex justify-content-between align-items-center">
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
                                </div>
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
                                </Row>
                              </Card.Body>
                            </Card>
                          ))}
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
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Manual Continue Button - Only show if departments table is visible */}
              {showDepartmentsTable && (
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

        {/* Right Side - Departments Table (Only show after department creation) */}
        {showDepartmentsTable && (
          <Col lg={4}>
            <Card className="shadow">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">All Departments</h5>
                <small>Recently created and existing departments</small>
              </Card.Header>
              <Card.Body className="p-0">
                {departments.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading departments...
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table hover className="mb-0">
                      <thead className="bg-light sticky-top">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((dept) => (
                          <tr key={dept.departmentId}>
                            <td>
                              <strong>{dept.departmentId}</strong>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>
                                  {dept.departmentName}
                                </div>
                                {dept.logo && (
                                  <img 
                                    src={dept.logo} 
                                    alt="Logo" 
                                    style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                                    className="mt-1"
                                  />
                                )}
                              </div>
                            </td>
                            <td>
                              <Badge 
                                bg={dept.departmentStatus ? 'success' : 'secondary'}
                                className="text-white"
                              >
                                {dept.departmentStatus ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
                
                {/* Table Footer */}
                <div className="p-3 bg-light border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Total: {departments.length} department{departments.length !== 1 ? 's' : ''}
                    </small>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={fetchDepartments}
                      disabled={refreshingDepartments}
                    >
                      {refreshingDepartments ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        '🔄'
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AddDepartment;
