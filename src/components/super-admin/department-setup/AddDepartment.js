// // src/components/super-admin/department-setup/AddDepartment.js
// //src/components/super-admin/department-setup/AddDepartment.js
// import React, { useState, useEffect } from 'react';
// import {
//   Container, Row, Col, Card, Form, Button, Alert, ButtonGroup
// } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // Import modular components
// import DepartmentForms from './DepartmentForms';
// import DepartmentTables from './DepartmentTables';

// const AddDepartment = () => {
//   // -------------------------------
//   // State Management
//   // -------------------------------
//   const [departments, setDepartments] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [controllers, setControllers] = useState([]);
//   const [newlyAddedBatches, setNewlyAddedBatches] = useState([]);
//   const [newlyAddedControllers, setNewlyAddedControllers] = useState([]);
//   const [message, setMessage] = useState('');
//   const [activeAccordion, setActiveAccordion] = useState('new');
//   const [fetchingDepartments, setFetchingDepartments] = useState(true);
//   const [refreshingDepartments, setRefreshingDepartments] = useState(false);
//   const [activeTable, setActiveTable] = useState(''); // 'departments', 'batches', 'controllers', or ''

//   const navigate = useNavigate();

//   // -------------------------------
//   // Lifecycle Hooks
//   // -------------------------------
//   useEffect(() => {
//     loadPersistedData();
//     fetchDepartments();
//   }, []);

//   useEffect(() => {
//     return () => {
//       setActiveTable(''); // Reset when unmounting
//     };
//   }, []);

//   // -------------------------------
//   // Local Storage Persistence
//   // -------------------------------
//   const loadPersistedData = () => {
//     try {
//       const persisted = localStorage.getItem('departmentSetupData');
//       if (persisted) {
//         const data = JSON.parse(persisted);
//         if (data.activeAccordion) setActiveAccordion(data.activeAccordion);
//         if (data.newlyAddedBatches) setNewlyAddedBatches(data.newlyAddedBatches);
//         if (data.newlyAddedControllers) setNewlyAddedControllers(data.newlyAddedControllers);
//       }
//     } catch (error) {
//       console.error('Error loading persisted data:', error);
//     }
//   };

//   const persistFormData = (data) => {
//     try {
//       const dataToPersist = {
//         ...data,
//         activeAccordion,
//         newlyAddedBatches,
//         newlyAddedControllers,
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

//   // -------------------------------
//   // API Calls
//   // -------------------------------
//   const fetchDepartments = async () => {
//     setRefreshingDepartments(true);
//     try {
//       const response = await axios.get('http://checking.shorthandonlineexam.in/api/new-department/departments');
//       setDepartments(response.data.data || []);
//     } catch (err) {
//       console.error('Error fetching departments:', err);
//       setMessage('Error loading departments');
//     } finally {
//       setFetchingDepartments(false);
//       setRefreshingDepartments(false);
//     }
//   };

//   const fetchBatches = async (departmentId = null) => {
//     try {
//       const url = departmentId
//         ? `http://checking.shorthandonlineexam.in/api/new-department/batches/${departmentId}`
//         : 'http://checking.shorthandonlineexam.in/api/new-department/batches';

//       const response = await axios.get(url);
//       const fetchedBatches = response.data.data || [];

//       const sortedBatches = sortBatchesByNewest(fetchedBatches);
//       setBatches(sortedBatches);
//     } catch (err) {
//       console.error('Error fetching batches:', err);
//       setMessage('Error loading batches');
//     }
//   };

//   const fetchControllers = async (departmentId = null, batchNo = null) => {
//     try {
//       let url = 'http://checking.shorthandonlineexam.in/api/new-department/controllers';

//       if (departmentId && batchNo) {
//         url = `http://checking.shorthandonlineexam.in/api/new-department/controllers/department/${departmentId}/batch/${batchNo}`;
//       } else if (departmentId) {
//         url = `http://checking.shorthandonlineexam.in/api/new-department/controllers/department/${departmentId}`;
//       }

//       const response = await axios.get(url);
//       const fetchedControllers = response.data.data || [];

//       const sortedControllers = sortControllersByNewest(fetchedControllers);
//       setControllers(sortedControllers);
//     } catch (err) {
//       console.error('Error fetching controllers:', err);
//       setMessage('Error loading controllers');
//     }
//   };

//   // -------------------------------
//   // Sorting Helpers
//   // -------------------------------
//   const sortBatchesByNewest = (batchList) => {
//     return batchList.sort((a, b) => {
//       const aIsNew = newlyAddedBatches.some(newBatch =>
//         newBatch.batchNo == a.batchNo &&
//         newBatch.batchdate === a.batchdate &&
//         newBatch.departmentId == a.departmentId
//       );
//       const bIsNew = newlyAddedBatches.some(newBatch =>
//         newBatch.batchNo == b.batchNo &&
//         newBatch.batchdate === b.batchdate &&
//         newBatch.departmentId == b.departmentId
//       );

