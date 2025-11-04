// // // SuperAdminDashboard.jsx
// // import React, { useState, useEffect, useCallback } from 'react';
// // import axios from 'axios';
// // import * as XLSX from 'xlsx';
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   CircularProgress,
// //   Typography,
// //   IconButton,
// //   Button,
// //   useTheme,
// //   useMediaQuery,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   TablePagination,
// //   TextField,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   Grid,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Snackbar,
// //   Alert,
// //   InputAdornment
// // } from '@mui/material';
// // import {
// //   TableView as TableViewIcon,
// //   ChevronLeft as ChevronLeftIcon,
// //   ChevronRight as ChevronRightIcon,
// //   Edit as EditIcon,
// //   Save as SaveIcon,
// //   Cancel as CancelIcon,
// //   GetApp as DownloadIcon,
// //   Add as AddIcon,
// //   Delete as DeleteIcon,
// //   Search as SearchIcon,
// //   Clear as ClearIcon
// // } from '@mui/icons-material';

// // const SuperAdminDashboard = () => {
// //   const [tableNames, setTableNames] = useState([]);
// //   const [selectedTable, setSelectedTable] = useState(null);
// //   const [tableData, setTableData] = useState([]);
// //   const [originalData, setOriginalData] = useState([]);
// //   const [columns, setColumns] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [editingKey, setEditingKey] = useState('');
// //   const [editedValues, setEditedValues] = useState({});
  
// //   // Enhanced pending changes structure
// //   const [pendingChanges, setPendingChanges] = useState({
// //     updates: {},
// //     additions: [],
// //     deletions: []
// //   });
  
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [filters, setFilters] = useState({});
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [showTableView, setShowTableView] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   // CRUD OPERATIONS STATE
// //   const [addDialogOpen, setAddDialogOpen] = useState(false);
// //   const [newRecord, setNewRecord] = useState({});
// //   const [addErrors, setAddErrors] = useState({});
// //   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
// //   const [recordToDelete, setRecordToDelete] = useState(null);
// //   const [fileInputKey, setFileInputKey] = useState(Date.now());
  
// //   // Snackbar state
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: '',
// //     severity: 'info'
// //   });

// //   // TABLE SEARCH FUNCTIONALITY - NEW STATE
// //   const [tableSearchQuery, setTableSearchQuery] = useState('');
// //   const [filteredTableNames, setFilteredTableNames] = useState([]);
  
// //   const MAX_IMAGE_SIZE = 50 * 1024; // 50KB

// //   // Material UI theme and responsive hooks
// //   const theme = useTheme();
// //   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

// //   // Table names pagination state - now works with filtered tables
// //   const [currentTablePage, setCurrentTablePage] = useState(0);
// //   const tablesPerPage = 15;
// //   const totalTablePages = Math.ceil(filteredTableNames.length / tablesPerPage);

// //   useEffect(() => {
// //     fetchTableNames();
// //   }, []);

// //   // NEW: Filter table names based on search query
// //   useEffect(() => {
// //     if (tableSearchQuery.trim() === '') {
// //       setFilteredTableNames(tableNames);
// //     } else {
// //       const filtered = tableNames.filter(tableName =>
// //         tableName.toLowerCase().includes(tableSearchQuery.toLowerCase())
// //       );
// //       setFilteredTableNames(filtered);
// //     }
// //     setCurrentTablePage(0); // Reset to first page when search changes
// //   }, [tableNames, tableSearchQuery]);

// //   // FIXED: Apply filters with useCallback
// //   const applyFilters = useCallback(() => {
// //     let newFilteredData = [...tableData];
    
// //     Object.keys(filters).forEach(columnName => {
// //       const filter = filters[columnName];
      
// //       // Fix for dropdown filters - handle empty values
// //       if (filter.type === 'dropdown' && filter.selected !== '' && filter.selected !== null && filter.selected !== undefined) {
// //         newFilteredData = newFilteredData.filter(row => {
// //           const cellValue = row[columnName];
// //           // Handle null/undefined explicitly
// //           if (cellValue === null || cellValue === undefined) return false;
// //           // Use loose comparison to handle type differences
// //           return cellValue.toString() === filter.selected.toString();
// //         });
// //       } 
// //       // Fix for search filters - handle empty values and trim
// //       else if (filter.type === 'search' && filter.value && filter.value.trim() !== '') {
// //         newFilteredData = newFilteredData.filter(row => {
// //           const cellValue = row[columnName];
// //           // Handle null/undefined explicitly
// //           if (cellValue === null || cellValue === undefined) return false;
// //           // Convert to string and perform case-insensitive search
// //           return cellValue.toString().toLowerCase().includes(filter.value.toLowerCase());
// //         });
// //       }
// //     });
    
// //     setFilteredData(newFilteredData);
// //     setCurrentPage(0);
// //   }, [tableData, filters]);

// //   // FIXED: Updated useEffect with proper dependencies
// //   useEffect(() => {
// //     if (selectedTable) {
// //       applyFilters();
// //     }
// //   }, [filters, tableData, selectedTable, applyFilters]);

// //   // Handle browser back button navigation
// //   useEffect(() => {
// //     const handlePopState = () => {
// //       if (showTableView) {
// //         setShowTableView(false);
// //         setSelectedTable(null);
// //         setTableData([]);
// //         setOriginalData([]);
// //         setFilteredData([]);
// //         setColumns([]);
// //         setCurrentPage(0);
// //         setRowsPerPage(10);
// //         setPendingChanges({ updates: {}, additions: [], deletions: [] });
// //       }
// //     };

// //     window.addEventListener('popstate', handlePopState);
// //     return () => window.removeEventListener('popstate', handlePopState);
// //   }, [showTableView]);

// //   // Snackbar helper function
// //   const showSnackbar = (message, severity = 'info') => {
// //     setSnackbar({ open: true, message, severity });
// //   };

// //   const fetchTableNames = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get('http://localhost:3000/fetch-table-names', {
// //         withCredentials: true
// //       });
// //       setTableNames(response.data);
// //     } catch (error) {
// //       console.error('Error fetching table names:', error);
// //       showSnackbar('Error fetching table names', 'error');
// //     }
// //     setLoading(false);
// //   };

// //   const fetchTableData = async (tableName) => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.post('http://localhost:3000/fetch-table-data', {
// //         tableName
// //       }, {
// //         withCredentials: true
// //       });
      
// //       // Generate temp IDs for tracking changes
// //       const dataWithTempIds = response.data.map((item, index) => ({ 
// //         ...item, 
// //         _temp_id: `temp_${Date.now()}_${index}`,
// //         key: index.toString() 
// //       }));
      
// //       setTableData(dataWithTempIds);
// //       setOriginalData(JSON.parse(JSON.stringify(dataWithTempIds))); // Deep copy for comparison
// //       setFilteredData(dataWithTempIds);
      
// //       if (dataWithTempIds.length > 0) {
// //         const tableColumns = Object.keys(dataWithTempIds[0])
// //           .filter(key => key !== '_temp_id') // Don't show temp ID column
// //           .map(key => ({
// //             title: key,
// //             dataIndex: key,
// //             key: key,
// //           }));
// //         setColumns(tableColumns);
// //         initializeFilters(dataWithTempIds, tableColumns);
// //       }
// //       setCurrentPage(0);
// //       setPendingChanges({ updates: {}, additions: [], deletions: [] });
// //     } catch (error) {
// //       console.error('Error fetching table data:', error);
// //       showSnackbar('Error fetching table data', 'error');
// //     }
// //     setLoading(false);
// //   };

// //   const initializeFilters = (data, columns) => {
// //     const newFilters = {};
// //     columns.forEach(column => {
// //       if (column.dataIndex === '_temp_id') return;
// //       const uniqueValues = [...new Set(data.map(item => item[column.dataIndex]))];
// //       if (uniqueValues.length <= 20) {
// //         newFilters[column.dataIndex] = {
// //           type: 'dropdown',
// //           values: uniqueValues,
// //           selected: ''
// //         };
// //       } else {
// //         newFilters[column.dataIndex] = {
// //           type: 'search',
// //           value: ''
// //         };
// //       }
// //     });
// //     setFilters(newFilters);
// //   };

// //   const handleTableSelect = (tableName) => {
// //     window.history.pushState({ showTableView: false }, '', window.location.pathname);
// //     setSelectedTable(tableName);
// //     setShowTableView(true);
// //     fetchTableData(tableName);
// //   };

// //   // NEW: Handle table search functionality
// //   const handleTableSearchChange = (event) => {
// //     setTableSearchQuery(event.target.value);
// //   };

// //   const handleClearTableSearch = () => {
// //     setTableSearchQuery('');
// //   };

// //   // UPDATED: Enhanced data preparation for backend compatibility
// //   const prepareDataForSubmission = () => {
// //     console.log('=== prepareDataForSubmission DEBUG ===');
// //     console.log('pendingChanges:', pendingChanges);
// //     console.log('originalData:', originalData);
    
// //     const changes = {
// //       updates: [],
// //       additions: [],
// //       deletions: []
// //     };

// //     // Process updates - compare with original data to find only changed fields
// //     Object.entries(pendingChanges.updates).forEach(([tempId, updatedRow]) => {
// //       console.log(`Processing update for tempId: ${tempId}`, updatedRow);
      
// //       const originalRow = originalData.find(row => row._temp_id === tempId);
// //       if (!originalRow) {
// //         console.warn(`Original row not found for tempId: ${tempId}`);
// //         return;
// //       }

// //       console.log('Original row:', originalRow);

// //       // Find the primary key using common patterns
// //       const possiblePrimaryKeys = [
// //         'id', 'ID', 'Id', 
// //         'adminid', 'Admin_ID', 'admin_id',
// //         `${selectedTable.toLowerCase()}_id`,
// //         'user_id', 'userId', 'UserID'
// //       ];
// //       let primaryKey = null;
// //       let primaryKeyValue = null;

// //       for (const key of possiblePrimaryKeys) {
// //         if (originalRow[key] !== undefined && originalRow[key] !== null) {
// //           primaryKey = key;
// //           primaryKeyValue = originalRow[key];
// //           break;
// //         }
// //       }

// //       // If no standard primary key found, use the first non-temp column
// //       if (!primaryKey) {
// //         const validKeys = Object.keys(originalRow).filter(k => k !== '_temp_id' && k !== 'key');
// //         if (validKeys.length > 0) {
// //           primaryKey = validKeys[0];
// //           primaryKeyValue = originalRow[primaryKey];
// //         }
// //       }

// //       if (!primaryKey) {
// //         console.error('Could not find primary key for row:', originalRow);
// //         return;
// //       }

// //       console.log(`Using primary key: ${primaryKey} = ${primaryKeyValue}`);

// //       // Compare all fields and include changed ones
// //       const changedFields = {};
// //       Object.keys(updatedRow).forEach(key => {
// //         if (key !== '_temp_id' && key !== 'key') {
// //           const originalValue = originalRow[key];
// //           const updatedValue = updatedRow[key];
          
// //           // Handle null/undefined values properly
// //           const originalStr = originalValue === null || originalValue === undefined ? '' : String(originalValue);
// //           const updatedStr = updatedValue === null || updatedValue === undefined ? '' : String(updatedValue);
          
// //           if (originalStr !== updatedStr) {
// //             changedFields[key] = updatedValue;
// //             console.log(`Field changed - ${key}: "${originalValue}" -> "${updatedValue}"`);
// //           }
// //         }
// //       });

// //       console.log('Changed fields:', changedFields);

// //       // Only add to updates if there are actual changes
// //       if (Object.keys(changedFields).length > 0) {
// //         // UPDATED: Format for enhanced backend route
// //         const updateRecord = {
// //           ...changedFields,
// //           [primaryKey]: primaryKeyValue // Include the primary key for WHERE clause
// //         };
// //         changes.updates.push(updateRecord);
// //         console.log('Added to updates:', updateRecord);
// //       } else {
// //         console.log('No changes detected for this row');
// //       }
// //     });

// //     // Process additions - remove temp IDs
// //     changes.additions = pendingChanges.additions.map(record => {
// //       const cleanRecord = { ...record };
// //       delete cleanRecord._temp_id;
// //       delete cleanRecord.key;
// //       return cleanRecord;
// //     });

// //     // Process deletions - remove temp IDs, keep only identifying fields
// //     changes.deletions = pendingChanges.deletions.map(record => {
// //       const cleanRecord = {};
      
// //       // Try to find primary key or unique identifier
// //       const possibleKeys = [
// //         'id', 'ID', 'Id', 
// //         'adminid', 'Admin_ID', 'admin_id',
// //         `${selectedTable.toLowerCase()}_id`,
// //         'user_id', 'userId', 'UserID'
// //       ];
// //       for (const key of possibleKeys) {
// //         if (record[key] !== undefined && record[key] !== null) {
// //           cleanRecord[key] = record[key];
// //           break;
// //         }
// //       }

// //       // If no standard key found, include all fields for identification
// //       if (Object.keys(cleanRecord).length === 0) {
// //         Object.keys(record).forEach(key => {
// //           if (key !== '_temp_id' && key !== 'key') {
// //             cleanRecord[key] = record[key];
// //           }
// //         });
// //       }

// //       return cleanRecord;
// //     });

// //     console.log('Final prepared changes:', changes);
// //     return changes;
// //   };

// //   // UPDATED: Enhanced submit changes function using the new backend route
// //   const submitChangesToDatabase = async () => {
// //     const changes = prepareDataForSubmission();
    
// //     if (changes.updates.length === 0 && changes.additions.length === 0 && changes.deletions.length === 0) {
// //       showSnackbar('No changes to submit', 'info');
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       let totalOperations = 0;
// //       let successfulOperations = 0;
// //       let operationResults = [];

// //       // UPDATED: Submit updates using enhanced backend route
// //       if (changes.updates.length > 0) {
// //         console.log('Submitting updates to enhanced route:', changes.updates);
// //         try {
// //           const updateResponse = await axios.put('http://localhost:3000/enhanced-update-table-data', {
// //             tableName: selectedTable,
// //             updates: changes.updates // Note: backend expects 'updates' not 'updatedRows'
// //           }, { 
// //             withCredentials: true,
// //             headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });

// //           console.log('Enhanced update response:', updateResponse.data);

// //           if (updateResponse.data.success) {
// //             successfulOperations += changes.updates.length;
// //             operationResults.push({
// //               type: 'update',
// //               success: true,
// //               count: changes.updates.length,
// //               details: updateResponse.data.results
// //             });
// //           } else {
// //             // Handle partial success (207 status)
// //             if (updateResponse.status === 207) {
// //               const successCount = updateResponse.data.results?.filter(r => r.success).length || 0;
// //               successfulOperations += successCount;
// //               operationResults.push({
// //                 type: 'update',
// //                 success: false,
// //                 count: successCount,
// //                 total: changes.updates.length,
// //                 details: updateResponse.data.results
// //               });
// //             }
// //           }
// //         } catch (error) {
// //           console.error('Enhanced update error:', error.response?.data || error.message);
// //           operationResults.push({
// //             type: 'update',
// //             success: false,
// //             error: error.response?.data?.message || error.message
// //           });
// //         }
// //         totalOperations += changes.updates.length;
// //       }

