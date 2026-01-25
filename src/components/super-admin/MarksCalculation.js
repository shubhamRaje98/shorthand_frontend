// src/components/super-admin/MarksCalculation.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MarksCalculation.css';

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
    departmentId: '',
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

  // Rounding function as per requirements
  const roundMarks = (marks) => {
    const num = parseFloat(marks);
    const wholePart = Math.floor(num);
    const decimalPart = num - wholePart;
    
    if (decimalPart <= 0.50) {
      // Round to nearest 0.5
      if (decimalPart === 0) return num;
      if (decimalPart <= 0.25) return wholePart + 0.5;
      return wholePart + 0.5;
    } else {
      // Round up to next whole number
      return Math.ceil(num);
    }
  };

  // Calculate result and grade
  const calculateResultAndGrade = (marksA, marksB, totalMarks) => {
    const numMarksA = parseFloat(marksA);
    const numMarksB = parseFloat(marksB);
    const numTotal = parseFloat(totalMarks);

    // Apply rounding
    let roundedA = roundMarks(numMarksA);
    let roundedB = roundMarks(numMarksB);
    let roundedTotal = roundedA + roundedB;

    // Store original values before grace
    const originalA = roundedA;
    const originalB = roundedB;
    const originalTotal = roundedTotal;

    // Initialize grace marks
    let graceMarksA = 0;
    let graceMarksB = 0;
    let totalGrace = 0;

    // Check if student fails initially
    const failsTotal = roundedTotal < 50;
    const failsPassageA = roundedA < 15;
    const failsPassageB = roundedB < 15;
    const initiallyFails = failsTotal || failsPassageA || failsPassageB;

    // Apply grace marks only if initially fails
    if (initiallyFails) {
      const maxGrace = 2;
      let remainingGrace = maxGrace;

      // Calculate how much grace is needed
      const graceNeededForTotal = Math.max(0, 50 - roundedTotal);
      const graceNeededForA = Math.max(0, 15 - roundedA);
      const graceNeededForB = Math.max(0, 15 - roundedB);

      // Prioritize passage minimums first
      if (graceNeededForA > 0 && remainingGrace > 0) {
        graceMarksA = Math.min(graceNeededForA, remainingGrace);
        remainingGrace -= graceMarksA;
        roundedA += graceMarksA;
        totalGrace += graceMarksA;
      }

      if (graceNeededForB > 0 && remainingGrace > 0) {
        graceMarksB = Math.min(graceNeededForB, remainingGrace);
        remainingGrace -= graceMarksB;
        roundedB += graceMarksB;
        totalGrace += graceMarksB;
      }

      // If still below 50 total and have grace remaining
      roundedTotal = roundedA + roundedB;
      if (roundedTotal < 50 && remainingGrace > 0) {
        const additionalGrace = Math.min(50 - roundedTotal, remainingGrace);
        // Add to passage that needs it most (or split)
        if (roundedA < roundedB) {
          graceMarksA += additionalGrace;
          roundedA += additionalGrace;
        } else {
          graceMarksB += additionalGrace;
          roundedB += additionalGrace;
        }
        totalGrace += additionalGrace;
      }

      roundedTotal = roundedA + roundedB;
    }

    // Determine PASS/FAIL
    const passes = roundedTotal >= 50 && roundedA >= 15 && roundedB >= 15;
    const result = passes ? 'PASS' : 'FAIL';

    // Calculate grade only for PASS
    let grade = '';
    if (result === 'PASS') {
      // Grade based on original percentage (before grace marks)
      const percentageBeforeGrace = (originalTotal / 80) * 100; // Assuming max is 80 for SKILL, 50 for GCC
      
      // If passed only with grace, assign lowest passing grade
      if (initiallyFails && totalGrace > 0) {
        grade = 'C';
      } else {
        // Normal grade assignment
        if (percentageBeforeGrace >= 75) {
          grade = 'A';
        } else if (percentageBeforeGrace >= 60) {
          grade = 'B';
        } else {
          grade = 'C';
        }
      }
    }

    return {
      result,
      grade,
      roundedA: roundedA.toFixed(2),
      roundedB: roundedB.toFixed(2),
      roundedTotal: roundedTotal.toFixed(2),
      graceMarksA,
      graceMarksB,
      totalGrace,
      finalMarks: roundedTotal.toFixed(2)
    };
  };

  // Compare passages and calculate mistakes
  const comparePassagesForRow = async (row) => {
    if (!row.passageA || !row.passageB || !row.ansPassageA || !row.ansPassageB) {
      return null;
    }

    try {
      // Parse ignored words for each passage
      const ignoreListA = row.QPA 
        ? row.QPA.split(',').map(word => word.trim()).filter(word => word.length > 0)
        : [];
      const ignoreListB = row.QPB 
        ? row.QPB.split(',').map(word => word.trim()).filter(word => word.length > 0)
        : [];

      // Compare Passage A
      const responseA = await axios.post('http://localhost:5002/compare', {
        text1: row.ansPassageA,
        text2: row.passageA,
        ignore_list: ignoreListA,
        ignore_case: true
      });

      // Compare Passage B
      const responseB = await axios.post('http://localhost:5002/compare', {
        text1: row.ansPassageB,
        text2: row.passageB,
        ignore_list: ignoreListB,
        ignore_case: true
      });

      if (responseA.status === 200 && responseB.status === 200) {
        const mistakesA = responseA.data;
        const mistakesB = responseB.data;

        // Calculate mistakes for Passage A
        const spellingA = mistakesA.spelling?.length || 0;
        const missedA = mistakesA.missed?.length || 0;
        const addedA = mistakesA.added?.length || 0;
        const grammarA = mistakesA.grammar?.length || 0;
        const totalA = spellingA + missedA + addedA + grammarA;

        // Calculate mistakes for Passage B
        const spellingB = mistakesB.spelling?.length || 0;
        const missedB = mistakesB.missed?.length || 0;
        const addedB = mistakesB.added?.length || 0;
        const grammarB = mistakesB.grammar?.length || 0;
        const totalB = spellingB + missedB + addedB + grammarB;

        // Calculate total mistakes from both passages
        const totalSpelling = spellingA + spellingB;
        const totalMissed = missedA + missedB;
        const totalAdded = addedA + addedB;
        const totalGrammar = grammarA + grammarB;
        const totalMistakes = totalSpelling + totalMissed + totalAdded + totalGrammar;

        // Calculate marks for Passage A
        let marksA;
        if (row.examType === 'SKILL') {
          marksA = 80 - (totalA / 2); // 40 marks per passage for SKILL
        } else {
          marksA = 50 - (totalA / 2); // 25 marks per passage for GCC
        }
        marksA = Math.max(0, marksA);

        // Calculate marks for Passage B
        let marksB;
        if (row.examType === 'SKILL') {
          marksB = 80 - (totalB / 2);
        } else {
          marksB = 50 - (totalB / 2);
        }
        marksB = Math.max(0, marksB);

        // Calculate total marks
        const totalMarks = marksA + marksB;

        // Calculate result and grade
        const resultData = calculateResultAndGrade(marksA.toFixed(2), marksB.toFixed(2), totalMarks.toFixed(2));

        return {
          spelling: totalSpelling,
          missed: totalMissed,
          added: totalAdded,
          grammar: totalGrammar,
          total: totalMistakes,
          marks: totalMarks.toFixed(2),
          // Passage A details
          spellingA,
          missedA,
          addedA,
          grammarA,
          totalA,
          marksA: marksA.toFixed(2),
          // Passage B details
          spellingB,
          missedB,
          addedB,
          grammarB,
          totalB,
          marksB: marksB.toFixed(2),
          // Result and Grade
          result: resultData.result,
          grade: resultData.grade,
          roundedA: resultData.roundedA,
          roundedB: resultData.roundedB,
          roundedTotal: resultData.roundedTotal,
          graceMarksA: resultData.graceMarksA,
          graceMarksB: resultData.graceMarksB,
          totalGrace: resultData.totalGrace,
          finalMarks: resultData.finalMarks,
          mistakesA,
          mistakesB
        };
      }
    } catch (error) {
      console.error('Error comparing passages:', error);
      return null;
    }

    return null;
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
        const tableName = selectedTable === 'expertreviewlog' ? 'Expert Review' : 'Mod Review';
        showSnackbar(`Successfully fetched ${response.data.count} records from ${tableName}`, 'success');
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
    
    if (mistakeData) {
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
      showSnackbar('Failed to calculate mistakes - missing passage data', 'error');
    }
    
    setComparingRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(row.id);
      return newSet;
    });
  };

  // Process batch results and calculate marks
  const processBatchResults = (row, mistakesA, mistakesB) => {
    if (!mistakesA || !mistakesB) return null;

    // Calculate mistakes for Passage A
    const spellingA = mistakesA.spelling?.length || 0;
    const missedA = mistakesA.missed?.length || 0;
    const addedA = mistakesA.added?.length || 0;
    const grammarA = mistakesA.grammar?.length || 0;
    const totalA = spellingA + missedA + addedA + grammarA;

    // Calculate mistakes for Passage B
    const spellingB = mistakesB.spelling?.length || 0;
    const missedB = mistakesB.missed?.length || 0;
    const addedB = mistakesB.added?.length || 0;
    const grammarB = mistakesB.grammar?.length || 0;
    const totalB = spellingB + missedB + addedB + grammarB;

    // Calculate total mistakes from both passages
    const totalSpelling = spellingA + spellingB;
    const totalMissed = missedA + missedB;
    const totalAdded = addedA + addedB;
    const totalGrammar = grammarA + grammarB;
    const totalMistakes = totalSpelling + totalMissed + totalAdded + totalGrammar;

    // Calculate marks for Passage A
    let marksA;
    if (row.examType === 'SKILL') {
      marksA = 80 - (totalA / 2);
    } else {
      marksA = 50 - (totalA / 2);
    }
    marksA = Math.max(0, marksA);

    // Calculate marks for Passage B
    let marksB;
    if (row.examType === 'SKILL') {
      marksB = 80 - (totalB / 2);
    } else {
      marksB = 50 - (totalB / 2);
    }
    marksB = Math.max(0, marksB);

    // Calculate total marks
    const totalMarks = marksA + marksB;

    // Calculate result and grade
    const resultData = calculateResultAndGrade(marksA.toFixed(2), marksB.toFixed(2), totalMarks.toFixed(2));

    return {
      spelling: totalSpelling,
      missed: totalMissed,
      added: totalAdded,
      grammar: totalGrammar,
      total: totalMistakes,
      marks: totalMarks.toFixed(2),
      spellingA,
      missedA,
      addedA,
      grammarA,
      totalA,
      marksA: marksA.toFixed(2),
      spellingB,
      missedB,
      addedB,
      grammarB,
      totalB,
      marksB: marksB.toFixed(2),
      result: resultData.result,
      grade: resultData.grade,
      roundedA: resultData.roundedA,
      roundedB: resultData.roundedB,
      roundedTotal: resultData.roundedTotal,
      graceMarksA: resultData.graceMarksA,
      graceMarksB: resultData.graceMarksB,
      totalGrace: resultData.totalGrace,
      finalMarks: resultData.finalMarks,
      mistakesA,
      mistakesB
    };
  };

  // Calculate mistakes for all rows using batch processing
  const handleCalculateAllMistakes = async () => {
    setLoading(true);
    const filterDesc = getFilterDescription();
    const totalRecords = filteredData.length;
    showSnackbar(`Calculating results for ${totalRecords} record(s) [${filterDesc}] using parallel processing...`, 'info');

    // Prepare batch items for both passages
    const validRows = filteredData.filter(
      row => row.passageA && row.passageB && row.ansPassageA && row.ansPassageB
    );
    const invalidRows = filteredData.filter(
      row => !row.passageA || !row.passageB || !row.ansPassageA || !row.ansPassageB
    );

    if (validRows.length === 0) {
      setLoading(false);
      showSnackbar('No valid records to process (missing passage data)', 'warning');
      return;
    }

    // Create batch items for Passage A and Passage B
    const batchItemsA = validRows.map((row, index) => {
      const ignoreListA = row.QPA
        ? row.QPA.split(',').map(word => word.trim()).filter(word => word.length > 0)
        : [];
      return {
        id: `${row.id}_A`,
        rowIndex: index,
        text1: row.ansPassageA,
        text2: row.passageA,
        ignore_list: ignoreListA
      };
    });

    const batchItemsB = validRows.map((row, index) => {
      const ignoreListB = row.QPB
        ? row.QPB.split(',').map(word => word.trim()).filter(word => word.length > 0)
        : [];
      return {
        id: `${row.id}_B`,
        rowIndex: index,
        text1: row.ansPassageB,
        text2: row.passageB,
        ignore_list: ignoreListB
      };
    });

    // Combine all items for batch processing
    const allBatchItems = [...batchItemsA, ...batchItemsB];

    try {
      // Send batch request to the parallel processing endpoint
      const response = await axios.post('http://localhost:5002/compare-batch', {
        items: allBatchItems,
        max_workers: 16
      });

      if (response.data.success) {
        // Create a map of results by id
        const resultsMap = {};
        response.data.results.forEach(result => {
          if (result.success) {
            resultsMap[result.id] = result.result;
          }
        });

        // Process results and update data
        const updatedData = validRows.map((row) => {
          const mistakesA = resultsMap[`${row.id}_A`];
          const mistakesB = resultsMap[`${row.id}_B`];

          if (mistakesA && mistakesB) {
            const processedData = processBatchResults(row, mistakesA, mistakesB);
            if (processedData) {
              return { ...row, ...processedData };
            }
          }
          return row;
        });

        // Combine with invalid rows (rows without passage data)
        const finalData = [...updatedData, ...invalidRows];
        
        // Sort by original order (by id)
        finalData.sort((a, b) => a.id - b.id);

        setFilteredData(finalData);
        setTableData(finalData);
        showSnackbar(
          `Finished calculating results for ${validRows.length} record(s) [${filterDesc}] using 16 parallel workers`,
          'success'
        );
      } else {
        throw new Error('Batch processing failed');
      }
    } catch (error) {
      console.error('Batch processing error:', error);
      showSnackbar(`Error during parallel processing: ${error.message}. Falling back to sequential processing...`, 'warning');
      
      // Fallback to sequential processing
      const updatedData = [];
      for (let i = 0; i < filteredData.length; i++) {
        const row = filteredData[i];
        const mistakeData = await comparePassagesForRow(row);

        if (mistakeData) {
          updatedData.push({ ...row, ...mistakeData });
        } else {
          updatedData.push(row);
        }
      }

      setFilteredData(updatedData);
      setTableData(updatedData);
      showSnackbar(`Finished calculating results for ${updatedData.length} record(s) [${filterDesc}] (sequential fallback)`, 'success');
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
      </div>

      {/* Table */}
      <div className="marks-calc-table-container">
        <table className="marks-calc-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th>Student ID</th>
              <th>Subject</th>
              <th>Exam Type</th>
              <th>Q Set</th>
              <th>Dept</th>
              <th>Expert</th>
              <th>Status</th>
              <th>Model Answer A</th>
              <th>Model Answer B</th>
              <th>User Passage A</th>
              <th>User Passage B</th>
              <th className="col-mistakes">Spelling</th>
              <th className="col-mistakes">Missed</th>
              <th className="col-mistakes">Added</th>
              <th className="col-mistakes">Grammar</th>
              <th className="col-ignored">Ignored A</th>
              <th className="col-ignored">Ignored B</th>
              <th className="col-mistakes">Total</th>
              <th className="col-mistakes">Marks</th>
              <th className="col-result">Result</th>
              <th className="col-grade">Grade</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const actualIndex = currentPage * rowsPerPage + index;
                const isCalculating = comparingRows.has(row.id);
                const isExpanded = expandedRows.has(row.id);
                const hasPassageData = row.marksA !== undefined && row.marksB !== undefined;
                
                return (
                  <React.Fragment key={row.id || index}>
                    <tr className={hasPassageData && isExpanded ? 'expanded-row' : ''}>
                      <td className="col-id">{row.id}</td>
                      <td>{row.student_id}</td>
                      <td>{row.subjectId}</td>
                      <td>{row.examType}</td>
                      <td>{row.qset}</td>
                      <td>{row.departmentId}</td>
                      <td>{row.expertId}</td>
                      <td>
                        <span className={`marks-calc-badge ${row.subm_done === 1 ? 'marks-calc-badge--success' : 'marks-calc-badge--warning'}`}>
                          {row.subm_done === 1 ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
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
                      <td>
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
                      <td>
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
                      <td>
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
                      <td className="col-mistakes">
                        {row.spelling !== undefined ? (
                          <span className="mistake-count">{row.spelling}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes">
                        {row.missed !== undefined ? (
                          <span className="mistake-count">{row.missed}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes">
                        {row.added !== undefined ? (
                          <span className="mistake-count">{row.added}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes">
                        {row.grammar !== undefined ? (
                          <span className="mistake-count">{row.grammar}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-ignored">
                        {row.QPA ? (
                          <span 
                            className="ignored-words clickable-text" 
                            title="Click to view full list"
                            onClick={() => openModal('Ignored Words (Passage A) - Student ID: ' + row.student_id, row.QPA)}
                          >
                            {row.QPA.length > 30 ? row.QPA.substring(0, 30) + '...' : row.QPA}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-ignored">
                        {row.QPB ? (
                          <span 
                            className="ignored-words clickable-text" 
                            title="Click to view full list"
                            onClick={() => openModal('Ignored Words (Passage B) - Student ID: ' + row.student_id, row.QPB)}
                          >
                            {row.QPB.length > 30 ? row.QPB.substring(0, 30) + '...' : row.QPB}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes">
                        {row.total !== undefined ? (
                          <span className="mistake-count total-mistakes">{row.total}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-mistakes">
                        {row.marks !== undefined ? (
                          <span className="marks-display">{row.marks}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-result">
                        {row.result !== undefined ? (
                          <span className={`result-badge result-badge--${row.result.toLowerCase()}`}>
                            {row.result}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-grade">
                        {row.grade !== undefined && row.grade !== '' ? (
                          <span className={`grade-badge grade-badge--${row.grade.toLowerCase()}`}>
                            {row.grade}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="col-action">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleCalculateMistakes(row, actualIndex)}
                            disabled={isCalculating || !row.passageA || !row.passageB}
                            title={!row.passageA || !row.passageB ? 'Missing passage data' : 'Calculate mistakes'}
                          >
                            {isCalculating ? '...' : 'Calc'}
                          </button>
                          {hasPassageData && (
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
                    {hasPassageData && isExpanded && (
                      <>
                        <tr className="passage-detail-row passage-a-row">
                          <td colSpan="8" className="passage-label">Passage A</td>
                          <td colSpan="4"></td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.spellingA}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.missedA}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.addedA}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.grammarA}</span>
                          </td>
                          <td className="col-ignored">
                            {row.QPA ? (
                              <span className="ignored-words-detail" title={row.QPA}>{row.QPA}</span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="col-ignored"></td>
                          <td className="col-mistakes">
                            <span className="mistake-count total-mistakes mistake-count-detail">{row.totalA}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="marks-display marks-display-detail">{row.marksA}</span>
                          </td>
                          <td className="col-action"></td>
                        </tr>
                        <tr className="passage-detail-row passage-b-row">
                          <td colSpan="8" className="passage-label">Passage B</td>
                          <td colSpan="4"></td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.spellingB}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.missedB}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.addedB}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="mistake-count mistake-count-detail">{row.grammarB}</span>
                          </td>
                          <td className="col-ignored"></td>
                          <td className="col-ignored">
                            {row.QPB ? (
                              <span className="ignored-words-detail" title={row.QPB}>{row.QPB}</span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="col-mistakes">
                            <span className="mistake-count total-mistakes mistake-count-detail">{row.totalB}</span>
                          </td>
                          <td className="col-mistakes">
                            <span className="marks-display marks-display-detail">{row.marksB}</span>
                          </td>
                          <td className="col-action"></td>
                        </tr>
                      </>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="21" className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
