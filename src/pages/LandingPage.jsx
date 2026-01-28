import React, { useState } from 'react';

const LandingPage = ({ onStart }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && school) {
      onStart({ name, school });
    }
  };

  return (
    <div className="glass-card">
      <h2 className="neon-text">Join the Sprint</h2>
      <p>Enter your details to begin the competition.</p>
      
      <form onSubmit={handleSubmit} className="landing-form">
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="School Name" 
          value={school} 
          onChange={(e) => setSchool(e.target.value)} 
          required 
        />
        <button type="submit" className="start-btn">START SPRINT</button>
      </form>
    </div>
  );
};

export default LandingPage;