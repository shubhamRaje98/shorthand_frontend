// // // src/components/super-admin/department-setup/RegisterStudents.js
// // import React, { useState, useEffect } from 'react';
// // import {
// //   Container, Row, Col, Card, Form, Button, Alert, Spinner,
// //   Table
// // } from 'react-bootstrap';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';

// // const RegisterStudents = () => {
// //   const [formData, setFormData] = useState({
// //     student_id: '',
// //     password: '',
// //     fullname: '',
// //     departmentId: '',
// //     center: '',
// //     batchNo: '',
// //     subjectsId: '',
// //     qset: '1',
// //     reporting_time: '',
// //     start_time: '',
// //     end_time: '',
// //     photo: '',
// //     base64: '',
// //     sign_base64: '',
// //     IsShorthand: false,
// //     IsTypewriting: false,
// //     disability: false
// //   });
// //   const [departments, setDepartments] = useState([]);
// //   const [examCenters, setExamCenters] = useState([]);
// //   const [batches, setBatches] = useState([]);
// //   const [students, setStudents] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const [fetchingData, setFetchingData] = useState(true);
// //   const [photoFile, setPhotoFile] = useState(null);
// //   const [signatureFile, setSignatureFile] = useState(null);

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetchInitialData();
// //   }, []);

// //   const fetchInitialData = async () => {
// //     try {
// //       const [deptRes, centerRes, studentsRes] = await Promise.all([
// //         axios.get('http://localhost:3000/api/new-department/departments'),
// //         axios.get('http://localhost:3000/api/new-department/exam-centers'),
// //         axios.get('http://localhost:3000/api/new-department/students')
// //       ]);

// //       setDepartments(deptRes.data.data || []);
// //       setExamCenters(centerRes.data.data || []);
// //       setStudents(studentsRes.data.data || []);
// //     } catch (err) {
// //       console.error('Error fetching initial data:', err);
// //       setMessage('Error loading data');
// //     } finally {
// //       setFetchingData(false);
// //     }
// //   };

// //   const fetchBatchesByDepartment = async (departmentId) => {
// //     if (!departmentId) {
// //       setBatches([]);
// //       return;
// //     }

// //     try {
// //       const response = await axios.get(`http://localhost:3000/api/new-department/batches/${departmentId}`);
// //       setBatches(response.data.data || []);
// //     } catch (err) {
// //       console.error('Error fetching batches:', err);
// //       setBatches([]);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
    
// //     if (name === 'departmentId') {
// //       // Reset batch when department changes
// //       setFormData(prev => ({
// //         ...prev,
// //         departmentId: value,
// //         batchNo: ''
// //       }));
// //       fetchBatchesByDepartment(value);
// //     } else {
// //       setFormData(prev => ({
// //         ...prev,
// //         [name]: type === 'checkbox' ? checked : value
// //       }));
// //     }
// //   };

// //   const handleFileChange = (e, fieldName) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > 10 * 1024 * 1024) {
// //         setMessage('File size must be less than 10MB');
// //         return;
// //       }
      
