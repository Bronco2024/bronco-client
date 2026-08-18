import { ADMIN_EMAIL } from "../data/site-config";
import {
  buildPendingAdEmail,
  canSendAdminEmail,
  getAdminEmail,
} from "./admin-email";

describe("Admin email alerts", () => {
  test("uses the site contact email by default", () => {
    expect(getAdminEmail()).toBe(ADMIN_EMAIL);
    expect(canSendAdminEmail()).toBe(true);
    expect(ADMIN_EMAIL).toContain("@");
  });

  test("builds a Hebrew pending-ad email with ad details", () => {
    const email = buildPendingAdEmail({
      adId: "ad-123",
      origin: "https://petsandbones.web.app",
      ad: {
        title: "גור לברדור",
        category: "כלבים",
        location: "נצרת",
        price: "2500",
        contact: "יוסי",
        phoneNumber: "0541234567",
      },
    });

    expect(email.subject).toContain("גור לברדור");
    expect(email.message).toContain("נצרת");
    expect(email.message).toContain("כלבים");
    expect(email.message).toContain("ad-123");
    expect(email.message).toContain("https://petsandbones.web.app/admin");
  });
});
