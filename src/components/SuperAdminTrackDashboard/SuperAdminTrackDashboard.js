// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// // import NavBar from '../navBar/navBar';
// import * as XLSX from 'xlsx';
// import './SuperAdminTrackDashboard.css'
// import moment from 'moment-timezone'

// const isValidData = (value) => {
//     // Check for obviously invalid values first
//     if (!value || value === "invalid date" || value === "0" || value === "" || value === null || value === undefined) {
//         return false;
//     }
    
//     // If it's already a formatted string with time, consider it valid
//     // Pattern: DD/MM/YYYY HH:MM AM/PM
//     const formattedPattern = /^\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{2}\s(AM|PM)$/;
//     if (formattedPattern.test(value)) {
//         return true;
//     }
    
//     // For other formats, try to parse as date
//     try {
//         const date = new Date(value);
//         return !isNaN(date.getTime());
//     } catch (error) {
//         return false;
//     }
// };
// const getCellClass = (item, field, exam_type) => {
//     let stages; 
//     if (exam_type === 'shorthand') {
//         stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
//     } else if (exam_type === 'typewriting') {
//         stages = ['loginTime', 'trial_passage_time', 'typing_passage_time', 'feedback_time'];
//     }else {
//        stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
//     }
//     const currentStageIndex = stages.indexOf(field);
    
//     if (currentStageIndex === -1) return '';
    
//     if (field === 'loginTime') {
//         return isValidData(item[field]) ? 'dept-cell-green dept-text-white' : 'dept-cell-red dept-text-white';
//     }

//     if (field === 'feedback_time') {
//         if (isValidData(item[field])) {
//             return 'dept-cell-green dept-text-white';
//         } else {
//             return 'dept-cell-red dept-text-white';
//         }
//     }

//     if (isValidData(item[field])) {
//         if (currentStageIndex === stages.length - 1 || isValidData(item[stages[currentStageIndex + 1]])) {
//             return 'dept-cell-green dept-text-white';
//         } else if (currentStageIndex > 0 && currentStageIndex < stages.length - 1) {
//             const prevCellGreen = isValidData(item[stages[currentStageIndex - 1]]);
//             const nextCellRed = !isValidData(item[stages[currentStageIndex + 1]]);
//             if (prevCellGreen && nextCellRed ) {
//                 return 'dept-cell-yellow dept-text-black';
//             } else {
//                 return 'dept-cell-green dept-text-white';
//             }
//         } else {
//             return 'dept-cell-green dept-text-white';
//         }
//     } else if (currentStageIndex > 0 && isValidData(item[stages[currentStageIndex - 1]])) {
//         return 'dept-cell-red dept-text-black';
//     } else {
//         return 'dept-cell-red dept-text-white';
//     }
// };

// const SuperAdminTrackDashboard = () => {
//     const [data, setData] = useState([]);
//     const [batchNo, setBatchNo] = useState('');
//     const [subject, setSubject] = useState('');
//     const [loginStatus, setLoginStatus] = useState('');
//     const [exam_type, setExam_type] = useState('');
//     const [batchDate, setBatchDate] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [updateInterval, setUpdateInterval] = useState(100000);
//     const [batches, setBatches] = useState([]);
//     const [departmentId, setDepartmentId] = useState('');
//     const [departments, setDepartments] = useState([]);
//     const [center, setCenter] = useState('');
//     const [centers, setCenters] = useState([]);
//     const [subjects, setSubjects] = useState([]);
//     const [allSubjects, setAllSubjects] = useState([]);
//     const [batchDates, setBatchDates] = useState([]);
//     const [total_login_count, setTotal_login_count] = useState(0);

//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [totalPages, setTotalPages] = useState(0);

//     // Current filters state for refresh
//     const [currentFilters, setCurrentFilters] = useState({});

//     const formatDate = (dateString) => {
//         if (!dateString || dateString === "invalid date" || dateString === "0") {
//             return "";
//         }
        
//         const dateStr = String(dateString);
//         const dateTimeMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):?(\d{2})?/);
        
//         if (dateTimeMatch) {
//             const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
//             const formattedDate = `${day}/${month}/${year}`;
            
//             let hour = parseInt(hours, 10);
//             const minute = minutes;
//             const ampm = hour >= 12 ? 'PM' : 'AM';
            
//             if (hour === 0) {
//                 hour = 12;
//             } else if (hour > 12) {
//                 hour = hour - 12;
//             }
            
//             const formattedTime = `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
//             return `${formattedDate} ${formattedTime}`;
//         }
        
//         return dateStr;
//     };

//     const formatDateForDisplay = (dateString) => {
//         if (!dateString || dateString === "invalid date" || dateString === "0") {
//             return dateString;
//         }
        
//         try {
//             const dateStr = String(dateString);
//             const datePart = dateStr.split('T')[0] || dateStr.split(' ')[0];
//             const [year, month, day] = datePart.split('-');
//             return `${day}/${month}/${year}`;
//         } catch (error) {
//             return dateString;
//         }
//     };

//     const debounce = (func, delay) => {
//         let timeoutId;
//         return (...args) => {
//             clearTimeout(timeoutId);
//             timeoutId = setTimeout(() => func.apply(null, args), delay);
//         };
//     };

//     // Fetch all filter options from backend
//     const fetchFilterOptions = async () => {
//         try {
//             console.log("🔍 Fetching filter options...");
//             const response = await axios.post(
//                 'http://localhost:3000/super-admin-student-track-dashboard', 
//                 {}, // Empty request body to get all data
//                 { withCredentials: true }
//             );
            
//             if (response.data && response.data.length > 0) {
//                 console.log("📊 Total records received:", response.data.length);
                
//                 // Process dates WITHOUT timezone conversion
//                 const processedDates = response.data
//                     .filter(item => {
//                         const date = item.batchdate;
//                         const isValid = date && 
//                                     date !== "invalid date" && 
//                                     date !== "0" && 
//                                     date !== "" &&
//                                     date !== null &&
//                                     date !== undefined;
//                         return isValid;
//                     })
//                     .map(item => {
//                         const date = item.batchdate;
                        
//                         // Handle string dates
//                         if (typeof date === 'string') {
//                             // If it's already in YYYY-MM-DD format
//                             if (date.match(/^\d{4}-\d{2}-\d{2}/)) {
//                                 return date.split('T')[0]; // Remove time part if exists
//                             }
//                             // If it's in DD/MM/YYYY format
//                             if (date.includes('/')) {
//                                 const [day, month, year] = date.split('/');
//                                 return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//                             }
//                         }
                        
//                         // Handle Date objects
//                         if (date instanceof Date) {
//                             const year = date.getFullYear();
//                             const month = String(date.getMonth() + 1).padStart(2, '0');
//                             const day = String(date.getDate()).padStart(2, '0');
//                             return `${year}-${month}-${day}`;
//                         }
                        
//                         // Try to parse as date but avoid timezone issues
//                         try {
//                             const parsed = new Date(date);
//                             if (!isNaN(parsed.getTime())) {
//                                 const year = parsed.getFullYear();
//                                 const month = String(parsed.getMonth() + 1).padStart(2, '0');
//                                 const day = String(parsed.getDate()).padStart(2, '0');
//                                 return `${year}-${month}-${day}`;
//                             }
//                         } catch (e) {
//                             console.error('Error parsing date:', date, e);
//                         }
                        
//                         return null;
//                     })
//                     .filter(date => date !== null);

//                 const uniqueBatchDates = [...new Set(processedDates)].sort().reverse();
//                 setBatchDates(uniqueBatchDates);
                
//                 const uniqueBatches = [...new Set(response.data
//                     .map(item => item.batchNo)
//                     .filter(batch => batch && batch !== "" && batch !== null && batch !== undefined)
//                 )].sort();
//                 setBatches(uniqueBatches);

//                 const uniqueCenters = [...new Set(response.data
//                     .map(item => item.center)
//                     .filter(center => center && center !== "" && center !== null && center !== undefined)
//                 )].sort();
//                 setCenters(uniqueCenters);

//                 const uniqueDepartments = [...new Set(response.data
//                     .map(item => item.departmentId)
//                     .filter(dept => dept && dept !== "" && dept !== null && dept !== undefined)
//                 )].sort();
//                 setDepartments(uniqueDepartments);

//                 const uniqueSubjects = [...new Set(response.data
//                     .map(item => item.subject_name)
//                     .filter(subject => subject && subject !== "" && subject !== null && subject !== undefined)
//                 )];
//                 setSubjects(uniqueSubjects);
//             }
//         } catch (error) {
//             console.error('❌ Error fetching filter options:', error);
//         }
//     };

//     const fetchSubjects = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/subjects');
//             if (response.data.subjects) {
//                 setAllSubjects(response.data.subjects);
//             }
//         } catch (error) {
//             console.error('Error fetching subjects:', error);
//             setError('Failed to fetch subjects');
//         }
//     };

//     // Updated fetchTotalLoginCount with ALL filters
//     const fetchTotalLoginCount = async (filters = currentFilters) => {
//         try {
//             const requestBody = {};

//             if (filters.center && filters.center.trim()) {
//                 requestBody.center = filters.center.trim();
//             }
//             if (filters.batchNo && filters.batchNo.trim()) {
//                 requestBody.batchNo = filters.batchNo.trim();
//             }
//             if (filters.departmentId && filters.departmentId.trim()) {
//                 requestBody.department = filters.departmentId.trim();
//             }
//             if (filters.subject && filters.subject.trim()) {
//                 requestBody.subject_name = filters.subject.trim();
//             }
//             if (filters.loginStatus && filters.loginStatus.trim()) {
//                 requestBody.loginStatus = filters.loginStatus.trim();
//             }
//             if (filters.exam_type && filters.exam_type.trim()) {
//                 requestBody.exam_type = filters.exam_type.trim();
//             }
//             if (filters.batchDate && filters.batchDate.trim()) {
//                 requestBody.batchDate = filters.batchDate.trim();
//             }

//             console.log('🔢 Fetching login count with filters:', requestBody);

//             const response = await axios.post('http://localhost:3000/total-login-count', requestBody, { withCredentials: true });
            
//             if (response.data) {
//                 console.log('🔢 Login count response:', response.data);
//                 setTotal_login_count(response.data.total_count);
//             }
//         } catch (error) {
//             console.log('❌ Error fetching login count:', error);
//             setTotal_login_count(0);
//         }
//     };

//     // Create a separate function that accepts filters directly
//     const fetchDataWithFilters = async (filters) => {
//         setLoading(true);
//         setError('');
        
//         console.log("🔍 fetchDataWithFilters called with:", filters);

//         try {
//             // Build request body
//             const requestBody = {};
            
//             if (filters.subject && filters.subject.trim()) {
//                 requestBody.subject_name = filters.subject.trim();
//             }
//             if (filters.loginStatus && filters.loginStatus.trim()) {
//                 requestBody.loginStatus = filters.loginStatus.trim();
//             }
//             if (filters.batchNo && filters.batchNo.trim()) {
//                 requestBody.batchNo = filters.batchNo.trim();
//             }
//             if (filters.center && filters.center.trim()) {
//                 requestBody.center = filters.center.trim();
//             }
//             if (filters.exam_type && filters.exam_type.trim()) {
//                 requestBody.exam_type = filters.exam_type.trim();
//             }
//             if (filters.departmentId && filters.departmentId.trim()) {
//                 requestBody.departmentId = filters.departmentId.trim();
//             }
//             if (filters.batchDate && filters.batchDate.trim()) {
//                 requestBody.batchDate = filters.batchDate.trim();
//             }

//             console.log("🚀 Sending request body:", requestBody);
//             console.log("🔍 BatchNo specifically:", {
//                 original: filters.batchNo,
//                 trimmed: filters.batchNo ? filters.batchNo.trim() : 'undefined',
//                 inRequestBody: requestBody.batchNo
//             });
            
//             const response = await axios.post(
//                 'http://localhost:3000/super-admin-student-track-dashboard',
//                 requestBody,
//                 { 
//                     withCredentials: true,
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
            
//             console.log("📨 Response:", response.data.length, "records");
            
//             setData(response.data);
//             setTotalPages(Math.ceil(response.data.length / rowsPerPage));

