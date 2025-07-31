import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './expertDash.css';
import { useDashboard } from './DashboardContext';
import { toast } from 'react-toastify';

const QSet = () => {
  const [qsets, setQsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const { setSelectedQSet } = useDashboard();
  const location = useLocation();
  const isHeld = new URLSearchParams(location.search).get('held') === 'true';

  useEffect(() => {
    const fetchQSets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3002/qsets/${subjectId}${isHeld ? '?held=true' : ''}`, { withCredentials: true });
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
  }, [subjectId, isHeld]);

  const handleQSetClick = async (qsetObj) => {
    try {
      // Include the held parameter in the URL
      const response = await axios.post(
        `http://localhost:3002/assignStudent/${subjectId}/${qsetObj.qset}?held=${isHeld}`, 
        {}, 
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        setSelectedQSet(qsetObj);
        
        if (response.data.paper_mod === 1) {
          navigate(`/expertDashboard/${subjectId}/${qsetObj.qset}/stage2`, { replace: true });
        } else {
          if (isHeld){
            navigate(`/expertDashboard/${subjectId}/${qsetObj.qset}?held=${isHeld}`, { replace: true });
          }else{
            navigate(`/expertDashboard/${subjectId}/${qsetObj.qset}`, { replace: true });
          }
        }
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
          {qsetObj.incomplete_count !== undefined && qsetObj.total_count !== undefined && (
            <div className="item-count">Students: {qsetObj.incomplete_count}/{qsetObj.total_count}</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default QSet;