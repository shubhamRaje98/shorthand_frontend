// import React, { useState } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, Card, Button, Form, ProgressBar, Table, Alert, Spinner } from 'react-bootstrap';
// import './EvaluationDashboard.css';

// const EvaluationDashboard = () => {
//     const [departmentIds, setDepartmentIds] = useState([7]);
//     const [processing, setProcessing] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [results, setResults] = useState(null);
//     const [error, setError] = useState(null);
//     const [excelFile, setExcelFile] = useState(null);

//     const handleDepartmentChange = (e) => {
//         const value = e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
//         setDepartmentIds(value);
//     };

//     const handleStartEvaluation = async () => {
//         setProcessing(true);
//         setProgress(0);
//         setError(null);
//         setResults(null);
//         setExcelFile(null);

//         try {
//             const response = await axios.post('http://localhost:3000/api/v1/evaluation/evaluate', {
//                 departmentIds: departmentIds
//             });

//             setResults(response.data);
//             setExcelFile(response.data.excelFile);
//             setProgress(100);
//         } catch (err) {
//             setError(err.response?.data?.error || 'An error occurred during evaluation');
//         } finally {
//             setProcessing(false);
//         }
//     };

//     const handleDownloadExcel = () => {
//         if (excelFile) {
//             window.open(`http://localhost:3000/api/v1/evaluation/download/${excelFile}`, '_blank');
//         }
//     };

//     return (
//         <Container fluid className="evaluation-dashboard mt-4">
//             <Row className="mb-4">
//                 <Col>
//                     <h2 className="text-center">Student Evaluation System</h2>
//                     <p className="text-center text-muted">Automated exam passage evaluation and marking</p>
//                 </Col>
//             </Row>

//             {/* Configuration Card */}
//             <Row className="mb-4">
//                 <Col md={12}>
//                     <Card>
//                         <Card.Header className="bg-primary text-white">
//                             <h5 className="mb-0">Evaluation Configuration</h5>
//                         </Card.Header>
//                         <Card.Body>
//                             <Form>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Department IDs (comma-separated)</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="e.g., 7, 8, 9"
//                                         value={departmentIds.join(', ')}
//                                         onChange={handleDepartmentChange}
//                                         disabled={processing}
//                                     />
//                                     <Form.Text className="text-muted">
//                                         Enter department IDs to evaluate. Default is department 7.
//                                     </Form.Text>
//                                 </Form.Group>

//                                 <Button 
//                                     variant="success" 
//                                     onClick={handleStartEvaluation}
//                                     disabled={processing || departmentIds.length === 0}
//                                     className="w-100"
//                                 >
//                                     {processing ? (
//                                         <>
//                                             <Spinner animation="border" size="sm" className="me-2" />
//                                             Processing...
//                                         </>
//                                     ) : (
//                                         'Start Evaluation'
//                                     )}
//                                 </Button>
//                             </Form>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Progress Bar */}
//             {processing && (
//                 <Row className="mb-4">
//                     <Col>
//                         <Card>
//                             <Card.Body>
//                                 <h6>Processing Students...</h6>
//                                 <ProgressBar animated now={progress} label={`${progress}%`} />
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             )}

//             {/* Error Alert */}
//             {error && (
//                 <Row className="mb-4">
//                     <Col>
//                         <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                             <Alert.Heading>Error</Alert.Heading>
//                             <p>{error}</p>
//                         </Alert>
//                     </Col>
//                 </Row>
//             )}

//             {/* Results Summary */}
//             {results && (
//                 <>
//                     <Row className="mb-4">
//                         <Col md={3}>
//                             <Card className="text-center">
//                                 <Card.Body>
//                                     <h6 className="text-muted">Total Students</h6>
//                                     <h3 className="text-primary">{results.totalStudents}</h3>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card className="text-center">
//                                 <Card.Body>
//                                     <h6 className="text-muted">Processed</h6>
//                                     <h3 className="text-success">{results.processedStudents}</h3>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card className="text-center">
//                                 <Card.Body>
//                                     <h6 className="text-muted">Passed</h6>
//                                     <h3 className="text-info">{results.passCount}</h3>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card className="text-center">
//                                 <Card.Body>
//                                     <h6 className="text-muted">Pass Rate</h6>
//                                     <h3 className="text-warning">{results.passRate}%</h3>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>

//                     {/* Download Excel Button */}
//                     <Row className="mb-4">
//                         <Col>
//                             <Button 
//                                 variant="primary" 
//                                 onClick={handleDownloadExcel}
//                                 className="w-100"
//                             >
//                                 Download Excel Report
//                             </Button>
//                         </Col>
//                     </Row>

