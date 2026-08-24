import { doc, updateDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "@/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import {
  GOOGLE_POPUP_HANG_MS,
  shouldPreferGoogleRedirect,
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
 * Google sign-in.
 * Prefer redirect on mobile/Safari (reliable). On desktop Chrome try popup,
 * but fall back to redirect if the popup is blocked OR hangs (Chrome COOP).
 * @returns {Promise<import('firebase/auth').UserCredential | null>}
 *   credential from popup, or null when redirect was started
 */
export const handleGoogleSignupAndSignIn = async () => {
  googleProvider.setCustomParameters({ prompt: "select_account" });

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  if (shouldPreferGoogleRedirect(ua)) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }

  try {
    return await withPopupTimeout(
      signInWithPopup(auth, googleProvider),
      GOOGLE_POPUP_HANG_MS
    );
  } catch (error) {
    if (shouldFallbackGooglePopupToRedirect(error?.code)) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    if (error?.code === "auth/popup-closed-by-user") {
      throw error;
    }
    console.error("Google signup error", error);
    throw error;
  }
};
