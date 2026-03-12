// src/components/expertDashboard/SubjectSelection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from './DashboardContext';

const SubjectSelection = () => {
    const [subjects, setSubjects] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setSelectedSubject, setSelectedQSet } = useDashboard();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:3000/all-subjects', { withCredentials: true });
                if (response.status === 200 && Array.isArray(response.data)) {
                    const groupedSubjects = response.data.reduce((acc, subject) => {
                        if (typeof subject.subject_name === 'string') {
                            const [language] = subject.subject_name.split(' ');
                            if (!acc[language]) {
                                acc[language] = [];
                            }
                            acc[language].push(subject);
                            
                            // Add held students as a separate "subject" card
                            // held_incomplete_count and total_held_count come from backend for super_mod users
                            if ((subject.held_incomplete_count > 0) || (subject.total_held_count > 0)) {
                                const heldSubject = {
                                    ...subject,
                                    subject_name: `${subject.subject_name} - Held`,
                                    incomplete_count: subject.held_incomplete_count,
                                    total_count: subject.total_held_count,
                                    isHeld: true
                                };
                                acc[language].push(heldSubject);
                            }
                        }
                        return acc;
                    }, {});

                    Object.keys(groupedSubjects).forEach(language => {
                        groupedSubjects[language].sort((a, b) => {
                            // Sort held subjects after their normal counterparts
                            if (a.isHeld && !b.isHeld) return 1;
                            if (!a.isHeld && b.isHeld) return -1;
                            const speedA = parseInt(a.subject_name.match(/\d+/)?.[0] || '0');
                            const speedB = parseInt(b.subject_name.match(/\d+/)?.[0] || '0');
                            return speedA - speedB;
                        });
                    });

                    setSubjects(groupedSubjects);
                } else {
                    setError('Unexpected response format');
                }
            } catch (err) {
                console.error('Error fetching subjects:', err);
                setError('Error fetching subjects');
            }
        };

        fetchSubjects();
    }, []);

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        console.log('Selected Subject:', subject);
        setSelectedQSet(null);
        if (subject.isHeld) {
            navigate(`/expertDashboard/${subject.subjectId}?held=true`);
        } else {
            navigate(`/expertDashboard/${subject.subjectId}`);
        }
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (Object.keys(subjects).length === 0) {
        return <p>Empty Subjects. All students checked!</p>;
    }

    return (
        <div className="languages-container">
            {Object.entries(subjects).map(([language, languageSubjects]) => (
                <div key={language} className="language-group">
                    <h3 className="language-title">{language} Shorthand</h3>
                    <div className="subjects-grid">
                        {languageSubjects.map((subject, index) => (
                            subject.incomplete_count > 0 && (
                                <button
                                    key={`${subject.subjectId}-${subject.departmentId}-${subject.isHeld ? 'held' : 'normal'}-${index}`}
                                    className={`item-button ${subject.isHeld ? 'item-button-held' : ''}`}
                                    onClick={() => handleSubjectClick(subject)}
                                >
                                    <div className={`item-title ${subject.isHeld ? 'item-title-held' : ''}`}>
                                        {subject.subject_name}
                                    </div>
                                    {subject.isHeld && (
                                        <span className="held-badge">HELD</span>
                                    )}
                                    {subject.incomplete_count !== undefined && subject.total_count !== undefined && (
                                        <div className="item-count">
                                            Students: {subject.incomplete_count}/{subject.total_count}
                                        </div>
                                    )}
                                    {/* Show hold_count badge on normal cards that have held students */}
                                    {!subject.isHeld && subject.hold_count > 0 && (
                                        <div className="hold-count-badge">
                                            {subject.hold_count} held
                                        </div>
                                    )}
                                    {subject.departmentId && (
                                        <div className="item-department">Dept: {subject.departmentId}</div>
                                    )}
                                </button>
                            )
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubjectSelection;