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
      console.log(response.data);
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
    <div className="em-container">
      <h1 className="em-title">Expert Management</h1>

      <div className="em-table-container">
        <h2 className="em-table-title">Expert Data</h2>
        <table className="em-table">
          <thead>
            <tr>
              <th>Expert ID</th>
              <th>Expert Name</th>
              <th>Password</th>
              <th>Paper Check</th>
              <th>Paper Mod</th>
              <th>Super Mod</th>
            </tr>
          </thead>
          <tbody>
            {experts.map((expert) => (
              <tr key={expert.expertId}>
                <td>{expert.expertId}</td>
                <td>{expert.expert_name}</td>
                <td>{expert.password}</td>
                <td>{expert.paper_check ? 'Yes' : 'No'}</td>
                <td>{expert.paper_mod ? 'Yes' : 'No'}</td>
                <td>{expert.super_mod ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="em-insert-section">
        <h2 className="em-section-title">Insert New Expert</h2>
        <input
          type="text"
          placeholder="Expert ID"
          value={newExpert.expertId}
          onChange={(e) => setNewExpert({ ...newExpert, expertId: e.target.value })}
          className="em-input"
        />
        <input
          type="text"
          placeholder="Expert Name"
          value={newExpert.expert_name}
          onChange={(e) => setNewExpert({ ...newExpert, expert_name: e.target.value })}
          className="em-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={newExpert.password}
          onChange={(e) => setNewExpert({ ...newExpert, password: e.target.value })}
          className="em-input"
        />
        <button onClick={handleInsertExpert} className="em-button">Insert Expert</button>
      </div>

      <div className="em-update-section">
        <h2 className="em-section-title">Update Experts</h2>
        <select
          value={updateExpert.paper_check}
          onChange={(e) => setUpdateExpert({ ...updateExpert, paper_check: e.target.value })}
          className="em-select"
        >
          <option value="">Select Paper Check</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <select
          value={updateExpert.paper_mod}
          onChange={(e) => setUpdateExpert({ ...updateExpert, paper_mod: e.target.value })}
          className="em-select"
        >
          <option value="">Select Paper Mod</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <select
          value={updateExpert.super_mod}
          onChange={(e) => setUpdateExpert({ ...updateExpert, super_mod: e.target.value })}
          className="em-select"
        >
          <option value="">Select Super Mod</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button onClick={() => setShowModal(true)} className="em-button">Update Experts</button>
      </div>

      {loading && <p className="em-loading">Loading...</p>}
      {error && <p className="em-error">{error}</p>}
      {success && <p className="em-success">{success}</p>}

      {showModal && (
        <div className="em-modal">
          <div className="em-modal-content">
            <h2 className="em-modal-title">Select Experts to Update</h2>
            <div className="em-expert-list">
              {experts.map((expert) => (
                <label key={expert.expertId} className="em-expert-item">
                  <input
                    type="checkbox"
                    checked={selectedExperts.includes(expert.expertId)}
                    onChange={() => toggleExpertSelection(expert.expertId)}
                    className="em-checkbox"
                  /> {expert.expert_name}
                </label>
              ))}
            </div>
            <div className="em-modal-buttons">
              <button onClick={() => handleUpdateExperts(false)} className="em-button">Update Selected</button>
              <button onClick={() => handleUpdateExperts(true)} className="em-button">Update All</button>
              <button onClick={() => setShowModal(false)} className="em-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertManagement;