import { Timestamp } from "firebase/firestore";

/**
 * Normalize Date / Timestamp / {seconds,nanoseconds} for Firestore writes.
 * Falls back to now when the source value is missing or invalid.
 */
export const toFirestoreTimestamp = (value, fallback = () => Timestamp.now()) => {
  if (value instanceof Timestamp) return value;

  if (value && typeof value.toDate === "function") {
    try {
      const date = value.toDate();
      if (date instanceof Date && !Number.isNaN(date.getTime())) {
        return Timestamp.fromDate(date);
      }
    } catch (_error) {
      // fall through
    }
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return Timestamp.fromDate(value);
  }

  if (value && typeof value.seconds === "number") {
    return new Timestamp(value.seconds, value.nanoseconds || 0);
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return Timestamp.fromDate(date);
    }
  }

  return typeof fallback === "function" ? fallback() : fallback;
};
