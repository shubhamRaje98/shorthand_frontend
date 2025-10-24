// // // src/components/super-admin/HallticketsDepartmentSelection.js
// // import React, { useState, useEffect } from 'react';
// // import { Card, Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
// // import { FaUniversity, FaCogs, FaArrowRight, FaDatabase } from 'react-icons/fa';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';

// // function HallticketsDepartmentSelection() {
// //   const navigate = useNavigate();
// //   const [departments, setDepartments] = useState([]);
// //   const [selectedDepartment, setSelectedDepartment] = useState('');
// //   const [selectedExamType, setSelectedExamType] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   // Fetch departments from backend
// //   useEffect(() => {
// //     const fetchDepartments = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await axios.get('http://localhost:3000/api/hallticket-departments/departments');
        
// //         if (response.data.success) {
// //           setDepartments(response.data.data);
// //         } else {
// //           setError('Failed to fetch departments');
// //         }
// //       } catch (err) {
// //         console.error('Error fetching departments:', err);
// //         setError('Error loading departments. Please try again.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDepartments();
// //   }, []);

// //   const handleDepartmentSelect = () => {
// //     if (!selectedDepartment || !selectedExamType) {
// //       alert('Please select both department and exam type');
// //       return;
// //     }

// //     // Navigate based on exam type with department ID
// //     if (selectedExamType === 'gcc-tbc') {
// //       navigate(`/super-admin/halltickets-generation/gcc-tbc?departmentId=${selectedDepartment}`);
// //     } else if (selectedExamType === 'skill-test') {
// //       navigate(`/super-admin/halltickets-generation/skill-test?departmentId=${selectedDepartment}`);
// //     }
// //   };

// //   const getSelectedDepartmentName = () => {
// //     const dept = departments.find(dept => dept.departmentId.toString() === selectedDepartment);
// //     return dept ? dept.departmentName : '';
// //   };

// //   if (loading) {
// //     return (
// //       <Container fluid className="mt-4">
// //         <div className="text-center">
// //           <Spinner animation="border" role="status" className="me-2" />
// //           <span>Loading departments...</span>
// //         </div>
// //       </Container>
// //     );
// //   }

// //   return (
// //     <Container fluid className="mt-4">
// //       <h2 className="mb-4 text-center">Hall Tickets Generation</h2>
      
// //       <Row className="justify-content-center">
// //         <Col md={8}>
// //           <Card className="text-center">
// //             <Card.Header>
// //               <h4 className="mb-0">
// //                 <FaDatabase className="me-2" />
// //                 Select Department & Exam Type
// //               </h4>
// //             </Card.Header>
// //             <Card.Body className="p-4">
// //               <p className="text-muted mb-4">
// //                 First select a department, then choose the exam type for hall ticket generation
// //               </p>

// //               {error && (
// //                 <Alert variant="danger" className="mb-4">
// //                   {error}
// //                 </Alert>
// //               )}

// //               {/* Department Selection */}
// //               <Row className="g-4 mb-4">
// //                 <Col md={12}>
// //                   <Card className="shadow-sm">
// //                     <Card.Header className="bg-light">
// //                       <h5 className="mb-0">Step 1: Select Department</h5>
// //                     </Card.Header>
// //                     <Card.Body>
// //                       <Form.Group>
// //                         <Form.Label>Choose Department</Form.Label>
// //                         <Form.Select
// //                           value={selectedDepartment}
// //                           onChange={(e) => {
// //                             setSelectedDepartment(e.target.value);
// //                             setSelectedExamType(''); // Reset exam type when department changes
// //                           }}
// //                           size="lg"
// //                         >
// //                           <option value="">Select a department</option>
// //                           {departments.map((dept) => (
// //                             <option key={dept.departmentId} value={dept.departmentId}>
// //                               {dept.departmentName}
// //                             </option>
// //                           ))}
// //                         </Form.Select>
// //                         <Form.Text className="text-muted">
// //                           {departments.length} active departments available
// //                         </Form.Text>
// //                       </Form.Group>
// //                     </Card.Body>
// //                   </Card>
// //                 </Col>
// //               </Row>

