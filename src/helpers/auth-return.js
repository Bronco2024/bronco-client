/** Safe post-login return paths for email + Google auth. */

export const AUTH_RETURN_STORAGE_KEY = "petzo_auth_return_to";

const BLOCKED_PREFIXES = ["/login", "/register", "/__/"];

export const sanitizeAuthReturnPath = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw.startsWith("/")) return "";
  if (raw.startsWith("//")) return "";
  if (
    BLOCKED_PREFIXES.some(
      (prefix) =>
        raw === prefix ||
        raw.startsWith(`${prefix}/`) ||
        raw.startsWith(`${prefix}?`)
    )
  ) {
    return "";
  }
  try {
    const url = new URL(raw, "https://petzo.co.il");
    return `${url.pathname}${url.search}`;
  } catch (_error) {
    return "";
  }
};

export const stashAuthReturnTo = (path) => {
  const safe = sanitizeAuthReturnPath(path);
  try {
    if (!safe) {
      sessionStorage.removeItem(AUTH_RETURN_STORAGE_KEY);
      return "";
    }
    sessionStorage.setItem(AUTH_RETURN_STORAGE_KEY, safe);
    return safe;
  } catch (_error) {
    return safe;
  }
};

export const consumeAuthReturnTo = (fallback = "/") => {
  let stored = "";
  try {
    stored = sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY) || "";
    sessionStorage.removeItem(AUTH_RETURN_STORAGE_KEY);
  } catch (_error) {
    stored = "";
  }
  return sanitizeAuthReturnPath(stored) || sanitizeAuthReturnPath(fallback) || "/";
};

/** Prefer ?next= then sessionStorage (for Google redirect round-trips). */
export const resolveAuthReturnTo = ({
  searchNext = "",
  fallback = "/",
} = {}) => {
  const fromQuery = sanitizeAuthReturnPath(searchNext);
  if (fromQuery) {
    try {
      sessionStorage.removeItem(AUTH_RETURN_STORAGE_KEY);
    } catch (_error) {
      // ignore
    }
    return fromQuery;
  }
  return consumeAuthReturnTo(fallback);
};
