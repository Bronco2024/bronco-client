const { sanitizeGrowText, getGrowConfig } = require("../../netlify/functions/_lib/grow");

describe("grow helpers", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test("sanitizes grow text", () => {
    expect(sanitizeGrowText("שלום! @Petzo #1")).toBe("שלום Petzo 1");
  });

  test("reports when grow is not configured", () => {
    process.env = { ...originalEnv };
    delete process.env.GROW_USER_ID;
    delete process.env.GROW_PAGE_CODE;
    expect(getGrowConfig().configured).toBe(false);
  });

  test("uses live host when GROW_ENV=live", () => {
    process.env = {
      ...originalEnv,
      GROW_USER_ID: "u",
      GROW_PAGE_CODE: "p",
      GROW_ENV: "live",
    };
    const config = getGrowConfig();
    expect(config.configured).toBe(true);
    expect(config.baseUrl).toContain("secure.meshulam.co.il");
  });
});
