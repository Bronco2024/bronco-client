import { doc, updateDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "@/firebase";
import { signInWithRedirect } from "firebase/auth";

export const updateUserCart = async (uid, cartItems) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        cart: cartItems,
    });
};

export const handleGoogleSignupAndSignIn = async () => {
    try {
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        console.error("Google signup error", error);
        throw error;
    }
}