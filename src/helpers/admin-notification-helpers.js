import { AD_STATUS } from "./ad-approval";

export const ADMIN_NOTIFICATION_TYPES = {
  PENDING_AD: "pending_ad",
};

export const getNotificationTitle = (ad = {}) => {
  const title =
    ad.title ||
    ad.name ||
    ad.breed ||
    ad.seed_type ||
    ad.accessory ||
    "";

  if (ad.category === "חנות" || ad.listingKind === "store") {
    return title ? `מוצר בחנות: ${title}` : "מוצר חדש בחנות";
  }

  return title || ad.category || "מודעה חדשה";
};

export const shouldNotifyAdminForAd = (status) => status === AD_STATUS.PENDING;

export const getOrphanAdminNotifications = (notifications = [], ads = []) => {
  const existingIds = new Set(ads.map((ad) => ad.id).filter(Boolean));
  return notifications.filter(
    (notification) => notification.adId && !existingIds.has(notification.adId)
  );
};
