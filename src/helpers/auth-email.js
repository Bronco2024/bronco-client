import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import {
  getEmailVerificationSettings,
  getPasswordResetSettings,
  getSiteOrigin,
} from "./auth-email-helpers";

export {
  getEmailVerificationSettings,
  getPasswordResetSettings,
  getSiteOrigin,
} from "./auth-email-helpers";

const postJson = async (path, payload) => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }

  return { ok: response.ok, status: response.status, data };
};

/**
 * Prefer Petzo-branded Netlify function email.
 * Falls back to Firebase default template if the function is unavailable
 * (local dev without secrets, or misconfigured deploy).
 */
export const sendSiteEmailVerification = async (user) => {
  if (!user) {
    throw new Error("Missing user for email verification");
  }

  try {
    const idToken = await user.getIdToken(true);
    const result = await postJson("/.netlify/functions/send-verification-email", {
      idToken,
    });

    if (result.ok) {
      return { provider: "petzo", ...result.data };
    }

    console.warn(
      "Custom verification email failed, falling back to Firebase",
      result.data
    );
  } catch (error) {
    console.warn("Custom verification email error, falling back to Firebase", error);
  }

  await sendEmailVerification(user, getEmailVerificationSettings());
  return { provider: "firebase" };
};

export const sendSitePasswordReset = async (email) => {
  const cleanEmail = String(email || "").trim();
  if (!cleanEmail) {
    throw new Error("Missing email for password reset");
  }

  try {
    const result = await postJson(
      "/.netlify/functions/send-password-reset-email",
      { email: cleanEmail }
    );

    if (result.ok) {
      return { provider: "petzo", ...result.data };
    }

    console.warn(
      "Custom password reset email failed, falling back to Firebase",
      result.data
    );
  } catch (error) {
    console.warn("Custom password reset email error, falling back to Firebase", error);
  }

  await sendPasswordResetEmail(
    auth,
    cleanEmail,
    getPasswordResetSettings()
  );
  return { provider: "firebase" };
};
