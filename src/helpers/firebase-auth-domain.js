/**
 * Firebase authDomain for this page.
 * On custom domains, use the page hostname (with Netlify /__/auth proxy)
 * so Google OAuth is first-party and not blocked by third-party cookies.
 */
export const resolveFirebaseAuthDomain = ({
  hostname = "",
  envAuthDomain = "",
} = {}) => {
  const host = String(hostname || "").toLowerCase();
  const customHosts = new Set([
    "petzo.co.il",
    "www.petzo.co.il",
    "petbones.netlify.app",
  ]);

  if (customHosts.has(host)) return host;
  return envAuthDomain || "bronco-65aaf.firebaseapp.com";
};
