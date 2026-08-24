import { SITE_NAME } from "../data/site-config";

export const toWhatsAppNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  const digits = String(phoneNumber).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return `972${digits.slice(1)}`;
  return digits;
};

export const buildWhatsAppLink = ({
  phoneNumber,
  title = "",
  isService = false,
} = {}) => {
  const number = toWhatsAppNumber(phoneNumber);
  if (!number) return "";

  let text;
  if (isService) {
    text = title
      ? `שלום, ראיתי את השירות "${title}" ב-${SITE_NAME}.`
      : `שלום, ראיתי שירות ב-${SITE_NAME}.`;
  } else {
    text = title
      ? `שלום, ראיתי את המודעה "${title}" ב-${SITE_NAME}.`
      : `שלום, ראיתי מודעה ב-${SITE_NAME}.`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const getListingPath = (ad) =>
  ad?.id ? `/item/${encodeURIComponent(ad.id)}` : "/item";

export const getListingShareUrl = (ad, origin = "") => {
  const base = String(origin || "").replace(/\/$/, "");
  return `${base}${getListingPath(ad)}`;
};
