// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
import { resolveFirebaseAuthDomain } from "@/helpers/firebase-auth-domain";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // Must match an Authorized redirect URI on the Google OAuth web client.
    // Default: bronco-65aaf.firebaseapp.com (Firebase-managed).
    // Only set REACT_APP_FIREBASE_AUTH_DOMAIN=petzo.co.il AFTER adding
    // https://petzo.co.il/__/auth/handler in Google Cloud credentials.
    authDomain: resolveFirebaseAuthDomain({
      envAuthDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    }),
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = "he";
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("email");
googleProvider.addScope("profile");

export { app, auth, db, storage, googleProvider};
