// // // // // import React, { useState, useEffect } from "react";
// // // // // import axios from "axios";
// // // // // import "./SuperAdminStudentCount.css";
// // // // // import SuperAdminNavbar from "./SuperAdminNavbar";
// // // // // import moment from "moment-timezone";

// // // // // const SuperAdminCount = () => {
// // // // //   const [batchNo, setBatchNo] = useState("");
// // // // //   const [batches, setBatches] = useState([]);
// // // // //   const [center, setCenter] = useState("");
// // // // //   const [centers, setCenters] = useState([]);
// // // // //   const [allData, setAllData] = useState([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [error, setError] = useState("");
// // // // //   const [departmentId, setDepartmentId] = useState("");
// // // // //   const [departments, setDepartments] = useState([]);
// // // // //   const [aggregatedSubjects, setAggregatedSubjects] = useState([]);
// // // // //   const [batchTotals, setBatchTotals] = useState({});

// // // // //   useEffect(() => {
// // // // //     fetchData();
// // // // //   }, []); // Only fetch initial filter options once

// // // // //   useEffect(() => {
// // // // //     fetchAllData();

// // // // //     // Set interval for fetching data every 30 seconds
// // // // //     const intervalId = setInterval(() => {
// // // // //       fetchAllData();
// // // // //     }, 30000);

// // // // //     return () => clearInterval(intervalId);
// // // // //   }, [batchNo, center, departmentId]); // Fetch data when filters change

// // // // //   useEffect(() => {
// // // // //     // Only aggregate when allData changes
// // // // //     if (allData.length > 0) {
// // // // //       aggregateSubjects();
// // // // //       calculateBatchTotals();
// // // // //     } else {
// // // // //       // Clear aggregations when no data
// // // // //       setAggregatedSubjects([]);
// // // // //       setBatchTotals({});
// // // // //     }
// // // // //   }, [allData]); // Only depend on allData

// // // // //   const fetchData = async () => {
// // // // //     setLoading(true);
// // // // //     setError("");
// // // // //     try {
// // // // //       let url = "http://localhost:3000/super-admin-student-track-dashboard";

// // // // //       const response = await axios.post(url, { withCredentials: true });
// // // // //       const distinctBatches = [
// // // // //         ...new Set(response.data.map((item) => item.batchNo)),
// // // // //       ];
// // // // //       setBatches(distinctBatches.sort());

// // // // //       const distinctCenters = [
// // // // //         ...new Set(response.data.map((item) => item.center)),
// // // // //       ];
// // // // //       setCenters(distinctCenters.sort());

// // // // //       const distinctDepartments = [
// // // // //         ...new Set(response.data.map((item) => item.departmentId)),
// // // // //       ];
// // // // //       setDepartments(distinctDepartments.sort());
// // // // //     } catch (error) {
// // // // //       console.error("Error fetching data:", error);
// // // // //       setError(
// // // // //         "No students found for provided filter parameters. Please check the parameters!"
// // // // //       );
// // // // //     }
// // // // //     setLoading(false);
// // // // //   };

// // // // //   const fetchAllData = async () => {
// // // // //     setLoading(true);
// // // // //     setError("");
// // // // //     try {
// // // // //       let url = `http://localhost:3000/get-super-admin-student-count`;
// // // // //       const params = new URLSearchParams();

// // // // //       if (batchNo) params.append("batchNo", batchNo);
// // // // //       if (center) params.append("center", center);
// // // // //       if (departmentId) params.append("departmentId", departmentId);

// // // // //       if (params.toString()) {
// // // // //         url += `?${params.toString()}`;
// // // // //       }

// // // // //       // ADD THIS DEBUG CODE
// // // // //       console.log("=== FILTER DEBUG ===");
// // // // //       console.log("Frontend filter values:");
// // // // //       console.log("- batchNo:", batchNo);
// // // // //       console.log("- center:", center);
// // // // //       console.log("- departmentId:", departmentId);
// // // // //       console.log("URL being sent to backend:", url);
// // // // //       console.log("URLSearchParams:", params.toString());
// // // // //       console.log("==================");

// // // // //       const response = await axios.get(url, { withCredentials: true });

// // // // //       // ADD THIS TO CHECK WHAT BACKEND RECEIVED
// // // // //       console.log("=== BACKEND RESPONSE DEBUG ===");
// // // // //       console.log("Response status:", response.status);
// // // // //       console.log("Response data length:", response.data?.results?.length || 0);
// // // // //       if (response.data?.results?.length > 0) {
// // // // //         console.log("First item from response:", response.data.results[0]);
// // // // //         console.log("All unique batchNo values in response:", [
// // // // //           ...new Set(response.data.results.map((item) => item.batchNo)),
// // // // //         ]);
// // // // //         console.log("All unique center values in response:", [
// // // // //           ...new Set(response.data.results.map((item) => item.center)),
// // // // //         ]);
// // // // //         console.log("All unique departmentId values in response:", [
// // // // //           ...new Set(response.data.results.map((item) => item.departmentId)),
// // // // //         ]);
// // // // //       }
// // // // //       console.log("============================");

// // // // //       if (
// // // // //         response.data &&
// // // // //         response.data.results &&
// // // // //         Array.isArray(response.data.results)
// // // // //       ) {
// // // // //         console.log("Fetched data:", response.data.results);
// // // // //         setAllData(response.data.results);
// // // // //       } else {
// // // // //         setError("Received unexpected data format from server");
// // // // //         setAllData([]);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error("Error fetching all data:", error);
// // // // //       setError(error.response?.data?.message || "Failed to fetch all data");
// // // // //       setAllData([]);
// // // // //     }
// // // // //     setLoading(false);
// // // // //   };

// // // // //   const aggregateSubjects = () => {
// // // // //     const subjectMap = new Map();

// // // // //     allData.forEach((item) => {
// // // // //       if (item.subjects && Array.isArray(item.subjects)) {
// // // // //         item.subjects.forEach((subject) => {
// // // // //           const subjectId = subject.id;
// // // // //           if (subjectMap.has(subjectId)) {
// // // // //             const existingSubject = subjectMap.get(subjectId);
// // // // //             existingSubject.count += parseInt(subject.count) || 0;
// // // // //             existingSubject.loggedIn += parseInt(subject.loggedIn) || 0;
// // // // //             existingSubject.completed += parseInt(subject.completed) || 0;
// // // // //           } else {
// // // // //             subjectMap.set(subjectId, {
// // // // //               id: subject.id,
// // // // //               name: subject.name,
// // // // //               count: parseInt(subject.count) || 0,
// // // // //               loggedIn: parseInt(subject.loggedIn) || 0,
// // // // //               completed: parseInt(subject.completed) || 0,
// // // // //             });
// // // // //           }
// // // // //         });
// // // // //       }
// // // // //     });

// // // // //     const aggregated = Array.from(subjectMap.values());
// // // // //     console.log("Aggregated subjects:", aggregated);
// // // // //     setAggregatedSubjects(aggregated);
// // // // //   };

// // // // //   const calculateBatchTotals = () => {
// // // // //     const totals = {};

