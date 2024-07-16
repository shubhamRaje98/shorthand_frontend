//finalPassageTextlog.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { diffWords } from 'diff';
import './finalPassageTextlog.css';
import { useParams } from 'react-router-dom';

const ColoredText = ({ diffs }) => {
  return (
    <pre className="preformatted-text">
      {diffs.map((part, index) => (
        <span 
          key={index} 
          className={part.added ? 'added' : part.removed ? 'removed' : 'equal'}
        >
          {part.value}
        </span>
      ))}
    </pre>
  );
};

const MistakesList = ({ mistakes }) => {
  return (
    <div>
      {Object.entries(mistakes).map(([category, words]) => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {words.map((word, index) => (
              <li key={index}>{word}</li>
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

    const handlePassageChange = (passage) => {
        setActivePassage(passage);
    };

    const getColoredWords = (modelAnswer, userAnswer) => {
        const missedWords = [];
        const extraAdded = [];
        const spellingMistakes = [];

        const modelWords = modelAnswer.toLowerCase().match(/\b\w+\b/g) || [];
        const userWords = userAnswer.toLowerCase().match(/\b\w+\b/g) || [];

        const modelWordSet = new Set(modelWords);
        const userWordSet = new Set(userWords);

        // Find missed words
        modelWords.forEach(word => {
            if (!userWordSet.has(word)) {
                missedWords.push(word);
            }
        });

        // Find extra added words
        userWords.forEach(word => {
            if (!modelWordSet.has(word)) {
                // Check if it's a spelling mistake
                const similarWord = findSimilarWord(word, modelWords);
                if (similarWord) {
                    spellingMistakes.push(`${word} (possibly meant: ${similarWord})`);
                } else {
                    extraAdded.push(word);
                }
            }
        });

        return {
            "Missed Words": missedWords,
            "Extra Added": extraAdded,
            "Spelling Mistakes": spellingMistakes
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

    const MistakesList = ({ mistakes }) => {
        return (
          <div className="mistakes-list">
            {Object.entries(mistakes).map(([category, words]) => (
              <div key={category}>
                <h3>{category}</h3>
                <ul>
                  {words.map((word, index) => (
                    <li key={index}>{word}</li>
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
                    <pre className="preformatted-text">{passages[`ansPassage${activePassage}`]}</pre>
                </div>
                <div className="grid-item">
                    <h2 className="column-header">Answer Passage</h2>
                    <ColoredText diffs={diffs} />
                </div>
                <div className="grid-item">
                    <h2 className="column-header">Mistakes</h2>
                    <MistakesList mistakes={mistakes} />
                </div>
        </div>
    );
};

export default FinalPassageTextlog;