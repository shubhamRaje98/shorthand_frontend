// // //frontend\src\components\superAdmin\fetchUpdateTables.js
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import * as XLSX from 'xlsx';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { redirect } from 'react-router-dom';

// // const tableOptions = [
// //   'students', 'admindb', 'audiologs', 'batchdb', 'controllerdb',
// //   'examcenterdb', 'feedbackdb', 'finalpassagesubmit', 'loginlogs',
// //   'pcregistration', 'studentlogs', 'subjectdb', 'textlogs'
// // ];

// // const sensitiveFields = ['password'];

// // const FetchUpdateTable = () => {
// //   const [data, setData] = useState([]);
// //   const [headers, setHeaders] = useState([]);
// //   const [editingIndex, setEditingIndex] = useState(null);
// //   const [editingData, setEditingData] = useState({});
// //   const [selectedTable, setSelectedTable] = useState(tableOptions[0]);
// //   const [centerFilter, setCenterFilter] = useState('');
// //   const [batchNoFilter, setBatchNoFilter] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [studentIdFilter, setStudentIdFilter] = useState('');
// //   const [subjectIdFilter, setSubjectIdFilter] = useState('');
// //   const [newEntryData, setNewEntryData] = useState({});

// //   const itemsPerPage = 700;

// //   useEffect(() => {
// //     fetchData();
// //   }, [selectedTable, centerFilter, batchNoFilter, studentIdFilter]);

// //   const fetchData = async () => {
// //     try {
// //       let fetchParams = {
// //         tableName: selectedTable
// //       };

// //       if (selectedTable === 'students') {
// //         fetchParams = {
// //           ...fetchParams,
// //           center: centerFilter,
// //           batchNo: batchNoFilter
// //         };
// //       }
// //       if (selectedTable === 'audiologs') {
// //         fetchParams = {
// //           ...fetchParams,
// //           student_id: studentIdFilter
// //         };
// //       }
// //       if (selectedTable === 'studentlogs') {
// //         fetchParams = {
// //           ...fetchParams,
// //           student_id: studentIdFilter,
// //           center: centerFilter
// //         };
// //       }
// //       if (selectedTable === 'textlogs') {
// //         fetchParams = {
// //           ...fetchParams,
// //           student_id: studentIdFilter
// //         };
// //       }
// //       if (selectedTable === 'loginlogs') {
// //         fetchParams = {
// //           ...fetchParams,
// //           student_id: studentIdFilter
// //         };
// //       }
// //       if (selectedTable === 'batchdb') {
// //         fetchParams = {
// //           ...fetchParams,
// //           batchNo: batchNoFilter
// //         };
// //       }
// //       if (selectedTable === 'controllerdb') {
// //         fetchParams = {
// //           ...fetchParams,
// //           center: centerFilter,
// //           batchNo: batchNoFilter
// //         };
// //       }
// //       if (selectedTable === 'examcenterdb') {
// //         fetchParams = {
// //           ...fetchParams,
// //           center: centerFilter,
// //         };
// //       }
// //       if (selectedTable === 'feedbackdb') {
// //         fetchParams = {
// //           ...fetchParams,
// //           student_id: studentIdFilter
// //         };
// //       }
// //       if (selectedTable === 'pcregistration') {
// //         fetchParams = {
// //           ...fetchParams,
// //           center: centerFilter
// //         };
// //       }
// //       if (selectedTable === 'subjectdb') {
// //         fetchParams = {
// //           ...fetchParams,
// //           subjectId: subjectIdFilter
// //         };
// //       }
// //       if (selectedTable === 'finalpassagesubmit') {
// //         fetchParams = {
// //           ...fetchParams,
// //           student_id: studentIdFilter
// //         };
// //       }
      
// //       const response = await axios.post('http://localhost:3000/fetch-update-tables', fetchParams);

// //       const fetchedData = response.data;
// //       if (fetchedData.length > 0) {
// //         const filteredHeaders = Object.keys(fetchedData[0]).filter(header => !sensitiveFields.includes(header));
// //         setHeaders(filteredHeaders);
// //         setData(fetchedData);
// //       } else {
// //         setHeaders([]);
// //         setData([]);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };

// //   const handleEdit = (index) => {
// //     setEditingIndex(index);
// //     setEditingData({ ...data[index] });
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setEditingData({ ...editingData, [name]: value });
// //   };

// //   const handleNewEntryChange = (e) => {
// //     const { name, value } = e.target;
// //     setNewEntryData({ ...newEntryData, [name]: value });
// //   };

// //   const handleSave = async (index) => {
// //     try {
// //       await axios.put(`http://localhost:3000/update-table/${selectedTable}/${editingData.student_id}`, editingData);
// //       const updatedData = [...data];
// //       updatedData[index] = editingData;
// //       setData(updatedData);
// //       setEditingIndex(null);
// //     } catch (error) {
// //       console.error('Error saving data:', error);
// //     }
// //   };

// //   const handleAddNewEntry = async () => {
// //     try {
// //       const response = await axios.post(`http://localhost:3000/add-entry/${selectedTable}`, newEntryData);
// //       setData([...data, response.data]);
// //       setNewEntryData({});
// //       alert(response);
// //       redirect("/fetch-update-table");
// //     } catch (error) {
// //       console.error('Error adding new entry:', error);
// //     }
// //   };

