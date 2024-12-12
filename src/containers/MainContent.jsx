/**
 * MainContent component that handles the routing and lazy loading of main application features.
 * This component serves as the primary content area of the application.
 * 
 * @module MainContent
 * @requires react
 * @requires react-router-dom
 */

import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import '../App.css';

// Lazy load feature components to improve initial load time
const Routines = React.lazy(() => import('../components/Routines'));
const Freeday = React.lazy(() => import('../components/Freeday'));
const Tasks = React.lazy(() => import('../components/Tasks'));
const Reminders = React.lazy(() => import('../components/Reminders'));
const Resume = React.lazy(() => import('../components/Resume'));
const SettingsPage = React.lazy(() => import('../components/Settings'));

/**
 * MainContent component that manages routing between different features.
 * Uses React.Suspense for lazy loading of route components.
 * 
 * @component
 * @returns {JSX.Element} The rendered main content area with routes
 */
function MainContent() {
  return (
    <div className="main-content">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/routine" element={<Routines />} />
          <Route path="/freeday" element={<Freeday />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default MainContent;
