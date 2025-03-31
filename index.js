import { auth, db } from "/firebase-config.js";
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

async function displayUsername() {
    const userInfo = await getUserInfo(); 
     
    if (userInfo) {
        let str = "<p>Welcome " + userInfo.username + "</p>";

        document.getElementById("welcometext").innerHTML = str;
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
    displayUsername();  
    loadPicture();    
  }   
});

async function addVariable() {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    let lb = [];
    
    querySnapshot.forEach( async (document) => {
      
    const docRef = doc(db, "users", document.id);

    await updateDoc(docRef, {
        points002: "0"
    });

    });
  } catch (error) {
    console.error("Error getting users:", error);
  }

}
//addVariable();