// // // // //     allData.forEach((item) => {
// // // // //       const batch = item.batchNo;
// // // // //       if (!totals[batch]) {
// // // // //         totals[batch] = {
// // // // //           totalStudents: 0,
// // // // //           loggedInStudents: 0,
// // // // //           completedStudents: 0,
// // // // //         };
// // // // //       }
// // // // //       totals[batch].totalStudents += parseInt(item.total_students) || 0;
// // // // //       totals[batch].loggedInStudents += parseInt(item.logged_in_students) || 0;
// // // // //       totals[batch].completedStudents += parseInt(item.completed_student) || 0;
// // // // //     });

// // // // //     console.log("Batch totals:", totals);
// // // // //     setBatchTotals(totals);
// // // // //   };

// // // // //   const formatDate = (dateString) => {
// // // // //     if (!dateString || dateString === "invalid date" || dateString === "0") {
// // // // //       return "";
// // // // //     }
// // // // //     const date = new Date(dateString);
// // // // //     if (isNaN(date.getTime())) {
// // // // //       return dateString;
// // // // //     }

// // // // //     const day = String(date.getUTCDate()).padStart(2, "0");
// // // // //     const month = String(date.getUTCMonth() + 1).padStart(2, "0");
// // // // //     const year = date.getUTCFullYear();
// // // // //     const hours = String(date.getUTCHours()).padStart(2, "0");
// // // // //     const minutes = String(date.getUTCMinutes()).padStart(2, "0");

// // // // //     return `${day}/${month}/${year} ${hours}:${minutes}`;
// // // // //   };

// // // // //   const calculateTotals = (subjects) => {
// // // // //     return subjects.reduce(
// // // // //       (totals, subject) => {
// // // // //         totals.count += subject.count || 0;
// // // // //         totals.loggedIn += subject.loggedIn || 0;
// // // // //         totals.completed += subject.completed || 0;
// // // // //         return totals;
// // // // //       },
// // // // //       { count: 0, loggedIn: 0, completed: 0 }
// // // // //     );
// // // // //   };

// // // // //   const calculateMainTableTotals = () => {
// // // // //     return allData.reduce(
// // // // //       (totals, item) => {
// // // // //         totals.totalStudents += parseInt(item.total_students) || 0;
// // // // //         totals.loggedInStudents += parseInt(item.logged_in_students) || 0;
// // // // //         totals.completedStudents += parseInt(item.completed_student) || 0;
// // // // //         return totals;
// // // // //       },
// // // // //       { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 }
// // // // //     );
// // // // //   };

// // // // //   const getFilterSuffix = () => {
// // // // //     let suffix = "";
// // // // //     if (batchNo) suffix += ` - Batch ${batchNo}`;
// // // // //     if (center) suffix += ` - Center ${center}`;
// // // // //     if (departmentId) suffix += ` - Department ${departmentId}`;
// // // // //     return suffix;
// // // // //   };

// // // // //   return (
// // // // //     <div className="sac-page">
// // // // //       <SuperAdminNavbar />
// // // // //       <div className="sac-container">
// // // // //         <h2 className="sac-title">Current Student Details</h2>

// // // // //         <div className="sac-filter-container">
// // // // //           <div className="sac-select-wrapper">
// // // // //             <label htmlFor="batchNo" className="sac-label">
// // // // //               Select Batch Number:
// // // // //             </label>
// // // // //             <select
// // // // //               id="batchNo"
// // // // //               className="sac-select"
// // // // //               value={batchNo}
// // // // //               onChange={(e) => setBatchNo(e.target.value)}
// // // // //             >
// // // // //               <option value="">All Batches</option>
// // // // //               {batches.map((batch, index) => (
// // // // //                 <option key={index} value={batch}>
// // // // //                   {batch}
// // // // //                 </option>
// // // // //               ))}
// // // // //             </select>
// // // // //           </div>

// // // // //           <div className="sac-select-wrapper">
// // // // //             <label htmlFor="center" className="sac-label">
// // // // //               Select Center Number:
// // // // //             </label>
// // // // //             <select
// // // // //               id="center"
// // // // //               className="sac-select"
// // // // //               value={center}
// // // // //               onChange={(e) => setCenter(e.target.value)}
// // // // //             >
// // // // //               <option value="">All Centers</option>
// // // // //               {centers.map((center, index) => (
// // // // //                 <option key={index} value={center}>
// // // // //                   {center}
// // // // //                 </option>
// // // // //               ))}
// // // // //             </select>
// // // // //           </div>

// // // // //           <div className="sac-select-wrapper">
// // // // //             <label htmlFor="departmentId" className="sac-label">
// // // // //               Select Department:
// // // // //             </label>
// // // // //             <select
// // // // //               id="departmentId"
// // // // //               className="sac-select"
// // // // //               value={departmentId}
// // // // //               onChange={(e) => setDepartmentId(e.target.value)}
// // // // //             >
// // // // //               <option value="">All Departments</option>
// // // // //               {departments.map((department, index) => (
// // // // //                 <option key={index} value={department}>
// // // // //                   {department}
// // // // //                 </option>
// // // // //               ))}
// // // // //             </select>
// // // // //           </div>
// // // // //         </div>

// // // // //         {loading && <p className="sac-loading">Loading...</p>}
// // // // //         {error && <p className="sac-error">{error}</p>}

