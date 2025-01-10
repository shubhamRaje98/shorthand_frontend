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
  const [expertReviewLogs, setExpertReviewLogs] = useState([]);
  const [modReviewLogs, setModReviewLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [activeTab, setActiveTab] = useState('expert');
  const [loadingExpertTable, setLoadingExpertTable] = useState(false);
  const [loadingModTable, setLoadingModTable] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchExpertReviewLogs();
      fetchModReviewLogs();
    }
  }, [selectedDepartment, currentPage]);

  useEffect(() => {
    if (activeTab === 'expert' && expertReviewLogs.length > 0) {
      const columns = Object.keys(expertReviewLogs[0]);
      setAllColumns(columns);
      setSelectedColumns(columns);
    } else if (activeTab === 'mod' && modReviewLogs.length > 0) {
      const columns = Object.keys(modReviewLogs[0]);
      setAllColumns(columns);
      setSelectedColumns(columns);
    }
  }, [expertReviewLogs, modReviewLogs, activeTab]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://www.shorthandonlineexam.in/get-departments');
      
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

  const fetchExpertReviewLogs = async () => {
    setLoadingExpertTable(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.get(`https://www.shorthandonlineexam.in/get-expert-review-logs?department=${selectedDepartment}&page=${currentPage}&limit=${logsPerPage}`);
      
      if (response.status === 201) {
        setExpertReviewLogs(response.data);
        setMessage(`Successfully fetched expert review logs for department ${selectedDepartment}`);
      } else if (response.status === 404) {
        setExpertReviewLogs([]);
        setMessage("No expert review logs found for this department.");
      }
    } catch (error) {
      console.error('Error fetching expert review logs:', error);
      // setError('An error occurred while fetching expert review logs. Please try again.');
    } finally {
      setLoadingExpertTable(false);
    }
  };

  const fetchModReviewLogs = async () => {
    setLoadingModTable(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.get(`https://www.shorthandonlineexam.in/get-mod-review-logs?department=${selectedDepartment}&page=${currentPage}&limit=${logsPerPage}`);
     
      if (response.status === 201) {
        setModReviewLogs(response.data);
        setMessage(`Successfully fetched mod review logs for department ${selectedDepartment}`);
      } else if (response.status === 404) {
        setModReviewLogs([]);
        setMessage("No mod review logs found for this department.");
      }
    } catch (error) {
      console.error('Error fetching mod review logs:', error);
      setError('An error occurred while fetching mod review logs. Please try again.');
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
      const response = await axios.post('https://www.shorthandonlineexam.in/populate-expert-review-log', {
        department: selectedDepartment
      });
      
      if (response.status === 200) {
        setMessage(response.data.message);
        fetchExpertReviewLogs();
      } else if (response.status === 201) {
        setMessage("No data found for the specified department.");
      }
    } catch (error) {
      console.error('Error populating expert logs:', error);
      setError('An error occurred while populating expert logs. Please try again.');
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
      const response = await axios.post('https://www.shorthandonlineexam.in/populate-mod-review-log', {
        department: selectedDepartment
      });
     
      if (response.status === 200) {
        setMessage(response.data.message);
        fetchModReviewLogs();
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleColumnSelection = (column) => {
    setSelectedColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((c) => c !== column)
        : [...allColumns.filter(c => prevColumns.includes(c) || c === column)]
    );
  };

  const filteredLogs = activeTab === 'expert'
    ? expertReviewLogs.filter((log) =>
        Object.values(log).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : modReviewLogs.filter((log) =>
        Object.values(log).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
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
        <span key={`ellipsis-${index}`}>...</span>
      ) : (
        <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'er-active' : ''}>
          {number}
        </button>
      )
    );
  };

  return (
    <div className="er-expert-review-content">
      <h1>Populate Tables</h1>
      <div className="er-department-selector">
        <label htmlFor="department-select">Select Department:</label>
        <select
          id="department-select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentId}
            </option>
          ))}
        </select>
      </div>
      <div className="er-buttons-container">
        <div className="er-buttons">
          <button
            onClick={handleExpertLogs}
            className="er-fetch-logs-button"
            disabled={!selectedDepartment}
          >
            {loadingExpertLogs ? 'Fetching...' : 'Populate Expert Logs'}
          </button>
          <button
            onClick={handleModLogs}
            className="er-fetch-logs-button"
            disabled={loadingModLogs || !selectedDepartment}
          >
            {loadingModLogs ? 'Fetching...' : 'Populate Mod Logs'}
          </button>
        </div>
      </div>

      {message && <p className="er-success-message">{message}</p>}
      {error && <p className="er-error-message">{error}</p>}
      
      <div className="er-review-logs">
        <div className="er-tab-buttons">
          <button
            className={activeTab === 'expert' ? 'er-active' : ''}
            onClick={() => setActiveTab('expert')}
          >
            Expert Review Logs
          </button>
          <button
            className={activeTab === 'mod' ? 'er-active' : ''}
            onClick={() => setActiveTab('mod')}
          >
            Mod Review Logs
          </button>
        </div>
        <h2>{activeTab === 'expert' ? 'Expert' : 'Mod'} Review Logs for Department {selectedDepartment}</h2>
        <div className="er-search-bar">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
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
        <div className="er-table-container">
          {activeTab === 'expert' && loadingExpertTable && <p>Loading Expert Review Logs...</p>}
          {activeTab === 'mod' && loadingModTable && <p>Loading Mod Review Logs...</p>}
          {!loadingExpertTable && !loadingModTable && (
            <>
              {currentLogs.length > 0 ? (
                <table className="er-table">
                  <thead>
                    <tr>
                      {selectedColumns.map((column) => (
                        <th key={column} className={['passageA', 'passageB', 'ansPassageA', 'ansPassageB'].includes(column) ? 'er-wide-column' : 'er-narrow-column'}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentLogs.map((log) => (
                      <tr key={log.id}>
                        {selectedColumns.map((column) => (
                          <td key={column} className={['passageA', 'passageB', 'ansPassageA', 'ansPassageB'].includes(column) ? 'er-wide-column er-wrap-text' : 'er-narrow-column'}>
                            {log[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No logs available for the selected department.</p>
              )}
            </>
          )}
        </div>
        {currentLogs.length > 0 && (
          <div className="er-pagination">
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertReview;