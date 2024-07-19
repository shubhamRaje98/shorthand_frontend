// expertDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './expertDash.css';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import QSet from './qset';

const ExpertDashboard = () => {
    const [expertDetails, setExpertDetails] = useState(null);
    const [subjects, setSubjects] = useState({});
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedQSetStudentCount, setSelectedQSetStudentCount] = useState(null);
    const navigate = useNavigate();
    const { subjectId, qset } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expertResponse, subjectsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/expert-details', { withCredentials: true }),
                    axios.get('http://localhost:3000/all-subjects', { withCredentials: true })
                ]);

                if (expertResponse.status === 200) {
                    setExpertDetails(expertResponse.data);
                }

                if (subjectsResponse.status === 200) {
                    const groupedSubjects = subjectsResponse.data.reduce((acc, subject) => {
                        const [language] = subject.subject_name.split(' ');
                        if (!acc[language]) {
                            acc[language] = [];
                        }
                        acc[language].push(subject);
                        return acc;
                    }, {});

                    Object.keys(groupedSubjects).forEach(language => {
                        groupedSubjects[language].sort((a, b) => {
                            const speedA = parseInt(a.subject_name.match(/\d+/)[0]);
                            const speedB = parseInt(b.subject_name.match(/\d+/)[0]);
                            return speedA - speedB;
                        });
                    });

                    setSubjects(groupedSubjects);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (subjectId && Object.keys(subjects).length > 0) {
            const findSelectedSubject = () => {
                for (const languageSubjects of Object.values(subjects)) {
                    const subject = languageSubjects.find(s => s.subjectId === subjectId);
                    if (subject) {
                        return subject;
                    }
                }
                return null;
            };
            const foundSubject = findSelectedSubject();
            if (foundSubject) {
                setSelectedSubject(foundSubject);
            }
        }
    }, [subjectId, subjects]);

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setSelectedQSetStudentCount(null);
        navigate(`/expertDashboard/${subject.subjectId}`, {replace: true});
    };

    const handleBackClick = () => {
        if (qset) {
            setSelectedQSetStudentCount(null);
            navigate(`/expertDashboard/${subjectId}`, {replace: true});
        } else {
            setSelectedSubject(null);
            setSelectedQSetStudentCount(null);
            navigate('/expertDashboard', {replace: true});
        }
    };

    const handleQSetSelect = (qset, studentCount) => {
        setSelectedQSetStudentCount(studentCount);
    };

    return (
        <div className="dashboard-container">
            <div className="box">
                {(selectedSubject || qset) && (
                    <button className="back-button" onClick={handleBackClick}>Back</button>
                )}
                {expertDetails ? (
                    <div className="expert-details">
                        <h5 className="expert-id">Expert ID: {expertDetails.expertId}</h5>
                        <h5 className="expert-name">Expert Name: {expertDetails.expert_name}</h5>
                        {selectedSubject && (
                            <h5 className="selected-subject">Selected Subject: {selectedSubject.subject_name}</h5>
                        )}
                        {qset && (
                            <>
                                <h5 className="selected-qset">Selected QSet: {qset}</h5>
                                {selectedQSetStudentCount !== null && (
                                    <h5 className="qset-student-count">Student Count: {selectedQSetStudentCount}</h5>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="box dynamic-content">
                {selectedSubject ? (
                    qset ? <Outlet /> : <QSet subjectId={selectedSubject.subjectId} onQSetSelect={handleQSetSelect} />
                ) : (
                    Object.keys(subjects).length > 0 ? (
                        <div className="languages-container">
                            {Object.entries(subjects).map(([language, languageSubjects]) => (
                                <div key={language} className="language-group">
                                    <h3 className="language-title">{language} Shorthand</h3>
                                    <div className="subjects-grid">
                                        {languageSubjects.map((subject) => (
                                            <button
                                                key={subject.subjectId}
                                                className={`item-button ${selectedSubject && selectedSubject.subjectId === subject.subjectId ? 'selected' : ''}`}
                                                onClick={() => handleSubjectClick(subject)}
                                            >
                                                <div className="item-title">{subject.subject_name}</div>
                                                <div className="item-count">Students: {subject.student_count}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading items...</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ExpertDashboard;