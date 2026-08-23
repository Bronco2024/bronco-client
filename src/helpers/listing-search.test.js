import { filterAdsBySearch, matchesListingSearch } from "./listing-search";

describe("listing-search", () => {
  test("matches listing fields by search text", () => {
    const ad = {
      title: "פנסיון לכלבים",
      description: "שירות מעולה",
      location: "תל אביב",
    };

    expect(matchesListingSearch(ad, "פנסיון")).toBe(true);
    expect(matchesListingSearch(ad, "חתול")).toBe(false);
    expect(matchesListingSearch(ad, "")).toBe(true);
  });

  test("filters ad arrays by search query", () => {
    const ads = [
      { title: "וטרינר מומחה" },
      { title: "פנסיון כלבים" },
    ];

    const filtered = filterAdsBySearch(ads, "וטרינר");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("וטרינר מומחה");
  });
});
