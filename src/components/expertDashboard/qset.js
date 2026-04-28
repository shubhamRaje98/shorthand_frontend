// src/components/expertDashboard/qset.js
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
  const { setSelectedQSet, selectedSubject } = useDashboard();
  const location = useLocation();
  const isHeld = new URLSearchParams(location.search).get('held') === 'true';

  useEffect(() => {
    const fetchQSets = async () => {
      try {
        setLoading(true);
        // Include departmentId in the query if available
        const departmentId = selectedSubject?.departmentId;
        let url = `https://checking.shorthandonlineexam.in/qsets/${subjectId}${isHeld ? '?held=true' : ''}`;
        
        if (departmentId) {
          url += `${isHeld ? '&' : '?'}departmentId=${departmentId}`;
        }
        
        const response = await axios.get(url, { withCredentials: true });
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
  }, [subjectId, isHeld, selectedSubject]);

  const handleQSetClick = async (qsetObj) => {
    try {
      // Get departmentId and examType from selectedSubject
      const departmentId = selectedSubject?.departmentId || 'null';
      const examType = selectedSubject?.examType || 'null';
      
      // Build URL with departmentId and examType as path parameters
      let url = `https://checking.shorthandonlineexam.in/assignStudent/${subjectId}/${qsetObj.qset}/${departmentId}/${examType}`;
      
      // Add held as query parameter if needed
      if (isHeld) {
        url += '?held=true';
      }
      
      const response = await axios.post(url, {}, { withCredentials: true });
  
      if (response.status === 200) {
        setSelectedQSet({
          ...qsetObj,
          departmentId: response.data.departmentId,
          examType: response.data.examType
        });
        
        // Use the actual departmentId and examType from the response for navigation
        const finalDepartmentId = response.data.departmentId || 'null';
        const finalExamType = response.data.examType || 'null';
        
        if (response.data.paper_mod === 1) {
          navigate(`/expertDashboard/${subjectId}/${qsetObj.qset}/${finalDepartmentId}/${finalExamType}/stage2`, { replace: true });
        } else {
          if (isHeld){
            navigate(`/expertDashboard/${subjectId}/${qsetObj.qset}/${finalDepartmentId}/${finalExamType}?held=${isHeld}`, { replace: true });
          }else{
            navigate(`/expertDashboard/${subjectId}/${qsetObj.qset}/${finalDepartmentId}/${finalExamType}`, { replace: true });
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
          className={`item-button ${isHeld ? 'item-button-held' : ''}`}
          onClick={() => handleQSetClick(qsetObj)}
        >
          <div className={`item-title ${isHeld ? 'item-title-held' : ''}`}>QSet: {qsetObj.qset}</div>
          {isHeld && <span className="held-badge">HELD</span>}
          {qsetObj.incomplete_count !== undefined && qsetObj.total_count !== undefined && (
            <div className="item-count">Students: {qsetObj.incomplete_count}/{qsetObj.total_count}</div>
          )}
          {selectedSubject?.departmentId && (
            <div className="item-department">Dept: {selectedSubject.departmentId}</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default QSet;