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
  apiKey: "AIzaSyA6_yXQbkbcgHQCLnhKSKmtaBltCrxRr8I",
  authDomain: "bronco-testing.firebaseapp.com",
  projectId: "bronco-testing",
  storageBucket: "bronco-testing.firebasestorage.app",
  messagingSenderId: "92996437306",
  appId: "1:92996437306:web:383a44092081cc1f6bbc03",
  measurementId: "G-15XNYDBNNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };