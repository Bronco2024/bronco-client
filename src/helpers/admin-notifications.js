import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
import {
  sendPendingAdEmailToAdmin,
  sendStoreOrderEmailToAdmin,
  sendBuyerOrderEmailClient,
} from "@/helpers/admin-email";
import { getOrderNotificationTitle } from "@/helpers/store-order-emails";

const markClientOrderEmails = async (orderId, meta) => {
  try {
    await updateDoc(doc(db, "purchases", String(orderId)), {
      orderEmailsClientAt: new Date(),
      orderEmailsClientMeta: meta,
    });
  } catch (error) {
    console.warn("Failed to mark client order emails", error);
  }
};

export {
  ADMIN_NOTIFICATION_TYPES,
  getNotificationTitle,
  shouldNotifyAdminForAd,
  getOrphanAdminNotifications,
  isStoreOrderNotification,
} from "@/helpers/admin-notification-helpers";

export const createPendingAdNotification = async ({ adId, ad }) => {
  if (!adId || !ad) return;

  // Fast path for the publisher: only wait on the in-app admin inbox write.
  await addDoc(collection(db, "adminNotifications"), {
    type: ADMIN_NOTIFICATION_TYPES.PENDING_AD,
    adId,
    title: getNotificationTitle(ad),
    category: ad.category || "",
    location: ad.location || "",
    read: false,
    createdAt: new Date(),
  });

  // Email (EmailJS / FormSubmit) can take seconds — never block publish/update UI.
  void sendPendingAdEmailToAdmin({ adId, ad }).catch((error) => {
    console.warn("Failed to send pending ad email to admin", error);
  });
};

/**
 * Client-side admin alert for a new store order (inbox + FormSubmit).
 * Complements Netlify SMTP buyer/admin mail — so admin still sees the order
 * even when SMTP_PASS is missing. Idempotent per orderId.
 * Awaits email sends so checkout navigation does not abort them.
 */
export const createStoreOrderNotification = async ({ orderId, order = {} }) => {
  if (!orderId) return { inbox: false, adminSent: false, buyerSent: false };

  const notificationsRef = collection(db, "adminNotifications");
  const existing = await getDocs(
    query(notificationsRef, where("orderId", "==", String(orderId)), limit(1))
  );

  let inbox = !existing.empty;
  if (!inbox) {
    await addDoc(notificationsRef, {
      type: ADMIN_NOTIFICATION_TYPES.STORE_ORDER,
      orderId: String(orderId),
      title: getOrderNotificationTitle(order),
      category: "חנות",
      location: order.contactDetails?.city || "",
      totalPrice: Number(order.totalPrice) || 0,
      paymentMethod: order.paymentMethod || "",
      read: false,
      createdAt: new Date(),
    });
    inbox = true;
  }

  // Await both channels — fire-and-forget was aborted on thank-you navigation.
  const [adminResult, buyerResult] = await Promise.allSettled([
    sendStoreOrderEmailToAdmin({ orderId, order }),
    sendBuyerOrderEmailClient({ orderId, order }),
  ]);

  const adminSent =
    adminResult.status === "fulfilled" && Boolean(adminResult.value);
  const buyerSent =
    buyerResult.status === "fulfilled" && Boolean(buyerResult.value);

  if (adminResult.status === "rejected") {
    console.warn("Store order admin email failed", adminResult.reason);
  }
  if (buyerResult.status === "rejected") {
    console.warn("Store order buyer email failed", buyerResult.reason);
  }

  if (adminSent || buyerSent) {
    await markClientOrderEmails(orderId, {
      admin: adminSent,
      buyer: buyerSent,
      via: "client_formsubmit_emailjs",
    });
  }

  return { inbox, adminSent, buyerSent };
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

export const markOrderNotificationsRead = async (orderId) => {
  if (!orderId) return;

  const notificationsRef = collection(db, "adminNotifications");
  const unreadQuery = query(
    notificationsRef,
    where("orderId", "==", orderId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(unreadQuery);
  await Promise.all(
    snapshot.docs.map((docSnap) =>
      updateDoc(docSnap.ref, {
        read: true,
        readAt: new Date(),
      })
    )
  );
};

export const markAdminNotificationReadById = async (notificationId) => {
  if (!notificationId) return;
  await updateDoc(doc(db, "adminNotifications", notificationId), {
    read: true,
    readAt: new Date(),
  });
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
