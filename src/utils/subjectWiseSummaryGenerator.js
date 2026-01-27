// src/utils/subjectWiseSummaryGenerator.js
import * as XLSX from 'xlsx';

// Subject code to name mapping based on the reference image
const subjectMapping = {
  '50': 'Eng SH 60',
  '51': 'Eng SH 80',
  '52': 'Eng SH 100',
  '53': 'Eng SH 120',
  '54': 'Eng SH 130',
  '60': 'Mar SH 60',
  '61': 'Mar SH 80',
  '62': 'Mar SH 100',
  '63': 'Mar SH 120',
  '70': 'Hin SH 60',
  '71': 'Hin SH 80',
  '72': 'Hin SH 100',
  '73': 'Hin SH 120'
};

/**
 * Aggregate data by subject for the summary report
 * ============================================================
 * DATA SOURCE DISTINCTION:
 * - Appeared Students: Comes from API's "subject_wise_count" array
 *   (total students who appeared for the exam per subject)
 * - Present Students: Derived from "data" array by counting records
 *   with calculated results (row.result is not null/undefined)
 * - Absent Students: Calculated as (Appeared - Present)
 * ============================================================
 * @param {Array} data - Array of student records with calculated results
 * @param {Array} subjectWiseCountData - Array from API containing appeared students per subject
 * @returns {Array} Aggregated summary array sorted by subject code
 */
const aggregateSubjectWiseSummary = (data, subjectWiseCountData = []) => {
  console.log('aggregateSubjectWiseSummary called with:', {
    dataCount: data?.length,
    subjectWiseCountDataCount: subjectWiseCountData?.length,
    subjectWiseCountData
  });
  
  const subjectSummary = {};

  // Create a map from subject_wise_count (API response) for Appeared Students
  // This represents the total number of students who appeared for each subject
  const appearedCountMap = {};
  subjectWiseCountData.forEach(item => {
    const subjectId = String(item.subjectId).trim();
    appearedCountMap[subjectId] = item.count || 0;
  });
  
  console.log('appearedCountMap:', appearedCountMap);

  // Initialize all subjects from mapping
  Object.entries(subjectMapping).forEach(([code, name]) => {
    subjectSummary[code] = {
      subjectCode: code,
      subjectName: name,
      appearedStudents: appearedCountMap[code] || 0, // Use API count for appeared
      presentStudents: 0,
      absentStudents: 0,
      passStudents: 0,
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      failStudents: 0
    };
  });

  // Also initialize subjects from subject_wise_count that may not be in mapping
  subjectWiseCountData.forEach(item => {
    const subjectId = String(item.subjectId).trim();
    if (!subjectSummary[subjectId]) {
      subjectSummary[subjectId] = {
        subjectCode: subjectId,
        subjectName: `Subject ${subjectId}`,
        appearedStudents: item.count || 0,
        presentStudents: 0,
        absentStudents: 0,
        passStudents: 0,
        gradeA: 0,
        gradeB: 0,
        gradeC: 0,
        failStudents: 0
      };
    }
  });

  // Process each student record from data array to derive Present Students
  data.forEach(row => {
    const subjectId = String(row.subjectId).trim();
    
    // Create entry for subjects found in data but not in mapping or subject_wise_count
    if (!subjectSummary[subjectId]) {
      subjectSummary[subjectId] = {
        subjectCode: subjectId,
        subjectName: row.subject_name || `Subject ${subjectId}`,
        appearedStudents: appearedCountMap[subjectId] || 0,
        presentStudents: 0,
        absentStudents: 0,
        passStudents: 0,
        gradeA: 0,
        gradeB: 0,
        gradeC: 0,
        failStudents: 0
      };
    }

    // Update subject name if available from data
    if (row.subject_name && subjectSummary[subjectId].subjectName.startsWith('Subject ')) {
      subjectSummary[subjectId].subjectName = row.subject_name;
    }

    const subject = subjectSummary[subjectId];

    // COUNT PRESENT STUDENTS from data array
    // A student is "present" if they have a calculated result (PASS/FAIL)
    // This is derived from the data array, NOT from subject_wise_count
    // Count every record as present
    if (row.result) {
      subject.presentStudents++;

      if (row.result === 'PASS') {
        subject.passStudents++;
        if (row.grade === 'A') subject.gradeA++;
        else if (row.grade === 'B') subject.gradeB++;
        else if (row.grade === 'C') subject.gradeC++;
      } else if (row.result === 'FAIL') {
        subject.failStudents++;
      }
    }
  });

  // CALCULATE ABSENT STUDENTS
  // Absent = Appeared (from API subject_wise_count) - Present (from data array)
  // Use Math.max(0, ...) to handle edge cases where data might be inconsistent
  Object.values(subjectSummary).forEach(subject => {
    subject.absentStudents = Math.max(0, subject.appearedStudents - subject.presentStudents);
  });

  // Convert to array and filter out subjects with no present students (no calculated results)
  const summaryArray = Object.values(subjectSummary)
    .filter(s => s.presentStudents > 0)
    .sort((a, b) => parseInt(a.subjectCode) - parseInt(b.subjectCode));

  return summaryArray;
};

/**
 * Derive subject-wise count from data array when API doesn't provide it
 * Count unique student_ids per subject as "Appeared Students"
 * @param {Array} data - Array of student records
 * @returns {Array} Derived subject-wise count array
 */