//         } catch (error) {
//             console.error("❌ Error fetching filtered data:", error);
//             if (error.response && error.response.status === 404) {
//                 setError("No students found for the selected filter criteria. Please try different filters.");
//                 setData([]);
//                 setTotal_login_count(0);
//             } else {
//                 setError("Failed to fetch data. Please try again.");
//             }
//         }
//         setLoading(false);
//     };

//     // Updated fetchData function
//     const fetchData = async (preserveFilters = false) => {
//         // Use current state values or preserved filters
//         const filters = preserveFilters ? currentFilters : {
//             subject,
//             loginStatus,
//             batchNo,
//             center,
//             exam_type,
//             departmentId,
//             batchDate
//         };

//         console.log("🔍 fetchData called with preserveFilters:", preserveFilters);
//         console.log("🔍 Current state values:", { subject, loginStatus, batchNo, center, exam_type, departmentId, batchDate });
//         console.log("🔍 Using filters:", filters);

//         // Update current filters for refresh
//         if (!preserveFilters) {
//             setCurrentFilters(filters);
//         }

//         await fetchDataWithFilters(filters);
//     };

//     // Debounced fetch data for filter changes
//     const debouncedFetchData = useCallback(debounce(() => fetchData(false), 500), []);

//     // Refresh function that preserves filters
//     const refreshData = useCallback(() => {
//         console.log("Refreshing data with current filters:", currentFilters);
//         fetchData(true); // Preserve current filters
//         fetchTotalLoginCount(currentFilters);
//     }, [currentFilters]);

//     // Filter change handlers
//     const handleFilterChange = (filterName, value) => {
//         console.log(`🔍 Filter changed: ${filterName} = ${value}`);
        
//         // Update individual state immediately
//         switch (filterName) {
//             case 'batchNo': setBatchNo(value); break;
//             case 'subject': setSubject(value); break;
//             case 'loginStatus': setLoginStatus(value); break;
//             case 'exam_type': setExam_type(value); break;
//             case 'batchDate': setBatchDate(value); break;
//             case 'center': setCenter(value); break;
//             case 'departmentId': setDepartmentId(value); break;
//         }
        
//         // Create new filters object with the updated value
//         const newFilters = {
//             ...currentFilters,
//             [filterName]: value
//         };
        
//         console.log(`🔍 New filters object:`, newFilters);
        
//         setCurrentFilters(newFilters);
        
//         // Reset to first page when filters change
//         setCurrentPage(1);
        
//         // Use the new filters directly instead of state
//         setTimeout(() => {
//             fetchDataWithFilters(newFilters); // Pass filters directly
//             fetchTotalLoginCount(newFilters);
//         }, 100);
//     };

//     // Clear all filters
//     const clearAllFilters = () => {
//         setBatchNo('');
//         setSubject('');
//         setLoginStatus('');
//         setExam_type('');
//         setBatchDate('');
//         setCenter('');
//         setDepartmentId('');
        
//         const emptyFilters = {
//             batchNo: '',
//             subject: '',
//             loginStatus: '',
//             exam_type: '',
//             batchDate: '',
//             center: '',
//             departmentId: ''
//         };
        
//         setCurrentFilters(emptyFilters);
//         setCurrentPage(1);
        
//         // Fetch data without any filters
//         setTimeout(() => {
//             fetchDataWithFilters(emptyFilters);
//             fetchTotalLoginCount(emptyFilters);
//         }, 100);
//     };

//     useEffect(() => {
//         fetchSubjects();
//         fetchFilterOptions();
//         setTimeout(() => {
//             fetchData(false);
//             fetchTotalLoginCount();
//         }, 500);
//     }, []);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             refreshData();
//         }, updateInterval);
//         return () => clearInterval(interval);
//     }, [updateInterval, refreshData]);

//     useEffect(() => {
//         setTotalPages(Math.ceil(data.length / rowsPerPage));
//         setCurrentPage(1);
//     }, [data, rowsPerPage]);

