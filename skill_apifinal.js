const fs = require('fs');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const ExcelJS = require('exceljs');
const http = require('http');
const path = require('path');
const mysql = require('mysql2/promise');

// Configuration
const config = {
  apiUrl: 'http://localhost:5002',
  comparePath: '/compare',
  departmentIds: [11],
  outputDir: 'pdf_skill',
  marathiFont: path.join(__dirname, 'fonts', 'NotoSansDevanagari-VariableFont_wdth,wght.ttf')
};

// Database configuration (matches skill_makrsgeneration_3rd.py)
const DB_CONFIG = {
  host: '103.17.193.168',
  port: 3306,
  user: 'root',
  password: 'tanuj1221',
  database: 'dec25',
  charset: 'utf8mb4',
  connectTimeout: 300000
};

function testApiConnection() {
  return new Promise((resolve, reject) => {
    console.log(`Testing connection to ${config.apiUrl}`);
    http.get(config.apiUrl, (res) => {
      console.log(`API responded with status code: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.error(`Error connecting to API: ${err.message}`);
      reject(err);
    });
  });
}

// Line-break markers present in all passage texts — always ignored
const LINE_MARKERS = ['////', '///', '//', '/'];

// Matches parse_ignore_list in skill_makrsgeneration_3rd.py
function parseIgnoreList(ignoreText) {
  if (!ignoreText || String(ignoreText).trim() === '') return [...LINE_MARKERS];
  const text = String(ignoreText).trim();
  let items;
  try {
    if (text.startsWith('[') && text.endsWith(']')) {
      items = JSON.parse(text);
    } else {
      items = text.split(',').map(item => item.trim().replace(/^["']+|["']+$/g, ''));
    }
  } catch {
    items = text.split(',').map(item => item.trim().replace(/^["']+|["']+$/g, ''));
  }
  const filtered = items.filter(item => item !== '');
  // Merge with line markers (avoid duplicates)
  const merged = [...new Set([...LINE_MARKERS, ...filtered])];
  return merged;
}

// marks = max(80 - totalMistakes / 2, 0)  — Passage A only
function calculateMarks(apiResult) {
  if (!apiResult || apiResult.is_empty) return { marks: 0, isEmpty: true, totalMistakes: 0 };
  const added = apiResult.added || [];
  const missed = apiResult.missed || [];
  const spelling = apiResult.spelling || [];
  const grammar = apiResult.grammar || [];
  const totalMistakes = added.length + missed.length + spelling.length + grammar.length;
  const marks = Math.max(80 - totalMistakes / 2, 0);
  return { marks, isEmpty: false, totalMistakes, added, missed, spelling, grammar };
}

// ceil to nearest 0.5  (math.ceil(marks * 2) / 2)
function roundMarks(marks) {
  return Math.ceil(marks * 2) / 2;
}

function cleanText(text) {
  if (text === null || text === undefined) return '';
  return String(text).replace(/[\x00-\x1F\x7F-\x9F‌‍]/g, '')
            .replace(/_x[0-9A-Fa-f]{4}_?/g, '');
}

// ── Load all data — sources match the frontend report exactly ──
//
// The frontend's MarksCalculation page hits /student-passages-with-filters,
// which JOINs `expertreviewlog` (for the student/subject/qset roster) with
// `finalPassageSubmit.passageA`, `audiodb.textPassageA`, and
// `qsetdb.Q{qset}PA` for the ignore list. We mirror those joins here, and
// most importantly mirror the frontend's plain comma-split parsing of QPA
// (no Python-list / quote-stripping) so the ignore list is byte-identical.

async function loadAllData(connection, departmentIds) {
  const chunkSize = 500;

  // Step 1: students filtered by departmentId
  console.log('Loading students data...');
  const ph = departmentIds.map(() => '?').join(', ');
  const [studentRows] = await connection.execute(
    `SELECT student_id, subjectsId AS subjectId, qset, departmentId
     FROM students WHERE departmentId IN (${ph}) AND batchNo != 100`,
    departmentIds
  );
  const students = studentRows;
  console.log(`Loaded ${students.length} students`);
  if (students.length === 0) return null;

  const studentIds = students.map(s => s.student_id);

  // Step 2: model answers from audiodb — keyed by subjectId|qset|departmentId
  console.log('Loading model answers (department-aware)...');
  const uniqueCombos = [...new Set(students.map(s => `${s.subjectId}|${s.qset}|${s.departmentId}`))];
  const answerPassages = {};
  for (const combo of uniqueCombos) {
    const [subjectId, qset, deptId] = combo.split('|');
    const [rows] = await connection.execute(
      `SELECT textPassageA FROM audiodb WHERE subjectId = ? AND qset = ? AND departmentId = ? LIMIT 1`,
      [subjectId, qset, deptId]
    );
    if (rows.length > 0) answerPassages[combo] = rows[0].textPassageA;
  }
  console.log(`Loaded ${Object.keys(answerPassages).length} model answer passages`);

  // Step 3: student passages from finalPassageSubmit
  console.log('Loading student passages...');
  const studentPassages = {};
  for (let i = 0; i < studentIds.length; i += chunkSize) {
    const chunk = studentIds.slice(i, i + chunkSize);
    const phc = chunk.map(() => '?').join(', ');
    const [rows] = await connection.execute(
      `SELECT student_id, passageA FROM finalPassageSubmit WHERE student_id IN (${phc})`,
      chunk
    );
    for (const row of rows) studentPassages[row.student_id] = row.passageA;
  }
  console.log(`Loaded ${Object.keys(studentPassages).length} student passages`);

  // Step 4: ignore lists from qsetdb (keyed by subjectId|departmentId, indexed by qset).
  // Frontend parser: row.QPA.split(',').map(trim).filter(non-empty) — no quote/bracket
  // stripping. We mirror that, then merge the line markers.
  console.log('Loading ignore lists from qsetdb (frontend-compatible parse)...');
  const uniqueIgnoreCombos = [...new Set(students.map(s => `${s.subjectId}|${s.departmentId}`))];
  const ignoreLists = {};
  const parseQPAFrontend = (raw) => {
    const items = raw
      ? String(raw).split(',').map(w => w.trim()).filter(w => w.length > 0)
      : [];
    return [...new Set([...LINE_MARKERS, ...items])];
  };
  for (const combo of uniqueIgnoreCombos) {
    const [subjectId, deptId] = combo.split('|');
    const [rows] = await connection.execute(
      `SELECT Q1PA,Q2PA,Q3PA,Q4PA,Q5PA,Q6PA,Q7PA,Q8PA FROM qsetdb WHERE subjectId = ? AND departmentId = ?`,
      [subjectId, deptId]
    );
    if (rows.length > 0) {
      const r = rows[0];
      ignoreLists[combo] = {};
      for (let q = 1; q <= 8; q++) {
        ignoreLists[combo][q] = parseQPAFrontend(r[`Q${q}PA`] || '');
      }
    }
  }
  console.log(`Loaded ignore lists for ${Object.keys(ignoreLists).length} subject-dept combinations`);

  return { students, answerPassages, studentPassages, ignoreLists };
}

// ── Process Passage A and write into PDF ──

async function processPassageInPDF(doc, studentId, studentAnswer, modelAnswer, ignoreList) {
  let calculatedMarks = 0;
  let apiResult = null;

  if (!studentAnswer || !modelAnswer ||
      String(studentAnswer).trim() === '' || String(modelAnswer).trim() === '') {
    doc.fontSize(12).text('Passage A - No data available', { align: 'justify' });
    return { marks: 0, success: false, apiResult: null };
  }

  try {
    // text1 = model answer, text2 = student answer (matches comparisonService.js order)
    const payload = { text1: modelAnswer, text2: studentAnswer, ignore_list: ignoreList };
    console.log(`Calling API for student ${studentId} - Passage A...`);
    const response = await axios.post(`${config.apiUrl}${config.comparePath}`, payload, { timeout: 15000 });
    apiResult = response.data;
    const result = calculateMarks(apiResult);
    calculatedMarks = result.marks;
    console.log(`✅ PROCESSED: ${studentId} - Passage A: ${calculatedMarks.toFixed(2)}/80`);
  } catch (error) {
    console.error(`❌ Error calling API for student ${studentId} - Passage A: ${error.message}`);
    calculatedMarks = 0;
  }

  // Passage header
  doc.fontSize(14).text('Passage A', { align: 'justify' });
  doc.fontSize(12).text(`Marks: ${calculatedMarks.toFixed(2)}/80`, { align: 'justify' });
  doc.moveDown();

  doc.fontSize(12).text('Student Answer:', { align: 'justify' });
  doc.moveDown();
  doc.fontSize(10).text(cleanText(studentAnswer), { align: 'justify' });
  doc.moveDown();

  doc.fontSize(12).text('Model Answer:', { align: 'justify' });
  doc.moveDown();
  doc.fontSize(10).text(cleanText(modelAnswer), { align: 'justify' });
  doc.moveDown();

  doc.fontSize(10).text('Comparison Results:', { align: 'justify' });
  doc.moveDown();

  if (apiResult && Array.isArray(apiResult.colored_words)) {
    let isFirstWord = true;
    apiResult.colored_words.forEach(word => {
      const options = { continued: true };
      if (isFirstWord) { options.align = 'justify'; isFirstWord = false; }
      if (word.color === 'red') {
        doc.fillColor('red').text(word.word + ' ', options);
      } else if (word.color === 'green') {
        doc.fillColor('green').text(word.word + ' ', options);
      } else {
        doc.fillColor('black').text(word.word + ' ', options);
      }
    });
  } else {
    doc.text('Error: Unable to process comparison or API call failed');
  }
  doc.fillColor('black').text('');
  doc.moveDown();

  if (apiResult) {
    doc.fontSize(12).text('Summary of Mistakes:', { align: 'justify' });
    doc.moveDown();

    const missed = apiResult.missed || [];
    const added = apiResult.added || [];
    const spelling = apiResult.spelling || [];
    const grammar = apiResult.grammar || [];
    const totalMistakes = missed.length + added.length + spelling.length + grammar.length;
    const marksDeducted = totalMistakes / 2;

    doc.fontSize(10).text(`Total mistakes: ${totalMistakes} (Marks deducted: ${marksDeducted.toFixed(2)})`, { align: 'justify' });
    doc.moveDown();
    doc.text(`missed words (${added.length}): ${added.join(', ') || 'None'}`, { align: 'justify' });
    doc.moveDown();
    doc.text(`added words (${missed.length}): ${missed.join(', ') || 'None'}`, { align: 'justify' });
    doc.moveDown();
    const spellingText = spelling.map(item => Array.isArray(item) ? `${item[0]} -> ${item[1]}` : item).join(', ');
    doc.text(`Spelling changes (${spelling.length}): ${spellingText || 'None'}`, { align: 'justify' });
    doc.moveDown();
    doc.text(`Grammar errors (${grammar.length}): ${grammar.join(', ') || 'None'}`, { align: 'justify' });
    doc.moveDown();
  }

  return { marks: calculatedMarks, success: !!apiResult && !apiResult.error, apiResult };
}

// ── PDF creation for a single student ──

async function createPDF(studentId, subjectId, qset, passageA_student, textPassageA_answer, ignoreListA, modreviewQPA, outputFilename) {
  console.log(`\n🔄 Creating PDF for student ${studentId}`);

  const doc = new PDFDocument({ font: config.marathiFont });
  doc.pipe(fs.createWriteStream(outputFilename));

  // PDF Header
  doc.fontSize(14).text(`Seat No: ${studentId}`, { align: 'justify' });
  doc.moveDown();

  // Process Passage A
  const passageAResult = await processPassageInPDF(doc, studentId, passageA_student, textPassageA_answer, ignoreListA);

  // Summary page
  const roundedA = roundMarks(passageAResult.marks);
  const passStatus = roundedA >= 32 ? 'Pass' : 'Fail';

  doc.addPage();
  doc.fontSize(14).text('Summary', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Passage A Marks: ${passageAResult.marks.toFixed(2)}/80  (Rounded: ${roundedA.toFixed(1)})`, { align: 'justify' });
  doc.moveDown();
  doc.text(`Result: ${passStatus}`, { align: 'justify' });
  doc.text('(Pass criteria: Rounded marks >= 32)', { align: 'justify' });
  doc.moveDown();

  // Notes page
  doc.addPage();
  doc.fontSize(12).text('Note:', { align: 'justify' });
  doc.fillColor('green').text('• Words in green color represent ADDED words', { align: 'justify', continued: false });
  doc.fillColor('red').text('• Words in red color represent MISSING words', { align: 'justify', continued: false });
  doc.fillColor('black').text('• Words with ', { align: 'justify', continued: true });
  doc.fillColor('red').text('red', { continued: true });
  doc.fillColor('black').text(' and ', { continued: true });
  doc.fillColor('green').text('green', { continued: true });
  doc.fillColor('black').text(' color combination represent SPELLING MISTAKE words', { continued: false });
  doc.fillColor('black').text('• Marks are calculated as: 80 - (Total Mistakes ÷ 2) for Passage A', { align: 'justify', continued: false });
  doc.fillColor('black').text('• Minimum marks awarded: 0', { align: 'justify', continued: false });
  doc.fillColor('black').text('• Maximum marks: 80', { align: 'justify', continued: false });
  doc.fillColor('black');

  doc.end();
  console.log(`✅ Finished PDF for student ${studentId} - Marks: ${passageAResult.marks.toFixed(2)}/80`);

  const apiA = passageAResult.apiResult || {};
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const fmtList = arr => arr.map(i => Array.isArray(i) ? `${i[0]} -> ${i[1]}` : i).join(', ');

  return {
    status: passageAResult.success ? 'success' : 'failed',
    data: {
      Student_ID: studentId,
      Subject_ID: subjectId,
      QSet: qset,
      ModReview_QPA: modreviewQPA !== undefined && modreviewQPA !== null ? modreviewQPA : 'N/A',
      PassageA_Ignore_List: ignoreListA.length > 0 ? ignoreListA.join(', ') : 'None',
      PassageA_Marks: +passageAResult.marks.toFixed(2),
      PassageA_Marks_Rounded: roundedA,
      PassageA_Empty: !passageAResult.success,
      PassageA_Added_List: fmtList(apiA.added || []),
      PassageA_Added_Count: (apiA.added || []).length,
      PassageA_Missed_List: fmtList(apiA.missed || []),
      PassageA_Missed_Count: (apiA.missed || []).length,
      PassageA_Spelling_List: fmtList(apiA.spelling || []),
      PassageA_Spelling_Count: (apiA.spelling || []).length,
      PassageA_Grammar_List: (apiA.grammar || []).join(', '),
      PassageA_Grammar_Count: (apiA.grammar || []).length,
      PassageA_Total_Mistakes: (apiA.added || []).length + (apiA.missed || []).length + (apiA.spelling || []).length + (apiA.grammar || []).length,
      Pass_Status: passStatus,
      Evaluation_Timestamp: timestamp
    },
    printMsg: ` | PassageA: ${passageAResult.marks.toFixed(2)} (${roundedA}) | ${passStatus}`
  };
}

// ── Save results to Excel (mirrors save_results_to_excel in Python) ──

async function saveResultsToExcel(resultsList, departmentIds, failedStudents) {
  if (resultsList.length === 0 && failedStudents.length === 0) {
    console.log('No results to save');
    return;
  }

  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15).replace('.', '');
  const deptLabel = departmentIds.join('_');
  const filename = `passageA_evaluation_results_dept_${deptLabel}_${timestamp}.xlsx`;

  const workbook = new ExcelJS.Workbook();

  if (resultsList.length > 0) {
    const ws = workbook.addWorksheet('Results');
    const cols = Object.keys(resultsList[0]);
    ws.columns = cols.map(key => ({ header: key, key, width: Math.min(Math.max(key.length + 2, 12), 50) }));
    for (const r of resultsList) ws.addRow(r);
    ws.getRow(1).font = { bold: true };
  }

  if (failedStudents.length > 0) {
    const wsf = workbook.addWorksheet('Failed_Students');
    const cols = Object.keys(failedStudents[0]);
    wsf.columns = cols.map(key => ({ header: key, key, width: Math.min(Math.max(key.length + 2, 12), 30) }));
    for (const f of failedStudents) wsf.addRow(f);
    wsf.getRow(1).font = { bold: true };
  }

  const total = resultsList.length + failedStudents.length;
  const successRate = total > 0 ? +((resultsList.length / total) * 100).toFixed(2) : 0;
  const wss = workbook.addWorksheet('Summary');
  wss.columns = [{ header: 'Metric', key: 'Metric', width: 30 }, { header: 'Value', key: 'Value', width: 30 }];
  wss.addRow({ Metric: 'Total Students Found', Value: total });
  wss.addRow({ Metric: 'Successful Evaluations', Value: resultsList.length });
  wss.addRow({ Metric: 'Failed Evaluations', Value: failedStudents.length });
  wss.addRow({ Metric: 'Success Rate (%)', Value: successRate });
  wss.addRow({ Metric: 'Processing Time', Value: new Date().toISOString().replace('T', ' ').slice(0, 19) });
  wss.getRow(1).font = { bold: true };

  await workbook.xlsx.writeFile(filename);
  console.log(`Results saved to: ${filename}`);
  console.log(`Successful evaluations: ${resultsList.length}`);
  console.log(`Failed evaluations: ${failedStudents.length}`);
}

// ── Main ──

async function main() {
  console.log('=== PASSAGE A EVALUATION SYSTEM WITH MODREVIEW ===');
  console.log(`Processing departments: [${config.departmentIds.join(', ')}]`);

  try {
    await testApiConnection();

    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir);
    }

    const connection = await mysql.createConnection(DB_CONFIG);
    console.log('Successfully connected to MySQL database');

    console.log('\n=== LOADING DATA ===');
    const data = await loadAllData(connection, config.departmentIds);
    await connection.end();
    console.log('Database connection closed (all data loaded)');

    if (!data) {
      console.log('Failed to load data or no students found');
      return;
    }

    const { students, answerPassages, studentPassages, ignoreLists } = data;

    console.log(`\n=== DATA SUMMARY ===`);
    console.log(`Students found: ${students.length}`);
    console.log(`Answer passages loaded: ${Object.keys(answerPassages).length}`);
    console.log(`Student passages loaded: ${Object.keys(studentPassages).length}`);
    console.log(`Ignore list combos: ${Object.keys(ignoreLists).length}`);

    console.log('\n=== BUILDING WORK QUEUE ===');
    const workQueue = [];
    const failedStudents = [];

    for (const student of students) {
      const { student_id, subjectId, qset, departmentId } = student;
      const answerKey = `${subjectId}|${qset}|${departmentId}`;
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

      if (!answerPassages[answerKey]) {
        failedStudents.push({ Student_ID: student_id, Subject_ID: subjectId, QSet: qset,
                              Failure_Reason: `No model answer in audiodb for ${answerKey}`, Timestamp: timestamp });
        continue;
      }
      if (!studentPassages[student_id]) {
        failedStudents.push({ Student_ID: student_id, Subject_ID: subjectId, QSet: qset,
                              Failure_Reason: 'No student passage in finalPassageSubmit', Timestamp: timestamp });
        continue;
      }

      const ignoreKey = `${subjectId}|${departmentId}`;
      const ignoreListA = (ignoreLists[ignoreKey] && ignoreLists[ignoreKey][qset]) || [...LINE_MARKERS];

      workQueue.push({
        studentId: student_id, subjectId, qset,
        passageA_student: studentPassages[student_id],
        textPassageA_answer: answerPassages[answerKey],
        ignoreListA
      });
    }

    console.log(`Work queue: ${workQueue.length} students to evaluate, ${failedStudents.length} skipped`);
    console.log('\n=== STARTING EVALUATION ===\n');

    const resultsList = [];
    let completed = failedStudents.length;
    const total = students.length;

    for (const item of workQueue) {
      completed++;
      const outputFilename = path.join(config.outputDir, `${item.studentId}.pdf`);
      try {
        const result = await createPDF(
          item.studentId, item.subjectId, item.qset,
          item.passageA_student, item.textPassageA_answer,
          item.ignoreListA, null,
          outputFilename
        );
        resultsList.push(result.data);
        console.log(`[${completed}/${total}]${result.printMsg}`);
      } catch (err) {
        console.error(`[${completed}/${total}] Failed student ${item.studentId}: ${err.message}`);
        failedStudents.push({ Student_ID: item.studentId, Subject_ID: item.subjectId, QSet: item.qset,
                              Failure_Reason: err.message, Timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) });
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n=== SAVING RESULTS ===');
    await saveResultsToExcel(resultsList, config.departmentIds, failedStudents);

    console.log('\n=== FINAL SUMMARY ===');
    console.log(`Departments: [${config.departmentIds.join(', ')}]`);
    console.log(`Total students: ${students.length}`);
    console.log(`Successfully processed: ${resultsList.length}`);
    console.log(`Failed: ${failedStudents.length}`);
    if (students.length > 0) {
      console.log(`Success rate: ${((resultsList.length / students.length) * 100).toFixed(1)}%`);
    }

  } catch (error) {
    console.error('Critical error:', error);
  }
}

main().catch(console.error);