//                     {/* Results Table */}
//                     <Row>
//                         <Col>
//                             <Card>
//                                 <Card.Header className="bg-info text-white">
//                                     <h5 className="mb-0">Evaluation Results</h5>
//                                 </Card.Header>
//                                 <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                                     <Table striped bordered hover responsive>
//                                         <thead>
//                                             <tr>
//                                                 <th>Student ID</th>
//                                                 <th>Department</th>
//                                                 <th>Subject</th>
//                                                 <th>QSet</th>
//                                                 <th>Added</th>
//                                                 <th>Missed</th>
//                                                 <th>Spelling</th>
//                                                 <th>Grammar</th>
//                                                 <th>Total Mistakes</th>
//                                                 <th>Marks</th>
//                                                 <th>Status</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {results.results.map((result, index) => (
//                                                 <tr key={index}>
//                                                     <td>{result.Student_ID}</td>
//                                                     <td>{result.Department_ID}</td>
//                                                     <td>{result.Subject_ID}</td>
//                                                     <td>{result.QSet}</td>
//                                                     <td>{result.PassageA_Added_Count}</td>
//                                                     <td>{result.PassageA_Missed_Count}</td>
//                                                     <td>{result.PassageA_Spelling_Count}</td>
//                                                     <td>{result.PassageA_Grammar_Count}</td>
//                                                     <td>{result.PassageA_Total_Mistakes}</td>
//                                                     <td>{result.Total_Marks}</td>
//                                                     <td>
//                                                         <span className={`badge ${result.Pass_Status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
//                                                             {result.Pass_Status}
//                                                         </span>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>

//                     {/* Failed Students */}
//                     {results.failedStudents && results.failedStudents.length > 0 && (
//                         <Row className="mt-4">
//                             <Col>
//                                 <Card>
//                                     <Card.Header className="bg-danger text-white">
//                                         <h5 className="mb-0">Failed to Process ({results.failedStudents.length})</h5>
//                                     </Card.Header>
//                                     <Card.Body>
//                                         <Table striped bordered hover responsive>
//                                             <thead>
//                                                 <tr>
//                                                     <th>Student ID</th>
//                                                     <th>Reason</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {results.failedStudents.map((failed, index) => (
//                                                     <tr key={index}>
//                                                         <td>{failed.Student_ID}</td>
//                                                         <td>{failed.Reason}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </Table>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>
//                         </Row>
//                     )}
//                 </>
//             )}
//         </Container>
//     );
// };

// export default EvaluationDashboard;


import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Table, Alert, Spinner } from 'react-bootstrap';
import './EvaluationDashboard.css';

