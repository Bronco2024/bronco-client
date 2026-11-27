import { ADMIN_EMAIL } from "../data/site-config";
import {
  buildPendingAdEmail,
  canSendAdminEmail,
  getAdminEmail,
  sendBuyerOrderEmailClient,
  sendStoreOrderViaNetlifyForm,
} from "./admin-email";
import { buildBuyerOrderEmail } from "./store-order-emails";

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

  test("builds a store-product pending email without city/phone", () => {
    const email = buildPendingAdEmail({
      adId: "store-1",
      origin: "https://petzo.co.il",
      ad: {
        title: "קולר כתום",
        category: "חנות",
        listingKind: "store",
        price: "49",
        accessory: "רצועות וקולרים",
      },
    });

    expect(email.subject).toContain("מוצר בחנות");
    expect(email.message).toContain("קולר כתום");
    expect(email.message).toContain("רצועות וקולרים");
    expect(email.message).not.toContain("עיר:");
    expect(email.message).not.toContain("טלפון:");
  });

  test("buyer confirmation targets the order email", () => {
    const email = buildBuyerOrderEmail({
      orderId: "o1",
      order: {
        email: "buyer@example.com",
        totalPrice: 50,
        items: [{ title: "קולר", price: 50, quantity: 1 }],
      },
    });
    expect(email.to).toBe("buyer@example.com");
    expect(email.subject).toContain("אישור הזמנה");
  });

  test("buyer EmailJS helper no-ops without config", async () => {
    await expect(
      sendBuyerOrderEmailClient({
        orderId: "o1",
        order: { email: "buyer@example.com", items: [] },
      })
    ).resolves.toBe(false);
  });

  test("Netlify Forms order helper posts form-name store-order", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    global.fetch = fetchMock;

    await expect(
      sendStoreOrderViaNetlifyForm({
        orderId: "ord-9",
        order: {
          email: "buyer@example.com",
          totalPrice: 40,
          paymentMethod: "cod",
          contactDetails: { firstName: "A", city: "חיפה" },
          items: [{ title: "קערת מים", price: 40, quantity: 1 }],
        },
      })
    ).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    );
    const body = fetchMock.mock.calls[0][1].body;
    expect(String(body)).toContain("form-name=store-order");
    expect(String(body)).toContain("ord-9");
    expect(String(body)).toContain("buyer%40example.com");
  });
});
