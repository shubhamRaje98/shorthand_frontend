import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../navBar/navBar';
import './AttendancePage.css';

const AttendancePage = () => {
    const [batches, setBatches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
        fetchReports();
        fetchAllBatches();
    }, []);

    // Simple approach to fetch all batches
    const fetchAllBatches = async () => {
        try {
            // Use the working endpoint with "all" parameter
            const response = await axios.post(
                'http://localhost:3000/track-students-on-exam-center-code/all',
                {},
                { withCredentials: true }
            );

            if (response.data && response.data.length > 0) {
                const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
                setBatches(distinctBatches.filter(batch => batch).sort((a, b) => a - b));
                console.log("Fetched batches:", distinctBatches);
            }
        } catch (error) {
            console.error("Error fetching batches:", error);
            setError("Failed to fetch batches. Please try again later.");
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/get-active-departments');
            setDepartments(response.data || []);
        } catch (error) {
            setError("Failed to fetch departments. Please try again later.");
        }
    };

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:3000/get-attendance-report');
            setReports(response.data.Reports || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setError("Attendance Reports Not added yet!!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSuccess = () => {
        fetchReports();
        fetchAllBatches(); // Refresh batches after upload
    };

    const handleDeleteReport = async (batchNo, departmentId) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm(
            `Are you sure you want to delete the attendance report for Batch ${batchNo} in Department ${departmentId}?`
        );

        if (!isConfirmed) {
            return;
        }

        try {
            console.log(`Attempting to delete report for batch: ${batchNo}, department: ${departmentId}`);

            const response = await axios.post('http://localhost:3000/delete-atttendance', {
                batchNo,
                departmentId
            }, { withCredentials: true });

            console.log("Delete response:", response);

            // Check for successful deletion (might be 200 or 201)
            if (response.status === 200 || response.status === 201) {
                alert(response.data.message || "Report deleted successfully!");

                // Update state by removing the deleted report
                setReports(prevReports =>
                    prevReports.filter(report =>
                        !(report.batchNo == batchNo && report.departmentId == departmentId)
                    )
                );

                // Also refresh the reports from server to ensure consistency
                setTimeout(() => {
                    fetchReports();
                }, 500);
            } else {
                alert("Unexpected response. Please refresh the page to see current status.");
            }
        } catch (error) {
            console.error("Error deleting report:", error);

            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message ||
                    `Server error: ${error.response.status}`;
                alert(`Failed to delete report: ${errorMessage}`);
            } else if (error.request) {
                // Network error
                alert("Network error. Please check your connection and try again.");
            } else {
                // Other error
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="ap-loading-container">
                <div className="ap-loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className="ap-attendance-page">
                <h1 className="ap-main-title">Attendance Management</h1>
                {error && <div className="ap-error-message">{error}</div>}
                <AttendanceUploadForm
                    batches={batches}
                    departments={departments}
                    onUploadSuccess={handleUploadSuccess}
                />
                <AttendanceReportList reports={reports} onDeleteReport={handleDeleteReport} />
            </div>
        </>
    );
};