// //   const handlePageChange = (pageNumber) => {
// //     setCurrentPage(pageNumber);
// //   };

// //   const exportToExcel = () => {
// //     const worksheet = XLSX.utils.json_to_sheet(data);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, selectedTable);
// //     XLSX.writeFile(workbook, `${selectedTable}_export.xlsx`);
// //   };

// //   const totalPages = Math.ceil(data.length / itemsPerPage);
// //   const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   return (
// //     <div className="container mt-5">
// //       <h1 className="mb-4">Super Admin Panel</h1>
// //       <div className="mb-3">
// //         <label htmlFor="tableSelect" className="form-label">Select Table</label>
// //         <select
// //           id="tableSelect"
// //           className="form-select"
// //           value={selectedTable}
// //           onChange={(e) => setSelectedTable(e.target.value)}
// //         >
// //           {tableOptions.map((table, index) => (
// //             <option key={index} value={table}>
// //               {table}
// //             </option>
// //           ))}
// //         </select>
// //       </div>
// //       {selectedTable === 'examcenterdb' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by center:</label>
// //             <input
// //               type="text"
// //               id="centerFilter"
// //               className="form-control"
// //               value={centerFilter}
// //               onChange={(e) => setCenterFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'controllerdb' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter center:</label>
// //             <input
// //               type="text"
// //               id="centerFilter"
// //               className="form-control"
// //               value={centerFilter}
// //               onChange={(e) => setCenterFilter(e.target.value)}
// //             />
// //           </div>
// //           <div className="mb-3">
// //             <label htmlFor="centerFilter" className="form-label">Filter by batch number</label>
// //             <input
// //               id="batchFilter"
// //               type="text"
// //               className="form-control"
// //               value={batchNoFilter}
// //               onChange={(e) => setBatchNoFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'batchdb' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by batch number:</label>
// //             <input
// //               type="text"
// //               id="batchNoFilter"
// //               className="form-control"
// //               value={batchNoFilter}
// //               onChange={(e) => setBatchNoFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'loginlogs' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
// //             <input
// //               type="text"
// //               id="studentIdFilter"
// //               className="form-control"
// //               value={studentIdFilter}
// //               onChange={(e) => setStudentIdFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'feedbackdb' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
// //             <input
// //               type="text"
// //               id="studentIdFilter"
// //               className="form-control"
// //               value={studentIdFilter}
// //               onChange={(e) => setStudentIdFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'finalpassagesubmit' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
// //             <input
// //               type="text"
// //               id="studentIdFilter"
// //               className="form-control"
// //               value={studentIdFilter}
// //               onChange={(e) => setStudentIdFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'pcregistration' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="centerFilter" className="form-label">Filter by center:</label>
// //             <input
// //               type="text"
// //               id="centerFilter"
// //               className="form-control"
// //               value={centerFilter}
// //               onChange={(e) => setCenterFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'subjectdb' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="subjectIdFilter" className="form-label">Filter by Subject Id:</label>
// //             <input
// //               type="text"
// //               id="subjectIdFilter"
// //               className="form-control"
// //               value={subjectIdFilter}
// //               onChange={(e) => setSubjectIdFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'textlogs' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
// //             <input
// //               type="text"
// //               id="studentIdFilter"
// //               className="form-control"
// //               value={studentIdFilter}
// //               onChange={(e) => setStudentIdFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'studentlogs' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
// //             <input
// //               type="text"
// //               id="studentIdFilter"
// //               className="form-control"
// //               value={studentIdFilter}
// //               onChange={(e) => setStudentIdFilter(e.target.value)}
// //             />
// //           </div>
// //           <div className="mb-3">
// //             <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
// //             <input
// //               id="centerFilter"
// //               type="text"
// //               className="form-control"
// //               value={centerFilter}
// //               onChange={(e) => setCenterFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'audiologs' && (
// //         <>
// //           <div className="mb-2">
// //             <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
// //             <input
// //               type="text"
// //               id="studentIdFilter"
// //               className="form-control"
// //               value={studentIdFilter}
// //               onChange={(e) => setStudentIdFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       {selectedTable === 'students' && (
// //         <>
// //           <div className="mb-3">
// //             <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
// //             <input
// //               id="centerFilter"
// //               type="text"
// //               className="form-control"
// //               value={centerFilter}
// //               onChange={(e) => setCenterFilter(e.target.value)}
// //             />
// //           </div>
// //           <div className="mb-3">
// //             <label htmlFor="batchNoFilter" className="form-label">Filter by Batch No</label>
// //             <input
// //               id="batchNoFilter"
// //               type="text"
// //               className="form-control"
// //               value={batchNoFilter}
// //               onChange={(e) => setBatchNoFilter(e.target.value)}
// //             />
// //           </div>
// //         </>
// //       )}
// //       <button className="btn btn-primary mb-3" onClick={exportToExcel}>
// //         Export to excel
// //       </button>
// //       <table className="table table-bordered">
// //         <thead className="thead-dark">
// //           <tr>
// //             <th>#</th>
// //             {headers.map((header, index) => (
// //               <th key={index}>{header}</th>
// //             ))}
// //             <th>Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //         <tr>
// //             <td>New entry</td>
// //             {headers.map((key, index) => (
// //               <td key={index}>
// //                 <input
// //                   type="text"
// //                   name={key}
// //                   value={newEntryData[key] || ''}
// //                   onChange={handleNewEntryChange}
// //                   className="form-control"
// //                 />
// //               </td>
// //             ))}
// //             <td>
// //               <button
// //                 className="btn btn-success"
// //                 onClick={handleAddNewEntry}
// //               >
// //                 Add
// //               </button>
// //             </td>
// //           </tr>
// //           {currentData.map((item, index) =>
// //             editingIndex === index ? (
// //               <tr key={index}>
// //                 <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
// //                 {headers.map((key) => (
// //                   <td key={key}>
// //                     <input
// //                       type="text"
// //                       name={key}
// //                       value={editingData[key]}
// //                       onChange={handleInputChange}
// //                       className="form-control"
// //                     />
// //                   </td>
// //                 ))}
// //                 <td>
// //                   <button
// //                     className="btn btn-success"
// //                     onClick={() => handleSave(index)}
// //                   >
// //                     Save
// //                   </button>
// //                 </td>
// //               </tr>
// //             ) : (
// //               <tr key={index}>
// //                 <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
// //                 {headers.map((key) => (
// //                   <td key={key}>{item[key]}</td>
// //                 ))}
// //                 <td>
// //                   <button
// //                     className="btn btn-primary"
// //                     onClick={() => handleEdit(index)}
// //                   >
// //                     Edit
// //                   </button>
// //                 </td>
// //               </tr>
// //             )
// //           )}
          
