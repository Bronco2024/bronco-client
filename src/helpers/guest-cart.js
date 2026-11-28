/** Persist store cart for guests (no login). */

export const GUEST_CART_KEY = "petzo_guest_cart";

export const loadGuestCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

export const saveGuestCart = (items = []) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items || []));
  } catch (_error) {
    // quota / private mode — ignore
  }
};

export const clearGuestCart = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(GUEST_CART_KEY);
  } catch (_error) {
    // ignore
  }
};

export const mergeCartItems = (primary = [], secondary = []) => {
  const map = new Map();
  [...(primary || []), ...(secondary || [])].forEach((item) => {
    if (!item?.id) return;
    const prev = map.get(item.id);
    if (!prev) {
      map.set(item.id, { ...item, quantity: Number(item.quantity) || 1 });
      return;
    }
    map.set(item.id, {
      ...prev,
      ...item,
      quantity: (Number(prev.quantity) || 0) + (Number(item.quantity) || 0),
    });
  });
  return [...map.values()];
};
