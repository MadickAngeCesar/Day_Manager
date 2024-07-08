import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Routines from '../components/Routines';
import Tasks from '../components/Tasks';
import Reminders from '../components/Reminders';
import Activities from '../components/Activities';
import Resume from '../components/Resume';
import SettingsPage from '../components/Settings';
import '../App.css';

function MainContent() {
  return (
    <div className="main-content">
      <Routes>
        <Route exact path="/" element={<Routines />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default MainContent;