// //         </tbody>
// //       </table>
// //       <div className="d-flex justify-content-center mt-3">
// //         {Array.from({ length: totalPages }, (_, i) => (
// //           <button
// //             key={i}
// //             className={`btn btn-primary mx-1 ${currentPage === i + 1 ? 'active' : ''}`}
// //             onClick={() => handlePageChange(i + 1)}
// //           >
// //             {i + 1}
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default FetchUpdateTable;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const tableOptions = [
//   'students', 'admindb', 'audiologs', 'batchdb', 'controllerdb',
//   'examcenterdb', 'feedbackdb', 'finalpassagesubmit', 'loginlogs',
//   'pcregistration', 'studentlogs', 'subjectdb', 'textlogs'
// ];

// const sensitiveFields = ['password'];

// const FetchUpdateTable = () => {
//   const [data, setData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editingData, setEditingData] = useState({});
//   const [selectedTable, setSelectedTable] = useState(tableOptions[0]);
//   const [centerFilter, setCenterFilter] = useState('');
//   const [batchNoFilter, setBatchNoFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [studentIdFilter, setStudentIdFilter] = useState('');
//   const [subjectIdFilter, setSubjectIdFilter] = useState('');
//   const [newEntryData, setNewEntryData] = useState({});
//   const [showAddForm, setShowAddForm] = useState(false);

//   const itemsPerPage = 700;

//   // Enhanced function that provides ID information for each table
//   const getTableIdInfo = () => {
//     const idMapping = {
//       'students': { field: 'student_id', autoGenerated: false, required: true },
//       'admindb': { field: 'adminid', autoGenerated: false, required: true },
//       'audiologs': { field: 'student_id', autoGenerated: false, required: true },
//       'batchdb': { field: 'batchNo', autoGenerated: false, required: true },
//       'controllerdb': { field: 'center', autoGenerated: false, required: true },
//       'examcenterdb': { field: 'center', autoGenerated: false, required: true },
//       'feedbackdb': { field: 'student_id', autoGenerated: false, required: true },
//       'finalpassagesubmit': { field: 'student_id', autoGenerated: false, required: true },
//       'loginlogs': { field: 'id', autoGenerated: true, required: false },
//       'pcregistration': { field: 'id', autoGenerated: true, required: false },
//       'studentlogs': { field: 'id', autoGenerated: true, required: false },
//       'subjectdb': { field: 'subjectId', autoGenerated: false, required: true },
//       'textlogs': { field: 'id', autoGenerated: true, required: false }
//     };
    
//     return idMapping[selectedTable] || { field: 'id', autoGenerated: true, required: false };
//   };

//   // Get ID value from a record for update/delete operations
//   const getIdForTable = (item) => {
//     const idInfo = getTableIdInfo();
//     return item[idInfo.field];
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedTable, centerFilter, batchNoFilter, studentIdFilter, subjectIdFilter]);

//   useEffect(() => {
//     // Reset form when table changes
//     setNewEntryData({});
//     setShowAddForm(false);
//     setEditingIndex(null);
//   }, [selectedTable]);

//   const fetchData = async () => {
//     try {
//       let fetchParams = {
//         tableName: selectedTable
//       };

