const { sendMail } = require("./mail");
const {
  ADMIN_EMAIL,
  buildBuyerOrderEmail,
  buildAdminOrderEmail,
  getOrderNotificationTitle,
} = require("./order-emails");
const { getSiteUrl } = require("./firebase-admin");

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
    // Still ensure inbox exists if an earlier partial run only sent mail.
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

  const results = { buyer: false, admin: false, inbox: false };
  const buyerNeeded = Boolean(buyer.to);
  const adminNeeded = Boolean(admin.to);

  if (buyerNeeded) {
    try {
      await sendMail({
        to: buyer.to,
        subject: buyer.subject,
        html: buyer.html,
        text: buyer.text,
      });
      results.buyer = true;
    } catch (error) {
      console.error("buyer order email failed", orderId, error);
    }
  } else {
    results.buyer = true; // nothing to send
  }

  if (adminNeeded) {
    try {
      await sendMail({
        to: admin.to,
        subject: admin.subject,
        html: admin.html,
        text: admin.text,
      });
      results.admin = true;
    } catch (error) {
      console.error("admin order email failed", orderId, error);
    }
  } else {
    results.admin = true;
  }

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
