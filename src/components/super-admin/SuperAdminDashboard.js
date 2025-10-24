// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import axios from 'axios';
// // // // // // import * as XLSX from 'xlsx';
// // // // // // import './SuperAdminDashboard.css';

// // // // // // const SuperAdminDashboard = () => {
// // // // // //     const [tableNames, setTableNames] = useState([]);
// // // // // //     const [selectedTable, setSelectedTable] = useState(null);
// // // // // //     const [tableData, setTableData] = useState([]);
// // // // // //     const [columns, setColumns] = useState([]);
// // // // // //     const [filteredData, setFilteredData] = useState([]);
// // // // // //     const [editingKey, setEditingKey] = useState('');
// // // // // //     const [editedValues, setEditedValues] = useState({});
// // // // // //     const [changedRows, setChangedRows] = useState({});
// // // // // //     const [currentPage, setCurrentPage] = useState(1);
// // // // // //     const [filters, setFilters] = useState({});
// // // // // //     const pageSize = 10;

// // // // // //     useEffect(() => {
// // // // // //         fetchTableNames();
// // // // // //     }, []);

// // // // // //     useEffect(() => {
// // // // // //         if (selectedTable) {
// // // // // //             applyFilters();
// // // // // //         }
// // // // // //     }, [filters, tableData]);

// // // // // //     const fetchTableNames = async () => {
// // // // // //         try {
// // // // // //             const response = await axios.get('http://localhost:3000/fetch-table-names', {
// // // // // //                 withCredentials: true
// // // // // //             });
// // // // // //             setTableNames(response.data);
// // // // // //         } catch (error) {
// // // // // //             console.error('Error fetching table names:', error);
// // // // // //         }
// // // // // //     };

// // // // // //     const fetchTableData = async (tableName) => {
// // // // // //         try {
// // // // // //             const response = await axios.post('http://localhost:3000/fetch-table-data', {
// // // // // //                 tableName
// // // // // //             }, {
// // // // // //                 withCredentials: true
// // // // // //             });
// // // // // //             const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index.toString() }));
// // // // // //             setTableData(dataWithKeys);
// // // // // //             setFilteredData(dataWithKeys);
// // // // // //             if (dataWithKeys.length > 0) {
// // // // // //                 const tableColumns = Object.keys(dataWithKeys[0])
// // // // // //                     .map(key => ({
// // // // // //                         title: key,  
// // // // // //                         dataIndex: key,
// // // // // //                         key: key,
// // // // // //                     }));
// // // // // //                 setColumns(tableColumns);
// // // // // //                 initializeFilters(dataWithKeys, tableColumns);
// // // // // //             }
// // // // // //         } catch (error) {
// // // // // //             console.error('Error fetching table data:', error);
// // // // // //         }
// // // // // //     };

// // // // // //     const initializeFilters = (data, columns) => {
// // // // // //         const newFilters = {};
// // // // // //         columns.forEach(column => {
// // // // // //             const uniqueValues = [...new Set(data.map(item => item[column.dataIndex]))];
// // // // // //             if (uniqueValues.length <= 20) {
// // // // // //                 newFilters[column.dataIndex] = {
// // // // // //                     type: 'dropdown',
// // // // // //                     values: uniqueValues,
// // // // // //                     selected: ''
// // // // // //                 };
// // // // // //             } else {
// // // // // //                 newFilters[column.dataIndex] = {
// // // // // //                     type: 'search',
// // // // // //                     value: ''
// // // // // //                 };
// // // // // //             }
// // // // // //         });
// // // // // //         setFilters(newFilters);
// // // // // //     };

// // // // // //     const handleTableSelect = (event) => {
// // // // // //         const value = event.target.value;
// // // // // //         setSelectedTable(value);
// // // // // //         fetchTableData(value);
// // // // // //     };

// // // // // //     const handleDownloadExcel = () => {
// // // // // //         const worksheet = XLSX.utils.json_to_sheet(filteredData);
// // // // // //         const workbook = XLSX.utils.book_new();
// // // // // //         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
// // // // // //         XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
// // // // // //         alert('Excel file downloaded successfully!');
// // // // // //     };

// // // // // //     const handleEdit = (key) => {
// // // // // //         setEditingKey(key);
// // // // // //         const row = tableData.find(item => item.key === key);
// // // // // //         setEditedValues(row);
// // // // // //     };

// // // // // //     const handleSave = (key) => {
// // // // // //         setChangedRows(prev => ({...prev, [key]: editedValues}));
// // // // // //         setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
// // // // // //         setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
// // // // // //         setEditingKey('');
// // // // // //         setEditedValues({});
// // // // // //         alert('Row updated locally. Click Submit Changes to save to the backend.');
// // // // // //     };

// // // // // //     const handleCancel = () => {
// // // // // //         setEditingKey('');
// // // // // //         setEditedValues({});
// // // // // //     };

// // // // // //     const handleChange = (dataIndex, value) => {
// // // // // //         setEditedValues(prev => ({...prev, [dataIndex]: value}));
// // // // // //     };

// // // // // //     const handleImageChange = (dataIndex, event) => {
// // // // // //         const file = event.target.files[0];
// // // // // //         if (file) {
// // // // // //             const reader = new FileReader();
// // // // // //             reader.onloadend = () => {
// // // // // //                 const base64String = reader.result.split(',')[1];
// // // // // //                 handleChange(dataIndex, base64String);
// // // // // //             };
// // // // // //             reader.readAsDataURL(file);
// // // // // //         }
// // // // // //     };

// // // // // //     const submitChanges = async () => {
// // // // // //         try {
// // // // // //             const response = await axios.post('http://localhost:3000/update-table-data', {
// // // // // //                 tableName: selectedTable,
// // // // // //                 updatedRows: Object.values(changedRows)
// // // // // //             }, {
// // // // // //                 withCredentials: true
// // // // // //             });
// // // // // //             if (response.data.success) {
// // // // // //                 alert('Changes submitted successfully to the backend');
// // // // // //                 setChangedRows({});
// // // // // //                 fetchTableData(selectedTable);
// // // // // //             } else {
// // // // // //                 alert('Failed to submit changes to the backend');
// // // // // //             }
// // // // // //         } catch (error) {
// // // // // //             console.error('Error submitting changes:', error);
// // // // // //             alert('Error submitting changes to the backend');
// // // // // //         }
// // // // // //     };

// // // // // //     const isImageColumn = (columnName) => {
// // // // // //         const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4','logo'];
// // // // // //         return imageColumns.includes(columnName.toLowerCase());
// // // // // //     };

// // // // // //     const handleFilterChange = (columnName, value) => {
// // // // // //         setFilters(prevFilters => ({
// // // // // //             ...prevFilters,
// // // // // //             [columnName]: {
// // // // // //                 ...prevFilters[columnName],
// // // // // //                 selected: value
// // // // // //             }
// // // // // //         }));
// // // // // //     };

// // // // // //     const handleSearchChange = (columnName, value) => {
// // // // // //         setFilters(prevFilters => ({
// // // // // //             ...prevFilters,
// // // // // //             [columnName]: {
// // // // // //                 ...prevFilters[columnName],
// // // // // //                 value: value
// // // // // //             }
// // // // // //         }));
// // // // // //     };

// // // // // //     const applyFilters = () => {
// // // // // //         let newFilteredData = [...tableData];
        
// // // // // //         Object.keys(filters).forEach(columnName => {
// // // // // //             const filter = filters[columnName];
// // // // // //             if (filter.type === 'dropdown' && filter.selected) {
// // // // // //                 newFilteredData = newFilteredData.filter(row => 
// // // // // //                     row[columnName] && row[columnName].toString() === filter.selected
// // // // // //                 );
// // // // // //             } else if (filter.type === 'search' && filter.value) {
// // // // // //                 newFilteredData = newFilteredData.filter(row =>
// // // // // //                     row[columnName] && row[columnName].toString().toLowerCase().includes(filter.value.toLowerCase())
// // // // // //                 );
// // // // // //             }
// // // // // //         });

// // // // // //         setFilteredData(newFilteredData);
// // // // // //         setCurrentPage(1);
// // // // // //     };

// // // // // //     const renderTableHeader = () => {
// // // // // //         return (
// // // // // //             <tr>
// // // // // //                 {columns.map(column => (
// // // // // //                     <th key={column.key} className="sa-table-header-cell">
// // // // // //                         {column.title}
// // // // // //                         {filters[column.dataIndex]?.type === 'dropdown' ? (
// // // // // //                             <select 
// // // // // //                                 className="sa-filter-dropdown"
// // // // // //                                 value={filters[column.dataIndex].selected} 
// // // // // //                                 onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
// // // // // //                             >
// // // // // //                                 <option value="">All</option>
// // // // // //                                 {filters[column.dataIndex].values.map(value => (
// // // // // //                                     <option key={value} value={value}>{value}</option>
// // // // // //                                 ))}
// // // // // //                             </select>
// // // // // //                         ) : (
// // // // // //                             <input 
// // // // // //                                 className="sa-filter-search"
// // // // // //                                 type="text" 
// // // // // //                                 placeholder="Search..." 
// // // // // //                                 value={filters[column.dataIndex]?.value || ''}
// // // // // //                                 onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
// // // // // //                             />
// // // // // //                         )}
// // // // // //                     </th>
// // // // // //                 ))}
// // // // // //                 <th className="sa-table-header-cell">Action</th>
// // // // // //             </tr>
// // // // // //         );
// // // // // //     };

// // // // // //     const renderTableBody = () => {
// // // // // //         const startIndex = (currentPage - 1) * pageSize;
// // // // // //         const endIndex = startIndex + pageSize;
// // // // // //         return filteredData.slice(startIndex, endIndex).map(row => (
// // // // // //             <tr key={row.key} className="sa-table-row">
// // // // // //                 {columns.map(column => (
// // // // // //                     <td key={column.key} className="sa-table-cell">
// // // // // //                         {editingKey === row.key ? (
// // // // // //                             isImageColumn(column.dataIndex) ? (
// // // // // //                                 <input
// // // // // //                                     type="file"
// // // // // //                                     accept="image/*"
// // // // // //                                     onChange={(e) => handleImageChange(column.dataIndex, e)}
// // // // // //                                     className="sa-file-input"
// // // // // //                                 />
// // // // // //                             ) : (
// // // // // //                                 <input
// // // // // //                                     value={editedValues[column.dataIndex] || ''}
// // // // // //                                     onChange={(e) => handleChange(column.dataIndex, e.target.value)}
// // // // // //                                     className="sa-text-input"
// // // // // //                                 />
// // // // // //                             )
// // // // // //                         ) : (
// // // // // //                             isImageColumn(column.dataIndex) ? (
// // // // // //                                 <img 
// // // // // //                                     src={`data:image/jpeg;base64,${row[column.dataIndex]}`} 
// // // // // //                                     alt={`${column.dataIndex}`}
// // // // // //                                     className="sa-table-image"
// // // // // //                                 />
// // // // // //                             ) : (
// // // // // //                                 <div className="sa-cell-content">
// // // // // //                                     {typeof row[column.dataIndex] === 'string' && row[column.dataIndex].length > 100
// // // // // //                                         ? `${row[column.dataIndex].substring(0, 100)}...`
// // // // // //                                         : row[column.dataIndex]}
// // // // // //                                 </div>
// // // // // //                             )
// // // // // //                         )}
// // // // // //                     </td>
// // // // // //                 ))}
// // // // // //                 <td className="sa-table-cell">
// // // // // //                     {editingKey === row.key ? (
// // // // // //                         <div className="sa-action-buttons">
// // // // // //                             <button className="sa-save-button" onClick={() => handleSave(row.key)}>Save</button>
// // // // // //                             <button className="sa-cancel-button" onClick={handleCancel}>Cancel</button>
// // // // // //                         </div>
// // // // // //                     ) : (
// // // // // //                         <button className="sa-edit-button" onClick={() => handleEdit(row.key)}>Edit</button>
// // // // // //                     )}
// // // // // //                 </td>
// // // // // //             </tr>
// // // // // //         ));
// // // // // //     };

// // // // // //     const renderPagination = () => {
// // // // // //         const totalPages = Math.ceil(filteredData.length / pageSize);
// // // // // //         return (
// // // // // //             <div className="sa-pagination">
// // // // // //                 <button 
// // // // // //                     className="sa-pagination-button"
// // // // // //                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
// // // // // //                     disabled={currentPage === 1}
// // // // // //                 >
// // // // // //                     Previous
// // // // // //                 </button>
// // // // // //                 <span className="sa-pagination-info">{currentPage} / {totalPages}</span>
// // // // // //                 <button 
// // // // // //                     className="sa-pagination-button"
// // // // // //                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
// // // // // //                     disabled={currentPage === totalPages}
// // // // // //                 >
// // // // // //                     Next
// // // // // //                 </button>
// // // // // //             </div>
// // // // // //         );
// // // // // //     };

// // // // // //     return (
// // // // // //         <div className="sa-dashboard">
// // // // // //             <h1 className="sa-dashboard-title">Super Admin Dashboard</h1>
// // // // // //             <div className="sa-controls">
// // // // // //                 <select className="sa-table-select" onChange={handleTableSelect} value={selectedTable || ""}>
// // // // // //                     <option value="">Select a table</option>
// // // // // //                     {tableNames.map(name => (
// // // // // //                         <option key={name} value={name}>{name}</option>
// // // // // //                     ))}
// // // // // //                 </select>
// // // // // //                 {selectedTable && (
// // // // // //                     <>
// // // // // //                         <button className="sa-download-button" onClick={handleDownloadExcel}>Download Excel</button>
// // // // // //                         <button 
// // // // // //                             className="sa-submit-button" 
// // // // // //                             onClick={submitChanges} 
// // // // // //                             disabled={Object.keys(changedRows).length === 0}
// // // // // //                         >
// // // // // //                             Submit Changes
// // // // // //                         </button>
// // // // // //                     </>
// // // // // //                 )}
// // // // // //             </div>
// // // // // //             {selectedTable && (
// // // // // //                 <div className="sa-table-container">
// // // // // //                     <table className="sa-table">
// // // // // //                         <thead>{renderTableHeader()}</thead>
// // // // // //                         <tbody>{renderTableBody()}</tbody>
// // // // // //                     </table>
// // // // // //                     {renderPagination()}
// // // // // //                 </div>
// // // // // //             )}
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // // export default SuperAdminDashboard;





// // // SuperAdminDashboard.jsx
// // import React, { useState, useEffect } from 'react';
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
// //   DialogActions
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
// //   Delete as DeleteIcon
// // } from '@mui/icons-material';

// // const SuperAdminDashboard = () => {
// //   const [tableNames, setTableNames] = useState([]);
// //   const [selectedTable, setSelectedTable] = useState(null);
// //   const [tableData, setTableData] = useState([]);
// //   const [columns, setColumns] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [editingKey, setEditingKey] = useState('');
// //   const [editedValues, setEditedValues] = useState({});
  
// //   // MAIN CHANGE: Replace changedRows with stagedChanges for local staging
// //   const [stagedChanges, setStagedChanges] = useState({});
  
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [filters, setFilters] = useState({});
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [showTableView, setShowTableView] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   // NEW STATE VARIABLES FOR CRUD OPERATIONS
// //   const [addDialogOpen, setAddDialogOpen] = useState(false);
// //   const [newRecord, setNewRecord] = useState({});
// //   const [addErrors, setAddErrors] = useState({});
// //   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
// //   const [recordToDelete, setRecordToDelete] = useState(null);
// //   const [fileInputKey, setFileInputKey] = useState(Date.now());
// //   const MAX_IMAGE_SIZE = 50 * 1024; // 50KB

// //   // Material UI theme and responsive hooks
// //   const theme = useTheme();
// //   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

// //   // Table names pagination state
// //   const [currentTablePage, setCurrentTablePage] = useState(0);
// //   const tablesPerPage = 15;
// //   const totalTablePages = Math.ceil(tableNames.length / tablesPerPage);

// //   useEffect(() => {
// //     fetchTableNames();
// //   }, []);

// //   useEffect(() => {
// //     if (selectedTable) {
// //       applyFilters();
// //     }
// //   }, [filters, tableData]);

// //   // Handle browser back button navigation
// //   useEffect(() => {
// //     const handlePopState = () => {
// //       if (showTableView) {
// //         setShowTableView(false);
// //         setSelectedTable(null);
// //         setTableData([]);
// //         setFilteredData([]);
// //         setColumns([]);
// //         setCurrentPage(0);
// //         setRowsPerPage(10);
// //         // Clear staged changes when navigating back
// //         setStagedChanges({});
// //       }
// //     };

// //     window.addEventListener('popstate', handlePopState);
// //     return () => window.removeEventListener('popstate', handlePopState);
// //   }, [showTableView]);

// //   const fetchTableNames = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get('http://localhost:3000/fetch-table-names', {
// //         withCredentials: true
// //       });
// //       setTableNames(response.data);
// //     } catch (error) {
// //       console.error('Error fetching table names:', error);
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
// //       const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index.toString() }));
// //       setTableData(dataWithKeys);
// //       setFilteredData(dataWithKeys);
// //       if (dataWithKeys.length > 0) {
// //         const tableColumns = Object.keys(dataWithKeys[0])
// //           .map(key => ({
// //             title: key,
// //             dataIndex: key,
// //             key: key,
// //           }));
// //         setColumns(tableColumns);
// //         initializeFilters(dataWithKeys, tableColumns);
// //       }
// //       setCurrentPage(0);
// //       // Clear staged changes when fetching new table data
// //       setStagedChanges({});
// //     } catch (error) {
// //       console.error('Error fetching table data:', error);
// //     }
// //     setLoading(false);
// //   };

// //   const initializeFilters = (data, columns) => {
// //     const newFilters = {};
// //     columns.forEach(column => {
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

// //   // Table names pagination handlers
// //   const handlePreviousTablePage = () => {
// //     setCurrentTablePage(prev => Math.max(0, prev - 1));
// //   };

// //   const handleNextTablePage = () => {
// //     setCurrentTablePage(prev => Math.min(totalTablePages - 1, prev + 1));
// //   };

// //   const getCurrentPageTables = () => {
// //     const startIndex = currentTablePage * tablesPerPage;
// //     const endIndex = startIndex + tablesPerPage;
// //     return tableNames.slice(startIndex, endIndex);
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

// //   // MODIFIED EDIT FUNCTIONS FOR LOCAL STAGING
// //   const handleEdit = (key) => {
// //     setEditingKey(key);
// //     // Check if there's a staged change for this row, otherwise use original data
// //     const stagedRow = stagedChanges[key];
// //     const originalRow = tableData.find(item => item.key === key);
// //     const rowToEdit = stagedRow || originalRow;
// //     setEditedValues({ ...rowToEdit });
// //   };

// //   // MODIFIED: Save changes locally (staging) instead of sending to database immediately
// //   const handleSave = (key) => {
// //     // Stage the changes locally
// //     setStagedChanges(prev => ({ ...prev, [key]: editedValues }));
    
// //     // Update the display data with staged changes
// //     setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
// //     setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
    
// //     setEditingKey('');
// //     setEditedValues({});
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
// //         alert("Image size exceeds 50KB limit");
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

