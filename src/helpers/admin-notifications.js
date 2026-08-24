import {
  addDoc,
  collection,
  deleteDoc,
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
  getOrphanAdminNotifications,
} from "@/helpers/admin-notification-helpers";
import { sendPendingAdEmailToAdmin } from "@/helpers/admin-email";

export {
  ADMIN_NOTIFICATION_TYPES,
  getNotificationTitle,
  shouldNotifyAdminForAd,
  getOrphanAdminNotifications,
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

  try {
    await sendPendingAdEmailToAdmin({ adId, ad });
  } catch (error) {
    console.warn("Failed to send pending ad email to admin", error);
  }
};

const markNotificationDocs = async (snapshot) => {
  await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      try {
        await deleteDoc(docSnap.ref);
      } catch {
        await updateDoc(docSnap.ref, {
          read: true,
          readAt: new Date(),
          adMissing: true,
        }).catch(() => null);
      }
    })
  );
};

export const dismissAdminNotificationsForAd = async (adId) => {
  if (!adId) return;

  const notificationsRef = collection(db, "adminNotifications");
  const relatedQuery = query(notificationsRef, where("adId", "==", adId));
  const snapshot = await getDocs(relatedQuery);
  await markNotificationDocs(snapshot);
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

export const cleanupOrphanAdminNotifications = async (
  notifications = [],
  ads = []
) => {
  const orphans = getOrphanAdminNotifications(notifications, ads);
  await Promise.all(
    orphans.map((notification) =>
      dismissAdminNotificationsForAd(notification.adId).catch(() => null)
    )
  );
  return orphans;
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
