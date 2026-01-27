// src/components/super-admin/department-setup/DepartmentForms.js
import React, { useState, useEffect } from 'react';
import {
  Accordion, Row, Col, Form, Button, Spinner, Card, Alert, Badge, Container, ListGroup, Table, Modal
} from 'react-bootstrap';
import { 
  FaUniversity, FaCogs, FaArrowRight, FaDatabase, FaCheckCircle, FaPlus, FaTrash, 
  FaDownload, FaSync, FaInfoCircle, FaExclamationTriangle  
} from 'react-icons/fa';



import axios from 'axios';
import * as XLSX from 'xlsx';
import ExcelValidationModal from '../../../utils/ExcelValidationModal';

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

  // Batch Excel Upload State
  const [batchFileData, setBatchFileData] = useState({
    file: null,
    fileName: '',
    uploading: false,
    uploadResult: null,
    manualDepartmentId: ''
  });

  // ✅ ADD THESE NEW STATES after line 54
const [showDuplicateModal, setShowDuplicateModal] = useState(false);
const [duplicateData, setDuplicateData] = useState(null);
const [duplicateType, setDuplicateType] = useState('');
const [checkingDuplicates, setCheckingDuplicates] = useState(false);


  const [batchValidationData, setBatchValidationData] = useState(null);
  const [showBatchValidationModal, setShowBatchValidationModal] = useState(false);

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

  // Controller Excel Upload State
  const [controllerFileData, setControllerFileData] = useState({
    file: null,
    fileName: '',
    uploading: false,
    uploadResult: null
  });

  const [controllerValidationData, setControllerValidationData] = useState(null);
  const [showControllerValidationModal, setShowControllerValidationModal] = useState(false);
  
