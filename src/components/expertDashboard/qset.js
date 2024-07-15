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
          const sortedQSets = response.data.sort((a, b) => a - b);
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
        setSelectedQSet(qset);
        navigate(`/expertDashboard/${subjectId}/${qset}`);
      }
    } catch (err) {
      console.error('Error assigning student for QSet:', err);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (loading) {
    return <p>Loading QSets...</p>;
  }

  if (qsets.length === 0) {
    return <p>Empty QSets</p>;
  }

  return (
    <>
      {qsets.map((qset) => (
        <button
          key={qset}
          className={`item-button ${selectedQSet === qset ? 'selected' : ''}`}
          onClick={() => handleQSetClick(qset)}
        >
          <div className="item-title">QSet: {qset}</div>
        </button>
      ))}
    </>
  );
};

export default QSet;