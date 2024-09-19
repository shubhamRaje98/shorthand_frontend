// DownloadApps.js
import React from 'react';
import './DownloadApps.css';
import NavBar from './../navBar/navBar';

const DownloadApps = () => {
    const handlePcRegistrationDownload = () => {
        window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/gen/publish/setup.exe', '_blank');
    };

    const handleExamAppDownload = () => {
        window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/publish/setup.exe', '_blank');
    };

    return (
       <>
      <NavBar/>
      
        <div className="da-container">
            <h1 className="da-title">Download Software</h1>
            <div className="da-button-container">
                <button className="da-button da-pc-reg" onClick={handlePcRegistrationDownload}>
                    Download PC Registration Software
                </button>
                <button className="da-button da-exam-app" onClick={handleExamAppDownload}>
                    Download Exam Software
                </button>
            </div>
        </div>
        </>
    );
};

export default DownloadApps;