import { doc, writeBatch } from "firebase/firestore";
import {
  AD_LISTING_DURATION_VERSION,
  getExtendedAvailableUntil,
  needsListingDurationExtension,
} from "./ad-listing-duration";

const BATCH_LIMIT = 400;

/**
 * One-shot client migration: extend legacy 1-month ads by +2 months
 * and stamp listingDurationMonths = 3 so it does not run again.
 */
export const extendAdsToThreeMonthDuration = async (db, ads = []) => {
  const targets = (Array.isArray(ads) ? ads : []).filter(
    (ad) => ad?.id && needsListingDurationExtension(ad)
  );
  if (!targets.length) return { updated: 0 };

  let updated = 0;
  for (let i = 0; i < targets.length; i += BATCH_LIMIT) {
    const slice = targets.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);
    slice.forEach((ad) => {
      batch.update(doc(db, "ads", ad.id), {
        availableUntil: getExtendedAvailableUntil(ad),
        listingDurationMonths: AD_LISTING_DURATION_VERSION,
      });
    });
    await batch.commit();
    updated += slice.length;
  }

  return { updated };
};
