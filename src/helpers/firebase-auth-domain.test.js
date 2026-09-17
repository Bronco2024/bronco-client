import { resolveFirebaseAuthDomain } from "./firebase-auth-domain";

describe("resolveFirebaseAuthDomain", () => {
  test("uses env authDomain when provided", () => {
    expect(
      resolveFirebaseAuthDomain({
        envAuthDomain: "bronco-65aaf.firebaseapp.com",
      })
    ).toBe("bronco-65aaf.firebaseapp.com");
  });

  test("falls back to Firebase hosting domain", () => {
    expect(resolveFirebaseAuthDomain({})).toBe(
      "bronco-65aaf.firebaseapp.com"
    );
  });

  test("allows explicit custom domain from env after Google Cloud is ready", () => {
    expect(
      resolveFirebaseAuthDomain({
        envAuthDomain: "petzo.co.il",
      })
    ).toBe("petzo.co.il");
  });
});
