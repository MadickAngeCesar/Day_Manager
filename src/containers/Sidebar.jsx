/**
 * Sidebar component that provides navigation for the Day Manager application.
 * Contains links to all major features and displays application branding.
 * 
 * @module Sidebar
 * @requires react
 * @requires react-router-dom
 * @requires react-i18next
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../App.css';

/**
 * Navigation sidebar component with internationalized labels.
 * Uses NavLink for active route highlighting.
 * 
 * @component
 * @returns {JSX.Element} The rendered sidebar with navigation links
 */
function Sidebar() {
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <div className="header">
        <h1 className="app-name">Day Manager</h1>
      </div>
      
      {/* Navigation Links */}
      <NavLink to="/routine" activeclassname="active">
        {t('routine')}
      </NavLink>
      <NavLink to="/freeday" activeclassname="active">
        {t('freeday')}
      </NavLink>
      <NavLink to="/tasks" activeclassname="active">
        {t('tasks')}
      </NavLink>
      <NavLink to="/reminders" activeclassname="active">
        {t('calendar')}
      </NavLink>
      <NavLink to="/resume" activeclassname="active">
        {t('resume')}
      </NavLink>
      <NavLink to="/" activeclassname="active">
        {t('settings')}
      </NavLink>

      {/* Footer */}
      <div className="footer">
        <p> 2024 Madick A.C.</p>
      </div>
    </div>
  );
}

export default Sidebar;
