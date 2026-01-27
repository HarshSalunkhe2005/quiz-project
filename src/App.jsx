/**
 * App.jsx - The Mother Component
 * Manages the state and routing of the quiz application.
 */
import React, { useState, useEffect } from 'react';
import { getQuizMetadata } from './services/quizService';
import './styles/App.css';

function App() {
  const [metadata, setMetadata] = useState({ title: '' });

  // Load metadata on component mount
  useEffect(() => {
    const data = getQuizMetadata();
    setMetadata(data);
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1 style={{ color: '#00f2ff', textShadow: '0 0 10px #00f2ff' }}>
          {metadata.title}
        </h1>
        <p>Prepare for the Sprint...</p>
      </header>
    </div>
  );
}

export default App;