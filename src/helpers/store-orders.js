import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toCartProduct, recalculateCartTotals } from "./cart-helpers";

export const ORDER_PAYMENT_METHODS = {
  ONLINE: "online",
  COD: "cod",
};

export const ORDER_PAYMENT_LABELS = {
  [ORDER_PAYMENT_METHODS.ONLINE]: "תשלום באתר (כרטיס / ביט)",
  [ORDER_PAYMENT_METHODS.COD]: "תשלום במסירה",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  AWAITING_PAYMENT: "awaiting_payment",
  CONFIRMED: "confirmed",
  SENT: "sent",
  CANCEL: "cancel",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "ממתין לאישור",
  [ORDER_STATUS.AWAITING_PAYMENT]: "ממתין לתשלום",
  [ORDER_STATUS.CONFIRMED]: "מאושר",
  [ORDER_STATUS.SENT]: "נשלח",
  [ORDER_STATUS.CANCEL]: "בוטל",
};

export const buildStoreOrderPayload = ({
  userId,
  contactDetails,
  items,
  paymentMethod = ORDER_PAYMENT_METHODS.ONLINE,
  notes = "",
}) => {
  const leanItems = (items || []).map((item) => ({
    ...toCartProduct(item),
    quantity: Number(item.quantity) || 1,
  }));
  const { totalQuantity, totalPrice } = recalculateCartTotals(leanItems);
  const isOnline = paymentMethod === ORDER_PAYMENT_METHODS.ONLINE;

  return {
    userId: userId || null,
    email: contactDetails?.email || "",
    contactDetails: {
      firstName: contactDetails?.firstName || "",
      lastName: contactDetails?.lastName || "",
      phone: contactDetails?.phone || "",
      city: contactDetails?.city || "",
      address: contactDetails?.address || "",
      apartment: contactDetails?.apartment || "",
    },
    notes: String(notes || "").trim(),
    items: leanItems,
    totalQuantity,
    totalPrice,
    paymentMethod,
    paymentMethodLabel:
      ORDER_PAYMENT_LABELS[paymentMethod] ||
      ORDER_PAYMENT_LABELS[ORDER_PAYMENT_METHODS.ONLINE],
    paymentStatus: isOnline ? "pending" : "cod",
    paymentProvider: isOnline ? "grow" : "cod",
    fulfillment: "home_delivery",
    status: isOnline ? ORDER_STATUS.AWAITING_PAYMENT : ORDER_STATUS.PENDING,
  };
};

export const createStoreOrder = async (db, payload) => {
  const docRef = await addDoc(collection(db, "purchases"), {
    ...payload,
    purchasedAt: serverTimestamp(),
  });
  return docRef.id;
};

/** Mark an unfinished online checkout as cancelled so it does not look like a second order. */
export const cancelStoreOrder = async (
  db,
  orderId,
  reason = "payment_abandoned"
) => {
  if (!db || !orderId) return;
  await updateDoc(doc(db, "purchases", String(orderId)), {
    status: ORDER_STATUS.CANCEL,
    paymentStatus: "cancelled",
    cancelledAt: serverTimestamp(),
    cancelReason: reason,
  });
};

/** Match abandoned online checkouts that look like the same cart. */
export const isMatchingAwaitingPaymentDuplicate = (
  order = {},
  { totalPrice, totalQuantity, exceptOrderId = null, orderId = null } = {}
) => {
  if (order.status && order.status !== ORDER_STATUS.AWAITING_PAYMENT) {
    return false;
  }
  if (exceptOrderId && orderId && String(orderId) === String(exceptOrderId)) {
    return false;
  }
  return (
    Number(order.totalPrice) === Number(totalPrice) &&
    Number(order.totalQuantity) === Number(totalQuantity)
  );
};

/**
 * Cancel leftover awaiting_payment checkouts for the same cart totals.
 * Happens when Grow fails and the buyer retries with COD.
 */
export const cancelMatchingAwaitingPaymentOrders = async (
  db,
  { userId, totalPrice, totalQuantity, exceptOrderId = null } = {}
) => {
  if (!db || !userId) return [];

  const snap = await getDocs(
    query(
      collection(db, "purchases"),
      where("userId", "==", userId),
      where("status", "==", ORDER_STATUS.AWAITING_PAYMENT)
    )
  );

  const cancelled = [];

  await Promise.all(
    snap.docs.map(async (docSnap) => {
      const data = docSnap.data() || {};
      if (
        !isMatchingAwaitingPaymentDuplicate(data, {
          totalPrice,
          totalQuantity,
          exceptOrderId,
          orderId: docSnap.id,
        })
      ) {
        return;
      }
      try {
        await updateDoc(docSnap.ref, {
          status: ORDER_STATUS.CANCEL,
          paymentStatus: "cancelled",
          cancelledAt: serverTimestamp(),
          cancelReason: "replaced_by_cod",
        });
        cancelled.push(docSnap.id);
      } catch (_error) {
        // non-blocking
      }
    })
  );

  return cancelled;
};
