// // src/components/super-admin/department-setup/DepartmentForms.js
// import React, { useState, useEffect } from 'react';
// import {
//   Accordion, Row, Col, Form, Button, Spinner, Card
// } from 'react-bootstrap';
// import axios from 'axios';

// const DepartmentForms = ({
//   activeAccordion,
//   setActiveAccordion,
//   departments,
//   setDepartments,
//   setMessage,
//   fetchDepartments,
//   fetchBatches,
//   fetchControllers,
//   newlyAddedBatches,
//   setNewlyAddedBatches,
//   newlyAddedControllers,
//   setNewlyAddedControllers,
//   persistFormData,
//   clearPersistedData,
//   navigate,
//   fetchingDepartments,
//   onDepartmentSuccess,
//   onBatchSuccess,
//   onControllerSuccess
// }) => {
//   // Create Department Form State
//   const [formData, setFormData] = useState({
//     departmentId: '',
//     departmentName: '',
//     departmentPassword: '',
//     logo: '',
//     departmentStatus: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [logoFile, setLogoFile] = useState(null);

//   // Add Batches Form State
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
//   const [existingDeptLoading, setExistingDeptLoading] = useState(false);
//   const [refreshingDepartments, setRefreshingDepartments] = useState(false);

//   // Add Controllers Form State
//   const [centerControllerData, setCenterControllerData] = useState({
//     departmentId: '',
//     batchNo: '',
//     controllers: [{
//       controller_code: '',
//       controller_contact: '',
//       controller_email: '',
//       controller_name: '',
//       controller_pass: '',
//       district: '',
//       center: ''
//     }]
//   });
//   const [controllerLoading, setControllerLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [fetchingBatches, setFetchingBatches] = useState(false);

//   // Persist form data
//   useEffect(() => {
//     persistFormData({ formData, existingDeptData, centerControllerData });
//   }, [formData, existingDeptData, centerControllerData]);

//   // Fetch batches when department is selected for controllers
//   useEffect(() => {
//     if (centerControllerData.departmentId) {
//       fetchBatchesByDepartment(centerControllerData.departmentId);
//     }
//   }, [centerControllerData.departmentId]);

//   // Create Department Handlers
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
      
//       const newDepartmentId = formData.departmentId;
//       const newDepartmentName = formData.departmentName;
      
//       // Clear form data
//       setFormData({
//         departmentId: '',
//         departmentName: '',
//         departmentPassword: '',
//         logo: '',
//         departmentStatus: true
//       });
//       setLogoFile(null);
//       clearPersistedData();
      
//       // Refresh departments list
//       await fetchDepartments();
      
//       // Success message
//       setMessage(`✅ Department "${newDepartmentName}" created successfully! Click "Departments" button to view all departments.`);
      
//       // Auto-expand the batch accordion
//       setActiveAccordion("existing");
      
//       // Trigger success callback
//       onDepartmentSuccess(newDepartmentId);

//     } catch (err) {
//       console.error('Error creating department:', err);
//       setMessage(err.response?.data?.message || 'Error creating department');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add Batches Handlers
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

//   const handleRefreshDepartments = async () => {
//     setRefreshingDepartments(true);
//     await fetchDepartments();
//     setRefreshingDepartments(false);
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
      
//       const selectedDepartment = departments.find(dept => dept.departmentId == existingDeptData.departmentId);
//       const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      
//       // Track newly added batches for prioritized display
//       const newBatches = existingDeptData.batches.map(batch => ({
//         ...batch,
//         departmentId: existingDeptData.departmentId,
//         timestamp: new Date().toISOString()
//       }));
      
//       setNewlyAddedBatches(prev => [...prev, ...newBatches]);
      
//       setMessage(`✅ Batches added successfully to "${departmentName}"! Click "Batches" button to view all batches (newest batches shown first).`);
      
//       // Auto-expand the controllers accordion
//       setActiveAccordion("controllers");
      
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

//       // Trigger success callback
//       onBatchSuccess(existingDeptData.departmentId);

//     } catch (err) {
//       console.error('Error adding batches:', err);
//       setMessage(err.response?.data?.message || 'Error adding batches');
//     } finally {
//       setExistingDeptLoading(false);
//     }
//   };

