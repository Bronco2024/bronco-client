import { ADMIN_EMAIL, SITE_NAME } from "../data/site-config";
import { getNotificationTitle } from "./admin-notification-helpers";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const getEmailJsConfig = () => ({
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
});

export const getAdminEmail = () => ADMIN_EMAIL;

export const canSendAdminEmail = () => Boolean(getAdminEmail());

export const buildPendingAdEmail = ({ adId, ad = {}, origin = "" } = {}) => {
  const title = getNotificationTitle(ad);
  const adminPath = origin ? `${origin.replace(/\/$/, "")}/admin` : "/admin";

  return {
    subject: `${SITE_NAME}: מודעה ממתינה לאישור — ${title}`,
    message: [
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
    ].join("\n"),
  };
};

const sendWithEmailJs = async ({ adId, ad, origin }) => {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  if (!serviceId || !templateId || !publicKey) return false;

  const email = buildPendingAdEmail({ adId, ad, origin });

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: getAdminEmail(),
        subject: email.subject,
        message: email.message,
        ad_id: adId,
        ad_title: getNotificationTitle(ad),
        ad_category: ad.category || "",
        ad_city: ad.location || "",
        ad_price: String(ad.price || ""),
      },
    }),
  });

  return response.ok;
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
