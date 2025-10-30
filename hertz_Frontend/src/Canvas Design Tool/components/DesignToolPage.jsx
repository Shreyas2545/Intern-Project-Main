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
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${getShapeStyles(
                  shape,
                  selectedShape === shape.id
                )}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <shape.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-1">{shape.name}</h3>
                  <p className="text-sm text-gray-500">{shape.description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {isAdmin && selectedShape === "custom" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={customDimensions.width}
                  onChange={(e) =>
                    setCustomDimensions({
                      ...customDimensions,
                      width: parseInt(e.target.value) || 800,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={customDimensions.height}
                  onChange={(e) =>
                    setCustomDimensions({
                      ...customDimensions,
                      height: parseInt(e.target.value) || 800,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={customBackground}
                  onChange={(e) => setCustomBackground(e.target.value)}
                  className="w-full h-10 rounded-md cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DesignToolPage = () => {
  const { productId: productIdFromParams } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const prevDesignElementsRef = useRef([]);

  const [projectName, setProjectName] = useState("Untitled Design");
  const [designElements, setDesignElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [currentView, setCurrentView] = useState("Front");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 1050, height: 600 });
  const [canvasShape, setCanvasShape] = useState("rectangle");
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [showCanvasModal, setShowCanvasModal] = useState(true);
  const [showUnsupportedWarning, setShowUnsupportedWarning] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [designIdState, setDesignId] = useState(null);

  // Sanitize color function to handle unsupported color formats
  function sanitizeColor(color) {
    if (typeof color !== "string") return "#ffffff";
    const cleanedColor = color
      .replace(/oklab\(.*\)/i, "")
      .replace(/lab\(.*\)/i, "")
      .replace(/lch\(.*\)/i, "")
      .replace(/color\(.*\)/i, "");

    const hexColor = cleanedColor.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/i);
    const rgbColor = cleanedColor.match(
      /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i
    );
    const rgbaColor = cleanedColor.match(
      /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i
    );
    const hslColor = cleanedColor.match(
      /^hsl\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*\)$/i
    );

    if (hexColor || rgbColor || rgbaColor || hslColor) {
      return cleanedColor;
    }
    return "#ffffff";
  }

  // Load design if editing
  useEffect(() => {
    const loadDesign = async () => {
      let designData = null;
      let isEditing = false;
      let designId = new URLSearchParams(location.search).get("designId");

      if (productIdFromParams) {
        // Try to load an existing design by product ID
        try {
          const res = await axios.get(`${API_BASE_URL}/designs/product/${productIdFromParams}`);
          designData = res.data.data;
          isEditing = true;
          designId = designData._id;
        } catch (err) {
          // If no design found for the product, it's a new design
          console.error("No existing design found for this product. Starting a new one.", err);
          setIsCreating(true);
          setShowCanvasModal(true);
          return;
        }
      } else if (designId) {
        // Fallback for direct design ID links
        try {
          const res = await axios.get(`${API_BASE_URL}/designs/${designId}`);
          designData = res.data.data;
          isEditing = true;
        } catch (err) {
          console.error("Failed to load design:", err);
          navigate("/dashboard");
          return;
        }
      } else {
        // No ID in URL, must be a brand new design session
        setIsCreating(true);
        setShowCanvasModal(true);
        return;
      }

      // If a design was successfully loaded
      if (designData) {
        setIsEditing(isEditing);
        setDesignId(designId);
        setProjectName(designData.projectName || "Untitled Design");
        setCanvasShape(designData.canvasShape || "rectangle");
        setCanvasSize(designData.canvasSize || { width: 1050, height: 600 });
        setCanvasBackground(sanitizeColor(designData.canvasBackground || "#ffffff"));

        // Sanitize colors of all design elements upon loading
        const sanitizedElements = (designData.designElements || []).map(el => {
            const newEl = { ...el };
            if (newEl.type === 'text' && newEl.color) {
                newEl.color = sanitizeColor(newEl.color);
            }
            if (newEl.type === 'image' && newEl.shadowColor) {
                newEl.shadowColor = sanitizeColor(newEl.shadowColor);
            }
            if (newEl.type === 'graphic' && newEl.fillColor) {
                newEl.fillColor = sanitizeColor(newEl.fillColor);
            }
            if (newEl.type === 'graphic' && newEl.strokeColor) {
                newEl.strokeColor = sanitizeColor(newEl.strokeColor);
            }
            if (newEl.type === 'icon' && newEl.color) {
                newEl.color = sanitizeColor(newEl.color);
            }
            return newEl;
        });
        setDesignElements(sanitizedElements);
        setShowCanvasModal(false);
      }
    };
    loadDesign();
  }, [location, navigate, productIdFromParams]); //

  // Save design
  const saveDesign = useCallback(async () => {
    setIsSaving(true);
    try {
      const canvasElement = canvasRef.current;
      if (!canvasElement) throw new Error("Canvas element not found");
      
      const sanitizedElementsForSave = designElements.map(el => {
        // Sanitize colors for each element before saving
        const newEl = { ...el };
        if (newEl.type === 'text' && newEl.color) {
            newEl.color = sanitizeColor(newEl.color);
        }
        if (newEl.type === 'image' && newEl.shadowColor) {
            newEl.shadowColor = sanitizeColor(newEl.shadowColor);
        }
        if (newEl.type === 'graphic' && newEl.fillColor) {
            newEl.fillColor = sanitizeColor(newEl.fillColor);
        }
        if (newEl.type === 'graphic' && newEl.strokeColor) {
            newEl.strokeColor = sanitizeColor(newEl.strokeColor);
        }
        if (newEl.type === 'icon' && newEl.color) {
            newEl.color = sanitizeColor(newEl.color);
        }
        return newEl;
      });

      const canvas = await html2canvas(canvasElement, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        foreignObjectRendering: false,
        willReadFrequently: true,
        windowWidth: canvasSize.width,
        windowHeight: canvasSize.height,
        logging: false,
      });

      const previewBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!previewBlob) throw new Error("Failed to generate preview image");

      const formData = new FormData();
      formData.append("previewImage", previewBlob, "preview.png");

      const designData = {
        projectName: projectName || "Untitled Design",
        canvasShape: canvasShape || "rectangle",
        canvasSize: canvasSize || { width: 1050, height: 600 },
        canvasBackground: sanitizeColor(canvasBackground),
        designElements: sanitizedElementsForSave || [],
        productId: productIdFromParams || null,
      };
      formData.append("designData", JSON.stringify(designData));

      let res;
      if (designIdState) {
        res = await axios.patch(
          `${API_BASE_URL}/designs/${designIdState}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post(`${API_BASE_URL}/designs`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setDesignId(res.data.data._id);
      }
      console.log("Design saved successfully");
    } catch (err) {
      console.error("Failed to save design:", err.message || err);
      if (err.response?.status === 400) {
        console.warn("Bad request - check payload or server validation:", err.response.data);
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    projectName,
    canvasShape,
    canvasSize,
    canvasBackground,
    designElements,
    productIdFromParams,
    designIdState,
  ]);

  const handleCanvasShapeSelect = useCallback(
    (shape, dimensions, background) => {
      setCanvasShape(shape);
      setCanvasSize(dimensions);
      setCanvasBackground(sanitizeColor(background));
      setShowCanvasModal(false);
    },
    []
  );

  const addDesignElement = useCallback(
    (element) => {
      if (!element.type) {
        setShowUnsupportedWarning(true);
        return;
      }
      const newId = Date.now().toString();
      const newElement = { 
        ...element, 
        id: newId,
        // Sanitize color properties on add
        ...(element.color && { color: sanitizeColor(element.color) }),
        ...(element.shadowColor && { shadowColor: sanitizeColor(element.shadowColor) }),
      };
      setDesignElements((prev) => [...prev, newElement]);
      setSelectedElementId(newId);
    },
    []
  );

  const updateDesignElement = useCallback(
    (id, updates) => {
      // Sanitize color properties in updates before applying them
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.color) {
        sanitizedUpdates.color = sanitizeColor(sanitizedUpdates.color);
      }
      if (sanitizedUpdates.shadowColor) {
        sanitizedUpdates.shadowColor = sanitizeColor(sanitizedUpdates.shadowColor);
      }
      
      setDesignElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...sanitizedUpdates } : el))
      );
    },
    []
  );

  const deleteDesignElement = useCallback(
    (id) => {
      setDesignElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElementId === id) setSelectedElementId(null);
    },
    [selectedElementId]
  );

  const updateCanvasBackground = useCallback(
    (newBackground) => {
      setCanvasBackground(sanitizeColor(newBackground));
    },
    []
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setDesignElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setDesignElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Fix the history effect to properly manage state changes
  useEffect(() => {
    // Only push to history if the elements have changed
    if (JSON.stringify(designElements) !== JSON.stringify(prevDesignElementsRef.current)) {
      const newHistory = history.slice(0, historyIndex + 1);
      const newElements = JSON.parse(JSON.stringify(designElements));
      setHistory([...newHistory, newElements]);
      setHistoryIndex(newHistory.length);
      prevDesignElementsRef.current = newElements;
    }
  }, [designElements, history, historyIndex]);


  const handleWheelZoom = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -2 : 2;
      setZoomLevel((prev) => Math.min(300, Math.max(10, prev + delta)));
    }
  }, []);

  // New: Debounced save trigger
  const saveTimeout = useRef(null);
  const triggerSave = useCallback(() => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      saveDesign();
    }, 1000); // Debounce by 1 second
  }, [saveDesign]);

  // Updated addDesignElement with triggerSave
  const addDesignElementWithSave = useCallback(
    (element) => {
      addDesignElement(element);
      triggerSave();
    },
    [addDesignElement, triggerSave]
  );

  // Updated updateDesignElement with triggerSave
  const updateDesignElementWithSave = useCallback(
    (id, updates) => {
      updateDesignElement(id, updates);
      triggerSave();
    },
    [updateDesignElement, triggerSave]
  );

  // Updated deleteDesignElement with triggerSave
  const deleteDesignElementWithSave = useCallback(
    (id) => {
      deleteDesignElement(id);
      triggerSave();
    },
    [deleteDesignElement, triggerSave]
  );

  // Updated updateCanvasBackground with triggerSave
  const updateCanvasBackgroundWithSave = useCallback(
    (newBackground) => {
      updateCanvasBackground(newBackground);
      triggerSave();
    },
    [updateCanvasBackground, triggerSave]
  );

  // Wrapped setCanvasSize
  const setCanvasSizeWithSave = useCallback(
    (size) => {
      setCanvasSize(size);
      triggerSave();
    },
    [triggerSave]
  );

  // Wrapped setCanvasShape
  const setCanvasShapeWithSave = useCallback(
    (shape) => {
      setCanvasShape(shape);
      triggerSave();
    },
    [triggerSave]
  );

  return (
    <DesignContext.Provider
      value={{
        projectName,
        setProjectName,
        designElements,
        addDesignElement: addDesignElementWithSave,
        updateDesignElement: updateDesignElementWithSave,
        deleteDesignElement: deleteDesignElementWithSave,
        selectedElementId,
        setSelectedElementId,
        currentView,
        setCurrentView,
        zoomLevel,
        setZoomLevel,
        canvasSize,
        setCanvasSize: setCanvasSizeWithSave,
        canvasShape,
        setCanvasShape: setCanvasShapeWithSave,
        canvasBackground,
        updateCanvasBackground: updateCanvasBackgroundWithSave,
        canvasRef,
        undo,
        redo,
        canUndo,
        canRedo,
        isAdmin,
        saveDesign,
        isSaving,
        isIconModalOpen,
        setIsIconModalOpen,
        productId: productIdFromParams,
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
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
              }}
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