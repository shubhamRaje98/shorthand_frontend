import React, { useState, useEffect } from 'react';
import NavBar from '../navBar/navBar';
import axios from 'axios';

// Reusable Form Field Component
const FormField = ({ label, icon, children }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold text-dark mb-2">
      <i className={`bi bi-${icon} me-2 text-primary`}></i>
      {label}
    </label>
    {children}
  </div>
);

// Reusable Table Row Component
const RequestTableRow = ({ request }) => {
  const getStatusBadge = (status) => {
    if (status === 'approved' || status === 'Approved') {
      return <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Approved</span>;
    } else if (status === 'pending' || status === 'Pending') {
      return <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">Pending</span>;
    } else if (status === 'rejected' || status === 'Rejected') {
      return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">Rejected</span>;
    }
    return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">{status}</span>;
  };

  return (
    <tr>
      <td className="px-4 py-3 text-center fw-semibold">{request.id}</td>
      <td className="px-4 py-3">{request.student_id}</td>
      <td className="px-4 py-3">{request.reason}</td>
      <td className="px-4 py-3">{request.reset_type}</td>
      <td className="px-4 py-3 text-center">{request.reseted_by}</td>
      <td className="px-4 py-3 text-center">{getStatusBadge(request.approved)}</td>
      <td className="px-4 py-3 text-center text-muted small">{request.time}</td>
    </tr>
  );
};

const ResetCenterAdmin = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    reason: '',
    reset_type: ''
  });
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetTypes = [
    'Shorthand Passage A Reset',
    'Audio A Reset',
    'Shorthand Passage B Reset',
    'Audio B Reset',
    'Trial Audio Reset'
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/centerrequest', formData);
      fetchRequests(); // Fetch updated requests after submission
      setFormData({ student_id: '', reason: '', reset_type: '' }); // Clear form
      alert('Request submitted successfully!');
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err.response?.data?.message || 'An error occurred while submitting the request');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/center-request-data');
      setRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/centerrequest/${id}`);
      fetchRequests(); // Fetch updated requests after deletion
      setError('');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError(err.response?.data?.message || 'An error occurred while deleting the request');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavBar />
      <div className="flex-grow-1">
        <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              {/* Header Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                          <i className="bi bi-arrow-clockwise text-primary fs-3"></i>
                        </div>
                        <div>
                          <h2 className="h4 fw-bold text-dark mb-1">Reset Center Admin</h2>
                          <p className="text-muted small mb-0">Submit and manage student reset requests</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <span>{error}</span>
                </div>
              )}

              {/* Reset Request Form */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      <h5 className="fw-bold text-dark mb-4">
                        <i className="bi bi-pencil-square me-2 text-primary"></i>
                        Submit Reset Request
                      </h5>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          {/* Student ID Field */}
                          <div className="col-12 col-md-6">
                            <FormField label="Student ID" icon="person-badge">
                              <input
                                type="text"
                                className="form-control form-control-lg rounded-3 shadow-sm border-0"
                                id="student_id"
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleInputChange}
                                placeholder="Enter student ID"
                                required
                              />
                            </FormField>
                          </div>

                          {/* Reset Type Field */}
                          <div className="col-12 col-md-6">
                            <FormField label="Reset Type" icon="gear">
                              <select
                                className="form-select form-select-lg rounded-3 shadow-sm border-0"
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
                            </FormField>
                          </div>

                          {/* Reason Field */}
                          <div className="col-12">
                            <FormField label="Reason" icon="chat-left-text">
                              <textarea
                                className="form-control form-control-lg rounded-3 shadow-sm border-0"
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                placeholder="Enter reason for reset"
                                rows="3"
                                required
                              />
                            </FormField>
                          </div>

                          {/* Submit Button */}
                          <div className="col-12">
                            <button 
                              type="submit" 
                              className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm fw-semibold"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-send me-2"></i>
                                  Submit Request
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requests Table */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted fw-medium">Loading requests...</p>
                </div>
              ) : requests.length > 0 ? (
                <div className="row">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-3">
                      <div className="card-header bg-white border-0 p-4">
                        <h5 className="fw-bold text-dark mb-1">
                          <i className="bi bi-list-check me-2 text-success"></i>
                          Reset Requests
                        </h5>
                        <p className="text-muted small mb-0">{requests.length} request{requests.length !== 1 ? 's' : ''} found</p>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="table-light">
                              <tr>
                                <th className="fw-semibold text-dark text-center px-4 py-3">ID</th>
                                <th className="fw-semibold text-dark px-4 py-3">Student ID</th>
                                <th className="fw-semibold text-dark px-4 py-3">Reason</th>
                                <th className="fw-semibold text-dark px-4 py-3">Reset Type</th>
                                <th className="fw-semibold text-dark text-center px-4 py-3">Reset By</th>
                                <th className="fw-semibold text-dark text-center px-4 py-3">Status</th>
                                <th className="fw-semibold text-dark text-center px-4 py-3">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {requests.map((request) => (
                                <RequestTableRow key={request.id} request={request} />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body p-5 text-center">
                    <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: '64px', height: '64px' }}>
                      <i className="bi bi-inbox text-secondary fs-3"></i>
                    </div>
                    <h5 className="text-muted fw-medium">No Requests Found</h5>
                    <p className="text-muted small mb-0">Submit your first reset request using the form above.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetCenterAdmin;
