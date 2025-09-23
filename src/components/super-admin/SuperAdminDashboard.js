// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import * as XLSX from 'xlsx';
// // import './SuperAdminDashboard.css';

// // const SuperAdminDashboard = () => {
// //     const [tableNames, setTableNames] = useState([]);
// //     const [selectedTable, setSelectedTable] = useState(null);
// //     const [tableData, setTableData] = useState([]);
// //     const [columns, setColumns] = useState([]);
// //     const [filteredData, setFilteredData] = useState([]);
// //     const [editingKey, setEditingKey] = useState('');
// //     const [editedValues, setEditedValues] = useState({});
// //     const [changedRows, setChangedRows] = useState({});
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [filters, setFilters] = useState({});
// //     const pageSize = 10;

// //     useEffect(() => {
// //         fetchTableNames();
// //     }, []);

// //     useEffect(() => {
// //         if (selectedTable) {
// //             applyFilters();
// //         }
// //     }, [filters, tableData]);

// //     const fetchTableNames = async () => {
// //         try {
// //             const response = await axios.get('http://localhost:3000/fetch-table-names', {
// //                 withCredentials: true
// //             });
// //             setTableNames(response.data);
// //         } catch (error) {
// //             console.error('Error fetching table names:', error);
// //         }
// //     };

// //     const fetchTableData = async (tableName) => {
// //         try {
// //             const response = await axios.post('http://localhost:3000/fetch-table-data', {
// //                 tableName
// //             }, {
// //                 withCredentials: true
// //             });
// //             const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index.toString() }));
// //             setTableData(dataWithKeys);
// //             setFilteredData(dataWithKeys);
// //             if (dataWithKeys.length > 0) {
// //                 const tableColumns = Object.keys(dataWithKeys[0])
// //                     .map(key => ({
// //                         title: key,  
// //                         dataIndex: key,
// //                         key: key,
// //                     }));
// //                 setColumns(tableColumns);
// //                 initializeFilters(dataWithKeys, tableColumns);
// //             }
// //         } catch (error) {
// //             console.error('Error fetching table data:', error);
// //         }
// //     };

// //     const initializeFilters = (data, columns) => {
// //         const newFilters = {};
// //         columns.forEach(column => {
// //             const uniqueValues = [...new Set(data.map(item => item[column.dataIndex]))];
// //             if (uniqueValues.length <= 20) {
// //                 newFilters[column.dataIndex] = {
// //                     type: 'dropdown',
// //                     values: uniqueValues,
// //                     selected: ''
// //                 };
// //             } else {
// //                 newFilters[column.dataIndex] = {
// //                     type: 'search',
// //                     value: ''
// //                 };
// //             }
// //         });
// //         setFilters(newFilters);
// //     };

// //     const handleTableSelect = (event) => {
// //         const value = event.target.value;
// //         setSelectedTable(value);
// //         fetchTableData(value);
// //     };

// //     const handleDownloadExcel = () => {
// //         const worksheet = XLSX.utils.json_to_sheet(filteredData);
// //         const workbook = XLSX.utils.book_new();
// //         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
// //         XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
// //         alert('Excel file downloaded successfully!');
// //     };

// //     const handleEdit = (key) => {
// //         setEditingKey(key);
// //         const row = tableData.find(item => item.key === key);
// //         setEditedValues(row);
// //     };

// //     const handleSave = (key) => {
// //         setChangedRows(prev => ({...prev, [key]: editedValues}));
// //         setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
// //         setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
// //         setEditingKey('');
// //         setEditedValues({});
// //         alert('Row updated locally. Click Submit Changes to save to the backend.');
// //     };

// //     const handleCancel = () => {
// //         setEditingKey('');
// //         setEditedValues({});
// //     };

// //     const handleChange = (dataIndex, value) => {
// //         setEditedValues(prev => ({...prev, [dataIndex]: value}));
// //     };

