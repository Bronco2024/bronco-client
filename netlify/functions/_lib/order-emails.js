/** Order confirmation emails for Petzo store purchases. */
const SITE_NAME = "Petzo";
const CONTACT_EMAIL = "petzo.team@gmail.com";
const SITE_URL = "https://petzo.co.il";
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

const buyerGreeting = (order = {}) => {
  const c = order.contactDetails || {};
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
  return name ? `שלום ${name},` : "שלום,";
};

const wrapEmail = (title, bodyHtml) => `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:24px auto;padding:28px 24px;background:#ffffff;border:1px solid #e2ebe7;border-radius:14px;color:#173b5e;line-height:1.7;direction:rtl;text-align:right;">
    <div style="margin-bottom:6px;font-size:26px;font-weight:800;color:#0f3d36;">${SITE_NAME}</div>
    <div style="margin-bottom:18px;font-size:13px;color:#64748b;">${SITE_URL.replace("https://", "")}</div>
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e8f0ed;margin:24px 0;" />
    <p style="margin:0 0 8px;color:#64748b;font-size:13px;">
      שאלות? כתבו לנו:
      <a href="mailto:${CONTACT_EMAIL}" style="color:#1a5c4f;font-weight:700;">${CONTACT_EMAIL}</a>
    </p>
    <p style="margin:0;color:#94a3b8;font-size:12px;">
      נשלח מ־${SITE_NAME} · <a href="${SITE_URL}" style="color:#64748b;">${SITE_URL}</a>
    </p>
  </div>
</body>
</html>`;

const messageToHtml = (message) =>
  `<div style="font-size:16px;white-space:pre-line;">${String(message || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")}</div>`;

const buildBuyerOrderEmail = ({
  orderId,
  order = {},
  siteUrl = SITE_URL,
} = {}) => {
  const items = formatItemsLines(order.items);
  const payment =
    order.paymentMethodLabel ||
    PAYMENT_LABELS[order.paymentMethod] ||
    order.paymentMethod ||
    "";
  const origin = String(siteUrl || SITE_URL).replace(/\/$/, "");
  const shortId = String(orderId || "").slice(0, 8);
  // Keep subject short and human — long random ids hurt inbox placement.
  const subject = shortId
    ? `${SITE_NAME}: אישור הזמנה #${shortId}`
    : `${SITE_NAME}: אישור הזמנה`;

  const text = [
    buyerGreeting(order),
    "",
    "תודה שהזמנתם ב־Petzo.",
    "קיבלנו את ההזמנה שלכם ונעדכן אתכם בכל שלב עד המשלוח.",
    "",
    `מספר הזמנה: ${orderId || ""}`,
    payment ? `אמצעי תשלום: ${payment}` : null,
    `סה״כ לתשלום: ${formatMoney(order.totalPrice)}`,
    `מספר פריטים: ${order.totalQuantity || items.length || 0}`,
    "",
    "פירוט המוצרים:",
    ...(items.length ? items : ["• אין פירוט פריטים"]),
    "",
    "פרטי משלוח:",
    ...contactBlock(order),
    order.notes ? `הערות: ${order.notes}` : null,
    "",
    "זהו אישור הזמנה בלבד. חשבונית מס תישלח בנפרד אם נדרש.",
    "",
    `למעקב אחרי ההזמנה: ${origin}/my-purchases`,
    "",
    `בברכה,`,
    `צוות ${SITE_NAME}`,
    CONTACT_EMAIL,
    SITE_URL,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");

  const htmlBody = `
    <p style="margin:0 0 12px;font-size:16px;">${buyerGreeting(order)}</p>
    <p style="margin:0 0 12px;font-size:16px;">תודה שהזמנתם ב־${SITE_NAME}.</p>
    <p style="margin:0 0 18px;font-size:16px;">קיבלנו את ההזמנה ונעדכן אתכם עד שהמשלוח מגיע הביתה.</p>
    <div style="padding:14px 16px;background:#f7faf8;border:1px solid #e2ebe7;border-radius:10px;margin:0 0 18px;">
      <p style="margin:0 0 6px;"><strong>מספר הזמנה:</strong> ${orderId || ""}</p>
      ${payment ? `<p style="margin:0 0 6px;"><strong>תשלום:</strong> ${payment}</p>` : ""}
      <p style="margin:0;"><strong>סה״כ:</strong> ${formatMoney(order.totalPrice)}</p>
    </div>
    ${messageToHtml(
      [
        "פירוט המוצרים:",
        ...(items.length ? items : ["• אין פירוט פריטים"]),
        "",
        "פרטי משלוח:",
        ...contactBlock(order),
        order.notes ? `הערות: ${order.notes}` : null,
      ]
        .filter((line) => line !== null && line !== undefined)
        .join("\n")
    )}
    <p style="margin:18px 0 0;font-size:14px;color:#64748b;">זהו אישור הזמנה בלבד. חשבונית מס תישלח בנפרד אם נדרש.</p>
    <p style="margin:18px 0 0;">
      <a href="${origin}/my-purchases" style="display:inline-block;padding:12px 18px;background:#ff861c;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:800;">מעקב הזמנות</a>
    </p>
    <p style="margin:18px 0 0;font-size:16px;">בברכה,<br/><strong>צוות ${SITE_NAME}</strong></p>
  `;

  return {
    to: order.email || "",
    subject,
    text,
    html: wrapEmail(subject, htmlBody),
  };
};

const buildAdminOrderEmail = ({
  orderId,
  order = {},
  siteUrl = SITE_URL,
  adminEmail = ADMIN_EMAIL,
} = {}) => {
  const items = formatItemsLines(order.items);
  const payment =
    order.paymentMethodLabel ||
    PAYMENT_LABELS[order.paymentMethod] ||
    order.paymentMethod ||
    "";
  const origin = String(siteUrl || SITE_URL).replace(/\/$/, "");
  const shortId = String(orderId || "").slice(0, 8);
  const subject = shortId
    ? `${SITE_NAME}: הזמנה חדשה #${shortId}`
    : `${SITE_NAME}: הזמנה חדשה בחנות`;
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