const deriveSubjectWiseCountFromData = (data) => {
  console.warn('⚠️ No subject_wise_count from backend. Deriving from data array...');
  
  // Group by subjectId and count unique student_ids
  const subjectStudentMap = {};
  data.forEach(row => {
    const subjectId = String(row.subjectId).trim();
    if (!subjectStudentMap[subjectId]) {
      subjectStudentMap[subjectId] = new Set();
    }
    if (row.student_id) {
      subjectStudentMap[subjectId].add(row.student_id);
    }
  });
  
  // Convert to array format expected by aggregateSubjectWiseSummary
  const derivedCount = Object.entries(subjectStudentMap).map(([subjectId, studentSet]) => ({
    subjectId: subjectId,
    count: studentSet.size
  }));
  
  console.log('✅ Derived subject_wise_count from data:', derivedCount);
  
  return derivedCount;
};

/**
 * Generate and download subject-wise result summary Excel
 * @param {Array} data - Array of student records with calculated results
 * @param {Array} subjectWiseCountData - Optional array from API containing appeared students per subject
 * @returns {Object} Result object with success status and message
 */
export const generateSubjectWiseSummaryExcel = (data, subjectWiseCountData) => {
  console.log('generateSubjectWiseSummaryExcel called with:', {
    dataCount: data?.length,
    subjectWiseCountDataCount: subjectWiseCountData?.length,
    subjectWiseCountData
  });
  
  // If no subject_wise_count from backend, derive it from the data array
  let actualSubjectWiseCount = subjectWiseCountData;
  
  if (!actualSubjectWiseCount || actualSubjectWiseCount.length === 0) {
    actualSubjectWiseCount = deriveSubjectWiseCountFromData(data);
    
    if (actualSubjectWiseCount.length === 0) {
      return {
        success: false,
        message: 'Warning: Could not determine appeared students count.'
      };
    }
  }
  
  const summary = aggregateSubjectWiseSummary(data, actualSubjectWiseCount);

  if (summary.length === 0) {
    return {
      success: false,
      message: 'No data available to generate subject-wise summary'
    };
  }

  // Calculate totals
  const totals = summary.reduce((acc, row) => ({
    appearedStudents: acc.appearedStudents + row.appearedStudents,
    presentStudents: acc.presentStudents + row.presentStudents,
    absentStudents: acc.absentStudents + row.absentStudents,
    passStudents: acc.passStudents + row.passStudents,
    gradeA: acc.gradeA + row.gradeA,
    gradeB: acc.gradeB + row.gradeB,
    gradeC: acc.gradeC + row.gradeC,
    failStudents: acc.failStudents + row.failStudents
  }), {
    appearedStudents: 0,
    presentStudents: 0,
    absentStudents: 0,
    passStudents: 0,
    gradeA: 0,
    gradeB: 0,
    gradeC: 0,
    failStudents: 0
  });

  // Create worksheet data with headers matching the template
  const wsData = [];

  // Title rows
  wsData.push(['महाराष्ट्र राज्य परीक्षा परिषद, पुणे']);
  wsData.push(['GCC COMPUTER SHORTHAND EXAMINATION, JUNE 2025']);
  wsData.push(['SUBJECTWISE RESULT SUMMARY']);
  wsData.push([]); // Empty row

  // Header row
  wsData.push([
    'Subject Code',
    'Subject',
    'Appeared Students',
    'Present Students',
    'Absent Students',
    'Pass Students',
    'Grade A',
    'Grade B',
    'Grade C',
    'Fail Students',
    'Percentage Result (As per Present)'
  ]);

  // Data rows
  summary.forEach(row => {
    const percentage = row.presentStudents > 0
      ? ((row.passStudents / row.presentStudents) * 100).toFixed(2) + '%'
      : '0.00%';

    wsData.push([
      row.subjectCode,
      row.subjectName,
      row.appearedStudents,
      row.presentStudents,
      row.absentStudents,
      row.passStudents,
      row.gradeA,
      row.gradeB,
      row.gradeC,
      row.failStudents,
      percentage
    ]);
  });

  // Total row
  const totalPercentage = totals.presentStudents > 0
    ? ((totals.passStudents / totals.presentStudents) * 100).toFixed(2) + '%'
    : '0.00%';

  wsData.push([
    '-',
    'Total',
    totals.appearedStudents,
    totals.presentStudents,
    totals.absentStudents,
    totals.passStudents,
    totals.gradeA,
    totals.gradeB,
    totals.gradeC,
    totals.failStudents,
    totalPercentage
  ]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths to match the template
  ws['!cols'] = [
    { wch: 12 },  // Subject Code
    { wch: 14 },  // Subject
    { wch: 14 },  // Appeared Students
    { wch: 14 },  // Present Students
    { wch: 12 },  // Absent Students
    { wch: 12 },  // Pass Students
    { wch: 10 },  // Grade A
    { wch: 10 },  // Grade B
    { wch: 10 },  // Grade C
    { wch: 12 },  // Fail Students
    { wch: 20 }   // Percentage Result
  ];

  // Merge cells for title rows
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, // Title row 1
    { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } }, // Title row 2
    { s: { r: 2, c: 0 }, e: { r: 2, c: 10 } }  // Title row 3
  ];

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Subject-wise Summary');

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `GCC_SH_RESULT_SUMMARY_${dateStr}.xlsx`;

  // Download the file
  XLSX.writeFile(wb, filename);

  return {
    success: true,
    message: `Subject-wise result summary downloaded: ${filename}`,
    filename
  };
};

export default generateSubjectWiseSummaryExcel;
