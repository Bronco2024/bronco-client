import { SITE_URL } from "../data/site-config";

export const getSiteOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  return SITE_URL.replace(/\/$/, "");
};

export const getEmailVerificationSettings = () => ({
  url: `${getSiteOrigin()}/login?verified=1`,
  handleCodeInApp: false,
});

export const getPasswordResetSettings = () => ({
  url: `${getSiteOrigin()}/login`,
  handleCodeInApp: false,
});
