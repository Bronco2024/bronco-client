import { SITE_NAME, SITE_URL, ADMIN_EMAIL, CONTACT_EMAIL } from "../data/site-config";
import { ORDER_PAYMENT_LABELS } from "./store-orders";

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

/** Buyer confirmation — אישור הזמנה (not a legal tax invoice). */
export const buildBuyerOrderEmail = ({ orderId, order = {}, siteUrl = SITE_URL } = {}) => {
  const items = formatItemsLines(order.items);
  const payment =
    order.paymentMethodLabel ||
    ORDER_PAYMENT_LABELS[order.paymentMethod] ||
    order.paymentMethod ||
    "";
  const origin = String(siteUrl || SITE_URL).replace(/\/$/, "");
  const shortId = String(orderId || "").slice(0, 8);
  const subject = shortId
    ? `${SITE_NAME}: אישור הזמנה #${shortId}`
    : `${SITE_NAME}: אישור הזמנה`;
  const contact = order.contactDetails || {};
  const buyerName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const greeting = buyerName ? `שלום ${buyerName},` : "שלום,";

  const message = [
    greeting,
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
    "בברכה,",
    `צוות ${SITE_NAME}`,
    CONTACT_EMAIL,
    SITE_URL,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");

  return { subject, message, to: order.email || "" };
};

/** Admin alert — new store order landed. */
export const buildAdminOrderEmail = ({
  orderId,
  order = {},
  siteUrl = SITE_URL,
  adminEmail = ADMIN_EMAIL,
} = {}) => {
  const items = formatItemsLines(order.items);
  const payment =
    order.paymentMethodLabel ||
    ORDER_PAYMENT_LABELS[order.paymentMethod] ||
    order.paymentMethod ||
    "";
  const origin = String(siteUrl || SITE_URL).replace(/\/$/, "");
  const shortId = String(orderId || "").slice(0, 8);
  const subject = shortId
    ? `${SITE_NAME}: הזמנה חדשה #${shortId}`
    : `${SITE_NAME}: הזמנה חדשה בחנות`;

  const message = [
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

  return { subject, message, to: adminEmail || ADMIN_EMAIL };
};

export const getOrderNotificationTitle = (order = {}) => {
  const qty = order.totalQuantity || order.items?.length || 0;
  const total = formatMoney(order.totalPrice);
  return `הזמנה חדשה · ${qty} פריטים · ${total}`;
};
