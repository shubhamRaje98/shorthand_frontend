import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { diffWords } from 'diff';
import './finalPassageTextlog.css';
import { useParams } from 'react-router-dom';

const ColoredText = ({ diffs, highlightedWord, ignoreList }) => {
  return (
    <pre className="preformatted-text">
      {diffs.map((part, index) => {
        const words = part.value.split(/\s+/);
        return words.map((word, wordIndex) => {
          const isIgnored = ignoreList.includes(word.toLowerCase());
          const className = `
            ${isIgnored ? 'ignored' : part.added ? 'added' : part.removed ? 'removed' : 'equal'}
            ${word.includes(highlightedWord) ? 'highlighted' : ''}
          `;
          return (
            <span 
              key={`${index}-${wordIndex}`} 
              className={className}
            >
              {word}{wordIndex < words.length - 1 ? ' ' : ''}
            </span>
          );
        });
      })}
    </pre>
  );
};

const MistakesList = ({ mistakes, onWordHover, ignoreList }) => {
  return (
    <div className="mistakes-list">
      {Object.entries(mistakes).map(([category, words]) => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {words.filter(word => {
              const wordToCheck = typeof word === 'string' ? word : word.misspelledWord;
              return !ignoreList.includes(wordToCheck.toLowerCase());
            }).map((word, index) => (
              <li 
                key={index}
                onMouseEnter={() => onWordHover(category === 'spellingMistakes' ? word.misspelledWord : word)}
                onMouseLeave={() => onWordHover(null)}
              >
                {category === 'spellingMistakes' ? `${word.misspelledWord} (${word.correctWord})` : word}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
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
    const [highlightedWord, setHighlightedWord] = useState(null);

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

    useEffect(() => {
        const modelAnswer = passages[`ansPassage${activePassage}`];
        const userAnswer = passages[`passage${activePassage}`];
        
        let newDiffs = [];
        try {
            newDiffs = diffWords(modelAnswer, userAnswer) || [];
        } catch (error) {
            console.error('Error in diffWords:', error);
        }
        
        const newMistakes = getColoredWords(modelAnswer, userAnswer, newDiffs);
        
        setDiffs(newDiffs);
        setMistakes(newMistakes);
    }, [activePassage, passages]);

    useEffect(() => {
        const applyIgnoreList = () => {
            const filteredDiffs = filterIgnoredWords(diffs);
            const filteredMistakes = filterIgnoredMistakes(mistakes);
            setDiffs(filteredDiffs);
            setMistakes(filteredMistakes);
        };

        if (ignoreList.length > 0) {
            applyIgnoreList();
        }
    }, [ignoreList]);

    const handlePassageChange = (passage) => {
        setActivePassage(passage);
    };

    const filterIgnoredWords = (diffs) => {
        return diffs.map(part => {
            if (part.added || part.removed) {
                const words = part.value.split(/\s+/);
                const filteredWords = words.map(word => 
                    ignoreList.includes(word.toLowerCase()) ? { ...part, value: word, ignored: true } : { ...part, value: word }
                );
                return filteredWords;
            }
            return [part];
        }).flat();
    };

    const filterIgnoredMistakes = (mistakes) => {
      const filteredMistakes = {};
      for (const [category, words] of Object.entries(mistakes)) {
        filteredMistakes[category] = words.filter(word => {
          const wordToCheck = typeof word === 'string' ? word : word.misspelledWord;
          return !ignoreList.includes(wordToCheck.toLowerCase());
        });
      }
      return filteredMistakes;
    };

    const getColoredWords = (modelAnswer, userAnswer, diffs) => {
      const missedWords = [];
      const extraAdded = [];
      const spellingMistakes = [];
    
      if (!modelAnswer || !userAnswer) {
        console.error('Model answer or user answer is undefined');
        return { missedWords, extraAdded, spellingMistakes };
      }
    
      const modelWords = modelAnswer.match(/[\u0900-\u097F\w]+/g) || [];
      const userWords = userAnswer.match(/[\u0900-\u097F\w]+/g) || [];
    
      let modelIndex = 0;
      let userIndex = 0;
    
      for (const diff of diffs) {
        if (diff.removed) {
          const removedWords = diff.value.match(/[\u0900-\u097F\w]+/g) || [];
          for (const word of removedWords) {
            missedWords.push(word);
          }
          modelIndex += removedWords.length;
        } else if (diff.added) {
          const addedWords = diff.value.match(/[\u0900-\u097F\w]+/g) || [];
          for (const word of addedWords) {
            extraAdded.push(word);
          }
          userIndex += addedWords.length;
        } else {
          const equalWords = diff.value.match(/[\u0900-\u097F\w]+/g) || [];
          modelIndex += equalWords.length;
          userIndex += equalWords.length;
        }
      }
    
      // Check for spelling mistakes
      for (let i = 0; i < diffs.length - 1; i++) {
        if (diffs[i].removed && diffs[i + 1].added) {
          const removedWords = diffs[i].value.match(/[\u0900-\u097F\w]+/g) || [];
          const addedWords = diffs[i + 1].value.match(/[\u0900-\u097F\w]+/g) || [];
    
          for (let j = 0; j < Math.min(removedWords.length, addedWords.length); j++) {
            const removedWord = removedWords[j];
            const addedWord = addedWords[j];
    
            if (removedWord.toLowerCase() !== addedWord.toLowerCase()) {
              spellingMistakes.push({ misspelledWord: removedWord, correctWord: addedWord });
              
              // Remove the misspelled word and its correction from missedWords and extraAdded
              const missedIndex = missedWords.indexOf(removedWord);
              if (missedIndex !== -1) {
                missedWords.splice(missedIndex, 1);
              }
              
              const extraIndex = extraAdded.indexOf(addedWord);
              if (extraIndex !== -1) {
                extraAdded.splice(extraIndex, 1);
              }
            }
          }
        }
      }
    
      return {
        missedWords,
        extraAdded,
        spellingMistakes
      };
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

    const handleWordHover = useCallback((word) => {
      if (word) {
        // If the word is in the format "word (correction)", extract just the word
        const actualWord = word.split('(')[0].trim();
        setHighlightedWord(actualWord);
      } else {
        setHighlightedWord(null);
      }
    }, []);

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
                <pre className="preformatted-text">{passages[`ansPassage${activePassage}`]}</pre>
            </div>
            <div className="grid-item">
                <h2 className="column-header">Answer Passage</h2>
                <ColoredText diffs={diffs} highlightedWord={highlightedWord} ignoreList={ignoreList} />
            </div>
            <div className="grid-item">
                <h2 className="column-header">Mistakes</h2>
                <MistakesList mistakes={mistakes} onWordHover={handleWordHover} ignoreList={ignoreList} />
            </div>
        </div>
    );
};

export default FinalPassageTextlog;