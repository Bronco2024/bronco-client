/** Pure helpers for Google sign-in strategy (no Firebase imports). */

import { isSameOriginAuthDomain } from "./firebase-auth-domain";

export const GOOGLE_POPUP_HANG_MS = 25_000;

/** Custom code when Google OAuth cannot run inside an in-app WebView. */
export const IN_APP_BROWSER_AUTH_CODE = "auth/in-app-browser";

export const GOOGLE_REDIRECT_ERROR_KEY = "petzo_google_auth_error";

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

/**
 * Prefer full-page redirect only where popups are known-broken (WebKit)
 * AND authDomain is cross-site (Safari loses redirect results across sites).
 * When authDomain is same-origin (petzo.co.il), popup is preferred everywhere.
 */
export const shouldPreferGoogleRedirect = (
  userAgent = "",
  { authDomain = "", hostname = "" } = {}
) => {
  // Same-origin auth handler → popup works (including Safari).
  if (isSameOriginAuthDomain(authDomain, hostname)) {
    return false;
  }

  const ua = userAgent || "";
  // All iOS browsers share WebKit popup / storage limitations.
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  // Desktop Safari (exclude Chrome/Edge/Firefox/Opera).
  if (
    /Safari/i.test(ua) &&
    !/Chrome|Chromium|Edg|OPR|Firefox/i.test(ua)
  ) {
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
 * Prefer navigating via <a href> — Intent / x-safari schemes work more
 * reliably from a user gesture on an anchor than from location.href alone.
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

/** Hebrew CTA label: Chrome on Android, Safari on iOS. */
export const getExternalBrowserCtaLabel = (userAgent = "") => {
  const ua = userAgent || "";
  if (/Android/i.test(ua)) return "פתח ב-Chrome";
  if (/iPhone|iPad|iPod/i.test(ua)) return "פתח ב-Safari";
  return "פתח בדפדפן";
};

export const createInAppBrowserAuthError = () => {
  const error = new Error(
    "Google sign-in is blocked inside this in-app browser"
  );
  error.code = IN_APP_BROWSER_AUTH_CODE;
  return error;
};

export const stashGoogleRedirectError = (errorCode) => {
  try {
    if (typeof sessionStorage === "undefined") return;
    sessionStorage.setItem(
      GOOGLE_REDIRECT_ERROR_KEY,
      String(errorCode || "auth/unknown")
    );
  } catch (_error) {
    // ignore quota / private mode
  }
};

export const consumeGoogleRedirectError = () => {
  try {
    if (typeof sessionStorage === "undefined") return "";
    const code = sessionStorage.getItem(GOOGLE_REDIRECT_ERROR_KEY) || "";
    if (code) sessionStorage.removeItem(GOOGLE_REDIRECT_ERROR_KEY);
    return code;
  } catch (_error) {
    return "";
  }
};
