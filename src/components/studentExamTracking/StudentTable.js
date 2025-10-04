// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import "./StudentTable.css";
// import NavBar from "../navBar/navBar";
// import * as XLSX from "xlsx";
// import moment from "moment-timezone";

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
//   let stages;
//   if (exam_type === "shorthand") {
//     stages = [
//       "loginTime",
//       "trial_time",
//       "audio1_time",
//       "passage1_time",
//       "feedback_time",
//     ];
//   } else if (exam_type === "typewriting") {
//     stages = [
//       "loginTime",
//       "trial_passage_time",
//       "typing_passage_time",
//       "feedback_time",
//     ];
//   } else {
//     stages = [
//       "loginTime",
//       "trial_time",
//       "audio1_time",
//       "passage1_time",
//       "feedback_time",
//     ];
//   }
//   const currentStageIndex = stages.indexOf(field);

//   if (currentStageIndex === -1) return "";

//   if (field === "loginTime") {
//     return isValidData(item[field])
//       ? "dept-cell-green dept-text-white"
//       : "dept-cell-red dept-text-white";
//   }

//   if (field === "feedback_time") {
//     if (isValidData(item[field])) {
//       return "dept-cell-green dept-text-white";
//     } else {
//       return "dept-cell-red dept-text-white";
//     }
//   }

//   if (isValidData(item[field])) {
//     if (
//       currentStageIndex === stages.length - 1 ||
//       isValidData(item[stages[currentStageIndex + 1]])
//     ) {
//       return "dept-cell-green dept-text-white";
//     } else if (
//       currentStageIndex > 0 &&
//       currentStageIndex < stages.length - 1
//     ) {
//       const prevCellGreen = isValidData(item[stages[currentStageIndex - 1]]);
//       const nextCellRed = !isValidData(item[stages[currentStageIndex + 1]]);
//       if (prevCellGreen && nextCellRed) {
//         return "dept-cell-yellow dept-text-black";
//       } else {
//         return "dept-cell-green dept-text-white";
//       }
//     } else {
//       return "dept-cell-green dept-text-white";
//     }
//   } else if (
//     currentStageIndex > 0 &&
//     isValidData(item[stages[currentStageIndex - 1]])
//   ) {
//     return "dept-cell-red dept-text-black";
//   } else {
//     return "dept-cell-red dept-text-white";
//   }
// };

// const StudentTable = () => {
//   const [data, setData] = useState([]);
//   const [batchNo, setBatchNo] = useState("");
//   const [subject, setSubject] = useState("");
//   const [loginStatus, setLoginStatus] = useState("");
//   const [exam_type, setExam_type] = useState("shorthand");
//   const [batchDate, setBatchDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [updateInterval, setUpdateInterval] = useState(100000);
//   const [batches, setBatches] = useState([]);
//   const [departmentId, setDepartmentId] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [batchDates, setBatchDates] = useState([]);
//   const [total_login_count, setTotal_login_count] = useState(0);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   // Current filters state for refresh
//   const [currentFilters, setCurrentFilters] = useState({});

//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "invalid date" || dateString === "0") {
//       return "";
//     }

//     const dateStr = String(dateString);
//     const dateTimeMatch = dateStr.match(
//       /(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):?(\d{2})?/
//     );

//     if (dateTimeMatch) {
//       const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
//       const formattedDate = `${day}/${month}/${year}`;

//       let hour = parseInt(hours, 10);
//       const minute = minutes;
//       const ampm = hour >= 12 ? "PM" : "AM";

//       if (hour === 0) {
//         hour = 12;
//       } else if (hour > 12) {
//         hour = hour - 12;
//       }

//       const formattedTime = `${hour
//         .toString()
//         .padStart(2, "0")}:${minute} ${ampm}`;
//       return `${formattedDate} ${formattedTime}`;
//     }

//     return dateStr;
//   };

//   const formatDateForDisplay = (dateString) => {
//     if (!dateString || dateString === "invalid date" || dateString === "0") {
//       return dateString;
//     }

