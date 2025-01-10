import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CameraCapture from './../CameraUpload/CameraCapture';
import './StudentDetails.css';

const StudentDetails = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { studentId } = useParams();
  const [showCameraCapture, setShowCameraCapture] = useState(false);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        if (!studentId) {
          throw new Error('Student ID is required');
        }

        const response = await axios.post('https://www.shorthandonlineexam.in/student_info', { studentId: studentId });
        setStudentInfo(response.data.responseData);
        console.log(response.data.responseData)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!studentInfo) return <div>No student information found</div>;

  // Function to ensure the base64 string has the correct data URI prefix
  const getImageSrc = (base64String) => {
    if (base64String.startsWith('data:image')) {
      return base64String;
    } else {
      // Assume it's a JPEG if no prefix is provided
      return `data:image/jpeg;base64,${base64String}`;
    }
  };

  return (
    <div className="student-details">
      <h1>Student Details</h1>
      {studentInfo.base64 && (
        <img 
          src={getImageSrc(studentInfo.base64)} 
          alt="Student Photo" 
          className="student-photo"
        />
      )}
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
          {/* ... other table rows ... */}
        </tbody>
      </table>

      <div className="upload-container">
        <button className="upload-button" onClick={() => setShowCameraCapture(!showCameraCapture)}>
          {showCameraCapture ? 'Hide Upload Section' : 'Upload Photo'}
        </button>
      </div>

      {showCameraCapture && <CameraCapture studentId={studentInfo.student_id} />}
    </div>
  );
};

export default StudentDetails;