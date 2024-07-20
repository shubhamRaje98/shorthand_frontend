// qset.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './expertDash.css';

const QSet = () => {
  const [qsets, setQsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { subjectId } = useParams();

  useEffect(() => {
    const fetchQSets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/qsets/${subjectId}`, { withCredentials: true });
        if (response.status === 200) {
          const sortedQSets = response.data.sort((a, b) => a.qset - b.qset);
          setQsets(sortedQSets);
        }
      } catch (err) {
        console.error('Error fetching qsets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQSets();
  }, [subjectId]);

  const handleQSetClick = async (qset) => {
    try {
      const response = await axios.post(`http://localhost:3000/assignStudent/${subjectId}/${qset}`, {}, { withCredentials: true });
      if (response.status === 200) {
        navigate(`/expertDashboard/${subjectId}/${qset}`);
      }
    } catch (err) {
      console.error('Error assigning student for QSet:', err);
    }
  };

  if (loading) {
    return <p>Loading QSets...</p>;
  }

  if (qsets.length === 0) {
    return <p>Empty QSets</p>;
  }

  return (
    <div className="qset-container">
      {qsets.map((qsetObj) => (
        <button
          key={qsetObj.qset}
          className="item-button"
          onClick={() => handleQSetClick(qsetObj.qset)}
        >
          <div className="item-title">QSet: {qsetObj.qset}</div>
          <div className="item-count">Students: {qsetObj.student_count}</div>
        </button>
      ))}
    </div>
  );
};

export default QSet;