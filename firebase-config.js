// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA88Ou6nrI1evST0qi-JoxGwEfDpt-e66c",
  authDomain: "westdevwebsite.firebaseapp.com",
  projectId: "westdevwebsite",
  storageBucket: "westdevwebsite.firebasestorage.app",
  messagingSenderId: "64717714929",
  appId: "1:64717714929:web:801b54671eb01f788c8050",
  measurementId: "G-KJ1G8XP8GJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the Firebase services
export { app, auth, db };