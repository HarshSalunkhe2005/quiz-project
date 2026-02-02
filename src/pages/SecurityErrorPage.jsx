import React from 'react';

const SecurityErrorPage = () => {
  return (
    <div className="glass-card fade-in">
      <div className="status-icon">🛡️</div>
      <h2 className="neon-text" style={{ color: '#ff4444' }}>Security Alert</h2>
      <p>A <b>Timezone Mismatch</b> was detected.</p>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        To ensure a fair competition, please disable any VPNs and set your 
        device clock to <b>India Standard Time (IST)</b>.
      </p>
      <button onClick={() => window.location.reload()} className="start-btn" style={{ marginTop: '1rem' }}>
        RETRY CONNECTION
      </button>
    </div>
  );
};

export default SecurityErrorPage;