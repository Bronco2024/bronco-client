import {
  filterVisibleBuyerPurchases,
  PURCHASE_STATUS,
  getPurchaseJourneyIndex,
  getPurchaseStatusLabel,
  getPurchaseThumbnails,
} from "./purchase-status";

describe("purchase-status", () => {
  test("labels Hebrew statuses", () => {
    expect(getPurchaseStatusLabel(PURCHASE_STATUS.PENDING)).toBe(
      "קיבלנו את ההזמנה"
    );
    expect(getPurchaseStatusLabel(PURCHASE_STATUS.SENT)).toBe("בדרך אליכם");
    expect(getPurchaseStatusLabel(PURCHASE_STATUS.DELIVERED)).toBe("הגיע הביתה");
  });

  test("maps statuses onto the doorstep journey", () => {
    expect(getPurchaseJourneyIndex(PURCHASE_STATUS.PENDING)).toBe(0);
    expect(getPurchaseJourneyIndex(PURCHASE_STATUS.CONFIRMED)).toBe(1);
    expect(getPurchaseJourneyIndex(PURCHASE_STATUS.SENT)).toBe(2);
    expect(getPurchaseJourneyIndex(PURCHASE_STATUS.DELIVERED)).toBe(3);
    expect(getPurchaseJourneyIndex(PURCHASE_STATUS.CANCEL)).toBe(-1);
  });

  test("collects item thumbnails", () => {
    expect(
      getPurchaseThumbnails({
        items: [
          { photos: ["a.jpg"] },
          { image: "b.jpg" },
          { photos: [] },
        ],
      })
    ).toEqual(["a.jpg", "b.jpg"]);
  });

  test("hides cancelled and replaced awaiting_payment duplicates", () => {
    const visible = filterVisibleBuyerPurchases([
      {
        id: "cod",
        status: PURCHASE_STATUS.DELIVERED,
        totalPrice: 850,
        totalQuantity: 6,
      },
      {
        id: "ghost",
        status: PURCHASE_STATUS.AWAITING_PAYMENT,
        totalPrice: 850,
        totalQuantity: 6,
      },
      {
        id: "cancelled",
        status: PURCHASE_STATUS.CANCEL,
        totalPrice: 100,
        totalQuantity: 1,
      },
      {
        id: "open-other",
        status: PURCHASE_STATUS.AWAITING_PAYMENT,
        totalPrice: 50,
        totalQuantity: 1,
      },
    ]);
    expect(visible.map((item) => item.id)).toEqual(["cod", "open-other"]);
  });
});
