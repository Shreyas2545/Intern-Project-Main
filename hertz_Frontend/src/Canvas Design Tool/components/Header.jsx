import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaEye,
  FaClock,
  FaUndo,
  FaRedo,
  FaUpload,
  FaDownload,
  FaSave,
  FaFolderOpen,
  FaPlusSquare,
  FaTimes,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { DesignContext } from "./DesignToolPage.jsx";
import logo from "../../assets/HomePage/logo.svg";

const PreviewShapeRenderer = ({ element }) => {
  const {
    shapeType,
    fillColor,
    strokeColor,
    strokeWidth,
    strokeStyle,
    opacity,
    flip,
  } = element;
  const finalFill =
    shapeType === "line" || shapeType === "arrow" ? "none" : fillColor;

  const commonProps = {
    fill: finalFill,
    stroke: strokeColor || "transparent",
    strokeWidth: strokeWidth || 0,
    strokeDasharray:
      strokeStyle === "dashed"
        ? "5,5"
        : strokeStyle === "dotted"
        ? "2,2"
        : "none",
    opacity: opacity || 1,
    transform: flip
      ? `scale(${flip === "horizontal" ? "-1,1" : "1,-1"})`
      : "none",
    transformOrigin: "center",
  };

  const SvgDefs = () => (
    <defs>
      <marker
        id="previewArrowhead"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
        fill={strokeColor}
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  switch (shapeType) {
    case "square":
    case "rectangle":
      return <rect x="0" y="0" width="100" height="100" {...commonProps} />;
    case "circle":
      return <ellipse cx="50" cy="50" rx="50" ry="50" {...commonProps} />;
    case "triangle":
      return <polygon points="50,0 100,100 0,100" {...commonProps} />;
    case "star":
      return (
        <polygon
          points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
          {...commonProps}
        />
      );
    case "pentagon":
      return (
        <polygon points="50,0 100,38 82,100 18,100 0,38" {...commonProps} />
      );
    case "hexagon":
      return (
        <polygon
          points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
          {...commonProps}
        />
      );
    case "diamond":
      return <polygon points="50,0 100,50 50,100 0,50" {...commonProps} />;
    case "line":
      return <line x1="0" y1="100" x2="100" y2="0" {...commonProps} />;
    case "arrow":
      return (
        <>
          <SvgDefs />
          <line
            x1="0"
            y1="50"
            x2="95"
            y2="50"
            markerEnd="url(#previewArrowhead)"
            {...commonProps}
          />
        </>
      );
    default:
      return <rect x="0" y="0" width="100" height="100" fill="#cccccc" />;
  }
};

const PreviewElementRenderer = ({ element }) => {
  switch (element.type) {
    case "text":
      return (
        <div
          className="w-full h-full flex items-center justify-center p-1 whitespace-pre-wrap break-words"
          style={{
            fontFamily: element.fontFamily || "Inter, system-ui, sans-serif",
            fontSize: element.fontSize || 20,
            fontWeight: element.fontWeight || "normal",
            fontStyle: element.fontStyle || "normal",
            textDecoration: element.textDecoration || "none",
            color: element.color || "#1f2937",
            backgroundColor:
              element.backgroundColor === "transparent"
                ? "transparent"
                : element.backgroundColor,
            textAlign: element.textAlign || "center",
            lineHeight: 1.4,
            opacity: element.opacity || 1,
            border:
              element.stroke && element.strokeWidth
                ? `${element.strokeWidth}px solid ${element.stroke}`
                : "none",
            borderRadius: element.borderRadius
              ? `${element.borderRadius}px`
              : "0",
            transform: element.isCurved ? `rotateX(20deg)` : "none",
          }}
        >
          {element.content || "Text"}
        </div>
      );

    case "image":
      return (
        <img
          src={element.content}
          alt="User uploaded content"
          draggable={false}
          className="w-full h-full object-cover pointer-events-none"
          style={{
            opacity: element.opacity || 1,
            borderRadius: `${element.borderRadius || 0}px`,
            filter: element.filter || "none",
          }}
          onError={(e) => {
            e.target.src =
              "https://placehold.co/200x200/cccccc/333333?text=Image+Error";
            e.target.onerror = null;
          }}
        />
      );

    case "graphic":
      return (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none"
        >
          <PreviewShapeRenderer element={element} />
        </svg>
      );

    case "icon":
      const IconComponent = element.icon;
      return IconComponent ? (
        <IconComponent
          className="w-full h-full pointer-events-none drop-shadow-sm"
          style={{
            color: element.color || "#4f46e5",
            opacity: element.opacity || 1,
            fontSize: Math.min(element.width, element.height) * 0.8,
          }}
        />
      ) : null;

    case "table":
      return (
        <div className="w-full h-full border border-gray-400 bg-white flex items-center justify-center">
          <span className="text-xs text-gray-500">Table Preview</span>
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-500">Unsupported Element</span>
        </div>
      );
  }
};

const Header = () => {
  const {
    projectName,
    setProjectName,
    designElements,
    canvasSize,
    canvasBackground,
    currentView,
    setCurrentView,
    undo,
    redo,
    canUndo,
    canRedo,
    isSaving,
    saveDesign,
    addDesignElement,
  } = useContext(DesignContext);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProjectNameEditing, setIsProjectNameEditing] = useState(false);
  const projectNameInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const previewCanvasBackgroundStyle = useMemo(() => {
    if (typeof canvasBackground === "string") {
      return { background: canvasBackground };
    } else if (canvasBackground?.type === "gradient") {
      const { colors, angle = 90 } = canvasBackground;
      return {
        background: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
      };
    }
    return { background: "#ffffff" };
  }, [canvasBackground]);

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
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
      zIndex: designElements.length,
      view: currentView,
      opacity: 1,
      filter: "none",
      hue: 0,
      sat: 1,
      br: 1,
      borderRadius: 0,
    });
    fileInputRef.current.value = null;
  };

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  const handleProjectNameSave = () => {
    if (projectNameInputRef.current) {
      setProjectName(
        projectNameInputRef.current.value.trim() || "Untitled Design"
      );
      setIsProjectNameEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleProjectNameSave();
    } else if (e.key === "Escape") {
      setIsProjectNameEditing(false);
    }
  };

  useEffect(() => {
    if (isProjectNameEditing && projectNameInputRef.current) {
      projectNameInputRef.current.focus();
      projectNameInputRef.current.select();
    }
  }, [isProjectNameEditing]);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-30">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-8" />
        {isProjectNameEditing ? (
          <div className="flex items-center space-x-2">
            <input
              ref={projectNameInputRef}
              defaultValue={projectName}
              onBlur={handleProjectNameSave}
              onKeyDown={handleKeyDown}
              className="text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={handleProjectNameSave}
              className="text-green-600 hover:text-green-700"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => setIsProjectNameEditing(false)}
              className="text-red-600 hover:text-red-700"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <h1
            className="text-lg font-semibold text-gray-900 cursor-pointer"
            onClick={() => setIsProjectNameEditing(true)}
          >
            {projectName}
          </h1>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-full transition-colors ${
            canUndo
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 cursor-not-allowed"
          }`}
          title="Undo"
        >
          <FaUndo />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-full transition-colors ${
            canRedo
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 cursor-not-allowed"
          }`}
          title="Redo"
        >
          <FaRedo />
        </button>
        <div className="relative">
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full flex items-center space-x-1"
          >
            <FaEye />
            <span>Preview</span>
            <FiChevronDown
              className={`transition-transform ${
                isPreviewOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {isPreviewOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-4 w-64 z-50"
              >
                <div
                  className="relative w-full h-36 rounded overflow-hidden"
                  style={{
                    ...previewCanvasBackgroundStyle,
                    transform:
                      currentView === "Back" ? "rotateY(180deg)" : "none",
                  }}
                >
                  {designElements
                    .filter((el) => el.view === currentView || !el.view)
                    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                    .map((element) => (
                      <div
                        key={element.id}
                        className="absolute"
                        style={{
                          left: `${(element.x / canvasSize.width) * 100}%`,
                          top: `${(element.y / canvasSize.height) * 100}%`,
                          width: `${(element.width / canvasSize.width) * 100}%`,
                          height: `${
                            (element.height / canvasSize.height) * 100
                          }%`,
                          transform: `rotate(${element.rotation || 0}deg)`,
                          zIndex: element.zIndex || 0,
                        }}
                      >
                        <PreviewElementRenderer element={element} />
                      </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => setCurrentView("Front")}
                    className={`px-2 py-1 rounded ${
                      currentView === "Front"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setCurrentView("Back")}
                    className={`px-2 py-1 rounded ${
                      currentView === "Back"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => fileInputRef.current.click()}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          title="Upload Image"
        >
          <FaUpload />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAddImage}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleExport}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          title="Export Design"
        >
          <FaDownload />
        </button>
        <button
          onClick={saveDesign}
          disabled={isSaving}
          className={`p-2 rounded-full transition-colors flex items-center space-x-1 ${
            isSaving
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Save Design"
        >
          {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>Save</span>
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          title="Back to Dashboard"
        >
          <FaFolderOpen />
        </button>
      </div>
    </header>
  );
};

export default Header;