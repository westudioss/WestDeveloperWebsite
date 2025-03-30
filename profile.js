import { auth, db } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {   collection,   getDocs,   doc,   getDoc,   setDoc,   updateDoc, onSnapshot, } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";  

const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

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

async function savePicture(canvasUrl) {
    const userInfo = await getUserInfo();
    if (userInfo) {
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      userInfo.picture = canvasUrl;
      setDoc(docRef, userInfo);
    }
}

async function saveName() {
  const userInfo = await getUserInfo();
  if (userInfo) {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    userInfo.username = document.getElementById("name").value;
    setDoc(docRef, userInfo);

    document.getElementById("namediv").innerHTML = "<div id='nametext'></div>";

    displayInfo();
  }
}

async function loadPicture() {
    const userInfo = await getUserInfo();
    if (userInfo) {
      const user = auth.currentUser;
      
      const c = document.getElementById("picture").getContext("2d");
      const img = new Image();

      img.addEventListener("load", () => {
        c.drawImage(img, 0, 0, 256, 256);
      });
      
      img.src = userInfo.picture;

    }
}

async function displayInfo() {
  const userInfo = await getUserInfo();
   
  if (userInfo) {
      let str = userInfo.username;

      document.getElementById("nametext").innerHTML = str;

      str = "<ul>";
      str += "<li>Member since: " + userInfo.createdAt.substring(0,10) + "</li><br>";
      str += "<li>CtB points  : " + userInfo.points001 + "</li>";

      document.getElementById("stattext").innerHTML = str;
  }
}

document.getElementById("edit-name").addEventListener('click', e => {
    const btn = document.getElementById("edit-name");

    if (btn.innerText == "Edit") {
        document.getElementById("namediv").innerHTML = "<input type='text' id='name' value=" + document.getElementById("nametext").innerText + ">";
        
        btn.innerText = "Save";
    } else {
      saveName();

      btn.innerText = "Edit";
    }
});

document.getElementById("edit-prof").addEventListener('click', e => {
  const btn = document.getElementById("edit-prof");

  if (btn.innerText == "Edit") {
      btn.innerText = "Save";
  } else {
      btn.innerText = "Edit";
  }
});

onAuthStateChanged(auth, async (user) => {     
  if (user) {             
    loadPicture();  
    displayInfo();    
  }   
});  

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = 128;
canvas.height = 128;

document.getElementById('picture').width = 256;
document.getElementById('picture').height = 256;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        let canvasUrl = canvas.toDataURL();
        console.log(canvasUrl);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (e.target.id === 'save-btn') {
        let canvasUrl = canvas.toDataURL();

        savePicture(canvasUrl);
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - 460);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);
