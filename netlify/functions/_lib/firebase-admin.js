const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const parseServiceAccount = () => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env var");
  }

  const parsed = JSON.parse(raw);
  if (parsed.private_key && parsed.private_key.includes("\\n")) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }
  return parsed;
};

const getAdminAuth = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert(parseServiceAccount()),
    });
  }
  return getAuth();
};

const getSiteUrl = () =>
  (process.env.SITE_URL || process.env.URL || "https://petzo.co.il").replace(
    /\/$/,
    ""
  );

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    ...corsHeaders,
  },
  body: JSON.stringify(body),
});

module.exports = {
  getAdminAuth,
  getSiteUrl,
  corsHeaders,
  jsonResponse,
};
