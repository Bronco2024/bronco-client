import {
  shouldPreferGoogleRedirect,
  shouldFallbackGooglePopupToRedirect,
  isInAppBrowser,
  getExternalBrowserOpenUrl,
  IN_APP_BROWSER_AUTH_CODE,
  consumeGoogleRedirectError,
  stashGoogleRedirectError,
  GOOGLE_REDIRECT_ERROR_KEY,
} from "./google-auth-strategy";

describe("google auth strategy", () => {
  test("detects Facebook in-app browser", () => {
    expect(
      isInAppBrowser(
        "Mozilla/5.0 (Linux; Android 14; SM-A256E) AppleWebKit/537.36 Facebook 578.0.0"
      )
    ).toBe(true);
  });

  test("detects Instagram in-app browser", () => {
    expect(
      isInAppBrowser(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Instagram 312.0.0"
      )
    ).toBe(true);
  });

  test("does not flag Chrome mobile as in-app", () => {
    expect(
      isInAppBrowser(
        "Mozilla/5.0 (Linux; Android 14; SM-A256E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      )
    ).toBe(false);
  });

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

  test("prefers popup on Android Chrome (redirect loses result across domains)", () => {
    expect(
      shouldPreferGoogleRedirect(
        "Mozilla/5.0 (Linux; Android 14; SM-A256E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      )
    ).toBe(false);
  });

  test("allows popup on Chrome desktop", () => {
    expect(
      shouldPreferGoogleRedirect(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      )
    ).toBe(false);
  });

  test("falls back to redirect when popup is blocked or network fails", () => {
    expect(shouldFallbackGooglePopupToRedirect("auth/popup-blocked")).toBe(
      true
    );
    expect(
      shouldFallbackGooglePopupToRedirect("auth/network-request-failed")
    ).toBe(true);
    expect(
      shouldFallbackGooglePopupToRedirect("auth/popup-closed-by-user")
    ).toBe(false);
  });

  test("builds Android Chrome intent URL", () => {
    const url = getExternalBrowserOpenUrl(
      "https://petzo.co.il/login",
      "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Facebook 578.0.0"
    );
    expect(url).toContain("intent://petzo.co.il/login");
    expect(url).toContain("package=com.android.chrome");
  });

  test("exports in-app auth code", () => {
    expect(IN_APP_BROWSER_AUTH_CODE).toBe("auth/in-app-browser");
  });

  test("stashes and consumes redirect errors", () => {
    sessionStorage.removeItem(GOOGLE_REDIRECT_ERROR_KEY);
    stashGoogleRedirectError("auth/network-request-failed");
    expect(consumeGoogleRedirectError()).toBe("auth/network-request-failed");
    expect(consumeGoogleRedirectError()).toBe("");
  });
});
