// src/components/IconLibraryModal.jsx
import React, { useContext, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DesignContext } from "../DesignToolPage"; // Adjust path as needed
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";

const IconLibraryModal = ({ isOpen, onClose }) => {
  const {
    addDesignElement,
    updateDesignElement,
    iconModalMode,
    replacingElementId,
    setIsIconModalOpen,
  } = useContext(DesignContext);

  const iconLibrary = useMemo(() => {
    const allIcons = { ...FaIcons, ...MdIcons, ...BsIcons, ...GiIcons };
    return Object.keys(allIcons)
      .filter((name) => name.match(/^(Fa|Md|Bs|Gi)[A-Z]/))
      .map((name) => ({
        id: `icon-${name.toLowerCase()}`,
        name: name.replace(/^(Fa|Md|Bs|Gi)/, ""),
        component: allIcons[name],
        type: "icon",
      }));
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ICONS_PER_PAGE = 24;

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return iconLibrary;
    return iconLibrary.filter((icon) =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, iconLibrary]);

  const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);
  const indexOfLastIcon = currentPage * ICONS_PER_PAGE;
  const indexOfFirstIcon = indexOfLastIcon - ICONS_PER_PAGE;
  const currentIcons = filteredIcons.slice(indexOfFirstIcon, indexOfLastIcon);

  const handleSelect = (icon) => {
    if (iconModalMode === "add") {
      addDesignElement({
        type: "icon",
        icon: icon.component,
        x: 80,
        y: 80,
        width: 60,
        height: 60,
        color: "#000000",
        opacity: 1,
      });
    } else if (iconModalMode === "replace" && replacingElementId) {
      updateDesignElement(replacingElementId, { icon: icon.component });
    }
    setIsIconModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 flex flex-col"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {iconModalMode === "add" ? "Add Icon" : "Replace Icon"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <FaIcons.FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for icons..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-lg py-1.5 pl-9 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {currentIcons.length > 0 ? (
            <div className="grid grid-cols-6 gap-4">
              {currentIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => handleSelect(icon)}
                  className="p-2 border rounded-lg flex justify-center items-center h-16 hover:bg-blue-100 hover:border-blue-500 transition-colors"
                  title={icon.name}
                >
                  <icon.component className="w-8 h-8 text-gray-800" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No icons found.
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 border rounded-lg disabled:opacity-50"
          >
            &larr; Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-1 border rounded-lg disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default IconLibraryModal;
