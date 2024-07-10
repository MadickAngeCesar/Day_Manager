import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../App.css';

function Sidebar() {
  const { t } = useTranslation();
  return (
    <div className="sidebar">
      <div className="header">
        <h1 className="app-name">Day Manager</h1>
      </div>
      <NavLink exact to="/" activeClassName="active">{t('routine')}</NavLink>
      <NavLink to="/tasks" activeClassName="active">{t('tasks')}</NavLink>
      <NavLink to="/reminders" activeClassName="active">{t('calendar')}</NavLink>
      <NavLink to="/resume" activeClassName="active">{t('resume')}</NavLink>
      {/*<NavLink to="/activities" activeClassName="active">{t('activity')}</NavLink>*/}
      <NavLink to="/settings" activeClassName="active">{t('settings')}</NavLink>
      <div className="footer">
        <p>© 2024 Madick A.C.</p>
      </div>
    </div>
  );
}

export default Sidebar;
