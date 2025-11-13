// import React from 'react';
// import { Modal, Alert, Row, Col, Card, ListGroup, Table, Badge } from 'react-bootstrap';
// import { FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

// export const ExcelValidationModal = ({
//   show,
//   onHide,
//   errors,
//   summary,
//   title = 'Excel Validation Report'
// }) => {
//   if (!show || !summary) return null;

//   return (
//     <Modal 
//       show={show} 
//       onHide={onHide}
//       size="xl"
//       centered
//     >
//       <Modal.Header closeButton className="bg-danger text-white">
//         <Modal.Title>
//           <FaExclamationTriangle className="me-2" />
//           {title}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {/* Summary */}
//         <Alert variant="danger" className="mb-4">
//           <Row>
//             <Col md={4} className="text-center">
//               <h4 className="mb-0">{summary.totalRows}</h4>
//               <small>Total Rows</small>
//             </Col>
//             <Col md={4} className="text-center">
//               <h4 className="mb-0 text-danger">{summary.errorCount}</h4>
//               <small>Rows with Errors</small>
//             </Col>
//             <Col md={4} className="text-center">
//               <h4 className="mb-0 text-success">{summary.successCount}</h4>
//               <small>Valid Rows</small>
//             </Col>
//           </Row>
//         </Alert>

//         {/* Field Errors */}
//         {summary.fieldErrors && summary.fieldErrors.length > 0 && (
//           <Card className="mb-4">
//             <Card.Header>
//               <strong>Fields with Missing Data</strong>
//             </Card.Header>
//             <Card.Body>
//               <Table striped bordered hover size="sm">
//                 <thead>
//                   <tr>
//                     <th>Field Name</th>
//                     <th className="text-center">Missing Count</th>
//                     <th className="text-center">Percentage</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {summary.fieldErrors.map((field, idx) => (
//                     <tr key={idx}>
//                       <td>{field.field}</td>
//                       <td className="text-center">
//                         <Badge bg="danger">{field.count}</Badge>
//                       </td>
//                       <td className="text-center">{field.percentage}%</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Detailed Errors */}
//         <Card>
//           <Card.Header>
//             <strong>Detailed Error Report (First 15)</strong>
//           </Card.Header>
//           <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
//             <ListGroup variant="flush">
//               {errors.slice(0, 15).map((error, idx) => (
//                 <ListGroup.Item key={idx} variant="danger" className="mb-2">
//                   <Row>
//                     <Col md={3}>
//                       <strong>Row {error.rowNumber}</strong>
//                       <br />
//                       <small className="text-muted">ID: {error.identifier}</small>
//                     </Col>
//                     <Col md={9}>
//                       <strong>Issues:</strong>
//                       <div className="mt-2">
//                         {error.missingFields.map((field, fidx) => (
//                           <Badge key={fidx} bg="danger" className="me-2 mb-2">
//                             <FaTimes className="me-1" />{field}
//                           </Badge>
//                         ))}
//                       </div>
//                     </Col>
//                   </Row>
//                 </ListGroup.Item>
//               ))}
//               {errors.length > 15 && (
//                 <ListGroup.Item className="text-center">
//                   <small>...and {errors.length - 15} more</small>
//                 </ListGroup.Item>
//               )}
//             </ListGroup>
//           </Card.Body>
//         </Card>

//         {/* Instructions */}
//         <Alert variant="info" className="mt-4 mb-0">
//           <FaInfoCircle className="me-2" />
//           <strong>How to fix:</strong> Update your Excel file with the missing values and upload again.
//         </Alert>
//       </Modal.Body>
//       <Modal.Footer>
//         <button className="btn btn-secondary" onClick={onHide}>
//           Close
//         </button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ExcelValidationModal;

// src/utils/ExcelValidationModal.js
import React, { useEffect } from 'react';
import { Modal, Alert, Row, Col, Card, ListGroup, Table, Badge } from 'react-bootstrap';
import { FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

export const ExcelValidationModal = ({
  show,
  onHide,
  errors,
  summary,
  title = 'Excel Validation Report'
}) => {
  // ✅ HOOK MUST BE CALLED FIRST - Before any early returns!
  useEffect(() => {
    if (show && errors && errors.length > 0) {
      console.log('🔍 Modal Debug Info:');
      console.log('Total errors:', errors.length);
      console.log('First error structure:', errors[0]);
      console.log('First error missingFields:', errors[0].missingFields);
      console.log('Type of missingFields:', typeof errors[0].missingFields);
      console.log('Is array?', Array.isArray(errors[0].missingFields));
    }
  }, [show, errors]);

  // ✅ Now early return can happen AFTER useEffect
  if (!show || !summary) return null;

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="xl"
      centered
    >
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <FaExclamationTriangle className="me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Summary */}
        <Alert variant="danger" className="mb-4">
          <Row>
            <Col md={4} className="text-center">
              <h4 className="mb-0">{summary.totalRows}</h4>
              <small>Total Rows</small>
            </Col>
            <Col md={4} className="text-center">
              <h4 className="mb-0 text-danger">{summary.errorCount}</h4>
              <small>Rows with Errors</small>
            </Col>
            <Col md={4} className="text-center">
              <h4 className="mb-0 text-success">{summary.successCount}</h4>
              <small>Valid Rows</small>
            </Col>
          </Row>
        </Alert>

        {/* Field Errors */}
        {summary.fieldErrors && summary.fieldErrors.length > 0 && (
          <Card className="mb-4">
            <Card.Header>
              <strong>Fields with Missing Data</strong>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th className="text-center">Missing Count</th>
                    <th className="text-center">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.fieldErrors.map((field, idx) => (
                    <tr key={idx}>
                      <td>{field.field}</td>
                      <td className="text-center">
                        <Badge bg="danger">{field.count}</Badge>
                      </td>
                      <td className="text-center">{field.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Detailed Errors - ✅ SHOWS ALL ERRORS (not just first 15) */}
        <Card>
          <Card.Header>
            <strong>Detailed Error Report (All {errors.length} errors)</strong>
          </Card.Header>
          <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <ListGroup variant="flush">
              {errors.map((error, idx) => {
                // ✅ FIX: Handle both array and string cases
                const missingFieldsArray = Array.isArray(error.missingFields) 
                  ? error.missingFields 
                  : (error.missingFields ? [error.missingFields] : []);

                return (
                  <ListGroup.Item key={idx} variant="danger" className="mb-2">
                    <Row>
                      <Col md={3}>
                        <strong>Row {error.rowNumber}</strong>
                        <br />
                        <small className="text-muted">ID: {error.identifier}</small>
                      </Col>
                      <Col md={9}>
                        <strong>Issues ({missingFieldsArray.length} fields):</strong>
                        <div className="mt-2">
                          {missingFieldsArray.length > 0 ? (
                            missingFieldsArray.map((field, fidx) => (
                              <Badge key={fidx} bg="danger" className="me-2 mb-2">
                                <FaTimes className="me-1" />
                                {typeof field === 'string' ? field : JSON.stringify(field)}
                              </Badge>
                            ))
                          ) : (
                            <small className="text-muted">No specific fields listed</small>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Instructions */}
        <Alert variant="info" className="mt-4 mb-0">
          <FaInfoCircle className="me-2" />
          <strong>How to fix:</strong> Update your Excel file with the missing values and upload again.
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExcelValidationModal;
