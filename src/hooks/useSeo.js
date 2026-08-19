import { useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/data/site-config";

const getAbsoluteUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = String(SITE_URL || "").replace(/\/$/, "");
  const path = String(url).startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
};

const upsertMetaTag = (selector, create, update) => {
  const existing = document.head.querySelector(selector);
  if (existing) {
    update(existing);
    return;
  }

  const meta = create();
  document.head.appendChild(meta);
};

const useSeo = ({
  title,
  description,
  image,
  url,
} = {}) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const finalTitle = title ? String(title) : SITE_NAME;
    document.title = finalTitle;

    const finalDescription = description
      ? String(description)
      : "Pets & Bones — לוח מודעות לחיות מחמד, אימוץ ושירותים במקום אחד.";

    const absoluteImage = image ? getAbsoluteUrl(image) : "";
    const absoluteUrl =
      url ||
      (typeof window !== "undefined"
        ? window.location.href
        : getAbsoluteUrl("/"));

    // Basic description
    upsertMetaTag(
      'meta[name="description"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("name", "description");
        return el;
      },
      (el) => el.setAttribute("content", finalDescription)
    );

    // OpenGraph
    upsertMetaTag(
      'meta[property="og:title"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("property", "og:title");
        return el;
      },
      (el) => el.setAttribute("content", finalTitle)
    );

    upsertMetaTag(
      'meta[property="og:description"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("property", "og:description");
        return el;
      },
      (el) => el.setAttribute("content", finalDescription)
    );

    upsertMetaTag(
      'meta[property="og:type"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("property", "og:type");
        return el;
      },
      (el) => el.setAttribute("content", "website")
    );

    upsertMetaTag(
      'meta[property="og:url"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("property", "og:url");
        return el;
      },
      (el) => el.setAttribute("content", absoluteUrl)
    );

    if (absoluteImage) {
      upsertMetaTag(
        'meta[property="og:image"]',
        () => {
          const el = document.createElement("meta");
          el.setAttribute("property", "og:image");
          return el;
        },
        (el) => el.setAttribute("content", absoluteImage)
      );
    }

    // Twitter (best effort)
    upsertMetaTag(
      'meta[name="twitter:card"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("name", "twitter:card");
        return el;
      },
      (el) => el.setAttribute("content", "summary_large_image")
    );

    upsertMetaTag(
      'meta[name="twitter:title"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("name", "twitter:title");
        return el;
      },
      (el) => el.setAttribute("content", finalTitle)
    );

    upsertMetaTag(
      'meta[name="twitter:description"]',
      () => {
        const el = document.createElement("meta");
        el.setAttribute("name", "twitter:description");
        return el;
      },
      (el) => el.setAttribute("content", finalDescription)
    );
  }, [title, description, image, url]);
};

export default useSeo;

