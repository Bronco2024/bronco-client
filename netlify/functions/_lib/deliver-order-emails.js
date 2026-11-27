const { sendMail } = require("./mail");
const {
  ADMIN_EMAIL,
  buildBuyerOrderEmail,
  buildAdminOrderEmail,
} = require("./order-emails");
const { getSiteUrl } = require("./firebase-admin");
const {
  sendViaEmailJs,
  sendOrderViaFormSubmit,
} = require("./mail-fallbacks");

const sendBuyerChannels = async (buyer) => {
  if (!buyer.to) return { ok: true, via: "skipped" };

  let lastError = null;
  try {
    await sendMail({
      to: buyer.to,
      subject: buyer.subject,
      html: buyer.html,
      text: buyer.text,
    });
    return { ok: true, via: "smtp" };
  } catch (smtpError) {
    lastError = smtpError?.message || String(smtpError);
    console.error("buyer SMTP failed, trying EmailJS", lastError);
  }

  try {
    if (
      await sendViaEmailJs({
        to: buyer.to,
        subject: buyer.subject,
        message: buyer.text,
      })
    ) {
      return { ok: true, via: "emailjs" };
    }
    lastError = lastError || "emailjs_not_configured_or_rejected";
  } catch (emailJsError) {
    lastError = emailJsError?.message || String(emailJsError);
    console.error("buyer EmailJS failed", lastError);
  }

  return { ok: false, via: null, error: lastError };
};

const sendAdminChannels = async ({ admin, buyer, order }) => {
  if (!admin.to) return { ok: true, via: "skipped" };

  let lastError = null;
  try {
    await sendMail({
      to: admin.to,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
    });
    return { ok: true, via: "smtp" };
  } catch (smtpError) {
    lastError = smtpError?.message || String(smtpError);
    console.error("admin SMTP failed, trying FormSubmit", lastError);
  }

  const contact = order.contactDetails || {};
  const buyerName =
    [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim() ||
    "Petzo";

  try {
    if (
      await sendOrderViaFormSubmit({
        adminEmail: admin.to,
        adminSubject: admin.subject,
        adminMessage: admin.text,
        buyerEmail: buyer.to,
        buyerMessage: buyer.text,
        buyerName,
      })
    ) {
      return { ok: true, via: "formsubmit" };
    }
    lastError = lastError || "formsubmit_rejected";
  } catch (formError) {
    lastError = formError?.message || String(formError);
    console.error("admin FormSubmit failed", lastError);
  }

  try {
    if (
      await sendViaEmailJs({
        to: admin.to,
        subject: admin.subject,
        message: admin.text,
      })
    ) {
      return { ok: true, via: "emailjs" };
    }
    lastError = lastError || "emailjs_not_configured_or_rejected";
  } catch (emailJsError) {
    lastError = emailJsError?.message || String(emailJsError);
    console.error("admin EmailJS failed", lastError);
  }

  return { ok: false, via: null, error: lastError };
};

/**
 * Deliver buyer + admin order emails from an order snapshot.
 * Does not require Firebase Admin — only SMTP / FormSubmit / EmailJS.
 */
const deliverOrderEmails = async (orderId, order = {}) => {
  if (!orderId || !order || typeof order !== "object") {
    return { ok: false, error: "missing_order" };
  }

  const siteUrl = getSiteUrl();
  const buyer = buildBuyerOrderEmail({ orderId, order, siteUrl });
  const admin = buildAdminOrderEmail({
    orderId,
    order,
    siteUrl,
    adminEmail: ADMIN_EMAIL,
  });

  const buyerResult = await sendBuyerChannels(buyer);
  const adminResult = await sendAdminChannels({ admin, buyer, order });

  // FormSubmit to admin also emails the buyer via `_autoresponse`.
  if (!buyerResult.ok && adminResult.via === "formsubmit" && buyer.to) {
    buyerResult.ok = true;
    buyerResult.via = "formsubmit_autoresponse";
  }

  const results = {
    buyer: buyerResult.ok,
    admin: adminResult.ok,
    buyerVia: buyerResult.via,
    adminVia: adminResult.via,
    buyerError: buyerResult.error || null,
    adminError: adminResult.error || null,
    smtpConfigured: Boolean(process.env.SMTP_PASS),
  };

  const emailsDone = results.buyer && results.admin;
  return { ok: emailsDone, results, partial: !emailsDone };
};

module.exports = {
  deliverOrderEmails,
  sendBuyerChannels,
  sendAdminChannels,
};
