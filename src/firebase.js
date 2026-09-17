// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { resolveFirebaseAuthDomain } from "@/helpers/firebase-auth-domain";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // On petzo.co.il this resolves to petzo.co.il (same-site OAuth for Safari).
  // Requires Google Cloud redirect URI: https://petzo.co.il/__/auth/handler
  // Localhost keeps bronco-65aaf.firebaseapp.com unless env overrides.
  authDomain: resolveFirebaseAuthDomain({
    envAuthDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    hostname: typeof window !== "undefined" ? window.location.hostname : "",
  }),
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

/**
 * Safari / WebKit needs an explicit popup/redirect resolver + persistence.
 * Plain getAuth() can throw TypeError inside Firebase during Google sign-in
 * when the resolver/persistence graph is incomplete.
 */
const createAuth = () => {
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch (_error) {
    return getAuth(app);
  }
};

const auth = createAuth();
auth.languageCode = "he";
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("email");
googleProvider.addScope("profile");

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
