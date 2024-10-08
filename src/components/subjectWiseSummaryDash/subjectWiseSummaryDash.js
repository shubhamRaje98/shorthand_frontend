import React, { useState, useEffect } from 'react';
import './SubjectWiseResultSummary.css';
import axios from 'axios';

const SubjectWiseResultSummary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      setIsLoading(true);
      setProgress(0);

      // Start listening for progress updates
      const eventSource = new EventSource('https://www.shorthandonlineexam.in/recalculate-progress');
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProgress(data.progress);
      };

      const response = await axios.get('https://www.shorthandonlineexam.in/recalculate-result');
      console.log("Response:", response.data);
      setSummaryData(response.data);
      setIsLoading(false);
      eventSource.close();
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || 'An error occurred while fetching data');
      setIsLoading(false);
    }
  };

  const handleRecalculate = () => {
    fetchSummaryData();
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}}></div>
        </div>
        <p>Loading: {progress}%</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="subject-wise-result-summary">
      <div className="header">
        <h2>Result Summary</h2>
        <button onClick={handleRecalculate} className="recalculate-btn">Recalculate</button>
      </div>
      {summaryData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Subject ID</th>
              <th>Subject Name</th>
              <th>Pass</th>
              <th>Fail</th>
              <th>Total</th>
              <th>Pass Percentage</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item, index) => (
              <tr key={index}>
                <td>{item.subjectsId}</td>
                <td>{item.subject_name}</td>
                <td>{item.pass}</td>
                <td>{item.fail}</td>
                <td>{item.total}</td>
                <td>{item.pass_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default SubjectWiseResultSummary;