import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import ColumnChart from "./ColumnChart";
import Filters from "./Filters";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  // State variables
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    age: "None",
    gender: "None",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Redirect to login if userId is missing
  useEffect(() => {
    if (!userId) {
      navigate("/auth"); // Redirect to auth page
    } else {
      setLoading(false);

      // Retrieve user's selected feature from localStorage
      const savedFeature = localStorage.getItem(`selectedFeature_${userId}`);
      setSelectedFeature(savedFeature || null);
    }
  }, [userId, navigate]);

  // Fetch data from JSON server
  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // Save selected feature to localStorage whenever it changes
  useEffect(() => {
    if (selectedFeature) {
      // Save selected feature to localStorage for this user
      localStorage.setItem(`selectedFeature_${userId}`, selectedFeature);
    } else {
      // Remove the feature if not selected
      localStorage.removeItem(`selectedFeature_${userId}`);
    }
  }, [selectedFeature, userId]);

  // Fetch and save preferences (prevent duplicate calls)
  useEffect(() => {
    if (!userId) return;

    // Flag to track if the request is already processed
    let isMounted = true;

    const fetchAndSavePreferences = async () => {
      try {
        const response = await fetch(`http://localhost:5000/preferences?userId=${userId}`);
        const preferences = await response.json();

        if (isMounted) {
          if (preferences.length > 0) {
            // If preferences exist, use the first one
            setFilters(preferences[0]);
          } else {
            // Create a new preference only if none exist
            const defaultPreferences = {
              userId: userId,
              age: "None",
              gender: "None",
              startDate: "",
              endDate: "",
            };

            // Create a single POST request
            const createResponse = await fetch("http://localhost:5000/preferences", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(defaultPreferences),
            });

            if (createResponse.ok) {
              const createdPreference = await createResponse.json();
              setFilters(createdPreference); // Update filters with newly created preference
            }
          }
        }
      } catch (error) {
        console.error("Error fetching or saving preferences:", error);
      }
    };

    fetchAndSavePreferences();

    return () => {
      isMounted = false; // Clean-up to prevent updates after component unmount
    };
  }, [userId]);

  // Save preferences whenever filters change
  useEffect(() => {
    if (!userId) return;

    const savePreferences = async () => {
      try {
        const response = await fetch(`http://localhost:5000/preferences?userId=${userId}`);
        const preferences = await response.json();

        if (preferences.length > 0) {
          // Update all existing preferences for the userId
          await Promise.all(
            preferences.map((pref) =>
              fetch(`http://localhost:5000/preferences/${pref.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...pref, ...filters }),
              })
            )
          );
        }
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    };

    savePreferences();
  }, [filters, userId]);

  // Clear preferences to default
  const clearPreferences = () => {
    if (!userId) return;

    const defaultPreferences = {
      age: "None",
      gender: "None",
      startDate: "",
      endDate: "",
    };

    setFilters(defaultPreferences);
    setSelectedFeature(null); // Clear selected feature for this user

    fetch(`http://localhost:5000/preferences?userId=${userId}`)
      .then((response) => response.json())
      .then((preferences) => {
        if (preferences.length > 0) {
          // Reset all preferences for the user
          Promise.all(
            preferences.map((pref) =>
              fetch(`http://localhost:5000/preferences/${pref.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId, ...defaultPreferences }),
              })
            )
          );
        }
      });

    // Clear the saved feature from localStorage
    localStorage.removeItem(`selectedFeature_${userId}`);
  };

  // Apply filters to data
  useEffect(() => {
    const { age, gender, startDate, endDate } = filters;

    const filtered = data.filter((item) => {
      const [day, month, year] = item.Day.split("/");
      const itemDate = new Date(`${year}-${month}-${day}`);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (age === "None" || item.Age === age) &&
        (gender === "None" || item.Gender === gender) &&
        (!start || itemDate >= start) &&
        (!end || itemDate <= end)
      );
    });

    setFilteredData(filtered);
  }, [filters, data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`dashboard ${isDarkMode ? "dark" : "light"}`}>
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="main-content">
        <Filters filters={filters} setFilters={setFilters} />
      <button onClick={clearPreferences} className="reset-button">
        Reset Preferences
      </button>
        <BarChart data={filteredData} onBarClick={(feature) => setSelectedFeature(feature)} />
        <LineChart data={filteredData} />
        {selectedFeature && (
          <ColumnChart
            feature={selectedFeature}
            data={filteredData}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;


