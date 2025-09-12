import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendenceReports.css'


const AttendanceReports = () => {

    const [batchNo, setBatchNo] = useState('');
    const [batches, setBatches] = useState([]);
    const [center, setCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reports, setReports] = useState([]);


    useEffect(() => {
        fetchData();
    },[]);

    useEffect(() => {
        fetchReports(batchNo, center);
    }, [batchNo, center]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:3001/super-admin-student-track-dashboard';

            // console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
            const distinctBatches = [...new Set(response.data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort();
            });
            const distinctCenters = [...new Set(response.data.map(item => item.center))];
            setCenters(prevCenters => {
                const newCenters = [...new Set([...prevCenters, ...distinctCenters])];
                return newCenters.sort();
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            setError("No students found for provided filter parameters. Please check the parameters!");
        }
        setLoading(false);
    };
    const fetchReports = async (batch, centerValue) => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:3001/admin/attendance-reports'
            if (centerValue || batch) {
                url += '?';
                if (batch) url += `batch=${batch}&`;
                if (centerValue) url += `center=${centerValue}&`;
                url = url.slice(0, -1);
            }
            console.log(url)
            const response = await axios.get(url);
            setReports(response.data.attendance_reports || []);
        } catch (error) {
            setReports([]);
            setError("Attendance Reports Not added yet!!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="ar-page">
            <div className="ar-container">
                <h2 className="ar-title">Attendance Reports</h2>

                <div className="ar-filter-container">
                    <div className="ar-select-wrapper">
                        <label htmlFor="batchNo" className="ar-label">Select Batch Number:</label>
                        <select
                            id="batchNo"
                            className="ar-select"
                            value={batchNo}
                            onChange={(e) => setBatchNo(e.target.value)}
                        >
                            <option value="">All Batches</option>
                            {batches.map((batch, index) => (
                                <option key={index} value={batch}>{batch}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ar-select-wrapper">
                        <label htmlFor="center" className="ar-label">Select Center Number:</label>
                        <select
                            id="center"
                            className="ar-select"
                            value={center}
                            onChange={(e) => setCenter(e.target.value)}
                        >
                            <option value="">All Centers</option>
                            {centers.map((center, index) => (
                                <option key={index} value={center}>{center}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="ar-attendance-report-list">
                <h2 className="ar-list-title">Uploaded Attendance Reports</h2>
                {reports.length === 0 ? (
                    <p className="ar-no-reports">No reports uploaded yet.</p>
                ) : (
                    <table className="ar-report-table">
                        <thead>
                            <tr>
                                <th className="ar-table-header">Center</th>
                                <th className="ar-table-header">Batch No</th>
                                <th className="ar-table-header">Date</th>
                                <th className="ar-table-header">Present</th>
                                <th className="ar-table-header">Absent</th>
                                <th className="ar-table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr key={report.id} className="ar-table-row">
                                    <td className="ar-table-cell">{report.center}</td>
                                    <td className="ar-table-cell">{report.batchNo}</td>
                                    <td className="ar-table-cell">{new Date(report.report_date).toLocaleDateString()}</td>
                                    <td className="ar-table-cell">{report.present_count}</td>
                                    <td className="ar-table-cell">{report.absent_count}</td>
                                    <td className="ar-table-cell ar-pdf-link">
                                        <a
                                            href={`http://localhost:3001${report.attendance_pdf}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ar-view-link"
                                        >
                                            View
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AttendanceReports