// //   // MODIFIED: Submit all staged changes to database
// //   const submitChanges = async () => {
// //     if (Object.keys(stagedChanges).length === 0) {
// //       alert('No changes to submit');
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const response = await axios.post('http://localhost:3000/update-table-data', {
// //         tableName: selectedTable,
// //         updatedRows: Object.values(stagedChanges)
// //       }, {
// //         withCredentials: true
// //       });
      
// //       if (response.data.success) {
// //         // Clear staged changes after successful submission
// //         setStagedChanges({});
// //         // Refresh data from database to get the latest state
// //         await fetchTableData(selectedTable);
// //         alert('Changes submitted successfully!');
// //       }
// //     } catch (error) {
// //       console.error('Error submitting changes:', error);
// //       alert('Error submitting changes: ' + (error.response?.data?.message || error.message));
// //     }
// //     setLoading(false);
// //   };

// //   // ADD RECORD FUNCTIONS (unchanged)
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
// //       alert("Image size exceeds 50KB limit");
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
// //       if (column.dataIndex !== 'key' && (!newRecord[column.dataIndex] && newRecord[column.dataIndex] !== 0)) {
// //         errors[column.dataIndex] = "Required";
// //       }
// //     });
// //     setAddErrors(errors);
// //     return Object.keys(errors).length === 0;
// //   };

// //   const handleSaveNewRecord = async () => {
// //     if (!validateNewRecord()) return;

// //     try {
// //       const response = await axios.post('http://localhost:3000/add-table-record', {
// //         tableName: selectedTable,
// //         newRecord: newRecord
// //       }, {
// //         withCredentials: true
// //       });

// //       if (response.data.success) {
// //         setAddDialogOpen(false);
// //         setNewRecord({});
// //         fetchTableData(selectedTable);
// //       }
// //     } catch (error) {
// //       console.error('Error adding record:', error);
// //       alert('Error adding record: ' + (error.response?.data?.message || error.message));
// //     }
// //   };

// //   // DELETE RECORD FUNCTIONS (unchanged)
// //   const handleDeleteClick = (row) => {
// //     setRecordToDelete(row);
// //     setDeleteConfirmOpen(true);
// //   };

// //   const handleConfirmDelete = async () => {
// //     try {
// //       const response = await axios.delete('http://localhost:3000/delete-table-record', {
// //         data: {
// //           tableName: selectedTable,
// //           rowData: recordToDelete
// //         },
// //         withCredentials: true
// //       });

// //       if (response.data.success) {
// //         setDeleteConfirmOpen(false);
// //         setRecordToDelete(null);
// //         fetchTableData(selectedTable);
// //       }
// //     } catch (error) {
// //       console.error('Error deleting record:', error);
// //       alert('Error deleting record: ' + (error.response?.data?.message || error.message));
// //     }
// //   };

// //   // IMAGE HANDLING FUNCTIONS (unchanged)
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

// //   // FILTER FUNCTIONS (unchanged)
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

// //   const applyFilters = () => {
// //     let newFilteredData = [...tableData];
    
// //     Object.keys(filters).forEach(columnName => {
// //       const filter = filters[columnName];
// //       if (filter.type === 'dropdown' && filter.selected) {
// //         newFilteredData = newFilteredData.filter(row => 
// //           row[columnName] && row[columnName].toString() === filter.selected
// //         );
// //       } else if (filter.type === 'search' && filter.value) {
// //         newFilteredData = newFilteredData.filter(row =>
// //           row[columnName] && row[columnName].toString().toLowerCase().includes(filter.value.toLowerCase())
// //         );
// //       }
// //     });
// //     setFilteredData(newFilteredData);
// //     setCurrentPage(0);
// //   };

// //   // Material UI table pagination handlers
// //   const handleChangePage = (event, newPage) => {
// //     setCurrentPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setCurrentPage(0);
// //   };

// //   // HELPER FUNCTION: Check if a row has been staged for changes
// //   const isRowStaged = (key) => {
// //     return stagedChanges.hasOwnProperty(key);
// //   };

// //   // DIALOG COMPONENTS (unchanged)
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
// //           {columns.filter(col => col.dataIndex !== 'key').map((column) => (
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
// //           Save Record
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
// //         <Typography>Are you sure you want to delete this record?</Typography>
// //         {recordToDelete && (
// //           <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
// //             This action cannot be undone.
// //           </Typography>
// //         )}
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
// //         <Button onClick={handleConfirmDelete} variant="contained" color="error">
// //           Delete
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );

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

// //           <Box sx={{ 
// //             display: 'flex', 
// //             justifyContent: 'space-between', 
// //             alignItems: 'center',
// //             mb: 3,
// //             px: 1
// //           }}>
// //             <IconButton 
// //               onClick={handlePreviousTablePage}
// //               disabled={currentTablePage === 0}
// //               sx={{ 
// //                 backgroundColor: 'primary.main',
// //                 color: 'white',
// //                 '&:hover': {
// //                   backgroundColor: 'primary.dark',
// //                 },
// //                 '&:disabled': {
// //                   backgroundColor: 'grey.300',
// //                   color: 'grey.500'
// //                 }
// //               }}
// //             >
// //               <ChevronLeftIcon />
// //             </IconButton>

// //             <Typography variant="body2" sx={{ 
// //               fontWeight: 500,
// //               color: 'text.secondary'
// //             }}>
// //               Page {currentTablePage + 1} of {totalTablePages} 
// //               <Typography component="span" sx={{ ml: 1, fontSize: '0.875rem' }}>
// //                 ({tableNames.length} total tables)
// //               </Typography>
// //             </Typography>

// //             <IconButton 
// //               onClick={handleNextTablePage}
// //               disabled={currentTablePage === totalTablePages - 1}
// //               sx={{ 
// //                 backgroundColor: 'primary.main',
// //                 color: 'white',
// //                 '&:hover': {
// //                   backgroundColor: 'primary.dark',
// //                 },
// //                 '&:disabled': {
// //                   backgroundColor: 'grey.300',
// //                   color: 'grey.500'
// //                 }
// //               }}
// //             >
// //               <ChevronRightIcon />
// //             </IconButton>
// //           </Box>
          
// //           <Box sx={{ 
// //             display: 'flex',
// //             justifyContent: 'center',
// //             width: '100%'
// //           }}>
// //             <Box sx={{ 
// //               display: isSmallScreen ? 'block' : 'flex',
// //               gap: 4,
// //               maxWidth: '1000px',
// //               width: '100%'
// //             }}>
// //               {columnsData.map((columnTables, columnIndex) => (
// //                 <Box 
// //                   key={columnIndex}
// //                   sx={{ 
// //                     flex: 1,
// //                     display: 'flex',
// //                     flexDirection: 'column',
// //                     gap: 2,
// //                     mb: isSmallScreen ? 3 : 0
// //                   }}
// //                 >
// //                   {columnTables.map((table, tableIndex) => (
// //                     <Button
// //                       key={`${currentTablePage}-${columnIndex}-${tableIndex}`}
// //                       variant="outlined"
// //                       onClick={() => handleTableSelect(table)}
// //                       sx={{
// //                         width: '100%',
// //                         height: '50px',
// //                         borderRadius: 2,
// //                         textTransform: 'none',
// //                         fontSize: '0.875rem',
// //                         fontWeight: 500,
// //                         border: '2px solid',
// //                         borderColor: 'primary.main',
// //                         color: 'primary.main',
// //                         backgroundColor: 'transparent',
// //                         transition: 'all 0.3s ease',
// //                         '&:hover': {
// //                           backgroundColor: 'primary.main',
// //                           color: 'white',
// //                           transform: 'translateY(-2px)',
// //                           boxShadow: 2
// //                         }
// //                       }}
// //                     >
// //                       <Typography 
// //                         variant="body2" 
// //                         sx={{ 
// //                           whiteSpace: 'nowrap',
// //                           overflow: 'hidden',
// //                           textOverflow: 'ellipsis',
// //                           width: '100%'
// //                         }}
// //                       >
// //                         {table}
// //                       </Typography>
// //                     </Button>
// //                   ))}
// //                 </Box>
// //               ))}
// //             </Box>
// //           </Box>

// //           {totalTablePages > 1 && (
// //             <Box sx={{ 
// //               display: 'flex', 
// //               justifyContent: 'center', 
// //               mt: 3,
// //               gap: 1
// //             }}>
// //               {Array.from({ length: totalTablePages }).map((_, index) => (
// //                 <Box
// //                   key={index}
// //                   onClick={() => setCurrentTablePage(index)}
// //                   sx={{
// //                     width: 8,
// //                     height: 8,
// //                     borderRadius: '50%',
// //                     backgroundColor: index === currentTablePage ? 'primary.main' : 'grey.300',
// //                     cursor: 'pointer',
// //                     transition: 'all 0.2s ease',
// //                     '&:hover': {
// //                       backgroundColor: index === currentTablePage ? 'primary.dark' : 'grey.400',
// //                       transform: 'scale(1.2)'
// //                     }
// //                   }}
// //                 />
// //               ))}
// //             </Box>
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
// //               {/* MODIFIED: Show staged changes count instead of changed rows */}
// //               <Button 
// //                 variant="contained"
// //                 color="warning"
// //                 onClick={submitChanges} 
// //                 disabled={Object.keys(stagedChanges).length === 0}
// //                 sx={{
// //                   color: 'white',
// //                   '&:disabled': {
// //                     backgroundColor: 'grey.300',
// //                     color: 'grey.500'
// //                   }
// //                 }}
// //               >
// //                 Submit Changes ({Object.keys(stagedChanges).length})
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
// //                           // MODIFIED: Highlight rows that have staged changes
// //                           backgroundColor: isRowStaged(row.key) 
// //                             ? 'rgba(255, 193, 7, 0.1)' // Light yellow background for staged rows
// //                             : 'inherit',
// //                           '&:nth-of-type(even)': {
// //                             backgroundColor: isRowStaged(row.key)
// //                               ? 'rgba(255, 193, 7, 0.15)'
// //                               : 'action.hover'
// //                           },
// //                           '&:hover': {
// //                             backgroundColor: isRowStaged(row.key)
// //                               ? 'rgba(255, 193, 7, 0.2)'
// //                               : 'action.selected'
// //                           },
// //                           // Add a subtle border for staged rows
// //                           borderLeft: isRowStaged(row.key) 
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
// //                                   {/* MODIFIED: Show staged indicator */}
// //                                   {isRowStaged(row.key) && col.dataIndex === columns[0].dataIndex && (
// //                                     <Typography 
// //                                       variant="caption" 
// //                                       sx={{ 
// //                                         color: 'orange', 
// //                                         fontWeight: 'bold',
// //                                         fontSize: '10px'
// //                                       }}
// //                                     >
// //                                       STAGED
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
// //                                   title="Stage changes locally"
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
// //     </Box>
// //   );
// // };

// // export default SuperAdminDashboard;



// // SuperAdminDashboard.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   Box,
//   Card,
//   CardContent,
//   CircularProgress,
//   Typography,
//   IconButton,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import {
//   TableView as TableViewIcon,
//   ChevronLeft as ChevronLeftIcon,
//   ChevronRight as ChevronRightIcon,
//   Edit as EditIcon,
//   Save as SaveIcon,
//   Cancel as CancelIcon,
//   GetApp as DownloadIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon
// } from '@mui/icons-material';

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
  
//   const MAX_IMAGE_SIZE = 50 * 1024; // 50KB

//   // Material UI theme and responsive hooks
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

//   // Table names pagination state
//   const [currentTablePage, setCurrentTablePage] = useState(0);
//   const tablesPerPage = 15;
//   const totalTablePages = Math.ceil(tableNames.length / tablesPerPage);

//   useEffect(() => {
//     fetchTableNames();
//   }, []);

//   // FIXED: Apply filters with useCallback
//   const applyFilters = useCallback(() => {
//     let newFilteredData = [...tableData];
    
//     Object.keys(filters).forEach(columnName => {
//       const filter = filters[columnName];
      
//       // Fix for dropdown filters - handle empty values
//       if (filter.type === 'dropdown' && filter.selected !== '' && filter.selected !== null && filter.selected !== undefined) {
//         newFilteredData = newFilteredData.filter(row => {
//           const cellValue = row[columnName];
//           // Handle null/undefined explicitly
//           if (cellValue === null || cellValue === undefined) return false;
//           // Use loose comparison to handle type differences
//           return cellValue.toString() === filter.selected.toString();
//         });
//       } 
//       // Fix for search filters - handle empty values and trim
//       else if (filter.type === 'search' && filter.value && filter.value.trim() !== '') {
//         newFilteredData = newFilteredData.filter(row => {
//           const cellValue = row[columnName];
//           // Handle null/undefined explicitly
//           if (cellValue === null || cellValue === undefined) return false;
//           // Convert to string and perform case-insensitive search
//           return cellValue.toString().toLowerCase().includes(filter.value.toLowerCase());
//         });
//       }
//     });
    
//     setFilteredData(newFilteredData);
//     setCurrentPage(0);
//   }, [tableData, filters]);

//   // FIXED: Updated useEffect with proper dependencies
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
      
//       // Generate temp IDs for tracking changes
//       const dataWithTempIds = response.data.map((item, index) => ({ 
//         ...item, 
//         _temp_id: `temp_${Date.now()}_${index}`,
//         key: index.toString() 
//       }));
      
//       setTableData(dataWithTempIds);
//       setOriginalData(JSON.parse(JSON.stringify(dataWithTempIds))); // Deep copy for comparison
//       setFilteredData(dataWithTempIds);
      
//       if (dataWithTempIds.length > 0) {
//         const tableColumns = Object.keys(dataWithTempIds[0])
//           .filter(key => key !== '_temp_id') // Don't show temp ID column
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

//   // UPDATED: Enhanced data preparation for backend compatibility
//   const prepareDataForSubmission = () => {
//     console.log('=== prepareDataForSubmission DEBUG ===');
//     console.log('pendingChanges:', pendingChanges);
//     console.log('originalData:', originalData);
    
//     const changes = {
//       updates: [],
//       additions: [],
//       deletions: []
//     };

//     // Process updates - compare with original data to find only changed fields
//     Object.entries(pendingChanges.updates).forEach(([tempId, updatedRow]) => {
//       console.log(`Processing update for tempId: ${tempId}`, updatedRow);
      
//       const originalRow = originalData.find(row => row._temp_id === tempId);
//       if (!originalRow) {
//         console.warn(`Original row not found for tempId: ${tempId}`);
//         return;
//       }

//       console.log('Original row:', originalRow);

//       // Find the primary key using common patterns
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

//       // If no standard primary key found, use the first non-temp column
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

//       // Compare all fields and include changed ones
//       const changedFields = {};
//       Object.keys(updatedRow).forEach(key => {
//         if (key !== '_temp_id' && key !== 'key') {
//           const originalValue = originalRow[key];
//           const updatedValue = updatedRow[key];
          
//           // Handle null/undefined values properly
//           const originalStr = originalValue === null || originalValue === undefined ? '' : String(originalValue);
//           const updatedStr = updatedValue === null || updatedValue === undefined ? '' : String(updatedValue);
          
//           if (originalStr !== updatedStr) {
//             changedFields[key] = updatedValue;
//             console.log(`Field changed - ${key}: "${originalValue}" -> "${updatedValue}"`);
//           }
//         }
//       });

//       console.log('Changed fields:', changedFields);

//       // Only add to updates if there are actual changes
//       if (Object.keys(changedFields).length > 0) {
//         // UPDATED: Format for enhanced backend route
//         const updateRecord = {
//           ...changedFields,
//           [primaryKey]: primaryKeyValue // Include the primary key for WHERE clause
//         };
//         changes.updates.push(updateRecord);
//         console.log('Added to updates:', updateRecord);
//       } else {
//         console.log('No changes detected for this row');
//       }
//     });

//     // Process additions - remove temp IDs
//     changes.additions = pendingChanges.additions.map(record => {
//       const cleanRecord = { ...record };
//       delete cleanRecord._temp_id;
//       delete cleanRecord.key;
//       return cleanRecord;
//     });

//     // Process deletions - remove temp IDs, keep only identifying fields
//     changes.deletions = pendingChanges.deletions.map(record => {
//       const cleanRecord = {};
      
//       // Try to find primary key or unique identifier
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

//       // If no standard key found, include all fields for identification
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

//   // UPDATED: Enhanced submit changes function using the new backend route
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

//       // UPDATED: Submit updates using enhanced backend route
//       if (changes.updates.length > 0) {
//         console.log('Submitting updates to enhanced route:', changes.updates);
//         try {
//           const updateResponse = await axios.put('http://localhost:3000/enhanced-update-table-data', {
//             tableName: selectedTable,
//             updates: changes.updates // Note: backend expects 'updates' not 'updatedRows'
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
//             // Handle partial success (207 status)
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

//       // Submit additions (using existing route)
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

//       // Submit deletions (using existing route)
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

//       // Refresh data from server
//       await fetchTableData(selectedTable);
      
//       // Enhanced result reporting
//       if (successfulOperations === totalOperations) {
//         showSnackbar(`All ${totalOperations} changes submitted successfully!`, 'success');
//       } else if (successfulOperations > 0) {
//         showSnackbar(
//           `${successfulOperations} of ${totalOperations} changes submitted successfully. Some operations failed.`, 
//           'warning'
//         );
//         // Log detailed results for debugging
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

//   // Table names pagination handlers
//   const handlePreviousTablePage = () => {
//     setCurrentTablePage(prev => Math.max(0, prev - 1));
//   };

//   const handleNextTablePage = () => {
//     setCurrentTablePage(prev => Math.min(totalTablePages - 1, prev + 1));
//   };

//   const getCurrentPageTables = () => {
//     const startIndex = currentTablePage * tablesPerPage;
//     const endIndex = startIndex + tablesPerPage;
//     return tableNames.slice(startIndex, endIndex);
//   };

//   const getColumnsData = () => {
//     const currentTables = getCurrentPageTables();
//     const columns = [[], [], []];
    
//     currentTables.forEach((table, index) => {
//       const columnIndex = Math.floor(index / 5);
//       if (columnIndex < 3) {
//         columns[columnIndex].push(table);
//       }
//     });
    
//     return columns;
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
    
//     // Check if there's a pending change for this row
//     const tempId = row._temp_id;
//     const pendingRow = pendingChanges.updates[tempId];
//     const rowToEdit = pendingRow || row;
//     setEditedValues({ ...rowToEdit });
//   };

//   // Save changes to pending updates with proper data structure
//   const handleSave = (key) => {
//     const row = tableData.find(item => item.key === key);
//     if (!row) return;
    
//     const tempId = row._temp_id;
    
//     console.log('Saving changes for tempId:', tempId);
//     console.log('Edited values:', editedValues);
    
//     // Stage the changes in pending updates
//     setPendingChanges(prev => {
//       const newPendingChanges = {
//         ...prev,
//         updates: {
//           ...prev.updates,
//           [tempId]: { ...editedValues } // Make sure to spread the edited values
//         }
//       };
//       console.log('New pending changes:', newPendingChanges);
//       return newPendingChanges;
//     });
    
//     // Update the display data with staged changes
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

//   // FILTER FUNCTIONS - THESE ARE THE ONES THAT WERE UPDATED
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

//   // Material UI table pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setCurrentPage(0);
//   };

//   // HELPER FUNCTIONS for pending changes status
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
//     <Dialog 
//       open={addDialogOpen} 
//       onClose={() => setAddDialogOpen(false)}
//       maxWidth="md"
//       fullWidth
//     >
//       <DialogTitle>Add New Record to {selectedTable}</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           {columns.filter(col => col.dataIndex !== 'key' && col.dataIndex !== '_temp_id').map((column) => (
//             <Grid item xs={12} sm={6} key={column.dataIndex}>
//               {isImageColumn(column.dataIndex) ? (
//                 <Box>
//                   <InputLabel>{column.title}</InputLabel>
//                   <input
//                     key={fileInputKey}
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleAddImageUpload(e, column.dataIndex)}
//                     style={{ width: '100%', marginTop: '8px' }}
//                   />
//                   {addErrors[column.dataIndex] && (
//                     <Typography color="error" variant="caption">
//                       {addErrors[column.dataIndex]}
//                     </Typography>
//                   )}
//                   {newRecord[column.dataIndex] && (
//                     <Box sx={{ mt: 1 }}>
//                       <img 
//                         src={formatBase64Image(newRecord[column.dataIndex])}
//                         alt="Preview"
//                         style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
//                         onClick={() => handleImagePreview(newRecord[column.dataIndex])}
//                       />
//                     </Box>
//                   )}
//                 </Box>
//               ) : (
//                 <TextField
//                   fullWidth
//                   label={column.title}
//                   value={newRecord[column.dataIndex] || ''}
//                   onChange={(e) => handleAddFieldChange(column.dataIndex, e.target.value)}
//                   error={!!addErrors[column.dataIndex]}
//                   helperText={addErrors[column.dataIndex]}
//                   size="small"
//                 />
//               )}
//             </Grid>
//           ))}
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
//         <Button onClick={handleSaveNewRecord} variant="contained" color="primary">
//           Stage Record
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );

