import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const updateUserCart = async (uid, cartItems) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        cart: cartItems,
    });
};