// //       if (fieldName === 'photo') setPhotoFile(file);
// //       if (fieldName === 'signature') setSignatureFile(file);
      
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setFormData(prev => ({
// //           ...prev,
// //           [fieldName === 'photo' ? 'photo' : 'sign_base64']: reader.result
// //         }));
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!formData.student_id || !formData.password || !formData.fullname || 
// //         !formData.departmentId || !formData.center || !formData.batchNo || !formData.subjectsId) {
// //       setMessage('Please fill all required fields');
// //       return;
// //     }

// //     setLoading(true);
// //     setMessage('');

// //     try {
// //       const response = await axios.post('http://localhost:3000/api/new-department/students', formData);
      
// //       setMessage('Student registered successfully!');
      
// //       // Refresh students list
// //       const studentsRes = await axios.get('http://localhost:3000/api/new-department/students');
// //       setStudents(studentsRes.data.data || []);
      
// //       // Reset form
// //       setFormData(prev => ({
// //         ...prev,
// //         student_id: '',
// //         password: '',
// //         fullname: '',
// //         subjectsId: '',
// //         photo: '',
// //         base64: '',
// //         sign_base64: ''
// //       }));
// //       setPhotoFile(null);
// //       setSignatureFile(null);

// //     } catch (err) {
// //       console.error('Error registering student:', err);
// //       setMessage(err.response?.data?.message || 'Error registering student');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Container className="my-4">
// //       <Row>
// //         <Col lg={6}>
// //           <Card className="shadow mb-4">
// //             <Card.Header className="bg-dark text-white">
// //               <h4 className="mb-0">Step 5: Register Students</h4>
// //               <small>Register students with all dependencies</small>
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
// //                       <Form.Label>Student ID *</Form.Label>
// //                       <Form.Control
// //                         type="number"
// //                         name="student_id"
// //                         value={formData.student_id}
// //                         onChange={handleChange}
// //                         placeholder="Unique student ID"
// //                         required
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Password *</Form.Label>
// //                       <Form.Control
// //                         type="password"
// //                         name="password"
// //                         value={formData.password}
// //                         onChange={handleChange}
// //                         placeholder="Student password"
// //                         required
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col xs={12}>
// //                     <Form.Group>
// //                       <Form.Label>Full Name *</Form.Label>
// //                       <Form.Control
// //                         type="text"
// //                         name="fullname"
// //                         value={formData.fullname}
// //                         onChange={handleChange}
// //                         placeholder="Student full name"
// //                         required
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Department *</Form.Label>
// //                       <Form.Select
// //                         name="departmentId"
// //                         value={formData.departmentId}
// //                         onChange={handleChange}
// //                         required
// //                         disabled={fetchingData}
// //                       >
// //                         <option value="">Select Department</option>
// //                         {departments.map(dept => (
// //                           <option key={dept.departmentId} value={dept.departmentId}>
// //                             {dept.departmentName}
// //                           </option>
// //                         ))}
// //                       </Form.Select>
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Batch Number *</Form.Label>
// //                       <Form.Select
// //                         name="batchNo"
// //                         value={formData.batchNo}
// //                         onChange={handleChange}
// //                         required
// //                         disabled={!formData.departmentId || batches.length === 0}
// //                       >
// //                         <option value="">Select Batch</option>
// //                         {batches.map(batch => (
// //                           <option key={`${batch.departmentId}-${batch.batchNo}`} value={batch.batchNo}>
// //                             Batch {batch.batchNo}
// //                           </option>
// //                         ))}
// //                       </Form.Select>
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Exam Center *</Form.Label>
// //                       <Form.Select
// //                         name="center"
// //                         value={formData.center}
// //                         onChange={handleChange}
// //                         required
// //                         disabled={fetchingData}
// //                       >
// //                         <option value="">Select Center</option>
// //                         {examCenters.map(center => (
// //                           <option key={center.center} value={center.center}>
// //                             {center.center_name}
// //                           </option>
// //                         ))}
// //                       </Form.Select>
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Subject ID *</Form.Label>
// //                       <Form.Control
// //                         type="number"
// //                         name="subjectsId"
// //                         value={formData.subjectsId}
// //                         onChange={handleChange}
// //                         placeholder="Subject ID"
// //                         required
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Question Set</Form.Label>
// //                       <Form.Select
// //                         name="qset"
// //                         value={formData.qset}
// //                         onChange={handleChange}
// //                       >
// //                         {[1, 2, 3, 4].map(num => (
// //                           <option key={num} value={num}>Set {num}</option>
// //                         ))}
// //                       </Form.Select>
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Disability</Form.Label>
// //                       <Form.Check
// //                         type="switch"
// //                         name="disability"
// //                         checked={formData.disability}
// //                         onChange={handleChange}
// //                         label="Student has disability"
// //                       />
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Student Photo</Form.Label>
// //                       <Form.Control
// //                         type="file"
// //                         accept="image/*"
// //                         onChange={(e) => handleFileChange(e, 'photo')}
// //                       />
// //                       {formData.photo && (
// //                         <div className="mt-2">
// //                           <img 
// //                             src={formData.photo} 
// //                             alt="Photo preview" 
// //                             style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
// //                           />
// //                         </div>
// //                       )}
// //                     </Form.Group>
// //                   </Col>

// //                   <Col md={6}>
// //                     <Form.Group>
// //                       <Form.Label>Student Signature</Form.Label>
// //                       <Form.Control
// //                         type="file"
// //                         accept="image/*"
// //                         onChange={(e) => handleFileChange(e, 'signature')}
// //                       />
// //                       {formData.sign_base64 && (
// //                         <div className="mt-2">
// //                           <img 
// //                             src={formData.sign_base64} 
// //                             alt="Signature preview" 
// //                             style={{ maxWidth: '150px', maxHeight: '50px', objectFit: 'contain' }}
// //                           />
// //                         </div>
// //                       )}
// //                     </Form.Group>
// //                   </Col>

// //                   <Col xs={12} className="mt-4">
// //                     <div className="d-flex justify-content-between">
// //                       <Button 
// //                         variant="secondary" 
// //                         onClick={() => navigate('/super-admin/department-setup')}
// //                       >
// //                         Back to Dashboard
// //                       </Button>
                      
// //                       <div>
// //                         <Button 
// //                           variant="outline-primary" 
// //                           onClick={() => navigate('/super-admin/assign-controller')}
// //                           className="me-2"
// //                         >
// //                           Previous Step
// //                         </Button>
                        
// //                         <Button 
// //                           variant="primary" 
// //                           type="submit" 
// //                           disabled={loading || fetchingData}
// //                         >
// //                           {loading ? (
// //                             <>
// //                               <Spinner as="span" animation="border" size="sm" className="me-2" />
// //                               Registering...
// //                             </>
// //                           ) : (
// //                             'Register Student'
// //                           )}
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </Col>
// //                 </Row>
// //               </Form>
// //             </Card.Body>
// //           </Card>
// //         </Col>

// //         <Col lg={6}>
// //           <Card className="shadow">
// //             <Card.Header className="bg-info text-white">
// //               <h5 className="mb-0">Registered Students</h5>
// //               <small>Total: {students.length} students</small>
// //             </Card.Header>
// //             <Card.Body>
// //               <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
// //                 <Table striped bordered hover size="sm">
// //                   <thead>
// //                     <tr>
// //                       <th>ID</th>
// //                       <th>Name</th>
// //                       <th>Department</th>
// //                       <th>Batch</th>
// //                       <th>Center</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {students.map(student => (
// //                       <tr key={student.student_id}>
// //                         <td>{student.student_id}</td>
// //                         <td>{student.fullname}</td>
// //                         <td>{student.departmentName}</td>
// //                         <td>{student.batchNo}</td>
// //                         <td>{student.center_name}</td>
// //                       </tr>
// //                     ))}
// //                     {students.length === 0 && (
// //                       <tr>
// //                         <td colSpan="5" className="text-center text-muted">
// //                           No students registered yet
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </tbody>
// //                 </Table>
// //               </div>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default RegisterStudents;


// // src/components/super-admin/department-setup/RegisterStudents.js
// import React, { useState, useEffect } from 'react';
// import {
//   Container, Row, Col, Card, Form, Button, Alert, Spinner,
//   Table
// } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const RegisterStudents = () => {
//   const [formData, setFormData] = useState({
//     student_id: '',
//     password: '',
//     fullname: '',
//     departmentId: '',
//     center: '',
//     batchNo: '',
//     subjectsId: '',
//     qset: '1',
//     reporting_time: '',
//     start_time: '',
//     end_time: '',
//     photo: '',
//     base64: '',
//     sign_base64: '',
//     IsShorthand: false,
//     IsTypewriting: false,
//     disability: false
//   });
//   const [departments, setDepartments] = useState([]);
//   const [examCenters, setExamCenters] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [fetchingData, setFetchingData] = useState(true);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [signatureFile, setSignatureFile] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchInitialData();
//     loadPersistedData();
//   }, []);

//   // Persist form data whenever it changes
//   useEffect(() => {
//     persistFormData();
//   }, [formData]);

//   const loadPersistedData = () => {
//     try {
//       const persisted = localStorage.getItem('departmentSetupData');
//       if (persisted) {
//         const data = JSON.parse(persisted);
//         if (data.studentData) {
//           setFormData(data.studentData);
//           // If departmentId exists in persisted data, fetch its batches
//           if (data.studentData.departmentId) {
//             fetchBatchesByDepartment(data.studentData.departmentId);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error loading persisted data:', error);
//     }
//   };

//   const persistFormData = () => {
//     try {
//       const existingData = JSON.parse(localStorage.getItem('departmentSetupData') || '{}');
//       const dataToPersist = {
//         ...existingData,
//         studentData: formData,
//         timestamp: new Date().toISOString()
//       };
//       localStorage.setItem('departmentSetupData', JSON.stringify(dataToPersist));
//     } catch (error) {
//       console.error('Error persisting data:', error);
//     }
//   };

//   const clearStepData = () => {
//     try {
//       const existingData = JSON.parse(localStorage.getItem('departmentSetupData') || '{}');
//       const { studentData, ...rest } = existingData;
//       localStorage.setItem('departmentSetupData', JSON.stringify(rest));
//     } catch (error) {
//       console.error('Error clearing step data:', error);
//     }
//   };

//   const clearAllPersistedData = () => {
//     localStorage.removeItem('departmentSetupData');
//   };

//   const fetchInitialData = async () => {
//     try {
//       const [deptRes, centerRes, studentsRes] = await Promise.all([
//         axios.get('http://localhost:3000/api/new-department/departments'),
//         axios.get('http://localhost:3000/api/new-department/exam-centers'),
//         axios.get('http://localhost:3000/api/new-department/students')
//       ]);

//       setDepartments(deptRes.data.data || []);
//       setExamCenters(centerRes.data.data || []);
//       setStudents(studentsRes.data.data || []);
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setMessage('Error loading data');
//     } finally {
//       setFetchingData(false);
//     }
//   };

//   const fetchBatchesByDepartment = async (departmentId) => {
//     if (!departmentId) {
//       setBatches([]);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:3000/api/new-department/batches/${departmentId}`);
//       setBatches(response.data.data || []);
//     } catch (err) {
//       console.error('Error fetching batches:', err);
//       setBatches([]);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (name === 'departmentId') {
//       // Reset batch when department changes
//       setFormData(prev => ({
//         ...prev,
//         departmentId: value,
//         batchNo: ''
//       }));
//       fetchBatchesByDepartment(value);
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));
//     }
//   };

//   const handleFileChange = (e, fieldName) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setMessage('File size must be less than 10MB');
//         return;
//       }
      
//       if (fieldName === 'photo') setPhotoFile(file);
//       if (fieldName === 'signature') setSignatureFile(file);
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           [fieldName === 'photo' ? 'photo' : 'sign_base64']: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.student_id || !formData.password || !formData.fullname || 
//         !formData.departmentId || !formData.center || !formData.batchNo || !formData.subjectsId) {
//       setMessage('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await axios.post('http://localhost:3000/api/new-department/students', formData);
      
//       setMessage('Student registered successfully!');
      
//       // Refresh students list
//       const studentsRes = await axios.get('http://localhost:3000/api/new-department/students');
//       setStudents(studentsRes.data.data || []);
      
//       // Reset form but don't clear persisted data (allow multiple student registrations)
//       setFormData(prev => ({
//         ...prev,
//         student_id: '',
//         password: '',
//         fullname: '',
//         subjectsId: '',
//         photo: '',
//         base64: '',
//         sign_base64: ''
//       }));
//       setPhotoFile(null);
//       setSignatureFile(null);

//     } catch (err) {
//       console.error('Error registering student:', err);
//       setMessage(err.response?.data?.message || 'Error registering student');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCompleteSetup = () => {
//     clearAllPersistedData(); // Clear all persisted data when setup is complete
//     navigate('/super-admin/department-setup');
//   };

//   return (
//     <Container className="my-4">
//       <Row>
//         <Col lg={6}>
//           <Card className="shadow mb-4">
//             <Card.Header className="bg-dark text-white">
//               <h4 className="mb-0">Step 5: Register Students</h4>
//               <small>Register students with all dependencies</small>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {message && (
//                 <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
//                   {message}
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Row className="g-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Student ID *</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="student_id"
//                         value={formData.student_id}
//                         onChange={handleChange}
//                         placeholder="Unique student ID"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Password *</Form.Label>
//                       <Form.Control
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="Student password"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col xs={12}>
//                     <Form.Group>
//                       <Form.Label>Full Name *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="fullname"
//                         value={formData.fullname}
//                         onChange={handleChange}
//                         placeholder="Student full name"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Department *</Form.Label>
//                       <Form.Select
//                         name="departmentId"
//                         value={formData.departmentId}
//                         onChange={handleChange}
//                         required
//                         disabled={fetchingData}
//                       >
//                         <option value="">Select Department</option>
//                         {departments.map(dept => (
//                           <option key={dept.departmentId} value={dept.departmentId}>
//                             {dept.departmentName}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Batch Number *</Form.Label>
//                       <Form.Select
//                         name="batchNo"
//                         value={formData.batchNo}
//                         onChange={handleChange}
//                         required
//                         disabled={!formData.departmentId || batches.length === 0}
//                       >
//                         <option value="">Select Batch</option>
//                         {batches.map(batch => (
//                           <option key={`${batch.departmentId}-${batch.batchNo}`} value={batch.batchNo}>
//                             Batch {batch.batchNo}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Exam Center *</Form.Label>
//                       <Form.Select
//                         name="center"
//                         value={formData.center}
//                         onChange={handleChange}
//                         required
//                         disabled={fetchingData}
//                       >
//                         <option value="">Select Center</option>
//                         {examCenters.map(center => (
//                           <option key={center.center} value={center.center}>
//                             {center.center_name}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Subject ID *</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="subjectsId"
//                         value={formData.subjectsId}
//                         onChange={handleChange}
//                         placeholder="Subject ID"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Question Set</Form.Label>
//                       <Form.Select
//                         name="qset"
//                         value={formData.qset}
//                         onChange={handleChange}
//                       >
//                         {[1, 2, 3, 4].map(num => (
//                           <option key={num} value={num}>Set {num}</option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Disability</Form.Label>
//                       <Form.Check
//                         type="switch"
//                         name="disability"
//                         checked={formData.disability}
//                         onChange={handleChange}
//                         label="Student has disability"
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Student Photo</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(e, 'photo')}
//                       />
//                       {formData.photo && (
//                         <div className="mt-2">
//                           <img 
//                             src={formData.photo} 
//                             alt="Photo preview" 
//                             style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
//                           />
//                         </div>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Student Signature</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(e, 'signature')}
//                       />
//                       {formData.sign_base64 && (
//                         <div className="mt-2">
//                           <img 
//                             src={formData.sign_base64} 
//                             alt="Signature preview" 
//                             style={{ maxWidth: '150px', maxHeight: '50px', objectFit: 'contain' }}
//                           />
//                         </div>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   <Col xs={12} className="mt-4">
//                     <div className="d-flex justify-content-between">
//                       <Button 
//                         variant="secondary" 
//                         onClick={() => navigate('/super-admin/department-setup')}
//                       >
//                         Back to Dashboard
//                       </Button>
                      
//                       <div>
//                         <Button 
//                           variant="outline-primary" 
//                           onClick={() => navigate('/super-admin/assign-controller')}
//                           className="me-2"
//                         >
//                           Previous Step
//                         </Button>
                        
//                         <Button 
//                           variant="success" 
//                           onClick={handleCompleteSetup}
//                           className="me-2"
//                         >
//                           Complete Setup
//                         </Button>
                        
//                         <Button 
//                           variant="primary" 
//                           type="submit" 
//                           disabled={loading || fetchingData}
//                         >
//                           {loading ? (
//                             <>
//                               <Spinner as="span" animation="border" size="sm" className="me-2" />
//                               Registering...
//                             </>
//                           ) : (
//                             'Register Student'
//                           )}
//                         </Button>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={6}>
//           <Card className="shadow">
//             <Card.Header className="bg-info text-white">
//               <h5 className="mb-0">Registered Students</h5>
//               <small>Total: {students.length} students</small>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//                 <Table striped bordered hover size="sm">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Department</th>
//                       <th>Batch</th>
//                       <th>Center</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {students.map(student => (
//                       <tr key={student.student_id}>
//                         <td>{student.student_id}</td>
//                         <td>{student.fullname}</td>
//                         <td>{student.departmentName}</td>
//                         <td>{student.batchNo}</td>
//                         <td>{student.center_name}</td>
//                       </tr>
//                     ))}
//                     {students.length === 0 && (
//                       <tr>
//                         <td colSpan="5" className="text-center text-muted">
//                           No students registered yet
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default RegisterStudents;


