import {
  AD_LISTING_DURATION_MONTHS,
  AD_LISTING_DURATION_VERSION,
  addMonthsToDate,
  getExtendedAvailableUntil,
  getNewListingAvailableUntil,
  needsListingDurationExtension,
} from "./ad-listing-duration";

describe("ad listing duration", () => {
  test("defaults to 3 months", () => {
    expect(AD_LISTING_DURATION_MONTHS).toBe(3);
    expect(AD_LISTING_DURATION_VERSION).toBe(3);
  });

  test("new listing expiry is +3 months", () => {
    const from = new Date("2026-01-15T12:00:00Z");
    const until = getNewListingAvailableUntil(from);
    expect(until.getUTCFullYear()).toBe(2026);
    expect(until.getUTCMonth()).toBe(3); // April
    expect(until.getUTCDate()).toBe(15);
  });

  test("extends legacy availableUntil by 2 months", () => {
    const ad = {
      availableUntil: new Date("2026-02-15T12:00:00Z"),
      createdAt: new Date("2026-01-15T12:00:00Z"),
    };
    const extended = getExtendedAvailableUntil(ad);
    expect(extended.getUTCMonth()).toBe(3); // April = Feb + 2
    expect(extended.getUTCDate()).toBe(15);
  });

  test("falls back to createdAt + 3 months when no availableUntil", () => {
    const ad = { createdAt: new Date("2026-01-10T12:00:00Z") };
    const extended = getExtendedAvailableUntil(ad);
    expect(extended.getUTCMonth()).toBe(3);
    expect(extended.getUTCDate()).toBe(10);
  });

  test("needs extension until stamped with version 3", () => {
    expect(needsListingDurationExtension({})).toBe(true);
    expect(needsListingDurationExtension({ listingDurationMonths: 1 })).toBe(
      true
    );
    expect(needsListingDurationExtension({ listingDurationMonths: 3 })).toBe(
      false
    );
  });

  test("addMonthsToDate supports custom month counts", () => {
    const from = new Date("2026-06-01T00:00:00Z");
    expect(addMonthsToDate(from, 1).getUTCMonth()).toBe(6);
  });
});