//   const renderDeleteConfirmation = () => (
//     <Dialog 
//       open={deleteConfirmOpen} 
//       onClose={() => setDeleteConfirmOpen(false)}
//     >
//       <DialogTitle>Confirm Delete</DialogTitle>
//       <DialogContent>
//         <Typography>Are you sure you want to stage this record for deletion?</Typography>
//         {recordToDelete && (
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//             The record will be deleted when you submit changes.
//           </Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
//         <Button onClick={handleConfirmDelete} variant="contained" color="error">
//           Stage for Deletion
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );

//   const renderTableNames = () => {
//     if (tableNames.length === 0) return null;

//     const columnsData = getColumnsData();

//     return (
//       <Card sx={{ 
//         maxWidth: '100%', 
//         mx: 'auto', 
//         mt: 4, 
//         boxShadow: 3,
//         overflow: 'hidden'
//       }}>
//         <CardContent>
//           <Typography variant="h5" component="h2" gutterBottom sx={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             justifyContent: 'center',
//             mb: 3,
//             fontWeight: 600
//           }}>
//             <TableViewIcon sx={{ mr: 1.5, color: 'primary.main' }} /> 
//             Available Tables
//           </Typography>

//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             mb: 3,
//             px: 1
//           }}>
//             <IconButton 
//               onClick={handlePreviousTablePage}
//               disabled={currentTablePage === 0}
//               sx={{ 
//                 backgroundColor: 'primary.main',
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'primary.dark',
//                 },
//                 '&:disabled': {
//                   backgroundColor: 'grey.300',
//                   color: 'grey.500'
//                 }
//               }}
//             >
//               <ChevronLeftIcon />
//             </IconButton>

//             <Typography variant="body2" sx={{ 
//               fontWeight: 500,
//               color: 'text.secondary'
//             }}>
//               Page {currentTablePage + 1} of {totalTablePages} 
//               <Typography component="span" sx={{ ml: 1, fontSize: '0.875rem' }}>
//                 ({tableNames.length} total tables)
//               </Typography>
//             </Typography>

//             <IconButton 
//               onClick={handleNextTablePage}
//               disabled={currentTablePage === totalTablePages - 1}
//               sx={{ 
//                 backgroundColor: 'primary.main',
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'primary.dark',
//                 },
//                 '&:disabled': {
//                   backgroundColor: 'grey.300',
//                   color: 'grey.500'
//                 }
//               }}
//             >
//               <ChevronRightIcon />
//             </IconButton>
//           </Box>
          
//           <Box sx={{ 
//             display: 'flex',
//             justifyContent: 'center',
//             width: '100%'
//           }}>
//             <Box sx={{ 
//               display: isSmallScreen ? 'block' : 'flex',
//               gap: 4,
//               maxWidth: '1000px',
//               width: '100%'
//             }}>
//               {columnsData.map((columnTables, columnIndex) => (
//                 <Box 
//                   key={columnIndex}
//                   sx={{ 
//                     flex: 1,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: 2,
//                     mb: isSmallScreen ? 3 : 0
//                   }}
//                 >
//                   {columnTables.map((table, tableIndex) => (
//                     <Button
//                       key={`${currentTablePage}-${columnIndex}-${tableIndex}`}
//                       variant="outlined"
//                       onClick={() => handleTableSelect(table)}
//                       sx={{
//                         width: '100%',
//                         height: '50px',
//                         borderRadius: 2,
//                         textTransform: 'none',
//                         fontSize: '0.875rem',
//                         fontWeight: 500,
//                         border: '2px solid',
//                         borderColor: 'primary.main',
//                         color: 'primary.main',
//                         backgroundColor: 'transparent',
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                           backgroundColor: 'primary.main',
//                           color: 'white',
//                           transform: 'translateY(-2px)',
//                           boxShadow: 2
//                         }
//                       }}
//                     >
//                       <Typography 
//                         variant="body2" 
//                         sx={{ 
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           width: '100%'
//                         }}
//                       >
//                         {table}
//                       </Typography>
//                     </Button>
//                   ))}
//                 </Box>
//               ))}
//             </Box>
//           </Box>

