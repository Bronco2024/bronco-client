/**
 * Firebase authDomain.
 * Keep the Firebase default (`*.firebaseapp.com`) unless Netlify env
 * explicitly sets a custom domain that is also registered in Google Cloud
 * OAuth client redirect URIs (`https://DOMAIN/__/auth/handler`).
 *
 * Using petzo.co.il before that URI is registered causes:
 * Error 400: redirect_uri_mismatch
 */
export const resolveFirebaseAuthDomain = ({
  envAuthDomain = "",
} = {}) => envAuthDomain || "bronco-65aaf.firebaseapp.com";
