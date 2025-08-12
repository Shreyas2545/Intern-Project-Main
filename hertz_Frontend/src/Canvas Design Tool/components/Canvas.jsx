// src/Pages/Canvas.jsx
import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rnd } from "react-rnd";
import { DesignContext } from "./DesignToolPage";
import TextToolbar from "./pages/TextToolbar";
import ImageToolbar from "./pages/ImageToolbar";
import GraphicsToolbar from "./pages/GraphicsToolbar";
import IconToolbar from "./pages/IconToolbar";
import IconLibraryModal from "./pages/IconLibraryModal";
import { FaExclamationTriangle } from "react-icons/fa";

// Optimized ShapeRenderer with memo
const ShapeRenderer = memo(({ element }) => {
  const { shapeType, fillColor, strokeColor, strokeWidth, opacity } = element;

  const finalFill =
    shapeType === "line" || shapeType === "arrow" ? "none" : fillColor;

  const commonProps = useMemo(
    () => ({
      fill: finalFill,
      stroke: strokeColor || "transparent",
      strokeWidth: strokeWidth || 0,
      opacity: opacity || 1,
    }),
    [finalFill, strokeColor, strokeWidth, opacity]
  );

  const SvgDefs = useCallback(
    () => (
      <defs>
        <marker
          id="arrowhead"
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
    ),
    [strokeColor]
  );

  const shapeElement = useMemo(() => {
    switch (shapeType) {
      case "square":
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
          <polygon
            points="50,0 100,38 82,100 18,100 0,38"
            preserveAspectRatio="none"
            {...commonProps}
          />
        );
      case "hexagon":
        return (
          <polygon
            points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
            preserveAspectRatio="none"
            {...commonProps}
          />
        );
      case "diamond":
        return (
          <polygon
            points="50,0 100,50 50,100 0,50"
            preserveAspectRatio="none"
            {...commonProps}
          />
        );
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
              markerEnd="url(#arrowhead)"
              {...commonProps}
            />
          </>
        );
      default:
        return <rect x="0" y="0" width="100" height="100" fill="#cccccc" />;
    }
  }, [shapeType, commonProps, SvgDefs]);

  return shapeElement;
});

const UnsupportedElementRenderer = memo(({ element }) => {
  console.error("Rendering unsupported element:", element);
  return (
    <div className="w-full h-full bg-red-100 border-2 border-dashed border-red-500 rounded-lg flex flex-col items-center justify-center p-4">
      <FaExclamationTriangle className="text-red-500 w-8 h-8 mb-2" />
      <span className="text-xs text-red-700 font-semibold text-center">
        Unsupported Element
      </span>
      <span className="text-[10px] text-red-500 font-mono mt-1">
        Type: {element.type || "N/A"}
      </span>
    </div>
  );
});

const ElementRenderer = memo(
  ({ element, editingId, editableRef, updateDesignElement, setEditingId }) => {
    const handleTextBlur = useCallback(
      (e) => {
        updateDesignElement(element.id, {
          content: e.target.innerText,
        });
        setEditingId(null);
      },
      [element.id, updateDesignElement, setEditingId]
    );

    const handleImageError = useCallback(
      (e) => {
        console.error("Image load failed:", element.content);
        e.target.src =
          "https://placehold.co/200x200/cccccc/333333?text=Image+Error";
        e.target.onerror = null;
      },
      [element.content]
    );

    const textStyle = useMemo(
      () => ({
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
        cursor: element.id === editingId ? "text" : "default",
        opacity: element.opacity,
      }),
      [element, editingId]
    );

    const imageStyle = useMemo(
      () => ({
        opacity: element.opacity,
        borderRadius: `${element.borderRadius || 0}px`,
        filter: element.filter || "none",
      }),
      [element.opacity, element.borderRadius, element.filter]
    );

    const iconStyle = useMemo(
      () => ({
        color: element.color || "#4f46e5",
        opacity: element.opacity,
        fontSize: Math.min(element.width, element.height) * 0.8,
      }),
      [element.color, element.opacity, element.width, element.height]
    );

    switch (element.type) {
      case "text":
        return (
          <div
            ref={element.id === editingId ? editableRef : null}
            contentEditable={element.id === editingId}
            suppressContentEditableWarning
            onBlur={handleTextBlur}
            className={`w-full h-full flex items-center justify-center p-1 whitespace-pre-wrap break-words outline-none transition-all duration-200 ${
              element.id === editingId
                ? "ring-2 ring-blue-400 bg-blue-50/30 rounded-xl"
                : ""
            }`}
            style={textStyle}
          >
            {element.content || "Double-click to edit"}
          </div>
        );

      case "image":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={element.content}
              alt="User uploaded content"
              draggable={false}
              className="w-full h-full object-cover pointer-events-none"
              style={imageStyle}
              onError={handleImageError}
            />
          </div>
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
            <ShapeRenderer element={element} />
          </svg>
        );

      case "icon":
        const IconComponent = element.icon;
        return IconComponent ? (
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent
              className="pointer-events-none drop-shadow-sm"
              style={iconStyle}
            />
          </div>
        ) : null;

      case "table":
        return (
          <div className="w-full h-full border border-gray-400">
            <div className="text-center text-gray-500 text-xs p-2">
              Table: {element.rows} rows, {element.cols} columns
            </div>
          </div>
        );

      default:
        return <UnsupportedElementRenderer element={element} />;
    }
  }
);

const SelectionHandles = memo(({ isVisible, isLocked }) => {
  if (!isVisible || isLocked) return null;
  return (
    <AnimatePresence>
      {isVisible && !isLocked && (
        <>
          {[-2.5, -2.5, -2.5, -2.5].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -45 }}
              transition={{ delay: i * 0.02, duration: 0.1 }}
              className={`absolute w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg ${
                i === 0
                  ? "-top-3 -left-3"
                  : i === 1
                  ? "-top-3 -right-3"
                  : i === 2
                  ? "-bottom-3 -left-3"
                  : i === 3
                  ? "-bottom-3 -right-3"
                  : ""
              }`}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
});

const RndElement = memo(
  ({
    element,
    isSelected,
    isEditing,
    canvasSize,
    updateDesignElement,
    setSelectedElementId,
    setEditingId,
    editableRef,
  }) => {
    const handleDragStop = useCallback(
      (e, d) => {
        if (element.locked) return;
        const newX = Math.max(
          0,
          Math.min(d.x, canvasSize.width - element.width)
        );
        const newY = Math.max(
          0,
          Math.min(d.y, canvasSize.height - element.height)
        );
        updateDesignElement(element.id, { x: newX, y: newY });
      },
      [
        element.id,
        element.locked,
        element.width,
        element.height,
        canvasSize,
        updateDesignElement,
      ]
    );

    const handleResizeStop = useCallback(
      (e, dir, ref, delta, pos) => {
        if (element.locked) return;
        const w = parseInt(ref.style.width, 10);
        const h = parseInt(ref.style.height, 10);
        const newX = Math.max(0, Math.min(pos.x, canvasSize.width - w));
        const newY = Math.max(0, Math.min(pos.y, canvasSize.height - h));
        updateDesignElement(element.id, {
          x: newX,
          y: newY,
          width: w,
          height: h,
        });
      },
      [element.id, element.locked, canvasSize, updateDesignElement]
    );

    const handleClick = useCallback(
      (e) => {
        e.stopPropagation();
        setSelectedElementId(element.id);
        if (element.type !== "text") setEditingId(null);
      },
      [element.id, element.type, setSelectedElementId, setEditingId]
    );

    const handleDoubleClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (!element.locked && element.type === "text") {
          setEditingId(element.id);
        }
      },
      [element.id, element.locked, element.type, setEditingId]
    );

    const transformString = useMemo(() => {
      let transform = "";
      if (element.rotation) transform += `rotate(${element.rotation}deg) `;
      if (element.transform) transform += element.transform;
      return transform;
    }, [element.rotation, element.transform]);

    const rndStyle = useMemo(
      () => ({
        zIndex: element.zIndex || 1,
        border: isSelected ? "2px solid #3B82F6" : "2px solid transparent",
        borderRadius: 12,
        cursor: element.locked ? "not-allowed" : "pointer",
        transform: transformString,
        transition: "all 0.1s ease",
        boxShadow: isSelected
          ? "0 0 30px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)"
          : element.type !== "text"
          ? "0 4px 12px rgba(0, 0, 0, 0.05)"
          : "none",
      }),
      [
        element.zIndex,
        element.locked,
        element.type,
        transformString,
        isSelected,
      ]
    );

    const containerStyle = useMemo(
      () => ({
        opacity: element.opacity || 1,
        borderRadius: 8,
      }),
      [element.opacity]
    );

    return (
      <Rnd
        key={element.id}
        size={{ width: element.width, height: element.height }}
        position={{ x: element.x, y: element.y }}
        bounds="parent"
        enableResizing={!element.locked && !isEditing}
        disableDragging={element.locked}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={rndStyle}
      >
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={containerStyle}
        >
          <SelectionHandles isVisible={isSelected} isLocked={element.locked} />

          {element.locked && (
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-2 right-2 z-10 px-3 py-1.5 bg-red-500 text-white font-bold rounded-full shadow-lg text-xs select-none"
            >
              LOCKED
            </motion.div>
          )}

          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider"
            >
              {element.type}
            </motion.div>
          )}

          <ElementRenderer
            element={element}
            editingId={isEditing ? element.id : null}
            editableRef={editableRef}
            updateDesignElement={updateDesignElement}
            setEditingId={setEditingId}
          />
        </div>
      </Rnd>
    );
  }
);

const toolbarVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const Canvas = () => {
  const {
    designElements,
    updateDesignElement,
    selectedElementId,
    setSelectedElementId,
    currentView,
    zoomLevel,
    canvasSize,
    setCanvasSize,
    deleteDesignElement,
    addDesignElement,
    canvasBackground,
    isIconModalOpen,
    setIsIconModalOpen,
  } = useContext(DesignContext);

  const [editingId, setEditingId] = useState(null);
  const canvasInnerRef = useRef(null);
  const editableRef = useRef(null);

  const selectedElement = useMemo(() => {
    return selectedElementId
      ? designElements.find((e) => e.id === selectedElementId)
      : null;
  }, [selectedElementId, designElements]);

  const sortedElements = useMemo(() => {
    return designElements
      .filter((e) => !e.deleted)
      .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));
  }, [designElements]);

  const canvasBackgroundStyle = useMemo(() => {
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

  useEffect(() => {
    if (!canvasSize) {
      setCanvasSize({ width: 1050, height: 600 });
    }
  }, [canvasSize, setCanvasSize]);

  useEffect(() => {
    if (editingId && editableRef.current) {
      const el = editableRef.current;
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [editingId]);

  const handleDeselect = useCallback(() => {
    setSelectedElementId(null);
    setEditingId(null);
  }, [setSelectedElementId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!selectedElementId) return;
      const element = designElements.find((d) => d.id === selectedElementId);
      if (!element) return;

      try {
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          document.activeElement.contentEditable !== "true"
        ) {
          deleteDesignElement(element.id);
          setEditingId(null);
          return;
        }

        if (e.key === "Escape") {
          handleDeselect();
          return;
        }

        if (element.type === "text" && e.ctrlKey) {
          e.preventDefault();
          const formatMap = {
            b: {
              fontWeight: element.fontWeight === "bold" ? "normal" : "bold",
            },
            i: {
              fontStyle: element.fontStyle === "italic" ? "normal" : "italic",
            },
            u: {
              textDecoration:
                element.textDecoration === "underline" ? "none" : "underline",
            },
          };
          if (formatMap[e.key]) {
            updateDesignElement(element.id, formatMap[e.key]);
          }
          return;
        }

        if (
          e.key.startsWith("Arrow") &&
          !element.locked &&
          document.activeElement.contentEditable !== "true"
        ) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 5;
          const moves = {
            ArrowUp: { y: -step },
            ArrowDown: { y: step },
            ArrowLeft: { x: -step },
            ArrowRight: { x: step },
          };
          const move = moves[e.key];
          if (move) {
            const newX = Math.max(
              0,
              Math.min(
                element.x + (move.x || 0),
                canvasSize.width - element.width
              )
            );
            const newY = Math.max(
              0,
              Math.min(
                element.y + (move.y || 0),
                canvasSize.height - element.height
              )
            );
            updateDesignElement(element.id, { x: newX, y: newY });
          }
        }
      } catch (error) {
        console.error("Keydown handler error:", error);
      }
    },
    [
      selectedElementId,
      designElements,
      updateDesignElement,
      deleteDesignElement,
      canvasSize,
      handleDeselect,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleCanvasClick = useCallback(
    (e) => {
      const isCanvasBackground =
        e.target === canvasInnerRef.current ||
        e.target.classList.contains("canvas-watermark");
      if (isCanvasBackground) {
        e.stopPropagation();
        handleDeselect();
      }
    },
    [handleDeselect]
  );

  return (
    <>
      {/* Toolbar */}
      <AnimatePresence mode="wait">
        {selectedElementId && selectedElement && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={toolbarVariants}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto">
              {selectedElement.type === "text" && (
                <TextToolbar
                  selectedElementId={selectedElementId}
                  designElements={designElements}
                  updateDesignElement={updateDesignElement}
                  deleteDesignElement={deleteDesignElement}
                  addDesignElement={addDesignElement}
                />
              )}
              {selectedElement.type === "image" && (
                <ImageToolbar
                  selectedElementId={selectedElementId}
                  designElements={designElements}
                  updateDesignElement={updateDesignElement}
                  deleteDesignElement={deleteDesignElement}
                  addDesignElement={addDesignElement}
                />
              )}
              {selectedElement.type === "graphic" && (
                <GraphicsToolbar
                  selectedElementId={selectedElementId}
                  designElements={designElements}
                  updateDesignElement={updateDesignElement}
                  deleteDesignElement={deleteDesignElement}
                  addDesignElement={addDesignElement}
                />
              )}
              {selectedElement.type === "icon" && (
                <IconToolbar
                  selectedElementId={selectedElementId}
                  designElements={designElements}
                  updateDesignElement={updateDesignElement}
                  deleteDesignElement={deleteDesignElement}
                  isIconModalOpen={isIconModalOpen}
                  setIsIconModalOpen={setIsIconModalOpen}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Library Modal */}
      <IconLibraryModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
      />

      {/* Canvas Content */}
      <motion.div
        ref={canvasInnerRef}
        className="absolute inset-0 overflow-hidden will-change-transform"
        animate={{ rotateY: currentView === "Back" ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={canvasBackgroundStyle}
        onClick={handleCanvasClick}
      >
        {sortedElements.map((element) => (
          <RndElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            isEditing={element.id === editingId}
            canvasSize={canvasSize}
            updateDesignElement={updateDesignElement}
            setSelectedElementId={setSelectedElementId}
            setEditingId={setEditingId}
            editableRef={editableRef}
          />
        ))}
      </motion.div>
    </>
  );
};

export default Canvas;
