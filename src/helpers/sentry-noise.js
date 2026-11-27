/**
 * Transient / environment noise that should not page Sentry.
 * Keep heuristics here so they stay unit-tested.
 */

import { isExpectedAuthError } from "./auth-errors";

export function isExpectedAuthNoise(error, event) {
  if (isExpectedAuthError(error)) return true;
  const message = String(
    (error && error.message) ||
      event?.exception?.values?.[0]?.value ||
      ""
  );
  return /Firebase:\s*Error\s*\(auth\/invalid-credential\)/i.test(message);
}

export function isFirestoreConnectionNoise(error, event) {
  const message = String(
    (error && error.message) ||
      event?.exception?.values?.[0]?.value ||
      ""
  );
  const type = String(
    (error && error.name) ||
      event?.exception?.values?.[0]?.type ||
      ""
  );
  const code = String((error && error.code) || "");
  const frames =
    event?.exception?.values?.[0]?.stacktrace?.frames || [];
  const frameFiles = frames.map((frame) =>
    String(frame?.filename || frame?.abs_path || "")
  );
  const fromFirestoreTransport = frameFiles.some((file) =>
    /webchannel_connection|firestore/i.test(file)
  );

  if (/client is offline/i.test(message)) {
    return true;
  }

  if (
    /Connection failed/i.test(message) &&
    (type === "FirebaseError" ||
      fromFirestoreTransport ||
      /firestore/i.test(code))
  ) {
    return true;
  }

  if (
    (code === "unavailable" || code === "firestore/unavailable") &&
    (fromFirestoreTransport || type === "FirebaseError")
  ) {
    return true;
  }

  return false;
}
