// finalPassageTextlog.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './finalPassageTextlog.css';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faEyeSlash, faExchangeAlt, faSearchPlus, faSearchMinus} from '@fortawesome/free-solid-svg-icons';
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
            categoryTitle = 'Extra Added Words';
            categoryStyle = {
              backgroundColor: '#fee2e2',
              color: '#b91c1c'
            };
            break;
          case 'added':
            categoryTitle = 'Omitted Words';
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
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isIgnoreListVisible, setisIgnoreListVisible] = useState(true);
  const [tempIgnoreList, settempIgnoreList] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBUrl, setAudioBUrl] = useState('');
  const [wordCorrections, setWordCorrections] = useState({});

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
        `http://localhost:3002/submit-passage-review/${subjectId}/${qset}`, 
        {}, 
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        toast.success('Passage review submitted successfully');
        
        // Get the current URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const isHeld = urlParams.get('held') === 'true';
  
        // Navigate back to the dashboard, including the held parameter if it was true
        if (isHeld) {
          navigate(`/expertDashboard/${subjectId}?held=true`, {replace: true});
        } else {
          navigate(`/expertDashboard/${subjectId}`, {replace: true});
        }
      }
    } catch (err) {
      console.error('Error submitting passage review:', err);
      toast.error('Error submitting passage review. Please try again.');
    }
  };

  const handleHold = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3002/hold-passage-review/${subjectId}/${qset}`, 
        {}, 
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('Passage held successfully');
        navigate(`/expertDashboard/${subjectId}`, {replace: true});
      }
    } catch (err) {
      console.error('Error holding passage review:', err);
      toast.error('Error holding passage review. Please try again.');
    }
  }

  const handleToggleIgnoreList = () => {
    if (isIgnoreListVisible) {
      settempIgnoreList(ignoreList);
      setIgnoreList([]);
    } else {
      setIgnoreList(tempIgnoreList);
      // Don't clear wordCorrections when toggling
    }
    setisIgnoreListVisible(!isIgnoreListVisible);
  };

  useEffect(() => {
    const fetchPassages = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/expert-assigned-passages/${subjectId}/${qset}`, { withCredentials: true });
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
        
        const response = await axios.post('http://localhost:3002/active-passage', {
          subjectId,
          qset,
          activePassage,
        }, { withCredentials: true });
    
        if (response.status === 200) {
          console.log("Active passage data sent successfully");
          setIgnoreList(response.data.ignoreList || []);
          console.log("Ignore list:", response.data.ignoreList);
          console.log("Debug info:", response.data.debug);
          
          if (response.data.debug?.student_id) {
            console.log(`Fetched data for student_id: ${response.data.debug.student_id}`);
          }
        }
      } catch (err) {
        console.error('Error sending active passage data:', err);
        if (err.response) {
          console.error('Error response status:', err.response.status);
          console.error('Error response data:', err.response.data);
        }
      }
    };

    sendActivePassageData();
  }, [subjectId, qset, activePassage]);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/get-subject-qset-audio/${subjectId}/${qset}`, { withCredentials: true });
        if (response.status === 200) {
          setAudioUrl(response.data.passage1);
          setAudioBUrl(response.data.passage2); // Assuming 'passage2' is the audio URL for passageB
        }
      } catch (err) {
        console.error('Error fetching audio:', err);
      }
    };
  
    fetchAudio();
  }, [subjectId, qset]);

  const handlePassageChange = (passage) => {
    setActivePassage(passage);
    if (passage === 'B') {
      setPassageBViewed(true);
    }
  };

  const comparePassages = useCallback(async () => {
    const modelAnswer = passages[`passage${activePassage}`];
    const userAnswer = passages[`ansPassage${activePassage}`];
    
    if (!modelAnswer || !userAnswer) return;

    try {
      const response = await axios.post('http://45.119.47.81:5002/compare', {
      // const response = await axios.post('/api/compare', {
        text1: modelAnswer,
        text2: userAnswer,
        ignore_list: ignoreList,
        ignore_case: true
      }, { withCredentials: true });

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
  }, [comparePassages, activePassage, passages]);

  useEffect(() => {
    const orderedCategories = ['spelling', 'missed', 'added', 'grammar'];
    const counts = orderedCategories.reduce((counts, category) => {
      counts[category] = mistakes[category] ? mistakes[category].length : 0;
      return counts;
    }, {});

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    let average = 50 - (total / 3); // for skilltest
    if (average < 0) {
      average = 0;
    }

    setCategoryCounts({
      ...counts,
      total,
      average: average.toFixed(2) // Rounds to 2 decimal places
    });

    console.log('Mistake category counts:', counts);
    console.log('Total mistakes:', total);
    console.log('Average mistakes:', average.toFixed(2));

    // Send total mistakes, marks, and individual mistake counts to server
    const sendMarksToServer = async () => {
      try {
        const response = await axios.post(`http://localhost:3002/update-student-marks/${subjectId}/${qset}`, {
          total_mistakes: total,
          total_marks: parseFloat(average.toFixed(2)),
          spelling: counts.spelling,
          missed: counts.missed,
          added: counts.added,
          grammar: counts.grammar
        });
        console.log('Server response: ', response.data);
      } catch (error) {
        console.error('Error sending data to server: ', error);
      }
    };
    
    sendMarksToServer();
  }, [mistakes, subjectId, qset]);

  // Improved useEffect to populate wordCorrections when mistakes data changes
  useEffect(() => {
    // When spelling mistakes are loaded, update wordCorrections for any words
    // that are already in the ignoreList
    if (mistakes.spelling && ignoreList.length > 0) {
      console.log("Checking for corrections to map to ignored words...");
      console.log("Current ignore list:", ignoreList);
      console.log("Current spelling mistakes:", mistakes.spelling);
      
      const newCorrections = {};
      
      // Check each spelling mistake
      mistakes.spelling.forEach(word => {
        if (Array.isArray(word)) {
          const incorrectWord = word[0].toLowerCase();
          const correctWord = word[1];
          
          // Check if this incorrect word is in our ignore list
          if (ignoreList.some(ignoredWord => 
            ignoredWord.toLowerCase() === incorrectWord
          )) {
            console.log(`Found correction for ignored word: ${incorrectWord} -> ${correctWord}`);
            newCorrections[incorrectWord] = correctWord;
          }
        }
      });
      
      // Update wordCorrections with any new corrections found
      if (Object.keys(newCorrections).length > 0) {
        console.log("Adding new corrections:", newCorrections);
        setWordCorrections(prev => ({
          ...prev,
          ...newCorrections
        }));
      } else {
        console.log("No corrections found for ignored words");
      }
    }
  }, [mistakes.spelling, ignoreList]);

  // Additional useEffect to populate corrections when comparing passages
  useEffect(() => {
    // This useEffect will run after comparePassages completes and mistakes are updated
    const populateCorrectionsForIgnoreList = () => {
      if (!mistakes.spelling || !ignoreList.length) return;
      
      console.log("Populating corrections after passage comparison");
      
      // Create a map of incorrect->correct words from spelling mistakes
      const correctionMap = {};
      mistakes.spelling.forEach(word => {
        if (Array.isArray(word)) {
          correctionMap[word[0].toLowerCase()] = word[1];
        }
      });
      
      // Check each ignored word to see if it has a correction
      const newCorrections = {};
      ignoreList.forEach(word => {
        const lowerWord = word.toLowerCase();
        if (correctionMap[lowerWord]) {
          newCorrections[lowerWord] = correctionMap[lowerWord];
        }
      });
      
      // Update the corrections state
      if (Object.keys(newCorrections).length > 0) {
        console.log("Adding corrections after comparison:", newCorrections);
        setWordCorrections(prev => ({
          ...prev,
          ...newCorrections
        }));
      }
    };
    
    populateCorrectionsForIgnoreList();
  }, [mistakes, ignoreList]);

  const handleWordHover = useCallback((word) => {
    if (word) {
      const actualWord = word.split('(')[0].trim();
      setHighlightedWord(actualWord);
    } else {
      setHighlightedWord(null);
    }
  }, []);

  // Update the handleAddIgnoreWord function
  const handleAddIgnoreWord = useCallback(async (word) => {
    try {
      // Check if this word is from a spelling mistake (might have a correction)
      let correctionWord = null;
      
      // Check if this word is in the spelling mistakes and has a correction
      if (mistakes.spelling) {
        const spellingMistake = mistakes.spelling.find(mistakeWord => 
          Array.isArray(mistakeWord) && mistakeWord[0].toLowerCase() === word.toLowerCase()
        );
        
        if (spellingMistake && Array.isArray(spellingMistake)) {
          // Store the correction in our local mapping
          setWordCorrections(prev => ({
            ...prev,
            [word.toLowerCase()]: spellingMistake[1]
          }));
          correctionWord = spellingMistake[1];
          console.log(`Stored correction for ${word}: ${correctionWord}`);
        }
      }

      // Still send only the incorrect word to the backend
      const response = await axios.post('http://localhost:3002/add-ignore-word', {
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
  }, [subjectId, qset, activePassage, mistakes]);

  const handleUndoWord = useCallback(async (wordToRemove) => {
    try {
      const response = await axios.post('http://localhost:3002/undo-word', {
        subjectId,
        qset,
        activePassage,
        wordToRemove
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
  }, [subjectId, qset, activePassage, comparePassages]);

  const handleClearIgnoreList = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3002/clear-ignore-list', {
        subjectId,
        qset,
        activePassage
      }, { withCredentials: true });

      if (response.status === 200) {
        setIgnoreList([]);
        setWordCorrections({}); // Clear corrections when clearing ignore list
        toast.success('Ignore list cleared successfully');
        comparePassages();
        console.log("Debug info:", response.data.debug);
      }
    } catch (err) {
      console.error('Error clearing ignore list:', err);
      toast.error('Failed to clear ignore list');
    }
  }, [subjectId, qset, activePassage, comparePassages]);

  // Updated IgnoredList component with better debugging
  const IgnoredList = ({ ignoreList, fontSize, onUndoIgnore }) => {
    console.log("Rendering IgnoredList with:", { 
      ignoreList, 
      wordCorrections: Object.keys(wordCorrections).map(key => `${key}:${wordCorrections[key]}`)
    });
    
    return (
      <div className="ignored-list" style={{ fontSize: `${fontSize}px`, marginLeft: '1rem' }}>
        {ignoreList.map((word, index) => {
          // Check if we have a correction for this word (try both original case and lowercase)
          const correction = wordCorrections[word] || wordCorrections[word.toLowerCase()];
          
          // For debugging
          if (correction) {
            console.log(`Found correction for ${word}: ${correction}`);
          }
          
          const displayWord = correction ? `${word} (${correction})` : word;
          
          return (
            <div key={index} className="ignored-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <button
                className="action-button undo-button"
                title="Remove from Ignore List"
                onClick={() => onUndoIgnore(word)}
                style={{ fontSize: `${fontSize * 0.8}px`, marginRight: '5px' }}
              >
                <FontAwesomeIcon icon={faUndo} />
              </button>
              <span className="ignored-word">{displayWord}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const AudioPlayer = ({ audioUrl }) => {
    const audioRef = React.useRef(null);
    const progressBarRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [hoverPosition, setHoverPosition] = React.useState(null);
  
    const togglePlayPause = () => {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          setIsPlaying(true);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
  
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const duration = audioRef.current.duration;
        const currentTime = audioRef.current.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        setProgress(progressPercent);
      }
    };
  
    const handleProgressBarClick = (event) => {
      if (audioRef.current && progressBarRef.current) {
        const progressBar = progressBarRef.current;
        const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.offsetWidth;
        const clickPercentage = (clickPosition / progressBarWidth) * 100;
        const newTime = (clickPercentage / 100) * audioRef.current.duration;
        
        audioRef.current.currentTime = newTime;
        setProgress(clickPercentage);
  
        if (!isPlaying) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    };
  
    const handleMouseMove = (event) => {
      if (progressBarRef.current) {
        const progressBar = progressBarRef.current;
        const mousePosition = event.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.offsetWidth;
        const hoverPercentage = (mousePosition / progressBarWidth) * 100;
        setHoverPosition(hoverPercentage);
      }
    };
  
    const handleMouseLeave = () => {
      setHoverPosition(null);
    };
  
    React.useEffect(() => {
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.addEventListener('timeupdate', handleTimeUpdate);
      }
      return () => {
        if (audioElement) {
          audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }, []);
  
    return (
      <div className="audio-player">
        <audio ref={audioRef} src={audioUrl} />
        <button onClick={togglePlayPause}>
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <div 
          className="progress-bar-container" 
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
            {hoverPosition !== null && (
              <div className="playhead" style={{ left: `${hoverPosition}%` }}></div>
            )}
          </div>
        </div>
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
          <button className='hold-button active' onClick={handleHold}>
            Hold
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
          <span className="mistake-count missed">Added: {categoryCounts.missed}</span>
          <span className="mistake-count added">Omitted: {categoryCounts.added}</span>
          <span className="mistake-count grammar">Grammar: {categoryCounts.grammar}</span>
          <span className="mistake-count total">Total: {categoryCounts.total}</span>
          <span className="mistake-count average">Marks: {categoryCounts.average}</span>
        </div>                  
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
        <AudioPlayer audioUrl={activePassage === 'A' ? audioUrl : audioBUrl} />
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
            <h5 style={{color: 'red', display: 'flex', alignItems: 'center'}}>
              Ignored List
              <button 
                className="dustbin-button" 
                onClick={handleClearIgnoreList}
                style={{marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer'}}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
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

export default FinalPassageTextlog;