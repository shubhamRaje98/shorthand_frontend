// DownloadApps.js
import React from 'react';
import './DownloadApps.css';
import NavBar from './../navBar/navBar';

const DownloadApps = () => {
    const handlePcRegistrationDownload = () => {
        // window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/gen/publish/setup.exe', '_blank');
        const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/gen/publish/setup.exe";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "pc_registration.exe"; // Optional: specify the downloaded file name
        link.click();
    
    };

    const handleExamAppDownload = () => {
        // window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/publish/setup.exe', '_blank');
        const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/publish/setup.exe";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "software.exe"; // Optional: specify the downloaded file name
        link.click();


    };
    
    const handleRuskDeskDownload = () => {
        
        const fileUrl = "https://github.com/rustdesk/rustdesk/releases/download/1.3.5/rustdesk-1.3.5-x86_64.exe";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "software.exe"; // Optional: specify the downloaded file name
        link.click();
        // window.open('https://github.com/rustdesk/rustdesk/releases/download/1.3.5/rustdesk-1.3.5-x86_64.exe', '_blank');
    };

    const handleIsmDownload = () => {
        const fileUrl = "https://download947.mediafire.com/5s9qaaz83vxggzO20i2xXVXdVkzEYaEj560McLf4S-dv2lS-obKIyNVEJ2e1dsyViZZYl6TH4KoAQpcHFAFF_kzI2ukPneEyHZzpEwlohrtwurTcRweNqYbb1c12nQ8mcy4iZNoCP6vpiw_-5l4bdBcfJhc0KDSZxhlnTGgluVK6w48/0p0jwd7l7oy4j2h/ISM+V6.2.zip";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "ISM_v6.2.zip"; // Optional: specify the downloaded file name
        link.click();
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
                <button className="da-button da-rusk-app" onClick={handleRuskDeskDownload}>
                    Download Rusk Desk
                </button>
                <button className="da-button da-ism-app" onClick={handleIsmDownload}>
                    Download ISM v6.2
                </button>
                
            </div>
        </div>
        </>
    );
};

export default DownloadApps;