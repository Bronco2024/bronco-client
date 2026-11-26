const {
  getAdminAuth,
  getAdminDb,
  getSiteUrl,
  corsHeaders,
  jsonResponse,
} = require("./_lib/firebase-admin");
const {
  createGrowPaymentProcess,
  getGrowConfig,
  sanitizeGrowText,
} = require("./_lib/grow");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const grow = getGrowConfig();
    if (!grow.configured) {
      return jsonResponse(503, {
        error: "grow_not_configured",
        // Buyer-facing copy only — never mention hosting/env keys here.
        message: "תשלום באתר לא זמין כרגע. אפשר לבחור תשלום במסירה.",
      });
    }

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
    if (order.userId !== decoded.uid) {
      return jsonResponse(403, { error: "Forbidden" });
    }

    if (order.paymentStatus === "paid") {
      return jsonResponse(200, {
        alreadyPaid: true,
        orderId,
        redirectUrl: `${getSiteUrl()}/order/thank-you?orderId=${encodeURIComponent(
          orderId
        )}&paid=1`,
      });
    }

    if (order.paymentMethod !== "online") {
      return jsonResponse(400, { error: "Order is not an online payment order" });
    }

    const contact = order.contactDetails || {};
    const fullName = sanitizeGrowText(
      `${contact.firstName || ""} ${contact.lastName || ""}`
    );
    const phone = String(contact.phone || "").replace(/\D/g, "");
    if (!fullName || fullName.split(" ").length < 2 || phone.length < 9) {
      return jsonResponse(400, {
        error: "invalid_payer",
        message: "נדרשים שם מלא ומספר טלפון ישראלי תקין לתשלום באתר.",
      });
    }

    const siteUrl = getSiteUrl();
    const successUrl = `${siteUrl}/order/thank-you?orderId=${encodeURIComponent(
      orderId
    )}&paid=1`;
    const cancelUrl = `${siteUrl}/cart/checkout?cancelled=1&orderId=${encodeURIComponent(
      orderId
    )}`;
    const notifyUrl = `${siteUrl}/.netlify/functions/grow-payment-notify`;

    const payment = await createGrowPaymentProcess({
      sum: order.totalPrice,
      fullName,
      phone,
      email: order.email || "",
      description: `Petzo order ${orderId}`,
      successUrl,
      cancelUrl,
      notifyUrl,
      orderId,
    });

    await orderRef.update({
      paymentStatus: "pending",
      paymentProvider: "grow",
      growProcessId: String(payment.processId || ""),
      growProcessToken: String(payment.processToken || ""),
      growPaymentUrl: payment.url,
      paymentStartedAt: new Date(),
    });

    return jsonResponse(200, {
      orderId,
      url: payment.url,
      processId: payment.processId,
      processToken: payment.processToken,
    });
  } catch (error) {
    console.error("create-store-payment failed", error);
    return jsonResponse(500, {
      error: error.code || "create_payment_failed",
      message: error.message || "Failed to create payment",
      details: error.details || null,
    });
  }
};
