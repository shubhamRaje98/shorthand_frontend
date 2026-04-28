import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportControl.css';
import Navbar from '../super-admin/SuperAdminNavbar';

const ReportControl = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState({}); // { [key]: 'saving' | 'success' | 'error' }

    // Map keys to human-readable names for report settings
    const SETTING_LABELS = {
        'REPORT_ATTENDANCE': 'Attendance Report',
        'REPORT_ANSWER_SHEET': 'Answer Sheets',
        'REPORT_SEATING': 'Seating Arrangement',
        'REPORT_PASSWORD_PDF': 'Student ID & Password PDF',
        'REPORT_ABSENTEE': 'Absentee Report'
    };

    const CONTROLLER_TIMER_KEY = 'CONTROLLER_PASSWORD_TIMER';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // Updated to production URL
            const response = await axios.get('https://checking.shorthandonlineexam.in/report-settings', { withCredentials: true });
            setSettings(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching settings:", err);
            setError("Failed to load settings. Please try again.");
            setLoading(false);
        }
    };

    const handleToggleEnable = async (key) => {
        const defaultType = key === 'CONTROLLER_PASSWORD_TIMER' ? 'minutes_before' : 'days_before';
        const currentSetting = settings[key] || { enabled: false, type: defaultType, value: key === 'CONTROLLER_PASSWORD_TIMER' ? 30 : 3 };
        const newValue = { ...currentSetting, enabled: !currentSetting.enabled };
        await updateSetting(key, newValue);
    };

    const handleChange = (key, field, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    const handleSave = async (key) => {
        await updateSetting(key, settings[key]);
    };

    const updateSetting = async (key, value) => {
        setSaveStatus(prev => ({ ...prev, [key]: 'saving' }));
        try {
            // Updated to production URL
            await axios.post('https://checking.shorthandonlineexam.in/report-settings', {
                key: key,
                value: value
            }, { withCredentials: true });

            setSettings(prev => ({ ...prev, [key]: value }));
            setSaveStatus(prev => ({ ...prev, [key]: 'success' }));

            // Clear success message after 2 seconds
            setTimeout(() => {
                setSaveStatus(prev => ({ ...prev, [key]: null }));
            }, 2000);
        } catch (err) {
            console.error(`Error saving ${key}:`, err);
            setSaveStatus(prev => ({ ...prev, [key]: 'error' }));
        }
    };

    if (loading) return <div className="report-control-loading">Loading settings...</div>;
    if (error) return <div className="report-control-error">{error}</div>;

    return (
        <div className="report-control-page">
            <Navbar />
            <div className="report-control-container">
                <h1 className="report-control-title">Report Download Restrictions</h1>

                <div className="report-control-grid">
                    {Object.keys(SETTING_LABELS).map(key => {
                        const setting = settings[key] || { enabled: false, type: 'days_before', value: 3 };
                        const label = SETTING_LABELS[key];
                        const status = saveStatus[key];

                        return (
                            <div key={key} className={`report-control-card ${setting.enabled ? 'enabled' : 'disabled'}`}>
                                <div className="card-header">
                                    <h3>{label}</h3>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={setting.enabled}
                                            onChange={() => handleToggleEnable(key)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                {setting.enabled && (
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>Restriction Type:</label>
                                            <select
                                                value={setting.type}
                                                onChange={(e) => handleChange(key, 'type', e.target.value)}
                                            >
                                                <option value="days_before">Days Before Exam</option>
                                                <option value="minutes_before">Minutes Before Exam</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                {setting.type === 'days_before' ? 'Days Allowed Before:' : 'Minutes Allowed Before:'}
                                            </label>
                                            <input
                                                type="number"
                                                value={setting.value}
                                                onChange={(e) => handleChange(key, 'value', parseInt(e.target.value))}
                                            />
                                        </div>

                                        <button
                                            className="save-btn"
                                            onClick={() => handleSave(key)}
                                            disabled={status === 'saving'}
                                        >
                                            {status === 'saving' ? 'Saving...' : 'Save Changes'}
                                        </button>

                                        {status === 'success' && <span className="status-msg success">Saved!</span>}
                                        {status === 'error' && <span className="status-msg error">Error!</span>}
                                    </div>
                                )}

                                {!setting.enabled && (
                                    <div className="card-status-text">
                                        Downloading is currently <strong>UNRESTRICTED</strong> (Always Allowed)
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Controller Password Timer Section */}
                <h2 className="report-control-title" style={{ marginTop: '2rem', fontSize: '1.4rem' }}>Controller Password Visibility</h2>
                {(() => {
                    const key = CONTROLLER_TIMER_KEY;
                    const setting = settings[key] || { enabled: false, type: 'minutes_before', value: 30 };
                    const status = saveStatus[key];
                    return (
                        <div className="report-control-grid">
                            <div className={`report-control-card ${setting.enabled ? 'enabled' : 'disabled'}`}>
                                <div className="card-header">
                                    <h3>Controller Password Timer</h3>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={setting.enabled}
                                            onChange={() => handleToggleEnable(key)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                {setting.enabled && (
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>Show password how many minutes before exam start?</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={setting.value}
                                                onChange={(e) => handleChange(key, 'value', parseInt(e.target.value))}
                                            />
                                        </div>

                                        <button
                                            className="save-btn"
                                            onClick={() => handleSave(key)}
                                            disabled={status === 'saving'}
                                        >
                                            {status === 'saving' ? 'Saving...' : 'Save Changes'}
                                        </button>

                                        {status === 'success' && <span className="status-msg success">Saved!</span>}
                                        {status === 'error' && <span className="status-msg error">Error!</span>}
                                    </div>
                                )}

                                {!setting.enabled && (
                                    <div className="card-status-text">
                                        Password is currently <strong>ALWAYS VISIBLE</strong> (No Timer)
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default ReportControl;
