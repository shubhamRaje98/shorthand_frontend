import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpertReview.css';

const ExpertReview = () => {
  const [message, setMessage] = useState('');
  const [loadingExpertLogs, setLoadingExpertLogs] = useState(false);
  const [loadingModLogs, setLoadingModLogs] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-departments');
      if (response.status === 201) {
        setDepartments(response.data);
        if (response.data.length > 0) {
          setSelectedDepartment(response.data[0].departmentId);
        }
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('An error occurred while fetching departments. Please refresh the page.');
    }
  };

  const handleExpertLogs = async () => {
    if (!selectedDepartment) {
      setError('Please select a department');
      return;
    }

    setLoadingExpertLogs(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/populate-expert-review-log', {
        department: selectedDepartment
      });

      if (response.data) {
        console.log(response.data);
      }

      if (response.status === 200) {
        setMessage(response.data.message);
      } else if (response.status === 201) {
        setMessage("No data found for the specified department.");
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('An error occurred while fetching logs. Please try again.');
    } finally {
      setLoadingExpertLogs(false);
    }
  };

  const handleModLogs = async () => {
    if (!selectedDepartment) {
      setError('Please select a department');
      return;
    }

    setLoadingModLogs(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/populate-mod-review-log', {
        department: selectedDepartment
      });

      if (response.data) {
        console.log(response.data);
      }

      if (response.status === 200) {
        setMessage(response.data.message);
      } else if (response.status === 201) {
        setMessage("No data found for the specified department.");
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('An error occurred while fetching logs. Please try again.');
    } finally {
      setLoadingModLogs(false);
    }
  };

  return (
    <div className="expert-review-content">
      <h1>Populate Tables</h1>
      <div className="department-selector">
        <label htmlFor="department-select">Select Department:</label>
        <select
          id="department-select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          disabled={loadingExpertLogs || loadingModLogs}
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentId}
            </option>
          ))}
        </select>
      </div>
      <div className="er-buttons">
        <button
          onClick={handleExpertLogs}
          className="fetch-logs-button"
          disabled={loadingExpertLogs || !selectedDepartment}
        >
          {loadingExpertLogs ? 'Fetching...' : 'Fetch Expert Logs'}
        </button>
      </div>

      <div className="er-buttons">
        <button
          onClick={handleModLogs}
          className="fetch-logs-button"
          disabled={loadingModLogs || !selectedDepartment}
        >
          {loadingModLogs ? 'Fetching...' : 'Fetch Mod Logs'}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ExpertReview;
