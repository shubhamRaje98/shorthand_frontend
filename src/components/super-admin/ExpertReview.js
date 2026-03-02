// src\components\super-admin\ExpertReview.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import './ExpertReview.css';

const API_BASE_URL = 'https://www.shorthandonlineexam.in';
const LOGS_PER_PAGE = 10;

const ExpertReview = () => {
  // UI State
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('expert');
  
  // Data State
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [expertReviewLogs, setExpertReviewLogs] = useState([]);
  const [modReviewLogs, setModReviewLogs] = useState([]);
  
  // Loading States
  const [loadingExpertLogs, setLoadingExpertLogs] = useState(false);
  const [loadingModLogs, setLoadingModLogs] = useState(false);
  const [loadingExpertTable, setLoadingExpertTable] = useState(false);
  const [loadingModTable, setLoadingModTable] = useState(false);
  
  // Table Configuration State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);

  // Effects
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setCurrentPage(1);
      fetchExpertReviewLogs();
      fetchModReviewLogs();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment) {
      if (activeTab === 'expert') {
        fetchExpertReviewLogs();
      } else {
        fetchModReviewLogs();
      }
    }
  }, [currentPage]);

  useEffect(() => {
    updateColumnsForActiveTab();
  }, [expertReviewLogs, modReviewLogs, activeTab]);

  // Column Management
  const updateColumnsForActiveTab = useCallback(() => {
    const logs = activeTab === 'expert' ? expertReviewLogs : modReviewLogs;
    if (logs.length > 0) {
      const columns = Object.keys(logs[0]);
      setAllColumns(columns);
      setSelectedColumns(columns);
    }
  }, [activeTab, expertReviewLogs, modReviewLogs]);

  // API Calls
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-departments-students`);
      
      if (response.status === 201) {
        setDepartments(response.data);
        if (response.data.length > 0) {
          setSelectedDepartment(response.data[0].departmentId);
        }
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments. Please refresh the page.');
    }
  };

  const fetchExpertReviewLogs = async () => {
    setLoadingExpertTable(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/get-expert-review-logs`, 
        {
          params: {
            department: selectedDepartment,
            page: currentPage,
            limit: LOGS_PER_PAGE
          }
        }
      );
      
      if (response.status === 201) {
        setExpertReviewLogs(response.data);
        setMessage(`Expert review logs loaded for department ${selectedDepartment}`);
      } else if (response.status === 404) {
        setExpertReviewLogs([]);
        setMessage('No expert review logs found for this department.');
      }
    } catch (error) {
      console.error('Error fetching expert review logs:', error);
      setExpertReviewLogs([]);
      if (error.response?.status === 404) {
        setMessage('No expert review logs found for this department.');
      }
    } finally {
      setLoadingExpertTable(false);
    }
  };

  const fetchModReviewLogs = async () => {
    setLoadingModTable(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/get-mod-review-logs`, 
        {
          params: {
            department: selectedDepartment,
            page: currentPage,
            limit: LOGS_PER_PAGE
          }
        }
      );
     
      if (response.status === 201) {
        setModReviewLogs(response.data);
        setMessage(`Mod review logs loaded for department ${selectedDepartment}`);
      } else if (response.status === 404) {
        setModReviewLogs([]);
        setMessage('No mod review logs found for this department.');
      }
    } catch (error) {
      console.error('Error fetching mod review logs:', error);
      setModReviewLogs([]);
      if (error.response?.status === 404) {
        setMessage('No mod review logs found for this department.');
      }
    } finally {
      setLoadingModTable(false);
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
      const response = await axios.post(`${API_BASE_URL}/populate-expert-review-log`, {
        department: selectedDepartment
      });
      
      if (response.status === 200) {
        setMessage(response.data.message || 'Expert logs populated successfully');
        await fetchExpertReviewLogs();
      } else if (response.status === 201) {
        setMessage('No data found for the specified department.');
      }
    } catch (error) {
      console.error('Error populating expert logs:', error);
      setError(error.response?.data?.message || 'Failed to populate expert logs. Please try again.');
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
      const response = await axios.post(`${API_BASE_URL}/populate-mod-review-log`, {
        department: selectedDepartment
      });
     
      if (response.status === 200) {
        setMessage(response.data.message || 'Mod logs populated successfully');
        await fetchModReviewLogs();
      } else if (response.status === 201) {
        setMessage('No data found for the specified department.');
      }
    } catch (error) {
      console.error('Error populating mod logs:', error);
      setError(error.response?.data?.message || 'Failed to populate mod logs. Please try again.');
    } finally {
      setLoadingModLogs(false);
    }
  };

  // Event Handlers
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }, []);

  const handleColumnSelection = useCallback((column) => {
    setSelectedColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((c) => c !== column)
        : [...allColumns.filter(c => prevColumns.includes(c) || c === column)]
    );
  }, [allColumns]);

  const handleDepartmentChange = useCallback((e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
  }, []);

  // Computed Values
  const currentLogs = useMemo(() => {
    const logs = activeTab === 'expert' ? expertReviewLogs : modReviewLogs;
    
    const filtered = logs.filter((log) =>
      Object.values(log).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const indexOfLastLog = currentPage * LOGS_PER_PAGE;
    const indexOfFirstLog = indexOfLastLog - LOGS_PER_PAGE;
    
    return filtered.slice(indexOfFirstLog, indexOfLastLog);
  }, [activeTab, expertReviewLogs, modReviewLogs, searchTerm, currentPage]);

  const totalPages = useMemo(() => {
    const logs = activeTab === 'expert' ? expertReviewLogs : modReviewLogs;
    const filtered = logs.filter((log) =>
      Object.values(log).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    return Math.ceil(filtered.length / LOGS_PER_PAGE);
  }, [activeTab, expertReviewLogs, modReviewLogs, searchTerm]);

  // Render Helpers
  const isWideColumn = (column) => 
    ['passageA', 'passageB', 'ansPassageA', 'ansPassageB'].includes(column);

  const renderPaginationButtons = () => {
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pageNumbers = [];

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) =>
      number === '...' ? (
        <span key={`ellipsis-${index}`} className="er-pagination-ellipsis">...</span>
      ) : (
        <button 
          key={number} 
          onClick={() => setCurrentPage(number)} 
          className={currentPage === number ? 'er-active' : ''}
        >
          {number}
        </button>
      )
    );
  };

  const renderDepartmentSelector = () => (
    <div className="er-department-selector">
      <label htmlFor="department-select">Select Department:</label>
      <select
        id="department-select"
        value={selectedDepartment}
        onChange={handleDepartmentChange}
      >
        <option value="">Select a department</option>
        {departments.map((dept) => (
          <option key={dept.departmentId} value={dept.departmentId}>
            {dept.departmentId}
          </option>
        ))}
      </select>
    </div>
  );

  const renderActionButtons = () => (
    <div className="er-buttons-container">
      <div className="er-buttons">
        <button
          onClick={handleExpertLogs}
          className="er-fetch-logs-button"
          disabled={!selectedDepartment || loadingExpertLogs}
        >
          {loadingExpertLogs ? 'Populating...' : 'Populate Expert Logs'}
        </button>
        <button
          onClick={handleModLogs}
          className="er-fetch-logs-button"
          disabled={!selectedDepartment || loadingModLogs}
        >
          {loadingModLogs ? 'Populating...' : 'Populate Mod Logs'}
        </button>
      </div>
    </div>
  );

  const renderTabButtons = () => (
    <div className="er-tab-buttons">
      <button
        className={activeTab === 'expert' ? 'er-active' : ''}
        onClick={() => handleTabChange('expert')}
      >
        Expert Review Logs
      </button>
      <button
        className={activeTab === 'mod' ? 'er-active' : ''}
        onClick={() => handleTabChange('mod')}
      >
        Mod Review Logs
      </button>
    </div>
  );

  const renderSearchBar = () => (
    <div className="er-search-bar">
      <input
        type="text"
        placeholder="Search logs..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );

  const renderColumnSelector = () => (
    <div className="er-column-selector">
      <label>Select columns to display:</label>
      {allColumns.map((column) => (
        <label key={column}>
          <input
            type="checkbox"
            checked={selectedColumns.includes(column)}
            onChange={() => handleColumnSelection(column)}
          />
          {column}
        </label>
      ))}
    </div>
  );

  const renderTable = () => {
    const isLoading = activeTab === 'expert' ? loadingExpertTable : loadingModTable;

    if (isLoading) {
      return <p className="er-loading-message">Loading {activeTab} review logs...</p>;
    }

    if (currentLogs.length === 0) {
      return <p className="er-no-data-message">No logs available for the selected department.</p>;
    }

    return (
      <table className="er-table">
        <thead>
          <tr>
            {selectedColumns.map((column) => (
              <th 
                key={column} 
                className={isWideColumn(column) ? 'er-wide-column' : 'er-narrow-column'}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentLogs.map((log, index) => (
            <tr key={log.id || `log-${index}`}>
              {selectedColumns.map((column) => (
                <td 
                  key={column} 
                  className={
                    isWideColumn(column) 
                      ? 'er-wide-column er-wrap-text' 
                      : 'er-narrow-column'
                  }
                >
                  {log[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="er-expert-review-content">
      <h1>Populate Tables</h1>
      
      {renderDepartmentSelector()}
      {renderActionButtons()}

      {message && <p className="er-success-message">{message}</p>}
      {error && <p className="er-error-message">{error}</p>}
      
      <div className="er-review-logs">
        {renderTabButtons()}
        
        <h2>
          {activeTab === 'expert' ? 'Expert' : 'Mod'} Review Logs 
          {selectedDepartment && ` for Department ${selectedDepartment}`}
        </h2>
        
        {renderSearchBar()}
        {renderColumnSelector()}
        
        <div className="er-table-container">
          {renderTable()}
        </div>
        
        {currentLogs.length > 0 && totalPages > 1 && (
          <div className="er-pagination">
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertReview;