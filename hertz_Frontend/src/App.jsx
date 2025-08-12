import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { CouponProvider } from "./contexts/CouponContext";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import CompleteProfile from "./Components/CompleteProfile";
import CategoryPage from "./Components/HomePage/Pages/CategoryPage";
import SubCategoryPage from "./Components/HomePage/Pages/SubCategoryPage";
import AdminPage from "./Components/AdminPage";
import ProductListing from "./Components/Product/ProductListing.jsx";
import ProductDetail from "./Components/Product/ProductDetail.jsx";
import Help from "./Components/HomePage/HelpPage.jsx";
import CartPage from "./Components/Cart/CartPage.jsx";
import ShippingPage from "./Components/Cart/ShippingPage.jsx";
import PaymentPage from "./Components/Cart/PaymentPage.jsx";
import DesignToolPage from "./Canvas Design Tool/components/DesignToolPage.jsx";
import Favorites from "./Components/HomePage/Favourites.jsx";
import NotFoundPage from "./Components/HomePage/Pages/NotFoundPage.jsx";
import DashboardLayout from "./Components/User Dashboard/DashboardLayout.jsx";
import Profile from "./Components/User Dashboard/Profile.jsx";
import SavedDesigns from "./Components/User Dashboard/SavedDesigns.jsx";
import OrderHistory from "./Components/User Dashboard/OrderHistory.jsx";
import TrackOrders from "./Components/User Dashboard/TrackOrders.jsx";

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <CouponProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route
              path="/category/:categoryName/:subCategoryName"
              element={<SubCategoryPage />}
            />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/help" element={<Help />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="designs" element={<SavedDesigns />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="track" element={<TrackOrders />} />
            </Route>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/design-tool/:productId" element={<DesignToolPage />} />
          <Route path="/design-tool" element={<DesignToolPage />} />
        </Routes>
      </CouponProvider>
    </Provider>
  );
}
