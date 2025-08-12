import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // FIX: Added AnimatePresence to the import
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCreditCard, FaQrcode } from "react-icons/fa";
import { clearCart } from "./cartSlice";

// --- A more realistic PaymentForm component ---
const PaymentForm = ({
  method,
  total,
  cardDetails,
  setCardDetails,
  upiId,
  setUpiId,
}) => {
  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "number") {
      value = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }
    if (name === "expiry") {
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }
    setCardDetails({ ...cardDetails, [name]: value });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={method}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 pt-4"
      >
        {method === "card" && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">Enter Card Details</h3>
            <div>
              <label className="block text-blue-900 text-sm font-medium">
                Card Number
              </label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-900 text-sm font-medium">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-blue-900 text-sm font-medium">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        )}
        {method === "upi" && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">Enter UPI ID</h3>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="yourname@bank"
              required
            />
          </div>
        )}
        {method === "cod" && (
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p className="text-blue-900/80">
              You will pay{" "}
              <span className="font-bold">₹{total.toFixed(2)}</span> upon
              delivery.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              No pre-payment is required.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Main Payment Page Component
export default function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const shippingAddress = location.state?.address;
  const shippingMethod = location.state?.shippingMethod;

  const { items, coupon } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notification, setNotification] = useState(null);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    if (!shippingAddress) {
      console.error("No shipping address found. Redirecting to /shipping.");
      navigate("/shipping");
    }
  }, [isAuthenticated, navigate, shippingAddress]);

  const subtotal = items.reduce((sum, x) => sum + x.price * x.qty, 0);
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const shippingCost = shippingMethod === "express" ? 100 : 0;
  const giftCost = items.some((item) => item.giftWrap) ? 50 : 0;
  const total = subtotal - discount + shippingCost + giftCost;

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePayment = () => {
    if (paymentMethod === "card") {
      if (
        cardDetails.number.length < 19 ||
        cardDetails.expiry.length < 5 ||
        cardDetails.cvv.length < 3
      ) {
        showNotification("Please fill in all card details correctly.", "error");
        return;
      }
    }
    if (paymentMethod === "upi") {
      if (!upiId.includes("@")) {
        showNotification("Please enter a valid UPI ID.", "error");
        return;
      }
    }

    showNotification("Processing payment...", "info");
    setTimeout(() => {
      dispatch(clearCart());
      showNotification("Payment successful! Redirecting...", "success");
      setTimeout(() => {
        navigate("/order-confirmation");
      }, 2000);
    }, 1500);
  };

  if (!shippingAddress) {
    return (
      <div className="text-center p-12">
        Loading shipping details or redirecting...
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="px-4 py-12 max-w-7xl mx-auto bg-gradient-to-br from-white to-gray-50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-8">
          Payment Details
        </h1>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Payment Method and Form */}
          <div className="space-y-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-blue-900">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-300"
                />
                <span className="ml-3 text-blue-900 font-medium">
                  Credit/Debit Card
                </span>
                <FaCreditCard className="ml-auto text-blue-400" />
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-300"
                />
                <span className="ml-3 text-blue-900 font-medium">UPI</span>
                <FaQrcode className="ml-auto text-blue-400" />
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-300"
                />
                <span className="ml-3 text-blue-900 font-medium">
                  Cash on Delivery
                </span>
              </label>
            </div>
            <PaymentForm
              method={paymentMethod}
              total={total}
              cardDetails={cardDetails}
              setCardDetails={setCardDetails}
              upiId={upiId}
              setUpiId={setUpiId}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900">Order Summary</h2>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border-2 border-blue-200 space-y-4">
              <div className="flex justify-between text-blue-900">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-blue-600">
                  <span>Discount ({coupon.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-blue-900">
                <span>Shipping</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              {giftCost > 0 && (
                <div className="flex justify-between text-blue-900">
                  <span>Gift Wrap</span>
                  <span>₹{giftCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-blue-900 border-t pt-4 mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <p className="text-blue-900/70 text-sm pt-4 border-t">
                <span className="font-semibold">Shipping to:</span>
                <br />
                {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                {shippingAddress.state} - {shippingAddress.postalCode}
              </p>
            </div>
            <motion.button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
              variants={{ hover: { scale: 1.05 }, tap: { scale: 0.95 } }}
              whileHover="hover"
              whileTap="tap"
            >
              Confirm Payment
            </motion.button>
            <Link
              to="/shipping"
              className="text-blue-600 hover:underline text-sm font-medium text-center block"
            >
              Back to Shipping
            </Link>
          </div>
        </div>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed top-5 right-5 p-4 rounded-lg text-white ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            } shadow-lg z-50`}
          >
            {notification.message}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