// //     const handleImageChange = (dataIndex, event) => {
// //         const file = event.target.files[0];
// //         if (file) {
// //             const reader = new FileReader();
// //             reader.onloadend = () => {
// //                 const base64String = reader.result.split(',')[1];
// //                 handleChange(dataIndex, base64String);
// //             };
// //             reader.readAsDataURL(file);
// //         }
// //     };

// //     const submitChanges = async () => {
// //         try {
// //             const response = await axios.post('http://localhost:3000/update-table-data', {
// //                 tableName: selectedTable,
// //                 updatedRows: Object.values(changedRows)
// //             }, {
// //                 withCredentials: true
// //             });
// //             if (response.data.success) {
// //                 alert('Changes submitted successfully to the backend');
// //                 setChangedRows({});
// //                 fetchTableData(selectedTable);
// //             } else {
// //                 alert('Failed to submit changes to the backend');
// //             }
// //         } catch (error) {
// //             console.error('Error submitting changes:', error);
// //             alert('Error submitting changes to the backend');
// //         }
// //     };

// //     const isImageColumn = (columnName) => {
// //         const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4','logo'];
// //         return imageColumns.includes(columnName.toLowerCase());
// //     };

// //     const handleFilterChange = (columnName, value) => {
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [columnName]: {
// //                 ...prevFilters[columnName],
// //                 selected: value
// //             }
// //         }));
// //     };

// //     const handleSearchChange = (columnName, value) => {
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [columnName]: {
// //                 ...prevFilters[columnName],
// //                 value: value
// //             }
// //         }));
// //     };

// //     const applyFilters = () => {
// //         let newFilteredData = [...tableData];
        
// //         Object.keys(filters).forEach(columnName => {
// //             const filter = filters[columnName];
// //             if (filter.type === 'dropdown' && filter.selected) {
// //                 newFilteredData = newFilteredData.filter(row => 
// //                     row[columnName] && row[columnName].toString() === filter.selected
// //                 );
// //             } else if (filter.type === 'search' && filter.value) {
// //                 newFilteredData = newFilteredData.filter(row =>
// //                     row[columnName] && row[columnName].toString().toLowerCase().includes(filter.value.toLowerCase())
// //                 );
// //             }
// //         });

// //         setFilteredData(newFilteredData);
// //         setCurrentPage(1);
// //     };

// //     const renderTableHeader = () => {
// //         return (
// //             <tr>
// //                 {columns.map(column => (
// //                     <th key={column.key} className="sa-table-header-cell">
// //                         {column.title}
// //                         {filters[column.dataIndex]?.type === 'dropdown' ? (
// //                             <select 
// //                                 className="sa-filter-dropdown"
// //                                 value={filters[column.dataIndex].selected} 
// //                                 onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
// //                             >
// //                                 <option value="">All</option>
// //                                 {filters[column.dataIndex].values.map(value => (
// //                                     <option key={value} value={value}>{value}</option>
// //                                 ))}
// //                             </select>
// //                         ) : (
// //                             <input 
// //                                 className="sa-filter-search"
// //                                 type="text" 
// //                                 placeholder="Search..." 
// //                                 value={filters[column.dataIndex]?.value || ''}
// //                                 onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
// //                             />
// //                         )}
// //                     </th>
// //                 ))}
// //                 <th className="sa-table-header-cell">Action</th>
// //             </tr>
// //         );
// //     };

// //     const renderTableBody = () => {
// //         const startIndex = (currentPage - 1) * pageSize;
// //         const endIndex = startIndex + pageSize;
// //         return filteredData.slice(startIndex, endIndex).map(row => (
// //             <tr key={row.key} className="sa-table-row">
// //                 {columns.map(column => (
// //                     <td key={column.key} className="sa-table-cell">
// //                         {editingKey === row.key ? (
// //                             isImageColumn(column.dataIndex) ? (
// //                                 <input
// //                                     type="file"
// //                                     accept="image/*"
// //                                     onChange={(e) => handleImageChange(column.dataIndex, e)}
// //                                     className="sa-file-input"
// //                                 />
// //                             ) : (
// //                                 <input
// //                                     value={editedValues[column.dataIndex] || ''}
// //                                     onChange={(e) => handleChange(column.dataIndex, e.target.value)}
// //                                     className="sa-text-input"
// //                                 />
// //                             )
// //                         ) : (
// //                             isImageColumn(column.dataIndex) ? (
// //                                 <img 
// //                                     src={`data:image/jpeg;base64,${row[column.dataIndex]}`} 
// //                                     alt={`${column.dataIndex}`}
// //                                     className="sa-table-image"
// //                                 />
// //                             ) : (
// //                                 <div className="sa-cell-content">
// //                                     {typeof row[column.dataIndex] === 'string' && row[column.dataIndex].length > 100
// //                                         ? `${row[column.dataIndex].substring(0, 100)}...`
// //                                         : row[column.dataIndex]}
// //                                 </div>
// //                             )
// //                         )}
// //                     </td>
// //                 ))}
// //                 <td className="sa-table-cell">
// //                     {editingKey === row.key ? (
// //                         <div className="sa-action-buttons">
// //                             <button className="sa-save-button" onClick={() => handleSave(row.key)}>Save</button>
// //                             <button className="sa-cancel-button" onClick={handleCancel}>Cancel</button>
// //                         </div>
// //                     ) : (
// //                         <button className="sa-edit-button" onClick={() => handleEdit(row.key)}>Edit</button>
// //                     )}
// //                 </td>
// //             </tr>
// //         ));
// //     };

// //     const renderPagination = () => {
// //         const totalPages = Math.ceil(filteredData.length / pageSize);
// //         return (
// //             <div className="sa-pagination">
// //                 <button 
// //                     className="sa-pagination-button"
// //                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
// //                     disabled={currentPage === 1}
// //                 >
// //                     Previous
// //                 </button>
// //                 <span className="sa-pagination-info">{currentPage} / {totalPages}</span>
// //                 <button 
// //                     className="sa-pagination-button"
// //                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
// //                     disabled={currentPage === totalPages}
// //                 >
// //                     Next
// //                 </button>
// //             </div>
// //         );
// //     };

// //     return (
// //         <div className="sa-dashboard">
// //             <h1 className="sa-dashboard-title">Super Admin Dashboard</h1>
// //             <div className="sa-controls">
// //                 <select className="sa-table-select" onChange={handleTableSelect} value={selectedTable || ""}>
// //                     <option value="">Select a table</option>
// //                     {tableNames.map(name => (
// //                         <option key={name} value={name}>{name}</option>
// //                     ))}
// //                 </select>
// //                 {selectedTable && (
// //                     <>
// //                         <button className="sa-download-button" onClick={handleDownloadExcel}>Download Excel</button>
// //                         <button 
// //                             className="sa-submit-button" 
// //                             onClick={submitChanges} 
// //                             disabled={Object.keys(changedRows).length === 0}
// //                         >
// //                             Submit Changes
// //                         </button>
// //                     </>
// //                 )}
// //             </div>
// //             {selectedTable && (
// //                 <div className="sa-table-container">
// //                     <table className="sa-table">
// //                         <thead>{renderTableHeader()}</thead>
// //                         <tbody>{renderTableBody()}</tbody>
// //                     </table>
// //                     {renderPagination()}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default SuperAdminDashboard;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './SuperAdminDashboard.css';

// const SuperAdminDashboard = () => {
//     const [tableNames, setTableNames] = useState([]);
//     const [selectedTable, setSelectedTable] = useState(null);
//     const [tableData, setTableData] = useState([]);
//     const [columns, setColumns] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [editingKey, setEditingKey] = useState('');
//     const [editedValues, setEditedValues] = useState({});
//     const [changedRows, setChangedRows] = useState({});
//     const [currentPage, setCurrentPage] = useState(1);
//     const [filters, setFilters] = useState({});
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [showTableView, setShowTableView] = useState(false);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchTableNames();
//     }, []);

//     useEffect(() => {
//         if (selectedTable) {
//             applyFilters();
//         }
//     }, [filters, tableData]);

//     // Handle browser back button navigation
//     useEffect(() => {
//         const handlePopState = () => {
//             if (showTableView) {
//                 setShowTableView(false);
//                 setSelectedTable(null);
//                 setTableData([]);
//                 setFilteredData([]);
//                 setColumns([]);
//                 setCurrentPage(1);
//                 setRowsPerPage(10);
//             }
//         };

//         window.addEventListener('popstate', handlePopState);
//         return () => window.removeEventListener('popstate', handlePopState);
//     }, [showTableView]);

//     const fetchTableNames = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get('http://localhost:3000/fetch-table-names', {
//                 withCredentials: true
//             });
//             setTableNames(response.data);
//         } catch (error) {
//             console.error('Error fetching table names:', error);
//         }
//         setLoading(false);
//     };

//     const fetchTableData = async (tableName) => {
//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:3000/fetch-table-data', {
//                 tableName
//             }, {
//                 withCredentials: true
//             });
//             const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index.toString() }));
//             setTableData(dataWithKeys);
//             setFilteredData(dataWithKeys);
//             if (dataWithKeys.length > 0) {
//                 const tableColumns = Object.keys(dataWithKeys[0])
//                     .map(key => ({
//                         title: key,  
//                         dataIndex: key,
//                         key: key,
//                     }));
//                 setColumns(tableColumns);
//                 initializeFilters(dataWithKeys, tableColumns);
//             }
//             setCurrentPage(1);
//         } catch (error) {
//             console.error('Error fetching table data:', error);
//         }
//         setLoading(false);
//     };

//     const initializeFilters = (data, columns) => {
//         const newFilters = {};
//         columns.forEach(column => {
//             const uniqueValues = [...new Set(data.map(item => item[column.dataIndex]))];
//             if (uniqueValues.length <= 20) {
//                 newFilters[column.dataIndex] = {
//                     type: 'dropdown',
//                     values: uniqueValues,
//                     selected: ''
//                 };
//             } else {
//                 newFilters[column.dataIndex] = {
//                     type: 'search',
//                     value: ''
//                 };
//             }
//         });
//         setFilters(newFilters);
//     };

//     const handleTableSelect = (tableName) => {
//         // Add current state to browser history
//         window.history.pushState({ showTableView: false }, '', window.location.pathname);
        
//         setSelectedTable(tableName);
//         setShowTableView(true);
//         fetchTableData(tableName);
//     };

//     const handleDownloadExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(filteredData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//         XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
//         alert('Excel file downloaded successfully!');
//     };

//     const handleEdit = (key) => {
//         setEditingKey(key);
//         const row = tableData.find(item => item.key === key);
//         setEditedValues(row);
//     };

//     const handleSave = (key) => {
//         setChangedRows(prev => ({...prev, [key]: editedValues}));
//         setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
//         setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
//         setEditingKey('');
//         setEditedValues({});
//         alert('Row updated locally. Click Submit Changes to save to the backend.');
//     };

//     const handleCancel = () => {
//         setEditingKey('');
//         setEditedValues({});
//     };

//     const handleChange = (dataIndex, value) => {
//         setEditedValues(prev => ({...prev, [dataIndex]: value}));
//     };

//     const handleImageChange = (dataIndex, event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const base64String = reader.result.split(',')[1];
//                 handleChange(dataIndex, base64String);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const submitChanges = async () => {
//         try {
//             const response = await axios.post('http://localhost:3000/update-table-data', {
//                 tableName: selectedTable,
//                 updatedRows: Object.values(changedRows)
//             }, {
//                 withCredentials: true
//             });
//             if (response.data.success) {
//                 alert('Changes submitted successfully to the backend');
//                 setChangedRows({});
//                 fetchTableData(selectedTable);
//             } else {
//                 alert('Failed to submit changes to the backend');
//             }
//         } catch (error) {
//             console.error('Error submitting changes:', error);
//             alert('Error submitting changes to the backend');
//         }
//     };

//     const isImageColumn = (columnName) => {
//         const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4','logo'];
//         return imageColumns.includes(columnName.toLowerCase());
//     };

//     const handleFilterChange = (columnName, value) => {
//         setFilters(prevFilters => ({
//             ...prevFilters,
//             [columnName]: {
//                 ...prevFilters[columnName],
//                 selected: value
//             }
//         }));
//     };

//     const handleSearchChange = (columnName, value) => {
//         setFilters(prevFilters => ({
//             ...prevFilters,
//             [columnName]: {
//                 ...prevFilters[columnName],
//                 value: value
//             }
//         }));
//     };

//     const applyFilters = () => {
//         let newFilteredData = [...tableData];
        
//         Object.keys(filters).forEach(columnName => {
//             const filter = filters[columnName];
//             if (filter.type === 'dropdown' && filter.selected) {
//                 newFilteredData = newFilteredData.filter(row => 
//                     row[columnName] && row[columnName].toString() === filter.selected
//                 );
//             } else if (filter.type === 'search' && filter.value) {
//                 newFilteredData = newFilteredData.filter(row =>
//                     row[columnName] && row[columnName].toString().toLowerCase().includes(filter.value.toLowerCase())
//                 );
//             }
//         });
//         setFilteredData(newFilteredData);
//         setCurrentPage(1);
//     };

//     const renderTableNames = () => {
//         if (tableNames.length === 0) return null;

//         return (
//             <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3 mb-4">
//                 {tableNames.map(name => (
//                     <div key={name} className="col">
//                         <div 
//                             className="card table-card h-100"
//                             onClick={() => handleTableSelect(name)}
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <div className="card-body d-flex align-items-center justify-content-center text-center">
//                                 <h6 className="card-title mb-0 text-truncate" title={name}>
//                                     {name}
//                                 </h6>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     const renderTableHeader = () => {
//         return (
//             <thead className="table-dark sticky-top">
//                 <tr>
//                     {columns.map(column => (
//                         <th key={column.key} className="table-header-cell">
//                             <div className="mb-2">
//                                 <strong>{column.title}</strong>
//                             </div>
//                             {filters[column.dataIndex]?.type === 'dropdown' ? (
//                                 <select 
//                                     className="form-select form-select-sm"
//                                     value={filters[column.dataIndex].selected} 
//                                     onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
//                                 >
//                                     <option value="">All</option>
//                                     {filters[column.dataIndex].values.map(value => (
//                                         <option key={value} value={value}>{value}</option>
//                                     ))}
//                                 </select>
//                             ) : (
//                                 <input 
//                                     className="form-control form-control-sm"
//                                     type="text" 
//                                     placeholder="Search..." 
//                                     value={filters[column.dataIndex]?.value || ''}
//                                     onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
//                                 />
//                             )}
//                         </th>
//                     ))}
//                     <th className="table-header-cell">
//                         <strong>Actions</strong>
//                     </th>
//                 </tr>
//             </thead>
//         );
//     };

//     const renderTableBody = () => {
//         const startIndex = (currentPage - 1) * rowsPerPage;
//         const endIndex = startIndex + rowsPerPage;
//         return (
//             <tbody>
//                 {filteredData.slice(startIndex, endIndex).map(row => (
//                     <tr key={row.key}>
//                         {columns.map(column => (
//                             <td key={column.key} className="table-cell">
//                                 {editingKey === row.key ? (
//                                     isImageColumn(column.dataIndex) ? (
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={(e) => handleImageChange(column.dataIndex, e)}
//                                             className="form-control form-control-sm"
//                                         />
//                                     ) : (
//                                         <input
//                                             value={editedValues[column.dataIndex] || ''}
//                                             onChange={(e) => handleChange(column.dataIndex, e.target.value)}
//                                             className="form-control form-control-sm"
//                                         />
//                                     )
//                                 ) : (
//                                     isImageColumn(column.dataIndex) ? (
//                                         <img 
//                                             src={`data:image/jpeg;base64,${row[column.dataIndex]}`} 
//                                             alt={`${column.dataIndex}`}
//                                             className="table-image"
//                                         />
//                                     ) : (
//                                         <div className="cell-content">
//                                             {typeof row[column.dataIndex] === 'string' && row[column.dataIndex].length > 100
//                                                 ? `${row[column.dataIndex].substring(0, 100)}...`
//                                                 : row[column.dataIndex]}
//                                         </div>
//                                     )
//                                 )}
//                             </td>
//                         ))}
//                         <td className="table-cell">
//                             {editingKey === row.key ? (
//                                 <div className="d-flex gap-2">
//                                     <button className="btn btn-success btn-sm" onClick={() => handleSave(row.key)}>
//                                         Save
//                                     </button>
//                                     <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
//                                         Cancel
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <button className="btn btn-primary btn-sm" onClick={() => handleEdit(row.key)}>
//                                     Edit
//                                 </button>
//                             )}
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         );
//     };

//     const renderPagination = () => {
//         const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//         const maxVisiblePages = 5;
//         const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//         const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//         return (
//             <div className="d-flex justify-content-between align-items-center mt-3">
//                 <div className="d-flex align-items-center">
//                     <label className="me-2">Rows per page:</label>
//                     <select 
//                         className="form-select form-select-sm" 
//                         style={{width: '80px'}}
//                         value={rowsPerPage}
//                         onChange={(e) => {
//                             setRowsPerPage(Number(e.target.value));
//                             setCurrentPage(1);
//                         }}
//                     >
//                         <option value={10}>10</option>
//                         <option value={25}>25</option>
//                         <option value={50}>50</option>
//                         <option value={100}>100</option>
//                     </select>
//                 </div>
                
//                 <nav aria-label="Table pagination">
//                     <ul className="pagination pagination-sm mb-0">
//                         <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link"
//                                 onClick={() => setCurrentPage(1)}
//                                 disabled={currentPage === 1}
//                             >
//                                 First
//                             </button>
//                         </li>
//                         <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link"
//                                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                                 disabled={currentPage === 1}
//                             >
//                                 Previous
//                             </button>
//                         </li>
                        
//                         {[...Array(endPage - startPage + 1)].map((_, index) => {
//                             const pageNumber = startPage + index;
//                             return (
//                                 <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
//                                     <button 
//                                         className="page-link"
//                                         onClick={() => setCurrentPage(pageNumber)}
//                                     >
//                                         {pageNumber}
//                                     </button>
//                                 </li>
//                             );
//                         })}
                        
//                         <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link"
//                                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                                 disabled={currentPage === totalPages}
//                             >
//                                 Next
//                             </button>
//                         </li>
//                         <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                             <button 
//                                 className="page-link"
//                                 onClick={() => setCurrentPage(totalPages)}
//                                 disabled={currentPage === totalPages}
//                             >
//                                 Last
//                             </button>
//                         </li>
//                     </ul>
//                 </nav>

//                 <div className="text-muted">
//                     Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
//                 </div>
//             </div>
//         );
//     };

//     if (loading) {
//         return (
//             <div className="container-fluid py-4 dashboard-container">
//                 <div className="d-flex justify-content-center align-items-center min-vh-100">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container-fluid py-4 dashboard-container">
//             {!showTableView ? (
//                 <>
//                     {/* Dashboard View */}
//                     <div className="text-center mb-5">
//                         <h1 className="display-4 text-primary mb-3">Super Admin Dashboard</h1>
//                         <p className="lead text-muted">Select a table to view and manage its data</p>
//                     </div>
                    
//                     <div className="card shadow-sm">
//                         <div className="card-header bg-dark text-white">
//                             <h5 className="mb-0">Database Tables ({tableNames.length})</h5>
//                         </div>
//                         <div className="card-body p-4">
//                             {tableNames.length === 0 ? (
//                                 <div className="text-center py-5">
//                                     <h5 className="text-muted">No tables found</h5>
//                                     <p className="text-muted">Please check your database connection</p>
//                                 </div>
//                             ) : (
//                                 renderTableNames()
//                             )}
//                         </div>
//                     </div>
//                 </>
//             ) : (
//                 <>
//                     {/* Table View */}
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                         <h2 className="text-primary mb-0">
//                             {selectedTable}
//                         </h2>
//                         <div className="d-flex gap-2">
//                             <button 
//                                 className="btn btn-success"
//                                 onClick={handleDownloadExcel}
//                             >
//                                 Download Excel
//                             </button>
//                             <button 
//                                 className="btn btn-warning"
//                                 onClick={submitChanges} 
//                                 disabled={Object.keys(changedRows).length === 0}
//                             >
//                                 Submit Changes ({Object.keys(changedRows).length})
//                             </button>
//                         </div>
//                     </div>

//                     <div className="card">
//                         <div className="card-body p-0">
//                             <div className="table-container">
//                                 <table className="table table-striped table-hover mb-0">
//                                     {renderTableHeader()}
//                                     {renderTableBody()}
//                                 </table>
//                             </div>
//                             <div className="p-3">
//                                 {renderPagination()}
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default SuperAdminDashboard;



// SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
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
  Grid
} from '@mui/material';
import {
  TableView as TableViewIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

const SuperAdminDashboard = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [editedValues, setEditedValues] = useState({});
  const [changedRows, setChangedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // Material UI uses 0-based indexing
  const [filters, setFilters] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showTableView, setShowTableView] = useState(false);
  const [loading, setLoading] = useState(false);

  // Material UI theme and responsive hooks
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Table names pagination state (similar to Code 1)
  const [currentTablePage, setCurrentTablePage] = useState(0);
  const tablesPerPage = 15; // 3 columns × 5 tables = 15 tables per slide
  const totalTablePages = Math.ceil(tableNames.length / tablesPerPage);

  useEffect(() => {
    fetchTableNames();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      applyFilters();
    }
  }, [filters, tableData]);

  // Handle browser back button navigation
  useEffect(() => {
    const handlePopState = () => {
      if (showTableView) {
        setShowTableView(false);
        setSelectedTable(null);
        setTableData([]);
        setFilteredData([]);
        setColumns([]);
        setCurrentPage(0);
        setRowsPerPage(10);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showTableView]);

  const fetchTableNames = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/fetch-table-names', {
        withCredentials: true
      });
      setTableNames(response.data);
    } catch (error) {
      console.error('Error fetching table names:', error);
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
      const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index.toString() }));
      setTableData(dataWithKeys);
      setFilteredData(dataWithKeys);
      if (dataWithKeys.length > 0) {
        const tableColumns = Object.keys(dataWithKeys[0])
          .map(key => ({
            title: key,
            dataIndex: key,
            key: key,
          }));
        setColumns(tableColumns);
        initializeFilters(dataWithKeys, tableColumns);
      }
      setCurrentPage(0);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
    setLoading(false);
  };

  const initializeFilters = (data, columns) => {
    const newFilters = {};
    columns.forEach(column => {
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
    // Add current state to browser history
    window.history.pushState({ showTableView: false }, '', window.location.pathname);
    
    setSelectedTable(tableName);
    setShowTableView(true);
    fetchTableData(tableName);
  };

  // Table names pagination handlers
  const handlePreviousTablePage = () => {
    setCurrentTablePage(prev => Math.max(0, prev - 1));
  };

  const handleNextTablePage = () => {
    setCurrentTablePage(prev => Math.min(totalTablePages - 1, prev + 1));
  };

  const getCurrentPageTables = () => {
    const startIndex = currentTablePage * tablesPerPage;
    const endIndex = startIndex + tablesPerPage;
    return tableNames.slice(startIndex, endIndex);
  };

  // Split tables into 3 columns of 5 tables each (matching Code 1)
  const getColumnsData = () => {
    const currentTables = getCurrentPageTables();
    const columns = [[], [], []];
    
    currentTables.forEach((table, index) => {
      const columnIndex = Math.floor(index / 5); // 0-4 go to column 0, 5-9 to column 1, 10-14 to column 2
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

  const handleEdit = (key) => {
    setEditingKey(key);
    const row = tableData.find(item => item.key === key);
    setEditedValues(row);
  };

  const handleSave = (key) => {
    setChangedRows(prev => ({ ...prev, [key]: editedValues }));
    setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
    setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
    setEditingKey('');
    setEditedValues({});
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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        handleChange(dataIndex, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitChanges = async () => {
    try {
      const response = await axios.post('http://localhost:3000/update-table-data', {
        tableName: selectedTable,
        updatedRows: Object.values(changedRows)
      }, {
        withCredentials: true
      });
      if (response.data.success) {
        setChangedRows({});
        fetchTableData(selectedTable);
      }
    } catch (error) {
      console.error('Error submitting changes:', error);
    }
  };

  const isImageColumn = (columnName) => {
    const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4', 'logo'];
    return imageColumns.includes(columnName.toLowerCase());
  };

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

  const applyFilters = () => {
    let newFilteredData = [...tableData];
    
    Object.keys(filters).forEach(columnName => {
      const filter = filters[columnName];
      if (filter.type === 'dropdown' && filter.selected) {
        newFilteredData = newFilteredData.filter(row => 
          row[columnName] && row[columnName].toString() === filter.selected
        );
      } else if (filter.type === 'search' && filter.value) {
        newFilteredData = newFilteredData.filter(row =>
          row[columnName] && row[columnName].toString().toLowerCase().includes(filter.value.toLowerCase())
        );
      }
    });
    setFilteredData(newFilteredData);
    setCurrentPage(0);
  };

  // Material UI table pagination handlers
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

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

          {/* Navigation Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            px: 1
          }}>
            <IconButton 
              onClick={handlePreviousTablePage}
              disabled={currentTablePage === 0}
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
              Page {currentTablePage + 1} of {totalTablePages} 
              <Typography component="span" sx={{ ml: 1, fontSize: '0.875rem' }}>
                ({tableNames.length} total tables)
              </Typography>
            </Typography>

            <IconButton 
              onClick={handleNextTablePage}
              disabled={currentTablePage === totalTablePages - 1}
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
          
          {/* 3 Column Grid Layout */}
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

          {/* Page Dots Indicator */}
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
                  value={filters[column.dataIndex].selected}
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
          {/* Dashboard View */}
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
          {/* Table View */}
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
            <Box sx={{ display: 'flex', gap: 2 }}>
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
                onClick={submitChanges} 
                disabled={Object.keys(changedRows).length === 0}
                sx={{
                  color: 'white',
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                Submit Changes ({Object.keys(changedRows).length})
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
                          '&:nth-of-type(even)': {
                            backgroundColor: 'action.hover'
                          },
                          '&:hover': {
                            backgroundColor: 'action.selected'
                          }
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
                                  src={`data:image/jpeg;base64,${row[col.dataIndex]}`} 
                                  alt={col.dataIndex}
                                  style={{
                                    maxWidth: '60px',
                                    maxHeight: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }}
                                />
                              ) : (
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
                              )
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          {editingKey === row.key ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                color="success"
                                onClick={() => handleSave(row.key)}
                                size="small"
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
                            </Box>
                          ) : (
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(row.key)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Material UI Table Pagination */}
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
        </>
      )}
    </Box>
  );
};

export default SuperAdminDashboard;