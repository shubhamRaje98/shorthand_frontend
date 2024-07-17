//finalPassageTextlog.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { diffWords } from 'diff';
import './finalPassageTextlog.css';
import { useParams } from 'react-router-dom';

const ColoredText = ({ diffs }) => {
  return (
    <>
      {diffs.map((part, index) => (
        <span 
          key={index} 
          className={part.added ? 'added' : part.removed ? 'removed' : 'equal'}
        >
          {part.value}
        </span>
      ))}
    </>
  );
};

const FinalPassageTextlog = () => {
    const { subjectId, qset } = useParams();
    const [passages, setPassages] = useState({ 
        passageA: '', 
        passageB: '', 
        ansPassageA: '', 
        ansPassageB: '' 
    });
    const [activePassage, setActivePassage] = useState('A');
    const [diffs, setDiffs] = useState([]);
    const [mistakes, setMistakes] = useState({});
    const [ignoreList, setIgnoreList] = useState([]);
    const [fontSizes, setFontSizes] = useState({
        modelAnswer: 14,
        answerPassage: 14,
        mistakes: 14
    });

    const handleZoom = (column, action) => {
        setFontSizes(prev => ({
            ...prev,
            [column]: action === 'in' ? prev[column] + 2 : Math.max(prev[column] - 2, 8)
        }));
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
        const modelAnswer = passages[`ansPassage${activePassage}`];
        const userAnswer = passages[`passage${activePassage}`];
        
        const newDiffs = diffWords(userAnswer, modelAnswer);
        setDiffs(newDiffs);

        const newMistakes = getColoredWords(modelAnswer, userAnswer);
        setMistakes(newMistakes);
    }, [activePassage, passages]);

    useEffect(() => {
      if (ignoreList.length > 0) {
          const filteredDiffs = filterIgnoredWords(diffs);
          setDiffs(filteredDiffs);

          const filteredMistakes = filterIgnoredMistakes(mistakes);
          setMistakes(filteredMistakes);
      }
    }, [ignoreList]);

    const handlePassageChange = (passage) => {
        setActivePassage(passage);
    };
    
    const sendActivePassageData = async () => {
      try {
        console.log( subjectId,
          qset,
          activePassage)
          
        const response = await axios.post('http://localhost:3000/active-passage', {
          subjectId,
          qset,
          activePassage
        }, { withCredentials: true });
    
        if (response.status === 200) {
          console.log("Active passage data sent successfully");
          setIgnoreList(response.data.ignoreList || []);
          console.log("Ignore list:", response.data.ignoreList); // Added this line
        }
      } catch (err) {
        console.error('Error sending active passage data:', err);
      }
    };

    const filterIgnoredWords = (diffs) => {
      return diffs.map(part => {
          if (part.added || part.removed) {
              const words = part.value.split(/\s+/);
              const filteredWords = words.filter(word => !ignoreList.includes(word.toLowerCase()));
              return {...part, value: filteredWords.join(' ')};
          }
          return part;
      });
    };

    const filterIgnoredMistakes = (mistakes) => {
      const filteredMistakes = {};
      for (const [category, words] of Object.entries(mistakes)) {
          if (category === 'missedWords') {
              filteredMistakes[category] = words.filter(word => !ignoreList.includes(word.toLowerCase()));
          } else if (category === 'extraAdded') {
              filteredMistakes[category] = words.filter(word => !ignoreList.includes(word.toLowerCase()));
          } else if (category === 'spellingMistakes') {
              filteredMistakes[category] = words.filter(mistake => {
                  const [word, correction] = mistake.split('(');
                  const cleanWord = word.trim().toLowerCase();
                  return !ignoreList.includes(cleanWord);
              }).map(mistake => {
                  const [word, correction] = mistake.split('(');
                  const cleanCorrection = correction.trim().slice(0, -1);
                  return ignoreList.includes(word.trim().toLowerCase()) ? cleanCorrection : mistake;
              });
          } else {
              filteredMistakes[category] = words;
          }
      }
      return filteredMistakes;
    };

    const getColoredWords = (modelAnswer, userAnswer) => {
      const missedWords = [];
      const extraAdded = [];
      const spellingMistakes = [];
      const others = [];  // Added this category
    
      const modelWords = modelAnswer.match(/[\u0900-\u097F\w]+/g) || [];
      const userWords = userAnswer.match(/[\u0900-\u097F\w]+/g) || [];
    
      const modelWordSet = new Set(modelWords);
      const userWordSet = new Set(userWords);
    
      let i = 0;
      while (i < userWords.length) {
        const word = userWords[i];
        if (!modelWordSet.has(word)) {
          // Check if it's a merged word
          const nextWord = userWords[i + 1];
          if (nextWord && modelWordSet.has(word.slice(-word.length) + nextWord)) {
            spellingMistakes.push(`${word}${nextWord} (${word.slice(-word.length)}${nextWord})`);
            i += 2;
          } else {
            // Check if it's a spelling mistake
            const similarWord = findSimilarWord(word, modelWords);
            if (similarWord) {
              // Check if the next word is green (correct)
              const nextCorrectWord = userWords[i + 1];
              if (nextCorrectWord && modelWordSet.has(nextCorrectWord)) {
                spellingMistakes.push(`${word} ${nextCorrectWord} (${similarWord} ${nextCorrectWord})`);
                i += 2;
              } else {
                spellingMistakes.push(`${word} (${similarWord})`);
                i++;
              }
            } else {
              extraAdded.push(word);
              i++;
            }
          }
        } else {
          i++;
        }
      }
    
      modelWords.forEach(word => {
        if (!userWordSet.has(word) && !spellingMistakes.some(mistake => mistake.includes(word))) {
          missedWords.push(word);
        }
      });
    
      return {
        missedWords,
        extraAdded,
        spellingMistakes,
        others
      };
    };

    const findSimilarWord = (word, wordList) => {
      for (let modelWord of wordList) {
          if (calculateSimilarity(word, modelWord) >= 0.6) {
              return modelWord;
          }
      }
      return null;
    };

    const calculateSimilarity = (s1, s2) => {
      const longer = s1.length > s2.length ? s1 : s2;
      const shorter = s1.length > s2.length ? s2 : s1;
      const longerLength = longer.length;
      if (longerLength === 0) {
          return 1.0;
      }
      return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    };

    const editDistance = (s1, s2) => {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();
      const costs = [];
      for (let i = 0; i <= s1.length; i++) {
          let lastValue = i;
          for (let j = 0; j <= s2.length; j++) {
              if (i === 0) {
                  costs[j] = j;
              } else if (j > 0) {
                  let newValue = costs[j - 1];
                  if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                      newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                  }
                  costs[j - 1] = lastValue;
                  lastValue = newValue;
              }
          }
          if (i > 0) {
              costs[s2.length] = lastValue;
          }
      }
      return costs[s2.length];
    };
    
    const MistakesList = ({ mistakes, onIgnore, onUndo, fontSize }) => {
      const [ignoredWords, setIgnoredWords] = useState({});
    
      const handleIgnore = (category, index) => {
        setIgnoredWords(prev => ({
          ...prev,
          [category]: { ...(prev[category] || {}), [index]: true }
        }));
        // onIgnore(category, index);
      };
    
      const handleUndo = (category, index) => {
        setIgnoredWords(prev => ({
          ...prev,
          [category]: { ...(prev[category] || {}), [index]: false }
        }));
        // onUndo(category, index);
      };
    
      return (
        <div className="mistakes-list" style={{ fontSize: `${fontSize}px` }}>
          {Object.entries(mistakes).map(([category, words]) => (
            <div key={category}>
              <h3 style={{ fontSize: `${fontSize * 1.2}px` }}>{category}</h3>
              <ul>
                {words.map((word, index) => (
                  <li key={index}>
                    <div className="word-actions">
                      <button 
                        className="action-button ignore-button" 
                        title="Ignore"
                        onClick={() => handleIgnore(category, index)}
                        style={{ fontSize: `${fontSize * 0.8}px` }}
                      >
                        <i className="fas fa-eye-slash"></i>
                      </button>
                      <button 
                        className="action-button undo-button" 
                        title="Undo"
                        onClick={() => handleUndo(category, index)}
                        style={{ fontSize: `${fontSize * 0.8}px` }}
                      >
                        <i className="fas fa-undo"></i>
                      </button>
                    </div>
                    <span className={`mistake-word ${ignoredWords[category]?.[index] ? 'ignored' : ''}`}>
                      {word}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    };

    return (
        <div className="final-passage-container">
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
            <div className="grid-item">
                <h2 className="column-header">Model Answer</h2>
                <pre className="preformatted-text" style={{ fontSize: `${fontSizes.modelAnswer}px`}}>
                    {passages[`ansPassage${activePassage}`]}
                </pre>
                <div className="zoom-buttons">
                    <button onClick={() => handleZoom('modelAnswer', 'in')}><i className="fas fa-search-plus"></i></button>
                    <button onClick={() => handleZoom('modelAnswer', 'out')}><i className="fas fa-search-minus"></i></button>
                </div>
            </div>
            <div className="grid-item">
                <h2 className="column-header">Answer Passage</h2>
                <div className="preformatted-text" style={{ fontSize: `${fontSizes.answerPassage}px` }}>
                    <ColoredText diffs={diffs} />
                </div>
                <div className="zoom-buttons">
                    <button onClick={() => handleZoom('answerPassage', 'in')}><i className="fas fa-search-plus"></i></button>
                    <button onClick={() => handleZoom('answerPassage', 'out')}><i className="fas fa-search-minus"></i></button>
                </div>
            </div>
            <div className="grid-item">
              <h2 className="column-header">Mistakes</h2>
              <MistakesList 
                  mistakes={mistakes} 
                  fontSize={fontSizes.mistakes}
                  // onIgnore={(category, index) => {/* implement ignore logic */}}
                  // onUndo={(category, index) => {/* implement undo logic */}}
              />
              <div className="zoom-buttons">
                  <button onClick={() => handleZoom('mistakes', 'in')}><i className="fas fa-search-plus"></i></button>
                  <button onClick={() => handleZoom('mistakes', 'out')}><i className="fas fa-search-minus"></i></button>
              </div>
            </div>
        </div>
    );
};

export default FinalPassageTextlog;