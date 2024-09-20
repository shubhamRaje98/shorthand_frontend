import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../navBar/navBar';
import './AttendanceDownload.css';

const AttendanceDownload = () => {
    const [batchNo, setBatchNo] = useState('');
    const [loadingButton, setLoadingButton] = useState('');
    const [error, setError] = useState('');
    const [batches, setBatches] = useState([]);
    const [controller, setController] = useState('');
    const [isControllerPasswordVisible, setIsControllerPasswordVisible] = useState(false);
    const [center ,setCenter] = useState();
    useEffect(() => {
        fetchBatches();
        setCenter(localStorage.getItem('center'))
    }, []);

    useEffect(() => {
        if (batchNo) {
            fetchController();
        }
    }, [batchNo]);

    const fetchController = async () => {
        try {
            const response = await axios.post('https://shorthandonlineexam.in/get-batch-controller-password', {
                batchNo
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
        try {
            const response = await axios.post('https://shorthandonlineexam.in/track-students-on-exam-center-code');
            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort((a, b) => a - b);
            });
        } catch (error) {
            console.error("Error fetching batches:", error);
            setError("Failed to fetch batch numbers. Please try again later.");
        }
    };

    const handleDownload = async (reportType) => {
        setLoadingButton(reportType);
        setError('');

        try {
            const response = await axios({
                url: `https://shorthandonlineexam.in/center/${reportType}-pdf-download`,
                method: 'POST',
                data: { batchNo },
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
                url: 'https://shorthandonlineexam.in/center/studentId-password',
                method: 'POST',
                data: { batchNo },
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
                            <label htmlFor="batchNo" className="attendance-download__label">Batch Number:</label>
                            <select
                                className="attendance-download__select"
                                id="batchNo"
                                value={batchNo}
                                onChange={(e) => setBatchNo(e.target.value)}
                                required
                            >
                                <option value="">Select a batch number</option>
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
                                disabled={loadingButton !== '' || !batchNo}
                                onClick={() => handleDownload('absentee')}
                            >
                                {loadingButton === 'absentee' ? 'Generating...' : 'Download Absentee Report'}
                            </button>
                            <button 
                                type="button" 
                                className="attendance-download__btn"
                                disabled={loadingButton !== '' || !batchNo}
                                onClick={() => handleDownload('attendance')}
                            >
                                {loadingButton === 'attendance' ? 'Generating...' : 'Download Attendance Report'}
                            </button>
                           
                            <button 
                                type="button" 
                                className="attendance-download__btn"
                                disabled={loadingButton !== '' || !batchNo}
                                onClick={() => handleDownload('answer-sheet')}
                            >
                                {loadingButton === 'answer-sheet' ? 'Generating...' : 'Download Student Answersheet'}
                            </button>
                            <button 
                                type="button" 
                                className="attendance-download__btn"
                                disabled={loadingButton !== '' || !batchNo}
                                onClick={() => handleDownload('blank-answer-sheet')}
                            >
                                {loadingButton === 'blank-answer-sheet' ? 'Generating...' : 'Download Blank Answersheet'}
                            </button>
                            <button 
                                type="button" 
                                className="attendance-download__btn"
                                disabled={loadingButton !== '' || !batchNo}
                                onClick={handleExcelDownload}
                            >
                                {loadingButton === 'excel' ? 'Generating...' : 'Download Student Id and Password'}
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