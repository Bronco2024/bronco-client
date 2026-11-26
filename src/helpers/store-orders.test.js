import {
  buildStoreOrderPayload,
  ORDER_PAYMENT_METHODS,
  ORDER_STATUS,
} from "./store-orders";

describe("store orders", () => {
  test("builds an online home-delivery order payload by default", () => {
    const payload = buildStoreOrderPayload({
      userId: "u1",
      contactDetails: {
        firstName: "יוסי",
        lastName: "כהן",
        email: "yossi@example.com",
        phone: "0501234567",
        city: "חיפה",
        address: "רחוב הדקל 12",
        apartment: "3",
      },
      items: [
        {
          id: "p1",
          title: "קערה",
          price: 40,
          quantity: 2,
          photos: ["a.jpg"],
          category: "חנות",
        },
      ],
      notes: "להשאיר אצל השכן",
    });

    expect(payload).toMatchObject({
      userId: "u1",
      email: "yossi@example.com",
      totalQuantity: 2,
      totalPrice: 80,
      paymentMethod: ORDER_PAYMENT_METHODS.ONLINE,
      paymentStatus: "pending",
      paymentProvider: "grow",
      fulfillment: "home_delivery",
      status: ORDER_STATUS.AWAITING_PAYMENT,
      notes: "להשאיר אצל השכן",
      contactDetails: {
        firstName: "יוסי",
        lastName: "כהן",
        phone: "0501234567",
        city: "חיפה",
        address: "רחוב הדקל 12",
        apartment: "3",
      },
    });
  });

  test("builds a COD order when requested", () => {
    const payload = buildStoreOrderPayload({
      userId: "u1",
      contactDetails: {
        firstName: "דנה",
        lastName: "לוי",
        phone: "0521112233",
        city: "תל אביב",
        address: "דיזנגוף 1",
      },
      items: [{ id: "p2", title: "רצועה", price: 50, quantity: 1 }],
      paymentMethod: ORDER_PAYMENT_METHODS.COD,
    });

    expect(payload.paymentMethod).toBe(ORDER_PAYMENT_METHODS.COD);
    expect(payload.paymentStatus).toBe("cod");
    expect(payload.status).toBe(ORDER_STATUS.PENDING);
  });
});
