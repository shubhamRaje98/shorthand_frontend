// FetchPassageById.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './finalPassageTextlog.css';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faEyeSlash, faExchangeAlt, faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';



const ColoredText = ({ coloredWords, highlightedWord }) => {
  return (
    <>
      {coloredWords.map((word, index) => (
        <span 
          key={index} 
          className={`${word.color} ${word.word.includes(highlightedWord) ? 'highlighted' : ''}`}
        >
          {word.word}{' '}
        </span>
      ))}
    </>
  );
};

const MistakesList = ({ mistakes, onAddIgnoreWord, onWordHover, fontSize, ignoreList }) => {
  const orderedCategories = ['spelling', 'missed', 'added', 'grammar'];

  return (
    <div>
      {orderedCategories.map((category) => {
        if (!mistakes[category] || mistakes[category].length === 0) return null;
        
        const headingStyle = {
          fontSize: `${fontSize * 1.2}px`,
          padding: '5px 10px',
          borderRadius: '4px',
          display: 'inline-block'
        };
  
        let categoryTitle;
        let categoryStyle;
  
        switch(category) {
          case 'missed':
            categoryTitle = 'Omitted Words';
            categoryStyle = {
              backgroundColor: '#fee2e2',
              color: '#b91c1c'
            };
            break;
          case 'added':
            categoryTitle = 'Extra Added Words';
            categoryStyle = {
              backgroundColor: '#e6fffa',
              color: '#047857'
            };
            break;
          case 'spelling':
            categoryTitle = 'Spelling Mistakes';
            break;
          case 'grammar':
            categoryTitle = 'Grammar Mistakes';
            break;
          default:
            categoryTitle = category;
        }
  
        return (
          <div key={category}>
            <h3 style={{ ...headingStyle, ...categoryStyle }}>
              {categoryTitle}
            </h3>
            <div style={{ fontSize: `${fontSize}px`, marginLeft: '1rem' }}>
              {mistakes[category].map((word, index) => {
                const wordText = Array.isArray(word) ? word[0] : word;
                const isIgnored = ignoreList.includes(wordText.toLowerCase());
                return (
                  <div 
                    key={index}
                    className="mistake-item"
                    style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
                    onMouseEnter={() => onWordHover(wordText)}
                    onMouseLeave={() => onWordHover(null)}
                  >
                    <button 
                      className="action-button ignore-button" 
                      title={isIgnored ? "Undo Ignore" : "Ignore"}
                      onClick={() => onAddIgnoreWord(wordText)}
                      style={{ fontSize: `${fontSize * 0.8}px`, marginRight: '5px' }}
                    >
                      <FontAwesomeIcon icon={isIgnored ? faUndo : faEyeSlash} />
                    </button>
                    <span className={`mistake-word ${isIgnored ? 'ignored' : ''}`}>
                      {Array.isArray(word) ? `${word[0]} (${word[1]})` : word}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StudentAssignmentReport = () => {
    const navigate = useNavigate();
    const { studentId, subjectId, qset } = useParams();
    const [passages, setPassages] = useState({ 
        passageA: '', 
        passageB: '', 
        ansPassageA: '', 
        ansPassageB: '',
        subjectId: '',
        qset: ''
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
    const [coloredWords, setColoredWords] = useState([]);
    const [highlightedWord, setHighlightedWord] = useState(null);
    const [passageBViewed, setPassageBViewed] = useState(false);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [isIgnoreListVisible, setisIgnoreListVisible] = useState(true)
    const [tempIgnoreList, settempIgnoreList] = useState([])


    const handleZoom = (column, action) => {
        setFontSizes(prev => ({
            ...prev,
            [column]: action === 'in' ? prev[column] + 2 : Math.max(prev[column] - 2, 8)
        }));
    };

    const handleIsSwapped = () => {
      setIsSwapped(!isSwapped);
    };

    const handleSubmit = async () => {
      try {
          toast.success('Passage review submitted successfully');
          navigate(`/expertAdmin`, {replace: true});
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
                const response = await axios.get(`https://shorthandonlineexam.in/student-passages/${subjectId}/${qset}/${studentId}`, { withCredentials: true });
                if (response.status === 200 && response.data && Object.keys(response.data).length > 0) {
                console.log("Raw data:", JSON.stringify(response.data));
                setPassages(response.data);
              } else {
                  console.error('No matching record found for this Student ID');
              }
          } catch (err) {
              console.error('Error fetching passages:', err);
          }
      };

      fetchPassages();
    }, [subjectId, qset, studentId]);

    useEffect(() => {
      const sendActivePassageData = async () => {
          try {
              console.log(subjectId, qset, activePassage, studentId);
              
              const response = await axios.post('https://shorthandonlineexam.in/student-active-passage', {
                  subjectId,
                  qset,
                  activePassage,
                  studentId
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
    }, [subjectId, qset, activePassage, studentId]);

    const handlePassageChange = (passage) => {
      setActivePassage(passage);
      if (passage === 'B') {
          setPassageBViewed(true);
      }
    };

    const comparePassages = useCallback(async () => {
      const modelAnswer = passages[`ansPassage${activePassage}`];
      const userAnswer = passages[`passage${activePassage}`];
      
      if (!modelAnswer || !userAnswer) return;
  
      try {
          const response = await axios.post('http://43.204.22.53:5000/compare', {
              text1: modelAnswer,
              text2: userAnswer,
              ignore_list: ignoreList, // Remove tempIgnoreList from here
              ignore_case: true
          });
  
          if (response.status === 200) {
              const { colored_words, added, missed, spelling, grammar } = response.data;
              setColoredWords(colored_words);
              setMistakes({
                  added,
                  missed,
                  spelling,
                  grammar
              });
          }
      } catch (err) {
          console.error('Error comparing passages:', err);
      }
  }, [activePassage, passages, ignoreList]); // Remove tempIgnoreList from dependencies

    useEffect(() => {
        comparePassages();
    }, [comparePassages]);

    // Add the new useEffect hook here
    useEffect(() => {
      const orderedCategories = ['spelling', 'missed', 'added', 'grammar'];
      const counts = orderedCategories.reduce((counts, category) => {
        counts[category] = mistakes[category] ? mistakes[category].length : 0;
        return counts;
      }, {});
    
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      let average = 50 - (total / 3) ;
      if (average<0) {
        average = 0
      }
    
      setCategoryCounts({
        ...counts,
        total,
        average: average.toFixed(2) // Rounds to 2 decimal places
      });
    
      console.log('Mistake category counts:', counts);
      console.log('Total mistakes:', total);
      console.log('Average mistakes:', average.toFixed(2));
    }, [mistakes]);

    const handleWordHover = useCallback((word) => {
      if (word) {
        const actualWord = word.split('(')[0].trim();
        setHighlightedWord(actualWord);
      } else {
        setHighlightedWord(null);
      }
    }, []);

    const handleAddIgnoreWord = useCallback(async (word) => {
      try {
        const response = await axios.post('https://shorthandonlineexam.in/student-add-ignore-word', {
          subjectId,
          qset,
          activePassage,
          newWord: word,
          studentId
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
    }, [subjectId, qset, activePassage, studentId]);
    
    const handleUndoWord = useCallback(async (wordToRemove) => {
      try {
        const response = await axios.post('https://shorthandonlineexam.in/student-undo-word', {
          subjectId,
          qset,
          activePassage,
          wordToRemove, 
          studentId
        }, { withCredentials: true });
    
        if (response.status === 200) {
          setIgnoreList(response.data.ignoreList);
          toast.success(`Word "${wordToRemove}" removed from ignore list`);
          comparePassages();
          console.log("Debug info:", response.data.debug);
        }
      } catch (err) {
        console.error('Error removing word from ignore list:', err);
        toast.error('Failed to remove word from ignore list');
      }
    }, [subjectId, qset, activePassage, comparePassages, studentId]);

    const handleClearIgnoreList = useCallback(async () => {
      try {
        const response = await axios.post('https://shorthandonlineexam.in/student-clear-ignore-list', {
          subjectId,
          qset,
          activePassage,
          studentId
        }, { withCredentials: true });
    
        if (response.status === 200) {
          setIgnoreList([]);
          toast.success('Ignore list cleared successfully');
          comparePassages();
          console.log("Debug info:", response.data.debug);
        }
      } catch (err) {
        console.error('Error clearing ignore list:', err);
        toast.error('Failed to clear ignore list');
      }
    }, [subjectId, qset, activePassage, comparePassages]);

    const IgnoredList = ({ ignoreList, fontSize, onUndoIgnore, isVisible }) => {
      if (!isVisible) return null;
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
                        {/* Add the studentId display here */}
            <div className="student-id" style={{ marginRight: '1rem', fontWeight: '700' }}>
              Student ID: {studentId}
            </div>
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
            <div className="mistake-counts">
              <span className="mistake-count spelling">Spelling: {categoryCounts.spelling}</span>
              <span className="mistake-count missed">Missed: {categoryCounts.missed}</span>
              <span className="mistake-count added">Added: {categoryCounts.added}</span>
              <span className="mistake-count grammar">Grammar: {categoryCounts.grammar}</span>
              <span className="mistake-count total">Total: {categoryCounts.total}</span>
              <span className="mistake-count average">Marks: {categoryCounts.average}</span>
            </div>
          </div>
            <div className="grid-item">
                <h2 className="column-header">
                  Model Answer
                </h2>
                <pre className="preformatted-text" style={{ fontSize: `${fontSizes.modelAnswer}px`}}>
                    {passages[`ansPassage${activePassage}`]}
                </pre>
                <div className="zoom-buttons">
                  {/* <button onClick={handleIsSwapped}><FontAwesomeIcon icon={faExchangeAlt} /></button> */}
                  <button onClick={() => handleZoom('modelAnswer', 'in')}><FontAwesomeIcon icon={faSearchPlus} /></button>
                  <button onClick={() => handleZoom('modelAnswer', 'out')}><FontAwesomeIcon icon={faSearchMinus} /></button>
                </div>
            </div>
            <div className="grid-item">
                <h2 className="column-header">
                  User Answer
                </h2>
                <pre className="preformatted-text" style={{ fontSize: `${fontSizes.modelAnswer}px`}}>
                    {passages[`passage${activePassage}`]}
                </pre>
                <div className="zoom-buttons">
                  {/* <button onClick={handleIsSwapped}><FontAwesomeIcon icon={faExchangeAlt} /></button> */}
                  <button onClick={() => handleZoom('modelAnswer', 'in')}><FontAwesomeIcon icon={faSearchPlus} /></button>
                  <button onClick={() => handleZoom('modelAnswer', 'out')}><FontAwesomeIcon icon={faSearchMinus} /></button>
                </div>
            </div>
            <div className="grid-item">
                <h2 className="column-header">Difference Passage</h2>
                <div className="preformatted-text" style={{ fontSize: `${fontSizes.answerPassage}px` }}>
                    <ColoredText coloredWords={coloredWords} highlightedWord={highlightedWord} />
                </div>
                <div className="zoom-buttons">
                    <button onClick={() => handleZoom('answerPassage', 'in')}><FontAwesomeIcon icon={faSearchPlus} /></button>
                    <button onClick={() => handleZoom('answerPassage', 'out')}><FontAwesomeIcon icon={faSearchMinus} /></button>
                </div>
            </div>
        </div>
  );
};

export default StudentAssignmentReport;