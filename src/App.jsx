import React, { Suspense } from "react";
import "./App.css";
import { HashRouter as Router } from "react-router-dom";
import { ActivitiesProvider } from "./context/ActivitiesContext";
import { ToastProvider } from "./components/Toast";

const Sidebar = React.lazy(() => import("./containers/Sidebar"));
const MainContent = React.lazy(() => import("./containers/MainContent"));

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
