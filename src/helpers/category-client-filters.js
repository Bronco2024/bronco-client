/** Client-side marketplace filters — avoids Firestore composite-index failures. */

export const parseNumericPrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const normalized = Number(price.replace(/[^\d.-]/g, ""));
    return Number.isFinite(normalized) ? normalized : Number.MAX_SAFE_INTEGER;
  }
  return Number.MAX_SAFE_INTEGER;
};

export const sortAdsByPreference = (items = [], sortBy = "newest") => {
  const sorted = [...items];
  if (sortBy === "priceAsc") {
    sorted.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
  } else if (sortBy === "priceDesc") {
    sorted.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
  }
  return sorted;
};

export const matchesSeedFilters = (ad, filters = {}) => {
  const minPrice = Number(filters.minPrice) || 0;
  const maxPrice =
    filters.maxPrice === "" || filters.maxPrice == null
      ? Number.MAX_SAFE_INTEGER
      : Number(filters.maxPrice);
  const price = parseNumericPrice(ad.price);

  if (minPrice && price < minPrice) return false;
  if (maxPrice < 999999 && price > maxPrice) return false;
  if (filters.seed_animal && ad.seed_animal !== filters.seed_animal) return false;
  if (filters.seed_type && ad.seed_type !== filters.seed_type) return false;
  if (filters.semen_type && ad.semen_type !== filters.semen_type) return false;
  if (filters.location && ad.location !== filters.location) return false;
  if (filters.hasCertificate === "yes" && !ad.hasCertificate) return false;
  if (filters.hasCertificate === "no" && ad.hasCertificate) return false;
  return true;
};

export const filterSeedAds = (ads = [], filters = {}) =>
  ads.filter((ad) => matchesSeedFilters(ad, filters));