// //       // Submit additions (using existing route)
// //       if (changes.additions.length > 0) {
// //         console.log('Submitting additions:', changes.additions);
// //         for (const newRecord of changes.additions) {
// //           try {
// //             await axios.post('http://localhost:3000/add-table-record', {
// //               tableName: selectedTable,
// //               newRecord
// //             }, { withCredentials: true });
// //             successfulOperations++;
// //             operationResults.push({
// //               type: 'addition',
// //               success: true,
// //               record: newRecord
// //             });
// //           } catch (error) {
// //             console.error('Error adding record:', error);
// //             operationResults.push({
// //               type: 'addition',
// //               success: false,
// //               error: error.message,
// //               record: newRecord
// //             });
// //           }
// //           totalOperations++;
// //         }
// //       }

// //       // Submit deletions (using existing route)
// //       if (changes.deletions.length > 0) {
// //         console.log('Submitting deletions:', changes.deletions);
// //         for (const recordToDelete of changes.deletions) {
// //           try {
// //             await axios.delete('http://localhost:3000/delete-table-record', {
// //               data: {
// //                 tableName: selectedTable,
// //                 rowData: recordToDelete
// //               },
// //               withCredentials: true
// //             });
// //             successfulOperations++;
// //             operationResults.push({
// //               type: 'deletion',
// //               success: true,
// //               record: recordToDelete
// //             });
// //           } catch (error) {
// //             console.error('Error deleting record:', error);
// //             operationResults.push({
// //               type: 'deletion',
// //               success: false,
// //               error: error.message,
// //               record: recordToDelete
// //             });
// //           }
// //           totalOperations++;
// //         }
// //       }

// //       // Refresh data from server
// //       await fetchTableData(selectedTable);
      
// //       // Enhanced result reporting
// //       if (successfulOperations === totalOperations) {
// //         showSnackbar(`All ${totalOperations} changes submitted successfully!`, 'success');
// //       } else if (successfulOperations > 0) {
// //         showSnackbar(
// //           `${successfulOperations} of ${totalOperations} changes submitted successfully. Some operations failed.`, 
// //           'warning'
// //         );
// //         // Log detailed results for debugging
// //         console.log('Operation results:', operationResults);
// //       } else {
// //         showSnackbar('All operations failed. Check console for details.', 'error');
// //         console.log('All failed. Results:', operationResults);
// //       }
      
// //     } catch (error) {
// //       console.error('Error in submitChangesToDatabase:', error);
// //       showSnackbar('Error submitting changes: ' + (error.response?.data?.message || error.message), 'error');
// //     }
// //     setLoading(false);
// //   };

// //   // Table names pagination handlers - now works with filtered tables
// //   const handlePreviousTablePage = () => {
// //     setCurrentTablePage(prev => Math.max(0, prev - 1));
// //   };

// //   const handleNextTablePage = () => {
// //     setCurrentTablePage(prev => Math.min(totalTablePages - 1, prev + 1));
// //   };

// //   // UPDATED: Get current page tables from filtered results
// //   const getCurrentPageTables = () => {
// //     const startIndex = currentTablePage * tablesPerPage;
// //     const endIndex = startIndex + tablesPerPage;
// //     return filteredTableNames.slice(startIndex, endIndex);
// //   };

// //   const getColumnsData = () => {
// //     const currentTables = getCurrentPageTables();
// //     const columns = [[], [], []];
    
// //     currentTables.forEach((table, index) => {
// //       const columnIndex = Math.floor(index / 5);
// //       if (columnIndex < 3) {
// //         columns[columnIndex].push(table);
// //       }
// //     });
    
// //     return columns;
// //   };

// //   const handleDownloadExcel = () => {
// //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
// //     XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
// //   };

// //   // EDIT FUNCTIONS
// //   const handleEdit = (key) => {
// //     setEditingKey(key);
// //     const row = tableData.find(item => item.key === key);
// //     if (!row) return;
    
// //     // Check if there's a pending change for this row
// //     const tempId = row._temp_id;
// //     const pendingRow = pendingChanges.updates[tempId];
// //     const rowToEdit = pendingRow || row;
// //     setEditedValues({ ...rowToEdit });
// //   };

// //   // Save changes to pending updates with proper data structure
// //   const handleSave = (key) => {
// //     const row = tableData.find(item => item.key === key);
// //     if (!row) return;
    
// //     const tempId = row._temp_id;
    
// //     console.log('Saving changes for tempId:', tempId);
// //     console.log('Edited values:', editedValues);
    
// //     // Stage the changes in pending updates
// //     setPendingChanges(prev => {
// //       const newPendingChanges = {
// //         ...prev,
// //         updates: {
// //           ...prev.updates,
// //           [tempId]: { ...editedValues } // Make sure to spread the edited values
// //         }
// //       };
// //       console.log('New pending changes:', newPendingChanges);
// //       return newPendingChanges;
// //     });
    
// //     // Update the display data with staged changes
// //     setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
// //     setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
    
// //     setEditingKey('');
// //     setEditedValues({});
    
// //     showSnackbar('Changes staged successfully', 'success');
// //   };

// //   const handleCancel = () => {
// //     setEditingKey('');
// //     setEditedValues({});
// //   };

// //   const handleChange = (dataIndex, value) => {
// //     setEditedValues(prev => ({ ...prev, [dataIndex]: value }));
// //   };

// //   const handleImageChange = (dataIndex, event) => {
// //     const file = event.target.files[0];
// //     if (file) {
// //       if (file.size > MAX_IMAGE_SIZE) {
// //         showSnackbar("Image size exceeds 50KB limit", 'error');
// //         return;
// //       }
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         const base64String = reader.result.split(',')[1];
// //         handleChange(dataIndex, base64String);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   // ADD RECORD FUNCTIONS
// //   const handleAddRecord = () => {
// //     setAddDialogOpen(true);
// //     setNewRecord({});
// //     setAddErrors({});
// //   };

// //   const handleAddFieldChange = (field, value) => {
// //     setNewRecord(prev => ({ ...prev, [field]: value }));
// //     setAddErrors(prev => ({ ...prev, [field]: '' }));
// //   };

// //   const handleAddImageUpload = (event, field) => {
// //     const file = event.target.files[0];
// //     if (!file) return;

// //     if (file.size > MAX_IMAGE_SIZE) {
// //       showSnackbar("Image size exceeds 50KB limit", 'error');
// //       setFileInputKey(Date.now());
// //       return;
// //     }

// //     const reader = new FileReader();
// //     reader.onload = () => {
// //       const base64String = reader.result.split(',')[1];
// //       handleAddFieldChange(field, base64String);
// //       setFileInputKey(Date.now());
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   const validateNewRecord = () => {
// //     let errors = {};
// //     columns.forEach(column => {
// //       if (column.dataIndex !== 'key' && column.dataIndex !== '_temp_id' && 
// //           (!newRecord[column.dataIndex] && newRecord[column.dataIndex] !== 0)) {
// //         errors[column.dataIndex] = "Required";
// //       }
// //     });
// //     setAddErrors(errors);
// //     return Object.keys(errors).length === 0;
// //   };

// //   const handleSaveNewRecord = () => {
// //     if (!validateNewRecord()) return;

// //     const newRecordWithTempId = {
// //       ...newRecord,
// //       _temp_id: `temp_add_${Date.now()}`,
// //       key: `new_${Date.now()}`
// //     };

// //     setPendingChanges(prev => ({
// //       ...prev,
// //       additions: [...prev.additions, newRecordWithTempId]
// //     }));

// //     setTableData(prev => [...prev, newRecordWithTempId]);
// //     setFilteredData(prev => [...prev, newRecordWithTempId]);

// //     setAddDialogOpen(false);
// //     setNewRecord({});
// //     showSnackbar('Record staged for addition', 'success');
// //   };

// //   // DELETE RECORD FUNCTIONS
// //   const handleDeleteClick = (row) => {
// //     setRecordToDelete(row);
// //     setDeleteConfirmOpen(true);
// //   };

// //   const handleConfirmDelete = () => {
// //     setPendingChanges(prev => ({
// //       ...prev,
// //       deletions: [...prev.deletions, recordToDelete]
// //     }));

// //     const keyToDelete = recordToDelete.key;
// //     setTableData(prev => prev.filter(item => item.key !== keyToDelete));
// //     setFilteredData(prev => prev.filter(item => item.key !== keyToDelete));

// //     setDeleteConfirmOpen(false);
// //     setRecordToDelete(null);
// //     showSnackbar('Record staged for deletion', 'warning');
// //   };

// //   // IMAGE HANDLING FUNCTIONS
// //   const isImageColumn = (columnName) => {
// //     const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4', 'logo', 'image', 'signature', 'avatar'];
// //     return imageColumns.some(imgCol => columnName.toLowerCase().includes(imgCol));
// //   };

// //   const formatBase64Image = (base64) => {
// //     if (!base64) return '';
// //     return base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
// //   };

// //   const handleImagePreview = (base64Data) => {
// //     if (!base64Data) return;
// //     const imageUrl = formatBase64Image(base64Data);
// //     window.open(imageUrl, '_blank');
// //   };

// //   // FILTER FUNCTIONS - THESE ARE THE ONES THAT WERE UPDATED
// //   const handleFilterChange = (columnName, value) => {
// //     setFilters(prevFilters => ({
// //       ...prevFilters,
// //       [columnName]: {
// //         ...prevFilters[columnName],
// //         selected: value
// //       }
// //     }));
// //   };

// //   const handleSearchChange = (columnName, value) => {
// //     setFilters(prevFilters => ({
// //       ...prevFilters,
// //       [columnName]: {
// //         ...prevFilters[columnName],
// //         value: value
// //       }
// //     }));
// //   };

// //   // Material UI table pagination handlers
// //   const handleChangePage = (event, newPage) => {
// //     setCurrentPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setCurrentPage(0);
// //   };

// //   // HELPER FUNCTIONS for pending changes status
// //   const isRowPending = (row) => {
// //     const tempId = row._temp_id;
// //     return pendingChanges.updates.hasOwnProperty(tempId) ||
// //            pendingChanges.additions.some(add => add._temp_id === tempId) ||
// //            pendingChanges.deletions.some(del => del._temp_id === tempId);
// //   };

// //   const getPendingChangesCount = () => {
// //     return Object.keys(pendingChanges.updates).length + 
// //            pendingChanges.additions.length + 
// //            pendingChanges.deletions.length;
// //   };

// //   // DIALOG COMPONENTS
// //   const renderAddRecordDialog = () => (
// //     <Dialog 
// //       open={addDialogOpen} 
// //       onClose={() => setAddDialogOpen(false)}
// //       maxWidth="md"
// //       fullWidth
// //     >
// //       <DialogTitle>Add New Record to {selectedTable}</DialogTitle>
// //       <DialogContent>
// //         <Grid container spacing={2} sx={{ mt: 1 }}>
// //           {columns.filter(col => col.dataIndex !== 'key' && col.dataIndex !== '_temp_id').map((column) => (
// //             <Grid item xs={12} sm={6} key={column.dataIndex}>
// //               {isImageColumn(column.dataIndex) ? (
// //                 <Box>
// //                   <InputLabel>{column.title}</InputLabel>
// //                   <input
// //                     key={fileInputKey}
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={(e) => handleAddImageUpload(e, column.dataIndex)}
// //                     style={{ width: '100%', marginTop: '8px' }}
// //                   />
// //                   {addErrors[column.dataIndex] && (
// //                     <Typography color="error" variant="caption">
// //                       {addErrors[column.dataIndex]}
// //                     </Typography>
// //                   )}
// //                   {newRecord[column.dataIndex] && (
// //                     <Box sx={{ mt: 1 }}>
// //                       <img 
// //                         src={formatBase64Image(newRecord[column.dataIndex])}
// //                         alt="Preview"
// //                         style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
// //                         onClick={() => handleImagePreview(newRecord[column.dataIndex])}
// //                       />
// //                     </Box>
// //                   )}
// //                 </Box>
// //               ) : (
// //                 <TextField
// //                   fullWidth
// //                   label={column.title}
// //                   value={newRecord[column.dataIndex] || ''}
// //                   onChange={(e) => handleAddFieldChange(column.dataIndex, e.target.value)}
// //                   error={!!addErrors[column.dataIndex]}
// //                   helperText={addErrors[column.dataIndex]}
// //                   size="small"
// //                 />
// //               )}
// //             </Grid>
// //           ))}
// //         </Grid>
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
// //         <Button onClick={handleSaveNewRecord} variant="contained" color="primary">
// //           Stage Record
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );

// //   const renderDeleteConfirmation = () => (
// //     <Dialog 
// //       open={deleteConfirmOpen} 
// //       onClose={() => setDeleteConfirmOpen(false)}
// //     >
// //       <DialogTitle>Confirm Delete</DialogTitle>
// //       <DialogContent>
// //         <Typography>Are you sure you want to stage this record for deletion?</Typography>
// //         {recordToDelete && (
// //           <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
// //             The record will be deleted when you submit changes.
// //           </Typography>
// //         )}
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
// //         <Button onClick={handleConfirmDelete} variant="contained" color="error">
// //           Stage for Deletion
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );

// //   // UPDATED: Table names component with search functionality
// //   const renderTableNames = () => {
// //     if (tableNames.length === 0) return null;

// //     const columnsData = getColumnsData();

// //     return (
// //       <Card sx={{ 
// //         maxWidth: '100%', 
// //         mx: 'auto', 
// //         mt: 4, 
// //         boxShadow: 3,
// //         overflow: 'hidden'
// //       }}>
// //         <CardContent>
// //           <Typography variant="h5" component="h2" gutterBottom sx={{ 
// //             display: 'flex', 
// //             alignItems: 'center',
// //             justifyContent: 'center',
// //             mb: 3,
// //             fontWeight: 600
// //           }}>
// //             <TableViewIcon sx={{ mr: 1.5, color: 'primary.main' }} /> 
// //             Available Tables
// //           </Typography>

// //           {/* NEW: Table Search Bar */}
// //           <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
// //             <TextField
// //               fullWidth
// //               variant="outlined"
// //               placeholder="Search table names..."
// //               value={tableSearchQuery}
// //               onChange={handleTableSearchChange}
// //               sx={{ maxWidth: 400 }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <SearchIcon color="action" />
// //                   </InputAdornment>
// //                 ),
// //                 endAdornment: tableSearchQuery && (
// //                   <InputAdornment position="end">
// //                     <IconButton
// //                       aria-label="clear search"
// //                       onClick={handleClearTableSearch}
// //                       edge="end"
// //                       size="small"
// //                     >
// //                       <ClearIcon />
// //                     </IconButton>
// //                   </InputAdornment>
// //                 )
// //               }}
// //             />
// //           </Box>

