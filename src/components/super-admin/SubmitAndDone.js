// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './SubmitAndDone.css';

// const SubmitAndDone = () => {
//   const [filters, setFilters] = useState({
//     subjectId: '',
//     qset: '',
//     expertId: '',
//     resetType: 'subject',
//   });
//   const [logs, setLogs] = useState([]);
//   const [options, setOptions] = useState({
//     subjects: [],
//     experts: [],
//     qsets: []
//   });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Fetch initial subjects and experts
//   useEffect(() => {
//     const fetchInitialOptions = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('http://localhost:3004/review-logs/filter-options', {
//           params: { table: 'expertreviewlog' }
//         });
//         setOptions({
//           subjects: res.data.data?.subjects || [],
//           experts: res.data.data?.experts || [],
//           qsets: []
//         });
//       } catch (err) {
//         console.error('Failed to load options:', err);
//         setMessage('Error loading initial options');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialOptions();
//   }, []);

//   // Fetch logs when filters change
//   const fetchLogs = async () => {
//     if (!filters.subjectId) {
//       setMessage('Please select a subject first');
//       return;
//     }

//     setLoading(true);
//     try {
//       const params = {
//         subjectId: filters.subjectId,
//         qset: filters.qset || undefined,
//         expertId: filters.expertId || undefined,
//         subm_done: 1
//       };

//       const res = await axios.get('http://localhost:3004/expert-review-logs', { params });
      
//       setLogs(res.data.data || []);
      
//       // Update QSets for the selected subject
//       if (res.data.subjectQsets) {
//         const existingQsets = res.data.subjectQsets
//           .filter(q => q.exists)
//           .map(q => ({
//             qset: q.qset,
//             displayText: `${filters.subjectId} - QSet ${q.qset}`
//           }));
        
//         setOptions(prev => ({
//           ...prev,
//           qsets: existingQsets
//         }));
//       }
      
//       setMessage(res.data.message || '');
//     } catch (err) {
//       console.error('Failed to fetch logs:', err);
//       setLogs([]);
//       setMessage(err.response?.data?.message || 'Error fetching logs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset logs
//   const resetLogs = async () => {
//     if (!filters.subjectId) {
//       setMessage('Please select a subject first');
//       return;
//     }

//     setLoading(true);
//     try {
//       const backendResetType = filters.resetType === 'subject' && filters.qset 
//         ? 'qset' 
//         : filters.resetType;

//       const data = {
//         subjectId: filters.subjectId,
//         qset: filters.qset || undefined,
//         expertId: filters.expertId || undefined,
//         resetType: backendResetType
//       };

//       const res = await axios.post('http://localhost:3004/expert-review-logs/reset', data);
//       setMessage(res.data.message || 'Reset successful');
//       fetchLogs();
//     } catch (err) {
//       console.error('Failed to reset logs:', err);
//       setMessage(err.response?.data?.message || 'Error resetting logs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle subject change
//   const handleSubjectChange = (e) => {
//     const newSubjectId = e.target.value;
//     setFilters({
//       ...filters,
//       subjectId: newSubjectId,
//       qset: ''
//     });
//   };

//   return (
//     <div className="submit-container">
//       <h2>Submit and Done</h2>

//       <div className="filters">
//         <div className="filter-group">
//           <select
//             value={filters.subjectId}
//             onChange={handleSubjectChange}
//             disabled={loading}
//           >
//             <option value="">Select Subject</option>
//             {options.subjects.map((id) => (
//               <option key={`subject-${id}`} value={id}>
//                 {id}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-group">
//           <select
//             value={filters.qset}
//             onChange={(e) => setFilters({...filters, qset: e.target.value})}
//             disabled={!filters.subjectId || loading || options.qsets.length === 0}
//           >
//             <option value="">Select QSet</option>
//             {options.qsets.map((q) => (
//               <option key={`qset-${q.qset}`} value={q.qset}>
//                 {q.displayText}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-group">
//           <select
//             value={filters.expertId}
//             onChange={(e) => setFilters({...filters, expertId: e.target.value})}
//             disabled={loading}
//           >
//             <option value="">Select Expert</option>
//             {options.experts.map((id) => (
//               <option key={`expert-${id}`} value={id}>
//                 {id}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-group">
//           <select
//             value={filters.resetType}
//             onChange={(e) => setFilters({...filters, resetType: e.target.value})}
//             disabled={loading}
//           >
//             <option value="subject">By Subject</option>
//             <option value="qset">By QSet</option>
//             <option value="expert">By Expert</option>
//           </select>
//         </div>

//         <div className="filter-group button-group">
//           <button
//             onClick={resetLogs}
//             disabled={!filters.subjectId || loading}
//             className="reset-button"
//           >
//             {loading ? 'Processing...' : 'Reset Done Status'}
//           </button>
//         </div>
//       </div>

//       {message && (
//         <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
//           {message}
//         </div>
//       )}

//       <div className="log-table">
//         {logs.length > 0 ? (
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Expert</th>
//                 <th>Subject</th>
//                 <th>QSet</th>
//                 <th>Status</th>
//                 <th>Submitted</th>
//                 <th>Logged In</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log) => (
//                 <tr key={log.id}>
//                   <td>{log.id}</td>
//                   <td>{log.expertId}</td>
//                   <td>{log.subjectId}</td>
//                   <td>{log.qset}</td>
//                   <td>{log.status}</td>
//                   <td>{log.subm_time || '-'}</td>
//                   <td>{log.loggedin || '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="no-logs">
//             {filters.subjectId ? 'No logs found for selected criteria' : 'Please select a subject'}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubmitAndDone;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Form, Button, Table, Spinner, Alert, Card,
  Pagination
} from 'react-bootstrap';
import './SubmitAndDone.css';

