import {
  buildStoreOrderPayload,
  ORDER_PAYMENT_METHODS,
  ORDER_STATUS,
} from "./store-orders";

describe("store orders", () => {
  test("builds a COD home-delivery order payload", () => {
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
      paymentMethod: ORDER_PAYMENT_METHODS.COD,
      fulfillment: "home_delivery",
      status: ORDER_STATUS.PENDING,
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
    expect(payload.items[0]).toMatchObject({
      id: "p1",
      title: "קערה",
      price: 40,
      quantity: 2,
    });
  });
});
