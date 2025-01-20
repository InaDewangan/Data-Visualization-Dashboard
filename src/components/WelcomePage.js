import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src="https://png.pngtree.com/png-clipart/20241114/original/pngtree-3d-cartoon-businessman-analyzing-data-charts-and-graphs-png-image_17056285.png" alt="Logo" className="logo" />
        <h1>Data Visualization Dashboard</h1>
        <button onClick={() => navigate("/auth")} className="welcome-button">
          Sign Up / Login
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
