import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { IsDateNowGreaterThanAdDate } from "@components/utils/constants/Functions";
import {
  isAdoptionListing,
  normalizeMarketplaceAd,
} from "@/data/pets";
import { filterApprovedAds } from "@/helpers/ad-approval";
import { isStoreListing } from "@/helpers/store-product";

export const fetchMarketplaceAds = async ({
  categoryName,
  adoptionOnly = false,
  limitCount = 40,
} = {}) => {
  const adsRef = collection(db, "ads");
  const constraints = [];

  if (categoryName) {
    constraints.push(where("category", "==", categoryName));
  } else {
    constraints.push(where("availableUntil", ">", new Date()));
  }

  // Mixed feeds exclude store products — over-fetch a little so recent ads stay full.
  const queryLimit = !categoryName
    ? Math.min(limitCount + 12, 80)
    : limitCount;

  constraints.push(orderBy("createdAt", "desc"), limit(queryLimit));

  const snapshot = await getDocs(query(adsRef, ...constraints));
  let ads = snapshot.docs.map((docSnap) =>
    normalizeMarketplaceAd({
      id: docSnap.id,
      ...docSnap.data(),
      source: "firebase",
    })
  );

  ads = ads.filter((ad) => !IsDateNowGreaterThanAdDate(ad.availableUntil));
  ads = filterApprovedAds(ads);

  // Store inventory belongs in /our-products — never in מודעות אחרונות / listings.
  if (categoryName !== "חנות") {
    ads = ads.filter((ad) => !isStoreListing(ad));
  }

  if (adoptionOnly) {
    ads = ads.filter(isAdoptionListing);
  }

  return ads.slice(0, limitCount);
};
