const {
  getAdminAuth,
  getAdminDb,
  corsHeaders,
  jsonResponse,
} = require("./_lib/firebase-admin");
const { sendStoreOrderNotifications } = require("./_lib/send-order-notifications");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const idToken = body.idToken;
    const orderId = body.orderId;

    if (!idToken || !orderId) {
      return jsonResponse(400, { error: "Missing idToken or orderId" });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const db = getAdminDb();
    const orderRef = db.collection("purchases").doc(String(orderId));
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return jsonResponse(404, { error: "Order not found" });
    }

    const order = orderSnap.data();
    if (order.userId && order.userId !== decoded.uid) {
      return jsonResponse(403, { error: "Forbidden" });
    }

    const result = await sendStoreOrderNotifications(db, orderId, order);
    return jsonResponse(200, { ok: true, ...result });
  } catch (error) {
    console.error("notify-store-order failed", error);
    return jsonResponse(500, {
      error: "notify_failed",
      message: error?.message || "unknown",
    });
  }
};
