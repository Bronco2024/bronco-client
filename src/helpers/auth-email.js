import { sendEmailVerification } from "firebase/auth";
import { getEmailVerificationSettings } from "./auth-email-helpers";

export { getEmailVerificationSettings, getSiteOrigin } from "./auth-email-helpers";

export const sendSiteEmailVerification = (user) =>
  sendEmailVerification(user, getEmailVerificationSettings());
