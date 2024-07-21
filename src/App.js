// src/App.js
import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardProvider } from './components/expertDashboard/DashboardContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your components
import Login from './components/centerAdminLogin/centerAdminLogin';
import ExpertLogin from './components/expertLogin/expertLogin';
import ExpertAdmin from './components/expertLogin/expertAdmin';
import SubjectSelection from './components/expertDashboard/SubjectSelection';
import StudentTable from './components/studentExamTracking/StudentTable';
import Home from './components/Home/home';
import ExpertDashboard from './components/expertDashboard/expertDashboard';
import FinalPassageTextlog from './components/expertDashboard/finalPassageTextlog';
import QSet from './components/expertDashboard/qset';
import AttendanceDownload from './components/attendanceDownload/attendanceDownload';
import CenterwiseStudentCount from './components/centerwiseStudentExamCountTracking/centerwiseCountReport';
import AbsenteeRoll from './components/attendeeRoll/attendeeRoll';
import ControllerPassword from './components/controllerPassword/controllerPassword';
import FetchUpdateTable from './components/superAdmin/fetchUpdateTables';
import PCRegistration from './components/pcRegistration/pcRegistration';
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext';

const socket = io('http://localhost:3000');
import SubjectWiseResultSummary from './components/subjectWiseSummaryDash/subjectWiseSummaryDash';


axios.defaults.withCredentials = true;

const App = () => {
    return (
        <SocketContext.Provider value={socket}>
            <DashboardProvider>
                <Router>
                    <ToastContainer />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/expert-login" element={<ExpertLogin />} />
                        <Route path="/expertAdmin" element={<ExpertAdmin/>} />
                        <Route path="/student-table" element={<StudentTable />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/expertDashboard" element={<ExpertDashboard />}>
                            <Route index element={<SubjectSelection />} />
                            <Route path=":subjectId" element={<QSet />} />
                            <Route path=":subjectId/:qset" element={<FinalPassageTextlog />} />
                        </Route>
                        <Route path="/attendance-download" element={<AttendanceDownload />} />
                        <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
                        <Route path="/absentee-roll" element={<AbsenteeRoll />} />
                        <Route path="/controller-password" element={<ControllerPassword />} />
                        <Route path="/fetch-update-table" element={<FetchUpdateTable />} />
                        <Route path="/fetch-pc-registration" element={<PCRegistration />} />
                        <Route path="/result-subjectwise-summary" element={<SubjectWiseResultSummary />} />
                    </Routes>
                </Router>
            </DashboardProvider>
        </SocketContext.Provider>

    );
};

export default App;