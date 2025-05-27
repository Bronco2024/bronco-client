import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { clearCart, loadCart } from '@/redux/cartSlice';
import { useDispatch } from 'react-redux';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            //NEED TO REMOVE THE test@gmail.com BEFORE PRODUCTION
            if ((auth.currentUser?.emailVerified && user) || user?.email === "test@gmail.com") {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setCurrentUser({ uid: user.uid, ...userDoc.data() });

                    const rawCart = userDoc.data().cart || [];

                    // Convert Firestore Timestamps to ISO strings or Date objects
                    // This is for Redux Toolkit expects actions and state to be serializable.
                    // Firebase's Timestamp object (like availableUntil: Timestamp) is not serializable by default,
                    // so Redux warns you.
                    const cart = rawCart.map(item => ({
                        ...item,
                        availableUntil: item.availableUntil?.toDate?.() || null,
                        createdAt: item.createdAt?.toDate?.() || null,
                      }));

                    dispatch(loadCart(cart));
                } else {
                    await setDoc(doc(db, "users", user.uid), {
                        email: user.email,
                        subscribedUntil: null,
                        numberOfAds: 1
                    });
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setCurrentUser(null);
        dispatch(clearCart());
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
