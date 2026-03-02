import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuperAdminNavbar from './SuperAdminNavbar';
import * as XLSX from 'xlsx';
import './AdminBlankSubmissionsView.css';

const AdminBlankSubmissionsView = () => {
    const [blankSubmissions, setBlankSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filterCenter, setFilterCenter] = useState('');
    const [filterBatch, setFilterBatch] = useState('');
    const [filterComment, setFilterComment] = useState('all'); // all, commented, uncommented
    const [centers, setCenters] = useState([]);
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetchBlankSubmissions();
    }, []);

    const fetchBlankSubmissions = async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            if (filterCenter) params.append('center', filterCenter);
            if (filterBatch) params.append('batchNo', filterBatch);
            if (filterComment !== 'all') {
                params.append('hasComment', filterComment === 'commented' ? 'true' : 'false');
            }

            const url = `https://www.shorthandonlineexam.in/api/blank-submissions/admin/all${params.toString() ? '?' + params.toString() : ''}`;
            const response = await axios.get(url, { withCredentials: true });

            if (response.data.success) {
                setBlankSubmissions(response.data.data);

                // Extract unique centers and batches for filters
                const uniqueCenters = [...new Set(response.data.data.map(item => item.center))].sort();
                const uniqueBatches = [...new Set(response.data.data.map(item => item.batchNo))].sort();

                setCenters(uniqueCenters);
                setBatches(uniqueBatches);
            }
        } catch (err) {
            console.error('Error fetching blank submissions:', err);
            setError('Failed to fetch blank submissions. ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsViewed = async (id) => {
        try {
            const response = await axios.post(
                `https://www.shorthandonlineexam.in/api/blank-submissions/admin/mark-viewed/${id}`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                // Update local state
                setBlankSubmissions(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, viewed_by_admin: true } : item
                    )
                );
            }
        } catch (err) {
            console.error('Error marking as viewed:', err);
            alert('Failed to mark as viewed: ' + (err.response?.data?.error || err.message));
        }
    };

    const exportToExcel = () => {
        const exportData = blankSubmissions.map((item) => ({
            'Student ID': item.student_id,
            'Student Name': item.fullname || 'N/A',
            'Center': item.center,
            'Center Name': item.center_name || 'N/A',
            'Batch No': item.batchNo,
            'Passage Type': item.passage_type === 'passageA' ? 'Passage A' : 'Passage B',
            'Submitted At': formatDate(item.submitted_at),
            'Center Comment': item.center_comment || 'No comment',
            'Commented By': item.commented_by || '-',
            'Commented At': item.commented_at ? formatDate(item.commented_at) : '-',
            'Viewed by Admin': item.viewed_by_admin ? 'Yes' : 'No'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Blank Submissions');
        XLSX.writeFile(
            workbook,
            `blank_submissions_${new Date().toISOString().split('T')[0]}.xlsx`
        );
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

    const totalSubmissions = blankSubmissions.length;
    const commentedCount = blankSubmissions.filter(s => s.center_comment).length;
    const uncommentedCount = totalSubmissions - commentedCount;
    const viewedCount = blankSubmissions.filter(s => s.viewed_by_admin).length;

    return (
        <div>
            <SuperAdminNavbar />
            <div className="admin-blank-submissions-container">
                <div className="header-section">
                    <h2>Blank Passage Submissions - Admin View</h2>
                    <div className="stats-cards">
                        <div className="stat-card total">
                            <h4>{totalSubmissions}</h4>
                            <p>Total Blank Submissions</p>
                        </div>
                        <div className="stat-card commented">
                            <h4>{commentedCount}</h4>
                            <p>Commented</p>
                        </div>
                        <div className="stat-card uncommented">
                            <h4>{uncommentedCount}</h4>
                            <p>Needs Comment</p>
                        </div>
                        <div className="stat-card viewed">
                            <h4>{viewedCount}</h4>
                            <p>Viewed</p>
                        </div>
                    </div>
                </div>

                <div className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="centerFilter">Center:</label>
                        <select
                            id="centerFilter"
                            className="form-select"
                            value={filterCenter}
                            onChange={(e) => setFilterCenter(e.target.value)}
                        >
                            <option value="">All Centers</option>
                            {centers.map(center => (
                                <option key={center} value={center}>{center}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="batchFilter">Batch:</label>
                        <select
                            id="batchFilter"
                            className="form-select"
                            value={filterBatch}
                            onChange={(e) => setFilterBatch(e.target.value)}
                        >
                            <option value="">All Batches</option>
                            {batches.map(batch => (
                                <option key={batch} value={batch}>{batch}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="commentFilter">Comment Status:</label>
                        <select
                            id="commentFilter"
                            className="form-select"
                            value={filterComment}
                            onChange={(e) => setFilterComment(e.target.value)}
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
                        {loading ? 'Loading...' : 'Apply Filters'}
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={exportToExcel}
                        disabled={blankSubmissions.length === 0}
                    >
                        Export to Excel
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
                                    <th>Center</th>
                                    <th>Center Name</th>
                                    <th>Batch</th>
                                    <th>Passage</th>
                                    <th>Submitted At</th>
                                    <th>Center Comment</th>
                                    <th>Commented By</th>
                                    <th>Viewed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blankSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="text-center">
                                            No blank submissions found
                                        </td>
                                    </tr>
                                ) : (
                                    blankSubmissions.map((submission) => (
                                        <tr
                                            key={submission.id}
                                            className={
                                                !submission.center_comment
                                                    ? 'uncommented-row'
                                                    : submission.viewed_by_admin
                                                        ? ''
                                                        : 'unviewed-row'
                                            }
                                        >
                                            <td>{submission.student_id}</td>
                                            <td>{submission.fullname || 'N/A'}</td>
                                            <td>{submission.center}</td>
                                            <td>{submission.center_name || 'N/A'}</td>
                                            <td>{submission.batchNo}</td>
                                            <td>
                                                <span
                                                    className={`badge ${submission.passage_type === 'passageA'
                                                            ? 'bg-primary'
                                                            : 'bg-success'
                                                        }`}
                                                >
                                                    {submission.passage_type === 'passageA' ? 'A' : 'B'}
                                                </span>
                                            </td>
                                            <td>{formatDate(submission.submitted_at)}</td>
                                            <td>
                                                {submission.center_comment ? (
                                                    <div className="comment-text">
                                                        {submission.center_comment}
                                                        <div className="comment-meta">
                                                            {formatDate(submission.commented_at)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No comment</span>
                                                )}
                                            </td>
                                            <td>{submission.commented_by || '-'}</td>
                                            <td>
                                                {submission.viewed_by_admin ? (
                                                    <span className="badge bg-info">✓ Viewed</span>
                                                ) : (
                                                    <span className="badge bg-warning">Not Viewed</span>
                                                )}
                                            </td>
                                            <td>
                                                {!submission.viewed_by_admin && (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleMarkAsViewed(submission.id)}
                                                    >
                                                        Mark Viewed
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
            </div>
        </div>
    );
};

export default AdminBlankSubmissionsView;
