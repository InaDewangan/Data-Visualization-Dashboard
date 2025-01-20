import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBvrSksJEZGN8rwHdWSJ7uevGtoJb-o6iI",
    authDomain: "data-visualization-dashb-3dvd.firebaseapp.com",
    projectId: "data-visualization-dashb-3dvd",
    storageBucket: "data-visualization-dashb-3dvd.firebasestorage.app",
    messagingSenderId: "1011553902018",
    appId: "1:1011553902018:web:15c36473b969bd3baa8a5b",
    measurementId: "G-761H9Q2NBT"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
