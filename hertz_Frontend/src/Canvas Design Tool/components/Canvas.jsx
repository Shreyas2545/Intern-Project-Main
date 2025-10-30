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

const ShapeRenderer = memo(({ element }) => {
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

  const commonProps = useMemo(
    () => ({
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
    }),
    [finalFill, strokeColor, strokeWidth, strokeStyle, opacity, flip]
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
        opacity: element.opacity || 1,
        border:
          element.stroke && element.strokeWidth
            ? `${element.strokeWidth}px solid ${element.stroke}`
            : "none",
        borderRadius: element.borderRadius ? `${element.borderRadius}px` : "0",
        transform: element.isCurved ? `rotateX(20deg)` : "none", // Simplified curve effect
      }),
      [
        element.fontFamily,
        element.fontSize,
        element.fontWeight,
        element.fontStyle,
        element.textDecoration,
        element.color,
        element.backgroundColor,
        element.textAlign,
        element.opacity,
        element.stroke,
        element.strokeWidth,
        element.borderRadius,
        element.isCurved,
        editingId,
        element.id,
      ]
    );

    switch (element.type) {
      case "text":
        return (
          <div
            contentEditable={element.id === editingId}
            suppressContentEditableWarning
            onBlur={handleTextBlur}
            ref={element.id === editingId ? editableRef : null}
            className="w-full h-full flex items-center justify-center whitespace-pre-wrap break-words select-none"
            style={textStyle}
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
            onError={handleImageError}
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
            <ShapeRenderer element={element} />
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
            <span className="text-xs text-gray-500">Table Element</span>
          </div>
        );

      default:
        return <UnsupportedElementRenderer element={element} />;
    }
  }
);

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
        element.width,
        element.height,
        canvasSize,
        updateDesignElement,
      ]
    );

    const handleResizeStop = useCallback(
      (e, direction, ref, delta, position) => {
        updateDesignElement(element.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      },
      [element.id, updateDesignElement]
    );

    const handleDoubleClick = useCallback(() => {
      if (element.type === "text" && !element.locked) {
        setEditingId(element.id);
      }
    }, [element.id, element.type, element.locked, setEditingId]);

    return (
      <Rnd
        size={{ width: element.width, height: element.height }}
        position={{ x: element.x, y: element.y }}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        disableDragging={element.locked}
        enableResizing={!element.locked}
        bounds="parent"
        className={`absolute ${isSelected ? "border-2 border-blue-500" : ""}`}
        style={{
          zIndex: element.zIndex || 0,
          transform: `rotate(${element.rotation || 0}deg)`,
        }}
        onClick={() => setSelectedElementId(element.id)}
        onDoubleClick={handleDoubleClick}
      >
        <ElementRenderer
          element={element}
          editingId={isEditing ? element.id : null}
          editableRef={editableRef}
          updateDesignElement={updateDesignElement}
          setEditingId={setEditingId}
        />
      </Rnd>
    );
  }
);

const Canvas = () => {
  const {
    designElements,
    selectedElementId,
    setSelectedElementId,
    updateDesignElement,
    deleteDesignElement,
    canvasSize,
    canvasBackground,
    currentView,
    isIconModalOpen,
    setIsIconModalOpen,
    addDesignElement,
  } = useContext(DesignContext);

  const canvasInnerRef = useRef(null);
  const editableRef = useRef(null);
  const [editingId, setEditingId] = useState(null);

  const selectedElement = designElements.find(
    (el) => el.id === selectedElementId
  );

  const sortedElements = useMemo(
    () =>
      designElements
        .filter((el) => el.view === currentView || !el.view)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)),
    [designElements, currentView]
  );

  const canvasBackgroundStyle = useMemo(() => {
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

  const toolbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleDeselect = useCallback(() => {
    setSelectedElementId(null);
    setEditingId(null);
  }, [setSelectedElementId, setEditingId]);

  const handleKeyDown = useCallback(
    (e) => {
      try {
        if (e.key === "Escape") {
          handleDeselect();
          return;
        }
        if (!selectedElementId) return;
        const selectedElement = designElements.find(
          (el) => el.id === selectedElementId
        );
        if (!selectedElement) return;

        if (e.key === "Delete" && !selectedElement.locked) {
          deleteDesignElement(selectedElementId);
          return;
        }

        const formatMap = {
          "b+ctrl": { fontWeight: "bold" },
          "i+ctrl": { fontStyle: "italic" },
          "u+ctrl": { textDecoration: "underline" },
        };

        const keyCombo = `${e.key.toLowerCase()}${e.ctrlKey ? "+ctrl" : ""}`;
        if (formatMap[keyCombo]) {
          updateDesignElement(selectedElementId, formatMap[keyCombo]);
          return;
        }

        if (
          e.key.startsWith("Arrow") &&
          !selectedElement.locked &&
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
                selectedElement.x + (move.x || 0),
                canvasSize.width - selectedElement.width
              )
            );
            const newY = Math.max(
              0,
              Math.min(
                selectedElement.y + (move.y || 0),
                canvasSize.height - selectedElement.height
              )
            );
            updateDesignElement(selectedElementId, { x: newX, y: newY });
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

      <IconLibraryModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
      />

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