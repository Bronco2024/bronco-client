export const SITE_NAME = "Petzo";

export const SITE_TAGLINE = "לוח חיות מחמד";

export const SITE_DESCRIPTION =
  `${SITE_NAME} — לוח מודעות לחיות מחמד, אימוץ ושירותים במקום אחד.`;

export const ADMIN_EMAIL =
  process.env.REACT_APP_ADMIN_EMAIL || "bronco.estd2024@gmail.com";

export const CONTACT_EMAIL = "petzo.team@gmail.com";

export const SITE_URL =
  process.env.REACT_APP_SITE_URL || "https://petzo.co.il";

export const DEFAULT_OG_IMAGE = "/hero-pets.jpg";

export const FIREBASE_SMTP_FROM_NAME = SITE_NAME;
export const FIREBASE_SMTP_FROM_EMAIL = CONTACT_EMAIL;
