/**
 * Firebase authDomain.
 *
 * On petzo.co.il we MUST use the site itself as authDomain so Google OAuth
 * stays same-site (required for Safari). Netlify proxies `/__/auth/*`.
 *
 * Important: an older Netlify env workaround set
 * REACT_APP_FIREBASE_AUTH_DOMAIN=bronco-65aaf.firebaseapp.com — that must
 * NOT win on the live site hostname, or Safari keeps breaking.
 *
 * Google Cloud OAuth client MUST include:
 *   https://petzo.co.il/__/auth/handler
 * otherwise Google returns Error 400: redirect_uri_mismatch.
 */
export const resolveFirebaseAuthDomain = ({
  envAuthDomain = "",
  hostname = "",
} = {}) => {
  const host = String(hostname || "").toLowerCase();
  if (host === "petzo.co.il" || host === "www.petzo.co.il") {
    return "petzo.co.il";
  }

  const fromEnv = String(envAuthDomain || "").trim();
  if (fromEnv) return fromEnv;

  return "bronco-65aaf.firebaseapp.com";
};

export const isSameOriginAuthDomain = (authDomain = "", hostname = "") => {
  const domain = String(authDomain || "").toLowerCase();
  const host = String(hostname || "").toLowerCase();
  if (!domain || !host) return false;
  return domain === host || (domain === "petzo.co.il" && host === "www.petzo.co.il");
};
