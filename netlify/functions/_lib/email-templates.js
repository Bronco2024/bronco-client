// CommonJS copy of branded Petzo auth email templates for Netlify functions.
const SITE_NAME = "Petzo";
const CONTACT_EMAIL = "petzo.team@gmail.com";

const wrapEmail = (title, bodyHtml) => `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f7faf8;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:24px auto;padding:28px 24px;background:#ffffff;border:1px solid #e2ebe7;border-radius:16px;color:#173b5e;line-height:1.7;direction:rtl;text-align:right;">
    <div style="margin-bottom:18px;font-size:28px;font-weight:800;color:#0f3d36;">${SITE_NAME}</div>
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e8f0ed;margin:24px 0;" />
    <p style="margin:0;color:#64748b;font-size:13px;">
      שאלות? כתבו לנו:
      <a href="mailto:${CONTACT_EMAIL}" style="color:#1a5c4f;font-weight:700;">${CONTACT_EMAIL}</a>
    </p>
  </div>
</body>
</html>`;

const ctaButton = (href, label) =>
  `<p style="margin:24px 0;">
    <a href="${href}" style="display:inline-block;padding:14px 22px;background:#ff861c;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:800;">
      ${label}
    </a>
  </p>
  <p style="margin:0;color:#64748b;font-size:13px;word-break:break-all;">
    או העתיקו את הקישור:<br/>
    <a href="${href}" style="color:#1a5c4f;">${href}</a>
  </p>`;

const buildVerificationEmail = ({ displayName = "", link }) => {
  const greeting = displayName?.trim() ? `שלום ${displayName.trim()},` : "שלום,";
  const subject = `אימות כתובת האימייל שלך ב-${SITE_NAME}`;
  const html = wrapEmail(
    subject,
    `
      <p style="margin:0 0 12px;font-size:16px;">${greeting}</p>
      <p style="margin:0 0 12px;font-size:16px;">ברוכים הבאים ל־${SITE_NAME}.</p>
      <p style="margin:0 0 12px;font-size:16px;">כדי לאמת את כתובת האימייל ולהפעיל את החשבון, לחצו על הכפתור:</p>
      ${ctaButton(link, "אימות כתובת האימייל")}
      <p style="margin:18px 0 0;font-size:14px;color:#64748b;">אם לא ביקשתם לאמת כתובת זו, אפשר להתעלם מהמייל.</p>
      <p style="margin:18px 0 0;font-size:16px;">תודה,<br/><strong>צוות ${SITE_NAME}</strong></p>
    `
  );
  const text = [
    greeting,
    "",
    `ברוכים הבאים ל־${SITE_NAME}.`,
    "כדי לאמת את כתובת האימייל, היכנסו לקישור:",
    link,
    "",
    "אם לא ביקשתם לאמת כתובת זו, אפשר להתעלם מהמייל.",
    "",
    `תודה, צוות ${SITE_NAME}`,
  ].join("\n");

  return { subject, html, text };
};

const buildPasswordResetEmail = ({ displayName = "", link }) => {
  const greeting = displayName?.trim() ? `שלום ${displayName.trim()},` : "שלום,";
  const subject = `איפוס סיסמה ב-${SITE_NAME}`;
  const html = wrapEmail(
    subject,
    `
      <p style="margin:0 0 12px;font-size:16px;">${greeting}</p>
      <p style="margin:0 0 12px;font-size:16px;">קיבלנו בקשה לאיפוס הסיסמה בחשבון ${SITE_NAME} שלכם.</p>
      <p style="margin:0 0 12px;font-size:16px;">לחצו על הכפתור כדי לבחור סיסמה חדשה:</p>
      ${ctaButton(link, "איפוס סיסמה")}
      <p style="margin:18px 0 0;font-size:14px;color:#64748b;">אם לא ביקשתם איפוס סיסמה, אפשר להתעלם מהמייל.</p>
      <p style="margin:18px 0 0;font-size:16px;">תודה,<br/><strong>צוות ${SITE_NAME}</strong></p>
    `
  );
  const text = [
    greeting,
    "",
    `קיבלנו בקשה לאיפוס הסיסמה בחשבון ${SITE_NAME}.`,
    "היכנסו לקישור כדי לבחור סיסמה חדשה:",
    link,
    "",
    "אם לא ביקשתם איפוס סיסמה, אפשר להתעלם מהמייל.",
    "",
    `תודה, צוות ${SITE_NAME}`,
  ].join("\n");

  return { subject, html, text };
};

module.exports = {
  buildVerificationEmail,
  buildPasswordResetEmail,
};
