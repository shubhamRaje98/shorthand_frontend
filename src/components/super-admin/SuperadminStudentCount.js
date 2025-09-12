import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SuperAdminStudentCount.css";
import SuperAdminNavbar from "./SuperAdminNavbar";
import moment from "moment-timezone";

const SuperAdminCount = () => {
  const [batchNo, setBatchNo] = useState("");
  const [batches, setBatches] = useState([]);
  const [center, setCenter] = useState("");
  const [centers, setCenters] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [aggregatedSubjects, setAggregatedSubjects] = useState([]);
  const [batchTotals, setBatchTotals] = useState({});

  useEffect(() => {
    fetchData();
  }, []); // Only fetch initial filter options once

  useEffect(() => {
    fetchAllData();

    // Set interval for fetching data every 30 seconds
    const intervalId = setInterval(() => {
      fetchAllData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [batchNo, center, departmentId]); // Fetch data when filters change

  useEffect(() => {
    // Only aggregate when allData changes
    if (allData.length > 0) {
      aggregateSubjects();
      calculateBatchTotals();
    } else {
      // Clear aggregations when no data
      setAggregatedSubjects([]);
      setBatchTotals({});
    }
  }, [allData]); // Only depend on allData

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "http://localhost:3001/super-admin-student-track-dashboard";

      const response = await axios.post(url, { withCredentials: true });
      const distinctBatches = [
        ...new Set(response.data.map((item) => item.batchNo)),
      ];
      setBatches(distinctBatches.sort());

      const distinctCenters = [
        ...new Set(response.data.map((item) => item.center)),
      ];
      setCenters(distinctCenters.sort());

      const distinctDepartments = [
        ...new Set(response.data.map((item) => item.departmentId)),
      ];
      setDepartments(distinctDepartments.sort());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "No students found for provided filter parameters. Please check the parameters!"
      );
    }
    setLoading(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:3001/get-super-admin-student-count`;
      const params = new URLSearchParams();

      if (batchNo) params.append("batchNo", batchNo);
      if (center) params.append("center", center);
      if (departmentId) params.append("departmentId", departmentId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      // ADD THIS DEBUG CODE
      console.log("=== FILTER DEBUG ===");
      console.log("Frontend filter values:");
      console.log("- batchNo:", batchNo);
      console.log("- center:", center);
      console.log("- departmentId:", departmentId);
      console.log("URL being sent to backend:", url);
      console.log("URLSearchParams:", params.toString());
      console.log("==================");

      const response = await axios.get(url, { withCredentials: true });

      // ADD THIS TO CHECK WHAT BACKEND RECEIVED
      console.log("=== BACKEND RESPONSE DEBUG ===");
      console.log("Response status:", response.status);
      console.log("Response data length:", response.data?.results?.length || 0);
      if (response.data?.results?.length > 0) {
        console.log("First item from response:", response.data.results[0]);
        console.log("All unique batchNo values in response:", [
          ...new Set(response.data.results.map((item) => item.batchNo)),
        ]);
        console.log("All unique center values in response:", [
          ...new Set(response.data.results.map((item) => item.center)),
        ]);
        console.log("All unique departmentId values in response:", [
          ...new Set(response.data.results.map((item) => item.departmentId)),
        ]);
      }
      console.log("============================");

      if (
        response.data &&
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        console.log("Fetched data:", response.data.results);
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
    const subjectMap = new Map();

    allData.forEach((item) => {
      if (item.subjects && Array.isArray(item.subjects)) {
        item.subjects.forEach((subject) => {
          const subjectId = subject.id;
          if (subjectMap.has(subjectId)) {
            const existingSubject = subjectMap.get(subjectId);
            existingSubject.count += parseInt(subject.count) || 0;
            existingSubject.loggedIn += parseInt(subject.loggedIn) || 0;
            existingSubject.completed += parseInt(subject.completed) || 0;
          } else {
            subjectMap.set(subjectId, {
              id: subject.id,
              name: subject.name,
              count: parseInt(subject.count) || 0,
              loggedIn: parseInt(subject.loggedIn) || 0,
              completed: parseInt(subject.completed) || 0,
            });
          }
        });
      }
    });

    const aggregated = Array.from(subjectMap.values());
    console.log("Aggregated subjects:", aggregated);
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

    console.log("Batch totals:", totals);
    setBatchTotals(totals);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
      return "";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const calculateTotals = (subjects) => {
    return subjects.reduce(
      (totals, subject) => {
        totals.count += subject.count || 0;
        totals.loggedIn += subject.loggedIn || 0;
        totals.completed += subject.completed || 0;
        return totals;
      },
      { count: 0, loggedIn: 0, completed: 0 }
    );
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

  const getFilterSuffix = () => {
    let suffix = "";
    if (batchNo) suffix += ` - Batch ${batchNo}`;
    if (center) suffix += ` - Center ${center}`;
    if (departmentId) suffix += ` - Department ${departmentId}`;
    return suffix;
  };

  return (
    <div className="sac-page">
      <SuperAdminNavbar />
      <div className="sac-container">
        <h2 className="sac-title">Current Student Details</h2>

        <div className="sac-filter-container">
          <div className="sac-select-wrapper">
            <label htmlFor="batchNo" className="sac-label">
              Select Batch Number:
            </label>
            <select
              id="batchNo"
              className="sac-select"
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
            >
              <option value="">All Batches</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          <div className="sac-select-wrapper">
            <label htmlFor="center" className="sac-label">
              Select Center Number:
            </label>
            <select
              id="center"
              className="sac-select"
              value={center}
              onChange={(e) => setCenter(e.target.value)}
            >
              <option value="">All Centers</option>
              {centers.map((center, index) => (
                <option key={index} value={center}>
                  {center}
                </option>
              ))}
            </select>
          </div>

          <div className="sac-select-wrapper">
            <label htmlFor="departmentId" className="sac-label">
              Select Department:
            </label>
            <select
              id="departmentId"
              className="sac-select"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="sac-loading">Loading...</p>}
        {error && <p className="sac-error">{error}</p>}

        {/* Subjects Table */}
        {!loading && !error && allData.length > 0 && (
          <div className="sac-subjects-section">
            <h4 className="sac-subtitle">Subjects{getFilterSuffix()}:</h4>
            <div className="sac-table-wrapper">
              {aggregatedSubjects.length > 0 ? (
                <table className="sac-table sac-subjects-table">
                  <thead>
                    <tr>
                      <th>Subject ID</th>
                      <th>Subject Name</th>
                      <th>Count</th>
                      <th>Logged In</th>
                      <th>Completed</th>
                      <th>Pending</th>
                      <th>Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedSubjects
                      .filter((subject) => subject.count > 0)
                      .map((subject, index) => (
                        <tr key={subject.id || index}>
                          <td>{subject.id}</td>
                          <td>{subject.name}</td>
                          <td>{subject.count || 0}</td>
                          <td>{subject.loggedIn || 0}</td>
                          <td>{subject.completed || 0}</td>
                          <td>{subject.loggedIn - subject.completed || 0}</td>
                          <td>{subject.count - subject.loggedIn || 0}</td>
                        </tr>
                      ))}
                    {(() => {
                      const subjects = aggregatedSubjects.filter(
                        (subject) => subject.count > 0
                      );
                      if (subjects.length > 0) {
                        const totals = calculateTotals(subjects);
                        return (
                          <tr className="sac-totals-row">
                            <td colSpan="2">
                              <strong>Total</strong>
                            </td>
                            <td>
                              <strong>{totals.count}</strong>
                            </td>
                            <td>
                              <strong>{totals.loggedIn}</strong>
                            </td>
                            <td>
                              <strong>{totals.completed}</strong>
                            </td>
                            <td>
                              <strong>
                                {totals.loggedIn - totals.completed}
                              </strong>
                            </td>
                            <td>
                              <strong>{totals.count - totals.loggedIn}</strong>
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })()}
                  </tbody>
                </table>
              ) : (
                <div>
                  <p className="sac-no-data">
                    No subjects found for the current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Batch Totals Table */}
        {!loading && !error && allData.length > 0 && (
          <div className="sac-batch-totals-section">
            <h4 className="sac-subtitle">
              Batch-wise Totals{getFilterSuffix()}:
            </h4>
            <div className="sac-table-wrapper">
              {Object.keys(batchTotals).length > 0 ? (
                <table className="sac-table sac-batch-totals-table">
                  <thead>
                    <tr>
                      <th>Batch No</th>
                      <th>Total Students</th>
                      <th>Logged In Students</th>
                      <th>Completed Students</th>
                      <th>Pending Students</th>
                      <th>Absent Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(batchTotals).map(([batch, totals]) => (
                      <tr key={batch}>
                        <td>{batch}</td>
                        <td>{totals.totalStudents || 0}</td>
                        <td>{totals.loggedInStudents || 0}</td>
                        <td>{totals.completedStudents || 0}</td>
                        <td>
                          {totals.loggedInStudents - totals.completedStudents ||
                            0}
                        </td>
                        <td>
                          {totals.totalStudents - totals.loggedInStudents || 0}
                        </td>
                      </tr>
                    ))}
                    {(() => {
                      const grandTotals = Object.values(batchTotals).reduce(
                        (acc, totals) => {
                          acc.totalStudents += totals.totalStudents || 0;
                          acc.loggedInStudents += totals.loggedInStudents || 0;
                          acc.completedStudents +=
                            totals.completedStudents || 0;
                          return acc;
                        },
                        {
                          totalStudents: 0,
                          loggedInStudents: 0,
                          completedStudents: 0,
                        }
                      );

                      return (
                        <tr className="sac-totals-row">
                          <td>
                            <strong>Grand Total</strong>
                          </td>
                          <td>
                            <strong>{grandTotals.totalStudents}</strong>
                          </td>
                          <td>
                            <strong>{grandTotals.loggedInStudents}</strong>
                          </td>
                          <td>
                            <strong>{grandTotals.completedStudents}</strong>
                          </td>
                          <td>
                            <strong>
                              {grandTotals.loggedInStudents -
                                grandTotals.completedStudents}
                            </strong>
                          </td>
                          <td>
                            <strong>
                              {grandTotals.totalStudents -
                                grandTotals.loggedInStudents}
                            </strong>
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              ) : (
                <p className="sac-no-data">
                  No batch totals found for the current filters.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Data Table */}
        {!loading && !error && allData.length > 0 && (
          <div className="sac-data-table">
            <h3 className="sac-subtitle">Detailed View{getFilterSuffix()}</h3>
            <div className="sac-table-wrapper">
              <table className="sac-table">
                <thead>
                  <tr>
                    <th>Center</th>
                    <th>Batch No</th>
                    <th>Total Students</th>
                    <th>Logged In Students</th>
                    <th>Completed Students</th>
                    <th>Pending Students</th>
                    <th>Absent Students</th>
                    <th>Start Time</th>
                    <th>Batch Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.map((item, index) => (
                    <tr key={`${item.center}-${item.batchNo}-${index}`}>
                      <td>{item.center}</td>
                      <td>{item.batchNo}</td>
                      <td>{item.total_students || 0}</td>
                      <td>{item.logged_in_students || 0}</td>
                      <td>{item.completed_student || 0}</td>
                      <td>
                        {item.logged_in_students - item.completed_student || 0}
                      </td>
                      <td>
                        {item.total_students - item.logged_in_students || 0}
                      </td>
                      <td>{item.start_time}</td>
                      <td>{item.batchdate}</td>
                    </tr>
                  ))}
                  {allData.length > 0 &&
                    (() => {
                      const totals = calculateMainTableTotals();
                      return (
                        <tr className="sac-totals-row">
                          <td colSpan="2">
                            <strong>Total</strong>
                          </td>
                          <td>
                            <strong>{totals.totalStudents}</strong>
                          </td>
                          <td>
                            <strong>{totals.loggedInStudents}</strong>
                          </td>
                          <td>
                            <strong>{totals.completedStudents}</strong>
                          </td>
                          <td>
                            <strong>
                              {totals.loggedInStudents -
                                totals.completedStudents}
                            </strong>
                          </td>
                          <td>
                            <strong>
                              {totals.totalStudents - totals.loggedInStudents}
                            </strong>
                          </td>
                          <td colSpan="2"></td>
                        </tr>
                      );
                    })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !error && allData.length === 0 && (
          <div className="sac-no-data">
            <p>No data available for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminCount;
