import React from 'react';

const PreSprintPage = ({ startTime, startMin }) => {
  const formattedMin = startMin < 10 ? `0${startMin}` : startMin;
  return (
    <div className="glass-card fade-in">
      <div className="status-icon">⏳</div>
      <h2 className="neon-text">Sprint Not Started</h2>
      <p>The competition window opens at <b>{startTime}:{formattedMin} AM IST</b>.</p>
      <div className="time-indicator">Please check back later.</div>
    </div>
  );
};

export default PreSprintPage;