// src/components/super-admin/department-setup/RegisterStudents.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner,
  Table
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDepartmentSetupPersistence } from '../../../hooks/useDepartmentSetupPersistence';

const RegisterStudents = () => {
  const {
    formData,
    setFormData,
    updateCurrentStep,
    clearStepData,
    clearAllData
  } = useDepartmentSetupPersistence('studentData', {
    student_id: '',
    password: '',
    fullname: '',
    departmentId: '',
    center: '',
    batchNo: '',
    subjectsId: '',
    qset: '1',
    reporting_time: '',
    start_time: '',
    end_time: '',
    photo: '',
    base64: '',
    sign_base64: '',
    IsShorthand: false,
    IsTypewriting: false,
    disability: false
  });

  const [departments, setDepartments] = useState([]);
  const [examCenters, setExamCenters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetchingData, setFetchingData] = useState(true);
  const [photoFile, setPhotoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    updateCurrentStep(5);
    fetchInitialData();
    
    // If departmentId exists in persisted data, fetch its batches
    if (formData.departmentId) {
      fetchBatchesByDepartment(formData.departmentId);
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [deptRes, centerRes, studentsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/new-department/departments'),
        axios.get('http://localhost:3000/api/new-department/exam-centers'),
        axios.get('http://localhost:3000/api/new-department/students')
      ]);

      setDepartments(deptRes.data.data || []);
      setExamCenters(centerRes.data.data || []);
      setStudents(studentsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setMessage('Error loading data');
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
    const { name, value, type, checked } = e.target;
    
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
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage('File size must be less than 10MB');
        return;
      }
      
      if (fieldName === 'photo') setPhotoFile(file);
      if (fieldName === 'signature') setSignatureFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [fieldName === 'photo' ? 'photo' : 'sign_base64']: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.password || !formData.fullname || 
        !formData.departmentId || !formData.center || !formData.batchNo || !formData.subjectsId) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/new-department/students', formData);
      
      setMessage('Student registered successfully!');
      
      const studentsRes = await axios.get('http://localhost:3000/api/new-department/students');
      setStudents(studentsRes.data.data || []);
      
      // Reset form but keep department, center, batch selection
      setFormData(prev => ({
        ...prev,
        student_id: '',
        password: '',
        fullname: '',
        subjectsId: '',
        photo: '',
        base64: '',
        sign_base64: ''
      }));
      setPhotoFile(null);
      setSignatureFile(null);

    } catch (err) {
      console.error('Error registering student:', err);
      setMessage(err.response?.data?.message || 'Error registering student');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSetup = () => {
    clearAllData();
    navigate('/super-admin/department-setup');
  };

  return (
    <Container className="my-4">
      <Row>
        <Col lg={6}>
          <Card className="shadow mb-4">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">Step 5: Register Students</h4>
              <small>Register students with all dependencies</small>
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
                      <Form.Label>Student ID *</Form.Label>
                      <Form.Control
                        type="number"
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        placeholder="Unique student ID"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Student password"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Student full name"
                        required
                      />
                    </Form.Group>
                  </Col>

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
                            Batch {batch.batchNo}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Exam Center *</Form.Label>
                      <Form.Select
                        name="center"
                        value={formData.center}
                        onChange={handleChange}
                        required
                        disabled={fetchingData}
                      >
                        <option value="">Select Center</option>
                        {examCenters.map(center => (
                          <option key={center.center} value={center.center}>
                            {center.center_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Subject ID *</Form.Label>
                      <Form.Control
                        type="number"
                        name="subjectsId"
                        value={formData.subjectsId}
                        onChange={handleChange}
                        placeholder="Subject ID"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Question Set</Form.Label>
                      <Form.Select
                        name="qset"
                        value={formData.qset}
                        onChange={handleChange}
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>Set {num}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Disability</Form.Label>
                      <Form.Check
                        type="switch"
                        name="disability"
                        checked={formData.disability}
                        onChange={handleChange}
                        label="Student has disability"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Student Photo</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'photo')}
                      />
                      {formData.photo && (
                        <div className="mt-2">
                          <img 
                            src={formData.photo} 
                            alt="Photo preview" 
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Student Signature</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'signature')}
                      />
                      {formData.sign_base64 && (
                        <div className="mt-2">
                          <img 
                            src={formData.sign_base64} 
                            alt="Signature preview" 
                            style={{ maxWidth: '150px', maxHeight: '50px', objectFit: 'contain' }}
                          />
                        </div>
                      )}
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
                          onClick={() => navigate('/super-admin/assign-controller')}
                          className="me-2"
                        >
                          Previous Step
                        </Button>
                        
                        <Button 
                          variant="success" 
                          onClick={handleCompleteSetup}
                          className="me-2"
                        >
                          Complete Setup
                        </Button>
                        
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={loading || fetchingData}
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Registering...
                            </>
                          ) : (
                            'Register Student'
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

        <Col lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Registered Students</h5>
              <small>Total: {students.length} students</small>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Batch</th>
                      <th>Center</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.student_id}>
                        <td>{student.student_id}</td>
                        <td>{student.fullname}</td>
                        <td>{student.departmentName}</td>
                        <td>{student.batchNo}</td>
                        <td>{student.center_name}</td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No students registered yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterStudents;