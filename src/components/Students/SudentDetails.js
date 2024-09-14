import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentDetails = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {studentId} = useParams();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        // Assuming the student ID is passed as a URL parameter

        if (!studentId) {
          throw new Error('Student ID is required');
        }

        const response = await axios.post('http://http://192.168.1.102:3000/student_info', { studentId: studentId });
        setStudentInfo(response.data.responseData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!studentInfo) return <div>No student information found</div>;

  return (
    <div className="student-details">
      <h1>Student Details</h1>
      <table>
        <tbody>
          <tr>
            <td>Student ID:</td>
            <td>{studentInfo.student_id}</td>
          </tr>
          <tr>
            <td>Full Name:</td>
            <td>{studentInfo.fullname}</td>
          </tr>
          <tr>
            <td>Batch No:</td>
            <td>{studentInfo.batchNo}</td>
          </tr>
          <tr>
            <td>Batch Date:</td>
            <td>{new Date(studentInfo.batchdate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td>Subject:</td>
            <td>{studentInfo.subject_name} ({studentInfo.subject_name_short})</td>
          </tr>
          <tr>
            <td>Course ID:</td>
            <td>{studentInfo.courseId}</td>
          </tr>
          <tr>
            <td>Batch Year:</td>
            <td>{studentInfo.batch_year}</td>
          </tr>
          <tr>
            <td>Center:</td>
            <td>{studentInfo.center}</td>
          </tr>
          <tr>
            <td>Reporting Time:</td>
            <td>{studentInfo.reporting_time}</td>
          </tr>
          <tr>
            <td>Start Time:</td>
            <td>{studentInfo.start_time}</td>
          </tr>
          <tr>
            <td>End Time:</td>
            <td>{studentInfo.end_time}</td>
          </tr>
          <tr>
            <td>Department ID:</td>
            <td>{studentInfo.departmentId}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;