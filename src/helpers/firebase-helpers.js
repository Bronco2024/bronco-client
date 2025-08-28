import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export const updateUserCart = async (uid, cartItems) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        cart: cartItems,
    });
};

export const handleGoogleSignupAndSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithRedirect(auth, provider);
    } catch (error) {
        console.error("Google signup error", error);
        throw error;
    }
}