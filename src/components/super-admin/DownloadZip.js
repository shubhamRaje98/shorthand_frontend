// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import './DownloadZip.css';

// // const DownloadZip = () => {
// //     const [filters, setFilters] = useState({
// //         departmentId: '',
// //         batchNo: '',
// //         studentIds: []
// //     });
// //     const [options, setOptions] = useState({
// //         departments: [],
// //         batches: [],
// //         students: []
// //     });
// //     const [loading, setLoading] = useState(false);
// //     const [message, setMessage] = useState('');
// //     const [batchLoading, setBatchLoading] = useState(false);
// //     const [studentLoading, setStudentLoading] = useState(false);

// //     // Fetch departments on component mount
// //     useEffect(() => {
// //         fetchDepartments();
// //     }, []);

// //     const fetchDepartments = async () => {
// //         try {
// //             setLoading(true);
// //             const res = await axios.get('http://checking.shorthandonlineexam.in/download-zip/departments');
// //             setOptions(prev => ({
// //                 ...prev,
// //                 departments: res.data.data || []
// //             }));
// //         } catch (err) {
// //             console.error('Failed to load departments:', err);
// //             setMessage('Error loading departments');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const checkAllBatches = async () => {
// //     if (!filters.departmentId) {
// //         setMessage('Please select a department first');
// //         return;
// //     }

// //     try {
// //         setMessage('Loading all batches...');
// //         const res = await axios.get(`http://checking.shorthandonlineexam.in/download-zip/department/${filters.departmentId}/all-batches`);
        
// //         const batches = res.data.data || [];
// //         let message = `All batches for department ${filters.departmentId}:\n`;
        
// //         batches.forEach(batch => {
// //             message += `Batch ${batch.batchNo} - ${new Date(batch.batchdate).toLocaleDateString()} - Status: ${batch.batchstatus}\n`;
// //         });
        
// //         setMessage(message);
        
// //     } catch (err) {
// //         console.error('Failed to load all batches:', err);
// //         setMessage(err.response?.data?.message || 'Error loading batches');
// //     }
// // };

// //     const fetchBatches = async (departmentId) => {
// //         if (!departmentId) return;
        
// //         try {
// //             setBatchLoading(true);
// //             setMessage('');
// //             const res = await axios.get(`http://checking.shorthandonlineexam.in/download-zip/department/${departmentId}/batches`);
            
// //             if (res.data.data && res.data.data.length > 0) {
// //                 setOptions(prev => ({
// //                     ...prev,
// //                     batches: res.data.data,
// //                     students: []
// //                 }));
// //             } else {
// //                 setOptions(prev => ({
// //                     ...prev,
// //                     batches: [],
// //                     students: []
// //                 }));
// //                 setMessage('No batches found for this department');
// //             }
// //             setFilters(prev => ({ ...prev, batchNo: '', studentIds: [] }));
// //         } catch (err) {
// //             console.error('Failed to load batches:', err);
// //             setMessage('Error loading batches');
// //         } finally {
// //             setBatchLoading(false);
// //         }
// //     };

// //     const fetchStudents = async (departmentId, batchNo) => {
// //         if (!departmentId || !batchNo) return;
        
// //         try {
// //             setStudentLoading(true);
// //             setMessage('');
// //             const res = await axios.get(`http://checking.shorthandonlineexam.in/download-zip/department/${departmentId}/batch/${batchNo}/students`);
            
// //             if (res.data.data && res.data.data.length > 0) {
// //                 setOptions(prev => ({
// //                     ...prev,
// //                     students: res.data.data
// //                 }));
// //             } else {
// //                 setOptions(prev => ({
// //                     ...prev,
// //                     students: []
// //                 }));
// //                 setMessage('No students found in this batch');
// //             }
// //             setFilters(prev => ({ ...prev, studentIds: [] }));
// //         } catch (err) {
// //             console.error('Failed to load students:', err);
// //             setMessage('Error loading students');
// //         } finally {
// //             setStudentLoading(false);
// //         }
// //     };

// //     const handleDepartmentChange = (e) => {
// //         const departmentId = e.target.value;
// //         const selectedDept = options.departments.find(dept => dept.departmentId == departmentId);
// //         setFilters({ departmentId, batchNo: '', studentIds: [] });
// //         setOptions(prev => ({ ...prev, batches: [], students: [] }));
// //         setMessage('');
        
// //         if (departmentId) {
// //             fetchBatches(departmentId);
// //         }
// //     };

