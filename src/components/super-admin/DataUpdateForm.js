import React, { useState } from 'react';
import axios from 'axios';

const DataUpdateForm = () => {
  const [updateType, setUpdateType] = useState('');
  const [studentId, setStudentId] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  const updateTypes = [
    { value: 'audio-logs', label: 'Audio Logs' },
    { value: 'text-logs', label: 'Text Logs' },
    { value: 'final-passage-submit', label: 'Final Passage Submit' },
    { value: 'typing-passage-logs', label: 'Typing Passage Logs' },
    { value: 'typing-passage', label: 'Typing Passage' },
  ];

  const fieldsets = {
    'audio-logs': ['trial', 'passageA', 'passageB'],
    'text-logs': ['mina', 'texta', 'minb', 'textb'],
    'final-passage-submit': ['passageA', 'passageB'],
    'typing-passage-logs': ['trialTime', 'trialPassage', 'passageTime', 'passage'],
    'typing-passage': ['trialPassage', 'passage'],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://www.shorthandonlineexam.in/${updateType}`, {
        studentId,
        ...formData,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred');
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post(`https://www.shorthandonlineexam.in/${updateType}`, {
        studentId,
        reset: true,
      });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Update Student Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Update Type:
            <select value={updateType} onChange={(e) => setUpdateType(e.target.value)}>
              <option value="">Select type</option>
              {updateTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Student ID:
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </label>
        </div>
        {updateType && fieldsets[updateType].map((field) => (
          <div key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={handleInputChange}
              />
            </label>
          </div>
        ))}
        <button type="submit">Update</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DataUpdateForm;