// src/components/super-admin/MarksCalculation.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MarksCalculation.css';
import { generateSubjectWiseSummaryFromTemplate } from '../../utils/subjectWiseSummaryGenerator';
import { generateStudentWiseReportExcel } from '../../utils/studentWiseReportGenerator';
import { comparePassagesForRow, processBatchComparison } from '../../services/comparisonService';

const MarksCalculation = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparingRows, setComparingRows] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [filters, setFilters] = useState({
    student_id: '',
    subjectId: '',
    examType: '',
    qset: '',
    departmentId: '10',
    expertId: '',
    subm_done: ''
  });
  const [selectedTable, setSelectedTable] = useState('expertreviewlog');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [filterOptions, setFilterOptions] = useState({
    subjectId: [],
    examType: [],
    qset: [],
    departmentId: [],
    expertId: []
  });
  const [subjectWiseCount, setSubjectWiseCount] = useState([]);
  const [modalContent, setModalContent] = useState({
    open: false,
    title: '',
    content: ''
  });

  // Show snackbar message
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ open: false, message: '', severity: 'info' }), 3000);
  };

  // Open modal to view full content
  const openModal = (title, content) => {
    setModalContent({ open: true, title, content });
  };

  // Close modal
  const closeModal = () => {
    setModalContent({ open: false, title: '', content: '' });
  };

  // Extract unique values for filter dropdowns
  const extractFilterOptions = (data) => {
    const options = {
      subjectId: [...new Set(data.map(row => row.subjectId).filter(Boolean))].sort(),
      examType: [...new Set(data.map(row => row.examType).filter(Boolean))].sort(),
      qset: [...new Set(data.map(row => row.qset).filter(Boolean))].sort(),
      departmentId: [...new Set(data.map(row => row.departmentId).filter(Boolean))].sort(),
      expertId: [...new Set(data.map(row => row.expertId).filter(Boolean))].sort()
    };
    setFilterOptions(options);
  };

  // Generate filter description for display
  const getFilterDescription = () => {
    const activeFilters = [];
    const filterLabels = {
      student_id: 'Student ID',
      subjectId: 'Subject ID',
      examType: 'Exam Type',
      qset: 'QSet',
      departmentId: 'Department ID',
      expertId: 'Expert ID',
      subm_done: 'Submission Done'
    };

    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '') {
        const value = filters[key];
        const displayValue = key === 'subm_done' ? (value === '1' ? 'Yes' : 'No') : value;
        activeFilters.push(`${filterLabels[key]} = ${displayValue}`);
        console.log(`Active Filters: ${activeFilters}`)
      }
    });

    if (activeFilters.length === 0) {
      return 'All Records';
    } else if (activeFilters.length === 1) {
      return activeFilters[0];
    } else {
      return activeFilters.join(' and ');
    }
  };

  // Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Always include the table parameter
      queryParams.append('table', selectedTable);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await axios.get(
        `http://localhost:3000/student-passages-with-filters?${queryParams.toString()}`
      );

      if (response.data.success) {
        const dataWithMistakes = response.data.data;
        setTableData(dataWithMistakes);
        setFilteredData(dataWithMistakes);
        extractFilterOptions(dataWithMistakes);
        
        console.log('Subject Wise Count: ', response.data.subject_wise_count);
        console.log('Fetch response:', {
          count: response.data.count,
          appeared_students: response.data.appeared_students,
          subject_wise_count: response.data.subject_wise_count,
          hasDepartmentFilter: filters.departmentId !== ''
        });
        
        // Store subject_wise_count from API response for Appeared Students
        if (response.data.subject_wise_count && Array.isArray(response.data.subject_wise_count)) {
          console.log('✅ Storing subject_wise_count:', response.data.subject_wise_count);
          setSubjectWiseCount(response.data.subject_wise_count);
          
          // Warn if array is empty (backend returned empty array)
          if (response.data.subject_wise_count.length === 0) {
            console.warn('⚠️ subject_wise_count array is empty. Backend may not have found students for this department.');
            if (filters.departmentId === '') {
              console.warn('⚠️ This is expected because departmentId filter is not applied.');
            }
          }
        } else {
          console.warn('⚠️ No subject_wise_count in response, setting to empty array');
          setSubjectWiseCount([]);
        }
        
        const tableName = selectedTable === 'expertreviewlog' ? 'Expert Review' : 'Mod Review';
        const appearedCount = response.data.appeared_students || 0;
        showSnackbar(`Successfully fetched ${response.data.count} records from ${tableName} (${appearedCount} appeared students)`, 'success');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data: ' + (error.response?.data?.details || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate mistakes for a specific row
  const handleCalculateMistakes = async (row, index) => {
    setComparingRows(prev => new Set(prev).add(row.id));
    
    const mistakeData = await comparePassagesForRow(row);
    
    if (mistakeData && mistakeData.success) {
      // Update the row with mistake data
      const updatedData = [...filteredData];
      updatedData[index] = {
        ...updatedData[index],
        ...mistakeData
      };
      setFilteredData(updatedData);
      
      // Also update tableData
      const tableIndex = tableData.findIndex(r => r.id === row.id);
      if (tableIndex !== -1) {
        const updatedTableData = [...tableData];
        updatedTableData[tableIndex] = {
          ...updatedTableData[tableIndex],
          ...mistakeData
        };
        setTableData(updatedTableData);
      }
      
      showSnackbar(`Result calculated successfully for Student ID: ${row.student_id}`, 'success');
    } else {
      // Show specific error message from service
      const errorMessage = mistakeData?.message || 'Failed to calculate mistakes';
      showSnackbar(errorMessage, 'error');
    }
    
    setComparingRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(row.id);
      return newSet;
    });
  };

  // Calculate mistakes for all rows using batch processing
  const handleCalculateAllMistakes = async () => {
    // Validate that departmentId filter is selected
    if (!filters.departmentId || filters.departmentId === '') {
      showSnackbar('Please select a Department ID before calculating results', 'error');
      return;
    }

    setLoading(true);
    const filterDesc = getFilterDescription();
    const totalRecords = filteredData.length;
    showSnackbar(`Calculating results for ${totalRecords} record(s) [${filterDesc}] using parallel processing...`, 'info');

    try {
      // Use the comparison service to process all rows
      const result = await processBatchComparison(filteredData, 16);

      if (result.success) {
        const finalData = result.data;
        
        setFilteredData(finalData);
        setTableData(finalData);
        showSnackbar(
          `Finished calculating results for ${result.processedCount} record(s) [${filterDesc}] using 16 parallel workers`,
          'success'
        );

        // Generate and download subject-wise summary Excel after calculation completes
        // Explicitly pass subjectWiseCount state to ensure appeared students count is available
        console.log('Calling generateSubjectWiseSummaryFromTemplate with subjectWiseCount:', subjectWiseCount);
        const summaryResult = await generateSubjectWiseSummaryFromTemplate(finalData, subjectWiseCount);
        if (summaryResult.success) {
          console.log('✅ Subject-wise summary generated:', summaryResult.filename);
        } else {
          console.warn('⚠️ Subject-wise summary generation issue:', summaryResult.message);
        }
      } else {
        showSnackbar(result.message || 'Failed to process batch comparison', 'error');
      }
    } catch (error) {
      console.error('Error during batch processing:', error);
      showSnackbar(`Error during batch processing: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };


  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data when table selection changes
  useEffect(() => {
    if (tableData.length > 0 || filteredData.length > 0) {
      // Only fetch if we've already loaded data once
      fetchData();
    }
  }, [selectedTable]);

  // Auto-fetch data when filters change
  useEffect(() => {
    // Skip if no data has been loaded yet (initial mount is handled by the first useEffect)
    if (tableData.length > 0 || filteredData.length > 0) {
      fetchData();
    }
  }, [filters]);

  // Apply filters locally
  const applyFilters = useCallback(() => {
    let filtered = [...tableData];

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value && value !== '') {
        filtered = filtered.filter(row => {
          const cellValue = row[key];
          if (cellValue === null || cellValue === undefined) return false;
          return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
        });
      }
    });

    setFilteredData(filtered);
  }, [tableData, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Reset to page 0 only when filters change, not when data updates
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      student_id: '',
      subjectId: '',
      examType: '',
      qset: '',
      departmentId: '',
      expertId: '',
      subm_done: ''
    });
  };

  // Handle fetch with filters
  const handleFetchWithFilters = () => {
    fetchData();
  };

  // Pagination handlers
  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  // Get paginated data
  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Toggle row expansion
  const toggleRowExpansion = (rowId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  // Render loading spinner
  if (loading && tableData.length === 0) {
    return (
      <div className="marks-calc-container">
        <div className="marks-calc-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marks-calc-container">
      {/* Snackbar */}
      {snackbar.open && (
        <div className={`marks-calc-snackbar marks-calc-snackbar--${snackbar.severity}`}>
          {snackbar.message}
        </div>
      )}

      {/* Header */}
      <div className="marks-calc-header">
        <h2 className="marks-calc-title">Marks Calculation</h2>
        <p className="marks-calc-subtitle">
          View and analyze student passages with filters • <span style={{ fontWeight: '600', color: '#0d6efd' }}>
            {selectedTable === 'expertreviewlog' ? 'Expert Review Log' : 'Mod Review Log'}
          </span>
        </p>
      </div>

      {/* Filter Section */}
      <div className="marks-calc-filters">
        <div className="marks-calc-filters-grid">
          <div className="marks-calc-filter-item">
            <label>Student ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Student ID"
              value={filters.student_id}
              onChange={(e) => handleFilterChange('student_id', e.target.value)}
            />
          </div>

          <div className="marks-calc-filter-item">
            <label>Subject ID</label>
            <select
              className="form-select"
              value={filters.subjectId}
              onChange={(e) => handleFilterChange('subjectId', e.target.value)}
            >
              <option value="">All Subjects</option>
              {filterOptions.subjectId.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="marks-calc-filter-item">
            <label>Exam Type</label>
            <select
              className="form-select"
              value={filters.examType}
              onChange={(e) => handleFilterChange('examType', e.target.value)}
            >
              <option value="">All Exam Types</option>
              {filterOptions.examType.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="marks-calc-filter-item">
            <label>Q Set</label>
            <select
              className="form-select"
              value={filters.qset}
              onChange={(e) => handleFilterChange('qset', e.target.value)}
            >
              <option value="">All Q Sets</option>
              {filterOptions.qset.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="marks-calc-filter-item">
            <label>Department ID</label>
            <select
              className="form-select"
              value={filters.departmentId}
              onChange={(e) => handleFilterChange('departmentId', e.target.value)}
            >
              <option value="">All Departments</option>
              {filterOptions.departmentId.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="marks-calc-filter-item">
            <label>Expert ID</label>
            <select
              className="form-select"
              value={filters.expertId}
              onChange={(e) => handleFilterChange('expertId', e.target.value)}
            >
              <option value="">All Experts</option>
              {filterOptions.expertId.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="marks-calc-filter-item">
            <label>Submission Done</label>
            <select
              className="form-select"
              value={filters.subm_done}
              onChange={(e) => handleFilterChange('subm_done', e.target.value)}
            >
              <option value="">All</option>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>

        {/* Table Selection Toggle */}
        <div className="marks-calc-table-toggle" style={{ 
          marginTop: '20px', 
          padding: '12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '2px solid #dee2e6'
        }}>
          <label style={{ 
            fontWeight: '600', 
            marginRight: '15px',
            color: '#495057'
          }}>Data Source:</label>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${
                selectedTable === 'expertreviewlog' 
                  ? 'btn-primary' 
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setSelectedTable('expertreviewlog')}
              style={{ minWidth: '150px' }}
            >
              Expert Review Log
            </button>
            <button
              type="button"
              className={`btn ${
                selectedTable === 'modreviewlog' 
                  ? 'btn-primary' 
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setSelectedTable('modreviewlog')}
              style={{ minWidth: '150px' }}
            >
              Mod Review Log
            </button>
          </div>
          <span style={{ 
            marginLeft: '15px', 
            fontSize: '0.9em', 
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            Currently viewing: <strong>{selectedTable === 'expertreviewlog' ? 'Expert Review Log' : 'Mod Review Log'}</strong>
          </span>
        </div>

        <div className="marks-calc-filter-actions">
          <button
            className="btn btn-primary"
            onClick={handleFetchWithFilters}
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="marks-calc-info">
        <span className="marks-calc-info-text">
          Showing {filteredData.length} record(s)
        </span>
        <button
          className="btn btn-sm btn-primary ms-3"
          onClick={handleCalculateAllMistakes}
          disabled={loading || filteredData.length === 0}
        >
          {loading ? 'Calculating...' : `Calculate Result for ${getFilterDescription()}`}
        </button>
        <button
          className="btn btn-sm btn-success ms-2"
          onClick={async () => {
            const result = await generateSubjectWiseSummaryFromTemplate(filteredData, subjectWiseCount);
            showSnackbar(result.message, result.success ? 'success' : 'warning');
          }}
          disabled={loading || filteredData.length === 0 || !filteredData.some(row => row.result)}
          title="Download subject-wise result summary Excel using template (requires calculated results)"
        >
          Download Subject-Wise Summary Report
        </button>
        <button
          className="btn btn-sm btn-info ms-2"
          onClick={async () => {
            const result = await generateStudentWiseReportExcel(filteredData);
            showSnackbar(result.message, result.success ? 'success' : 'warning');
          }}
          disabled={loading || filteredData.length === 0 || !filteredData.some(row => row.result)}
          title="Download complete student-wise evaluation report with all details (requires calculated results)"
        >
          Download Student-Wise Report
        </button>
      </div>

      {/* Table */}
      <div className="marks-calc-table-container" style={{ 
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          overflow: 'auto',
          backgroundColor: '#fff',
        }}>
          <table className="marks-calc-table" style={{
            minWidth: '100%',
            tableLayout: 'auto',
            borderCollapse: 'separate',
            borderSpacing: 0
          }}>
          <thead>
            <tr>
              <th className="col-id" style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Student ID</th>
              <th style={{ padding: '12px 16px' }}>Subject</th>
              <th style={{ padding: '12px 16px' }}>Exam Type</th>
              <th style={{ padding: '12px 16px' }}>Q Set</th>
              <th style={{ padding: '12px 16px' }}>Dept</th>
              <th style={{ padding: '12px 16px' }}>Expert</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Model Answer A</th>
              <th style={{ padding: '12px 16px' }}>Model Answer B</th>
              <th style={{ padding: '12px 16px' }}>User Passage A</th>
              <th style={{ padding: '12px 16px' }}>User Passage B</th>
              <th className="col-mistakes" style={{ padding: '12px 16px' }}>Spelling</th>
              <th className="col-mistakes" style={{ padding: '12px 16px' }}>Missed</th>
              <th className="col-mistakes" style={{ padding: '12px 16px' }}>Added</th>
              <th className="col-mistakes" style={{ padding: '12px 16px' }}>Grammar</th>
              <th className="col-ignored" style={{ padding: '12px 16px' }}>Ignored</th>
              <th className="col-mistakes" style={{ padding: '12px 16px' }}>Total</th>
              <th className="col-mistakes" style={{ padding: '12px 16px' }}>Marks</th>
              <th className="col-result" style={{ padding: '12px 16px' }}>Result</th>
              <th className="col-grade" style={{ padding: '12px 16px' }}>Grade</th>
              <th className="col-action" style={{ padding: '12px 16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const actualIndex = currentPage * rowsPerPage + index;
                const isCalculating = comparingRows.has(row.id);
                const isExpanded = expandedRows.has(row.id);
                const hasPassageData = row.marksA !== undefined && row.marksB !== undefined;
                const hasIgnoredWords = row.QPA || row.QPB;
                const hasMistakes = row.mistakesA || row.mistakesB;
                const canExpand = hasPassageData || hasIgnoredWords || hasMistakes;
                
                return (
                  <React.Fragment key={row.id || index}>
                    <tr className={hasPassageData && isExpanded ? 'expanded-row' : ''}>
                      <td className="col-id" style={{ padding: '12px 16px' }}>{row.id}</td>
                      <td style={{ padding: '12px 16px' }}>{row.student_id}</td>
                      <td style={{ padding: '12px 16px' }}>{row.subjectId}</td>
                      <td style={{ padding: '12px 16px' }}>{row.examType}</td>
                      <td style={{ padding: '12px 16px' }}>{row.qset}</td>
                      <td style={{ padding: '12px 16px' }}>{row.departmentId}</td>
                      <td style={{ padding: '12px 16px' }}>{row.expertId}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`marks-calc-badge ${row.subm_done === 1 ? 'marks-calc-badge--success' : 'marks-calc-badge--warning'}`}>
                          {row.subm_done === 1 ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="marks-calc-passage">
                          {row.ansPassageA ? (
                            <span 
                              className="marks-calc-passage-preview marks-calc-passage-model clickable-text"
                              onClick={() => openModal('Model Answer A - Student ID: ' + row.student_id, row.ansPassageA)}
                              title="Click to view full text"
                            >
                              {row.ansPassageA.substring(0, 50)}
                              {row.ansPassageA.length > 50 && '...'}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="marks-calc-passage">
                          {row.ansPassageB ? (
                            <span 
                              className="marks-calc-passage-preview marks-calc-passage-model clickable-text"
                              onClick={() => openModal('Model Answer B - Student ID: ' + row.student_id, row.ansPassageB)}
                              title="Click to view full text"
                            >
                              {row.ansPassageB.substring(0, 50)}
                              {row.ansPassageB.length > 50 && '...'}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="marks-calc-passage">
                          {row.passageA ? (
                            <span 
                              className="marks-calc-passage-preview clickable-text"
                              onClick={() => openModal('User Passage A - Student ID: ' + row.student_id, row.passageA)}
                              title="Click to view full text"
                            >
                              {row.passageA.substring(0, 50)}
                              {row.passageA.length > 50 && '...'}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="marks-calc-passage">
                          {row.passageB ? (
                            <span 
                              className="marks-calc-passage-preview clickable-text"
                              onClick={() => openModal('User Passage B - Student ID: ' + row.student_id, row.passageB)}
                              title="Click to view full text"
                            >
                              {row.passageB.substring(0, 50)}
                              {row.passageB.length > 50 && '...'}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                        {row.spelling !== undefined ? (
                          <span className="mistake-count">{row.spelling}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                        {row.missed !== undefined ? (
                          <span className="mistake-count">{row.missed}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                        {row.added !== undefined ? (
                          <span className="mistake-count">{row.added}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                        {row.grammar !== undefined ? (
                          <span className="mistake-count">{row.grammar}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-ignored" style={{ padding: '12px 16px' }}>
                        <span className="text-muted">—</span>
                      </td>
                      <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                        {row.total !== undefined ? (
                          <span className="mistake-count total-mistakes">{row.total}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                        {row.marks !== undefined ? (
                          <span className="marks-display">{row.marks}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-result" style={{ padding: '12px 16px' }}>
                        {row.result !== undefined ? (
                          <span className={`result-badge result-badge--${row.result.toLowerCase()}`}>
                            {row.result}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-grade" style={{ padding: '12px 16px' }}>
                        {row.grade !== undefined && row.grade !== '' ? (
                          <span className={`grade-badge grade-badge--${row.grade.toLowerCase()}`}>
                            {row.grade}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-action" style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleCalculateMistakes(row, actualIndex)}
                            disabled={isCalculating}
                            title="Calculate mistakes (empty passages will be treated as single space)"
                          >
                            {isCalculating ? '...' : 'Calc'}
                          </button>
                          {canExpand && (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => toggleRowExpansion(row.id)}
                              title={isExpanded ? 'Hide passage details' : 'Show passage details'}
                            >
                              {isExpanded ? '▲' : '▼'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {canExpand && isExpanded && (
                      <>
                        <tr className="passage-detail-row passage-a-row">
                          <td colSpan="8" className="passage-label" style={{ padding: '12px 16px' }}>Passage A</td>
                          <td colSpan="4" style={{ padding: '12px 16px' }}></td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesA?.spelling && row.mistakesA.spelling.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => {
                                  const formattedSpelling = row.mistakesA.spelling
                                    .map(pair => `(${pair[0]}, ${pair[1]})`)
                                    .join(', ');
                                  openModal('Spelling Mistakes (Passage A) - Student ID: ' + row.student_id, formattedSpelling);
                                }}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const formattedText = row.mistakesA.spelling
                                    .map(pair => `(${pair[0]}, ${pair[1]})`)
                                    .join(', ');
                                  return formattedText.length > 30 ? formattedText.substring(0, 30) + '...' : formattedText;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.spellingA || 0})</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesA?.missed && row.mistakesA.missed.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => openModal('Missed Words (Passage A) - Student ID: ' + row.student_id, row.mistakesA.missed.join(', '))}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const text = row.mistakesA.missed.join(', ');
                                  return text.length > 30 ? text.substring(0, 30) + '...' : text;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.missedA || 0})</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesA?.added && row.mistakesA.added.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => openModal('Added Words (Passage A) - Student ID: ' + row.student_id, row.mistakesA.added.join(', '))}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const text = row.mistakesA.added.join(', ');
                                  return text.length > 30 ? text.substring(0, 30) + '...' : text;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.addedA || 0})</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesA?.grammar && row.mistakesA.grammar.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => openModal('Grammar Mistakes (Passage A) - Student ID: ' + row.student_id, row.mistakesA.grammar.join(', '))}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const text = row.mistakesA.grammar.join(', ');
                                  return text.length > 30 ? text.substring(0, 30) + '...' : text;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.grammarA || 0})</span>
                          </td>
                          <td className="col-ignored" style={{ padding: '12px 16px' }}>
                            {row.QPA ? (
                              <span 
                                className="ignored-words-detail clickable-text"
                                onClick={() => openModal('Ignored Words (Passage A) - Student ID: ' + row.student_id, row.QPA)}
                                title="Click to view full list"
                              >
                                {row.QPA.substring(0, 30)}
                                {row.QPA.length > 30 && '...'}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            <span className="mistake-count total-mistakes mistake-count-detail">{row.totalA}</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            <span className="marks-display marks-display-detail">{row.marksA}</span>
                          </td>
                          <td className="col-result" style={{ padding: '12px 16px' }}></td>
                          <td className="col-grade" style={{ padding: '12px 16px' }}></td>
                          <td className="col-action" style={{ padding: '12px 16px' }}></td>
                        </tr>
                        <tr className="passage-detail-row passage-b-row">
                          <td colSpan="8" className="passage-label" style={{ padding: '12px 16px' }}>Passage B</td>
                          <td colSpan="4" style={{ padding: '12px 16px' }}></td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesB?.spelling && row.mistakesB.spelling.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => {
                                  const formattedSpelling = row.mistakesB.spelling
                                    .map(pair => `(${pair[0]}, ${pair[1]})`)
                                    .join(', ');
                                  openModal('Spelling Mistakes (Passage B) - Student ID: ' + row.student_id, formattedSpelling);
                                }}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const formattedText = row.mistakesB.spelling
                                    .map(pair => `(${pair[0]}, ${pair[1]})`)
                                    .join(', ');
                                  return formattedText.length > 30 ? formattedText.substring(0, 30) + '...' : formattedText;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.spellingB || 0})</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesB?.missed && row.mistakesB.missed.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => openModal('Missed Words (Passage B) - Student ID: ' + row.student_id, row.mistakesB.missed.join(', '))}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const text = row.mistakesB.missed.join(', ');
                                  return text.length > 30 ? text.substring(0, 30) + '...' : text;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.missedB || 0})</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesB?.added && row.mistakesB.added.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => openModal('Added Words (Passage B) - Student ID: ' + row.student_id, row.mistakesB.added.join(', '))}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const text = row.mistakesB.added.join(', ');
                                  return text.length > 30 ? text.substring(0, 30) + '...' : text;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.addedB || 0})</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            {row.mistakesB?.grammar && row.mistakesB.grammar.length > 0 ? (
                              <span 
                                className="mistakes-words-detail clickable-text"
                                onClick={() => openModal('Grammar Mistakes (Passage B) - Student ID: ' + row.student_id, row.mistakesB.grammar.join(', '))}
                                title="Click to view full list"
                              >
                                {(() => {
                                  const text = row.mistakesB.grammar.join(', ');
                                  return text.length > 30 ? text.substring(0, 30) + '...' : text;
                                })()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            <span className="mistake-count-badge" style={{ marginLeft: '8px', fontWeight: 'bold' }}>({row.grammarB || 0})</span>
                          </td>
                          <td className="col-ignored" style={{ padding: '12px 16px' }}>
                            {row.QPB ? (
                              <span 
                                className="ignored-words-detail clickable-text"
                                onClick={() => openModal('Ignored Words (Passage B) - Student ID: ' + row.student_id, row.QPB)}
                                title="Click to view full list"
                              >
                                {row.QPB.substring(0, 30)}
                                {row.QPB.length > 30 && '...'}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            <span className="mistake-count total-mistakes mistake-count-detail">{row.totalB}</span>
                          </td>
                          <td className="col-mistakes" style={{ padding: '12px 16px' }}>
                            <span className="marks-display marks-display-detail">{row.marksB}</span>
                          </td>
                          <td className="col-result" style={{ padding: '12px 16px' }}></td>
                          <td className="col-grade" style={{ padding: '12px 16px' }}></td>
                          <td className="col-action" style={{ padding: '12px 16px' }}></td>
                        </tr>
                      </>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="22" className="text-center" style={{ padding: '12px 16px' }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="marks-calc-pagination">
          <div className="marks-calc-pagination-info">
            Showing {currentPage * rowsPerPage + 1} to{' '}
            {Math.min((currentPage + 1) * rowsPerPage, filteredData.length)} of{' '}
            {filteredData.length} entries
          </div>
          <div className="marks-calc-pagination-controls">
            <label className="me-2">Rows per page:</label>
            <select
              className="form-select form-select-sm"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="marks-calc-pagination-buttons">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleChangePage(0)}
              disabled={currentPage === 0}
            >
              First
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="marks-calc-page-number">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleChangePage(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Modal for viewing full content */}
      {modalContent.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modalContent.title}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <pre className="modal-text">{modalContent.content}</pre>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksCalculation;