const SubmitAndDone = () => {
  const [filters, setFilters] = useState({
    subjectId: '',
    qset: '',
    expertId: '',
  });
  const [logs, setLogs] = useState([]);
  const [options, setOptions] = useState({
    subjects: [],
    experts: [],
    qsets: []
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch initial subjects and experts
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://checking.shorthandonlineexam.in/review-logs/filter-options', {
          params: { table: 'expertreviewlog' }
        });
        setOptions({
          subjects: res.data.data?.subjects || [],
          experts: res.data.data?.experts || [],
          qsets: []
        });
      } catch (err) {
        console.error('Failed to load options:', err);
        setMessage('Error loading initial options');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialOptions();
  }, []);

  // Fetch logs when expertId changes
  useEffect(() => {
    if (filters.expertId) {
      fetchLogsWithFilters(filters);
    }
  }, [filters.expertId]);

  // Fetch logs when subjectId changes
  const handleSubjectChange = async (e) => {
    const newSubjectId = e.target.value;
    const updatedFilters = { ...filters, subjectId: newSubjectId, qset: '' };
    setFilters(updatedFilters);
    setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
  };

  const fetchLogsWithFilters = async (customFilters) => {
    setLoading(true);
    try {
      const params = {
        qset: customFilters.qset || undefined,
        expertId: customFilters.expertId || undefined,
        subm_done: 1
      };

      if (customFilters.subjectId && customFilters.subjectId !== 'ALL') {
        params.subjectId = customFilters.subjectId;
      }

      const res = await axios.get('http://checking.shorthandonlineexam.in/expert-review-logs', { params });
      setLogs(res.data.data || []);
      setCurrentPage(1); // Reset to the first page when filters change

      if (res.data.subjectQsets && customFilters.subjectId !== 'ALL') {
        const existingQsets = res.data.subjectQsets
          .filter(q => q.exists)
          .map(q => ({ qset: q.qset, displayText: `QSet ${q.qset}` }));
        setOptions(prev => ({ ...prev, qsets: existingQsets }));
      } else {
        setOptions(prev => ({ ...prev, qsets: [] }));
      }

      setMessage(res.data.message || '');
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setLogs([]);
      setMessage(err.response?.data?.message || 'Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  const resetLogs = async () => {
    if (!filters.subjectId || filters.subjectId === 'ALL') {
      setMessage('Please select a specific subject to reset');
      return;
    }

    setLoading(true);
    try {
      const backendResetType = filters.qset ? 'qset' : 'subject';
      const data = {
        subjectId: filters.subjectId,
        qset: filters.qset || undefined,
        expertId: filters.expertId || undefined,
        resetType: backendResetType
      };

      const res = await axios.post('http://checking.shorthandonlineexam.in/expert-review-logs/reset', data);
      setMessage(res.data.message || 'Reset successful');
      fetchLogsWithFilters(filters);
    } catch (err) {
      console.error('Failed to reset logs:', err);
      setMessage(err.response?.data?.message || 'Error resetting logs');
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const filteredLogs = logs.filter(log =>
    log.id.toString().includes(searchTerm.toLowerCase())
  );
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Submit and Done</h2>

      <Card className="p-4 mb-4 shadow">
        <Form>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Select
                  value={filters.subjectId}
                  onChange={handleSubjectChange}
                  disabled={loading}
                >
                  <option value="">Select Subject</option>
                  <option value="ALL">All Subjects</option>
                  {options.subjects.map((id) => (
                    <option key={`subject-${id}`} value={id}>{id}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label>QSet</Form.Label>
                <Form.Select
                  value={filters.qset}
                  onChange={(e) => {
                    const newQset = e.target.value;
                    const updatedFilters = { ...filters, qset: newQset };
                    setFilters(updatedFilters);
                    if (updatedFilters.subjectId && updatedFilters.subjectId !== 'ALL' && newQset) {
                      setTimeout(() => fetchLogsWithFilters(updatedFilters), 0);
                    }
                  }}
                  disabled={!filters.subjectId || filters.subjectId === 'ALL' || loading || options.qsets.length === 0}
                >
                  <option value="">Select QSet</option>
                  {options.qsets.map((q) => (
                    <option key={`qset-${q.qset}`} value={q.qset}>{q.displayText}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label>Expert</Form.Label>
                <Form.Select
                  value={filters.expertId}
                  onChange={(e) => setFilters({ ...filters, expertId: e.target.value })}
                  disabled={loading}
                >
                  <option value="">Select Expert</option>
                  {options.experts.map((id) => (
                    <option key={`expert-${id}`} value={id}>{id}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Button
                variant="danger"
                onClick={resetLogs}
                disabled={!filters.subjectId || filters.subjectId === 'ALL' || loading}
                className="w-100"
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Processing...</span>
                  </>
                ) : (
                  'Reset Done Status'
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'}>
          {message}
        </Alert>
      )}

      <Card className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Logs Table</h4>
          <Form.Group className="mb-0">
            <Form.Control
              type="text"
              placeholder="Search by Student ID"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
            />
          </Form.Group>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Expert</th>
                  <th>Subject</th>
                  <th>QSet</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Logged In</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.expertId}</td>
                      <td>{log.subjectId}</td>
                      <td>{log.qset}</td>
                      <td>{log.status}</td>
                      <td>{log.subm_time || '-'}</td>
                      <td>{log.loggedin || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {loading ? (
                        <Spinner animation="border" />
                      ) : (
                        filters.subjectId ? 'No logs found for selected criteria' : 'Please select a subject'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-center">
            {totalPages > 1 && (
              <Pagination className="mb-0">
                <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
                <Pagination.Item active>{currentPage}</Pagination.Item>
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
              </Pagination>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SubmitAndDone;
