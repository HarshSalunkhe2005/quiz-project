import React from 'react';

const PreSprintPage = ({ startTime, startMin, sprintDate, isDateEnabled }) => {
  const formattedMin = startMin < 10 ? `0${startMin}` : startMin;
  
  // Format the date for better readability (e.g., Feb 22, 2026)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="glass-card fade-in">
      <div className="status-icon">⏳</div>
      <h2 className="neon-text">Sprint Not Started</h2>
      
      <p>
        The competition window opens on
        {isDateEnabled && <b> SUNDAY {formatDate(sprintDate)}</b>} at
        <b> {startTime}:{formattedMin} AM IST</b>.
      </p>

      <div className="time-indicator">Please check back later.</div>
    </div>
  );
};

export default PreSprintPage;