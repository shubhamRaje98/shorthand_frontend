// src/components/super-admin/AddController.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddController.css';

const AddController = () => {
  const [loading, setLoading] = useState(false);
  const [controllers, setControllers] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showTable, setShowTable] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Generate controllers (preview only)
  const handleGenerateControllers = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');
    setShowTable(false);
    
    try {
      const response = await axios.post('http://localhost:3000/api/new-department/generate-controllers');
      
      if (response.data.success) {
        setControllers(response.data.data);
        setShowTable(true);
        setMessage(`Generated ${response.data.count} controller records. Review and click "Approve" to save.`);
        setMessageType('info');
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Approve and save controllers to database
  const handleApproveControllers = async () => {
    setIsApproving(true);
    setMessage('');
    setMessageType('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/new-department/generate-save-controllers');
      
      if (response.data.success) {
        setMessage(`✅ Successfully saved ${response.data.count} controllers to database!`);
        setMessageType('success');
        setShowTable(false);
        setControllers([]);
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    } finally {
      setIsApproving(false);
    }
  };

  // Cancel and clear the table
  const handleCancel = () => {
    setControllers([]);
    setShowTable(false);
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="add-controller-container">
      <div className="add-controller-header">
        <h2>Add Controller</h2>
        <p className="subtitle">Generate controller accounts for department-batch-center combinations</p>
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button 
          onClick={handleGenerateControllers} 
          disabled={loading || showTable}
          className="btn btn-generate"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Generate Controllers'
          )}
        </button>

        {showTable && (
          <>
            <button 
              onClick={handleApproveControllers} 
              disabled={isApproving}
              className="btn btn-approve"
            >
              {isApproving ? (
                <>
                  <span className="spinner"></span>
                  Approving...
                </>
              ) : (
                '✓ Approve & Save to Database'
              )}
            </button>

            <button 
              onClick={handleCancel} 
              disabled={isApproving}
              className="btn btn-cancel"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* Controllers Table */}
      {showTable && controllers.length > 0 && (
        <div className="table-container">
          <h3>Preview: {controllers.length} Controller Records</h3>
          <div className="table-wrapper">
            <table className="controllers-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Department ID</th>
                  <th>Batch No</th>
                  <th>Center</th>
                  <th>Controller Code</th>
                  <th>Controller Contact</th>
                  <th>Controller Email</th>
                  <th>Controller Name</th>
                  <th>Controller Password</th>
                </tr>
              </thead>
              <tbody>
                {controllers.map((ctrl, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ctrl.departmentId}</td>
                    <td>{ctrl.batchNo}</td>
                    <td>{ctrl.center}</td>
                    <td className="empty-field">{ctrl.controller_code || '—'}</td>
                    <td className="empty-field">{ctrl.controller_contact || '—'}</td>
                    <td className="empty-field">{ctrl.controller_email || '—'}</td>
                    <td className="empty-field">{ctrl.controller_name || '—'}</td>
                    <td className="password-field">{ctrl.controller_pass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="table-footer">
            <p className="footer-note">
              <strong>Note:</strong> Empty fields (—) will be stored as empty strings in the database.
              Passwords are auto-generated based on batch number and center.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddController;
