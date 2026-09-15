import { useEffect, useMemo, useState } from "react";
import {
  getCatalogPool,
  mergeMarketplaceListings,
} from "@/data/pets";
import { fetchMarketplaceAds } from "@/helpers/marketplace-ads";

/**
 * Live marketplace ads from Firestore.
 * Catalog demo pets are OFF by default for public launch —
 * pass includeCatalog: true only for local demos.
 */
const useMarketplaceAds = ({
  categoryName,
  adoptionOnly = false,
  limitCount = 40,
  includeCatalog = false,
} = {}) => {
  const [liveAds, setLiveAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAds = async () => {
      setLoading(true);
      try {
        const ads = await fetchMarketplaceAds({
          categoryName,
          adoptionOnly,
          limitCount,
        });
        if (!cancelled) setLiveAds(ads);
      } catch {
        if (!cancelled) setLiveAds([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAds();

    return () => {
      cancelled = true;
    };
  }, [categoryName, adoptionOnly, limitCount]);

  const catalogAds = useMemo(() => {
    if (!includeCatalog) return [];
    return getCatalogPool({ categoryName, adoptionOnly });
  }, [categoryName, adoptionOnly, includeCatalog]);

  const listings = useMemo(
    () => mergeMarketplaceListings(liveAds, catalogAds),
    [liveAds, catalogAds]
  );

  return { listings, liveAds, loading };
};

export default useMarketplaceAds;
