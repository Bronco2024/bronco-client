/** Listing live window on Petzo (publish + renew). */

export const AD_LISTING_DURATION_MONTHS = 3;
export const AD_LISTING_DURATION_LEGACY_MONTHS = 1;

/** Stamp written on ads after the 1→3 month migration. */
export const AD_LISTING_DURATION_VERSION = AD_LISTING_DURATION_MONTHS;

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value.toDate === "function") {
    try {
      const date = value.toDate();
      return Number.isNaN(date.getTime()) ? null : date;
    } catch (_error) {
      return null;
    }
  }
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const addMonthsToDate = (fromDate = new Date(), months = AD_LISTING_DURATION_MONTHS) => {
  const base = toDate(fromDate) || new Date();
  const next = new Date(base.getTime());
  next.setMonth(next.getMonth() + months);
  return next;
};

/** Expiry for a newly published or renewed listing. */
export const getNewListingAvailableUntil = (fromDate = new Date()) =>
  addMonthsToDate(fromDate, AD_LISTING_DURATION_MONTHS);

export const needsListingDurationExtension = (ad = {}) =>
  Number(ad.listingDurationMonths) !== AD_LISTING_DURATION_VERSION;

/**
 * Extend a legacy 1-month expiry by the difference (2 months),
 * or set createdAt + 3 months when availableUntil is missing.
 */
export const getExtendedAvailableUntil = (ad = {}) => {
  const extra =
    AD_LISTING_DURATION_MONTHS - AD_LISTING_DURATION_LEGACY_MONTHS;
  const current = toDate(ad.availableUntil);
  if (current) return addMonthsToDate(current, extra);
  const created = toDate(ad.createdAt) || new Date();
  return addMonthsToDate(created, AD_LISTING_DURATION_MONTHS);
};