// //     const handleBatchChange = (e) => {
// //         const batchNo = e.target.value;
// //         setFilters(prev => ({ ...prev, batchNo, studentIds: [] }));
// //         setMessage('');
        
// //         if (batchNo && filters.departmentId) {
// //             fetchStudents(filters.departmentId, batchNo);
// //         }
// //     };

// //     const handleStudentSelection = (e) => {
// //         const selectedOptions = Array.from(e.target.selectedOptions);
// //         const studentIds = selectedOptions.map(option => option.value);
// //         setFilters(prev => ({ ...prev, studentIds }));
// //         setMessage('');
// //     };

// //     const handleDownload = async () => {
// //         if (filters.studentIds.length === 0) {
// //             setMessage('Please select at least one student');
// //             return;
// //         }

// //         try {
// //             setLoading(true);
// //             setMessage('Preparing download...');
            
// //             const response = await axios.post('http://checking.shorthandonlineexam.in/download-zip/files', {
// //                 studentIds: filters.studentIds
// //             }, {
// //                 responseType: 'blob'
// //             });

// //             // Create download link
// //             const url = window.URL.createObjectURL(new Blob([response.data]));
// //             const link = document.createElement('a');
// //             link.href = url;
            
// //             // Set filename based on number of files
// //             const filename = filters.studentIds.length === 1 
// //                 ? `student_${filters.studentIds[0]}.zip`
// //                 : 'merged_student_files.zip';
                
// //             link.setAttribute('download', filename);
// //             document.body.appendChild(link);
// //             link.click();
// //             link.remove();

// //             setMessage('Download started successfully');

// //         } catch (err) {
// //             console.error('Download failed:', err);
// //             if (err.response?.data) {
// //                 // Try to read error message from blob
// //                 try {
// //                     const errorText = await err.response.data.text();
// //                     const errorData = JSON.parse(errorText);
// //                     setMessage(errorData.message || 'Download failed');
// //                 } catch (parseError) {
// //                     setMessage('Download failed. Please try again.');
// //                 }
// //             } else {
// //                 setMessage('Download failed. Please try again.');
// //             }
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <div className="download-zip-container">
// //             <h2>Download Student Zip Files</h2>

// //             <div className="filters">
// //                 <div className="filter-group">
// //                     <label>Department:</label>
// //                     <select
// //                         value={filters.departmentId}
// //                         onChange={handleDepartmentChange}
// //                         disabled={loading}
// //                     >
// //                         <option value="">Select Department</option>
// //                         {options.departments.map(dept => (
// //                             <option key={dept.departmentId} value={dept.departmentId}>
// //                                 {dept.departmentName} (ID: {dept.departmentId})
// //                             </option>
// //                         ))}
// //                     </select>
// //                 </div>

// //                 <div className="filter-group">
// //                     <label>Batch:</label>
// //                     <select
// //                         value={filters.batchNo}
// //                         onChange={handleBatchChange}
// //                         disabled={!filters.departmentId || batchLoading}
// //                     >
// //                         <option value="">Select Batch</option>
// //                         {batchLoading && <option value="">Loading batches...</option>}
// //                         {options.batches.map(batch => (
// //                             <option key={batch.batchNo} value={batch.batchNo}>
// //                                 Batch {batch.batchNo} ({new Date(batch.batchdate).toLocaleDateString()})
// //                             </option>
// //                         ))}
// //                     </select>
// //                     {batchLoading && <span className="loading-text">Loading batches...</span>}
// //                 </div>

// //                 <div className="filter-group">
// //                     <label>Students (Select multiple):</label>
// //                     <select
// //                         multiple
// //                         value={filters.studentIds}
// //                         onChange={handleStudentSelection}
// //                         disabled={!filters.batchNo || studentLoading}
// //                         size="5"
// //                         className="students-select"
// //                     >
// //                         <option value="" disabled>Select students</option>
// //                         {studentLoading && <option value="">Loading students...</option>}
// //                         {options.students.map(student => (
// //                             <option key={student.student_id} value={student.student_id}>
// //                                 {student.student_id} - {student.fullname}
// //                             </option>
// //                         ))}
// //                     </select>
// //                     {studentLoading && <span className="loading-text">Loading students...</span>}
// //                     <small>Hold Ctrl/Cmd to select multiple students</small>
// //                 </div>

