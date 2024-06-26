// src/App.js

import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/centerAdminLogin/centerAdminLogin';
import StudentTable from './components/studentExamTracking/StudentTable';
import Home from './components/Home/home';
import AttendanceDownload from './components/attendanceDownload/attendanceDownload'
import CenterwiseStudentCount from './components/centerwiseStudentExamCountTracking/centerwiseCountReport'
import AbsenteeRoll  from './components/attendeeRoll/attendeeRoll';
import ControllerPassword from './components/controllerPassword/controllerPassword';
import FetchUpdateTable from './components/superAdmin/fetchUpdateTables';
axios.defaults.withCredentials = true;
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/student-table" element={<StudentTable />} />
                <Route path="/home" element={<Home/>} />
                <Route path="/attendance-download" element={<AttendanceDownload/>}/>
                <Route path='/centerwise-student-count' element={<CenterwiseStudentCount/>}/>
                <Route path='/absentee-roll' element={<AbsenteeRoll/>}></Route>
                <Route path="/controller-password" element={<ControllerPassword />} />
                <Route path="/fetch-update-table" element={<FetchUpdateTable/>}/>
            </Routes>
        </Router>
    );
};

export default App;