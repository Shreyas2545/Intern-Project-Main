// src/components/pages/GraphicsPanel.jsx
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { DesignContext } from "../DesignToolPage"; // Adjust path as needed
import IconLibraryModal from "./IconLibraryModal";
import {
  FaSearch,
  FaStar,
  FaHeart,
  FaSmile,
  FaMusic,
  FaCamera,
  FaCog,
  FaHome,
  FaUser,
} from "react-icons/fa";

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const shapes = [
  {
    id: "shape square",
    type: "graphic",
    shapeType: "square",
    renderer: () => <div className="w-full h-full bg-black rounded-sm" />,
  },
  {
    id: "shape circle",
    type: "graphic",
    shapeType: "circle",
    renderer: () => <div className="w-full h-full bg-black rounded-full" />,
  },
  {
    id: "shape triangle",
    type: "graphic",
    shapeType: "triangle",
    renderer: () => (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "24px solid transparent",
          borderRight: "24px solid transparent",
          borderBottom: "42px solid black",
        }}
      />
    ),
  },
  {
    id: "shape star",
    type: "graphic",
    shapeType: "star",
    renderer: () => <FaStar className="w-full h-full text-black" />,
  },
];

const featuredIcons = [
  { id: "icon-star", type: "icon", icon: FaStar },
  { id: "icon-heart", type: "icon", icon: FaHeart },
  { id: "icon-smile", type: "icon", icon: FaSmile },
  { id: "icon-music", type: "icon", icon: FaMusic },
  { id: "icon-camera", type: "icon", icon: FaCamera },
  { id: "icon-cog", type: "icon", icon: FaCog },
  { id: "icon-home", type: "icon", icon: FaHome },
  { id: "icon-user", type: "icon", icon: FaUser },
];

const GraphicsPanel = ({ addDesignElement }) => {
  const { setIsIconModalOpen, setIconModalMode } = useContext(DesignContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddElement = (item) => {
    const baseProps = { x: 80, y: 80 };
    if (item.type === "graphic") {
      addDesignElement({
        ...baseProps,
        type: "graphic",
        width: 100,
        height: 100,
        shapeType: item.shapeType,
        fillColor: "#000000",
        strokeColor: "#000000",
        strokeWidth: 0,
        opacity: 1,
      });
    } else if (item.type === "icon") {
      addDesignElement({
        ...baseProps,
        type: "icon",
        width: 60,
        height: 60,
        icon: item.icon,
        color: "#000000",
        opacity: 1,
      });
    }
  };

  const openAddModal = () => {
    setIconModalMode("add");
    setIsIconModalOpen(true);
  };

  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const filteredShapes = shapes.filter((shape) =>
    shape.id.toLowerCase().includes(lowerCaseSearchTerm)
  );
  const filteredIcons = featuredIcons.filter((icon) =>
    icon.id.toLowerCase().includes(lowerCaseSearchTerm)
  );

  return (
    <>
      <div className="p-4 w-full h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Graphics</h3>
        <div className="relative mb-4">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search featured..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredShapes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Shapes
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {filteredShapes.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleAddElement(item)}
                    className="p-2 h-14 border rounded-lg flex justify-center items-center hover:bg-gray-100"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {item.renderer()}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {filteredIcons.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-800">Icons</h4>
                <button
                  onClick={openAddModal}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Show more
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {filteredIcons.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleAddElement(item)}
                    className="p-2 h-14 border rounded-lg flex justify-center items-center hover:bg-gray-100"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <item.icon className="w-7 h-7 text-gray-700" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {filteredShapes.length === 0 && filteredIcons.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No items found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GraphicsPanel;
