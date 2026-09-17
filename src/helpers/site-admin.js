import { ADMIN_EMAIL } from "../data/site-config";

const HARDCODED_SITE_ADMIN_EMAILS = ["bronco.estd2024@gmail.com"];

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

export const getSiteAdminEmails = () => {
  const emails = new Set(HARDCODED_SITE_ADMIN_EMAILS.map(normalizeEmail));
  const configured = normalizeEmail(ADMIN_EMAIL);
  if (configured) emails.add(configured);
  return emails;
};

export const isSiteAdminEmail = (email) =>
  getSiteAdminEmails().has(normalizeEmail(email));
