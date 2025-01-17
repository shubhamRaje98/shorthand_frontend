// StudentAssignmentReport.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentAssignmentReport = () => {
  const [studentData, setStudentData] = useState(null);
  const { subjectId, qset, studentId } = useParams();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/student-passages/${subjectId}/${qset}/${studentId}`, { withCredentials: true });
        if (response.status === 200) {
          setStudentData(response.data);
        }
      } catch (error) {
        console.error('Error fetching student assignment data:', error);
      }
    };

    fetchStudentData();
  }, [studentId, subjectId, qset]);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Student Assignment Report</h2>
      <p>Student ID: {studentId}</p>
      <p>Passage A: {studentData.passageA}</p>
      <p>Passage B: {studentData.passageB}</p>
      {/* Display the student assignment data here */}
    </div>
  );
};

export default StudentAssignmentReport;