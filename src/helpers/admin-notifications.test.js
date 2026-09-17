import {
  ADMIN_NOTIFICATION_TYPES,
  getNotificationTitle,
  shouldNotifyAdminForAd,
  getOrphanAdminNotifications,
} from "./admin-notification-helpers";
import { AD_STATUS } from "./ad-approval";

describe("Admin notifications", () => {
  test("builds a readable title from ad fields", () => {
    expect(getNotificationTitle({ title: "גור חמוד" })).toBe("גור חמוד");
    expect(getNotificationTitle({ breed: "לברדור", category: "כלבים" })).toBe(
      "לברדור"
    );
    expect(getNotificationTitle({ category: "חתולים" })).toBe("חתולים");
  });

  test("notifies only for pending ads", () => {
    expect(shouldNotifyAdminForAd(AD_STATUS.PENDING)).toBe(true);
    expect(shouldNotifyAdminForAd(AD_STATUS.APPROVED)).toBe(false);
    expect(shouldNotifyAdminForAd(AD_STATUS.REJECTED)).toBe(false);
  });

  test("uses a stable pending-ad notification type", () => {
    expect(ADMIN_NOTIFICATION_TYPES.PENDING_AD).toBe("pending_ad");
  });

  test("treats notifications without a matching ad as orphans", () => {
    const orphans = getOrphanAdminNotifications(
      [
        { id: "n1", adId: "gone" },
        { id: "n2", adId: "keep" },
      ],
      [{ id: "keep" }]
    );
    expect(orphans.map((item) => item.id)).toEqual(["n1"]);
  });
});