// //               {/* Exam Type Selection - Only show if department is selected */}
// //               {selectedDepartment && (
// //                 <Row className="g-4 mb-4">
// //                   <Col md={12}>
// //                     <Card className="shadow-sm">
// //                       <Card.Header className="bg-light">
// //                         <h5 className="mb-0">Step 2: Select Exam Type</h5>
// //                       </Card.Header>
// //                       <Card.Body>
// //                         <p className="text-muted mb-3">
// //                           Selected Department: <strong>{getSelectedDepartmentName()}</strong>
// //                         </p>
                        
// //                         <Row className="g-3">
// //                           {/* GCC TBC Exam Type */}
// //                           <Col md={6}>
// //                             <Card 
// //                               className={`h-100 exam-type-card ${selectedExamType === 'gcc-tbc' ? 'border-primary' : ''}`}
// //                               style={{ cursor: 'pointer' }}
// //                               onClick={() => setSelectedExamType('gcc-tbc')}
// //                             >
// //                               <Card.Body className="d-flex flex-column">
// //                                 <div className="mb-3">
// //                                   <FaUniversity size={40} className={selectedExamType === 'gcc-tbc' ? 'text-primary' : 'text-muted'} />
// //                                 </div>
// //                                 <Card.Title>GCC TBC</Card.Title>
// //                                 <Card.Text className="flex-grow-1 text-muted">
// //                                   Generate hall tickets for GCC TBC exam type
// //                                 </Card.Text>
// //                                 <Button 
// //                                   variant={selectedExamType === 'gcc-tbc' ? 'primary' : 'outline-primary'}
// //                                   className="mt-auto"
// //                                 >
// //                                   {selectedExamType === 'gcc-tbc' ? 'Selected' : 'Select GCC TBC'}
// //                                 </Button>
// //                               </Card.Body>
// //                             </Card>
// //                           </Col>

// //                           {/* Skill Test Exam Type */}
// //                           <Col md={6}>
// //                             <Card 
// //                               className={`h-100 exam-type-card ${selectedExamType === 'skill-test' ? 'border-success' : ''}`}
// //                               style={{ cursor: 'pointer' }}
// //                               onClick={() => setSelectedExamType('skill-test')}
// //                             >
// //                               <Card.Body className="d-flex flex-column">
// //                                 <div className="mb-3">
// //                                   <FaCogs size={40} className={selectedExamType === 'skill-test' ? 'text-success' : 'text-muted'} />
// //                                 </div>
// //                                 <Card.Title>Skill Test</Card.Title>
// //                                 <Card.Text className="flex-grow-1 text-muted">
// //                                   Generate hall tickets for Skill Test exam type
// //                                 </Card.Text>
// //                                 <Button 
// //                                   variant={selectedExamType === 'skill-test' ? 'success' : 'outline-success'}
// //                                   className="mt-auto"
// //                                 >
// //                                   {selectedExamType === 'skill-test' ? 'Selected' : 'Select Skill Test'}
// //                                 </Button>
// //                               </Card.Body>
// //                             </Card>
// //                           </Col>
// //                         </Row>
// //                       </Card.Body>
// //                     </Card>
// //                   </Col>
// //                 </Row>
// //               )}

// //               {/* Proceed Button - Only show if both are selected */}
// //               {selectedDepartment && selectedExamType && (
// //                 <Row>
// //                   <Col md={12}>
// //                     <div className="text-center">
// //                       <Button 
// //                         variant="primary" 
// //                         size="lg"
// //                         onClick={handleDepartmentSelect}
// //                         className="px-5"
// //                       >
// //                         Generate Hall Tickets 
// //                         <FaArrowRight className="ms-2" />
// //                       </Button>
// //                       <p className="text-muted mt-2">
// //                         Ready to generate hall tickets for <strong>{getSelectedDepartmentName()}</strong> - <strong>{selectedExamType === 'gcc-tbc' ? 'GCC TBC' : 'Skill Test'}</strong>
// //                       </p>
// //                     </div>
// //                   </Col>
// //                 </Row>
// //               )}
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // }

// // export default HallticketsDepartmentSelection;