// //           {/* Show search results info */}
// //           {tableSearchQuery && (
// //             <Box sx={{ textAlign: 'center', mb: 2 }}>
// //               <Typography variant="body2" color="text.secondary">
// //                 Found {filteredTableNames.length} table{filteredTableNames.length !== 1 ? 's' : ''} matching "{tableSearchQuery}"
// //               </Typography>
// //             </Box>
// //           )}

// //           {filteredTableNames.length === 0 ? (
// //             <Box sx={{ textAlign: 'center', py: 4 }}>
// //               <Typography variant="h6" color="text.secondary">
// //                 {tableSearchQuery ? 'No tables found matching your search' : 'No tables available'}
// //               </Typography>
// //               {tableSearchQuery && (
// //                 <Button 
// //                   variant="outlined" 
// //                   onClick={handleClearTableSearch}
// //                   sx={{ mt: 2 }}
// //                 >
// //                   Clear Search
// //                 </Button>
// //               )}
// //             </Box>
// //           ) : (
// //             <>
// //               <Box sx={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'space-between', 
// //                 alignItems: 'center',
// //                 mb: 3,
// //                 px: 1
// //               }}>
// //                 <IconButton 
// //                   onClick={handlePreviousTablePage}
// //                   disabled={currentTablePage === 0 || totalTablePages <= 1}
// //                   sx={{ 
// //                     backgroundColor: 'primary.main',
// //                     color: 'white',
// //                     '&:hover': {
// //                       backgroundColor: 'primary.dark',
// //                     },
// //                     '&:disabled': {
// //                       backgroundColor: 'grey.300',
// //                       color: 'grey.500'
// //                     }
// //                   }}
// //                 >
// //                   <ChevronLeftIcon />
// //                 </IconButton>

// //                 <Typography variant="body2" sx={{ 
// //                   fontWeight: 500,
// //                   color: 'text.secondary'
// //                 }}>
// //                   {totalTablePages > 1 ? (
// //                     <>
// //                       Page {currentTablePage + 1} of {totalTablePages} 
// //                       <Typography component="span" sx={{ ml: 1, fontSize: '0.875rem' }}>
// //                         ({filteredTableNames.length} table{filteredTableNames.length !== 1 ? 's' : ''})
// //                       </Typography>
// //                     </>
// //                   ) : (
// //                     `${filteredTableNames.length} table${filteredTableNames.length !== 1 ? 's' : ''}`
// //                   )}
// //                 </Typography>

// //                 <IconButton 
// //                   onClick={handleNextTablePage}
// //                   disabled={currentTablePage === totalTablePages - 1 || totalTablePages <= 1}
// //                   sx={{ 
// //                     backgroundColor: 'primary.main',
// //                     color: 'white',
// //                     '&:hover': {
// //                       backgroundColor: 'primary.dark',
// //                     },
// //                     '&:disabled': {
// //                       backgroundColor: 'grey.300',
// //                       color: 'grey.500'
// //                     }
// //                   }}
// //                 >
// //                   <ChevronRightIcon />
// //                 </IconButton>
// //               </Box>
              
// //               <Box sx={{ 
// //                 display: 'flex',
// //                 justifyContent: 'center',
// //                 width: '100%'
// //               }}>
// //                 <Box sx={{ 
// //                   display: isSmallScreen ? 'block' : 'flex',
// //                   gap: 4,
// //                   maxWidth: '1000px',
// //                   width: '100%'
// //                 }}>
// //                   {columnsData.map((columnTables, columnIndex) => (
// //                     <Box 
// //                       key={columnIndex}
// //                       sx={{ 
// //                         flex: 1,
// //                         display: 'flex',
// //                         flexDirection: 'column',
// //                         gap: 2,
// //                         mb: isSmallScreen ? 3 : 0
// //                       }}
// //                     >
// //                       {columnTables.map((table, tableIndex) => (
// //                         <Button
// //                           key={`${currentTablePage}-${columnIndex}-${tableIndex}`}
// //                           variant="outlined"
// //                           onClick={() => handleTableSelect(table)}
// //                           sx={{
// //                             width: '100%',
// //                             height: '50px',
// //                             borderRadius: 2,
// //                             textTransform: 'none',
// //                             fontSize: '0.875rem',
// //                             fontWeight: 500,
// //                             border: '2px solid',
// //                             borderColor: 'primary.main',
// //                             color: 'primary.main',
// //                             backgroundColor: 'transparent',
// //                             transition: 'all 0.3s ease',
// //                             '&:hover': {
// //                               backgroundColor: 'primary.main',
// //                               color: 'white',
// //                               transform: 'translateY(-2px)',
// //                               boxShadow: 2
// //                             }
// //                           }}
// //                         >
// //                           <Typography 
// //                             variant="body2" 
// //                             sx={{ 
// //                               whiteSpace: 'nowrap',
// //                               overflow: 'hidden',
// //                               textOverflow: 'ellipsis',
// //                               width: '100%'
// //                             }}
// //                           >
// //                             {table}
// //                           </Typography>
// //                         </Button>
// //                       ))}
// //                     </Box>
// //                   ))}
// //                 </Box>
// //               </Box>

// //               {totalTablePages > 1 && (
// //                 <Box sx={{ 
// //                   display: 'flex', 
// //                   justifyContent: 'center', 
// //                   mt: 3,
// //                   gap: 1
// //                 }}>
// //                   {Array.from({ length: totalTablePages }).map((_, index) => (
// //                     <Box
// //                       key={index}
// //                       onClick={() => setCurrentTablePage(index)}
// //                       sx={{
// //                         width: 8,
// //                         height: 8,
// //                         borderRadius: '50%',
// //                         backgroundColor: index === currentTablePage ? 'primary.main' : 'grey.300',
// //                         cursor: 'pointer',
// //                         transition: 'all 0.2s ease',
// //                         '&:hover': {
// //                           backgroundColor: index === currentTablePage ? 'primary.dark' : 'grey.400',
// //                           transform: 'scale(1.2)'
// //                         }
// //                       }}
// //                     />
// //                   ))}
// //                 </Box>
// //               )}
// //             </>
// //           )}
// //         </CardContent>
// //       </Card>
// //     );
// //   };

// //   const renderFilterRow = () => {
// //     return (
// //       <TableRow>
// //         {columns.map(column => (
// //           <TableCell key={column.key} sx={{ p: 1 }}>
// //             {filters[column.dataIndex]?.type === 'dropdown' ? (
// //               <FormControl fullWidth size="small">
// //                 <Select
// //                   value={filters[column.dataIndex].selected || ''}
// //                   onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
// //                   displayEmpty
// //                 >
// //                   <MenuItem value="">All</MenuItem>
// //                   {filters[column.dataIndex].values.map(value => (
// //                     <MenuItem key={value} value={value}>{value}</MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             ) : (
// //               <TextField
// //                 fullWidth
// //                 size="small"
// //                 placeholder="Search..."
// //                 value={filters[column.dataIndex]?.value || ''}
// //                 onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
// //               />
// //             )}
// //           </TableCell>
// //         ))}
// //         <TableCell sx={{ p: 1 }}>
// //           <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
// //             Filters
// //           </Typography>
// //         </TableCell>
// //       </TableRow>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
// //       {!showTableView ? (
// //         <>
// //           <Box sx={{ textAlign: 'center', mb: 5 }}>
// //             <Typography variant="h3" component="h1" gutterBottom sx={{ 
// //               color: 'primary.main', 
// //               mb: 3,
// //               fontWeight: 600
// //             }}>
// //               Super Admin Dashboard
// //             </Typography>
// //             <Typography variant="h6" sx={{ color: 'text.secondary' }}>
// //               Select a table to view and manage its data
// //             </Typography>
// //           </Box>
          
// //           {tableNames.length === 0 ? (
// //             <Card sx={{ mt: 4, textAlign: 'center', p: 4 }}>
// //               <Typography variant="h6" color="text.secondary">
// //                 No tables found
// //               </Typography>
// //               <Typography variant="body1" color="text.secondary">
// //                 Please check your database connection
// //               </Typography>
// //             </Card>
// //           ) : (
// //             renderTableNames()
// //           )}
// //         </>
// //       ) : (
// //         <>
// //           <Box sx={{
// //             display: 'flex',
// //             justifyContent: 'space-between',
// //             alignItems: 'center',
// //             mb: 4,
// //             flexWrap: 'wrap',
// //             gap: 2
// //           }}>
// //             <Typography variant="h4" component="h2" sx={{ color: 'primary.main', fontWeight: 600 }}>
// //               {selectedTable}
// //             </Typography>
// //             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
// //               <Button 
// //                 variant="contained"
// //                 color="primary"
// //                 startIcon={<AddIcon />}
// //                 onClick={handleAddRecord}
// //               >
// //                 Add Record
// //               </Button>
// //               <Button 
// //                 variant="contained"
// //                 color="success"
// //                 startIcon={<DownloadIcon />}
// //                 onClick={handleDownloadExcel}
// //               >
// //                 Download Excel
// //               </Button>
// //               <Button 
// //                 variant="contained"
// //                 color="warning"
// //                 onClick={submitChangesToDatabase} 
// //                 disabled={getPendingChangesCount() === 0}
// //                 sx={{
// //                   color: 'white',
// //                   '&:disabled': {
// //                     backgroundColor: 'grey.300',
// //                     color: 'grey.500'
// //                   }
// //                 }}
// //               >
// //                 Submit Changes ({getPendingChangesCount()})
// //               </Button>
// //             </Box>
// //           </Box>

// //           <Paper elevation={3} sx={{ overflow: 'hidden' }}>
// //             <TableContainer sx={{
// //               maxHeight: 'calc(100vh - 200px)',
// //               maxWidth: '100%',
// //               '&::-webkit-scrollbar': {
// //                 height: '8px',
// //                 width: '8px'
// //               },
// //               '&::-webkit-scrollbar-thumb': {
// //                 backgroundColor: 'primary.main',
// //                 borderRadius: '4px'
// //               }
// //             }}>
// //               <Table stickyHeader aria-label="sticky table" size="small">
// //                 <TableHead>
// //                   <TableRow>
// //                     {columns.map((col) => (
// //                       <TableCell
// //                         key={col.key}
// //                         sx={{
// //                           fontWeight: 'bold',
// //                           backgroundColor: 'primary.main',
// //                           color: 'primary.contrastText',
// //                           whiteSpace: 'nowrap'
// //                         }}
// //                       >
// //                         {col.title}
// //                       </TableCell>
// //                     ))}
// //                     <TableCell
// //                       sx={{
// //                         fontWeight: 'bold',
// //                         backgroundColor: 'primary.main',
// //                         color: 'primary.contrastText',
// //                         width: '150px'
// //                       }}
// //                     >
// //                       Actions
// //                     </TableCell>
// //                   </TableRow>
// //                   {renderFilterRow()}
// //                 </TableHead>
// //                 <TableBody>
// //                   {filteredData
// //                     .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
// //                     .map((row) => (
// //                       <TableRow
// //                         key={row.key}
// //                         sx={{
// //                           backgroundColor: isRowPending(row) 
// //                             ? 'rgba(255, 193, 7, 0.1)' 
// //                             : 'inherit',
// //                           '&:nth-of-type(even)': {
// //                             backgroundColor: isRowPending(row)
// //                               ? 'rgba(255, 193, 7, 0.15)'
// //                               : 'action.hover'
// //                           },
// //                           '&:hover': {
// //                             backgroundColor: isRowPending(row)
// //                               ? 'rgba(255, 193, 7, 0.2)'
// //                               : 'action.selected'
// //                           },
// //                           borderLeft: isRowPending(row) 
// //                             ? '3px solid #ff9800' 
// //                             : 'none'
// //                         }}
// //                       >
// //                         {columns.map((col) => (
// //                           <TableCell key={col.key}>
// //                             {editingKey === row.key ? (
// //                               isImageColumn(col.dataIndex) ? (
// //                                 <input
// //                                   type="file"
// //                                   accept="image/*"
// //                                   onChange={(e) => handleImageChange(col.dataIndex, e)}
// //                                   style={{ width: '100%' }}
// //                                 />
// //                               ) : (
// //                                 <TextField
// //                                   fullWidth
// //                                   size="small"
// //                                   value={editedValues[col.dataIndex] || ''}
// //                                   onChange={(e) => handleChange(col.dataIndex, e.target.value)}
// //                                 />
// //                               )
// //                             ) : (
// //                               isImageColumn(col.dataIndex) ? (
// //                                 <img 
// //                                   src={formatBase64Image(row[col.dataIndex])} 
// //                                   alt={col.dataIndex}
// //                                   style={{
// //                                     maxWidth: '60px',
// //                                     maxHeight: '60px',
// //                                     objectFit: 'cover',
// //                                     borderRadius: '4px',
// //                                     cursor: 'pointer'
// //                                   }}
// //                                   onClick={() => handleImagePreview(row[col.dataIndex])}
// //                                 />
// //                               ) : (
// //                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //                                   <Typography variant="body2" sx={{
// //                                     maxWidth: '200px',
// //                                     overflow: 'hidden',
// //                                     textOverflow: 'ellipsis',
// //                                     whiteSpace: 'nowrap'
// //                                   }}>
// //                                     {typeof row[col.dataIndex] === 'string' && row[col.dataIndex].length > 100
// //                                       ? `${row[col.dataIndex].substring(0, 100)}...`
// //                                       : row[col.dataIndex]}
// //                                   </Typography>
// //                                   {isRowPending(row) && col.dataIndex === columns[0].dataIndex && (
// //                                     <Typography 
// //                                       variant="caption" 
// //                                       sx={{ 
// //                                         color: 'orange', 
// //                                         fontWeight: 'bold',
// //                                         fontSize: '10px'
// //                                       }}
// //                                     >
// //                                       PENDING
// //                                     </Typography>
// //                                   )}
// //                                 </Box>
// //                               )
// //                             )}
// //                           </TableCell>
// //                         ))}
// //                         <TableCell>
// //                           <Box sx={{ display: 'flex', gap: 1 }}>
// //                             {editingKey === row.key ? (
// //                               <>
// //                                 <IconButton
// //                                   color="success"
// //                                   onClick={() => handleSave(row.key)}
// //                                   size="small"
// //                                   title="Stage changes"
// //                                 >
// //                                   <SaveIcon />
// //                                 </IconButton>
// //                                 <IconButton
// //                                   color="error"
// //                                   onClick={handleCancel}
// //                                   size="small"
// //                                 >
// //                                   <CancelIcon />
// //                                 </IconButton>
// //                               </>
// //                             ) : (
// //                               <>
// //                                 <IconButton
// //                                   color="primary"
// //                                   onClick={() => handleEdit(row.key)}
// //                                   size="small"
// //                                 >
// //                                   <EditIcon />
// //                                 </IconButton>
// //                                 <IconButton
// //                                   color="error"
// //                                   onClick={() => handleDeleteClick(row)}
// //                                   size="small"
// //                                 >
// //                                   <DeleteIcon />
// //                                 </IconButton>
// //                               </>
// //                             )}
// //                           </Box>
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                 </TableBody>
// //               </Table>
// //             </TableContainer>
// //             <TablePagination
// //               rowsPerPageOptions={[10, 25, 50, 100]}
// //               component="div"
// //               count={filteredData.length}
// //               rowsPerPage={rowsPerPage}
// //               page={currentPage}
// //               onPageChange={handleChangePage}
// //               onRowsPerPageChange={handleChangeRowsPerPage}
// //               sx={{
// //                 '& .MuiTablePagination-toolbar': {
// //                   paddingLeft: 2,
// //                   paddingRight: 1
// //                 }
// //               }}
// //             />
// //           </Paper>

