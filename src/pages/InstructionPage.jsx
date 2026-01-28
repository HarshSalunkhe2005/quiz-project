/**
 * InstructionPage.jsx
 * Integrated language toggle for localized rules.
 */
import React from 'react';

const translations = {
  en: {
    title: "Instructions",
    rules: [
      "Each question has a 15-second timer.",
      "Fast answers earn higher priority in ties.",
      "Once you click, you cannot go back.",
    ],
    button: "START SPRINT"
  },
  hi: {
    title: "निर्देश",
    rules: [
      "प्रत्येक प्रश्न के लिए 15 सेकंड का समय है।",
      "समान अंक होने पर तेज़ उत्तरों को प्राथमिकता दी जाएगी।",
      "एक बार क्लिक करने के बाद, आप वापस नहीं जा सकते।"
    ],
    button: "स्प्रिंट शुरू करें"
  },
  mr: {
    title: "सूचना",
    rules: [
      "प्रत्येक प्रश्नासाठी १५ सेकंदांचा वेळ आहे.",
      "समान गुण असल्यास वेगवान उत्तरांना प्राधान्य दिले जाईल.",
      "एकदा क्लिक केल्यानंतर, तुम्ही मागे जाऊ शकत नाही."
    ],
    button: "स्प्रिंट सुरू करा"
  }
};

const InstructionPage = ({ lang, setLang, onProceed }) => {
  const content = translations[lang] || translations.en;

  return (
    <div className="glass-card fade-in">
      {/* Language Toggle moved inside here */}
      <div className="lang-toggle-container">
        <button onClick={() => setLang('en')} className={lang === 'en' ? 'active' : ''}>EN</button>
        <button onClick={() => setLang('hi')} className={lang === 'hi' ? 'active' : ''}>हिन्दी</button>
        <button onClick={() => setLang('mr')} className={lang === 'mr' ? 'active' : ''}>मराठी</button>
      </div>

      <h2 className="neon-text">{content.title}</h2>
      
      <ul className="instruction-list">
        {content.rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>

      <button className="start-btn" onClick={onProceed}>
        {content.button}
      </button>
    </div>
  );
};

export default InstructionPage;