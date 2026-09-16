import { doc, updateDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "@/firebase";
import { signInWithRedirect } from "firebase/auth";

export const updateUserCart = async (uid, cartItems) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    cart: cartItems,
  });
};

/**
 * Google sign-in via full-page redirect (most reliable on mobile + desktop).
 * Popup is avoided: third-party cookie / COOP issues often hang "מתחבר…".
 * @returns {Promise<null>} always null — caller waits for redirect return
 */
export const handleGoogleSignupAndSignIn = async () => {
  googleProvider.setCustomParameters({ prompt: "select_account" });
  await signInWithRedirect(auth, googleProvider);
  return null;
};
