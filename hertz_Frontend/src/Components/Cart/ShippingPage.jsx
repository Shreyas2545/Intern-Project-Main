import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit } from "react-icons/fa";
import AddressForm from "./AddressForm";
import { setShippingAddress, setShipping } from "./cartSlice";

// --- Main Shipping Page Component ---
export default function ShippingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = "/api/v1/users";

  const buttonVariants = {
    hover: { scale: 1.05, y: -2, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/current-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data.");
        }

        const result = await response.json();
        setPrimaryAddress(result.data.address || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Your session has expired. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.keys(editingAddress).forEach((key) => {
      formData.append(key, editingAddress[key]);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to save address.");

      setPrimaryAddress(result.data.address);
      setShowForm(false);
      setEditingAddress(null);
      showNotification("Address saved successfully!", "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    if (primaryAddress) {
      setEditingAddress(primaryAddress);
      setShowForm(true);
    }
  };

  const handleAddNewClick = () => {
    setEditingAddress({ country: "India" });
    setShowForm(true);
  };

  // --- CORRECTED NAVIGATION LOGIC ---
  const handleProceedToPayment = () => {
    if (!primaryAddress) {
      showNotification("Please add a shipping address.", "error");
      return;
    }

    // 1. Dispatch to Redux for state persistence (e.g., on page refresh)
    dispatch(setShippingAddress(primaryAddress));
    dispatch(setShipping(shippingMethod));

    // 2. Navigate to the payment page, passing the data in the route's state.
    // The PaymentPage will use this state for immediate access to the data.
    navigate("/payment", {
      state: { address: primaryAddress, shippingMethod },
    });
  };

  return (
    <>
      <motion.div
        className="px-4 py-12 max-w-7xl mx-auto bg-gradient-to-br from-white to-gray-50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-8">
          Shipping Details
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900">
              Shipping Address
            </h2>
            <AnimatePresence mode="wait">
              {loading ? (
                <p key="loading">Loading address...</p>
              ) : showForm ? (
                <AddressForm
                  key="form"
                  address={editingAddress}
                  setAddress={setEditingAddress}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                  isSubmitting={isSubmitting}
                />
              ) : primaryAddress ? (
                <motion.div
                  key="address-display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border"
                >
                  <p className="text-blue-900/70">
                    {primaryAddress.streetAddress}
                  </p>
                  <p className="text-blue-900/70">
                    {`${primaryAddress.city}, ${primaryAddress.state} - ${primaryAddress.postalCode}`}
                  </p>
                  <motion.button
                    onClick={handleEditClick}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaEdit /> Edit Address
                  </motion.button>
                </motion.div>
              ) : (
                <div
                  key="no-address"
                  className="text-center p-6 border-2 border-dashed rounded-2xl"
                >
                  <p className="text-blue-900/70 mb-4">
                    No shipping address on file.
                  </p>
                  <motion.button
                    onClick={handleAddNewClick}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaPlus className="inline mr-2" /> Add Address
                  </motion.button>
                </div>
              )}
            </AnimatePresence>
          </div>
          <div className="space-y-8">
            <div className="space-y-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-blue-900">
                Shipping Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ship"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-300"
                  />
                  <span className="text-blue-900">Standard (Free, 5 days)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ship"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-300"
                  />
                  <span className="text-blue-900">Express (+₹100, 2 days)</span>
                </label>
              </div>
              <motion.button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 disabled:opacity-50"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={!primaryAddress || showForm}
              >
                Proceed to Payment
              </motion.button>
            </div>
          </div>
        </div>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 p-4 rounded-md text-white ${
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
