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
    const { studentId } = useParams();
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
                const response = await axios.get(`http://localhost:3000/student-passages/${studentId}`, { withCredentials: true });
                if (response.status === 200) {
                    console.log("Raw data:", JSON.stringify(response.data));
                    setPassages(response.data);
                }
            } catch (err) {
                console.error('Error fetching passages:', err);
            }
        };
    
        fetchPassages();
    }, [studentId]);

    useEffect(() => {
        const modelAnswer = passages[`ansPassage${activePassage}`];
        const userAnswer = passages[`passage${activePassage}`];
        
        const newDiffs = diffWords(userAnswer, modelAnswer);
        setDiffs(newDiffs);

        const newMistakes = getColoredWords(newDiffs);
        setMistakes(newMistakes);
    }, [activePassage, passages]);

    const handlePassageChange = (passage) => {
        setActivePassage(passage);
    };

    const getColoredWords = (diffs) => {
        const missedWords = [];
        const extraAdded = [];
        const spellingMistakes = [];
        const otherMistakes = [];

        diffs.forEach(part => {
            const words = part.value.split(/\s+/).filter(word => word.length > 0);
            if (part.added) {
                extraAdded.push(...words);
            } else if (part.removed) {
                missedWords.push(...words);
            } else {
                // Check for spelling mistakes (words that are partially equal)
                words.forEach(word => {
                    if (diffs.some(p => p.added && p.value.includes(word))) {
                        spellingMistakes.push(word);
                    }
                });
            }
        });

        // Other mistakes are words that are both added and removed
        const allWords = new Set([...missedWords, ...extraAdded]);
        allWords.forEach(word => {
            if (missedWords.includes(word) && extraAdded.includes(word)) {
                otherMistakes.push(word);
            }
        });

        return {
            "Missed Words": missedWords.filter(w => !otherMistakes.includes(w)),
            "Extra Added": extraAdded.filter(w => !otherMistakes.includes(w)),
            "Spelling Mistakes": spellingMistakes,
            "Other Mistakes": otherMistakes
        };
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