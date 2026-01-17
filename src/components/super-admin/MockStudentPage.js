import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

const MockStudentPage = () => {
  const [examDate, setExamDate] = useState('');
  const [year, setYear] = useState('');
  const [studentsCount, setStudentsCount] = useState('100'); // Default 100
  const [departmentId, setDepartmentId] = useState('');
  const [qset, setQset] = useState('');

  // Timing state
  const [reportingTime, setReportingTime] = useState('10:00:00');
  const [startTime, setStartTime] = useState('11:30:00');
  const [endTime, setEndTime] = useState('13:00:00');

  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (mode) => {
    if (!examDate || !year || !departmentId) {
      alert('Please provide exam date, year, and department ID');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://www.shorthandonlineexam.in/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchdate: examDate,
          batch_year: year,
          studentsPerSubject: parseInt(studentsCount) || 100,
          departmentId: departmentId,
          qset: qset,
          reporting_time: reportingTime,
          start_time: startTime,
          end_time: endTime,
          previewData: mode !== 'preview' ? preview : []
        })
      });
      const data = await res.json();

      if (res.ok) {
        // For preview, data.previewData from backend
        if (mode === 'preview') setPreview(data.previewData || []);
        else alert(data.message || `${mode} completed`);
      } else {
        alert(data.message || 'Error');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMissing = async () => {
    if (!examDate || !year || !departmentId) {
      alert('Please provide exam date, year, and department ID');
      return;
    }

    setLoading(true);

    try {
      // 1. Generate expected student list (starting from 1)
      const resPreview = await fetch(`https://www.shorthandonlineexam.in/api/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchdate: examDate,
          batch_year: year,
          studentsPerSubject: parseInt(studentsCount) || 100,
          departmentId: departmentId,
          qset: qset,
          reporting_time: reportingTime,
          start_time: startTime,
          end_time: endTime,
          start_from_one: true // <--- FORCE generation from sequence 1 (e.g. 1..100)
        })
      });
      const dataPreview = await resPreview.json();

      if (!resPreview.ok) {
        throw new Error(dataPreview.message || 'Error generating missing list');
      }

      const missingData = dataPreview.previewData || [];
      if (missingData.length === 0) {
        alert("No data generated for missing check.");
        setLoading(false);
        return;
      }

      // 2. Send to Append (which uses INSERT IGNORE to skip existing)
      const resAppend = await fetch(`https://www.shorthandonlineexam.in/api/append`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previewData: missingData
        })
      });
      const dataAppend = await resAppend.json();

      if (resAppend.ok) {
        alert(dataAppend.message || 'Missing students added successfully (duplicates skipped).');
      } else {
        alert(dataAppend.message || 'Error adding missing students');
      }

    } catch (err) {
      console.error(err);
      alert('Server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  const styles = {
    container: { padding: '20px', maxWidth: '1050px', margin: '0 auto' },
    heading: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
    form: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1, minWidth: '120px' },
    inputSmall: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' },
    inputTime: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '110px' },
    select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' },
    button: { padding: '8px 16px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' },
    replaceBtn: { backgroundColor: '#1D4ED8' },
    appendBtn: { backgroundColor: '#16A34A' },
    addMissingBtn: { backgroundColor: '#7C3AED' }, // Purple for Add Missing
    previewBtn: { backgroundColor: '#F59E0B' },
    tableContainer: { marginTop: '20px', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { border: '1px solid #ccc', padding: '8px', backgroundColor: '#f3f3f3', textAlign: 'center' },
    td: { border: '1px solid #ccc', padding: '8px', textAlign: 'center', fontSize: '14px' },
    loading: { color: '#555', fontStyle: 'italic' },
    label: { fontSize: '12px', fontWeight: 'bold', marginRight: '5px' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Mock Student Generator</h1>

      {/* Input Form */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Dept ID"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          style={styles.inputSmall}
        />

        <input
          type="text"
          placeholder="QSet (Optional)"
          value={qset}
          onChange={(e) => setQset(e.target.value)}
          style={styles.inputSmall}
        />

        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={styles.inputSmall}
        />
        <select
          value={studentsCount}
          onChange={(e) => setStudentsCount(e.target.value)}
          style={styles.select}
        >
          <option value="">Default 100</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="150">150</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="500">500</option>
        </select>

        {/* Timing Inputs */}
        <div>
          <label style={styles.label}>Reporting:</label>
          <input
            type="text"
            value={reportingTime}
            onChange={(e) => setReportingTime(e.target.value)}
            style={styles.inputTime}
            placeholder="HH:MM:SS"
          />
        </div>
        <div>
          <label style={styles.label}>Start:</label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={styles.inputTime}
            placeholder="HH:MM:SS"
          />
        </div>
        <div>
          <label style={styles.label}>End:</label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={styles.inputTime}
            placeholder="HH:MM:SS"
          />
        </div>

        <button
          style={{ ...styles.button, ...styles.previewBtn }}
          onClick={() => handleGenerate('preview')}
          disabled={loading}
        >
          Show Preview
        </button>
        <button
          style={{ ...styles.button, ...styles.replaceBtn }}
          onClick={() => handleGenerate('replace')}
          disabled={loading || preview.length === 0}
        >
          Replace & Generate
        </button>
        <button
          style={{ ...styles.button, ...styles.appendBtn }}
          onClick={() => handleGenerate('append')}
          disabled={loading || preview.length === 0}
        >
          Append
        </button>
        <button
          style={{ ...styles.button, ...styles.addMissingBtn }}
          onClick={handleAddMissing}
          disabled={loading}
          title="Generates 1 to N and checks for missing entries"
        >
          Add Missing
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <ProgressBar animated now={100} label="Processing..." />
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && (
        <div style={styles.tableContainer}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Preview</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Center</th>
                <th style={styles.th}>Dept</th>
                <th style={styles.th}>QSet</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Reporting</th>
                <th style={styles.th}>Start</th>
                <th style={styles.th}>End</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{p.studentId}</td>
                  <td style={styles.td}>{p.fullname}</td>
                  <td style={styles.td}>{p.centerId}</td>
                  <td style={styles.td}>{p.departmentId}</td>
                  <td style={styles.td}>{p.qset}</td>
                  <td style={styles.td}>{p.batchdate}</td>
                  <td style={styles.td}>{p.reporting_time}</td>
                  <td style={styles.td}>{p.start_time}</td>
                  <td style={styles.td}>{p.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MockStudentPage;