// // src/components/super-admin/HallticketsDepartmentSelection.js
// import React, { useState, useEffect } from 'react';
// import { Card, Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { FaUniversity, FaCogs, FaArrowRight, FaDatabase, FaCheckCircle } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function HallticketsDepartmentSelection() {
//   const navigate = useNavigate();
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [detectedExamType, setDetectedExamType] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [redirecting, setRedirecting] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch departments from backend
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:3000/api/hallticket-departments/departments');
        
//         if (response.data.success) {
//           setDepartments(response.data.data);
//         } else {
//           setError('Failed to fetch departments');
//         }
//       } catch (err) {
//         console.error('Error fetching departments:', err);
//         setError('Error loading departments. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDepartments();
//   }, []);

//   const handleDepartmentSelect = async (departmentId) => {
//     if (!departmentId) {
//       setSelectedDepartment('');
//       setDetectedExamType('');
//       return;
//     }

//     setSelectedDepartment(departmentId);
//     setRedirecting(true);

//     try {
//       // Find the selected department from local state to get exam type
//       const selectedDept = departments.find(dept => dept.departmentId.toString() === departmentId);
      
//       if (selectedDept && selectedDept.examType) {
//         setDetectedExamType(selectedDept.examType);
        
//         // Auto-redirect after showing detection message
//         setTimeout(() => {
//           redirectToHallTicketForm(selectedDept.examType, departmentId);
//         }, 1500);
//       } else {
//         setError('Exam type not found for selected department');
//         setRedirecting(false);
//       }
//     } catch (err) {
//       console.error('Error processing department selection:', err);
//       setError('Error processing selection. Please try again.');
//       setRedirecting(false);
//     }
//   };

//   const redirectToHallTicketForm = (examType, departmentId) => {
//     const examTypeParam = examType.toLowerCase() === 'gcc' ? 'gcc-tbc' : 'skill-test';
    
//     if (examTypeParam === 'gcc-tbc') {
//       navigate(`/super-admin/halltickets-generation/gcc-tbc?departmentId=${departmentId}`);
//     } else if (examTypeParam === 'skill-test') {
//       navigate(`/super-admin/halltickets-generation/skill-test?departmentId=${departmentId}`);
//     }
//   };

//   const getSelectedDepartmentName = () => {
//     const dept = departments.find(dept => dept.departmentId.toString() === selectedDepartment);
//     return dept ? dept.departmentName : '';
//   };

//   const getExamTypeDisplayName = (examType) => {
//     return examType === 'GCC' ? 'GCC TBC' : 'Skill Test';
//   };

//   if (loading) {
//     return (
//       <Container fluid className="mt-4">
//         <div className="text-center">
//           <Spinner animation="border" role="status" className="me-2" />
//           <span>Loading departments...</span>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="mt-4">
//       <h2 className="mb-4 text-center">Hall Tickets Generation</h2>
      
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <Card className="text-center">
//             <Card.Header>
//               <h4 className="mb-0">
//                 <FaDatabase className="me-2" />
//                 Select Department for Hall Ticket Generation
//               </h4>
//             </Card.Header>
//             <Card.Body className="p-4">
//               <p className="text-muted mb-4">
//                 Select a department and the system will automatically detect the exam type and redirect you to the appropriate form
//               </p>

//               {error && (
//                 <Alert variant="danger" className="mb-4">
//                   {error}
//                 </Alert>
//               )}

