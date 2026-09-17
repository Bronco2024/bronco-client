/**
 * Firebase authDomain.
 *
 * On petzo.co.il we use the site itself as authDomain so Google OAuth stays
 * same-site (required for Safari). Netlify already proxies `/__/auth/*` to
 * Firebase Hosting.
 *
 * Google Cloud OAuth client MUST include:
 *   https://petzo.co.il/__/auth/handler
 * otherwise Google returns Error 400: redirect_uri_mismatch.
 *
 * Override with REACT_APP_FIREBASE_AUTH_DOMAIN when needed
 * (e.g. localhost → leave unset to use *.firebaseapp.com).
 */
export const resolveFirebaseAuthDomain = ({
  envAuthDomain = "",
  hostname = "",
} = {}) => {
  const fromEnv = String(envAuthDomain || "").trim();
  if (fromEnv) return fromEnv;

  const host = String(hostname || "").toLowerCase();
  if (host === "petzo.co.il" || host === "www.petzo.co.il") {
    return "petzo.co.il";
  }

  return "bronco-65aaf.firebaseapp.com";
};

export const isSameOriginAuthDomain = (authDomain = "", hostname = "") => {
  const domain = String(authDomain || "").toLowerCase();
  const host = String(hostname || "").toLowerCase();
  if (!domain || !host) return false;
  return domain === host || (domain === "petzo.co.il" && host === "www.petzo.co.il");
};
