const querystring = require("querystring");
const { getAdminDb, jsonResponse } = require("./_lib/firebase-admin");
const { approveGrowTransaction, getGrowConfig } = require("./_lib/grow");

const parseBody = (event) => {
  const raw = event.body || "";
  const decoded = event.isBase64Encoded
    ? Buffer.from(raw, "base64").toString("utf8")
    : raw;

  const contentType = String(
    event.headers?.["content-type"] || event.headers?.["Content-Type"] || ""
  ).toLowerCase();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(decoded || "{}");
    } catch (_error) {
      return {};
    }
  }

  const parsed = querystring.parse(decoded);
  // Grow may nest under data[...] keys or send a JSON string in `data`
  if (parsed.data && typeof parsed.data === "string") {
    try {
      const nested = JSON.parse(parsed.data);
      return { ...parsed, ...nested, data: nested };
    } catch (_error) {
      return parsed;
    }
  }
  return parsed;
};

const flattenNotifyPayload = (body) => {
  if (body?.data && typeof body.data === "object") {
    return { ...body.data, customFields: body.data.customFields || body.customFields };
  }
  return body || {};
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*" }, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const grow = getGrowConfig();
    if (!grow.configured) {
      return jsonResponse(503, { error: "grow_not_configured" });
    }

    const body = parseBody(event);
    const payload = flattenNotifyPayload(body);
    const orderId =
      payload?.customFields?.cField1 ||
      payload?.cField1 ||
      body?.cField1 ||
      "";

    if (!orderId) {
      console.warn("grow-payment-notify missing order id", payload);
      // Still acknowledge Grow so it stops retrying endlessly for bad payloads
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "missing_order_id" }),
      };
    }

    const db = getAdminDb();
    const orderRef = db.collection("purchases").doc(String(orderId));
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      console.warn("grow-payment-notify unknown order", orderId);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "order_not_found" }),
      };
    }

    const statusCode = String(payload.statusCode || payload.status || "");
    const paid =
      statusCode === "2" ||
      String(payload.status || "").includes("שולם") ||
      Boolean(payload.transactionId);

    if (paid) {
      await orderRef.set(
        {
          paymentStatus: "paid",
          status: "confirmed",
          paymentProvider: "grow",
          paidAt: new Date(),
          growTransactionId: String(payload.transactionId || ""),
          growTransactionToken: String(payload.transactionToken || ""),
          growAsmachta: String(payload.asmachta || ""),
          growCardSuffix: String(payload.cardSuffix || ""),
          growRawStatus: String(payload.status || ""),
          growNotifyReceivedAt: new Date(),
        },
        { merge: true }
      );
    }

    try {
      await approveGrowTransaction({
        transactionId: payload.transactionId,
        transactionToken: payload.transactionToken,
        transactionTypeId: payload.transactionTypeId,
        paymentType: payload.paymentType,
        sum: payload.sum,
        firstPaymentSum: payload.firstPaymentSum,
        periodicalPaymentSum: payload.periodicalPaymentSum,
        paymentsNum: payload.paymentsNum,
        allPaymentsNum: payload.allPaymentsNum,
        paymentDate: payload.paymentDate,
        asmachta: payload.asmachta,
        description: payload.description,
        fullName: payload.fullName,
        payerPhone: payload.payerPhone,
        payerEmail: payload.payerEmail,
        cardSuffix: payload.cardSuffix,
        cardType: payload.cardType,
        cardTypeCode: payload.cardTypeCode,
        cardBrand: payload.cardBrand,
        cardBrandCode: payload.cardBrandCode,
        cardExp: payload.cardExp,
        processId: payload.processId,
        processToken: payload.processToken,
      });
    } catch (approveError) {
      console.error("approveTransaction failed", approveError);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, orderId, paid }),
    };
  } catch (error) {
    console.error("grow-payment-notify failed", error);
    return jsonResponse(500, {
      error: "notify_failed",
      message: error.message || "unknown",
    });
  }
};
