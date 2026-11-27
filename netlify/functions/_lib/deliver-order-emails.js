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

  try {
    await sendMail({
      to: buyer.to,
      subject: buyer.subject,
      html: buyer.html,
      text: buyer.text,
    });
    return { ok: true, via: "smtp" };
  } catch (smtpError) {
    console.error(
      "buyer SMTP failed, trying EmailJS",
      smtpError?.message || smtpError
    );
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
  } catch (emailJsError) {
    console.error(
      "buyer EmailJS failed",
      emailJsError?.message || emailJsError
    );
  }

  return { ok: false, via: null };
};

const sendAdminChannels = async ({ admin, buyer, order }) => {
  if (!admin.to) return { ok: true, via: "skipped" };

  try {
    await sendMail({
      to: admin.to,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
    });
    return { ok: true, via: "smtp" };
  } catch (smtpError) {
    console.error(
      "admin SMTP failed, trying FormSubmit",
      smtpError?.message || smtpError
    );
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
  } catch (formError) {
    console.error(
      "admin FormSubmit failed",
      formError?.message || formError
    );
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
  } catch (emailJsError) {
    console.error(
      "admin EmailJS failed",
      emailJsError?.message || emailJsError
    );
  }

  return { ok: false, via: null };
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
  };

  const emailsDone = results.buyer && results.admin;
  return { ok: emailsDone, results, partial: !emailsDone };
};

module.exports = {
  deliverOrderEmails,
  sendBuyerChannels,
  sendAdminChannels,
};
