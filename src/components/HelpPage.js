import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./HelpPage.css";

const HelpPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Toggle theme function
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <div className={`help-page ${isDarkMode ? "dark" : "light"}`}>
            <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            <div className="help-content">
                <h1>Instructions</h1>
                <ul>
                    <li>
                        <strong>Filters:</strong> Use filters to refine data based on:
                        <ul>
                            <li><strong>Age:</strong> Filter by specific age.</li>
                            <li><strong>Gender:</strong> Filter by gender.</li>
                            <li><strong>Date Range:</strong> Filter data between <em>04/10/2022</em> and <em>29/10/2022</em>.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Share Charts Feature:</strong>
                        <ul>
                            <li><strong>Bar Chart:</strong> Displays time spent on features A, B, C, D, E, and F.</li>
                            <li>
                                <strong>Line Chart:</strong> Compare one or more features (A, B, etc.) over time. Compare up to all features.
                            </li>
                            <li>
                                <strong>Column Chart:</strong> View data for a single feature by date (e.g., time spent on feature A).
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Interactive Bar Chart:</strong> Clicking on a bar in the Bar Chart shows the specific feature's data in the Column Chart.
                    </li>
                    <li><strong>Logout:</strong> Use the logout button to sign out of the dashboard.</li>
                    <li>
                        <strong>Light/Dark Theme:</strong> Toggle between light and dark modes for a better visual experience.
                    </li>
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default HelpPage;
