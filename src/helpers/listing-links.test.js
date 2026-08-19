import {
  buildWhatsAppLink,
  getListingPath,
  getListingShareUrl,
  toWhatsAppNumber,
} from "./listing-links";

describe("listing contact and share helpers", () => {
  test("converts israeli phone numbers to WhatsApp format", () => {
    expect(toWhatsAppNumber("054-792-6338")).toBe("972547926338");
    expect(toWhatsAppNumber("+972 54-792-6338")).toBe("972547926338");
  });

  test("builds a WhatsApp deep link with the listing title", () => {
    const link = buildWhatsAppLink({
      phoneNumber: "0547926338",
      title: "גור לברדור",
    });

    expect(link).toContain("https://wa.me/972547926338");
    expect(decodeURIComponent(link)).toContain("גור לברדור");
  });

  test("builds a shareable listing URL from the ad id", () => {
    expect(getListingPath({ id: "ad-1" })).toBe("/item/ad-1");
    expect(getListingShareUrl({ id: "ad-1" }, "https://petzo.co.il")).toBe(
      "https://petzo.co.il/item/ad-1"
    );
  });
});
