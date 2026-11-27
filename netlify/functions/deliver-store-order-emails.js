/**
 * Deliver store order emails without Firebase Admin.
 * Used when FIREBASE_SERVICE_ACCOUNT is missing on Netlify, or as a
 * client-side fallback that posts the order snapshot after checkout.
 */
const { corsHeaders, jsonResponse } = require("./_lib/firebase-admin");
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
    const orderId = body.orderId;
    const order = body.order;

    if (!orderId || !order || typeof order !== "object") {
      return jsonResponse(400, { error: "Missing orderId or order" });
    }

    const email = String(order.email || "").trim();
    const totalPrice = Number(order.totalPrice);
    if (!email && !Number.isFinite(totalPrice)) {
      return jsonResponse(400, { error: "Invalid order payload" });
    }

    const result = await deliverOrderEmails(String(orderId), order);
    return jsonResponse(200, { ok: Boolean(result.ok), ...result });
  } catch (error) {
    console.error("deliver-store-order-emails failed", error);
    return jsonResponse(500, {
      error: "deliver_failed",
      message: error?.message || "unknown",
    });
  }
};
