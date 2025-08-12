import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFillDrip, FaImage } from "react-icons/fa";

// Animation variants
const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const backgroundColors = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#808080" },
];

const BackgroundPanel = ({ addDesignElement, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleAddBackgroundImage = (e) => {
    if (e.target.files?.[0]) {
      addDesignElement({
        type: "background",
        content: URL.createObjectURL(e.target.files[0]),
        x: 50,
        y: 50,
        width: "100%",
        height: "100%",
      });
      onClose();
    }
  };

  const handleApplyBackgroundColor = () => {
    if (selectedColor) {
      addDesignElement({
        type: "background",
        color: selectedColor.value,
        x: 50,
        y: 50,
        width: "100%",
        height: "100%",
      });
      setSelectedColor(null);
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-blue-900 uppercase">
        Set Background
      </h3>
      <p className="text-sm text-blue-900">
        Choose a background color or upload an image.
      </p>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Background Color
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {backgroundColors.map((color) => (
              <motion.button
                key={color.value}
                onClick={() => setSelectedColor(color)}
                className={`p-2 border rounded-lg ${
                  selectedColor?.value === color.value
                    ? "border-blue-900"
                    : "border-blue-200 hover:bg-blue-50"
                }`}
                style={{ backgroundColor: color.value }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label={`Select ${color.name} background color`}
              >
                <span className="text-xs text-blue-900 uppercase">
                  {color.name}
                </span>
              </motion.button>
            ))}
          </div>
          <motion.button
            onClick={handleApplyBackgroundColor}
            className="w-full mt-2 bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 uppercase"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={!selectedColor}
            aria-label="Apply background color"
          >
            Apply Color
          </motion.button>
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Background Image
          </h4>
          <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-900 rounded-lg cursor-pointer hover:bg-blue-50">
            <FaImage className="text-blue-900 w-6 h-6" />
            <span className="text-sm text-blue-900 uppercase">
              Upload Background
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAddBackgroundImage}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPanel;
