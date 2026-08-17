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
