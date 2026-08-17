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

  constraints.push(orderBy("createdAt", "desc"), limit(limitCount));

  const snapshot = await getDocs(query(adsRef, ...constraints));
  let ads = snapshot.docs.map((docSnap) =>
    normalizeMarketplaceAd({
      id: docSnap.id,
      ...docSnap.data(),
      source: "firebase",
    })
  );

  ads = ads.filter((ad) => !IsDateNowGreaterThanAdDate(ad.availableUntil));

  if (adoptionOnly) {
    ads = ads.filter(isAdoptionListing);
  }

  return ads;
};