// //                 <div className="filter-group button-group">
// //                     <button
// //                         onClick={handleDownload}
// //                         disabled={filters.studentIds.length === 0 || loading}
// //                         className="download-button"
// //                     >
// //                         {loading ? 'Processing...' : `Download (${filters.studentIds.length} selected)`}
// //                     </button>
// //                 </div>
// //                 <div className="filter-group button-group">
// //     <button
// //         onClick={checkStorageStatus}
// //         className="check-button"
// //         style={{ backgroundColor: '#2196F3', marginLeft: '10px' }}
// //     >
// //         Check Storage Status
// //     </button>
// //     {filters.departmentId && (
// //         <button
// //             onClick={checkAllBatches}
// //             className="check-button"
// //             style={{ backgroundColor: '#FF9800', marginLeft: '10px' }}
// //         >
// //             Debug Batches
// //         </button>
// //     )}
// // </div>

// //             </div>

// //             {message && (
// //                 <div className={`message ${message.includes('Error') || message.includes('failed') || message.includes('not found') ? 'error' : 'success'}`}>
// //                     {message}
// //                 </div>
// //             )}

// //             <div className="selection-info">
// //                 {filters.studentIds.length > 0 && (
// //                     <p>Selected {filters.studentIds.length} student(s)</p>
// //                 )}
// //                 {filters.departmentId && options.batches.length === 0 && !batchLoading && (
// //                     <p className="warning">No batches available for this department</p>
// //                 )}
// //                 {filters.batchNo && options.students.length === 0 && !studentLoading && (
// //                     <p className="warning">No students found in this batch</p>
// //                 )}
// //             </div>

// //             <div className="instructions">
// //                 <h3>Instructions:</h3>
// //                 <ul>
// //                     <li>Select a department to see available batches</li>
// //                     <li>Select a batch to see students in that batch</li>
// //                     <li>Select one or more students (use Ctrl/Cmd for multiple selection)</li>
// //                     <li>Click Download to get the zip files</li>
// //                     <li>Single student: Downloads individual zip file</li>
// //                     <li>Multiple students: Downloads merged zip file</li>
// //                 </ul>
// //             </div>
// //         </div>
// //     );
// // };

// // export default DownloadZip;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './DownloadZip.css';

// const DownloadZip = () => {
//     const [filters, setFilters] = useState({
//         departmentId: '',
//         batchNo: '',
//         studentIds: []
//     });
//     const [options, setOptions] = useState({
//         departments: [],
//         batches: [],
//         students: []
//     });
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [batchLoading, setBatchLoading] = useState(false);
//     const [studentLoading, setStudentLoading] = useState(false);

//     // Fetch departments on component mount
//     useEffect(() => {
//         fetchDepartments();
//     }, []);

//     const fetchDepartments = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get('http://checking.shorthandonlineexam.in/download-zip/departments');
//             setOptions(prev => ({
//                 ...prev,
//                 departments: res.data.data || []
//             }));
//         } catch (err) {
//             console.error('Failed to load departments:', err);
//             setMessage('Error loading departments');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchBatches = async (departmentId) => {
//         if (!departmentId) return;
        
//         try {
//             setBatchLoading(true);
//             setMessage('');
//             const res = await axios.get(`http://checking.shorthandonlineexam.in/download-zip/department/${departmentId}/batches`);
            
//             if (res.data.data && res.data.data.length > 0) {
//                 setOptions(prev => ({
//                     ...prev,
//                     batches: res.data.data,
//                     students: []
//                 }));
//             } else {
//                 setOptions(prev => ({
//                     ...prev,
//                     batches: [],
//                     students: []
//                 }));
//                 setMessage('No batches found for this department');
//             }
//             setFilters(prev => ({ ...prev, batchNo: '', studentIds: [] }));
//         } catch (err) {
//             console.error('Failed to load batches:', err);
//             setMessage('Error loading batches');
//         } finally {
//             setBatchLoading(false);
//         }
//     };

//     const fetchStudents = async (departmentId, batchNo) => {
//         if (!departmentId || !batchNo) return;
        
//         try {
//             setStudentLoading(true);
//             setMessage('');
//             const res = await axios.get(`http://checking.shorthandonlineexam.in/download-zip/department/${departmentId}/batch/${batchNo}/students`);
            
//             if (res.data.data && res.data.data.length > 0) {
//                 setOptions(prev => ({
//                     ...prev,
//                     students: res.data.data
//                 }));
//             } else {
//                 setOptions(prev => ({
//                     ...prev,
//                     students: []
//                 }));
//                 setMessage('No students found in this batch');
//             }
//             setFilters(prev => ({ ...prev, studentIds: [] }));
//         } catch (err) {
//             console.error('Failed to load students:', err);
//             setMessage('Error loading students');
//         } finally {
//             setStudentLoading(false);
//         }
//     };

