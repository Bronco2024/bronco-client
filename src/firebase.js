// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "he";
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Analytics is heavy — load after first paint, only in the browser.
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  const bootAnalytics = () => {
    import("firebase/analytics")
      .then(({ getAnalytics, isSupported }) =>
        isSupported().then((ok) => {
          if (ok) getAnalytics(app);
        })
      )
      .catch(() => {});
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(bootAnalytics, { timeout: 4000 });
  } else {
    window.setTimeout(bootAnalytics, 2500);
  }
}

export { app, auth, db, storage, googleProvider };
