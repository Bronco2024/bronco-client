const {
  getAdminAuth,
  getAdminDb,
  corsHeaders,
  jsonResponse,
} = require("./_lib/firebase-admin");
const { sendStoreOrderNotifications } = require("./_lib/send-order-notifications");
const { deliverOrderEmails } = require("./_lib/deliver-order-emails");

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
    const orderSnapshot = body.order;

    if (!orderId) {
      return jsonResponse(400, { error: "Missing orderId" });
    }

    // Preferred path: verify buyer + load order from Firestore.
    if (idToken && process.env.FIREBASE_SERVICE_ACCOUNT) {
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
    }

    // Degraded path: Firebase Admin missing — still email from client snapshot.
    if (orderSnapshot && typeof orderSnapshot === "object") {
      const result = await deliverOrderEmails(String(orderId), orderSnapshot);
      return jsonResponse(200, {
        ok: Boolean(result.ok),
        degraded: true,
        ...result,
      });
    }

    return jsonResponse(503, {
      error: "notify_unavailable",
      message: "Missing FIREBASE_SERVICE_ACCOUNT and order snapshot",
    });
  } catch (error) {
    console.error("notify-store-order failed", error);

    // Last chance: client may have sent the order body.
    try {
      const body = JSON.parse(event.body || "{}");
      if (body.orderId && body.order && typeof body.order === "object") {
        const result = await deliverOrderEmails(
          String(body.orderId),
          body.order
        );
        return jsonResponse(200, {
          ok: Boolean(result.ok),
          degraded: true,
          recovered: true,
          ...result,
        });
      }
    } catch (_recoverError) {
      // fall through
    }

    return jsonResponse(500, {
      error: "notify_failed",
      message: error?.message || "unknown",
    });
  }
};
