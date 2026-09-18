import React, { useMemo, useState } from "react";
import {
  getExternalBrowserCtaLabel,
  getExternalBrowserOpenUrl,
  isInAppBrowser,
} from "@/helpers/google-auth-strategy";
import "./InAppBrowserNotice.css";

/**
 * Navigate out of Facebook/Instagram WebView into Chrome / Safari.
 * Uses the platform deep-link when available.
 */
export const openInSystemBrowser = () => {
  if (typeof window === "undefined") return;
  const pageUrl = window.location.href;
  const ua = navigator.userAgent || "";
  const target = getExternalBrowserOpenUrl(pageUrl, ua) || pageUrl;
  window.location.assign(target);
};

/**
 * Shown on login/register when the page is opened inside Facebook/Instagram.
 * Google Sign-In cannot complete in those WebViews.
 */
const InAppBrowserNotice = () => {
  const [copied, setCopied] = useState(false);

  const { inApp, openHref, ctaLabel, pageUrl } = useMemo(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return { inApp: false, openHref: "", ctaLabel: "", pageUrl: "" };
    }
    const ua = navigator.userAgent || "";
    const href = window.location.href;
    return {
      inApp: isInAppBrowser(ua),
      openHref: getExternalBrowserOpenUrl(href, ua) || href,
      ctaLabel: getExternalBrowserCtaLabel(ua),
      pageUrl: href,
    };
  }, []);

  if (!inApp) return null;

  const copyPageLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const input = document.createElement("input");
        input.value = pageUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch (_error) {
      setCopied(false);
    }
  };

  return (
    <div className="in-app-browser-notice" role="status">
      <p>
        נפתחתם מתוך פייסבוק/אינסטגרם. התחברות עם Google עובדת רק ב־Chrome או
        Safari.
      </p>
      <a className="in-app-browser-open-btn" href={openHref} rel="noopener">
        {ctaLabel}
      </a>
      <button
        type="button"
        className="in-app-browser-copy-btn"
        onClick={copyPageLink}
      >
        {copied ? "הקישור הועתק" : "העתק קישור ופתח בדפדפן"}
      </button>
      <p className="in-app-browser-hint">
        אם הכפתור לא עובד: לחצו ⋮ או … ובחרו &quot;פתח בדפדפן&quot;.
      </p>
    </div>
  );
};

export default InAppBrowserNotice;
