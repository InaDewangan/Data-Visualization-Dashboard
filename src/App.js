import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";  // Import the new Dashboard component
import HelpPage from "./components/HelpPage"; // Import HelpPage

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome Page Route */}
        <Route path="/" element={<WelcomePage />} />
        
        {/* Authentication Page Route */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Dashboard Page Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/help" element={<HelpPage />} /> {/* Add HelpPage route */}
      </Routes>
    </Router>
  );
}

export default App;
