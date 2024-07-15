// qset.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './expertDash.css';

const QSet = () => {
  const [qsets, setQsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQSet, setSelectedQSet] = useState(null);
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQSets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/qsets/${subjectId}`, { withCredentials: true });
        if (response.status === 200) {
          // Sort the QSets in ascending order
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

  const handleQSetClick = (qset) => {
    setSelectedQSet(qset);
    navigate(`/expertDashboard/${subjectId}/${qset}`);
  };

  if (loading) {
    return <p>Loading QSets...</p>;
  }

  if (qsets.length === 0) {
    return <p>Empty QSets</p>;
  }

  return (
    <>
      {qsets.map((qsetObj) => (
        <button
          key={qsetObj.qset}
          className={`item-button ${selectedQSet === qsetObj.qset ? 'selected' : ''}`}
          onClick={() => handleQSetClick(qsetObj.qset)}
        >
          <div className="item-title">QSet: {qsetObj.qset}</div>
        </button>
      ))}
    </>
  );
};

export default QSet;