const EvaluationDashboard = () => {
    const [departmentIds, setDepartmentIds] = useState([7, 8, 9]);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [excelFile, setExcelFile] = useState(null);

    const handleDepartmentChange = (e) => {
        const value = e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        setDepartmentIds(value);
    };

    const handleStartEvaluation = async () => {
        if (departmentIds.length === 0) {
            setError('Please enter at least one department ID');
            return;
        }

        setProcessing(true);
        setError(null);
        setResults(null);
        setExcelFile(null);

        try {
            // ✅ REMOVED: timeout property - will wait indefinitely
            const response = await axios.post(
                'http://localhost:3000/api/v1/evaluation/evaluate',
                {
                    departmentIds: departmentIds
                },
                {
                    // No timeout - will wait as long as needed
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setResults(response.data);
            setExcelFile(response.data.excelFile);
        } catch (err) {
            console.error('Error during evaluation:', err);
            
            if (err.code === 'ERR_NETWORK' || err.code === 'ERR_CONNECTION_RESET') {
                setError('Server connection lost. The server may have crashed due to high load. Please check the server logs and try again with fewer departments or reduce batch size.');
            } else {
                setError(err.response?.data?.error || err.message || 'An error occurred during evaluation');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleDownloadExcel = () => {
        if (excelFile) {
            window.open(`http://localhost:3000/api/v1/evaluation/download/${excelFile}`, '_blank');
        }
    };

    return (
        <Container fluid className="evaluation-dashboard mt-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center">Student Evaluation System</h2>
                    <p className="text-center text-muted">Automated exam passage evaluation and marking</p>
                </Col>
            </Row>

            {/* Configuration Card */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Evaluation Configuration</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Department IDs (comma-separated)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., 7, 8, 9"
                                        value={departmentIds.join(', ')}
                                        onChange={handleDepartmentChange}
                                        disabled={processing}
                                    />
                                    <Form.Text className="text-muted">
                                        Enter department IDs to evaluate. Default: departments 7, 8, and 9.
                                    </Form.Text>
                                </Form.Group>

                                <Button 
                                    variant="success" 
                                    onClick={handleStartEvaluation}
                                    disabled={processing || departmentIds.length === 0}
                                    className="w-100"
                                    size="lg"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Processing... Please wait
                                        </>
                                    ) : (
                                        'Start Evaluation'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Processing Info */}
            {processing && (
                <Row className="mb-4">
                    <Col>
                        <Card className="border-warning">
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <Spinner animation="border" variant="primary" className="me-3" />
                                    <div>
                                        <h6 className="mb-1">⚡ Processing Students in Parallel Batches...</h6>
                                        <p className="mb-0 text-muted">
                                            This may take several minutes depending on the number of students. 
                                            The server is processing students in batches of 50 for optimal performance.
                                            <br />
                                            <strong>Please do not close this page or refresh your browser.</strong>
                                        </p>
                                    </div>
                                </div>
                                <ProgressBar 
                                    animated 
                                    now={100} 
                                    variant="info" 
                                    className="mt-3"
                                    style={{ height: '8px' }}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Error Alert */}
            {error && (
                <Row className="mb-4">
                    <Col>
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            <Alert.Heading>❌ Error</Alert.Heading>
                            <p className="mb-2">{error}</p>
                            <hr />
                            <p className="mb-0">
                                <strong>Troubleshooting tips:</strong>
                            </p>
                            <ul className="mb-0 mt-2">
                                <li>Check if the Node.js server is running</li>
                                <li>Try with fewer departments (e.g., just department 7)</li>
                                <li>Check server terminal for error messages</li>
                                <li>Verify database connection is working</li>
                            </ul>
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Results Summary */}
            {results && (
                <>
                    {/* Success Alert */}
                    <Row className="mb-3">
                        <Col>
                            <Alert variant="success">
                                <Alert.Heading>✅ Evaluation Complete!</Alert.Heading>
                                <Row>
                                    <Col md={6}>
                                        <p className="mb-0">
                                            <strong>Total Students:</strong> {results.totalStudents}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Successfully Processed:</strong> {results.processedStudents}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="mb-0">
                                            <strong>Processing Time:</strong> {results.processingTime || 'N/A'}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Pass Rate:</strong> {results.passRate}%
                                        </p>
                                    </Col>
                                </Row>
                            </Alert>
                        </Col>
                    </Row>

                    {/* Summary Cards */}
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <h6 className="text-muted mb-2">Total Students</h6>
                                    <h2 className="text-primary mb-0">{results.totalStudents}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <h6 className="text-muted mb-2">Successfully Processed</h6>
                                    <h2 className="text-success mb-0">{results.processedStudents}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <h6 className="text-muted mb-2">Passed Students</h6>
                                    <h2 className="text-info mb-0">{results.passCount}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <h6 className="text-muted mb-2">Pass Rate</h6>
                                    <h2 className="text-warning mb-0">{results.passRate}%</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Download Excel Button */}
                    <Row className="mb-4">
                        <Col>
                            <Button 
                                variant="primary" 
                                onClick={handleDownloadExcel}
                                className="w-100"
                                size="lg"
                            >
                                📥 Download Complete Excel Report
                            </Button>
                        </Col>
                    </Row>

                    {/* Results Table */}
                    <Row>
                        <Col>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-info text-white">
                                    <h5 className="mb-0">📊 Detailed Evaluation Results ({results.results.length} students)</h5>
                                </Card.Header>
                                <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {results.results.length === 0 ? (
                                        <Alert variant="warning">No results to display</Alert>
                                    ) : (
                                        <Table striped bordered hover responsive size="sm">
                                            <thead className="sticky-top bg-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Student ID</th>
                                                    <th>Department</th>
                                                    <th>Subject</th>
                                                    <th>QSet</th>
                                                    <th>Added</th>
                                                    <th>Missed</th>
                                                    <th>Spelling</th>
                                                    <th>Grammar</th>
                                                    <th>Total Mistakes</th>
                                                    <th>Marks</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.results.map((result, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td><strong>{result.Student_ID}</strong></td>
                                                        <td>{result.Department_ID}</td>
                                                        <td>{result.Subject_ID}</td>
                                                        <td>{result.QSet}</td>
                                                        <td className={result.PassageA_Added_Count > 0 ? 'text-danger' : ''}>
                                                            {result.PassageA_Added_Count}
                                                        </td>
                                                        <td className={result.PassageA_Missed_Count > 0 ? 'text-warning' : ''}>
                                                            {result.PassageA_Missed_Count}
                                                        </td>
                                                        <td className={result.PassageA_Spelling_Count > 0 ? 'text-info' : ''}>
                                                            {result.PassageA_Spelling_Count}
                                                        </td>
                                                        <td>{result.PassageA_Grammar_Count}</td>
                                                        <td><strong>{result.PassageA_Total_Mistakes}</strong></td>
                                                        <td>
                                                            <strong className={result.Total_Marks >= 32 ? 'text-success' : 'text-danger'}>
                                                                {result.Total_Marks}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${result.Pass_Status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
                                                                {result.Pass_Status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Failed Students */}
                    {results.failedStudents && results.failedStudents.length > 0 && (
                        <Row className="mt-4">
                            <Col>
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-danger text-white">
                                        <h5 className="mb-0">⚠️ Failed to Process ({results.failedStudents.length})</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Student ID</th>
                                                    <th>Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.failedStudents.map((failed, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td><strong>{failed.Student_ID}</strong></td>
                                                        <td>{failed.Reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </Container>
    );
};

export default EvaluationDashboard;
