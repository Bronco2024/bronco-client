import { isListingExpired } from "./listing-expiry";

describe("listing expiry helper", () => {
  test("keeps listings with missing dates visible", () => {
    expect(isListingExpired(null)).toBe(false);
    expect(isListingExpired(undefined)).toBe(false);
  });

  test("supports Firestore Timestamp-like { seconds } objects", () => {
    const future = { seconds: Math.floor(Date.now() / 1000) + 86400 };
    const past = { seconds: Math.floor(Date.now() / 1000) - 86400 };
    expect(isListingExpired(future)).toBe(false);
    expect(isListingExpired(past)).toBe(true);
  });

  test("supports Date and toDate()", () => {
    const future = new Date(Date.now() + 86400000);
    const past = new Date(Date.now() - 86400000);
    expect(isListingExpired(future)).toBe(false);
    expect(isListingExpired(past)).toBe(true);
    expect(isListingExpired({ toDate: () => future })).toBe(false);
  });
});
