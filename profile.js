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

async function loadPicture() {
    const userInfo = await getUserInfo();
    if (userInfo) {
      const user = auth.currentUser;
      
      const c = document.getElementById("picture").getContext("2d");
      const img = new Image();

      img.addEventListener("load", () => {
        c.drawImage(img, 0, 0);
      });
      
      img.src = userInfo.picture;

    }
}

onAuthStateChanged(auth, async (user) => {     
  if (user) {             
    loadPicture();      
  }   
});  

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = 128;
canvas.height = 128;

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

    if (e.target.id === 'save') {
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
