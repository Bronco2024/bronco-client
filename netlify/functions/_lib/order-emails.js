/** Order confirmation emails for Petzo store purchases. */
const SITE_NAME = "Petzo";
const CONTACT_EMAIL = "petzo.team@gmail.com";
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  process.env.REACT_APP_ADMIN_EMAIL ||
  "bronco.estd2024@gmail.com";

const PAYMENT_LABELS = {
  online: "תשלום באתר (כרטיס / ביט)",
  cod: "תשלום במסירה",
};

const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₪0";
  return `₪${n.toLocaleString("he-IL")}`;
};

const formatItemsLines = (items = []) =>
  (items || []).map((item) => {
    const qty = Number(item.quantity) || 1;
    const title = item.title || item.name || "מוצר";
    const lineTotal = formatMoney((Number(item.price) || 0) * qty);
    return `• ${title} × ${qty} — ${lineTotal}`;
  });

const contactBlock = (order = {}) => {
  const c = order.contactDetails || {};
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
  return [
    name ? `שם: ${name}` : null,
    order.email ? `אימייל: ${order.email}` : null,
    c.phone ? `טלפון: ${c.phone}` : null,
    c.city || c.address
      ? `כתובת: ${[c.city, c.address, c.apartment].filter(Boolean).join(", ")}`
      : null,
  ].filter(Boolean);
};

const wrapEmail = (title, bodyHtml) => `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f7faf8;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:24px auto;padding:28px 24px;background:#ffffff;border:1px solid #e2ebe7;border-radius:16px;color:#173b5e;line-height:1.7;direction:rtl;text-align:right;">
    <div style="margin-bottom:18px;font-size:28px;font-weight:800;color:#0f3d36;">${SITE_NAME}</div>
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e8f0ed;margin:24px 0;" />
    <p style="margin:0;color:#64748b;font-size:13px;">
      שאלות? כתבו לנו:
      <a href="mailto:${CONTACT_EMAIL}" style="color:#1a5c4f;font-weight:700;">${CONTACT_EMAIL}</a>
    </p>
  </div>
</body>
</html>`;

const messageToHtml = (message) =>
  `<div style="font-size:16px;white-space:pre-line;">${String(message || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")}</div>`;

const buildBuyerOrderEmail = ({ orderId, order = {}, siteUrl = "https://petzo.co.il" } = {}) => {
  const items = formatItemsLines(order.items);
  const payment =
    order.paymentMethodLabel ||
    PAYMENT_LABELS[order.paymentMethod] ||
    order.paymentMethod ||
    "";
  const origin = String(siteUrl || "https://petzo.co.il").replace(/\/$/, "");
  const subject = `${SITE_NAME}: אישור הזמנה ${orderId || ""}`.trim();
  const text = [
    "תודה על ההזמנה ב־Petzo!",
    "",
    `מספר הזמנה: ${orderId || ""}`,
    payment ? `אמצעי תשלום: ${payment}` : null,
    `סה״כ: ${formatMoney(order.totalPrice)}`,
    `פריטים: ${order.totalQuantity || items.length || 0}`,
    "",
    "המוצרים:",
    ...(items.length ? items : ["• אין פירוט פריטים"]),
    "",
    "פרטי משלוח:",
    ...contactBlock(order),
    order.notes ? `הערות: ${order.notes}` : null,
    "",
    "זהו אישור הזמנה. חשבונית מס תישלח בנפרד אם נדרש לפי התקנון.",
    "",
    `מעקב הזמנות: ${origin}/my-purchases`,
    "",
    `צוות ${SITE_NAME}`,
    CONTACT_EMAIL,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");

  return {
    to: order.email || "",
    subject,
    text,
    html: wrapEmail(subject, messageToHtml(text)),
  };
};

const buildAdminOrderEmail = ({
  orderId,
  order = {},
  siteUrl = "https://petzo.co.il",
  adminEmail = ADMIN_EMAIL,
} = {}) => {
  const items = formatItemsLines(order.items);
  const payment =
    order.paymentMethodLabel ||
    PAYMENT_LABELS[order.paymentMethod] ||
    order.paymentMethod ||
    "";
  const origin = String(siteUrl || "https://petzo.co.il").replace(/\/$/, "");
  const subject = `${SITE_NAME}: הזמנה חדשה בחנות — ${orderId || ""}`.trim();
  const text = [
    "התקבלה הזמנה חדשה בחנות Petzo.",
    "",
    `מספר הזמנה: ${orderId || ""}`,
    `סטטוס: ${order.status || ""}`,
    `תשלום: ${payment}${order.paymentStatus ? ` (${order.paymentStatus})` : ""}`,
    `סה״כ: ${formatMoney(order.totalPrice)}`,
    "",
    "פריטים:",
    ...(items.length ? items : ["• אין פירוט"]),
    "",
    "לקוח:",
    ...contactBlock(order),
    order.notes ? `הערות: ${order.notes}` : null,
    "",
    `ניהול הזמנות: ${origin}/admin/all-purchases`,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");

  return {
    to: adminEmail || ADMIN_EMAIL,
    subject,
    text,
    html: wrapEmail(subject, messageToHtml(text)),
  };
};

const getOrderNotificationTitle = (order = {}) => {
  const qty = order.totalQuantity || order.items?.length || 0;
  return `הזמנה חדשה · ${qty} פריטים · ${formatMoney(order.totalPrice)}`;
};

module.exports = {
  ADMIN_EMAIL,
  buildBuyerOrderEmail,
  buildAdminOrderEmail,
  getOrderNotificationTitle,
};
