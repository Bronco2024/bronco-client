import {
  filterSeedAds,
  matchesSeedFilters,
  sortAdsByPreference,
  parseNumericPrice,
} from "./category-client-filters";

describe("category client filters", () => {
  const ads = [
    {
      id: "1",
      price: "100",
      seed_animal: "כלב",
      seed_type: "A",
      semen_type: "טרי",
      location: "תל אביב",
      hasCertificate: true,
    },
    {
      id: "2",
      price: 500,
      seed_animal: "סוס",
      seed_type: "B",
      semen_type: "קפוא",
      location: "חיפה",
      hasCertificate: false,
    },
  ];

  test("parses numeric prices from strings", () => {
    expect(parseNumericPrice("₪1,200")).toBe(1200);
  });

  test("filters by seed animal and certificate", () => {
    const filtered = filterSeedAds(ads, {
      seed_animal: "כלב",
      hasCertificate: "yes",
      minPrice: 0,
      maxPrice: 999999,
    });
    expect(filtered.map((ad) => ad.id)).toEqual(["1"]);
  });

  test("matchesSeedFilters rejects wrong location", () => {
    expect(
      matchesSeedFilters(ads[0], {
        location: "חיפה",
        minPrice: 0,
        maxPrice: 999999,
      })
    ).toBe(false);
  });

  test("sorts by price ascending", () => {
    const sorted = sortAdsByPreference(ads, "priceAsc");
    expect(sorted.map((ad) => ad.id)).toEqual(["1", "2"]);
  });
});
