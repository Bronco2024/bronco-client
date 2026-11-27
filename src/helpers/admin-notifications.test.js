import {
  ADMIN_NOTIFICATION_TYPES,
  getNotificationTitle,
  shouldNotifyAdminForAd,
  getOrphanAdminNotifications,
  isStoreOrderNotification,
} from "./admin-notification-helpers";
import { AD_STATUS } from "./ad-approval";

describe("Admin notifications", () => {
  test("builds a readable title from ad fields", () => {
    expect(getNotificationTitle({ title: "גור חמוד" })).toBe("גור חמוד");
    expect(getNotificationTitle({ breed: "לברדור", category: "כלבים" })).toBe(
      "לברדור"
    );
    expect(getNotificationTitle({ category: "חתולים" })).toBe("חתולים");
    expect(
      getNotificationTitle({ title: "קולר", category: "חנות" })
    ).toBe("מוצר בחנות: קולר");
    expect(getNotificationTitle({ category: "חנות" })).toBe("מוצר חדש בחנות");
  });

  test("notifies only for pending ads", () => {
    expect(shouldNotifyAdminForAd(AD_STATUS.PENDING)).toBe(true);
    expect(shouldNotifyAdminForAd(AD_STATUS.APPROVED)).toBe(false);
    expect(shouldNotifyAdminForAd(AD_STATUS.REJECTED)).toBe(false);
  });

  test("uses stable notification types", () => {
    expect(ADMIN_NOTIFICATION_TYPES.PENDING_AD).toBe("pending_ad");
    expect(ADMIN_NOTIFICATION_TYPES.STORE_ORDER).toBe("store_order");
  });

  test("recognizes store order notifications", () => {
    expect(
      isStoreOrderNotification({ type: "store_order", orderId: "o1" })
    ).toBe(true);
    expect(isStoreOrderNotification({ orderId: "o1" })).toBe(true);
    expect(isStoreOrderNotification({ adId: "a1", type: "pending_ad" })).toBe(
      false
    );
  });

  test("treats notifications without a matching ad as orphans", () => {
    const orphans = getOrphanAdminNotifications(
      [
        { id: "n1", adId: "gone" },
        { id: "n2", adId: "keep" },
        { id: "n3", type: "store_order", orderId: "ord-1" },
      ],
      [{ id: "keep" }]
    );
    expect(orphans.map((item) => item.id)).toEqual(["n1"]);
  });
});