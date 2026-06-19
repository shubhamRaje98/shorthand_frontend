// // src/components/super-admin/department-setup/DepartmentTables.js
// import React, { useState } from 'react';
// import { Card, Table, Badge, Button, Spinner } from 'react-bootstrap';

// const DepartmentTables = ({
//   activeTable,
//   departments,
//   batches,
//   controllers,
//   fetchDepartments,
//   fetchBatches,
//   fetchControllers,
//   newlyAddedBatches,
//   newlyAddedControllers,
//   isNewlyAddedBatch,
//   isNewlyAddedController,
//   loading
// }) => {
//   const [refreshingDepartments, setRefreshingDepartments] = useState(false);
//   const [refreshingBatches, setRefreshingBatches] = useState(false);
//   const [refreshingControllers, setRefreshingControllers] = useState(false);

//   const handleRefreshDepartments = async () => {
//     setRefreshingDepartments(true);
//     await fetchDepartments();
//     setRefreshingDepartments(false);
//   };

//   const handleRefreshBatches = async () => {
//     setRefreshingBatches(true);
//     await fetchBatches();
//     setRefreshingBatches(false);
//   };

//   const handleRefreshControllers = async () => {
//     setRefreshingControllers(true);
//     await fetchControllers();
//     setRefreshingControllers(false);
//   };

//   // Sort batches: newly added first, then the rest
//   const getSortedBatches = () => {
//     const newBatches = batches.filter(batch => isNewlyAddedBatch(batch));
//     const oldBatches = batches.filter(batch => !isNewlyAddedBatch(batch));
    
//     // Sort new batches by timestamp (newest first)
//     const sortedNewBatches = [...newBatches].sort((a, b) => {
//       const timeA = newlyAddedBatches.find(nb => 
//         nb.batchNo == a.batchNo && nb.batchdate === a.batchdate
//       )?.timestamp;
//       const timeB = newlyAddedBatches.find(nb => 
//         nb.batchNo == b.batchNo && nb.batchdate === b.batchdate
//       )?.timestamp;
//       return new Date(timeB) - new Date(timeA);
//     });
    
//     // Sort old batches by batch number (highest first)
//     const sortedOldBatches = [...oldBatches].sort((a, b) => b.batchNo - a.batchNo);
    
//     return [...sortedNewBatches, ...sortedOldBatches];
//   };

//   // Sort controllers: newly added first, then the rest
//   const getSortedControllers = () => {
//     const newControllers = controllers.filter(controller => isNewlyAddedController(controller));
//     const oldControllers = controllers.filter(controller => !isNewlyAddedController(controller));
    
//     // Sort new controllers by timestamp (newest first)
//     const sortedNewControllers = [...newControllers].sort((a, b) => {
//       const timeA = newlyAddedControllers.find(nc => 
//         nc.controller_code == a.controller_code
//       )?.timestamp;
//       const timeB = newlyAddedControllers.find(nc => 
//         nc.controller_code == b.controller_code
//       )?.timestamp;
//       return new Date(timeB) - new Date(timeA);
//     });
    
//     // Sort old controllers by controller code (highest first)
//     const sortedOldControllers = [...oldControllers].sort((a, b) => b.controller_code - a.controller_code);
    
//     return [...sortedNewControllers, ...sortedOldControllers];
//   };

//   // Sort departments: newest first (by ID)
//   const getSortedDepartments = () => {
//     return [...departments].sort((a, b) => b.departmentId - a.departmentId);
//   };

//   if (activeTable === 'departments') {
//     const sortedDepartments = getSortedDepartments();
    
//     return (
//       <Card className="shadow">
//         <Card.Header className="bg-success text-white">
//           <h5 className="mb-0">All Departments</h5>
//           <small>Recently created departments shown first</small>
//         </Card.Header>
//         <Card.Body className="p-0">
//           {sortedDepartments.length === 0 ? (
//             <div className="p-4 text-center text-muted">
//               <Spinner animation="border" size="sm" className="me-2" />
//               Loading departments...
//             </div>
//           ) : (
//             <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//               <Table hover className="mb-0">
//                 <thead className="bg-light sticky-top">
//                   <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sortedDepartments.map((dept, index) => (
//                     <tr key={dept.departmentId}>
//                       <td>
//                         <strong>{dept.departmentId}</strong>
//                       </td>
//                       <td>
//                         <div>
//                           <div className="fw-bold text-truncate" style={{ maxWidth: '120px' }}>
//                             {dept.departmentName}
//                           </div>
//                           {dept.logo && (
//                             <img 
//                               src={dept.logo} 
//                               alt="Logo" 
//                               style={{ width: '20px', height: '20px', objectFit: 'contain' }}
//                               className="mt-1"
//                             />
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <Badge 
//                           bg={dept.departmentStatus ? 'success' : 'secondary'}
//                           className="text-white"
//                         >
//                           {dept.departmentStatus ? 'Active' : 'Inactive'}
//                         </Badge>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
          