//       if (aIsNew && !bIsNew) return -1;
//       if (!aIsNew && bIsNew) return 1;

//       const dateA = new Date(a.batchdate);
//       const dateB = new Date(b.batchdate);
//       if (dateA.getTime() !== dateB.getTime()) {
//         return dateB - dateA;
//       }

//       return parseInt(b.batchNo) - parseInt(a.batchNo);
//     });
//   };

//   const sortControllersByNewest = (controllerList) => {
//     return controllerList.sort((a, b) => {
//       const aIsNew = newlyAddedControllers.some(newController =>
//         newController.controller_code == a.controller_code &&
//         newController.departmentId == a.departmentId &&
//         newController.batchNo == a.batchNo
//       );
//       const bIsNew = newlyAddedControllers.some(newController =>
//         newController.controller_code == b.controller_code &&
//         newController.departmentId == b.departmentId &&
//         newController.batchNo == b.batchNo
//       );

//       if (aIsNew && !bIsNew) return -1;
//       if (!aIsNew && bIsNew) return 1;

//       return parseInt(b.controller_code) - parseInt(a.controller_code);
//     });
//   };

//   // -------------------------------
//   // Table Controls
//   // -------------------------------
//   const handleShowDepartments = async () => {
//     setActiveTable('departments');
//     await fetchDepartments();
//   };

//   const handleShowBatches = async () => {
//     setActiveTable('batches');
//     await fetchBatches();
//   };

//   const handleShowControllers = async () => {
//     setActiveTable('controllers');
//     await fetchControllers();
//   };

//   // -------------------------------
//   // Continue Button Handler
//   // -------------------------------
//   const handleContinueToNextStep = () => {
//     clearPersistedData();
//     navigate('/super-admin/add-exam-center');
//   };

//   // -------------------------------
//   // Utility Checks
//   // -------------------------------
//   const isNewlyAddedBatch = (batch) => {
//     return newlyAddedBatches.some(newBatch =>
//       newBatch.batchNo == batch.batchNo &&
//       newBatch.batchdate === batch.batchdate &&
//       newBatch.departmentId == batch.departmentId
//     );
//   };

//   const isNewlyAddedController = (controller) => {
//     return newlyAddedControllers.some(newController =>
//       newController.controller_code == controller.controller_code &&
//       newController.departmentId == controller.departmentId &&
//       newController.batchNo == controller.batchNo
//     );
//   };

//   // -------------------------------
//   // Layout Helpers
//   // -------------------------------
//   const getLeftColSize = () => (activeTable ? 8 : 12);
//   const getRightColSize = () => 4;

//   // -------------------------------
//   // JSX Render
//   // -------------------------------
//   return (
//     <Container fluid className="my-4">
//       <Row className="g-4">
//         {/* Left Side - Forms */}
//         <Col lg={getLeftColSize()}>
//           <Card className="shadow">
//             <Card.Header className="bg-primary text-white">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h4 className="mb-0">Step 1: Department Management</h4>
//                   <small>Create department, add batches, and assign center controllers</small>
//                 </div>

//                 {/* Table Control Buttons */}
//                 <ButtonGroup size="sm">
//                   <Button
//                     variant={activeTable === 'departments' ? 'success' : 'outline-light'}
//                     onClick={handleShowDepartments}
//                   >
//                     📋 Departments
//                   </Button>
//                   <Button
//                     variant={activeTable === 'batches' ? 'info' : 'outline-light'}
//                     onClick={handleShowBatches}
//                   >
//                     📅 Batches
//                   </Button>
//                   <Button
//                     variant={activeTable === 'controllers' ? 'warning' : 'outline-light'}
//                     onClick={handleShowControllers}
//                   >
//                     👤 Controllers
//                   </Button>
//                   {activeTable && (
//                     <Button
//                       variant="outline-light"
//                       onClick={() => setActiveTable('')}
//                     >
//                       ✕
//                     </Button>
//                   )}
//                 </ButtonGroup>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {message && (
//                 <Alert variant={message.includes('successfully') || message.includes('✅') ? 'success' : 'danger'}>
//                   {message}
//                 </Alert>
//               )}