//               {/* Department Selection */}
//               <Row className="g-4 mb-4">
//                 <Col md={12}>
//                   <Card className="shadow-sm">
//                     <Card.Header className="bg-light">
//                       <h5 className="mb-0">
//                         <FaUniversity className="me-2" />
//                         Choose Department
//                       </h5>
//                     </Card.Header>
//                     <Card.Body>
//                       <Form.Group>
//                         <Form.Label>Department Selection</Form.Label>
//                         <Form.Select
//                           value={selectedDepartment}
//                           onChange={(e) => handleDepartmentSelect(e.target.value)}
//                           size="lg"
//                           disabled={redirecting}
//                         >
//                           <option value="">Select a department</option>
//                           {departments.map((dept) => (
//                             <option key={dept.departmentId} value={dept.departmentId}>
//                               {dept.departmentName} ({dept.examType ? getExamTypeDisplayName(dept.examType) : 'No Exam Type'})
//                             </option>
//                           ))}
//                         </Form.Select>
//                         <Form.Text className="text-muted">
//                           {departments.length} departments available • Exam types will be detected automatically
//                         </Form.Text>
//                       </Form.Group>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* Auto-Detection Status */}
//               {selectedDepartment && detectedExamType && (
//                 <Row className="g-4 mb-4">
//                   <Col md={12}>
//                     <Card className="shadow-sm border-success">
//                       <Card.Header className="bg-light-success">
//                         <h5 className="mb-0 text-success">
//                           <FaCheckCircle className="me-2" />
//                           Exam Type Detected Successfully
//                         </h5>
//                       </Card.Header>
//                       <Card.Body>
//                         <div className="text-center">
//                           <div className="mb-3">
//                             {detectedExamType === 'GCC' ? (
//                               <FaUniversity size={50} className="text-primary" />
//                             ) : (
//                               <FaCogs size={50} className="text-success" />
//                             )}
//                           </div>
//                           <h4 className="mb-3">
//                             <strong>{getSelectedDepartmentName()}</strong>
//                           </h4>
//                           <div className="d-flex align-items-center justify-content-center mb-3">
//                             <span className="text-muted me-2">Detected Exam Type:</span>
//                             <span className={`badge ${detectedExamType === 'GCC' ? 'bg-primary' : 'bg-success'} fs-6`}>
//                               {getExamTypeDisplayName(detectedExamType)}
//                             </span>
//                           </div>
                          
//                           {redirecting ? (
//                             <div className="mt-3">
//                               <Spinner animation="border" size="sm" className="me-2" />
//                               <span className="text-muted">Redirecting to hall ticket generation...</span>
//                             </div>
//                           ) : (
//                             <Button 
//                               variant={detectedExamType === 'GCC' ? 'primary' : 'success'}
//                               size="lg"
//                               onClick={() => redirectToHallTicketForm(detectedExamType, selectedDepartment)}
//                               className="px-5"
//                             >
//                               Generate {getExamTypeDisplayName(detectedExamType)} Hall Tickets
//                               <FaArrowRight className="ms-2" />
//                             </Button>
//                           )}
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 </Row>
//               )}

//               {/* Information Card */}
//               <Row>
//                 <Col md={12}>
//                   <Card className="bg-light">
//                     <Card.Body>
//                       <h6 className="mb-2">
//                         <FaDatabase className="me-2" />
//                         How It Works
//                       </h6>
//                       <ul className="text-muted mb-0 text-start">
//                         <li>Select a department from the dropdown above</li>
//                         <li>The system automatically detects the exam type (GCC TBC or Skill Test) from the database</li>
//                         <li>You'll be redirected directly to the appropriate hall ticket generation form</li>
//                         <li>No manual exam type selection required!</li>
//                       </ul>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default HallticketsDepartmentSelection;



