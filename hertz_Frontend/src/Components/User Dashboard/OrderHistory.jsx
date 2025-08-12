import React from "react";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaRupeeSign,
} from "react-icons/fa";

// Dummy data for order history
const orders = [
  {
    id: "ORD1001",
    date: "2025-06-20",
    total: 1999,
    items: ["Custom T-Shirt", "Premium Mug"],
    status: "Delivered",
  },
  {
    id: "ORD1002",
    date: "2025-06-15",
    total: 799,
    items: ["Raincoat"],
    status: "Delivered",
  },
  {
    id: "ORD1003",
    date: "2025-07-21",
    total: 2499,
    items: ["Custom Hoodie", "Sticker Pack", "Designer Cap"],
    status: "Processing",
  },
];

// Reusable component for displaying order status with appropriate colors and icons
const StatusBadge = ({ status }) => {
  const isDelivered = status === "Delivered";
  const bgColor = isDelivered ? "bg-green-100" : "bg-yellow-100";
  const textColor = isDelivered ? "text-green-800" : "text-yellow-800";
  const Icon = isDelivered ? FaCheckCircle : FaBoxOpen;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}
    >
      <Icon />
      <span>{status}</span>
    </div>
  );
};

export default function OrderHistory() {
  const handleReorder = (orderId) => {
    console.log(`Reordering order ${orderId}`);
    // Add reorder logic here
  };

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
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          <p className="text-gray-500 mt-1">
            Review your past purchases and track their status.
          </p>
        </div>

        {/* --- ORDERS LIST --- */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <motion.div
              className="text-center py-20 bg-white rounded-xl shadow-sm"
              variants={itemVariants}
            >
              <p className="text-xl font-semibold text-gray-700">
                No Orders Yet
              </p>
              <p className="text-gray-500 mt-2">
                Your past orders will appear here.
              </p>
            </motion.div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Order ID: {order.id}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <FaCalendarAlt />
                      <span>
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <FaRupeeSign />
                    <span>{order.total.toLocaleString("en-IN")}</span>
                  </div>
                  <motion.button
                    onClick={() => handleReorder(order.id)}
                    className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reorder
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
