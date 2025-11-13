// // src/App.js - Updated routes to include departmentId and examType
// import React from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { DashboardProvider } from './components/expertDashboard/DashboardContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // Import your components
// import SubjectWiseResultSummary from './components/subjectWiseSummaryDash/subjectWiseSummaryDash';
// import Login from './components/centerAdminLogin/centerAdminLogin';
// import ExpertLogin from './components/expertLogin/expertLogin';
// import ExpertAdmin from './components/expertLogin/expertAdmin';
// import SubjectSelection from './components/expertDashboard/SubjectSelection';
// import StudentTable from './components/studentExamTracking/StudentTable';
// import Home from './components/Home/home';
// import ExpertDashboard from './components/expertDashboard/expertDashboard';
// import Stage2 from './components/expertDashboard/stage2';
// import FinalPassageTextlog from './components/expertDashboard/finalPassageTextlog';
// import QSet from './components/expertDashboard/qset';
// import AttendanceDownload from './components/attendanceDownload/attendanceDownload';
// import CenterwiseStudentCount from './components/centerwiseStudentExamCountTracking/centerwiseCountReport';
// import AbsenteeRoll from './components/attendeeRoll/attendeeRoll';
// import ControllerPassword from './components/controllerPassword/controllerPassword';
// import PCRegistration from './components/pcRegistration/pcRegistration';
// import FetchPassageById from './components/expertDashboard/FetchPassageById'
// import ResultFetchUpdate from './components/resultSuperAdmin/fetchUpdateTables'; 
// import StudentAssignmentReport from './components/expertDashboard/StudentAssignmentReport'
// import DepartmentLogin from './components/department/DepartmentLogin';
// import StudentDetails from './components/Students/SudentDetails';
// import DepartmentDashboard from './components/department/DepartmentDashboard';
// import CameraCapture from './components/CameraUpload/CameraCapture';
// import SuperAdminLogin from './components/super-admin/SuperAdminLogin';
// import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
// import SuperAdminTrackDashboard from './components/SuperAdminTrackDashboard/SuperAdminTrackDashboard';
// import DownloadApps from './components/DownloadApps/DownloadApps';
// import DataUpdateForm from './components/super-admin/DataUpdateForm';
// import SuperAdminLayout from './components/super-admin/SuperAdminLayout';
// import CurrentStudentDetails from './components/CurrentStudentDetails/CurrentStudentDetails';
// import PcRegistrationCount from './components/department/PcRegistrationCount';
// import ResetCenterAdmin from './components/Reset/ResetCenterAdmin';
// import DepartmentStudentCount from './components/department/DepartmentStudentCount';
// import SuperAdminCount from './components/super-admin/SuperadminStudentCount';
// import SuperAdminPc from './components/super-admin/SuperAdminPc';
// import ResetRequestsAdmin from './components/Reset/ResetRequestsAdmin';
// import StudentData from './components/super-admin/StudentData';
// import ResetStudentProgress from './components/super-admin/ResetStudentProgress';
// import ExpertReview from './components/super-admin/ExpertReview';
// import ExpertManagement from './components/super-admin/ExpertManagement';
// import ExpertAssign from './components/super-admin/ExpertAssign';
// import ExpertSummary from './components/super-admin/ExpertSummary';
// import BatchManagement from './components/super-admin/BatchManagement';
// import Student_info from './components/super-admin/Student_info';
// import AttendancePage from './components/AttendanceReport/AttendancePage';
// import AttendanceReports from './components/super-admin/AttendanceReports';
// import HallticketsGeneration from './components/super-admin/HallticketsGeneration';
// import SubmitAndDone from './components/super-admin/SubmitAndDone';
// import DownloadBackup from './components/super-admin/DownloadBackup';
// // import DownloadZip from './components/super-admin/DownloadZip';
// import DownloadRegister from './components/super-admin/DownloadRegister';
// import ExcelUpload from './components/super-admin/ExcelUpload';


