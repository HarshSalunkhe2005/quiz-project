/**
 * App.jsx - The Mother Component
 * Manages the state and navigation between Landing and Quiz screens.
 */
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import './styles/App.css';

// Modular Service Logic (Inlined for now to ensure your build stays green)
const getQuizMetadata = () => {
  return {
    title: "Sunday Sprint: Tech Edition",
    totalQuestions: 10,
    timePerQuestion: 15
  };
};

function App() {
  const [metadata, setMetadata] = useState({ title: '' });
  const [user, setUser] = useState(null); // Stores { name, school }
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  // Load Metadata
  useEffect(() => {
    const data = getQuizMetadata();
    setMetadata(data);
  }, []);

  // Handler for when a student submits the landing form
  const handleStartQuiz = (userData) => {
    setUser(userData);
    setIsQuizStarted(true);
    console.log("Sprint Started by:", userData.name, "from", userData.school);
  };

  return (
    <div className="app-container">
      {/* If quiz hasn't started, show Landing Page. Otherwise, show Quiz placeholder */}
      {!isQuizStarted ? (
        <div className="fade-in">
          <header className="main-header">
            <h1 className="neon-text">{metadata.title}</h1>
          </header>
          <LandingPage onStart={handleStartQuiz} />
        </div>
      ) : (
        <div className="quiz-placeholder fade-in">
          <h2 className="neon-text">Sprint in Progress...</h2>
          <p>Ready, {user.name}?</p>
          <div className="loading-spinner"></div>
          {/* We will build the QuestionCard component next! */}
        </div>
      )}
    </div>
  );
}

export default App;