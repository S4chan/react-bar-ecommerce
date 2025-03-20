import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import toastReducer from "./toastSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    toast: toastReducer,
  },
});

export default store;
