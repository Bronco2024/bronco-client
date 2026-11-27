const { sendMail } = require("./mail");
const {
  ADMIN_EMAIL,
  buildBuyerOrderEmail,
  buildAdminOrderEmail,
  getOrderNotificationTitle,
} = require("./order-emails");
const { getSiteUrl } = require("./firebase-admin");

/**
 * Send buyer confirmation + admin alert for a store order.
 * Idempotent via purchases/{orderId}.orderEmailsSentAt.
 */
const sendStoreOrderNotifications = async (db, orderId, orderOverride = null) => {
  if (!db || !orderId) {
    return { ok: false, error: "missing_order" };
  }

  const orderRef = db.collection("purchases").doc(String(orderId));
  const orderSnap = orderOverride
    ? null
    : await orderRef.get();
  const order = orderOverride || (orderSnap?.exists ? orderSnap.data() : null);

  if (!order) {
    return { ok: false, error: "order_not_found" };
  }

  if (order.orderEmailsSentAt) {
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

  if (buyer.to) {
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
  }

  if (admin.to) {
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
  }

  try {
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
    results.inbox = true;
  } catch (error) {
    console.error("admin order inbox notification failed", orderId, error);
  }

  // Mark sent even if one channel failed — avoids inbox spam on retries.
  // Retry email only when neither mail nor inbox succeeded.
  if (results.buyer || results.admin || results.inbox) {
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

  return { ok: true, results };
};

module.exports = { sendStoreOrderNotifications };