//   // Add Controllers Handlers
//   const fetchBatchesByDepartment = async (departmentId) => {
//     setFetchingBatches(true);
//     try {
//       const response = await axios.get(`http://localhost:3000/api/new-department/controllers/batches/department/${departmentId}`);
//       const fetchedBatches = response.data.data || [];
//       setBatches(fetchedBatches);
//     } catch (err) {
//       console.error('Error fetching batches by department:', err);
//     } finally {
//       setFetchingBatches(false);
//     }
//   };

//   const handleCenterControllerChange = (e) => {
//     const { name, value } = e.target;
//     setCenterControllerData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleControllerChange = (index, field, value) => {
//     const updatedControllers = [...centerControllerData.controllers];
//     updatedControllers[index] = {
//       ...updatedControllers[index],
//       [field]: value
//     };
//     setCenterControllerData(prev => ({
//       ...prev,
//       controllers: updatedControllers
//     }));
//   };

//   const addController = () => {
//     setCenterControllerData(prev => ({
//       ...prev,
//       controllers: [
//         ...prev.controllers,
//         {
//           controller_code: '',
//           controller_contact: '',
//           controller_email: '',
//           controller_name: '',
//           controller_pass: '',
//           district: '',
//           center: ''
//         }
//       ]
//     }));
//   };

//   const removeController = (index) => {
//     if (centerControllerData.controllers.length > 1) {
//       const updatedControllers = centerControllerData.controllers.filter((_, i) => i !== index);
//       setCenterControllerData(prev => ({
//         ...prev,
//         controllers: updatedControllers
//       }));
//     }
//   };

//   const getAvailableBatches = () => {
//     if (!centerControllerData.departmentId) return [];
//     return batches.filter(batch => batch.departmentId == centerControllerData.departmentId);
//   };

//   // Updated: Handle null values for optional controller_code AND district
//   const processControllersForSubmission = (controllers) => {
//     return controllers.map(controller => ({
//       ...controller,
//       // Set controller_code to null if empty (optional field)
//       controller_code: controller.controller_code.trim() === '' ? null : controller.controller_code,
//       // Set district to null if empty (optional field)
//       district: controller.district.trim() === '' ? null : controller.district
//     }));
//   };

//   const handleCenterControllerSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!centerControllerData.departmentId || !centerControllerData.batchNo) {
//       setMessage('Please select a department and batch number');
//       return;
//     }

//     // Updated validation: controller_code AND district are optional, center is required
//     const invalidControllers = centerControllerData.controllers.filter(controller => 
//       !controller.controller_contact || 
//       !controller.controller_email || !controller.controller_name || 
//       !controller.controller_pass || !controller.center
//     );

//     if (invalidControllers.length > 0) {
//       setMessage('Please fill all required fields for all controllers (Controller Code and District are optional, Center is required)');
//       return;
//     }

//     setControllerLoading(true);
//     setMessage('');

//     try {
//       // Process controllers to handle null values for optional fields
//       const processedControllers = processControllersForSubmission(centerControllerData.controllers);

//       const response = await axios.post('http://localhost:3000/api/new-department/controllers', {
//         departmentId: centerControllerData.departmentId,
//         batchNo: centerControllerData.batchNo,
//         controllers: processedControllers
//       });
      
//       const selectedDepartment = departments.find(dept => dept.departmentId == centerControllerData.departmentId);
//       const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      
//       // Track newly added controllers for prioritized display
//       const newControllers = centerControllerData.controllers.map(controller => ({
//         ...controller,
//         departmentId: centerControllerData.departmentId,
//         batchNo: centerControllerData.batchNo,
//         timestamp: new Date().toISOString()
//       }));
      
//       setNewlyAddedControllers(prev => [...prev, ...newControllers]);
      
//       setMessage(`✅ Center Controllers added successfully to "${departmentName}" - Batch ${centerControllerData.batchNo}! Click "Controllers" button to view all controllers (newest controllers shown first).`);
      
//       // Reset form
//       setCenterControllerData({
//         departmentId: '',
//         batchNo: '',
//         controllers: [{
//           controller_code: '',
//           controller_contact: '',
//           controller_email: '',
//           controller_name: '',
//           controller_pass: '',
//           district: '',
//           center: ''
//         }]
//       });

