/**
 * Safe mail/env health check — never returns secret values.
 * POST or GET /.netlify/functions/mail-status
 */
const { corsHeaders, jsonResponse } = require("./_lib/firebase-admin");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const smtpUser = process.env.SMTP_USER || "petzo.team@gmail.com";
  const emailJs =
    Boolean(
      process.env.EMAILJS_SERVICE_ID || process.env.REACT_APP_EMAILJS_SERVICE_ID
    ) &&
    Boolean(
      process.env.EMAILJS_TEMPLATE_ID ||
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID
    ) &&
    Boolean(
      process.env.EMAILJS_PUBLIC_KEY || process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    );

  return jsonResponse(200, {
    ok: true,
    firebaseServiceAccount: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT),
    smtpPass: Boolean(process.env.SMTP_PASS),
    smtpUserSet: Boolean(process.env.SMTP_USER),
    smtpUserHint: smtpUser.includes("@")
      ? `${smtpUser.slice(0, 3)}…@${smtpUser.split("@")[1] || "?"}`
      : "default",
    smtpFromEmail: process.env.SMTP_FROM_EMAIL || null,
    emailJsConfigured: emailJs,
    readyForOrderEmails:
      Boolean(process.env.FIREBASE_SERVICE_ACCOUNT) &&
      Boolean(process.env.SMTP_PASS),
  });
};
