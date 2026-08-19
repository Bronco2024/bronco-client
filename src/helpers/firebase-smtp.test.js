import { CONTACT_EMAIL, SITE_NAME } from "../data/site-config";
import { getFirebaseSmtpRecommendation } from "./firebase-smtp";

describe("Firebase SMTP recommendation", () => {
  test("uses the public Petzo contact email as sender", () => {
    const smtp = getFirebaseSmtpRecommendation();

    expect(smtp.fromEmail).toBe(CONTACT_EMAIL);
    expect(smtp.replyTo).toBe(CONTACT_EMAIL);
    expect(smtp.fromName).toBe(SITE_NAME);
    expect(smtp.port).toBe(587);
  });
});
