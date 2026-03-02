import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../navBar/navBar';
import './AttendanceDownload.css';
import moment from 'moment';

const AttendanceDownload = () => {
  const [departmentId, setDepartmentId] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [loadingButton, setLoadingButton] = useState('');
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchDetails, setBatchDetails] = useState({}); // { batchNo: batchDate }
  const [controller, setController] = useState('');
  const [isControllerPasswordVisible, setIsControllerPasswordVisible] = useState(false);
  const [center, setCenter] = useState();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchDepartments();
    fetchSettings();
    setCenter(localStorage.getItem('center'));
  }, []);

  useEffect(() => {
    console.log('Department useEffect triggered, departmentId:', departmentId);
    if (departmentId) {
      console.log('Department selected, calling fetchBatches');
      fetchBatches();
      setBatchNo(''); // Reset batch selection when department changes
      setIsControllerPasswordVisible(false);
    } else {
      console.log('No department selected, clearing batches');
      setBatches([]);
      setBatchNo('');
      setIsControllerPasswordVisible(false);
    }
  }, [departmentId]);

  useEffect(() => {
    if (batchNo && departmentId) {
      fetchController();
    } else {
      setIsControllerPasswordVisible(false);
    }
  }, [batchNo, departmentId]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('https://www.shorthandonlineexam.in/report-settings', { withCredentials: true });
      setSettings(response.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const fetchDepartments = async () => {
    console.log('fetchDepartments called');
    try {
      console.log('Making request to:', 'https://www.shorthandonlineexam.in/get-active-departments');
      const response = await axios.get('https://www.shorthandonlineexam.in/get-active-departments');
      console.log('Departments response received:', response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      console.error("Error response:", error.response);
      setError("Failed to fetch departments. Please try again later.");
    }
  };

  const fetchController = async () => {
    try {
      const response = await axios.post('https://www.shorthandonlineexam.in/get-batch-controller-password', {
        batchNo,
        departmentId
      });
      if (response.data && response.data.results.length > 0) {
        setController(response.data.results[0].controller_pass);
        setIsControllerPasswordVisible(true);
      } else {
        setIsControllerPasswordVisible(false);
      }
    } catch (error) {
      console.log(error);
      setIsControllerPasswordVisible(false);
    }
  };

  const fetchBatches = async () => {
    console.log('fetchBatches function called with departmentId:', departmentId);
    try {
      console.log('Making POST request to get batches...');
      const response = await axios.post('https://www.shorthandonlineexam.in/track-students-on-exam-center-code', {
        departmentId
      });
      console.log('Batches response:', response.data);

      // Extract batch numbers from the array of objects if needed
      const batchData = Array.isArray(response.data) ? response.data : [];

      const details = {};
      const batchNumbers = batchData.map(item => {
        if (typeof item === 'object' && item.batchNo) {
          details[item.batchNo] = { batchdate: item.batchdate, start_time: item.start_time };
          return item.batchNo;
        }
        return item;
      });

      setBatchDetails(details);
      const distinctBatches = [...new Set(batchNumbers)].sort((a, b) => a - b);
      setBatches(distinctBatches);
      console.log('Processed batches:', distinctBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      console.error("Error details:", error.response?.data);
      setError("No batches available.");
      setBatches([]);
    }
  };

  const checkRestriction = (reportKey) => {
    const setting = settings[reportKey];
    if (!setting || !setting.enabled) return { allowed: true };
    if (!batchNo) return { allowed: true }; // Should not happen if button enabled

    const batchInfo = batchDetails[batchNo];
    if (!batchInfo) {
      // If date is missing, default to allow
      console.warn("Batch info missing for restriction check");
      return { allowed: true };
    }

    const batchDate = typeof batchInfo === 'object' ? batchInfo.batchdate : batchInfo;
    const startTime = typeof batchInfo === 'object' ? batchInfo.start_time : null;

    const examDate = moment(batchDate);
    const now = moment();

    if (setting.type === 'days_before') {
      // Exam Date - X days
      const allowedDate = examDate.clone().subtract(setting.value, 'days').startOf('day');
      // allow if now >= allowedDate
      if (now.isBefore(allowedDate)) {
        return { allowed: false, message: `This report is available from ${allowedDate.format('DD/MM/YYYY')}` };
      }
    } else if (setting.type === 'minutes_before') {
      if (startTime) {
        // Proper minutes check using exam start time
        const timeParts = startTime.split(':');
        const examDateTime = examDate.clone().set({
          hour: parseInt(timeParts[0]),
          minute: parseInt(timeParts[1]),
          second: 0
        });
        const diffMinutes = examDateTime.diff(now, 'minutes');
        // Allow if exam is within 'value' minutes ahead (or already started/past)
        if (diffMinutes > parseInt(setting.value)) {
          const allowedTime = examDateTime.clone().subtract(setting.value, 'minutes');
          return { allowed: false, message: `This report is available from ${allowedTime.format('DD/MM/YYYY hh:mm A')}` };
        }
      } else {
        // No start_time available, fallback: allow on exam day or after
        const allowedDate = examDate.clone().startOf('day');
        if (now.isBefore(allowedDate)) {
          return { allowed: false, message: `This report is available on exam day` };
        }
      }
    }

    return { allowed: true };
  };

  const handleDownload = async (reportType) => {
    // Check restrictions
    let restrictionKey = null;
    if (reportType === 'attendance') restrictionKey = 'REPORT_ATTENDANCE';
    else if (reportType === 'studnetId-password') restrictionKey = 'REPORT_PASSWORD_PDF';
    else if (reportType === 'absentee') restrictionKey = 'REPORT_ABSENTEE';
    else if (reportType === 'answer-sheet') restrictionKey = 'REPORT_ANSWER_SHEET';
    else if (reportType === 'seating-arrangement') restrictionKey = 'REPORT_SEATING';

    if (restrictionKey) {
      const check = checkRestriction(restrictionKey);
      if (!check.allowed) {
        setError(check.message);
        return;
      }
    }

    setLoadingButton(reportType);
    setError('');

    try {
      const response = await axios({
        url: `https://www.shorthandonlineexam.in/center/${reportType}-pdf-download`,
        method: 'POST',
        data: { batchNo, departmentId },
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'];
      if (contentType === 'application/pdf') {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `${reportType}_report_batch_${batchNo}_center_${localStorage.getItem('center')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL);
      } else {
        const reader = new FileReader();
        reader.onload = function () {
          setError("Download is not available at this time.");
        };
        reader.readAsText(response.data);
      }
    } catch (err) {
      console.error(`Error downloading the ${reportType} PDF:`, err);
      setError("Download is not available at this time.");
    } finally {
      setLoadingButton('');
    }
  };

  const handleExcelDownload = async () => {
    // Check restrictions for Excel Password
    const check = checkRestriction('REPORT_PASSWORD_PDF'); // Using same key as PDF
    if (!check.allowed) {
      setError(check.message);
      return;
    }

    setLoadingButton('excel');
    setError('');

    try {
      const response = await axios({
        url: 'https://www.shorthandonlineexam.in/center/studentId-password',
        method: 'POST',
        data: { batchNo, departmentId },
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      const contentType = response.headers['content-type'];
      if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const file = new Blob([response.data], { type: contentType });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `studentId_password_batch_${batchNo}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(fileURL);
      } else {
        const reader = new FileReader();
        reader.onload = function () {
          setError("Excel download is not available at this time.");
        };
        reader.readAsText(response.data);
      }
    } catch (err) {
      console.error('Error downloading the Excel file:', err);
      setError("Excel download is not available at this time.");
    } finally {
      setLoadingButton('');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="attendance-download">
        <div className="attendance-download__wrapper">
          <h2 className="attendance-download__title">Download Reports</h2>
          <form className="attendance-download__form">
            <div className="attendance-download__form-group">
              <label htmlFor="departmentId" className="attendance-download__label">Department:</label>
              <select
                className="attendance-download__select"
                id="departmentId"
                value={departmentId}
                onChange={(e) => {
                  console.log('Department dropdown changed to:', e.target.value);
                  setDepartmentId(e.target.value);
                }}
                required
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department.departmentId} value={department.departmentId}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="attendance-download__form-group">
              <label htmlFor="batchNo" className="attendance-download__label">Batch Number:</label>
              <select
                className="attendance-download__select"
                id="batchNo"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                required
                disabled={!departmentId}
              >
                <option value="">
                  {!departmentId ? "Please select a department first" : "Select a batch number"}
                </option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            <div className="attendance-download__button-group">
              <button
                type="button"
                className="attendance-download__btn"
                disabled={loadingButton !== '' || !batchNo || !departmentId}
                onClick={() => handleDownload('absentee')}
              >
                {loadingButton === 'absentee' ? 'Generating...' : 'Download Absentee Report'}
              </button>
              <button
                type="button"
                className="attendance-download__btn"
                disabled={loadingButton !== '' || !batchNo || !departmentId}
                onClick={() => handleDownload('attendance')}
              >
                {loadingButton === 'attendance' ? 'Generating...' : 'Download Attendance Report'}
              </button>

              <button
                type="button"
                className="attendance-download__btn"
                disabled={loadingButton !== '' || !batchNo || !departmentId}
                onClick={() => handleDownload('answer-sheet')}
              >
                {loadingButton === 'answer-sheet' ? 'Generating...' : 'Download Student Answersheet'}
              </button>
              <button
                type="button"
                className="attendance-download__btn"
                disabled={loadingButton !== '' || !batchNo || !departmentId}
                onClick={() => handleDownload('blank-answer-sheet')}
              >
                {loadingButton === 'blank-answer-sheet' ? 'Generating...' : 'Download Blank Answersheet'}
              </button>
              <button
                type="button"
                className="attendance-download__btn"
                disabled={loadingButton !== '' || !batchNo || !departmentId}
                onClick={() => handleDownload('seating-arrangement')}
              >
                {loadingButton === 'seating-arrangement' ? 'Generating...' : 'Download Seating Arrangement'}
              </button>
              <button
                type="button"
                className="attendance-download__btn"
                disabled={loadingButton !== '' || !batchNo || !departmentId}
                onClick={() => handleDownload('studnetId-password')}
              >
                {loadingButton === 'studnetId-password' ? 'Generating...' : 'Download Student Id and Password(PDF)'}
              </button>
              <button
                type="button"
                className="attendance-download__btn"
                disabled={loadingButton !== '' || !batchNo || !departmentId}
                onClick={handleExcelDownload}
              >
                {loadingButton === 'excel' ? 'Generating...' : 'Download Student Id and Password(Excel)'}
              </button>
            </div>
          </form>
          {error && <div className="attendance-download__alert">{error}</div>}
        </div>
        {isControllerPasswordVisible && (
          <div className="attendance-download__controller-password">
            Controller Password for this Batch is: {controller}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDownload;

