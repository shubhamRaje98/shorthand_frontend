// src/components/super-admin/DownloadBackup.js
import React, { useState } from 'react';
import { downloadBackup } from '../../services/backupService';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Download, Database, CheckCircle, Info, FileText, Shield, Clock } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DownloadBackup.css';

const DownloadBackup = () => {
    const [filename, setFilename] = useState('backup.sql');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!filename.endsWith('.sql')) {
            setMessage('Filename must end with .sql');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const result = await downloadBackup(filename);
            setMessage(result.message);
        } catch (error) {
            setMessage('Failed to download backup');
            console.error('Download error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="download-backup-wrapper">
            <Container fluid className="py-4">
                {/* Header Section */}
                <div className="backup-header mb-4">
                    <div className="d-flex align-items-center mb-2">
                        <Database size={32} className="me-3 text-primary" />
                        <div>
                            <h2 className="backup-title mb-1">Database Backup</h2>
                            <p className="backup-subtitle mb-0">Create and download a complete backup of your database</p>
                        </div>
                    </div>
                </div>

                <Row>
                    {/* Main Backup Form */}
                    <Col lg={7} md={12} className="mb-4">
                        <Card className="backup-card">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <FileText size={24} className="me-2 text-primary" />
                                    <h5 className="mb-0 fw-semibold">Backup Configuration</h5>
                                </div>

                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="backup-label">
                                            Backup Filename
                                            <span className="text-danger ms-1">*</span>
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type="text"
                                                value={filename}
                                                onChange={(e) => setFilename(e.target.value)}
                                                placeholder="Enter filename (e.g., backup_2024.sql)"
                                                className="backup-input"
                                                disabled={loading}
                                            />
                                            <div className="input-icon">
                                                <FileText size={18} className="text-muted" />
                                            </div>
                                        </div>
                                        <Form.Text className="backup-hint">
                                            <Info size={14} className="me-1" />
                                            Filename must end with .sql extension
                                        </Form.Text>
                                    </Form.Group>

                                    <Button
                                        onClick={handleDownload}
                                        disabled={loading || !filename.endsWith('.sql')}
                                        className="backup-download-btn w-100"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Backup...
                                            </>
                                        ) : (
                                            <>
                                                <Download size={20} className="me-2" />
                                                Download Backup
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                {message && (
                                    <Alert 
                                        variant={message.includes('Failed') ? 'danger' : 'success'} 
                                        className="mt-4 backup-alert"
                                        dismissible
                                        onClose={() => setMessage('')}
                                    >
                                        <div className="d-flex align-items-center">
                                            {message.includes('Failed') ? (
                                                <Info size={20} className="me-2" />
                                            ) : (
                                                <CheckCircle size={20} className="me-2" />
                                            )}
                                            <span>{message}</span>
                                        </div>
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Info Panel */}
                    <Col lg={5} md={12}>
                        <Card className="backup-info-card">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <Shield size={24} className="me-2 text-primary" />
                                    <h5 className="mb-0 fw-semibold">What's Included</h5>
                                </div>

                                <div className="info-list">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div className="info-content">
                                            <h6>Complete Database</h6>
                                            <p>All tables, schemas, and data structures</p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div className="info-content">
                                            <h6>UTF-8 Encoding</h6>
                                            <p>Proper character support for all data</p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div className="info-content">
                                            <h6>Student Records</h6>
                                            <p>All exam data, results, and student information</p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div className="info-content">
                                            <h6>Easy Restoration</h6>
                                            <p>Compatible with MySQL and similar tools</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="backup-tip mt-4">
                                    <div className="tip-header">
                                        <Clock size={18} className="me-2" />
                                        <strong>Best Practice</strong>
                                    </div>
                                    <p className="tip-text mb-0">
                                        Schedule regular backups to ensure data safety. Include timestamps in your filename for easy tracking.
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DownloadBackup;
