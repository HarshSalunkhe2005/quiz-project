import React, { useState, useEffect, useRef } from 'react';

const QuizPage = ({ questions, onComplete }) => {
  // Initialize from storage to survive refresh
  const [currentIndex, setCurrentIndex] = useState(() => {
    return Number(localStorage.getItem('quiz_current_index')) || 0;
  });
  const [score, setScore] = useState(() => {
    return Number(localStorage.getItem('quiz_current_score')) || 0;
  });
  const [timeLeft, setTimeLeft] = useState(15);
  
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Persist index and score whenever they change
  useEffect(() => {
    localStorage.setItem('quiz_current_index', currentIndex);
    localStorage.setItem('quiz_current_score', score);
  }, [currentIndex, score]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTimeLeft(15);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleNext(null); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [currentIndex]);

  const handleNext = (selectedOption) => {
    clearTimer();

    // Calculate time for THIS segment
    const timeTakenThisSegment = Date.now() - startTimeRef.current;
    
    // Add to previously stored total time
    const previousTotalTime = Number(localStorage.getItem('quiz_total_time_ms')) || 0;
    const updatedTotalTime = previousTotalTime + timeTakenThisSegment;
    localStorage.setItem('quiz_total_time_ms', updatedTotalTime);

    let newScore = score;
    if (selectedOption && selectedOption === currentQuestion.correctAnswer) {
      newScore += 10;
      setScore(newScore);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Clear all quiz progress keys on finish
      localStorage.removeItem('quiz_current_index');
      localStorage.removeItem('quiz_current_score');
      localStorage.removeItem('quiz_total_time_ms');
      onComplete(newScore, updatedTotalTime);
    }
  };

  if (!currentQuestion) return <div className="glass-card">Loading...</div>;

  return (
    <div className={`quiz-container ${timeLeft <= 5 ? 'emergency-mode' : ''}`}>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="glass-card fade-in">
        <div className="quiz-header">
          <span className="q-count">QUESTION {currentIndex + 1} / {questions.length}</span>
          <div className={`timer-ring ${timeLeft <= 5 ? 'timer-warning' : ''}`}>{timeLeft}s</div>
        </div>
        <h3 className="question-text">{currentQuestion.text}</h3>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button key={index} className="option-btn" onClick={() => handleNext(option)}>{option}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;