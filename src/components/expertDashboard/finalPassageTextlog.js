import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './finalPassageTextlog.css';
import { useParams } from 'react-router-dom';

const ColoredText = ({ coloredWords, highlightedWord }) => {
  return (
    <pre className="preformatted-text">
      {coloredWords.map((word, index) => (
        <span 
          key={index} 
          className={`${word.color} ${word.word.includes(highlightedWord) ? 'highlighted' : ''}`}
        >
          {word.word}{' '}
        </span>
      ))}
    </pre>
  );
};

const MistakesList = ({ mistakes, onWordHover, onUndoWord, onAddIgnoreWord }) => {
  return (
    <div className="mistakes-list">
      {Object.entries(mistakes).map(([category, words]) => (
        <div key={category}>
          <h3>{category === 'missed' ? 'Missed Words' : 
               category === 'added' ? 'Extra Added Words' :
               category === 'spelling' ? 'Spelling Mistakes' :
               category === 'grammar' ? 'Grammar Mistakes' : category}</h3>
          <ul>
            {words.map((word, index) => (
              <li 
                key={index}
                onMouseEnter={() => onWordHover(Array.isArray(word) ? word[0] : word)}
                onMouseLeave={() => onWordHover(null)}
              >
                {Array.isArray(word) ? `${word[0]} (${word[1]})` : word}
                <button onClick={() => onUndoWord(category, index)}>Undo</button>
                <button onClick={() => onAddIgnoreWord(Array.isArray(word) ? word[0] : word)}>Ignore</button>
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
    const [coloredWords, setColoredWords] = useState([]);
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

    const handlePassageChange = (passage) => {
        setActivePassage(passage);
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
          setMistakes(prevMistakes => {
            const updatedMistakes = { ...prevMistakes };
            updatedMistakes[category] = [...updatedMistakes[category]];
            updatedMistakes[category].splice(index, 1);
            return updatedMistakes;
          });
          console.log(`Word "${wordText}" undone from ${category} category`);
        }
      } catch (err) {
        console.error('Error undoing word:', err);
      }
    }, [mistakes, subjectId, qset, activePassage]);

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

          // Trigger a recomparison of passages
          comparePassages();
        }
      } catch (err) {
        console.error('Error adding word to ignore list:', err);
      }
    }, [subjectId, qset, activePassage, comparePassages]);

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
                <ColoredText coloredWords={coloredWords} highlightedWord={highlightedWord} />
            </div>
            <div className="grid-item">
                <h2 className="column-header">Mistakes</h2>
                <MistakesList 
                  mistakes={mistakes} 
                  onWordHover={handleWordHover} 
                  onUndoWord={handleUndoWord}
                  onAddIgnoreWord={handleAddIgnoreWord}
                />
            </div>
        </div>
    );
};

export default FinalPassageTextlog;