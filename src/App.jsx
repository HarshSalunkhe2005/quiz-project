/**
 * App.jsx - Updated with Quiz Logic and Result Screen
 */
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import quizData from './data/questions.json'; // Direct import to solve path issues
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('LANDING'); // LANDING, QUIZ, RESULT
  const [finalScore, setFinalScore] = useState(0);

  const handleStart = (userData) => {
    setUser(userData);
    setView('QUIZ');
  };

  const handleFinish = (score) => {
    setFinalScore(score);
    setTotalTime(totalMs);
    setView('RESULT');
  };
  

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 className="neon-text">{quizData.quizTitle}</h1>
      </header>

      {view === 'LANDING' && <LandingPage onStart={handleStart} />}

      {view === 'QUIZ' && (
        <QuizPage 
          questions={quizData.questions} 
          onComplete={handleFinish} 
        />
      )}

      {view === 'RESULT' && (
        <div className="glass-card fade-in">
          <h2 className="neon-text">Sprint Finished!</h2>
          <div className="score-display">
            <p>Your Score</p>
            <h1 className="big-score">{finalScore}</h1>
          </div>
          <p className="result-note">
            Top 3 will be announced at 5:30 PM. <br />
            Great work, {user?.name}!
          </p>
        </div>
      )}
    </div>
  );
}

export default App;