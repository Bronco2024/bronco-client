import {
  parseCartPrice,
  toCartProduct,
  recalculateCartTotals,
  isStoreProduct,
} from "./cart-helpers";

describe("cart helpers", () => {
  test("parses mixed price formats", () => {
    expect(parseCartPrice(49)).toBe(49);
    expect(parseCartPrice("₪120")).toBe(120);
    expect(parseCartPrice("1,250 ₪")).toBe(1250);
    expect(parseCartPrice("")).toBe(0);
  });

  test("serializes a lean cart product", () => {
    const product = toCartProduct({
      id: "p1",
      title: "רצועה",
      price: "89 ₪",
      photos: ["a", "b", "c", "d"],
      category: "חנות",
      description: "long text should not persist",
      userId: "u1",
    });
    expect(product).toEqual({
      id: "p1",
      title: "רצועה",
      price: 89,
      photos: ["a", "b", "c"],
      category: "חנות",
      accessory: "",
    });
  });

  test("recalculates totals", () => {
    expect(
      recalculateCartTotals([
        { price: 10, quantity: 2 },
        { price: "5", quantity: 1 },
      ])
    ).toEqual({ totalQuantity: 3, totalPrice: 25 });
  });

  test("detects store products", () => {
    expect(isStoreProduct({ category: "חנות" })).toBe(true);
    expect(isStoreProduct({ category: "אביזרים" })).toBe(false);
    expect(isStoreProduct(null)).toBe(false);
    expect(isStoreProduct(undefined)).toBe(false);
  });
});
