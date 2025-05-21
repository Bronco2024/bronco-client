// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBGnw-nPU2Co-Mb17bmmYwgJly05czunug",
    authDomain: "bronco-65aaf.firebaseapp.com",
    projectId: "bronco-65aaf",
    storageBucket: "bronco-65aaf.appspot.com",
    messagingSenderId: "317603302387",
    appId: "1:317603302387:web:2525316aaf18e677936086",
    measurementId: "G-SNSKQ3MYND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage};


/**
 * firebase storage rules
 * 
 * rules_version = '2';

        service firebase.storage {
        match /b/{bucket}/o {
            match /sponsors {
            allow read: if true;
            allow write: if firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
            }
            
            match /{adsCollection} {
            allow read: if true;
            allow write: if request.auth != null && 
                    adsCollection.matches("^ads-.*") &&
                    firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.numberOfAds > 0;
            }
            
        }
        }
 * 
 * 
 */