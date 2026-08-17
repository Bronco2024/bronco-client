import {
  PET_CATEGORIES,
  PET_LISTINGS,
  SITE_SERVICES,
  filterListings,
  getCategoryBySlug,
  getListingsByCategory,
  mergeMarketplaceListings,
  normalizeMarketplaceAd,
} from "./pets";

describe("Pets & Bones catalog", () => {
  test("has a route for every animal category", () => {
    expect(PET_CATEGORIES.length).toBe(10);
    expect(getCategoryBySlug("dogs")?.name).toBe("כלבים");
    expect(getCategoryBySlug("cats")?.path).toBe("/cats");
  });

  test("returns only listings for the requested category", () => {
    const dogs = getListingsByCategory("כלבים");

    expect(dogs.length).toBeGreaterThan(0);
    expect(dogs.every((listing) => listing.category === "כלבים")).toBe(true);
  });

  test("filters listings by city and search text", () => {
    const byCity = filterListings(PET_LISTINGS, { location: "תל אביב" });
    expect(byCity.every((listing) => listing.location === "תל אביב")).toBe(true);

    const byText = filterListings(PET_LISTINGS, { searchText: "גולדן" });
    expect(byText.some((listing) => listing.name.includes("גולדן"))).toBe(true);
  });

  test("filters listings by category name", () => {
    const cats = filterListings(PET_LISTINGS, { category: "חתולים" });
    expect(cats.length).toBeGreaterThan(0);
    expect(cats.every((listing) => listing.category === "חתולים")).toBe(true);
  });

  test("exposes service routes used in the header", () => {
    expect(SITE_SERVICES.length).toBeGreaterThanOrEqual(6);
    expect(SITE_SERVICES.map((service) => service.path)).toEqual(
      expect.arrayContaining(["/veterinarians", "/boarding", "/accessories"])
    );
  });

  test("gives each catalog listing its own photo", () => {
    const images = PET_LISTINGS.map((listing) => listing.image);
    expect(new Set(images).size).toBe(PET_LISTINGS.length);
    expect(images.every((image) => image.startsWith("/listings/"))).toBe(true);
  });

  test("normalizes firebase ads into marketplace cards", () => {
    const normalized = normalizeMarketplaceAd({
      id: "fb-1",
      title: "כלב לאימוץ",
      category: "כלבים",
      photos: ["https://example.com/dog.jpg"],
      price: 0,
      forAdoption: true,
      ageYears: 1,
      ageMonths: 2,
    });

    expect(normalized.name).toBe("כלב לאימוץ");
    expect(normalized.image).toBe("https://example.com/dog.jpg");
    expect(normalized.type).toBe("כלב");
    expect(normalized.price).toBe("לאימוץ");
    expect(normalized.age).toBe("שנה ו-2 חודשים");
    expect(normalized.forAdoption).toBe(true);
  });

  test("keeps live firebase ads ahead of catalog fallbacks", () => {
    const merged = mergeMarketplaceListings(
      [{ id: "live-1", title: "מודעה חיה", category: "כלבים", photos: ["/dogs.jpg"] }],
      PET_LISTINGS
    );

    expect(merged[0].id).toBe("live-1");
    expect(merged[0].source).toBe("firebase");
    expect(merged.some((item) => item.id === "dog-1")).toBe(true);
  });
});
