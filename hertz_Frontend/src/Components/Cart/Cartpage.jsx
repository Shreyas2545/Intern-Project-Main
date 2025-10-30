// src/Components/Cart/CartPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaHeart,
  FaGift,
  FaSyncAlt,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import {
  removeFromCart,
  updateQty,
  applyCoupon as applyCouponAction,
  setShipping,
  saveForLater,
  moveToCart,
} from "./cartSlice";
import { useCoupon } from "../../Contexts/CouponContext";
import Header from "../Header";
import Footer from "../Footer";
import CartImage from "../../assets/Add_TO_Cart.jpg";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02, rotateX: 2, rotateY: 2, transition: { duration: 0.3 } },
};
const buttonVariants = {
  hover: { scale: 1.05, y: -2, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, saved, coupon, shipping } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { bannerCoupon } = useCoupon();

  const [codeInput, setCodeInput] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [freeShipProgress, setFreeShipProgress] = useState(0);
  const [notification, setNotification] = useState(null);

  // 1. Calculate subtotal
  const subtotal = items.reduce((sum, x) => sum + x.price * x.qty, 0);

  // 2. Determine active coupon: Only use the coupon from Redux state (set manually by user)
  const activeCoupon = coupon;

  // 3. Compute discount & totals
  const discountPercent =
    activeCoupon && subtotal >= activeCoupon.minOrder
      ? activeCoupon.discountPercent
      : 0;
  const discount = (subtotal * discountPercent) / 100;
  const shippingCost = shipping === "express" ? 100 : 0;
  const giftCost = giftWrap ? 50 : 0;
  const total = subtotal - discount + shippingCost + giftCost;

  // Free-shipping progress bar
  useEffect(() => {
    const threshold = 2000;
    setFreeShipProgress(Math.min((subtotal / threshold) * 100, 100));
  }, [subtotal]);

  // Estimate delivery date
  const estDelivery = () => {
    const days = shipping === "express" ? 2 : 5;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Simple notification helper
  const showNotification = (msg, type = "error") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Apply button for manual override
  const handleApplyCode = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) return showNotification("Please enter a code.");

    if (bannerCoupon && code === bannerCoupon.code.toUpperCase()) {
      if (subtotal < bannerCoupon.minOrder) {
        return showNotification(
          `Spend ₹${bannerCoupon.minOrder.toLocaleString(
            "en-IN"
          )}+ to use this code.` - liquid
        );
      }
      dispatch(
        applyCouponAction({
          code: bannerCoupon.code,
          discountPercent: bannerCoupon.discount,
          minOrder: bannerCoupon.minOrder,
        })
      );
      return showNotification("Coupon applied!", "success");
    }

    showNotification("Invalid or expired coupon.");
  };

  // Checkout handler
  const handleCheckout = () => {
    if (!isAuthenticated) {
      showNotification("Please log in to checkout!");
      return;
    }
    navigate("/shipping");
  };

  // ----- EMPTY CART VIEW -----
  if (items.length === 0 && saved.length === 0) {
    return (
      <>
        {/* {bannerCoupon && (
          <div className="bg-black text-white text-center py-2 text-sm font-medium">
            🎉 {bannerCoupon.discount}% OFF on orders ₹
            {bannerCoupon.minOrder.toLocaleString("en-IN")}+ — Code:{" "}
            <strong>{bannerCoupon.code}</strong>
          </div>
        )} */}
        <motion.div
          className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-white to-gray-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-48 h-48 rounded-full overflow-hidden shadow-xl mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={CartImage}
              alt="Empty Cart"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-blue-900/70 mb-6 text-lg">
            Add items to your cart or save them for later.
          </p>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg"
            >
              Continue Shopping
            </Link>
          </motion.div>
          {!isAuthenticated && (
            <p className="mt-6 text-sm text-blue-900/70">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>{" "}
              to access saved items.
            </p>
          )}
        </motion.div>
      </>
    );
  }

  // ----- MAIN CART VIEW -----
  return (
    <>
      {/* {bannerCoupon && (
        <div className="bg-black text-white text-center py-2 text-sm font-medium">
          🎉 {bannerCoupon.discount}% OFF on orders ₹
          {bannerCoupon.minOrder.toLocaleString("en-IN")}+ — Code:{" "}
          <strong>{bannerCoupon.code}</strong>
        </div>
      )} */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="px-4 py-12 max-w-7xl mx-auto bg-gradient-to-br from-white to-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ----- LEFT COLUMN: Items & Saved ----- */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-4xl font-extrabold text-blue-900">
              Shopping Cart
            </h1>
            {/* Free shipping bar */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-200">
              {freeShipProgress < 100 ? (
                <>
                  <p className="text-blue-900 text-sm mb-3">
                    Spend ₹
                    <span className="font-semibold">
                      {(2000 - subtotal).toFixed(0)}
                    </span>{" "}
                    more for free shipping!
                  </p>
                  <div className="w-full bg-gray-100 h-3 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
                      style={{ width: `${freeShipProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-blue-600 font-semibold text-sm">
                  🎉 You qualify for free shipping!
                </p>
              )}
            </div>
            {/* Cart items */}
            <div className="space-y-6">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col md:flex-row bg-white p-6 rounded-2xl shadow-xl"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={idx}
                  whileHover="hover"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full overflow-hidden shadow-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="flex-1 md:ml-6 mt-4 md:mt-0 space-y-2">
                    <h2 className="font-semibold text-xl text-blue-900">
                      {item.name}
                    </h2>
                    <p className="text-blue-900/70">
                      ₹{item.price.toFixed(2)} each
                    </p>
                    <p className="text-sm text-blue-900">
                      Est. Delivery:{" "}
                      <span className="font-semibold">{estDelivery()}</span>
                    </p>
                    <p className="text-blue-900 font-semibold">
                      Item Total: ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        onClick={() =>
                          dispatch(
                            updateQty({ id: item.id, qty: item.qty - 1 })
                          )
                        }
                        className="p-2 bg-white rounded-full border hover:ring-2 text-blue-900"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <FaMinus />
                      </motion.button>
                      <input
                        type="text"
                        value={item.qty}
                        readOnly
                        className="w-12 text-center bg-gray-50 border rounded-lg"
                      />
                      <motion.button
                        onClick={() =>
                          dispatch(
                            updateQty({ id: item.id, qty: item.qty + 1 })
                          )
                        }
                        className="p-2 bg-white rounded-full border hover:ring-2 text-blue-900"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <FaPlus />
                      </motion.button>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col items-end space-y-3 mt-4 md:mt-0">
                    <motion.button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="flex items-center text-red-600 hover:text-red-800"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <FaTrash />
                      <span className="ml-1">Remove</span>
                    </motion.button>
                    <motion.button
                      onClick={() => dispatch(saveForLater(item))}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <FaHeart />
                      <span className="ml-1">Save for Later</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Saved for Later */}
            {saved.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-blue-900">
                    Saved for Later
                  </h2>
                  <motion.button
                    onClick={() =>
                      saved.forEach((i) => dispatch(moveToCart(i)))
                    }
                    className="flex items-center text-blue-600 hover:text-blue-700"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaSyncAlt />
                    <span className="ml-1">Move All to Cart</span>
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {saved.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center bg-white p-4 rounded-2xl shadow-md"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      whileHover="hover"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 ml-4">
                        <h3 className="font-semibold text-blue-900">
                          {item.name}
                        </h3>
                        <p className="text-blue-900/70">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <motion.button
                          onClick={() => dispatch(moveToCart(item))}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <FaSyncAlt />
                          <span className="ml-1">Move</span>
                        </motion.button>
                        <motion.button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="flex items-center text-red-600 hover:text-red-800"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <FaTimesCircle />
                          <span className="ml-1">Remove</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Promo & Summary */}
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Promo Code */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-200 space-y-4">
              <h3 className="font-semibold text-lg text-blue-900">
                Promo Code
              </h3>
              <div className="flex items-center rounded-full border overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2 text-blue-900 focus:outline-none"
                />
                <motion.button
                  onClick={handleApplyCode}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Apply
                </motion.button>
              </div>
              {activeCoupon &&
                (subtotal >= activeCoupon.minOrder ? (
                  <p className="text-blue-600">
                    “{activeCoupon.code}” — {activeCoupon.discountPercent}% off
                  </p>
                ) : (
                  <p className="text-red-600">
                    “{activeCoupon.code}” applied, but minimum order of ₹
                    {activeCoupon.minOrder.toLocaleString("en-IN")} not met.
                  </p>
                ))}
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-200 space-y-4">
              <h3 className="font-semibold text-lg text-blue-900">
                Shipping Method
              </h3>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="ship"
                  checked={shipping === "standard"}
                  onChange={() => dispatch(setShipping("standard"))}
                />
                <span>Standard (Free)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="ship"
                  checked={shipping === "express"}
                  onChange={() => dispatch(setShipping("express"))}
                />
                <span>Express (+₹100)</span>
              </label>
            </div>

            {/* Gift Wrap */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-200 flex items-center space-x-3">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={() => setGiftWrap((g) => !g)}
              />
              <FaGift className="text-blue-900" />
              <span>Add gift wrap (+₹50)</span>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-200 space-y-4">
              <h3 className="font-semibold text-xl text-blue-900">
                Order Summary
              </h3>
              <div className="flex justify-between text-blue-900">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-blue-900">
                <span>Shipping</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between text-blue-900">
                  <span>Gift Wrap</span>
                  <span>₹{giftCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-blue-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              onClick={handleCheckout}
              disabled={!isAuthenticated}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-bold"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isAuthenticated ? "Proceed to Checkout" : "Log in to Checkout"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