// axios.defaults.withCredentials = true;

// const App = () => {
//     return (
//         <DashboardProvider>
//             <Router>
//                 <ToastContainer />
//                 <Routes>
//                     <Route path="/" element={<Login />} />
//                     <Route path="/expert-login" element={<ExpertLogin />} />
//                     <Route path="/expertAdmin" element={<ExpertAdmin />} />
//                     <Route path="/student-table" element={<StudentTable />} />
//                     <Route path="/home" element={<Home />} />
//                     <Route path="/student-assignment-report/:subjectId/:qset/:studentId/:departmentId" element={<StudentAssignmentReport />} />
//                     <Route path="/attendance-upload" element={<AttendancePage/>}/>

//                     {/* Updated ExpertDashboard routes to include departmentId and examType */}
//                     <Route path="/expertDashboard" element={<ExpertDashboard />}>
//                         <Route index element={<SubjectSelection />} />
//                         <Route path=":subjectId" element={<QSet />} />
//                         {/* Updated routes with departmentId and examType parameters */}
//                         <Route path=":subjectId/:qset/:departmentId/:examType" element={<FinalPassageTextlog />} />
//                         <Route path=":subjectId/:qset/:departmentId/:examType/stage2" element={<Stage2 />} />
//                         <Route path=":subjectId/:qset/:studentId/:departmentId/:examType" element={<FetchPassageById />} />
//                     </Route>

//                     <Route path='/student_info/:studentId' element={<StudentDetails/>}/>
//                     <Route path="/attendance-download" element={<AttendanceDownload />} />
//                     <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
//                     <Route path="/absentee-roll" element={<AbsenteeRoll />} />
//                     <Route path="/controller-password" element={<ControllerPassword />} />
//                     <Route path="/fetch-pc-registration" element={<PCRegistration />} />
//                     <Route path="/result-subjectwise-summary" element={<SubjectWiseResultSummary />} />
//                     <Route path="/result-super-admin" element={<ResultFetchUpdate />} />
//                     <Route path='/department-login' element={<DepartmentLogin/>}/>
//                     <Route path='/department-dashboard' element={<DepartmentDashboard/>}/>
//                     <Route path='/camera-upload' element={<CameraCapture/>}/>
//                     <Route path='/download-apps' element={<DownloadApps/>}/>
//                     <Route path='/current-student-details' element={<CurrentStudentDetails/>}/>
//                     <Route path='/pc-registration-count' element={<PcRegistrationCount/>}/>
//                     <Route path='/reset-center-admin' element={<ResetCenterAdmin/>}/>
//                     <Route path='/department-student-count' element={<DepartmentStudentCount/>}/>
//                     <Route path='/superadmin-student-count' element={<SuperAdminCount/>}/>
//                     <Route path='/superadmin-pc' element={<SuperAdminPc/>}/>

//                     {/* SuperAdmin Routes */}
//                     <Route path="/admin-login" element={<SuperAdminLogin />} />
//                     <Route path="/super-admin" element={<SuperAdminLayout />}>
//                         <Route path="dashboard" element={<SuperAdminDashboard />} />
//                         <Route path="track-dashboard" element={<SuperAdminTrackDashboard />} />
//                         <Route path="fetch-update-table" element={<DataUpdateForm />} />
//                         <Route path="student-data" element={<StudentData/>}/>
//                         <Route path="expert-review" element={<ExpertReview/>}/>
//                         <Route path="expert-management" element={<ExpertManagement/>}/>
//                         <Route path="expert-assign" element={<ExpertAssign/>}/>
//                         <Route path="expert-summary" element={<ExpertSummary/>}/>
//                         <Route path="batch-management" element={<BatchManagement/>}/>
//                         <Route path='student-info' element={<Student_info/>}/>
//                         <Route path='attendance-reports' element={<AttendanceReports/>}/>
//                         <Route path='halltickets-generation' element={<HallticketsGeneration/>}/>
//                         <Route path="submit-done" element={<SubmitAndDone />} />
//                         <Route path="download-backup" element={<DownloadBackup />} />
//                         {/* <Route path="download-zip" element={<DownloadZip />} /> */}
//                         <Route path="download-register" element={<DownloadRegister />} />
//                         <Route path="upload-excel" element={<ExcelUpload />} />

