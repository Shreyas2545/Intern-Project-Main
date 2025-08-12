import React, { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle, FaCog, FaTimes } from "react-icons/fa";
import { DesignContext } from "./DesignToolPage";

const ZOOM_LEVELS = [25, 50, 75, 100, 125, 150, 200, 250, 300];

const BottomSection = () => {
  const { zoomLevel, setZoomLevel } = useContext(DesignContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showView, setShowView] = useState(false);
  const dropdownRef = useRef();
  const viewRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
      if (viewRef.current && !viewRef.current.contains(e.target))
        setShowView(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const ViewPanel = ({ onClose }) => {
    const [grids, setGrids] = useState(false);
    const [rulers, setRulers] = useState(true);
    const [guides, setGuides] = useState(true);
    const [highlight, setHighlight] = useState(true);

    return (
      <motion.div
        ref={viewRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-96 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-blue-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-800">View Options</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        <div className="space-y-4 text-sm">
          {[
            {
              label: "Grids",
              desc: "Align your design with a grid.",
              state: grids,
              setter: setGrids,
            },
            {
              label: "Rulers",
              desc: "Display rulers on the artboard.",
              state: rulers,
              setter: setRulers,
            },
            {
              label: "Safety & Bleed",
              desc: "Show safe area boundaries.",
              state: guides,
              setter: setGuides,
            },
            {
              label: "Highlight Empty Text",
              desc: "Outline empty text boxes.",
              state: highlight,
              setter: setHighlight,
            },
          ].map(({ label, desc, state, setter }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-800">{label}</div>
                <div className="text-gray-500 text-xs">{desc}</div>
              </div>
              <button
                onClick={() => setter(!state)}
                className={`w-10 h-5 rounded-full p-0.5 transition-all duration-200 ${
                  state ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                    state ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <a
              href="#"
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              View keyboard shortcuts
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-t px-6 py-4 flex items-center justify-between z-50">
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
          >
            <span className="font-medium">{zoomLevel}%</span>
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1L10.53 13a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute bottom-full mb-2 w-24 bg-white rounded-lg shadow-lg border border-blue-100">
              {ZOOM_LEVELS.map((zl) => (
                <button
                  key={zl}
                  onClick={() => {
                    setZoomLevel(zl);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-blue-800 hover:bg-blue-100"
                >
                  {zl}%
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="range"
          min="10"
          max="300"
          step="2"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className="w-48 h-2 bg-blue-100 rounded-lg cursor-pointer accent-blue-500"
        />
        <span className="text-blue-800 font-medium">{zoomLevel}%</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowView(!showView);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
        >
          <FaCog />
          <span>View</span>
        </button>
        {showView && <ViewPanel onClose={() => setShowView(false)} />}
      </div>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
        <FaQuestionCircle />
        <span>Design Help</span>
      </button>
    </footer>
  );
};

export default BottomSection;
