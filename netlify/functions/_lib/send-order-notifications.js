const { sendMail } = require("./mail");
const {
  ADMIN_EMAIL,
  buildBuyerOrderEmail,
  buildAdminOrderEmail,
  getOrderNotificationTitle,
} = require("./order-emails");
const { getSiteUrl } = require("./firebase-admin");
const {
  sendViaEmailJs,
  sendOrderViaFormSubmit,
} = require("./mail-fallbacks");

const ensureAdminInbox = async (db, orderId, order) => {
  const existing = await db
    .collection("adminNotifications")
    .where("orderId", "==", String(orderId))
    .limit(1)
    .get();

  if (!existing.empty) {
    return { created: false, skipped: true };
  }

  await db.collection("adminNotifications").add({
    type: "store_order",
    orderId: String(orderId),
    title: getOrderNotificationTitle(order),
    category: "חנות",
    location: order.contactDetails?.city || "",
    totalPrice: Number(order.totalPrice) || 0,
    paymentMethod: order.paymentMethod || "",
    read: false,
    createdAt: new Date(),
  });
  return { created: true };
};

const sendBuyerChannels = async (buyer) => {
  if (!buyer.to) return { ok: true, via: "skipped" };

  try {
    await sendMail({
      to: buyer.to,
      subject: buyer.subject,
      html: buyer.html,
      text: buyer.text,
    });
    return { ok: true, via: "smtp" };
  } catch (smtpError) {
    console.error("buyer SMTP failed, trying EmailJS", smtpError?.message || smtpError);
  }

  try {
    if (
      await sendViaEmailJs({
        to: buyer.to,
        subject: buyer.subject,
        message: buyer.text,
      })
    ) {
      return { ok: true, via: "emailjs" };
    }
  } catch (emailJsError) {
    console.error("buyer EmailJS failed", emailJsError?.message || emailJsError);
  }

  return { ok: false, via: null };
};

const sendAdminChannels = async ({ admin, buyer, order }) => {
  if (!admin.to) return { ok: true, via: "skipped" };

  try {
    await sendMail({
      to: admin.to,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
    });
    return { ok: true, via: "smtp" };
  } catch (smtpError) {
    console.error("admin SMTP failed, trying FormSubmit", smtpError?.message || smtpError);
  }

  const contact = order.contactDetails || {};
  const buyerName =
    [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim() ||
    "Petzo";

  try {
    if (
      await sendOrderViaFormSubmit({
        adminEmail: admin.to,
        adminSubject: admin.subject,
        adminMessage: admin.text,
        buyerEmail: buyer.to,
        buyerMessage: buyer.text,
        buyerName,
      })
    ) {
      return { ok: true, via: "formsubmit" };
    }
  } catch (formError) {
    console.error("admin FormSubmit failed", formError?.message || formError);
  }

  try {
    if (
      await sendViaEmailJs({
        to: admin.to,
        subject: admin.subject,
        message: admin.text,
      })
    ) {
      return { ok: true, via: "emailjs" };
    }
  } catch (emailJsError) {
    console.error("admin EmailJS failed", emailJsError?.message || emailJsError);
  }

  return { ok: false, via: null };
};

/**
 * Send buyer confirmation + admin alert for a store order.
 * Idempotent via purchases/{orderId}.orderEmailsSentAt — only set when
 * required email channels succeed (inbox alone must not block retries).
 */
const sendStoreOrderNotifications = async (db, orderId, orderOverride = null) => {
  if (!db || !orderId) {
    return { ok: false, error: "missing_order" };
  }

  const orderRef = db.collection("purchases").doc(String(orderId));
  const orderSnap = orderOverride ? null : await orderRef.get();
  const order = orderOverride || (orderSnap?.exists ? orderSnap.data() : null);

  if (!order) {
    return { ok: false, error: "order_not_found" };
  }

  if (order.orderEmailsSentAt) {
    try {
      await ensureAdminInbox(db, orderId, order);
    } catch (_error) {
      // non-blocking
    }
    return { ok: true, skipped: true, reason: "already_sent" };
  }

  const siteUrl = getSiteUrl();
  const buyer = buildBuyerOrderEmail({ orderId, order, siteUrl });
  const admin = buildAdminOrderEmail({
    orderId,
    order,
    siteUrl,
    adminEmail: ADMIN_EMAIL,
  });

  const buyerResult = await sendBuyerChannels(buyer);
  const adminResult = await sendAdminChannels({ admin, buyer, order });

  // FormSubmit to admin also emails the buyer via `_autoresponse`.
  if (!buyerResult.ok && adminResult.via === "formsubmit" && buyer.to) {
    buyerResult.ok = true;
    buyerResult.via = "formsubmit_autoresponse";
  }

  const results = {
    buyer: buyerResult.ok,
    admin: adminResult.ok,
    inbox: false,
    buyerVia: buyerResult.via,
    adminVia: adminResult.via,
  };

  try {
    const inbox = await ensureAdminInbox(db, orderId, order);
    results.inbox = Boolean(inbox.created || inbox.skipped);
  } catch (error) {
    console.error("admin order inbox notification failed", orderId, error);
  }

  const emailsDone = results.buyer && results.admin;
  if (emailsDone) {
    try {
      await orderRef.set(
        {
          orderEmailsSentAt: new Date(),
          orderEmailsMeta: {
            buyer: results.buyer,
            admin: results.admin,
            inbox: results.inbox,
            buyerVia: results.buyerVia || null,
            adminVia: results.adminVia || null,
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error("failed to mark orderEmailsSentAt", orderId, error);
    }
  }

  return { ok: emailsDone, results, partial: !emailsDone };
};

module.exports = { sendStoreOrderNotifications };
