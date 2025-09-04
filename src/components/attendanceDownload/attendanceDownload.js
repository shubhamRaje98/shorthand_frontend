import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../navBar/navBar';
import './AttendanceDownload.css';

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
            console.log('Making request to:', 'http://45.119.47.81:3000/get-active-departments');
            const response = await axios.get('http://45.119.47.81:3000/get-active-departments');
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
            const response = await axios.post('http://45.119.47.81:3000/get-batch-controller-password', {
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
            const response = await axios.post('http://45.119.47.81:3000/track-students-on-exam-center-code', {
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
                url: `http://45.119.47.81:3000/center/${reportType}-pdf-download`,
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
                url: 'http://45.119.47.81:3000/center/studentId-password',
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