import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from "./site-config";

describe("site contact WhatsApp", () => {
  test("uses the Petzo support phone", () => {
    expect(CONTACT_PHONE).toBe("0527502293");
    expect(CONTACT_PHONE_DISPLAY).toBe("052-750-2293");
  });

  test("opens WhatsApp with the international number", () => {
    expect(CONTACT_WHATSAPP_URL).toContain("https://wa.me/972527502293");
    expect(CONTACT_WHATSAPP_URL).toContain("text=");
  });
});
