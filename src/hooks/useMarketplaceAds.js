import { useEffect, useMemo, useState } from "react";
import {
  getCatalogPool,
  mergeMarketplaceListings,
} from "@/data/pets";
import { fetchMarketplaceAds } from "@/helpers/marketplace-ads";

const useMarketplaceAds = ({
  categoryName,
  adoptionOnly = false,
  limitCount = 40,
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

  const catalogAds = useMemo(
    () => getCatalogPool({ categoryName, adoptionOnly }),
    [categoryName, adoptionOnly]
  );

  const listings = useMemo(
    () => mergeMarketplaceListings(liveAds, catalogAds),
    [liveAds, catalogAds]
  );

  return { listings, liveAds, loading };
};

export default useMarketplaceAds;
