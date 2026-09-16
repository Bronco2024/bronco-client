const {
  getAdminAuth,
  getSiteUrl,
  corsHeaders,
  jsonResponse,
} = require("./_lib/firebase-admin");
const { sendMail } = require("./_lib/mail");
const { buildPasswordResetEmail } = require("./_lib/email-templates");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const emailAddress = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!emailAddress || !emailAddress.includes("@")) {
      return jsonResponse(400, { error: "Missing email" });
    }

    const auth = getAdminAuth();
    const siteUrl = getSiteUrl();

    // Always return ok to avoid email enumeration; only send when user exists.
    try {
      const user = await auth.getUserByEmail(emailAddress);
      const link = await auth.generatePasswordResetLink(user.email, {
        url: `${siteUrl}/login`,
        handleCodeInApp: false,
      });

      const email = buildPasswordResetEmail({
        displayName: user.displayName || "",
        link,
      });

      await sendMail({
        to: user.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
    } catch (innerError) {
      if (innerError?.code !== "auth/user-not-found") {
        throw innerError;
      }
    }

    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error("send-password-reset-email failed", error);
    return jsonResponse(500, {
      error: "Failed to send password reset email",
      detail: error?.message || "unknown",
    });
  }
};
