import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const LandingPage = ({ onStart }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !school.trim()) return;

    setIsChecking(true);
    try {
      // 1. Check if the Double Guard toggle is ON in app_settings
      const { data: settings } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'double_guard_enabled')
        .single();

      if (settings?.value) {
        // 2. Normalize inputs for strict comparison
        const cleanName = name.trim().toLowerCase();
        const cleanSchool = school.trim().toLowerCase();

        // 3. Check quiz_results for existing entries
        // Note: Using name_lower/school_lower if you added them, or just name/school
        const { data: existing } = await supabase
          .from('quiz_results')
          .select('id')
          .ilike('name', cleanName)
          .ilike('school', cleanSchool);

        if (existing && existing.length > 0) {
          alert("⚠️ This Name + School combination has already submitted a score today.");
          setIsChecking(false);
          return;
        }
      }

      // If guard is OFF or no duplicate found
      onStart({ name: name.trim(), school: school.trim() });
    } catch (err) {
      console.error("Guard Error:", err);
      onStart({ name: name.trim(), school: school.trim() }); // Fallback: let them play if DB fails
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="glass-card">
      <h2 className="neon-text">Join the Sprint</h2>
      <p>Enter your details to begin the competition.</p>
      <form onSubmit={handleSubmit} className="landing-form">
        <input 
          type="text" placeholder="Full Name" value={name} 
          onChange={(e) => setName(e.target.value)} required disabled={isChecking}
        />
        <input 
          type="text" placeholder="School Name" value={school} 
          onChange={(e) => setSchool(e.target.value)} required disabled={isChecking}
        />
        <button type="submit" className="start-btn" disabled={isChecking}>
          {isChecking ? "VERIFYING..." : "START SPRINT"}
        </button>
      </form>
    </div>
  );
};

export default LandingPage;