/**
 * @file DesignElementWrapper.jsx
 * @description A wrapper component for every element on the canvas.
 * It handles all user interactions like selection, dragging, resizing, and rotation
 * using framer-motion and communicates all changes back to the central design store.
 */

import React from "react";
import { motion } from "framer-motion";
import { useDesignStore } from "../store/useDesignStore";
import ElementRenderer from "./ElementRenderer"; // We will create this next

const DesignElementWrapper = ({ element }) => {
  const {
    selectedElementIds,
    setSelectedElementIds,
    updateElements,
    finalizeUpdate,
  } = useDesignStore((state) => ({
    selectedElementIds: state.selectedElementIds,
    setSelectedElementIds: state.setSelectedElementIds,
    updateElements: state.updateElements,
    finalizeUpdate: state.finalizeUpdate,
  }));

  const isSelected = selectedElementIds.includes(element.id);

  const handleSelect = (e) => {
    e.stopPropagation(); // Prevent canvas click from deselecting
    if (e.shiftKey) {
      // Add or remove from selection with Shift key
      const newSelection = isSelected
        ? selectedElementIds.filter((id) => id !== element.id)
        : [...selectedElementIds, element.id];
      setSelectedElementIds(newSelection);
    } else {
      // Select only this element if not already the sole selection
      if (!isSelected || selectedElementIds.length > 1) {
        setSelectedElementIds([element.id]);
      }
    }
  };

  return (
    <motion.div
      key={element.id}
      className="absolute"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        rotate: element.rotation || 0,
        zIndex: element.zIndex,
        cursor: isSelected ? "move" : "pointer",
      }}
      drag
      dragMomentum={false} // Prevents the element from "drifting" after drag
      onDragEnd={(event, info) => {
        // On drag end, update the element's position in the store
        updateElements([element.id], (el) => ({
          x: el.x + info.offset.x,
          y: el.y + info.offset.y,
        }));
        // Commit this change to the undo/redo history
        finalizeUpdate();
      }}
      onTapStart={handleSelect}
    >
      <div
        className="w-full h-full relative"
        style={{
          // Apply a visual indicator for selection
          outline: isSelected ? "2px solid #3B82F6" : "none",
          outlineOffset: "2px",
        }}
      >
        {/* The ElementRenderer will handle the actual visual output (text, image, etc.) */}
        <ElementRenderer element={element} />

        {/* Placeholder for resize and rotate handles */}
        {isSelected && (
          <>
            {/* Bottom-right resize handle */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-se-resize" />
            {/* Top-left resize handle */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nw-resize" />
            {/* Rotation handle */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-alias" />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DesignElementWrapper;
