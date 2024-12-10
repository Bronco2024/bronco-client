import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const itemExists = state.items.find(item => item.id === action.payload.id);
            if (itemExists) {
                itemExists.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else if (item) {
                state.items = state.items.filter(item => item.id !== action.payload);
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
