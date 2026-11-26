import {
  getStoreListingAvailableUntil,
  getStoreProductTitle,
  isStoreCategory,
  isStoreListing,
  STORE_LISTING_DURATION_MONTHS,
} from "./store-product";

describe("store-product helpers", () => {
  test("detects store category and listings", () => {
    expect(isStoreCategory("חנות")).toBe(true);
    expect(isStoreListing({ category: "חנות" })).toBe(true);
    expect(isStoreListing({ listingKind: "store" })).toBe(true);
    expect(isStoreListing({ category: "כלבים" })).toBe(false);
  });

  test("builds a long store shelf life", () => {
    const from = new Date("2026-01-15T12:00:00Z");
    const until = getStoreListingAvailableUntil(from);
    const months =
      (until.getFullYear() - from.getFullYear()) * 12 +
      (until.getMonth() - from.getMonth());
    expect(months).toBe(STORE_LISTING_DURATION_MONTHS);
  });

  test("prefers product title", () => {
    expect(getStoreProductTitle({ title: "קולר כתום" })).toBe("קולר כתום");
    expect(getStoreProductTitle({ category: "חנות" })).toBe("מוצר בחנות");
  });
});
