import { CONTACT_EMAIL } from "../data/site-config";
import { getFirebaseSmtpRecommendation } from "./firebase-smtp";

describe("Firebase SMTP recommendation", () => {
  test("uses the public Pets & Bones contact email as sender", () => {
    const smtp = getFirebaseSmtpRecommendation();

    expect(smtp.fromEmail).toBe(CONTACT_EMAIL);
    expect(smtp.replyTo).toBe(CONTACT_EMAIL);
    expect(smtp.fromName).toBe("Pets & Bones");
    expect(smtp.port).toBe(587);
  });
});
