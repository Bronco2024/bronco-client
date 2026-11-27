import { CART_ADDED_EVENT, showCartAddedToast } from "./cart-toast";

describe("cart-toast", () => {
  test("dispatches a cart-added event with title and quantity", () => {
    const handler = jest.fn();
    window.addEventListener(CART_ADDED_EVENT, handler);

    showCartAddedToast({ title: "קולר כתום", quantity: 2 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({
      title: "קולר כתום",
      quantity: 2,
    });

    window.removeEventListener(CART_ADDED_EVENT, handler);
  });
});
