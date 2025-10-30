// src/components/pages/IconToolbar.jsx
import React, { useContext, useState } from "react";
import { ChromePicker } from "react-color";
import { FaTrash, FaExchangeAlt } from "react-icons/fa";
import { IoColorFill } from "react-icons/io5";
import { DesignContext } from "../DesignToolPage"; // Adjust path as needed

const IconToolbar = ({
  selectedElementId,
  designElements,
  updateDesignElement,
  deleteDesignElement,
}) => {
  const { setIsIconModalOpen, setIconModalMode, setReplacingElementId } =
    useContext(DesignContext);
  const el = designElements.find((e) => e.id === selectedElementId);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  if (!el) return null;

  const handleUpdate = (prop, value) => {
    updateDesignElement(el.id, { [prop]: value });
  };

  const openReplaceModal = () => {
    setIconModalMode("replace");
    setReplacingElementId(selectedElementId);
    setIsIconModalOpen(true);
  };

  const popover = {
    position: "absolute",
    zIndex: "2",
    bottom: "calc(100% + 10px)",
    left: "50%",
    transform: "translateX(-50%)",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-2 flex items-center gap-2 border border-gray-200">
      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setDisplayColorPicker(!displayColorPicker)}
          className="p-2 rounded-md hover:bg-gray-200 flex items-center gap-2"
          title="Icon Color"
        >
          <IoColorFill className="w-5 h-5 text-gray-600" />
          <div
            className="w-7 h-5 rounded border border-gray-300"
            style={{ backgroundColor: el.color || "transparent" }}
          />
        </button>
        {displayColorPicker ? (
          <div style={popover}>
            <div style={cover} onClick={() => setDisplayColorPicker(false)} />
            <ChromePicker
              color={el.color || "#000000"}
              on
              geïnchange={(color) => handleUpdate("color", color.hex)}
              disableAlpha={true}
            />
          </div>
        ) : null}
      </div>

      {/* Opacity Slider */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={el.opacity || 1}
          onChange={(e) => handleUpdate("opacity", parseFloat(e.target.value))}
          className="w-24 accent-blue-500"
        />
      </div>

      <div className="h-6 border-l border-gray-300 mx-2"></div>

      {/* Change Icon Button */}
      <button
        onClick={openReplaceModal}
        className="p-2 rounded-md hover:bg-gray-200 flex items-center gap-2"
        title="Change Icon"
      >
        <FaExchangeAlt className="w-5 h-5 text-gray-600" />
      </button>

      <div className="h-6 border-l border-gray-300 mx-2"></div>

      {/* Delete Button */}
      <button
        onClick={() => deleteDesignElement(el.id)}
        className="p-2 rounded-md transition-colors duration-150 hover:bg-gray-200"
        title="Delete Icon"
      >
        <FaTrash className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

export default IconToolbar;
