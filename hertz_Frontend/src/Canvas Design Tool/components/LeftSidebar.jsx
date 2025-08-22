import React, { useRef, useEffect, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  FaTextHeight,
  FaImage,
  FaPaintBrush,
  FaFillDrip,
} from "react-icons/fa";

import TextPanel from "./pages/TextPanel";
import ImagesPanel from "./pages/ImagesPanel";
import GraphicsPanel from "./pages/GraphicsPanel";
import BackgroundPanel from "./pages/BackgroundPanel";
import { DesignContext } from "./DesignToolPage";

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const panelVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { x: -20, opacity: 0, transition: { duration: 0.15 } },
};

const tools = [
  { id: "text", Icon: FaTextHeight, label: "Text", color: "blue" },
  { id: "images", Icon: FaImage, label: "Images", color: "green" },
  { id: "graphics", Icon: FaPaintBrush, label: "Graphics", color: "purple" },
  { id: "background", Icon: FaFillDrip, label: "Background", color: "orange" },
];

const PanelMap = {
  text: TextPanel,
  images: ImagesPanel,
  graphics: GraphicsPanel,
  background: BackgroundPanel,
};

const LeftSidebar = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const panelRef = useRef(null);
  const iconRefs = useRef({});
  const { addDesignElement, designElements, currentView } =
    useContext(DesignContext);

  // Function to add a text element with all toolbar properties
  const onAddText = (text) => {
    addDesignElement({
      type: "text",
      content: text || "New Text",
      x: 50,
      y: 50,
      width: 200,
      height: 40,
      id: `text-${Date.now()}`,
      fontSize: 24,
      color: "#000000",
      fontFamily: "Arial",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "center",
      backgroundColor: "transparent",
      stroke: null,
      strokeWidth: 0,
      opacity: 1,
      isCurved: false,
      zIndex: designElements.length,
      view: currentView,
      rotation: 0,
      borderRadius: 0,
    });
  };

  // Function to add an image element with all toolbar properties
  const onAddImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image file size must be under 10MB");
      return;
    }
    const url = URL.createObjectURL(file);
    addDesignElement({
      type: "image",
      content: url,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      id: `image-${Date.now()}`,
      opacity: 1,
      filter: "none",
      hue: 0,
      sat: 1,
      br: 1,
      borderRadius: 0,
      zIndex: designElements.length,
      view: currentView,
      rotation: 0,
    });
  };

  // Function to add a graphic element with all toolbar properties
  const onAddGraphic = (shapeType = "square") => {
    addDesignElement({
      type: "graphic",
      shapeType,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      id: `graphic-${Date.now()}`,
      fillColor: "#cccccc",
      strokeColor: "transparent",
      strokeWidth: 0,
      strokeStyle: "solid",
      opacity: 1,
      flip: null,
      zIndex: designElements.length,
      view: currentView,
      rotation: 0,
    });
  };

  // --- For absolute placement next to icon at body-level ---
  const [panelPos, setPanelPos] = useState({ top: 100, left: 100 });

  useEffect(() => {
    if (!selectedTool) return;

    // Position panel relative to the icon
    const icon = iconRefs.current[selectedTool];
    if (icon) {
      const rect = icon.getBoundingClientRect();
      setPanelPos({
        top: rect.top + rect.height / 2 - 40,
        left: rect.right + 10,
      });
    }
  }, [selectedTool]);

  // Click outside to close panel
  useEffect(() => {
    if (!selectedTool) return;
    const handleClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !e.target.closest(".sidebar-icon-btn")
      ) {
        setSelectedTool(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [selectedTool]);

  const getToolStyles = (id, color, isSelected) => {
    const colorMap = {
      blue: {
        selected:
          "border-blue-500 text-blue-600 bg-blue-50 shadow-lg shadow-blue-200/50",
        hover: "hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md",
        default: "border-gray-200 text-gray-600",
      },
      green: {
        selected:
          "border-green-500 text-green-600 bg-green-50 shadow-lg shadow-green-200/50",
        hover: "hover:border-green-300 hover:bg-green-50/50 hover:shadow-md",
        default: "border-gray-200 text-gray-600",
      },
      purple: {
        selected:
          "border-purple-500 text-purple-600 bg-purple-50 shadow-lg shadow-purple-200/50",
        hover: "hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md",
        default: "border-gray-200 text-gray-600",
      },
      orange: {
        selected:
          "border-orange-500 text-orange-600 bg-orange-50 shadow-lg shadow-orange-200/50",
        hover: "hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-md",
        default: "border-gray-200 text-gray-600",
      },
    };
    const colors = colorMap[color] || colorMap.blue;
    return isSelected ? colors.selected : `${colors.default} ${colors.hover}`;
  };

  const currentPanelProps = {
    text: { onAddText },
    images: { onAddImage },
    graphics: { onAddGraphic },
    background: {},
  };

  // --- Use portal to move panel outside sidebar z-index stack ---
  const popupPanel = selectedTool
    ? createPortal(
        <AnimatePresence>
          <motion.div
            key={selectedTool}
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-[105] w-80 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
            style={{
              top: `${panelPos.top}px`,
              left: `${panelPos.left}px`,
            }}
          >
            <div className="p-6">
              {React.createElement(PanelMap[selectedTool], {
                ...currentPanelProps[selectedTool],
                addDesignElement,
                onClose: () => setSelectedTool(null),
              })}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      <div className="relative flex flex-col items-center bg-white py-4 w-20 border-r border-gray-200 shadow-lg z-30">
        <div className="flex flex-col items-center space-y-2 mt-2">
          {tools.map(({ id, Icon, label, color }) => (
            <motion.button
              key={id}
              ref={(el) => (iconRefs.current[id] = el)}
              onClick={() => setSelectedTool(selectedTool === id ? null : id)}
              className={`sidebar-icon-btn flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 border-2 ${getToolStyles(
                id,
                color,
                selectedTool === id
              )}`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              title={label}
            >
              <Icon className="text-2xl mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      {popupPanel}
    </>
  );
};

export default LeftSidebar;
