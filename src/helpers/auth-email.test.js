import { getEmailVerificationSettings, getSiteOrigin } from "./auth-email-helpers";
import { SITE_URL } from "../data/site-config";

describe("Auth verification email settings", () => {
  test("points the continue link back to the login page", () => {
    const settings = getEmailVerificationSettings();

    expect(settings.url).toBe(`${getSiteOrigin()}/login`);
    expect(settings.handleCodeInApp).toBe(false);
  });

  test("falls back to the public site URL outside the browser", () => {
    expect(SITE_URL).toContain("petbones.netlify.app");
  });
});
