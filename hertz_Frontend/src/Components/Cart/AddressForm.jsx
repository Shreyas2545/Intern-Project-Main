import React from "react";
import { motion } from "framer-motion";

// Animation variants for buttons
const buttonVariants = {
  hover: { scale: 1.05, y: -2, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

// This is a reusable form component for adding or editing an address.
export default function AddressForm({
  address,
  setAddress,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  // Handles input changes and updates the address state in the parent component.
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border-2 border-blue-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-blue-900 text-sm font-medium">
            Street Address
          </label>
          <textarea
            name="streetAddress"
            value={address.streetAddress || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-900 text-sm font-medium">
              City
            </label>
            <input
              type="text"
              name="city"
              value={address.city || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-900 text-sm font-medium">
              State
            </label>
            <input
              type="text"
              name="state"
              value={address.state || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-900 text-sm font-medium">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={address.postalCode || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-900 text-sm font-medium">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={address.country || "India"}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              readOnly
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <motion.button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label="Cancel address form"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isSubmitting}
            aria-label="Save address"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
