import React, { useState } from 'react';
import axios from 'axios';
import './DownloadRegister.css';
import { VscCloudUpload } from "react-icons/vsc";
import { FaFileDownload } from "react-icons/fa";

const DownloadRegister = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setMessage(`File selected: ${selectedFile.name}`);
      setError('');
    } else {
      setFile(null);
      setMessage('');
      setError('Please select a valid Excel (.xlsx) file.');
    }
  };

  const handleDownload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    setIsUploading(true);
    setMessage('Uploading file and generating PDF...');
    setError('');

    try {
        const response = await axios.post('http://checking.shorthandonlineexam.in/generate-student-register', formData, {
        responseType: 'blob', // Important: The response is a binary PDF file
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_register.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage('PDF generated and downloaded successfully!');
      setIsUploading(false);
      setFile(null); // Reset the file input
    } catch (err) {
      console.error('Download error:', err);
      setIsUploading(false);
      setMessage('');
      const errorMsg = err.response?.data?.message || 'Failed to generate PDF. Please check the file and try again.';
      setError(errorMsg);
    }
  };

  return (
    <div className="download-register-container">
      <div className="download-register-card">
        <h2>Download Student Register</h2>
        <p>Upload the student data Excel file (.xlsx) to generate and download the PDF register.</p>
        
        <div className="file-upload-area">
          <input
            type="file"
            id="excel-file-input"
            onChange={handleFileChange}
            accept=".xlsx"
            style={{ display: 'none' }}
          />
          <label htmlFor="excel-file-input" className="custom-file-upload">
            <VscCloudUpload size={40} />
            <p>{file ? file.name : 'Click to select Excel file'}</p>
          </label>
        </div>

        <button 
          onClick={handleDownload} 
          className="download-button"
          disabled={isUploading || !file}
        >
          {isUploading ? 'Generating...' : 'Generate & Download PDF'}
          <FaFileDownload />
        </button>

        {message && <p className="status-message success">{message}</p>}
        {error && <p className="status-message error">{error}</p>}
      </div>
    </div>
  );
};

export default DownloadRegister;