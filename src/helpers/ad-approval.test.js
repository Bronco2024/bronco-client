import {
  AD_STATUS,
  filterApprovedAds,
  getAdStatus,
  getInitialAdStatus,
  isAdApproved,
  isAdPending,
} from "./ad-approval";

describe("Ad approval helpers", () => {
  test("treats legacy ads without status as approved", () => {
    expect(getAdStatus({ id: "1" })).toBe(AD_STATUS.APPROVED);
    expect(isAdApproved({ id: "1" })).toBe(true);
  });

  test("returns pending status for regular users on publish", () => {
    expect(getInitialAdStatus(false)).toBe(AD_STATUS.PENDING);
    expect(getInitialAdStatus(true)).toBe(AD_STATUS.APPROVED);
  });

  test("filters only approved ads for public listings", () => {
    const ads = [
      { id: "1", status: AD_STATUS.APPROVED },
      { id: "2", status: AD_STATUS.PENDING },
      { id: "3", status: AD_STATUS.REJECTED },
      { id: "4" },
    ];

    expect(filterApprovedAds(ads).map((ad) => ad.id)).toEqual(["1", "4"]);
    expect(isAdPending(ads[1])).toBe(true);
  });
});
