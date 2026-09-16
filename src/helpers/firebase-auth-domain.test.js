import { resolveFirebaseAuthDomain } from "./firebase-auth-domain";

describe("resolveFirebaseAuthDomain", () => {
  test("uses petzo.co.il on the live site", () => {
    expect(
      resolveFirebaseAuthDomain({
        hostname: "petzo.co.il",
        envAuthDomain: "bronco-65aaf.firebaseapp.com",
      })
    ).toBe("petzo.co.il");
  });

  test("uses www.petzo.co.il when present", () => {
    expect(
      resolveFirebaseAuthDomain({
        hostname: "www.petzo.co.il",
        envAuthDomain: "bronco-65aaf.firebaseapp.com",
      })
    ).toBe("www.petzo.co.il");
  });

  test("falls back to env authDomain on localhost", () => {
    expect(
      resolveFirebaseAuthDomain({
        hostname: "localhost",
        envAuthDomain: "bronco-65aaf.firebaseapp.com",
      })
    ).toBe("bronco-65aaf.firebaseapp.com");
  });
});
