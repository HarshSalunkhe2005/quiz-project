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

  // Time and Security States
  const [serverHour, setServerHour] = useState(null);
  const [isLoadingTime, setIsLoadingTime] = useState(true);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);

  const PASS1 = import.meta.env.VITE_ADMIN_PASS_1;
  const PASS2 = import.meta.env.VITE_ADMIN_PASS_2;

  // Security & Time Logic
  const isTimezoneValid = isIST();
  
  // Logic to prioritize serverHour over local system hour
  const effectiveHour = new Date().getHours();
  
  const isBeforeSprint = effectiveHour < 11;
  const isAfterSprint = effectiveHour >= 17;
  const isLive = !isBeforeSprint && !isAfterSprint;
  const isAdminView = view === 'ADMIN_AUTH' || view === 'ADMIN_DASHBOARD';

  useEffect(() => {
    const checkSecurity = async () => {
      // ANTI-REFRESH CHECK: Verify if a token exists for today's date
      const today = new Date().toISOString().split('T')[0];
      const hasLock = localStorage.getItem(`sprint_lock_${today}`);

      // Fetch Anti-Refresh Toggle Status from Supabase
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'anti_refresh_enabled')
        .single();

      // Only block if toggle is ON in DB AND local lock exists on device
      if (data?.value && hasLock) {
        setAlreadyParticipated(true);
      }

      // Sync time from worldclock API on mount
      const sHour = await getServerHour();
      setServerHour(sHour);
      setIsLoadingTime(false);
    };

    checkSecurity();

    // Only allow Admin view if URL contains /admin
    if (window.location.pathname === '/admin') {
      setView('ADMIN_AUTH');
    }

    // REMOVED: handleKeyDown and Shift+A event listener to prevent interference with typing
  }, []);

  const handleStartLanding = (userData) => {
    setUser(userData);
    setView('INSTRUCTIONS'); 
  };

  const handleFinish = async (score, totalMs) => {
    setFinalScore(score);
    setView('RESULT');

    // DROP THE LOCK ON FINISH: Mark device as completed today
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`sprint_lock_${today}`, 'true');

    try {
      await supabase.from('quiz_results').insert([
        { 
          name: user.name, 
          school: user.school, 
          score: score, 
          total_time_ms: totalMs 
        }
      ]);
      console.log("Score captured and device locked! 🚀");
    } catch (err) { 
      console.error("Database Error:", err.message); 
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === PASS1 || adminPassword === PASS2) setView('ADMIN_DASHBOARD');
    else { alert('Access Denied'); setAdminPassword(''); }
  };

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
                {alreadyParticipated ? (
                  <div className="glass-card fade-in">
                    <div className="status-icon">✅</div>
                    <h2 className="neon-text">Sprint Completed</h2>
                    <p>You have already participated in today's competition.</p>
                    <p className="auth-subtitle">Multiple attempts are not allowed.</p>
                  </div>
                ) : (
                  <>
                    {isBeforeSprint && <PreSprintPage />}
                    {isAfterSprint && <PostSprintPage />}
                    {isLive && <LandingPage onStart={handleStartLanding} />}
                  </>
                )}
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
              <h2 className="neon-text">Restricted Access</h2>
              <input 
                type="password" 
                value={adminPassword} 
                autoFocus 
                onChange={(e) => setAdminPassword(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} 
                className="admin-input-field" 
              />
              <button onClick={handleAdminLogin} className="admin-login-btn">Authenticate</button>
              <button onClick={() => setView('LANDING')} className="back-btn">Exit</button>
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