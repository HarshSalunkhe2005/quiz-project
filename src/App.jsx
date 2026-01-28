import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import InstructionPage from './pages/InstructionPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import quizData from './data/questions.json';
import './styles/App.css';
import { supabase } from './lib/supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en'); 
  const [view, setView] = useState('LANDING'); 
  const [finalScore, setFinalScore] = useState(0);

  const handleStartLanding = (userData) => {
    setUser(userData);
    setView('INSTRUCTIONS'); 
  };

  const handleFinish = async (score, totalMs) => {
    setFinalScore(score);
    setView('RESULT');
    try {
      const { error } = await supabase
        .from('quiz_results') // This must match the table name exactly
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
      // Optional: Alert the user if the score didn't save
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
    </div>
  );
}

export default App;