//       // Trigger success callback
//       onControllerSuccess(centerControllerData.departmentId, centerControllerData.batchNo);

//     } catch (err) {
//       console.error('Error adding controllers:', err);
//       const errorMessage = err.response?.data?.message || 'Error adding controllers';
//       setMessage(errorMessage);
//     } finally {
//       setControllerLoading(false);
//     }
//   };

//   return (
//     <Accordion activeKey={activeAccordion} onSelect={(key) => setActiveAccordion(key)}>
//       {/* Create New Department */}
//       <Accordion.Item eventKey="new">
//         <Accordion.Header>
//           <h5 className="mb-0">Create New Department</h5>
//         </Accordion.Header>
//         <Accordion.Body>
//           <Form onSubmit={handleNewDepartmentSubmit}>
//             <Row className="g-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Department ID *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="departmentId"
//                     value={formData.departmentId}
//                     onChange={handleChange}
//                     placeholder="Enter unique department ID"
//                     required
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Department Status</Form.Label>
//                   <Form.Check
//                     type="switch"
//                     name="departmentStatus"
//                     checked={formData.departmentStatus}
//                     onChange={handleChange}
//                     label={formData.departmentStatus ? 'Active' : 'Inactive'}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col xs={12}>
//                 <Form.Group>
//                   <Form.Label>Department Name *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="departmentName"
//                     value={formData.departmentName}
//                     onChange={handleChange}
//                     placeholder="e.g., PWD Skill Test, Forest Department"
//                     required
//                   />
//                 </Form.Group>
//               </Col>

//               <Col xs={12}>
//                 <Form.Group>
//                   <Form.Label>Department Password *</Form.Label>
//                   <Form.Control
//                     type="password"
//                     name="departmentPassword"
//                     value={formData.departmentPassword}
//                     onChange={handleChange}
//                     placeholder="Set department password"
//                     required
//                   />
//                 </Form.Group>
//               </Col>

//               <Col xs={12}>
//                 <Form.Group>
//                   <Form.Label>Department Logo</Form.Label>
//                   <Form.Control
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoChange}
//                     value=""
//                   />
//                   <Form.Text className="text-muted">
//                     Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
//                   </Form.Text>
//                 </Form.Group>

//                 {formData.logo && (
//                   <div className="mt-2">
//                     <img 
//                       src={formData.logo} 
//                       alt="Logo preview" 
//                       style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
//                     />
//                   </div>
//                 )}
//               </Col>

//               <Col xs={12} className="mt-4">
//                 <div className="d-flex justify-content-between">
//                   <Button 
//                     variant="secondary" 
//                     onClick={() => navigate('/super-admin/department-setup')}
//                   >
//                     Back to Dashboard
//                   </Button>
                  
//                   <Button 
//                     variant="primary" 
//                     type="submit" 
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Creating...
//                       </>
//                     ) : (
//                       'Create Department'
//                     )}
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </Accordion.Body>
//       </Accordion.Item>

//       {/* Add Batches to Existing Department */}
//       <Accordion.Item eventKey="existing">
//         <Accordion.Header>
//           <h5 className="mb-0">
//             Add Batches to Existing Department
//             {refreshingDepartments && (
//               <Spinner as="span" animation="border" size="sm" className="ms-2" />
//             )}
//           </h5>
//         </Accordion.Header>
//         <Accordion.Body>
//           <Form onSubmit={handleExistingDeptSubmit}>
//             <Row className="g-3">
//               <Col xs={12}>
//                 <Form.Group>
//                   <Form.Label>
//                     Select Existing Department *
//                     {departments.length > 0 && (
//                       <span className="text-muted ms-2">({departments.length} available)</span>
//                     )}
//                   </Form.Label>
//                   <Form.Select
//                     name="departmentId"
//                     value={existingDeptData.departmentId}
//                     onChange={handleExistingDeptChange}
//                     required
//                     disabled={fetchingDepartments || refreshingDepartments}
//                   >
//                     <option value="">
//                       {fetchingDepartments || refreshingDepartments 
//                         ? 'Loading departments...' 
//                         : 'Choose a department'
//                       }
//                     </option>
//                     {departments.map(dept => (
//                       <option key={dept.departmentId} value={dept.departmentId}>
//                         {dept.departmentName} (ID: {dept.departmentId})
//                       </option>
//                     ))}
//                   </Form.Select>
//                   <div className="mt-2">
//                     <Button 
//                       variant="outline-secondary" 
//                       size="sm" 
//                       onClick={handleRefreshDepartments}
//                       disabled={refreshingDepartments}
//                     >
//                       {refreshingDepartments ? (
//                         <>
//                           <Spinner as="span" animation="border" size="sm" className="me-1" />
//                           Refreshing...
//                         </>
//                       ) : (
//                         '🔄 Refresh List'
//                       )}
//                     </Button>
//                   </div>
//                 </Form.Group>
//               </Col>

