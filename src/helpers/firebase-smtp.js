import {
  CONTACT_EMAIL,
  FIREBASE_SMTP_FROM_EMAIL,
  FIREBASE_SMTP_FROM_NAME,
  SITE_NAME,
} from "../data/site-config";

export const getFirebaseSmtpRecommendation = () => ({
  fromName: FIREBASE_SMTP_FROM_NAME || SITE_NAME,
  fromEmail: FIREBASE_SMTP_FROM_EMAIL || CONTACT_EMAIL,
  replyTo: CONTACT_EMAIL,
  host: "smtp.gmail.com",
  port: 587,
});