//       if (selectedTable === 'students') {
//         fetchParams = {
//           ...fetchParams,
//           center: centerFilter,
//           batchNo: batchNoFilter
//         };
//       }
//       if (selectedTable === 'audiologs') {
//         fetchParams = {
//           ...fetchParams,
//           student_id: studentIdFilter
//         };
//       }
//       if (selectedTable === 'studentlogs') {
//         fetchParams = {
//           ...fetchParams,
//           student_id: studentIdFilter,
//           center: centerFilter
//         };
//       }
//       if (selectedTable === 'textlogs') {
//         fetchParams = {
//           ...fetchParams,
//           student_id: studentIdFilter
//         };
//       }
//       if (selectedTable === 'loginlogs') {
//         fetchParams = {
//           ...fetchParams,
//           student_id: studentIdFilter
//         };
//       }
//       if (selectedTable === 'batchdb') {
//         fetchParams = {
//           ...fetchParams,
//           batchNo: batchNoFilter
//         };
//       }
//       if (selectedTable === 'controllerdb') {
//         fetchParams = {
//           ...fetchParams,
//           center: centerFilter,
//           batchNo: batchNoFilter
//         };
//       }
//       if (selectedTable === 'examcenterdb') {
//         fetchParams = {
//           ...fetchParams,
//           center: centerFilter,
//         };
//       }
//       if (selectedTable === 'feedbackdb') {
//         fetchParams = {
//           ...fetchParams,
//           student_id: studentIdFilter
//         };
//       }
//       if (selectedTable === 'pcregistration') {
//         fetchParams = {
//           ...fetchParams,
//           center: centerFilter
//         };
//       }
//       if (selectedTable === 'subjectdb') {
//         fetchParams = {
//           ...fetchParams,
//           subjectId: subjectIdFilter
//         };
//       }
//       if (selectedTable === 'finalpassagesubmit') {
//         fetchParams = {
//           ...fetchParams,
//           student_id: studentIdFilter
//         };
//       }
      
//       const response = await axios.post('http://localhost:3000/fetch-update-tables', fetchParams);

//       const fetchedData = response.data;
//       if (fetchedData.length > 0) {
//         const filteredHeaders = Object.keys(fetchedData[0]).filter(header => !sensitiveFields.includes(header));
//         setHeaders(filteredHeaders);
//         setData(fetchedData);
//       } else {
//         setHeaders([]);
//         setData([]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       alert('Error fetching data. Please try again.');
//     }
//   };

//   const handleEdit = (index) => {
//     setEditingIndex(index);
//     setEditingData({ ...data[index] });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditingData({ ...editingData, [name]: value });
//   };

//   const handleNewEntryChange = (e) => {
//     const { name, value } = e.target;
//     setNewEntryData({ ...newEntryData, [name]: value });
//   };

//   const handleSave = async (index) => {
//     try {
//       const id = getIdForTable(data[index]);
//       await axios.put(`http://localhost:3000/update-table/${selectedTable}/${id}`, editingData);
//       const updatedData = [...data];
//       updatedData[index] = editingData;
//       setData(updatedData);
//       setEditingIndex(null);
//       alert('Record updated successfully!');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       alert('Error updating record. Please try again.');
//     }
//   };

//   const handleDelete = async (index) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       try {
//         const id = getIdForTable(data[index]);
//         await axios.delete(`http://localhost:3000/delete-entry/${selectedTable}/${id}`);
//         const updatedData = data.filter((_, i) => i !== index);
//         setData(updatedData);
//         alert('Record deleted successfully!');
//         // Update current page if necessary
//         const newTotalPages = Math.ceil(updatedData.length / itemsPerPage);
//         if (currentPage > newTotalPages && newTotalPages > 0) {
//           setCurrentPage(newTotalPages);
//         }
//       } catch (error) {
//         console.error('Error deleting data:', error);
//         alert('Error deleting record. Please try again.');
//       }
//     }
//   };

//   const handleAddNewEntry = async () => {
//     try {
//       const idInfo = getTableIdInfo();
      
//       // Prepare data to send
//       const dataToSend = { ...newEntryData };
      
//       // Remove auto-generated ID fields from the data being sent
//       if (idInfo.autoGenerated) {
//         delete dataToSend[idInfo.field];
//       }
      
//       // Validate required fields
//       if (idInfo.required && !idInfo.autoGenerated && !dataToSend[idInfo.field]) {
//         alert(`${idInfo.field} is required!`);
//         return;
//       }

//       // Validate that at least some data is provided
//       const hasData = Object.values(dataToSend).some(value => value && value.toString().trim() !== '');
//       if (!hasData) {
//         alert('Please fill in at least one field!');
//         return;
//       }
      
//       const response = await axios.post(`http://localhost:3000/add-entry/${selectedTable}`, dataToSend);
      
//       // Reset form and refresh data
//       setNewEntryData({});
//       setShowAddForm(false);
//       alert('New entry added successfully!');
//       fetchData(); // Refresh the data to get updated list
//     } catch (error) {
//       console.error('Error adding new entry:', error);
//       const errorMessage = error.response?.data?.message || 'Error adding new entry. Please try again.';
//       alert(errorMessage);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, selectedTable);
//     XLSX.writeFile(workbook, `${selectedTable}_export.xlsx`);
//   };