// //           {/* DIALOGS */}
// //           {renderAddRecordDialog()}
// //           {renderDeleteConfirmation()}
// //         </>
// //       )}

// //       {/* Snackbar for notifications */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={6000}
// //         onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
// //         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// //       >
// //         <Alert 
// //           onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
// //           severity={snackbar.severity}
// //           sx={{ width: '100%' }}
// //         >
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default SuperAdminDashboard;



// // SuperAdminDashboard.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { 
//   Table, 
//   ChevronLeft, 
//   ChevronRight, 
//   Edit, 
//   Save, 
//   X, 
//   Download, 
//   Plus, 
//   Trash2, 
//   Search, 
//   XCircle,
//   Database,
//   FileText
// } from 'lucide-react';

// const SuperAdminDashboard = () => {
//   const [tableNames, setTableNames] = useState([]);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [tableData, setTableData] = useState([]);
//   const [originalData, setOriginalData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [editingKey, setEditingKey] = useState('');
//   const [editedValues, setEditedValues] = useState({});
  
//   // Enhanced pending changes structure
//   const [pendingChanges, setPendingChanges] = useState({
//     updates: {},
//     additions: [],
//     deletions: []
//   });
  
//   const [currentPage, setCurrentPage] = useState(0);
//   const [filters, setFilters] = useState({});
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [showTableView, setShowTableView] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // CRUD OPERATIONS STATE
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [newRecord, setNewRecord] = useState({});
//   const [addErrors, setAddErrors] = useState({});
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [recordToDelete, setRecordToDelete] = useState(null);
//   const [fileInputKey, setFileInputKey] = useState(Date.now());
  
//   // Snackbar state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'info'
//   });

//   // TABLE SEARCH FUNCTIONALITY - NEW STATE
//   const [tableSearchQuery, setTableSearchQuery] = useState('');
//   const [filteredTableNames, setFilteredTableNames] = useState([]);
  
//   const MAX_IMAGE_SIZE = 50 * 1024; // 50KB

//   // Responsive check
//   const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

//   // Table names pagination state - now works with filtered tables
//   const [currentTablePage, setCurrentTablePage] = useState(0);
//   const tablesPerPage = 12;
//   const totalTablePages = Math.ceil(filteredTableNames.length / tablesPerPage);

//   useEffect(() => {
//     fetchTableNames();
    
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 768);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // NEW: Filter table names based on search query
//   useEffect(() => {
//     if (tableSearchQuery.trim() === '') {
//       setFilteredTableNames(tableNames);
//     } else {
//       const filtered = tableNames.filter(tableName =>
//         tableName.toLowerCase().includes(tableSearchQuery.toLowerCase())
//       );
//       setFilteredTableNames(filtered);
//     }
//     setCurrentTablePage(0);
//   }, [tableNames, tableSearchQuery]);

//   // FIXED: Apply filters with useCallback
//   const applyFilters = useCallback(() => {
//     let newFilteredData = [...tableData];
    
//     Object.keys(filters).forEach(columnName => {
//       const filter = filters[columnName];
      
//       if (filter.type === 'dropdown' && filter.selected !== '' && filter.selected !== null && filter.selected !== undefined) {
//         newFilteredData = newFilteredData.filter(row => {
//           const cellValue = row[columnName];
//           if (cellValue === null || cellValue === undefined) return false;
//           return cellValue.toString() === filter.selected.toString();
//         });
//       } 
//       else if (filter.type === 'search' && filter.value && filter.value.trim() !== '') {
//         newFilteredData = newFilteredData.filter(row => {
//           const cellValue = row[columnName];
//           if (cellValue === null || cellValue === undefined) return false;
//           return cellValue.toString().toLowerCase().includes(filter.value.toLowerCase());
//         });
//       }
//     });
    
//     setFilteredData(newFilteredData);
//     setCurrentPage(0);
//   }, [tableData, filters]);

//   useEffect(() => {
//     if (selectedTable) {
//       applyFilters();
//     }
//   }, [filters, tableData, selectedTable, applyFilters]);

//   // Handle browser back button navigation
//   useEffect(() => {
//     const handlePopState = () => {
//       if (showTableView) {
//         setShowTableView(false);
//         setSelectedTable(null);
//         setTableData([]);
//         setOriginalData([]);
//         setFilteredData([]);
//         setColumns([]);
//         setCurrentPage(0);
//         setRowsPerPage(10);
//         setPendingChanges({ updates: {}, additions: [], deletions: [] });
//       }
//     };

//     window.addEventListener('popstate', handlePopState);
//     return () => window.removeEventListener('popstate', handlePopState);
//   }, [showTableView]);

//   // Snackbar helper function
//   const showSnackbar = (message, severity = 'info') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const fetchTableNames = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:3000/fetch-table-names', {
//         withCredentials: true
//       });
//       setTableNames(response.data);
//     } catch (error) {
//       console.error('Error fetching table names:', error);
//       showSnackbar('Error fetching table names', 'error');
//     }
//     setLoading(false);
//   };

//   const fetchTableData = async (tableName) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:3000/fetch-table-data', {
//         tableName
//       }, {
//         withCredentials: true
//       });
      
//       const dataWithTempIds = response.data.map((item, index) => ({ 
//         ...item, 
//         _temp_id: `temp_${Date.now()}_${index}`,
//         key: index.toString() 
//       }));
      
//       setTableData(dataWithTempIds);
//       setOriginalData(JSON.parse(JSON.stringify(dataWithTempIds)));
//       setFilteredData(dataWithTempIds);
      
//       if (dataWithTempIds.length > 0) {
//         const tableColumns = Object.keys(dataWithTempIds[0])
//           .filter(key => key !== '_temp_id')
//           .map(key => ({
//             title: key,
//             dataIndex: key,
//             key: key,
//           }));
//         setColumns(tableColumns);
//         initializeFilters(dataWithTempIds, tableColumns);
//       }
//       setCurrentPage(0);
//       setPendingChanges({ updates: {}, additions: [], deletions: [] });
//     } catch (error) {
//       console.error('Error fetching table data:', error);
//       showSnackbar('Error fetching table data', 'error');
//     }
//     setLoading(false);
//   };

//   const initializeFilters = (data, columns) => {
//     const newFilters = {};
//     columns.forEach(column => {
//       if (column.dataIndex === '_temp_id') return;
//       const uniqueValues = [...new Set(data.map(item => item[column.dataIndex]))];
//       if (uniqueValues.length <= 20) {
//         newFilters[column.dataIndex] = {
//           type: 'dropdown',
//           values: uniqueValues,
//           selected: ''
//         };
//       } else {
//         newFilters[column.dataIndex] = {
//           type: 'search',
//           value: ''
//         };
//       }
//     });
//     setFilters(newFilters);
//   };

//   const handleTableSelect = (tableName) => {
//     window.history.pushState({ showTableView: false }, '', window.location.pathname);
//     setSelectedTable(tableName);
//     setShowTableView(true);
//     fetchTableData(tableName);
//   };

//   const handleTableSearchChange = (event) => {
//     setTableSearchQuery(event.target.value);
//   };

//   const handleClearTableSearch = () => {
//     setTableSearchQuery('');
//   };

//   const prepareDataForSubmission = () => {
//     console.log('=== prepareDataForSubmission DEBUG ===');
//     console.log('pendingChanges:', pendingChanges);
//     console.log('originalData:', originalData);
    
//     const changes = {
//       updates: [],
//       additions: [],
//       deletions: []
//     };

//     Object.entries(pendingChanges.updates).forEach(([tempId, updatedRow]) => {
//       console.log(`Processing update for tempId: ${tempId}`, updatedRow);
      
//       const originalRow = originalData.find(row => row._temp_id === tempId);
//       if (!originalRow) {
//         console.warn(`Original row not found for tempId: ${tempId}`);
//         return;
//       }

//       console.log('Original row:', originalRow);

//       const possiblePrimaryKeys = [
//         'id', 'ID', 'Id', 
//         'adminid', 'Admin_ID', 'admin_id',
//         `${selectedTable.toLowerCase()}_id`,
//         'user_id', 'userId', 'UserID'
//       ];
//       let primaryKey = null;
//       let primaryKeyValue = null;

//       for (const key of possiblePrimaryKeys) {
//         if (originalRow[key] !== undefined && originalRow[key] !== null) {
//           primaryKey = key;
//           primaryKeyValue = originalRow[key];
//           break;
//         }
//       }

//       if (!primaryKey) {
//         const validKeys = Object.keys(originalRow).filter(k => k !== '_temp_id' && k !== 'key');
//         if (validKeys.length > 0) {
//           primaryKey = validKeys[0];
//           primaryKeyValue = originalRow[primaryKey];
//         }
//       }

//       if (!primaryKey) {
//         console.error('Could not find primary key for row:', originalRow);
//         return;
//       }

//       console.log(`Using primary key: ${primaryKey} = ${primaryKeyValue}`);

//       const changedFields = {};
//       Object.keys(updatedRow).forEach(key => {
//         if (key !== '_temp_id' && key !== 'key') {
//           const originalValue = originalRow[key];
//           const updatedValue = updatedRow[key];
          
//           const originalStr = originalValue === null || originalValue === undefined ? '' : String(originalValue);
//           const updatedStr = updatedValue === null || updatedValue === undefined ? '' : String(updatedValue);
          
//           if (originalStr !== updatedStr) {
//             changedFields[key] = updatedValue;
//             console.log(`Field changed - ${key}: "${originalValue}" -> "${updatedValue}"`);
//           }
//         }
//       });

//       console.log('Changed fields:', changedFields);

//       if (Object.keys(changedFields).length > 0) {
//         const updateRecord = {
//           ...changedFields,
//           [primaryKey]: primaryKeyValue
//         };
//         changes.updates.push(updateRecord);
//         console.log('Added to updates:', updateRecord);
//       } else {
//         console.log('No changes detected for this row');
//       }
//     });

//     changes.additions = pendingChanges.additions.map(record => {
//       const cleanRecord = { ...record };
//       delete cleanRecord._temp_id;
//       delete cleanRecord.key;
//       return cleanRecord;
//     });

//     changes.deletions = pendingChanges.deletions.map(record => {
//       const cleanRecord = {};
      
//       const possibleKeys = [
//         'id', 'ID', 'Id', 
//         'adminid', 'Admin_ID', 'admin_id',
//         `${selectedTable.toLowerCase()}_id`,
//         'user_id', 'userId', 'UserID'
//       ];
//       for (const key of possibleKeys) {
//         if (record[key] !== undefined && record[key] !== null) {
//           cleanRecord[key] = record[key];
//           break;
//         }
//       }

//       if (Object.keys(cleanRecord).length === 0) {
//         Object.keys(record).forEach(key => {
//           if (key !== '_temp_id' && key !== 'key') {
//             cleanRecord[key] = record[key];
//           }
//         });
//       }

//       return cleanRecord;
//     });

//     console.log('Final prepared changes:', changes);
//     return changes;
//   };

//   const submitChangesToDatabase = async () => {
//     const changes = prepareDataForSubmission();
    
//     if (changes.updates.length === 0 && changes.additions.length === 0 && changes.deletions.length === 0) {
//       showSnackbar('No changes to submit', 'info');
//       return;
//     }

//     setLoading(true);
//     try {
//       let totalOperations = 0;
//       let successfulOperations = 0;
//       let operationResults = [];

//       if (changes.updates.length > 0) {
//         console.log('Submitting updates to enhanced route:', changes.updates);
//         try {
//           const updateResponse = await axios.put('http://localhost:3000/enhanced-update-table-data', {
//             tableName: selectedTable,
//             updates: changes.updates
//           }, { 
//             withCredentials: true,
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });

//           console.log('Enhanced update response:', updateResponse.data);

//           if (updateResponse.data.success) {
//             successfulOperations += changes.updates.length;
//             operationResults.push({
//               type: 'update',
//               success: true,
//               count: changes.updates.length,
//               details: updateResponse.data.results
//             });
//           } else {
//             if (updateResponse.status === 207) {
//               const successCount = updateResponse.data.results?.filter(r => r.success).length || 0;
//               successfulOperations += successCount;
//               operationResults.push({
//                 type: 'update',
//                 success: false,
//                 count: successCount,
//                 total: changes.updates.length,
//                 details: updateResponse.data.results
//               });
//             }
//           }
//         } catch (error) {
//           console.error('Enhanced update error:', error.response?.data || error.message);
//           operationResults.push({
//             type: 'update',
//             success: false,
//             error: error.response?.data?.message || error.message
//           });
//         }
//         totalOperations += changes.updates.length;
//       }

//       if (changes.additions.length > 0) {
//         console.log('Submitting additions:', changes.additions);
//         for (const newRecord of changes.additions) {
//           try {
//             await axios.post('http://localhost:3000/add-table-record', {
//               tableName: selectedTable,
//               newRecord
//             }, { withCredentials: true });
//             successfulOperations++;
//             operationResults.push({
//               type: 'addition',
//               success: true,
//               record: newRecord
//             });
//           } catch (error) {
//             console.error('Error adding record:', error);
//             operationResults.push({
//               type: 'addition',
//               success: false,
//               error: error.message,
//               record: newRecord
//             });
//           }
//           totalOperations++;
//         }
//       }

//       if (changes.deletions.length > 0) {
//         console.log('Submitting deletions:', changes.deletions);
//         for (const recordToDelete of changes.deletions) {
//           try {
//             await axios.delete('http://localhost:3000/delete-table-record', {
//               data: {
//                 tableName: selectedTable,
//                 rowData: recordToDelete
//               },
//               withCredentials: true
//             });
//             successfulOperations++;
//             operationResults.push({
//               type: 'deletion',
//               success: true,
//               record: recordToDelete
//             });
//           } catch (error) {
//             console.error('Error deleting record:', error);
//             operationResults.push({
//               type: 'deletion',
//               success: false,
//               error: error.message,
//               record: recordToDelete
//             });
//           }
//           totalOperations++;
//         }
//       }

