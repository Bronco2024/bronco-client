import {
  buildAdminOrderEmail,
  buildBuyerOrderEmail,
  getOrderNotificationTitle,
} from "./store-order-emails";
import { ADMIN_EMAIL } from "../data/site-config";

const sampleOrder = {
  email: "buyer@example.com",
  totalPrice: 120,
  totalQuantity: 2,
  paymentMethod: "cod",
  paymentMethodLabel: "תשלום במסירה",
  status: "pending",
  notes: "קוד 12",
  contactDetails: {
    firstName: "דני",
    lastName: "כהן",
    phone: "0501234567",
    city: "חיפה",
    address: "הרצל 1",
  },
  items: [
    { title: "קולר", price: 40, quantity: 1 },
    { title: "קערה", price: 40, quantity: 2 },
  ],
};

describe("store order emails", () => {
  test("builds buyer confirmation with items and disclaimer", () => {
    const email = buildBuyerOrderEmail({
      orderId: "ord-1",
      order: sampleOrder,
      siteUrl: "https://petzo.co.il",
    });

    expect(email.to).toBe("buyer@example.com");
    expect(email.subject).toContain("אישור הזמנה");
    expect(email.subject).toContain("ord-1");
    expect(email.message).toContain("קולר");
    expect(email.message).toContain("קערה");
    expect(email.message).toContain("תשלום במסירה");
    expect(email.message).toContain("חיפה");
    expect(email.message).toContain("חשבונית מס תישלח בנפרד");
    expect(email.message).toContain("https://petzo.co.il/my-purchases");
  });

  test("builds admin new-order alert", () => {
    const email = buildAdminOrderEmail({
      orderId: "ord-2",
      order: sampleOrder,
      siteUrl: "https://petzo.co.il",
    });

    expect(email.to).toBe(ADMIN_EMAIL);
    expect(email.subject).toContain("הזמנה חדשה");
    expect(email.message).toContain("ord-2");
    expect(email.message).toContain("דני כהן");
    expect(email.message).toContain("/admin/all-purchases");
  });

  test("builds inbox title with totals", () => {
    expect(getOrderNotificationTitle(sampleOrder)).toContain("הזמנה חדשה");
    expect(getOrderNotificationTitle(sampleOrder)).toContain("2 פריטים");
    expect(getOrderNotificationTitle(sampleOrder)).toContain("₪120");
  });
});
