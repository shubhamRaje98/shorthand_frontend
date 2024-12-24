import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentData.css';
import ResetStudentProgress from './ResetStudentProgress';
// import ResetStudentProgress from './ResetStudentProgress ';

const StudentData = () => {
    const [studentId, setStudentId] = useState('');
    const [resetId, setResetId] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetRequests, setResetRequests] = useState([]);
    const [resetError, setResetError] = useState('');
    const [centers, setCenters] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState('');


    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const response = await axios.get('http://localhost:3000/reset-centers');
                const centersData = Array.isArray(response.data.result) ? response.data.result : [];
                setCenters(centersData);
                console.log(response.data);
            } catch (err) {
                console.error('Error fetching centers:', err);
            }
        };

        fetchCenters();
    }, [selectedCenter]);

    useEffect(() => {
        const fetchResetRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/get-pending-requests?center=${selectedCenter}`);
                setResetRequests(response.data);
            } catch (err) {
                setResetError('Failed to fetch reset requests. Please try again.');
                console.error('Error fetching reset requests:', err);
            }
        };

        fetchResetRequests();
    }, [selectedCenter]);

    const handleSubmit = async (id) => {
        setStudentId(id);
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:3000/admin/student-data', { student_id: id });
            console.log(response.data);
            setStudentData(response.data);
        
        } catch (err) {
            setError('Failed to fetch student data. Please try again.');
            console.error('Error fetching student data:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="sd-container">
                <h1 className="sd-title">Student Data</h1>
                {/* Dropdown for Centers */}
                <div className="sd-center-selector">
                    <label htmlFor="center-dropdown">Select Center:</label>
                    <select
                        id="center-dropdown"
                        value={selectedCenter}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                        className="sd-dropdown"
                    >
                        <option value="">Select a Center</option>
                        {Array.isArray(centers) &&
                            centers.map((center) => (
                                <option key={center.id} value={center.id}>
                                    {center.center}
                                </option>
                            ))}
                    </select>
                </div>

                <section className="sd-section reset-requests-section">
                    <h2 className="sd-subtitle">Reset Requests</h2>
                    {resetError && <p className="sd-error">{resetError}</p>}
                    <table className="sd-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student ID</th>
                                <th>Reason</th>
                                <th>Reset Type</th>
                                <th>Center</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resetRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.student_id}</td>
                                    <td>{request.reason}</td>
                                    <td>{request.reset_type}</td>
                                    <td>{request.center}</td>
                                    <td>{request.time}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setResetId(request.id)
                                                handleSubmit(request.student_id)
                                            }}
                                            className="sd-button reset-button"
                                        >
                                            Reset
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                {loading && <p className="sd-loading">Loading...</p>}
                {error && <p className="sd-error">{error}</p>}

                {studentData && (
                    <div className="sd-data">
                        <section className="sd-section student-info-section">
                            <h2 className="sd-subtitle">Student Information</h2>
                            <div className="sd-info-container">
                                <div className="sd-info">
                                    <p><strong>Student ID:</strong> {studentData.studentResults[0].student_id}</p>
                                    <p><strong>Full Name:</strong> {studentData.studentResults[0].fullname}</p>
                                    <p><strong>Batch No:</strong> {studentData.studentResults[0].batchNo}</p>
                                    <p><strong>Center:</strong> {studentData.studentResults[0].center}</p>
                                    <p><strong>Batch Date:</strong> {studentData.studentResults[0].batchdate}</p>
                                </div>
                                <div className="sd-image">
                                    {studentData.studentResults[0].base64 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${studentData.studentResults[0].base64}`}
                                            alt={`${studentData.studentResults[0].fullname}'s photo`}
                                            className="student-photo"
                                        />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="sd-section audio-logs-section">
                            <h2 className="sd-subtitle">Audio Logs</h2>
                            <table className="sd-table">
                                <thead>
                                    <tr>
                                        <th>Trial</th>
                                        <th>Passage A</th>
                                        <th>Passage B</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData.audioLogs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.trial}</td>
                                            <td>{log.passageA}</td>
                                            <td>{log.passageB}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>

                        <section className="sd-section passage-section">
                            <h2 className="sd-subtitle">Shorthand Passage</h2>
                            <div className="sd-passage-split">
                                <div className="sd-passage-half">
                                    <h3>Passage A Log</h3>
                                    <p>{studentData.shorthandPassage[0].passage_a_log || 'N/A'}</p>
                                </div>
                                <div className="sd-passage-half">
                                    <h3>Final Passage A</h3>
                                    <p>{studentData.shorthandPassage[0].final_passageA || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="sd-passage-split">
                                <div className="sd-passage-half">
                                    <h3>Passage B Log</h3>
                                    <p>{studentData.shorthandPassage[0].passage_b_log || 'N/A'}</p>
                                </div>
                                <div className="sd-passage-half">
                                    <h3>Final Passage B</h3>
                                    <p>{studentData.shorthandPassage[0].final_passageB || 'N/A'}</p>
                                </div>
                            </div>
                        </section>

                        <section className="sd-section passage-section">
                            <h2 className="sd-subtitle">Typing Passage</h2>
                            <div className="sd-passage-split">
                                <div className="sd-passage-half">
                                    <h3>Typing Passage Log</h3>
                                    <p>{studentData.typingPassage[0].typing_passage_log || 'N/A'}</p>
                                </div>
                                <div className="sd-passage-half">
                                    <h3>Final Typing Passage</h3>
                                    <p>{studentData.typingPassage[0].final_typing_passage || 'N/A'}</p>
                                </div>
                            </div>
                        </section>





                        {/* Modified Student Logs section */}
                        <section className="sd-section student-logs-section">
                            <h2 className="sd-subtitle">Student Logs</h2>
                            {studentData.studentLogs?.length ? (
                                <div className="sd-horizontal-table-wrapper">
                                    <table className="sd-horizontal-table">
                                        <thead>
                                            <tr>
                                                {Object.keys(studentData.studentLogs[0]).map((field) => (
                                                    <th key={field}>{field}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {Object.values(studentData.studentLogs[0]).map((value, index) => (
                                                    <td key={index}>{value}</td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No logs available</p>
                            )}
                        </section>

                        <section className="sd-section exam-stages-section">
                            <h2 className="sd-subtitle">Exam Stages</h2>
                            {studentData.examStages?.length ? (
                                <div className="sd-horizontal-table-wrapper">
                                    <table className="sd-horizontal-table">
                                        <thead>
                                            <tr>
                                                {Object.keys(studentData.examStages[0]).map((stage) => (
                                                    <th key={stage}>{stage}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {Object.values(studentData.examStages[0]).map((status, index) => (
                                                    <td key={index}>{status}</td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No exam stages available</p>
                            )}
                        </section>


                    </div>
                )}
            </div>
            {studentData && <ResetStudentProgress studentId={studentId} resetId={resetId} />}
        </>
    );
};

export default StudentData;