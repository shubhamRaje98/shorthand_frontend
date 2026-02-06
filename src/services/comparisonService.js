// src/services/comparisonService.js
import axios from 'axios';

/**
 * Configuration for comparison service
 */
const COMPARISON_API_BASE_URL = 'http://localhost:5002';

/**
 * Flatten mistakes object to comma-separated string
 * Extracts words from spelling, missed, added, and grammar arrays (excludes colored_words)
 * @param {Object} mistakesObj - The mistakes object from backend
 * @returns {string} Comma-separated list of mistake words
 */
const flattenMistakes = (mistakesObj) => {
  if (!mistakesObj || typeof mistakesObj !== 'object') {
    return '';
  }

  const allMistakes = [];

  // Extract words from each category (exclude colored_words)
  if (Array.isArray(mistakesObj.spelling)) {
    allMistakes.push(...mistakesObj.spelling);
  }
  if (Array.isArray(mistakesObj.missed)) {
    allMistakes.push(...mistakesObj.missed);
  }
  if (Array.isArray(mistakesObj.added)) {
    allMistakes.push(...mistakesObj.added);
  }
  if (Array.isArray(mistakesObj.grammar)) {
    allMistakes.push(...mistakesObj.grammar);
  }

  // Return as comma-separated string
  return allMistakes.join(', ');
};

/**
 * Calculate result and grade based on marks
 * @param {number} marksA - Marks for Passage A
 * @param {number} marksB - Marks for Passage B
 * @param {number} totalMarks - Total marks
 * @returns {Object} Result data including result, grade, rounded marks, and grace marks
 */
