import React, { useState, useEffect } from 'react';
import SuperAdminNavbar from '../super-admin/SuperAdminNavbar';
import axios from 'axios';

const ResetRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('https://www.shorthandonlineexam.in/admin/center-request-datas');
      if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setError('Received unexpected data format from server');
        setRequests([]);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching requests');
      setRequests([]);
    }
  };

  const handleApproveReject = async (requestId, action) => {
    try {
      await axios.post('https://www.shorthandonlineexam.in/admin/approve-reset-request', {
        requestId,
        action
      });
      fetchRequests(); // Refresh the list after approval/rejection
      setError('');
    } catch (err) {
      console.error('Error processing request:', err);
      setError(err.response?.data?.message || 'An error occurred while processing the request');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://www.shorthandonlineexam.in/centerrequest/${id}`);
      fetchRequests(); // Refresh the list after deletion
      setError('');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError(err.response?.data?.message || 'An error occurred while deleting the request');
    }
  };

  return (
    <>

      <div className="container mt-4">
        <h2>Admin Reset Requests</h2>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {Array.isArray(requests) && requests.length > 0 ? (
          <div className="mt-4">
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
                  <th>Actions</th>
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
                      {request.approved === 'Not Approved' && (
                        <>
                          <button 
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleApproveReject(request.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleApproveReject(request.id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      )}
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
        ) : (
          <p>No reset requests available.</p>
        )}
      </div>
    </>
  );
};

export default ResetRequestsAdmin;