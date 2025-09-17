import React, { useState } from 'react';
import { downloadBackup } from '../../services/backupService';
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
        <div className="download-backup-container">
            <h2>Download Database Backup</h2>
            
            <div className="backup-form">
                <div className="form-group">
                    <label htmlFor="filename">Backup Filename:</label>
                    <input
                        type="text"
                        id="filename"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="Enter filename ending with .sql"
                        className="filename-input"
                    />
                    <div className="filename-hint">Must end with .sql (e.g., backup_2024.sql)</div>
                </div>

                <button
                    onClick={handleDownload}
                    disabled={loading || !filename.endsWith('.sql')}
                    className="download-button"
                >
                    {loading ? 'Creating Backup...' : 'Download Backup'}
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="backup-info">
                <h3>About Database Backup</h3>
                <ul>
                    <li>✓ Full database backup including all tables and data</li>
                    <li>✓ UTF-8 encoding ensured for proper character support</li>
                    <li>✓ Includes all student exam data and results</li>
                    <li>✓ Can be restored using MySQL or similar tools</li>
                </ul>
            </div>
        </div>
    );
};

export default DownloadBackup;