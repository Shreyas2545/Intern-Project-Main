// src/Pages/DesignToolPage.jsx
import React, {
  useState,
  useRef,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSquare,
  FaCircle,
  FaStop,
  FaCog,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Canvas from "./Canvas";
import BottomSection from "./BottomSection";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";

export const DesignContext = createContext();

// Backend base URL — used consistently for all design API calls
const API_BASE_URL = "http://localhost:8000/api/v1";

const CanvasShapeModal = ({ isOpen, onClose, onSelectShape, isAdmin }) => {
  const [customDimensions, setCustomDimensions] = useState({
    width: 1050,
    height: 600,
  });
  const [customBackground, setCustomBackground] = useState("#ffffff");
  const [selectedShape, setSelectedShape] = useState(null);

  const canvasShapes = [
    {
      id: "square",
      name: "Square Canvas",
      icon: FaSquare,
      dimensions: { width: 800, height: 800 },
      description: "Perfect square canvas",
      color: "blue",
    },
    {
      id: "rectangle",
      name: "Rectangle Canvas",
      icon: FaStop,
      dimensions: { width: 1050, height: 600 },
      description: "Standard rectangle canvas",
      color: "green",
    },
    {
      id: "circle",
      name: "Circle Canvas",
      icon: FaCircle,
      dimensions: { width: 800, height: 800 },
      description: "Circular canvas design",
      color: "purple",
    },
    ...(isAdmin
      ? [
          {
            id: "custom",
            name: "Custom Canvas",
            icon: FaCog,
            dimensions: customDimensions,
            background: customBackground,
            description: "Custom dimensions (Admin only)",
            color: "orange",
          },
        ]
      : []),
  ];

  const handleShapeSelect = (shape) => {
    setSelectedShape(shape.id);
    if (shape.id === "custom") {
      onSelectShape(shape.id, customDimensions, customBackground);
    } else {
      onSelectShape(shape.id, shape.dimensions, "#ffffff");
    }
    onClose();
  };

  const getShapeStyles = (shape, isSelected) => {
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

    const colors = colorMap[shape.color] || colorMap.blue;
    return isSelected ? colors.selected : `${colors.default} ${colors.hover}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Canvas Shape
              </h2>
              <p className="text-gray-600">
                Select the perfect canvas shape for your design project
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {canvasShapes.map((shape) => (
              <motion.button
                key={shape.id}
                onClick={() => handleShapeSelect(shape)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${getShapeStyles(
                  shape,
                  selectedShape === shape.id
                )}`}
              >
                <div className="flex items-center space-x-4">
                  <shape.icon className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-semibold">{shape.name}</h3>
                    <p className="text-sm text-gray-500">{shape.description}</p>
                    <p className="text-sm font-medium">
                      {shape.id !== "custom"
                        ? `${shape.dimensions.width} x ${shape.dimensions.height} px`
                        : `Custom: ${customDimensions.width} x ${customDimensions.height} px`}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {isAdmin && selectedShape === "custom" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Custom Canvas Settings
              </h3>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={customDimensions.width}
                    onChange={(e) =>
                      setCustomDimensions({
                        ...customDimensions,
                        width: parseInt(e.target.value) || 1050,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={customDimensions.height}
                    onChange={(e) =>
                      setCustomDimensions({
                        ...customDimensions,
                        height: parseInt(e.target.value) || 600,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Background Color
                </label>
                <input
                  type="color"
                  value={customBackground}
                  onChange={(e) => setCustomBackground(e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DesignToolPage = () => {
  const { productId, designId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);
  const [projectName, setProjectName] = useState("Untitled Design");
  const [designElements, setDesignElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [currentView, setCurrentView] = useState("Front");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 1050, height: 600 });
  const [canvasShape, setCanvasShape] = useState("rectangle");
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");
  const canvasRef = useRef(null);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showCanvasModal, setShowCanvasModal] = useState(!designId);
  const [showUnsupportedWarning, setShowUnsupportedWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(!designId);
  const [isEditing, setIsEditing] = useState(!!designId);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [designIdState, setDesignIdState] = useState(designId || null);

  // Fetch design by productId or designId when component mounts
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        let response;
        if (designId) {
          // use backend base URL explicitly
          response = await axios.get(`${API_BASE_URL}/designs/${designId}`);
        } else if (productId) {
          response = await axios.get(
            `${API_BASE_URL}/designs/product/${productId}`
          );
        }
        if (response?.data?.success && response.data.data) {
          const design = response.data.data;

          // defensive parsing: server might send canvasSize/designElements as strings
          try {
            const parsedSize =
              typeof design.canvasSize === "string"
                ? JSON.parse(design.canvasSize)
                : design.canvasSize;
            if (parsedSize?.width && parsedSize?.height) {
              setCanvasSize(parsedSize);
            }
          } catch (e) {
            // ignore parse error, leave canvasSize as-is
            console.warn("Unable to parse canvasSize from server:", e);
          }

          try {
            const parsedBg =
              typeof design.canvasBackground === "string" &&
              (design.canvasBackground.trim().startsWith("{") ||
                design.canvasBackground.trim().startsWith("["))
                ? JSON.parse(design.canvasBackground)
                : design.canvasBackground;
            if (parsedBg !== undefined) setCanvasBackground(parsedBg);
          } catch (e) {
            console.warn("Unable to parse canvasBackground from server:", e);
            // fallback: set as-is
            if (design.canvasBackground !== undefined)
              setCanvasBackground(design.canvasBackground);
          }

          try {
            const parsedElements =
              typeof design.designElements === "string"
                ? JSON.parse(design.designElements)
                : design.designElements;
            if (Array.isArray(parsedElements)) {
              setDesignElements(parsedElements);
              setHistory([parsedElements]);
              setHistoryIndex(0);
            } else {
              // fallback if server stored differently
              setDesignElements(design.designElements || []);
              setHistory([design.designElements || []]);
              setHistoryIndex(0);
            }
          } catch (e) {
            console.warn("Unable to parse designElements from server:", e);
            setDesignElements(design.designElements || []);
            setHistory([design.designElements || []]);
            setHistoryIndex(0);
          }

          setProjectName(design.projectName || projectName);
          setCanvasShape(design.canvasShape || canvasShape);
          setIsCreating(false);
          setIsEditing(true);
          setShowCanvasModal(false);
          setDesignIdState(design._id || design.id || designIdState);
        }
      } catch (error) {
        console.error("Error fetching design:", error);
        if (error.response?.status !== 404) {
          alert(
            "Failed to load design: " +
              (error.response?.data?.message || error.message)
          );
        } else {
          // 404 = no design yet => remain in create mode silently
          console.info("No saved design found for this product/design id.");
        }
      }
    };

    if (productId || designId) {
      fetchDesign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, designId]);

  // Mark changes as unsaved when designElements or other state changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [designElements, projectName, canvasShape, canvasSize, canvasBackground]);

  // Prompt to save changes before unloading
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Do you want to save before leaving?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const addDesignElement = (element) => {
    if (
      !element.type ||
      !["text", "image", "graphic", "icon", "table"].includes(element.type)
    ) {
      setShowUnsupportedWarning(true);
      return;
    }
    const newElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zIndex: designElements.length + 1,
      view: currentView,
    };
    setDesignElements((prev) => [...prev, newElement]);
    setHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      [...designElements, newElement],
    ]);
    setHistoryIndex((prev) => prev + 1);
  };

  const updateDesignElement = (id, updates) => {
    setDesignElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
    setHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      designElements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    ]);
    setHistoryIndex((prev) => prev + 1);
  };

  const deleteDesignElement = (id) => {
    setDesignElements((prev) => prev.filter((el) => el.id !== id));
    setHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      designElements.filter((el) => el.id !== id),
    ]);
    setHistoryIndex((prev) => prev + 1);
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setDesignElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setDesignElements(history[historyIndex + 1]);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const updateCanvasBackground = (color) => {
    setCanvasBackground(color);
  };

  const handleCanvasShapeSelect = (shape, dimensions, background) => {
    setCanvasShape(shape);
    setCanvasSize(dimensions);
    setCanvasBackground(background);
    setShowCanvasModal(false);
  };

  // convert a blob: URL to base64 data URL
  async function blobUrlToDataUrl(blobUrl) {
    try {
      const res = await fetch(blobUrl);
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // data:image/png;base64,...
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Failed to convert blob URL to dataURL:", err);
      return null;
    }
  }

  // sanitize & normalize design elements before sending to server
  async function sanitizeDesignElements(
    elements = [],
    canvasSizeLocal = { width: 600, height: 600 }
  ) {
    const sanitized = [];

    for (const el of elements) {
      // shallow copy
      const e = { ...el };

      // remove functions/refs
      Object.keys(e).forEach((k) => {
        if (typeof e[k] === "function") delete e[k];
      });

      // Ensure numeric properties exist and are numbers. Use defaults where missing.
      if (!Number.isFinite(e.x)) e.x = 0;
      if (!Number.isFinite(e.y)) e.y = 0;
      if (!Number.isFinite(e.width))
        e.width = Math.min(200, canvasSizeLocal.width || 600);
      if (!Number.isFinite(e.height))
        e.height = Math.min(200, canvasSizeLocal.height || 600);

      // Convert blob: URLs to base64 so server receives actual bytes
      if (typeof e.content === "string" && e.content.startsWith("blob:")) {
        const dataUrl = await blobUrlToDataUrl(e.content);
        if (dataUrl) {
          e.content = dataUrl;
        } else {
          delete e.content;
        }
      }

      // Prune deeply non-serializable parts (defensive)
      try {
        JSON.stringify(e);
      } catch (err) {
        for (const key of Object.keys(e)) {
          try {
            JSON.stringify(e[key]);
          } catch {
            delete e[key];
          }
        }
      }

      sanitized.push(e);
    }

    return sanitized;
  }

  // Replace the existing saveDesign function body with this version
  const saveDesign = async () => {
    if (!productId) {
      alert("No product selected.");
      return;
    }
    if (!projectName) {
      alert("Project name required.");
      return;
    }
    setIsSaving(true);

    try {
      const canvasEl = document.querySelector(".canvas-container");
      if (!canvasEl) throw new Error("Canvas element not found.");

      // create preview image using html2canvas
      const canvas = await html2canvas(canvasEl, {
        backgroundColor:
          typeof canvasBackground === "string" ? canvasBackground : "#ffffff",
        useCORS: true,
        allowTaint: true,
      });
      const previewDataUrl = canvas.toDataURL("image/png");
      const previewBlob = await (await fetch(previewDataUrl)).blob();

      // sanitize elements (this will convert blob: urls into base64 dataURL)
      const sanitizedElements = await sanitizeDesignElements(
        designElements,
        canvasSize
      );

      // build form data
      const data = new FormData();
      data.append("projectName", projectName);
      data.append("canvasShape", canvasShape);
      data.append("canvasSize", JSON.stringify(canvasSize));
      data.append(
        "canvasBackground",
        typeof canvasBackground === "string"
          ? canvasBackground
          : JSON.stringify(canvasBackground)
      );
      data.append("designElements", JSON.stringify(sanitizedElements));
      data.append("productId", productId);
      data.append("previewImage", previewBlob, "preview.png");

      // Try fetching existing design from BACKEND (use API_BASE_URL)
      let existingDesignId = null;
      try {
        const getResp = await axios.get(
          `${API_BASE_URL}/designs/product/${productId}`
        );
        if (getResp?.data?.success && getResp.data.data) {
          existingDesignId = getResp.data.data._id;
        }
      } catch (err) {
        // treat 404 as "no existing design" — ignore other errors
        if (err.response?.status && err.response.status !== 404) throw err;
      }

      let resp;
      if (existingDesignId || designIdState) {
        const idToUse = existingDesignId || designIdState;
        resp = await axios.put(`${API_BASE_URL}/designs/${idToUse}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (resp?.data?.data?._id) setDesignIdState(resp.data.data._id);
      } else {
        resp = await axios.post(`${API_BASE_URL}/designs`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (resp?.data?.data?._id) setDesignIdState(resp.data.data._id);
      }

      if (resp?.data?.success) {
        setHasUnsavedChanges(false);
        alert("Design saved!");
      } else {
        throw new Error(resp?.data?.message || "Unexpected server response");
      }
    } catch (err) {
      console.error("Error saving design:", err);
      const msg = err.response?.data?.message || err.message || "Save failed";
      alert(`Save error: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCanvasDragStart = (e) => {
    if (!selectedElementId && e.target === canvasRef.current) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleCanvasDrag = (e) => {
    if (isDragging && canvasRef.current) {
      const dx = e.movementX;
      const dy = e.movementY;
      setCanvasPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
    }
  };

  const handleCanvasDragEnd = () => setIsDragging(false);

  const handleWheelZoom = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -2 : 2;
      setZoomLevel((prev) => Math.min(300, Math.max(10, prev + delta)));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key.startsWith("Arrow") && canvasRef.current) {
      e.preventDefault();
      const step = e.shiftKey ? 50 : 10;
      const moves = {
        ArrowUp: { y: -step },
        ArrowDown: { y: step },
        ArrowLeft: { x: -step },
        ArrowRight: { x: step },
      };
      setCanvasPosition((prev) => ({
        x: prev.x + (moves[e.key]?.x || 0),
        y: prev.y + (moves[e.key]?.y || 0),
      }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <DesignContext.Provider
      value={{
        projectName,
        setProjectName,
        designElements,
        addDesignElement,
        updateDesignElement,
        deleteDesignElement,
        selectedElementId,
        setSelectedElementId,
        currentView,
        setCurrentView,
        zoomLevel,
        setZoomLevel,
        canvasSize,
        setCanvasSize,
        canvasShape,
        setCanvasShape,
        canvasBackground,
        updateCanvasBackground,
        canvasRef,
        canvasPosition,
        setCanvasPosition,
        undo,
        redo,
        canUndo,
        canRedo,
        isAdmin,
        saveDesign,
        isSaving,
        isIconModalOpen,
        setIsIconModalOpen,
        productId,
        isCreating,
        isEditing,
        setIsEditing,
        designId: designIdState,
      }}
    >
      <div className="flex flex-col h-screen bg-gray-100 font-sans overflow-hidden relative">
        <CanvasShapeModal
          isOpen={showCanvasModal}
          onClose={() => setShowCanvasModal(false)}
          onSelectShape={handleCanvasShapeSelect}
          isAdmin={isAdmin}
        />

        <Header />
        <div className="flex flex-1 overflow-hidden relative">
          <LeftSidebar />
          <div className="absolute w-full h-full left-0 top-0 right-0 bottom-0 flex justify-center items-center pointer-events-none z-20">
            <div
              ref={canvasRef}
              className="pointer-events-auto relative bg-white drop-shadow-lg transition-transform duration-200 will-change-transform canvas-container"
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                transform: `translate(${canvasPosition.x}px, ${
                  canvasPosition.y
                }px) scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
              }}
              onMouseDown={handleCanvasDragStart}
              onMouseMove={handleCanvasDrag}
              onMouseUp={handleCanvasDragEnd}
              onMouseLeave={handleCanvasDragEnd}
              onWheel={handleWheelZoom}
            >
              <Canvas />
            </div>
          </div>
          <RightSidebar />
        </div>
        <BottomSection />
      </div>

      <AnimatePresence>
        {showUnsupportedWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full"
            >
              <div className="flex items-center space-x-4">
                <FaExclamationTriangle className="text-red-500 w-12 h-12" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Unsupported Element Type
                  </h2>
                  <p className="text-gray-600">
                    You've attempted to add an element with an unsupported type.
                    Please ensure all elements have a valid `type` property.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUnsupportedWarning(false)}
                className="mt-6 w-full bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors hover:bg-red-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DesignContext.Provider>
  );
};

export default DesignToolPage;
