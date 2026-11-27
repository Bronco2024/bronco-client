/**
 * Fallbacks when SMTP is missing/broken.
 * EmailJS can deliver to any buyer address; FormSubmit autoresponse
 * reaches the buyer when posting through the activated admin inbox.
 */

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const getEmailJsConfig = () => ({
  serviceId:
    process.env.EMAILJS_SERVICE_ID || process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId:
    process.env.EMAILJS_TEMPLATE_ID ||
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey:
    process.env.EMAILJS_PUBLIC_KEY || process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
});

const sendViaEmailJs = async ({ to, subject, message }) => {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  if (!serviceId || !templateId || !publicKey || !to) return false;

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: to,
        subject,
        message,
      },
    }),
  });

  return response.ok;
};

/**
 * Post to activated admin FormSubmit inbox; buyer gets `_autoresponse`.
 */
const sendOrderViaFormSubmit = async ({
  adminEmail,
  adminSubject,
  adminMessage,
  buyerEmail,
  buyerMessage,
  buyerName = "Petzo",
}) => {
  if (!adminEmail) return false;

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: adminSubject,
        _template: "box",
        _captcha: "false",
        _replyto: buyerEmail || adminEmail,
        ...(buyerEmail
          ? { email: buyerEmail, _autoresponse: buyerMessage }
          : { email: adminEmail }),
        name: buyerName,
        message: adminMessage,
      }),
    }
  );

  return response.ok;
};

module.exports = { sendViaEmailJs, sendOrderViaFormSubmit };
