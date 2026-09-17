import {
  buildPasswordResetEmail,
  buildVerificationEmail,
} from "./auth-email-templates";

describe("Petzo auth email templates", () => {
  test("verification email is branded Petzo", () => {
    const email = buildVerificationEmail({
      displayName: "Bronco",
      link: "https://petzo.co.il/verify-test",
    });

    expect(email.subject).toContain("Petzo");
    expect(email.subject).not.toContain("Horsehub");
    expect(email.html).toContain("Petzo");
    expect(email.html).toContain("https://petzo.co.il/verify-test");
    expect(email.html).toContain("Bronco");
    expect(email.text).toContain("צוות Petzo");
  });

  test("password reset email is branded Petzo", () => {
    const email = buildPasswordResetEmail({
      link: "https://petzo.co.il/reset-test",
    });

    expect(email.subject).toContain("איפוס סיסמה");
    expect(email.subject).toContain("Petzo");
    expect(email.html).toContain("איפוס סיסמה");
    expect(email.html).not.toContain("Horsehub");
  });
});