//               <DepartmentForms
//                 activeAccordion={activeAccordion}
//                 setActiveAccordion={setActiveAccordion}
//                 departments={departments}
//                 setDepartments={setDepartments}
//                 setMessage={setMessage}
//                 fetchDepartments={fetchDepartments}
//                 fetchBatches={fetchBatches}
//                 fetchControllers={fetchControllers}
//                 newlyAddedBatches={newlyAddedBatches}
//                 setNewlyAddedBatches={setNewlyAddedBatches}
//                 newlyAddedControllers={newlyAddedControllers}
//                 setNewlyAddedControllers={setNewlyAddedControllers}
//                 persistFormData={persistFormData}
//                 clearPersistedData={clearPersistedData}
//                 navigate={navigate}
//                 fetchingDepartments={fetchingDepartments}
//                 onDepartmentSuccess={() => setActiveTable('departments')}
//                 onBatchSuccess={() => setActiveTable('batches')}
//                 onControllerSuccess={() => setActiveTable('controllers')}
//               />

//               {/* Continue Button */}
//               {activeTable && (
//                 <div className="mt-4 text-center">
//                   <Button
//                     variant="success"
//                     size="lg"
//                     onClick={handleContinueToNextStep}
//                   >
//                     Continue to Next Step (Add Exam Center) →
//                   </Button>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right Side - Table Display */}
//         {activeTable && (
//           <Col lg={getRightColSize()}>
//             <DepartmentTables
//               activeTable={activeTable}
//               departments={departments}
//               batches={batches}
//               controllers={controllers}
//               fetchDepartments={fetchDepartments}
//               fetchBatches={fetchBatches}
//               fetchControllers={fetchControllers}
//               newlyAddedBatches={newlyAddedBatches}
//               newlyAddedControllers={newlyAddedControllers}
//               isNewlyAddedBatch={isNewlyAddedBatch}
//               isNewlyAddedController={isNewlyAddedController}
//               loading={fetchingDepartments}
//             />
//           </Col>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default AddDepartment;


// src/components/super-admin/department-setup/AddDepartment.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, ButtonGroup, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle, FaUniversity, FaDatabase, FaUsers } from 'react-icons/fa';
import axios from 'axios';

// Import modular components
import DepartmentForms from './DepartmentForms';
import DepartmentTables from './DepartmentTables';