//     const handleDepartmentChange = (e) => {
//         const departmentId = e.target.value;
//         const selectedDept = options.departments.find(dept => dept.departmentId == departmentId);
//         setFilters({ departmentId, batchNo: '', studentIds: [] });
//         setOptions(prev => ({ ...prev, batches: [], students: [] }));
//         setMessage('');
        
//         if (departmentId) {
//             fetchBatches(departmentId);
//         }
//     };

//     const handleBatchChange = (e) => {
//         const batchNo = e.target.value;
//         setFilters(prev => ({ ...prev, batchNo, studentIds: [] }));
//         setMessage('');
        
//         if (batchNo && filters.departmentId) {
//             fetchStudents(filters.departmentId, batchNo);
//         }
//     };

//     const handleStudentSelection = (e) => {
//         const selectedOptions = Array.from(e.target.selectedOptions);
//         const studentIds = selectedOptions.map(option => option.value);
//         setFilters(prev => ({ ...prev, studentIds }));
//         setMessage('');
//     };

//     const handleDownload = async () => {
//         if (filters.studentIds.length === 0) {
//             setMessage('Please select at least one student');
//             return;
//         }

//         try {
//             setLoading(true);
//             setMessage('Preparing download...');
            
//             const response = await axios.post('http://checking.shorthandonlineexam.in/download-zip/files', {
//                 studentIds: filters.studentIds
//             }, {
//                 responseType: 'blob'
//             });

//             // Create download link
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
            
//             // Set filename based on number of files
//             const filename = filters.studentIds.length === 1 
//                 ? `student_${filters.studentIds[0]}.zip`
//                 : 'merged_student_files.zip';
                
//             link.setAttribute('download', filename);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();

//             setMessage('Download started successfully');

//         } catch (err) {
//             console.error('Download failed:', err);
//             if (err.response?.data) {
//                 // Try to read error message from blob
//                 try {
//                     const errorText = await err.response.data.text();
//                     const errorData = JSON.parse(errorText);
//                     setMessage(errorData.message || 'Download failed');
//                 } catch (parseError) {
//                     setMessage('Download failed. Please try again.');
//                 }
//             } else {
//                 setMessage('Download failed. Please try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Add this function to check storage status
//     const checkStorageStatus = async () => {
//         try {
//             setMessage('Checking storage status...');
//             const res = await axios.get('http://checking.shorthandonlineexam.in/download-zip/check-storage');
            
//             const { storageFolder, trackrecordTable } = res.data;
            
//             let statusMessage = `Storage Folder: ${storageFolder.exists ? '✓ Found' : '✗ Missing'} at ${storageFolder.path}\n`;
            
//             if (storageFolder.exists) {
//                 statusMessage += `Files in folder: ${storageFolder.fileCount || 0} (${storageFolder.zipFileCount || 0} zip files)\n`;
//             }
            
//             statusMessage += `Trackrecord Table: ${trackrecordTable.tableExists ? '✓ Exists' : '✗ Missing'}\n`;
            
//             if (trackrecordTable.tableExists) {
//                 statusMessage += `Zip File Column: ${trackrecordTable.hasZipColumn ? '✓ Exists' : '✗ Missing'}\n`;
//                 if (trackrecordTable.hasZipColumn) {
//                     statusMessage += `Records with zip files: ${trackrecordTable.recordCount || 0}\n`;
//                 }
//             }
            
//             setMessage(statusMessage);
            
//         } catch (err) {
//             console.error('Storage status check failed:', err);
//             setMessage(err.response?.data?.message || 'Error checking storage status');
//         }
//     };

//     // Add this function to check all batches (for debugging)
//     const checkAllBatches = async () => {
//         if (!filters.departmentId) {
//             setMessage('Please select a department first');
//             return;
//         }

//         try {
//             setMessage('Loading all batches...');
//             const res = await axios.get(`http://checking.shorthandonlineexam.in/download-zip/department/${filters.departmentId}/all-batches`);
            
//             const batches = res.data.data || [];
//             let message = `All batches for department ${filters.departmentId}:\n`;
            
//             batches.forEach(batch => {
//                 message += `Batch ${batch.batchNo} - ${new Date(batch.batchdate).toLocaleDateString()} - Status: ${batch.batchstatus}\n`;
//             });
            
