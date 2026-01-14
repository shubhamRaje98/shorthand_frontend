// DownloadApps.js
import React from 'react';
import NavBar from './../navBar/navBar';

// Reusable Download Card Component
const DownloadCard = ({ title, description, icon, bgColor, textColor, onClick }) => (
    <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm h-100 rounded-3 overflow-hidden transition-all">
            <div className="card-body p-4 d-flex flex-column">
                <div className={`${bgColor} bg-opacity-10 rounded-3 p-3 mb-3 d-inline-flex align-self-start`}>
                    <i className={`bi bi-${icon} ${textColor} fs-1`}></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">{title}</h5>
                <p className="text-muted small mb-3 flex-grow-1">{description}</p>
                <button 
                    className={`btn ${bgColor.replace('bg-', 'btn-')} w-100 rounded-3 py-2 fw-semibold shadow-sm`}
                    onClick={onClick}
                >
                    <i className="bi bi-download me-2"></i>
                    Download
                </button>
            </div>
        </div>
    </div>
);

const DownloadApps = () => {
    const handlePcRegistrationDownload = () => {
        // window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/gen/publish/setup.exe', '_blank');
        const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/Dec24/setup/GCC-SH-JUNE25-PC-REGISTRATION.exe";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "pc_registration.exe"; // Optional: specify the downloaded file name
        link.click();
    
    };

    const handleExamAppDownload = () => {
        // window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/publish/setup.exe', '_blank');
        const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/Dec24/setup/GCC-SH-JUNE25-EXAM-CLIENT.exe";
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
        const fileUrl = "https://drive.google.com/file/d/17KkbCZQZE_mvR51VBBXVVfYOoQmOtoii/view?usp=drive_link";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "ISM_v6.2.zip"; // Optional: specify the downloaded file name
        link.click();
    };

    // Download apps configuration
    const downloadApps = [
        {
            id: 'pc-registration',
            title: 'PC Registration',
            description: 'Register and configure PCs for examination center',
            icon: 'pc-display-horizontal',
            bgColor: 'bg-primary',
            textColor: 'text-primary',
            onClick: handlePcRegistrationDownload
        },
        {
            id: 'exam-software',
            title: 'Exam Software',
            description: 'Main examination software for conducting tests',
            icon: 'journal-text',
            bgColor: 'bg-success',
            textColor: 'text-success',
            onClick: handleExamAppDownload
        },
        {
            id: 'rustdesk',
            title: 'RustDesk',
            description: 'Remote desktop software for technical support',
            icon: 'display',
            bgColor: 'bg-warning',
            textColor: 'text-warning',
            onClick: handleRuskDeskDownload
        },
        {
            id: 'ism',
            title: 'ISM v6.2',
            description: 'Internet Speed Monitor application',
            icon: 'speedometer2',
            bgColor: 'bg-info',
            textColor: 'text-info',
            onClick: handleIsmDownload
        }
    ];

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavBar />
            <div className="flex-grow-1">
                <div className="container py-4 py-md-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xl-11">
                            {/* Header Section */}
                            <div className="text-center mb-5">
                                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3"
                                     style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-cloud-arrow-down text-primary fs-1"></i>
                                </div>
                                <h1 className="h2 fw-bold text-dark mb-2">Download Software</h1>
                                <p className="text-muted lead mb-0">Essential applications for examination center setup and management</p>
                            </div>

                            {/* Download Cards Grid */}
                            <div className="row g-4 mb-4">
                                {downloadApps.map((app) => (
                                    <DownloadCard key={app.id} {...app} />
                                ))}
                            </div>

                            {/* Info Alert */}
                            <div className="alert alert-info d-flex align-items-start rounded-3 shadow-sm border-0" role="alert">
                                <i className="bi bi-info-circle-fill me-3 fs-4 flex-shrink-0"></i>
                                <div>
                                    <h6 className="alert-heading fw-bold mb-2">Installation Instructions</h6>
                                    <p className="mb-0 small">
                                        Please ensure you have administrator privileges before installing these applications. 
                                        Install PC Registration software first, followed by the Exam Software. 
                                        RustDesk is optional but recommended for better center management.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadApps;