import { AD_STATUS } from "./ad-approval";

export const ADMIN_NOTIFICATION_TYPES = {
  PENDING_AD: "pending_ad",
};

export const getNotificationTitle = (ad = {}) =>
  ad.title ||
  ad.name ||
  ad.breed ||
  ad.category ||
  "מודעה חדשה";

export const shouldNotifyAdminForAd = (status) => status === AD_STATUS.PENDING;

export const getOrphanAdminNotifications = (notifications = [], ads = []) => {
  const existingIds = new Set(ads.map((ad) => ad.id).filter(Boolean));
  return notifications.filter(
    (notification) => notification.adId && !existingIds.has(notification.adId)
  );
};