//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="container mt-5">
//       <h1 className="mb-4">Super Admin Panel</h1>
//       <div className="mb-3">
//         <label htmlFor="tableSelect" className="form-label">Select Table</label>
//         <select
//           id="tableSelect"
//           className="form-select"
//           value={selectedTable}
//           onChange={(e) => setSelectedTable(e.target.value)}
//         >
//           {tableOptions.map((table, index) => (
//             <option key={index} value={table}>
//               {table}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* All your existing filter sections remain the same */}
//       {selectedTable === 'examcenterdb' && (
//         <div className="mb-2">
//           <label htmlFor="centerFilter" className="form-label">Filter by center:</label>
//           <input
//             type="text"
//             id="centerFilter"
//             className="form-control"
//             value={centerFilter}
//             onChange={(e) => setCenterFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'controllerdb' && (
//         <>
//           <div className="mb-2">
//             <label htmlFor="centerFilter" className="form-label">Filter center:</label>
//             <input
//               type="text"
//               id="centerFilter"
//               className="form-control"
//               value={centerFilter}
//               onChange={(e) => setCenterFilter(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="batchFilter" className="form-label">Filter by batch number</label>
//             <input
//               id="batchFilter"
//               type="text"
//               className="form-control"
//               value={batchNoFilter}
//               onChange={(e) => setBatchNoFilter(e.target.value)}
//             />
//           </div>
//         </>
//       )}

//       {selectedTable === 'batchdb' && (
//         <div className="mb-2">
//           <label htmlFor="batchNoFilter" className="form-label">Filter by batch number:</label>
//           <input
//             type="text"
//             id="batchNoFilter"
//             className="form-control"
//             value={batchNoFilter}
//             onChange={(e) => setBatchNoFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {/* Continue with all other filter sections... */}
//       {selectedTable === 'loginlogs' && (
//         <div className="mb-2">
//           <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
//           <input
//             type="text"
//             id="studentIdFilter"
//             className="form-control"
//             value={studentIdFilter}
//             onChange={(e) => setStudentIdFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'feedbackdb' && (
//         <div className="mb-2">
//           <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
//           <input
//             type="text"
//             id="studentIdFilter"
//             className="form-control"
//             value={studentIdFilter}
//             onChange={(e) => setStudentIdFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'finalpassagesubmit' && (
//         <div className="mb-2">
//           <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
//           <input
//             type="text"
//             id="studentIdFilter"
//             className="form-control"
//             value={studentIdFilter}
//             onChange={(e) => setStudentIdFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'pcregistration' && (
//         <div className="mb-2">
//           <label htmlFor="centerFilter" className="form-label">Filter by center:</label>
//           <input
//             type="text"
//             id="centerFilter"
//             className="form-control"
//             value={centerFilter}
//             onChange={(e) => setCenterFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'subjectdb' && (
//         <div className="mb-2">
//           <label htmlFor="subjectIdFilter" className="form-label">Filter by Subject Id:</label>
//           <input
//             type="text"
//             id="subjectIdFilter"
//             className="form-control"
//             value={subjectIdFilter}
//             onChange={(e) => setSubjectIdFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'textlogs' && (
//         <div className="mb-2">
//           <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
//           <input
//             type="text"
//             id="studentIdFilter"
//             className="form-control"
//             value={studentIdFilter}
//             onChange={(e) => setStudentIdFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'studentlogs' && (
//         <>
//           <div className="mb-2">
//             <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
//             <input
//               type="text"
//               id="studentIdFilter"
//               className="form-control"
//               value={studentIdFilter}
//               onChange={(e) => setStudentIdFilter(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
//             <input
//               id="centerFilter"
//               type="text"
//               className="form-control"
//               value={centerFilter}
//               onChange={(e) => setCenterFilter(e.target.value)}
//             />
//           </div>
//         </>
//       )}

//       {selectedTable === 'audiologs' && (
//         <div className="mb-2">
//           <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
//           <input
//             type="text"
//             id="studentIdFilter"
//             className="form-control"
//             value={studentIdFilter}
//             onChange={(e) => setStudentIdFilter(e.target.value)}
//           />
//         </div>
//       )}

//       {selectedTable === 'students' && (
//         <>
//           <div className="mb-3">
//             <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
//             <input
//               id="centerFilter"
//               type="text"
//               className="form-control"
//               value={centerFilter}
//               onChange={(e) => setCenterFilter(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="batchNoFilter" className="form-label">Filter by Batch No</label>
//             <input
//               id="batchNoFilter"
//               type="text"
//               className="form-control"
//               value={batchNoFilter}
//               onChange={(e) => setBatchNoFilter(e.target.value)}
//             />
//           </div>
//         </>
//       )}

//       {/* Action Buttons */}
//       <div className="mb-3 d-flex gap-2">
//         <button 
//           className="btn btn-success" 
//           onClick={() => setShowAddForm(!showAddForm)}
//           title="Add New Entry"
//         >
//           <i className="fas fa-plus"></i> Add Entry
//         </button>
//         <button className="btn btn-primary" onClick={exportToExcel}>
//           Export to excel
//         </button>
//       </div>

//       {/* Add Entry Form */}
//       {showAddForm && (
//         <div className="card mb-3">
//           <div className="card-header bg-success text-white">
//             <h5 className="mb-0">Add New Entry to {selectedTable}</h5>
//           </div>
//           <div className="card-body">
//             <div className="row">
//               {headers.map((header, index) => {
//                 const idInfo = getTableIdInfo();
//                 const isAutoGeneratedId = idInfo.autoGenerated && header === idInfo.field;
//                 const isRequiredField = idInfo.required && header === idInfo.field && !idInfo.autoGenerated;
                
//                 return (
//                   <div key={index} className="col-md-6 mb-3">
//                     <label className="form-label">
//                       {header}
//                       {isRequiredField && <span className="text-danger"> *</span>}
//                       {isAutoGeneratedId && <span className="text-muted"> (Auto-generated)</span>}
//                     </label>
//                     <input
//                       type="text"
//                       name={header}
//                       value={newEntryData[header] || ''}
//                       onChange={handleNewEntryChange}
//                       className="form-control"
//                       placeholder={
//                         isAutoGeneratedId 
//                           ? "Will be auto-generated" 
//                           : `Enter ${header}`
//                       }
//                       disabled={isAutoGeneratedId}
//                       required={isRequiredField}
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="mt-3">
//               <button
//                 className="btn btn-success me-2"
//                 onClick={handleAddNewEntry}
//               >
//                 <i className="fas fa-save"></i> Save Entry
//               </button>
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => {
//                   setShowAddForm(false);
//                   setNewEntryData({});
//                 }}
//               >
//                 <i className="fas fa-times"></i> Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <table className="table table-bordered">
//         <thead className="thead-dark">
//           <tr>
//             <th>#</th>
//             {headers.map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentData.map((item, index) =>
//             editingIndex === index ? (
//               <tr key={index}>
//                 <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                 {headers.map((key) => (
//                   <td key={key}>
//                     <input
//                       type="text"
//                       name={key}
//                       value={editingData[key] || ''}
//                       onChange={handleInputChange}
//                       className="form-control"
//                     />
//                   </td>
//                 ))}
//                 <td>
//                   <button
//                     className="btn btn-success btn-sm me-1"
//                     onClick={() => handleSave(index)}
//                   >
//                     Save
//                   </button>
//                   <button
//                     className="btn btn-secondary btn-sm"
//                     onClick={() => setEditingIndex(null)}
//                   >
//                     Cancel
//                   </button>
//                 </td>
//               </tr>
//             ) : (
//               <tr key={index}>
//                 <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                 {headers.map((key) => (
//                   <td key={key}>{item[key]}</td>
//                 ))}
//                 <td>
//                   <button
//                     className="btn btn-primary btn-sm me-1"
//                     onClick={() => handleEdit(index)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(index)}
//                   >
//                     <i className="fas fa-trash"></i> Delete
//                   </button>
//                 </td>
//               </tr>
//             )
//           )}
//         </tbody>
//       </table>
      
//       <div className="d-flex justify-content-center mt-3">
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i}
//             className={`btn btn-primary mx-1 ${currentPage === i + 1 ? 'active' : ''}`}
//             onClick={() => handlePageChange(i + 1)}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FetchUpdateTable;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const tableOptions = [
  'students', 'admindb', 'audiologs', 'batchdb', 'controllerdb',
  'examcenterdb', 'feedbackdb', 'finalpassagesubmit', 'loginlogs',
  'pcregistration', 'studentlogs', 'subjectdb', 'textlogs'
];

const sensitiveFields = ['password'];