// src/components/super-admin/HallticketsDepartmentSelection.js
import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaUniversity, FaCogs, FaArrowRight, FaDatabase, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HallticketsDepartmentSelection() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [detectedExamType, setDetectedExamType] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/hallticket-departments/departments');
        
        if (response.data.success) {
          setDepartments(response.data.data);
        } else {
          setError('Failed to fetch departments');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Error loading departments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentSelect = (departmentId) => {
    if (!departmentId) {
      setSelectedDepartment('');
      setDetectedExamType('');
      return;
    }

    setSelectedDepartment(departmentId);

    try {
      // Find the selected department from local state to get exam type
      const selectedDept = departments.find(dept => dept.departmentId.toString() === departmentId);
      
      if (selectedDept && selectedDept.examType) {
        setDetectedExamType(selectedDept.examType);
        setError(''); // Clear any previous errors
      } else {
        setError('Exam type not found for selected department');
        setDetectedExamType('');
      }
    } catch (err) {
      console.error('Error processing department selection:', err);
      setError('Error processing selection. Please try again.');
      setDetectedExamType('');
    }
  };

  const handleProceedToHallTickets = () => {
    if (!selectedDepartment || !detectedExamType) {
      alert('Please select a valid department first');
      return;
    }

    setRedirecting(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      redirectToHallTicketForm(detectedExamType, selectedDepartment);
    }, 500);
  };

  const redirectToHallTicketForm = (examType, departmentId) => {
    const examTypeParam = examType.toLowerCase() === 'gcc' ? 'gcc-tbc' : 'skill-test';
    
    if (examTypeParam === 'gcc-tbc') {
      navigate(`/super-admin/halltickets-generation/gcc-tbc?departmentId=${departmentId}`);
    } else if (examTypeParam === 'skill-test') {
      navigate(`/super-admin/halltickets-generation/skill-test?departmentId=${departmentId}`);
    }
  };

  const getSelectedDepartmentName = () => {
    const dept = departments.find(dept => dept.departmentId.toString() === selectedDepartment);
    return dept ? dept.departmentName : '';
  };

  const getExamTypeDisplayName = (examType) => {
    return examType === 'GCC' ? 'GCC TBC' : 'Skill Test';
  };

  if (loading) {
    return (
      <Container fluid className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Loading departments...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4 text-center">Hall Tickets Generation</h2>
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Header>
              <h4 className="mb-0">
                <FaDatabase className="me-2" />
                Select Department for Hall Ticket Generation
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted mb-4">
                Select a department and the system will automatically detect the exam type
              </p>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Department Selection */}
              <Row className="g-4 mb-4">
                <Col md={12}>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <FaUniversity className="me-2" />
                        Choose Department
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group>
                        <Form.Label>Department Selection</Form.Label>
                        <Form.Select
                          value={selectedDepartment}
                          onChange={(e) => handleDepartmentSelect(e.target.value)}
                          size="lg"
                          disabled={redirecting}
                        >
                          <option value="">Select a department</option>
                          {departments.map((dept) => (
                            <option key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName} ({dept.examType ? getExamTypeDisplayName(dept.examType) : 'No Exam Type'})
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          {departments.length} departments available • Exam types will be detected automatically
                        </Form.Text>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Auto-Detection Result & Proceed Button */}
              {selectedDepartment && detectedExamType && (
                <Row className="g-4 mb-4">
                  <Col md={12}>
                    <Card className="shadow-sm border-success">
                      <Card.Header className="bg-light-success">
                        <h5 className="mb-0 text-success">
                          <FaCheckCircle className="me-2" />
                          Exam Type Detected Successfully
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center">
                          <div className="mb-3">
                            {detectedExamType === 'GCC' ? (
                              <FaUniversity size={50} className="text-primary" />
                            ) : (
                              <FaCogs size={50} className="text-success" />
                            )}
                          </div>
                          
                          <h4 className="mb-3">
                            <strong>{getSelectedDepartmentName()}</strong>
                          </h4>
                          
                          <div className="d-flex align-items-center justify-content-center mb-4">
                            <span className="text-muted me-2">Detected Exam Type:</span>
                            <span className={`badge ${detectedExamType === 'GCC' ? 'bg-primary' : 'bg-success'} fs-6`}>
                              {getExamTypeDisplayName(detectedExamType)}
                            </span>
                          </div>
                          
                          <div className="text-center">
                            <Button 
                              variant={detectedExamType === 'GCC' ? 'primary' : 'success'}
                              size="lg"
                              onClick={handleProceedToHallTickets}
                              disabled={redirecting}
                              className="px-5 py-3"
                            >
                              {redirecting ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Redirecting...
                                </>
                              ) : (
                                <>
                                  Generate {getExamTypeDisplayName(detectedExamType)} Hall Tickets
                                  <FaArrowRight className="ms-2" />
                                </>
                              )}
                            </Button>
                            <p className="text-muted mt-3 mb-0">
                              Click the button above to proceed to hall ticket generation
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Information Card */}
              <Row>
                <Col md={12}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="mb-2">
                        <FaDatabase className="me-2" />
                        How It Works
                      </h6>
                      <ul className="text-muted mb-0 text-start">
                        <li>Select a department from the dropdown above</li>
                        <li>The system automatically detects the exam type (GCC TBC or Skill Test) from the database</li>
                        <li>Review the detected information and click the button to proceed</li>
                        <li>You'll be redirected to the appropriate hall ticket generation form</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HallticketsDepartmentSelection;