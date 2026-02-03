import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import InstructionPage from './pages/InstructionPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard'; 
import PreSprintPage from './pages/PreSprintPage';
import PostSprintPage from './pages/PostSprintPage';
import SecurityErrorPage from './pages/SecurityErrorPage';
import quizData from './data/questions.json';
import './styles/App.css';
import { supabase } from './lib/supabaseClient';
import { isIST } from './utils/security';
import { getServerHour } from './services/timeService';

function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en'); 
  const [view, setView] = useState('LANDING'); 
  const [finalScore, setFinalScore] = useState(0);
  const [adminPassword, setAdminPassword] = useState('');

  // 1. Added state for server-verified time and loading status
  const [serverHour, setServerHour] = useState(null);
  const [isLoadingTime, setIsLoadingTime] = useState(true);

  const PASS1 = import.meta.env.VITE_ADMIN_PASS_1;
  const PASS2 = import.meta.env.VITE_ADMIN_PASS_2;

  // Security & Time Logic
  const isTimezoneValid = isIST();
  
  // 2. Modified logic to prioritize serverHour over local system hour
  const effectiveHour = /*serverHour !== null ? serverHour :*/ new Date().getHours();
  
  const isBeforeSprint = effectiveHour < 11;
  const isAfterSprint = effectiveHour >= 17;
  const isLive = !isBeforeSprint && !isAfterSprint;
  const isAdminView = view === 'ADMIN_AUTH' || view === 'ADMIN_DASHBOARD';

  useEffect(() => {
    // 3. New useEffect to sync time from worldclock API on mount
    const syncTime = async () => {
      const sHour = await getServerHour();
      setServerHour(sHour);
      setIsLoadingTime(false);
    };
    syncTime();

    if (window.location.pathname === '/admin') {
      setView('ADMIN_AUTH');
    }

    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === 'A') {
        setView('ADMIN_AUTH');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      console.log("Score captured! 🚀");
    } catch (err) {
      console.error("Database Error:", err.message);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === PASS1 || adminPassword === PASS2) {
      setView('ADMIN_DASHBOARD');
    } else {
      alert('Access Denied');
      setAdminPassword('');
    }
  };

  /*// 4. Added Loading screen to prevent UI flickering before time is verified
  if (isLoadingTime && !isAdminView) {
    return (
      <div className="app-container">
        <main className="content-area">
          <div className="glass-card fade-in">
            <h2 className="neon-text">Syncing with Server...</h2>
            <p>Verifying competition window status.</p>
          </div>
        </main>
      </div>
    );
  }*/

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 className="neon-text glow">{quizData.quizTitle}</h1>
      </header>

      <main className="content-area">
        {view === 'LANDING' && !isAdminView && (
          <>
            {!isTimezoneValid ? (
              <SecurityErrorPage />
            ) : (
              <>
                {isBeforeSprint && <PreSprintPage />}
                {isAfterSprint && <PostSprintPage />}
                {isLive && <LandingPage onStart={handleStartLanding} />}
              </>
            )}
          </>
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

        {view === 'ADMIN_AUTH' && (
          <div className="admin-auth-overlay fade-in">
            <div className="glass-panel">
              <div className="auth-icon">🔒</div>
              <h2 className="neon-text">Restricted Access</h2>
              <p className="auth-subtitle">Authorized Personnel Only</p>
              <input 
                type="password" 
                placeholder="Enter Credential" 
                value={adminPassword}
                autoFocus
                onChange={(e) => setAdminPassword(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="admin-input-field"
              />
              <button onClick={handleAdminLogin} className="admin-login-btn">
                Authenticate
              </button>
              <button onClick={() => setView('LANDING')} className="back-btn">
                Exit
              </button>
            </div>
          </div>
        )}

        {view === 'ADMIN_DASHBOARD' && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;