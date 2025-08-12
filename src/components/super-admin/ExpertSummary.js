// ExpertSummary.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpertSummary.css';

const ExpertSummary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [selectedSummaryDepartment, setSelectedSummaryDepartment] = useState('all');
  const [selectedSubjectDepartment, setSelectedSubjectDepartment] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('stage_1');
  const [showAssignedSummary, setShowAssignedSummary] = useState(false);
  const [showSubjectWiseSummary, setShowSubjectWiseSummary] = useState(false);
  const [showDepartmentWiseSummary, setShowDepartmentWiseSummary] = useState(false);
  const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSummaryData();

    // Set up interval for refreshing data every minute
    const intervalId = setInterval(() => {
      fetchData();
      fetchSummaryData();
    }, 60000); 

    return () => clearInterval(intervalId);
  }, [stage]);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`https://www.shorthandonlineexam.in/checked-students?${stage}=true`);
      setSummaryData(response.data.departments);
    } catch (error) {
      console.error('Error fetching summary data:', error);
      setError('Error fetching summary data. Please try again later.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://www.shorthandonlineexam.in/checked-students?${stage}=true`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = (e) => {
    setStage(e.target.value);
  };

  const toggleAssignedSummary = () => {
    setShowAssignedSummary(!showAssignedSummary);
  };

  const toggleSubjectWiseSummary = () => {
    setShowSubjectWiseSummary(!showSubjectWiseSummary);
  };

  const toggleDepartmentWiseSummary = () => {
    setShowDepartmentWiseSummary(!showDepartmentWiseSummary);
  };

  const toggleDepartmentDetails = () => {
    setShowDepartmentDetails(!showDepartmentDetails);
  };

  const renderExpertsTotalAssigned = () => {
    const filteredSummaryData = selectedSummaryDepartment === 'all' 
      ? summaryData 
      : summaryData.filter(dept => dept.departmentId === parseInt(selectedSummaryDepartment));

    const expertTotals = {};

    filteredSummaryData.forEach(department => {
      department.experts.forEach(expert => {
        if (!expertTotals[expert.expertId]) {
          expertTotals[expert.expertId] = {
            expertId: expert.expertId,
            expert_name: expert.expert_name,
            total_assigned: 0,
            total_submitted: 0,
            total_pending: 0
          };
        }

        expert.subjects.forEach(subject => {
          subject.qsets.forEach(qset => {
            expertTotals[expert.expertId].total_assigned += qset.expert_assigned_count;
            expertTotals[expert.expertId].total_submitted += qset.submitted_students;
            expertTotals[expert.expertId].total_pending += qset.pending_students;
          });
        });
      });
    });

    return (
      <div className="expert-summary__total-assigned">
        <h2 className="expert-summary__summary-title">Experts Total Assigned</h2>
        <div className="expert-summary__table-wrapper">
          <table className="expert-summary__table">
            <thead>
              <tr>
                <th>Expert ID</th>
                <th>Name</th>
                <th>Total Assigned</th>
                <th>Total Submitted</th>
                <th>Total Pending</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(expertTotals).map(expert => (
                <tr key={expert.expertId}>
                  <td>{expert.expertId}</td>
                  <td>{expert.expert_name}</td>
                  <td>{expert.total_assigned}</td>
                  <td>{expert.total_submitted}</td>
                  <td>{expert.total_pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSummaryTable = () => {
    const filteredSummaryData = selectedSummaryDepartment === 'all' 
      ? summaryData 
      : summaryData.filter(dept => dept.departmentId === parseInt(selectedSummaryDepartment));

    const expertSummary = {};

    filteredSummaryData.forEach(department => {
      department.experts.forEach(expert => {
        if (!expertSummary[expert.expertId]) {
          expertSummary[expert.expertId] = {
            expertId: expert.expertId,
            expert_name: expert.expert_name,
            assignments: []
          };
        }

        expert.subjects.forEach(subject => {
          const subjectAssignments = [];

          subject.qsets.forEach(qset => {
            subjectAssignments.push({
              subject: subject.subject_name,
              qset: qset.qset,
              expert_assigned_count: qset.expert_assigned_count,
              pending_students: qset.pending_students,
              submitted_students: qset.submitted_students
            });
          });

          expertSummary[expert.expertId].assignments.push(...subjectAssignments);
        });
      });
    });

    return (
      <div className="expert-summary__summary-table">
        <h2 className="expert-summary__summary-title">Assigned Students Summary</h2>
        <div className="expert-summary__table-wrapper">
          <table className="expert-summary__table">
            <thead>
              <tr>
                <th>Expert ID</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Q Set</th>
                <th>Assigned</th>
                <th>Submitted</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(expertSummary).flatMap(expert => 
                expert.assignments.map((assignment, index) => {
                  const isFirstForSubject = 
                    index === 0 || 
                    assignment.subject !== expert.assignments[index - 1].subject;

                  const rowspan = expert.assignments.filter(
                    a => a.subject === assignment.subject
                  ).length;

                  return (
                    <tr key={`${expert.expertId}-${index}`}>
                      {index === 0 && (
                        <>
                          <td rowSpan={expert.assignments.length}>{expert.expertId}</td>
                          <td rowSpan={expert.assignments.length}>{expert.expert_name}</td>
                        </>
                      )}
                      {isFirstForSubject && (
                        <td rowSpan={rowspan}>{assignment.subject}</td>
                      )}
                      <td>{assignment.qset}</td>
                      <td>{assignment.expert_assigned_count}</td>
                      <td>{assignment.submitted_students}</td>
                      <td>{assignment.pending_students}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSubjectWiseSummary = () => {
    const subjectSummary = {};

    const filteredDepartments = selectedSubjectDepartment === 'all'
      ? data.departments
      : data.departments.filter(dept => dept.departmentId === parseInt(selectedSubjectDepartment));

    filteredDepartments.forEach(department => {
      department.experts.forEach(expert => {
        expert.subjects.forEach(subject => {
          if (!subjectSummary[subject.subjectId]) {
            subjectSummary[subject.subjectId] = {
              subjectId: subject.subjectId,
              subject_name: subject.subject_name,
              submitted: 0,
              pending: 0,
              assigned: 0
            };
          }

          subject.qsets.forEach(qset => {
            subjectSummary[subject.subjectId].submitted += qset.submitted_students;
            subjectSummary[subject.subjectId].pending += qset.pending_students;
            subjectSummary[subject.subjectId].assigned += qset.expert_assigned_count;
          });
        });
      });
    });

    return (
      <div className="expert-summary__subject-summary">
        <h2 className="expert-summary__summary-title">Subject-wise Summary</h2>
        <div className="expert-summary__table-wrapper">
          <table className="expert-summary__table">
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Subject Name</th>
                <th>Total Assigned</th>
                <th>Total Submitted</th>
                <th>Total Pending</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(subjectSummary).map((subject) => (
                <tr key={subject.subjectId}>
                  <td>{subject.subjectId}</td>
                  <td>{subject.subject_name}</td>
                  <td>{subject.assigned}</td>
                  <td>{subject.submitted}</td>
                  <td>{subject.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDepartmentWiseSummary = () => {
    const departmentSummary = {};

    data.departments.forEach(department => {
      departmentSummary[department.departmentId] = {
        departmentId: department.departmentId,
        name: department.department_name,
        submitted: 0,
        pending: 0,
        assigned: 0
      };

      department.experts.forEach(expert => {
        expert.subjects.forEach(subject => {
          subject.qsets.forEach(qset => {
            departmentSummary[department.departmentId].submitted += qset.submitted_students;
            departmentSummary[department.departmentId].pending += qset.pending_students;
            departmentSummary[department.departmentId].assigned += qset.expert_assigned_count;
          });
        });
      });
    });

    return (
      <div className="expert-summary__department-summary">
        <h2 className="expert-summary__summary-title">Department-wise Summary</h2>
        <div className="expert-summary__table-wrapper">
          <table className="expert-summary__table">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Total Assigned</th>
                <th>Total Submitted</th>
                <th>Total Pending</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(departmentSummary).map((department) => (
                <tr key={department.departmentId}>
                  <td>{department.departmentId}</td>
                  <td>{department.assigned}</td>
                  <td>{department.submitted}</td>
                  <td>{department.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) return <div className="expert-summary__loading">Loading...</div>;
  if (error) return <div className="expert-summary__error">{error}</div>;
  if (!data || !data.departments) return <div className="expert-summary__no-data">No data available</div>;

  return (
    <div className="expert-summary">
      <h1 className="expert-summary__title">Expert Summary</h1>
      <div className="expert-summary__stage-selector">
        <button
          className={`expert-summary__stage-button ${stage === 'stage_1' ? 'active' : ''}`}
          onClick={() => setStage('stage_1')}
        >
          Stage 1
        </button>
        <button
          className={`expert-summary__stage-button ${stage === 'stage_3' ? 'active' : ''}`}
          onClick={() => setStage('stage_3')}
        >
          Stage 3
        </button>
      </div>
      <div className="expert-summary__summary-filter">
        <button
          className={`expert-summary__department-button ${selectedSummaryDepartment === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedSummaryDepartment('all')}
        >
          All Departments
        </button>
        {summaryData.map(dept => (
          <button
            key={dept.departmentId}
            className={`expert-summary__department-button ${selectedSummaryDepartment === dept.departmentId.toString() ? 'active' : ''}`}
            onClick={() => setSelectedSummaryDepartment(dept.departmentId.toString())}
          >
            Department {dept.departmentId}
          </button>
        ))}
      </div>
      {renderExpertsTotalAssigned()}

      <div className="expert-summary__toggle-buttons">
        <button 
          className="expert-summary__toggle-button" 
          onClick={toggleAssignedSummary}
        >
          {showAssignedSummary ? 'Hide' : 'Show'} Assigned Students Summary
        </button>
        <button 
          className="expert-summary__toggle-button" 
          onClick={toggleSubjectWiseSummary}
        >
          {showSubjectWiseSummary ? 'Hide' : 'Show'} Subject-wise Summary
        </button>
        <button 
          className="expert-summary__toggle-button" 
          onClick={toggleDepartmentWiseSummary}
        >
          {showDepartmentWiseSummary ? 'Hide' : 'Show'} Department-wise Summary
        </button>
        <button 
          className="expert-summary__toggle-button" 
          onClick={toggleDepartmentDetails}
        >
          {showDepartmentDetails ? 'Hide' : 'Show'} Department Details
        </button>
      </div>

      <div className="expert-summary__content">
        {showAssignedSummary && renderSummaryTable()}
        {showSubjectWiseSummary && (
          <>
            <div className="expert-summary__summary-filter">
              <button
                className={`expert-summary__department-button ${selectedSubjectDepartment === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedSubjectDepartment('all')}
              >
                All Departments
              </button>
              {data.departments.map(dept => (
                <button
                  key={dept.departmentId}
                  className={`expert-summary__department-button ${selectedSubjectDepartment === dept.departmentId.toString() ? 'active' : ''}`}
                  onClick={() => setSelectedSubjectDepartment(dept.departmentId.toString())}
                >
                  Department {dept.departmentId}
                </button>
              ))}
            </div>
            {renderSubjectWiseSummary()}
          </>
        )}
        {showDepartmentWiseSummary && renderDepartmentWiseSummary()}
        {showDepartmentDetails && data.departments.map((department) => (
          <div key={department.departmentId} className="expert-summary__department">
            <h2 className="expert-summary__department-title">Department ID: {department.departmentId}</h2>
            {department.experts.map((expert) => (
              <div key={expert.expertId} className="expert-summary__expert">
                <h3 className="expert-summary__expert-title">Expert: {expert.expert_name} (ID: {expert.expertId})</h3>
                <div className="expert-summary__table-wrapper">
                  <table className="expert-summary__table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Question Set</th>
                        <th>Assigned</th>
                        <th>Submitted</th>
                        <th>Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expert.subjects.flatMap((subject) =>
                        subject.qsets.map((qset, index) => (
                          <tr key={`${subject.subjectId}-${qset.qset}`}>
                            {index === 0 && (
                              <td rowSpan={subject.qsets.length} className="expert-summary__subject-name">
                                {subject.subject_name}
                              </td>
                            )}
                            <td>{qset.qset}</td>
                            <td>{qset.expert_assigned_count}</td>
                            <td>{qset.submitted_students}</td>
                            <td>{qset.pending_students}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertSummary;