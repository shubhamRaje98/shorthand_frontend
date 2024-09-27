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
  const [finalShorthandPassageA, setFinalShorthandPassageA] = useState(false);
  const [finalShorthandPassageB, setFinalShorthandPassageB] = useState(false);
  const [finalTrialPassageTyping, setFinalTrialPassageTyping] = useState(false);
  const [finalTypingPassage, setFinalTypingPassage] = useState(false);

  

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
        textTyping,
        finalShorthandPassageA,
        finalShorthandPassageB,
        finalTrialPassageTyping,
        finalTypingPassage,
      });
      console.log(response);
      alert('Reset successful');
    } catch (error) {
      console.error('Error:', error);
      alert((error.response?.data?.message || error.message));
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
             Shorthand Passage A log
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={finalShorthandPassageA}
              onChange={(e) => setFinalShorthandPassageA(e.target.checked)}
            />
             FInal Shorthand Passage A
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
             Shorthand Passage B log
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={finalShorthandPassageB}
              onChange={(e) => setFinalShorthandPassageB(e.target.checked)}
            />
             FInal Shorthand Passage B
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={trialText}
              onChange={(e) => setTrialText(e.target.checked)}
            />
            Typing Trial Passage log
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={finalTrialPassageTyping}
              onChange={(e) => setFinalTrialPassageTyping(e.target.checked)}
            />
            Final Typing Trial Passage 
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={textTyping}
              onChange={(e) => setTextTyping(e.target.checked)}
            />
            Typing Passage  log
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={finalTypingPassage}
              onChange={(e) => setFinalTypingPassage(e.target.checked)}
            />
            Final Typing passage
          </label>
        </div>
        <button type="submit">Reset Progress</button>
      </form>
    </div>
  );
};

export default ResetStudentProgress;