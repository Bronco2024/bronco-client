export const SITE_NAME = "Petzo";

export const SITE_TAGLINE = "לוח חיות מחמד";

export const SITE_DESCRIPTION =
  `${SITE_NAME} — לוח מודעות לחיות מחמד, אימוץ ושירותים במקום אחד.`;

export const ADMIN_EMAIL =
  process.env.REACT_APP_ADMIN_EMAIL || "bronco.estd2024@gmail.com";

export const CONTACT_EMAIL = "petzo.team@gmail.com";

/** Site contact phone (display + WhatsApp). */
export const CONTACT_PHONE = "0527502293";
export const CONTACT_PHONE_DISPLAY = "052-750-2293";
export const CONTACT_WHATSAPP_URL = `https://wa.me/972527502293?text=${encodeURIComponent(
  "שלום, הגעתי מאתר Petzo."
)}`;

export const SITE_URL =
  process.env.REACT_APP_SITE_URL || "https://petzo.co.il";

export const DEFAULT_OG_IMAGE = "/hero-pets.png";

export const FIREBASE_SMTP_FROM_NAME = SITE_NAME;
export const FIREBASE_SMTP_FROM_EMAIL = CONTACT_EMAIL;
