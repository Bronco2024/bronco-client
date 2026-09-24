import ISRAEL_CITIES from "./israel-cities";
import { getCitiesByArea } from "./city-areas";

describe("israel cities and north area", () => {
  test("includes Sakhnin and major Galilee towns", () => {
    expect(ISRAEL_CITIES).toEqual(
      expect.arrayContaining([
        "סחנין",
        "עראבה",
        "דיר חנא",
        "מג'ד אל-כרום",
        "קצרין",
        "מטולה",
        "שלומי",
        "תמרה",
        "בית שאן",
      ])
    );
  });

  test("north area lists Sakhnin and expanded Galilee cities", () => {
    const north = getCitiesByArea("north");
    expect(north).toEqual(
      expect.arrayContaining([
        "סחנין",
        "נצרת",
        "שפרעם",
        "עראבה",
        "תמרה",
        "בית שאן",
        "קצרין",
      ])
    );
    expect(north.every((city) => ISRAEL_CITIES.includes(city))).toBe(true);
  });

  test("cities list stays sorted alphabetically in Hebrew", () => {
    const sorted = [...ISRAEL_CITIES].sort((a, b) => a.localeCompare(b, "he"));
    expect(ISRAEL_CITIES).toEqual(sorted);
  });
});
