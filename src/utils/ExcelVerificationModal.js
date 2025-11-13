// src/utils/ExcelVerificationModal.js

import React, { useState } from 'react';
import {
  Modal,
  Alert,
  Row,
  Col,
  Card,
  ListGroup,
  Table,
  Badge,
  Button,
  ProgressBar,
  Accordion,
  Spinner
} from 'react-bootstrap';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaDatabase,
  FaColumns,
  FaEye,
  FaLink,
  FaTimesCircle
} from 'react-icons/fa';

export const ExcelVerificationModal = ({
  show,
  onHide,
  onConfirm,
  verificationData,
  isLoading = false,
  title = 'Excel Data Verification Report',
  confirmButtonText = 'Confirm & Upload',
  confirmButtonVariant = 'success'
}) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (!show || !verificationData) return null;

  const {
    summary = {},
    foreignKeyValidation = {},
    dataQuality = {},
    columnMapping = [],
    preview = [],
    warnings = [],
    suggestions = []
  } = verificationData;

  const canUpload = foreignKeyValidation.integrityScore === 100;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton className="bg-info text-white">
        <Modal.Title>
          <FaCheckCircle className="me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Overall Status Alert */}
        <Alert variant={canUpload ? 'success' : 'danger'} className="mb-4">
          <Row className="align-items-center">
            <Col md={8}>
              {canUpload ? (
                <>
                  <FaCheckCircle className="me-2" size={20} />
                  <strong>✅ All Validations Passed!</strong>
                  <p className="mb-0 mt-2 small">
                    Your data is ready for upload to the database.
                  </p>
                </>
              ) : (
                <>
                  <FaTimesCircle className="me-2" size={20} />
                  <strong>❌ Issues Detected</strong>
                  <p className="mb-0 mt-2 small">
                    Please fix the violations below before uploading.
                  </p>
                </>
              )}
            </Col>
            <Col md={4} className="text-end">
              <div style={{fontSize: '28px', fontWeight: 'bold', color: canUpload ? '#28a745' : '#dc3545'}}>
                {foreignKeyValidation.integrityScore || 0}%
              </div>
              <small>Referential Integrity</small>
            </Col>
          </Row>
        </Alert>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-primary mb-3">
              <Card.Body className="py-3">
                <FaDatabase size={24} className="mb-2 text-primary" />
                <div style={{fontSize: '20px', fontWeight: 'bold'}}>
                  {summary.totalRows || 0}
                </div>
                <small className="text-muted">Total Rows</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center border-success mb-3">
              <Card.Body className="py-3">
                <FaCheckCircle size={24} className="mb-2 text-success" />
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#28a745'}}>
                  {summary.validRows || 0}
                </div>
                <small className="text-muted">Valid Rows</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center border-danger mb-3">
              <Card.Body className="py-3">
                <FaTimesCircle size={24} className="mb-2 text-danger" />
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#dc3545'}}>
                  {summary.issuesFound || 0}
                </div>
                <small className="text-muted">Issues Found</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center border-warning mb-3">
              <Card.Body className="py-3">
                <FaLink size={24} className="mb-2 text-warning" />
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#ffc107'}}>
                  {summary.foreignKeysValidated || 0}
                </div>
                <small className="text-muted">Foreign Keys</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tab Navigation */}
        <div className="mb-4 border-bottom">
          <div className="btn-group w-100" role="group">
            {[
              { id: 'summary', label: '📊 Summary' },
              { id: 'foreign-keys', label: `🔗 Foreign Keys (${foreignKeyValidation.invalidRecords?.length || 0})` },
              { id: 'mapping', label: '🗺️ Mapping' },
              { id: 'preview', label: '👁️ Preview' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm py-2 ${
                  activeTab === tab.id ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                style={{ flex: 1 }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div>
            <h5 className="mb-3">
              <FaInfoCircle className="me-2 text-info" />
              Summary Information
            </h5>

            <Card className="mb-3">
              <Card.Header className="bg-light">
                <strong>File Information</strong>
              </Card.Header>
              <Card.Body>
                <Table size="sm" className="mb-0">
                  <tbody>
                    <tr>
                      <td><strong>File Name:</strong></td>
                      <td>{summary.fileName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>File Size:</strong></td>
                      <td>{summary.fileSize || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Target Table:</strong></td>
                      <td><code>{verificationData.tableName}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Total Columns:</strong></td>
                      <td>{summary.columnCount || 0}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Header className="bg-light">
                <strong>Data Quality Metrics</strong>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted">Completeness</small>
                  <ProgressBar
                    now={dataQuality.completeness || 0}
                    label={`${dataQuality.completeness || 0}%`}
                    variant={dataQuality.completeness >= 90 ? 'success' : 'warning'}
                    className="mb-2"
                  />
                </div>
                <div>
                  <small className="text-muted">Referential Integrity</small>
                  <ProgressBar
                    now={foreignKeyValidation.integrityScore || 0}
                    label={`${foreignKeyValidation.integrityScore || 0}%`}
                    variant={foreignKeyValidation.integrityScore === 100 ? 'success' : 'danger'}
                  />
                </div>
              </Card.Body>
            </Card>

            {warnings.length > 0 && (
              <Alert variant="warning">
                <strong>⚠️ Warnings:</strong>
                <ul className="mb-0 mt-2">
                  {warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {suggestions.length > 0 && (
              <Alert variant="info">
                <strong>💡 Suggestions:</strong>
                <ul className="mb-0 mt-2">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </div>
        )}

        {/* FOREIGN KEYS TAB */}
        {activeTab === 'foreign-keys' && (
          <div>
            <h5 className="mb-3">
              <FaLink className="me-2 text-danger" />
              Foreign Key Validation Details
            </h5>

            {foreignKeyValidation.invalidRecords?.length > 0 ? (
              <Accordion defaultActiveKey="0">
                {foreignKeyValidation.invalidRecords.map((record, idx) => (
                  <Accordion.Item eventKey={String(idx)} key={idx}>
                    <Accordion.Header>
                      <Badge bg="danger" className="me-2">
                        Row {record.rowNumber}
                      </Badge>
                      <span className="text-danger">
                        {record.column}: "{record.value}"
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Alert variant="danger">
                        <FaTimesCircle className="me-2" />
                        {record.issue}
                      </Alert>
                      <Table size="sm">
                        <tbody>
                          <tr>
                            <td><strong>Row Number:</strong></td>
                            <td>{record.rowNumber}</td>
                          </tr>
                          <tr>
                            <td><strong>Column:</strong></td>
                            <td><code>{record.column}</code></td>
                          </tr>
                          <tr>
                            <td><strong>Invalid Value:</strong></td>
                            <td><code>{record.value}</code></td>
                          </tr>
                          <tr>
                            <td><strong>References:</strong></td>
                            <td>
                              <code>{record.referencedTable}.{record.referencedColumn}</code>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Severity:</strong></td>
                            <td><Badge bg="danger">{record.severity}</Badge></td>
                          </tr>
                        </tbody>
                      </Table>
                      <Alert variant="info" className="mt-3">
                        <FaInfoCircle className="me-2" />
                        <small>
                          <strong>How to fix:</strong> Ensure the value "{record.value}" exists in 
                          <code className="ms-1 me-1">{record.referencedTable}.{record.referencedColumn}</code>
                          then re-upload your Excel file.
                        </small>
                      </Alert>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <Alert variant="success">
                <FaCheckCircle className="me-2" />
                <strong>✅ All Foreign Key Constraints Valid!</strong>
                <p className="mb-0 mt-2 small">All references exist in their respective tables.</p>
              </Alert>
            )}
          </div>
        )}

        {/* MAPPING TAB */}
        {activeTab === 'mapping' && (
          <div>
            <h5 className="mb-3">
              <FaColumns className="me-2 text-primary" />
              Column Mapping & Field Validation
            </h5>

            <ListGroup>
              {columnMapping.map((mapping, idx) => (
                <ListGroup.Item 
                  key={idx} 
                  className="d-flex justify-content-between align-items-start"
                  style={{
                    backgroundColor: mapping.isForeignKey ? '#f3e5f5' : 'transparent'
                  }}
                >
                  <div className="flex-grow-1">
                    <strong>{mapping.databaseField}</strong>
                    {mapping.isForeignKey && (
                      <div className="small text-primary">
                        <FaLink className="me-1" />
                        FK: {mapping.foreignKey?.referencedTable}.{mapping.foreignKey?.referencedColumn}
                      </div>
                    )}
                    <div className="text-muted small">
                      {mapping.dataType}
                      {mapping.required && (
                        <Badge bg="danger" className="ms-2">Required</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-end ms-3">
                    <div>
                      <Badge bg={mapping.matched ? 'success' : 'warning'}>
                        {mapping.matched ? '✓ Matched' : '⚠ Unmapped'}
                      </Badge>
                    </div>
                    <div className="small text-muted mt-1">
                      Excel: {mapping.excelColumn || 'Not found'}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div>
            <h5 className="mb-3">
              <FaEye className="me-2 text-info" />
              Data Preview (First {preview.length} Rows)
            </h5>

            {preview.length > 0 ? (
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <Table striped bordered hover size="sm">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th style={{width: '50px'}}>#</th>
                      {preview[0]?.map((header, idx) => (
                        <th key={idx} className="text-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="text-muted" style={{width: '50px'}}>
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="text-nowrap">
                            <small>
                              {cell ? String(cell).substring(0, 30) : (
                                <span className="text-muted fst-italic">empty</span>
                              )}
                              {cell && String(cell).length > 30 && '...'}
                            </small>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert variant="info">No preview data available</Alert>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant={canUpload ? confirmButtonVariant : 'danger'}
          onClick={onConfirm}
          disabled={isLoading || !canUpload}
          title={!canUpload ? 'Fix foreign key violations before uploading' : ''}
        >
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Processing...
            </>
          ) : canUpload ? (
            <>
              <FaCheckCircle className="me-2" />
              {confirmButtonText}
            </>
          ) : (
            <>
              <FaTimesCircle className="me-2" />
              Fix Issues First
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExcelVerificationModal;
