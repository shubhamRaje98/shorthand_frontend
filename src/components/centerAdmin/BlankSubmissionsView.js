import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../navBar/navBar';
import './BlankSubmissionsView.css';

const BlankSubmissionsView = () => {
    const [blankSubmissions, setBlankSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, commented, uncommented
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [batches, setBatches] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [centerInfo, setCenterInfo] = useState(null);

    useEffect(() => {
        fetchCenterInfo();
    }, []);

    useEffect(() => {
        if (centerInfo) {
            fetchBlankSubmissions();
        }
    }, [centerInfo, selectedBatch]);

    const fetchCenterInfo = async () => {
        try {
            const response = await axios.get('https://www.shorthandonlineexam.in/get-center-details', { withCredentials: true });
            if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
                const centerData = response.data.examCenterDTO[0];
                setCenterInfo({ center: centerData.center });
            } else {
                setError('Center information not found. Please log in again.');
            }
        } catch (err) {
            console.error('Error fetching center info:', err);
            setError('Failed to get center information. Please log in again.');
        }
    };

    const fetchBlankSubmissions = async () => {
        if (!centerInfo) return;

        setLoading(true);
        setError('');

        try {
            const batch = selectedBatch === 'all' ? 'all' : selectedBatch;
            const response = await axios.get(
                `https://www.shorthandonlineexam.in/api/blank-submissions/center/${centerInfo.center}/${batch}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                let data = response.data.data;

                // Apply filter
                if (filter === 'commented') {
                    data = data.filter(item => item.center_comment);
                } else if (filter === 'uncommented') {
                    data = data.filter(item => !item.center_comment);
                }

                setBlankSubmissions(data);

                // Extract unique batches
                const uniqueBatches = [...new Set(data.map(item => item.batchNo))].sort();
                setBatches(uniqueBatches);
            }
        } catch (err) {
            console.error('Error fetching blank submissions:', err);
            setError('Failed to fetch blank submissions. ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (id) => {
        if (!commentText.trim()) {
            alert('Please enter a comment');
            return;
        }

        try {
            const response = await axios.post(
                `https://www.shorthandonlineexam.in/api/blank-submissions/comment/${id}`,
                {
                    comment: commentText,
                    commentedBy: sessionStorage.getItem('centerName') || 'Center Admin'
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                alert('Comment added successfully!');
                setEditingId(null);
                setCommentText('');
                fetchBlankSubmissions();
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Failed to add comment: ' + (err.response?.data?.error || err.message));
        }
    };

    const startEditing = (submission) => {
        setEditingId(submission.id);
        setCommentText(submission.center_comment || '');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const uncommentedCount = blankSubmissions.filter(item => !item.center_comment).length;

    return (
        <div>
            <NavBar />
            <div className="blank-submissions-container">
                <div className="header-section">
                    <h2>Blank Passage Submissions</h2>
                    {uncommentedCount > 0 && (
                        <div className="alert alert-warning">
                            <strong>⚠️ {uncommentedCount}</strong> blank submission(s) need your comment
                        </div>
                    )}
                </div>

                <div className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="batchFilter">Batch:</label>
                        <select
                            id="batchFilter"
                            className="form-select"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                        >
                            <option value="all">All Batches</option>
                            {batches.map(batch => (
                                <option key={batch} value={batch}>{batch}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="commentFilter">Status:</label>
                        <select
                            id="commentFilter"
                            className="form-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="commented">Commented</option>
                            <option value="uncommented">Needs Comment</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={fetchBlankSubmissions}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Batch No</th>
                                    <th>Passage Type</th>
                                    <th>Submitted At</th>
                                    <th>Comment</th>
                                    <th>Commented By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blankSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No blank submissions found
                                        </td>
                                    </tr>
                                ) : (
                                    blankSubmissions.map((submission) => (
                                        <tr key={submission.id} className={!submission.center_comment ? 'uncommented-row' : ''}>
                                            <td>{submission.student_id}</td>
                                            <td>{submission.fullname || 'N/A'}</td>
                                            <td>{submission.batchNo}</td>
                                            <td>
                                                <span className={`badge ${submission.passage_type === 'passageA' ? 'bg-primary' : 'bg-success'}`}>
                                                    {submission.passage_type === 'passageA' ? 'Passage A' : 'Passage B'}
                                                </span>
                                            </td>
                                            <td>{formatDate(submission.submitted_at)}</td>
                                            <td>
                                                {editingId === submission.id ? (
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        placeholder="Enter reason for blank submission..."
                                                    />
                                                ) : (
                                                    <div className={!submission.center_comment ? 'text-muted' : ''}>
                                                        {submission.center_comment || 'No comment yet'}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{submission.commented_by || '-'}</td>
                                            <td>
                                                {editingId === submission.id ? (
                                                    <div className="btn-group-vertical">
                                                        <button
                                                            className="btn btn-sm btn-success mb-1"
                                                            onClick={() => handleAddComment(submission.id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => {
                                                                setEditingId(null);
                                                                setCommentText('');
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => startEditing(submission)}
                                                    >
                                                        {submission.center_comment ? 'Edit' : 'Add Comment'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="summary-section">
                    <div className="summary-card">
                        <h5>Total Blank Submissions: {blankSubmissions.length}</h5>
                        <p>Commented: {blankSubmissions.filter(s => s.center_comment).length}</p>
                        <p>Needs Comment: {uncommentedCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlankSubmissionsView;
