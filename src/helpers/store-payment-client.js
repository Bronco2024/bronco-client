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

const postOrderEmailRequest = async (path, body) => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Keepalive so a fast thank-you navigation does not abort the request.
    keepalive: true,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
};

/**
 * Buyer confirmation + admin new-order email via Netlify.
 * Always send the order snapshot so mail still works when
 * FIREBASE_SERVICE_ACCOUNT is missing on the host.
 */
export const notifyStoreOrderEmails = async (orderId, order = null) => {
  if (!orderId) return { ok: false };

  const user = auth.currentUser;
  const idToken = user ? await user.getIdToken().catch(() => null) : null;
  const payload = {
    orderId,
    ...(order ? { order } : {}),
    ...(idToken ? { idToken } : {}),
  };

  const primary = await postOrderEmailRequest(
    "/.netlify/functions/notify-store-order",
    payload
  );

  if (primary.response.ok && (primary.data.ok || primary.data.skipped)) {
    return primary.data;
  }

  // Explicit fallback when Auth/Admin SDK path is down.
  if (order) {
    const fallback = await postOrderEmailRequest(
      "/.netlify/functions/deliver-store-order-emails",
      { orderId, order }
    );
    if (fallback.response.ok) {
      return { ...fallback.data, via: "deliver_fallback" };
    }
    const error = new Error(
      fallback.data.message ||
        fallback.data.error ||
        primary.data.message ||
        primary.data.error ||
        "שליחת אישור הזמנה נכשלה"
    );
    error.code = fallback.data.error || primary.data.error;
    throw error;
  }

  const error = new Error(
    primary.data.message || primary.data.error || "שליחת אישור הזמנה נכשלה"
  );
  error.code = primary.data.error;
  throw error;
};
