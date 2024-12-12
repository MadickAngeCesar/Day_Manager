import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Create and render the root component with strict mode enabled
// Strict mode helps identify potential problems in the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