const calculateResultAndGrade = (marksA, marksB, totalMarks) => {
  const roundMarks = (marks) => {
    const num = parseFloat(marks);
    const wholePart = Math.floor(num);
    const decimalPart = num - wholePart;
    
    if (decimalPart <= 0.50) {
      if (decimalPart === 0) return num;
      if (decimalPart <= 0.25) return wholePart + 0.5;
      return wholePart + 0.5;
    } else {
      return Math.ceil(num);
    }
  };

  const numMarksA = parseFloat(marksA);
  const numMarksB = parseFloat(marksB);

  // Apply rounding
  let roundedA = roundMarks(numMarksA);
  let roundedB = roundMarks(numMarksB);
  let roundedTotal = roundedA + roundedB;

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
      // Add to passage that needs it most
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
    const percentageBeforeGrace = (originalTotal / 80) * 100;
    
    if (initiallyFails && totalGrace > 0) {
      grade = 'C';
    } else {
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

/**
 * Compare two passages and return mistake analysis
 * @param {string} answerPassage - The correct/answer passage
 * @param {string} userPassage - The user's submitted passage
 * @param {Array<string>} ignoreList - List of words to ignore in comparison
 * @returns {Promise<Object>} Comparison result with mistake counts
 */
export const comparePassages = async (answerPassage, userPassage, ignoreList = []) => {
  try {
    const response = await axios.post(`${COMPARISON_API_BASE_URL}/compare`, {
      text1: answerPassage,
      text2: userPassage,
      ignore_list: ignoreList,
      ignore_case: true
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data
      };
    }
  } catch (error) {
    console.error('Error comparing passages:', error);
    return {
      success: false,
      error: true,
      message: error.response?.status === 404 
        ? 'Comparison service not found (404). Please check if the API server is running on port 5002.'
        : error.code === 'ECONNREFUSED' || error.message.includes('Network Error')
        ? 'Cannot connect to comparison service. Please ensure the API server is running on http://localhost:5002'
        : error.response?.data?.message || error.message || 'Failed to connect to comparison service'
    };
  }
};

/**
 * Compare passages for a single row and calculate complete results
 * @param {Object} row - The data row containing passage information
 * @returns {Promise<Object>} Complete comparison result with marks, mistakes, result, and grade
 */
export const comparePassagesForRow = async (row) => {
  // Use single space for empty/null passages to allow calculation
  const passageA = row.passageA && row.passageA.trim() !== '' ? row.passageA : ' ';
  const passageB = row.passageB && row.passageB.trim() !== '' ? row.passageB : ' ';
  const ansPassageA = row.ansPassageA && row.ansPassageA.trim() !== '' ? row.ansPassageA : ' ';
  const ansPassageB = row.ansPassageB && row.ansPassageB.trim() !== '' ? row.ansPassageB : ' ';

  // Parse ignored words for each passage
  const ignoreListA = row.QPA 
    ? row.QPA.split(',').map(word => word.trim()).filter(word => word.length > 0)
    : [];
  const ignoreListB = row.QPB 
    ? row.QPB.split(',').map(word => word.trim()).filter(word => word.length > 0)
    : [];

  // Compare both passages
  const resultA = await comparePassages(ansPassageA, passageA, ignoreListA);
  const resultB = await comparePassages(ansPassageB, passageB, ignoreListB);

  // Check for errors
  if (!resultA.success) return resultA;
  if (!resultB.success) return resultB;

  const mistakesA = resultA.data;
  const mistakesB = resultB.data;

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
    marksA = 50 - (totalA / 3);
  }
  marksA = Math.max(0, marksA);

  // Calculate marks for Passage B
  let marksB;
  if (row.examType === 'SKILL') {
    marksB = 80 - (totalB / 2);
  } else {
    marksB = 50 - (totalB / 3);
  }
  marksB = Math.max(0, marksB);

  // Calculate total marks
  const totalMarks = marksA + marksB;

  // Calculate result and grade
  const resultData = calculateResultAndGrade(marksA.toFixed(2), marksB.toFixed(2), totalMarks.toFixed(2));

  return {
    success: true,
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
    mistakesA: flattenMistakes(mistakesA),
    mistakesB: flattenMistakes(mistakesB)
  };
};

/**
 * Process batch comparison results and calculate marks for each row
 * @param {Object} row - The data row
 * @param {Object} mistakesA - Mistakes data for Passage A
 * @param {Object} mistakesB - Mistakes data for Passage B
 * @returns {Object|null} Processed result data or null if invalid
 */
export const processBatchResults = (row, mistakesA, mistakesB) => {
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
    marksA = 50 - (totalA / 3);
  }
  marksA = Math.max(0, marksA);

  // Calculate marks for Passage B
  let marksB;
  if (row.examType === 'SKILL') {
    marksB = 80 - (totalB / 2);
  } else {
    marksB = 50 - (totalB / 3);
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

/**
 * Prepare batch items for comparison from data rows
 * @param {Array<Object>} rows - Array of data rows
 * @returns {Array<Object>} Array of batch items ready for API submission
 */
export const prepareBatchItems = (rows) => {
  const batchItemsA = rows.map((row, index) => {
    const ignoreListA = row.QPA
      ? row.QPA.split(',').map(word => word.trim()).filter(word => word.length > 0)
      : [];
    const passageA = row.passageA && row.passageA.trim() !== '' ? row.passageA : ' ';
    const ansPassageA = row.ansPassageA && row.ansPassageA.trim() !== '' ? row.ansPassageA : ' ';
    return {
      id: `${row.id}_A`,
      rowIndex: index,
      text1: ansPassageA,
      text2: passageA,
      ignore_list: ignoreListA
    };
  });

  const batchItemsB = rows.map((row, index) => {
    const ignoreListB = row.QPB
      ? row.QPB.split(',').map(word => word.trim()).filter(word => word.length > 0)
      : [];
    const passageB = row.passageB && row.passageB.trim() !== '' ? row.passageB : ' ';
    const ansPassageB = row.ansPassageB && row.ansPassageB.trim() !== '' ? row.ansPassageB : ' ';
    return {
      id: `${row.id}_B`,
      rowIndex: index,
      text1: ansPassageB,
      text2: passageB,
      ignore_list: ignoreListB
    };
  });

  return [...batchItemsA, ...batchItemsB];
};

/**
 * Send batch comparison request to the API
 * @param {Array<Object>} batchItems - Array of items to compare
 * @param {number} maxWorkers - Maximum number of parallel workers (default: 16)
 * @returns {Promise<Object>} Batch comparison results
 */
export const compareBatch = async (batchItems, maxWorkers = 16) => {
  try {
    const response = await axios.post(
      `${COMPARISON_API_BASE_URL}/compare-batch`,
      {
        items: batchItems,
        max_workers: maxWorkers
      },
      {
        timeout: 0, // Disable timeout completely
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    if (response.data.success) {
      return {
        success: true,
        results: response.data.results
      };
    } else {
      throw new Error('Batch processing failed - server returned unsuccessful response');
    }
  } catch (error) {
    console.error('Batch processing error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    return {
      success: false,
      error: true,
      message: `Error during batch processing: ${errorMessage}. Please check server logs and try again.`
    };
  }
};

/**
 * Process batch comparison for multiple rows
 * @param {Array<Object>} rows - Array of data rows to process
 * @param {number} maxWorkers - Maximum number of parallel workers (default: 16)
 * @returns {Promise<Object>} Result with updated data or error
 */
export const processBatchComparison = async (rows, maxWorkers = 16) => {
  if (rows.length === 0) {
    return {
      success: false,
      message: 'No records to process'
    };
  }

  // Prepare batch items
  const batchItems = prepareBatchItems(rows);

  // Send batch request
  const batchResult = await compareBatch(batchItems, maxWorkers);

  if (!batchResult.success) {
    return batchResult;
  }

  // Create a map of results by id
  const resultsMap = {};
  batchResult.results.forEach(result => {
    if (result.success) {
      resultsMap[result.id] = result.result;
    }
  });

  // Process results and update data
  const updatedData = rows.map((row) => {
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

  // Sort by original order (by id)
  updatedData.sort((a, b) => a.id - b.id);

  return {
    success: true,
    data: updatedData,
    processedCount: rows.length
  };
};

// Export all functions as default object
const comparisonService = {
  comparePassages,
  comparePassagesForRow,
  compareBatch,
  processBatchResults,
  prepareBatchItems,
  processBatchComparison
};

export default comparisonService;
