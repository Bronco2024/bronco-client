const nodemailer = require("nodemailer");

const getMailConfig = () => {
  const user = process.env.SMTP_USER || "petzo.team@gmail.com";
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.SMTP_FROM_NAME || "Petzo";
  const fromEmail = process.env.SMTP_FROM_EMAIL || user;

  if (!pass) {
    throw new Error("Missing SMTP_PASS env var");
  }

  return {
    user,
    pass,
    from: `"${fromName}" <${fromEmail}>`,
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
  };
};

const sendMail = async ({ to, subject, html, text }) => {
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

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
    text,
    replyTo: config.user,
  });
};

module.exports = { sendMail, getMailConfig };
