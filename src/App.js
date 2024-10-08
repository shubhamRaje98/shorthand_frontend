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
import Stage2 from './components/expertDashboard/stage2';
import FinalPassageTextlog from './components/expertDashboard/finalPassageTextlog';


import QSet from './components/expertDashboard/qset';
import AttendanceDownload from './components/attendanceDownload/attendanceDownload';
import CenterwiseStudentCount from './components/centerwiseStudentExamCountTracking/centerwiseCountReport';
import AbsenteeRoll from './components/attendeeRoll/attendeeRoll';
import ControllerPassword from './components/controllerPassword/controllerPassword';
// import FetchUpdateTable from './components/superAdmin/fetchUpdateTables';
import PCRegistration from './components/pcRegistration/pcRegistration';
import FetchPassageById from './components/expertDashboard/FetchPassageById'
import ResultFetchUpdate from './components/resultSuperAdmin/fetchUpdateTables'; 
import StudentAssignmentReport from './components/expertDashboard/StudentAssignmentReport'
import DepartmentLogin from './components/department/DepartmentLogin';
import StudentDetails from './components/Students/SudentDetails';
import DepartmentDashboard from './components/department/DepartmentDashboard';
import CameraCapture from './components/CameraUpload/CameraCapture';
import SuperAdminLogin from './components/super-admin/SuperAdminLogin';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import SuperAdminTrackDashboard from './components/SuperAdminTrackDashboard/SuperAdminTrackDashboard';
import DownloadApps from './components/DownloadApps/DownloadApps';
import DataUpdateForm from './components/super-admin/DataUpdateForm';
// New SuperAdmin Layout
import SuperAdminLayout from './components/super-admin/SuperAdminLayout';
import CurrentStudentDetails from './components/CurrentStudentDetails/CurrentStudentDetails';
import PcRegistrationCount from './components/department/PcRegistrationCount';
import ResetCenterAdmin from './components/Reset/ResetCenterAdmin';
import DepartmentStudentCount from './components/department/DepartmentStudentCount';
import SuperAdminCount from './components/super-admin/SuperadminStudentCount';
import SuperAdminPc from './components/super-admin/SuperAdminPc';
import ResetRequestsAdmin from './components/Reset/ResetRequestsAdmin';
import StudentData from './components/super-admin/StudentData';
import ResetStudentProgress from './components/super-admin/ResetStudentProgress';
import ExpertReview from './components/super-admin/ExpertReview';
import ExpertManagement from './components/super-admin/ExpertManagement';
import ExpertAssign from './components/super-admin/ExpertAssign';
import ExpertSummary from './components/super-admin/ExpertSummary';

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
                        <Route path=":subjectId/:qset/stage2" element={<Stage2 />} />
                        <Route path=":subjectId/:qset/:studentId" element={<FetchPassageById />} />
                    </Route>

                    <Route path='/student_info/:studentId' element={<StudentDetails/>}/>

                    <Route path="/attendance-download" element={<AttendanceDownload />} />
                    <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
                    <Route path="/absentee-roll" element={<AbsenteeRoll />} />
                    <Route path="/controller-password" element={<ControllerPassword />} />
                    <Route path="/fetch-pc-registration" element={<PCRegistration />} />
                    <Route path="/result-subjectwise-summary" element={<SubjectWiseResultSummary />} />
                    <Route path="/result-super-admin" element={<ResultFetchUpdate />} />
                    <Route path='/department-login' element={<DepartmentLogin/>}/>
                    <Route path='/department-dashboard' element={<DepartmentDashboard/>}/>
                    <Route path='/camera-upload' element={<CameraCapture/>}/>
                    <Route path='/download-apps' element={<DownloadApps/>}/>
                    <Route path='/current-student-details' element={<CurrentStudentDetails/>}/>
                    <Route path='/pc-registration-count' element={<PcRegistrationCount/>}/>
                    <Route path='/reset-center-admin' element={<ResetCenterAdmin/>}/>
                    <Route path='/department-student-count' element={<DepartmentStudentCount/>}/>
                    <Route path='/superadmin-student-count' element={<SuperAdminCount/>}/>
                    <Route path='/superadmin-pc' element={<SuperAdminPc/>}/>

                    

                    {/* SuperAdmin Routes */}
                    <Route path="/admin-login" element={<SuperAdminLogin />} />
                    <Route path="/super-admin" element={<SuperAdminLayout />}>
                        <Route path="dashboard" element={<SuperAdminDashboard />} />
                        <Route path="track-dashboard" element={<SuperAdminTrackDashboard />} />
                        <Route path="fetch-update-table" element={<DataUpdateForm />} />
                        <Route path="student-data" element={<StudentData/>}/>
                        <Route path="expert-review" element={<ExpertReview/>}/>
                        <Route path="expert-management" element={<ExpertManagement/>}/>
                        <Route path="expert-assign" element={<ExpertAssign/>}/>
                        <Route path="expert-summary" element={<ExpertSummary/>}/>
                    </Route>
                </Routes>
            </Router>
        </DashboardProvider>
    );
};

export default App;