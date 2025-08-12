import React, { useState } from "react";
import { motion } from "framer-motion";

// Animation variants
const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const colorOptions = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#008000" },
];

// This component is now more reusable. It simply displays color options
// and calls a function with the selected color value when "Apply" is clicked.
const ColorPanel = ({ onColorSelect, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleApplyColor = () => {
    if (selectedColor) {
      onColorSelect(selectedColor.value); // Pass the hex value back to the parent
      onClose(); // Close the panel
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg border">
      <h3 className="text-lg font-bold text-blue-900 uppercase">
        Select Color
      </h3>
      <p className="text-sm text-blue-900">
        Choose a color for your text or elements.
      </p>
      <div className="grid grid-cols-5 gap-2">
        {colorOptions.map((color) => (
          <motion.button
            key={color.value}
            onClick={() => setSelectedColor(color)}
            className={`h-10 w-10 border-2 rounded-full ${
              selectedColor?.value === color.value
                ? "border-blue-600 ring-2 ring-blue-300"
                : "border-gray-200 hover:border-blue-400"
            }`}
            style={{ backgroundColor: color.value }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
      <motion.button
        onClick={handleApplyColor}
        className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 uppercase disabled:opacity-50"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        disabled={!selectedColor}
        aria-label="Apply color"
      >
        Apply Color
      </motion.button>
    </div>
  );
};

export default ColorPanel;
