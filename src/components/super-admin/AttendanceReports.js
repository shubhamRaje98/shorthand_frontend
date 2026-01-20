import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendenceReports.css'


const AttendanceReports = () => {

    const [batchNo, setBatchNo] = useState('');
    const [batches, setBatches] = useState([]);
    const [center, setCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [batchDate, setBatchDate] = useState('');
    const [batchDates, setBatchDates] = useState([]);
    const [departmentId, setDepartmentId] = useState('');
    const [departmentIds, setDepartmentIds] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reports, setReports] = useState([]);
    const [pendingReports, setPendingReports] = useState([]);
    const [allCombinations, setAllCombinations] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchReports(batchNo, center, batchDate, departmentId);
    }, [batchNo, center, batchDate, departmentId]);

    // Recalculate pending whenever reports or master list changes
    useEffect(() => {
        calculatePendingReports();
    }, [reports, allCombinations, batchNo, center, batchDate, departmentId]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'https://www.shorthandonlineexam.in/super-admin-student-track-dashboard';

            // console.log("Fetching data from URL:", url);
            const response = await axios.post(url, { withCredentials: true });
            const data = response.data;

            // Extract distinct batches and centers for dropdowns
            const distinctBatches = [...new Set(data.map(item => item.batchNo))].sort();
            setBatches(distinctBatches);

            const distinctCenters = [...new Set(data.map(item => item.center))].sort();
            setCenters(distinctCenters);

            const distinctDates = [...new Set(data.map(item => item.batchdate))].filter(Boolean).sort();
            setBatchDates(distinctDates);

            const distinctDepts = [...new Set(data.map(item => item.departmentId))].filter(Boolean).sort();
            setDepartmentIds(distinctDepts);

            // Store all unique Center-Batch combinations found in student data
            // This represents the "expected" list of reports
            const combinations = [];
            const seen = new Set();

            data.forEach(item => {
                if (item.center && item.batchNo) {
                    const key = `${item.center}-${item.batchNo}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        combinations.push({
                            center: item.center,
                            batchNo: item.batchNo,
                            batchDate: item.batchdate, // ensure this field exists in response
                            departmentId: item.departmentId
                        });
                    }
                }
            });
            setAllCombinations(combinations);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError("No students found for provided filter parameters. Please check the parameters!");
        }
        setLoading(false);
    };

    const fetchReports = async (batch, centerValue, dateValue, deptValue) => {
        setLoading(true);
        setError('');
        try {
            let url = 'https://www.shorthandonlineexam.in/admin/attendance-reports'
            const params = [];
            if (batch) params.push(`batch=${batch}`);
            if (centerValue) params.push(`center=${centerValue}`);
            if (dateValue) params.push(`batchDate=${dateValue}`);
            if (deptValue) params.push(`departmentId=${deptValue}`);

            if (params.length > 0) {
                url += '?' + params.join('&');
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

    const calculatePendingReports = () => {
        if (allCombinations.length === 0) return;

        // Filter master list based on current selection
        let filteredCombinations = allCombinations;

        if (batchNo) {
            filteredCombinations = filteredCombinations.filter(c => c.batchNo == batchNo);
        }
        if (center) {
            filteredCombinations = filteredCombinations.filter(c => c.center == center);
        }
        if (batchDate) {
            filteredCombinations = filteredCombinations.filter(c => c.batchDate === batchDate);
        }
        if (departmentId) {
            filteredCombinations = filteredCombinations.filter(c => c.departmentId === departmentId);
        }

        // Find which of these are NOT in the `reports` list
        const uploadedKeys = new Set(reports.map(r => `${r.center}-${r.batchNo}`));

        const missing = filteredCombinations.filter(c => {
            return !uploadedKeys.has(`${c.center}-${c.batchNo}`);
        });

        setPendingReports(missing);
    };


    return (
        <div className="ar-page">
            <div className="ar-container">
                <h2 className="ar-title">Attendance Reports Dashboard</h2>

                <div className="ar-filter-container">
                    <div className="ar-select-wrapper">
                        <label htmlFor="batchNo" className="ar-label">Batch Number:</label>
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
                        <label htmlFor="center" className="ar-label">Center Number:</label>
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

                    <div className="ar-select-wrapper">
                        <label htmlFor="batchDate" className="ar-label">Batch Date:</label>
                        <select
                            id="batchDate"
                            className="ar-select"
                            value={batchDate}
                            onChange={(e) => setBatchDate(e.target.value)}
                        >
                            <option value="">All Dates</option>
                            {batchDates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ar-select-wrapper">
                        <label htmlFor="departmentId" className="ar-label">Department ID:</label>
                        <select
                            id="departmentId"
                            className="ar-select"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departmentIds.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Pending Reports Section */}
            <div className="ar-attendance-report-list" style={{ marginBottom: "30px" }}>
                <h2 className="ar-list-title" style={{ color: "#d9534f" }}>Pending Reports (Not Uploaded)</h2>
                {pendingReports.length === 0 ? (
                    <p className="ar-no-reports">All expected reports have been uploaded!</p>
                ) : (
                    <table className="ar-report-table">
                        <thead>
                            <tr>
                                <th className="ar-table-header">Center</th>
                                <th className="ar-table-header">Batch No</th>
                                <th className="ar-table-header">Expected Date</th>
                                <th className="ar-table-header">Dept ID</th>
                                <th className="ar-table-header">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingReports.map((item, index) => (
                                <tr key={index} className="ar-table-row">
                                    <td className="ar-table-cell">{item.center}</td>
                                    <td className="ar-table-cell">{item.batchNo}</td>
                                    <td className="ar-table-cell">{item.batchDate}</td>
                                    <td className="ar-table-cell">{item.departmentId}</td>
                                    <td className="ar-table-cell" style={{ color: "#d9534f", fontWeight: "bold" }}>Pending</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="ar-attendance-report-list">
                <h2 className="ar-list-title" style={{ color: "#5cb85c" }}>Uploaded Attendance Reports</h2>
                {reports.length === 0 ? (
                    <p className="ar-no-reports">No reports uploaded yet.</p>
                ) : (
                    <table className="ar-report-table">
                        <thead>
                            <tr>
                                <th className="ar-table-header">Center</th>
                                <th className="ar-table-header">Batch No</th>
                                <th className="ar-table-header">Report Date</th>
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
                                            href={`https://www.shorthandonlineexam.in${report.attendance_pdf}`}
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