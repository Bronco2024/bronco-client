import { ADMIN_EMAIL, SITE_NAME } from "../data/site-config";
import { getNotificationTitle } from "./admin-notification-helpers";
import {
  buildAdminOrderEmail,
  buildBuyerOrderEmail,
} from "./store-order-emails";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const getEmailJsConfig = () => ({
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
});

const getOrigin = () =>
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "";

const sendTemplateWithEmailJs = async ({ to, subject, message, extra = {} }) => {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  if (!serviceId || !templateId || !publicKey || !to) return false;

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: to,
        subject,
        message,
        ...extra,
      },
    }),
  });

  return response.ok;
};

export const getAdminEmail = () => ADMIN_EMAIL;

export const canSendAdminEmail = () => Boolean(getAdminEmail());

export const buildPendingAdEmail = ({ adId, ad = {}, origin = "" } = {}) => {
  const title = getNotificationTitle(ad);
  const adminPath = origin ? `${origin.replace(/\/$/, "")}/admin` : "/admin";
  const isStore = ad.category === "חנות" || ad.listingKind === "store";

  const lines = isStore
    ? [
        "התקבל מוצר חדש לחנות וממתין לאישור מנהל.",
        "",
        `מוצר: ${title}`,
        `קטגוריה: חנות`,
        ad.accessory ? `סוג מוצר: ${ad.accessory}` : null,
        `מחיר: ${ad.price || "לא צוין"}`,
        `מזהה: ${adId || ""}`,
        "",
        `לאישור המוצר: ${adminPath}`,
      ]
    : [
        "התקבלה מודעה חדשה וממתינה לאישור מנהל.",
        "",
        `כותרת: ${title}`,
        `קטגוריה: ${ad.category || "לא צוין"}`,
        `עיר: ${ad.location || "לא צוין"}`,
        `מחיר: ${ad.price || "לא צוין"}`,
        `איש קשר: ${ad.contact || "לא צוין"}`,
        `טלפון: ${ad.phoneNumber || "לא צוין"}`,
        `מזהה מודעה: ${adId || ""}`,
        "",
        `לאישור המודעה: ${adminPath}`,
      ];

  return {
    subject: isStore
      ? `${SITE_NAME}: מוצר בחנות ממתין לאישור — ${title}`
      : `${SITE_NAME}: מודעה ממתינה לאישור — ${title}`,
    message: lines.filter(Boolean).join("\n"),
  };
};

const sendWithEmailJs = async ({ adId, ad, origin }) => {
  const email = buildPendingAdEmail({ adId, ad, origin });
  return sendTemplateWithEmailJs({
    to: getAdminEmail(),
    subject: email.subject,
    message: email.message,
    extra: {
      ad_id: adId,
      ad_title: getNotificationTitle(ad),
      ad_category: ad.category || "",
      ad_city: ad.location || "",
      ad_price: String(ad.price || ""),
    },
  });
};

const sendWithFormSubmit = async ({ adId, ad, origin }) => {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;

  const email = buildPendingAdEmail({ adId, ad, origin });
  const publisherEmail = ad.publisherEmail?.trim();

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: email.subject,
        _template: "box",
        _captcha: "false",
        _replyto: publisherEmail || adminEmail,
        name: SITE_NAME,
        email: adminEmail,
        message: email.message,
      }),
    }
  );

  return response.ok;
};

export const sendPendingAdEmailToAdmin = async ({ adId, ad = {} }) => {
  if (!canSendAdminEmail() || !adId) return false;

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";

  try {
    const sentWithEmailJs = await sendWithEmailJs({ adId, ad, origin });
    if (sentWithEmailJs) return true;
  } catch (error) {
    console.warn("EmailJS admin alert failed, trying FormSubmit", error);
  }

  return sendWithFormSubmit({ adId, ad, origin });
};

/**
 * Admin new-order alert + buyer confirmation.
 * FormSubmit delivers to the activated admin inbox; `_autoresponse` goes to the
 * buyer's `email` field — so the buyer gets a confirmation even when SMTP is down.
 */
const postStoreOrderFormSubmit = async ({
  targetEmail,
  adminMail,
  buyerMail,
  buyerEmail,
  buyerName,
}) => {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: adminMail.subject,
        _template: "box",
        _captcha: "false",
        _replyto: buyerEmail || targetEmail,
        // Autoresponse is emailed to this address (buyer confirmation).
        ...(buyerEmail
          ? {
              email: buyerEmail,
              _autoresponse: buyerMail.message,
            }
          : { email: targetEmail }),
        name: buyerName,
        message: adminMail.message,
      }),
    }
  );

  if (!response.ok) return false;
  const payload = await response.json().catch(() => ({}));
  // FormSubmit returns { success: "..." } on AJAX; Cloudflare HTML is not ok JSON.
  if (payload && typeof payload === "object" && payload.success) return true;
  // Some responses are empty 200 — treat as sent.
  return response.status >= 200 && response.status < 300;
};

export const sendStoreOrderEmailToAdmin = async ({ orderId, order = {} }) => {
  if (!canSendAdminEmail() || !orderId) return false;

  const origin = getOrigin();
  const adminMail = buildAdminOrderEmail({
    orderId,
    order,
    siteUrl: origin || undefined,
  });
  const buyerMail = buildBuyerOrderEmail({
    orderId,
    order,
    siteUrl: origin || undefined,
  });
  const adminEmail = getAdminEmail();
  const buyerEmail = String(order.email || buyerMail.to || "").trim();
  if (!adminEmail) return false;

  const contact = order.contactDetails || {};
  const buyerName =
    [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim() ||
    SITE_NAME;

  const attempt = () =>
    postStoreOrderFormSubmit({
      targetEmail: adminEmail,
      adminMail,
      buyerMail,
      buyerEmail,
      buyerName,
    });

  try {
    if (await attempt()) return true;
  } catch (error) {
    console.warn("FormSubmit store order email failed once", error);
  }

  // Short retry — checkout navigation used to abort the first attempt.
  await new Promise((resolve) => setTimeout(resolve, 700));
  try {
    if (await attempt()) return true;
  } catch (error) {
    console.warn("FormSubmit store order email retry failed", error);
  }

  return false;
};

/** Buyer confirmation via EmailJS (optional) — works for any recipient. */
export const sendBuyerOrderEmailClient = async ({ orderId, order = {} }) => {
  const origin = getOrigin();
  const email = buildBuyerOrderEmail({
    orderId,
    order,
    siteUrl: origin || undefined,
  });
  const to = String(email.to || order.email || "").trim();
  if (!to) return false;

  try {
    const sent = await sendTemplateWithEmailJs({
      to,
      subject: email.subject,
      message: email.message,
      extra: { order_id: orderId },
    });
    if (sent) return true;
  } catch (error) {
    console.warn("EmailJS buyer order email failed", error);
  }

  return false;
};