//               <Col xs={12}>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h6>Batches</h6>
//                   <Button variant="outline-success" size="sm" onClick={addBatch}>
//                     + Add Batch
//                   </Button>
//                 </div>

//                 {existingDeptData.batches.map((batch, index) => (
//                   <Card key={index} className="mb-3">
//                     <Card.Header className="py-2">
//                       <div className="d-flex justify-content-between align-items-center">
//                         <span>Batch {index + 1}</span>
//                         {existingDeptData.batches.length > 1 && (
//                           <Button 
//                             variant="outline-danger" 
//                             size="sm" 
//                             onClick={() => removeBatch(index)}
//                           >
//                             Remove
//                           </Button>
//                         )}
//                       </div>
//                     </Card.Header>
//                     <Card.Body>
//                       <Row className="g-2">
//                         <Col md={3}>
//                           <Form.Group>
//                             <Form.Label>Batch No *</Form.Label>
//                             <Form.Control
//                               type="number"
//                               value={batch.batchNo}
//                               onChange={(e) => handleBatchChange(index, 'batchNo', e.target.value)}
//                               placeholder="Batch number"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={3}>
//                           <Form.Group>
//                             <Form.Label>Date *</Form.Label>
//                             <Form.Control
//                               type="date"
//                               value={batch.batchdate}
//                               onChange={(e) => handleBatchChange(index, 'batchdate', e.target.value)}
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={2}>
//                           <Form.Group>
//                             <Form.Label>Reporting *</Form.Label>
//                             <Form.Control
//                               type="time"
//                               value={batch.reporting_time}
//                               onChange={(e) => handleBatchChange(index, 'reporting_time', e.target.value)}
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={2}>
//                           <Form.Group>
//                             <Form.Label>Start *</Form.Label>
//                             <Form.Control
//                               type="time"
//                               value={batch.start_time}
//                               onChange={(e) => handleBatchChange(index, 'start_time', e.target.value)}
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={2}>
//                           <Form.Group>
//                             <Form.Label>End *</Form.Label>
//                             <Form.Control
//                               type="time"
//                               value={batch.end_time}
//                               onChange={(e) => handleBatchChange(index, 'end_time', e.target.value)}
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 ))}
//               </Col>

//               <Col xs={12} className="mt-4">
//                 <div className="d-flex justify-content-between">
//                   <Button 
//                     variant="secondary" 
//                     onClick={() => navigate('/super-admin/department-setup')}
//                   >
//                     Back to Dashboard
//                   </Button>
                  
//                   <Button 
//                     variant="success" 
//                     type="submit" 
//                     disabled={existingDeptLoading || !existingDeptData.departmentId}
//                   >
//                     {existingDeptLoading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Adding Batches...
//                       </>
//                     ) : (
//                       'Add Batches to Department'
//                     )}
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </Accordion.Body>
//       </Accordion.Item>

