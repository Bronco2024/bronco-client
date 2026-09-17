import { doc, updateDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "@/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import {
  GOOGLE_POPUP_HANG_MS,
  shouldFallbackGooglePopupToRedirect,
  shouldPreferGoogleRedirect,
  isInAppBrowser,
  createInAppBrowserAuthError,
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
 * Google sign-in — skip OAuth inside in-app WebViews (Facebook etc.),
 * prefer redirect on mobile/Safari, otherwise popup with redirect fallback.
 * @returns {Promise<import('firebase/auth').UserCredential | null>}
 */
export const handleGoogleSignupAndSignIn = async () => {
  googleProvider.setCustomParameters({ prompt: "select_account" });

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const authDomain = auth?.config?.authDomain || "";

  // Google blocks OAuth inside Facebook/Instagram WebViews.
  if (isInAppBrowser(ua)) {
    throw createInAppBrowserAuthError();
  }

  if (shouldPreferGoogleRedirect(ua, { authDomain, hostname })) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }

  try {
    return await withPopupTimeout(
      signInWithPopup(auth, googleProvider),
      GOOGLE_POPUP_HANG_MS
    );
  } catch (error) {
    // Safari/WebKit sometimes throws a raw TypeError inside Firebase Auth.
    if (error instanceof TypeError && !error?.code) {
      error.code = "auth/network-request-failed";
    }
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
