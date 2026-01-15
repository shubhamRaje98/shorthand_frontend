import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./StudentTable.css";
import NavBar from "../navBar/navBar";
import * as XLSX from "xlsx";
import moment from "moment-timezone";

const isValidData = (value) => {
    // Check for obviously invalid values first
    if (!value || value === "invalid date" || value === "0" || value === "" || value === null || value === undefined) {
        return false;
    }

    // If it's already a formatted string with time, consider it valid
    // Pattern: DD/MM/YYYY HH:MM AM/PM
    const formattedPattern = /^\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{2}\s(AM|PM)$/;
    if (formattedPattern.test(value)) {
        return true;
    }

    // For other formats, try to parse as date
    try {
        const date = new Date(value);
        return !isNaN(date.getTime());
    } catch (error) {
        return false;
    }
};

const getCellClass = (item, field, exam_type) => {
  let stages;
  if (exam_type === "shorthand") {
    stages = [
      "loginTime",
      "trial_time",
      "audio1_time",
      "passage1_time",
      "feedback_time",
    ];
  } else if (exam_type === "typewriting") {
    stages = [
      "loginTime",
      "trial_passage_time",
      "typing_passage_time",
      "feedback_time",
    ];
  } else {
    stages = [
      "loginTime",
      "trial_time",
      "audio1_time",
      "passage1_time",
      "feedback_time",
    ];
  }
  const currentStageIndex = stages.indexOf(field);

  if (currentStageIndex === -1) return "";

  if (field === "loginTime") {
    return isValidData(item[field])
      ? "dept-cell-green dept-text-white"
      : "dept-cell-red dept-text-white";
  }

  if (field === "feedback_time") {
    if (isValidData(item[field])) {
      return "dept-cell-green dept-text-white";
    } else {
      return "dept-cell-red dept-text-white";
    }
  }

  if (isValidData(item[field])) {
    if (
      currentStageIndex === stages.length - 1 ||
      isValidData(item[stages[currentStageIndex + 1]])
    ) {
      return "dept-cell-green dept-text-white";
    } else if (
      currentStageIndex > 0 &&
      currentStageIndex < stages.length - 1
    ) {
      const prevCellGreen = isValidData(item[stages[currentStageIndex - 1]]);
      const nextCellRed = !isValidData(item[stages[currentStageIndex + 1]]);
      if (prevCellGreen && nextCellRed) {
        return "dept-cell-yellow dept-text-black";
      } else {
        return "dept-cell-green dept-text-white";
      }
    } else {
      return "dept-cell-green dept-text-white";
    }
  } else if (
    currentStageIndex > 0 &&
    isValidData(item[stages[currentStageIndex - 1]])
  ) {
    return "dept-cell-red dept-text-black";
  } else {
    return "dept-cell-red dept-text-white";
  }
};

