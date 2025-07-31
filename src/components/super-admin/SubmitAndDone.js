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
  const [options, setOptions] = useState({ subjects: [], qsets: [], experts: [] });
  const [message, setMessage] = useState('');

  // Fetch dropdown options
  useEffect(() => {
    axios.get('/api/submitdone/filters?table=expertreviewlog')
      .then(res => setOptions(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch logs based on filters
  const fetchLogs = () => {
    axios.get('/api/submitdone/expertlogs', { params: { ...filters, subm_done: 1 } })
      .then(res => {
        setLogs(res.data.data);
        setMessage(res.data.message);
      })
      .catch(err => {
        setLogs([]);
        setMessage(err.response?.data?.message || 'Error fetching logs');
      });
  };

  // Reset logs
  const resetLogs = () => {
    axios.post('/api/submitdone/expertlogs/reset', { ...filters })
      .then(res => {
        setMessage(res.data.message);
        fetchLogs();
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'Error resetting logs');
      });
  };

  return (
    <div className="submit-container">
      <h2>Submit and Done</h2>

      <div className="filters">
        <select value={filters.subjectId} onChange={e => setFilters({ ...filters, subjectId: e.target.value })}>
          <option value="">Select Subject</option>
          {options.subjects.map((id, i) => <option key={i} value={id}>{id}</option>)}
        </select>

        <select value={filters.qset} onChange={e => setFilters({ ...filters, qset: e.target.value })}>
          <option value="">Select QSet</option>
          {options.qsets.map((q, i) => (
            <option key={i} value={q.qset}>
              {q.subjectId} - QSet {q.qset}
            </option>
          ))}
        </select>

        <select value={filters.expertId} onChange={e => setFilters({ ...filters, expertId: e.target.value })}>
          <option value="">Select Expert</option>
          {options.experts.map((id, i) => <option key={i} value={id}>{id}</option>)}
        </select>

        <select value={filters.resetType} onChange={e => setFilters({ ...filters, resetType: e.target.value })}>
          <option value="subject">By Subject</option>
          <option value="qset">By QSet</option>
          <option value="expert">By Expert</option>
        </select>

        <button onClick={fetchLogs}>Fetch Logs</button>
        <button onClick={resetLogs}>Reset Done Status</button>
      </div>

      {message && <div className="message">{message}</div>}

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
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.expertId}</td>
                  <td>{log.subjectId}</td>
                  <td>{log.qset}</td>
                  <td>{log.status}</td>
                  <td>{log.subm_time}</td>
                  <td>{log.loggedin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No logs found.</p>
        )}
      </div>
    </div>
  );
};

export default SubmitAndDone;
