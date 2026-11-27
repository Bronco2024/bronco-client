/** Lightweight cart feedback — listened by CartToastHost. */

export const CART_ADDED_EVENT = "petzo:cart-added";

export const showCartAddedToast = ({ title = "", quantity = 1 } = {}) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CART_ADDED_EVENT, {
      detail: {
        title: String(title || "").trim(),
        quantity: Number(quantity) > 0 ? Number(quantity) : 1,
      },
    })
  );
};
