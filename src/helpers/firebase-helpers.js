import { doc, updateDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "@/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";

export const updateUserCart = async (uid, cartItems) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    cart: cartItems,
  });
};

/**
 * Google sign-in: prefer popup (reliable on Netlify SPA),
 * fall back to redirect if the popup is blocked.
 * @returns {Promise<import('firebase/auth').UserCredential | null>}
 *   credential from popup, or null when redirect was started
 */
export const handleGoogleSignupAndSignIn = async () => {
  googleProvider.setCustomParameters({ prompt: "select_account" });

  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    if (error?.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    console.error("Google signup error", error);
    throw error;
  }
};
