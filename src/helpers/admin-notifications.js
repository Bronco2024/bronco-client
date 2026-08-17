import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  ADMIN_NOTIFICATION_TYPES,
  getNotificationTitle,
} from "@/helpers/admin-notification-helpers";

export {
  ADMIN_NOTIFICATION_TYPES,
  getNotificationTitle,
  shouldNotifyAdminForAd,
} from "@/helpers/admin-notification-helpers";

export const createPendingAdNotification = async ({ adId, ad }) => {
  if (!adId || !ad) return;

  await addDoc(collection(db, "adminNotifications"), {
    type: ADMIN_NOTIFICATION_TYPES.PENDING_AD,
    adId,
    title: getNotificationTitle(ad),
    category: ad.category || "",
    location: ad.location || "",
    read: false,
    createdAt: new Date(),
  });
};

export const markAdNotificationsRead = async (adId) => {
  if (!adId) return;

  const notificationsRef = collection(db, "adminNotifications");
  const unreadQuery = query(
    notificationsRef,
    where("adId", "==", adId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(unreadQuery);
  const updates = snapshot.docs.map((docSnap) =>
    updateDoc(docSnap.ref, {
      read: true,
      readAt: new Date(),
    })
  );

  await Promise.all(updates);
};

export const fetchUnreadAdminNotifications = async (limitCount = 20) => {
  const notificationsRef = collection(db, "adminNotifications");
  const recentQuery = query(
    notificationsRef,
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(recentQuery);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
    .filter((notification) => !notification.read);
};
