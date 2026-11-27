const nodemailer = require("nodemailer");
const crypto = require("crypto");

const getMailConfig = () => {
  const user = process.env.SMTP_USER || "petzo.team@gmail.com";
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.SMTP_FROM_NAME || "Petzo";
  // Gmail deliverability: From must match the authenticated mailbox.
  const fromEmail = user;

  if (!pass) {
    throw new Error("Missing SMTP_PASS env var");
  }

  return {
    user,
    pass,
    fromName,
    fromEmail,
    from: `"${fromName}" <${fromEmail}>`,
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
  };
};

const sendMail = async ({ to, subject, html, text, headers = {} }) => {
  const config = getMailConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const messageId = `<orders.${Date.now()}.${crypto
    .randomBytes(6)
    .toString("hex")}@petzo.co.il>`;

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
    text,
    replyTo: `"Petzo" <${config.user}>`,
    // Help inbox placement for transactional mail.
    headers: {
      "Message-ID": messageId,
      "List-Unsubscribe": `<mailto:${config.user}?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      "X-Entity-Ref-ID": messageId,
      "X-Petzo-Mail": "store-order",
      ...headers,
    },
  });
};

module.exports = { sendMail, getMailConfig };
