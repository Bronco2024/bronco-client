import {
  resolveFirebaseAuthDomain,
  isSameOriginAuthDomain,
} from "./firebase-auth-domain";

describe("resolveFirebaseAuthDomain", () => {
  test("uses env authDomain when provided off-site", () => {
    expect(
      resolveFirebaseAuthDomain({
        envAuthDomain: "bronco-65aaf.firebaseapp.com",
        hostname: "localhost",
      })
    ).toBe("bronco-65aaf.firebaseapp.com");
  });

  test("uses petzo.co.il on the production site host", () => {
    expect(
      resolveFirebaseAuthDomain({ hostname: "petzo.co.il" })
    ).toBe("petzo.co.il");
    expect(
      resolveFirebaseAuthDomain({ hostname: "www.petzo.co.il" })
    ).toBe("petzo.co.il");
  });

  test("ignores firebaseapp env override on petzo.co.il (Safari fix)", () => {
    expect(
      resolveFirebaseAuthDomain({
        envAuthDomain: "bronco-65aaf.firebaseapp.com",
        hostname: "petzo.co.il",
      })
    ).toBe("petzo.co.il");
  });

  test("falls back to Firebase hosting domain off-site", () => {
    expect(resolveFirebaseAuthDomain({})).toBe(
      "bronco-65aaf.firebaseapp.com"
    );
    expect(
      resolveFirebaseAuthDomain({ hostname: "localhost" })
    ).toBe("bronco-65aaf.firebaseapp.com");
  });

  test("detects same-origin auth domain", () => {
    expect(isSameOriginAuthDomain("petzo.co.il", "petzo.co.il")).toBe(true);
    expect(isSameOriginAuthDomain("petzo.co.il", "www.petzo.co.il")).toBe(
      true
    );
    expect(
      isSameOriginAuthDomain("bronco-65aaf.firebaseapp.com", "petzo.co.il")
    ).toBe(false);
  });
});
