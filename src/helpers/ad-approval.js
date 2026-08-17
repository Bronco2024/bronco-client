export const AD_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const AD_STATUS_LABELS = {
  [AD_STATUS.PENDING]: "ממתין לאישור",
  [AD_STATUS.APPROVED]: "מאושר",
  [AD_STATUS.REJECTED]: "נדחה",
};

export const getAdStatus = (ad) => ad?.status || AD_STATUS.APPROVED;

export const isAdApproved = (ad) => getAdStatus(ad) === AD_STATUS.APPROVED;

export const isAdPending = (ad) => getAdStatus(ad) === AD_STATUS.PENDING;

export const isAdRejected = (ad) => getAdStatus(ad) === AD_STATUS.REJECTED;

export const filterApprovedAds = (ads = []) => ads.filter(isAdApproved);

export const mapApprovedAdsFromSnapshot = (snapshot) =>
  filterApprovedAds(
    snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
  );

export const getInitialAdStatus = (isAdmin) =>
  isAdmin ? AD_STATUS.APPROVED : AD_STATUS.PENDING;

export const getAdStatusAfterUpdate = (isAdmin) =>
  isAdmin ? AD_STATUS.APPROVED : AD_STATUS.PENDING;
