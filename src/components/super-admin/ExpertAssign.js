import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ExpertAssign.css';
import { toast } from 'react-toastify';

const ExpertAssign = () => {
  const [data, setData] = useState({ departments: [], subjects: [], qsets: [] });
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [studentCount, setStudentCount] = useState('');
  const [selectedQset, setSelectedQset] = useState(null);
  const [experts, setExperts] = useState([]);
  const [modalStep, setModalStep] = useState('expertList');
  const [stage, setStage] = useState('stage1');
  const [summaryData, setSummaryData] = useState([]);
  const [unassignCount, setUnassignCount] = useState('');
  const [selectedSummaryDepartment, setSelectedSummaryDepartment] = useState('all');
  const [expertsWithAssignedCounts, setExpertsWithAssignedCounts] = useState([]);
  
  const departmentRefs = useRef({});
  const subjectRefs = useRef({});

  useEffect(() => {
    fetchData();
    fetchExperts();
    fetchSummaryData();
  }, [selectedDepartment, selectedSubject, stage]);

  const fetchData = async () => {
    try {
      let url = `https://www.shorthandonlineexam.in/get-student-count-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`;
      if (selectedDepartment) {
        url += `&department=${selectedDepartment}`;
        if (selectedSubject) {
          url += `&subject=${selectedSubject}`;
        }
      }
  
      const response = await axios.get(url);
      
      setData(prevData => ({
        departments: selectedDepartment ? prevData.departments : response.data.results,
        subjects: selectedDepartment && !selectedSubject ? response.data.results : prevData.subjects,
        qsets: selectedSubject ? response.data.results : prevData.qsets
      }));
  
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setData({ departments: [], subjects: [], qsets: [] });
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await axios.get('https://www.shorthandonlineexam.in/get-experts');
      setExperts(response.data.results || []);
      
    } catch (error) {
      console.error("Error fetching experts:", error);
      setError('Error fetching experts. Please try again later.');
    }
  };

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`https://www.shorthandonlineexam.in/get-student-summary-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`);
      setSummaryData(response.data.departments);
      
    } catch (error) {
      console.error('Error fetching summary data:', error);
      setError('Error fetching summary data. Please try again later.');
    }
  };

  const handleDepartmentClick = (departmentId) => {
    setSelectedDepartment(departmentId);
    setSelectedSubject('');
    setTimeout(() => departmentRefs.current[departmentId]?.focus(), 0);
  };

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    setTimeout(() => subjectRefs.current[subjectId]?.focus(), 0);
  };

  const handleQsetClick = (qset) => {
    setSelectedQset(qset);
    setShowModal(true);
    setModalStep('expertList');
    fetchExpertsWithAssignedCounts(qset);
  };

  const fetchExpertsWithAssignedCounts = (qset) => {
    const expertsWithCounts = experts.map(expert => {
      const expertSummary = summaryData
        .flatMap(dept => dept.experts)
        .find(e => e.expertId === expert.expertId);
      
      const assignedCount = expertSummary
        ? expertSummary.subjects
            .find(subject => subject.subjectId === selectedSubject)
            ?.qsets.find(q => q.qset === qset.qset)
            ?.expert_assigned_count || 0
        : 0;

      return { ...expert, assignedCount };
    });

    setExpertsWithAssignedCounts(expertsWithCounts);
  };

  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert);
    setModalStep('studentCount');
  };

  const handleSubmit = async () => {
    if (!selectedExpert || !studentCount || !selectedQset) {
      setError('Please select an expert, enter a student count, and select a question set.');
      return;
    }

    try {
      const response = await axios.post('https://www.shorthandonlineexam.in/assign-expert', {
        department: selectedDepartment,
        subject: selectedSubject,
        qset: selectedQset.qset,
        expertId: selectedExpert.expertId,
        count: parseInt(studentCount),
        stage_1: stage === 'stage1',
        stage_3: stage === 'stage3'
      });
      
      setShowModal(false);
      setSelectedExpert(null);
      setStudentCount('');
      setModalStep('expertList');
      fetchData();
      fetchSummaryData();
      toast.success('Expert assigned successfully!');
    } catch (error) {
      console.error('Error assigning expert:', error);
      setError('Error assigning expert. Please try again later.');
    }
  };

  const handleUnassign = async () => {
    if (!selectedExpert || !unassignCount || !selectedQset) {
      setError('Please select an expert, enter a student count to unassign, and select a question set.');
      return;
    }

    try {
      const response = await axios.post('https://www.shorthandonlineexam.in/unassign-expert', {
        department: selectedDepartment,
        subject: selectedSubject,
        qset: selectedQset.qset,
        expertId: selectedExpert.expertId,
        count: parseInt(unassignCount),
        stage_1: stage === 'stage1',
        stage_3: stage === 'stage3'
      });
      
      setShowModal(false);
      setSelectedExpert(null);
      setUnassignCount('');
      setModalStep('expertList');
      fetchData();
      fetchSummaryData();
      toast.success('Expert unassigned successfully!');
    } catch (error) {
      console.error('Error unassigning expert:', error);
      setError('Error unassigning expert. Please try again later.');
    }
  };

  const handleStageChange = (newStage) => {
    setStage(newStage);
    setSelectedDepartment('');
    setSelectedSubject('');
    setSelectedQset(null);
  };

  const renderStageSwitch = () => (
    <div className="ea-stage-switch">
      <button 
        className={`ea-stage-button ${stage === 'stage1' ? 'active' : ''}`}
        onClick={() => handleStageChange('stage1')}
      >
        Stage 1
      </button>
      <button 
        className={`ea-stage-button ${stage === 'stage3' ? 'active' : ''}`}
        onClick={() => handleStageChange('stage3')}
      >
        Stage 3
      </button>
    </div>
  );

  const renderDepartments = () => (
    <div className="ea-section">
      <h2 className="ea-section-title">Departments</h2>
      <div className="ea-card-container">
        {data.departments.map((dept) => (
          <div
            key={dept.departmentId}
            className={`ea-card ${selectedDepartment === dept.departmentId ? 'selected' : ''}`}
            onClick={() => handleDepartmentClick(dept.departmentId)}
            ref={el => departmentRefs.current[dept.departmentId] = el}
            tabIndex={0}
          >
            <h3>{dept.departmentName}</h3>
            <p>Students: {dept.student_count}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="ea-section">
      <h2 className="ea-section-title">Subjects</h2>
      {data.subjects.length > 0 ? (
        <div className="ea-card-container">
          {data.subjects.map((subject) => (
            <div
              key={subject.subjectId}
              className={`ea-card ${selectedSubject === subject.subjectId ? 'selected' : ''}`}
              onClick={() => handleSubjectClick(subject.subjectId)}
              ref={el => subjectRefs.current[subject.subjectId] = el}
              tabIndex={0}
            >
              <h3>{subject.subject_name}</h3>
              <p>Students: {subject.student_count}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="ea-no-data">No subjects available for this department</p>
      )}
    </div>
  );

  const renderQsets = () => (
    <div className="ea-section">
      <h2 className="ea-section-title">Question Sets</h2>
      {data.qsets.length > 0 ? (
        <div className="ea-card-container">
          {data.qsets.map((qset) => (
            <div key={qset.qset} className="ea-card" onClick={() => handleQsetClick(qset)}>
              <h3>qset {qset.qset}</h3>
              <p>Students: {qset.student_count}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="ea-no-data">No question sets available for this subject</p>
      )}
    </div>
  );

  const renderModal = () => {
    return (
      <div className="ea-modal">
        <div className="ea-modal-content">
          <h2>Assign/Unassign Expert</h2>
          {modalStep === 'expertList' && (
            <>
              {expertsWithAssignedCounts.length > 0 ? (
                <div className="ea-expert-list">
                  {expertsWithAssignedCounts.map(expert => (
                    <div 
                      key={expert.id} 
                      className="ea-expert-item"
                      onClick={() => handleExpertSelect(expert)}
                    >
                      ID_{expert.expertId} - {expert.expert_name} (Assigned: {expert.assignedCount})
                    </div>
                  ))}
                </div>
              ) : (
                <p>No experts available.</p>
              )}
              <div className="ea-modal-actions">
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </>
          )}
          {modalStep === 'studentCount' && (
            <>
              <p>Selected Expert: {selectedExpert.expert_name} (Assigned: {selectedExpert.assignedCount})</p>
              <div className="ea-student-count">
                <label htmlFor="studentCount">Number of students to assign:</label>
                <input 
                  type="number" 
                  id="studentCount" 
                  value={studentCount} 
                  onChange={(e) => setStudentCount(e.target.value)}
                  min="1"
                  max={selectedQset.student_count}
                />
              </div>
              <div className="ea-student-count">
                <label htmlFor="unassignCount">Number of students to unassign:</label>
                <input 
                  type="number" 
                  id="unassignCount" 
                  value={unassignCount} 
                  onChange={(e) => setUnassignCount(e.target.value)}
                  min="1"
                  max={selectedExpert.assignedCount}
                />
              </div>
              <div className="ea-modal-actions">
                <button onClick={handleSubmit} disabled={!selectedExpert || !studentCount}>Assign</button>
                <button onClick={handleUnassign} disabled={!selectedExpert || !unassignCount}>Unassign</button>
                <button onClick={() => setModalStep('expertList')}>Back</button>
              </div>
            </>
          )}
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
          subject.qsets.forEach(qset => {
            expertSummary[expert.expertId].assignments.push({
              subject: subject.subject_name,
              qset: qset.qset,
              total: qset.total_students_in_qset,
              assigned: qset.expert_assigned_count,
              unassigned: qset.total_students_in_qset - qset.total_assigned_in_qset
            });
          });
        });
      });
    });

    return (
      <div className="ea-summary-table">
        <h2>Assigned Students Summary</h2>
        <div className="ea-summary-filter">
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
        <table>
          <thead>
            <tr>
              <th>Expert ID</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Q Set</th>
              <th>Total</th>
              <th>Assigned</th>
              <th>Unassigned</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(expertSummary).flatMap(expert => 
              expert.assignments.map((assignment, index) => (
                <tr key={`${expert.expertId}-${index}`}>
                  {index === 0 ? (
                    <>
                      <td rowSpan={expert.assignments.length}>{expert.expertId}</td>
                      <td rowSpan={expert.assignments.length}>{expert.expert_name}</td>
                    </>
                  ) : null}
                  <td>{assignment.subject}</td>
                  <td>{assignment.qset}</td>
                  <td>{assignment.total}</td>
                  <td>{assignment.assigned}</td>
                  <td>{assignment.unassigned}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="ea-expert-assign">
      <h1 className="ea-title">Expert Assign</h1>
      {renderStageSwitch()}
      {error && <p className="ea-error">{error}</p>}
      {renderSummaryTable()}
      {renderDepartments()}
      {selectedDepartment && renderSubjects()}
      {selectedDepartment && selectedSubject && renderQsets()}
      {showModal && renderModal()}
    </div>
  );
};

export default ExpertAssign;