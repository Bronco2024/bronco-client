/** Cart helpers for the Petzo first-party store. */

export const parseCartPrice = (price) => {
  if (typeof price === "number" && Number.isFinite(price)) return price;
  if (typeof price === "string") {
    const normalized = Number(price.replace(/[^\d.-]/g, ""));
    return Number.isFinite(normalized) ? normalized : 0;
  }
  return 0;
};

export const getCartProductTitle = (product = {}) =>
  product.title ||
  product.name ||
  product.accessory ||
  product.breed ||
  product.category ||
  "מוצר";

/** Keep only fields safe to persist on the user cart / purchase docs. */
export const toCartProduct = (product = {}) => ({
  id: product.id,
  title: getCartProductTitle(product),
  price: parseCartPrice(product.price),
  photos: Array.isArray(product.photos)
    ? product.photos.filter(Boolean).slice(0, 3)
    : product.image
      ? [product.image]
      : [],
  category: product.category || "חנות",
  accessory: product.accessory || "",
});

export const recalculateCartTotals = (items = []) => {
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + parseCartPrice(item.price) * (Number(item.quantity) || 0),
    0
  );
  return {
    totalQuantity,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
};

export const isStoreProduct = (product) => {
  if (!product || typeof product !== "object") return false;
  return product.category === "חנות" || product.listingKind === "store";
};
