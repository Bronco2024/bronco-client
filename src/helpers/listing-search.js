const SEARCH_FIELDS = [
  "name",
  "title",
  "category",
  "location",
  "breed",
  "accessory",
  "seed_type",
  "seed_animal",
  "type",
  "description",
  "contact",
];

export const matchesListingSearch = (ad, searchText = "") => {
  const query = String(searchText || "").trim().toLowerCase();
  if (!query) return true;

  return SEARCH_FIELDS.some((field) => {
    const value = ad?.[field];
    return value != null && String(value).toLowerCase().includes(query);
  });
};

export const filterAdsBySearch = (ads, searchText = "") => {
  const query = String(searchText || "").trim();
  if (!query) return ads;
  return ads.filter((ad) => matchesListingSearch(ad, query));
};
