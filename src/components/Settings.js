import React, { useState, useEffect } from 'react';
import '../App.css';
import { useTranslation } from 'react-i18next';
//import { saveSettings, loadSettings } from './SettingsService';
import i18n from '../i18n'; // Ensure correct path to your i18n initialization

function SettingsPage() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Call changeLanguage method from i18n
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    const bodyElement = document.body;
    if (darkMode) {
      bodyElement.classList.add('dark-mode');
    } else {
      bodyElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="settings">
      <h2>{t('settings')}</h2>
      <div className="setting-item">
        <span>{t('language')}:</span>
        <button onClick={toggleLanguage}>{language === 'en' ? t('french') : t('english')}</button>
      </div>
      <div className="setting-item">
        <span>{t('darkMode')}:</span>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      {/* Add more settings as needed */}
    </div>
  );
}

export default SettingsPage;
