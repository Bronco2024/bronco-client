import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut, reload } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { clearCart, loadCart } from '@/redux/cartSlice';
import { useDispatch } from 'react-redux';
import { isSiteAdminEmail } from '@/helpers/site-admin';

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

        const signedInWithGoogle = user.providerData?.some(
          (p) => p.providerId === "google.com"
        );
        // Google accounts are trusted; email/password still requires verification.
        if (!user.emailVerified && !signedInWithGoogle) {
          setCurrentUser(null);
          dispatch(clearCart());
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        const siteAdmin = isSiteAdminEmail(user.email);

        if (!snap.exists()) {
          const defaultProfile = {
            email: user.email,
            subscribedUntil: null,
            /**
             * PAYMENTS
             * Change to 1 when payments return
             */
            numberOfAds: Number.MAX_VALUE,
            cart: [],
            isAdmin: siteAdmin,
          };
          await setDoc(userRef, defaultProfile);

          setCurrentUser({ uid: user.uid, ...defaultProfile });
          dispatch(loadCart([]));
        } else {
          const data = snap.data();
          if (siteAdmin && !data.isAdmin) {
            await setDoc(userRef, { isAdmin: true, email: user.email }, { merge: true });
          }
          const rawCart = data.cart || [];
          const cart = rawCart.map(item => ({
            ...item,
            availableUntil: item.availableUntil?.toDate?.() || null,
            createdAt: item.createdAt?.toDate?.() || null,
          }));
          setCurrentUser({
            uid: user.uid,
            ...data,
            isAdmin: Boolean(data.isAdmin) || siteAdmin,
          });
          dispatch(loadCart(cart));
        }
      } catch (e) {
        console.error("AuthProvider profile load failed", e);
        // Auth succeeded but profile read/write failed — keep a minimal session
        // so Google / email login is not stuck as "signed out".
        if (user?.emailVerified) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            subscribedUntil: null,
            numberOfAds: Number.MAX_VALUE,
            cart: [],
            isAdmin: isSiteAdminEmail(user.email),
          });
          dispatch(loadCart([]));
        } else {
          setCurrentUser(null);
          dispatch(clearCart());
        }
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
