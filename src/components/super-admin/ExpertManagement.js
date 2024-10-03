// ExpertManagement.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExpertManagement.css';

const ExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newExpert, setNewExpert] = useState({ expertId: '', expert_name: '', password: '' });
  const [updateExpert, setUpdateExpert] = useState({ paper_check: '', paper_mod: '', super_mod: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedExperts, setSelectedExperts] = useState([]);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3000/get-experts');
      setExperts(response.data.results || []);
    } catch (err) {
      setError('Error fetching experts.');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertExpert = async () => {
    try {
      const response = await axios.post('http://localhost:3000/insert-expert', newExpert);
      setSuccess(response.data.message);
      setNewExpert({ expertId: '', expert_name: '', password: '' });
      fetchExperts();
    } catch (err) {
      setError('Error inserting expert.');
    }
  };

  const handleUpdateExperts = async (updateAll = false) => {
    try {
      const response = await axios.post('http://localhost:3000/update-experts', {
        experts: updateAll ? [] : selectedExperts,
        paper_check: updateExpert.paper_check === 'true',
        paper_mod: updateExpert.paper_mod === 'true',
        super_mod: updateExpert.super_mod === 'true',
        updateAll: updateAll
      });
      setSuccess(response.data.message);
      fetchExperts();
      setShowModal(false);
    } catch (err) {
      setError('Error updating experts.');
    }
  };

  const toggleExpertSelection = (expertId) => {
    setSelectedExperts(prevSelected => 
      prevSelected.includes(expertId)
        ? prevSelected.filter(id => id !== expertId)
        : [...prevSelected, expertId]
    );
  };

  return (
    <div className="expert-management-container">
      <h1>Expert Management</h1>

      {/* Insert Expert Section */}
      <div className="insert-expert-section">
        <h2>Insert New Expert</h2>
        <input
          type="text"
          placeholder="Expert ID"
          value={newExpert.expertId}
          onChange={(e) => setNewExpert({ ...newExpert, expertId: e.target.value })}
        />
        <input
          type="text"
          placeholder="Expert Name"
          value={newExpert.expert_name}
          onChange={(e) => setNewExpert({ ...newExpert, expert_name: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newExpert.password}
          onChange={(e) => setNewExpert({ ...newExpert, password: e.target.value })}
        />
        <button onClick={handleInsertExpert}>Insert Expert</button>
      </div>

      {/* Update Expert Section */}
      <div className="update-expert-section">
        <h2>Update Experts</h2>
        <select
          value={updateExpert.paper_check}
          onChange={(e) => setUpdateExpert({ ...updateExpert, paper_check: e.target.value })}
        >
          <option value="">Select Paper Check</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <select
          value={updateExpert.paper_mod}
          onChange={(e) => setUpdateExpert({ ...updateExpert, paper_mod: e.target.value })}
        >
          <option value="">Select Paper Mod</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <select
          value={updateExpert.super_mod}
          onChange={(e) => setUpdateExpert({ ...updateExpert, super_mod: e.target.value })}
        >
          <option value="">Select Super Mod</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button onClick={() => setShowModal(true)}>Update Experts</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Experts to Update</h2>
            <div className="expert-list">
              {experts.map((expert) => (
                <label key={expert.expertId}>
                  <input
                    type="checkbox"
                    checked={selectedExperts.includes(expert.expertId)}
                    onChange={() => toggleExpertSelection(expert.expertId)}
                  /> {expert.expert_name}
                </label>
              ))}
            </div>
            <div className="modal-buttons">
              <button onClick={() => handleUpdateExperts(false)}>Update Selected</button>
              <button onClick={() => handleUpdateExperts(true)}>Update All</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertManagement;