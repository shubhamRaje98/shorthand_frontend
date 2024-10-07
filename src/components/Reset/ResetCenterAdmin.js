import React, { useState, useEffect } from 'react';
import NavBar from '../navBar/navBar';
import axios from 'axios';

const ResetCenterAdmin = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    reason: '',
    reset_type: ''
  });
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  const resetTypes = [
    'Shorthand Passage Reset',
    'Audio Reset',
    'Trial Typing Passage Reset',
    'Typing Passage Reset',
    'Trial Audio Reset'
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://www.shorthandonlineexam.in/centerrequest', formData);
      fetchRequests(); // Fetch updated requests after submission
      setFormData({ student_id: '', reason: '', reset_type: '' }); // Clear form
      setError('');
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err.response?.data?.message || 'An error occurred while submitting the request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('https://www.shorthandonlineexam.in/center-request-data');
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching requests');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://www.shorthandonlineexam.in/centerrequest/${id}`);
      fetchRequests(); // Fetch updated requests after deletion
      setError('');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError(err.response?.data?.message || 'An error occurred while deleting the request');
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h2>Reset Center Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="student_id" className="form-label">Student ID:</label>
            <input
              type="text"
              className="form-control"
              id="student_id"
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="reason" className="form-label">Reason:</label>
            <input
              type="text"
              className="form-control"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="reset_type" className="form-label">Reset Type:</label>
            <select
              className="form-select"
              id="reset_type"
              name="reset_type"
              value={formData.reset_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Reset Type</option>
              {resetTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {requests.length > 0 && (
          <div className="mt-4">
            <h3>Reset Requests</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student ID</th>
                  <th>Reason</th>
                  <th>Reset Type</th>
                  <th>Reseted By</th>
                  <th>Approval Status</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.student_id}</td>
                    <td>{request.reason}</td>
                    <td>{request.reset_type}</td>
                    <td>{request.reseted_by}</td>
                    <td>{request.approved}</td>
                    <td>{request.time}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(request.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetCenterAdmin;