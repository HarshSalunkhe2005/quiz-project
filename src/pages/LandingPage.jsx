import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const LandingPage = ({ onStart }) => {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [school, setSchool] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !studentClass || !school.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setIsChecking(true);
    try {
      const { data: settings } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'double_guard_enabled')
        .single();

      if (settings?.value === 'true') {
        const cleanName = name.trim().toLowerCase();
        const cleanClass = studentClass.toLowerCase();
        const cleanSchool = school.trim().toLowerCase();

        const { data: existing } = await supabase
          .from('quiz_results')
          .select('id')
          .ilike('name', cleanName)
          .ilike('class', cleanClass)
          .ilike('school', cleanSchool);

        if (existing && existing.length > 0) {
          alert("⚠️ This Name + Class + School combination has already submitted a score today.");
          setIsChecking(false);
          return;
        }
      }

      onStart({ name: name.trim(), class: studentClass, school: school.trim() });
    } catch (err) {
      console.error("Guard Error:", err);
      onStart({ name: name.trim(), class: studentClass, school: school.trim() }); 
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
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          disabled={isChecking}
        />
        
        <select 
          value={studentClass} 
          onChange={(e) => setStudentClass(e.target.value)} 
          required 
          disabled={isChecking}
          style={{ 
            width: '100%',
            height: '43px', /* Precise match for 12px padding + 1px border */
            boxSizing: 'border-box',
            appearance: 'none', 
            WebkitAppearance: 'none', 
            MozAppearance: 'none',
            background: 'rgba(0, 0, 0, 0.3)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300f2ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '16px',
            color: 'grey',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '0 12px',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        >
          <option value="" disabled style={{ background: '#0a0a0c' }}>Select Class</option>
          {['4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(c => (
            <option key={c} value={c} style={{ background: '#0a0a0c' }}>{c} Grade</option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="School Name" 
          value={school} 
          onChange={(e) => setSchool(e.target.value)} 
          required 
          disabled={isChecking}
        />

        <button type="submit" className="start-btn" disabled={isChecking}>
          {isChecking ? "VERIFYING..." : "START SPRINT"}
        </button>
      </form>
    </div>
  );
};

export default LandingPage;