//       {/* Add Center Controllers */}
//       <Accordion.Item eventKey="controllers">
//         <Accordion.Header>
//           <h5 className="mb-0">Add Center Controllers</h5>
//         </Accordion.Header>
//         <Accordion.Body>
//           <Form onSubmit={handleCenterControllerSubmit}>
//             <Row className="g-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     Select Department *
//                     {departments.length > 0 && (
//                       <span className="text-muted ms-2">({departments.length} available)</span>
//                     )}
//                   </Form.Label>
//                   <Form.Select
//                     name="departmentId"
//                     value={centerControllerData.departmentId}
//                     onChange={handleCenterControllerChange}
//                     required
//                     disabled={fetchingDepartments}
//                   >
//                     <option value="">
//                       {fetchingDepartments 
//                         ? 'Loading departments...' 
//                         : 'Choose a department'
//                       }
//                     </option>
//                     {departments.map(dept => (
//                       <option key={dept.departmentId} value={dept.departmentId}>
//                         {dept.departmentName} (ID: {dept.departmentId})
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     Select Batch Number *
//                     {getAvailableBatches().length > 0 && (
//                       <span className="text-muted ms-2">({getAvailableBatches().length} available)</span>
//                     )}
//                   </Form.Label>
//                   <Form.Select
//                     name="batchNo"
//                     value={centerControllerData.batchNo}
//                     onChange={handleCenterControllerChange}
//                     required
//                     disabled={!centerControllerData.departmentId || fetchingBatches}
//                   >
//                     <option value="">
//                       {!centerControllerData.departmentId 
//                         ? 'Select department first' 
//                         : fetchingBatches 
//                         ? 'Loading batches...'
//                         : 'Choose a batch'
//                       }
//                     </option>
//                     {getAvailableBatches().map(batch => (
//                       <option key={batch.batchNo} value={batch.batchNo}>
//                         Batch {batch.batchNo} - {new Date(batch.batchdate).toLocaleDateString()}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col xs={12}>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h6>Center Controllers</h6>
//                   <Button variant="outline-warning" size="sm" onClick={addController}>
//                     + Add Controller
//                   </Button>
//                 </div>

//                 {centerControllerData.controllers.map((controller, index) => (
//                   <Card key={index} className="mb-3">
//                     <Card.Header className="py-2 bg-warning-subtle">
//                       <div className="d-flex justify-content-between align-items-center">
//                         <span>Controller {index + 1}</span>
//                         {centerControllerData.controllers.length > 1 && (
//                           <Button 
//                             variant="outline-danger" 
//                             size="sm" 
//                             onClick={() => removeController(index)}
//                           >
//                             Remove
//                           </Button>
//                         )}
//                       </div>
//                     </Card.Header>
//                     <Card.Body>
//                       <Row className="g-2">
//                         {/* Updated: Controller Code is now optional */}
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label>Controller Code <span className="text-muted">(Optional)</span></Form.Label>
//                             <Form.Control
//                               type="number"
//                               value={controller.controller_code}
//                               onChange={(e) => handleControllerChange(index, 'controller_code', e.target.value)}
//                               placeholder="e.g., 1001 (if not stores as null)"
//                             />
//                             <Form.Text className="text-muted">
//                               Leave empty to auto-generate or set to null
//                             </Form.Text>
//                           </Form.Group>
//                         </Col>
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label>Controller Name *</Form.Label>
//                             <Form.Control
//                               type="text"
//                               value={controller.controller_name}
//                               onChange={(e) => handleControllerChange(index, 'controller_name', e.target.value)}
//                               placeholder="Full name"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         {/* Updated: District is now optional */}
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label>District <span className="text-muted">(Optional)</span></Form.Label>
//                             <Form.Control
//                               type="text"
//                               value={controller.district}
//                               onChange={(e) => handleControllerChange(index, 'district', e.target.value)}
//                               placeholder="e.g., Mumbai, Delhi"
//                             />
//                             <Form.Text className="text-muted">
//                               Leave empty to set as null
//                             </Form.Text>
//                           </Form.Group>
//                         </Col>
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label>Contact Number *</Form.Label>
//                             <Form.Control
//                               type="number"
//                               value={controller.controller_contact}
//                               onChange={(e) => handleControllerChange(index, 'controller_contact', e.target.value)}
//                               placeholder="10-digit mobile number"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label>Email Address *</Form.Label>
//                             <Form.Control
//                               type="email"
//                               value={controller.controller_email}
//                               onChange={(e) => handleControllerChange(index, 'controller_email', e.target.value)}
//                               placeholder="email@example.com"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label>Password *</Form.Label>
//                             <Form.Control
//                               type="password"
//                               value={controller.controller_pass}
//                               onChange={(e) => handleControllerChange(index, 'controller_pass', e.target.value)}
//                               placeholder="Set password"
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                         {/* Updated: Center is now compulsory */}
//                         <Col md={12}>
//                           <Form.Group>
//                             <Form.Label>Center *</Form.Label>
//                             <Form.Control
//                               type="number"
//                               value={controller.center}
//                               onChange={(e) => handleControllerChange(index, 'center', e.target.value)}
//                               placeholder="Center number (required)"
//                               required
//                             />
//                             <Form.Text className="text-muted">
//                               Center number is required
//                             </Form.Text>
//                           </Form.Group>
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 ))}
//               </Col>

