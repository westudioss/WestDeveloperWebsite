import { auth, db } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {   collection,   getDocs,   doc,   getDoc,   setDoc,   updateDoc, onSnapshot, } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

async function savePoints() {
    const userInfo = await getUserInfo();
    if (userInfo) {
      const points = document.getElementsByClassName("styling")[0].id;
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      userInfo.points001 = points;
      setDoc(docRef, userInfo);
      document.getElementsByClassName("stylingCode")[0].id = "0";
      document.getElementsByClassName("styling")[0].id = 0;
    }
}

async function loadPoints() {
  const userInfo = await getUserInfo();
  if (userInfo) {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    document.getElementsByClassName("styling")[0].id = userInfo.points001;
    setDoc(docRef, userInfo);
    document.getElementsByClassName("load2")[0].id = 1;
  }
}

async function logAllUsers() {
  try {
    const userInfo = await getUserInfo();
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    let lb = [];
    
    querySnapshot.forEach((doc) => {
      let user = doc.data();
      let name = user.username;
      let points = user.points001;
      let pic = user.picture;
      let id = "";

      if (name == userInfo.username) {
          id = "highlight";
      }

      lb.push({

          n : name,
          p : points,
          ID : id,
          pc : pic,

      })

    });

    lb.sort(({p:a}, {p:b}) => b-a);

    let str = `<table><tr><th>#</th><th>Name</th><th>Points</th></tr>`;
    for (let i=0; i < lb.length; i++) {
        str += `<tr id="${lb[i].ID}">
        <td>${(i+1)}</td>
        <td><div id="picturediv"><canvas class="picture" id="${lb[i].pc}"></canvas></div><span>‎ ${lb[i].n}</span></td>
        <td>${lb[i].p}</td>
        </tr>`;
    }
    str += `</table>`;
    document.getElementById("list").innerHTML = str;

    renderImages();

  } catch (error) {
    console.error("Error getting users:", error);
  }
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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        loadPoints();
		    logAllUsers();
    }   
});

//document.getElementById("save").addEventListener('click', e => {
//    savePoints();
//    logAllUsers();
//});

function saveData() {
    if (document.getElementsByClassName("stylingCode")[0].id == "723459324592345769234867893486759302768975298765927569039285685760987509867") {
        savePoints();
        logAllUsers();
    } else {
        document.getElementsByClassName("stylingCode")[0].id = "0";
        document.getElementsByClassName("styling")[0].id = 0;
    }
}

setInterval(saveData, 500);