//           <div className="p-3 bg-light border-top">
//             <div className="d-flex justify-content-between align-items-center">
//               <small className="text-muted">
//                 Total: {sortedDepartments.length} department{sortedDepartments.length !== 1 ? 's' : ''}
//               </small>
//               <Button 
//                 variant="outline-primary" 
//                 size="sm"
//                 onClick={handleRefreshDepartments}
//                 disabled={refreshingDepartments}
//               >
//                 {refreshingDepartments ? (
//                   <Spinner as="span" animation="border" size="sm" />
//                 ) : (
//                   '🔄'
//                 )}
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   if (activeTable === 'batches') {
//     const sortedBatches = getSortedBatches();
//     const newBatchesCount = sortedBatches.filter(batch => isNewlyAddedBatch(batch)).length;

//     return (
//       <Card className="shadow">
//         <Card.Header className="bg-info text-white">
//           <h5 className="mb-0">All Batches</h5>
//           <small>Newly added batches shown first</small>
//         </Card.Header>
//         <Card.Body className="p-0">
//           {sortedBatches.length === 0 ? (
//             <div className="p-4 text-center text-muted">
//               No batches found
//             </div>
//           ) : (
//             <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//               <Table hover className="mb-0">
//                 <thead className="bg-light sticky-top">
//                   <tr>
//                     <th>Batch No</th>
//                     <th>Date</th>
//                     <th>Timing</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sortedBatches.map((batch, index) => (
//                     <tr 
//                       key={batch.id || index}
//                       className={isNewlyAddedBatch(batch) ? 'table-success' : ''}
//                       style={isNewlyAddedBatch(batch) ? { 
//                         borderLeft: '4px solid #28a745',
//                         backgroundColor: '#d4edda'
//                       } : {}}
//                     >
//                       <td>
//                         <div className="d-flex align-items-center">
//                           <strong>{batch.batchNo}</strong>
//                           {isNewlyAddedBatch(batch) && (
//                             <Badge bg="success" className="ms-2" style={{ fontSize: '0.7em' }}>
//                               NEW
//                             </Badge>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-truncate" style={{ maxWidth: '80px' }}>
//                           {new Date(batch.batchdate).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="small">
//                           <div><strong>R:</strong> {batch.reporting_time}</div>
//                           <div><strong>S:</strong> {batch.start_time}</div>
//                           <div><strong>E:</strong> {batch.end_time}</div>
//                         </div>
//                       </td>
//                       <td>
//                         <Badge 
//                           bg={batch.batchstatus ? 'success' : 'secondary'}
//                           className="text-white"
//                         >
//                           {batch.batchstatus ? 'Active' : 'Inactive'}
//                         </Badge>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
          
//           <div className="p-3 bg-light border-top">
//             <div className="d-flex justify-content-between align-items-center">
//               <small className="text-muted">
//                 Total: {sortedBatches.length} batch{sortedBatches.length !== 1 ? 'es' : ''}
//                 {newBatchesCount > 0 && (
//                   <span className="text-success ms-2">
//                     ({newBatchesCount} new)
//                   </span>
//                 )}
//               </small>
//               <Button 
//                 variant="outline-info" 
//                 size="sm"
//                 onClick={handleRefreshBatches}
//                 disabled={refreshingBatches}
//               >
//                 {refreshingBatches ? (
//                   <Spinner as="span" animation="border" size="sm" />
//                 ) : (
//                   '🔄'
//                 )}
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   if (activeTable === 'controllers') {
//     const sortedControllers = getSortedControllers();
//     const newControllersCount = sortedControllers.filter(controller => isNewlyAddedController(controller)).length;

//     return (
//       <Card className="shadow">
//         <Card.Header className="bg-warning text-dark">
//           <h5 className="mb-0">Center Controllers</h5>
//           <small>Newly added controllers shown first</small>
//         </Card.Header>
//         <Card.Body className="p-0">
//           {sortedControllers.length === 0 ? (
//             <div className="p-4 text-center text-muted">
//               No controllers found
//             </div>
//           ) : (
//             <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//               <Table hover className="mb-0">
//                 <thead className="bg-light sticky-top">
//                   <tr>
//                     <th>Code</th>
//                     <th>Name</th>
//                     <th>Batch</th>
//                     <th>District</th>
//                     <th>Contact</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sortedControllers.map((controller, index) => (
//                     <tr 
//                       key={controller.controller_code || index}
//                       className={isNewlyAddedController(controller) ? 'table-warning' : ''}
//                       style={isNewlyAddedController(controller) ? { 
//                         borderLeft: '4px solid #ffc107',
//                         backgroundColor: '#fff3cd'
//                       } : {}}
//                     >
//                       <td>
//                         <div className="d-flex align-items-center">
//                           <strong>{controller.controller_code}</strong>
//                           {isNewlyAddedController(controller) && (
//                             <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '0.7em' }}>
//                               NEW
//                             </Badge>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-truncate" style={{ maxWidth: '100px' }}>
//                           {controller.controller_name}
//                         </div>
//                         <small className="text-muted">{controller.controller_email}</small>
//                       </td>
//                       <td>
//                         <Badge bg="secondary">{controller.batchNo}</Badge>
//                       </td>
//                       <td>
//                         <span className="text-truncate" style={{ maxWidth: '80px' }}>
//                           {controller.district}
//                         </span>
//                       </td>
//                       <td>
//                         <small>{controller.controller_contact}</small>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
          
//           <div className="p-3 bg-light border-top">
//             <div className="d-flex justify-content-between align-items-center">
//               <small className="text-muted">
//                 Total: {sortedControllers.length} controller{sortedControllers.length !== 1 ? 's' : ''}
//                 {newControllersCount > 0 && (
//                   <span className="text-warning ms-2">
//                     ({newControllersCount} new)
//                   </span>
//                 )}
//               </small>
//               <Button 
//                 variant="outline-warning" 
//                 size="sm"
//                 onClick={handleRefreshControllers}
//                 disabled={refreshingControllers}
//               >
//                 {refreshingControllers ? (
//                   <Spinner as="span" animation="border" size="sm" />
//                 ) : (
//                   '🔄'
//                 )}
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return null;
// };

// export default DepartmentTables;
// src/components/super-admin/department-setup/DepartmentTables.js
import React, { useState } from 'react';
import { Card, Table, Badge, Button, Spinner, Container, Row, Col } from 'react-bootstrap';
import { FaUniversity, FaDatabase, FaUsers, FaSync, FaCheckCircle } from 'react-icons/fa';

const DepartmentTables = ({
  activeTable,
  departments,
  batches,
  controllers,
  fetchDepartments,
  fetchBatches,
  fetchControllers,
  newlyAddedBatches,
  newlyAddedControllers,
  isNewlyAddedBatch,
  isNewlyAddedController,
  loading
}) => {
  const [refreshingDepartments, setRefreshingDepartments] = useState(false);
  const [refreshingBatches, setRefreshingBatches] = useState(false);
  const [refreshingControllers, setRefreshingControllers] = useState(false);

  const handleRefreshDepartments = async () => {
    setRefreshingDepartments(true);
    await fetchDepartments();
    setRefreshingDepartments(false);
  };

  const handleRefreshBatches = async () => {
    setRefreshingBatches(true);
    await fetchBatches();
    setRefreshingBatches(false);
  };

  const handleRefreshControllers = async () => {
    setRefreshingControllers(true);
    await fetchControllers();
    setRefreshingControllers(false);
  };

  // Sort batches: newly added first, then the rest
  const getSortedBatches = () => {
    const newBatches = batches.filter(batch => isNewlyAddedBatch(batch));
    const oldBatches = batches.filter(batch => !isNewlyAddedBatch(batch));

    // Sort new batches by timestamp (newest first)
    const sortedNewBatches = [...newBatches].sort((a, b) => {
      const timeA = newlyAddedBatches.find(nb =>
        nb.batchNo == a.batchNo && nb.batchdate === a.batchdate
      )?.timestamp;
      const timeB = newlyAddedBatches.find(nb =>
        nb.batchNo == b.batchNo && nb.batchdate === b.batchdate
      )?.timestamp;
      return new Date(timeB) - new Date(timeA);
    });

    // Sort old batches by batch number (highest first)
    const sortedOldBatches = [...oldBatches].sort((a, b) => b.batchNo - a.batchNo);

    return [...sortedNewBatches, ...sortedOldBatches];
  };

  // Sort controllers: newly added first, then the rest
  const getSortedControllers = () => {
    const newControllers = controllers.filter(controller => isNewlyAddedController(controller));
    const oldControllers = controllers.filter(controller => !isNewlyAddedController(controller));

    // Sort new controllers by timestamp (newest first)
    const sortedNewControllers = [...newControllers].sort((a, b) => {
      const timeA = newlyAddedControllers.find(nc =>
        nc.controller_code == a.controller_code
      )?.timestamp;
      const timeB = newlyAddedControllers.find(nc =>
        nc.controller_code == b.controller_code
      )?.timestamp;
      return new Date(timeB) - new Date(timeA);
    });

    // Sort old controllers by controller code (highest first)
    const sortedOldControllers = [...oldControllers].sort((a, b) => b.controller_code - a.controller_code);

    return [...sortedNewControllers, ...sortedOldControllers];
  };

  // Sort departments: newest first (by ID)
  const getSortedDepartments = () => {
    return [...departments].sort((a, b) => b.departmentId - a.departmentId);
  };

  if (activeTable === 'departments') {
    const sortedDepartments = getSortedDepartments();

    return (
      <Container fluid className="mt-4">
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-success-subtle">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1">
                      <FaUniversity className="me-2" />
                      All Departments
                    </h5>
                    <small className="text-muted">Recently created departments shown first</small>
                  </div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleRefreshDepartments}
                    disabled={refreshingDepartments}
                    className="px-3"
                  >
                    {refreshingDepartments ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-1" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <FaSync className="me-1" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {sortedDepartments.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Loading departments...</span>
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <Table hover className="mb-0">
                      <thead className="bg-light sticky-top">
                        <tr>
                          <th className="py-3">
                            <FaCheckCircle className="me-2 text-success" />
                            ID
                          </th>
                          <th className="py-3">Name & Logo</th>
                          <th className="py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedDepartments.map((dept) => (
                          <tr key={dept.departmentId} className="align-middle">
                            <td>
                              <strong className="text-primary">{dept.departmentId}</strong>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div>
                                  <div className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>
                                    {dept.departmentName}
                                  </div>
                                  {dept.logo && (
                                    <div className="mt-2">
                                      <img
                                        src={dept.logo}
                                        alt="Logo"
                                        style={{
                                          width: '30px',
                                          height: '30px',
                                          objectFit: 'contain',
                                          borderRadius: '4px',
                                          border: '1px solid #dee2e6'
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <Badge
                                bg={dept.departmentStatus ? 'success' : 'secondary'}
                                className="px-3 py-2"
                              >
                                {dept.departmentStatus ? (
                                  <>
                                    <FaCheckCircle className="me-1" />
                                    Active
                                  </>
                                ) : (
                                  'Inactive'
                                )}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <strong>Total:</strong> {sortedDepartments.length} department{sortedDepartments.length !== 1 ? 's' : ''}
                  </small>
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleTimeString()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (activeTable === 'batches') {
    const sortedBatches = getSortedBatches();
    const newBatchesCount = sortedBatches.filter(batch => isNewlyAddedBatch(batch)).length;

    return (
      <Container fluid className="mt-4">
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-info-subtle">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1">
                      <FaDatabase className="me-2" />
                      All Batches
                    </h5>
                    <small className="text-muted">Newly added batches shown first</small>
                  </div>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={handleRefreshBatches}
                    disabled={refreshingBatches}
                    className="px-3"
                  >
                    {refreshingBatches ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-1" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <FaSync className="me-1" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {sortedBatches.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No batches found. Create batches in the form above.
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <Table hover className="mb-0">
                      <thead className="bg-light sticky-top">
                        <tr>
                          <th className="py-3">
                            <FaDatabase className="me-2 text-info" />
                            Batch No
                          </th>
                          <th className="py-3">Date</th>
                          <th className="py-3">Timing</th>
                          <th className="py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedBatches.map((batch, index) => (
                          <tr
                            key={batch.id || index}
                            className={isNewlyAddedBatch(batch) ? 'table-success' : ''}
                            style={isNewlyAddedBatch(batch) ? {
                              borderLeft: '4px solid #28a745',
                              backgroundColor: '#d4edda'
                            } : {}}
                          >
                            <td className="align-middle">
                              <div className="d-flex align-items-center gap-2">
                                <strong className="text-info">{batch.batchNo}</strong>
                                {isNewlyAddedBatch(batch) && (
                                  <Badge bg="success" style={{ fontSize: '0.7em' }}>
                                    <FaCheckCircle className="me-1" />
                                    NEW
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="align-middle">
                              <div className="text-truncate" style={{ maxWidth: '100px' }}>
                                {new Date(batch.batchdate).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </td>
                            <td className="align-middle">
                              <div className="small">
                                <div><strong>Report:</strong> {batch.reporting_time}</div>
                                <div><strong>Start:</strong> {batch.start_time}</div>
                                <div><strong>End:</strong> {batch.end_time}</div>
                              </div>
                            </td>
                            <td className="text-center align-middle">
                              <Badge
                                bg={batch.batchstatus ? 'success' : 'secondary'}
                                className="px-3 py-2"
                              >
                                {batch.batchstatus ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted me-3">
                      <strong>Total:</strong> {sortedBatches.length} batch{sortedBatches.length !== 1 ? 'es' : ''}
                    </small>
                    {newBatchesCount > 0 && (
                      <small className="text-success">
                        <FaCheckCircle className="me-1" />
                        {newBatchesCount} new
                      </small>
                    )}
                  </div>
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleTimeString()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (activeTable === 'controllers') {
    const sortedControllers = getSortedControllers();
    const newControllersCount = sortedControllers.filter(controller => isNewlyAddedController(controller)).length;

    return (
      <Container fluid className="mt-4">
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-warning-subtle">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1">
                      <FaUsers className="me-2" />
                      Center Controllers
                    </h5>
                    <small className="text-muted">Newly added controllers shown first</small>
                  </div>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={handleRefreshControllers}
                    disabled={refreshingControllers}
                    className="px-3"
                  >
                    {refreshingControllers ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-1" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <FaSync className="me-1" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {sortedControllers.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No controllers found. Add controllers in the form above.
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <Table hover className="mb-0">
                      <thead className="bg-light sticky-top">
                        <tr>
                          <th className="py-3">
                            <FaUsers className="me-2 text-warning" />
                            Code
                          </th>
                          <th className="py-3">Name & Email</th>
                          <th className="py-3">Batch</th>
                          <th className="py-3">District</th>
                          <th className="py-3">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedControllers.map((controller, index) => (
                          <tr
                            key={controller.controller_code || index}
                            className={isNewlyAddedController(controller) ? 'table-warning' : ''}
                            style={isNewlyAddedController(controller) ? {
                              borderLeft: '4px solid #ffc107',
                              backgroundColor: '#fff3cd'
                            } : {}}
                          >
                            <td className="align-middle">
                              <div className="d-flex align-items-center gap-2">
                                <strong className="text-warning">{controller.controller_code || 'N/A'}</strong>
                                {isNewlyAddedController(controller) && (
                                  <Badge bg="warning" text="dark" style={{ fontSize: '0.7em' }}>
                                    <FaCheckCircle className="me-1" />
                                    NEW
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="align-middle">
                              <div className="text-truncate" style={{ maxWidth: '120px' }}>
                                <strong>{controller.controller_name}</strong>
                              </div>
                              <small className="text-muted text-truncate" style={{ maxWidth: '120px' }}>
                                {controller.controller_email}
                              </small>
                            </td>
                            <td className="align-middle">
                              <Badge bg="secondary" className="px-2 py-1">
                                Batch {controller.batchNo}
                              </Badge>
                            </td>
                            <td className="align-middle">
                              <span className="text-truncate" style={{ maxWidth: '100px', display: 'inline-block' }}>
                                {controller.district || 'N/A'}
                              </span>
                            </td>
                            <td className="align-middle">
                              <small className="text-monospace">{controller.controller_contact}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted me-3">
                      <strong>Total:</strong> {sortedControllers.length} controller{sortedControllers.length !== 1 ? 's' : ''}
                    </small>
                    {newControllersCount > 0 && (
                      <small className="text-warning">
                        <FaCheckCircle className="me-1" />
                        {newControllersCount} new
                      </small>
                    )}
                  </div>
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleTimeString()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return null;
};

export default DepartmentTables;
