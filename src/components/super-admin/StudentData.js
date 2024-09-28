import React, { useState } from 'react';
import axios from 'axios';
import './StudentData.css';
import ResetStudentProgress from './ResetStudentProgress';
// import ResetStudentProgress from './ResetStudentProgress ';

const StudentData = () => {
    const [studentId, setStudentId] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('https://www.shorthandonlineexam.in/admin/student-data', { student_id: studentId });
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
                <form onSubmit={handleSubmit} className="sd-form">
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter Student ID"
                        className="sd-input"
                        required
                    />
                    <button type="submit" className="sd-button">Fetch Data</button>
                </form>

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
                                    <h3>Final Passage A</h3>
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
                    </div>
                )}
            </div>
            {studentData && <ResetStudentProgress studentId={studentId} />}
        </>
    );
};

export default StudentData;