//                     </Route>
//                 </Routes>
//             </Router>
//         </DashboardProvider>
//     );
// };
// export default App;


// src/App.js - Updated routes to include departmentId and examType
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
import BatchManagement from './components/super-admin/BatchManagement';
import Student_info from './components/super-admin/Student_info';
import AttendancePage from './components/AttendanceReport/AttendancePage';
import AttendanceReports from './components/super-admin/AttendanceReports';
import HallticketsGeneration from './components/super-admin/GenerateGccTbcHallTickets';
import SubmitAndDone from './components/super-admin/SubmitAndDone';
import DownloadBackup from './components/super-admin/DownloadBackup';
// import DownloadZip from './components/super-admin/DownloadZip';
import DownloadRegister from './components/super-admin/DownloadRegister';
import ExcelUpload from './components/super-admin/ExcelUpload';

// Import new Department Setup Components
import DepartmentSetup from './components/super-admin/department-setup/DepartmentSetup';
import AddDepartment from './components/super-admin/department-setup/AddDepartment';
import AddExamCenter from './components/super-admin/department-setup/AddExamCenter';
import CreateBatch from './components/super-admin/department-setup/CreateBatch';
import AssignController from './components/super-admin/department-setup/AssignController';
import RegisterStudents from './components/super-admin/department-setup/RegisterStudents';
import AddController from './components/super-admin/add-new/AddController';
import MockStudentPage from './components/super-admin/MockStudentPage';
import EvaluationDashboard from './components/super-admin/EvaluationDashboard'; 
import AddNewExamCenter from './components/super-admin/add-new/AddNewExamCenter';
// import AddController from './components/super-admin/add-new/AddController';
import HallticketsDepartmentSelection from './components/super-admin/HallticketsDepartmentSelection';
import GenerateGccTbcHallTickets from './components/super-admin/GenerateGccTbcHallTickets';
import GenerateSkillTestHallTickets from './components/super-admin/GenerateSkillTestHallTickets';
import GenerateSkillTestHallTicketsFromDB from './components/super-admin/GenerateSkillTestHallTicketsFromDB';
import LandingPage from './components/LandingPage/LandingPage';


axios.defaults.withCredentials = true;

