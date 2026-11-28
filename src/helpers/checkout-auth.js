import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";

/**
 * Guests can checkout without registering.
 * Uses Firebase anonymous auth so Firestore order writes still have a uid
 * (and online Grow payment can verify the buyer).
 */
export const ensureCheckoutUser = async () => {
  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
};