// // // // //         {/* Subjects Table */}
// // // // //         {!loading && !error && allData.length > 0 && (
// // // // //           <div className="sac-subjects-section">
// // // // //             <h4 className="sac-subtitle">Subjects{getFilterSuffix()}:</h4>
// // // // //             <div className="sac-table-wrapper">
// // // // //               {aggregatedSubjects.length > 0 ? (
// // // // //                 <table className="sac-table sac-subjects-table">
// // // // //                   <thead>
// // // // //                     <tr>
// // // // //                       <th>Subject ID</th>
// // // // //                       <th>Subject Name</th>
// // // // //                       <th>Count</th>
// // // // //                       <th>Logged In</th>
// // // // //                       <th>Completed</th>
// // // // //                       <th>Pending</th>
// // // // //                       <th>Absent</th>
// // // // //                     </tr>
// // // // //                   </thead>
// // // // //                   <tbody>
// // // // //                     {aggregatedSubjects
// // // // //                       .filter((subject) => subject.count > 0)
// // // // //                       .map((subject, index) => (
// // // // //                         <tr key={subject.id || index}>
// // // // //                           <td>{subject.id}</td>
// // // // //                           <td>{subject.name}</td>
// // // // //                           <td>{subject.count || 0}</td>
// // // // //                           <td>{subject.loggedIn || 0}</td>
// // // // //                           <td>{subject.completed || 0}</td>
// // // // //                           <td>{subject.loggedIn - subject.completed || 0}</td>
// // // // //                           <td>{subject.count - subject.loggedIn || 0}</td>
// // // // //                         </tr>
// // // // //                       ))}
// // // // //                     {(() => {
// // // // //                       const subjects = aggregatedSubjects.filter(
// // // // //                         (subject) => subject.count > 0
// // // // //                       );
// // // // //                       if (subjects.length > 0) {
// // // // //                         const totals = calculateTotals(subjects);
// // // // //                         return (
// // // // //                           <tr className="sac-totals-row">
// // // // //                             <td colSpan="2">
// // // // //                               <strong>Total</strong>
// // // // //                             </td>
// // // // //                             <td>
// // // // //                               <strong>{totals.count}</strong>
// // // // //                             </td>
// // // // //                             <td>
// // // // //                               <strong>{totals.loggedIn}</strong>
// // // // //                             </td>
// // // // //                             <td>
// // // // //                               <strong>{totals.completed}</strong>
// // // // //                             </td>
// // // // //                             <td>
// // // // //                               <strong>
// // // // //                                 {totals.loggedIn - totals.completed}
// // // // //                               </strong>
// // // // //                             </td>
// // // // //                             <td>
// // // // //                               <strong>{totals.count - totals.loggedIn}</strong>
// // // // //                             </td>
// // // // //                           </tr>
// // // // //                         );
// // // // //                       }
// // // // //                       return null;
// // // // //                     })()}
// // // // //                   </tbody>
// // // // //                 </table>
// // // // //               ) : (
// // // // //                 <div>
// // // // //                   <p className="sac-no-data">
// // // // //                     No subjects found for the current filters.
// // // // //                   </p>
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Batch Totals Table */}
// // // // //         {!loading && !error && allData.length > 0 && (
// // // // //           <div className="sac-batch-totals-section">
// // // // //             <h4 className="sac-subtitle">
// // // // //               Batch-wise Totals{getFilterSuffix()}:
// // // // //             </h4>
// // // // //             <div className="sac-table-wrapper">
// // // // //               {Object.keys(batchTotals).length > 0 ? (
// // // // //                 <table className="sac-table sac-batch-totals-table">
// // // // //                   <thead>
// // // // //                     <tr>
// // // // //                       <th>Batch No</th>
// // // // //                       <th>Total Students</th>
// // // // //                       <th>Logged In Students</th>
// // // // //                       <th>Completed Students</th>
// // // // //                       <th>Pending Students</th>
// // // // //                       <th>Absent Students</th>
// // // // //                     </tr>
// // // // //                   </thead>
// // // // //                   <tbody>
// // // // //                     {Object.entries(batchTotals).map(([batch, totals]) => (
// // // // //                       <tr key={batch}>
// // // // //                         <td>{batch}</td>
// // // // //                         <td>{totals.totalStudents || 0}</td>
// // // // //                         <td>{totals.loggedInStudents || 0}</td>
// // // // //                         <td>{totals.completedStudents || 0}</td>
// // // // //                         <td>
// // // // //                           {totals.loggedInStudents - totals.completedStudents ||
// // // // //                             0}
// // // // //                         </td>
// // // // //                         <td>
// // // // //                           {totals.totalStudents - totals.loggedInStudents || 0}
// // // // //                         </td>
// // // // //                       </tr>
// // // // //                     ))}
// // // // //                     {(() => {
// // // // //                       const grandTotals = Object.values(batchTotals).reduce(
// // // // //                         (acc, totals) => {
// // // // //                           acc.totalStudents += totals.totalStudents || 0;
// // // // //                           acc.loggedInStudents += totals.loggedInStudents || 0;
// // // // //                           acc.completedStudents +=
// // // // //                             totals.completedStudents || 0;
// // // // //                           return acc;
// // // // //                         },
// // // // //                         {
// // // // //                           totalStudents: 0,
// // // // //                           loggedInStudents: 0,
// // // // //                           completedStudents: 0,
// // // // //                         }
// // // // //                       );