const AddDepartment = () => {
  // -------------------------------
  // State Management
  // -------------------------------
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [controllers, setControllers] = useState([]);
  const [newlyAddedBatches, setNewlyAddedBatches] = useState([]);
  const [newlyAddedControllers, setNewlyAddedControllers] = useState([]);
  const [message, setMessage] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('new');
  const [fetchingDepartments, setFetchingDepartments] = useState(true);
  const [refreshingDepartments, setRefreshingDepartments] = useState(false);
  const [activeTable, setActiveTable] = useState(''); // 'departments', 'batches', 'controllers', or ''

  const navigate = useNavigate();

  // -------------------------------
  // Lifecycle Hooks
  // -------------------------------
  useEffect(() => {
    loadPersistedData();
    fetchDepartments();
  }, []);

  useEffect(() => {
    return () => {
      setActiveTable(''); // Reset when unmounting
    };
  }, []);

  // -------------------------------
  // Local Storage Persistence
  // -------------------------------
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

  // -------------------------------
  // API Calls
  // -------------------------------
  const fetchDepartments = async () => {
    setRefreshingDepartments(true);
    try {
      const response = await axios.get('http://checking.shorthandonlineexam.in/api/new-department/departments');
      setDepartments(response.data.data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setMessage('Error loading departments');
    } finally {
      setFetchingDepartments(false);
      setRefreshingDepartments(false);
    }
  };

  const fetchBatches = async (departmentId = null) => {
    try {
      const url = departmentId
        ? `http://checking.shorthandonlineexam.in/api/new-department/batches/${departmentId}`
        : 'http://checking.shorthandonlineexam.in/api/new-department/batches';

      const response = await axios.get(url);
      const fetchedBatches = response.data.data || [];

      const sortedBatches = sortBatchesByNewest(fetchedBatches);
      setBatches(sortedBatches);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setMessage('Error loading batches');
    }
  };

  const fetchControllers = async (departmentId = null, batchNo = null) => {
    try {
      let url = 'http://checking.shorthandonlineexam.in/api/new-department/controllers';

      if (departmentId && batchNo) {
        url = `http://checking.shorthandonlineexam.in/api/new-department/controllers/department/${departmentId}/batch/${batchNo}`;
      } else if (departmentId) {
        url = `http://checking.shorthandonlineexam.in/api/new-department/controllers/department/${departmentId}`;
      }

      const response = await axios.get(url);
      const fetchedControllers = response.data.data || [];

      const sortedControllers = sortControllersByNewest(fetchedControllers);
      setControllers(sortedControllers);
    } catch (err) {
      console.error('Error fetching controllers:', err);
      setMessage('Error loading controllers');
    }
  };

  // -------------------------------
  // Sorting Helpers
  // -------------------------------
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

  // -------------------------------
  // Table Controls
  // -------------------------------
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

  // -------------------------------
  // Continue Button Handler
  // -------------------------------
  const handleContinueToNextStep = () => {
    clearPersistedData();
    navigate('/super-admin/add-exam-center');
  };

  // -------------------------------
  // Utility Checks
  // -------------------------------
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

  // -------------------------------
  // JSX Render
  // -------------------------------
  return (
    <Container fluid className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-1">
                  <FaUniversity className="me-2" />
                  Step 1: Department Management
                </h2>
                <p className="text-muted mb-0">
                  Create departments, add batches, and assign center controllers
                </p>
              </div>
            </div>
          </div>

          {/* Table Control Buttons */}
          <div className="d-flex gap-2 flex-wrap mb-4">
            <ButtonGroup>
              <Button
                variant={activeTable === 'departments' ? 'success' : 'outline-success'}
                onClick={handleShowDepartments}
                className="px-3 py-2"
                size="sm"
              >
                <FaUniversity className="me-2" />
                Departments
                {departments.length > 0 && (
                  <span className="ms-2 badge bg-success text-white">{departments.length}</span>
                )}
              </Button>
              <Button
                variant={activeTable === 'batches' ? 'info' : 'outline-info'}
                onClick={handleShowBatches}
                className="px-3 py-2"
                size="sm"
              >
                <FaDatabase className="me-2" />
                Batches
                {batches.length > 0 && (
                  <span className="ms-2 badge bg-info text-white">{batches.length}</span>
                )}
              </Button>
              <Button
                variant={activeTable === 'controllers' ? 'warning' : 'outline-warning'}
                onClick={handleShowControllers}
                className="px-3 py-2"
                size="sm"
              >
                <FaUsers className="me-2" />
                Controllers
                {controllers.length > 0 && (
                  <span className="ms-2 badge bg-warning text-dark">{controllers.length}</span>
                )}
              </Button>
              {activeTable && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setActiveTable('')}
                  className="px-3 py-2"
                  size="sm"
                  title="Close table"
                >
                  ✕ Close
                </Button>
              )}
            </ButtonGroup>
          </div>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Left Side - Forms (Takes 12 columns if table closed, 8 if open) */}
        <Col lg={activeTable ? 8 : 12}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="mb-0">
                <FaCheckCircle className="me-2" />
                Setup Forms
              </h5>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Alert Messages */}
              {message && (
                <Alert 
                  variant={message.includes('successfully') || message.includes('✅') ? 'success' : 'danger'}
                  dismissible
                  onClose={() => setMessage('')}
                  className="mb-4"
                >
                  {message}
                </Alert>
              )}

              {/* Loading State */}
              {fetchingDepartments && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" className="me-2" />
                  <span>Loading departments...</span>
                </div>
              )}

              {/* Forms Component */}
              {!fetchingDepartments && (
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
                  onDepartmentSuccess={() => {
                    setActiveTable('departments');
                    setMessage('✅ Department created! View it in the table →');
                  }}
                  onBatchSuccess={() => {
                    setActiveTable('batches');
                    setMessage('✅ Batches added! View them in the table →');
                  }}
                  onControllerSuccess={() => {
                    setActiveTable('controllers');
                    setMessage('✅ Controllers added! View them in the table →');
                  }}
                />
              )}

              {/* Continue Button */}
              {activeTable && !fetchingDepartments && (
                <div className="mt-5 pt-4 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Ready to move to the next step?
                    </small>
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleContinueToNextStep}
                      className="px-4 py-2"
                    >
                      <FaCheckCircle className="me-2" />
                      Continue to Next Step
                      <FaArrowRight className="ms-2" />
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side - Table Display (Takes 4 columns when visible, hidden otherwise) */}
        {activeTable && !fetchingDepartments && (
          <Col lg={4} className="position-sticky" style={{ top: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
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

      {/* Full Width Table Display (Alternative Layout) */}
      {activeTable && !fetchingDepartments && (
        <Row className="g-4 mt-4">
          <Col lg={12}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-secondary-subtle py-2">
                <h6 className="mb-0">
                  <FaDatabase className="me-2" />
                  {activeTable === 'departments' && 'All Departments'}
                  {activeTable === 'batches' && 'All Batches'}
                  {activeTable === 'controllers' && 'All Center Controllers'}
                </h6>
              </Card.Header>
              <Card.Body className="p-0">
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AddDepartment;