//     try {
//       const dateStr = String(dateString);
//       const datePart = dateStr.split("T")[0] || dateStr.split(" ")[0];
//       const [year, month, day] = datePart.split("-");
//       return `${day}/${month}/${year}`;
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const normalizeDateForFilter = (dateString) => {
//     if (!dateString || dateString === "invalid date" || dateString === "0") {
//       return null;
//     }
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         return null;
//       }
//       return date.toISOString().split("T")[0];
//     } catch (error) {
//       return null;
//     }
//   };

//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func.apply(null, args), delay);
//     };
//   };

//   // Fetch all filter options from super admin API
//   const fetchFilterOptions = async () => {
//     try {
//       console.log("Fetching filter options from super admin API...");
//       const response = await axios.post(
//         'http://localhost:3000/super-admin-student-track-dashboard',
//         {},
//         { withCredentials: true }
//       );

//       if (response.data && response.data.length > 0) {
//         console.log("Filter options data received:", response.data.length, "records");

//         const uniqueBatches = [...new Set(response.data
//           .map(item => item.batchNo)
//           .filter(batch => batch && batch !== "" && batch !== null && batch !== undefined)
//         )].sort();
//         setBatches(uniqueBatches);

//         const uniqueDepartments = [...new Set(response.data
//           .map(item => item.departmentId)
//           .filter(dept => dept && dept !== "" && dept !== null && dept !== undefined)
//         )].sort();
//         setDepartments(uniqueDepartments);

//         const uniqueSubjects = [...new Set(response.data
//           .map(item => item.subject_name)
//           .filter(subject => subject && subject !== "" && subject !== null && subject !== undefined)
//         )];
//         setSubjects(uniqueSubjects);

//         const uniqueBatchDates = [...new Set(response.data
//           .filter(item => item.batchdate && item.batchdate !== "invalid date" && item.batchdate !== "0")
//           .map(item => normalizeDateForFilter(item.batchdate))
//           .filter(date => date !== null)
//         )].sort().reverse();
//         setBatchDates(uniqueBatchDates);
//       }
//     } catch (error) {
//       console.error('Error fetching filter options from super admin API:', error);
//       await fetchLocalFilterOptions();
//     }
//   };

//   // Fallback method to fetch filter options from local center admin API
//   const fetchLocalFilterOptions = async () => {
//     try {
//       console.log("Fetching local filter options...");
//       // FIXED: Use the correct endpoint with "all" parameter to get all data for filter options
//       const url = "http://localhost:3000/track-students-on-exam-center-code/all";
//       const response = await axios.post(url, { withCredentials: true });

//       if (response.data && response.data.length > 0) {
//         const uniqueBatches = [...new Set(
//           response.data
//             .map((item) => item.batchNo)
//             .filter((batch) => batch && batch !== "")
//         )].sort();
//         setBatches(uniqueBatches);

//         const uniqueDepartments = [...new Set(
//           response.data
//             .map((item) => item.departmentId)
//             .filter((dept) => dept && dept !== "")
//         )].sort();
//         setDepartments(uniqueDepartments);

//         const uniqueSubjects = [...new Set(
//           response.data
//             .map((item) => item.subject_name)
//             .filter((subject) => subject && subject !== "")
//         )];
//         setSubjects(uniqueSubjects);

//         const uniqueBatchDates = [...new Set(
//           response.data
//             .filter((item) => 
//               item.batchdate && 
//               item.batchdate !== "invalid date" && 
//               item.batchdate !== "0"
//             )
//             .map((item) => normalizeDateForFilter(item.batchdate))
//             .filter((date) => date !== null)
//         )].sort().reverse();
//         setBatchDates(uniqueBatchDates);
//       }
//     } catch (error) {
//       console.error("Error fetching local filter options:", error);
//     }
//   };

//   const fetchSubjects = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/subjects");
//       if (response.data.subjects) {
//         setAllSubjects(response.data.subjects);
//       }
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       setError("Failed to fetch subjects");
//     }
//   };

//   // Calculate total login count from current data
//   const calculateTotalLoginCount = (dataSet) => {
//     const loginCount = dataSet.filter((item) => 
//       item.loginTime && 
//       item.loginTime !== "invalid date" && 
//       item.loginTime !== "0" &&
//       isValidData(item.loginTime)
//     ).length;
//     setTotal_login_count(loginCount);
//   };

//   // FIXED: Updated fetchData function with corrected URL construction
//   const fetchData = async (preserveFilters = false) => {
//     setLoading(true);
//     setError("");

//     const filters = preserveFilters
//       ? currentFilters
//       : {
//           subject,
//           loginStatus,
//           batchNo,
//           exam_type,
//           departmentId,
//           batchDate
//         };

//     try {
//       // FIXED: Always use the student tracking endpoint with proper batch handling
//       let url = "http://localhost:3000/track-students-on-exam-center-code/";
      
//       // If batchNo is selected, use it; otherwise, use "all" to get all batches
//       if (filters.batchNo && filters.batchNo.trim() !== "") {
//         url += filters.batchNo;
//       } else {
//         url += "all";
//       }

//       const params = new URLSearchParams();
//       if (filters.subject) params.append("subject_name", filters.subject);
//       if (filters.loginStatus) params.append("loginStatus", filters.loginStatus);
//       if (filters.exam_type) params.append("exam_type", filters.exam_type);
//       if (filters.departmentId) params.append("departmentId", filters.departmentId);
      
//       if (filters.batchDate) {
//         const dateParts = filters.batchDate.split("-");
//         const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
//         params.append("batchDate", formattedDate);
//       }

//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       console.log("Fetching data from URL:", url);
//       console.log("Filters being applied:", filters);

//       const response = await axios.post(url, { withCredentials: true });
//       console.log("Response data length:", response.data.length);

//       setData(response.data);
//       setTotalPages(Math.ceil(response.data.length / (rowsPerPage === "all" ? response.data.length : rowsPerPage)));
      
//       calculateTotalLoginCount(response.data);

//       if (!preserveFilters) {
//         setCurrentFilters(filters);
//       }

//     } catch (error) {
//       console.error("Error fetching data:", error);
//       if (error.response && error.response.status === 404) {
//         setError(
//           "No students found for the selected filter criteria. Please try different filters."
//         );
//         setData([]);
//         setTotal_login_count(0);
//       } else {
//         setError("Failed to fetch data. Please try again.");
//       }
//     }
//     setLoading(false);
//   };

//   // Refresh function that preserves filters
//   const refreshData = useCallback(() => {
//     console.log("Refreshing data with current filters:", currentFilters);
//     fetchData(true);
//   }, [currentFilters]);

//   // Filter change handlers
//   const handleFilterChange = (filterName, value) => {
//     console.log(`Filter changed: ${filterName} = ${value}`);

//     // Update individual state immediately
//     switch (filterName) {
//       case "batchNo":
//         setBatchNo(value);
//         break;
//       case "subject":
//         setSubject(value);
//         break;
//       case "loginStatus":
//         setLoginStatus(value);
//         break;
//       case "exam_type":
//         setExam_type(value);
//         break;
//       case "batchDate":
//         setBatchDate(value);
//         break;
//       case "departmentId":
//         setDepartmentId(value);
//         break;
//     }

//     setCurrentPage(1);

//     const newFilters = { 
//       subject: filterName === "subject" ? value : subject,
//       loginStatus: filterName === "loginStatus" ? value : loginStatus,
//       batchNo: filterName === "batchNo" ? value : batchNo,
//       exam_type: filterName === "exam_type" ? value : exam_type,
//       departmentId: filterName === "departmentId" ? value : departmentId,
//       batchDate: filterName === "batchDate" ? value : batchDate,
//     };
    
//     setCurrentFilters(newFilters);

//     setTimeout(() => {
//       fetchDataWithFilters(newFilters);
//     }, 300);
//   };

//   // FIXED: Separate function to fetch data with specific filters
//   const fetchDataWithFilters = async (filters) => {
//     setLoading(true);
//     setError("");

//     try {
//       // FIXED: Use the same URL construction logic as fetchData
//       let url = "http://localhost:3000/track-students-on-exam-center-code/";
      
//       // If batchNo is selected, use it; otherwise, use "all"
//       if (filters.batchNo && filters.batchNo.trim() !== "") {
//         url += filters.batchNo;
//       } else {
//         url += "all";
//       }

//       const params = new URLSearchParams();
//       if (filters.subject) params.append("subject_name", filters.subject);
//       if (filters.loginStatus) params.append("loginStatus", filters.loginStatus);
//       if (filters.exam_type) params.append("exam_type", filters.exam_type);
//       if (filters.departmentId) params.append("departmentId", filters.departmentId);
      
//       if (filters.batchDate) {
//         const dateParts = filters.batchDate.split("-");
//         const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
//         params.append("batchDate", formattedDate);
//       }

//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       console.log("Fetching filtered data from URL:", url);

//       const response = await axios.post(url, { withCredentials: true });
//       console.log("Filtered response data length:", response.data.length);

//       setData(response.data);
//       setTotalPages(Math.ceil(response.data.length / (rowsPerPage === "all" ? response.data.length : rowsPerPage)));
      
//       calculateTotalLoginCount(response.data);

//     } catch (error) {
//       console.error("Error fetching filtered data:", error);
//       if (error.response && error.response.status === 404) {
//         setError(
//           "No students found for the selected filter criteria. Please try different filters."
//         );
//         setData([]);
//         setTotal_login_count(0);
//       } else {
//         setError("Failed to fetch data. Please try again.");
//       }
//     }
//     setLoading(false);
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     setBatchNo("");
//     setSubject("");
//     setLoginStatus("");
//     setExam_type("");
//     setBatchDate("");
//     setDepartmentId("");
//     setCurrentFilters({});
//     setCurrentPage(1);

//     setTimeout(() => {
//       fetchData(false);
//     }, 100);
//   };

//   useEffect(() => {
//     fetchSubjects();
//     fetchFilterOptions();
//     setTimeout(() => {
//       fetchData(false);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       refreshData();
//     }, updateInterval);
//     return () => clearInterval(interval);
//   }, [updateInterval, refreshData]);

//   useEffect(() => {
//     const actualRowsPerPage = rowsPerPage === "all" ? data.length : parseInt(rowsPerPage);
//     setTotalPages(Math.ceil(data.length / actualRowsPerPage));
//     setCurrentPage(1);
//   }, [data, rowsPerPage]);

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       data.map((item) => ({
//         "Batch Number": item.batchNo,
//         "Center": item.center,
//         "Department": item.departmentId,
//         "Seat No": item.student_id,
//         "Student Name": item.fullname,
//         "Subject": item.subject_name,
//         "Batch Date": formatDateForDisplay(item.batchdate),
//         Login: formatDate(item.loginTime),
//         Trial: formatDate(item.trial_time),
//         "Audio Track A": formatDate(item.audio1_time),
//         "Passage A": formatDate(item.passage1_time),
//         "Trial Typing": formatDate(item.trial_passage_time),
//         "Typing Passage": formatDate(item.typing_passage_time),
//         Feedback: formatDate(item.feedback_time),
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
//     XLSX.writeFile(
//       workbook,
//       `student_data_${new Date().toISOString().split("T")[0]}.xlsx`
//     );
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleRowsPerPageChange = (event) => {
//     const newRowsPerPage = event.target.value;
//     setRowsPerPage(newRowsPerPage);
//     setCurrentPage(1);
//   };

//   const getPaginatedData = () => {
//     if (rowsPerPage === "all") {
//       return data;
//     }
//     const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
//     const endIndex = startIndex + parseInt(rowsPerPage);
//     return data.slice(startIndex, endIndex);
//   };

//   const renderPaginationButtons = () => {
//     if (rowsPerPage === "all" || data.length <= parseInt(rowsPerPage)) {
//       return null;
//     }

//     const totalPagesCount = Math.ceil(data.length / parseInt(rowsPerPage));
//     const pageNumbers = [];
    
//     if (totalPagesCount <= 5) {
//       for (let i = 1; i <= totalPagesCount; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 5; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push("...");
//         pageNumbers.push(totalPagesCount);
//       } else if (currentPage >= totalPagesCount - 2) {
//         pageNumbers.push(1);
//         pageNumbers.push("...");
//         for (let i = totalPagesCount - 4; i <= totalPagesCount; i++) {
//           pageNumbers.push(i);
//         }
//       } else {
//         pageNumbers.push(1);
//         pageNumbers.push("...");
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push("...");
//         pageNumbers.push(totalPagesCount);
//       }
//     }

//     return (
//       <div className="pagination-container" style={{ marginTop: "20px" }}>
//         {pageNumbers.map((page, index) => (
//           <button
//             key={index}
//             onClick={() => page !== "..." && handlePageChange(page)}
//             className={`btn ${
//               currentPage === page ? "btn-primary" : "btn-secondary"
//             } me-1`}
//             disabled={page === "..."}
//             style={{ margin: "0 2px" }}
//           >
//             {page}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <NavBar />
//       <div className="home-container">
//         <div className="container-fluid">
//           <div className="row mb-3">
//             <div className="col-md-3 col-sm-6 mb-2">
//               <label htmlFor="batchNo" className="form-label">
//                 Batch Number:
//               </label>
//               <select
//                 className="form-select scrollable-dropdown"
//                 id="batchNo"
//                 value={batchNo}
//                 onChange={(e) => handleFilterChange("batchNo", e.target.value)}
//               >
//                 <option value="">All Batches</option>
//                 {batches.map((batch, index) => (
//                   <option key={index} value={batch}>
//                     {batch}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 col-sm-6 mb-2">
//               <label htmlFor="subject" className="form-label">
//                 Subject:
//               </label>
//               <select
//                 className="form-select scrollable-dropdown"
//                 id="subject"
//                 value={subject}
//                 onChange={(e) => handleFilterChange("subject", e.target.value)}
//               >
//                 <option value="">All Subjects</option>
//                 {allSubjects.map((subj) => (
//                   <option key={subj.subjectId} value={subj.subject_name}>
//                     {subj.subject_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 col-sm-6 mb-2">
//               <label htmlFor="loginStatus" className="form-label">
//                 Login Status:
//               </label>
//               <select
//                 className="form-select"
//                 id="loginStatus"
//                 value={loginStatus}
//                 onChange={(e) =>
//                   handleFilterChange("loginStatus", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="loggedin">Logged In</option>
//                 <option value="loggedout">Logged Out</option>
//               </select>
//             </div>
//             <div className="col-md-3 col-sm-6 mb-2">
//               <label htmlFor="examStatus" className="form-label">
//                 Exam Status:
//               </label>
//               <select
//                 className="form-select"
//                 id="examStatus"
//                 value={exam_type}
//                 onChange={(e) =>
//                   handleFilterChange("exam_type", e.target.value)
//                 }
//               >
                
//                 <option value="shorthand">Short Hand</option>
//                 <option value="typewriting">Type Writing</option>
//                 <option value="both">Both</option>
//               </select>
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col-md-3 col-sm-6 mb-2">
//               <label htmlFor="batchDate" className="form-label">
//                 Batch Date:
//               </label>
//               <select
//                 className="form-select"
//                 id="batchDate"
//                 value={batchDate}
//                 onChange={(e) =>
//                   handleFilterChange("batchDate", e.target.value)
//                 }
//               >
//                 <option value="">All Dates</option>
//                 {batchDates.map((date, index) => (
//                   <option key={index} value={date}>
//                     {formatDateForDisplay(date)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 col-sm-6 mb-2">
//               <label htmlFor="department" className="form-label">
//                 Department:
//               </label>
//               <select
//                 className="form-select scrollable-dropdown"
//                 id="department"
//                 value={departmentId}
//                 onChange={(e) =>
//                   handleFilterChange("departmentId", e.target.value)
//                 }
//               >
//                 <option value="">All Departments</option>
//                 {departments.map((departmentOption, index) => (
//                   <option key={index} value={departmentOption}>
//                     {departmentOption}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 col-sm-6 mb-2">
//               <label htmlFor="rowsPerPage" className="form-label">
//                 Rows per page:
//               </label>
//               <select
//                 className="form-select"
//                 id="rowsPerPage"
//                 value={rowsPerPage}
//                 onChange={handleRowsPerPageChange}
//               >
//                 <option value="5">5</option>
//                 <option value="10">10</option>
//                 <option value="25">25</option>
//                 <option value="50">50</option>
//                 <option value="100">100</option>
//                 <option value="all">All</option>
//               </select>
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col-md-12 col-sm-12 mb-2 d-flex align-items-center flex-wrap">
//               <button
//                 onClick={exportToExcel}
//                 className="btn btn-primary me-3 mb-2"
//               >
//                 Export to Excel
//               </button>
//               <button
//                 onClick={() => refreshData()}
//                 className="btn btn-secondary me-3 mb-2"
//               >
//                 Refresh Now
//               </button>
//               <button
//                 onClick={clearAllFilters}
//                 className="btn btn-outline-secondary me-3 mb-2"
//               >
//                 Clear All Filters
//               </button>
//               <div className="ms-3 mb-2">
//                 <span className="fw-bold">
//                   Total students: {data.length} |{" "}
//                 </span>
//                 <span className="fw-bold">
//                   Total logged in:{" "}
//                 </span>
//                 <span className="badge bg-success">{total_login_count}</span>
//               </div>
//             </div>
//           </div>
//           {loading ? (
//             <div className="text-center p-4">
//               <div className="spinner-border" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2">Loading data...</p>
//             </div>
//           ) : error ? (
//             <div className="alert alert-warning" role="alert">
//               {error}
//             </div>
//           ) : data.length > 0 ? (
//             <>
//               <div className="table-container">
//                 <table className="table table-bordered table-striped table-hover">
//                   <thead>
//                     <tr>
//                       <th style={{ width: "8%" }}>Batch No</th>
//                       <th style={{ width: "8%" }}>Center</th>
//                       <th style={{ width: "8%" }}>Department</th>
//                       <th style={{ width: "12%" }}>Seat No</th>
//                       <th>Login</th>
//                       {exam_type !== "typewriting" && <th>Trial</th>}
//                       {exam_type !== "typewriting" && (
//                         <>
//                           <th>Audio Track A</th>
//                           <th>Passage A</th>
//                         </>
//                       )}
//                       {exam_type !== "shorthand" && (
//                         <>
//                           <th>Trial Typing</th>
//                           <th>Typing Test</th>
//                         </>
//                       )}
//                       <th>Feedback</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {getPaginatedData().map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.batchNo}</td>
//                         <td>{item.center}</td>
//                         <td>{item.departmentId}</td>
//                         <td>{item.student_id}</td>
//                         <td className={getCellClass(item, "loginTime", exam_type)}>
//                           {formatDate(item.loginTime)}
//                         </td>
//                         {exam_type !== "typewriting" && (
//                           <td
//                             className={getCellClass(item, "trial_time", exam_type)}
//                           >
//                             {formatDate(item.trial_time)}
//                           </td>
//                         )}
//                         {exam_type !== "typewriting" && (
//                           <>
//                             <td
//                               className={getCellClass(
//                                 item,
//                                 "audio1_time",
//                                 exam_type
//                               )}
//                             >
//                               {formatDate(item.audio1_time)}
//                             </td>
//                             <td
//                               className={getCellClass(
//                                 item,
//                                 "passage1_time",
//                                 exam_type
//                               )}
//                             >
//                               {formatDate(item.passage1_time)}
//                             </td>
//                           </>
//                         )}
//                         {exam_type !== "shorthand" && (
//                           <>
//                             <td
//                               className={getCellClass(
//                                 item,
//                                 "trial_passage_time",
//                                 exam_type
//                               )}
//                             >
//                               {formatDate(item.trial_passage_time)}
//                             </td>
//                             <td
//                               className={getCellClass(
//                                 item,
//                                 "typing_passage_time",
//                                 exam_type
//                               )}
//                             >
//                               {formatDate(item.typing_passage_time)}
//                             </td>
//                           </>
//                         )}
//                         <td
//                           className={getCellClass(item, "feedback_time", exam_type)}
//                         >
//                           {formatDate(item.feedback_time)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               {renderPaginationButtons()}
//             </>
//           ) : (
//             <div className="text-center p-4">
//               <p>
//                 No records found for the selected criteria. Try adjusting your
//                 filters.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentTable;







import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NavBar from "../navBar/navBar";
import * as XLSX from "xlsx";
import moment from "moment-timezone";

// Material-UI v4 imports
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  LinearProgress,
  Divider,
  Box,
} from "@material-ui/core";

import {
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assessment as AnalyticsIcon,
} from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

// Custom styles
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  headerCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },
  filterCard: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  tableCard: {
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  tableContainer: {
    maxHeight: "70vh",
    borderRadius: theme.spacing(2),
  },
  tableHeader: {
    backgroundColor: "#667eea",
    color: "white",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  actionButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(3),
    textTransform: "none",
    fontWeight: 600,
    padding: theme.spacing(1, 3),
  },
  exportButton: {
    background: "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #45a049 30%, #4CAF50 90%)",
    },
  },
  refreshButton: {
    background: "linear-gradient(45deg, #2196F3 30%, #1976D2 90%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
    },
  },
  clearButton: {
    background: "linear-gradient(45deg, #FF9800 30%, #F57C00 90%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #F57C00 30%, #FF9800 90%)",
    },
  },
  cellGreen: {
    backgroundColor: "#4CAF50 !important",
    color: "white !important",
    fontWeight: 500,
  },
  cellRed: {
    backgroundColor: "#f44336 !important",
    color: "white !important",
    fontWeight: 500,
  },
  cellYellow: {
    backgroundColor: "#FF9800 !important",
    color: "black !important",
    fontWeight: 500,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    backgroundColor: "white",
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  analyticsCard: {
    height: "100%",
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  iconWrapper: {
    padding: theme.spacing(2),
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(2),
  },
  successIcon: {
    backgroundColor: "#e8f5e8",
    color: "#4CAF50",
  },
  warningIcon: {
    backgroundColor: "#fff3e0",
    color: "#FF9800",
  },
  infoIcon: {
    backgroundColor: "#e3f2fd",
    color: "#2196F3",
  },
  filterFormControl: {
    minWidth: 200,
    marginBottom: theme.spacing(1),
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
  },
  noDataContainer: {
    textAlign: "center",
    padding: theme.spacing(6),
    backgroundColor: "white",
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
}));

// Helper functions (kept as is)
const isValidData = (value) => {
  if (
    !value ||
    value === "invalid date" ||
    value === "0" ||
    value === "" ||
    value === null ||
    value === undefined
  ) {
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

const getCellClass = (item, field, exam_type, classes) => {
  let stages;
  if (exam_type === "shorthand") {
    stages = ["loginTime", "trial_time", "audio1_time", "passage1_time", "feedback_time"];
  } else if (exam_type === "typewriting") {
    stages = ["loginTime", "trial_passage_time", "typing_passage_time", "feedback_time"];
  } else {
    stages = ["loginTime", "trial_time", "audio1_time", "passage1_time", "feedback_time"];
  }
  const currentStageIndex = stages.indexOf(field);

  if (currentStageIndex === -1) return "";

  if (field === "loginTime") {
    return isValidData(item[field]) ? classes.cellGreen : classes.cellRed;
  }

  if (field === "feedback_time") {
    return isValidData(item[field]) ? classes.cellGreen : classes.cellRed;
  }

  if (isValidData(item[field])) {
    if (
      currentStageIndex === stages.length - 1 ||
      isValidData(item[stages[currentStageIndex + 1]])
    ) {
      return classes.cellGreen;
    } else if (currentStageIndex > 0 && currentStageIndex < stages.length - 1) {
      const prevCellGreen = isValidData(item[stages[currentStageIndex - 1]]);
      const nextCellRed = !isValidData(item[stages[currentStageIndex + 1]]);
      if (prevCellGreen && nextCellRed) {
        return classes.cellYellow;
      } else {
        return classes.cellGreen;
      }
    } else {
      return classes.cellGreen;
    }
  } else if (currentStageIndex > 0 && isValidData(item[stages[currentStageIndex - 1]])) {
    return classes.cellRed;
  } else {
    return classes.cellRed;
  }
};

const StudentTable = () => {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateInterval, setUpdateInterval] = useState(100000);
  const [batches, setBatches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [batchDates, setBatchDates] = useState([]);

  // New combined filters state
  const [filters, setFilters] = useState({
    batchNo: "",
    subject: "",
    loginStatus: "",
    exam_type: "shorthand",
    batchDate: "",
    departmentId: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
      return "";
    }
    const dateStr = String(dateString);
    const dateTimeMatch = dateStr.match(
      /(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):?(\d{2})?/
    );
    if (dateTimeMatch) {
      const [, year, month, day, hours, minutes] = dateTimeMatch;
      const formattedDate = `${day}/${month}/${year}`;
      let hour = parseInt(hours, 10);
      const minute = minutes;
      const ampm = hour >= 12 ? "PM" : "AM";
      if (hour === 0) {
        hour = 12;
      } else if (hour > 12) {
        hour = hour - 12;
      }
      const formattedTime = `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
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
      const datePart = dateStr.split("T")[0] || dateStr.split(" ")[0];
      const [year, month, day] = datePart.split("-");
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const normalizeDateForFilter = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
      return null;
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      return null;
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/super-admin-student-track-dashboard",
        {},
        { withCredentials: true }
      );
      if (response.data && response.data.length > 0) {
        const uniqueBatches = [
          ...new Set(
            response.data
              .map((item) => item.batchNo)
              .filter(
                (batch) => batch && batch !== "" && batch !== null && batch !== undefined
              )
          ),
        ].sort();
        setBatches(uniqueBatches);

        const uniqueDepartments = [
          ...new Set(
            response.data
              .map((item) => item.departmentId)
              .filter(
                (dept) => dept && dept !== "" && dept !== null && dept !== undefined
              )
          ),
        ].sort();
        setDepartments(uniqueDepartments);

        const uniqueSubjects = [
          ...new Set(
            response.data
              .map((item) => item.subject_name)
              .filter(
                (subject) =>
                  subject && subject !== "" && subject !== null && subject !== undefined
              )
          ),
        ];
        setAllSubjects(uniqueSubjects);

        const uniqueBatchDates = [
          ...new Set(
            response.data
              .filter(
                (item) =>
                  item.batchdate &&
                  item.batchdate !== "invalid date" &&
                  item.batchdate !== "0"
              )
              .map((item) => normalizeDateForFilter(item.batchdate))
              .filter((date) => date !== null)
          ),
        ].sort().reverse();
        setBatchDates(uniqueBatchDates);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
      // Fallback to a local API if needed, or handle error
    }
  };

  // The main data fetching function, now with `filters` as a parameter
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let url = `http://localhost:3000/track-students-on-exam-center-code/${filters.batchNo || "all"}`;

      const params = new URLSearchParams();
      if (filters.subject) params.append("subject_name", filters.subject);
      if (filters.loginStatus) params.append("loginStatus", filters.loginStatus);
      if (filters.exam_type) params.append("exam_type", filters.exam_type);
      if (filters.departmentId) params.append("departmentId", filters.departmentId);
      if (filters.batchDate) {
        const dateParts = filters.batchDate.split("-");
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        params.append("batchDate", formattedDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log("Fetching data from URL:", url);

      const response = await axios.post(url, { withCredentials: true });
      setData(response.data);
      setTotalPages(
        Math.ceil(
          response.data.length / (rowsPerPage === "all" ? response.data.length : rowsPerPage)
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 404) {
        setError("No students found for the selected filter criteria.");
        setData([]);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    }
    setLoading(false);
  }, [filters, rowsPerPage]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      batchNo: "",
      subject: "",
      loginStatus: "",
      exam_type: "shorthand",
      batchDate: "",
      departmentId: "",
    });
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "Batch Number": item.batchNo,
        Center: item.center,
        Department: item.departmentId,
        "Seat No": item.student_id,
        "Student Name": item.fullname,
        Subject: item.subject_name,
        "Batch Date": formatDateForDisplay(item.batchdate),
        Login: formatDate(item.loginTime),
        Trial: formatDate(item.trial_time),
        "Audio Track A": formatDate(item.audio1_time),
        "Passage A": formatDate(item.passage1_time),
        "Trial Typing": formatDate(item.trial_passage_time),
        "Typing Test": formatDate(item.typing_passage_time),
        Feedback: formatDate(item.feedback_time),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
    XLSX.writeFile(
      workbook,
      `student_data_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = event.target.value;
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const getPaginatedData = () => {
    if (rowsPerPage === "all") {
      return data;
    }
    const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
    const endIndex = startIndex + parseInt(rowsPerPage);
    return data.slice(startIndex, endIndex);
  };

  const renderPaginationButtons = () => {
    if (rowsPerPage === "all" || data.length <= parseInt(rowsPerPage)) {
      return null;
    }
    const totalPagesCount = Math.ceil(data.length / parseInt(rowsPerPage));
    const pageNumbers = [];
    if (totalPagesCount <= 5) {
      for (let i = 1; i <= totalPagesCount; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPagesCount);
      } else if (currentPage >= totalPagesCount - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPagesCount - 4; i <= totalPagesCount; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPagesCount);
      }
    }

    return (
      <div className={classes.paginationContainer}>
        {pageNumbers.map((page, index) => (
          <Button
            key={index}
            onClick={() => page !== "..." && handlePageChange(page)}
            variant={currentPage === page ? "contained" : "outlined"}
            color="primary"
            disabled={page === "..."}
            style={{ margin: "0 2px" }}
          >
            {page}
          </Button>
        ))}
      </div>
    );
  };

  const getAnalyticsData = () => {
    const totalStudents = data.length;
    const loggedInStudents = data.filter((item) => isValidData(item.loginTime)).length;
    const completedExams = data.filter((item) => isValidData(item.feedback_time)).length;
    const inProgressExams = data.filter(
      (item) => isValidData(item.loginTime) && !isValidData(item.feedback_time)
    ).length;
    return {
      totalStudents,
      loggedInStudents,
      completedExams,
      inProgressExams,
      completionRate: totalStudents > 0 ? Math.round((completedExams / totalStudents) * 100) : 0,
      loginRate: totalStudents > 0 ? Math.round((loggedInStudents / totalStudents) * 100) : 0,
    };
  };

  const analytics = getAnalyticsData();

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Use a combined useEffect to fetch data when filters or rowsPerPage change
  useEffect(() => {
    fetchData();
  }, [filters, fetchData, rowsPerPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, fetchData]);

  return (
    <div className={classes.root}>
      <NavBar />
      <Container maxWidth="xl">
        <Card className={classes.headerCard}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <AnalyticsIcon style={{ fontSize: 40, marginRight: 16 }} />
                <Box>
                  <Typography variant="h4" component="h1" style={{ fontWeight: "bold" }}>
                    Student Examination Analytics Dashboard
                  </Typography>
                  <Typography variant="subtitle1" style={{ opacity: 0.9 }}>
                    Real-time monitoring of examination progress
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <ScheduleIcon style={{ marginRight: 8 }} />
                <Typography variant="body2">Auto-refresh: {updateInterval / 1000}s</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.analyticsCard}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box className={`${classes.iconWrapper} ${classes.infoIcon}`}>
                    <PeopleIcon />
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" style={{ fontWeight: "bold" }}>
                      {analytics.totalStudents}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Total Students
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.analyticsCard}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box className={`${classes.iconWrapper} ${classes.successIcon}`}>
                    <CheckCircleIcon />
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" style={{ fontWeight: "bold" }}>
                      {analytics.loggedInStudents}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Logged In ({analytics.loginRate}%)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.analyticsCard}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box className={`${classes.iconWrapper} ${classes.warningIcon}`}>
                    <WarningIcon />
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" style={{ fontWeight: "bold" }}>
                      {analytics.inProgressExams}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      In Progress
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.analyticsCard}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box className={`${classes.iconWrapper} ${classes.successIcon}`}>
                    <AssignmentIcon />
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" style={{ fontWeight: "bold" }}>
                      {analytics.completedExams}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Completed ({analytics.completionRate}%)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card className={classes.filterCard}>
          <CardContent>
            <Box display="flex" alignItems="center" style={{ marginBottom: 16 }}>
              <DashboardIcon style={{ marginRight: 8, color: "#667eea" }} />
              <Typography variant="h6" component="div" style={{ color: "#667eea", fontWeight: 600 }}>
                Filter Controls
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="outlined" fullWidth className={classes.filterFormControl}>
                  <InputLabel>Batch Number</InputLabel>
                  <Select
                    value={filters.batchNo}
                    onChange={(e) => handleFilterChange("batchNo", e.target.value)}
                    label="Batch Number"
                  >
                    <MenuItem value="">All Batches</MenuItem>
                    {batches.map((batch, index) => (
                      <MenuItem key={index} value={batch}>
                        {batch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="outlined" fullWidth className={classes.filterFormControl}>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange("subject", e.target.value)}
                    label="Subject"
                  >
                    <MenuItem value="">All Subjects</MenuItem>
                    {allSubjects.map((subj, index) => (
                      <MenuItem key={index} value={subj}>
                        {subj}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="outlined" fullWidth className={classes.filterFormControl}>
                  <InputLabel>Login Status</InputLabel>
                  <Select
                    value={filters.loginStatus}
                    onChange={(e) => handleFilterChange("loginStatus", e.target.value)}
                    label="Login Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="loggedin">Logged In</MenuItem>
                    <MenuItem value="loggedout">Logged Out</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="outlined" fullWidth className={classes.filterFormControl}>
                  <InputLabel>Exam Type</InputLabel>
                  <Select
                    value={filters.exam_type}
                    onChange={(e) => handleFilterChange("exam_type", e.target.value)}
                    label="Exam Type"
                  >
                    <MenuItem value="shorthand">Short Hand</MenuItem>
                    <MenuItem value="typewriting">Type Writing</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="outlined" fullWidth className={classes.filterFormControl}>
                  <InputLabel>Batch Date</InputLabel>
                  <Select
                    value={filters.batchDate}
                    onChange={(e) => handleFilterChange("batchDate", e.target.value)}
                    label="Batch Date"
                  >
                    <MenuItem value="">All Dates</MenuItem>
                    {batchDates.map((date, index) => (
                      <MenuItem key={index} value={date}>
                        {formatDateForDisplay(date)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="outlined" fullWidth className={classes.filterFormControl}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.departmentId}
                    onChange={(e) => handleFilterChange("departmentId", e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept, index) => (
                      <MenuItem key={index} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="outlined" fullWidth className={classes.filterFormControl}>
                  <InputLabel>Rows per page</InputLabel>
                  <Select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    label="Rows per page"
                  >
                    <MenuItem value="5">5</MenuItem>
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider style={{ margin: "20px 0" }} />

            <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between">
              <Box display="flex" flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<ExportIcon />}
                  onClick={exportToExcel}
                  className={`${classes.actionButton} ${classes.exportButton}`}
                >
                  Export to Excel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={fetchData} // Call the main fetchData function
                  className={`${classes.actionButton} ${classes.refreshButton}`}
                >
                  Refresh Now
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ClearIcon />}
                  onClick={clearAllFilters}
                  className={`${classes.actionButton} ${classes.clearButton}`}
                >
                  Clear All Filters
                </Button>
              </Box>
              <Box display="flex" alignItems="center" flexWrap="wrap">
                <Chip
                  icon={<PeopleIcon />}
                  label={`Total: ${data.length}`}
                  color="primary"
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Logged In: ${analytics.loggedInStudents}`}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    marginBottom: 8,
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {loading && (
          <Box className={classes.loadingContainer}>
            <CircularProgress size={60} style={{ color: "#667eea", marginBottom: 16 }} />
            <Typography variant="h6" color="textSecondary">
              Loading student data...
            </Typography>
            <LinearProgress
              style={{ width: "100%", marginTop: 16, borderRadius: 4 }}
              color="primary"
            />
          </Box>
        )}

        {error && !loading && (
          <Paper
            style={{
              padding: 16,
              marginBottom: 24,
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
            }}
          >
            <Typography color="textSecondary">⚠️ {error}</Typography>
          </Paper>
        )}

        {!loading && !error && data.length > 0 && (
          <Card className={classes.tableCard}>
            <TableContainer className={classes.tableContainer}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader}>Batch No</TableCell>
                    <TableCell className={classes.tableHeader}>Center</TableCell>
                    <TableCell className={classes.tableHeader}>Department</TableCell>
                    <TableCell className={classes.tableHeader}>Seat No</TableCell>
                    <TableCell className={classes.tableHeader}>Login</TableCell>
                    {filters.exam_type !== "typewriting" && (
                      <TableCell className={classes.tableHeader}>Trial</TableCell>
                    )}
                    {filters.exam_type !== "typewriting" && (
                      <>
                        <TableCell className={classes.tableHeader}>Audio Track A</TableCell>
                        <TableCell className={classes.tableHeader}>Passage A</TableCell>
                      </>
                    )}
                    {filters.exam_type !== "shorthand" && (
                      <>
                        <TableCell className={classes.tableHeader}>Trial Typing</TableCell>
                        <TableCell className={classes.tableHeader}>Typing Test</TableCell>
                      </>
                    )}
                    <TableCell className={classes.tableHeader}>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.batchNo}</TableCell>
                      <TableCell>{item.center}</TableCell>
                      <TableCell>{item.departmentId}</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>{item.student_id}</TableCell>
                      <TableCell className={getCellClass(item, "loginTime", filters.exam_type, classes)}>
                        {formatDate(item.loginTime)}
                      </TableCell>
                      {filters.exam_type !== "typewriting" && (
                        <TableCell className={getCellClass(item, "trial_time", filters.exam_type, classes)}>
                          {formatDate(item.trial_time)}
                        </TableCell>
                      )}
                      {filters.exam_type !== "typewriting" && (
                        <>
                          <TableCell className={getCellClass(item, "audio1_time", filters.exam_type, classes)}>
                            {formatDate(item.audio1_time)}
                          </TableCell>
                          <TableCell className={getCellClass(item, "passage1_time", filters.exam_type, classes)}>
                            {formatDate(item.passage1_time)}
                          </TableCell>
                        </>
                      )}
                      {filters.exam_type !== "shorthand" && (
                        <>
                          <TableCell className={getCellClass(item, "trial_passage_time", filters.exam_type, classes)}>
                            {formatDate(item.trial_passage_time)}
                          </TableCell>
                          <TableCell className={getCellClass(item, "typing_passage_time", filters.exam_type, classes)}>
                            {formatDate(item.typing_passage_time)}
                          </TableCell>
                        </>
                      )}
                      <TableCell className={getCellClass(item, "feedback_time", filters.exam_type, classes)}>
                        {formatDate(item.feedback_time)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {renderPaginationButtons()}
          </Card>
        )}
        {!loading && !error && data.length === 0 && (
          <Box className={classes.noDataContainer}>
            <SchoolIcon style={{ fontSize: 80, color: "#ccc", marginBottom: 16 }} />
            <Typography variant="h5" color="textSecondary" style={{ marginBottom: 8 }}>
              No Records Found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              No students found for the selected criteria. Try adjusting your filters.
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default StudentTable;