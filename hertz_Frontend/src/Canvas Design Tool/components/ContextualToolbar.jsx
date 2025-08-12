/**
 * @file ContextualToolbar.jsx
 * @description A dynamic toolbar that renders the appropriate specific toolbar
 * (e.g., TextToolbar, ImageToolbar) based on the type of the selected element.
 * It now uses the shared DesignContext.
 */
import React, { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DesignContext } from "./DesignToolPage"; // Correct import

// Import the specific toolbars
import TextToolbar from "./pages/TextToolbar";
import ImageToolbar from "./pages/ImageToolbar";
import IconToolbar from "./pages/IconToolbar";
import GraphicsToolbar from "./pages/GraphicsToolbar";

const toolbarVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

const ContextualToolbar = () => {
  const { selectedElementId, designElements } = useContext(DesignContext); // Use context here
  if (!selectedElementId) return null;

  const selectedElement = designElements.find(
    (el) => el.id === selectedElementId
  );
  if (!selectedElement) return null;

  const renderToolbar = () => {
    switch (selectedElement.type) {
      case "text":
        return <TextToolbar />;
      case "image":
        return <ImageToolbar />;
      case "icon":
        return <IconToolbar />;
      case "graphic":
        return <GraphicsToolbar />;
      default:
        return null;
    }
  };

  const ToolbarComponent = renderToolbar();

  return (
    <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-30 h-16 flex items-center">
      <AnimatePresence>
        {ToolbarComponent && (
          <motion.div
            variants={toolbarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {ToolbarComponent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextualToolbar;
