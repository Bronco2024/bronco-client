const toComparableDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") {
    try {
      return value.toDate();
    } catch (_error) {
      return null;
    }
  }
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * True when listing expiry is in the past.
 * Missing/invalid dates stay visible (fail open).
 */
export const isListingExpired = (adAvailableUntil) => {
  const timeOfAd = toComparableDate(adAvailableUntil);
  if (!timeOfAd) return false;
  return Date.now() > timeOfAd.getTime();
};
