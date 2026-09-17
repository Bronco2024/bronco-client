import {
  sanitizeAuthReturnPath,
  stashAuthReturnTo,
  consumeAuthReturnTo,
  resolveAuthReturnTo,
  AUTH_RETURN_STORAGE_KEY,
} from "./auth-return";

describe("auth return helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("accepts internal paths with query", () => {
    expect(sanitizeAuthReturnPath("/publish_ad?type=service")).toBe(
      "/publish_ad?type=service"
    );
  });

  test("rejects external or login loops", () => {
    expect(sanitizeAuthReturnPath("https://evil.com")).toBe("");
    expect(sanitizeAuthReturnPath("//evil.com")).toBe("");
    expect(sanitizeAuthReturnPath("/login")).toBe("");
    expect(sanitizeAuthReturnPath("/register")).toBe("");
  });

  test("stashes and consumes return path for Google redirect", () => {
    stashAuthReturnTo("/publish_ad");
    expect(sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY)).toBe("/publish_ad");
    expect(consumeAuthReturnTo("/")).toBe("/publish_ad");
    expect(sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY)).toBe(null);
  });

  test("resolve prefers query next and clears stash", () => {
    stashAuthReturnTo("/profile");
    expect(
      resolveAuthReturnTo({ searchNext: "/publish_ad", fallback: "/" })
    ).toBe("/publish_ad");
    expect(sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY)).toBe(null);
  });
});
