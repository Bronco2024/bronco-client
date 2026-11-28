import { mergeCartItems } from "./guest-cart";

describe("guest-cart", () => {
  test("merges quantities for the same product id", () => {
    expect(
      mergeCartItems(
        [{ id: "a", title: "קולר", quantity: 1, price: 10 }],
        [{ id: "a", title: "קולר", quantity: 2, price: 10 }]
      )
    ).toEqual([{ id: "a", title: "קולר", quantity: 3, price: 10 }]);
  });

  test("keeps distinct products", () => {
    const merged = mergeCartItems(
      [{ id: "a", quantity: 1 }],
      [{ id: "b", quantity: 1 }]
    );
    expect(merged.map((item) => item.id).sort()).toEqual(["a", "b"]);
  });
});