const AttendanceUploadForm = ({ batches, departments, onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        batchNo: '',
        departmentId: '',
        present_count: '',
        absent_count: '',
        file: null
    });
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [uploadError, setUploadError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Update filtered batches when batches or department changes
    useEffect(() => {
        filterBatchesByDepartment();
    }, [batches, formData.departmentId]);

    const filterBatchesByDepartment = async () => {
        if (!formData.departmentId || !departments.length) {
            setFilteredBatches(batches);
            return;
        }

        try {
            // Get students for the specific department to find available batches
            const response = await axios.post(
                'http://localhost:3000/track-students-on-exam-center-code/all',
                {},
                {
                    withCredentials: true,
                    params: { departmentId: formData.departmentId }
                }
            );

            if (response.data && response.data.length > 0) {
                // Filter data by department ID and get unique batches
                const deptStudents = response.data.filter(student =>
                    student.departmentId == formData.departmentId
                );
                const deptBatches = [...new Set(deptStudents.map(item => item.batchNo))];
                setFilteredBatches(deptBatches.filter(batch => batch).sort((a, b) => a - b));
                console.log(`Batches for department ${formData.departmentId}:`, deptBatches);
            } else {
                setFilteredBatches([]);
            }
        } catch (error) {
            console.error("Error filtering batches by department:", error);
            // Fallback to showing all batches
            setFilteredBatches(batches);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'departmentId') {
            // Reset batch selection when department changes
            setFormData(prevState => ({
                ...prevState,
                batchNo: '',
                [name]: value
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: files ? files[0] : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError(null);
        setIsLoading(true);

        const data = new FormData();
        data.append('batchNo', formData.batchNo);
        data.append('departmentId', formData.departmentId);
        data.append('present_count', formData.present_count);
        data.append('absent_count', formData.absent_count);
        data.append('attendance', formData.file);

        try {
            const response = await axios.post('http://localhost:3000/upload-attendance', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
            onUploadSuccess();
            setFormData({ batchNo: '', departmentId: '', present_count: '', absent_count: '', file: null });
        } catch (error) {
            console.log(error);
            setUploadError("An error occurred while uploading. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ap-form-container">
            <form onSubmit={handleSubmit} className="ap-attendance-upload-form">
                <h2 className="ap-form-title">Upload Attendance Report</h2>
                {uploadError && <div className="ap-error-message">{uploadError}</div>}

                <div className="ap-form-row">
                    <div className="ap-form-group">
                        <label htmlFor="departmentId" className="ap-form-label">Department:</label>
                        <select
                            id="departmentId"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleChange}
                            required
                            className="ap-form-select"
                        >
                            <option value="">Select a department</option>
                            {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="ap-form-group">
                        <label htmlFor="batchNo" className="ap-form-label">Batch:</label>
                        <select
                            id="batchNo"
                            name="batchNo"
                            value={formData.batchNo}
                            onChange={handleChange}
                            required
                            className="ap-form-select"
                        >
                            <option value="">
                                {filteredBatches.length === 0 ? "No batches available" : "Select a batch"}
                            </option>
                            {filteredBatches.map(batch => (
                                <option key={batch} value={batch}>
                                    {batch}
                                </option>
                            ))}
                        </select>
                        {filteredBatches.length === 0 && formData.departmentId && (
                            <small className="ap-warning-text">No batches found for selected department</small>
                        )}
                    </div>
                </div>

                <div className="ap-form-row">
                    <div className="ap-form-group">
                        <label htmlFor="present_count" className="ap-form-label">Present Count:</label>
                        <input
                            type="number"
                            id="present_count"
                            name="present_count"
                            value={formData.present_count}
                            onChange={handleChange}
                            required
                            min="0"
                            className="ap-form-input"
                        />
                    </div>
                    <div className="ap-form-group">
                        <label htmlFor="absent_count" className="ap-form-label">Absent Count:</label>
                        <input
                            type="number"
                            id="absent_count"
                            name="absent_count"
                            value={formData.absent_count}
                            onChange={handleChange}
                            required
                            min="0"
                            className="ap-form-input"
                        />
                    </div>
                </div>

                <div className="ap-form-group ap-file-group">
                    <label htmlFor="file" className="ap-form-label">Attendance Report PDF:</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleChange}
                        accept=".pdf"
                        required
                        className="ap-form-file-input"
                    />
                    <small className="ap-file-note">File size must be below 1MB.</small>
                </div>

                <button type="submit" className="ap-submit-button" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="ap-button-spinner"></span>
                            Uploading...
                        </>
                    ) : (
                        'Upload Report'
                    )}
                </button>
            </form>
        </div>
    );
};

const AttendanceReportList = ({ reports, onDeleteReport }) => {
    const [deletingReports, setDeletingReports] = useState(new Set());

    const handleDelete = async (batchNo, departmentId) => {
        const reportKey = `${batchNo}-${departmentId}`;
        setDeletingReports(prev => new Set([...prev, reportKey]));

        try {
            await onDeleteReport(batchNo, departmentId);
        } finally {
            setDeletingReports(prev => {
                const newSet = new Set(prev);
                newSet.delete(reportKey);
                return newSet;
            });
        }
    };

    return (
        <div className="ap-reports-container">
            <h2 className="ap-list-title">Uploaded Attendance Reports</h2>
            {reports.length === 0 ? (
                <div className="ap-no-reports">
                    <p>No reports uploaded yet.</p>
                </div>
            ) : (
                <div className="ap-table-wrapper">
                    <table className="ap-report-table">
                        <thead>
                            <tr>
                                <th className="ap-table-header">Department</th>
                                <th className="ap-table-header">Batch No</th>
                                <th className="ap-table-header">Date</th>
                                <th className="ap-table-header">Present</th>
                                <th className="ap-table-header">Absent</th>
                                <th className="ap-table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => {
                                const reportKey = `${report.batchNo}-${report.departmentId}`;
                                const isDeleting = deletingReports.has(reportKey);

                                return (
                                    <tr key={`${report.id}-${report.departmentId}`} className="ap-table-row">
                                        <td className="ap-table-cell">{report.departmentName}</td>
                                        <td className="ap-table-cell">{report.batchNo}</td>
                                        <td className="ap-table-cell">
                                            {new Date(report.report_date).toLocaleDateString()}
                                        </td>
                                        <td className="ap-table-cell ap-count-cell">{report.present_count}</td>
                                        <td className="ap-table-cell ap-count-cell">{report.absent_count}</td>
                                        <td className="ap-table-cell ap-actions-cell">
                                            <div className="ap-action-buttons">
                                                <a
                                                    href={`http://localhost:3000${report.attendance_pdf}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ap-view-button"
                                                >
                                                    📄 View
                                                </a>
                                                <button
                                                    className={`ap-delete-button ${isDeleting ? 'ap-deleting' : ''}`}
                                                    onClick={() => handleDelete(report.batchNo, report.departmentId)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? (
                                                        <>
                                                            <span className="ap-button-spinner"></span>
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        '🗑️ Delete'
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;

