import React, { useMemo } from "react";
import {
  getExternalBrowserOpenUrl,
  isInAppBrowser,
} from "@/helpers/google-auth-strategy";
import "./InAppBrowserNotice.css";

export const openInSystemBrowser = () => {
  if (typeof window === "undefined") return;
  const pageUrl = window.location.href;
  const ua = navigator.userAgent || "";
  const target = getExternalBrowserOpenUrl(pageUrl, ua) || pageUrl;
  window.location.href = target;
};

/**
 * Shown on login/register when the page is opened inside Facebook/Instagram.
 * Google Sign-In cannot complete in those WebViews.
 */
const InAppBrowserNotice = () => {
  const inApp = useMemo(
    () =>
      typeof navigator !== "undefined" && isInAppBrowser(navigator.userAgent),
    []
  );

  if (!inApp) return null;

  return (
    <div className="in-app-browser-notice" role="status">
      <p>
        נפתחתם מתוך פייסבוק/אינסטגרם. התחברות עם Google עובדת רק ב־Chrome או
        Safari.
      </p>
      <button
        type="button"
        className="in-app-browser-open-btn"
        onClick={openInSystemBrowser}
      >
        פתיחה בדפדפן
      </button>
    </div>
  );
};

export default InAppBrowserNotice;
