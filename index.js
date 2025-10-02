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

var tobuSongs = [
  {
    name : "./songs/Tobu-Hope.mp3",
    desc : "Tobu - Hope"
  },
  {
    name : "./songs/Tobu-Mesmerize.mp3",
    desc : "Tobu - Mesmerize"
  },
  {
    name : "./songs/Tobu-SweetStory.mp3",
    desc : "Tobu - Sweet Story"
  },
  {
    name : "./songs/Tobu-Cloud9.mp3",
    desc : "Tobu - Cloud 9"
  },
  {
    name : "./songs/Tobu-Cool.mp3",
    desc : "Tobu - Cool"
  },
  {
    name : "./songs/Tobu-Rollercoaster.mp3",
    desc : "Tobu - Rollercoaster"
  },
  {
    name : "./songs/Tobu-Roots.mp3",
    desc : "Tobu - Roots"
  },
  {
    name : "./songs/Tobu-Sunburst.mp3",
    desc : "Tobu - Sunburst"
  },
]

var prevSong = 0;
document.getElementById("song-generate").addEventListener("click", () => {
  var audio = document.getElementById("tobuSong");
  audio.src = "";

  var ran = 0;
  do {
    ran = Math.floor(Math.random() * tobuSongs.length);
  } while (ran == prevSong)

  var song = tobuSongs[ran];
  prevSong = ran;

  audio.src = song.name;
  document.getElementById("songText").innerHTML = `<p>Random Tobu Song Generator<br><p id="animated-rainbow">Now playing: ${song.desc}</p></p>`;

  audio.play();
});

document.getElementById("song-play").addEventListener("click", () => {
  var song = document.getElementById("tobuSong");
  song.play();
});

document.getElementById("song-pause").addEventListener("click", () => {
  var song = document.getElementById("tobuSong");
  song.pause();
});

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