//       await fetchTableData(selectedTable);
      
//       if (successfulOperations === totalOperations) {
//         showSnackbar(`All ${totalOperations} changes submitted successfully!`, 'success');
//       } else if (successfulOperations > 0) {
//         showSnackbar(
//           `${successfulOperations} of ${totalOperations} changes submitted successfully. Some operations failed.`, 
//           'warning'
//         );
//         console.log('Operation results:', operationResults);
//       } else {
//         showSnackbar('All operations failed. Check console for details.', 'error');
//         console.log('All failed. Results:', operationResults);
//       }
      
//     } catch (error) {
//       console.error('Error in submitChangesToDatabase:', error);
//       showSnackbar('Error submitting changes: ' + (error.response?.data?.message || error.message), 'error');
//     }
//     setLoading(false);
//   };

//   const handlePreviousTablePage = () => {
//     setCurrentTablePage(prev => Math.max(0, prev - 1));
//   };

//   const handleNextTablePage = () => {
//     setCurrentTablePage(prev => Math.min(totalTablePages - 1, prev + 1));
//   };

//   const getCurrentPageTables = () => {
//     const startIndex = currentTablePage * tablesPerPage;
//     const endIndex = startIndex + tablesPerPage;
//     return filteredTableNames.slice(startIndex, endIndex);
//   };

//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
//   };

//   // EDIT FUNCTIONS
//   const handleEdit = (key) => {
//     setEditingKey(key);
//     const row = tableData.find(item => item.key === key);
//     if (!row) return;
    
//     const tempId = row._temp_id;
//     const pendingRow = pendingChanges.updates[tempId];
//     const rowToEdit = pendingRow || row;
//     setEditedValues({ ...rowToEdit });
//   };

//   const handleSave = (key) => {
//     const row = tableData.find(item => item.key === key);
//     if (!row) return;
    
//     const tempId = row._temp_id;
    
//     console.log('Saving changes for tempId:', tempId);
//     console.log('Edited values:', editedValues);
    
//     setPendingChanges(prev => {
//       const newPendingChanges = {
//         ...prev,
//         updates: {
//           ...prev.updates,
//           [tempId]: { ...editedValues }
//         }
//       };
//       console.log('New pending changes:', newPendingChanges);
//       return newPendingChanges;
//     });
    
//     setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
//     setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
    
//     setEditingKey('');
//     setEditedValues({});
    
//     showSnackbar('Changes staged successfully', 'success');
//   };

//   const handleCancel = () => {
//     setEditingKey('');
//     setEditedValues({});
//   };

//   const handleChange = (dataIndex, value) => {
//     setEditedValues(prev => ({ ...prev, [dataIndex]: value }));
//   };

//   const handleImageChange = (dataIndex, event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > MAX_IMAGE_SIZE) {
//         showSnackbar("Image size exceeds 50KB limit", 'error');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result.split(',')[1];
//         handleChange(dataIndex, base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // ADD RECORD FUNCTIONS
//   const handleAddRecord = () => {
//     setAddDialogOpen(true);
//     setNewRecord({});
//     setAddErrors({});
//   };

//   const handleAddFieldChange = (field, value) => {
//     setNewRecord(prev => ({ ...prev, [field]: value }));
//     setAddErrors(prev => ({ ...prev, [field]: '' }));
//   };

//   const handleAddImageUpload = (event, field) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (file.size > MAX_IMAGE_SIZE) {
//       showSnackbar("Image size exceeds 50KB limit", 'error');
//       setFileInputKey(Date.now());
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64String = reader.result.split(',')[1];
//       handleAddFieldChange(field, base64String);
//       setFileInputKey(Date.now());
//     };
//     reader.readAsDataURL(file);
//   };

//   const validateNewRecord = () => {
//     let errors = {};
//     columns.forEach(column => {
//       if (column.dataIndex !== 'key' && column.dataIndex !== '_temp_id' && 
//           (!newRecord[column.dataIndex] && newRecord[column.dataIndex] !== 0)) {
//         errors[column.dataIndex] = "Required";
//       }
//     });
//     setAddErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSaveNewRecord = () => {
//     if (!validateNewRecord()) return;

//     const newRecordWithTempId = {
//       ...newRecord,
//       _temp_id: `temp_add_${Date.now()}`,
//       key: `new_${Date.now()}`
//     };

//     setPendingChanges(prev => ({
//       ...prev,
//       additions: [...prev.additions, newRecordWithTempId]
//     }));

//     setTableData(prev => [...prev, newRecordWithTempId]);
//     setFilteredData(prev => [...prev, newRecordWithTempId]);

//     setAddDialogOpen(false);
//     setNewRecord({});
//     showSnackbar('Record staged for addition', 'success');
//   };

//   // DELETE RECORD FUNCTIONS
//   const handleDeleteClick = (row) => {
//     setRecordToDelete(row);
//     setDeleteConfirmOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     setPendingChanges(prev => ({
//       ...prev,
//       deletions: [...prev.deletions, recordToDelete]
//     }));

//     const keyToDelete = recordToDelete.key;
//     setTableData(prev => prev.filter(item => item.key !== keyToDelete));
//     setFilteredData(prev => prev.filter(item => item.key !== keyToDelete));

//     setDeleteConfirmOpen(false);
//     setRecordToDelete(null);
//     showSnackbar('Record staged for deletion', 'warning');
//   };

//   // IMAGE HANDLING FUNCTIONS
//   const isImageColumn = (columnName) => {
//     const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4', 'logo', 'image', 'signature', 'avatar'];
//     return imageColumns.some(imgCol => columnName.toLowerCase().includes(imgCol));
//   };

//   const formatBase64Image = (base64) => {
//     if (!base64) return '';
//     return base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
//   };

//   const handleImagePreview = (base64Data) => {
//     if (!base64Data) return;
//     const imageUrl = formatBase64Image(base64Data);
//     window.open(imageUrl, '_blank');
//   };

//   // FILTER FUNCTIONS
//   const handleFilterChange = (columnName, value) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [columnName]: {
//         ...prevFilters[columnName],
//         selected: value
//       }
//     }));
//   };

//   const handleSearchChange = (columnName, value) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [columnName]: {
//         ...prevFilters[columnName],
//         value: value
//       }
//     }));
//   };

//   const handleChangePage = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setCurrentPage(0);
//   };

//   const isRowPending = (row) => {
//     const tempId = row._temp_id;
//     return pendingChanges.updates.hasOwnProperty(tempId) ||
//            pendingChanges.additions.some(add => add._temp_id === tempId) ||
//            pendingChanges.deletions.some(del => del._temp_id === tempId);
//   };

//   const getPendingChangesCount = () => {
//     return Object.keys(pendingChanges.updates).length + 
//            pendingChanges.additions.length + 
//            pendingChanges.deletions.length;
//   };

