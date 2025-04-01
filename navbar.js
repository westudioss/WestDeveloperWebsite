import { auth, db } from "/firebase-config.js";
import { onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {   collection,   getDocs,   doc,   getDoc,   setDoc,   updateDoc, onSnapshot, deleteDoc,} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let str = "";
let arr = [

    {
        ref : 'onlinegames.html',
        img : "./imgs/joystick.png",
        name : 'Online Games'
    },
    {
        ref : 'publishedgames.html',
        img : "./imgs/gamefolder.png",
        name : 'Published Games'
    },
    {
        ref : 'https://discord.gg/HrH8CsvMwK',
        img : "./imgs/discord.png",
        name : 'Discord'
    },
    {
        ref : 'index.html',
        img : "./imgs/home.png",
        name : 'Home'
    },
    {
        ref : 'chatroom.html',
        img : "./imgs/chat.png",
        name : 'Chatroom'
    },
    {
        ref : 'login.html',
        img : "./imgs/enter.png",
        name : 'Login'
    },
    {
        ref : 'profile.html',
        img : "./imgs/user.png",
        name : 'Profile'
    },

]

for (var i = 0; i < arr.length; i++) {

    str += "<a class='navdiv' href=" + arr[i].ref + "><div>";
    str += "<input type='image' class='navlogo' src=" + arr[i].img + ">";
    str += "<p class='navtext'>" + arr[i].name + "</p></div></a>";

}

document.getElementById("nav").innerHTML = str;

async function deleteCurUser() {
  const user = auth.currentUser;
  console.log("deleting user");

  const userDocRef = doc(db, "users", user.uid);
  await deleteDoc(userDocRef);
  
  setTimeout(deleteUser(user), 5000);
}

async function getUserInfo() {
    const user = auth.currentUser;
    try {       
      const userDocRef = doc(db, "users", user.uid);             
      const userDoc = await getDoc(userDocRef);        
      if (userDoc.exists()) {         
        return (userDoc.data())        
      } else {         
        console.log("User document not found");         
        return null;       
      }     
    } catch (error) {       
      console.error("Error getting user info:", error);
      return null;     
    }   
  }
  
  async function displayUsername() {
      const userInfo = await getUserInfo(); 
       
      if (userInfo) {
          let str = "<p>" + userInfo.username + "</p>";
  
          document.getElementById("profile-text").innerHTML = str;
      }
  }
  
  async function loadPicture() {
      const userInfo = await getUserInfo();
      if (userInfo) {
        const user = auth.currentUser;
        
        const c = document.getElementById("profile-picture").getContext("2d");
        const img = new Image();
  
        img.addEventListener("load", () => {
          c.drawImage(img, 0, 0, 96, 96);
        });
        
        img.src = userInfo.picture;
  
      }
  }

  async function checkUserVerified() {
      const user = auth.currentUser;
      var path = window.location.pathname;
      var page = path.split("/").pop();

      if (page != "login.html")
        if (user.emailVerified) {
          
        } else {
          deleteCurUser();
        }
  }
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let str2 = "<a href='profile.html' style='color: white'><div id='prof-div'><canvas id='profile-picture'></canvas></div><div id='profile-text'></div></a>";

      document.getElementById("profile").innerHTML = str2;
      
      displayUsername();  
      loadPicture();
      checkUserVerified();
    }   
  });