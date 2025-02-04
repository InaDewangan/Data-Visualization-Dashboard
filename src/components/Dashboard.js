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

  // Retrieve userId from state or URL parameters
  const userId = location.state?.userId || new URLSearchParams(location.search).get("userId");
  const sharedFeature = new URLSearchParams(location.search).get("feature");
  const sharedUserId = new URLSearchParams(location.search).get("sharedUserId"); // Get shared userId
  const isSharedView = Boolean(sharedUserId); // Fixed: Shared view should be determined by sharedUserId, not feature

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
  const [selectedFeature, setSelectedFeature] = useState(sharedFeature || null);
  const [shareableLink, setShareableLink] = useState("");
  const [mainUserName, setMainUserName] = useState(""); // Main user name
  const [sharedUserName, setSharedUserName] = useState(""); // Shared user name

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Redirect to login if userId is missing
  useEffect(() => {
    if (!userId) {
      // Redirect to Auth Page with shared feature information
      navigate(`/auth?feature=${sharedFeature || ""}&sharedUserId=${sharedUserId || ""}`); // Include shared feature in query params for redirect
      return;
    } else {
      setLoading(false);
      const savedFeature = localStorage.getItem(`selectedFeature_${userId}`);
      if (!selectedFeature && savedFeature !== selectedFeature) {
        setSelectedFeature(savedFeature);
      }
    }
  }, [userId, sharedUserId, navigate, sharedFeature, selectedFeature]);

  // Fetch user data (including name) when userId is available
  // Fetch main user's name
  useEffect(() => {
    console.log("Checking user fetch conditions:");
    console.log("User ID:", userId);
    console.log("Shared User ID:", sharedUserId);
    console.log("Is Shared View?", isSharedView);

    if (userId && !isSharedView) {
      // Fetch main user name
      console.log("Fetching main user name...");
      fetch(`http://localhost:5000/users?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            console.log("Main User Name:", data[0].name);
            setMainUserName(data[0].name); // Store the main user's name
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }

    if (isSharedView && sharedUserId) {
      // Fetch shared user name separately
      console.log("Fetching shared user name...");
      fetch(`http://localhost:5000/users?userId=${sharedUserId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            console.log("Shared User Name:", data[0].name);
            setSharedUserName(data[0].name); // Store the shared user's name separately
          }
        })
        .catch((error) => console.error("Error fetching shared user data:", error));
    }
  }, [userId, sharedUserId, isSharedView]);

  // Fetch data from JSON server
  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // Fetch filters when accessing a shared link
  useEffect(() => {
    if (isSharedView && sharedUserId) {
      fetch(`http://localhost:5000/preferences?userId=${sharedUserId}`)
        .then((response) => response.json())
        .then((preferences) => {
          if (preferences.length > 0) {
            setFilters(preferences[0]); // Apply shared user's filters
          }
        })
        .catch((error) => console.error("Error fetching shared filters:", error));
    }
  }, [sharedUserId, isSharedView]);

  // Save selected feature to localStorage whenever it changes
  useEffect(() => {
    if (selectedFeature) {
      localStorage.setItem(`selectedFeature_${userId}`, selectedFeature);
    } else {
      localStorage.removeItem(`selectedFeature_${userId}`);
    }
  }, [selectedFeature, userId]);

  // Fetch and save user preferences when a regular user logs in
  useEffect(() => {
    if (!userId || isSharedView) return;

    let isMounted = true;

    const fetchAndSavePreferences = async () => {
      try {
        const response = await fetch(`http://localhost:5000/preferences?userId=${userId}`);
        const preferences = await response.json();

        if (isMounted) {
          if (preferences.length > 0) {
            setFilters(preferences[0]);
          } else {
            const defaultPreferences = {
              userId: userId,
              age: "None",
              gender: "None",
              startDate: "",
              endDate: "",
            };

            if (!sharedFeature) {
              const createResponse = await fetch("http://localhost:5000/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(defaultPreferences),
              });

              if (createResponse.ok) {
                const createdPreference = await createResponse.json();
                setFilters(createdPreference);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching or saving preferences:", error);
      }
    };

    fetchAndSavePreferences();

    return () => {
      isMounted = false;
    };
  }, [userId, sharedFeature, isSharedView]);

  // Save preferences whenever filters change
  useEffect(() => {
    if (!userId || sharedFeature) return;

    const savePreferences = async () => {
      try {
        const response = await fetch(`http://localhost:5000/preferences?userId=${userId}`);
        const preferences = await response.json();

        if (preferences.length > 0) {
          await Promise.all(
            preferences
              .filter(pref => pref.userId === userId)
              .map((pref) =>
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
  }, [filters, userId, sharedFeature]);

  // Generate a shareable link with userId for filter synchronization
  const generateShareableLink = () => {
    if (!userId) return; // Ensure user is logged in before generating a link
  
    let url = `${window.location.origin}/dashboard?sharedUserId=${userId}`;
    
    // Only include selectedFeature if it exists
    if (selectedFeature) {
      url += `&feature=${encodeURIComponent(selectedFeature)}`;
    }
  
    setShareableLink(url);
    alert("Shareable link generated! Click 'Copy' to copy the link.");
  };
  
  // close the generated shareable link
  const closegenerateShareableLink = () => {
    setShareableLink("");
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

  // Close the selected chart
  const handleCloseChart = () => {
    setSelectedFeature(null);
    localStorage.removeItem(`selectedFeature_${userId}`); // Ensure state and storage are cleared
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`dashboard ${isDarkMode ? "dark" : "light"}`}>
      {/* Pass the correct user name based on shared view */}
      <Navbar userName={isSharedView ? sharedUserName || "Shared User" : mainUserName || "Main User"} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="main-content">
        <Filters filters={filters} setFilters={setFilters} />
        <div className="control-btns">
          {!isSharedView && (<button onClick={clearPreferences} className="reset-button">
            Reset Preferences
          </button>
          )}
          {!isSharedView && (
            <button onClick={generateShareableLink} className="share-button">
              Share Chart
            </button>
          )}
        </div>
        {shareableLink && (
          <div className="shareable-link">
            <input type="text" value={shareableLink} readOnly />
            <button onClick={() => navigator.clipboard.writeText(shareableLink)}>Copy</button>
            <button onClick={closegenerateShareableLink}>Close</button>
          </div>
        )}
        <BarChart data={filteredData} onBarClick={(feature) => setSelectedFeature(feature)} />
        <LineChart data={filteredData} />
        {selectedFeature && (
          <ColumnChart
            feature={selectedFeature}
            data={filteredData}
            onClose={handleCloseChart} // Fix: Properly close the chart
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;


