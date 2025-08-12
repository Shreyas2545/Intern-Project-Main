// src/components/pages/GraphicsToolbar.jsx
import React, { useState, useContext } from "react";
import { ChromePicker } from "react-color";
import { DesignContext } from "../DesignToolPage";

// --- Icons for the tools ---
import {
  FaTrash,
  FaCopy,
  FaLock,
  FaUnlock,
  FaLayerGroup,
} from "react-icons/fa";
import { IoColorFill } from "react-icons/io5";
import {
  TbArrowsHorizontal,
  TbArrowsVertical,
  TbColorSwatch,
  TbBorderStyle,
} from "react-icons/tb"; // Corrected import

// Reusable Button Component
const ToolbarButton = ({ onClick, title, children, active = false }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

const GraphicsToolbar = () => {
  const {
    selectedElementId,
    designElements,
    updateDesignElement,
    deleteDesignElement,
    duplicateElement,
    updateLayer,
    toggleLockElement,
    flipElement,
  } = useContext(DesignContext);

  const el = designElements.find((e) => e.id === selectedElementId);

  const [displayFillPicker, setDisplayFillPicker] = useState(false);
  const [displayStrokePicker, setDisplayStrokePicker] = useState(false);
  const [displayBorderStyle, setDisplayBorderStyle] = useState(false);

  if (!el) return null;

  const handleUpdate = (prop, value) =>
    updateDesignElement(el.id, { [prop]: value });

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
    <div className="bg-white rounded-lg shadow-xl p-2 flex items-center gap-1 border border-gray-200">
      {/* Fill Color */}
      <div className="relative">
        <ToolbarButton
          title="Fill Color"
          onClick={() => setDisplayFillPicker((p) => !p)}
        >
          <IoColorFill className="w-5 h-5 text-gray-600" />
        </ToolbarButton>
        {displayFillPicker && (
          <div style={popover}>
            <div style={cover} onClick={() => setDisplayFillPicker(false)} />
            <ChromePicker
              color={el.fillColor}
              onChange={(c) => handleUpdate("fillColor", c.hex)}
              disableAlpha
            />
          </div>
        )}
      </div>

      {/* Stroke Color */}
      <div className="relative">
        <ToolbarButton
          title="Stroke Color"
          onClick={() => setDisplayStrokePicker((p) => !p)}
        >
          <TbColorSwatch className="w-5 h-5 text-gray-600" />
        </ToolbarButton>
        {displayStrokePicker && (
          <div style={popover}>
            <div style={cover} onClick={() => setDisplayStrokePicker(false)} />
            <ChromePicker
              color={el.strokeColor}
              onChange={(c) => handleUpdate("strokeColor", c.hex)}
              disableAlpha
            />
          </div>
        )}
      </div>

      {/* Stroke Width */}
      <div className="flex items-center p-1 rounded-md hover:bg-gray-200">
        <input
          type="number"
          value={el.strokeWidth || 0}
          onChange={(e) =>
            handleUpdate("strokeWidth", parseInt(e.target.value, 10))
          }
          className="w-12 text-center bg-transparent focus:outline-none"
          min="0"
        />
      </div>

      {/* Stroke Style */}
      <div className="relative">
        <ToolbarButton
          title="Border Style"
          onClick={() => setDisplayBorderStyle((p) => !p)}
        >
          <TbBorderStyle className="w-5 h-5 text-gray-600" />
        </ToolbarButton>
        {displayBorderStyle && (
          <div style={popover} className="bg-white rounded-md shadow-lg p-1">
            <div style={cover} onClick={() => setDisplayBorderStyle(false)} />
            <button
              onClick={() => handleUpdate("strokeStyle", "solid")}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
            >
              Solid
            </button>
            <button
              onClick={() => handleUpdate("strokeStyle", "dashed")}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
            >
              Dashed
            </button>
            <button
              onClick={() => handleUpdate("strokeStyle", "dotted")}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
            >
              Dotted
            </button>
          </div>
        )}
      </div>

      <div className="h-6 border-l border-gray-300 mx-1"></div>

      {/* Layering */}
      <ToolbarButton
        title="Bring Forward"
        onClick={() => updateLayer(el.id, "front")}
      >
        <FaLayerGroup className="w-5 h-5" />
      </ToolbarButton>

      {/* Flip */}
      <ToolbarButton
        title="Flip Horizontal"
        onClick={() => flipElement(el.id, "horizontal")}
      >
        <TbArrowsHorizontal className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        title="Flip Vertical"
        onClick={() => flipElement(el.id, "vertical")}
      >
        <TbArrowsVertical className="w-5 h-5" />
      </ToolbarButton>

      <div className="h-6 border-l border-gray-300 mx-1"></div>

      {/* Actions */}
      <ToolbarButton title="Duplicate" onClick={() => duplicateElement(el.id)}>
        <FaCopy className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        title={el.locked ? "Unlock" : "Lock"}
        onClick={() => toggleLockElement(el.id)}
      >
        {el.locked ? (
          <FaLock className="w-5 h-5" />
        ) : (
          <FaUnlock className="w-5 h-5" />
        )}
      </ToolbarButton>
      <ToolbarButton title="Delete" onClick={() => deleteDesignElement(el.id)}>
        <FaTrash className="w-5 h-5" />
      </ToolbarButton>
    </div>
  );
};

export default GraphicsToolbar;
