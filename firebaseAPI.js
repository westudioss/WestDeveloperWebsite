// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

function showMessage(message) {
  let messageElement = document.getElementById('authMessage');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.id = 'authMessage';
    messageElement.style.padding = '10px';
    messageElement.style.marginTop = '10px';
    messageElement.style.borderRadius = '4px';
    messageElement.style.textAlign = 'center';
    messageElement.style.transition = 'opacity 0.5s ease';
    const form = document.getElementById('authForm');
    form.after(messageElement);
  }
  
  messageElement.style.display = 'block';
  messageElement.style.backgroundColor = '#f8d7da';
  messageElement.style.color = '#721c24';
  messageElement.innerHTML = message;
  messageElement.style.opacity = 1;
  
}

// Handle form submission
function handleAuth(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const isSignUp = document.getElementById('authTitle').textContent === 'Sign Up';
  
  if (isSignUp) {
    // Check if username field exists and has value
    const usernameField = document.getElementById('username');
    if (!usernameField || !usernameField.value) {
      showMessage('Username is required');
      return;
    }
    
    const username = usernameField.value;
    
    // Create account
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Account created successfully
        const user = userCredential.user;

        sendEmailVerification(user);
        
        // Create user profile in Firestore
        const userData = {
          email: email,
          username: username,
          createdAt: new Date().toISOString(),
          picture : "data:image/png;base64,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",
          points001 : "0",
          points002 : "0",
        };
        
        // Save to Firestore
        const docRef = doc(db, "users", user.uid);
        return setDoc(docRef, userData);
      })
      .then(() => {
        showMessage('Account Created Successfully, Verify email sent to you or your account will be deleted');
        
        // Store user ID
        localStorage.setItem('loggedInUserId', auth.currentUser.uid);
        
        // Redirect after short delay
        setTimeout(() => {
          //window.location.href = 'index.html';
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email Address Already Exists!');
        } else if (errorCode === 'auth/weak-password') {
          showMessage('Password is too weak. Please use at least 6 characters.');
        } else {
          showMessage('Error: ' + error.message);
        }
      });
  } else {
    // Sign in
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage('Login successful!');
        
        // Store user ID
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = 'index.html';
 
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
          showMessage('Incorrect Email or Password');
        } else if (errorCode === 'auth/user-not-found') {
          showMessage('Account does not exist');
        } else {
          showMessage('Error: ' + error.message);
        }
      });
  }
}

// Toggle between signup and login forms
function toggleAuthMode() {
  const authTitle = document.getElementById('authTitle');
  const authBtn = document.getElementById('authBtn');
  const toggleText = document.querySelector('.switch-prompt');
  const toggleLink = document.getElementById('toggleAuth');
  
  const isCurrentlySignUp = authTitle.textContent === 'Sign Up';
  
  // Toggle form title and button text
  authTitle.textContent = isCurrentlySignUp ? 'Login' : 'Sign Up';
  authBtn.textContent = isCurrentlySignUp ? 'Login' : 'Sign Up';
  
  // Toggle the prompt text and link
  toggleText.innerHTML = isCurrentlySignUp ? 
    'Don\'t have an account? <a href="#" id="toggleAuth">Sign Up</a>' : 
    'Already have an account? <a href="#" id="toggleAuth">Login</a>';
  
  // Re-attach event listener to the new toggleAuth link
  document.getElementById('toggleAuth').addEventListener('click', function(e) {
    e.preventDefault();
    toggleAuthMode();
  });
  
  // Handle username field
  let usernameField = document.getElementById('username');
  
  if (!isCurrentlySignUp) {
    // Switching to Sign Up - add username field if it doesn't exist
    if (!usernameField) {
      const inputGroup = document.createElement('div');
      inputGroup.className = 'input-group';
      
      usernameField = document.createElement('input');
      usernameField.type = 'text';
      usernameField.id = 'username';
      usernameField.placeholder = 'Username';
      usernameField.required = true;
      
      inputGroup.appendChild(usernameField);
      
      // Insert after email field
      const emailGroup = document.getElementById('email').parentNode;
      emailGroup.after(inputGroup);
    }
  } else {
    // Switching to Login - remove username field if it exists
    if (usernameField) {
      usernameField.parentNode.remove();
    }
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up form submission handler
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', handleAuth);
  }
  
  // Set up toggle between signup and login
  const toggleAuth = document.getElementById('toggleAuth');
  if (toggleAuth) {
    toggleAuth.addEventListener('click', function(e) {
      e.preventDefault();
      toggleAuthMode();
    });
  }
  
  // Make sure we start in signup mode with username field
  toggleAuthMode(); // This will switch to login
  toggleAuthMode(); // This will switch back to signup
});