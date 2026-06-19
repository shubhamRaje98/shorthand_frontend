// src/components/super-admin/ExcelUpload.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
  ListGroup,
  ProgressBar,
  Badge,
  Modal,
  Table,
  Tabs,
  Tab,
  Accordion
} from 'react-bootstrap';
import {
  FaFileExcel,
  FaUpload,
  FaCheck,
  FaInfoCircle,
  FaDatabase,
  FaExclamationTriangle,
  FaTimes,
  FaEye,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaCopy,
  FaChartBar,
  FaColumns,
  FaKey,
  FaAsterisk,
  FaQuestionCircle
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import ExcelValidationModal from '../../utils/ExcelValidationModal'; // ✅ IMPORT VALIDATION MODAL

function ExcelUpload() {
  // Enhanced state management
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [fileValidation, setFileValidation] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [validationDetails, setValidationDetails] = useState(null);
  const [duplicateDetails, setDuplicateDetails] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // NEW STATE for table schema
  const [tableSchema, setTableSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);

  // ✅ NEW STATE for frontend Excel validation
  const [frontendValidationData, setFrontendValidationData] = useState(null);
  const [showFrontendValidationModal, setShowFrontendValidationModal] = useState(false);

  // Error codes mapping for better UX
  const ERROR_MESSAGES = {
    'NO_FILE': 'Please select an Excel file first',
    'FILE_TOO_LARGE': 'File size exceeds 100MB limit. Please choose a smaller file.',
    'INVALID_FILE_TYPE': 'Only Excel files (.xlsx, .xls) are supported',
    'NO_TARGET_TABLE': 'Please select a target database table',
    'TABLE_NOT_FOUND': 'Selected table does not exist in database',
    'NO_MATCHING_COLUMNS': 'Excel columns do not match database table structure',
    'VALIDATION_FAILED': 'Data validation failed. Please check your Excel data.',
    'DUPLICATE_ENTRIES': 'Duplicate entries found in database',
    'EXCEL_PARSING_ERROR': 'Unable to read Excel file. Please check the file format.',
    'DATABASE_ERROR': 'Database connection error. Please try again.',
    'PROCESSING_ERROR': 'An error occurred while processing your file'
  };

  // Fetch available tables with enhanced error handling
  const fetchAvailableTables = useCallback(async () => {
    try {
      setLoading(true);
      setProcessingStep('Loading available tables...');

      const response = await axios.get('http://localhost:3000/api/excel/available-tables');

      if (response.data.success) {
        setAvailableTables(response.data.tables);
        console.log(`[INFO] Loaded ${response.data.count} tables`);
      } else {
        setError('Failed to load tables: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      const errorMsg = error.response?.data?.message || 'Failed to load available tables. Please check server connection.';
      setError(errorMsg);
    } finally {
      setLoading(false);
      setProcessingStep('');
    }
  }, []);

  // NEW FUNCTION: Fetch table schema fields
  const fetchTableSchema = useCallback(async (tableName) => {
    if (!tableName) {
      setTableSchema(null);
      return;
    }

    try {
      setLoadingSchema(true);
      console.log(`[INFO] Fetching schema for table: ${tableName}`);

      const response = await axios.get(`http://localhost:3000/api/excel/table-schema/${tableName}`);

      if (response.data.success) {
        setTableSchema(response.data);
        console.log(`[INFO] Schema loaded for ${tableName}:`, response.data.summary);
      } else {
        console.warn(`[WARN] Failed to load schema for ${tableName}:`, response.data.error);
        setTableSchema(null);
      }
    } catch (error) {
      console.error('Error fetching table schema:', error);
      setTableSchema(null);
    } finally {
      setLoadingSchema(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableTables();
  }, [fetchAvailableTables]);

  // ✅ NEW: Frontend Excel Data Validation Function
  const validateExcelDataFrontend = (excelData, requiredFields) => {
    const errors = [];
    const fieldErrors = {};

    // Initialize field error counters
    requiredFields.forEach(field => {
      fieldErrors[field] = 0;
    });

    console.log('🔍 Starting frontend Excel validation on', excelData?.length || 0, 'rows');

    if (!excelData || excelData.length === 0) {
      return {
        errors: [],
        summary: {
          totalRows: 0,
          errorCount: 0,
          successCount: 0,
          fieldErrors: []
        },
        isValid: false
      };
    }

    // Get headers from first row
    const headers = excelData[0];
    const dataRows = excelData.slice(1);

    dataRows.forEach((row, index) => {
      const rowNumber = index + 2; // Excel row number (accounting for header)
      const missingFields = [];

      // Check if entire row is empty
      const isRowEmpty = row.every(cell =>
        cell === null || cell === undefined || cell === '' ||
        (typeof cell === 'string' && cell.trim() === '')
      );

      if (isRowEmpty) {
        return; // Skip completely empty rows
      }

      // Check each required field
      requiredFields.forEach(fieldName => {
        const columnIndex = headers.findIndex(h =>
          h && h.toString().toLowerCase() === fieldName.toLowerCase()
        );

        if (columnIndex !== -1) {
          const cellValue = row[columnIndex];

          // Check if cell is empty or contains only whitespace
          if (cellValue === null || cellValue === undefined || cellValue === '' ||
            (typeof cellValue === 'string' && cellValue.trim() === '')) {
            missingFields.push(fieldName);
            fieldErrors[fieldName]++;
          }
        } else {
          // Column not found in Excel
          missingFields.push(fieldName);
          fieldErrors[fieldName]++;
        }
      });

      // If row has missing required fields, add error
      if (missingFields.length > 0) {
        // Create an identifier from available data
        const identifier = row[0] || row[1] || 'N/A';
        const name = row[1] || row[2] || 'Unknown';

        errors.push({
          rowNumber,
          identifier: String(identifier).substring(0, 30), // Truncate long IDs
          name: String(name).substring(0, 50),
          missingFields
        });
      }
    });

    // Calculate summary
    const summary = {
      totalRows: dataRows.length,
      errorCount: errors.length,
      successCount: dataRows.length - errors.length,
      fieldErrors: Object.entries(fieldErrors)
        .filter(([_, count]) => count > 0)
        .map(([field, count]) => ({
          field: field,
          count,
          percentage: ((count / dataRows.length) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
    };

    console.log('✅ Frontend validation complete:', summary);

    return {
      errors,
      summary,
      isValid: errors.length === 0
    };
  };

  // Enhanced file validation
  const validateFile = (file) => {
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };

    // File type validation
    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !['xlsx', 'xls'].includes(fileExtension)) {
      validation.valid = false;
      validation.errors.push('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.');
    }

    // File size validation (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      validation.valid = false;
      validation.errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 100MB limit.`);
    }

    // File size warnings
    if (file.size > 50 * 1024 * 1024) { // 50MB warning
      validation.warnings.push('Large file detected. Upload may take longer.');
    }

    return validation;
  };

  // ✅ UPDATED: Enhanced file upload handler with frontend validation
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setExcelFile(null);
      setPreviewData([]);
      setFileValidation(null);
      setFrontendValidationData(null);
      return;
    }

    // Validate file
    const validation = validateFile(file);
    setFileValidation(validation);

    if (!validation.valid) {
      setError(validation.errors.join(' '));
      return;
    }

    setExcelFile(file);
    setError(null);
    setSuccess(null);
    setUploadSummary(null);
    setValidationDetails(null);
    setDuplicateDetails(null);
    setFrontendValidationData(null);
    setProcessingStep('Reading Excel file...');

    // Read Excel file for preview with better error handling
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setError('Excel file contains no sheets');
          return;
        }

        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];

        console.log('[DEBUG] Auto-Select Check: Sheet Name =', firstSheet);
        console.log('[DEBUG] Available Tables:', availableTables.map(t => typeof t === 'string' ? t : t.tableName));

        // AUTO-SELECT TABLE based on Sheet Name (User Request)
        if (availableTables && availableTables.length > 0) {
          const matchingTable = availableTables.find(t => {
            const tName = typeof t === 'string' ? t : t.tableName;
            // Normalize names: lowercase and remove all spaces
            const normalizedTName = tName.toLowerCase().replace(/\s+/g, '');
            const normalizedSheetName = firstSheet.toLowerCase().replace(/\s+/g, '');

            return normalizedTName === normalizedSheetName;
          });

          if (matchingTable) {
            const tableName = typeof matchingTable === 'string' ? matchingTable : matchingTable.tableName;
            console.log(`[INFO] Auto-selecting table '${tableName}' from sheet name '${firstSheet}'`);
            handleTableSelection(tableName);
          } else {
            console.log(`[INFO] No matching table found for sheet '${firstSheet}'`);
          }
        }

        // Enhanced preview with better data handling
        const excelData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          raw: false,
          blankrows: false // Skip completely blank rows
        });

        if (excelData.length === 0) {
          setError('Excel sheet is empty');
          return;
        }

        // Show preview of first 6 rows (header + 5 data rows)
        const previewRows = excelData.slice(0, 6);
        setPreviewData(previewRows);

        console.log(`[INFO] Excel preview loaded: ${excelData.length} total rows, showing ${previewRows.length}`);

        // ✅ NEW: Validate data if table schema is available
        if (tableSchema && tableSchema.categorized) {
          const requiredFields = tableSchema.categorized.required || [];
          const requiredFieldNames = requiredFields.map(f => f.name);

          if (requiredFieldNames.length > 0) {
            console.log('🔍 Validating Excel data for required fields:', requiredFieldNames);

            const frontendValidation = validateExcelDataFrontend(excelData, requiredFieldNames);
            setFrontendValidationData(frontendValidation);

            if (!frontendValidation.isValid) {
              setShowFrontendValidationModal(true);
              setError(
                `❌ Validation Failed: ${frontendValidation.errors.length} rows have missing required fields. ` +
                `Click "View Details" to see error report.`
              );
            } else {
              setSuccess(
                `✅ Validation passed! All ${frontendValidation.summary.totalRows} rows are valid and ready for upload.`
              );
            }
          }
        }

      } catch (error) {
        console.error('Error reading Excel file:', error);
        setError('Failed to read Excel file. Please ensure it\'s a valid Excel format.');
        setPreviewData([]);
      } finally {
        setProcessingStep('');
      }
    };

    reader.onerror = () => {
      setError('Failed to read the selected file');
      setProcessingStep('');
    };

    reader.readAsArrayBuffer(file);
  };

  // Enhanced table selection handler
  const handleTableSelection = (tableName) => {
    setSelectedTable(tableName);
    // Reset validation when changing tables
    setFrontendValidationData(null);
    setShowFrontendValidationModal(false);

    if (tableName) {
      fetchTableSchema(tableName);
    } else {
      setTableSchema(null);
    }
  };

  // ✅ UPDATED: Enhanced upload function with frontend validation check
  const uploadExcelData = async () => {
    if (!excelFile) {
      setError(ERROR_MESSAGES.NO_FILE);
      return;
    }

    if (!selectedTable) {
      setError(ERROR_MESSAGES.NO_TARGET_TABLE);
      return;
    }

    // ✅ NEW: Check frontend validation before upload
    if (frontendValidationData && !frontendValidationData.isValid) {
      setError('Please fix validation errors before uploading. Click "View Details" to see error report.');
      setShowFrontendValidationModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setUploadProgress(0);
      setProcessingStep('Preparing upload...');
      setValidationDetails(null);
      setDuplicateDetails(null);

      const formData = new FormData();
      formData.append('excelFile', excelFile);
      formData.append('targetTable', selectedTable);

      setProcessingStep('Uploading and processing data...');
      setUploadProgress(25);

      const response = await axios.post(
        'http://localhost:3000/api/excel/upload-excel-data',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      setUploadProgress(75);
      setProcessingStep('Finalizing...');

      if (response.data.success) {
        setUploadProgress(100);
        const summary = response.data.summary;
        setUploadSummary(summary);

        let successMessage = `✅ Excel data uploaded successfully! ${summary.insertedRecords} records inserted into "${summary.targetTable}" table.`;

        // Add warnings about empty rows or incomplete data
        if (summary.emptyRowsSkipped > 0) {
          successMessage += ` (${summary.emptyRowsSkipped} empty rows were skipped)`;
        }
        if (summary.incompleteDataRows > 0) {
          successMessage += ` (${summary.incompleteDataRows} rows had incomplete data but were processed)`;
        }

        setSuccess(successMessage);

        // Reset form after successful upload
        setTimeout(() => {
          setExcelFile(null);
          setSelectedTable('');
          setPreviewData([]);
          setFileValidation(null);
          setUploadProgress(0);
          setTableSchema(null);
          setFrontendValidationData(null);
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = '';
        }, 2000);

      } else {
        setError(ERROR_MESSAGES[response.data.code] || `Upload failed: ${response.data.error}`);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadProgress(0);

      const errorData = error.response?.data;
      const errorCode = errorData?.code;

      // Handle specific error types with detailed information
      if (errorCode === 'VALIDATION_FAILED' && errorData.validationDetails) {
        setValidationDetails(errorData.validationDetails);
        setError(`❌ Data validation failed: ${errorData.validationDetails.totalErrors} errors found in your Excel data`);
      } else if (errorCode === 'DUPLICATE_ENTRIES' && errorData.duplicateDetails) {
        setDuplicateDetails(errorData.duplicateDetails);
        const dbDuplicates = errorData.duplicateDetails.databaseDuplicates.length;
        const internalDuplicates = errorData.duplicateDetails.internalDuplicates.length;
        setError(`❌ Duplicate entries found: ${dbDuplicates} database conflicts, ${internalDuplicates} internal duplicates`);
      } else {
        let errorMessage = ERROR_MESSAGES[errorCode] || 'Upload failed';
        if (errorData?.message) {
          errorMessage = `❌ ${errorData.message}`;
        }
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setProcessingStep('');
    }
  };

  // Auto-clear alerts with enhanced timing
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        if (success) setSuccess(null);
        if (error) setError(null);
      }, success ? 10000 : 8000); // Success messages stay longer

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Enhanced table display with more info
  const renderTableOption = (table) => {
    if (typeof table === 'string') {
      return table;
    }
    return `${table.tableName}${table.tableComment ? ` (${table.tableComment})` : ''}`;
  };

  // NEW COMPONENT: Table Schema Display
  const TableSchemaDisplay = () => {
    if (!tableSchema || loadingSchema) {
      return (
        <Card className="mb-4 shadow">
          <Card.Header className="bg-secondary text-white">
            <FaColumns className="me-2" />
            Table Fields Information
          </Card.Header>
          <Card.Body className="text-center py-4">
            {loadingSchema ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Loading table fields...
              </>
            ) : (
              <div className="text-muted">
                <FaInfoCircle className="me-2" />
                Select a table to see its required fields
              </div>
            )}
          </Card.Body>
        </Card>
      );
    }

    const { categorized, summary } = tableSchema;

    return (
      <Card className="mb-4 shadow">
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <div>
            <FaColumns className="me-2" />
            Table Fields: {tableSchema.tableName}
          </div>
          <div>
            <Badge bg="light" text="dark" className="me-2">
              {summary.totalFields} total
            </Badge>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => setShowSchemaModal(true)}
            >
              <FaEye className="me-1" /> View All
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Required Fields */}
            <Col md={6}>
              <h6 className="text-danger">
                <FaAsterisk className="me-2" />
                Required Fields ({categorized.required.length})
              </h6>
              {categorized.required.length > 0 ? (
                <ListGroup variant="flush">
                  {categorized.required.slice(0, 5).map((field, index) => (
                    <ListGroup.Item key={index} className="py-1 px-0 border-0">
                      <Badge bg="danger" className="me-2">
                        <FaAsterisk className="me-1" style={{ fontSize: '8px' }} />
                        Required
                      </Badge>
                      <code>{field.name}</code>
                      <small className="text-muted ms-2">({field.dataType})</small>
                      {field.maxLength && (
                        <small className="text-muted"> max: {field.maxLength}</small>
                      )}
                    </ListGroup.Item>
                  ))}
                  {categorized.required.length > 5 && (
                    <ListGroup.Item className="py-1 px-0 border-0">
                      <small className="text-muted">
                        +{categorized.required.length - 5} more required fields...
                      </small>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              ) : (
                <Alert variant="success" className="py-2 mb-0">
                  <small>No required fields found</small>
                </Alert>
              )}
            </Col>

            {/* Optional Fields */}
            <Col md={6}>
              <h6 className="text-primary">
                <FaQuestionCircle className="me-2" />
                Optional Fields ({categorized.optional.length})
              </h6>
              {categorized.optional.length > 0 ? (
                <ListGroup variant="flush">
                  {categorized.optional.slice(0, 5).map((field, index) => (
                    <ListGroup.Item key={index} className="py-1 px-0 border-0">
                      <Badge bg="primary" className="me-2">Optional</Badge>
                      <code>{field.name}</code>
                      <small className="text-muted ms-2">({field.dataType})</small>
                      {field.hasDefault && (
                        <Badge bg="secondary" className="ms-2" style={{ fontSize: '10px' }}>
                          Default
                        </Badge>
                      )}
                    </ListGroup.Item>
                  ))}
                  {categorized.optional.length > 5 && (
                    <ListGroup.Item className="py-1 px-0 border-0">
                      <small className="text-muted">
                        +{categorized.optional.length - 5} more optional fields...
                      </small>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              ) : (
                <Alert variant="info" className="py-2 mb-0">
                  <small>No optional fields found</small>
                </Alert>
              )}
            </Col>
          </Row>

          {/* Summary Statistics */}
          <div className="mt-3 pt-3 border-top">
            <Row className="text-center">
              <Col>
                <div className="text-danger">
                  <strong>{summary.requiredFields}</strong>
                  <div><small>Required</small></div>
                </div>
              </Col>
              <Col>
                <div className="text-primary">
                  <strong>{summary.optionalFields}</strong>
                  <div><small>Optional</small></div>
                </div>
              </Col>
              <Col>
                <div className="text-secondary">
                  <strong>{summary.systemFields}</strong>
                  <div><small>System</small></div>
                </div>
              </Col>
              <Col>
                <div className="text-success">
                  <strong>{summary.totalFields}</strong>
                  <div><small>Total</small></div>
                </div>
              </Col>
            </Row>
          </div>

          <Alert variant="info" className="mt-3 mb-0">
            <FaInfoCircle className="me-2" />
            <strong>Excel Tip:</strong> Your Excel file should include columns with these exact field names.
            Required fields must have data in every row.
          </Alert>
        </Card.Body>
      </Card>
    );
  };

  // NEW COMPONENT: Complete Schema Modal
  const TableSchemaModal = () => (
    <Modal show={showSchemaModal} onHide={() => setShowSchemaModal(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaColumns className="me-2" />
          Complete Table Schema: {tableSchema?.tableName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {tableSchema && (
          <Tabs defaultActiveKey="all" className="mb-3">
            <Tab eventKey="all" title={`All Fields (${tableSchema.summary.totalFields})`}>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Default</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {tableSchema.fields.map((field, index) => (
                    <tr key={index}>
                      <td>
                        <code>{field.name}</code>
                        {field.isPrimary && (
                          <Badge bg="warning" className="ms-2" style={{ fontSize: '10px' }}>
                            <FaKey className="me-1" />PK
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Badge bg="secondary">
                          {field.dataType}
                          {field.maxLength && ` (${field.maxLength})`}
                        </Badge>
                      </td>
                      <td>
                        {field.required ? (
                          <Badge bg="danger">
                            <FaAsterisk className="me-1" />Required
                          </Badge>
                        ) : (
                          <Badge bg="success">Optional</Badge>
                        )}
                      </td>
                      <td>
                        {field.hasDefault ? (
                          <Badge bg="info">Yes</Badge>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {field.references &&
                            `References ${field.references.table}(${field.references.column})`
                          }
                          {field.isAutoIncrement && ' Auto-increment'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="required" title={`Required (${tableSchema.categorized.required.length})`}>
              <Alert variant="danger">
                <strong>These fields are mandatory</strong> and must be included in your Excel file with valid data.
              </Alert>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th>Type</th>
                    <th>Max Length</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tableSchema.categorized.required.map((field, index) => (
                    <tr key={index}>
                      <td><code>{field.name}</code></td>
                      <td><Badge bg="danger">{field.dataType}</Badge></td>
                      <td>{field.maxLength || 'N/A'}</td>
                      <td>
                        <small>
                          {field.references ?
                            `Must reference ${field.references.table}.${field.references.column}` :
                            'Required field'
                          }
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="optional" title={`Optional (${tableSchema.categorized.optional.length})`}>
              <Alert variant="info">
                <strong>These fields are optional</strong> and can be left empty in your Excel file.
              </Alert>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th>Type</th>
                    <th>Has Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tableSchema.categorized.optional.map((field, index) => (
                    <tr key={index}>
                      <td><code>{field.name}</code></td>
                      <td><Badge bg="primary">{field.dataType}</Badge></td>
                      <td>
                        {field.hasDefault ? (
                          <Badge bg="success">Yes</Badge>
                        ) : (
                          <Badge bg="secondary">No</Badge>
                        )}
                      </td>
                      <td>
                        <small>
                          {field.references ?
                            `Can reference ${field.references.table}.${field.references.column}` :
                            'Optional field'
                          }
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowSchemaModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Component to display validation errors in detail
  const ValidationErrorsModal = () => (
    <Modal show={showValidationModal} onHide={() => setShowValidationModal(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          Data Validation Issues Found
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {validationDetails && (
          <Tabs defaultActiveKey="errors" className="mb-3">
            {/* Validation Errors Tab */}
            <Tab eventKey="errors" title={`Errors (${validationDetails.totalErrors})`}>
              <div className="mb-3">
                <Alert variant="danger">
                  <strong>{validationDetails.totalErrors} validation errors</strong> must be fixed before upload can proceed.
                </Alert>
              </div>
              {validationDetails.errors.map((error, index) => (
                <Card key={index} className="mb-2">
                  <Card.Header className="bg-danger text-white">
                    <strong>Row {error.rowNumber}</strong>
                    {error.missingFields.length > 0 && (
                      <Badge bg="light" text="dark" className="ms-2">
                        {error.missingFields.length} missing fields
                      </Badge>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {error.errors.map((err, errIndex) => (
                        <li key={errIndex}>{err}</li>
                      ))}
                    </ul>
                    {error.missingFields.length > 0 && (
                      <div className="mt-2">
                        <small><strong>Missing fields:</strong> {error.missingFields.join(', ')}</small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </Tab>

            {/* Missing Data Tab */}
            <Tab eventKey="missing" title={`Missing Data (${validationDetails.missingData.length})`}>
              <div className="mb-3">
                <Alert variant="warning">
                  <strong>{validationDetails.missingData.length} rows</strong> have incomplete data but can still be processed.
                </Alert>
              </div>
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Missing Fields</th>
                    <th>Completeness</th>
                  </tr>
                </thead>
                <tbody>
                  {validationDetails.missingData.map((missing, index) => (
                    <tr key={index}>
                      <td><strong>{missing.rowNumber}</strong></td>
                      <td>
                        <div className="text-wrap" style={{ maxWidth: '300px' }}>
                          {missing.missingFields.join(', ')}
                        </div>
                      </td>
                      <td>
                        <ProgressBar
                          now={missing.completenessPercentage}
                          label={`${missing.completenessPercentage}%`}
                          variant={missing.completenessPercentage > 70 ? 'success' : 'warning'}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* Empty Rows Tab */}
            {validationDetails.emptyRows && validationDetails.emptyRows.length > 0 && (
              <Tab eventKey="empty" title={`Empty Rows (${validationDetails.emptyRows.length})`}>
                <Alert variant="info">
                  <strong>{validationDetails.emptyRows.length} completely empty rows</strong> were found and will be skipped.
                </Alert>
                <ListGroup>
                  {validationDetails.emptyRows.map((empty, index) => (
                    <ListGroup.Item key={index}>
                      <FaInfoCircle className="me-2" />
                      {empty.message}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Tab>
            )}

            {/* Summary Tab */}
            <Tab eventKey="summary" title="Summary">
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header><strong>Validation Summary</strong></Card.Header>
                    <Card.Body>
                      <Table size="sm">
                        <tbody>
                          <tr>
                            <td>Total Rows:</td>
                            <td><Badge bg="primary">{validationDetails.summary.totalRows}</Badge></td>
                          </tr>
                          <tr>
                            <td>Valid Rows:</td>
                            <td><Badge bg="success">{validationDetails.summary.validRows}</Badge></td>
                          </tr>
                          <tr>
                            <td>Error Rows:</td>
                            <td><Badge bg="danger">{validationDetails.summary.errorRows}</Badge></td>
                          </tr>
                          <tr>
                            <td>Empty Rows:</td>
                            <td><Badge bg="secondary">{validationDetails.summary.emptyRows}</Badge></td>
                          </tr>
                          <tr>
                            <td>Incomplete Rows:</td>
                            <td><Badge bg="warning">{validationDetails.summary.incompleteRows}</Badge></td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header><strong>Data Quality</strong></Card.Header>
                    <Card.Body>
                      <div className="mb-2">
                        <small>Success Rate:</small>
                        <ProgressBar
                          now={(validationDetails.summary.validRows / validationDetails.summary.totalRows) * 100}
                          label={`${Math.round((validationDetails.summary.validRows / validationDetails.summary.totalRows) * 100)}%`}
                          variant="success"
                        />
                      </div>
                      <div>
                        <small>Error Rate:</small>
                        <ProgressBar
                          now={(validationDetails.summary.errorRows / validationDetails.summary.totalRows) * 100}
                          label={`${Math.round((validationDetails.summary.errorRows / validationDetails.summary.totalRows) * 100)}%`}
                          variant="danger"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        )}

        {duplicateDetails && (
          <div className="mt-4">
            <h5><FaCopy className="me-2" />Duplicate Entry Details</h5>

            {duplicateDetails.databaseDuplicates.length > 0 && (
              <Card className="mb-3">
                <Card.Header className="bg-danger text-white">
                  Database Conflicts ({duplicateDetails.databaseDuplicates.length})
                </Card.Header>
                <Card.Body>
                  {duplicateDetails.databaseDuplicates.map((dup, index) => (
                    <div key={index} className="mb-2">
                      <strong>Column "{dup.column}":</strong> {dup.count} conflicts found
                      <div><small>Values: {dup.duplicateValues.join(', ')}</small></div>
                      <div><small>Affected rows: {dup.affectedRows.join(', ')}</small></div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}

            {duplicateDetails.internalDuplicates.length > 0 && (
              <Card>
                <Card.Header className="bg-warning text-dark">
                  Internal Duplicates ({duplicateDetails.internalDuplicates.length})
                </Card.Header>
                <Card.Body>
                  {duplicateDetails.internalDuplicates.map((dup, index) => (
                    <div key={index} className="mb-2">
                      <strong>Column "{dup.column}":</strong> Value "{dup.value}" appears {dup.count} times
                      <div><small>In rows: {dup.rowNumbers.join(', ')}</small></div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowValidationModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">
        <FaFileExcel className="me-2 text-success" />
        Excel Data Upload
        {availableTables.length > 0 && (
          <Badge bg="info" className="ms-2">{availableTables.length} tables available</Badge>
        )}
      </h2>

      {/* Enhanced Error Display with Validation Details Button */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center justify-content-between shadow-sm">
          <div className="d-flex align-items-center">
            <FaTimesCircle className="me-2 flex-shrink-0" />
            <div>{error}</div>
          </div>
          {(validationDetails || duplicateDetails || frontendValidationData) && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                if (frontendValidationData && !frontendValidationData.isValid) {
                  setShowFrontendValidationModal(true);
                } else {
                  setShowValidationModal(true);
                }
              }}
              className="ms-2 flex-shrink-0"
            >
              <FaEye className="me-1" /> View Details
            </Button>
          )}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="d-flex align-items-center shadow-sm">
          <FaCheckCircle className="me-2 flex-shrink-0" />
          <div className="flex-grow-1">{success}</div>
          {uploadSummary && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setShowDetailsModal(true)}
              className="ms-2"
            >
              <FaEye className="me-1" /> View Details
            </Button>
          )}
        </Alert>
      )}

      {/* Processing Status */}
      {processingStep && (
        <Alert variant="info" className="d-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          {processingStep}
        </Alert>
      )}

      {/* Upload Progress */}
      {loading && uploadProgress > 0 && (
        <ProgressBar
          now={uploadProgress}
          label={`${uploadProgress}%`}
          className="mb-3"
          striped
          animated
        />
      )}

      <Row>
        <Col lg={8}>
          {/* Main Upload Card */}
          <Card className="mb-4 shadow">
            <Card.Header className="bg-gradient" style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', color: 'black' }}>
              <FaCloudUploadAlt className="me-2" />
              Upload Excel File to Database
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label><strong>Select Excel File</strong></Form.Label>
                <Form.Control
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="form-control-lg"
                />
                <Form.Text className="text-muted">
                  Supported formats: .xlsx, .xls | Maximum size: 100MB
                </Form.Text>
              </Form.Group>

              {/* File Validation Results */}
              {fileValidation && (
                <div className="mb-3">
                  {fileValidation.errors.length > 0 && (
                    <Alert variant="danger" className="py-2">
                      <FaTimesCircle className="me-2" />
                      <strong>Validation Failed:</strong>
                      <ul className="mb-0 mt-1">
                        {fileValidation.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </Alert>
                  )}

                  {fileValidation.warnings.length > 0 && (
                    <Alert variant="warning" className="py-2">
                      <FaExclamationTriangle className="me-2" />
                      <strong>Warnings:</strong>
                      <ul className="mb-0 mt-1">
                        {fileValidation.warnings.map((warn, idx) => (
                          <li key={idx}>{warn}</li>
                        ))}
                      </ul>
                    </Alert>
                  )}
                </div>
              )}

              {/* File Info Display */}
              {excelFile && fileValidation?.valid && (
                <Alert variant="success" className="py-2">
                  <FaCheckCircle className="me-2" />
                  <strong>File Ready:</strong> {excelFile.name} ({(excelFile.size / 1024 / 1024).toFixed(2)} MB)
                </Alert>
              )}

              <Form.Group className="mb-4">
                <Form.Label><strong>Select Target Database Table</strong></Form.Label>
                <Form.Select
                  value={selectedTable}
                  onChange={(e) => handleTableSelection(e.target.value)}
                  disabled={loading || availableTables.length === 0}
                  className="form-select-lg"
                >
                  <option value="">Choose database table...</option>
                  {availableTables.map((table, index) => (
                    <option
                      key={index}
                      value={typeof table === 'string' ? table : table.tableName}
                    >
                      {renderTableOption(table)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Select the destination table for your Excel data
                </Form.Text>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  onClick={uploadExcelData}
                  disabled={loading || !excelFile || !selectedTable || !fileValidation?.valid || (frontendValidationData && !frontendValidationData.isValid)}
                  size="lg"
                  className="fw-bold shadow"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaUpload className="me-2" />
                      Upload to Database
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* NEW: Table Schema Display */}
          <TableSchemaDisplay />

          {/* Enhanced Preview Section */}
          {previewData.length > 0 && (
            <Card className="mb-4 shadow">
              <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
                <div>
                  <FaEye className="me-2" />
                  Data Preview
                </div>
                <Badge bg="light" text="dark">
                  {previewData.length - 1} rows shown
                </Badge>
              </Card.Header>
              <Card.Body className="p-0">
                <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                  <Table striped bordered hover size="sm" className="mb-0">
                    <thead className="table-dark sticky-top">
                      <tr>
                        <th style={{ width: '50px' }}>#</th>
                        {previewData[0]?.map((header, index) => (
                          <th key={index} className="text-nowrap">
                            {header || `Column ${index + 1}`}
                            {/* Show field requirements based on schema */}
                            {tableSchema && tableSchema.categorized.required.some(field => field.name === header) && (
                              <FaAsterisk className="text-danger ms-1" style={{ fontSize: '8px' }} title="Required field" />
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="text-muted">{rowIndex + 1}</td>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="text-nowrap">
                              {cell ? (
                                String(cell).length > 50 ?
                                  `${String(cell).substring(0, 50)}...` :
                                  String(cell)
                              ) : (
                                <span className="text-muted fst-italic">empty</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="p-2 bg-light border-top">
                  <small className="text-muted">
                    <FaInfoCircle className="me-1" />
                    Preview shows first 5 rows. All data will be processed during upload.
                    {tableSchema && (
                      <> Fields marked with <FaAsterisk className="text-danger" style={{ fontSize: '8px' }} /> are required.</>
                    )}
                  </small>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={4}>
          {/* Enhanced Instructions */}
          <Card className="shadow sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-warning text-dark">
              <FaInfoCircle className="me-2" />
              Upload Process
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-start">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '30px', height: '30px', fontSize: '14px' }}>1</div>
                  <div>
                    <strong>File Selection</strong><br />
                    <small className="text-muted">Choose Excel file (.xlsx/.xls, max 10MB)</small>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-start">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '30px', height: '30px', fontSize: '14px' }}>2</div>
                  <div>
                    <strong>Table Selection</strong><br />
                    <small className="text-muted">Choose table and review required fields</small>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-start">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '30px', height: '30px', fontSize: '14px' }}>3</div>
                  <div>
                    <strong>Field Mapping</strong><br />
                    <small className="text-muted">Ensure Excel columns match table fields</small>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-start">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '30px', height: '30px', fontSize: '14px' }}>4</div>
                  <div>
                    <strong>Data Processing</strong><br />
                    <small className="text-muted">Duplicate check and type validation</small>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-start">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '30px', height: '30px', fontSize: '14px' }}>5</div>
                  <div>
                    <strong>Database Insert</strong><br />
                    <small className="text-muted">Bulk insert with progress tracking</small>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* System Status */}
          <Card className="mt-3 shadow">
            <Card.Header className="bg-secondary text-white">
              <FaDatabase className="me-2" />
              System Status
            </Card.Header>
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small>Database Connection</small>
                <Badge bg={availableTables.length > 0 ? 'success' : 'danger'}>
                  {availableTables.length > 0 ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small>Available Tables</small>
                <Badge bg="info">{availableTables.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small>Selected Table</small>
                <Badge bg={selectedTable ? 'success' : 'secondary'}>
                  {selectedTable || 'None'}
                </Badge>
              </div>
              {tableSchema && (
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <small>Required Fields</small>
                  <Badge bg="danger">{tableSchema.summary.requiredFields}</Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ NEW: Frontend Validation Modal using ExcelValidationModal component */}
      <ExcelValidationModal
        show={showFrontendValidationModal}
        onHide={() => setShowFrontendValidationModal(false)}
        errors={frontendValidationData?.errors || []}
        summary={frontendValidationData?.summary || {}}
        title="Excel Data Validation Report"
      />

      {/* Backend Validation Details Modal */}
      <ValidationErrorsModal />

      {/* NEW: Complete Table Schema Modal */}
      <TableSchemaModal />

      {/* Upload Summary Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheckCircle className="text-success me-2" />
            Upload Summary
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadSummary && (
            <Row>
              <Col md={6}>
                <h6>File Information</h6>
                <Table size="sm">
                  <tbody>
                    <tr>
                      <td><strong>File Name:</strong></td>
                      <td>{uploadSummary.fileName}</td>
                    </tr>
                    <tr>
                      <td><strong>Target Table:</strong></td>
                      <td>{uploadSummary.targetTable}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6>Processing Results</h6>
                <Table size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Excel Rows:</strong></td>
                      <td>{uploadSummary.totalExcelRows}</td>
                    </tr>
                    <tr>
                      <td><strong>Processed:</strong></td>
                      <td>{uploadSummary.processedRows}</td>
                    </tr>
                    <tr>
                      <td><strong>Validated:</strong></td>
                      <td>{uploadSummary.validatedRows}</td>
                    </tr>
                    <tr className="table-success">
                      <td><strong>Inserted:</strong></td>
                      <td><strong>{uploadSummary.insertedRecords}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={12}>
                <h6>Column Mapping</h6>
                <div className="d-flex flex-wrap gap-1">
                  <Badge bg="success">Matched: {uploadSummary.matchedColumns}</Badge>
                  {uploadSummary.skippedColumns?.length > 0 && (
                    <Badge bg="warning">Skipped: {uploadSummary.skippedColumns.join(', ')}</Badge>
                  )}
                </div>
                {uploadSummary.emptyRowsSkipped > 0 && (
                  <div className="mt-2">
                    <Badge bg="secondary">Empty rows skipped: {uploadSummary.emptyRowsSkipped}</Badge>
                  </div>
                )}
                {uploadSummary.incompleteDataRows > 0 && (
                  <div className="mt-2">
                    <Badge bg="warning">Incomplete data rows: {uploadSummary.incompleteDataRows}</Badge>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ExcelUpload;
