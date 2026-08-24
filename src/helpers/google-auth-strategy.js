/** Pure helpers for Google sign-in strategy (no Firebase imports). */

export const GOOGLE_POPUP_HANG_MS = 25_000;

export const shouldPreferGoogleRedirect = (userAgent = "") => {
  const ua = userAgent || "";
  // Mobile + in-app browsers: popups are unreliable / blocked.
  if (/Android|iPhone|iPad|iPod|Mobile|Instagram|FBAN|FBAV|Line\//i.test(ua)) {
    return true;
  }
  // Safari (desktop): popup + storage partitioning often breaks Firebase Auth.
  if (/Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR\//i.test(ua)) {
    return true;
  }
  return false;
};

export const shouldFallbackGooglePopupToRedirect = (errorCode) =>
  errorCode === "auth/popup-blocked" ||
  errorCode === "auth/cancelled-popup-request";
