import { auth } from "@/firebase";

export const startOnlineStorePayment = async (orderId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("יש להתחבר כדי לשלם באתר");
  }
  const idToken = await user.getIdToken();
  const response = await fetch("/.netlify/functions/create-store-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, orderId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.message || data.error || "יצירת התשלום נכשלה"
    );
    error.code = data.error;
    error.details = data;
    throw error;
  }
  return data;
};

export const fetchStorePaymentStatus = async (orderId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("יש להתחבר");
  }
  const idToken = await user.getIdToken();
  const response = await fetch("/.netlify/functions/store-payment-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, orderId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || data.error || "בדיקת סטטוס נכשלה");
    error.code = data.error;
    throw error;
  }
  return data;
};
