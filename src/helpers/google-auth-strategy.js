/** Pure helpers for Google sign-in strategy (no Firebase imports). */

export const GOOGLE_POPUP_HANG_MS = 25_000;

/** Custom code when Google OAuth cannot run inside an in-app WebView. */
export const IN_APP_BROWSER_AUTH_CODE = "auth/in-app-browser";

/**
 * Facebook / Instagram / TikTok / etc. embedded browsers.
 * Google blocks OAuth inside these WebViews → auth/network-request-failed.
 */
export const isInAppBrowser = (userAgent = "") => {
  const ua = userAgent || "";
  return /FBAN|FBAV|FB_IAB|\bFacebook\b|Instagram|Line\/|TikTok|BytedanceWebview|\bTwitter\b|LinkedInApp|Snapchat|WhatsApp|Messenger|Pinterest|MicroMessenger|Kakao/i.test(
    ua
  );
};

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
  errorCode === "auth/cancelled-popup-request" ||
  errorCode === "auth/network-request-failed";

/**
 * Best-effort URL to escape an in-app WebView into Chrome / Safari.
 * Callers should still show a manual “open in browser” hint.
 */
export const getExternalBrowserOpenUrl = (
  pageUrl = "",
  userAgent = ""
) => {
  const url = String(pageUrl || "").trim();
  if (!url) return "";

  const ua = userAgent || "";
  const withoutScheme = url.replace(/^https?:\/\//i, "");

  if (/Android/i.test(ua)) {
    return `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(
      url
    )};end`;
  }

  if (/iPhone|iPad|iPod/i.test(ua)) {
    return `x-safari-https://${withoutScheme}`;
  }

  return url;
};

export const createInAppBrowserAuthError = () => {
  const error = new Error(
    "Google sign-in is blocked inside this in-app browser"
  );
  error.code = IN_APP_BROWSER_AUTH_CODE;
  return error;
};