const App = () => {
    return (
        <DashboardProvider>
            <Router>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/expert-login" element={<ExpertLogin />} />
                    <Route path="/expertAdmin" element={<ExpertAdmin />} />
                    <Route path="/student-table" element={<StudentTable />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/student-assignment-report/:subjectId/:qset/:studentId/:departmentId" element={<StudentAssignmentReport />} />
                    <Route path="/attendance-upload" element={<AttendancePage />} />

                    {/* Updated ExpertDashboard routes to include departmentId and examType */}
                    <Route path="/expertDashboard" element={<ExpertDashboard />}>
                        <Route index element={<SubjectSelection />} />
                        <Route path=":subjectId" element={<QSet />} />
                        {/* Updated routes with departmentId and examType parameters */}
                        <Route path=":subjectId/:qset/:departmentId/:examType" element={<FinalPassageTextlog />} />
                        <Route path=":subjectId/:qset/:departmentId/:examType/stage2" element={<Stage2 />} />
                        <Route path=":subjectId/:qset/:studentId/:departmentId/:examType" element={<FetchPassageById />} />
                    </Route>

                    <Route path='/student_info/:studentId' element={<StudentDetails />} />
                    <Route path="/attendance-download" element={<AttendanceDownload />} />
                    <Route path="/centerwise-student-count" element={<CenterwiseStudentCount />} />
                    <Route path="/absentee-roll" element={<AbsenteeRoll />} />
                    <Route path="/controller-password" element={<ControllerPassword />} />
                    <Route path="/fetch-pc-registration" element={<PCRegistration />} />
                    <Route path="/result-subjectwise-summary" element={<SubjectWiseResultSummary />} />
                    <Route path="/result-super-admin" element={<ResultFetchUpdate />} />
                    <Route path='/department-login' element={<DepartmentLogin />} />
                    <Route path='/department-dashboard' element={<DepartmentDashboard />} />
                    <Route path='/camera-upload' element={<CameraCapture />} />
                    <Route path='/download-apps' element={<DownloadApps />} />
                    <Route path='/current-student-details' element={<CurrentStudentDetails />} />
                    <Route path='/pc-registration-count' element={<PcRegistrationCount />} />
                    <Route path='/reset-center-admin' element={<ResetCenterAdmin />} />
                    <Route path='/department-student-count' element={<DepartmentStudentCount />} />
                    <Route path='/superadmin-student-count' element={<SuperAdminCount />} />
                    <Route path='/superadmin-pc' element={<SuperAdminPc />} />

                    {/* SuperAdmin Routes */}
                    <Route path="/admin-login" element={<SuperAdminLogin />} />
                    <Route path="/super-admin" element={<SuperAdminLayout />}>
                        <Route path="dashboard" element={<SuperAdminDashboard />} />
                        <Route path="track-dashboard" element={<SuperAdminTrackDashboard />} />
                        <Route path="fetch-update-table" element={<DataUpdateForm />} />
                        <Route path="student-data" element={<StudentData />} />
                        <Route path="expert-review" element={<ExpertReview />} />
                        <Route path="expert-management" element={<ExpertManagement />} />
                        <Route path="expert-assign" element={<ExpertAssign />} />
                        <Route path="expert-summary" element={<ExpertSummary />} />
                        <Route path="batch-management" element={<BatchManagement />} />
                        <Route path='student-info' element={<Student_info />} />
                        <Route path='attendance-reports' element={<AttendanceReports />} />
                        <Route path='halltickets-generation' element={<HallticketsGeneration />} />
                        <Route path="submit-done" element={<SubmitAndDone />} />
                        <Route path="download-backup" element={<DownloadBackup />} />
                        {/* <Route path="download-zip" element={<DownloadZip />} /> */}
                        <Route path="download-register" element={<DownloadRegister />} />
                        <Route path="upload-excel" element={<ExcelUpload />} />

                        {/* NEW: Department Setup Routes */}
                        <Route path="department-setup" element={<DepartmentSetup />} />
                        <Route path="add-department" element={<AddDepartment />} />
                        <Route path="add-exam-center" element={<AddExamCenter />} />
                        <Route path="create-batch" element={<CreateBatch />} />
                        <Route path="assign-controller" element={<AssignController />} />
                        <Route path="register-students" element={<RegisterStudents />} />
                        <Route path="add-controller" element={<AddController />} />
                        <Route path="mock-students" element={<MockStudentPage />} />
                        <Route path="evaluation-dashboard" element={<EvaluationDashboard />} />
                        <Route path="add-new-exam-center" element={<AddNewExamCenter />} />
                        <Route path="halltickets-department-selection" element={<HallticketsDepartmentSelection />} />
                        <Route path="halltickets-generation/gcc-tbc" element={<GenerateGccTbcHallTickets />} />
                        <Route path="halltickets-generation/skill-test" element={<GenerateSkillTestHallTickets />} />
                        <Route
                            path="/super-admin/generate-halltickets-db"
                            element={<GenerateSkillTestHallTicketsFromDB />}
                        />
                        

                    </Route>
                </Routes>
            </Router>
        </DashboardProvider>
    );
};
export default App;