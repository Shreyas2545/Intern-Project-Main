import React from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaCheckCircle,
  FaShippingFast,
  FaTruckLoading,
} from "react-icons/fa";

// Dummy data for trackable orders
const orders = [
  {
    id: "ORD1003",
    date: "2025-07-21",
    items: ["Custom Hoodie", "Sticker Pack", "Designer Cap"],
    status: "Shipped",
    trackingSteps: [
      { name: "Processing", timestamp: "21 Jul, 04:30 PM", completed: true },
      { name: "Shipped", timestamp: "22 Jul, 11:15 AM", completed: true },
      { name: "Out for Delivery", timestamp: null, completed: false },
      { name: "Delivered", timestamp: null, completed: false },
    ],
  },
  {
    id: "ORD1004",
    date: "2025-07-22",
    items: ["Designer Mousepad"],
    status: "Processing",
    trackingSteps: [
      { name: "Processing", timestamp: "22 Jul, 01:20 PM", completed: true },
      { name: "Shipped", timestamp: null, completed: false },
      { name: "Out for Delivery", timestamp: null, completed: false },
      { name: "Delivered", timestamp: null, completed: false },
    ],
  },
];

// Icon mapping for tracking steps
const stepIcons = {
  Processing: FaBox,
  Shipped: FaTruckLoading,
  "Out for Delivery": FaShippingFast,
  Delivered: FaCheckCircle,
};

// Reusable component for each step in the tracking timeline
const TrackingStep = ({ step, isLast }) => {
  const Icon = stepIcons[step.name];
  const isCompleted = step.completed;

  return (
    <div className="relative flex-1 flex flex-col items-center">
      {/* Connecting Line */}
      {!isLast && (
        <div
          className={`absolute top-4 left-1/2 w-full h-1 ${
            isCompleted ? "bg-blue-600" : "bg-gray-200"
          }`}
        ></div>
      )}

      {/* Step Circle and Icon */}
      <div
        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <Icon
          className={`w-4 h-4 ${isCompleted ? "text-white" : "text-gray-500"}`}
        />
      </div>

      {/* Step Name and Timestamp */}
      <div className="text-center mt-2">
        <p
          className={`text-sm font-semibold ${
            isCompleted ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {step.name}
        </p>
        {step.timestamp && (
          <p className="text-xs text-gray-400">{step.timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default function TrackOrders() {
  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* --- HEADER --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Track Your Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Get real-time updates on your shipments.
          </p>
        </div>

        {/* --- ORDERS LIST --- */}
        <div className="space-y-8">
          {orders.length === 0 ? (
            <motion.div
              className="text-center py-20 bg-white rounded-xl shadow-sm"
              variants={itemVariants}
            >
              <p className="text-xl font-semibold text-gray-700">
                No Active Orders
              </p>
              <p className="text-gray-500 mt-2">
                Your trackable orders will appear here.
              </p>
            </motion.div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800">
                    Order ID: {order.id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Items: {order.items.join(", ")}
                  </p>
                </div>

                {/* Card Body - Tracking Timeline */}
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between">
                    {order.trackingSteps.map((step, index) => (
                      <TrackingStep
                        key={step.name}
                        step={step}
                        isLast={index === order.trackingSteps.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
