import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './expertDash.css';
import { useDashboard } from './DashboardContext';
import { toast } from 'react-toastify';

const QSet = () => {
  const [qsets, setQsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const { setSelectedQSet } = useDashboard();

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
        toast.error('Error fetching QSets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQSets();
  }, [subjectId]);

  const handleQSetClick = async (qsetObj) => {
    try {
      const response = await axios.post(`http://localhost:3000/assignStudent/${subjectId}/${qsetObj.qset}`, {}, { withCredentials: true });
      if (response.status === 200) {
        setSelectedQSet(qsetObj);
        navigate(`/expertDashboard/${subjectId}/${qsetObj.qset}`);
      }
    } catch (err) {
      console.error('Error assigning student for QSet:', err);
      if (err.response && err.response.status === 400) {
        toast.warning(err.response.data.error);
      } else {
        toast.error('Error assigning student. Please try again later.');
      }
    }
  };

  if (loading) {
    return <p>Loading QSets...</p>;
  }

  if (qsets.length === 0) {
    return <p>Empty QSets. All students checked!</p>;
  }

  return (
    <div className="qset-container">
      {qsets.map((qsetObj) => (
        <button
          key={qsetObj.qset}
          className="item-button"
          onClick={() => handleQSetClick(qsetObj)}
        >
          <div className="item-title">QSet: {qsetObj.qset}</div>
          <div className="item-count">Students: {qsetObj.incomplete_count}/{qsetObj.total_count}</div>
        </button>
      ))}
    </div>
  );
};

export default QSet;