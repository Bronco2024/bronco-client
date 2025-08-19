import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut, reload } from 'firebase/auth';
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
      setLoading(true);
      try {
        if (!user) {
          setCurrentUser(null);
          dispatch(clearCart());
          return;
        }

        // Always force-refresh user & token (emailVerified might be stale)
        await reload(user);
        await user.getIdToken(true);

        if (!user.emailVerified) {
          setCurrentUser(null);
          dispatch(clearCart());
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          const defaultProfile = {
            email: user.email,
            subscribedUntil: null,
            /**
             * PAYMENTS
             * Change to 1 when payments return
             */
            numberOfAds: Number.MAX_VALUE,
            cart: []
          };
          await setDoc(userRef, defaultProfile);

          // ✅ IMPORTANT: set currentUser even when we just created the doc
          setCurrentUser({ uid: user.uid, ...defaultProfile });
          dispatch(loadCart([]));
        } else {
          const data = snap.data();
          const rawCart = data.cart || [];
          const cart = rawCart.map(item => ({
            ...item,
            availableUntil: item.availableUntil?.toDate?.() || null,
            createdAt: item.createdAt?.toDate?.() || null,
          }));
          setCurrentUser({ uid: user.uid, ...data });
          dispatch(loadCart(cart));
        }
      } catch (e) {
        // Fallback: keep user signed out on error
        setCurrentUser(null);
        dispatch(clearCart());
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

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
