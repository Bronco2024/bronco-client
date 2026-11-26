import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { clearCart, loadCart } from '@/redux/cartSlice';
import { useDispatch } from 'react-redux';
import { isSiteAdminEmail } from '@/helpers/site-admin';
import { stashGoogleRedirectError } from '@/helpers/google-auth-strategy';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    // Complete Google redirect once app-wide (Login/Register navigate via currentUser).
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          try {
            sessionStorage.removeItem("petzo_google_auth_error");
          } catch (_error) {
            // ignore
          }
        }
      })
      .catch((error) => {
        // Safari can throw TypeError (not FirebaseError) inside the auth SDK.
        const code =
          error?.code ||
          (error instanceof TypeError ? "auth/network-request-failed" : "auth/unknown");
        console.warn("Google redirect result:", code, error);
        stashGoogleRedirectError(code);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return;

      if (!user) {
        setCurrentUser(null);
        dispatch(clearCart());
        setLoading(false);
        return;
      }

      // Skip forced reload()/getIdToken(true) on every page — that added
      // multi-second delay. Auth state already carries emailVerified.
      const signedInWithGoogle = user.providerData?.some(
        (p) => p.providerId === "google.com"
      );
      // Google accounts are trusted; email/password still requires verification.
      if (!user.emailVerified && !signedInWithGoogle) {
        setCurrentUser(null);
        dispatch(clearCart());
        setLoading(false);
        return;
      }

      const siteAdmin = isSiteAdminEmail(user.email);
      const minimalSession = {
        uid: user.uid,
        email: user.email,
        subscribedUntil: null,
        numberOfAds: Number.MAX_VALUE,
        cart: [],
        isAdmin: siteAdmin,
      };

      // Unblock ProtectedRoute immediately — hydrate Firestore profile after.
      setCurrentUser((prev) =>
        prev?.uid === user.uid ? prev : minimalSession
      );
      setLoading(false);

      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (cancelled) return;

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
          // Don't block UI on first-time profile create.
          void setDoc(userRef, defaultProfile).catch((error) => {
            console.warn("Failed to create user profile", error);
          });
          setCurrentUser({ uid: user.uid, ...defaultProfile });
          dispatch(loadCart([]));
        } else {
          const data = snap.data();
          if (siteAdmin && !data.isAdmin) {
            void setDoc(userRef, { isAdmin: true, email: user.email }, { merge: true })
              .catch((error) => {
                console.warn("Failed to mark site admin", error);
              });
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
        // Auth succeeded but profile read/write failed — keep minimal session.
        setCurrentUser((prev) => prev?.uid === user.uid ? prev : minimalSession);
        dispatch(loadCart([]));
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
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
