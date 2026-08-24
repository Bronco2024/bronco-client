const {
  getAdminAuth,
  getSiteUrl,
  corsHeaders,
  jsonResponse,
} = require("./_lib/firebase-admin");
const { sendMail } = require("./_lib/mail");
const { buildVerificationEmail } = require("./_lib/email-templates");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const idToken = body.idToken;

    if (!idToken || typeof idToken !== "string") {
      return jsonResponse(400, { error: "Missing idToken" });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const user = await auth.getUser(decoded.uid);

    if (!user.email) {
      return jsonResponse(400, { error: "User has no email" });
    }

    if (user.emailVerified) {
      return jsonResponse(200, { ok: true, alreadyVerified: true });
    }

    const siteUrl = getSiteUrl();
    const link = await auth.generateEmailVerificationLink(user.email, {
      url: `${siteUrl}/login?verified=1`,
      handleCodeInApp: false,
    });

    const email = buildVerificationEmail({
      displayName: user.displayName || "",
      link,
    });

    await sendMail({
      to: user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error("send-verification-email failed", error);
    return jsonResponse(500, {
      error: "Failed to send verification email",
      detail: error?.message || "unknown",
    });
  }
};
