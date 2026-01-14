import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Route, Routes } from 'react-router-dom';
import NavBar from '../navBar/navBar';
import AttendanceDownload from '../attendanceDownload/attendanceDownload';
import AbsenteeRoll from '../attendeeRoll/attendeeRoll';
import TrackStudentsExam from '../studentExamTracking/StudentTable';
import CenterwiseStudentCount from '../centerwiseStudentExamCountTracking/centerwiseCountReport';

// Reusable StatCard Component
const StatCard = ({ icon, bgColor, textColor, label, value, colSize = "col-12 col-sm-6 col-lg-4" }) => (
    <div className={colSize}>
        <div className="card border-0 shadow-sm h-100 rounded-3 overflow-hidden">
            <div className="card-body p-4">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                        <div className={`${bgColor} bg-opacity-10 rounded-3 p-3`}>
                            <i className={`bi bi-${icon} ${textColor} fs-4`}></i>
                        </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <p className="text-muted small mb-1 text-uppercase fw-semibold tracking-wide">{label}</p>
                        <h4 className="mb-0 fw-bold text-dark">{value}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Reusable InfoCard Component
const InfoCard = ({ icon, bgColor, textColor, label, value, isAddress = false }) => (
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="card-body p-4">
            <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                    <div className={`${bgColor} bg-opacity-10 rounded-3 p-3`}>
                        <i className={`bi bi-${icon} ${textColor} fs-4`}></i>
                    </div>
                </div>
                <div className="flex-grow-1 ms-3">
                    <p className="text-muted small mb-1 text-uppercase fw-semibold tracking-wide">{label}</p>
                    {isAddress ? (
                        <p className="mb-0 fw-medium text-dark lh-base">{value}</p>
                    ) : (
                        <h5 className="mb-0 fw-bold text-dark">{value}</h5>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const Home = () => {
    const { center } = useParams();
    const [centerDetails, setCenterDetails] = useState(null);
    const [pcCount, setPcCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCenterDetails = async () => {
            try {
                console.log(`Fetching details for center: ${center}`);
                
                const response = await axios.get(`http://localhost:3000/get-center-details`);
                console.log("API Response:", response.data);

                if (response.data && response.data.examCenterDTO && response.data.examCenterDTO.length > 0) {
                    setCenterDetails(response.data.examCenterDTO[0]);
                    setPcCount(response.data.pcCount);
                    console.log("Center details:", response.data.examCenterDTO[0]);
                    console.log("PC Count:", response.data.pcCount);
                } else {
                    setCenterDetails(null);
                    setPcCount(null);
                    console.log("No center details found");
                }
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch center details');
                console.error("Error fetching center details:", error);
                setLoading(false);
            }
        };

        fetchCenterDetails();
    }, [center]);

    // Stats configuration for mapping
    const statsConfig = centerDetails ? [
        {
            type: 'stat',
            icon: 'qr-code',
            bgColor: 'bg-primary',
            textColor: 'text-primary',
            label: 'Center Code',
            value: centerDetails.center,
            colSize: 'col-12 col-sm-6 col-lg-4'
        },
        {
            type: 'stat',
            icon: 'pc-display',
            bgColor: 'bg-success',
            textColor: 'text-success',
            label: 'Max PC Capacity',
            value: centerDetails.max_pc,
            colSize: 'col-12 col-sm-6 col-lg-4'
        },
        {
            type: 'stat',
            icon: 'check2-circle',
            bgColor: 'bg-warning',
            textColor: 'text-warning',
            label: 'Registered PCs',
            value: pcCount,
            colSize: 'col-12 col-sm-6 col-lg-4'
        },
        {
            type: 'info',
            icon: 'building-check',
            bgColor: 'bg-secondary',
            textColor: 'text-secondary',
            label: 'Center Name',
            value: centerDetails.center_name,
            colSize: 'col-12 col-lg-8',
            isAddress: false
        },
        {
            type: 'stat',
            icon: 'hdd-stack',
            bgColor: 'bg-info',
            textColor: 'text-info',
            label: 'Current PC Count',
            value: centerDetails.pc_count,
            colSize: 'col-12 col-sm-6 col-lg-4'
        },
        {
            type: 'info',
            icon: 'geo-alt-fill',
            bgColor: 'bg-danger',
            textColor: 'text-danger',
            label: 'Center Address',
            value: centerDetails.center_address,
            colSize: 'col-12',
            isAddress: true
        }
    ] : [];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted fw-medium">Loading center details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavBar />
            <div className="flex-grow-1">
                <div className="container-fluid px-lg-5 py-4">
                    <Routes>
                        <Route path="/" element={
                            <div className="row justify-content-center">
                                <div className="col-12 col-xl-10">
                                    {/* Header Section */}
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom">
                                        <div>
                                            <h1 className="h2 fw-bold text-dark mb-1">
                                                Center Admin
                                            </h1>
                                            <p className="text-muted mb-0 small">Manage and monitor your examination center</p>
                                        </div>
                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 mt-2 mt-md-0 rounded-pill">
                                            <i className="bi bi-geo-alt me-1"></i>
                                            {centerDetails?.center || 'N/A'}
                                        </span>
                                    </div>

                                    {centerDetails ? (
                                        <>
                                            {/* Stats Cards Row */}
                                            <div className="row g-3 g-lg-4 mb-4">
                                                {statsConfig.map((item, index) => (
                                                    item.type === 'stat' ? (
                                                        <StatCard key={index} {...item} />
                                                    ) : (
                                                        <div key={index} className={item.colSize}>
                                                            <InfoCard
                                                                icon={item.icon}
                                                                bgColor={item.bgColor}
                                                                textColor={item.textColor}
                                                                label={item.label}
                                                                value={item.value}
                                                                isAddress={item.isAddress}
                                                            />
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="card border-0 shadow-sm rounded-3">
                                            <div className="card-body p-5 text-center">
                                                <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                                     style={{ width: '64px', height: '64px' }}>
                                                    <i className="bi bi-info-circle text-secondary fs-3"></i>
                                                </div>
                                                <h5 className="text-muted fw-medium">No Details Available</h5>
                                                <p className="text-muted small mb-0">There are no details available for this center at the moment.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        } />
                        <Route path="/attendance-download" element={<AttendanceDownload />} />
                        <Route path="/absentee-roll" element={<AbsenteeRoll />} />
                        <Route path="/student-table" element={<TrackStudentsExam />} />
                        <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Home;
