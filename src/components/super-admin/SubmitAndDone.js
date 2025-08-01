import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SubmitAndDone.css';

const SubmitAndDone = () => {
  const [filters, setFilters] = useState({
    subjectId: '',
    qset: '',
    expertId: '',
    resetType: 'subject',
  });
  const [logs, setLogs] = useState([]);
  const [options, setOptions] = useState({
    subjects: [],
    experts: [],
    qsets: []
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch initial subjects and experts
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3004/review-logs/filter-options', {
          params: { table: 'expertreviewlog' }
        });
        setOptions({
          subjects: res.data.data?.subjects || [],
          experts: res.data.data?.experts || [],
          qsets: []
        });
      } catch (err) {
        console.error('Failed to load options:', err);
        setMessage('Error loading initial options');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialOptions();
  }, []);

  // Fetch logs when filters change
  const fetchLogs = async () => {
    if (!filters.subjectId) {
      setMessage('Please select a subject first');
      return;
    }

    setLoading(true);
    try {
      const params = {
        subjectId: filters.subjectId,
        qset: filters.qset || undefined,
        expertId: filters.expertId || undefined,
        subm_done: 1
      };

      const res = await axios.get('http://localhost:3004/expert-review-logs', { params });
      
      setLogs(res.data.data || []);
      
      // Update QSets for the selected subject
      if (res.data.subjectQsets) {
        const existingQsets = res.data.subjectQsets
          .filter(q => q.exists)
          .map(q => ({
            qset: q.qset,
            displayText: `${filters.subjectId} - QSet ${q.qset}`
          }));
        
        setOptions(prev => ({
          ...prev,
          qsets: existingQsets
        }));
      }
      
      setMessage(res.data.message || '');
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setLogs([]);
      setMessage(err.response?.data?.message || 'Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  // Reset logs
  const resetLogs = async () => {
    if (!filters.subjectId) {
      setMessage('Please select a subject first');
      return;
    }

    setLoading(true);
    try {
      const backendResetType = filters.resetType === 'subject' && filters.qset 
        ? 'qset' 
        : filters.resetType;

      const data = {
        subjectId: filters.subjectId,
        qset: filters.qset || undefined,
        expertId: filters.expertId || undefined,
        resetType: backendResetType
      };

      const res = await axios.post('http://localhost:3004/expert-review-logs/reset', data);
      setMessage(res.data.message || 'Reset successful');
      fetchLogs();
    } catch (err) {
      console.error('Failed to reset logs:', err);
      setMessage(err.response?.data?.message || 'Error resetting logs');
    } finally {
      setLoading(false);
    }
  };

  // Handle subject change
  const handleSubjectChange = (e) => {
    const newSubjectId = e.target.value;
    setFilters({
      ...filters,
      subjectId: newSubjectId,
      qset: ''
    });
  };

  return (
    <div className="submit-container">
      <h2>Submit and Done</h2>

      <div className="filters">
        <div className="filter-group">
          <select
            value={filters.subjectId}
            onChange={handleSubjectChange}
            disabled={loading}
          >
            <option value="">Select Subject</option>
            {options.subjects.map((id) => (
              <option key={`subject-${id}`} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.qset}
            onChange={(e) => setFilters({...filters, qset: e.target.value})}
            disabled={!filters.subjectId || loading || options.qsets.length === 0}
          >
            <option value="">Select QSet</option>
            {options.qsets.map((q) => (
              <option key={`qset-${q.qset}`} value={q.qset}>
                {q.displayText}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.expertId}
            onChange={(e) => setFilters({...filters, expertId: e.target.value})}
            disabled={loading}
          >
            <option value="">Select Expert</option>
            {options.experts.map((id) => (
              <option key={`expert-${id}`} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.resetType}
            onChange={(e) => setFilters({...filters, resetType: e.target.value})}
            disabled={loading}
          >
            <option value="subject">By Subject</option>
            <option value="qset">By QSet</option>
            <option value="expert">By Expert</option>
          </select>
        </div>

        <div className="filter-group button-group">
          <button
            onClick={fetchLogs}
            disabled={!filters.subjectId || loading}
            className="fetch-button"
          >
            {loading ? 'Loading...' : 'Fetch Logs'}
          </button>
        </div>

        <div className="filter-group button-group">
          <button
            onClick={resetLogs}
            disabled={!filters.subjectId || loading}
            className="reset-button"
          >
            {loading ? 'Processing...' : 'Reset Done Status'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="log-table">
        {logs.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Expert</th>
                <th>Subject</th>
                <th>QSet</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Logged In</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.expertId}</td>
                  <td>{log.subjectId}</td>
                  <td>{log.qset}</td>
                  <td>{log.status}</td>
                  <td>{log.subm_time || '-'}</td>
                  <td>{log.loggedin || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-logs">
            {filters.subjectId ? 'No logs found for selected criteria' : 'Please select a subject'}
          </p>
        )}
      </div>
    </div>
  );
};

export default SubmitAndDone;