//             setMessage(message);
            
//         } catch (err) {
//             console.error('Failed to load all batches:', err);
//             setMessage(err.response?.data?.message || 'Error loading batches');
//         }
//     };

//     return (
//         <div className="download-zip-container">
//             <h2>Download Student Zip Files</h2>

//             <div className="filters">
//                 <div className="filter-group">
//                     <label>Department:</label>
//                     <select
//                         value={filters.departmentId}
//                         onChange={handleDepartmentChange}
//                         disabled={loading}
//                     >
//                         <option value="">Select Department</option>
//                         {options.departments.map(dept => (
//                             <option key={dept.departmentId} value={dept.departmentId}>
//                                 {dept.departmentName} (ID: {dept.departmentId})
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="filter-group">
//                     <label>Batch:</label>
//                     <select
//                         value={filters.batchNo}
//                         onChange={handleBatchChange}
//                         disabled={!filters.departmentId || batchLoading}
//                     >
//                         <option value="">Select Batch</option>
//                         {batchLoading && <option value="">Loading batches...</option>}
//                         {options.batches.map(batch => (
//                             <option key={batch.batchNo} value={batch.batchNo}>
//                                 Batch {batch.batchNo} ({new Date(batch.batchdate).toLocaleDateString()})
//                             </option>
//                         ))}
//                     </select>
//                     {batchLoading && <span className="loading-text">Loading batches...</span>}
//                 </div>

//                 <div className="filter-group">
//                     <label>Students (Select multiple):</label>
//                     <select
//                         multiple
//                         value={filters.studentIds}
//                         onChange={handleStudentSelection}
//                         disabled={!filters.batchNo || studentLoading}
//                         size="5"
//                         className="students-select"
//                     >
//                         <option value="" disabled>Select students</option>
//                         {studentLoading && <option value="">Loading students...</option>}
//                         {options.students.map(student => (
//                             <option key={student.student_id} value={student.student_id}>
//                                 {student.student_id} - {student.fullname}
//                             </option>
//                         ))}
//                     </select>
//                     {studentLoading && <span className="loading-text">Loading students...</span>}
//                     <small>Hold Ctrl/Cmd to select multiple students</small>
//                 </div>

//                 <div className="filter-group button-group">
//                     <button
//                         onClick={handleDownload}
//                         disabled={filters.studentIds.length === 0 || loading}
//                         className="download-button"
//                     >
//                         {loading ? 'Processing...' : `Download (${filters.studentIds.length} selected)`}
//                     </button>
//                 </div>
//             </div>

//             {/* Debug buttons */}
//             <div className="debug-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
//                 <button
//                     onClick={checkStorageStatus}
//                     className="check-button"
//                     style={{ 
//                         backgroundColor: '#2196F3', 
//                         color: 'white',
//                         padding: '10px 15px',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     Check Storage Status
//                 </button>
                
//                 {filters.departmentId && (
//                     <button
//                         onClick={checkAllBatches}
//                         className="check-button"
//                         style={{ 
//                             backgroundColor: '#FF9800', 
//                             color: 'white',
//                             padding: '10px 15px',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer'
//                         }}
//                     >
//                         Debug Batches
//                     </button>
//                 )}
//             </div>

//             {message && (
//                 <div className={`message ${message.includes('Error') || message.includes('failed') || message.includes('not found') || message.includes('Missing') ? 'error' : 'success'}`}>
//                     {message.split('\n').map((line, index) => (
//                         <div key={index}>{line}</div>
//                     ))}
//                 </div>
//             )}

//             <div className="selection-info">
//                 {filters.studentIds.length > 0 && (
//                     <p>Selected {filters.studentIds.length} student(s)</p>
//                 )}
//                 {filters.departmentId && options.batches.length === 0 && !batchLoading && (
//                     <p className="warning">No batches available for this department</p>
//                 )}
//                 {filters.batchNo && options.students.length === 0 && !studentLoading && (
//                     <p className="warning">No students found in this batch</p>
//                 )}
//             </div>

//             <div className="instructions">
//                 <h3>Instructions:</h3>
//                 <ul>
//                     <li>Select a department to see available batches</li>
//                     <li>Select a batch to see students in that batch</li>
//                     <li>Select one or more students (use Ctrl/Cmd for multiple selection)</li>
//                     <li>Click Download to get the zip files</li>
//                     <li>Single student: Downloads individual zip file</li>
//                     <li>Multiple students: Downloads merged zip file</li>
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default DownloadZip;