// // // // //                       return (
// // // // //                         <tr className="sac-totals-row">
// // // // //                           <td>
// // // // //                             <strong>Grand Total</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>{grandTotals.totalStudents}</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>{grandTotals.loggedInStudents}</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>{grandTotals.completedStudents}</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>
// // // // //                               {grandTotals.loggedInStudents -
// // // // //                                 grandTotals.completedStudents}
// // // // //                             </strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>
// // // // //                               {grandTotals.totalStudents -
// // // // //                                 grandTotals.loggedInStudents}
// // // // //                             </strong>
// // // // //                           </td>
// // // // //                         </tr>
// // // // //                       );
// // // // //                     })()}
// // // // //                   </tbody>
// // // // //                 </table>
// // // // //               ) : (
// // // // //                 <p className="sac-no-data">
// // // // //                   No batch totals found for the current filters.
// // // // //                 </p>
// // // // //               )}
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Main Data Table */}
// // // // //         {!loading && !error && allData.length > 0 && (
// // // // //           <div className="sac-data-table">
// // // // //             <h3 className="sac-subtitle">Detailed View{getFilterSuffix()}</h3>
// // // // //             <div className="sac-table-wrapper">
// // // // //               <table className="sac-table">
// // // // //                 <thead>
// // // // //                   <tr>
// // // // //                     <th>Center</th>
// // // // //                     <th>Batch No</th>
// // // // //                     <th>Total Students</th>
// // // // //                     <th>Logged In Students</th>
// // // // //                     <th>Completed Students</th>
// // // // //                     <th>Pending Students</th>
// // // // //                     <th>Absent Students</th>
// // // // //                     <th>Start Time</th>
// // // // //                     <th>Batch Date</th>
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {allData.map((item, index) => (
// // // // //                     <tr key={`${item.center}-${item.batchNo}-${index}`}>
// // // // //                       <td>{item.center}</td>
// // // // //                       <td>{item.batchNo}</td>
// // // // //                       <td>{item.total_students || 0}</td>
// // // // //                       <td>{item.logged_in_students || 0}</td>
// // // // //                       <td>{item.completed_student || 0}</td>
// // // // //                       <td>
// // // // //                         {item.logged_in_students - item.completed_student || 0}
// // // // //                       </td>
// // // // //                       <td>
// // // // //                         {item.total_students - item.logged_in_students || 0}
// // // // //                       </td>
// // // // //                       <td>{item.start_time}</td>
// // // // //                       <td>{item.batchdate}</td>
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                   {allData.length > 0 &&
// // // // //                     (() => {
// // // // //                       const totals = calculateMainTableTotals();
// // // // //                       return (
// // // // //                         <tr className="sac-totals-row">
// // // // //                           <td colSpan="2">
// // // // //                             <strong>Total</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>{totals.totalStudents}</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>{totals.loggedInStudents}</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>{totals.completedStudents}</strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>
// // // // //                               {totals.loggedInStudents -
// // // // //                                 totals.completedStudents}
// // // // //                             </strong>
// // // // //                           </td>
// // // // //                           <td>
// // // // //                             <strong>
// // // // //                               {totals.totalStudents - totals.loggedInStudents}
// // // // //                             </strong>
// // // // //                           </td>
// // // // //                           <td colSpan="2"></td>
// // // // //                         </tr>
// // // // //                       );
// // // // //                     })()}
// // // // //                 </tbody>
// // // // //               </table>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {!loading && !error && allData.length === 0 && (
// // // // //           <div className="sac-no-data">
// // // // //             <p>No data available for the selected filters.</p>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SuperAdminCount;


// // // // import React, { useState, useEffect } from "react";
// // // // import axios from "axios";
// // // // import {
// // // //   Container,
// // // //   Row,
// // // //   Col,
// // // //   Card,
// // // //   Table,
// // // //   Button,
// // // //   Spinner,
// // // //   Alert,
// // // //   Form,
// // // // } from "react-bootstrap";
// // // // import "./SuperAdminStudentCount.css";
// // // // import SuperAdminNavbar from "./SuperAdminNavbar";

// // // // const SuperAdminCount = () => {
// // // //   const [batchNo, setBatchNo] = useState("");
// // // //   const [batches, setBatches] = useState([]);
// // // //   const [center, setCenter] = useState("");
// // // //   const [centers, setCenters] = useState([]);
// // // //   const [allData, setAllData] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState("");
// // // //   const [departmentId, setDepartmentId] = useState("");
// // // //   const [departments, setDepartments] = useState([]);
// // // //   const [aggregatedSubjects, setAggregatedSubjects] = useState([]);
// // // //   const [batchTotals, setBatchTotals] = useState({});

// // // //   useEffect(() => {
// // // //     fetchData();
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     fetchAllData();
// // // //     const intervalId = setInterval(() => {
// // // //       fetchAllData();
// // // //     }, 30000);
// // // //     return () => clearInterval(intervalId);
// // // //   }, [batchNo, center, departmentId]);

// // // //   useEffect(() => {
// // // //     if (allData.length > 0) {
// // // //       aggregateSubjects();
// // // //       calculateBatchTotals();
// // // //     } else {
// // // //       setAggregatedSubjects([]);
// // // //       setBatchTotals({});
// // // //     }
// // // //   }, [allData]);

// // // //   const fetchData = async () => {
// // // //     setLoading(true);
// // // //     setError("");
// // // //     try {
// // // //       let url = "http://localhost:3000/super-admin-student-track-dashboard";
// // // //       const response = await axios.post(url, { withCredentials: true });
// // // //       const distinctBatches = [...new Set(response.data.map((item) => item.batchNo))];
// // // //       setBatches(distinctBatches.sort());
// // // //       const distinctCenters = [...new Set(response.data.map((item) => item.center))];
// // // //       setCenters(distinctCenters.sort());
// // // //       const distinctDepartments = [...new Set(response.data.map((item) => item.departmentId))];
// // // //       setDepartments(distinctDepartments.sort());
// // // //     } catch (error) {
// // // //       console.error("Error fetching data:", error);
// // // //       setError("No students found for provided filter parameters. Please check the parameters!");
// // // //     }
// // // //     setLoading(false);
// // // //   };

// // // //   const fetchAllData = async () => {
// // // //     setLoading(true);
// // // //     setError("");
// // // //     try {
// // // //       let url = `http://localhost:3000/get-super-admin-student-count`;
// // // //       const params = new URLSearchParams();
// // // //       if (batchNo) params.append("batchNo", batchNo);
// // // //       if (center) params.append("center", center);
// // // //       if (departmentId) params.append("departmentId", departmentId);
// // // //       if (params.toString()) {
// // // //         url += `?${params.toString()}`;
// // // //       }
// // // //       const response = await axios.get(url, { withCredentials: true });
// // // //       if (response.data && response.data.results && Array.isArray(response.data.results)) {
// // // //         setAllData(response.data.results);
// // // //       } else {
// // // //         setError("Received unexpected data format from server");
// // // //         setAllData([]);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error fetching all data:", error);
// // // //       setError(error.response?.data?.message || "Failed to fetch all data");
// // // //       setAllData([]);
// // // //     }
// // // //     setLoading(false);
// // // //   };

// // // //   const aggregateSubjects = () => {
// // // //     const subjectMap = new Map();
// // // //     allData.forEach((item) => {
// // // //       if (item.subjects && Array.isArray(item.subjects)) {
// // // //         item.subjects.forEach((subject) => {
// // // //           const subjectId = subject.id;
// // // //           if (subjectMap.has(subjectId)) {
// // // //             const existingSubject = subjectMap.get(subjectId);
// // // //             existingSubject.count += parseInt(subject.count) || 0;
// // // //             existingSubject.loggedIn += parseInt(subject.loggedIn) || 0;
// // // //             existingSubject.completed += parseInt(subject.completed) || 0;
// // // //           } else {
// // // //             subjectMap.set(subjectId, {
// // // //               id: subject.id,
// // // //               name: subject.name,
// // // //               count: parseInt(subject.count) || 0,
// // // //               loggedIn: parseInt(subject.loggedIn) || 0,
// // // //               completed: parseInt(subject.completed) || 0,
// // // //             });
// // // //           }
// // // //         });
// // // //       }
// // // //     });
// // // //     const aggregated = Array.from(subjectMap.values());
// // // //     setAggregatedSubjects(aggregated);
// // // //   };

// // // //   const calculateBatchTotals = () => {
// // // //     const totals = {};
// // // //     allData.forEach((item) => {
// // // //       const batch = item.batchNo;
// // // //       if (!totals[batch]) {
// // // //         totals[batch] = {
// // // //           totalStudents: 0,
// // // //           loggedInStudents: 0,
// // // //           completedStudents: 0,
// // // //         };
// // // //       }
// // // //       totals[batch].totalStudents += parseInt(item.total_students) || 0;
// // // //       totals[batch].loggedInStudents += parseInt(item.logged_in_students) || 0;
// // // //       totals[batch].completedStudents += parseInt(item.completed_student) || 0;
// // // //     });
// // // //     setBatchTotals(totals);
// // // //   };

// // // //   const calculateSubjectsTotals = (subjects) => {
// // // //     return subjects.reduce(
// // // //       (totals, subject) => {
// // // //         totals.count += subject.count || 0;
// // // //         totals.loggedIn += subject.loggedIn || 0;
// // // //         totals.completed += subject.completed || 0;
// // // //         return totals;
// // // //       },
// // // //       { count: 0, loggedIn: 0, completed: 0 }
// // // //     );
// // // //   };

// // // //   const calculateMainTableTotals = () => {
// // // //     return allData.reduce(
// // // //       (totals, item) => {
// // // //         totals.totalStudents += parseInt(item.total_students) || 0;
// // // //         totals.loggedInStudents += parseInt(item.logged_in_students) || 0;
// // // //         totals.completedStudents += parseInt(item.completed_student) || 0;
// // // //         return totals;
// // // //       },
// // // //       { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 }
// // // //     );
// // // //   };
  
// // // //   const mainTableTotals = calculateMainTableTotals();
// // // //   const getLoggedInPercentage = () => {
// // // //     if (mainTableTotals.totalStudents === 0) return '0.00%';
// // // //     const percentage = (mainTableTotals.loggedInStudents / mainTableTotals.totalStudents) * 100;
// // // //     return `${percentage.toFixed(2)}%`;
// // // //   };
// // // //   const getCompletionPercentage = () => {
// // // //     if (mainTableTotals.loggedInStudents === 0) return '0.00%';
// // // //     const percentage = (mainTableTotals.completedStudents / mainTableTotals.loggedInStudents) * 100;
// // // //     return `${percentage.toFixed(2)}%`;
// // // //   };

// // // //   const getFilterSuffix = () => {
// // // //     let suffix = "";
// // // //     if (batchNo) suffix += ` - Batch ${batchNo}`;
// // // //     if (center) suffix += ` - Center ${center}`;
// // // //     if (departmentId) suffix += ` - Department ${departmentId}`;
// // // //     return suffix;
// // // //   };

// // // //   return (
// // // //     <div className="sac-page">
// // // //       <SuperAdminNavbar />
// // // //       <Container className="my-4">
// // // //         <h2 className="text-center mb-4 sac-title">Current Student Details</h2>
// // // //         <Card className="p-3 mb-4 shadow-sm">
// // // //           <Form>
// // // //             <Row className="g-3">
// // // //               <Col md={4}>
// // // //                 <Form.Group>
// // // //                   <Form.Label>Select Batch Number:</Form.Label>
// // // //                   <Form.Select
// // // //                     value={batchNo}
// // // //                     onChange={(e) => setBatchNo(e.target.value)}
// // // //                   >
// // // //                     <option value="">All Batches</option>
// // // //                     {batches.map((batch, index) => (
// // // //                       <option key={index} value={batch}>{batch}</option>
// // // //                     ))}
// // // //                   </Form.Select>
// // // //                 </Form.Group>
// // // //               </Col>
// // // //               <Col md={4}>
// // // //                 <Form.Group>
// // // //                   <Form.Label>Select Center Number:</Form.Label>
// // // //                   <Form.Select
// // // //                     value={center}
// // // //                     onChange={(e) => setCenter(e.target.value)}
// // // //                   >
// // // //                     <option value="">All Centers</option>
// // // //                     {centers.map((center, index) => (
// // // //                       <option key={index} value={center}>{center}</option>
// // // //                     ))}
// // // //                   </Form.Select>
// // // //                 </Form.Group>
// // // //               </Col>
// // // //               <Col md={4}>
// // // //                 <Form.Group>
// // // //                   <Form.Label>Select Department:</Form.Label>
// // // //                   <Form.Select
// // // //                     value={departmentId}
// // // //                     onChange={(e) => setDepartmentId(e.target.value)}
// // // //                   >
// // // //                     <option value="">All Departments</option>
// // // //                     {departments.map((department, index) => (
// // // //                       <option key={index} value={department}>{department}</option>
// // // //                     ))}
// // // //                   </Form.Select>
// // // //                 </Form.Group>
// // // //               </Col>
// // // //             </Row>
// // // //           </Form>
// // // //         </Card>

// // // //         {loading ? (
// // // //           <div className="d-flex justify-content-center mt-5">
// // // //             <Spinner animation="border" role="status">
// // // //               <span className="visually-hidden">Loading...</span>
// // // //             </Spinner>
// // // //           </div>
// // // //         ) : error ? (
// // // //           <Alert variant="danger" className="text-center">{error}</Alert>
// // // //         ) : (
// // // //           allData.length > 0 && (
// // // //             <>
// // // //               <Row className="mb-4 text-center">
// // // //                 <Col md={3} className="mb-3">
// // // //                   <Card className="p-3 shadow-sm bg-light">
// // // //                     <h5 className="mb-0 text-secondary">Total Students</h5>
// // // //                     <h2 className="display-4 fw-bold text-primary">{mainTableTotals.totalStudents}</h2>
// // // //                   </Card>
// // // //                 </Col>
// // // //                 <Col md={3} className="mb-3">
// // // //                   <Card className="p-3 shadow-sm bg-light">
// // // //                     <h5 className="mb-0 text-secondary">Logged In</h5>
// // // //                     <h2 className="display-4 fw-bold text-success">{mainTableTotals.loggedInStudents}</h2>
// // // //                     <p className="small text-muted mb-0">({getLoggedInPercentage()} of total)</p>
// // // //                   </Card>
// // // //                 </Col>
// // // //                 <Col md={3} className="mb-3">
// // // //                   <Card className="p-3 shadow-sm bg-light">
// // // //                     <h5 className="mb-0 text-secondary">Completed</h5>
// // // //                     <h2 className="display-4 fw-bold text-info">{mainTableTotals.completedStudents}</h2>
// // // //                     <p className="small text-muted mb-0">({getCompletionPercentage()} of logged in)</p>
// // // //                   </Card>
// // // //                 </Col>
// // // //                  <Col md={3} className="mb-3">
// // // //                   <Card className="p-3 shadow-sm bg-light">
// // // //                     <h5 className="mb-0 text-secondary">Total Subjects</h5>
// // // //                     <h2 className="display-4 fw-bold text-dark">{aggregatedSubjects.length}</h2>
// // // //                   </Card>
// // // //                 </Col>
// // // //               </Row>

// // // //               <Card className="shadow-sm mb-4">
// // // //                 <Card.Body>
// // // //                   <h4 className="sac-subtitle">Subjects{getFilterSuffix()}:</h4>
// // // //                   <div className="table-responsive">
// // // //                     <Table striped bordered hover className="mb-0">
// // // //                       <thead>
// // // //                         <tr>
// // // //                           <th>Subject ID</th>
// // // //                           <th>Subject Name</th>
// // // //                           <th>Total Students</th>
// // // //                           <th>Logged In</th>
// // // //                           <th>Completed</th>
// // // //                           <th>Pending</th>
// // // //                           <th>Absent</th>
// // // //                         </tr>
// // // //                       </thead>
// // // //                       <tbody>
// // // //                         {aggregatedSubjects
// // // //                           .filter((subject) => subject.count > 0)
// // // //                           .map((subject, index) => (
// // // //                             <tr key={subject.id || index}>
// // // //                               <td>{subject.id}</td>
// // // //                               <td>{subject.name}</td>
// // // //                               <td className="text-primary">{subject.count || 0}</td>
// // // //                               <td className="text-success">{subject.loggedIn || 0}</td>
// // // //                               <td className="text-info">{subject.completed || 0}</td>
// // // //                               <td className="text-warning">{subject.loggedIn - subject.completed || 0}</td>
// // // //                               <td className="text-danger">{subject.count - subject.loggedIn || 0}</td>
// // // //                             </tr>
// // // //                           ))}
// // // //                         {aggregatedSubjects.filter((subject) => subject.count > 0).length > 0 && (
// // // //                           <tr className="sac-totals-row">
// // // //                             <td colSpan="2"><strong>Total</strong></td>
// // // //                             <td className="text-primary"><strong>{calculateSubjectsTotals(aggregatedSubjects).count}</strong></td>
// // // //                             <td className="text-success"><strong>{calculateSubjectsTotals(aggregatedSubjects).loggedIn}</strong></td>
// // // //                             <td className="text-info"><strong>{calculateSubjectsTotals(aggregatedSubjects).completed}</strong></td>
// // // //                             <td className="text-warning"><strong>{calculateSubjectsTotals(aggregatedSubjects).loggedIn - calculateSubjectsTotals(aggregatedSubjects).completed}</strong></td>
// // // //                             <td className="text-danger"><strong>{calculateSubjectsTotals(aggregatedSubjects).count - calculateSubjectsTotals(aggregatedSubjects).loggedIn}</strong></td>
// // // //                           </tr>
// // // //                         )}
// // // //                       </tbody>
// // // //                     </Table>
// // // //                   </div>
// // // //                 </Card.Body>
// // // //               </Card>

// // // //               <Card className="shadow-sm mb-4">
// // // //                 <Card.Body>
// // // //                   <h4 className="sac-subtitle">Batch-wise Totals{getFilterSuffix()}:</h4>
// // // //                   <div className="table-responsive">
// // // //                     <Table striped bordered hover className="mb-0">
// // // //                       <thead>
// // // //                         <tr>
// // // //                           <th>Batch No</th>
// // // //                           <th>Total Students</th>
// // // //                           <th>Logged In Students</th>
// // // //                           <th>Completed Students</th>
// // // //                           <th>Pending Students</th>
// // // //                           <th>Absent Students</th>
// // // //                         </tr>
// // // //                       </thead>
// // // //                       <tbody>
// // // //                         {Object.entries(batchTotals).map(([batch, totals]) => (
// // // //                           <tr key={batch}>
// // // //                             <td>{batch}</td>
// // // //                             <td className="text-primary">{totals.totalStudents || 0}</td>
// // // //                             <td className="text-success">{totals.loggedInStudents || 0}</td>
// // // //                             <td className="text-info">{totals.completedStudents || 0}</td>
// // // //                             <td className="text-warning">{totals.loggedInStudents - totals.completedStudents || 0}</td>
// // // //                             <td className="text-danger">{totals.totalStudents - totals.loggedInStudents || 0}</td>
// // // //                           </tr>
// // // //                         ))}
// // // //                         {Object.keys(batchTotals).length > 0 && (() => {
// // // //                           const grandTotals = Object.values(batchTotals).reduce(
// // // //                             (acc, totals) => {
// // // //                               acc.totalStudents += totals.totalStudents || 0;
// // // //                               acc.loggedInStudents += totals.loggedInStudents || 0;
// // // //                               acc.completedStudents += totals.completedStudents || 0;
// // // //                               return acc;
// // // //                             },
// // // //                             { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 }
// // // //                           );
// // // //                           return (
// // // //                             <tr className="sac-totals-row">
// // // //                               <td><strong>Grand Total</strong></td>
// // // //                               <td className="text-primary"><strong>{grandTotals.totalStudents}</strong></td>
// // // //                               <td className="text-success"><strong>{grandTotals.loggedInStudents}</strong></td>
// // // //                               <td className="text-info"><strong>{grandTotals.completedStudents}</strong></td>
// // // //                               <td className="text-warning"><strong>{grandTotals.loggedInStudents - grandTotals.completedStudents}</strong></td>
// // // //                               <td className="text-danger"><strong>{grandTotals.totalStudents - grandTotals.loggedInStudents}</strong></td>
// // // //                             </tr>
// // // //                           );
// // // //                         })()}
// // // //                       </tbody>
// // // //                     </Table>
// // // //                   </div>
// // // //                 </Card.Body>
// // // //               </Card>

// // // //               <Card className="shadow-sm">
// // // //                 <Card.Body>
// // // //                   <h3 className="sac-subtitle">Detailed View{getFilterSuffix()}</h3>
// // // //                   <div className="table-responsive">
// // // //                     <Table striped bordered hover className="mb-0">
// // // //                       <thead>
// // // //                         <tr>
// // // //                           <th>Center</th>
// // // //                           <th>Batch No</th>
// // // //                           <th>Total Students</th>
// // // //                           <th>Logged In Students</th>
// // // //                           <th>Completed Students</th>
// // // //                           <th>Pending Students</th>
// // // //                           <th>Absent Students</th>
// // // //                           <th>Start Time</th>
// // // //                           <th>Batch Date</th>
// // // //                         </tr>
// // // //                       </thead>
// // // //                       <tbody>
// // // //                         {allData.map((item, index) => (
// // // //                           <tr key={`${item.center}-${item.batchNo}-${index}`}>
// // // //                             <td>{item.center}</td>
// // // //                             <td>{item.batchNo}</td>
// // // //                             <td className="text-primary">{item.total_students || 0}</td>
// // // //                             <td className="text-success">{item.logged_in_students || 0}</td>
// // // //                             <td className="text-info">{item.completed_student || 0}</td>
// // // //                             <td className="text-warning">{item.logged_in_students - item.completed_student || 0}</td>
// // // //                             <td className="text-danger">{item.total_students - item.logged_in_students || 0}</td>
// // // //                             <td>{item.start_time}</td>
// // // //                             <td>{item.batchdate}</td>
// // // //                           </tr>
// // // //                         ))}
// // // //                         {allData.length > 0 && (() => {
// // // //                           const totals = calculateMainTableTotals();
// // // //                           return (
// // // //                             <tr className="sac-totals-row">
// // // //                               <td colSpan="2"><strong>Total</strong></td>
// // // //                               <td className="text-primary"><strong>{totals.totalStudents}</strong></td>
// // // //                               <td className="text-success"><strong>{totals.loggedInStudents}</strong></td>
// // // //                               <td className="text-info"><strong>{totals.completedStudents}</strong></td>
// // // //                               <td className="text-warning"><strong>{totals.loggedInStudents - totals.completedStudents}</strong></td>
// // // //                               <td className="text-danger"><strong>{totals.totalStudents - totals.loggedInStudents}</strong></td>
// // // //                               <td colSpan="2"></td>
// // // //                             </tr>
// // // //                           );
// // // //                         })()}
// // // //                       </tbody>
// // // //                     </Table>
// // // //                   </div>
// // // //                 </Card.Body>
// // // //               </Card>
// // // //             </>
// // // //           )
// // // //         )}
// // // //         {allData.length === 0 && !loading && !error && (
// // // //           <Alert variant="info" className="text-center">No data available for the selected filters.</Alert>
// // // //         )}
// // // //       </Container>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SuperAdminCount;


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Stack,
  Paper
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
  People as PeopleIcon,
  Login as LoginIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  PersonOff as AbsentIcon,
  School as SubjectIcon,
  Assignment as AssignmentIcon,
  Business as CenterIcon,
  Assessment as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as ChartIcon,
  Dashboard as DashboardIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import SuperAdminNavbar from "./SuperAdminNavbar";

// [All your existing styled components remain the same...]
const StyledContainer = styled(Container)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

const AnalyticsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
  }
}));

const MetricCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(15px)',
  borderRadius: '16px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
  }
}));

// Enhanced StyledDataGrid with full-width utilization
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '0',
  backgroundColor: 'transparent',
  fontFamily: theme.typography.fontFamily,
  width: '100%',
  height: '100%',
  '& .MuiDataGrid-main': {
    borderRadius: '0',
    width: '100%',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
    }
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.2),
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  '& .MuiDataGrid-row': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    }
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  }
}));

const FilterCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  marginBottom: theme.spacing(3),
}));

// Enhanced Metric Card Component
const EnhancedMetricCard = ({ title, value, icon, color, percentage, subtitle }) => {
  const theme = useTheme();
  
  return (
    <MetricCard>
      <CardContent sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Background decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
            borderRadius: '50%',
            transform: 'translate(25px, -25px)',
          }}
        />
        
        {/* Header with icon */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 500, 
                mb: 1,
                fontSize: '0.875rem',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {/* Icon container */}
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            bgcolor: `${color}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '48px',
            minHeight: '48px'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 24, color } })}
          </Box>
        </Stack>
        
        {/* Value and subtitle */}
        <Box sx={{ mb: percentage ? 2 : 'auto' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color, 
              mb: 0.5,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              lineHeight: 1,
              fontFamily: 'inherit'
            }}
          >
            <CountUp end={value} duration={2} separator="," />
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                lineHeight: 1.4
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {/* Progress section */}
        {percentage && (
          <Box sx={{ mt: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem', fontWeight: 500 }}
              >
                Progress
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 700, 
                  color,
                  fontSize: '0.75rem'
                }}
              >
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
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </MetricCard>
  );
};

// Custom Toolbar
const CustomToolbar = ({ title, count }) => (
  <GridToolbarContainer sx={{ 
    p: 2.5, 
    justifyContent: 'space-between',
    borderBottom: '1px solid',
    borderColor: 'divider'
  }}>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <AnalyticsIcon color="primary" />
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        color: 'primary.main',
        fontSize: '1.1rem'
      }}>
        {title}
      </Typography>
      <Chip 
        label={`${count} records`} 
        size="small" 
        variant="outlined" 
        color="primary"
      />
    </Stack>
    <Stack direction="row" spacing={1}>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </Stack>
  </GridToolbarContainer>
);

const SuperAdminCount = () => {
  const theme = useTheme();
  const [batchNo, setBatchNo] = useState("");
  const [batches, setBatches] = useState([]);
  const [center, setCenter] = useState("");
  const [centers, setCenters] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);

  // Pagination model
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Initializing with 15 subjects by default as requested
  const initialSubjects = Array.from({ length: 15 }, (_, i) => ({
    id: `S${i + 1}`,
    name: `Subject ${i + 1}`,
    count: 0,
    loggedIn: 0,
    completed: 0,
  }));
  
  const [aggregatedSubjects, setAggregatedSubjects] = useState(initialSubjects);
  const [batchTotals, setBatchTotals] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(() => {
      fetchAllData();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [batchNo, center, departmentId]);

  useEffect(() => {
    if (allData.length > 0) {
      aggregateSubjects();
      calculateBatchTotals();
    } else {
      setAggregatedSubjects(initialSubjects);
      setBatchTotals({});
    }
  }, [allData]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "http://localhost:3000/super-admin-student-track-dashboard";
      const response = await axios.post(url, { withCredentials: true });
      const distinctBatches = [...new Set(response.data.map((item) => item.batchNo))];
      setBatches(distinctBatches.sort());
      const distinctCenters = [...new Set(response.data.map((item) => item.center))];
      setCenters(distinctCenters.sort());
      const distinctDepartments = [...new Set(response.data.map((item) => item.departmentId))];
      setDepartments(distinctDepartments.sort());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("No students found for provided filter parameters. Please check the parameters!");
    }
    setLoading(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:3000/get-super-admin-student-count`;
      const params = new URLSearchParams();
      if (batchNo) params.append("batchNo", batchNo);
      if (center) params.append("center", center);
      if (departmentId) params.append("departmentId", departmentId);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await axios.get(url, { withCredentials: true });
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        setAllData(response.data.results);
      } else {
        setError("Received unexpected data format from server");
        setAllData([]);
      }
    } catch (error) {
      console.error("Error fetching all data:", error);
      setError(error.response?.data?.message || "Failed to fetch all data");
      setAllData([]);
    }
    setLoading(false);
  };

  const aggregateSubjects = () => {
    const subjectMap = new Map(
      initialSubjects.map(subject => [
        subject.id,
        { ...subject, count: 0, loggedIn: 0, completed: 0 },
      ])
    );
    
    allData.forEach((item) => {
      if (item.subjects && Array.isArray(item.subjects)) {
        item.subjects.forEach((subject) => {
          const subjectId = subject.id;
          if (subjectMap.has(subjectId)) {
            const existingSubject = subjectMap.get(subjectId);
            existingSubject.count += parseInt(subject.count) || 0;
            existingSubject.loggedIn += parseInt(subject.loggedIn) || 0;
            existingSubject.completed += parseInt(subject.completed) || 0;
          }
        });
      }
    });
    const aggregated = Array.from(subjectMap.values());
    setAggregatedSubjects(aggregated);
  };

  const calculateBatchTotals = () => {
    const totals = {};
    allData.forEach((item) => {
      const batch = item.batchNo;
      if (!totals[batch]) {
        totals[batch] = {
          totalStudents: 0,
          loggedInStudents: 0,
          completedStudents: 0,
        };
      }
      totals[batch].totalStudents += parseInt(item.total_students) || 0;
      totals[batch].loggedInStudents += parseInt(item.logged_in_students) || 0;
      totals[batch].completedStudents += parseInt(item.completed_student) || 0;
    });
    setBatchTotals(totals);
  };

  const calculateMainTableTotals = () => {
    return allData.reduce(
      (totals, item) => {
        totals.totalStudents += parseInt(item.total_students) || 0;
        totals.loggedInStudents += parseInt(item.logged_in_students) || 0;
        totals.completedStudents += parseInt(item.completed_student) || 0;
        return totals;
      },
      { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 }
    );
  };

  const mainTableTotals = calculateMainTableTotals();

  const getLoggedInPercentage = () => {
    if (mainTableTotals.totalStudents === 0) return 0;
    return ((mainTableTotals.loggedInStudents / mainTableTotals.totalStudents) * 100).toFixed(1);
  };

  const getCompletionPercentage = () => {
    if (mainTableTotals.loggedInStudents === 0) return 0;
    return ((mainTableTotals.completedStudents / mainTableTotals.loggedInStudents) * 100).toFixed(1);
  };

  const getFilterSuffix = () => {
    let suffix = "";
    if (batchNo) suffix += ` - Batch ${batchNo}`;
    if (center) suffix += ` - Center ${center}`;
    if (departmentId) suffix += ` - Department ${departmentId}`;
    return suffix;
  };

  // Enhanced data processing - Add calculated fields for proper DataGrid display
  const processSubjectsForGrid = (subjects) => {
    return subjects.map(subject => ({
      ...subject,
      pending: subject.loggedIn - subject.completed,
      absent: subject.count - subject.loggedIn
    }));
  };

  const processBatchTotalsForGrid = (batchTotals) => {
    return Object.entries(batchTotals).map(([batchNo, totals]) => ({
      id: batchNo,
      batchNo,
      ...totals,
      pending: totals.loggedInStudents - totals.completedStudents,
      absent: totals.totalStudents - totals.loggedInStudents
    }));
  };

  const processDetailDataForGrid = (data) => {
    return data.map((item, index) => ({
      ...item,
      id: `${item.center}-${item.batchNo}-${index}`,
      pending: (parseInt(item.logged_in_students) || 0) - (parseInt(item.completed_student) || 0),
      absent: (parseInt(item.total_students) || 0) - (parseInt(item.logged_in_students) || 0)
    }));
  };

  // UPDATED DataGrid columns for subjects with FLEX instead of WIDTH
  const subjectColumns = [
    {
      field: 'id',
      headerName: 'Subject ID',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      )
    },
    {
      field: 'name',
      headerName: 'Subject Name',
      flex: 1.5,
      minWidth: 120,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <SubjectIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'count',
      headerName: 'Total Students',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          fontSize: '0.9rem'
        }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'loggedIn',
      headerName: 'Logged In',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="success" 
          sx={{ fontWeight: 600, minWidth: '50px' }}
        />
      )
    },
    {
      field: 'completed',
      headerName: 'Completed',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="info"
          sx={{ fontWeight: 600, minWidth: '50px' }}
        />
      )
    },
    {
      field: 'pending',
      headerName: 'Pending',
      flex: 1,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="warning"
          sx={{ fontWeight: 600, minWidth: '50px' }}
        />
      )
    },
    {
      field: 'absent',
      headerName: 'Absent',
      flex: 1,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="error"
          sx={{ fontWeight: 600, minWidth: '50px' }}
        />
      )
    }
  ];

  // UPDATED DataGrid columns for batch totals with FLEX instead of WIDTH
  const batchColumns = [
    {
      field: 'batchNo',
      headerName: 'Batch No',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="secondary" 
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      )
    },
    {
      field: 'totalStudents',
      headerName: 'Total Students',
      flex: 1.2,
      minWidth: 110,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          fontSize: '0.9rem'
        }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'loggedInStudents',
      headerName: 'Logged In',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="success"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'completedStudents',
      headerName: 'Completed',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="info"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'pending',
      headerName: 'Pending',
      flex: 1,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="warning"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'absent',
      headerName: 'Absent',
      flex: 1,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="error"
          sx={{ fontWeight: 600 }}
        />
      )
    }
  ];

  // UPDATED DataGrid columns for detailed view with FLEX instead of WIDTH
  const detailColumns = [
    {
      field: 'center',
      headerName: 'Center',
      flex: 1,
      minWidth: 80,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CenterIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'batchNo',
      headerName: 'Batch',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="secondary" 
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      )
    },
    {
      field: 'total_students',
      headerName: 'Total Students',
      flex: 1.2,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          fontSize: '0.9rem'
        }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'logged_in_students',
      headerName: 'Logged In',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="success"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'completed_student',
      headerName: 'Completed',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="info"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'pending',
      headerName: 'Pending',
      flex: 1,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="warning"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'absent',
      headerName: 'Absent',
      flex: 1,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="error"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'start_time',
      headerName: 'Start Time',
      flex: 1,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'batchdate',
      headerName: 'Batch Date',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
    }
  ];

  // Process data for DataGrid display
  const filteredSubjects = aggregatedSubjects.filter(subject => subject.count > 0);
  const processedSubjects = processSubjectsForGrid(filteredSubjects);
  const processedBatchTotals = processBatchTotalsForGrid(batchTotals);
  const processedDetailData = processDetailDataForGrid(allData);

  return (
    <div>
      <SuperAdminNavbar />
      <StyledContainer maxWidth="xl">
        <Fade in={true} timeout={800}>
          <Box>
            {/* Header with better spacing and alignment */}
            <Paper 
              elevation={0}
              sx={{ 
                mb: 3, 
                p: 4, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1)
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DashboardIcon sx={{ fontSize: '3rem', color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                  >
                    Current Student Details
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 400,
                      maxWidth: '600px',
                      mx: 'auto'
                    }}
                  >
                    Real-time insights and comprehensive student performance analytics
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Filters */}
            <FilterCard>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '8px', 
                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                  }}>
                    <FilterIcon color="primary" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Analytics Filters
                  </Typography>
                </Stack>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Batch Number</InputLabel>
                      <Select
                        value={batchNo}
                        label="Batch Number"
                        onChange={(e) => setBatchNo(e.target.value)}
                      >
                        <MenuItem value="">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AssignmentIcon fontSize="small" />
                            <span>All Batches</span>
                          </Stack>
                        </MenuItem>
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
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Center Number</InputLabel>
                      <Select
                        value={center}
                        label="Center Number"
                        onChange={(e) => setCenter(e.target.value)}
                      >
                        <MenuItem value="">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CenterIcon fontSize="small" />
                            <span>All Centers</span>
                          </Stack>
                        </MenuItem>
                        {centers.map((center, index) => (
                          <MenuItem key={index} value={center}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CenterIcon fontSize="small" />
                              <span>{center}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={departmentId}
                        label="Department"
                        onChange={(e) => setDepartmentId(e.target.value)}
                      >
                        <MenuItem value="">All Departments</MenuItem>
                        {departments.map((department, index) => (
                          <MenuItem key={index} value={department}>{department}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </FilterCard>

            {loading ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Loading analytics data...
                </Typography>
              </Paper>
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '12px', 
                  mb: 3,
                  fontSize: '1rem'
                }}
              >
                {error}
              </Alert>
            ) : allData.length > 0 && (
              <>
                {/* Key Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <EnhancedMetricCard
                      title="Total Students"
                      value={mainTableTotals.totalStudents}
                      icon={<PeopleIcon />}
                      color="#1976d2"
                      subtitle="Registered students"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <EnhancedMetricCard
                      title="Logged In"
                      value={mainTableTotals.loggedInStudents}
                      icon={<LoginIcon />}
                      color="#2e7d32"
                      percentage={getLoggedInPercentage()}
                      subtitle={`${getLoggedInPercentage()}% of total`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <EnhancedMetricCard
                      title="Completed"
                      value={mainTableTotals.completedStudents}
                      icon={<CompletedIcon />}
                      color="#1565c0"
                      percentage={getCompletionPercentage()}
                      subtitle={`${getCompletionPercentage()}% of logged in`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <EnhancedMetricCard
                      title="Absent Students"
                      value={mainTableTotals.totalStudents - mainTableTotals.loggedInStudents}
                      icon={<AbsentIcon />}
                      color="#d32f2f"
                      subtitle="Students not logged in"
                    />
                  </Grid>
                </Grid>

                {/* Subject Analytics Table */}
                {processedSubjects.length > 0 && (
                  <Zoom in={true} timeout={600}>
                    <AnalyticsCard sx={{ mb: 4 }}>
                      <Box sx={{ height: 500, width: '100%' }}>
                        <StyledDataGrid
                          rows={processedSubjects}
                          columns={subjectColumns}
                          paginationModel={paginationModel}
                          onPaginationModelChange={setPaginationModel}
                          pageSizeOptions={[5, 10, 25]}
                          disableSelectionOnClick
                          slots={{
                            toolbar: () => (
                              <CustomToolbar 
                                title={`Subjects${getFilterSuffix()}`} 
                                count={processedSubjects.length} 
                              />
                            )
                          }}
                        />
                      </Box>
                    </AnalyticsCard>
                  </Zoom>
                )}

                {/* Batch Totals Table */}
                {processedBatchTotals.length > 0 && (
                  <Zoom in={true} timeout={700}>
                    <AnalyticsCard sx={{ mb: 4 }}>
                      <Box sx={{ height: 400, width: '100%' }}>
                        <StyledDataGrid
                          rows={processedBatchTotals}
                          columns={batchColumns}
                          paginationModel={paginationModel}
                          onPaginationModelChange={setPaginationModel}
                          pageSizeOptions={[5, 10, 25]}
                          disableSelectionOnClick
                          slots={{
                            toolbar: () => (
                              <CustomToolbar 
                                title={`Batch-wise Totals${getFilterSuffix()}`} 
                                count={processedBatchTotals.length} 
                              />
                            )
                          }}
                        />
                      </Box>
                    </AnalyticsCard>
                  </Zoom>
                )}

                {/* Detailed Analytics Table */}
                <Zoom in={true} timeout={800}>
                  <AnalyticsCard>
                    <Box sx={{ height: 600, width: '100%' }}>
                      <StyledDataGrid
                        rows={processedDetailData}
                        columns={detailColumns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 15, 25]}
                        disableSelectionOnClick
                        slots={{
                          toolbar: () => (
                            <CustomToolbar 
                              title={`Detailed View${getFilterSuffix()}`} 
                              count={processedDetailData.length} 
                            />
                          )
                        }}
                      />
                    </Box>
                  </AnalyticsCard>
                </Zoom>
              </>
            )}

            {/* No Data State */}
            {allData.length === 0 && !loading && !error && (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  No Data Available
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No data available for the selected filters. Please adjust your filter criteria.
                </Typography>
              </Paper>
            )}
          </Box>
        </Fade>
      </StyledContainer>
    </div>
  );
};

export default SuperAdminCount;
