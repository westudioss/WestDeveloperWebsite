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
    }
}

async function loadPoints() {
  const userInfo = await getUserInfo();
  if (userInfo) {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    document.getElementsByClassName("styling")[0].id = userInfo.points001;
    setDoc(docRef, userInfo);
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
      let id = "";

      if (name == userInfo.username) {
          id = "highlight";
      }

      lb.push({

          n : name,
          p : points,
          ID : id,

      })

    });

    lb.sort(({p:a}, {p:b}) => b-a);

    let str = "<table><tr><th>#</th><th>Name</th><th>Points</th></tr>";
    for (let i=0; i < lb.length; i++) {
        str += "<tr" + " id=" + lb[i].ID + ">";
        str += "<td>" + (i+1) + "</td>";
        str += "<td>" + lb[i].n + "</td>";
        str += "<td>" + lb[i].p + "</td>";
        str += "</tr>";
    }
    str += "</table>";
    document.getElementById("list").innerHTML = str;

  } catch (error) {
    console.error("Error getting users:", error);
  }

}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        loadPoints();
		    logAllUsers();
    }   
});

document.getElementById("save").addEventListener('click', e => {
    savePoints();
    logAllUsers();
});