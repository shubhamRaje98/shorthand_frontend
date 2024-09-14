// src/App.js
import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardProvider } from './components/expertDashboard/DashboardContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import your components
import SubjectWiseResultSummary from './components/subjectWiseSummaryDash/subjectWiseSummaryDash';
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
import FetchPassageById from './components/expertDashboard/FetchPassageById'
import ResultFetchUpdate from './components/resultSuperAdmin/fetchUpdateTables'; 
import StudentAssignmentReport from './components/expertDashboard/StudentAssignmentReport'
import DepartmentLogin from './components/department/DepartmentLogin';
import StudentDetails from './components/Students/SudentDetails';

axios.defaults.withCredentials = true;

const App = () => {
    return (
        <DashboardProvider>
            <Router>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/expert-login" element={<ExpertLogin />} />
                    <Route path="/expertAdmin" element={<ExpertAdmin />} />
                    <Route path="/student-table" element={<StudentTable />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/student-assignment-report/:subjectId/:qset/:studentId" element={<StudentAssignmentReport />} />

                    <Route path="/expertDashboard" element={<ExpertDashboard />}>
                        <Route index element={<SubjectSelection />} />
                        <Route path=":subjectId" element={<QSet />} />
                        <Route path=":subjectId/:qset" element={<FinalPassageTextlog />} />
                        {/* Add the new route here as a nested route */}
                        <Route path=":subjectId/:qset/:studentId" element={<FetchPassageById />} />
                    </Route>

                    <Route path='/student_info/:studentId' element = {<StudentDetails/>}/>


                    <Route path="/attendance-download" element={<AttendanceDownload />} />
                    <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
                    <Route path="/absentee-roll" element={<AbsenteeRoll />} />
                    <Route path="/controller-password" element={<ControllerPassword />} />
                    <Route path="/fetch-update-table" element={<FetchUpdateTable />} />
                    <Route path="/fetch-pc-registration" element={<PCRegistration />} />
                    <Route path="/result-subjectwise-summary" element={<SubjectWiseResultSummary />} />
                    <Route path="/result-super-admin" element={< ResultFetchUpdate />} />
                    <Route path='/department-login' element={<DepartmentLogin/>}/>
                    <Route path='/camera-upload' element={<CameraUpload/>}/>
                </Routes>
            </Router>
        </DashboardProvider>
    );
};

export default App;
