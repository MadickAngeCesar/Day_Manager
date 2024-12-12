/**
 * Root component of the Day Manager application.
 * Handles the main layout and routing setup with providers for activities and toast notifications.
 * 
 * @module App
 * @requires react
 * @requires react-router-dom
 * @requires ./context/ActivitiesContext
 * @requires ./components/Toast
 */

import React, { Suspense } from 'react';
import './App.css';
import { HashRouter as Router } from 'react-router-dom';
import { ActivitiesProvider } from './context/ActivitiesContext';
import { ToastProvider } from './components/Toast';

// Lazy load main components for better initial load performance
const Sidebar = React.lazy(() => import('./containers/Sidebar'));
const MainContent = React.lazy(() => import('./containers/MainContent'));

/**
 * Main application component that sets up routing and global providers.
 * Uses React.Suspense for lazy loading components.
 * 
 * @component
 * @returns {JSX.Element} The rendered application
 */
function App() {
  return (
    <Router>
      <ToastProvider>
        <ActivitiesProvider>
          <div className="app">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
              <MainContent />
            </Suspense>
          </div>
        </ActivitiesProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
