import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import "./AuthPage.css";

// Check if 'auth' is properly initialized
console.log("Auth instance:", auth);

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook
  const location = useLocation(); // Initialize the useLocation hook
  const featureToShare = new URLSearchParams(location.search).get("feature");
  const sharedUserId = new URLSearchParams(location.search).get("sharedUserId");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        if (!name || !gender) {
          alert("Please fill all fields!");
          return;
        }

        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user details in JSON Server
        const userData = {
          id: user.uid, // Unique Firebase UID
          name: name,
          gender: gender,
          email: email,
        };

        // Send data to JSON Server
        await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        alert("Signup successful! Please log in.");
        setIsSignup(false);
      } else {
        // Log in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert("Login successful!");

        // **Fix: Redirect correctly if a shared link was used**

        let dashboardUrl = `/dashboard?userId=${user.uid}`;
        if (featureToShare) {
          dashboardUrl += `&feature=${encodeURIComponent(featureToShare)}`;
        }
        if (sharedUserId) {
          dashboardUrl += `&sharedUserId=${encodeURIComponent(sharedUserId)}`;
        }

        navigate(dashboardUrl);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleAuth}>
        <h1>{isSignup ? "Sign Up" : "Log In"}</h1>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
        <p>
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsSignup(false)} className="toggle-auth">
                Log In
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setIsSignup(true)} className="toggle-auth">
                Sign Up
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthPage;