const [dbValidationData, setDbValidationData] = useState(null);
const [showDbValidationModal, setShowDbValidationModal] = useState(false);

  // Required fields for batch validation
  const requiredBatchFields = {
    'departmentId': 'Department ID',
    'batchNo': 'Batch Number',
    'batchdate': 'Batch Date',
    'reporting_time': 'Reporting Time',
    'start_time': 'Start Time',
    'end_time': 'End Time'
  };

  // Required fields for controller validation
  const requiredControllerFields = {
    'controller_name': 'Controller Name',
    'controller_contact': 'Contact Number',
    'controller_email': 'Email Address',
    'controller_pass': 'Password',
    'center': 'Center Name'
  };

  // Batch Validation Function
  const validateBatchExcelData = (excelData) => {
    const errors = [];
    const fieldErrors = {};
    
    Object.keys(requiredBatchFields).forEach(field => {
      fieldErrors[field] = 0;
    });

    console.log('🔍 Starting batch Excel validation on', excelData?.length || 0, 'rows');

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

    excelData.forEach((row, index) => {
      const rowNumber = index + 2;
      const missingFields = [];
      
      Object.keys(requiredBatchFields).forEach(field => {
        const value = row[field];
        
        if (value === null || value === undefined || value === '' || 
            (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(requiredBatchFields[field]);
          fieldErrors[field]++;
        }
      });
      
      if (missingFields.length > 0) {
        errors.push({
          rowNumber,
          identifier: row.batchNo || 'N/A',
          name: row.batchdate || 'Unknown',
          missingFields
        });
      }
    });
    
    const summary = {
      totalRows: excelData.length,
      errorCount: errors.length,
      successCount: excelData.length - errors.length,
      fieldErrors: Object.entries(fieldErrors)
        .filter(([_, count]) => count > 0)
        .map(([field, count]) => ({
          field: requiredBatchFields[field],
          count,
          percentage: ((count / excelData.length) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
    };
    
    console.log('✅ Batch validation complete:', summary);
    
    return { errors, summary, isValid: errors.length === 0 };
  };

  // Controller Validation Function
  const validateControllerExcelData = (excelData) => {
    const errors = [];
    const fieldErrors = {};
    
    Object.keys(requiredControllerFields).forEach(field => {
      fieldErrors[field] = 0;
    });

    console.log('🔍 Starting controller Excel validation on', excelData?.length || 0, 'rows');

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

    excelData.forEach((row, index) => {
      const rowNumber = index + 2;
      const missingFields = [];
      
      Object.keys(requiredControllerFields).forEach(field => {
        const value = row[field];
        
        if (value === null || value === undefined || value === '' || 
            (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(requiredControllerFields[field]);
          fieldErrors[field]++;
        }
      });
      
      if (missingFields.length > 0) {
        errors.push({
          rowNumber,
          identifier: row.controller_name || 'N/A',
          name: row.center || 'Unknown',
          missingFields
        });
      }
    });
    
    const summary = {
      totalRows: excelData.length,
      errorCount: errors.length,
      successCount: excelData.length - errors.length,
      fieldErrors: Object.entries(fieldErrors)
        .filter(([_, count]) => count > 0)
        .map(([field, count]) => ({
          field: requiredControllerFields[field],
          count,
          percentage: ((count / excelData.length) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
    };
    
    console.log('✅ Controller validation complete:', summary);
    
    return { errors, summary, isValid: errors.length === 0 };
  };

  // Validate Controller Database References (NEW)
const validateControllerDatabaseReferences = async (excelData) => {
  try {
    console.log('Validating database references for controllers...');
    
    const response = await axios.post('http://checking.shorthandonlineexam.in/api/new-department/validate-controller-references', {
      controllers: excelData.map(row => ({
        departmentId: row.departmentId,
        batchNo: row.batchNo,
        center: row.center
      }))
    }, { timeout: 15000 });

    return {
      isValid: response.data.isValid,
      errors: response.data.errors || [],
      summary: response.data.summary || {}
    };
  } catch (error) {
    console.error('Error validating database references:', error);
    return {
      isValid: false,
      errors: [],
      summary: { message: 'Error connecting to server for validation' }
    };
  }
};


// Check Batch Duplicates
const checkBatchDuplicates = async (excelData) => {
  try {
    console.log('🔍 Checking batch duplicates...');
    
    // Internal duplicates
    const internalDuplicates = [];
    const seen = new Map();
    
    excelData.forEach((row, index) => {
      const key = `${row.departmentId}_${row.batchNo}`;
      if (seen.has(key)) {
        internalDuplicates.push({
          rowNumber: index + 2,
          departmentId: row.departmentId,
          batchNo: row.batchNo,
          batchdate: row.batchdate
        });
      } else {
        seen.set(key, index + 2);
      }
    });

    console.log('📊 Internal:', internalDuplicates.length);

    // Database duplicates
    const response = await axios.post(
      'http://checking.shorthandonlineexam.in/api/new-department/check-batch-duplicates',
      { batches: excelData.map(row => ({ departmentId: row.departmentId, batchNo: row.batchNo })) },
      { timeout: 10000 }
    );

    const databaseDuplicates = response.data.duplicates || [];

    return {
      hasErrors: internalDuplicates.length > 0 || databaseDuplicates.length > 0,
      internalDuplicates,
      databaseDuplicates,
      totalDuplicates: internalDuplicates.length + databaseDuplicates.length
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return { hasErrors: false, internalDuplicates: [], databaseDuplicates: [], totalDuplicates: 0 };
  }
};

// Check Controller Duplicates
const checkControllerDuplicates = async (excelData) => {
  try {
    console.log('🔍 Checking controller duplicates...');
    
    // Internal duplicates
    const internalDuplicates = [];
    const seen = new Map();
    
    excelData.forEach((row, index) => {
      const key = row.controller_email?.toLowerCase().trim();
      if (key && seen.has(key)) {
        internalDuplicates.push({
          rowNumber: index + 2,
          controller_name: row.controller_name,
          controller_email: row.controller_email
        });
      } else if (key) {
        seen.set(key, index + 2);
      }
    });

    console.log('📊 Internal:', internalDuplicates.length);

    // Database duplicates
    const response = await axios.post(
      'http://checking.shorthandonlineexam.in/api/new-department/check-controller-duplicates',
      { controllers: excelData.map(row => ({ controller_email: row.controller_email })) },
      { timeout: 10000 }
    );

    const databaseDuplicates = response.data.duplicates || [];

    return {
      hasErrors: internalDuplicates.length > 0 || databaseDuplicates.length > 0,
      internalDuplicates,
      databaseDuplicates,
      totalDuplicates: internalDuplicates.length + databaseDuplicates.length
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return { hasErrors: false, internalDuplicates: [], databaseDuplicates: [], totalDuplicates: 0 };
  }
};


  // Persist form data
  useEffect(() => {
    persistFormData({ formData, existingDeptData, centerControllerData });
  }, [formData, existingDeptData, centerControllerData]);

  // Fetch batches when department is selected
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
      await axios.post('http://checking.shorthandonlineexam.in/api/new-department/departments', formData);
      const newDepartmentId = formData.departmentId;
      const newDepartmentName = formData.departmentName;
      setFormData({
        departmentId: '',
        departmentName: '',
        departmentPassword: '',
        logo: '',
        departmentStatus: true
      });
      setLogoFile(null);
      clearPersistedData();
      await fetchDepartments();
      setMessage(`✅ Department "${newDepartmentName}" created successfully!`);
      setActiveAccordion("existing");
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

const handleBatchFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];

  if (!allowedTypes.includes(file.type)) {
    setMessage('Please select a valid Excel file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setMessage('File size must be less than 5MB');
    return;
  }

  setCheckingDuplicates(true);
  setMessage('🔍 Validating...');

  try {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('📊 Loaded:', jsonData.length);

        // Step 1: Validation
        const validation = validateBatchExcelData(jsonData);

        if (!validation.isValid) {
          setBatchValidationData(validation);
          setShowBatchValidationModal(true);
          setMessage(`❌ Validation Failed`);
          setCheckingDuplicates(false);
          e.target.value = '';
          return;
        }

        // Step 2: Duplicate Check
        const duplicateCheck = await checkBatchDuplicates(jsonData);

        setCheckingDuplicates(false);

        if (duplicateCheck.hasErrors) {
          setDuplicateData(duplicateCheck);
          setDuplicateType('batch');
          setShowDuplicateModal(true);
          setMessage(`⚠️ Found ${duplicateCheck.totalDuplicates} duplicate(s)`);
          e.target.value = '';
          return;
        }

        setBatchFileData(prev => ({
          ...prev,
          file: file,
          fileName: file.name
        }));
        
        setMessage(`✅ Validated!`);
        
      } catch (error) {
        console.error('❌ Error:', error);
        setMessage('❌ Error reading file');
        setCheckingDuplicates(false);
        e.target.value = '';
      }
    };
    
    reader.readAsArrayBuffer(file);
    
  } catch (error) {
    console.error('Error:', error);
    setMessage('Error reading file');
    setCheckingDuplicates(false);
  }
};



  const handleBatchBulkDepartmentChange = (e) => {
    setBatchFileData(prev => ({
      ...prev,
      manualDepartmentId: e.target.value
    }));
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
      const formDataObj = new FormData();
      formDataObj.append('file', batchFileData.file);
      if (batchFileData.manualDepartmentId) {
        formDataObj.append('manualDepartmentId', batchFileData.manualDepartmentId);
      }
      const response = await axios.post(
        'http://checking.shorthandonlineexam.in/api/new-department/batches/bulk-upload-complete',
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setBatchFileData(prev => ({
        ...prev,
        uploadResult: response.data,
        file: null,
        fileName: '',
        manualDepartmentId: ''
      }));
      setMessage(`✅ Batch file uploaded successfully! ${response.data.summary.successful} batches added.`);
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
      await axios.post(
        'http://checking.shorthandonlineexam.in/api/new-department/existing-department/batches',
        existingDeptData
      );
      const selectedDepartment = departments.find(dept => dept.departmentId == existingDeptData.departmentId);
      const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      const newBatches = existingDeptData.batches.map(batch => ({
        ...batch,
        departmentId: existingDeptData.departmentId,
        timestamp: new Date().toISOString()
      }));
      setNewlyAddedBatches(prev => [...prev, ...newBatches]);
      setMessage(`✅ Batches added successfully to "${departmentName}"!`);
      setActiveAccordion("controllers");
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
      onBatchSuccess(existingDeptData.departmentId);
    } catch (err) {
      console.error('Error adding batches:', err);
      setMessage(err.response?.data?.message || 'Error adding batches');
    } finally {
      setExistingDeptLoading(false);
    }
  };

  // Controllers Handlers
  const fetchBatchesByDepartment = async (departmentId) => {
    setFetchingBatches(true);
    try {
      const response = await axios.get(`http://checking.shorthandonlineexam.in/api/new-department/controllers/batches/department/${departmentId}`);
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

// const handleControllerFileSelect = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const allowedTypes = [
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'text/csv'
//   ];

//   if (!allowedTypes.includes(file.type)) {
//     setMessage('Please select a valid Excel file');
//     return;
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     setMessage('File size must be less than 5MB');
//     return;
//   }

//   setCheckingDuplicates(true);
//   setMessage('🔍 Validating...');

//   try {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const data = new Uint8Array(event.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         console.log('📊 Loaded:', jsonData.length);

//         // Step 1: Validation
//         const validation = validateControllerExcelData(jsonData);

//         if (!validation.isValid) {
//           setControllerValidationData(validation);
//           setShowControllerValidationModal(true);
//           setMessage(`❌ Validation Failed`);
//           setCheckingDuplicates(false);
//           e.target.value = '';
//           return;
//         }

//         // Step 2: Duplicate Check
//         const duplicateCheck = await checkControllerDuplicates(jsonData);

//         setCheckingDuplicates(false);

//         if (duplicateCheck.hasErrors) {
//           setDuplicateData(duplicateCheck);
//           setDuplicateType('controller');
//           setShowDuplicateModal(true);
//           setMessage(`⚠️ Found ${duplicateCheck.totalDuplicates} duplicate(s)`);
//           e.target.value = '';
//           return;
//         }

//         setControllerFileData(prev => ({
//           ...prev,
//           file: file,
//           fileName: file.name
//         }));
        
//         setMessage(`✅ Validated!`);
        
//       } catch (error) {
//         console.error('❌ Error:', error);
//         setMessage('❌ Error reading file');
//         setCheckingDuplicates(false);
//         e.target.value = '';
//       }
//     };
    
//     reader.readAsArrayBuffer(file);
    
//   } catch (error) {
//     console.error('Error:', error);
//     setMessage('Error reading file');
//     setCheckingDuplicates(false);
//   }
// };

  const handleControllerFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];

  if (!allowedTypes.includes(file.type)) {
    setMessage('Please select a valid Excel file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setMessage('File size must be less than 5MB');
    return;
  }

  setCheckingDuplicates(true);
  setMessage('Validating...');

  try {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Loaded', jsonData.length, 'controller rows');

        // Step 1: Field Validation
        const validation = validateControllerExcelData(jsonData);
        if (!validation.isValid) {
          setControllerValidationData(validation);
          setShowControllerValidationModal(true);
          setMessage('Validation Failed');
          setCheckingDuplicates(false);
          e.target.value = '';
          return;
        }

        // Step 2: Database Reference Validation (NEW)
        setMessage('Checking database references...');
        const dbValidation = await validateControllerDatabaseReferences(jsonData);
        
        if (!dbValidation.isValid) {
          setDbValidationData(dbValidation);
          setShowDbValidationModal(true);
          setMessage('Database Validation Failed - Invalid references found');
          setCheckingDuplicates(false);
          e.target.value = '';
          return;
        }

        // Step 3: Duplicate Check
        setMessage('Checking duplicates...');
        const duplicateCheck = await checkControllerDuplicates(jsonData);
        setCheckingDuplicates(false);

        if (duplicateCheck.hasErrors) {
          setDuplicateData(duplicateCheck);
          setDuplicateType('controller');
          setShowDuplicateModal(true);
          setMessage(`Found ${duplicateCheck.totalDuplicates} duplicates`);
          e.target.value = '';
          return;
        }

        // All validations passed
        setControllerFileData(prev => ({
          ...prev,
          file: file,
          fileName: file.name
        }));
        setMessage('✓ All validations passed! Ready to upload.');

      } catch (error) {
        console.error('Error processing file:', error);
        setMessage('Error reading file');
        setCheckingDuplicates(false);
        e.target.value = '';
      }
    };

    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.error('Error:', error);
    setMessage('Error reading file');
    setCheckingDuplicates(false);
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
      const formDataObj = new FormData();
      formDataObj.append('file', controllerFileData.file);
      const response = await axios.post(
        'http://checking.shorthandonlineexam.in/api/new-department/controllers/bulk-upload-complete',
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setControllerFileData(prev => ({
        ...prev,
        uploadResult: response.data,
        file: null,
        fileName: ''
      }));
      setMessage(`✅ Controller file uploaded successfully! ${response.data.summary.successful} controllers added.`);
      onControllerSuccess();
    } catch (err) {
      console.error('Error uploading controller file:', err);
      setMessage(err.response?.data?.message || 'Error uploading controller file');
    } finally {
      setControllerFileData(prev => ({ ...prev, uploading: false }));
    }
  };

  const processControllersForSubmission = (controllers) => {
    return controllers.map(controller => ({
      ...controller,
      controller_code: (controller.controller_code || '').trim() === '' ? null : controller.controller_code,
      district: (controller.district || '').trim() === '' ? null : controller.district
    }));
  };

  const handleCenterControllerSubmit = async (e) => {
    e.preventDefault();
    if (!centerControllerData.departmentId || !centerControllerData.batchNo) {
      setMessage('Please select a department and batch number');
      return;
    }
    const invalidControllers = centerControllerData.controllers.filter(controller =>
      !controller.controller_contact ||
      !controller.controller_email || !controller.controller_name ||
      !controller.controller_pass || !controller.center
    );
    if (invalidControllers.length > 0) {
      setMessage('Please fill all required fields for all controllers');
      return;
    }
    setControllerLoading(true);
    setMessage('');
    try {
      const processedControllers = processControllersForSubmission(centerControllerData.controllers);
      await axios.post('http://checking.shorthandonlineexam.in/api/new-department/controllers', {
        departmentId: centerControllerData.departmentId,
        batchNo: centerControllerData.batchNo,
        controllers: processedControllers
      });
      const selectedDepartment = departments.find(dept => dept.departmentId == centerControllerData.departmentId);
      const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
      const newControllers = centerControllerData.controllers.map(controller => ({
        ...controller,
        departmentId: centerControllerData.departmentId,
        batchNo: centerControllerData.batchNo,
        timestamp: new Date().toISOString()
      }));
      setNewlyAddedControllers(prev => [...prev, ...newControllers]);
      setMessage(`✅ Center Controllers added successfully to "${departmentName}"!`);
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
      onControllerSuccess(centerControllerData.departmentId, centerControllerData.batchNo);
    } catch (err) {
      console.error('Error adding controllers:', err);
      setMessage(err.response?.data?.message || 'Error adding controllers');
    } finally {
      setControllerLoading(false);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Accordion activeKey={activeAccordion} onSelect={(key) => setActiveAccordion(key)}>
        {/* Create New Department */}
        <Accordion.Item eventKey="new">
          <Accordion.Header>
            <FaUniversity className="me-2" />
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
            {/* Bulk Upload Batches */}
            <Card className="mb-4 border-success">
              <Card.Header className="bg-success-subtle">
                <h6 className="mb-0">✅ 📊 Bulk Upload Batches via Excel/CSV (With Validation)</h6>
                <small className="text-muted">Upload complete batch data with frontend validation + Optional department selection</small>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleBatchFileUpload}>
                  <Row className="g-3">
                    <Col xs={12}>
                      <Alert variant="info" className="mb-3">
                        <FaInfoCircle className="me-2" />
                        <strong>📌 Note:</strong> File will be <strong>validated before upload</strong>. 
                        If your Excel file doesn't contain a <code>departmentId</code> column,
                        select a department below to apply to all batches.
                      </Alert>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          Select Department (Optional)
                          {departments.length > 0 && (
                            <span className="text-muted ms-2">({departments.length} available)</span>
                          )}
                        </Form.Label>
                        <Form.Select
                          value={batchFileData.manualDepartmentId}
                          onChange={handleBatchBulkDepartmentChange}
                          disabled={fetchingDepartments || refreshingDepartments}
                        >
                          <option value="">
                            {fetchingDepartments || refreshingDepartments
                              ? 'Loading departments...'
                              : 'Select department (if Excel has no departmentId column)'}
                          </option>
                          {departments.map(dept => (
                            <option key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName} (ID: {dept.departmentId})
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          ℹ️ Leave empty if your Excel file already contains <code>departmentId</code> column
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>
                          Upload Batch Excel/CSV File * (With Validation)
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleBatchFileSelect}
                          required
                        />
                        <Form.Text className="text-muted">
                          ✅ <strong>File will be validated before upload</strong><br />
                          <strong>Required columns:</strong> batchNo, batchdate, reporting_time, start_time, end_time<br />
                          <strong>Optional column:</strong> departmentId (use dropdown above if not in Excel)
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
                        <Alert variant="success" className="mb-0">
                          <FaCheckCircle className="me-2" />
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
                        </Alert>
                      </Col>
                    )}
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            {/* Manual Batch Entry */}
            <Card className="border-secondary">
              <Card.Header className="bg-secondary-subtle">
                <h6 className="mb-0">✏️ Manual Batch Entry</h6>
                <small className="text-muted">Add batches to a selected department</small>
              </Card.Header>
              <Card.Body>
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
                        <div className="d-flex gap-2">
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
                                : 'Choose a department'}
                            </option>
                            {departments.map(dept => (
                              <option key={dept.departmentId} value={dept.departmentId}>
                                {dept.departmentName} (ID: {dept.departmentId})
                              </option>
                            ))}
                          </Form.Select>
                          <Button
                            variant="outline-secondary"
                            onClick={handleRefreshDepartments}
                            disabled={refreshingDepartments}
                          >
                            {refreshingDepartments ? (
                              <>
                                <Spinner as="span" animation="border" size="sm" className="me-1" />
                                Refreshing...
                              </>
                            ) : (
                              '🔄 Refresh'
                            )}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Batches</h6>
                        <Button variant="outline-success" size="sm" onClick={addBatch}>
                          + Add Batch
                        </Button>
                      </div>
                    </Col>

                    {existingDeptData.batches.map((batch, index) => (
                      <Col xs={12} key={index}>
                        <Card className="mb-3">
                          <Card.Header className="py-2 d-flex justify-content-between align-items-center">
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
                      </Col>
                    ))}

                    <Col xs={12} className="mt-2">
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => setActiveAccordion('new')}
                        >
                          Back
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
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>

        {/* Add Center Controllers */}
        <Accordion.Item eventKey="controllers">
          <Accordion.Header>
            <h5 className="mb-0">Add Center Controllers</h5>
          </Accordion.Header>
          <Accordion.Body>
            {/* Bulk Upload Controllers */}
            <Card className="mb-4 border-primary">
              <Card.Header className="bg-primary-subtle">
                <h6 className="mb-0">📦 Bulk Upload Controllers via Excel/CSV (With Validation)</h6>
                <small className="text-muted">Upload controller data for any department/batch specified in your file</small>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleControllerFileUpload}>
                  <Row className="g-3">
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>Upload Controllers Excel/CSV File * (With Validation)</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleControllerFileSelect}
                          required
                        />
                        <Form.Text className="text-muted">
                          ✅ <strong>File will be validated before upload</strong><br />
                          Required columns: controller_name, controller_contact, controller_email, controller_pass, center<br />
                          Optional columns: controller_code, district
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                      <div className="d-flex gap-2 w-100">
                        <Button
                          variant="primary"
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
                            '📦 Upload Controllers'
                          )}
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = '/templates/controllers_complete_template.xlsx';
                            link.download = 'controllers_complete_template.xlsx';
                            link.click();
                          }}
                        >
                          📥 Template
                        </Button>
                      </div>
                    </Col>
                    {controllerFileData.fileName && (
                      <Col xs={12}>
                        <Alert variant="success" className="mb-0">
                          <FaCheckCircle className="me-2" />
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
                        </Alert>
                      </Col>
                    )}
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            {/* ✅ NEW: Auto-Generate Controllers from Database */}
            <Card className="mb-4 border-info">
              <Card.Header className="bg-info-subtle">
                <h6 className="mb-0">🤖 Auto-Generate Controllers from Database</h6>
                <small className="text-muted">Automatically create controller records based on department-batch-center combinations</small>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col xs={12}>
                    <Alert variant="info" className="mb-3">
                      <FaInfoCircle className="me-2" />
                      <strong>💡 How it works:</strong> This feature generates controller records automatically 
                      by combining existing departments, batches, and centers from your database. 
                      You can then review, edit, and approve the generated records.
                    </Alert>
                  </Col>
                  <Col xs={12}>
                    <div className="d-grid">
                      <Button
                        variant="info"
                        size="lg"
                        onClick={() => navigate('/super-admin/add-controller')}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaDatabase className="me-2" />
                        Create Controllers from Database
                        <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="text-muted small">
                      <p className="mb-1"><strong>Benefits:</strong></p>
                      <ul className="mb-0">
                        <li>No manual data entry required</li>
                        <li>Automatic password generation</li>
                        <li>Preview before saving to database</li>
                        <li>Search and filter generated records</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Manual Controllers Entry */}
            <Card className="border-secondary">
              <Card.Header className="bg-secondary-subtle">
                <h6 className="mb-0">✍️ Manual Controllers Entry</h6>
                <small className="text-muted">Add controllers to a specific department and batch</small>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleCenterControllerSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Department *</Form.Label>
                        <Form.Select
                          name="departmentId"
                          value={centerControllerData.departmentId}
                          onChange={handleCenterControllerChange}
                          required
                          disabled={fetchingDepartments}
                        >
                          <option value="">{fetchingDepartments ? 'Loading departments...' : 'Choose department'}</option>
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
                        <Form.Label>Batch No *</Form.Label>
                        <Form.Select
                          name="batchNo"
                          value={centerControllerData.batchNo}
                          onChange={handleCenterControllerChange}
                          required
                          disabled={!centerControllerData.departmentId || fetchingBatches}
                        >
                          <option value="">{fetchingBatches ? 'Loading batches...' : 'Choose batch'}</option>
                          {getAvailableBatches().map(b => (
                            <option key={b.batchNo} value={b.batchNo}>
                              {b.batchNo}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Controllers</h6>
                        <Button variant="outline-success" size="sm" onClick={addController}>
                          + Add Controller
                        </Button>
                      </div>
                    </Col>

                    {centerControllerData.controllers.map((controller, index) => (
                      <Col xs={12} key={index}>
                        <Card className="mb-3">
                          <Card.Header className="py-2 d-flex justify-content-between align-items-center">
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
                          </Card.Header>
                          <Card.Body>
                            <Row className="g-2">
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label>Controller Code (optional)</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={controller.controller_code || ''}
                                    onChange={(e) => handleControllerChange(index, 'controller_code', e.target.value)}
                                    placeholder="e.g., C123"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label>Controller Name *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={controller.controller_name || ''}
                                    onChange={(e) => handleControllerChange(index, 'controller_name', e.target.value)}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label>Contact *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={controller.controller_contact || ''}
                                    onChange={(e) => handleControllerChange(index, 'controller_contact', e.target.value)}
                                    placeholder="10-15 digits"
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label>Email *</Form.Label>
                                  <Form.Control
                                    type="email"
                                    value={controller.controller_email || ''}
                                    onChange={(e) => handleControllerChange(index, 'controller_email', e.target.value)}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label>Password *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={controller.controller_pass || ''}
                                    onChange={(e) => handleControllerChange(index, 'controller_pass', e.target.value)}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Label>District (optional)</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={controller.district || ''}
                                    onChange={(e) => handleControllerChange(index, 'district', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Center *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={controller.center || ''}
                                    onChange={(e) => handleControllerChange(index, 'center', e.target.value)}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}

                    <Col xs={12} className="mt-2">
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => setActiveAccordion('existing')}
                        >
                          Back
                        </Button>
                        <Button
                          variant="success"
                          type="submit"
                          disabled={
                            controllerLoading ||
                            !centerControllerData.departmentId ||
                            !centerControllerData.batchNo ||
                            centerControllerData.controllers.length === 0
                          }
                        >
                          {controllerLoading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Adding Controllers...
                            </>
                          ) : (
                            'Add Controllers'
                          )}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Validation Modals */}
      <ExcelValidationModal
        show={showBatchValidationModal}
        onHide={() => setShowBatchValidationModal(false)}
        errors={batchValidationData?.errors || []}
        summary={batchValidationData?.summary || {}}
        title="Batch Excel Validation Report"
      />

      <ExcelValidationModal
        show={showControllerValidationModal}
        onHide={() => setShowControllerValidationModal(false)}
        errors={controllerValidationData?.errors || []}
        summary={controllerValidationData?.summary || {}}
        title="Controller Excel Validation Report"
      />


            {/* ✅ Duplicate Modal */}
      <Modal show={showDuplicateModal} onHide={() => setShowDuplicateModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>
            <FaExclamationTriangle className="me-2" />
            Duplicate {duplicateType === 'batch' ? 'Batches' : 'Controllers'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {duplicateData && (
            <>
              <Alert variant="warning">
                <strong>⚠️ Found {duplicateData.totalDuplicates} duplicate(s)</strong>
              </Alert>

              {duplicateData.internalDuplicates.length > 0 && (
                <div className="mb-3">
                  <h6 className="text-danger">📄 Internal: {duplicateData.internalDuplicates.length}</h6>
                  <Table striped bordered size="sm">
                    <thead className="table-danger">
                      <tr>
                        <th>Row</th>
                        {duplicateType === 'batch' ? <><th>Dept ID</th><th>Batch No</th></> : <><th>Name</th><th>Email</th></>}
                      </tr>
                    </thead>
                    <tbody>
                      {duplicateData.internalDuplicates.map((dup, idx) => (
                        <tr key={idx}>
                          <td>{dup.rowNumber}</td>
                          {duplicateType === 'batch' ? <><td>{dup.departmentId}</td><td>{dup.batchNo}</td></> : <><td>{dup.controller_name}</td><td>{dup.controller_email}</td></>}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {duplicateData.databaseDuplicates.length > 0 && (
                <div>
                  <h6 className="text-danger">🗄️ Database: {duplicateData.databaseDuplicates.length}</h6>
                  <Table striped bordered size="sm">
                    <thead className="table-danger">
                      <tr>
                        {duplicateType === 'batch' ? <><th>Dept ID</th><th>Batch No</th></> : <><th>Email</th></>}
                      </tr>
                    </thead>
                    <tbody>
                      {duplicateData.databaseDuplicates.map((dup, idx) => (
                        <tr key={idx}>
                          {duplicateType === 'batch' ? <><td>{dup.departmentId}</td><td>{dup.batchNo}</td></> : <><td>{dup.controller_email}</td></>}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDuplicateModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>


      {/* Database Validation Modal */}
<Modal 
  show={showDbValidationModal} 
  onHide={() => setShowDbValidationModal(false)} 
  size="lg" 
  centered
>
  <Modal.Header closeButton className="bg-danger text-white">
    <Modal.Title>
      <FaExclamationTriangle className="me-2" />
      Database Validation Failed
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {dbValidationData && (
      <>
        <Alert variant="danger">
          <strong>Found {dbValidationData.errors?.length || 0} rows with invalid database references</strong>
          <p className="mb-0 mt-2">
            The following records reference non-existent Department IDs, Batch Numbers, or Centers in the database.
          </p>
        </Alert>

        {dbValidationData.errors && dbValidationData.errors.length > 0 && (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered size="sm">
              <thead className="table-danger sticky-top">
                <tr>
                  <th>Row</th>
                  <th>Department ID</th>
                  <th>Batch No</th>
                  <th>Center</th>
                  <th>Issues</th>
                </tr>
              </thead>
              <tbody>
                {dbValidationData.errors.map((error, idx) => (
                  <tr key={idx}>
                    <td>{error.rowNumber}</td>
                    <td>{error.departmentId || 'N/A'}</td>
                    <td>{error.batchNo || 'N/A'}</td>
                    <td>{error.center || 'N/A'}</td>
                    <td>
                      <ul className="mb-0" style={{ fontSize: '0.85rem' }}>
                        {error.issues.map((issue, i) => (
                          <li key={i} className="text-danger">{issue}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <Alert variant="info" className="mt-3 mb-0">
          <strong>How to fix:</strong>
          <ol className="mb-0 mt-2">
            <li>Verify that Department IDs exist in the database</li>
            <li>Check that Batch Numbers are assigned to the correct departments</li>
            <li>Ensure Center numbers match exactly with database records</li>
            <li>Fix the Excel file and try uploading again</li>
          </ol>
        </Alert>
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDbValidationModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>



    </Container>
  );
};

export default DepartmentForms;




// // src/components/super-admin/department-setup/DepartmentForms.js
// import React, { useState, useEffect } from 'react';
// import {
//   Accordion, Row, Col, Form, Button, Spinner, Card, Alert, Badge, Container, ListGroup, Table, Modal
// } from 'react-bootstrap';
// import { 
//   FaUniversity, FaCogs, FaArrowRight, FaDatabase, FaCheckCircle, FaPlus, FaTrash, 
//   FaDownload, FaSync, FaInfoCircle, FaExclamationTriangle  
// } from 'react-icons/fa';



// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import ExcelValidationModal from '../../../utils/ExcelValidationModal';

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

//   // Batch Excel Upload State
//   const [batchFileData, setBatchFileData] = useState({
//     file: null,
//     fileName: '',
//     uploading: false,
//     uploadResult: null,
//     manualDepartmentId: ''
//   });

//   // ✅ ADD THESE NEW STATES after line 54
// const [showDuplicateModal, setShowDuplicateModal] = useState(false);
// const [duplicateData, setDuplicateData] = useState(null);
// const [duplicateType, setDuplicateType] = useState('');
// const [checkingDuplicates, setCheckingDuplicates] = useState(false);


//   const [batchValidationData, setBatchValidationData] = useState(null);
//   const [showBatchValidationModal, setShowBatchValidationModal] = useState(false);

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

//   // Controller Excel Upload State
//   const [controllerFileData, setControllerFileData] = useState({
//     file: null,
//     fileName: '',
//     uploading: false,
//     uploadResult: null
//   });

//   const [controllerValidationData, setControllerValidationData] = useState(null);
//   const [showControllerValidationModal, setShowControllerValidationModal] = useState(false);

//   // Required fields for batch validation
//   const requiredBatchFields = {
//     'departmentId': 'Department ID',
//     'batchNo': 'Batch Number',
//     'batchdate': 'Batch Date',
//     'reporting_time': 'Reporting Time',
//     'start_time': 'Start Time',
//     'end_time': 'End Time'
//   };

//   // Required fields for controller validation
//   const requiredControllerFields = {
//     'controller_name': 'Controller Name',
//     'controller_contact': 'Contact Number',
//     'controller_email': 'Email Address',
//     'controller_pass': 'Password',
//     'center': 'Center Name'
//   };

//   // Batch Validation Function
//   const validateBatchExcelData = (excelData) => {
//     const errors = [];
//     const fieldErrors = {};
    
//     Object.keys(requiredBatchFields).forEach(field => {
//       fieldErrors[field] = 0;
//     });

//     console.log('🔍 Starting batch Excel validation on', excelData?.length || 0, 'rows');

//     if (!excelData || excelData.length === 0) {
//       return {
//         errors: [],
//         summary: {
//           totalRows: 0,
//           errorCount: 0,
//           successCount: 0,
//           fieldErrors: []
//         },
//         isValid: false
//       };
//     }

//     excelData.forEach((row, index) => {
//       const rowNumber = index + 2;
//       const missingFields = [];
      
//       Object.keys(requiredBatchFields).forEach(field => {
//         const value = row[field];
        
//         if (value === null || value === undefined || value === '' || 
//             (typeof value === 'string' && value.trim() === '')) {
//           missingFields.push(requiredBatchFields[field]);
//           fieldErrors[field]++;
//         }
//       });
      
//       if (missingFields.length > 0) {
//         errors.push({
//           rowNumber,
//           identifier: row.batchNo || 'N/A',
//           name: row.batchdate || 'Unknown',
//           missingFields
//         });
//       }
//     });
    
//     const summary = {
//       totalRows: excelData.length,
//       errorCount: errors.length,
//       successCount: excelData.length - errors.length,
//       fieldErrors: Object.entries(fieldErrors)
//         .filter(([_, count]) => count > 0)
//         .map(([field, count]) => ({
//           field: requiredBatchFields[field],
//           count,
//           percentage: ((count / excelData.length) * 100).toFixed(1)
//         }))
//         .sort((a, b) => b.count - a.count)
//     };
    
//     console.log('✅ Batch validation complete:', summary);
    
//     return { errors, summary, isValid: errors.length === 0 };
//   };

//   // Controller Validation Function
//   const validateControllerExcelData = (excelData) => {
//     const errors = [];
//     const fieldErrors = {};
    
//     Object.keys(requiredControllerFields).forEach(field => {
//       fieldErrors[field] = 0;
//     });

//     console.log('🔍 Starting controller Excel validation on', excelData?.length || 0, 'rows');

//     if (!excelData || excelData.length === 0) {
//       return {
//         errors: [],
//         summary: {
//           totalRows: 0,
//           errorCount: 0,
//           successCount: 0,
//           fieldErrors: []
//         },
//         isValid: false
//       };
//     }

//     excelData.forEach((row, index) => {
//       const rowNumber = index + 2;
//       const missingFields = [];
      
//       Object.keys(requiredControllerFields).forEach(field => {
//         const value = row[field];
        
//         if (value === null || value === undefined || value === '' || 
//             (typeof value === 'string' && value.trim() === '')) {
//           missingFields.push(requiredControllerFields[field]);
//           fieldErrors[field]++;
//         }
//       });
      
//       if (missingFields.length > 0) {
//         errors.push({
//           rowNumber,
//           identifier: row.controller_name || 'N/A',
//           name: row.center || 'Unknown',
//           missingFields
//         });
//       }
//     });
    
//     const summary = {
//       totalRows: excelData.length,
//       errorCount: errors.length,
//       successCount: excelData.length - errors.length,
//       fieldErrors: Object.entries(fieldErrors)
//         .filter(([_, count]) => count > 0)
//         .map(([field, count]) => ({
//           field: requiredControllerFields[field],
//           count,
//           percentage: ((count / excelData.length) * 100).toFixed(1)
//         }))
//         .sort((a, b) => b.count - a.count)
//     };
    
//     console.log('✅ Controller validation complete:', summary);
    
//     return { errors, summary, isValid: errors.length === 0 };
//   };


//   // ✅ ADD THESE FUNCTIONS after validateControllerExcelData function

// // Check Batch Duplicates
// const checkBatchDuplicates = async (excelData) => {
//   try {
//     console.log('🔍 Checking batch duplicates...');
    
//     // Internal duplicates
//     const internalDuplicates = [];
//     const seen = new Map();
    
//     excelData.forEach((row, index) => {
//       const key = `${row.departmentId}_${row.batchNo}`;
//       if (seen.has(key)) {
//         internalDuplicates.push({
//           rowNumber: index + 2,
//           departmentId: row.departmentId,
//           batchNo: row.batchNo,
//           batchdate: row.batchdate
//         });
//       } else {
//         seen.set(key, index + 2);
//       }
//     });

//     console.log('📊 Internal:', internalDuplicates.length);

//     // Database duplicates
//     const response = await axios.post(
//       'http://checking.shorthandonlineexam.in/api/new-department/check-batch-duplicates',
//       { batches: excelData.map(row => ({ departmentId: row.departmentId, batchNo: row.batchNo })) },
//       { timeout: 10000 }
//     );

//     const databaseDuplicates = response.data.duplicates || [];

//     return {
//       hasErrors: internalDuplicates.length > 0 || databaseDuplicates.length > 0,
//       internalDuplicates,
//       databaseDuplicates,
//       totalDuplicates: internalDuplicates.length + databaseDuplicates.length
//     };
//   } catch (error) {
//     console.error('❌ Error:', error);
//     return { hasErrors: false, internalDuplicates: [], databaseDuplicates: [], totalDuplicates: 0 };
//   }
// };

// // Check Controller Duplicates
// const checkControllerDuplicates = async (excelData) => {
//   try {
//     console.log('🔍 Checking controller duplicates...');
    
//     // Internal duplicates
//     const internalDuplicates = [];
//     const seen = new Map();
    
//     excelData.forEach((row, index) => {
//       const key = row.controller_email?.toLowerCase().trim();
//       if (key && seen.has(key)) {
//         internalDuplicates.push({
//           rowNumber: index + 2,
//           controller_name: row.controller_name,
//           controller_email: row.controller_email
//         });
//       } else if (key) {
//         seen.set(key, index + 2);
//       }
//     });

//     console.log('📊 Internal:', internalDuplicates.length);

//     // Database duplicates
//     const response = await axios.post(
//       'http://checking.shorthandonlineexam.in/api/new-department/check-controller-duplicates',
//       { controllers: excelData.map(row => ({ controller_email: row.controller_email })) },
//       { timeout: 10000 }
//     );

//     const databaseDuplicates = response.data.duplicates || [];

//     return {
//       hasErrors: internalDuplicates.length > 0 || databaseDuplicates.length > 0,
//       internalDuplicates,
//       databaseDuplicates,
//       totalDuplicates: internalDuplicates.length + databaseDuplicates.length
//     };
//   } catch (error) {
//     console.error('❌ Error:', error);
//     return { hasErrors: false, internalDuplicates: [], databaseDuplicates: [], totalDuplicates: 0 };
//   }
// };


//   // Persist form data
//   useEffect(() => {
//     persistFormData({ formData, existingDeptData, centerControllerData });
//   }, [formData, existingDeptData, centerControllerData]);

//   // Fetch batches when department is selected
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
//       await axios.post('http://checking.shorthandonlineexam.in/api/new-department/departments', formData);
//       const newDepartmentId = formData.departmentId;
//       const newDepartmentName = formData.departmentName;
//       setFormData({
//         departmentId: '',
//         departmentName: '',
//         departmentPassword: '',
//         logo: '',
//         departmentStatus: true
//       });
//       setLogoFile(null);
//       clearPersistedData();
//       await fetchDepartments();
//       setMessage(`✅ Department "${newDepartmentName}" created successfully!`);
//       setActiveAccordion("existing");
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

// const handleBatchFileSelect = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const allowedTypes = [
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'text/csv'
//   ];

//   if (!allowedTypes.includes(file.type)) {
//     setMessage('Please select a valid Excel file');
//     return;
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     setMessage('File size must be less than 5MB');
//     return;
//   }

//   setCheckingDuplicates(true);
//   setMessage('🔍 Validating...');

//   try {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const data = new Uint8Array(event.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         console.log('📊 Loaded:', jsonData.length);

//         // Step 1: Validation
//         const validation = validateBatchExcelData(jsonData);

//         if (!validation.isValid) {
//           setBatchValidationData(validation);
//           setShowBatchValidationModal(true);
//           setMessage(`❌ Validation Failed`);
//           setCheckingDuplicates(false);
//           e.target.value = '';
//           return;
//         }

//         // Step 2: Duplicate Check
//         const duplicateCheck = await checkBatchDuplicates(jsonData);

//         setCheckingDuplicates(false);

//         if (duplicateCheck.hasErrors) {
//           setDuplicateData(duplicateCheck);
//           setDuplicateType('batch');
//           setShowDuplicateModal(true);
//           setMessage(`⚠️ Found ${duplicateCheck.totalDuplicates} duplicate(s)`);
//           e.target.value = '';
//           return;
//         }

//         setBatchFileData(prev => ({
//           ...prev,
//           file: file,
//           fileName: file.name
//         }));
        
//         setMessage(`✅ Validated!`);
        
//       } catch (error) {
//         console.error('❌ Error:', error);
//         setMessage('❌ Error reading file');
//         setCheckingDuplicates(false);
//         e.target.value = '';
//       }
//     };
    
//     reader.readAsArrayBuffer(file);
    
//   } catch (error) {
//     console.error('Error:', error);
//     setMessage('Error reading file');
//     setCheckingDuplicates(false);
//   }
// };



//   const handleBatchBulkDepartmentChange = (e) => {
//     setBatchFileData(prev => ({
//       ...prev,
//       manualDepartmentId: e.target.value
//     }));
//   };

//   const handleBatchFileUpload = async (e) => {
//     e.preventDefault();
//     if (!batchFileData.file) {
//       setMessage('Please select a file');
//       return;
//     }
//     setBatchFileData(prev => ({ ...prev, uploading: true }));
//     setMessage('');
//     try {
//       const formDataObj = new FormData();
//       formDataObj.append('file', batchFileData.file);
//       if (batchFileData.manualDepartmentId) {
//         formDataObj.append('manualDepartmentId', batchFileData.manualDepartmentId);
//       }
//       const response = await axios.post(
//         'http://checking.shorthandonlineexam.in/api/new-department/batches/bulk-upload-complete',
//         formDataObj,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       setBatchFileData(prev => ({
//         ...prev,
//         uploadResult: response.data,
//         file: null,
//         fileName: '',
//         manualDepartmentId: ''
//       }));
//       setMessage(`✅ Batch file uploaded successfully! ${response.data.summary.successful} batches added.`);
//       onBatchSuccess();
//     } catch (err) {
//       console.error('Error uploading batch file:', err);
//       setMessage(err.response?.data?.message || 'Error uploading batch file');
//     } finally {
//       setBatchFileData(prev => ({ ...prev, uploading: false }));
//     }
//   };

//   const handleExistingDeptSubmit = async (e) => {
//     e.preventDefault();
//     if (!existingDeptData.departmentId) {
//       setMessage('Please select a department');
//       return;
//     }
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
//       await axios.post(
//         'http://checking.shorthandonlineexam.in/api/new-department/existing-department/batches',
//         existingDeptData
//       );
//       const selectedDepartment = departments.find(dept => dept.departmentId == existingDeptData.departmentId);
//       const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
//       const newBatches = existingDeptData.batches.map(batch => ({
//         ...batch,
//         departmentId: existingDeptData.departmentId,
//         timestamp: new Date().toISOString()
//       }));
//       setNewlyAddedBatches(prev => [...prev, ...newBatches]);
//       setMessage(`✅ Batches added successfully to "${departmentName}"!`);
//       setActiveAccordion("controllers");
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
//       onBatchSuccess(existingDeptData.departmentId);
//     } catch (err) {
//       console.error('Error adding batches:', err);
//       setMessage(err.response?.data?.message || 'Error adding batches');
//     } finally {
//       setExistingDeptLoading(false);
//     }
//   };

//   // Controllers Handlers
//   const fetchBatchesByDepartment = async (departmentId) => {
//     setFetchingBatches(true);
//     try {
//       const response = await axios.get(`http://checking.shorthandonlineexam.in/api/new-department/controllers/batches/department/${departmentId}`);
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

//   // const handleControllerFileSelect = (e) => {
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   const allowedTypes = [
//   //     'application/vnd.ms-excel',
//   //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   //     'text/csv'
//   //   ];

//   //   if (!allowedTypes.includes(file.type)) {
//   //     setMessage('Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file');
//   //     return;
//   //   }

//   //   if (file.size > 5 * 1024 * 1024) {
//   //     setMessage('File size must be less than 5MB');
//   //     return;
//   //   }

//   //   try {
//   //     const reader = new FileReader();
//   //     reader.onload = (event) => {
//   //       try {
//   //         const data = new Uint8Array(event.target.result);
//   //         const workbook = XLSX.read(data, { type: 'array' });
//   //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//   //         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//   //         console.log('📊 Controller Excel data loaded:', jsonData.length, 'rows');

//   //         const validation = validateControllerExcelData(jsonData);

//   //         if (!validation.isValid) {
//   //           console.log('❌ Controller validation FAILED');
            
//   //           setControllerValidationData(validation);
//   //           setShowControllerValidationModal(true);
            
//   //           setMessage(
//   //             `❌ Controller Excel Validation Failed: ${validation.errors.length} out of ${validation.summary.totalRows} rows have missing or empty fields.`
//   //           );
            
//   //           e.target.value = '';
//   //           return;
//   //         }

//   //         console.log('✅ Controller validation PASSED');
          
//   //         setControllerFileData(prev => ({
//   //           ...prev,
//   //           file: file,
//   //           fileName: file.name,
//   //           uploadResult: null
//   //         }));
          
//   //         setMessage(`✅ Controller Excel validation passed! ${validation.summary.successCount} rows ready to upload.`);
          
//   //       } catch (error) {
//   //         console.error('Error parsing controller Excel file:', error);
//   //         setMessage('Error reading controller Excel file. Please check the file format.');
//   //       }
//   //     };
      
//   //     reader.readAsArrayBuffer(file);
      
//   //   } catch (error) {
//   //     console.error('Error reading controller file:', error);
//   //     setMessage('Error reading controller file. Please try again.');
//   //   }
//   // };


// const handleControllerFileSelect = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const allowedTypes = [
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'text/csv'
//   ];

//   if (!allowedTypes.includes(file.type)) {
//     setMessage('Please select a valid Excel file');
//     return;
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     setMessage('File size must be less than 5MB');
//     return;
//   }

//   setCheckingDuplicates(true);
//   setMessage('🔍 Validating...');

//   try {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const data = new Uint8Array(event.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         console.log('📊 Loaded:', jsonData.length);

//         // Step 1: Validation
//         const validation = validateControllerExcelData(jsonData);

//         if (!validation.isValid) {
//           setControllerValidationData(validation);
//           setShowControllerValidationModal(true);
//           setMessage(`❌ Validation Failed`);
//           setCheckingDuplicates(false);
//           e.target.value = '';
//           return;
//         }

//         // Step 2: Duplicate Check
//         const duplicateCheck = await checkControllerDuplicates(jsonData);

//         setCheckingDuplicates(false);

//         if (duplicateCheck.hasErrors) {
//           setDuplicateData(duplicateCheck);
//           setDuplicateType('controller');
//           setShowDuplicateModal(true);
//           setMessage(`⚠️ Found ${duplicateCheck.totalDuplicates} duplicate(s)`);
//           e.target.value = '';
//           return;
//         }

//         setControllerFileData(prev => ({
//           ...prev,
//           file: file,
//           fileName: file.name
//         }));
        
//         setMessage(`✅ Validated!`);
        
//       } catch (error) {
//         console.error('❌ Error:', error);
//         setMessage('❌ Error reading file');
//         setCheckingDuplicates(false);
//         e.target.value = '';
//       }
//     };
    
//     reader.readAsArrayBuffer(file);
    
//   } catch (error) {
//     console.error('Error:', error);
//     setMessage('Error reading file');
//     setCheckingDuplicates(false);
//   }
// };


//   const handleControllerFileUpload = async (e) => {
//     e.preventDefault();
//     if (!controllerFileData.file) {
//       setMessage('Please select a file');
//       return;
//     }
//     setControllerFileData(prev => ({ ...prev, uploading: true }));
//     setMessage('');
//     try {
//       const formDataObj = new FormData();
//       formDataObj.append('file', controllerFileData.file);
//       const response = await axios.post(
//         'http://checking.shorthandonlineexam.in/api/new-department/controllers/bulk-upload-complete',
//         formDataObj,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       setControllerFileData(prev => ({
//         ...prev,
//         uploadResult: response.data,
//         file: null,
//         fileName: ''
//       }));
//       setMessage(`✅ Controller file uploaded successfully! ${response.data.summary.successful} controllers added.`);
//       onControllerSuccess();
//     } catch (err) {
//       console.error('Error uploading controller file:', err);
//       setMessage(err.response?.data?.message || 'Error uploading controller file');
//     } finally {
//       setControllerFileData(prev => ({ ...prev, uploading: false }));
//     }
//   };

//   const processControllersForSubmission = (controllers) => {
//     return controllers.map(controller => ({
//       ...controller,
//       controller_code: (controller.controller_code || '').trim() === '' ? null : controller.controller_code,
//       district: (controller.district || '').trim() === '' ? null : controller.district
//     }));
//   };

//   const handleCenterControllerSubmit = async (e) => {
//     e.preventDefault();
//     if (!centerControllerData.departmentId || !centerControllerData.batchNo) {
//       setMessage('Please select a department and batch number');
//       return;
//     }
//     const invalidControllers = centerControllerData.controllers.filter(controller =>
//       !controller.controller_contact ||
//       !controller.controller_email || !controller.controller_name ||
//       !controller.controller_pass || !controller.center
//     );
//     if (invalidControllers.length > 0) {
//       setMessage('Please fill all required fields for all controllers');
//       return;
//     }
//     setControllerLoading(true);
//     setMessage('');
//     try {
//       const processedControllers = processControllersForSubmission(centerControllerData.controllers);
//       await axios.post('http://checking.shorthandonlineexam.in/api/new-department/controllers', {
//         departmentId: centerControllerData.departmentId,
//         batchNo: centerControllerData.batchNo,
//         controllers: processedControllers
//       });
//       const selectedDepartment = departments.find(dept => dept.departmentId == centerControllerData.departmentId);
//       const departmentName = selectedDepartment ? selectedDepartment.departmentName : 'Selected Department';
//       const newControllers = centerControllerData.controllers.map(controller => ({
//         ...controller,
//         departmentId: centerControllerData.departmentId,
//         batchNo: centerControllerData.batchNo,
//         timestamp: new Date().toISOString()
//       }));
//       setNewlyAddedControllers(prev => [...prev, ...newControllers]);
//       setMessage(`✅ Center Controllers added successfully to "${departmentName}"!`);
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
//       onControllerSuccess(centerControllerData.departmentId, centerControllerData.batchNo);
//     } catch (err) {
//       console.error('Error adding controllers:', err);
//       setMessage(err.response?.data?.message || 'Error adding controllers');
//     } finally {
//       setControllerLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Accordion activeKey={activeAccordion} onSelect={(key) => setActiveAccordion(key)}>
//         {/* Create New Department */}
//         <Accordion.Item eventKey="new">
//           <Accordion.Header>
//             <FaUniversity className="me-2" />
//             <h5 className="mb-0">Create New Department</h5>
//           </Accordion.Header>
//           <Accordion.Body>
//             <Form onSubmit={handleNewDepartmentSubmit}>
//               <Row className="g-3">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Department ID *</Form.Label>
//                     <Form.Control
//                       type="number"
//                       name="departmentId"
//                       value={formData.departmentId}
//                       onChange={handleChange}
//                       placeholder="Enter unique department ID"
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Department Status</Form.Label>
//                     <Form.Check
//                       type="switch"
//                       name="departmentStatus"
//                       checked={formData.departmentStatus}
//                       onChange={handleChange}
//                       label={formData.departmentStatus ? 'Active' : 'Inactive'}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col xs={12}>
//                   <Form.Group>
//                     <Form.Label>Department Name *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="departmentName"
//                       value={formData.departmentName}
//                       onChange={handleChange}
//                       placeholder="e.g., PWD Skill Test, Forest Department"
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col xs={12}>
//                   <Form.Group>
//                     <Form.Label>Department Password *</Form.Label>
//                     <Form.Control
//                       type="password"
//                       name="departmentPassword"
//                       value={formData.departmentPassword}
//                       onChange={handleChange}
//                       placeholder="Set department password"
//                       required
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col xs={12}>
//                   <Form.Group>
//                     <Form.Label>Department Logo</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept="image/*"
//                       onChange={handleLogoChange}
//                     />
//                     <Form.Text className="text-muted">
//                       Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
//                     </Form.Text>
//                   </Form.Group>
//                   {formData.logo && (
//                     <div className="mt-2">
//                       <img
//                         src={formData.logo}
//                         alt="Logo preview"
//                         style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
//                       />
//                     </div>
//                   )}
//                 </Col>
//                 <Col xs={12} className="mt-4">
//                   <div className="d-flex justify-content-between">
//                     <Button
//                       variant="secondary"
//                       onClick={() => navigate('/super-admin/department-setup')}
//                     >
//                       Back to Dashboard
//                     </Button>
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner as="span" animation="border" size="sm" className="me-2" />
//                           Creating...
//                         </>
//                       ) : (
//                         'Create Department'
//                       )}
//                     </Button>
//                   </div>
//                 </Col>
//               </Row>
//             </Form>
//           </Accordion.Body>
//         </Accordion.Item>

//         {/* Add Batches to Existing Department */}
//         <Accordion.Item eventKey="existing">
//           <Accordion.Header>
//             <h5 className="mb-0">
//               Add Batches to Existing Department
//               {refreshingDepartments && (
//                 <Spinner as="span" animation="border" size="sm" className="ms-2" />
//               )}
//             </h5>
//           </Accordion.Header>
//           <Accordion.Body>
//             {/* Bulk Upload Batches */}
//             <Card className="mb-4 border-success">
//               <Card.Header className="bg-success-subtle">
//                 <h6 className="mb-0">✅ 📊 Bulk Upload Batches via Excel/CSV (With Validation)</h6>
//                 <small className="text-muted">Upload complete batch data with frontend validation + Optional department selection</small>
//               </Card.Header>
//               <Card.Body>
//                 <Form onSubmit={handleBatchFileUpload}>
//                   <Row className="g-3">
//                     <Col xs={12}>
//                       <Alert variant="info" className="mb-3">
//                         <FaInfoCircle className="me-2" />
//                         <strong>📌 Note:</strong> File will be <strong>validated before upload</strong>. 
//                         If your Excel file doesn't contain a <code>departmentId</code> column,
//                         select a department below to apply to all batches.
//                       </Alert>
//                     </Col>
//                     <Col md={12}>
//                       <Form.Group>
//                         <Form.Label>
//                           Select Department (Optional)
//                           {departments.length > 0 && (
//                             <span className="text-muted ms-2">({departments.length} available)</span>
//                           )}
//                         </Form.Label>
//                         <Form.Select
//                           value={batchFileData.manualDepartmentId}
//                           onChange={handleBatchBulkDepartmentChange}
//                           disabled={fetchingDepartments || refreshingDepartments}
//                         >
//                           <option value="">
//                             {fetchingDepartments || refreshingDepartments
//                               ? 'Loading departments...'
//                               : 'Select department (if Excel has no departmentId column)'}
//                           </option>
//                           {departments.map(dept => (
//                             <option key={dept.departmentId} value={dept.departmentId}>
//                               {dept.departmentName} (ID: {dept.departmentId})
//                             </option>
//                           ))}
//                         </Form.Select>
//                         <Form.Text className="text-muted">
//                           ℹ️ Leave empty if your Excel file already contains <code>departmentId</code> column
//                         </Form.Text>
//                       </Form.Group>
//                     </Col>
//                     <Col md={8}>
//                       <Form.Group>
//                         <Form.Label>
//                           Upload Batch Excel/CSV File * (With Validation)
//                         </Form.Label>
//                         <Form.Control
//                           type="file"
//                           accept=".xlsx,.xls,.csv"
//                           onChange={handleBatchFileSelect}
//                           required
//                         />
//                         <Form.Text className="text-muted">
//                           ✅ <strong>File will be validated before upload</strong><br />
//                           <strong>Required columns:</strong> batchNo, batchdate, reporting_time, start_time, end_time<br />
//                           <strong>Optional column:</strong> departmentId (use dropdown above if not in Excel)
//                         </Form.Text>
//                       </Form.Group>
//                     </Col>
//                     <Col md={4} className="d-flex align-items-end">
//                       <div className="d-flex gap-2 w-100">
//                         <Button
//                           variant="success"
//                           type="submit"
//                           disabled={batchFileData.uploading || !batchFileData.file}
//                           className="flex-grow-1"
//                         >
//                           {batchFileData.uploading ? (
//                             <>
//                               <Spinner as="span" animation="border" size="sm" className="me-2" />
//                               Uploading...
//                             </>
//                           ) : (
//                             '📊 Upload Batches'
//                           )}
//                         </Button>
//                         <Button
//                           variant="outline-info"
//                           size="sm"
//                           onClick={() => {
//                             const link = document.createElement('a');
//                             link.href = '/templates/batch_complete_template.xlsx';
//                             link.download = 'batch_complete_template.xlsx';
//                             link.click();
//                           }}
//                         >
//                           📥 Template
//                         </Button>
//                       </div>
//                     </Col>
//                     {batchFileData.fileName && (
//                       <Col xs={12}>
//                         <Alert variant="success" className="mb-0">
//                           <FaCheckCircle className="me-2" />
//                           <strong>Selected File:</strong> {batchFileData.fileName}
//                         </Alert>
//                       </Col>
//                     )}
//                     {batchFileData.uploadResult && (
//                       <Col xs={12}>
//                         <Alert variant="success">
//                           <h6>Upload Results:</h6>
//                           <ul className="mb-0">
//                             <li>✅ Successful: {batchFileData.uploadResult.summary?.successful || 0}</li>
//                             <li>❌ Failed: {batchFileData.uploadResult.summary?.failed || 0}</li>
//                             <li>📊 Total Processed: {batchFileData.uploadResult.summary?.totalProcessed || 0}</li>
//                           </ul>
//                         </Alert>
//                       </Col>
//                     )}
//                   </Row>
//                 </Form>
//               </Card.Body>
//             </Card>

//             {/* Manual Batch Entry */}
//             <Card className="border-secondary">
//               <Card.Header className="bg-secondary-subtle">
//                 <h6 className="mb-0">✏️ Manual Batch Entry</h6>
//                 <small className="text-muted">Add batches to a selected department</small>
//               </Card.Header>
//               <Card.Body>
//                 <Form onSubmit={handleExistingDeptSubmit}>
//                   <Row className="g-3">
//                     <Col xs={12}>
//                       <Form.Group>
//                         <Form.Label>
//                           Select Existing Department *
//                           {departments.length > 0 && (
//                             <span className="text-muted ms-2">({departments.length} available)</span>
//                           )}
//                         </Form.Label>
//                         <div className="d-flex gap-2">
//                           <Form.Select
//                             name="departmentId"
//                             value={existingDeptData.departmentId}
//                             onChange={handleExistingDeptChange}
//                             required
//                             disabled={fetchingDepartments || refreshingDepartments}
//                           >
//                             <option value="">
//                               {fetchingDepartments || refreshingDepartments
//                                 ? 'Loading departments...'
//                                 : 'Choose a department'}
//                             </option>
//                             {departments.map(dept => (
//                               <option key={dept.departmentId} value={dept.departmentId}>
//                                 {dept.departmentName} (ID: {dept.departmentId})
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <Button
//                             variant="outline-secondary"
//                             onClick={handleRefreshDepartments}
//                             disabled={refreshingDepartments}
//                           >
//                             {refreshingDepartments ? (
//                               <>
//                                 <Spinner as="span" animation="border" size="sm" className="me-1" />
//                                 Refreshing...
//                               </>
//                             ) : (
//                               '🔄 Refresh'
//                             )}
//                           </Button>
//                         </div>
//                       </Form.Group>
//                     </Col>

//                     <Col xs={12}>
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <h6 className="mb-0">Batches</h6>
//                         <Button variant="outline-success" size="sm" onClick={addBatch}>
//                           + Add Batch
//                         </Button>
//                       </div>
//                     </Col>

//                     {existingDeptData.batches.map((batch, index) => (
//                       <Col xs={12} key={index}>
//                         <Card className="mb-3">
//                           <Card.Header className="py-2 d-flex justify-content-between align-items-center">
//                             <span>Batch {index + 1}</span>
//                             {existingDeptData.batches.length > 1 && (
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => removeBatch(index)}
//                               >
//                                 Remove
//                               </Button>
//                             )}
//                           </Card.Header>
//                           <Card.Body>
//                             <Row className="g-2">
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>Batch No *</Form.Label>
//                                   <Form.Control
//                                     type="number"
//                                     value={batch.batchNo}
//                                     onChange={(e) => handleBatchChange(index, 'batchNo', e.target.value)}
//                                     placeholder="Batch number"
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>Date *</Form.Label>
//                                   <Form.Control
//                                     type="date"
//                                     value={batch.batchdate}
//                                     onChange={(e) => handleBatchChange(index, 'batchdate', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={2}>
//                                 <Form.Group>
//                                   <Form.Label>Reporting *</Form.Label>
//                                   <Form.Control
//                                     type="time"
//                                     value={batch.reporting_time}
//                                     onChange={(e) => handleBatchChange(index, 'reporting_time', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={2}>
//                                 <Form.Group>
//                                   <Form.Label>Start *</Form.Label>
//                                   <Form.Control
//                                     type="time"
//                                     value={batch.start_time}
//                                     onChange={(e) => handleBatchChange(index, 'start_time', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={2}>
//                                 <Form.Group>
//                                   <Form.Label>End *</Form.Label>
//                                   <Form.Control
//                                     type="time"
//                                     value={batch.end_time}
//                                     onChange={(e) => handleBatchChange(index, 'end_time', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                             </Row>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}

//                     <Col xs={12} className="mt-2">
//                       <div className="d-flex justify-content-end">
//                         <Button
//                           variant="secondary"
//                           className="me-2"
//                           onClick={() => setActiveAccordion('new')}
//                         >
//                           Back
//                         </Button>
//                         <Button
//                           variant="success"
//                           type="submit"
//                           disabled={existingDeptLoading || !existingDeptData.departmentId}
//                         >
//                           {existingDeptLoading ? (
//                             <>
//                               <Spinner as="span" animation="border" size="sm" className="me-2" />
//                               Adding Batches...
//                             </>
//                           ) : (
//                             'Add Batches to Department'
//                           )}
//                         </Button>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Accordion.Body>
//         </Accordion.Item>

//         {/* Add Center Controllers */}
//         <Accordion.Item eventKey="controllers">
//           <Accordion.Header>
//             <h5 className="mb-0">Add Center Controllers</h5>
//           </Accordion.Header>
//           <Accordion.Body>
//             {/* Bulk Upload Controllers */}
//             <Card className="mb-4 border-primary">
//               <Card.Header className="bg-primary-subtle">
//                 <h6 className="mb-0">📦 Bulk Upload Controllers via Excel/CSV (With Validation)</h6>
//                 <small className="text-muted">Upload controller data for any department/batch specified in your file</small>
//               </Card.Header>
//               <Card.Body>
//                 <Form onSubmit={handleControllerFileUpload}>
//                   <Row className="g-3">
//                     <Col md={8}>
//                       <Form.Group>
//                         <Form.Label>Upload Controllers Excel/CSV File * (With Validation)</Form.Label>
//                         <Form.Control
//                           type="file"
//                           accept=".xlsx,.xls,.csv"
//                           onChange={handleControllerFileSelect}
//                           required
//                         />
//                         <Form.Text className="text-muted">
//                           ✅ <strong>File will be validated before upload</strong><br />
//                           Required columns: controller_name, controller_contact, controller_email, controller_pass, center<br />
//                           Optional columns: controller_code, district
//                         </Form.Text>
//                       </Form.Group>
//                     </Col>
//                     <Col md={4} className="d-flex align-items-end">
//                       <div className="d-flex gap-2 w-100">
//                         <Button
//                           variant="primary"
//                           type="submit"
//                           disabled={controllerFileData.uploading || !controllerFileData.file}
//                           className="flex-grow-1"
//                         >
//                           {controllerFileData.uploading ? (
//                             <>
//                               <Spinner as="span" animation="border" size="sm" className="me-2" />
//                               Uploading...
//                             </>
//                           ) : (
//                             '📦 Upload Controllers'
//                           )}
//                         </Button>
//                         <Button
//                           variant="outline-info"
//                           size="sm"
//                           onClick={() => {
//                             const link = document.createElement('a');
//                             link.href = '/templates/controllers_complete_template.xlsx';
//                             link.download = 'controllers_complete_template.xlsx';
//                             link.click();
//                           }}
//                         >
//                           📥 Template
//                         </Button>
//                       </div>
//                     </Col>
//                     {controllerFileData.fileName && (
//                       <Col xs={12}>
//                         <Alert variant="success" className="mb-0">
//                           <FaCheckCircle className="me-2" />
//                           <strong>Selected File:</strong> {controllerFileData.fileName}
//                         </Alert>
//                       </Col>
//                     )}
//                     {controllerFileData.uploadResult && (
//                       <Col xs={12}>
//                         <Alert variant="success">
//                           <h6>Upload Results:</h6>
//                           <ul className="mb-0">
//                             <li>✅ Successful: {controllerFileData.uploadResult.summary?.successful || 0}</li>
//                             <li>❌ Failed: {controllerFileData.uploadResult.summary?.failed || 0}</li>
//                             <li>📊 Total Processed: {controllerFileData.uploadResult.summary?.totalProcessed || 0}</li>
//                           </ul>
//                         </Alert>
//                       </Col>
//                     )}
//                   </Row>
//                 </Form>
//               </Card.Body>
//             </Card>

//             {/* ✅ NEW: Auto-Generate Controllers from Database */}
//             <Card className="mb-4 border-info">
//               <Card.Header className="bg-info-subtle">
//                 <h6 className="mb-0">🤖 Auto-Generate Controllers from Database</h6>
//                 <small className="text-muted">Automatically create controller records based on department-batch-center combinations</small>
//               </Card.Header>
//               <Card.Body>
//                 <Row className="g-3">
//                   <Col xs={12}>
//                     <Alert variant="info" className="mb-3">
//                       <FaInfoCircle className="me-2" />
//                       <strong>💡 How it works:</strong> This feature generates controller records automatically 
//                       by combining existing departments, batches, and centers from your database. 
//                       You can then review, edit, and approve the generated records.
//                     </Alert>
//                   </Col>
//                   <Col xs={12}>
//                     <div className="d-grid">
//                       <Button
//                         variant="info"
//                         size="lg"
//                         onClick={() => navigate('/super-admin/add-controller')}
//                         className="d-flex align-items-center justify-content-center"
//                       >
//                         <FaDatabase className="me-2" />
//                         Create Controllers from Database
//                         <FaArrowRight className="ms-2" />
//                       </Button>
//                     </div>
//                   </Col>
//                   <Col xs={12}>
//                     <div className="text-muted small">
//                       <p className="mb-1"><strong>Benefits:</strong></p>
//                       <ul className="mb-0">
//                         <li>No manual data entry required</li>
//                         <li>Automatic password generation</li>
//                         <li>Preview before saving to database</li>
//                         <li>Search and filter generated records</li>
//                       </ul>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             {/* Manual Controllers Entry */}
//             <Card className="border-secondary">
//               <Card.Header className="bg-secondary-subtle">
//                 <h6 className="mb-0">✍️ Manual Controllers Entry</h6>
//                 <small className="text-muted">Add controllers to a specific department and batch</small>
//               </Card.Header>
//               <Card.Body>
//                 <Form onSubmit={handleCenterControllerSubmit}>
//                   <Row className="g-3">
//                     <Col md={6}>
//                       <Form.Group>
//                         <Form.Label>Department *</Form.Label>
//                         <Form.Select
//                           name="departmentId"
//                           value={centerControllerData.departmentId}
//                           onChange={handleCenterControllerChange}
//                           required
//                           disabled={fetchingDepartments}
//                         >
//                           <option value="">{fetchingDepartments ? 'Loading departments...' : 'Choose department'}</option>
//                           {departments.map(dept => (
//                             <option key={dept.departmentId} value={dept.departmentId}>
//                               {dept.departmentName} (ID: {dept.departmentId})
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                       <Form.Group>
//                         <Form.Label>Batch No *</Form.Label>
//                         <Form.Select
//                           name="batchNo"
//                           value={centerControllerData.batchNo}
//                           onChange={handleCenterControllerChange}
//                           required
//                           disabled={!centerControllerData.departmentId || fetchingBatches}
//                         >
//                           <option value="">{fetchingBatches ? 'Loading batches...' : 'Choose batch'}</option>
//                           {getAvailableBatches().map(b => (
//                             <option key={b.batchNo} value={b.batchNo}>
//                               {b.batchNo}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>

//                     <Col xs={12}>
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <h6 className="mb-0">Controllers</h6>
//                         <Button variant="outline-success" size="sm" onClick={addController}>
//                           + Add Controller
//                         </Button>
//                       </div>
//                     </Col>

//                     {centerControllerData.controllers.map((controller, index) => (
//                       <Col xs={12} key={index}>
//                         <Card className="mb-3">
//                           <Card.Header className="py-2 d-flex justify-content-between align-items-center">
//                             <span>Controller {index + 1}</span>
//                             {centerControllerData.controllers.length > 1 && (
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => removeController(index)}
//                               >
//                                 Remove
//                               </Button>
//                             )}
//                           </Card.Header>
//                           <Card.Body>
//                             <Row className="g-2">
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>Controller Code (optional)</Form.Label>
//                                   <Form.Control
//                                     type="text"
//                                     value={controller.controller_code || ''}
//                                     onChange={(e) => handleControllerChange(index, 'controller_code', e.target.value)}
//                                     placeholder="e.g., C123"
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>Controller Name *</Form.Label>
//                                   <Form.Control
//                                     type="text"
//                                     value={controller.controller_name || ''}
//                                     onChange={(e) => handleControllerChange(index, 'controller_name', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>Contact *</Form.Label>
//                                   <Form.Control
//                                     type="text"
//                                     value={controller.controller_contact || ''}
//                                     onChange={(e) => handleControllerChange(index, 'controller_contact', e.target.value)}
//                                     placeholder="10-15 digits"
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>Email *</Form.Label>
//                                   <Form.Control
//                                     type="email"
//                                     value={controller.controller_email || ''}
//                                     onChange={(e) => handleControllerChange(index, 'controller_email', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>Password *</Form.Label>
//                                   <Form.Control
//                                     type="text"
//                                     value={controller.controller_pass || ''}
//                                     onChange={(e) => handleControllerChange(index, 'controller_pass', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={3}>
//                                 <Form.Group>
//                                   <Form.Label>District (optional)</Form.Label>
//                                   <Form.Control
//                                     type="text"
//                                     value={controller.district || ''}
//                                     onChange={(e) => handleControllerChange(index, 'district', e.target.value)}
//                                   />
//                                 </Form.Group>
//                               </Col>
//                               <Col md={6}>
//                                 <Form.Group>
//                                   <Form.Label>Center *</Form.Label>
//                                   <Form.Control
//                                     type="text"
//                                     value={controller.center || ''}
//                                     onChange={(e) => handleControllerChange(index, 'center', e.target.value)}
//                                     required
//                                   />
//                                 </Form.Group>
//                               </Col>
//                             </Row>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}

//                     <Col xs={12} className="mt-2">
//                       <div className="d-flex justify-content-end">
//                         <Button
//                           variant="secondary"
//                           className="me-2"
//                           onClick={() => setActiveAccordion('existing')}
//                         >
//                           Back
//                         </Button>
//                         <Button
//                           variant="success"
//                           type="submit"
//                           disabled={
//                             controllerLoading ||
//                             !centerControllerData.departmentId ||
//                             !centerControllerData.batchNo ||
//                             centerControllerData.controllers.length === 0
//                           }
//                         >
//                           {controllerLoading ? (
//                             <>
//                               <Spinner as="span" animation="border" size="sm" className="me-2" />
//                               Adding Controllers...
//                             </>
//                           ) : (
//                             'Add Controllers'
//                           )}
//                         </Button>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Accordion.Body>
//         </Accordion.Item>
//       </Accordion>

//       {/* Validation Modals */}
//       <ExcelValidationModal
//         show={showBatchValidationModal}
//         onHide={() => setShowBatchValidationModal(false)}
//         errors={batchValidationData?.errors || []}
//         summary={batchValidationData?.summary || {}}
//         title="Batch Excel Validation Report"
//       />

//       <ExcelValidationModal
//         show={showControllerValidationModal}
//         onHide={() => setShowControllerValidationModal(false)}
//         errors={controllerValidationData?.errors || []}
//         summary={controllerValidationData?.summary || {}}
//         title="Controller Excel Validation Report"
//       />


//             {/* ✅ Duplicate Modal */}
//       <Modal show={showDuplicateModal} onHide={() => setShowDuplicateModal(false)} size="lg" centered>
//         <Modal.Header closeButton className="bg-warning text-dark">
//           <Modal.Title>
//             <FaExclamationTriangle className="me-2" />
//             Duplicate {duplicateType === 'batch' ? 'Batches' : 'Controllers'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {duplicateData && (
//             <>
//               <Alert variant="warning">
//                 <strong>⚠️ Found {duplicateData.totalDuplicates} duplicate(s)</strong>
//               </Alert>

//               {duplicateData.internalDuplicates.length > 0 && (
//                 <div className="mb-3">
//                   <h6 className="text-danger">📄 Internal: {duplicateData.internalDuplicates.length}</h6>
//                   <Table striped bordered size="sm">
//                     <thead className="table-danger">
//                       <tr>
//                         <th>Row</th>
//                         {duplicateType === 'batch' ? <><th>Dept ID</th><th>Batch No</th></> : <><th>Name</th><th>Email</th></>}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {duplicateData.internalDuplicates.map((dup, idx) => (
//                         <tr key={idx}>
//                           <td>{dup.rowNumber}</td>
//                           {duplicateType === 'batch' ? <><td>{dup.departmentId}</td><td>{dup.batchNo}</td></> : <><td>{dup.controller_name}</td><td>{dup.controller_email}</td></>}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}

//               {duplicateData.databaseDuplicates.length > 0 && (
//                 <div>
//                   <h6 className="text-danger">🗄️ Database: {duplicateData.databaseDuplicates.length}</h6>
//                   <Table striped bordered size="sm">
//                     <thead className="table-danger">
//                       <tr>
//                         {duplicateType === 'batch' ? <><th>Dept ID</th><th>Batch No</th></> : <><th>Email</th></>}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {duplicateData.databaseDuplicates.map((dup, idx) => (
//                         <tr key={idx}>
//                           {duplicateType === 'batch' ? <><td>{dup.departmentId}</td><td>{dup.batchNo}</td></> : <><td>{dup.controller_email}</td></>}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDuplicateModal(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>



//     </Container>
//   );
// };

// export default DepartmentForms;