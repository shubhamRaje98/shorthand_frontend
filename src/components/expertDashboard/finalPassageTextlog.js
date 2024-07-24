// finalPassageTextlog.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './finalPassageTextlog.css';
import { useParams, useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faEyeSlash, faExchangeAlt, faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';


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
            categoryTitle = 'Extra Added Words';
            categoryStyle = {
              backgroundColor: '#e6fffa',
              color: '#047857'
            };
            break;
          case 'added':
            categoryTitle = 'Omitted Words';
            categoryStyle = {
              backgroundColor: '#fee2e2',
              color: '#b91c1c'
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

const FinalPassageTextlog = () => {
    const navigate = useNavigate();
    const { subjectId, qset } = useParams();
    const [passages, setPassages] = useState({ 
        passageA: '', 
        passageB: '', 
        ansPassageA: '', 
        ansPassageB: '' 
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
          const response = await axios.post(
              `http://localhost:3000/submit-passage-review/${subjectId}/${qset}`, 
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


    useEffect(() => {
      const fetchPassages = async () => {
          try {
              const response = await axios.get(`http://localhost:3000/expert-assigned-passages/${subjectId}/${qset}`, { withCredentials: true });
              if (response.status === 200) {
                  console.log("Raw data:", JSON.stringify(response.data));
                  setPassages(response.data);
              }
          } catch (err) {
              console.error('Error fetching passages:', err);
          }
      };
  
      fetchPassages();
    }, [subjectId, qset]);

    useEffect(() => {
      const sendActivePassageData = async () => {
          try {
              console.log(subjectId, qset, activePassage);
              
              const response = await axios.post('http://localhost:3000/active-passage', {
                  subjectId,
                  qset,
                  activePassage
              }, { withCredentials: true });
          
              if (response.status === 200) {
                  console.log("Active passage data sent successfully");
                  setIgnoreList(response.data.ignoreList || []);
                  console.log("Ignore list:", response.data.ignoreList);
              }
          } catch (err) {
              console.error('Error sending active passage data:', err);
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

    const comparePassages = useCallback(async () => {
        const modelAnswer = passages[`ansPassage${activePassage}`];
        const userAnswer = passages[`passage${activePassage}`];
        
        if (!modelAnswer || !userAnswer) return;

        try {
            const response = await axios.post('http://localhost:5000/compare', {
                text1: modelAnswer,
                text2: userAnswer,
                ignore_list: ignoreList,
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
    }, [activePassage, passages, ignoreList]);

    useEffect(() => {
        comparePassages();
    }, [comparePassages]);

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
        const response = await axios.post('http://localhost:3000/add-ignore-word', {
          subjectId,
          qset,
          activePassage,
          newWord: word
        }, { withCredentials: true });
    
        if (response.status === 200) {
          setIgnoreList(prevList => [...prevList, word.toLowerCase()]);
          console.log(`Word "${word}" added to ignore list`);
          // We don't need to call comparePassages() here anymore
        }
      } catch (err) {
        console.error('Error adding word to ignore list:', err);
      }
    }, [subjectId, qset, activePassage]);
    
    const handleUndoWord = useCallback(async (category, index) => {
      try {
        const wordToUndo = mistakes[category][index];
        const wordText = Array.isArray(wordToUndo) ? wordToUndo[0] : wordToUndo;
    
        const response = await axios.post('http://localhost:3000/undo-word', {
          subjectId,
          qset,
          activePassage,
          category,
          word: wordText
        }, { withCredentials: true });
    
        if (response.status === 200) {
          setIgnoreList(prevList => prevList.filter(w => w !== wordText.toLowerCase()));
          console.log(`Word "${wordText}" removed from ignore list`);
          comparePassages();
        }
      } catch (err) {
        console.error('Error undoing word:', err);
      }
    }, [mistakes, subjectId, qset, activePassage, comparePassages]);

    const IgnoredList = ({ ignoreList, fontSize, onUndoIgnore }) => {
      return (
        <div className="ignored-list" style={{ fontSize: `${fontSize}px`, marginLeft: '1rem' }}>
          {ignoreList.map((word, index) => (
            <div key={index} className="ignored-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <button 
                className="action-button undo-button" 
                title="Undo Ignore"
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
                {isSwapped ? 'User Answer' : 'Model Answer'}
              </h2>
              <pre className="preformatted-text" style={{ fontSize: `${fontSizes.modelAnswer}px`}}>
                  {isSwapped ? passages[`passage${activePassage}`] : passages[`ansPassage${activePassage}`]}
              </pre>
              <div className="zoom-buttons">
                <button onClick={handleIsSwapped}><FontAwesomeIcon icon={faExchangeAlt} /></button>
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
                  onWordHover={handleWordHover}
                  ignoreList={ignoreList}
                />
              </div>
              <div className="ignored-container">
                <h5 style={{color: 'red'}}>Ignored List</h5>
                <IgnoredList 
                  ignoreList={ignoreList}
                  fontSize={fontSizes.mistakes}
                  onUndoIgnore={handleUndoWord}
                />
              </div>
            </div>
            <div className="zoom-buttons">
              <button onClick={() => handleZoom('mistakes', 'in')}><FontAwesomeIcon icon={faSearchPlus} /></button>
              <button onClick={() => handleZoom('mistakes', 'out')}><FontAwesomeIcon icon={faSearchMinus} /></button>
            </div>
          </div>
      </div>
  );
};

export default FinalPassageTextlog;