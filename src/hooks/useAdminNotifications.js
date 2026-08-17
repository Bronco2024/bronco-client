import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";

const useAdminNotifications = (enabled = false, limitCount = 20) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(Boolean(enabled));

  useEffect(() => {
    if (!enabled) {
      setNotifications([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const notificationsRef = collection(db, "adminNotifications");
    const recentQuery = query(
      notificationsRef,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      recentQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .filter((notification) => !notification.read);

        setNotifications(items);
        setLoading(false);
      },
      () => {
        setNotifications([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [enabled, limitCount]);

  return {
    notifications,
    unreadCount: notifications.length,
    loading,
  };
};

export default useAdminNotifications;