//           {totalTablePages > 1 && (
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'center', 
//               mt: 3,
//               gap: 1
//             }}>
//               {Array.from({ length: totalTablePages }).map((_, index) => (
//                 <Box
//                   key={index}
//                   onClick={() => setCurrentTablePage(index)}
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: '50%',
//                     backgroundColor: index === currentTablePage ? 'primary.main' : 'grey.300',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       backgroundColor: index === currentTablePage ? 'primary.dark' : 'grey.400',
//                       transform: 'scale(1.2)'
//                     }
//                   }}
//                 />
//               ))}
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   const renderFilterRow = () => {
//     return (
//       <TableRow>
//         {columns.map(column => (
//           <TableCell key={column.key} sx={{ p: 1 }}>
//             {filters[column.dataIndex]?.type === 'dropdown' ? (
//               <FormControl fullWidth size="small">
//                 <Select
//                   value={filters[column.dataIndex].selected || ''}
//                   onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
//                   displayEmpty
//                 >
//                   <MenuItem value="">All</MenuItem>
//                   {filters[column.dataIndex].values.map(value => (
//                     <MenuItem key={value} value={value}>{value}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             ) : (
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Search..."
//                 value={filters[column.dataIndex]?.value || ''}
//                 onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
//               />
//             )}
//           </TableCell>
//         ))}
//         <TableCell sx={{ p: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//             Filters
//           </Typography>
//         </TableCell>
//       </TableRow>
//     );
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
//       {!showTableView ? (
//         <>
//           <Box sx={{ textAlign: 'center', mb: 5 }}>
//             <Typography variant="h3" component="h1" gutterBottom sx={{ 
//               color: 'primary.main', 
//               mb: 3,
//               fontWeight: 600
//             }}>
//               Super Admin Dashboard
//             </Typography>
//             <Typography variant="h6" sx={{ color: 'text.secondary' }}>
//               Select a table to view and manage its data
//             </Typography>
//           </Box>
          
//           {tableNames.length === 0 ? (
//             <Card sx={{ mt: 4, textAlign: 'center', p: 4 }}>
//               <Typography variant="h6" color="text.secondary">
//                 No tables found
//               </Typography>
//               <Typography variant="body1" color="text.secondary">
//                 Please check your database connection
//               </Typography>
//             </Card>
//           ) : (
//             renderTableNames()
//           )}
//         </>
//       ) : (
//         <>
//           <Box sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             mb: 4,
//             flexWrap: 'wrap',
//             gap: 2
//           }}>
//             <Typography variant="h4" component="h2" sx={{ color: 'primary.main', fontWeight: 600 }}>
//               {selectedTable}
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//               <Button 
//                 variant="contained"
//                 color="primary"
//                 startIcon={<AddIcon />}
//                 onClick={handleAddRecord}
//               >
//                 Add Record
//               </Button>
//               <Button 
//                 variant="contained"
//                 color="success"
//                 startIcon={<DownloadIcon />}
//                 onClick={handleDownloadExcel}
//               >
//                 Download Excel
//               </Button>
//               <Button 
//                 variant="contained"
//                 color="warning"
//                 onClick={submitChangesToDatabase} 
//                 disabled={getPendingChangesCount() === 0}
//                 sx={{
//                   color: 'white',
//                   '&:disabled': {
//                     backgroundColor: 'grey.300',
//                     color: 'grey.500'
//                   }
//                 }}
//               >
//                 Submit Changes ({getPendingChangesCount()})
//               </Button>
//             </Box>
//           </Box>

//           <Paper elevation={3} sx={{ overflow: 'hidden' }}>
//             <TableContainer sx={{
//               maxHeight: 'calc(100vh - 200px)',
//               maxWidth: '100%',
//               '&::-webkit-scrollbar': {
//                 height: '8px',
//                 width: '8px'
//               },
//               '&::-webkit-scrollbar-thumb': {
//                 backgroundColor: 'primary.main',
//                 borderRadius: '4px'
//               }
//             }}>
//               <Table stickyHeader aria-label="sticky table" size="small">
//                 <TableHead>
//                   <TableRow>
//                     {columns.map((col) => (
//                       <TableCell
//                         key={col.key}
//                         sx={{
//                           fontWeight: 'bold',
//                           backgroundColor: 'primary.main',
//                           color: 'primary.contrastText',
//                           whiteSpace: 'nowrap'
//                         }}
//                       >
//                         {col.title}
//                       </TableCell>
//                     ))}
//                     <TableCell
//                       sx={{
//                         fontWeight: 'bold',
//                         backgroundColor: 'primary.main',
//                         color: 'primary.contrastText',
//                         width: '150px'
//                       }}
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                   {renderFilterRow()}
//                 </TableHead>
//                 <TableBody>
//                   {filteredData
//                     .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
//                     .map((row) => (
//                       <TableRow
//                         key={row.key}
//                         sx={{
//                           backgroundColor: isRowPending(row) 
//                             ? 'rgba(255, 193, 7, 0.1)' 
//                             : 'inherit',
//                           '&:nth-of-type(even)': {
//                             backgroundColor: isRowPending(row)
//                               ? 'rgba(255, 193, 7, 0.15)'
//                               : 'action.hover'
//                           },
//                           '&:hover': {
//                             backgroundColor: isRowPending(row)
//                               ? 'rgba(255, 193, 7, 0.2)'
//                               : 'action.selected'
//                           },
//                           borderLeft: isRowPending(row) 
//                             ? '3px solid #ff9800' 
//                             : 'none'
//                         }}
//                       >
//                         {columns.map((col) => (
//                           <TableCell key={col.key}>
//                             {editingKey === row.key ? (
//                               isImageColumn(col.dataIndex) ? (
//                                 <input
//                                   type="file"
//                                   accept="image/*"
//                                   onChange={(e) => handleImageChange(col.dataIndex, e)}
//                                   style={{ width: '100%' }}
//                                 />
//                               ) : (
//                                 <TextField
//                                   fullWidth
//                                   size="small"
//                                   value={editedValues[col.dataIndex] || ''}
//                                   onChange={(e) => handleChange(col.dataIndex, e.target.value)}
//                                 />
//                               )
//                             ) : (
//                               isImageColumn(col.dataIndex) ? (
//                                 <img 
//                                   src={formatBase64Image(row[col.dataIndex])} 
//                                   alt={col.dataIndex}
//                                   style={{
//                                     maxWidth: '60px',
//                                     maxHeight: '60px',
//                                     objectFit: 'cover',
//                                     borderRadius: '4px',
//                                     cursor: 'pointer'
//                                   }}
//                                   onClick={() => handleImagePreview(row[col.dataIndex])}
//                                 />
//                               ) : (
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                   <Typography variant="body2" sx={{
//                                     maxWidth: '200px',
//                                     overflow: 'hidden',
//                                     textOverflow: 'ellipsis',
//                                     whiteSpace: 'nowrap'
//                                   }}>
//                                     {typeof row[col.dataIndex] === 'string' && row[col.dataIndex].length > 100
//                                       ? `${row[col.dataIndex].substring(0, 100)}...`
//                                       : row[col.dataIndex]}
//                                   </Typography>
//                                   {isRowPending(row) && col.dataIndex === columns[0].dataIndex && (
//                                     <Typography 
//                                       variant="caption" 
//                                       sx={{ 
//                                         color: 'orange', 
//                                         fontWeight: 'bold',
//                                         fontSize: '10px'
//                                       }}
//                                     >
//                                       PENDING
//                                     </Typography>
//                                   )}
//                                 </Box>
//                               )
//                             )}
//                           </TableCell>
//                         ))}
//                         <TableCell>
//                           <Box sx={{ display: 'flex', gap: 1 }}>
//                             {editingKey === row.key ? (
//                               <>
//                                 <IconButton
//                                   color="success"
//                                   onClick={() => handleSave(row.key)}
//                                   size="small"
//                                   title="Stage changes"
//                                 >
//                                   <SaveIcon />
//                                 </IconButton>
//                                 <IconButton
//                                   color="error"
//                                   onClick={handleCancel}
//                                   size="small"
//                                 >
//                                   <CancelIcon />
//                                 </IconButton>
//                               </>
//                             ) : (
//                               <>
//                                 <IconButton
//                                   color="primary"
//                                   onClick={() => handleEdit(row.key)}
//                                   size="small"
//                                 >
//                                   <EditIcon />
//                                 </IconButton>
//                                 <IconButton
//                                   color="error"
//                                   onClick={() => handleDeleteClick(row)}
//                                   size="small"
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </>
//                             )}
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[10, 25, 50, 100]}
//               component="div"
//               count={filteredData.length}
//               rowsPerPage={rowsPerPage}
//               page={currentPage}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               sx={{
//                 '& .MuiTablePagination-toolbar': {
//                   paddingLeft: 2,
//                   paddingRight: 1
//                 }
//               }}
//             />
//           </Paper>

//           {/* DIALOGS */}
//           {renderAddRecordDialog()}
//           {renderDeleteConfirmation()}
//         </>
//       )}

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default SuperAdminDashboard;



// SuperAdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  TableView as TableViewIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  GetApp as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

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

  // Material UI theme and responsive hooks
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Table names pagination state - now works with filtered tables
  const [currentTablePage, setCurrentTablePage] = useState(0);
  const tablesPerPage = 15;
  const totalTablePages = Math.ceil(filteredTableNames.length / tablesPerPage);

  useEffect(() => {
    fetchTableNames();
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
    setCurrentTablePage(0); // Reset to first page when search changes
  }, [tableNames, tableSearchQuery]);

  // FIXED: Apply filters with useCallback
  const applyFilters = useCallback(() => {
    let newFilteredData = [...tableData];
    
    Object.keys(filters).forEach(columnName => {
      const filter = filters[columnName];
      
      // Fix for dropdown filters - handle empty values
      if (filter.type === 'dropdown' && filter.selected !== '' && filter.selected !== null && filter.selected !== undefined) {
        newFilteredData = newFilteredData.filter(row => {
          const cellValue = row[columnName];
          // Handle null/undefined explicitly
          if (cellValue === null || cellValue === undefined) return false;
          // Use loose comparison to handle type differences
          return cellValue.toString() === filter.selected.toString();
        });
      } 
      // Fix for search filters - handle empty values and trim
      else if (filter.type === 'search' && filter.value && filter.value.trim() !== '') {
        newFilteredData = newFilteredData.filter(row => {
          const cellValue = row[columnName];
          // Handle null/undefined explicitly
          if (cellValue === null || cellValue === undefined) return false;
          // Convert to string and perform case-insensitive search
          return cellValue.toString().toLowerCase().includes(filter.value.toLowerCase());
        });
      }
    });
    
    setFilteredData(newFilteredData);
    setCurrentPage(0);
  }, [tableData, filters]);

  // FIXED: Updated useEffect with proper dependencies
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
      
      // Generate temp IDs for tracking changes
      const dataWithTempIds = response.data.map((item, index) => ({ 
        ...item, 
        _temp_id: `temp_${Date.now()}_${index}`,
        key: index.toString() 
      }));
      
      setTableData(dataWithTempIds);
      setOriginalData(JSON.parse(JSON.stringify(dataWithTempIds))); // Deep copy for comparison
      setFilteredData(dataWithTempIds);
      
      if (dataWithTempIds.length > 0) {
        const tableColumns = Object.keys(dataWithTempIds[0])
          .filter(key => key !== '_temp_id') // Don't show temp ID column
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

  // NEW: Handle table search functionality
  const handleTableSearchChange = (event) => {
    setTableSearchQuery(event.target.value);
  };

  const handleClearTableSearch = () => {
    setTableSearchQuery('');
  };

  // UPDATED: Enhanced data preparation for backend compatibility
  const prepareDataForSubmission = () => {
    console.log('=== prepareDataForSubmission DEBUG ===');
    console.log('pendingChanges:', pendingChanges);
    console.log('originalData:', originalData);
    
    const changes = {
      updates: [],
      additions: [],
      deletions: []
    };

    // Process updates - compare with original data to find only changed fields
    Object.entries(pendingChanges.updates).forEach(([tempId, updatedRow]) => {
      console.log(`Processing update for tempId: ${tempId}`, updatedRow);
      
      const originalRow = originalData.find(row => row._temp_id === tempId);
      if (!originalRow) {
        console.warn(`Original row not found for tempId: ${tempId}`);
        return;
      }

      console.log('Original row:', originalRow);

      // Find the primary key using common patterns
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

      // If no standard primary key found, use the first non-temp column
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

      // Compare all fields and include changed ones
      const changedFields = {};
      Object.keys(updatedRow).forEach(key => {
        if (key !== '_temp_id' && key !== 'key') {
          const originalValue = originalRow[key];
          const updatedValue = updatedRow[key];
          
          // Handle null/undefined values properly
          const originalStr = originalValue === null || originalValue === undefined ? '' : String(originalValue);
          const updatedStr = updatedValue === null || updatedValue === undefined ? '' : String(updatedValue);
          
          if (originalStr !== updatedStr) {
            changedFields[key] = updatedValue;
            console.log(`Field changed - ${key}: "${originalValue}" -> "${updatedValue}"`);
          }
        }
      });

      console.log('Changed fields:', changedFields);

      // Only add to updates if there are actual changes
      if (Object.keys(changedFields).length > 0) {
        // UPDATED: Format for enhanced backend route
        const updateRecord = {
          ...changedFields,
          [primaryKey]: primaryKeyValue // Include the primary key for WHERE clause
        };
        changes.updates.push(updateRecord);
        console.log('Added to updates:', updateRecord);
      } else {
        console.log('No changes detected for this row');
      }
    });

    // Process additions - remove temp IDs
    changes.additions = pendingChanges.additions.map(record => {
      const cleanRecord = { ...record };
      delete cleanRecord._temp_id;
      delete cleanRecord.key;
      return cleanRecord;
    });

    // Process deletions - remove temp IDs, keep only identifying fields
    changes.deletions = pendingChanges.deletions.map(record => {
      const cleanRecord = {};
      
      // Try to find primary key or unique identifier
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

      // If no standard key found, include all fields for identification
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

  // UPDATED: Enhanced submit changes function using the new backend route
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

      // UPDATED: Submit updates using enhanced backend route
      if (changes.updates.length > 0) {
        console.log('Submitting updates to enhanced route:', changes.updates);
        try {
          const updateResponse = await axios.put('http://localhost:3000/enhanced-update-table-data', {
            tableName: selectedTable,
            updates: changes.updates // Note: backend expects 'updates' not 'updatedRows'
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
            // Handle partial success (207 status)
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

      // Submit additions (using existing route)
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

      // Submit deletions (using existing route)
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

      // Refresh data from server
      await fetchTableData(selectedTable);
      
      // Enhanced result reporting
      if (successfulOperations === totalOperations) {
        showSnackbar(`All ${totalOperations} changes submitted successfully!`, 'success');
      } else if (successfulOperations > 0) {
        showSnackbar(
          `${successfulOperations} of ${totalOperations} changes submitted successfully. Some operations failed.`, 
          'warning'
        );
        // Log detailed results for debugging
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

  // Table names pagination handlers - now works with filtered tables
  const handlePreviousTablePage = () => {
    setCurrentTablePage(prev => Math.max(0, prev - 1));
  };

  const handleNextTablePage = () => {
    setCurrentTablePage(prev => Math.min(totalTablePages - 1, prev + 1));
  };

  // UPDATED: Get current page tables from filtered results
  const getCurrentPageTables = () => {
    const startIndex = currentTablePage * tablesPerPage;
    const endIndex = startIndex + tablesPerPage;
    return filteredTableNames.slice(startIndex, endIndex);
  };

  const getColumnsData = () => {
    const currentTables = getCurrentPageTables();
    const columns = [[], [], []];
    
    currentTables.forEach((table, index) => {
      const columnIndex = Math.floor(index / 5);
      if (columnIndex < 3) {
        columns[columnIndex].push(table);
      }
    });
    
    return columns;
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
    
    // Check if there's a pending change for this row
    const tempId = row._temp_id;
    const pendingRow = pendingChanges.updates[tempId];
    const rowToEdit = pendingRow || row;
    setEditedValues({ ...rowToEdit });
  };

  // Save changes to pending updates with proper data structure
  const handleSave = (key) => {
    const row = tableData.find(item => item.key === key);
    if (!row) return;
    
    const tempId = row._temp_id;
    
    console.log('Saving changes for tempId:', tempId);
    console.log('Edited values:', editedValues);
    
    // Stage the changes in pending updates
    setPendingChanges(prev => {
      const newPendingChanges = {
        ...prev,
        updates: {
          ...prev.updates,
          [tempId]: { ...editedValues } // Make sure to spread the edited values
        }
      };
      console.log('New pending changes:', newPendingChanges);
      return newPendingChanges;
    });
    
    // Update the display data with staged changes
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

  // FILTER FUNCTIONS - THESE ARE THE ONES THAT WERE UPDATED
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

  // Material UI table pagination handlers
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  // HELPER FUNCTIONS for pending changes status
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
    <Dialog 
      open={addDialogOpen} 
      onClose={() => setAddDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add New Record to {selectedTable}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {columns.filter(col => col.dataIndex !== 'key' && col.dataIndex !== '_temp_id').map((column) => (
            <Grid item xs={12} sm={6} key={column.dataIndex}>
              {isImageColumn(column.dataIndex) ? (
                <Box>
                  <InputLabel>{column.title}</InputLabel>
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAddImageUpload(e, column.dataIndex)}
                    style={{ width: '100%', marginTop: '8px' }}
                  />
                  {addErrors[column.dataIndex] && (
                    <Typography color="error" variant="caption">
                      {addErrors[column.dataIndex]}
                    </Typography>
                  )}
                  {newRecord[column.dataIndex] && (
                    <Box sx={{ mt: 1 }}>
                      <img 
                        src={formatBase64Image(newRecord[column.dataIndex])}
                        alt="Preview"
                        style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                        onClick={() => handleImagePreview(newRecord[column.dataIndex])}
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <TextField
                  fullWidth
                  label={column.title}
                  value={newRecord[column.dataIndex] || ''}
                  onChange={(e) => handleAddFieldChange(column.dataIndex, e.target.value)}
                  error={!!addErrors[column.dataIndex]}
                  helperText={addErrors[column.dataIndex]}
                  size="small"
                />
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleSaveNewRecord} variant="contained" color="primary">
          Stage Record
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDeleteConfirmation = () => (
    <Dialog 
      open={deleteConfirmOpen} 
      onClose={() => setDeleteConfirmOpen(false)}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to stage this record for deletion?</Typography>
        {recordToDelete && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The record will be deleted when you submit changes.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmDelete} variant="contained" color="error">
          Stage for Deletion
        </Button>
      </DialogActions>
    </Dialog>
  );

  // UPDATED: Table names component with search functionality
  const renderTableNames = () => {
    if (tableNames.length === 0) return null;

    const columnsData = getColumnsData();

    return (
      <Card sx={{ 
        maxWidth: '100%', 
        mx: 'auto', 
        mt: 4, 
        boxShadow: 3,
        overflow: 'hidden'
      }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            fontWeight: 600
          }}>
            <TableViewIcon sx={{ mr: 1.5, color: 'primary.main' }} /> 
            Available Tables
          </Typography>

          {/* NEW: Table Search Bar */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search table names..."
              value={tableSearchQuery}
              onChange={handleTableSearchChange}
              sx={{ maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: tableSearchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearTableSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Show search results info */}
          {tableSearchQuery && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Found {filteredTableNames.length} table{filteredTableNames.length !== 1 ? 's' : ''} matching "{tableSearchQuery}"
              </Typography>
            </Box>
          )}

          {filteredTableNames.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {tableSearchQuery ? 'No tables found matching your search' : 'No tables available'}
              </Typography>
              {tableSearchQuery && (
                <Button 
                  variant="outlined" 
                  onClick={handleClearTableSearch}
                  sx={{ mt: 2 }}
                >
                  Clear Search
                </Button>
              )}
            </Box>
          ) : (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3,
                px: 1
              }}>
                <IconButton 
                  onClick={handlePreviousTablePage}
                  disabled={currentTablePage === 0 || totalTablePages <= 1}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '&:disabled': {
                      backgroundColor: 'grey.300',
                      color: 'grey.500'
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Typography variant="body2" sx={{ 
                  fontWeight: 500,
                  color: 'text.secondary'
                }}>
                  {totalTablePages > 1 ? (
                    <>
                      Page {currentTablePage + 1} of {totalTablePages} 
                      <Typography component="span" sx={{ ml: 1, fontSize: '0.875rem' }}>
                        ({filteredTableNames.length} table{filteredTableNames.length !== 1 ? 's' : ''})
                      </Typography>
                    </>
                  ) : (
                    `${filteredTableNames.length} table${filteredTableNames.length !== 1 ? 's' : ''}`
                  )}
                </Typography>

                <IconButton 
                  onClick={handleNextTablePage}
                  disabled={currentTablePage === totalTablePages - 1 || totalTablePages <= 1}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '&:disabled': {
                      backgroundColor: 'grey.300',
                      color: 'grey.500'
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}>
                <Box sx={{ 
                  display: isSmallScreen ? 'block' : 'flex',
                  gap: 4,
                  maxWidth: '1000px',
                  width: '100%'
                }}>
                  {columnsData.map((columnTables, columnIndex) => (
                    <Box 
                      key={columnIndex}
                      sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: isSmallScreen ? 3 : 0
                      }}
                    >
                      {columnTables.map((table, tableIndex) => (
                        <Button
                          key={`${currentTablePage}-${columnIndex}-${tableIndex}`}
                          variant="outlined"
                          onClick={() => handleTableSelect(table)}
                          sx={{
                            width: '100%',
                            height: '50px',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            border: '2px solid',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            backgroundColor: 'transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              transform: 'translateY(-2px)',
                              boxShadow: 2
                            }
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              width: '100%'
                            }}
                          >
                            {table}
                          </Typography>
                        </Button>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>

              {totalTablePages > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 3,
                  gap: 1
                }}>
                  {Array.from({ length: totalTablePages }).map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentTablePage(index)}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === currentTablePage ? 'primary.main' : 'grey.300',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: index === currentTablePage ? 'primary.dark' : 'grey.400',
                          transform: 'scale(1.2)'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFilterRow = () => {
    return (
      <TableRow>
        {columns.map(column => (
          <TableCell key={column.key} sx={{ p: 1 }}>
            {filters[column.dataIndex]?.type === 'dropdown' ? (
              <FormControl fullWidth size="small">
                <Select
                  value={filters[column.dataIndex].selected || ''}
                  onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All</MenuItem>
                  {filters[column.dataIndex].values.map(value => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={filters[column.dataIndex]?.value || ''}
                onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
              />
            )}
          </TableCell>
        ))}
        <TableCell sx={{ p: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Filters
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {!showTableView ? (
        <>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              color: 'primary.main', 
              mb: 3,
              fontWeight: 600
            }}>
              Super Admin Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Select a table to view and manage its data
            </Typography>
          </Box>
          
          {tableNames.length === 0 ? (
            <Card sx={{ mt: 4, textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No tables found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please check your database connection
              </Typography>
            </Card>
          ) : (
            renderTableNames()
          )}
        </>
      ) : (
        <>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h4" component="h2" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {selectedTable}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddRecord}
              >
                Add Record
              </Button>
              <Button 
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadExcel}
              >
                Download Excel
              </Button>
              <Button 
                variant="contained"
                color="warning"
                onClick={submitChangesToDatabase} 
                disabled={getPendingChangesCount() === 0}
                sx={{
                  color: 'white',
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                Submit Changes ({getPendingChangesCount()})
              </Button>
            </Box>
          </Box>

          <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            <TableContainer sx={{
              maxHeight: 'calc(100vh - 200px)',
              maxWidth: '100%',
              '&::-webkit-scrollbar': {
                height: '8px',
                width: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'primary.main',
                borderRadius: '4px'
              }
            }}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        sx={{
                          fontWeight: 'bold',
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {col.title}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        width: '150px'
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                  {renderFilterRow()}
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.key}
                        sx={{
                          backgroundColor: isRowPending(row) 
                            ? 'rgba(255, 193, 7, 0.1)' 
                            : 'inherit',
                          '&:nth-of-type(even)': {
                            backgroundColor: isRowPending(row)
                              ? 'rgba(255, 193, 7, 0.15)'
                              : 'action.hover'
                          },
                          '&:hover': {
                            backgroundColor: isRowPending(row)
                              ? 'rgba(255, 193, 7, 0.2)'
                              : 'action.selected'
                          },
                          borderLeft: isRowPending(row) 
                            ? '3px solid #ff9800' 
                            : 'none'
                        }}
                      >
                        {columns.map((col) => (
                          <TableCell key={col.key}>
                            {editingKey === row.key ? (
                              isImageColumn(col.dataIndex) ? (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(col.dataIndex, e)}
                                  style={{ width: '100%' }}
                                />
                              ) : (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={editedValues[col.dataIndex] || ''}
                                  onChange={(e) => handleChange(col.dataIndex, e.target.value)}
                                />
                              )
                            ) : (
                              isImageColumn(col.dataIndex) ? (
                                <img 
                                  src={formatBase64Image(row[col.dataIndex])} 
                                  alt={col.dataIndex}
                                  style={{
                                    maxWidth: '60px',
                                    maxHeight: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleImagePreview(row[col.dataIndex])}
                                />
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" sx={{
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {typeof row[col.dataIndex] === 'string' && row[col.dataIndex].length > 100
                                      ? `${row[col.dataIndex].substring(0, 100)}...`
                                      : row[col.dataIndex]}
                                  </Typography>
                                  {isRowPending(row) && col.dataIndex === columns[0].dataIndex && (
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        color: 'orange', 
                                        fontWeight: 'bold',
                                        fontSize: '10px'
                                      }}
                                    >
                                      PENDING
                                    </Typography>
                                  )}
                                </Box>
                              )
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {editingKey === row.key ? (
                              <>
                                <IconButton
                                  color="success"
                                  onClick={() => handleSave(row.key)}
                                  size="small"
                                  title="Stage changes"
                                >
                                  <SaveIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={handleCancel}
                                  size="small"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEdit(row.key)}
                                  size="small"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(row)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  paddingLeft: 2,
                  paddingRight: 1
                }
              }}
            />
          </Paper>

          {/* DIALOGS */}
          {renderAddRecordDialog()}
          {renderDeleteConfirmation()}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuperAdminDashboard;
