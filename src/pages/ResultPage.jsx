/**
 * ResultPage.jsx
 * Displays final score and a marquee thank you message.
 */
import React from 'react';

const ResultPage = ({ score, name }) => {
  return (
    <div className="glass-card fade-in">
      <h2 className="neon-text">Sprint Finished!</h2>
      
      <div className="score-display">
        <p>YOUR TOTAL SCORE</p>
        <h1 className="big-score">{score}</h1>
      </div>

      <div className="info-box">
        <p>Great effort, <strong>{name}</strong>!</p>
        <p>Results and rankings will be shared in the <strong>School's Official Group</strong>.</p>
      </div>

      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-text">
          THANK YOU FOR PARTICIPATING • SUNDAY SPRINT TECH EDITION • SEE YOU NEXT WEEK • 
          THANK YOU FOR PARTICIPATING • SUNDAY SPRINT TECH EDITION • SEE YOU NEXT WEEK • 
        </div>
      </div>
    </div>
  );
};

export default ResultPage;