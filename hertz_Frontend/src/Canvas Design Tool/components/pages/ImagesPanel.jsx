import React, { useContext, useRef } from "react";
import { motion } from "framer-motion";
import { FaImage } from "react-icons/fa";
import { DesignContext } from "../DesignToolPage.jsx";

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const ImagesPanel = ({ onClose }) => {
  const { addDesignElement } = useContext(DesignContext);
  const fileInputRef = useRef(null);

  const handleAddImage = (e) => {
    try {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(file);
          console.log(
            "Image upload triggered in ImagesPanel. File:",
            file.name,
            "URL:",
            imageUrl
          );
          if (!addDesignElement) {
            throw new Error("addDesignElement is undefined");
          }
          addDesignElement({
            type: "image",
            content: imageUrl,
          });
          onClose();
        } else {
          console.error("Invalid file selected. Must be an image.");
          alert("Please select a valid image file.");
        }
      } else {
        console.log("No file selected in ImagesPanel");
      }
    } catch (error) {
      console.error("Error in handleAddImage:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-blue-900 uppercase">Add Image</h3>
      <p className="text-sm text-blue-900">
        Upload an image to enhance your design.
      </p>
      <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-blue-900 rounded-lg">
        <FaImage className="text-blue-900 w-6 h-6" />
        <label
          htmlFor="image-upload"
          className="text-sm text-blue-900 uppercase cursor-pointer hover:underline"
        >
          Click to upload
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAddImage}
          className="hidden"
        />
        <motion.button
          onClick={() => {
            console.log("Upload Image button clicked");
            if (fileInputRef.current) {
              fileInputRef.current.click();
            } else {
              console.error("fileInputRef is not initialized");
            }
          }}
          className="flex items-center space-x-1 px-4 py-2 mt-2 rounded-md border border-blue-800 hover:border-blue-600 text-blue-800"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="font-medium">Upload Image</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ImagesPanel;
