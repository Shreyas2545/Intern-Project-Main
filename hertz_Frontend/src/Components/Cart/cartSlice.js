// src/Components/Cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // products in cart
  saved: [], // products saved for later
  shippingAddress: {
    // sample address so PaymentPage won't immediately redirect
    _id: "sample_address_123",
    name: "John Doe",
    streetAddress: "123 Tech Lane, Innovation Park",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400076",
    country: "India",
  },
  coupon: null, // { code, discountPercent, minOrder } or null
  shipping: "standard", // "standard" or "express"
  addresses: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty;
      } else {
        state.items.push({ ...action.payload });
      }
    },
    removeFromCart(state, action) {
      state.saved = state.saved.filter((i) => i.id !== action.payload);
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.qty = action.payload.qty;
    },
    applyCoupon(state, action) {
      const payload = action.payload;
      // Legacy: payload is string code
      if (typeof payload === "string") {
        const code = payload.trim();
        if (code) {
          state.coupon = { code, discountPercent: 10, minOrder: 0 };
        } else {
          state.coupon = null;
        }
      }
      // Full object: { code, discount, discountPercent, minOrder }
      else if (payload && typeof payload === "object" && payload.code) {
        const discountPercent =
          payload.discountPercent ?? payload.discount ?? 0;
        state.coupon = {
          code: payload.code,
          discountPercent,
          minOrder: payload.minOrder || 0,
        };
      }
      // Invalid payload: clear
      else {
        state.coupon = null;
      }
    },
    setShipping(state, action) {
      state.shipping = action.payload; // "standard" or "express"
    },
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    saveAddress(state, action) {
      state.addresses.push(action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    },
    saveForLater(state, action) {
      const item = action.payload;
      state.items = state.items.filter((i) => i.id !== item.id);
      if (!state.saved.find((i) => i.id === item.id)) {
        state.saved.push({ ...item });
      }
    },
    moveToCart(state, action) {
      const item = action.payload;
      state.saved = state.saved.filter((i) => i.id !== item.id);
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        exists.qty += item.qty || 1;
      } else {
        state.items.push({ ...item, qty: item.qty || 1 });
      }
    },
    toggleGiftWrap(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.giftWrap = action.payload.giftWrap;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQty,
  applyCoupon,
  setShipping,
  setShippingAddress,
  saveAddress,
  clearCart,
  saveForLater,
  moveToCart,
  toggleGiftWrap,
} = cartSlice.actions;

export default cartSlice.reducer;
