import { isStoreProduct } from "./cart-helpers";
import { addMonthsToDate } from "./ad-listing-duration";

export const STORE_CATEGORY_NAME = "חנות";
export const STORE_LISTING_KIND = "store";
/** Store inventory stays listed much longer than marketplace ads. */
export const STORE_LISTING_DURATION_MONTHS = 24;

export const isStoreCategory = (category) => category === STORE_CATEGORY_NAME;

export const isStoreListing = (item = {}) =>
  isStoreProduct(item) || isStoreCategory(item.category);

/** Far-future expiry so store products don't vanish like 3-month ads. */
export const getStoreListingAvailableUntil = (fromDate = new Date()) =>
  addMonthsToDate(fromDate, STORE_LISTING_DURATION_MONTHS);

export const getStoreProductTitle = (product = {}) =>
  product.title ||
  product.name ||
  product.accessory ||
  product.breed ||
  "מוצר בחנות";
