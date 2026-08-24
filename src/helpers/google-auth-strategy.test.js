import {
  shouldPreferGoogleRedirect,
  shouldFallbackGooglePopupToRedirect,
} from "./google-auth-strategy";

describe("google auth strategy", () => {
  test("prefers redirect on iPhone", () => {
    expect(
      shouldPreferGoogleRedirect(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
      )
    ).toBe(true);
  });

  test("prefers redirect on desktop Safari", () => {
    expect(
      shouldPreferGoogleRedirect(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
      )
    ).toBe(true);
  });

  test("allows popup on Chrome desktop", () => {
    expect(
      shouldPreferGoogleRedirect(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      )
    ).toBe(false);
  });

  test("falls back to redirect when popup is blocked", () => {
    expect(shouldFallbackGooglePopupToRedirect("auth/popup-blocked")).toBe(
      true
    );
    expect(
      shouldFallbackGooglePopupToRedirect("auth/popup-closed-by-user")
    ).toBe(false);
  });
});
