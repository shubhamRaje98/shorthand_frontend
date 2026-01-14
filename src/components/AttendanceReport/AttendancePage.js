import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../navBar/navBar';

// Reusable Form Field Component
const FormField = ({ label, icon, children, error }) => (
    <div className="mb-3">
        <label className="form-label fw-semibold text-dark mb-2">
            <i className={`bi bi-${icon} me-2 text-primary`}></i>
            {label}
        </label>
        {children}
        {error && <small className="text-warning d-block mt-1">{error}</small>}
    </div>
);

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
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted fw-medium">Loading attendance data...</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavBar />
            <div className="flex-grow-1">
                <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
                    {/* Header Section */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-3">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                                            <i className="bi bi-clipboard-check text-primary fs-3"></i>
                                        </div>
                                        <div>
                                            <h1 className="h3 fw-bold text-dark mb-1">Attendance Management</h1>
                                            <p className="text-muted small mb-0">Upload and manage examination attendance reports</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm mb-4" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Upload Form */}
                    <AttendanceUploadForm 
                        batches={batches} 
                        departments={departments}
                        onUploadSuccess={handleUploadSuccess}
                    />

                    {/* Reports List */}
                    <AttendanceReportList reports={reports} onDeleteReport={handleDeleteReport} />
                </div>
            </div>
        </div>
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
        <div className="row mb-4">
            <div className="col-12">
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                        <h5 className="fw-bold text-dark mb-4">
                            <i className="bi bi-cloud-upload me-2 text-primary"></i>
                            Upload Attendance Report
                        </h5>

                        {uploadError && (
                            <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <span>{uploadError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Department Field */}
                                <div className="col-12 col-md-6">
                                    <FormField label="Department" icon="building">
                                        <select
                                            id="departmentId"
                                            name="departmentId"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            required
                                            className="form-select form-select-lg rounded-3 shadow-sm border-0"
                                        >
                                            <option value="">Select a department</option>
                                            {departments.map(dept => (
                                                <option key={dept.departmentId} value={dept.departmentId}>
                                                    {dept.departmentName}
                                                </option>
                                            ))}
                                        </select>
                                    </FormField>
                                </div>

                                {/* Batch Field */}
                                <div className="col-12 col-md-6">
                                    <FormField 
                                        label="Batch Number" 
                                        icon="list-ol"
                                        error={filteredBatches.length === 0 && formData.departmentId ? "No batches found for selected department" : ""}
                                    >
                                        <select
                                            id="batchNo"
                                            name="batchNo"
                                            value={formData.batchNo}
                                            onChange={handleChange}
                                            required
                                            className="form-select form-select-lg rounded-3 shadow-sm border-0"
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
                                    </FormField>
                                </div>

                                {/* Present Count Field */}
                                <div className="col-12 col-md-6">
                                    <FormField label="Present Count" icon="person-check">
                                        <input
                                            type="number"
                                            id="present_count"
                                            name="present_count"
                                            value={formData.present_count}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="form-control form-control-lg rounded-3 shadow-sm border-0"
                                            placeholder="Enter present count"
                                        />
                                    </FormField>
                                </div>

                                {/* Absent Count Field */}
                                <div className="col-12 col-md-6">
                                    <FormField label="Absent Count" icon="person-x">
                                        <input
                                            type="number"
                                            id="absent_count"
                                            name="absent_count"
                                            value={formData.absent_count}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="form-control form-control-lg rounded-3 shadow-sm border-0"
                                            placeholder="Enter absent count"
                                        />
                                    </FormField>
                                </div>

                                {/* File Upload Field */}
                                <div className="col-12">
                                    <FormField label="Attendance Report PDF" icon="file-pdf">
                                        <input
                                            type="file"
                                            id="file"
                                            name="file"
                                            onChange={handleChange}
                                            accept=".pdf"
                                            required
                                            className="form-control form-control-lg rounded-3 shadow-sm border-0"
                                        />
                                        <small className="text-muted d-block mt-2">
                                            <i className="bi bi-info-circle me-1"></i>
                                            File size must be below 1MB.
                                        </small>
                                    </FormField>
                                </div>

                                {/* Submit Button */}
                                <div className="col-12">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm fw-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-upload me-2"></i>
                                                Upload Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
        <div className="row">
            <div className="col-12">
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-0 p-4">
                        <h5 className="fw-bold text-dark mb-1">
                            <i className="bi bi-file-earmark-text me-2 text-success"></i>
                            Uploaded Attendance Reports
                        </h5>
                        <p className="text-muted small mb-0">
                            {reports.length > 0 ? `${reports.length} report${reports.length !== 1 ? 's' : ''} uploaded` : 'No reports uploaded yet'}
                        </p>
                    </div>
                    <div className="card-body p-0">
                        {reports.length === 0 ? (
                            <div className="text-center py-5 px-4">
                                <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                     style={{ width: '64px', height: '64px' }}>
                                    <i className="bi bi-inbox text-secondary fs-3"></i>
                                </div>
                                <h5 className="text-muted fw-medium">No Reports Available</h5>
                                <p className="text-muted small mb-0">Upload your first attendance report using the form above.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="fw-semibold text-dark px-4 py-3">Department</th>
                                            <th className="fw-semibold text-dark text-center px-4 py-3">Batch No</th>
                                            <th className="fw-semibold text-dark text-center px-4 py-3">Date</th>
                                            <th className="fw-semibold text-dark text-center px-4 py-3">Present</th>
                                            <th className="fw-semibold text-dark text-center px-4 py-3">Absent</th>
                                            <th className="fw-semibold text-dark text-center px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map(report => {
                                            const reportKey = `${report.batchNo}-${report.departmentId}`;
                                            const isDeleting = deletingReports.has(reportKey);
                                            
                                            return (
                                                <tr key={`${report.id}-${report.departmentId}`}>
                                                    <td className="px-4 py-3">{report.departmentName}</td>
                                                    <td className="text-center px-4 py-3 fw-semibold">{report.batchNo}</td>
                                                    <td className="text-center px-4 py-3">
                                                        {new Date(report.report_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="text-center px-4 py-3">
                                                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                                            {report.present_count}
                                                        </span>
                                                    </td>
                                                    <td className="text-center px-4 py-3">
                                                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                                                            {report.absent_count}
                                                        </span>
                                                    </td>
                                                    <td className="text-center px-4 py-3">
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <a
                                                                href={`http://checking.shorthandonlineexam.in${report.attendance_pdf}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary rounded-3 fw-semibold"
                                                            >
                                                                <i className="bi bi-eye me-1"></i>
                                                                View
                                                            </a>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger rounded-3 fw-semibold"
                                                                onClick={() => handleDelete(report.batchNo, report.departmentId)}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                                                        Deleting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-trash me-1"></i>
                                                                        Delete
                                                                    </>
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
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
