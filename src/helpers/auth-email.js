import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import {
  getEmailVerificationSettings,
  getPasswordResetSettings,
} from "./auth-email-helpers";

export {
  getEmailVerificationSettings,
  getPasswordResetSettings,
  getSiteOrigin,
} from "./auth-email-helpers";

export const sendSiteEmailVerification = (user) =>
  sendEmailVerification(user, getEmailVerificationSettings());

export const sendSitePasswordReset = (email) =>
  sendPasswordResetEmail(auth, email.trim(), getPasswordResetSettings());
