// ExpertSummary.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpertSummary.css';

const ExpertSummary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [selectedSummaryDepartment, setSelectedSummaryDepartment] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('stage_1');

  useEffect(() => {
    fetchData();
    fetchSummaryData();
  }, [stage]);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/checked-students?${stage}=true`);
      setSummaryData(response.data.departments);
    } catch (error) {
      console.error('Error fetching summary data:', error);
      setError('Error fetching summary data. Please try again later.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/checked-students?${stage}=true`);
      console.log(response.data);
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
        <div className="expert-summary__summary-filter">
          <label htmlFor="summaryDepartmentFilter">Filter by Department:</label>
          <select 
            id="summaryDepartmentFilter" 
            value={selectedSummaryDepartment} 
            onChange={(e) => setSelectedSummaryDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {summaryData.map(dept => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.departmentId}
              </option>
            ))}
          </select>
        </div>
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

    data.departments.forEach(department => {
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
                {/* <th>Department Name</th> */}
                <th>Total Assigned</th>
                <th>Total Submitted</th>
                <th>Total Pending</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(departmentSummary).map((department) => (
                <tr key={department.departmentId}>
                  <td>{department.departmentId}</td>
                  {/* <td>{department.name}</td> */}
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
        <label className="expert-summary__stage-label">
          <input
            type="radio"
            value="stage_1"
            checked={stage === 'stage_1'}
            onChange={handleStageChange}
            className="expert-summary__stage-input"
          />
          Stage 1
        </label>
        <label className="expert-summary__stage-label">
          <input
            type="radio"
            value="stage_3"
            checked={stage === 'stage_3'}
            onChange={handleStageChange}
            className="expert-summary__stage-input"
          />
          Stage 3
        </label>
      </div>
      {renderSummaryTable()}
      {renderSubjectWiseSummary()}
      {renderDepartmentWiseSummary()}
      {data.departments.map((department) => (
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
  );
};

export default ExpertSummary;