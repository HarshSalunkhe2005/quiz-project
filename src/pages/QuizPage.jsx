/**
 * QuizPage.jsx - High Precision & Robust
 */
import React, { useState, useEffect, useRef } from 'react';

const QuizPage = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  
  // High-precision timing
  const startTimeRef = useRef(Date.now());
  const totalTimeRef = useRef(0);
  const timerRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Cleanup function to stop timer safely
  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTimeLeft(15);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleNext(null); // Auto-advance
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [currentIndex]);

  const handleNext = (selectedOption) => {
    clearTimer(); // Stop timer immediately on click or timeout

    // Calculate precision time in ms
    const timeTaken = Date.now() - startTimeRef.current;
    totalTimeRef.current += timeTaken;

    let newScore = score;
    if (selectedOption && selectedOption === currentQuestion.correctAnswer) {
      newScore += 10;
      setScore(newScore);
    }

    // Advance Logic with Safety Check
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newScore, totalTimeRef.current);
    }
  };

  // Safety: If for some reason currentQuestion is undefined, show a loading state
  if (!currentQuestion) return <div className="glass-card">Loading next challenge...</div>;

  return (
    <div className={`quiz-container ${timeLeft <= 5 ? 'emergency-mode' : ''}`}>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="glass-card fade-in">
        <div className="quiz-header">
          <span className="q-count">QUESTION {currentIndex + 1} / {questions.length}</span>
          <div className={`timer-ring ${timeLeft <= 5 ? 'timer-warning' : ''}`}>
            {timeLeft}s
          </div>
        </div>

        <h3 className="question-text">{currentQuestion.text}</h3>

        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button 
              key={index} 
              className="option-btn"
              onClick={() => handleNext(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;