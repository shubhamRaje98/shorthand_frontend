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
        fetchBatches();
        fetchDepartments();
        fetchReports();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await axios.post('http://45.119.47.81:3000/track-students-on-exam-center-code');
            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort((a, b) => a - b);
            });
        } catch (error) {
            setError("Failed to fetch batches. Please try again later.");
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://45.119.47.81:3000/get-active-departments');
            setDepartments(response.data || []);
        } catch (error) {
            setError("Failed to fetch departments. Please try again later.");
        }
    };

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://45.119.47.81:3000/get-attendance-report');
            setReports(response.data.Reports || []);
        } catch (error) {
            setError("Attendance Reports Not added yet!!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSuccess = () => {
        fetchReports();
    };

    const handleDeleteReport = async (batchNo, departmentId) => {
        try {
            const response = await axios.post('http://45.119.47.81:3000/delete-atttendance', { 
                batchNo, 
                departmentId 
            });
            if (response.status === 201) {
                alert(response.data.message);
                setReports(reports.filter(report => 
                    !(report.batchNo === batchNo && report.departmentId === departmentId)
                ));
            }
        } catch (error) {
            alert("Failed to delete the report. Please try again.");
        }
    };

    if (isLoading) {
        return <div className="ap-loading">Loading...</div>;
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
    const [uploadError, setUploadError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
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
            const response = await axios.post('http://45.119.47.81:3000/upload-attendance', data, {
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
        <form onSubmit={handleSubmit} className="ap-attendance-upload-form">
            <h2 className="ap-form-title">Upload Attendance Report</h2>
            {uploadError && <div className="ap-error-message">{uploadError}</div>}
            
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
                    <option value="">Select a batch</option>
                    {batches.map(batch => (
                        <option key={batch} value={batch}>
                            {batch}
                        </option>
                    ))}
                </select>
            </div>

            <div className="ap-form-group">
                <label htmlFor="present_count" className="ap-form-label">Present Count:</label>
                <input
                    type="number"
                    id="present_count"
                    name="present_count"
                    value={formData.present_count}
                    onChange={handleChange}
                    required
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
                    className="ap-form-input"
                />
            </div>
            <div className="ap-form-group">
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
            </div>
            <p style={{color:"red"}}>File size must be below 1MB.</p>
            <button type="submit" className="ap-submit-button" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload Report'}
            </button>
        </form>
    );
};

const AttendanceReportList = ({ reports, onDeleteReport }) => (
    <div className="ap-attendance-report-list">
        <h2 className="ap-list-title">Uploaded Attendance Reports</h2>
        {reports.length === 0 ? (
            <p className="ap-no-reports">No reports uploaded yet.</p>
        ) : (
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
                    {reports.map(report => (
                        <tr key={`${report.id}-${report.departmentId}`} className="ap-table-row">
                            <td className="ap-table-cell">{report.departmentName}</td>
                            <td className="ap-table-cell">{report.batchNo}</td>
                            <td className="ap-table-cell">{new Date(report.report_date).toLocaleDateString()}</td>
                            <td className="ap-table-cell">{report.present_count}</td>
                            <td className="ap-table-cell">{report.absent_count}</td>
                            <td className="ap-table-cell pdf-link">
                                <a
                                    href={`http://45.119.47.81:3000${report.attendance_pdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ap-pdf-link"
                                >
                                    View
                                </a>
                                <button
                                    className="ap-delete-button"
                                    onClick={() => onDeleteReport(report.batchNo, report.departmentId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);

export default AttendancePage;