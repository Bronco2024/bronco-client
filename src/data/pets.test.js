import {
  PET_CATEGORIES,
  PET_LISTINGS,
  filterListings,
  getCategoryBySlug,
  getListingsByCategory,
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
});