//   // DIALOG COMPONENTS
//   const renderAddRecordDialog = () => (
//     <div className={`modal fade ${addDialogOpen ? 'show' : ''}`} 
//          style={{ display: addDialogOpen ? 'block' : 'none' }}
//          tabIndex="-1">
//       <div className="modal-dialog modal-lg modal-dialog-scrollable">
//         <div className="modal-content">
//           <div className="modal-header border-0 pb-0">
//             <h5 className="modal-title fw-bold">Add New Record to {selectedTable}</h5>
//             <button type="button" className="btn-close" onClick={() => setAddDialogOpen(false)}></button>
//           </div>
//           <div className="modal-body pt-3">
//             <div className="row g-3">
//               {columns.filter(col => col.dataIndex !== 'key' && col.dataIndex !== '_temp_id').map((column) => (
//                 <div className="col-md-6" key={column.dataIndex}>
//                   {isImageColumn(column.dataIndex) ? (
//                     <div>
//                       <label className="form-label text-muted small fw-semibold">{column.title}</label>
//                       <input
//                         key={fileInputKey}
//                         type="file"
//                         accept="image/*"
//                         className="form-control"
//                         onChange={(e) => handleAddImageUpload(e, column.dataIndex)}
//                       />
//                       {addErrors[column.dataIndex] && (
//                         <div className="text-danger small mt-1">
//                           {addErrors[column.dataIndex]}
//                         </div>
//                       )}
//                       {newRecord[column.dataIndex] && (
//                         <div className="mt-2">
//                           <img 
//                             src={formatBase64Image(newRecord[column.dataIndex])}
//                             alt="Preview"
//                             style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer', borderRadius: '8px', border: '2px solid #e9ecef' }}
//                             onClick={() => handleImagePreview(newRecord[column.dataIndex])}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div>
//                       <label className="form-label text-muted small fw-semibold">{column.title}</label>
//                       <input
//                         type="text"
//                         className={`form-control ${addErrors[column.dataIndex] ? 'is-invalid' : ''}`}
//                         value={newRecord[column.dataIndex] || ''}
//                         onChange={(e) => handleAddFieldChange(column.dataIndex, e.target.value)}
//                       />
//                       {addErrors[column.dataIndex] && (
//                         <div className="invalid-feedback">
//                           {addErrors[column.dataIndex]}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="modal-footer border-0">
//             <button type="button" className="btn btn-light" onClick={() => setAddDialogOpen(false)}>
//               Cancel
//             </button>
//             <button type="button" className="btn btn-primary" onClick={handleSaveNewRecord}>
//               Stage Record
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderDeleteConfirmation = () => (
//     <div className={`modal fade ${deleteConfirmOpen ? 'show' : ''}`} 
//          style={{ display: deleteConfirmOpen ? 'block' : 'none' }}
//          tabIndex="-1">
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header border-0 pb-0">
//             <h5 className="modal-title fw-bold">Confirm Delete</h5>
//             <button type="button" className="btn-close" onClick={() => setDeleteConfirmOpen(false)}></button>
//           </div>
//           <div className="modal-body pt-3">
//             <p className="mb-2">Are you sure you want to stage this record for deletion?</p>
//             {recordToDelete && (
//               <p className="text-muted small mb-0">
//                 The record will be deleted when you submit changes.
//               </p>
//             )}
//           </div>
//           <div className="modal-footer border-0">
//             <button type="button" className="btn btn-light" onClick={() => setDeleteConfirmOpen(false)}>
//               Cancel
//             </button>
//             <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
//               Stage for Deletion
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // IMPROVED TABLE NAMES COMPONENT - Sophisticated Card Grid Design
//   const renderTableNames = () => {
//     if (tableNames.length === 0) return null;

//     const currentTables = getCurrentPageTables();

//     return (
//       <div className="container" style={{ maxWidth: '1400px', marginTop: '3rem' }}>
//         <div className="card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
//           <div className="card-body p-5">
//             {/* Header Section */}
//             <div className="text-center mb-5">
//               <div className="d-inline-flex align-items-center justify-content-center mb-3"
//                    style={{ 
//                      width: '64px', 
//                      height: '64px', 
//                      borderRadius: '16px',
//                      background: 'linear-gradient(135deg, #2C3E50 0%, #764ba2 100%)',
//                      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
//                    }}>
//                 <Database size={32} className="text-white" />
//               </div>
//               <h2 className="fw-bold mb-2" style={{ fontSize: '1.75rem', color: '#2d3748' }}>
//                 Database Tables
//               </h2>
//               <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
//                 Select a table to view and manage records
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="mb-5 d-flex justify-content-center">
//               <div className="position-relative" style={{ maxWidth: '500px', width: '100%' }}>
//                 <Search 
//                   size={20} 
//                   className="position-absolute text-muted" 
//                   style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
//                 />
//                 <input
//                   type="text"
//                   className="form-control ps-5 pe-5 shadow-sm"
//                   placeholder="Search for a table..."
//                   value={tableSearchQuery}
//                   onChange={handleTableSearchChange}
//                   style={{
//                     height: '48px',
//                     borderRadius: '12px',
//                     border: '2px solid #e2e8f0',
//                     fontSize: '0.95rem',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = '#2C3E50'}
//                   onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
//                 />
//                 {tableSearchQuery && (
//                   <button 
//                     className="btn position-absolute" 
//                     type="button"
//                     onClick={handleClearTableSearch}
//                     style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px' }}
//                   >
//                     <XCircle size={20} className="text-muted" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Results Info */}
//             {tableSearchQuery && (
//               <div className="text-center mb-4">
//                 <span className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
//                   {filteredTableNames.length} table{filteredTableNames.length !== 1 ? 's' : ''} found
//                 </span>
//               </div>
//             )}

//             {filteredTableNames.length === 0 ? (
//               <div className="text-center py-5">
//                 <div className="mb-3">
//                   <FileText size={48} className="text-muted opacity-50" />
//                 </div>
//                 <h6 className="text-muted mb-3">
//                   {tableSearchQuery ? 'No tables match your search' : 'No tables available'}
//                 </h6>
//                 {tableSearchQuery && (
//                   <button 
//                     className="btn btn-outline-primary"
//                     onClick={handleClearTableSearch}
//                     style={{ borderRadius: '8px' }}
//                   >
//                     Clear Search
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <>
//                 {/* Table Cards Grid */}
//                 <div className="row g-3 mb-4">
//                   {currentTables.map((table, index) => (
//                     <div key={`${currentTablePage}-${index}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
//                       <div
//                         className="card h-100 border-0 shadow-sm position-relative"
//                         onClick={() => handleTableSelect(table)}
//                         style={{
//                           cursor: 'pointer',
//                           borderRadius: '12px',
//                           transition: 'all 0.3s ease',
//                           overflow: 'hidden'
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.transform = 'translateY(-4px)';
//                           e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.transform = 'translateY(0)';
//                           e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
//                         }}
//                       >
//                         <div 
//                           className="position-absolute top-0 start-0 w-100" 
//                           style={{ 
//                             height: '4px', 
//                             background: 'linear-gradient(90deg, #2C3E50 0%, #764ba2 100%)' 
//                           }}
//                         />
//                         <div className="card-body d-flex align-items-center p-3">
//                           <div 
//                             className="d-flex align-items-center justify-content-center me-3"
//                             style={{
//                               width: '40px',
//                               height: '40px',
//                               borderRadius: '10px',
//                               background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
//                               flexShrink: 0
//                             }}
//                           >
//                             <Table size={20} style={{ color: '#2C3E50' }} />
//                           </div>
//                           <div className="flex-grow-1" style={{ minWidth: 0 }}>
//                             <h6 
//                               className="mb-0 fw-semibold text-truncate" 
//                               style={{ 
//                                 fontSize: '0.9rem',
//                                 color: '#2d3748'
//                               }}
//                               title={table}
//                             >
//                               {table}
//                             </h6>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination Controls */}
//                 {totalTablePages > 1 && (
//                   <div className="d-flex justify-content-between align-items-center pt-4 border-top">
//                     <button 
//                       className="btn btn-outline-primary d-flex align-items-center gap-2"
//                       onClick={handlePreviousTablePage}
//                       disabled={currentTablePage === 0}
//                       style={{ 
//                         borderRadius: '10px',
//                         padding: '8px 20px',
//                         fontWeight: '500',
//                         fontSize: '0.9rem'
//                       }}
//                     >
//                       <ChevronLeft size={18} />
//                       Previous
//                     </button>

//                     <div className="d-flex align-items-center gap-2">
//                       {Array.from({ length: Math.min(totalTablePages, 5) }).map((_, index) => {
//                         let pageIndex;
//                         if (totalTablePages <= 5) {
//                           pageIndex = index;
//                         } else if (currentTablePage < 3) {
//                           pageIndex = index;
//                         } else if (currentTablePage > totalTablePages - 4) {
//                           pageIndex = totalTablePages - 5 + index;
//                         } else {
//                           pageIndex = currentTablePage - 2 + index;
//                         }

//                         return (
//                           <button
//                             key={pageIndex}
//                             onClick={() => setCurrentTablePage(pageIndex)}
//                             className={`btn ${pageIndex === currentTablePage ? 'btn-primary' : 'btn-outline-secondary'}`}
//                             style={{
//                               width: '40px',
//                               height: '40px',
//                               borderRadius: '8px',
//                               padding: 0,
//                               fontWeight: '500',
//                               fontSize: '0.9rem'
//                             }}
//                           >
//                             {pageIndex + 1}
//                           </button>
//                         );
//                       })}
//                     </div>

//                     <button 
//                       className="btn btn-outline-primary d-flex align-items-center gap-2"
//                       onClick={handleNextTablePage}
//                       disabled={currentTablePage === totalTablePages - 1}
//                       style={{ 
//                         borderRadius: '10px',
//                         padding: '8px 20px',
//                         fontWeight: '500',
//                         fontSize: '0.9rem'
//                       }}
//                     >
//                       Next
//                       <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderFilterRow = () => {
//     return (
//       <tr className="bg-light">
//         {columns.map(column => (
//           <th key={column.key} className="p-2" style={{ minWidth: '150px' }}>
//             {filters[column.dataIndex]?.type === 'dropdown' ? (
//               <select
//                 className="form-select form-select-sm"
//                 value={filters[column.dataIndex].selected || ''}
//                 onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
//                 style={{ fontSize: '0.85rem' }}
//               >
//                 <option value="">All</option>
//                 {filters[column.dataIndex].values.map(value => (
//                   <option key={value} value={value}>{value}</option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type="text"
//                 className="form-control form-control-sm"
//                 placeholder="Search..."
//                 value={filters[column.dataIndex]?.value || ''}
//                 onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
//                 style={{ fontSize: '0.85rem' }}
//               />
//             )}
//           </th>
//         ))}
//         <th className="p-2 text-center" style={{ minWidth: '150px' }}>
//           <strong className="small text-muted">Filters</strong>
//         </th>
//       </tr>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
//         <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="text-muted">Loading data...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '2rem 1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//       {!showTableView ? (
//         <>
//           <div className="text-center mb-5">
//             <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#2d3748', letterSpacing: '-0.5px' }}>
//               Super Admin Dashboard
//             </h1>
//             <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
//               Manage your database tables with ease
//             </p>
//           </div>
          
//           {tableNames.length === 0 ? (
//             <div className="card mt-4 text-center p-5 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
//               <h6 className="text-muted">No tables found</h6>
//               <p className="text-muted">Please check your database connection</p>
//             </div>
//           ) : (
//             renderTableNames()
//           )}
//         </>
//       ) : (
//         <div className="container-fluid" style={{ maxWidth: '1600px' }}>
//           <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//             <div>
//               <h2 className="fw-bold mb-1" style={{ color: '#2d3748' }}>{selectedTable}</h2>
//               <p className="text-muted small mb-0">Manage table records</p>
//             </div>
//             <div className="d-flex gap-2 flex-wrap">
//               <button 
//                 className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
//                 onClick={handleAddRecord}
//                 style={{ borderRadius: '8px', padding: '8px 20px' }}
//               >
//                 <Plus size={18} />
//                 Add Record
//               </button>
//               <button 
//                 className="btn btn-success d-flex align-items-center gap-2 shadow-sm"
//                 onClick={handleDownloadExcel}
//                 style={{ borderRadius: '8px', padding: '8px 20px' }}
//               >
//                 <Download size={18} />
//                 Export Excel
//               </button>
//               <button 
//                 className="btn btn-warning text-white d-flex align-items-center gap-2 shadow-sm"
//                 onClick={submitChangesToDatabase} 
//                 disabled={getPendingChangesCount() === 0}
//                 style={{ borderRadius: '8px', padding: '8px 20px', fontWeight: '500' }}
//               >
//                 Submit Changes ({getPendingChangesCount()})
//               </button>
//             </div>
//           </div>

//           {/* TABLE WITH HORIZONTAL SCROLLBAR */}
//           <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
//             <div 
//               className="table-responsive" 
//               style={{ 
//                 maxHeight: 'calc(100vh - 250px)',
//                 overflowX: 'auto',
//                 overflowY: 'auto'
//               }}
//             >
//               <table className="table table-sm table-hover mb-0" style={{ minWidth: '1200px' }}>
//                 <thead className="sticky-top" style={{ backgroundColor: '#f8f9fa', zIndex: 10 }}>
//                   <tr style={{ borderBottom: '2px solid #dee2e6' }}>
//                     {columns.map((col) => (
//                       <th 
//                         key={col.key} 
//                         className="fw-semibold text-nowrap py-3 px-3" 
//                         style={{ 
//                           color: '#4a5568',
//                           fontSize: '0.875rem',
//                           minWidth: '150px',
//                           backgroundColor: '#f8f9fa'
//                         }}
//                       >
//                         {col.title}
//                       </th>
//                     ))}
//                     <th 
//                       className="fw-semibold py-3 px-3" 
//                       style={{ 
//                         width: '150px',
//                         color: '#4a5568',
//                         fontSize: '0.875rem',
//                         minWidth: '150px',
//                         backgroundColor: '#f8f9fa'
//                       }}
//                     >
//                       Actions
//                     </th>
//                   </tr>
//                   {renderFilterRow()}
//                 </thead>
//                 <tbody>
//                   {filteredData
//                     .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
//                     .map((row) => (
//                       <tr
//                         key={row.key}
//                         style={{
//                           backgroundColor: isRowPending(row) ? 'rgba(255, 193, 7, 0.08)' : 'inherit',
//                           borderLeft: isRowPending(row) ? '3px solid #ffc107' : 'none',
//                           transition: 'background-color 0.2s ease'
//                         }}
//                       >
//                         {columns.map((col) => (
//                           <td key={col.key} className="py-2 px-3" style={{ minWidth: '150px' }}>
//                             {editingKey === row.key ? (
//                               isImageColumn(col.dataIndex) ? (
//                                 <input
//                                   type="file"
//                                   accept="image/*"
//                                   className="form-control form-control-sm"
//                                   onChange={(e) => handleImageChange(col.dataIndex, e)}
//                                   style={{ fontSize: '0.85rem' }}
//                                 />
//                               ) : (
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm"
//                                   value={editedValues[col.dataIndex] || ''}
//                                   onChange={(e) => handleChange(col.dataIndex, e.target.value)}
//                                   style={{ fontSize: '0.85rem' }}
//                                 />
//                               )
//                             ) : (
//                               isImageColumn(col.dataIndex) ? (
//                                 <img 
//                                   src={formatBase64Image(row[col.dataIndex])} 
//                                   alt={col.dataIndex}
//                                   style={{
//                                     maxWidth: '50px',
//                                     maxHeight: '50px',
//                                     objectFit: 'cover',
//                                     borderRadius: '6px',
//                                     cursor: 'pointer',
//                                     border: '1px solid #e2e8f0'
//                                   }}
//                                   onClick={() => handleImagePreview(row[col.dataIndex])}
//                                 />
//                               ) : (
//                                 <div className="d-flex align-items-center gap-2">
//                                   <span style={{
//                                     maxWidth: '250px',
//                                     overflow: 'hidden',
//                                     textOverflow: 'ellipsis',
//                                     whiteSpace: 'nowrap',
//                                     display: 'inline-block',
//                                     fontSize: '0.875rem',
//                                     color: '#4a5568'
//                                   }}>
//                                     {typeof row[col.dataIndex] === 'string' && row[col.dataIndex].length > 100
//                                       ? `${row[col.dataIndex].substring(0, 100)}...`
//                                       : row[col.dataIndex]}
//                                   </span>
//                                   {isRowPending(row) && col.dataIndex === columns[0].dataIndex && (
//                                     <span className="badge bg-warning text-dark" style={{ fontSize: '9px', padding: '2px 6px' }}>
//                                       PENDING
//                                     </span>
//                                   )}
//                                 </div>
//                               )
//                             )}
//                           </td>
//                         ))}
//                         <td className="py-2 px-3" style={{ minWidth: '150px' }}>
//                           <div className="d-flex gap-1">
//                             {editingKey === row.key ? (
//                               <>
//                                 <button
//                                   className="btn btn-sm btn-success d-flex align-items-center"
//                                   onClick={() => handleSave(row.key)}
//                                   title="Stage changes"
//                                   style={{ padding: '4px 8px' }}
//                                 >
//                                   <Save size={14} />
//                                 </button>
//                                 <button
//                                   className="btn btn-sm btn-danger d-flex align-items-center"
//                                   onClick={handleCancel}
//                                   style={{ padding: '4px 8px' }}
//                                 >
//                                   <X size={14} />
//                                 </button>
//                               </>
//                             ) : (
//                               <>
//                                 <button
//                                   className="btn btn-sm btn-outline-primary d-flex align-items-center"
//                                   onClick={() => handleEdit(row.key)}
//                                   style={{ padding: '4px 8px' }}
//                                 >
//                                   <Edit size={14} />
//                                 </button>
//                                 <button
//                                   className="btn btn-sm btn-outline-danger d-flex align-items-center"
//                                   onClick={() => handleDeleteClick(row)}
//                                   style={{ padding: '4px 8px' }}
//                                 >
//                                   <Trash2 size={14} />
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Pagination Footer */}
//             <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-3">
//               <div className="d-flex align-items-center gap-2">
//                 <span className="small text-muted">Rows per page:</span>
//                 <select 
//                   className="form-select form-select-sm" 
//                   style={{ width: 'auto', fontSize: '0.875rem' }}
//                   value={rowsPerPage}
//                   onChange={handleChangeRowsPerPage}
//                 >
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </select>
//               </div>
              
//               <span className="small text-muted fw-medium">
//                 {currentPage * rowsPerPage + 1}-{Math.min((currentPage + 1) * rowsPerPage, filteredData.length)} of {filteredData.length}
//               </span>
              
//               <nav>
//                 <ul className="pagination pagination-sm mb-0">
//                   <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
//                     <button 
//                       className="page-link" 
//                       onClick={() => handleChangePage(currentPage - 1)}
//                       disabled={currentPage === 0}
//                       style={{ borderRadius: '6px 0 0 6px' }}
//                     >
//                       <ChevronLeft size={16} />
//                     </button>
//                   </li>
//                   <li className={`page-item ${currentPage === Math.ceil(filteredData.length / rowsPerPage) - 1 ? 'disabled' : ''}`}>
//                     <button 
//                       className="page-link" 
//                       onClick={() => handleChangePage(currentPage + 1)}
//                       disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage) - 1}
//                       style={{ borderRadius: '0 6px 6px 0' }}
//                     >
//                       <ChevronRight size={16} />
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           </div>

//           {/* DIALOGS */}
//           {renderAddRecordDialog()}
//           {renderDeleteConfirmation()}
//         </div>
//       )}

//       {/* Bootstrap Toast for notifications */}
//       {snackbar.open && (
//         <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
//           <div className={`toast show align-items-center text-white bg-${snackbar.severity === 'success' ? 'success' : snackbar.severity === 'error' ? 'danger' : snackbar.severity === 'warning' ? 'warning' : 'info'} border-0`} 
//                role="alert"
//                style={{ borderRadius: '12px', minWidth: '300px' }}>
//             <div className="d-flex">
//               <div className="toast-body fw-medium">
//                 {snackbar.message}
//               </div>
//               <button 
//                 type="button" 
//                 className="btn-close btn-close-white me-2 m-auto" 
//                 onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
//               ></button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Modal Backdrop */}
//       {(addDialogOpen || deleteConfirmOpen) && (
//         <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
//       )}
//     </div>
//   );
// };

// export default SuperAdminDashboard;



// SuperAdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
  Table, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Save, 
  X, 
  Download, 
  Plus, 
  Trash2, 
  Search, 
  XCircle,
  Database,
  FileText
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [editedValues, setEditedValues] = useState({});
  
  // Enhanced pending changes structure
  const [pendingChanges, setPendingChanges] = useState({
    updates: {},
    additions: [],
    deletions: []
  });
  
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showTableView, setShowTableView] = useState(false);
  const [loading, setLoading] = useState(false);

  // CRUD OPERATIONS STATE
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({});
  const [addErrors, setAddErrors] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // TABLE SEARCH FUNCTIONALITY - NEW STATE
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [filteredTableNames, setFilteredTableNames] = useState([]);
  
  const MAX_IMAGE_SIZE = 50 * 1024; // 50KB

  // Responsive check
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // Table names pagination state - now works with filtered tables
  const [currentTablePage, setCurrentTablePage] = useState(0);
  const tablesPerPage = 16;
  const totalTablePages = Math.ceil(filteredTableNames.length / tablesPerPage);

  useEffect(() => {
    fetchTableNames();
    
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // NEW: Filter table names based on search query
  useEffect(() => {
    if (tableSearchQuery.trim() === '') {
      setFilteredTableNames(tableNames);
    } else {
      const filtered = tableNames.filter(tableName =>
        tableName.toLowerCase().includes(tableSearchQuery.toLowerCase())
      );
      setFilteredTableNames(filtered);
    }
    setCurrentTablePage(0);
  }, [tableNames, tableSearchQuery]);

  // FIXED: Apply filters with useCallback
  const applyFilters = useCallback(() => {
    let newFilteredData = [...tableData];
    
    Object.keys(filters).forEach(columnName => {
      const filter = filters[columnName];
      
      if (filter.type === 'dropdown' && filter.selected !== '' && filter.selected !== null && filter.selected !== undefined) {
        newFilteredData = newFilteredData.filter(row => {
          const cellValue = row[columnName];
          if (cellValue === null || cellValue === undefined) return false;
          return cellValue.toString() === filter.selected.toString();
        });
      } 
      else if (filter.type === 'search' && filter.value && filter.value.trim() !== '') {
        newFilteredData = newFilteredData.filter(row => {
          const cellValue = row[columnName];
          if (cellValue === null || cellValue === undefined) return false;
          return cellValue.toString().toLowerCase().includes(filter.value.toLowerCase());
        });
      }
    });
    
    setFilteredData(newFilteredData);
    setCurrentPage(0);
  }, [tableData, filters]);

  useEffect(() => {
    if (selectedTable) {
      applyFilters();
    }
  }, [filters, tableData, selectedTable, applyFilters]);

  // Handle browser back button navigation
  useEffect(() => {
    const handlePopState = () => {
      if (showTableView) {
        setShowTableView(false);
        setSelectedTable(null);
        setTableData([]);
        setOriginalData([]);
        setFilteredData([]);
        setColumns([]);
        setCurrentPage(0);
        setRowsPerPage(10);
        setPendingChanges({ updates: {}, additions: [], deletions: [] });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showTableView]);

  // Snackbar helper function
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchTableNames = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/fetch-table-names', {
        withCredentials: true
      });
      setTableNames(response.data);
    } catch (error) {
      console.error('Error fetching table names:', error);
      showSnackbar('Error fetching table names', 'error');
    }
    setLoading(false);
  };

  const fetchTableData = async (tableName) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/fetch-table-data', {
        tableName
      }, {
        withCredentials: true
      });
      
      const dataWithTempIds = response.data.map((item, index) => ({ 
        ...item, 
        _temp_id: `temp_${Date.now()}_${index}`,
        key: index.toString() 
      }));
      
      setTableData(dataWithTempIds);
      setOriginalData(JSON.parse(JSON.stringify(dataWithTempIds)));
      setFilteredData(dataWithTempIds);
      
      if (dataWithTempIds.length > 0) {
        const tableColumns = Object.keys(dataWithTempIds[0])
          .filter(key => key !== '_temp_id')
          .map(key => ({
            title: key,
            dataIndex: key,
            key: key,
          }));
        setColumns(tableColumns);
        initializeFilters(dataWithTempIds, tableColumns);
      }
      setCurrentPage(0);
      setPendingChanges({ updates: {}, additions: [], deletions: [] });
    } catch (error) {
      console.error('Error fetching table data:', error);
      showSnackbar('Error fetching table data', 'error');
    }
    setLoading(false);
  };

  const initializeFilters = (data, columns) => {
    const newFilters = {};
    columns.forEach(column => {
      if (column.dataIndex === '_temp_id') return;
      const uniqueValues = [...new Set(data.map(item => item[column.dataIndex]))];
      if (uniqueValues.length <= 20) {
        newFilters[column.dataIndex] = {
          type: 'dropdown',
          values: uniqueValues,
          selected: ''
        };
      } else {
        newFilters[column.dataIndex] = {
          type: 'search',
          value: ''
        };
      }
    });
    setFilters(newFilters);
  };

  const handleTableSelect = (tableName) => {
    window.history.pushState({ showTableView: false }, '', window.location.pathname);
    setSelectedTable(tableName);
    setShowTableView(true);
    fetchTableData(tableName);
  };

  const handleTableSearchChange = (event) => {
    setTableSearchQuery(event.target.value);
  };

  const handleClearTableSearch = () => {
    setTableSearchQuery('');
  };

  const prepareDataForSubmission = () => {
    console.log('=== prepareDataForSubmission DEBUG ===');
    console.log('pendingChanges:', pendingChanges);
    console.log('originalData:', originalData);
    
    const changes = {
      updates: [],
      additions: [],
      deletions: []
    };

    Object.entries(pendingChanges.updates).forEach(([tempId, updatedRow]) => {
      console.log(`Processing update for tempId: ${tempId}`, updatedRow);
      
      const originalRow = originalData.find(row => row._temp_id === tempId);
      if (!originalRow) {
        console.warn(`Original row not found for tempId: ${tempId}`);
        return;
      }

      console.log('Original row:', originalRow);

      const possiblePrimaryKeys = [
        'id', 'ID', 'Id', 
        'adminid', 'Admin_ID', 'admin_id',
        `${selectedTable.toLowerCase()}_id`,
        'user_id', 'userId', 'UserID'
      ];
      let primaryKey = null;
      let primaryKeyValue = null;

      for (const key of possiblePrimaryKeys) {
        if (originalRow[key] !== undefined && originalRow[key] !== null) {
          primaryKey = key;
          primaryKeyValue = originalRow[key];
          break;
        }
      }

      if (!primaryKey) {
        const validKeys = Object.keys(originalRow).filter(k => k !== '_temp_id' && k !== 'key');
        if (validKeys.length > 0) {
          primaryKey = validKeys[0];
          primaryKeyValue = originalRow[primaryKey];
        }
      }

      if (!primaryKey) {
        console.error('Could not find primary key for row:', originalRow);
        return;
      }

      console.log(`Using primary key: ${primaryKey} = ${primaryKeyValue}`);

      const changedFields = {};
      Object.keys(updatedRow).forEach(key => {
        if (key !== '_temp_id' && key !== 'key') {
          const originalValue = originalRow[key];
          const updatedValue = updatedRow[key];
          
          const originalStr = originalValue === null || originalValue === undefined ? '' : String(originalValue);
          const updatedStr = updatedValue === null || updatedValue === undefined ? '' : String(updatedValue);
          
          if (originalStr !== updatedStr) {
            changedFields[key] = updatedValue;
            console.log(`Field changed - ${key}: "${originalValue}" -> "${updatedValue}"`);
          }
        }
      });

      console.log('Changed fields:', changedFields);

      if (Object.keys(changedFields).length > 0) {
        const updateRecord = {
          ...changedFields,
          [primaryKey]: primaryKeyValue
        };
        changes.updates.push(updateRecord);
        console.log('Added to updates:', updateRecord);
      } else {
        console.log('No changes detected for this row');
      }
    });

    changes.additions = pendingChanges.additions.map(record => {
      const cleanRecord = { ...record };
      delete cleanRecord._temp_id;
      delete cleanRecord.key;
      return cleanRecord;
    });

    changes.deletions = pendingChanges.deletions.map(record => {
      const cleanRecord = {};
      
      const possibleKeys = [
        'id', 'ID', 'Id', 
        'adminid', 'Admin_ID', 'admin_id',
        `${selectedTable.toLowerCase()}_id`,
        'user_id', 'userId', 'UserID'
      ];
      for (const key of possibleKeys) {
        if (record[key] !== undefined && record[key] !== null) {
          cleanRecord[key] = record[key];
          break;
        }
      }

      if (Object.keys(cleanRecord).length === 0) {
        Object.keys(record).forEach(key => {
          if (key !== '_temp_id' && key !== 'key') {
            cleanRecord[key] = record[key];
          }
        });
      }

      return cleanRecord;
    });

    console.log('Final prepared changes:', changes);
    return changes;
  };

  const submitChangesToDatabase = async () => {
    const changes = prepareDataForSubmission();
    
    if (changes.updates.length === 0 && changes.additions.length === 0 && changes.deletions.length === 0) {
      showSnackbar('No changes to submit', 'info');
      return;
    }

    setLoading(true);
    try {
      let totalOperations = 0;
      let successfulOperations = 0;
      let operationResults = [];

      if (changes.updates.length > 0) {
        console.log('Submitting updates to enhanced route:', changes.updates);
        try {
          const updateResponse = await axios.put('http://localhost:3000/enhanced-update-table-data', {
            tableName: selectedTable,
            updates: changes.updates
          }, { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('Enhanced update response:', updateResponse.data);

          if (updateResponse.data.success) {
            successfulOperations += changes.updates.length;
            operationResults.push({
              type: 'update',
              success: true,
              count: changes.updates.length,
              details: updateResponse.data.results
            });
          } else {
            if (updateResponse.status === 207) {
              const successCount = updateResponse.data.results?.filter(r => r.success).length || 0;
              successfulOperations += successCount;
              operationResults.push({
                type: 'update',
                success: false,
                count: successCount,
                total: changes.updates.length,
                details: updateResponse.data.results
              });
            }
          }
        } catch (error) {
          console.error('Enhanced update error:', error.response?.data || error.message);
          operationResults.push({
            type: 'update',
            success: false,
            error: error.response?.data?.message || error.message
          });
        }
        totalOperations += changes.updates.length;
      }

      if (changes.additions.length > 0) {
        console.log('Submitting additions:', changes.additions);
        for (const newRecord of changes.additions) {
          try {
            await axios.post('http://localhost:3000/add-table-record', {
              tableName: selectedTable,
              newRecord
            }, { withCredentials: true });
            successfulOperations++;
            operationResults.push({
              type: 'addition',
              success: true,
              record: newRecord
            });
          } catch (error) {
            console.error('Error adding record:', error);
            operationResults.push({
              type: 'addition',
              success: false,
              error: error.message,
              record: newRecord
            });
          }
          totalOperations++;
        }
      }

      if (changes.deletions.length > 0) {
        console.log('Submitting deletions:', changes.deletions);
        for (const recordToDelete of changes.deletions) {
          try {
            await axios.delete('http://localhost:3000/delete-table-record', {
              data: {
                tableName: selectedTable,
                rowData: recordToDelete
              },
              withCredentials: true
            });
            successfulOperations++;
            operationResults.push({
              type: 'deletion',
              success: true,
              record: recordToDelete
            });
          } catch (error) {
            console.error('Error deleting record:', error);
            operationResults.push({
              type: 'deletion',
              success: false,
              error: error.message,
              record: recordToDelete
            });
          }
          totalOperations++;
        }
      }

      await fetchTableData(selectedTable);
      
      if (successfulOperations === totalOperations) {
        showSnackbar(`All ${totalOperations} changes submitted successfully!`, 'success');
      } else if (successfulOperations > 0) {
        showSnackbar(
          `${successfulOperations} of ${totalOperations} changes submitted successfully. Some operations failed.`, 
          'warning'
        );
        console.log('Operation results:', operationResults);
      } else {
        showSnackbar('All operations failed. Check console for details.', 'error');
        console.log('All failed. Results:', operationResults);
      }
      
    } catch (error) {
      console.error('Error in submitChangesToDatabase:', error);
      showSnackbar('Error submitting changes: ' + (error.response?.data?.message || error.message), 'error');
    }
    setLoading(false);
  };

  const handlePreviousTablePage = () => {
    setCurrentTablePage(prev => Math.max(0, prev - 1));
  };

  const handleNextTablePage = () => {
    setCurrentTablePage(prev => Math.min(totalTablePages - 1, prev + 1));
  };

  const getCurrentPageTables = () => {
    const startIndex = currentTablePage * tablesPerPage;
    const endIndex = startIndex + tablesPerPage;
    return filteredTableNames.slice(startIndex, endIndex);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
  };

  // EDIT FUNCTIONS
  const handleEdit = (key) => {
    setEditingKey(key);
    const row = tableData.find(item => item.key === key);
    if (!row) return;
    
    const tempId = row._temp_id;
    const pendingRow = pendingChanges.updates[tempId];
    const rowToEdit = pendingRow || row;
    setEditedValues({ ...rowToEdit });
  };

  const handleSave = (key) => {
    const row = tableData.find(item => item.key === key);
    if (!row) return;
    
    const tempId = row._temp_id;
    
    console.log('Saving changes for tempId:', tempId);
    console.log('Edited values:', editedValues);
    
    setPendingChanges(prev => {
      const newPendingChanges = {
        ...prev,
        updates: {
          ...prev.updates,
          [tempId]: { ...editedValues }
        }
      };
      console.log('New pending changes:', newPendingChanges);
      return newPendingChanges;
    });
    
    setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
    setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
    
    setEditingKey('');
    setEditedValues({});
    
    showSnackbar('Changes staged successfully', 'success');
  };

  const handleCancel = () => {
    setEditingKey('');
    setEditedValues({});
  };

  const handleChange = (dataIndex, value) => {
    setEditedValues(prev => ({ ...prev, [dataIndex]: value }));
  };

  const handleImageChange = (dataIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        showSnackbar("Image size exceeds 50KB limit", 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        handleChange(dataIndex, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // ADD RECORD FUNCTIONS
  const handleAddRecord = () => {
    setAddDialogOpen(true);
    setNewRecord({});
    setAddErrors({});
  };

  const handleAddFieldChange = (field, value) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
    setAddErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAddImageUpload = (event, field) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      showSnackbar("Image size exceeds 50KB limit", 'error');
      setFileInputKey(Date.now());
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      handleAddFieldChange(field, base64String);
      setFileInputKey(Date.now());
    };
    reader.readAsDataURL(file);
  };

  const validateNewRecord = () => {
    let errors = {};
    columns.forEach(column => {
      if (column.dataIndex !== 'key' && column.dataIndex !== '_temp_id' && 
          (!newRecord[column.dataIndex] && newRecord[column.dataIndex] !== 0)) {
        errors[column.dataIndex] = "Required";
      }
    });
    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewRecord = () => {
    if (!validateNewRecord()) return;

    const newRecordWithTempId = {
      ...newRecord,
      _temp_id: `temp_add_${Date.now()}`,
      key: `new_${Date.now()}`
    };

    setPendingChanges(prev => ({
      ...prev,
      additions: [...prev.additions, newRecordWithTempId]
    }));

    setTableData(prev => [...prev, newRecordWithTempId]);
    setFilteredData(prev => [...prev, newRecordWithTempId]);

    setAddDialogOpen(false);
    setNewRecord({});
    showSnackbar('Record staged for addition', 'success');
  };

  // DELETE RECORD FUNCTIONS
  const handleDeleteClick = (row) => {
    setRecordToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setPendingChanges(prev => ({
      ...prev,
      deletions: [...prev.deletions, recordToDelete]
    }));

    const keyToDelete = recordToDelete.key;
    setTableData(prev => prev.filter(item => item.key !== keyToDelete));
    setFilteredData(prev => prev.filter(item => item.key !== keyToDelete));

    setDeleteConfirmOpen(false);
    setRecordToDelete(null);
    showSnackbar('Record staged for deletion', 'warning');
  };

  // IMAGE HANDLING FUNCTIONS
  const isImageColumn = (columnName) => {
    const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4', 'logo', 'image', 'signature', 'avatar'];
    return imageColumns.some(imgCol => columnName.toLowerCase().includes(imgCol));
  };

  const formatBase64Image = (base64) => {
    if (!base64) return '';
    return base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
  };

  const handleImagePreview = (base64Data) => {
    if (!base64Data) return;
    const imageUrl = formatBase64Image(base64Data);
    window.open(imageUrl, '_blank');
  };

  // FILTER FUNCTIONS
  const handleFilterChange = (columnName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: {
        ...prevFilters[columnName],
        selected: value
      }
    }));
  };

  const handleSearchChange = (columnName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: {
        ...prevFilters[columnName],
        value: value
      }
    }));
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const isRowPending = (row) => {
    const tempId = row._temp_id;
    return pendingChanges.updates.hasOwnProperty(tempId) ||
           pendingChanges.additions.some(add => add._temp_id === tempId) ||
           pendingChanges.deletions.some(del => del._temp_id === tempId);
  };

  const getPendingChangesCount = () => {
    return Object.keys(pendingChanges.updates).length + 
           pendingChanges.additions.length + 
           pendingChanges.deletions.length;
  };

  // DIALOG COMPONENTS
  const renderAddRecordDialog = () => (
    <div className={`modal fade ${addDialogOpen ? 'show' : ''}`} 
         style={{ display: addDialogOpen ? 'block' : 'none' }}
         tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Add New Record to {selectedTable}</h5>
            <button type="button" className="btn-close" onClick={() => setAddDialogOpen(false)}></button>
          </div>
          <div className="modal-body pt-3">
            <div className="row g-3">
              {columns.filter(col => col.dataIndex !== 'key' && col.dataIndex !== '_temp_id').map((column) => (
                <div className="col-md-6" key={column.dataIndex}>
                  {isImageColumn(column.dataIndex) ? (
                    <div>
                      <label className="form-label text-muted small fw-semibold">{column.title}</label>
                      <input
                        key={fileInputKey}
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleAddImageUpload(e, column.dataIndex)}
                      />
                      {addErrors[column.dataIndex] && (
                        <div className="text-danger small mt-1">
                          {addErrors[column.dataIndex]}
                        </div>
                      )}
                      {newRecord[column.dataIndex] && (
                        <div className="mt-2">
                          <img 
                            src={formatBase64Image(newRecord[column.dataIndex])}
                            alt="Preview"
                            style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer', borderRadius: '8px', border: '2px solid #e9ecef' }}
                            onClick={() => handleImagePreview(newRecord[column.dataIndex])}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="form-label text-muted small fw-semibold">{column.title}</label>
                      <input
                        type="text"
                        className={`form-control ${addErrors[column.dataIndex] ? 'is-invalid' : ''}`}
                        value={newRecord[column.dataIndex] || ''}
                        onChange={(e) => handleAddFieldChange(column.dataIndex, e.target.value)}
                      />
                      {addErrors[column.dataIndex] && (
                        <div className="invalid-feedback">
                          {addErrors[column.dataIndex]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveNewRecord}>
              Stage Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirmation = () => (
    <div className={`modal fade ${deleteConfirmOpen ? 'show' : ''}`} 
         style={{ display: deleteConfirmOpen ? 'block' : 'none' }}
         tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Confirm Delete</h5>
            <button type="button" className="btn-close" onClick={() => setDeleteConfirmOpen(false)}></button>
          </div>
          <div className="modal-body pt-3">
            <p className="mb-2">Are you sure you want to stage this record for deletion?</p>
            {recordToDelete && (
              <p className="text-muted small mb-0">
                The record will be deleted when you submit changes.
              </p>
            )}
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
              Stage for Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // IMPROVED TABLE NAMES COMPONENT - Sophisticated Card Grid Design
  const renderTableNames = () => {
    if (tableNames.length === 0) return null;

    const currentTables = getCurrentPageTables();

    return (
      <div className="container" style={{ maxWidth: '1400px', marginTop: '3rem' }}>
        <div className="card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="card-body p-5">
            {/* Search Bar */}
            <div className="mb-5 d-flex justify-content-center">
              <div className="position-relative" style={{ maxWidth: '500px', width: '100%' }}>
                <Search 
                  size={20} 
                  className="position-absolute text-muted" 
                  style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                />
                <input
                  type="text"
                  className="form-control ps-5 pe-5 shadow-sm"
                  placeholder="Search for a table..."
                  value={tableSearchQuery}
                  onChange={handleTableSearchChange}
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2C3E50'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                {tableSearchQuery && (
                  <button 
                    className="btn position-absolute" 
                    type="button"
                    onClick={handleClearTableSearch}
                    style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px' }}
                  >
                    <XCircle size={20} className="text-muted" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Info */}
            {tableSearchQuery && (
              <div className="text-center mb-4">
                <span className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                  {filteredTableNames.length} table{filteredTableNames.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}

            {filteredTableNames.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <FileText size={48} className="text-muted opacity-50" />
                </div>
                <h6 className="text-muted mb-3">
                  {tableSearchQuery ? 'No tables match your search' : 'No tables available'}
                </h6>
                {tableSearchQuery && (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={handleClearTableSearch}
                    style={{ borderRadius: '8px' }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Table Cards Grid - IMPROVED HOVER/CLICK EFFECT */}
                <div className="row g-3 mb-4">
                  {currentTables.map((table, index) => (
                    <div key={`${currentTablePage}-${index}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div
                        className="card h-100 border-0 shadow-sm position-relative"
                        onClick={() => handleTableSelect(table)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          overflow: 'hidden',
                          backgroundColor: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.2)';
                          e.currentTarget.style.backgroundColor = '#f0f4ff';
                          const topBar = e.currentTarget.querySelector('.table-card-top-bar');
                          if (topBar) topBar.style.height = '6px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                          e.currentTarget.style.backgroundColor = 'white';
                          const topBar = e.currentTarget.querySelector('.table-card-top-bar');
                          if (topBar) topBar.style.height = '4px';
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.backgroundColor = '#e6edff';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.backgroundColor = '#f0f4ff';
                        }}
                      >
                        <div 
                          className="position-absolute top-0 start-0 w-100 table-card-top-bar" 
                          style={{ 
                            height: '4px', 
                            background: 'linear-gradient(90deg, #2C3E50 0%, #764ba2 100%)',
                            transition: 'height 0.3s ease'
                          }}
                        />
                        <div className="card-body d-flex align-items-center p-3">
                          <div 
                            className="d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                              flexShrink: 0,
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Table size={20} style={{ color: '#2C3E50' }} />
                          </div>
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <h6 
                              className="mb-0 fw-semibold text-truncate" 
                              style={{ 
                                fontSize: '0.9rem',
                                color: '#2d3748',
                                transition: 'color 0.3s ease'
                              }}
                              title={table}
                            >
                              {table}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* IMPROVED Pagination Controls */}
                {totalTablePages > 1 && (
                  <div className="d-flex justify-content-between align-items-center pt-4 border-top">
                    <button 
                      className="btn btn-outline-primary d-flex align-items-center gap-2"
                      onClick={handlePreviousTablePage}
                      disabled={currentTablePage === 0}
                      style={{ 
                        borderRadius: '10px',
                        padding: '8px 20px',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    <div className="d-flex align-items-center gap-2">
                      {Array.from({ length: Math.min(totalTablePages, 5) }).map((_, index) => {
                        let pageIndex;
                        if (totalTablePages <= 5) {
                          pageIndex = index;
                        } else if (currentTablePage < 3) {
                          pageIndex = index;
                        } else if (currentTablePage > totalTablePages - 4) {
                          pageIndex = totalTablePages - 5 + index;
                        } else {
                          pageIndex = currentTablePage - 2 + index;
                        }

                        return (
                          <button
                            key={pageIndex}
                            onClick={() => setCurrentTablePage(pageIndex)}
                            className={`btn ${pageIndex === currentTablePage ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              padding: 0,
                              fontWeight: '500',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {pageIndex + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      className="btn btn-outline-primary d-flex align-items-center gap-2"
                      onClick={handleNextTablePage}
                      disabled={currentTablePage === totalTablePages - 1}
                      style={{ 
                        borderRadius: '10px',
                        padding: '8px 20px',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFilterRow = () => {
    return (
      <tr className="bg-light">
        {columns.map(column => (
          <th key={column.key} className="p-2" style={{ minWidth: '150px' }}>
            {filters[column.dataIndex]?.type === 'dropdown' ? (
              <select
                className="form-select form-select-sm"
                value={filters[column.dataIndex].selected || ''}
                onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">All</option>
                {filters[column.dataIndex].values.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={filters[column.dataIndex]?.value || ''}
                onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            )}
          </th>
        ))}
        <th className="p-2 text-center" style={{ minWidth: '150px' }}>
          <strong className="small text-muted">Filters</strong>
        </th>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {!showTableView ? (
        <>
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#2d3748', letterSpacing: '-0.5px' }}>
              Super Admin Dashboard
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
              Manage your database tables with ease
            </p>
          </div>
          
          {tableNames.length === 0 ? (
            <div className="card mt-4 text-center p-5 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <h6 className="text-muted">No tables found</h6>
              <p className="text-muted">Please check your database connection</p>
            </div>
          ) : (
            renderTableNames()
          )}
        </>
      ) : (
        <div className="container-fluid" style={{ maxWidth: '1600px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#2d3748' }}>{selectedTable}</h2>
              <p className="text-muted small mb-0">Manage table records</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button 
                className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                onClick={handleAddRecord}
                style={{ borderRadius: '8px', padding: '8px 20px' }}
              >
                <Plus size={18} />
                Add Record
              </button>
              <button 
                className="btn btn-success d-flex align-items-center gap-2 shadow-sm"
                onClick={handleDownloadExcel}
                style={{ borderRadius: '8px', padding: '8px 20px' }}
              >
                <Download size={18} />
                Export Excel
              </button>
              <button 
                className="btn btn-warning text-white d-flex align-items-center gap-2 shadow-sm"
                onClick={submitChangesToDatabase} 
                disabled={getPendingChangesCount() === 0}
                style={{ borderRadius: '8px', padding: '8px 20px', fontWeight: '500' }}
              >
                Submit Changes ({getPendingChangesCount()})
              </button>
            </div>
          </div>

          {/* TABLE WITH IMPROVED STYLING */}
          <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div 
              className="table-responsive" 
              style={{ 
                maxHeight: 'calc(100vh - 250px)',
                overflowX: 'auto',
                overflowY: 'auto'
              }}
            >
              <table className="table table-sm table-hover mb-0" style={{ minWidth: '1200px' }}>
                {/* IMPROVED TABLE HEADER - Background #f8f9fa with WHITE text */}
                <thead className="sticky-top" style={{ backgroundColor: '#2C3E50', zIndex: 10 }}>
                  <tr style={{ borderBottom: '2px solid #2C3E50' }}>
                    {columns.map((col) => (
                      <th 
                        key={col.key} 
                        className="fw-semibold text-nowrap py-3 px-3" 
                        style={{ 
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          minWidth: '150px',
                          backgroundColor: '#2C3E50',
                          letterSpacing: '0.3px'
                        }}
                      >
                        {col.title}
                      </th>
                    ))}
                    <th 
                      className="fw-semibold py-3 px-3" 
                      style={{ 
                        width: '150px',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        minWidth: '150px',
                        backgroundColor: '#2C3E50',
                        letterSpacing: '0.3px'
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                  {renderFilterRow()}
                </thead>
                {/* IMPROVED TABLE BODY - Darker text color */}
                <tbody>
                  {filteredData
                    .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <tr
                        key={row.key}
                        style={{
                          backgroundColor: isRowPending(row) ? 'rgba(255, 193, 7, 0.08)' : 'inherit',
                          borderLeft: isRowPending(row) ? '3px solid #ffc107' : 'none',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        {columns.map((col) => (
                          <td key={col.key} className="py-2 px-3" style={{ minWidth: '150px' }}>
                            {editingKey === row.key ? (
                              isImageColumn(col.dataIndex) ? (
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="form-control form-control-sm"
                                  onChange={(e) => handleImageChange(col.dataIndex, e)}
                                  style={{ fontSize: '0.85rem' }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editedValues[col.dataIndex] || ''}
                                  onChange={(e) => handleChange(col.dataIndex, e.target.value)}
                                  style={{ fontSize: '0.85rem' }}
                                />
                              )
                            ) : (
                              isImageColumn(col.dataIndex) ? (
                                <img 
                                  src={formatBase64Image(row[col.dataIndex])} 
                                  alt={col.dataIndex}
                                  style={{
                                    maxWidth: '50px',
                                    maxHeight: '50px',
                                    objectFit: 'cover',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    border: '1px solid #e2e8f0'
                                  }}
                                  onClick={() => handleImagePreview(row[col.dataIndex])}
                                />
                              ) : (
                                <div className="d-flex align-items-center gap-2">
                                  <span style={{
                                    maxWidth: '250px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block',
                                    fontSize: '0.875rem',
                                    color: '#1a202c',
                                    fontWeight: '400'
                                  }}>
                                    {typeof row[col.dataIndex] === 'string' && row[col.dataIndex].length > 100
                                      ? `${row[col.dataIndex].substring(0, 100)}...`
                                      : row[col.dataIndex]}
                                  </span>
                                  {isRowPending(row) && col.dataIndex === columns[0].dataIndex && (
                                    <span className="badge bg-warning text-dark" style={{ fontSize: '9px', padding: '2px 6px' }}>
                                      PENDING
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          </td>
                        ))}
                        <td className="py-2 px-3" style={{ minWidth: '150px' }}>
                          <div className="d-flex gap-1">
                            {editingKey === row.key ? (
                              <>
                                <button
                                  className="btn btn-sm btn-success d-flex align-items-center"
                                  onClick={() => handleSave(row.key)}
                                  title="Stage changes"
                                  style={{ padding: '4px 8px' }}
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  className="btn btn-sm btn-danger d-flex align-items-center"
                                  onClick={handleCancel}
                                  style={{ padding: '4px 8px' }}
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  onClick={() => handleEdit(row.key)}
                                  style={{ padding: '4px 8px' }}
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                  onClick={() => handleDeleteClick(row)}
                                  style={{ padding: '4px 8px' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {/* IMPROVED Pagination Footer */}
            <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">Rows per page:</span>
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: 'auto', fontSize: '0.875rem' }}
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              
              <span className="small text-muted fw-medium">
                {currentPage * rowsPerPage + 1}-{Math.min((currentPage + 1) * rowsPerPage, filteredData.length)} of {filteredData.length}
              </span>
              
              {/* IMPROVED PAGINATION BUTTONS - Better centering and hover effects */}
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link d-flex align-items-center justify-content-center" 
                      onClick={() => handleChangePage(currentPage - 1)}
                      disabled={currentPage === 0}
                      style={{ 
                        borderRadius: '6px 0 0 6px',
                        width: '36px',
                        height: '36px',
                        padding: 0
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === Math.ceil(filteredData.length / rowsPerPage) - 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link d-flex align-items-center justify-content-center" 
                      onClick={() => handleChangePage(currentPage + 1)}
                      disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage) - 1}
                      style={{ 
                        borderRadius: '0 6px 6px 0',
                        width: '36px',
                        height: '36px',
                        padding: 0
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* DIALOGS */}
          {renderAddRecordDialog()}
          {renderDeleteConfirmation()}
        </div>
      )}

      {/* Bootstrap Toast for notifications */}
      {snackbar.open && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className={`toast show align-items-center text-white bg-${snackbar.severity === 'success' ? 'success' : snackbar.severity === 'error' ? 'danger' : snackbar.severity === 'warning' ? 'warning' : 'info'} border-0`} 
               role="alert"
               style={{ borderRadius: '12px', minWidth: '300px' }}>
            <div className="d-flex">
              <div className="toast-body fw-medium">
                {snackbar.message}
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
              ></button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {(addDialogOpen || deleteConfirmOpen) && (
        <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