//               <Col xs={12} className="mt-4">
//                 <div className="d-flex justify-content-between">
//                   <Button 
//                     variant="secondary" 
//                     onClick={() => navigate('/super-admin/department-setup')}
//                   >
//                     Back to Dashboard
//                   </Button>
                  
//                   <Button 
//                     variant="warning" 
//                     type="submit" 
//                     disabled={controllerLoading || !centerControllerData.departmentId || !centerControllerData.batchNo}
//                   >
//                     {controllerLoading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Adding Controllers...
//                       </>
//                     ) : (
//                       'Add Center Controllers'
//                     )}
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </Accordion.Body>
//       </Accordion.Item>
//     </Accordion>
//   );
// };

// export default DepartmentForms;


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

  // NEW: Simplified Batch Excel Upload State (No department selection needed)
  const [batchFileData, setBatchFileData] = useState({
    file: null,
    fileName: '',
    uploading: false,
    uploadResult: null
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

  // NEW: Simplified Controller Excel Upload State (No department/batch selection needed)
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
      clearPersistedData();
      
      // Refresh departments list
      await fetchDepartments();
      
      // Success message
      setMessage(`✅ Department "${newDepartmentName}" created successfully! Click "Departments" button to view all departments.`);
      
      // Auto-expand the batch accordion
      setActiveAccordion("existing");
      
      // Trigger success callback
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

  // NEW: Simplified Batch File Upload Handlers (No department selection)
  const handleBatchFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file');
        return;
      }

      // Validate file size (5MB limit)
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

      const response = await axios.post(
        'http://localhost:3000/api/new-department/batches/bulk-upload-complete',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setBatchFileData(prev => ({ 
        ...prev, 
        uploadResult: response.data,
        file: null,
        fileName: ''
      }));

      setMessage(`✅ Batch file uploaded successfully! ${response.data.summary.successful} batches added, ${response.data.summary.failed} failed.`);
      
      // Refresh tables
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
      
      const selectedDepartment = departments.find(dept => dept.departmentId == existingDeptData.departmentId);
      const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      
      // Track newly added batches for prioritized display
      const newBatches = existingDeptData.batches.map(batch => ({
        ...batch,
        departmentId: existingDeptData.departmentId,
        timestamp: new Date().toISOString()
      }));
      
      setNewlyAddedBatches(prev => [...prev, ...newBatches]);
      
      setMessage(`✅ Batches added successfully to "${departmentName}"! Click "Batches" button to view all batches (newest batches shown first).`);
      
      // Auto-expand the controllers accordion
      setActiveAccordion("controllers");
      
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

      // Trigger success callback
      onBatchSuccess(existingDeptData.departmentId);

    } catch (err) {
      console.error('Error adding batches:', err);
      setMessage(err.response?.data?.message || 'Error adding batches');
    } finally {
      setExistingDeptLoading(false);
    }
  };

  // Add Controllers Handlers
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

  // NEW: Simplified Controller File Upload Handlers (No department/batch selection)
  const handleControllerFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file');
        return;
      }

      // Validate file size (5MB limit)
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
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setControllerFileData(prev => ({ 
        ...prev, 
        uploadResult: response.data,
        file: null,
        fileName: ''
      }));

      setMessage(`✅ Controller file uploaded successfully! ${response.data.summary.successful} controllers added, ${response.data.summary.failed} failed.`);
      
      // Refresh tables
      onControllerSuccess();

    } catch (err) {
      console.error('Error uploading controller file:', err);
      setMessage(err.response?.data?.message || 'Error uploading controller file');
    } finally {
      setControllerFileData(prev => ({ ...prev, uploading: false }));
    }
  };

  // Updated: Handle null values for optional controller_code AND district
  const processControllersForSubmission = (controllers) => {
    return controllers.map(controller => ({
      ...controller,
      // Set controller_code to null if empty (optional field)
      controller_code: controller.controller_code.trim() === '' ? null : controller.controller_code,
      // Set district to null if empty (optional field)
      district: controller.district.trim() === '' ? null : controller.district
    }));
  };

  const handleCenterControllerSubmit = async (e) => {
    e.preventDefault();
    
    if (!centerControllerData.departmentId || !centerControllerData.batchNo) {
      setMessage('Please select a department and batch number');
      return;
    }

    // Updated validation: controller_code AND district are optional, center is required
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
      // Process controllers to handle null values for optional fields
      const processedControllers = processControllersForSubmission(centerControllerData.controllers);

      const response = await axios.post('http://localhost:3000/api/new-department/controllers', {
        departmentId: centerControllerData.departmentId,
        batchNo: centerControllerData.batchNo,
        controllers: processedControllers
      });
      
      const selectedDepartment = departments.find(dept => dept.departmentId == centerControllerData.departmentId);
      const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      
      // Track newly added controllers for prioritized display
      const newControllers = centerControllerData.controllers.map(controller => ({
        ...controller,
        departmentId: centerControllerData.departmentId,
        batchNo: centerControllerData.batchNo,
        timestamp: new Date().toISOString()
      }));
      
      setNewlyAddedControllers(prev => [...prev, ...newControllers]);
      
      setMessage(`✅ Center Controllers added successfully to "${departmentName}" - Batch ${centerControllerData.batchNo}! Click "Controllers" button to view all controllers (newest controllers shown first).`);
      
      // Reset form
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

      // Trigger success callback
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
          {/* NEW: Simplified Excel Upload Section for Batches */}
          <Card className="mb-4 border-success">
            <Card.Header className="bg-success-subtle">
              <h6 className="mb-0">📊 Bulk Upload Batches via Excel/CSV</h6>
              <small className="text-muted">Upload complete batch data with departmentId, batchNo, dates, and times</small>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleBatchFileUpload}>
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Upload Complete Batch Excel/CSV File *</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleBatchFileSelect}
                        required
                      />
                      <Form.Text className="text-muted">
                        Excel (.xlsx, .xls) or CSV (.csv) files only. Max size: 5MB<br/>
                        <strong>Required columns:</strong> departmentId, batchNo, batchdate, reporting_time, start_time, end_time
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
                          // Download sample template
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

          <hr className="my-4" />

          {/* Existing Manual Batch Addition Form */}
          <h6 className="mb-3">✏️ Manual Batch Entry</h6>
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
                      onClick={handleRefreshDepartments}
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

      {/* Add Center Controllers */}
      <Accordion.Item eventKey="controllers">
        <Accordion.Header>
          <h5 className="mb-0">Add Center Controllers</h5>
        </Accordion.Header>
        <Accordion.Body>
          {/* NEW: Simplified Excel Upload Section for Controllers */}
          <Card className="mb-4 border-warning">
            <Card.Header className="bg-warning-subtle">
              <h6 className="mb-0">📊 Bulk Upload Controllers via Excel/CSV</h6>
              <small className="text-muted">Upload complete controller data with departmentId, batchNo, and all controller details</small>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleControllerFileUpload}>
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Upload Complete Controller Excel/CSV File *</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleControllerFileSelect}
                        required
                      />
                      <Form.Text className="text-muted">
                        Excel (.xlsx, .xls) or CSV (.csv) files only. Max size: 5MB<br/>
                        <strong>Required columns:</strong> departmentId, batchNo, controller_name, controller_contact, controller_email, controller_pass, center<br/>
                        <strong>Optional columns:</strong> controller_code, district
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4} className="d-flex align-items-end">
                    <div className="d-flex gap-2 w-100">
                      <Button 
                        variant="warning" 
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
                          '📊 Upload Controllers'
                        )}
                      </Button>

                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => {
                          // Download sample template
                          const link = document.createElement('a');
                          link.href = '/templates/controller_complete_template.xlsx';
                          link.download = 'controller_complete_template.xlsx';
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

          <hr className="my-4" />

          {/* Existing Manual Controller Addition Form */}
          <h6 className="mb-3">✏️ Manual Controller Entry</h6>
          <Form onSubmit={handleCenterControllerSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Select Department *
                    {departments.length > 0 && (
                      <span className="text-muted ms-2">({departments.length} available)</span>
                    )}
                  </Form.Label>
                  <Form.Select
                    name="departmentId"
                    value={centerControllerData.departmentId}
                    onChange={handleCenterControllerChange}
                    required
                    disabled={fetchingDepartments}
                  >
                    <option value="">
                      {fetchingDepartments 
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
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Select Batch Number *
                    {getAvailableBatches().length > 0 && (
                      <span className="text-muted ms-2">({getAvailableBatches().length} available)</span>
                    )}
                  </Form.Label>
                  <Form.Select
                    name="batchNo"
                    value={centerControllerData.batchNo}
                    onChange={handleCenterControllerChange}
                    required
                    disabled={!centerControllerData.departmentId || fetchingBatches}
                  >
                    <option value="">
                      {!centerControllerData.departmentId 
                        ? 'Select department first' 
                        : fetchingBatches 
                        ? 'Loading batches...'
                        : 'Choose a batch'
                      }
                    </option>
                    {getAvailableBatches().map(batch => (
                      <option key={batch.batchNo} value={batch.batchNo}>
                        Batch {batch.batchNo} - {new Date(batch.batchdate).toLocaleDateString()}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>Center Controllers</h6>
                  <Button variant="outline-warning" size="sm" onClick={addController}>
                    + Add Controller
                  </Button>
                </div>

                {centerControllerData.controllers.map((controller, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Header className="py-2 bg-warning-subtle">
                      <div className="d-flex justify-content-between align-items-center">
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
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-2">
                        {/* Updated: Controller Code is now optional */}
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Controller Code <span className="text-muted">(Optional)</span></Form.Label>
                            <Form.Control
                              type="number"
                              value={controller.controller_code}
                              onChange={(e) => handleControllerChange(index, 'controller_code', e.target.value)}
                              placeholder="e.g., 1001 (if not stores as null)"
                            />
                            <Form.Text className="text-muted">
                              Leave empty to auto-generate or set to null
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Controller Name *</Form.Label>
                            <Form.Control
                              type="text"
                              value={controller.controller_name}
                              onChange={(e) => handleControllerChange(index, 'controller_name', e.target.value)}
                              placeholder="Full name"
                              required
                            />
                          </Form.Group>
                        </Col>
                        {/* Updated: District is now optional */}
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>District <span className="text-muted">(Optional)</span></Form.Label>
                            <Form.Control
                              type="text"
                              value={controller.district}
                              onChange={(e) => handleControllerChange(index, 'district', e.target.value)}
                              placeholder="e.g., Mumbai, Delhi"
                            />
                            <Form.Text className="text-muted">
                              Leave empty to set as null
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Contact Number *</Form.Label>
                            <Form.Control
                              type="number"
                              value={controller.controller_contact}
                              onChange={(e) => handleControllerChange(index, 'controller_contact', e.target.value)}
                              placeholder="10-digit mobile number"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Email Address *</Form.Label>
                            <Form.Control
                              type="email"
                              value={controller.controller_email}
                              onChange={(e) => handleControllerChange(index, 'controller_email', e.target.value)}
                              placeholder="email@example.com"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Password *</Form.Label>
                            <Form.Control
                              type="password"
                              value={controller.controller_pass}
                              onChange={(e) => handleControllerChange(index, 'controller_pass', e.target.value)}
                              placeholder="Set password"
                              required
                            />
                          </Form.Group>
                        </Col>
                        {/* Updated: Center is now compulsory */}
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>Center *</Form.Label>
                            <Form.Control
                              type="number"
                              value={controller.center}
                              onChange={(e) => handleControllerChange(index, 'center', e.target.value)}
                              placeholder="Center number (required)"
                              required
                            />
                            <Form.Text className="text-muted">
                              Center number is required
                            </Form.Text>
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
                    variant="warning" 
                    type="submit" 
                    disabled={controllerLoading || !centerControllerData.departmentId || !centerControllerData.batchNo}
                  >
                    {controllerLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Adding Controllers...
                      </>
                    ) : (
                      'Add Center Controllers'
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default DepartmentForms;