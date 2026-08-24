import { getAuthErrorMessage } from "./auth-errors";

describe("auth error messages", () => {
  test("maps unauthorized domain guidance", () => {
    expect(getAuthErrorMessage("auth/unauthorized-domain")).toContain(
      "petzo.co.il"
    );
  });

  test("maps Google popup closed", () => {
    expect(getAuthErrorMessage("auth/popup-closed-by-user")).toContain("Google");
  });

  test("falls back for unknown codes", () => {
    expect(getAuthErrorMessage("auth/something-else", "בדיקה")).toBe("בדיקה");
  });
});
