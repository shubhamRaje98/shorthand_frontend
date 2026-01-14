import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

const MockStudentPage = () => {
  const [examDate, setExamDate] = useState('');
  const [year, setYear] = useState('');
  const [studentsCount, setStudentsCount] = useState('100'); // Default 100
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (mode) => {
    if (!examDate || !year) {
      alert('Please provide exam date and year');
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
          previewData: mode !== 'preview' ? preview : [] // Add this line
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

  const styles = {
    container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
    heading: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
    form: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1, minWidth: '120px' },
    inputSmall: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' },
    select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' },
    button: { padding: '8px 16px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' },
    replaceBtn: { backgroundColor: '#1D4ED8' },
    appendBtn: { backgroundColor: '#16A34A' },
    previewBtn: { backgroundColor: '#F59E0B' },
    tableContainer: { marginTop: '20px', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { border: '1px solid #ccc', padding: '8px', backgroundColor: '#f3f3f3', textAlign: 'center' },
    td: { border: '1px solid #ccc', padding: '8px', textAlign: 'center', fontSize: '14px' },
    loading: { color: '#555', fontStyle: 'italic' },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Mock Student Generator</h1>

      {/* Input Form */}
      <div style={styles.form}>
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
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Center</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Year</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{p.studentId}</td>
                  <td style={styles.td}>{p.fullname}</td>
                  <td style={styles.td}>{p.password}</td>
                  <td style={styles.td}>{p.centerId}</td>
                  <td style={styles.td}>{p.subjectId}</td>
                  <td style={styles.td}>{p.batchdate}</td>
                  <td style={styles.td}>{p.batch_year}</td>
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