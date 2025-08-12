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

// Helper for rendering SVG shapes in preview
const PreviewShapeRenderer = ({ element }) => {
  const { shapeType, fillColor, strokeColor, strokeWidth, opacity } = element;
  const finalFill =
    shapeType === "line" || shapeType === "arrow" ? "none" : fillColor;

  const commonProps = {
    fill: finalFill,
    stroke: strokeColor || "transparent",
    strokeWidth: strokeWidth || 0,
    opacity: opacity || 1,
  };
  const SvgDefs = () => (
    <defs>
      <marker
        id="previewArrowhead" // Unique ID for preview
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

// Main renderer for elements within the preview modal
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
            opacity: element.opacity,
          }}
        >
          {element.content}
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
            opacity: element.opacity,
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
            opacity: element.opacity,
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

const isValidObjectId = (id) => {
  return id && typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
};

const Header = () => {
  const context = useContext(DesignContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle case where context is not available
  if (!context) {
    console.error(
      "DesignContext is not available. Please ensure the Header component is wrapped in a DesignContext.Provider."
    );
    return null; // or render a fallback UI
  }

  const {
    projectName,
    undo,
    redo,
    canUndo,
    canRedo,
    addDesignElement,
    designElements,
    setDesignElements,
    setSelectedElementId,
    canvasSize,
    setCanvasSize, // This was missing in your destructuring
    canvasBackground,
    currentView,
    setCurrentView,
    saveDesign,
    isSaving,
    productId,
    isCreating,
    isEditing,
  } = context;

  const fileInputRef = useRef(null);
  const loadDesignInputRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);
  const [localSaveStatus, setLocalSaveStatus] = useState(null);
  const [debugInfo, setDebugInfo] = useState(false);

  const canSave = useMemo(
    () => designElements?.length > 0 && isValidObjectId(productId),
    [designElements, productId]
  );

  const handleAddImage = (e) => {
    try {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        if (file.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(file);
          addDesignElement({
            type: "image",
            content: imageUrl,
            x: 50,
            y: 50,
            width: 200,
            height: 200,
            id: `image-${Date.now()}`,
          });
        } else {
          alert("Please select a valid image file.");
        }
      }
    } catch (error) {
      console.error("Error in handleAddImage:", error);
    }
  };

  const handleSaveDesignLocally = () => {
    if (!designElements || designElements.length === 0) {
      alert("Canvas is empty. Add some elements before saving!");
      return;
    }
    try {
      setLocalSaveStatus("saving");
      const designData = {
        projectName: projectName || "Untitled Design",
        productId,
        isCreating,
        isEditing,
        elements: designElements,
        canvasSize,
        canvasBackground,
        createdAt: new Date().toISOString(),
        version: "1.0",
      };
      const dataStr = JSON.stringify(designData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(projectName || "design")?.replace(
        /\s/g,
        "_"
      )}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setLocalSaveStatus("success");
      setTimeout(() => setLocalSaveStatus(null), 3000);
      alert("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      setLocalSaveStatus("error");
      setTimeout(() => setLocalSaveStatus(null), 3000);
      alert("Failed to save design.");
    }
  };

  const handleSaveToServer = async () => {
    console.log("handleSaveToServer called");
    if (!designElements || designElements.length === 0) {
      alert("Canvas is empty. Add some elements before saving!");
      return;
    }
    if (!productId || !isValidObjectId(productId)) {
      alert(
        "No valid product ID found. Please ensure you're working with a valid product."
      );
      return;
    }
    if (!saveDesign) {
      alert(
        "Save function not available. Please check your DesignContext setup."
      );
      return;
    }
    try {
      console.log("Calling saveDesign function");
      // saveDesign uses state internally; no need to pass a separate object
      await saveDesign();
      alert("Design saved successfully!");
      navigate(`/products/${productId}`);
    } catch (error) {
      console.error("Error saving to server:", error);
      alert(`Failed to save design: ${error.message || "Unknown error"}`);
    }
  };

  const handleLoadDesign = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/json") {
        alert("Please select a valid JSON file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result);
          let elementsToLoad = [];
          let loadedCanvasSize = null;
          let loadedCanvasBackground = null;

          if (Array.isArray(loadedData)) {
            elementsToLoad = loadedData;
          } else if (
            loadedData.elements &&
            Array.isArray(loadedData.elements)
          ) {
            elementsToLoad = loadedData.elements;
            if (loadedData.canvasSize) {
              loadedCanvasSize = loadedData.canvasSize;
            }
            if (loadedData.canvasBackground) {
              loadedCanvasBackground = loadedData.canvasBackground;
            }
          }

          if (
            elementsToLoad.length > 0 &&
            elementsToLoad.every(
              (el) => typeof el === "object" && el.id && el.type
            )
          ) {
            if (setDesignElements && setCanvasSize) {
              setDesignElements(elementsToLoad);
              // Safely set the loaded canvas size
              if (loadedCanvasSize) {
                setCanvasSize(loadedCanvasSize);
              }
              // Safely set the loaded canvas background
              if (loadedCanvasBackground) {
                // Assuming you have a setCanvasBackground function in context
                // setCanvasBackground(loadedCanvasBackground);
              }
              setSelectedElementId?.(null);
              alert("Design loaded successfully!");
            } else {
              console.error(
                "setDesignElements or setCanvasSize not available in DesignContext"
              );
              alert(
                "Error: Cannot load design. DesignContext not fully configured."
              );
            }
          } else {
            alert(
              "Invalid design file format. Please load a valid design JSON."
            );
          }
        } catch (error) {
          console.error("Error parsing loaded design file:", error);
          alert("Error loading design: Invalid file content or format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleNewDesign = () => {
    if (
      window.confirm(
        "Are you sure you want to start a new design? Any unsaved changes will be lost."
      )
    ) {
      if (setDesignElements) {
        setDesignElements([]);
        setSelectedElementId?.(null);
        alert("New design started!");
      } else {
        console.error("setDesignElements not available in DesignContext");
        alert(
          "Error: Cannot start new design. DesignContext not fully configured."
        );
      }
    }
  };

  const previewCanvasBackgroundStyle = useMemo(() => {
    if (!canvasBackground) return { backgroundColor: "#FFFFFF" };
    switch (canvasBackground.type) {
      case "color":
        return { backgroundColor: canvasBackground.value };
      case "gradient":
        const directions = {
          "to-r": "to right",
          "to-l": "to left",
          "to-b": "to bottom",
          "to-t": "to top",
        };
        const direction = directions[canvasBackground.direction] || "135deg";
        return {
          background: `linear-gradient(${direction}, ${canvasBackground.colors[0]}, ${canvasBackground.colors[1]})`,
        };
      case "image":
        return {
          backgroundImage: `url(${canvasBackground.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      default:
        return { backgroundColor: "#FFFFFF" };
    }
  }, [canvasBackground]);

  const saveProductButton = (
    <motion.button
      onClick={handleSaveToServer}
      whileHover={{ scale: canSave ? 1.05 : 1 }}
      whileTap={{ scale: canSave ? 0.95 : 1 }}
      disabled={isSaving || !canSave}
      className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md
        ${
          isSaving
            ? "bg-yellow-500 text-white cursor-wait"
            : canSave
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-400 text-gray-600 cursor-not-allowed"
        }
      `}
      title={
        isSaving
          ? "Saving in progress..."
          : !canSave
          ? "Add elements to the canvas before saving."
          : `Save design to product ${productId}`
      }
    >
      {isSaving ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <FaCheck />
          <span>Save Product</span>
        </>
      )}
    </motion.button>
  );

  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-white shadow-lg z-20 relative">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Vistaprint" className="h-7 w-auto" />
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 rounded-lg text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => setIsFileDropdownOpen(!isFileDropdownOpen)}
            >
              File{" "}
              <FiChevronDown
                className={`ml-2 transition-transform duration-200 ${
                  isFileDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <AnimatePresence>
              {isFileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-xl z-30 overflow-hidden"
                >
                  <ul className="py-1">
                    <li
                      className="px-4 py-2 text-gray-800 hover:bg-blue-50 cursor-pointer flex items-center transition-colors duration-150"
                      onClick={() => {
                        handleNewDesign();
                        setIsFileDropdownOpen(false);
                      }}
                    >
                      <FaPlusSquare className="mr-3 text-blue-500" /> New Design
                    </li>
                    <li
                      className="px-4 py-2 text-gray-800 hover:bg-blue-50 cursor-pointer flex items-center transition-colors duration-150"
                      onClick={() => {
                        handleSaveDesignLocally();
                        setIsFileDropdownOpen(false);
                      }}
                    >
                      <FaSave className="mr-3 text-green-500" />
                      {localSaveStatus === "saving" ? (
                        <>
                          <FaSpinner className="mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Design"
                      )}
                    </li>
                    <li
                      className="px-4 py-2 text-gray-800 hover:bg-blue-50 cursor-pointer flex items-center transition-colors duration-150"
                      onClick={() => {
                        loadDesignInputRef.current?.click();
                        setIsFileDropdownOpen(false);
                      }}
                    >
                      <FaFolderOpen className="mr-3 text-purple-500" /> Load
                      Design
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="file"
              accept=".json"
              ref={loadDesignInputRef}
              onChange={handleLoadDesign}
              className="hidden"
            />
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
            <span
              className={`h-2 w-2 rounded-full ${
                isSaving
                  ? "bg-yellow-500 animate-pulse"
                  : localSaveStatus === "success"
                  ? "bg-green-500"
                  : localSaveStatus === "error"
                  ? "bg-red-500"
                  : productId && isValidObjectId(productId)
                  ? "bg-green-500"
                  : "bg-blue-500 animate-pulse"
              }`}
            />
            <span>{projectName || "Untitled Design"}</span>
            {isCreating && (
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                Creating
              </span>
            )}
            {isEditing && (
              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                Editing
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <button
              title="History"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150"
            >
              <FaClock className="text-lg" />
            </button>
            <button
              title="Undo"
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-150 ${
                !canUndo ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              <FaUndo />
            </button>
            <button
              title="Redo"
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-150 ${
                !canRedo ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              <FaRedo />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            <FaThLarge />
            <span className="font-medium">Specs & Templates</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-colors duration-200"
            onClick={() => setIsPreviewOpen(true)}
          >
            <FaEye />
            <span className="font-medium">Preview</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 transition-colors duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaUpload />
            <span className="font-medium">Upload Image</span>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAddImage}
            className="hidden"
          />
          {saveDesign && <div className="relative">{saveProductButton}</div>}
        </div>
      </div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-2xl relative w-full max-w-4xl h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-900 transition-colors duration-200"
                title="Close Preview"
              >
                <FaTimes />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Design Preview - {projectName || "Untitled"}
              </h2>

              <div className="flex justify-between items-center mb-4">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-300 transition-colors duration-200">
                  <FaDownload />
                  <span>Download PDF proof</span>
                </button>

                <div className="flex space-x-3">
                  <button
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      currentView === "Front"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setCurrentView("Front")}
                  >
                    Front
                  </button>
                  <button
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      currentView === "Back"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setCurrentView("Back")}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg p-4">
                <div
                  className="relative rounded-lg shadow-xl border border-gray-200"
                  style={{
                    width: canvasSize?.width || 1050,
                    height: canvasSize?.height || 600,
                    ...previewCanvasBackgroundStyle,
                    overflow: "hidden",
                    transform: `scale(${Math.min(
                      1,
                      (window.innerWidth * 0.7) / (canvasSize?.width || 1050),
                      (window.innerHeight * 0.6) / (canvasSize?.height || 600)
                    )})`,
                    transformOrigin: "center center",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  {designElements
                    ?.filter((el) => el.view === currentView || !el.view)
                    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                    .map((el) => (
                      <div
                        key={el.id}
                        style={{
                          position: "absolute",
                          left: el.x,
                          top: el.y,
                          width: el.width,
                          height: el.height,
                          zIndex: el.zIndex || 0,
                          transform: el.rotation
                            ? `rotate(${el.rotation}deg)`
                            : "none",
                        }}
                      >
                        <PreviewElementRenderer element={el} />
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
