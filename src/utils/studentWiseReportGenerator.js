// src/utils/studentWiseReportGenerator.js
import ExcelJS from 'exceljs';

/**
 * Generate and download student-wise complete result Excel report
 * This report includes all evaluation details for each student including passage-wise breakdown
 * @param {Array} data - Array of student records with calculated results
 * @returns {Promise<Object>} Result object with success status and message
 */
export const generateStudentWiseReportExcel = async (data) => {
  console.log('generateStudentWiseReportExcel called with:', {
    dataCount: data?.length
  });
  
  try {
    // Filter data to only include records with calculated results
    const processedData = data.filter(row => row.result && row.marks !== undefined);

    if (processedData.length === 0) {
      return {
        success: false,
        message: 'No calculated results available. Please calculate results first before downloading the report.'
      };
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student-wise Results', {
      properties: { defaultRowHeight: 20 }
    });

    // Define column headers with proper widths
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Student ID', key: 'student_id', width: 15 },
      { header: 'Subject ID', key: 'subjectId', width: 12 },
      { header: 'Exam Type', key: 'examType', width: 12 },
      { header: 'Q Set', key: 'qset', width: 10 },
      { header: 'Department ID', key: 'departmentId', width: 14 },
      { header: 'Expert ID', key: 'expertId', width: 12 },
      { header: 'Submission Status', key: 'subm_done', width: 16 },
      { header: 'Ignored Words A', key: 'ignoredA', width: 25 },
      { header: 'Ignored Words B', key: 'ignoredB', width: 25 },
      { header: 'Mistakes A', key: 'mistakesA', width: 25 },
      { header: 'Mistakes B', key: 'mistakesB', width: 25 },
      { header: 'Spelling A', key: 'spellingA', width: 12 },
      { header: 'Missed A', key: 'missedA', width: 12 },
      { header: 'Added A', key: 'addedA', width: 12 },
      { header: 'Grammar A', key: 'grammarA', width: 12 },
      { header: 'Total Mistakes A', key: 'totalA', width: 16 },
      { header: 'Marks A', key: 'marksA', width: 12 },
      { header: 'Spelling B', key: 'spellingB', width: 12 },
      { header: 'Missed B', key: 'missedB', width: 12 },
      { header: 'Added B', key: 'addedB', width: 12 },
      { header: 'Grammar B', key: 'grammarB', width: 12 },
      { header: 'Total Mistakes B', key: 'totalB', width: 16 },
      { header: 'Marks B', key: 'marksB', width: 12 },
      { header: 'Total Spelling', key: 'spelling', width: 14 },
      { header: 'Total Missed', key: 'missed', width: 14 },
      { header: 'Total Added', key: 'added', width: 14 },
      { header: 'Total Grammar', key: 'grammar', width: 14 },
      { header: 'Total Mistakes', key: 'total', width: 14 },
      { header: 'Total Marks', key: 'marks', width: 12 },
      { header: 'Rounded A', key: 'roundedA', width: 12 },
      { header: 'Rounded B', key: 'roundedB', width: 12 },
      { header: 'Grace Marks A', key: 'graceMarksA', width: 14 },
      { header: 'Grace Marks B', key: 'graceMarksB', width: 14 },
      { header: 'Total Grace', key: 'totalGrace', width: 12 },
      { header: 'Final Marks', key: 'finalMarks', width: 12 },
      { header: 'Result', key: 'result', width: 10 },
      { header: 'Grade', key: 'grade', width: 10 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0066CC' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    headerRow.height = 25;

    // Add borders to header
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // Add data rows
    processedData.forEach((row, index) => {
      const dataRow = worksheet.addRow({
        id: row.id || '',
        student_id: row.student_id || '',
        subjectId: row.subjectId || '',
        examType: row.examType || '',
        qset: row.qset || '',
        departmentId: row.departmentId || '',
        expertId: row.expertId || '',
        subm_done: row.subm_done === 1 ? 'Yes' : row.subm_done === 0 ? 'No' : '',
        ignoredA: row.QPA || '',
        ignoredB: row.QPB || '',
        mistakesA: row.mistakesA || '',
        mistakesB: row.mistakesB || '',
        spellingA: row.spellingA !== undefined ? row.spellingA : '',
        missedA: row.missedA !== undefined ? row.missedA : '',
        addedA: row.addedA !== undefined ? row.addedA : '',
        grammarA: row.grammarA !== undefined ? row.grammarA : '',
        totalA: row.totalA !== undefined ? row.totalA : '',
        marksA: row.marksA !== undefined ? row.marksA : '',
        spellingB: row.spellingB !== undefined ? row.spellingB : '',
        missedB: row.missedB !== undefined ? row.missedB : '',
        addedB: row.addedB !== undefined ? row.addedB : '',
        grammarB: row.grammarB !== undefined ? row.grammarB : '',
        totalB: row.totalB !== undefined ? row.totalB : '',
        marksB: row.marksB !== undefined ? row.marksB : '',
        spelling: row.spelling !== undefined ? row.spelling : '',
        missed: row.missed !== undefined ? row.missed : '',
        added: row.added !== undefined ? row.added : '',
        grammar: row.grammar !== undefined ? row.grammar : '',
        total: row.total !== undefined ? row.total : '',
        marks: row.marks || '',
        roundedA: row.roundedA !== undefined ? row.roundedA : '',
        roundedB: row.roundedB !== undefined ? row.roundedB : '',
        graceMarksA: row.graceMarksA !== undefined ? row.graceMarksA : 0,
        graceMarksB: row.graceMarksB !== undefined ? row.graceMarksB : 0,
        totalGrace: row.totalGrace !== undefined ? row.totalGrace : 0,
        finalMarks: row.finalMarks !== undefined ? row.finalMarks : row.marks || '',
        result: row.result || '',
        grade: row.grade || ''
      });

      // Apply alternating row colors for better readability
      const fillColor = index % 2 === 0 ? 'FFF5F5F5' : 'FFFFFFFF';
      dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };

        // Add borders
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
        };

        // Align text
        cell.alignment = { 
          vertical: 'middle', 
          horizontal: 'center',
          wrapText: false
        };

        // Highlight result column
        if (colNumber === 37) { // Result column
          cell.font = { bold: true };
          if (cell.value === 'PASS') {
            cell.font.color = { argb: 'FF008000' };
          } else if (cell.value === 'FAIL') {
            cell.font.color = { argb: 'FFFF0000' };
          }
        }

        // Highlight grade column
        if (colNumber === 38) { // Grade column
          cell.font = { bold: true };
          if (cell.value === 'A') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF90EE90' }
            };
          } else if (cell.value === 'B') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFFE0' }
            };
          } else if (cell.value === 'C') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFA500' }
            };
          }
        }
      });
    });

    // Freeze the header row
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1 }
    ];

    // Add auto-filter to header row
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 38 }
    };

    // Generate filename with date
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Student_Wise_Complete_Report_${dateStr}.xlsx`;

    // Write to buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: `Student-wise complete report downloaded: ${filename}`,
      filename,
      recordCount: processedData.length
    };
  } catch (error) {
    console.error('Error generating student-wise report:', error);
    return {
      success: false,
      message: `Error generating report: ${error.message}`
    };
  }
};

// Export as default
export default {
  generateStudentWiseReportExcel
};
