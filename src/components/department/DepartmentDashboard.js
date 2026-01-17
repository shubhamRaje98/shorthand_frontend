import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./DepartmentDashboard.css";
import DepartmentNavBar from "./DepartmentNavBar";
import * as XLSX from "xlsx";
import moment from "moment-timezone";

// Importing the utility functions
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
  // Treat '' (All) and 'shorthand' as GCC
  if (exam_type === "shorthand" || exam_type === "") {
    stages = [
      "loginTime",
      "trial_time",
      "audio1_time",
      "passage1_time",
      "audio2_time",
      "passage2_time",
      "feedback_time",
    ];
  } else { // 'typewriting', 'both' -> SKILL
    stages = [
      "loginTime",
      "trial_passage_time",
      "typing_passage_time",
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
    } else if (currentStageIndex > 0 && currentStageIndex < stages.length - 1) {
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

const DepartmentDashboard = () => {
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
  const [center, setCenter] = useState("");
  const [centers, setCenters] = useState([]);
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

  // Fetch all filter options from backend
  const fetchFilterOptions = async () => {
    try {
      console.log("🔍 Fetching filter options...");
      const response = await axios.post(
        "https://www.shorthandonlineexam.in/track-students-on-department-code",
        {},
        { withCredentials: true }
      );

      if (response.data && response.data.length > 0) {
        console.log("📊 Total records received:", response.data.length);

        // Log ALL raw batchdates from response
        const allRawDates = response.data.map((item) => ({
          original: item.batchdate,
          type: typeof item.batchdate,
          studentId: item.student_id,
        }));

        console.log(
          "🗓️ First 10 raw batchdates from backend:",
          allRawDates.slice(0, 10)
        );

        // Process dates WITHOUT timezone conversion
        const processedDates = response.data
          .filter((item) => {
            const date = item.batchdate;
            const isValid =
              date &&
              date !== "invalid date" &&
              date !== "0" &&
              date !== "" &&
              date !== null &&
              date !== undefined;
            return isValid;
          })
          .map((item) => {
            const date = item.batchdate;
            console.log("🔄 Processing date:", date, typeof date);

            // Handle string dates
            if (typeof date === "string") {
              // If it's already in YYYY-MM-DD format
              if (date.match(/^\d{4}-\d{2}-\d{2}/)) {
                const result = date.split("T")[0]; // Remove time part if exists
                console.log("  ✅ YYYY-MM-DD format:", date, "→", result);
                return result;
              }
              // If it's in DD/MM/YYYY format
              if (date.includes("/")) {
                const [day, month, year] = date.split("/");
                const result = `${year}-${month.padStart(
                  2,
                  "0"
                )}-${day.padStart(2, "0")}`;
                console.log("  ✅ DD/MM/YYYY format:", date, "→", result);
                return result;
              }
            }

            // Handle Date objects or other formats WITHOUT timezone conversion
            if (date instanceof Date) {
              // Use local date components to avoid timezone shift
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const result = `${year}-${month}-${day}`;
              console.log("  ✅ Date object:", date, "→", result);
              return result;
            }

            // Try to parse as date but avoid timezone issues
            try {
              const parsed = new Date(date);
              if (!isNaN(parsed.getTime())) {
                // Use local date components instead of toISOString()
                const year = parsed.getFullYear();
                const month = String(parsed.getMonth() + 1).padStart(2, "0");
                const day = String(parsed.getDate()).padStart(2, "0");
                const result = `${year}-${month}-${day}`;
                console.log("  ✅ Parsed date (local):", date, "→", result);
                return result;
              }
            } catch (e) {
              console.error("  ❌ Error parsing date:", date, e);
            }

            console.log("  ❌ Could not process:", date);
            return null;
          })
          .filter((date) => date !== null);

        console.log("🔄 Processed dates:", processedDates);

        const uniqueBatchDates = [...new Set(processedDates)].sort().reverse();
        console.log("🎯 Final unique batch dates:", uniqueBatchDates);

        setBatchDates(uniqueBatchDates);
        console.log("📝 Set to state:", uniqueBatchDates);

        // Get other filter options...
        const uniqueBatches = [
          ...new Set(
            response.data
              .map((item) => item.batchNo)
              .filter(
                (batch) =>
                  batch && batch !== "" && batch !== null && batch !== undefined
              )
          ),
        ].sort();
        setBatches(uniqueBatches);

        // Get unique centers
        const uniqueCenters = [
          ...new Set(
            response.data
              .map((item) => item.center)
              .filter(
                (center) =>
                  center &&
                  center !== "" &&
                  center !== null &&
                  center !== undefined
              )
          ),
        ].sort();
        setCenters(uniqueCenters);
      }
    } catch (error) {
      console.error("❌ Error fetching filter options:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("https://www.shorthandonlineexam.in/subjects");
      if (response.data.subjects) {
        setAllSubjects(response.data.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Failed to fetch subjects");
    }
  };

  // Update fetchData to use the new function
  const fetchData = async (preserveFilters = false) => {
    const filters = preserveFilters
      ? currentFilters
      : {
        batchNo,
        subject,
        loginStatus,
        center,
        exam_type,
        batchDate,
      };

    if (!preserveFilters) {
      setCurrentFilters(filters);
    }

    await fetchDataWithFilters(filters);
  };

  // Update fetchTotalLoginCount to use correct mapping
  const fetchTotalLoginCount = async (filters = currentFilters) => {
    try {
      const requestBody = {};

      if (filters.center && filters.center.trim()) {
        requestBody.center = filters.center.trim();
      }
      if (filters.batchNo && filters.batchNo.trim()) {
        requestBody.batchNo = filters.batchNo.trim();
      }
      if (filters.subject && filters.subject.trim()) {
        requestBody.subject_name = filters.subject.trim(); // Map to subject_name
      }
      if (filters.loginStatus && filters.loginStatus.trim()) {
        requestBody.loginStatus = filters.loginStatus.trim();
      }
      if (filters.exam_type && filters.exam_type.trim()) {
        requestBody.exam_type = filters.exam_type.trim();
      }
      if (filters.batchDate && filters.batchDate.trim()) {
        requestBody.batchDate = filters.batchDate.trim();
      }

      console.log(
        "🔢 Fetching department login count with filters:",
        requestBody
      );

      const response = await axios.post(
        "https://www.shorthandonlineexam.in/total-login-count",
        requestBody,
        { withCredentials: true }
      );

      if (response.data) {
        console.log("🔢 Login count response:", response.data);
        setTotal_login_count(response.data.total_count);
      }
    } catch (error) {
      console.log("❌ Error fetching login count:", error);
      setTotal_login_count(0);
    }
  };
  // Debounced fetch data for filter changes
  const debouncedFetchData = useCallback(
    debounce(() => fetchData(false), 500),
    []
  );

  // Refresh function that preserves filters
  const refreshData = useCallback(() => {
    console.log(
      "Refreshing department data with current filters:",
      currentFilters
    );
    fetchData(true); // Preserve current filters
    fetchTotalLoginCount(currentFilters);
  }, [currentFilters]);

  // Fix the filter change handler
  const handleFilterChange = (filterName, value) => {
    console.log(`Department filter changed: ${filterName} = ${value}`);

    // Update individual state first
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
      case "center":
        setCenter(value);
        break;
    }

    // Create new filters object
    const newFilters = {
      ...currentFilters,
      [filterName]: value,
    };
    setCurrentFilters(newFilters);

    // Reset to first page when filters change
    setCurrentPage(1);

    // Clear any existing timeouts
    clearTimeout(window.filterTimeout);

    // Trigger fetch with delay
    window.filterTimeout = setTimeout(() => {
      console.log("Triggering fetch with filters:", newFilters);
      fetchDataWithFilters(newFilters);
      fetchTotalLoginCount(newFilters);
    }, 300);
  };

  // Create a separate function for fetching with specific filters
  const fetchDataWithFilters = async (filters) => {
    setLoading(true);
    setError("");

    try {
      // Build request body with proper mapping
      const requestBody = {};

      if (filters.batchNo && filters.batchNo.trim()) {
        requestBody.batchNo = filters.batchNo.trim();
      }
      if (filters.subject && filters.subject.trim()) {
        requestBody.subject_name = filters.subject.trim(); // Map to subject_name
      }
      if (filters.loginStatus && filters.loginStatus.trim()) {
        requestBody.loginStatus = filters.loginStatus.trim();
      }
      if (filters.center && filters.center.trim()) {
        requestBody.center = filters.center.trim();
      }
      if (filters.exam_type && filters.exam_type.trim()) {
        requestBody.exam_type = filters.exam_type.trim();
      }
      if (filters.batchDate && filters.batchDate.trim()) {
        const dateParts = filters.batchDate.trim().split("-");
        if (dateParts.length === 3) {
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
          requestBody.batchDate = formattedDate;
        } else {
          requestBody.batchDate = filters.batchDate.trim();
        }
      }

      console.log("🚀 Sending request body:", requestBody);

      const response = await axios.post(
        "https://www.shorthandonlineexam.in/track-students-on-department-code",
        requestBody,
        { withCredentials: true }
      );

      console.log("📨 Response:", response.data);
      setData(response.data);
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      if (error.response && error.response.status === 404) {
        setError("No students found for the selected filter criteria.");
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
    setCenter("");
    setCurrentFilters({});
    setCurrentPage(1);

    // Fetch data without any filters
    setTimeout(() => {
      fetchData(false);
      fetchTotalLoginCount({});
    }, 100);
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

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / rowsPerPage));
    setCurrentPage(1);
  }, [data, rowsPerPage]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "Batch Number": item.batchNo,
        Center: item.center,
        "Seat No": item.student_id,
        "Student Name": item.fullname,
        Subject: item.subject_name,
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
      `department_student_data_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage =
      event.target.value === "all"
        ? data.length
        : parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const getPaginatedData = () => {
    if (rowsPerPage === "all" || rowsPerPage >= data.length) {
      return data;
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const renderPaginationButtons = () => {
    if (rowsPerPage === "all" || rowsPerPage >= data.length) {
      return null;
    }

    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((page, index) => (
      <button
        key={index}
        onClick={() => page !== "..." && handlePageChange(page)}
        className={`dept-btn ${currentPage === page ? "dept-btn-primary" : "dept-btn-secondary"
          }`}
        disabled={page === "..."}
      >
        {page}
      </button>
    ));
  };

  return (
    <div>
      <DepartmentNavBar />
      <div className="home-container">
        <div className="dept-container-fluid">
          <div className="dept-row mb-3">
            <div className="dept-col-md-3 dept-col-sm-6 mb-2">
              <label htmlFor="batchNo" className="dept-form-label">
                Batch Number:
              </label>
              <select
                className="dept-form-select dept-scrollable-dropdown"
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
            <div className="dept-col-md-3 dept-col-sm-6 mb-2">
              <label htmlFor="subject" className="dept-form-label">
                Subject:
              </label>
              <select
                className="dept-form-select dept-scrollable-dropdown"
                id="subject"
                value={subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                <option value="">All Subjects</option>
                {allSubjects.filter(subj => {
                  if (!exam_type) return true;
                  if (exam_type === 'shorthand') return subj.examType === 'GCC';
                  if (exam_type === 'typewriting') return subj.examType === 'SKILL';
                  return true;
                }).map((subj) => (
                  <option key={subj.subjectId} value={subj.subject_name}>
                    {subj.subject_name} {(!exam_type || exam_type === 'both') ? `(${subj.examType})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="dept-col-md-3 dept-col-sm-6 mb-2">
              <label htmlFor="loginStatus" className="dept-form-label">
                Login Status:
              </label>
              <select
                className="dept-form-select"
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
            <div className="dept-col-md-3 dept-col-sm-6 mb-2">
              <label htmlFor="examStatus" className="dept-form-label">Exam Type:</label>
              <select
                className="dept-form-select"
                id="examStatus"
                value={exam_type}
                onChange={(e) => handleFilterChange('exam_type', e.target.value)}
              >
                <option value="">GCC (Default)</option>
                <option value="shorthand">GCC</option>
                <option value="typewriting">SKILL</option>
                <option value="both">Both (Legacy)</option>
              </select>
            </div>
          </div>
          <div className="dept-row mb-3">
            <div className="dept-col-md-3 dept-col-sm-6 mb-2">
              <label htmlFor="batchDate" className="dept-form-label">
                Batch Date:
              </label>
              <select
                className="dept-form-select"
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
            <div className="dept-col-md-3 dept-col-sm-6 mb-2">
              <label htmlFor="center" className="dept-form-label">
                Center:
              </label>
              <select
                className="dept-form-select dept-scrollable-dropdown"
                id="center"
                value={center}
                onChange={(e) => handleFilterChange("center", e.target.value)}
              >
                <option value="">All Centers</option>
                {centers.map((centerOption, index) => (
                  <option key={index} value={centerOption}>
                    {centerOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="dept-col-md-3 dept-col-sm-6 mb-2">
              <label htmlFor="rowsPerPage" className="dept-form-label">
                Rows per page:
              </label>
              <select
                className="dept-form-select"
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
          <div className="dept-row mb-3">
            <div className="dept-col-md-12 dept-col-sm-12 mb-2 d-flex align-items-center flex-wrap">
              <button
                onClick={exportToExcel}
                className="dept-btn dept-btn-primary dept-export-btn me-3 mb-2"
              >
                Export to Excel
              </button>
              <button
                onClick={() => refreshData()}
                className="dept-btn dept-btn-secondary me-3 mb-2"
              >
                Refresh Now
              </button>
              <button
                onClick={clearAllFilters}
                className="dept-btn dept-btn-outline-secondary me-3 mb-2"
              >
                Clear All Filters
              </button>
              <div className="dept-total-count-container ms-3 mb-2">
                <span className="dept-total-count-label">
                  Total students: {data.length} |{" "}
                </span>
                <span className="dept-total-count-label">
                  Total logged in:{" "}
                </span>
                <span className="dept-total-count-value">
                  {total_login_count}
                </span>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading filtered data...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          ) : data.length > 0 ? (
            <div className="dept-table-container">
              <table className="dept-table dept-table-bordered dept-table-striped dept-table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "8%" }}>Batch No</th>
                    <th style={{ width: "8%" }}>Center</th>
                    <th style={{ width: "12%" }}>Seat No</th>
                    <th>Login</th>
                    {/* Always show Trial, Audio A, Passage A as they are common now (Trial Typing replaces Trial in SKILL?)
                        Wait, User said "SKILL" has: Login, Trial, AudioA, PassageA, TrialTyping, TypingTest
                        And GCC has: Login, Trial, AudioA, PassageA, AudioB, PassageB
                        So Trial, AudioA, PassageA are COMMON.
                    */}
                    {exam_type !== "typewriting" && <th>Trial</th>}
                    {exam_type !== "typewriting" && (
                      <>
                        <th>Audio Track A</th>
                        <th>Passage A</th>
                      </>
                    )}
                    {(exam_type === "shorthand" || exam_type === "") && (
                      <>
                        <th>Audio Track B</th>
                        <th>Passage B</th>
                      </>
                    )}
                    {(exam_type === "typewriting" || exam_type === "both") && (
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
                      <td className="batch-number-column">{item.batchNo}</td>
                      <td>{item.center}</td>
                      <td>{item.student_id}</td>
                      <td
                        className={getCellClass(item, "loginTime", exam_type)}
                      >
                        {formatDate(item.loginTime)}
                      </td>
                      {exam_type !== "typewriting" && (
                        <td
                          className={getCellClass(
                            item,
                            "trial_time",
                            exam_type
                          )}
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
                      {(exam_type === "shorthand" || exam_type === "") && (
                        <>
                          <td
                            className={getCellClass(
                              item,
                              "audio2_time",
                              exam_type
                            )}
                          >
                            {formatDate(item.audio2_time)}
                          </td>
                          <td
                            className={getCellClass(
                              item,
                              "passage2_time",
                              exam_type
                            )}
                          >
                            {formatDate(item.passage2_time)}
                          </td>
                        </>
                      )}
                      {(exam_type === "typewriting" || exam_type === "both") && (
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
                        className={getCellClass(
                          item,
                          "feedback_time",
                          exam_type
                        )}
                      >
                        {formatDate(item.feedback_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <p>
                No records found for the selected criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
          {data.length > 0 && renderPaginationButtons() && (
            <div className="dept-pagination" style={{ marginTop: "20px" }}>
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;