const StudentTable = () => {
  const [data, setData] = useState([]);
  const [batchNo, setBatchNo] = useState("");
  const [subject, setSubject] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [exam_type, setExam_type] = useState("shorthand");
  const [batchDate, setBatchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateInterval, setUpdateInterval] = useState(100000);
  const [batches, setBatches] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [batchDates, setBatchDates] = useState([]);
  const [total_login_count, setTotal_login_count] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Current filters state for refresh
  const [currentFilters, setCurrentFilters] = useState({});

  const formatDate = (dateString) => {
    if (!dateString || dateString === "invalid date" || dateString === "0") {
      return "";
    }

    const dateStr = String(dateString);
    const dateTimeMatch = dateStr.match(
      /(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):?(\d{2})?/
    );

    if (dateTimeMatch) {
      const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
      const formattedDate = `${day}/${month}/${year}`;

      let hour = parseInt(hours, 10);
      const minute = minutes;
      const ampm = hour >= 12 ? "PM" : "AM";

      if (hour === 0) {
        hour = 12;
      } else if (hour > 12) {
        hour = hour - 12;
      }

      const formattedTime = `${hour
        .toString()
        .padStart(2, "0")}:${minute} ${ampm}`;
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

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Fetch all filter options from super admin API
  const fetchFilterOptions = async () => {
    try {
      console.log("Fetching filter options from super admin API...");
      const response = await axios.post(
        'http://localhost:3000/super-admin-student-track-dashboard',
        {},
        { withCredentials: true }
      );

      if (response.data && response.data.length > 0) {
        console.log("Filter options data received:", response.data.length, "records");

        const uniqueBatches = [...new Set(response.data
          .map(item => item.batchNo)
          .filter(batch => batch && batch !== "" && batch !== null && batch !== undefined)
        )].sort();
        setBatches(uniqueBatches);

        const uniqueDepartments = [...new Set(response.data
          .map(item => item.departmentId)
          .filter(dept => dept && dept !== "" && dept !== null && dept !== undefined)
        )].sort();
        setDepartments(uniqueDepartments);

        const uniqueSubjects = [...new Set(response.data
          .map(item => item.subject_name)
          .filter(subject => subject && subject !== "" && subject !== null && subject !== undefined)
        )];
        setSubjects(uniqueSubjects);

        const uniqueBatchDates = [...new Set(response.data
          .filter(item => item.batchdate && item.batchdate !== "invalid date" && item.batchdate !== "0")
          .map(item => normalizeDateForFilter(item.batchdate))
          .filter(date => date !== null)
        )].sort().reverse();
        setBatchDates(uniqueBatchDates);
      }
    } catch (error) {
      console.error('Error fetching filter options from super admin API:', error);
      await fetchLocalFilterOptions();
    }
  };

  // Fallback method to fetch filter options from local center admin API
  const fetchLocalFilterOptions = async () => {
    try {
      console.log("Fetching local filter options...");
      // FIXED: Use the correct endpoint with "all" parameter to get all data for filter options
      const url = "http://localhost:3000/track-students-on-exam-center-code/all";
      const response = await axios.post(url, { withCredentials: true });

      if (response.data && response.data.length > 0) {
        const uniqueBatches = [...new Set(
          response.data
            .map((item) => item.batchNo)
            .filter((batch) => batch && batch !== "")
        )].sort();
        setBatches(uniqueBatches);

        const uniqueDepartments = [...new Set(
          response.data
            .map((item) => item.departmentId)
            .filter((dept) => dept && dept !== "")
        )].sort();
        setDepartments(uniqueDepartments);

        const uniqueSubjects = [...new Set(
          response.data
            .map((item) => item.subject_name)
            .filter((subject) => subject && subject !== "")
        )];
        setSubjects(uniqueSubjects);

        const uniqueBatchDates = [...new Set(
          response.data
            .filter((item) => 
              item.batchdate && 
              item.batchdate !== "invalid date" && 
              item.batchdate !== "0"
            )
            .map((item) => normalizeDateForFilter(item.batchdate))
            .filter((date) => date !== null)
        )].sort().reverse();
        setBatchDates(uniqueBatchDates);
      }
    } catch (error) {
      console.error("Error fetching local filter options:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/subjects");
      if (response.data.subjects) {
        setAllSubjects(response.data.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Failed to fetch subjects");
    }
  };

  // Calculate total login count from current data
  const calculateTotalLoginCount = (dataSet) => {
    const loginCount = dataSet.filter((item) => 
      item.loginTime && 
      item.loginTime !== "invalid date" && 
      item.loginTime !== "0" &&
      isValidData(item.loginTime)
    ).length;
    setTotal_login_count(loginCount);
  };

  // FIXED: Updated fetchData function with corrected URL construction
  const fetchData = async (preserveFilters = false) => {
    setLoading(true);
    setError("");

    const filters = preserveFilters
      ? currentFilters
      : {
          subject,
          loginStatus,
          batchNo,
          exam_type,
          departmentId,
          batchDate
        };

    try {
      // FIXED: Always use the student tracking endpoint with proper batch handling
      let url = "http://localhost:3000/track-students-on-exam-center-code/";

      // If batchNo is selected, use it; otherwise, use "all" to get all batches
      if (filters.batchNo && filters.batchNo.trim() !== "") {
        url += filters.batchNo;
      } else {
        url += "all";
      }

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
      console.log("Filters being applied:", filters);

      const response = await axios.post(url, { withCredentials: true });
      console.log("Response data length:", response.data.length);

      setData(response.data);
      setTotalPages(Math.ceil(response.data.length / (rowsPerPage === "all" ? response.data.length : rowsPerPage)));

      calculateTotalLoginCount(response.data);

      if (!preserveFilters) {
        setCurrentFilters(filters);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 404) {
        setError(
          "No students found for the selected filter criteria. Please try different filters."
        );
        setData([]);
        setTotal_login_count(0);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    }
    setLoading(false);
  };

  // Refresh function that preserves filters
  const refreshData = useCallback(() => {
    console.log("Refreshing data with current filters:", currentFilters);
    fetchData(true);
  }, [currentFilters]);

  // Filter change handlers
  const handleFilterChange = (filterName, value) => {
    console.log(`Filter changed: ${filterName} = ${value}`);

    // Update individual state immediately
    switch (filterName) {
      case "batchNo":
        setBatchNo(value);
        break;
      case "subject":
        setSubject(value);
        break;
      case "loginStatus":
        setLoginStatus(value);
        break;
      case "exam_type":
        setExam_type(value);
        break;
      case "batchDate":
        setBatchDate(value);
        break;
      case "departmentId":
        setDepartmentId(value);
        break;
    }

    setCurrentPage(1);

    const newFilters = { 
      subject: filterName === "subject" ? value : subject,
      loginStatus: filterName === "loginStatus" ? value : loginStatus,
      batchNo: filterName === "batchNo" ? value : batchNo,
      exam_type: filterName === "exam_type" ? value : exam_type,
      departmentId: filterName === "departmentId" ? value : departmentId,
      batchDate: filterName === "batchDate" ? value : batchDate,
    };

    setCurrentFilters(newFilters);

    setTimeout(() => {
      fetchDataWithFilters(newFilters);
    }, 300);
  };

  // FIXED: Separate function to fetch data with specific filters
  const fetchDataWithFilters = async (filters) => {
    setLoading(true);
    setError("");

    try {
      // FIXED: Use the same URL construction logic as fetchData
      let url = "http://localhost:3000/track-students-on-exam-center-code/";

      // If batchNo is selected, use it; otherwise, use "all"
      if (filters.batchNo && filters.batchNo.trim() !== "") {
        url += filters.batchNo;
      } else {
        url += "all";
      }

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

      console.log("Fetching filtered data from URL:", url);

      const response = await axios.post(url, { withCredentials: true });
      console.log("Filtered response data length:", response.data.length);

      setData(response.data);
      setTotalPages(Math.ceil(response.data.length / (rowsPerPage === "all" ? response.data.length : rowsPerPage)));

      calculateTotalLoginCount(response.data);

    } catch (error) {
      console.error("Error fetching filtered data:", error);
      if (error.response && error.response.status === 404) {
        setError(
          "No students found for the selected filter criteria. Please try different filters."
        );
        setData([]);
        setTotal_login_count(0);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    }
    setLoading(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setBatchNo("");
    setSubject("");
    setLoginStatus("");
    setExam_type("");
    setBatchDate("");
    setDepartmentId("");
    setCurrentFilters({});
    setCurrentPage(1);

    setTimeout(() => {
      fetchData(false);
    }, 100);
  };

  useEffect(() => {
    fetchSubjects();
    fetchFilterOptions();
    setTimeout(() => {
      fetchData(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, refreshData]);

  useEffect(() => {
    const actualRowsPerPage = rowsPerPage === "all" ? data.length : parseInt(rowsPerPage);
    setTotalPages(Math.ceil(data.length / actualRowsPerPage));
    setCurrentPage(1);
  }, [data, rowsPerPage]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "Batch Number": item.batchNo,
        "Center": item.center,
        "Department": item.departmentId,
        "Seat No": item.student_id,
        "Student Name": item.fullname,
        "Subject": item.subject_name,
        "Batch Date": formatDateForDisplay(item.batchdate),
        Login: formatDate(item.loginTime),
        Trial: formatDate(item.trial_time),
        "Audio Track A": formatDate(item.audio1_time),
        "Passage A": formatDate(item.passage1_time),
        "Trial Typing": formatDate(item.trial_passage_time),
        "Typing Passage": formatDate(item.typing_passage_time),
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
      <div className="pagination-container" style={{ marginTop: "20px" }}>
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => page !== "..." && handlePageChange(page)}
            className={`btn ${
              currentPage === page ? "btn-primary" : "btn-secondary"
            } me-1`}
            disabled={page === "..."}
            style={{ margin: "0 2px" }}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <NavBar />
      <div className="home-container">
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-md-3 col-sm-6 mb-2">
              <label htmlFor="batchNo" className="form-label">
                Batch Number:
              </label>
              <select
                className="form-select scrollable-dropdown"
                id="batchNo"
                value={batchNo}
                onChange={(e) => handleFilterChange("batchNo", e.target.value)}
              >
                <option value="">All Batches</option>
                {batches.map((batch, index) => (
                  <option key={index} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <label htmlFor="subject" className="form-label">
                Subject:
              </label>
              <select
                className="form-select scrollable-dropdown"
                id="subject"
                value={subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                <option value="">All Subjects</option>
                {allSubjects.map((subj) => (
                  <option key={subj.subjectId} value={subj.subject_name}>
                    {subj.subject_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <label htmlFor="loginStatus" className="form-label">
                Login Status:
              </label>
              <select
                className="form-select"
                id="loginStatus"
                value={loginStatus}
                onChange={(e) =>
                  handleFilterChange("loginStatus", e.target.value)
                }
              >
                <option value="">All</option>
                <option value="loggedin">Logged In</option>
                <option value="loggedout">Logged Out</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <label htmlFor="examStatus" className="form-label">
                Exam Status:
              </label>
              <select
                className="form-select"
                id="examStatus"
                value={exam_type}
                onChange={(e) =>
                  handleFilterChange("exam_type", e.target.value)
                }
              >

                <option value="shorthand">Short Hand</option>
                <option value="typewriting">Type Writing</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 col-sm-6 mb-2">
              <label htmlFor="batchDate" className="form-label">
                Batch Date:
              </label>
              <select
                className="form-select"
                id="batchDate"
                value={batchDate}
                onChange={(e) =>
                  handleFilterChange("batchDate", e.target.value)
                }
              >
                <option value="">All Dates</option>
                {batchDates.map((date, index) => (
                  <option key={index} value={date}>
                    {formatDateForDisplay(date)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <label htmlFor="department" className="form-label">
                Department:
              </label>
              <select
                className="form-select scrollable-dropdown"
                id="department"
                value={departmentId}
                onChange={(e) =>
                  handleFilterChange("departmentId", e.target.value)
                }
              >
                <option value="">All Departments</option>
                {departments.map((departmentOption, index) => (
                  <option key={index} value={departmentOption}>
                    {departmentOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <label htmlFor="rowsPerPage" className="form-label">
                Rows per page:
              </label>
              <select
                className="form-select"
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12 col-sm-12 mb-2 d-flex align-items-center flex-wrap">
              <button
                onClick={exportToExcel}
                className="btn btn-primary me-3 mb-2"
              >
                Export to Excel
              </button>
              <button
                onClick={() => refreshData()}
                className="btn btn-secondary me-3 mb-2"
              >
                Refresh Now
              </button>
              <button
                onClick={clearAllFilters}
                className="btn btn-outline-secondary me-3 mb-2"
              >
                Clear All Filters
              </button>
              <div className="ms-3 mb-2">
                <span className="fw-bold">
                  Total students: {data.length} |{" "}
                </span>
                <span className="fw-bold">
                  Total logged in:{" "}
                </span>
                <span className="badge bg-success">{total_login_count}</span>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading data...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          ) : data.length > 0 ? (
            <>
              <div className="table-container">
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "8%" }}>Batch No</th>
                      <th style={{ width: "8%" }}>Center</th>
                      <th style={{ width: "8%" }}>Department</th>
                      <th style={{ width: "12%" }}>Seat No</th>
                      <th>Login</th>
                      {exam_type !== "typewriting" && <th>Trial</th>}
                      {exam_type !== "typewriting" && (
                        <>
                          <th>Audio Track A</th>
                          <th>Passage A</th>
                        </>
                      )}
                      {exam_type !== "shorthand" && (
                        <>
                          <th>Trial Typing</th>
                          <th>Typing Test</th>
                        </>
                      )}
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedData().map((item, index) => (
                      <tr key={index}>
                        <td>{item.batchNo}</td>
                        <td>{item.center}</td>
                        <td>{item.departmentId}</td>
                        <td>{item.student_id}</td>
                        <td className={getCellClass(item, "loginTime", exam_type)}>
                          {formatDate(item.loginTime)}
                        </td>
                        {exam_type !== "typewriting" && (
                          <td
                            className={getCellClass(item, "trial_time", exam_type)}
                          >
                            {formatDate(item.trial_time)}
                          </td>
                        )}
                        {exam_type !== "typewriting" && (
                          <>
                            <td
                              className={getCellClass(
                                item,
                                "audio1_time",
                                exam_type
                              )}
                            >
                              {formatDate(item.audio1_time)}
                            </td>
                            <td
                              className={getCellClass(
                                item,
                                "passage1_time",
                                exam_type
                              )}
                            >
                              {formatDate(item.passage1_time)}
                            </td>
                          </>
                        )}
                        {exam_type !== "shorthand" && (
                          <>
                            <td
                              className={getCellClass(
                                item,
                                "trial_passage_time",
                                exam_type
                              )}
                            >
                              {formatDate(item.trial_passage_time)}
                            </td>
                            <td
                              className={getCellClass(
                                item,
                                "typing_passage_time",
                                exam_type
                              )}
                            >
                              {formatDate(item.typing_passage_time)}
                            </td>
                          </>
                        )}
                        <td
                          className={getCellClass(item, "feedback_time", exam_type)}
                        >
                          {formatDate(item.feedback_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPaginationButtons()}
            </>
          ) : (
            <div className="text-center p-4">
              <p>
                No records found for the selected criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTable;




