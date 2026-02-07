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

  const [serverHour, setServerHour] = useState(null);
  const [isLoadingTime, setIsLoadingTime] = useState(true);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
  
  // Precise Time States
  const [dbStartTime, setDbStartTime] = useState(11);
  const [dbStartMin, setDbStartMin] = useState(0);
  const [dbEndTime, setDbEndTime] = useState(17);
  const [dbEndMin, setDbEndMin] = useState(0);

  const isTimezoneValid = isIST();
  const effectiveHour = serverHour !== null ? serverHour : new Date().getHours();
  const currentMinutes = new Date().getMinutes();

  // Precise Comparison Logic
  const currentTotal = (effectiveHour * 60) + currentMinutes;
  const startTotal = (dbStartTime * 60) + dbStartMin;
  const endTotal = (dbEndTime * 60) + dbEndMin;

  const isBeforeSprint = currentTotal < startTotal;
  const isAfterSprint = currentTotal >= endTotal;
  const isLive = !isBeforeSprint && !isAfterSprint;
  const isAdminView = view === 'ADMIN_AUTH' || view === 'ADMIN_DASHBOARD';

  useEffect(() => {
    const checkSecurity = async () => {
      const today = new Date().toISOString().split('T')[0];
      const hasLock = localStorage.getItem(`sprint_lock_${today}`);

      const { data } = await supabase.from('app_settings').select('*');
      if (data) {
        const ar = data.find(s => s.key === 'anti_refresh_enabled');
        const st = data.find(s => s.key === 'start_time');
        const sm = data.find(s => s.key === 'start_min');
        const et = data.find(s => s.key === 'end_time');
        const em = data.find(s => s.key === 'end_min');

        if (ar?.value === 'true' && hasLock) setAlreadyParticipated(true);
        if (st) setDbStartTime(Number(st.value));
        if (sm) setDbStartMin(Number(sm.value));
        if (et) setDbEndTime(Number(et.value));
        if (em) setDbEndMin(Number(em.value));
      }

      const sHour = await getServerHour();
      setServerHour(sHour);
      setIsLoadingTime(false);
    };

    checkSecurity();
    if (window.location.pathname === '/admin') setView('ADMIN_AUTH');
  }, []);

  const handleStartLanding = (userData) => {
    setUser(userData);
    setView('INSTRUCTIONS'); 
  };

  const handleFinish = async (score, totalMs) => {
    setFinalScore(score);
    setView('RESULT');
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`sprint_lock_${today}`, 'true');
    try {
      await supabase.from('quiz_results').insert([
        { name: user.name, school: user.school, score: score, total_time_ms: totalMs }
      ]);
    } catch (err) { console.error("Database Error:", err.message); }
  };

  const handleAdminLogin = () => {
    const PASS1 = import.meta.env.VITE_ADMIN_PASS_1;
    const PASS2 = import.meta.env.VITE_ADMIN_PASS_2;
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
            {!isTimezoneValid ? <SecurityErrorPage /> : (
              <>
                {alreadyParticipated ? (
                  <div className="glass-card fade-in">
                    <div className="status-icon">✅</div>
                    <h2 className="neon-text">Sprint Completed</h2>
                    <p>You have already participated in today's competition.</p>
                  </div>
                ) : (
                  <>
                    {isBeforeSprint && <PreSprintPage startTime={dbStartTime} startMin={dbStartMin} />}
                    {isAfterSprint && <PostSprintPage />}
                    {isLive && <LandingPage onStart={handleStartLanding} />}
                  </>
                )}
              </>
            )}
          </>
        )}
        {view === 'INSTRUCTIONS' && <InstructionPage lang={lang} setLang={setLang} onProceed={() => setView('QUIZ')} />}
        {view === 'QUIZ' && <QuizPage questions={quizData.questions} onComplete={handleFinish} />}
        {view === 'RESULT' && <ResultPage score={finalScore} name={user?.name} />}
        {view === 'ADMIN_AUTH' && (
          <div className="admin-auth-overlay fade-in">
            <div className="glass-panel">
              <h2 className="neon-text">Restricted Access</h2>
              <input type="password" value={adminPassword} autoFocus onChange={(e) => setAdminPassword(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} className="admin-input-field" />
              <button onClick={handleAdminLogin} className="admin-login-btn">Authenticate</button>
              <button onClick={() => setView('LANDING')} className="back-btn">Exit</button>
            </div>
          </div>
        )}
        {view === 'ADMIN_DASHBOARD' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;