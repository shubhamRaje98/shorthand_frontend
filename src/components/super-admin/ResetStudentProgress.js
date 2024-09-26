import React, { useState } from 'react';
import axios from 'axios';
import './ResetStudentProgress.css';

const ResetStudentProgress = ({ studentId }) => {
  const [studentLogin, setStudentLogin] = useState(false);
  const [trialAudioShortHand, setTrialAudioShortHand] = useState(false);
  const [audioShorthandA, setAudioShorthandA] = useState(false);
  const [textShorthandA, setTextShorthandA] = useState(false);
  const [audioShorthandB, setAudioShorthandB] = useState(false);
  const [textShorthandB, setTextShorthandB] = useState(false);
  const [trialText, setTrialText] = useState(false);
  const [textTyping, setTextTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/super-admin-reset-student-logs', {
        student_id: studentId,
        studentLogin,
        trialAudioShortHand,
        audioShorthandA,
        textShorthandA,
        audioShorthandB,
        textShorthandB,
        trialText,
        textTyping
      });
      console.log(response);
      alert('Reset successful');
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container">
      <h1>Reset Student Progress</h1>
      <p>Student ID: {studentId}</p>
      <form onSubmit={handleSubmit}>
        <div className="checkbox-group">
          <h2>Select Fields to Reset:</h2>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={studentLogin}
              onChange={(e) => setStudentLogin(e.target.checked)}
            />
            Master Reset (Student Login)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={trialAudioShortHand}
              onChange={(e) => setTrialAudioShortHand(e.target.checked)}
            />
            Shorthand Trial Audio 
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={audioShorthandA}
              onChange={(e) => setAudioShorthandA(e.target.checked)}
            />
             Shorthand Audio A
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={textShorthandA}
              onChange={(e) => setTextShorthandA(e.target.checked)}
            />
             Shorthand Passage A
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={audioShorthandB}
              onChange={(e) => setAudioShorthandB(e.target.checked)}
            />
             Shorthand Audio B
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={textShorthandB}
              onChange={(e) => setTextShorthandB(e.target.checked)}
            />
             Shorthand Passage B
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={trialText}
              onChange={(e) => setTrialText(e.target.checked)}
            />
            Typing Trial Passage 
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={textTyping}
              onChange={(e) => setTextTyping(e.target.checked)}
            />
            Typing Final Passage 
          </label>
        </div>
        <button type="submit">Reset Progress</button>
      </form>
    </div>
  );
};

export default ResetStudentProgress;