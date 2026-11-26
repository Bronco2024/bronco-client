import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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
