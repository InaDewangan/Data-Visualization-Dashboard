import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase"; // Firebase auth instance
import { EmailAuthProvider, reauthenticateWithCredential, signOut } from "firebase/auth";
import "./Navbar.css";

const Navbar = ({ toggleTheme, isDarkMode, userName}) => {
    console.log("Navbar received userName:", userName);
    const navigate = useNavigate();
    const location = useLocation();


    // Handle logout and delete from db and firebase

  const handleLogout = async () => {
    try {
      const userId = new URLSearchParams(location.search).get("userId"); // Get userId from URL
      const user = auth.currentUser; // Get the currently logged-in Firebase user
  
      console.log("Logout user id:", userId);
      console.log("Current Firebase Auth User UID:", user?.uid);
  
      if (!user) {
        alert("No user is currently logged in.");
        return;
      }
  
      // Step 2: Delete user's preferences from db.json
      const preferencesResponse = await fetch(`https://data-visualization-dashboard-production.up.railway.app/preferences?userId=${userId}`);
      const preferences = await preferencesResponse.json();
  
      if (preferences.length > 0) {
        await fetch(`https://data-visualization-dashboard-production.up.railway.app/preferences/${preferences[0].id}`, {
          method: "DELETE",
        });
        alert("Preferences deleted successfully.");
      } else {
        console.warn("No preferences found for deletion.");
      }
  
      // Step 3: Delete user from db.json
      const dbResponse = await fetch(`https://data-visualization-dashboard-production.up.railway.app/users/${userId}`, { method: "DELETE" });
  
      if (!dbResponse.ok) {
        alert("Error deleting user from db.");
        return;
      }

       // Step 3: Re-authenticate user before deleting from Firebase
       const password = prompt("Please enter your password to delete your account:");
       if (!password) {
           alert("Password is required to delete your account.");
           return;
       }
  
      try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential); // Re-authenticate user
        await user.delete(); // Now delete the user from Firebase
        alert("User deleted successfully from Firebase.");
      } catch (firebaseError) {
        console.error("Error deleting user from Firebase:", firebaseError.message);
        alert("Could not delete user from Firebase. Please check your password or try again later.");
        return;
      }
  
      // Step 5: Sign out user after successful deletion
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/auth"); // Redirect to login
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };
  
    
    return (
        <nav className={`navbar ${isDarkMode ? "dark" : "light"}`}>
            <div className="navbar-content">
                <span className="welcome-message">Welcome to Dashboard, {userName || "User"}</span>
                <button onClick={() => navigate("/help")} className="help-button">
                    Help
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

