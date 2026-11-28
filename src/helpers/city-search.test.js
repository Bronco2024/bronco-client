import { filterCitiesByQuery, normalizeCityQuery } from "./city-search";

describe("city-search", () => {
  test("ignores geresh and dashes when matching", () => {
    expect(normalizeCityQuery("סח'נין")).toBe(normalizeCityQuery("סחנין"));
    expect(normalizeCityQuery("שגב-שלום")).toBe(normalizeCityQuery("שגב שלום"));
  });

  test("prefers prefix matches", () => {
    const result = filterCitiesByQuery(
      ["נצרת", "נוף הגליל", "נהריה", "חיפה"],
      "נצ"
    );
    expect(result[0]).toBe("נצרת");
  });
});