const FetchUpdateTable = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [selectedTable, setSelectedTable] = useState(tableOptions[0]);
  const [centerFilter, setCenterFilter] = useState('');
  const [batchNoFilter, setBatchNoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentIdFilter, setStudentIdFilter] = useState('');
  const [subjectIdFilter, setSubjectIdFilter] = useState('');
  const [newEntryData, setNewEntryData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  const itemsPerPage = 700;

  // Enhanced function that provides ID information for each table
  const getTableIdInfo = () => {
    const idMapping = {
      'students': { field: 'student_id', autoGenerated: false, required: true },
      'admindb': { field: 'adminid', autoGenerated: false, required: true },
      'audiologs': { field: 'student_id', autoGenerated: false, required: true },
      'batchdb': { field: 'batchNo', autoGenerated: false, required: true },
      'controllerdb': { field: 'center', autoGenerated: false, required: true },
      'examcenterdb': { field: 'center', autoGenerated: false, required: true },
      'feedbackdb': { field: 'student_id', autoGenerated: false, required: true },
      'finalpassagesubmit': { field: 'student_id', autoGenerated: false, required: true },
      'loginlogs': { field: 'id', autoGenerated: true, required: false },
      'pcregistration': { field: 'id', autoGenerated: true, required: false },
      'studentlogs': { field: 'id', autoGenerated: true, required: false },
      'subjectdb': { field: 'subjectId', autoGenerated: false, required: true },
      'textlogs': { field: 'id', autoGenerated: true, required: false }
    };
    
    return idMapping[selectedTable] || { field: 'id', autoGenerated: true, required: false };
  };

  // Get ID value from a record for update/delete operations
  const getIdForTable = (item) => {
    const idInfo = getTableIdInfo();
    return item[idInfo.field];
  };

  // Function to check if a field is an image field
  const isImageField = (fieldName) => {
    const imageFields = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4', 'logo'];
    return imageFields.some(imageField => 
      fieldName.toLowerCase().includes(imageField.toLowerCase())
    );
  };

  // Function to validate image file size
  const validateImageFile = (file) => {
    const maxSize = 50 * 1024; // 50KB in bytes
    
    if (file.size > maxSize) {
      throw new Error(`Image size must be less than 1MB. Current size: ${(file.size / (50 * 1024)).toFixed(2)}MB`);
    }
    
    return true;
  };

  useEffect(() => {
    fetchData();
  }, [selectedTable, centerFilter, batchNoFilter, studentIdFilter, subjectIdFilter]);

  useEffect(() => {
    // Reset form when table changes
    setNewEntryData({});
    setShowAddForm(false);
    setEditingIndex(null);
  }, [selectedTable]);

  const fetchData = async () => {
    try {
      let fetchParams = {
        tableName: selectedTable
      };

      if (selectedTable === 'students') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter,
          batchNo: batchNoFilter
        };
      }
      if (selectedTable === 'audiologs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'studentlogs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter,
          center: centerFilter
        };
      }
      if (selectedTable === 'textlogs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'loginlogs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'batchdb') {
        fetchParams = {
          ...fetchParams,
          batchNo: batchNoFilter
        };
      }
      if (selectedTable === 'controllerdb') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter,
          batchNo: batchNoFilter
        };
      }
      if (selectedTable === 'examcenterdb') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter,
        };
      }
      if (selectedTable === 'feedbackdb') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'pcregistration') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter
        };
      }
      if (selectedTable === 'subjectdb') {
        fetchParams = {
          ...fetchParams,
          subjectId: subjectIdFilter
        };
      }
      if (selectedTable === 'finalpassagesubmit') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      
      const response = await axios.post('http://localhost:3000/fetch-update-tables', fetchParams);

      const fetchedData = response.data;
      if (fetchedData.length > 0) {
        const filteredHeaders = Object.keys(fetchedData[0]).filter(header => !sensitiveFields.includes(header));
        setHeaders(filteredHeaders);
        setData(fetchedData);
      } else {
        setHeaders([]);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingData({ ...data[index] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData({ ...editingData, [name]: value });
  };

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntryData({ ...newEntryData, [name]: value });
  };

  // Handle file input for images in add form
  const handleImageChange = (fieldName, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Validate file size before processing
        validateImageFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          setNewEntryData({ ...newEntryData, [fieldName]: base64String });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert(error.message);
        // Clear the file input
        event.target.value = '';
      }
    }
  };

  // Handle file input for images in edit mode
  const handleEditImageChange = (fieldName, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Validate file size before processing
        validateImageFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          setEditingData({ ...editingData, [fieldName]: base64String });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert(error.message);
        // Clear the file input
        event.target.value = '';
      }
    }
  };

  const handleSave = async (index) => {
    try {
      const id = getIdForTable(data[index]);
      await axios.put(`http://localhost:3000/update-table/${selectedTable}/${id}`, editingData);
      const updatedData = [...data];
      updatedData[index] = editingData;
      setData(updatedData);
      setEditingIndex(null);
      alert('Record updated successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      const errorMessage = error.response?.data?.message || 'Error updating record. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const id = getIdForTable(data[index]);
        await axios.delete(`http://localhost:3000/delete-entry/${selectedTable}/${id}`);
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
        alert('Record deleted successfully!');
        // Update current page if necessary
        const newTotalPages = Math.ceil(updatedData.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Error deleting record. Please try again.');
      }
    }
  };

  const handleAddNewEntry = async () => {
    try {
      const idInfo = getTableIdInfo();
      
      // Prepare data to send
      const dataToSend = { ...newEntryData };
      
      // Remove auto-generated ID fields from the data being sent
      if (idInfo.autoGenerated) {
        delete dataToSend[idInfo.field];
      }
      
      // Validate required fields
      if (idInfo.required && !idInfo.autoGenerated && !dataToSend[idInfo.field]) {
        alert(`${idInfo.field} is required!`);
        return;
      }

      // Validate that at least some data is provided
      const hasData = Object.values(dataToSend).some(value => value && value.toString().trim() !== '');
      if (!hasData) {
        alert('Please fill in at least one field!');
        return;
      }
      
      const response = await axios.post(`http://localhost:3000/add-entry/${selectedTable}`, dataToSend);
      
      // Reset form and refresh data
      setNewEntryData({});
      setShowAddForm(false);
      alert('New entry added successfully!');
      fetchData(); // Refresh the data to get updated list
    } catch (error) {
      console.error('Error adding new entry:', error);
      const errorMessage = error.response?.data?.message || 'Error adding new entry. Please try again.';
      alert(errorMessage);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedTable);
    XLSX.writeFile(workbook, `${selectedTable}_export.xlsx`);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Super Admin Panel</h1>
      <div className="mb-3">
        <label htmlFor="tableSelect" className="form-label">Select Table</label>
        <select
          id="tableSelect"
          className="form-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          {tableOptions.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {/* All your existing filter sections remain the same */}
      {selectedTable === 'examcenterdb' && (
        <div className="mb-2">
          <label htmlFor="centerFilter" className="form-label">Filter by center:</label>
          <input
            type="text"
            id="centerFilter"
            className="form-control"
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'controllerdb' && (
        <>
          <div className="mb-2">
            <label htmlFor="centerFilter" className="form-label">Filter center:</label>
            <input
              type="text"
              id="centerFilter"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="batchFilter" className="form-label">Filter by batch number</label>
            <input
              id="batchFilter"
              type="text"
              className="form-control"
              value={batchNoFilter}
              onChange={(e) => setBatchNoFilter(e.target.value)}
            />
          </div>
        </>
      )}

      {selectedTable === 'batchdb' && (
        <div className="mb-2">
          <label htmlFor="batchNoFilter" className="form-label">Filter by batch number:</label>
          <input
            type="text"
            id="batchNoFilter"
            className="form-control"
            value={batchNoFilter}
            onChange={(e) => setBatchNoFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'loginlogs' && (
        <div className="mb-2">
          <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
          <input
            type="text"
            id="studentIdFilter"
            className="form-control"
            value={studentIdFilter}
            onChange={(e) => setStudentIdFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'feedbackdb' && (
        <div className="mb-2">
          <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
          <input
            type="text"
            id="studentIdFilter"
            className="form-control"
            value={studentIdFilter}
            onChange={(e) => setStudentIdFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'finalpassagesubmit' && (
        <div className="mb-2">
          <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
          <input
            type="text"
            id="studentIdFilter"
            className="form-control"
            value={studentIdFilter}
            onChange={(e) => setStudentIdFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'pcregistration' && (
        <div className="mb-2">
          <label htmlFor="centerFilter" className="form-label">Filter by center:</label>
          <input
            type="text"
            id="centerFilter"
            className="form-control"
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'subjectdb' && (
        <div className="mb-2">
          <label htmlFor="subjectIdFilter" className="form-label">Filter by Subject Id:</label>
          <input
            type="text"
            id="subjectIdFilter"
            className="form-control"
            value={subjectIdFilter}
            onChange={(e) => setSubjectIdFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'textlogs' && (
        <div className="mb-2">
          <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
          <input
            type="text"
            id="studentIdFilter"
            className="form-control"
            value={studentIdFilter}
            onChange={(e) => setStudentIdFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'studentlogs' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
            <input
              type="text"
              id="studentIdFilter"
              className="form-control"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
            <input
              id="centerFilter"
              type="text"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
        </>
      )}

      {selectedTable === 'audiologs' && (
        <div className="mb-2">
          <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
          <input
            type="text"
            id="studentIdFilter"
            className="form-control"
            value={studentIdFilter}
            onChange={(e) => setStudentIdFilter(e.target.value)}
          />
        </div>
      )}

      {selectedTable === 'students' && (
        <>
          <div className="mb-3">
            <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
            <input
              id="centerFilter"
              type="text"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="batchNoFilter" className="form-label">Filter by Batch No</label>
            <input
              id="batchNoFilter"
              type="text"
              className="form-control"
              value={batchNoFilter}
              onChange={(e) => setBatchNoFilter(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="mb-3 d-flex gap-2">
        <button 
          className="btn btn-success" 
          onClick={() => setShowAddForm(!showAddForm)}
          title="Add New Entry"
        >
          <i className="fas fa-plus"></i> Add Entry
        </button>
        <button className="btn btn-primary" onClick={exportToExcel}>
          Export to excel
        </button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="card mb-3">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Add New Entry to {selectedTable}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {headers.map((header, index) => {
                const idInfo = getTableIdInfo();
                const isAutoGeneratedId = idInfo.autoGenerated && header === idInfo.field;
                const isRequiredField = idInfo.required && header === idInfo.field && !idInfo.autoGenerated;
                const isImageFieldType = isImageField(header);
                
                return (
                  <div key={index} className="col-md-6 mb-3">
                    <label className="form-label">
                      {header}
                      {isRequiredField && <span className="text-danger"> *</span>}
                      {isAutoGeneratedId && <span className="text-muted"> (Auto-generated)</span>}
                      {isImageFieldType && <span className="text-info"> (Max: 1MB)</span>}
                    </label>
                    {isImageFieldType ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(header, e)}
                        className="form-control"
                        disabled={isAutoGeneratedId}
                        title="Maximum file size: 1MB"
                      />
                    ) : (
                      <input
                        type="text"
                        name={header}
                        value={newEntryData[header] || ''}
                        onChange={handleNewEntryChange}
                        className="form-control"
                        placeholder={
                          isAutoGeneratedId 
                            ? "Will be auto-generated" 
                            : `Enter ${header}`
                        }
                        disabled={isAutoGeneratedId}
                        required={isRequiredField}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3">
              <button
                className="btn btn-success me-2"
                onClick={handleAddNewEntry}
              >
                <i className="fas fa-save"></i> Save Entry
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewEntryData({});
                }}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) =>
            editingIndex === index ? (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                {headers.map((key) => (
                  <td key={key}>
                    {isImageField(key) ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditImageChange(key, e)}
                        className="form-control"
                        title="Maximum file size: 1MB"
                      />
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={editingData[key] || ''}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-success btn-sm me-1"
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingIndex(null)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                {headers.map((key) => (
                  <td key={key}>
                    {isImageField(key) && item[key] ? (
                      <img 
                        src={`data:image/jpeg;base64,${item[key]}`} 
                        alt={key}
                        style={{maxWidth: '100px', maxHeight: '100px', objectFit: 'cover'}}
                        className="img-thumbnail"
                      />
                    ) : (
                      <span>{item[key]}</span>
                    )}
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(index)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      
      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn btn-primary mx-1 ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FetchUpdateTable;