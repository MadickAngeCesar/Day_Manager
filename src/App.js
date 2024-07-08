import React from 'react';
import './App.css';
import Sidebar from './containers/Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContent from './containers/MainContent';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <MainContent /> 
      </div>
    </Router>
  );
}

export default App;
