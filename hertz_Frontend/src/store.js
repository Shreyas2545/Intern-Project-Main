// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Features/Auth/authSlice";
import cartReducer from "./Components/Cart/cartSlice";
// import dashboardReducer from './Components/AdminPanel/Dashboard/dashboardSlice';
// import productReducer from './Components/AdminPanel/ProductManagement/productSlice';
const store = configureStore({
  reducer: { auth: authReducer, cart: cartReducer },
});
export default store;
