import { doc, updateDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "@/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import {
  GOOGLE_POPUP_HANG_MS,
  shouldFallbackGooglePopupToRedirect,
} from "./google-auth-strategy";

export const updateUserCart = async (uid, cartItems) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    cart: cartItems,
  });
};

const withPopupTimeout = (promise, ms) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error("Google popup timed out");
      err.code = "auth/popup-blocked";
      reject(err);
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });

/**
 * Google sign-in — popup first (OAuth stays on *.firebaseapp.com so no
 * redirect_uri_mismatch on petzo.co.il), then full-page redirect fallback.
 * @returns {Promise<import('firebase/auth').UserCredential | null>}
 */
export const handleGoogleSignupAndSignIn = async () => {
  googleProvider.setCustomParameters({ prompt: "select_account" });

  try {
    return await withPopupTimeout(
      signInWithPopup(auth, googleProvider),
      GOOGLE_POPUP_HANG_MS
    );
  } catch (error) {
    if (
      shouldFallbackGooglePopupToRedirect(error?.code) ||
      error?.code === "auth/popup-blocked"
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    // On mobile, popup is often blocked without a clean error code.
    if (
      error?.code !== "auth/popup-closed-by-user" &&
      error?.code !== "auth/cancelled-popup-request"
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError) {
        console.error("Google redirect error", redirectError);
        throw redirectError;
      }
    }
    if (error?.code === "auth/popup-closed-by-user") {
      throw error;
    }
    console.error("Google signup error", error);
    throw error;
  }
};
