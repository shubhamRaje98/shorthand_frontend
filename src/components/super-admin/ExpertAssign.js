import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ExpertAssign.css';
import { toast } from 'react-toastify';

const ExpertAssign = () => {
  const [data, setData] = useState({ departments: [], subjects: [], qsets: [] });
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
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
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  
  // Review logs state
  const [showReviewLogs, setShowReviewLogs] = useState(false);
  const [reviewLogType, setReviewLogType] = useState('expert');
  const [reviewLogs, setReviewLogs] = useState([]);
  const [reviewFilters, setReviewFilters] = useState({
    subjectId: '',
    qset: '',
    expertId: '',
    status: '',
    subm_done: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    experts: [],
    qsets: []
  });
  const [resetData, setResetData] = useState({
    resetType: 'subject',
    subjectId: '',
    qset: '',
    expertId: ''
  });
  const [showResetModal, setShowResetModal] = useState(false);
  
  const departmentRefs = useRef({});
  const subjectRefs = useRef({});

  useEffect(() => {
    fetchData();
    fetchExperts();
    fetchSummaryData();
  }, [selectedDepartment, selectedSubject, stage]);

  useEffect(() => {
    if (showReviewLogs) {
      fetchFilterOptions();
      fetchReviewLogs();
    }
  }, [showReviewLogs, reviewLogType]);

  const fetchData = async () => {
    try {
      let url = `http://45.119.47.81:3000/get-student-count-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`;
      if (selectedDepartment) {
        url += `&department=${selectedDepartment.toString()}`;
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
      const response = await axios.get('http://45.119.47.81:3000/get-experts');
      setExperts(response.data.results || []);
      
    } catch (error) {
      console.error("Error fetching experts:", error);
      setError('Error fetching experts. Please try again later.');
    }
  };

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`http://45.119.47.81:3000/get-student-summary-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`);
      setSummaryData(response.data.departments);
      
    } catch (error) {
      console.error('Error fetching summary data:', error);
      setError('Error fetching summary data. Please try again later.');
    }
  };

  // Review logs functions
  const fetchFilterOptions = async () => {
    try {
      const table = reviewLogType === 'expert' ? 'expertreviewlog' : 'modreviewlog';
      const response = await axios.get(`http://45.119.47.81:3000/review-logs/filter-options?table=${table}`);
      setFilterOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      toast.error('Error fetching filter options');
    }
  };

  const fetchReviewLogs = async () => {
    try {
      const endpoint = reviewLogType === 'expert' ? 'expert-review-logs' : 'moderator-review-logs';
      const params = new URLSearchParams();
      
      Object.entries(reviewFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://45.119.47.81:3000/${endpoint}?${params}`);
      setReviewLogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching review logs:', error);
      if (error.response?.status === 404) {
        setReviewLogs([]);
        toast.info('No logs found with the specified criteria');
      } else {
        toast.error('Error fetching review logs');
      }
    }
  };

  const handleResetSubmit = async () => {
    try {
      const endpoint = reviewLogType === 'expert' ? 'expert-review-logs/reset' : 'moderator-review-logs/reset';
      
      const payload = {
        resetType: resetData.resetType,
        subjectId: resetData.subjectId || undefined,
        qset: resetData.qset || undefined,
        expertId: resetData.expertId || undefined
      };

      const response = await axios.post(`http://45.119.47.81:3000/${endpoint}`, payload);
      
      toast.success(response.data.message);
      setShowResetModal(false);
      setResetData({ resetType: 'subject', subjectId: '', qset: '', expertId: '' });
      fetchReviewLogs(); // Refresh the logs
    } catch (error) {
      console.error('Error resetting logs:', error);
      toast.error(error.response?.data?.message || 'Error resetting logs');
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
      const departmentSummary = summaryData
        .find(dept => dept.departmentId === parseInt(selectedDepartment));
      
      let assignedCount = 0;

      if (departmentSummary) {
        const expertSummary = departmentSummary.experts
          .find(e => e.expertId === expert.expertId);

        if (expertSummary) {
          const subjectData = expertSummary.subjects
            .find(subject => subject.subjectId === selectedSubject);

          if (subjectData) {
            const qsetData = subjectData.qsets
              .find(q => q.qset === qset.qset);
            
            console.log("Qset Data:", qsetData);

            assignedCount = qsetData ? qsetData.expert_assigned_count : 0;
          }
        }
      }

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
      setModalError('Please select an expert, enter a student count, and select a question set.');
      return;
    }

    try {
      const response = await axios.post('http://45.119.47.81:3000/assign-expert', {
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
      setModalError('');
      fetchData();
      fetchSummaryData();
      toast.success('Expert assigned successfully!');
    } catch (error) {
      console.error('Error assigning expert:', error);
      setModalError('Error assigning expert. Please try again later.');
    }
  };

  const handleUnassign = async () => {
    if (!selectedExpert || !unassignCount || !selectedQset) {
      setModalError('Please select an expert, enter a student count to unassign, and select a question set.');
      return;
    }

    try {
      const response = await axios.post('http://45.119.47.81:3000/unassign-expert', {
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
      setModalError('');
      fetchData();
      fetchSummaryData();
      toast.success('Expert unassigned successfully!');
    } catch (error) {
      console.error('Error unassigning expert:', error);
      setModalError('Error unassigning expert. Please try again later.');
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
            className={`ea-card ${selectedDepartment === dept.departmentId.toString() ? 'selected' : ''}`}
            onClick={() => handleDepartmentClick(dept.departmentId.toString())}
            ref={el => departmentRefs.current[dept.departmentId] = el}
            tabIndex={0}
          >
            <h3>{dept.departmentName}</h3>
            <p>Students: {dept.unassigned_count}/{dept.total_count}</p>
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
              <p>Students: {subject.unassigned_count}/{subject.total_count}</p>
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
              <p>Students: {qset.unassigned_count}/{qset.total_count}</p>
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
          {modalError && <p className="ea-error">{modalError}</p>}
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
          const subjectAssignments = [];

          subject.qsets.forEach(qset => {
            subjectAssignments.push({
              subject: subject.subject_name,
              qset: qset.qset,
              total: qset.total_students_in_qset,
              assigned: qset.expert_assigned_count,
              unassigned: qset.total_students_in_qset - qset.total_assigned_in_qset
            });
          });

          expertSummary[expert.expertId].assignments.push(...subjectAssignments);
        });
      });
    });

    return (
      <div className="ea-summary-table">
        <h2>Assigned Students Summary</h2>
        <div className="ea-summary-filter">
          <button 
            className={`ea-department-button ${selectedSummaryDepartment === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedSummaryDepartment('all')}
          >
            All Departments
          </button>
          {summaryData.map(dept => (
            <button 
              key={dept.departmentId}
              className={`ea-department-button ${selectedSummaryDepartment === dept.departmentId.toString() ? 'active' : ''}`}
              onClick={() => setSelectedSummaryDepartment(dept.departmentId.toString())}
            >
              {dept.departmentId}
            </button>
          ))}
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
                    <td>{assignment.total}</td>
                    <td>{assignment.assigned}</td>
                    <td>{assignment.unassigned}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Review logs render functions
  const renderResetModal = () => (
    <div className="ea-modal">
      <div className="ea-modal-content">
        <h2>Reset {reviewLogType === 'expert' ? 'Expert' : 'Moderator'} Review Logs</h2>
        
        <div className="ea-reset-form">
          <div className="ea-form-group">
            <label>Reset Type:</label>
            <select 
              value={resetData.resetType} 
              onChange={(e) => setResetData({...resetData, resetType: e.target.value})}
            >
              <option value="subject">By Subject</option>
              <option value="qset">By Question Set</option>
              <option value="expert">By Expert</option>
            </select>
          </div>

          {(resetData.resetType === 'subject' || resetData.resetType === 'qset') && (
            <div className="ea-form-group">
              <label>Subject ID:</label>
              <select 
                value={resetData.subjectId} 
                onChange={(e) => setResetData({...resetData, subjectId: e.target.value})}
              >
                <option value="">Select Subject</option>
                {filterOptions.subjects.map(subjectId => (
                  <option key={subjectId} value={subjectId}>{subjectId}</option>
                ))}
              </select>
            </div>
          )}

          {resetData.resetType === 'qset' && (
            <div className="ea-form-group">
              <label>Question Set:</label>
              <select 
                value={resetData.qset} 
                onChange={(e) => setResetData({...resetData, qset: e.target.value})}
              >
                <option value="">Select Q Set</option>
                {filterOptions.qsets
                  .filter(qset => !resetData.subjectId || qset.subjectId === parseInt(resetData.subjectId))
                  .map(qset => (
                    <option key={`${qset.subjectId}-${qset.qset}`} value={qset.qset}>
                      Subject {qset.subjectId} - Q Set {qset.qset}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {resetData.resetType === 'expert' && (
            <div className="ea-form-group">
              <label>Expert ID:</label>
              <select 
                value={resetData.expertId} 
                onChange={(e) => setResetData({...resetData, expertId: e.target.value})}
              >
                <option value="">Select Expert</option>
                {filterOptions.experts.map(expertId => (
                  <option key={expertId} value={expertId}>{expertId}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="ea-modal-actions">
          <button onClick={handleResetSubmit}>Reset Logs</button>
          <button onClick={() => setShowResetModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderReviewLogsFilters = () => (
    <div className="ea-review-filters">
      <div className="ea-filter-row">
        <select 
          value={reviewFilters.subjectId} 
          onChange={(e) => setReviewFilters({...reviewFilters, subjectId: e.target.value})}
        >
          <option value="">All Subjects</option>
          {filterOptions.subjects.map(subjectId => (
            <option key={subjectId} value={subjectId}>Subject {subjectId}</option>
          ))}
        </select>

        <select 
          value={reviewFilters.qset} 
          onChange={(e) => setReviewFilters({...reviewFilters, qset: e.target.value})}
        >
          <option value="">All Q Sets</option>
          {filterOptions.qsets
            .filter(qset => !reviewFilters.subjectId || qset.subjectId === parseInt(reviewFilters.subjectId))
            .map(qset => (
              <option key={`${qset.subjectId}-${qset.qset}`} value={qset.qset}>
                Q Set {qset.qset}
              </option>
            ))}
        </select>

        <select 
          value={reviewFilters.expertId} 
          onChange={(e) => setReviewFilters({...reviewFilters, expertId: e.target.value})}
        >
          <option value="">All Experts</option>
          {filterOptions.experts.map(expertId => (
            <option key={expertId} value={expertId}>Expert {expertId}</option>
          ))}
        </select>

        <select 
          value={reviewFilters.subm_done} 
          onChange={(e) => setReviewFilters({...reviewFilters, subm_done: e.target.value})}
        >
          <option value="">All Status</option>
          <option value="0">Not Submitted</option>
          <option value="1">Submitted</option>
        </select>
      </div>

      <div className="ea-filter-actions">
        <button onClick={fetchReviewLogs}>Apply Filters</button>
        <button onClick={() => setReviewFilters({subjectId: '', qset: '', expertId: '', status: '', subm_done: ''})}>
          Clear Filters
        </button>
        <button onClick={() => setShowResetModal(true)}>
          Reset Logs
        </button>
      </div>
    </div>
  );

  const renderReviewLogsTable = () => (
    <div className="ea-review-logs-table">
      <div className="ea-table-header">
        <h3>{reviewLogType === 'expert' ? 'Expert' : 'Moderator'} Review Logs ({reviewLogs.length} records)</h3>
      </div>
      
      <div className="ea-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Subject ID</th>
              <th>Q Set</th>
              <th>Expert ID</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Logged In</th>
              <th>Submit Time</th>
              {reviewLogType === 'moderator' && <th>Hold</th>}
              {reviewLogType === 'moderator' && <th>Total Marks</th>}
            </tr>
          </thead>
          <tbody>
            {reviewLogs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.student_id}</td>
                <td>{log.subjectId}</td>
                <td>{log.qset}</td>
                <td>{log.expertId}</td>
                <td>{log.status}</td>
                <td>
                  <span className={`ea-status ${log.subm_done ? 'submitted' : 'pending'}`}>
                    {log.subm_done ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>{log.loggedin || 'N/A'}</td>
                <td>{log.subm_time || 'N/A'}</td>
                {reviewLogType === 'moderator' && <td>{log.hold ? 'Yes' : 'No'}</td>}
                {reviewLogType === 'moderator' && <td>{log.total_marks || 0}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviewLogs = () => (
    <div className="ea-review-logs-section">
      <h2>Review Logs Management</h2>
      
      <div className="ea-review-log-type-switch">
        <button 
          className={`ea-log-type-button ${reviewLogType === 'expert' ? 'active' : ''}`}
          onClick={() => setReviewLogType('expert')}
        >
          Expert Logs
        </button>
        <button 
          className={`ea-log-type-button ${reviewLogType === 'moderator' ? 'active' : ''}`}
          onClick={() => setReviewLogType('moderator')}
        >
          Moderator Logs
        </button>
      </div>

      {renderReviewLogsFilters()}
      {renderReviewLogsTable()}
      {showResetModal && renderResetModal()}
    </div>
  );

  return (
    <div className="ea-expert-assign">
      <h1 className="ea-title">Expert Assign</h1>
      {renderStageSwitch()}
      {error && <p className="ea-error">{error}</p>}
      
      {renderDepartments()}
      {selectedDepartment && renderSubjects()}
      {selectedDepartment && selectedSubject && renderQsets()}
      {showModal && renderModal()}
      
      <button 
        className="ea-toggle-summary-button"
        onClick={() => setShowSummaryTable(!showSummaryTable)}
      >
        {showSummaryTable ? 'Hide' : 'Show'} Assigned Students Summary
      </button>
      
      {showSummaryTable && renderSummaryTable()}

      <button 
        className="ea-toggle-review-logs-button"
        onClick={() => setShowReviewLogs(!showReviewLogs)}
      >
        {showReviewLogs ? 'Hide' : 'Show'} Review Logs Management
      </button>
      
      {showReviewLogs && renderReviewLogs()}
    </div>
  );
};

export default ExpertAssign;