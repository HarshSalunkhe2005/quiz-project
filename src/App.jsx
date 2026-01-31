import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import InstructionPage from './pages/InstructionPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard'; // Import the new page
import quizData from './data/questions.json';
import './styles/App.css';
import { supabase } from './lib/supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en'); 
  const [view, setView] = useState('LANDING'); 
  const [finalScore, setFinalScore] = useState(0);
  const [adminPassword, setAdminPassword] = useState('');

  // Admin Secrets from your .env
  const PASS1 = import.meta.env.VITE_ADMIN_PASS_1;
  const PASS2 = import.meta.env.VITE_ADMIN_PASS_2;

  // Detect /admin on initial load
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('ADMIN_AUTH');
    }
  }, []);

  const handleStartLanding = (userData) => {
    setUser(userData);
    setView('INSTRUCTIONS'); 
  };

  const handleFinish = async (score, totalMs) => {
    setFinalScore(score);
    setView('RESULT');
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert([
          { 
            name: user.name, 
            school: user.school, 
            score: score, 
            total_time_ms: totalMs 
          }
        ]);

      if (error) throw error;
      console.log("Score captured in the cloud! 🚀");
    } catch (err) {
      console.error("Database Error:", err.message);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === PASS1 || adminPassword === PASS2) {
      setView('ADMIN_DASHBOARD');
    } else {
      alert('Wrong Password');
    }
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 className="neon-text">{quizData.quizTitle}</h1>
      </header>

      {view === 'LANDING' && (
        <LandingPage onStart={handleStartLanding} />
      )}

      {view === 'INSTRUCTIONS' && (
        <InstructionPage 
          lang={lang} 
          setLang={setLang} 
          onProceed={() => setView('QUIZ')} 
        />
      )}

      {view === 'QUIZ' && (
        <QuizPage questions={quizData.questions} onComplete={handleFinish} />
      )}

      {view === 'RESULT' && (
        <ResultPage score={finalScore} name={user?.name} />
      )}

      {/* ADMIN AUTH VIEW */}
      {view === 'ADMIN_AUTH' && (
        <div className="admin-auth-container">
          <div className="glass-card">
            <h2 className="neon-text">Admin Access</h2>
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)} 
              className="admin-input"
            />
            <button onClick={handleAdminLogin} className="admin-login-btn">
              Login to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD VIEW */}
      {view === 'ADMIN_DASHBOARD' && (
        <AdminDashboard />
      )}
    </div>
  );
}

export default App;