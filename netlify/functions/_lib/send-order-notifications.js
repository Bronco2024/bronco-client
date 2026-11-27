const {
  getOrderNotificationTitle,
} = require("./order-emails");
const { deliverOrderEmails } = require("./deliver-order-emails");

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
    try {
      await ensureAdminInbox(db, orderId, order);
    } catch (_error) {
      // non-blocking
    }
    return { ok: true, skipped: true, reason: "already_sent" };
  }

  const delivered = await deliverOrderEmails(orderId, order);

  const results = {
    buyer: Boolean(delivered.results?.buyer),
    admin: Boolean(delivered.results?.admin),
    inbox: false,
    buyerVia: delivered.results?.buyerVia || null,
    adminVia: delivered.results?.adminVia || null,
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

module.exports = { sendStoreOrderNotifications, ensureAdminInbox };
