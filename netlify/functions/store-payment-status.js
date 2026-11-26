const {
  getAdminAuth,
  getAdminDb,
  corsHeaders,
  jsonResponse,
} = require("./_lib/firebase-admin");
const {
  getGrowConfig,
  getGrowPaymentProcessInfo,
} = require("./_lib/grow");

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
    if (order.userId !== decoded.uid && !decoded.admin) {
      // Allow owner only (admin flag on token is uncommon); keep simple
      if (order.userId !== decoded.uid) {
        return jsonResponse(403, { error: "Forbidden" });
      }
    }

    let paymentStatus = order.paymentStatus || "pending";

    // If still pending, ask Grow once for process info (best-effort).
    if (
      paymentStatus !== "paid" &&
      order.growProcessId &&
      order.growProcessToken &&
      getGrowConfig().configured
    ) {
      try {
        const info = await getGrowPaymentProcessInfo({
          processId: order.growProcessId,
          processToken: order.growProcessToken,
        });
        const statusCode = String(
          info?.data?.statusCode || info?.data?.status || ""
        );
        if (statusCode === "2" || String(info?.data?.status || "").includes("שולם")) {
          paymentStatus = "paid";
          await orderRef.set(
            {
              paymentStatus: "paid",
              status: "confirmed",
              paidAt: new Date(),
              growVerifiedAt: new Date(),
            },
            { merge: true }
          );
        }
      } catch (verifyError) {
        console.warn("store-payment-status verify skipped", verifyError.message);
      }
    }

    return jsonResponse(200, {
      orderId,
      paymentStatus,
      status: order.status,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
    });
  } catch (error) {
    console.error("store-payment-status failed", error);
    return jsonResponse(500, {
      error: "status_failed",
      message: error.message || "unknown",
    });
  }
};
