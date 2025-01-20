import React, { useState, useEffect } from "react";
import { auth } from "../firebase"; // Firebase auth instance
import { signOut, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ toggleTheme, isDarkMode }) => {
    const [userName, setUserName] = useState(""); // State for user's name
    const navigate = useNavigate();

    // Fetch user name from db.json based on email
    useEffect(() => {
        const fetchUserName = async (userEmail) => {
            try {
                const response = await fetch(`http://localhost:5000/users?email=${userEmail}`);
                const data = await response.json();

                if (data.length > 0) {
                    setUserName(data[0].name); // Set the name from db.json
                } else {
                    setUserName("User"); // Fallback if no user is found
                }
            } catch (error) {
                console.error("Error fetching user name:", error);
                setUserName("User");
            }
        };

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserName(user.email); // Fetch the user's name on auth state change
            } else {
                setUserName(""); // Clear the name if no user is logged in
            }
        });

        return () => unsubscribe(); // Cleanup the listener
    }, []);

    // Handle Logout and Delete User from db.json and Firebase
    const handleLogout = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
               // Delete user's preferences from db.json
               const preferencesResponse = await fetch(`http://localhost:5000/preferences?userId=${user.uid}`);
               const preferences = await preferencesResponse.json();

               if (preferences.length > 0) {
                await fetch(`http://localhost:5000/preferences/${preferences[0].id}`, {
                    method: "DELETE",
                });
                console.log("Preferences deleted successfully.");
                } else {
                    console.warn("Failed to delete preferences.");
                }

                // Delete user from db.json
                const dbResponse = await fetch(`http://localhost:5000/users/${user.uid}`, {
                    method: "DELETE",
                });

                if (dbResponse.ok) {
                    try {
                        // Delete the user from Firebase Authentication
                        await user.delete(); // Deletes the user record in Firebase
                        alert("User deleted successfully from Firebase.");
                    } catch (firebaseError) {
                        console.error("Error deleting user from Firebase:", firebaseError.message);
                        alert("Could not delete user from Firebase. Please contact support.");
                    }

                    // Sign out user from Firebase
                    await signOut(auth);
                    alert("Logged out successfully!");
                    navigate("/auth"); // Redirect to the auth page
                } else {
                    alert("Error deleting user from db.");
                }
            }
        } catch (error) {
            alert("Error logging out: " + error.message);
        }
    };

    return (
        <nav className={`navbar ${isDarkMode ? "dark" : "light"}`}>
            <div className="navbar-content">
                <span className="welcome-message">Welcome, {userName || "User"}</span>
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
