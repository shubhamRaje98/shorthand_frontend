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
                        }
                        return acc;
                    }, {});

                    Object.keys(groupedSubjects).forEach(language => {
                        groupedSubjects[language].sort((a, b) => {
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
        setSelectedQSet(null);  // Reset QSet when a new subject is selected
        navigate(`/expertDashboard/${subject.subjectId}`);
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
                        {languageSubjects.map((subject) => (
                            <button
                                key={subject.subjectId}
                                className="item-button"
                                onClick={() => handleSubjectClick(subject)}
                            >
                                <div className="item-title">{subject.subject_name}</div>
                                {subject.incomplete_count !== undefined && subject.total_count !== undefined && (
                                    <div className="item-count">
                                        Students: {subject.incomplete_count}/{subject.total_count}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubjectSelection;