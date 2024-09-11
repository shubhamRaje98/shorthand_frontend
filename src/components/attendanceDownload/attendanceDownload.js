import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../navBar/navBar';
import './AttendanceDownload.css';

const AttendanceDownload = () => {
    const [batchNo, setBatchNo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Available batch numbers
    const availableBatches = [100, 101, 102];

    const handleDownload = async (reportType) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios({
                url: `http://localhost:3000/center/${reportType}-pdf-download`,
                method: 'POST',
                data: { batchNo },
                responseType: 'blob',
            });

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `${reportType}_report_batch_${batchNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(fileURL);
        } catch (err) {
            console.error(`Error downloading the ${reportType} PDF:`, err);
            setError(`An error occurred while downloading the ${reportType} PDF. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="attendance-download-container">
                <div className="content-wrapper">
                    <h2 className="title">Download Attendance Report</h2>
                    <form className="download-form">
                        <div className="form-group">
                            <label htmlFor="batchNo" className="form-label">Batch Number:</label>
                            <select
                                className="form-control"
                                id="batchNo"
                                value={batchNo}
                                onChange={(e) => setBatchNo(e.target.value)}
                                required
                            >
                                <option value="">Select a batch number</option>
                                {availableBatches.map((batch) => (
                                    <option key={batch} value={batch}>
                                        {batch}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="button-group">
                            <button 
                                type="button" 
                                className="btn btn-primary download-btn"
                                disabled={isLoading || !batchNo}
                                onClick={() => handleDownload('absentee')}
                            >
                                {isLoading ? 'Generating...' : 'Download Absentee Report'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary download-btn"
                                disabled={isLoading || !batchNo}
                                onClick={() => handleDownload('attendance')}
                            >
                                {isLoading ? 'Generating...' : 'Download Attendance Report'}
                            </button>
                        </div>
                    </form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDownload;