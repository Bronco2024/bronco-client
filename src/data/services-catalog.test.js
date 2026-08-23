import {
  SERVICES_CATALOG,
  getFeaturedServices,
  getServicesForAnimal,
  adMatchesServiceAnimal,
  filterAdsByServiceAnimal,
} from "./services-catalog";

describe("services catalog", () => {
  test("includes new universal services", () => {
    const paths = SERVICES_CATALOG.map((service) => service.path);
    expect(paths).toEqual(
      expect.arrayContaining([
        "/transport",
        "/pet-sitting",
        "/training",
        "/veterinarians",
      ])
    );
  });

  test("filters services by animal type", () => {
    const forDogs = getServicesForAnimal("כלבים");
    expect(forDogs.some((service) => service.path === "/training")).toBe(true);
    expect(forDogs.some((service) => service.path === "/breeders")).toBe(false);
  });

  test("returns featured services for homepage", () => {
    expect(getFeaturedServices().length).toBeGreaterThanOrEqual(6);
  });

  test("matches ads by service_animals when provided", () => {
    const ad = { service_animals: ["כלבים", "חתולים"] };
    expect(adMatchesServiceAnimal(ad, "כלבים")).toBe(true);
    expect(adMatchesServiceAnimal(ad, "דגים")).toBe(false);
    expect(adMatchesServiceAnimal(ad, "all")).toBe(true);
    expect(adMatchesServiceAnimal({ service_animals: [] }, "כלבים")).toBe(true);
  });

  test("filters ad list by animal", () => {
    const ads = [
      { id: "1", service_animals: ["כלבים"] },
      { id: "2", service_animals: ["סוסים"] },
      { id: "3" },
    ];
    const filtered = filterAdsByServiceAnimal(ads, "כלבים");
    expect(filtered.map((ad) => ad.id)).toEqual(["1", "3"]);
  });
});