//     const exportToExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
//             "Batch Number": item.batchNo,
//             "Center": item.center,
//             "Department": item.departmentId,
//             "Seat No": item.student_id,
//             "Student Name": item.fullname,
//             "Subject": item.subject_name,
//             "Batch Date": formatDateForDisplay(item.batchdate),
//             "Login": formatDate(item.loginTime),
//             "Trial": formatDate(item.trial_time),
//             "Audio Track A": formatDate(item.audio1_time),
//             "Passage A": formatDate(item.passage1_time),
//             "Audio Track B": formatDate(item.audio2_time),
//             "Passage B": formatDate(item.passage2_time),
//             "Trial Typing": formatDate(item.trial_passage_time),
//             "Typing Passage": formatDate(item.typing_passage_time),
//             "Feedback": formatDate(item.feedback_time)
//         })));
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
//         XLSX.writeFile(workbook, `student_data_${new Date().toISOString().split('T')[0]}.xlsx`);
//     };

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const handleRowsPerPageChange = (event) => {
//         const newRowsPerPage = event.target.value === 'all' ? data.length : parseInt(event.target.value, 10);
//         setRowsPerPage(newRowsPerPage);
//         setCurrentPage(1);
//     };

//     const getPaginatedData = () => {
//         if (rowsPerPage === 'all' || rowsPerPage >= data.length) {
//             return data;
//         }
//         const startIndex = (currentPage - 1) * rowsPerPage;
//         const endIndex = startIndex + rowsPerPage;
//         return data.slice(startIndex, endIndex);
//     };

//     const renderPaginationButtons = () => {
//         if (rowsPerPage === 'all' || rowsPerPage >= data.length) {
//             return null;
//         }

//         const pageNumbers = [];
//         if (totalPages <= 5) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pageNumbers.push(i);
//             }
//         } else {
//             if (currentPage <= 3) {
//                 for (let i = 1; i <= 5; i++) {
//                     pageNumbers.push(i);
//                 }
//                 pageNumbers.push('...');
//                 pageNumbers.push(totalPages);
//             } else if (currentPage >= totalPages - 2) {
//                 pageNumbers.push(1);
//                 pageNumbers.push('...');
//                 for (let i = totalPages - 4; i <= totalPages; i++) {
//                     pageNumbers.push(i);
//                 }
//             } else {
//                 pageNumbers.push(1);
//                 pageNumbers.push('...');
//                 for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//                     pageNumbers.push(i);
//                 }
//                 pageNumbers.push('...');
//                 pageNumbers.push(totalPages);
//             }
//         }

//         return pageNumbers.map((page, index) => (
//             <button
//                 key={index}
//                 onClick={() => page !== '...' && handlePageChange(page)}
//                 className={`dept-btn ${currentPage === page ? 'dept-btn-primary' : 'dept-btn-secondary'}`}
//                 disabled={page === '...'}
//             >
//                 {page}
//             </button>
//         ));
//     };

//     return (
//         <div>
//             {/* <NavBar /> */}
//             <div className="home-container">
//                 <div className="dept-container-fluid">
//                     <div className="dept-row mb-3">
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="batchNo" className="dept-form-label">Batch Number:</label>
//                             <select
//                                 className="dept-form-select dept-scrollable-dropdown"
//                                 id="batchNo"
//                                 value={batchNo}
//                                 onChange={(e) => handleFilterChange('batchNo', e.target.value)}
//                             >
//                                 <option value="">All Batches</option>
//                                 {batches.map((batch, index) => (
//                                     <option key={index} value={batch}>{batch}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="subject" className="dept-form-label">Subject:</label>
//                             <select
//                                 className="dept-form-select dept-scrollable-dropdown"
//                                 id="subject"
//                                 value={subject}
//                                 onChange={(e) => handleFilterChange('subject', e.target.value)}
//                             >
//                                 <option value="">All Subjects</option>
//                                 {allSubjects.map((subj) => (
//                                     <option key={subj.subjectId} value={subj.subject_name}>
//                                         {subj.subject_name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="loginStatus" className="dept-form-label">Login Status:</label>
//                             <select
//                                 className="dept-form-select"
//                                 id="loginStatus"
//                                 value={loginStatus}
//                                 onChange={(e) => handleFilterChange('loginStatus', e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 <option value="loggedin">Logged In</option>
//                                 <option value="loggedout">Logged Out</option>
//                             </select>
//                         </div>
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="examStatus" className="dept-form-label">Exam Status:</label>
//                             <select
//                                 className="dept-form-select"
//                                 id="examStatus"
//                                 value={exam_type}
//                                 onChange={(e) => handleFilterChange('exam_type', e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 <option value="shorthand">Short Hand</option>
//                                 <option value="typewriting">Type Writing</option>
//                                 <option value="both">Both</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="dept-row mb-3">
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="batchDate" className="dept-form-label">Batch Date:</label>
//                             <select
//                                 className="dept-form-select"
//                                 id="batchDate"
//                                 value={batchDate}
//                                 onChange={(e) => handleFilterChange('batchDate', e.target.value)}
//                             >
//                                 <option value="">All Dates</option>
//                                 {batchDates.map((date, index) => (
//                                     <option key={index} value={date}>
//                                         {formatDateForDisplay(date)}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="center" className="dept-form-label">Center:</label>
//                             <select
//                                 className="dept-form-select dept-scrollable-dropdown"
//                                 id="center"
//                                 value={center}
//                                 onChange={(e) => handleFilterChange('center', e.target.value)}
//                             >
//                                 <option value="">All Centers</option>
//                                 {centers.map((centerOption, index) => (
//                                     <option key={index} value={centerOption}>{centerOption}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="department" className="dept-form-label">Department:</label>
//                             <select
//                                 className="dept-form-select dept-scrollable-dropdown"
//                                 id="department"
//                                 value={departmentId}
//                                 onChange={(e) => handleFilterChange('departmentId', e.target.value)}
//                             >
//                                 <option value="">All Departments</option>
//                                 {departments.map((departmentOption, index) => (
//                                     <option key={index} value={departmentOption}>{departmentOption}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="dept-col-md-3 dept-col-sm-6 mb-2">
//                             <label htmlFor="rowsPerPage" className="dept-form-label">Rows per page:</label>
//                             <select
//                                 className="dept-form-select"
//                                 id="rowsPerPage"
//                                 value={rowsPerPage}
//                                 onChange={handleRowsPerPageChange}
//                             >
//                                 <option value="10">10</option>
//                                 <option value="25">25</option>
//                                 <option value="50">50</option>
//                                 <option value="100">100</option>
//                                 <option value="all">All</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="dept-row mb-3">
//                         <div className="dept-col-md-12 dept-col-sm-12 mb-2 d-flex align-items-center flex-wrap">
//                             <button onClick={exportToExcel} className="dept-btn dept-btn-primary dept-export-btn me-3 mb-2">
//                                 Export to Excel
//                             </button>
//                             <button onClick={() => refreshData()} className="dept-btn dept-btn-secondary me-3 mb-2">
//                                 Refresh Now
//                             </button>
//                             <button onClick={clearAllFilters} className="dept-btn dept-btn-outline-secondary me-3 mb-2">
//                                 Clear All Filters
//                             </button>
//                             <div className="dept-total-count-container ms-3 mb-2">
//                                 <span className="dept-total-count-label">Total students: {data.length} | </span>
//                                 <span className="dept-total-count-label">Total logged in: </span>
//                                 <span className="dept-total-count-value">{total_login_count}</span>
//                             </div>
//                         </div>
//                     </div>
//                     {loading ? (
//                         <div className="text-center p-4">
//                             <div className="spinner-border" role="status">
//                                 <span className="visually-hidden">Loading...</span>
//                             </div>
//                             <p className="mt-2">Loading filtered data...</p>
//                         </div>
//                     ) : error ? (
//                         <div className="alert alert-warning" role="alert">
//                             {error}
//                         </div>
//                     ) : data.length > 0 ? (
//                         <div className="dept-table-container">
//                             <table className="dept-table dept-table-bordered dept-table-striped dept-table-hover">
//                                 <thead>
//                                     <tr>
//                                         <th style={{ width: '8%' }}>Batch No</th>
//                                         <th style={{ width: '8%' }}>Center</th>
//                                         <th style={{ width: '12%' }}>Seat No</th>
//                                         <th>Login</th>
//                                         {exam_type !== 'typewriting' && <th>Trial</th>}
//                                         {exam_type !== 'typewriting' && (
//                                             <>
//                                                 <th>Audio Track A</th>
//                                                 <th>Passage A</th>
//                                                 <th>Audio Track B</th>
//                                                 <th>Passage B</th>
//                                             </>
//                                         )}
//                                         {exam_type !== 'shorthand' && (
//                                             <>
//                                                 <th>Trial Typing</th>
//                                                 <th>Typing Test</th>
//                                             </>
//                                         )}
//                                         <th>Feedback</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {getPaginatedData().map((item, index) => (
//                                         <tr key={index}>
//                                             <td className="batch-number-column">{item.batchNo}</td>
//                                             <td>{item.center}</td>
//                                             <td>{item.student_id}</td>
//                                             <td className={getCellClass(item, 'loginTime', exam_type)}>{formatDate(item.loginTime)}</td>
//                                             {exam_type !== 'typewriting' && <td className={getCellClass(item, 'trial_time', exam_type)}>{formatDate(item.trial_time)}</td>}
//                                             {exam_type !== 'typewriting' && (
//                                                 <>
//                                                     <td className={getCellClass(item, 'audio1_time', exam_type)}>{formatDate(item.audio1_time)}</td>
//                                                     <td className={getCellClass(item, 'passage1_time', exam_type)}>{formatDate(item.passage1_time)}</td>
//                                                     <td className={getCellClass(item, 'audio2_time', exam_type)}>{formatDate(item.audio2_time)}</td>
//                                                     <td className={getCellClass(item, 'passage2_time', exam_type)}>{formatDate(item.passage2_time)}</td>
//                                                 </>
//                                             )}
//                                             {exam_type !== 'shorthand' && (
//                                                 <>
//                                                     <td className={getCellClass(item, 'trial_passage_time', exam_type)}>{formatDate(item.trial_passage_time)}</td>
//                                                     <td className={getCellClass(item, 'typing_passage_time', exam_type)}>{formatDate(item.typing_passage_time)}</td>
//                                                 </>
//                                             )}
//                                             <td className={getCellClass(item, 'feedback_time', exam_type)}>{formatDate(item.feedback_time)}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="text-center p-4">
//                             <p>No records found for the selected criteria. Try adjusting your filters.</p>
//                         </div>
//                     )}
//                     {data.length > 0 && renderPaginationButtons() && (
//                         <div className="dept-pagination" style={{ marginTop: '20px' }}>
//                             {renderPaginationButtons()}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SuperAdminTrackDashboard;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Grid,
  Stack,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Zoom,
  LinearProgress,
  Pagination,
  CardHeader,
  Avatar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Dashboard as DashboardIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  ClearAll as ClearIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  Subject as SubjectIcon,
  AccessTime as AccessTimeIcon,
  InsertChart as ChartIcon,
  Group as GroupIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  maxWidth: '100% !important',
}));

const ModernCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '12px',
  backgroundColor: 'transparent',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.2),
    fontSize: '0.875rem',
  },
  '& .MuiDataGrid-row': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
    }
  }
}));

const MetricCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  borderRadius: '16px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
  }
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
  let backgroundColor, color;
  switch (status) {
    case 'completed':
      backgroundColor = theme.palette.success.main;
      color = theme.palette.success.contrastText;
      break;
    case 'in_progress':
      backgroundColor = theme.palette.warning.main;
      color = theme.palette.warning.contrastText;
      break;
    case 'pending':
      backgroundColor = theme.palette.error.main;
      color = theme.palette.error.contrastText;
      break;
    default:
      backgroundColor = theme.palette.grey[300];
      color = theme.palette.grey[700];
  }
  
  return {
    backgroundColor,
    color,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

// Utility Functions
const isValidData = (value) => {
  if (!value || value === "invalid date" || value === "0" || value === "" || value === null || value === undefined) {
    return false;
  }
  
  const formattedPattern = /^\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{2}\s(AM|PM)$/;
  if (formattedPattern.test(value)) {
    return true;
  }
  
  try {
    const date = new Date(value);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

const getCellStatus = (item, field, exam_type) => {
  let stages;
  if (exam_type === 'shorthand') {
    stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
  } else if (exam_type === 'typewriting') {
    stages = ['loginTime', 'trial_passage_time', 'typing_passage_time', 'feedback_time'];
  } else {
    stages = ['loginTime', 'trial_time', 'audio1_time', 'passage1_time', 'audio2_time', 'passage2_time', 'feedback_time'];
  }
  
  const currentStageIndex = stages.indexOf(field);
  if (currentStageIndex === -1) return 'pending';
  
  if (isValidData(item[field])) {
    if (field === 'feedback_time') return 'completed';
    if (currentStageIndex === stages.length - 1 || isValidData(item[stages[currentStageIndex + 1]])) {
      return 'completed';
    } else if (currentStageIndex > 0 && currentStageIndex < stages.length - 1) {
      const prevCompleted = isValidData(item[stages[currentStageIndex - 1]]);
      const nextPending = !isValidData(item[stages[currentStageIndex + 1]]);
      return (prevCompleted && nextPending) ? 'in_progress' : 'completed';
    }
    return 'completed';
  } else if (currentStageIndex > 0 && isValidData(item[stages[currentStageIndex - 1]])) {
    return 'pending';
  }
  return 'pending';
};

const SuperAdminTrackDashboard = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [batchNo, setBatchNo] = useState('');
  const [subject, setSubject] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [exam_type, setExam_type] = useState('');
  const [batchDate, setBatchDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateInterval, setUpdateInterval] = useState(100000);
  const [batches, setBatches] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [center, setCenter] = useState('');
  const [centers, setCenters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [batchDates, setBatchDates] = useState([]);
  const [total_login_count, setTotal_login_count] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentFilters, setCurrentFilters] = useState({});

  // Enhanced Metric Card Component
  const EnhancedMetricCard = ({ title, value, icon, color, percentage, subtitle, trend }) => (
    <MetricCard>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1, fontSize: '0.875rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
          </Avatar>
        </Stack>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color, mb: 0.5, fontSize: { xs: '2rem', sm: '2.5rem' }, lineHeight: 1 }}>
            <CountUp end={value} duration={2} separator="," />
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {percentage && (
          <Box sx={{ mt: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color, fontSize: '0.75rem' }}>
                {percentage}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={parseFloat(percentage)}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(color, 0.15),
                '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 3 }
              }}
            />
          </Box>
        )}
      </CardContent>
    </MetricCard>
  );

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
      return "";
    }
    
    const dateStr = String(dateString);
    const dateTimeMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):?(\d{2})?/);
    
    if (dateTimeMatch) {
      const [, year, month, day, hours, minutes] = dateTimeMatch;
      const formattedDate = `${day}/${month}/${year}`;
      
      let hour = parseInt(hours, 10);
      const minute = minutes;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      
      if (hour === 0) {
        hour = 12;
      } else if (hour > 12) {
        hour = hour - 12;
      }
      
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
      return `${formattedDate} ${formattedTime}`;
    }
    
    return dateStr;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
      return dateString;
    }
    
    try {
      const dateStr = String(dateString);
      const datePart = dateStr.split('T')[0] || dateStr.split(' ')[0];
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Fetch functions (keeping original logic)
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.post('http://localhost:3000/super-admin-student-track-dashboard', {}, { withCredentials: true });
      
      if (response.data && response.data.length > 0) {
        const processedDates = response.data
          .filter(item => {
            const date = item.batchdate;
            return date && date !== "invalid date" && date !== "0" && date !== "" && date !== null && date !== undefined;
          })
          .map(item => {
            const date = item.batchdate;
            if (typeof date === 'string') {
              if (date.match(/^\d{4}-\d{2}-\d{2}/)) {
                return date.split('T')[0];
              }
              if (date.includes('/')) {
                const [day, month, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              }
            }
            if (date instanceof Date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            }
            try {
              const parsed = new Date(date);
              if (!isNaN(parsed.getTime())) {
                const year = parsed.getFullYear();
                const month = String(parsed.getMonth() + 1).padStart(2, '0');
                const day = String(parsed.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              }
            } catch (e) {
              console.error('Error parsing date:', date, e);
            }
            return null;
          })
          .filter(date => date !== null);

        const uniqueBatchDates = [...new Set(processedDates)].sort().reverse();
        setBatchDates(uniqueBatchDates);
        
        const uniqueBatches = [...new Set(response.data.map(item => item.batchNo).filter(batch => batch && batch !== "" && batch !== null && batch !== undefined))].sort();
        setBatches(uniqueBatches);
        
        const uniqueCenters = [...new Set(response.data.map(item => item.center).filter(center => center && center !== "" && center !== null && center !== undefined))].sort();
        setCenters(uniqueCenters);
        
        const uniqueDepartments = [...new Set(response.data.map(item => item.departmentId).filter(dept => dept && dept !== "" && dept !== null && dept !== undefined))].sort();
        setDepartments(uniqueDepartments);
        
        const uniqueSubjects = [...new Set(response.data.map(item => item.subject_name).filter(subject => subject && subject !== "" && subject !== null && subject !== undefined))];
        setSubjects(uniqueSubjects);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/subjects');
      if (response.data.subjects) {
        setAllSubjects(response.data.subjects);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Failed to fetch subjects');
    }
  };

  const fetchTotalLoginCount = async (filters = currentFilters) => {
    try {
      const requestBody = {};
      if (filters.center && filters.center.trim()) requestBody.center = filters.center.trim();
      if (filters.batchNo && filters.batchNo.trim()) requestBody.batchNo = filters.batchNo.trim();
      if (filters.departmentId && filters.departmentId.trim()) requestBody.department = filters.departmentId.trim();
      if (filters.subject && filters.subject.trim()) requestBody.subject_name = filters.subject.trim();
      if (filters.loginStatus && filters.loginStatus.trim()) requestBody.loginStatus = filters.loginStatus.trim();
      if (filters.exam_type && filters.exam_type.trim()) requestBody.exam_type = filters.exam_type.trim();
      if (filters.batchDate && filters.batchDate.trim()) requestBody.batchDate = filters.batchDate.trim();

      const response = await axios.post('http://localhost:3000/total-login-count', requestBody, { withCredentials: true });
      if (response.data) {
        setTotal_login_count(response.data.total_count);
      }
    } catch (error) {
      setTotal_login_count(0);
    }
  };

  const fetchDataWithFilters = async (filters) => {
    setLoading(true);
    setError('');
    
    try {
      const requestBody = {};
      if (filters.subject && filters.subject.trim()) requestBody.subject_name = filters.subject.trim();
      if (filters.loginStatus && filters.loginStatus.trim()) requestBody.loginStatus = filters.loginStatus.trim();
      if (filters.batchNo && filters.batchNo.trim()) requestBody.batchNo = filters.batchNo.trim();
      if (filters.center && filters.center.trim()) requestBody.center = filters.center.trim();
      if (filters.exam_type && filters.exam_type.trim()) requestBody.exam_type = filters.exam_type.trim();
      if (filters.departmentId && filters.departmentId.trim()) requestBody.departmentId = filters.departmentId.trim();
      if (filters.batchDate && filters.batchDate.trim()) requestBody.batchDate = filters.batchDate.trim();

      const response = await axios.post('http://localhost:3000/super-admin-student-track-dashboard', requestBody, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No students found for the selected filter criteria. Please try different filters.");
        setData([]);
        setTotal_login_count(0);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    }
    setLoading(false);
  };

  const fetchData = async (preserveFilters = false) => {
    const filters = preserveFilters ? currentFilters : {
      subject, loginStatus, batchNo, center, exam_type, departmentId, batchDate
    };
    
    if (!preserveFilters) {
      setCurrentFilters(filters);
    }
    await fetchDataWithFilters(filters);
  };

  const refreshData = useCallback(() => {
    fetchData(true);
    fetchTotalLoginCount(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case 'batchNo': setBatchNo(value); break;
      case 'subject': setSubject(value); break;
      case 'loginStatus': setLoginStatus(value); break;
      case 'exam_type': setExam_type(value); break;
      case 'batchDate': setBatchDate(value); break;
      case 'center': setCenter(value); break;
      case 'departmentId': setDepartmentId(value); break;
    }
    
    const newFilters = { ...currentFilters, [filterName]: value };
    setCurrentFilters(newFilters);
    setCurrentPage(1);
    
    setTimeout(() => {
      fetchDataWithFilters(newFilters);
      fetchTotalLoginCount(newFilters);
    }, 100);
  };

  const clearAllFilters = () => {
    setBatchNo('');
    setSubject('');
    setLoginStatus('');
    setExam_type('');
    setBatchDate('');
    setCenter('');
    setDepartmentId('');
    
    const emptyFilters = {
      batchNo: '', subject: '', loginStatus: '', exam_type: '', batchDate: '', center: '', departmentId: ''
    };
    
    setCurrentFilters(emptyFilters);
    setCurrentPage(1);
    
    setTimeout(() => {
      fetchDataWithFilters(emptyFilters);
      fetchTotalLoginCount(emptyFilters);
    }, 100);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      "Batch Number": item.batchNo,
      "Center": item.center,
      "Department": item.departmentId,
      "Seat No": item.student_id,
      "Student Name": item.fullname,
      "Subject": item.subject_name,
      "Batch Date": formatDateForDisplay(item.batchdate),
      "Login": formatDate(item.loginTime),
      "Trial": formatDate(item.trial_time),
      "Audio Track A": formatDate(item.audio1_time),
      "Passage A": formatDate(item.passage1_time),
      "Audio Track B": formatDate(item.audio2_time),
      "Passage B": formatDate(item.passage2_time),
      "Trial Typing": formatDate(item.trial_passage_time),
      "Typing Passage": formatDate(item.typing_passage_time),
      "Feedback": formatDate(item.feedback_time)
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
    XLSX.writeFile(workbook, `student_data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Calculate analytics
  const getAnalytics = () => {
    if (!data.length) return { totalStudents: 0, completedCount: 0, inProgressCount: 0, pendingCount: 0 };
    
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;
    
    data.forEach(item => {
      const hasLogin = isValidData(item.loginTime);
      const hasFeedback = isValidData(item.feedback_time);
      
      if (hasFeedback) {
        completedCount++;
      } else if (hasLogin) {
        inProgressCount++;
      } else {
        pendingCount++;
      }
    });
    
    return {
      totalStudents: data.length,
      completedCount,
      inProgressCount,
      pendingCount,
      completionRate: data.length ? ((completedCount / data.length) * 100).toFixed(1) : 0,
      loginRate: data.length ? ((total_login_count / data.length) * 100).toFixed(1) : 0
    };
  };

  const analytics = getAnalytics();

  // DataGrid columns
  const getColumns = () => {
    const baseColumns = [
      {
        field: 'batchNo',
        headerName: 'Batch No',
        flex: 0.8,
        minWidth: 100,
        renderCell: (params) => (
          <Chip label={params.value} size="small" color="primary" variant="outlined" />
        )
      },
      {
        field: 'center',
        headerName: 'Center',
        flex: 0.8,
        minWidth: 80,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2">{params.value}</Typography>
          </Stack>
        )
      },
      {
        field: 'student_id',
        headerName: 'Seat No',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" fontWeight={500}>{params.value}</Typography>
          </Stack>
        )
      },
      {
        field: 'loginTime',
        headerName: 'Login',
        flex: 1.2,
        minWidth: 140,
        renderCell: (params) => (
          <Stack alignItems="center" spacing={0.5}>
            <StatusChip
              label={getCellStatus(params.row, 'loginTime', exam_type)}
              status={getCellStatus(params.row, 'loginTime', exam_type)}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {formatDate(params.value)}
            </Typography>
          </Stack>
        )
      }
    ];

    // Add conditional columns based on exam type
    if (exam_type !== 'typewriting') {
      baseColumns.push(
        {
          field: 'trial_time',
          headerName: 'Trial',
          flex: 1.2,
          minWidth: 140,
          renderCell: (params) => (
            <Stack alignItems="center" spacing={0.5}>
              <StatusChip
                label={getCellStatus(params.row, 'trial_time', exam_type)}
                status={getCellStatus(params.row, 'trial_time', exam_type)}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(params.value)}
              </Typography>
            </Stack>
          )
        },
        {
          field: 'audio1_time',
          headerName: 'Audio Track A',
          flex: 1.2,
          minWidth: 140,
          renderCell: (params) => (
            <Stack alignItems="center" spacing={0.5}>
              <StatusChip
                label={getCellStatus(params.row, 'audio1_time', exam_type)}
                status={getCellStatus(params.row, 'audio1_time', exam_type)}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(params.value)}
              </Typography>
            </Stack>
          )
        },
        {
          field: 'passage1_time',
          headerName: 'Passage A',
          flex: 1.2,
          minWidth: 140,
          renderCell: (params) => (
            <Stack alignItems="center" spacing={0.5}>
              <StatusChip
                label={getCellStatus(params.row, 'passage1_time', exam_type)}
                status={getCellStatus(params.row, 'passage1_time', exam_type)}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(params.value)}
              </Typography>
            </Stack>
          )
        },
        {
          field: 'audio2_time',
          headerName: 'Audio Track B',
          flex: 1.2,
          minWidth: 140,
          renderCell: (params) => (
            <Stack alignItems="center" spacing={0.5}>
              <StatusChip
                label={getCellStatus(params.row, 'audio2_time', exam_type)}
                status={getCellStatus(params.row, 'audio2_time', exam_type)}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(params.value)}
              </Typography>
            </Stack>
          )
        },
        {
          field: 'passage2_time',
          headerName: 'Passage B',
          flex: 1.2,
          minWidth: 140,
          renderCell: (params) => (
            <Stack alignItems="center" spacing={0.5}>
              <StatusChip
                label={getCellStatus(params.row, 'passage2_time', exam_type)}
                status={getCellStatus(params.row, 'passage2_time', exam_type)}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(params.value)}
              </Typography>
            </Stack>
          )
        }
      );
    }

    if (exam_type !== 'shorthand') {
      baseColumns.push(
        {
          field: 'trial_passage_time',
          headerName: 'Trial Typing',
          flex: 1.2,
          minWidth: 140,
          renderCell: (params) => (
            <Stack alignItems="center" spacing={0.5}>
              <StatusChip
                label={getCellStatus(params.row, 'trial_passage_time', exam_type)}
                status={getCellStatus(params.row, 'trial_passage_time', exam_type)}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(params.value)}
              </Typography>
            </Stack>
          )
        },
        {
          field: 'typing_passage_time',
          headerName: 'Typing Test',
          flex: 1.2,
          minWidth: 140,
          renderCell: (params) => (
            <Stack alignItems="center" spacing={0.5}>
              <StatusChip
                label={getCellStatus(params.row, 'typing_passage_time', exam_type)}
                status={getCellStatus(params.row, 'typing_passage_time', exam_type)}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(params.value)}
              </Typography>
            </Stack>
          )
        }
      );
    }

    baseColumns.push({
      field: 'feedback_time',
      headerName: 'Feedback',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
        <Stack alignItems="center" spacing={0.5}>
          <StatusChip
            label={getCellStatus(params.row, 'feedback_time', exam_type)}
            status={getCellStatus(params.row, 'feedback_time', exam_type)}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(params.value)}
          </Typography>
        </Stack>
      )
    });

    return baseColumns;
  };

  useEffect(() => {
    fetchSubjects();
    fetchFilterOptions();
    setTimeout(() => {
      fetchData(false);
      fetchTotalLoginCount();
    }, 500);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, refreshData]);

  return (
    <StyledContainer>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              <DashboardIcon sx={{ fontSize: { xs: '2rem', md: '3rem' }, color: '#1976d2' }} />
              Super Admin Track Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Real-time student progress monitoring and analytics
            </Typography>
          </Box>

          {/* Analytics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                title="Total Students"
                value={analytics.totalStudents}
                icon={<GroupIcon />}
                color="#1976d2"
                subtitle="Registered students"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                title="Logged In"
                value={total_login_count}
                icon={<LoginIcon />}
                color="#2e7d32"
                percentage={analytics.loginRate}
                subtitle={`${analytics.loginRate}% login rate`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                title="Completed"
                value={analytics.completedCount}
                icon={<CheckCircleIcon />}
                color="#1565c0"
                percentage={analytics.completionRate}
                subtitle={`${analytics.completionRate}% completion rate`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <EnhancedMetricCard
                title="In Progress"
                value={analytics.inProgressCount}
                icon={<TimerIcon />}
                color="#ed6c02"
                subtitle="Currently active"
              />
            </Grid>
          </Grid>

          {/* Filters */}
          <ModernCard sx={{ mb: 3 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><FilterIcon /></Avatar>}
              title="Filter Options"
              subheader="Apply filters to refine your data view"
              action={
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Refresh Data">
                    <IconButton onClick={refreshData}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear All Filters">
                    <IconButton onClick={clearAllFilters}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Batch Number</InputLabel>
                    <Select value={batchNo} onChange={(e) => handleFilterChange('batchNo', e.target.value)} label="Batch Number">
                      <MenuItem value="">All Batches</MenuItem>
                      {batches.map((batch, index) => (
                        <MenuItem key={index} value={batch}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AssignmentIcon fontSize="small" />
                            <span>{batch}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select value={subject} onChange={(e) => handleFilterChange('subject', e.target.value)} label="Subject">
                      <MenuItem value="">All Subjects</MenuItem>
                      {allSubjects.map((subj) => (
                        <MenuItem key={subj.subjectId} value={subj.subject_name}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <SubjectIcon fontSize="small" />
                            <span>{subj.subject_name}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Login Status</InputLabel>
                    <Select value={loginStatus} onChange={(e) => handleFilterChange('loginStatus', e.target.value)} label="Login Status">
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="loggedin">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LoginIcon fontSize="small" />
                          <span>Logged In</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="loggedout">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CancelIcon fontSize="small" />
                          <span>Logged Out</span>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Exam Type</InputLabel>
                    <Select value={exam_type} onChange={(e) => handleFilterChange('exam_type', e.target.value)} label="Exam Type">
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="shorthand">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AssessmentIcon fontSize="small" />
                          <span>Shorthand</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="typewriting">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AssessmentIcon fontSize="small" />
                          <span>Typewriting</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="both">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AssessmentIcon fontSize="small" />
                          <span>Both</span>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Batch Date</InputLabel>
                    <Select value={batchDate} onChange={(e) => handleFilterChange('batchDate', e.target.value)} label="Batch Date">
                      <MenuItem value="">All Dates</MenuItem>
                      {batchDates.map((date, index) => (
                        <MenuItem key={index} value={date}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AccessTimeIcon fontSize="small" />
                            <span>{formatDateForDisplay(date)}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Center</InputLabel>
                    <Select value={center} onChange={(e) => handleFilterChange('center', e.target.value)} label="Center">
                      <MenuItem value="">All Centers</MenuItem>
                      {centers.map((centerOption, index) => (
                        <MenuItem key={index} value={centerOption}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <LocationIcon fontSize="small" />
                            <span>{centerOption}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select value={departmentId} onChange={(e) => handleFilterChange('departmentId', e.target.value)} label="Department">
                      <MenuItem value="">All Departments</MenuItem>
                      {departments.map((dept, index) => (
                        <MenuItem key={index} value={dept}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <SchoolIcon fontSize="small" />
                            <span>{dept}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Rows per Page</InputLabel>
                    <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)} label="Rows per Page">
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value="all">All</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<ExportIcon />}
                  onClick={exportToExcel}
                  sx={{ borderRadius: '12px' }}
                >
                  Export to Excel
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={refreshData}
                  sx={{ borderRadius: '12px' }}
                >
                  Refresh Now
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearAllFilters}
                  color="secondary"
                  sx={{ borderRadius: '12px' }}
                >
                  Clear All Filters
                </Button>
              </Stack>
            </CardContent>
          </ModernCard>

          {/* Data Display */}
          <ModernCard>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'success.main' }}><AnalyticsIcon /></Avatar>}
              title="Student Progress Data"
              subheader={`Showing ${data.length} records`}
            />
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '12px' }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Loading filtered data...
                  </Typography>
                </Paper>
              ) : error ? (
                <Alert severity="warning" sx={{ m: 3, borderRadius: '12px' }}>
                  {error}
                </Alert>
              ) : data.length > 0 ? (
                <Box sx={{ height: 600, width: '100%' }}>
                  <StyledDataGrid
                    rows={data.map((item, index) => ({ ...item, id: index }))}
                    columns={getColumns()}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: rowsPerPage === 'all' ? data.length : rowsPerPage }
                      }
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                    disableRowSelectionOnClick
                    loading={loading}
                  />
                </Box>
              ) : (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <ChartIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    No Data Available
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    No records found for the selected criteria. Try adjusting your filters.
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </ModernCard>
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default SuperAdminTrackDashboard;
