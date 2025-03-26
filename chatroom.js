import { auth, db } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Function to get the user info from the database
async function getUserInfo() {
  const user = auth.currentUser;
  
  if (!user) {
    console.log("User not authenticated");
    return null;
  }

  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
}

// Function to create a post
async function createPost() {
  try {
    const userInfo = await getUserInfo();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.replace(/[<>]/g, '').trim();

    if (!message) return; // Prevent empty posts

    if (userInfo) {
      const date = new Date();
      await addDoc(collection(db, "posts"), {
        username: userInfo.username,
        profPic: userInfo.picture,
        text: message,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        time: date.getTime(),
      });
    }

    messageInput.value = ""; // Clear input after posting
  } catch(error) {
    console.error("Error creating post:", error);
  }
}

// Function to render posts
function renderPosts(posts) {
  const postsContainer = document.getElementById("all-posts");
  
  // Sort posts by time in descending order
  posts.sort(({time:a}, {time:b}) => b-a);

  const postsHTML = posts.map(post => `
    <div class="post-container">
      <table>
        <tr>
          <td id="float-left"><div id="picturediv"><canvas class="picture" id="${post.profPic}"></canvas></div></td>
          <td id="post-name">${post.username}</td>
          <td id="post-date">${post.year}/${post.month}/${post.day}</td>
        </tr>
      </table>
      <br>
      <p>${post.text}</p>
    </div>
  `).join('');

  postsContainer.innerHTML = postsHTML;
}

function renderImages() {
    var pics = document.getElementsByClassName("picture");

    for(var i = 0; i < pics.length; i++) {
      const c = pics[i].getContext("2d");
      const img = new Image();

      img.addEventListener("load", () => {
        c.drawImage(img, 0, 0, 64, 64);
      });
      
      img.src = pics[i].id;
  }
}

// Real-time listener for posts
function setupPostsListener() {
  const postsQuery = query(collection(db, "posts"), orderBy('time', 'desc'));
  
  onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderPosts(posts);
    renderImages();
  });
}

// Authentication state change listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userInfo = await getUserInfo();
    if (userInfo) {
      setupPostsListener(); // Start listening for real-time updates
    }
  }
});

// Event listener for send button
document.getElementById("send-btn").addEventListener("click", () => {
  const messageInput = document.getElementById('message');
  if (messageInput.value.trim() !== "") {
    createPost();
  }
});