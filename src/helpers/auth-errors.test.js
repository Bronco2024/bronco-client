import { getAuthErrorMessage, isExpectedAuthError } from "./auth-errors";

describe("auth error messages", () => {
  test("maps unauthorized domain guidance", () => {
    expect(getAuthErrorMessage("auth/unauthorized-domain")).toContain(
      "petzo.co.il"
    );
  });

  test("maps Google popup closed", () => {
    expect(getAuthErrorMessage("auth/popup-closed-by-user")).toContain("Google");
  });

  test("maps invalid credential to wrong email/password copy", () => {
    expect(getAuthErrorMessage("auth/invalid-credential")).toContain("סיסמה");
  });

  test("falls back for unknown codes", () => {
    expect(getAuthErrorMessage("auth/something-else", "בדיקה")).toBe("בדיקה");
  });

  test("treats wrong password as expected auth noise", () => {
    expect(isExpectedAuthError("auth/invalid-credential")).toBe(true);
    expect(
      isExpectedAuthError({ code: "auth/invalid-credential" })
    ).toBe(true);
    expect(isExpectedAuthError("auth/email-already-in-use")).toBe(true);
    expect(isExpectedAuthError("auth/network-request-failed")).toBe(false);
  });
});
