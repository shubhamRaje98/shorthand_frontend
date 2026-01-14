import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../navBar/navBar';

// Reusable Download Button Component
const DownloadButton = ({ onClick, loading, disabled, loadingText, text, icon, colorClass = "btn-primary" }) => (
    <button 
        type="button" 
        className={`btn ${colorClass} rounded-3 shadow-sm px-4 py-3 w-100 fw-semibold text-start d-flex align-items-center justify-content-between transition-all`}
        disabled={disabled || loading}
        onClick={onClick}
    >
        <span className="d-flex align-items-center">
            <i className={`bi bi-${icon} me-2 fs-5`}></i>
            {loading ? loadingText : text}
        </span>
        {loading && <span className="spinner-border spinner-border-sm ms-2" role="status"></span>}
    </button>
);

const AttendanceDownload = () => {
    const [departmentId, setDepartmentId] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [loadingButton, setLoadingButton] = useState('');
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState([]);
    const [batches, setBatches] = useState([]);
    const [controller, setController] = useState('');
    const [isControllerPasswordVisible, setIsControllerPasswordVisible] = useState(false);
    const [center, setCenter] = useState();

    useEffect(() => {
        fetchDepartments();
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

    const fetchDepartments = async () => {
        console.log('fetchDepartments called');
        try {
            console.log('Making request to:', 'http://localhost:3000/get-active-departments');
            const response = await axios.get('http://localhost:3000/get-active-departments');
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
            const response = await axios.post('http://localhost:3000/get-batch-controller-password', {
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
            const response = await axios.post('http://localhost:3000/track-students-on-exam-center-code', {
                departmentId
            });
            console.log('Batches response:', response.data);
            
            // Fix: Since response.data is already an array of batch numbers, use it directly
            const distinctBatches = [...new Set(response.data)].sort((a, b) => a - b);
            setBatches(distinctBatches);
            console.log('Processed batches:', distinctBatches);
        } catch (error) {
            console.error("Error fetching batches:", error);
            console.error("Error details:", error.response?.data);
            setError("No batches available.");
            setBatches([]);
        }
    };

    const handleDownload = async (reportType) => {
        setLoadingButton(reportType);
        setError('');

        try {
            const response = await axios({
                url: `http://localhost:3000/center/${reportType}-pdf-download`,
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
                reader.onload = function() {
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
        setLoadingButton('excel');
        setError('');

        try {
            const response = await axios({
                url: 'http://localhost:3000/center/studentId-password',
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
                reader.onload = function() {
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

    // Download buttons configuration
    const downloadButtons = [
        { id: 'absentee', text: 'Download Absentee Report', icon: 'person-x', colorClass: 'btn-danger' },
        { id: 'attendance', text: 'Download Attendance Report', icon: 'person-check', colorClass: 'btn-success' },
        { id: 'answer-sheet', text: 'Download Student Answersheet', icon: 'file-earmark-text', colorClass: 'btn-info' },
        { id: 'blank-answer-sheet', text: 'Download Blank Answersheet', icon: 'file-earmark', colorClass: 'btn-secondary' },
        { id: 'seating-arrangement', text: 'Download Seating Arrangement', icon: 'grid-3x3', colorClass: 'btn-warning' },
        { id: 'studnetId-password', text: 'Download Student Id and Password (PDF)', icon: 'file-pdf', colorClass: 'btn-primary' }
    ];

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavBar />
            <div className="flex-grow-1">
                <div className="container py-4 py-md-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-9">
                            {/* Header Card */}
                            <div className="card border-0 shadow-sm rounded-3 mb-4">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                                            <i className="bi bi-download text-primary fs-3"></i>
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold text-dark mb-1">Download Reports</h2>
                                            <p className="text-muted small mb-0">Select department and batch to download examination reports</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selection Form Card */}
                            <div className="card border-0 shadow-sm rounded-3 mb-4">
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        {/* Department Selection */}
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="departmentId" className="form-label fw-semibold text-dark mb-2">
                                                <i className="bi bi-building me-2 text-primary"></i>
                                                Department
                                            </label>
                                            <select
                                                className="form-select form-select-lg rounded-3 shadow-sm border-0"
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

                                        {/* Batch Selection */}
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="batchNo" className="form-label fw-semibold text-dark mb-2">
                                                <i className="bi bi-list-ol me-2 text-success"></i>
                                                Batch Number
                                            </label>
                                            <select
                                                className="form-select form-select-lg rounded-3 shadow-sm border-0"
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
                                    </div>
                                </div>
                            </div>

                            {/* Download Buttons Card */}
                            <div className="card border-0 shadow-sm rounded-3 mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold text-dark mb-3">
                                        <i className="bi bi-file-earmark-arrow-down me-2 text-primary"></i>
                                        Available Reports
                                    </h5>
                                    <div className="row g-3">
                                        {downloadButtons.map((button) => (
                                            <div key={button.id} className="col-12 col-md-6">
                                                <DownloadButton
                                                    onClick={() => handleDownload(button.id)}
                                                    loading={loadingButton === button.id}
                                                    disabled={loadingButton !== '' || !batchNo || !departmentId}
                                                    loadingText="Generating..."
                                                    text={button.text}
                                                    icon={button.icon}
                                                    colorClass={button.colorClass}
                                                />
                                            </div>
                                        ))}
                                        
                                        {/* Excel Download Button */}
                                        <div className="col-12 col-md-6">
                                            <DownloadButton
                                                onClick={handleExcelDownload}
                                                loading={loadingButton === 'excel'}
                                                disabled={loadingButton !== '' || !batchNo || !departmentId}
                                                loadingText="Generating..."
                                                text="Download Student Id and Password (Excel)"
                                                icon="file-excel"
                                                colorClass="btn-success"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Controller Password Card */}
                            {isControllerPasswordVisible && (
                                <div className="card border-0 shadow-sm rounded-3 bg-warning bg-opacity-10">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-warning bg-opacity-25 rounded-3 p-3 me-3">
                                                <i className="bi bi-shield-lock text-warning fs-3"></i>
                                            </div>
                                            <div>
                                                <h6 className="fw-semibold text-dark mb-1">Controller Password</h6>
                                                <p className="text-dark mb-0">
                                                    Password for this batch: <span className="fw-bold fs-5 text-warning">{controller}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDownload;