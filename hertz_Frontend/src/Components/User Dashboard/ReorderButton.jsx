import React from "react";
import { motion } from "framer-motion";
import { FaRedo } from "react-icons/fa";

export default function ReorderButton({ orderId, items }) {
  const handleReorder = () => {
    alert(`Reordering items from ${orderId}`);
    // dispatch to cart or redirect to /cart (e.g., using react-router-dom or Redux)
  };

  return (
    <motion.button
      onClick={handleReorder}
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:ring-2 hover:ring-blue-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium transition-all duration-200"
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
    >
      <FaRedo className="text-xl" />
      <span>Reorder</span>
    </motion.button>
  );
}
