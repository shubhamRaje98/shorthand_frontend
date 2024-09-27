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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmReset = async () => {
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
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error:', error);
      alert((error.response?.data?.message || error.message));
    }
  };

  const handleCancelReset = () => {
    setShowConfirmation(false);
  };

  const getSelectedFields = () => {
    const fields = [];
    if (studentLogin) fields.push('Master Reset (Student Login)');
    if (trialAudioShortHand) fields.push('Shorthand Trial Audio');
    if (audioShorthandA) fields.push('Shorthand Audio A');
    if (textShorthandA) fields.push('Shorthand Passage A log');
    if (finalShorthandPassageA) fields.push('Final Shorthand Passage A');
    if (audioShorthandB) fields.push('Shorthand Audio B');
    if (textShorthandB) fields.push('Shorthand Passage B log');
    if (finalShorthandPassageB) fields.push('Final Shorthand Passage B');
    if (trialText) fields.push('Typing Trial Passage log');
    if (finalTrialPassageTyping) fields.push('Final Typing Trial Passage');
    if (textTyping) fields.push('Typing Passage log');
    if (finalTypingPassage) fields.push('Final Typing passage');
    return fields;
  };

  return (
    <div className="rsp-container">
      <h1 className="rsp-title">Reset Student Progress</h1>
      <p className="rsp-student-id">Student ID: {studentId}</p>
      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="rsp-form">
          <div className="rsp-checkbox-group">
            <h2 className="rsp-section-title">Select Fields to Reset:</h2>
            
            <div className="rsp-section rsp-section-master">
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={studentLogin}
                  onChange={(e) => setStudentLogin(e.target.checked)}
                />
                Master Reset (Student Login)
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={trialAudioShortHand}
                  onChange={(e) => setTrialAudioShortHand(e.target.checked)}
                />
                Shorthand Trial Audio 
              </label>
            </div>

            <div className="rsp-section rsp-section-shorthand-a">
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={audioShorthandA}
                  onChange={(e) => setAudioShorthandA(e.target.checked)}
                />
                Shorthand Audio A
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={textShorthandA}
                  onChange={(e) => setTextShorthandA(e.target.checked)}
                />
                Shorthand Passage A log
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={finalShorthandPassageA}
                  onChange={(e) => setFinalShorthandPassageA(e.target.checked)}
                />
                Final Shorthand Passage A
              </label>
            </div>

            <div className="rsp-section rsp-section-shorthand-b">
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={audioShorthandB}
                  onChange={(e) => setAudioShorthandB(e.target.checked)}
                />
                Shorthand Audio B 
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={textShorthandB}
                  onChange={(e) => setTextShorthandB(e.target.checked)}
                />
                Shorthand Passage B log
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={finalShorthandPassageB}
                  onChange={(e) => setFinalShorthandPassageB(e.target.checked)}
                />
                Final Shorthand Passage B
              </label>
            </div>

            <div className="rsp-section rsp-section-typing">
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={trialText}
                  onChange={(e) => setTrialText(e.target.checked)}
                />
                Typing Trial Passage log
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={finalTrialPassageTyping}
                  onChange={(e) => setFinalTrialPassageTyping(e.target.checked)}
                />
                Final Typing Trial Passage 
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={textTyping}
                  onChange={(e) => setTextTyping(e.target.checked)}
                />
                Typing Passage log
              </label>
              <label className="rsp-checkbox-label">
                <input
                  type="checkbox"
                  checked={finalTypingPassage}
                  onChange={(e) => setFinalTypingPassage(e.target.checked)}
                />
                Final Typing passage
              </label>
            </div>
          </div>
          <button type="submit" className="rsp-submit-button">Reset Progress</button>
        </form>
      ) : (
        <div className="rsp-confirmation">
          <h2 className="rsp-confirmation-title">Are you sure you want to reset?</h2>
          <p className="rsp-confirmation-text">The following fields will be reset:</p>
          <ul className="rsp-confirmation-list">
            {getSelectedFields().map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
          <div className="rsp-confirmation-buttons">
            <button onClick={handleCancelReset} className="rsp-cancel-button">Cancel</button>
            <button onClick={handleConfirmReset} className="rsp-confirm-button">Yes, Reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetStudentProgress;