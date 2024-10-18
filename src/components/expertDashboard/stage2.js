// finalPassageTextlog.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './finalPassageTextlog.css';
import { useParams, useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faEyeSlash, faExchangeAlt, faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Stage2 = () => {
    const navigate = useNavigate();
    const { subjectId, qset } = useParams();
    const [passages, setPassages] = useState({ 
        passageA: '', 
        passageB: '' 
      });
    const [activePassage, setActivePassage] = useState('A');
    const [mistakes, setMistakes] = useState({});
    const [ignoreList, setIgnoreList] = useState([]);
    const [fontSizes, setFontSizes] = useState({
        modelAnswer: 14,
        answerPassage: 14,
        mistakes: 14
    });
    const [isSwapped, setIsSwapped] = useState(false);
    const [passageBViewed, setPassageBViewed] = useState(false);
    const [isIgnoreListVisible, setisIgnoreListVisible] = useState(true)
    const [tempIgnoreList, settempIgnoreList] = useState([])

    const MistakesList = ({ mistakes, onAddIgnoreWord, onWordHover, fontSize, ignoreList }) => {
  
    };

    const handleZoom = (column, action) => {
        setFontSizes(prev => ({
            ...prev,
            [column]: action === 'in' ? prev[column] + 2 : Math.max(prev[column] - 2, 8)
        }));
    };

    const handleSubmit = async () => {
      try {
          const response = await axios.post(
              `https://www.shorthandonlineexam.in/submit-passage-review/${subjectId}/${qset}`, 
              {}, 
              { withCredentials: true }
          );

          if (response.status === 200) {
              toast.success('Passage review submitted successfully');
              navigate(`/expertDashboard/${subjectId}`, {replace: true});
          }
      } catch (err) {
          console.error('Error submitting passage review:', err);
          toast.error('Error submitting passage review. Please try again.');
      }
    };

    const handleToggleIgnoreList = () => {
      if (isIgnoreListVisible) {
        settempIgnoreList(ignoreList);
        setIgnoreList([]);
      }
      else{
        setIgnoreList(tempIgnoreList);
        settempIgnoreList([]);
      }
      setisIgnoreListVisible(!isIgnoreListVisible)
    } 

    useEffect(() => {
        const fetchPassages = async () => {
          try {
            const response = await axios.get(`https://www.shorthandonlineexam.in/expert-assigned-passages/${subjectId}/${qset}`, { withCredentials: true });
            if (response.status === 200) {
              console.log("Raw data:", JSON.stringify(response.data));
              // Handle potential null values
              setPassages({
                passageA: response.data.passageA || '',
                passageB: response.data.passageB || ''
              });
              console.log("Passages after setting state:", passages);
            }
          } catch (err) {
            console.error('Error fetching passages:', err);
          }
        };
      
        fetchPassages();
      }, [subjectId, qset]);
      
    // Add this useEffect to log passages whenever it changes
    useEffect(() => {
      console.log("Passages updated:", passages);
    }, [passages]);
      

    useEffect(() => {
      const sendActivePassageData = async () => {
          try {
              console.log(subjectId, qset, activePassage);
              
              const response = await axios.post('https://www.shorthandonlineexam.in/active-passage', {
                  subjectId,
                  qset,
                  activePassage,
              }, { withCredentials: true });
          
              if (response.status === 200) {
                  console.log("Active passage data sent successfully");
                  setIgnoreList(response.data.ignoreList || []);
                  console.log("Ignore list:", response.data.ignoreList);
                  console.log("Debug info:", response.data.debug);
                  
                  // You can add additional checks here if needed
                  if (response.data.debug.student_id) {
                      console.log(`Fetched data for student_id: ${response.data.debug.student_id}`);
                  }
              }
          } catch (err) {
              console.error('Error sending active passage data:', err);
              if (err.response) {
                  console.error('Error debug info:', err.response.data.debug);
              }
          }
      };
    
      sendActivePassageData();
    }, [subjectId, qset, activePassage]);

    const handlePassageChange = (passage) => {
      setActivePassage(passage);
      if (passage === 'B') {
          setPassageBViewed(true);
      }
    };

    const handleAddIgnoreWord = useCallback(async (word) => {
      try {
        const response = await axios.post('https://www.shorthandonlineexam.in/add-ignore-word', {
          subjectId,
          qset,
          activePassage,
          newWord: word
        }, { withCredentials: true });
    
        if (response.status === 200) {
          setIgnoreList(response.data.ignoreList);
          toast.success(`Word "${word}" added to ignore list`);
          console.log("Debug info:", response.data.debug);
        }
      } catch (err) {
        console.error('Error adding word to ignore list:', err);
        toast.error(`Failed to add "${word}" to ignore list`);
      }
    }, [subjectId, qset, activePassage]);
    
    const handleUndoWord = useCallback(async (wordToRemove) => {
      try {
        const response = await axios.post('https://www.shorthandonlineexam.in/undo-word', {
          subjectId,
          qset,
          activePassage,
          wordToRemove
        }, { withCredentials: true });
    
        if (response.status === 200) {
          setIgnoreList(response.data.ignoreList);
          toast.success(`Word "${wordToRemove}" removed from ignore list`);
          console.log("Debug info:", response.data.debug);
        }
      } catch (err) {
        console.error('Error removing word from ignore list:', err);
        toast.error('Failed to remove word from ignore list');
      }
    }, [subjectId, qset, activePassage]);

    const IgnoredList = ({ ignoreList, fontSize, onUndoIgnore }) => {
    return (
        <div className="ignored-list" style={{ fontSize: `${fontSize}px`, marginLeft: '1rem' }}>
        {ignoreList.map((word, index) => (
            <div key={index} className="ignored-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <button 
                className="action-button undo-button" 
                title="Remove from Ignore List"
                onClick={() => onUndoIgnore(word)}
                style={{ fontSize: `${fontSize * 0.8}px`, marginRight: '5px' }}
            >
                <FontAwesomeIcon icon={faUndo} />
            </button>
            <span className="ignored-word">{word}</span>
            </div>
        ))}
        </div>
    );
    };

    return (
        <div className="final-passage-container">
            <div className="passage-buttons-container">
                <div className="passage-buttons">
                    <button 
                        className={`passage-button ${activePassage === 'A' ? 'active' : ''}`}
                        onClick={() => handlePassageChange('A')}
                    >
                        Passage A
                    </button>
                    <button 
                        className={`passage-button ${activePassage === 'B' ? 'active' : ''}`}
                        onClick={() => handlePassageChange('B')}
                    >
                        Passage B
                    </button>
                </div>
                <button 
                    className="submit-button" 
                    onClick={handleSubmit} 
                    disabled={!passageBViewed}
                >
                    Submit
                </button>
                {!passageBViewed && (
                    <span className="submit-tooltip">Please view Passage B before submitting</span>
                )}                
            </div>
            <div className="grid-item">
                <h2 className="column-header">
                Model Answer
                </h2>
                <pre className="preformatted-text" style={{ fontSize: `${fontSizes.modelAnswer}px`}}>
                    {passages[`passage${activePassage}`] || 'No passage available'}
                </pre>
                <div className="zoom-buttons">
                <button onClick={() => handleZoom('modelAnswer', 'in')}><FontAwesomeIcon icon={faSearchPlus} /></button>
                <button onClick={() => handleZoom('modelAnswer', 'out')}><FontAwesomeIcon icon={faSearchMinus} /></button>
                </div>
            </div>
            <div className="grid-item">
            <h2 className="column-header">Mistakes and Ignored Words</h2>
            <div className="mistakes-ignored-container">
                <div className="mistakes-container">
                <h5 style={{color: 'red'}}>Mistakes List</h5>
                <MistakesList 
                    mistakes={mistakes} 
                    fontSize={fontSizes.mistakes}
                    onAddIgnoreWord={handleAddIgnoreWord}
                    onUndoWord={handleUndoWord}
                    ignoreList={ignoreList}
                />
                </div>
                <div className="ignored-container">
                <h5 style={{color: 'red', display: 'flex', alignItems: 'center'}}>
                    Ignored List
                </h5>
                <IgnoredList 
                    ignoreList={ignoreList}
                    fontSize={fontSizes.mistakes}
                    onUndoIgnore={handleUndoWord}
                    isVisible={isIgnoreListVisible}
                />
                </div>
            </div>
            <div className="zoom-buttons">
                <button onClick={handleToggleIgnoreList}><FontAwesomeIcon icon={isIgnoreListVisible ? faToggleOn : faToggleOff} /></button>
                <button onClick={() => handleZoom('mistakes', 'in')}><FontAwesomeIcon icon={faSearchPlus} /></button>
                <button onClick={() => handleZoom('mistakes', 'out')}><FontAwesomeIcon icon={faSearchMinus} /></button>
            </div>
            </div>
        </div>
    );
};

export default Stage2;