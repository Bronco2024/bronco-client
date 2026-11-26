import { createSlice } from "@reduxjs/toolkit";
import {
  recalculateCartTotals,
  toCartProduct,
  parseCartPrice,
} from "@/helpers/cart-helpers";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const applyTotals = (state) => {
  const { totalQuantity, totalPrice } = recalculateCartTotals(state.items);
  state.totalQuantity = totalQuantity;
  state.totalPrice = totalPrice;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = toCartProduct(action.payload);
      const itemExists = state.items.find((item) => item.id === product.id);
      if (itemExists) {
        itemExists.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      applyTotals(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      applyTotals(state);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      applyTotals(state);
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item) {
        state.items = state.items.filter((entry) => entry.id !== action.payload);
      }
      applyTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    loadCart: (state, action) => {
      state.items = (action.payload || []).map((item) => ({
        ...toCartProduct(item),
        quantity: Number(item.quantity) || 1,
        price: parseCartPrice(item.price),
      }));
      applyTotals(state);
    },
  },
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
