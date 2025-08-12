import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaPalette,
  FaLowVision,
  FaTimes,
  FaPlus,
  FaMinus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { BsBorderStyle, BsFillDropletFill } from "react-icons/bs";
import { MdDeleteSweep, MdLockOutline, MdLockOpen } from "react-icons/md";
import { TbArrowBigUpLines, TbArrowBigDownLines } from "react-icons/tb";
import { GiCurvyKnife } from "react-icons/gi";

// Reusable Icon Button Component
const IconBtn = memo(
  ({ title, onClick, children, isActive = false, disabled = false }) => (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      className={`
        group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ease-in-out
        ${
          isActive
            ? "bg-blue-600 text-white shadow-lg scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
        }
        ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        }
      `}
    >
      <span className="text-xl">{children}</span>
    </button>
  )
);

// Reusable Slider Component
const Slider = memo(
  ({ label, value, min, max, step = 1, onChange, unit = "" }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
          {typeof value === "number" ? value.toFixed(step < 1 ? 2 : 0) : value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
            ((value - min) / (max - min)) * 100
          }%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
          border: 3px solid #fff;
        }
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
);

const fonts = [
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Oswald",
  "Playfair Display",
];

const TextToolbar = ({
  selectedElementId,
  designElements,
  updateDesignElement,
  deleteDesignElement,
}) => {
  const element = designElements.find((el) => el.id === selectedElementId);
  if (!element) return null;

  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);
  const colorBtnRef = useRef(null);
  const bgColorBtnRef = useRef(null);
  const strokeBtnRef = useRef(null);
  const opacityBtnRef = useRef(null);
  const borderRadiusBtnRef = useRef(null);
  const textAlignBtnRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!activePopup) return;

    let targetRef;
    switch (activePopup) {
      case "color":
        targetRef = colorBtnRef;
        break;
      case "backgroundColor":
        targetRef = bgColorBtnRef;
        break;
      case "stroke":
        targetRef = strokeBtnRef;
        break;
      case "opacity":
        targetRef = opacityBtnRef;
        break;
      case "borderRadius":
        targetRef = borderRadiusBtnRef;
        break;
      case "textAlign":
        targetRef = textAlignBtnRef;
        break;
      default:
        return;
    }

    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const popoverWidth = 200;
      const popoverHeight = 250;

      let top = rect.bottom + 8;
      let left = rect.left;

      if (left + popoverWidth > viewportWidth - 10) {
        left = viewportWidth - popoverWidth - 10;
      }
      if (left < 10) {
        left = 10;
      }

      if (top + popoverHeight > window.innerHeight - 10) {
        top = rect.top - popoverHeight - 8;
        if (top < 10) top = 10;
      }

      setPopupPos({ top, left });
    }
  }, [activePopup]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutsidePopup =
        popupRef.current && !popupRef.current.contains(event.target);
      const isClickOnToolbarButton = event.target.closest(".text-toolbar-btn");

      if (activePopup && isClickOutsidePopup && !isClickOnToolbarButton) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  const togglePopup = useCallback((popupName) => {
    setActivePopup((prev) => (prev === popupName ? null : popupName));
  }, []);

  const parseNumberInput = (value, defaultValue = 0) => {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  };

  const applyToSelected = (key, value) => {
    updateDesignElement(selectedElementId, { [key]: value });
  };

  const toggleProperty = (key, value, defaultValue) => {
    updateDesignElement(selectedElementId, {
      [key]: element[key] === value ? defaultValue : value,
    });
  };

  const handleBringToFront = useCallback(() => {
    const maxZIndex = designElements.reduce(
      (max, current) => Math.max(max, current.zIndex || 0),
      0
    );
    updateDesignElement(selectedElementId, { zIndex: maxZIndex + 1 });
  }, [designElements, selectedElementId, updateDesignElement]);

  const handleSendToBack = useCallback(() => {
    const minZIndex = designElements.reduce(
      (min, current) => Math.min(min, current.zIndex || 0),
      0
    );
    updateDesignElement(selectedElementId, { zIndex: minZIndex - 1 });
  }, [designElements, selectedElementId, updateDesignElement]);

  const currentFontSize = element ? element.fontSize || 12 : 12;
  const currentOpacity = element ? element.opacity || 1 : 1;
  const currentStrokeWidth = element ? element.strokeWidth || 0 : 0;
  const currentBorderRadius = element ? element.borderRadius || 0 : 0;
  const isLocked = element ? element.locked || false : false;

  return (
    <motion.div
      className="flex items-center justify-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl px-4 py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Group 1: Font Family & Size */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={element.fontFamily || fonts[0]}
            onChange={(e) => applyToSelected("fontFamily", e.target.value)}
            className="text-toolbar-btn border border-gray-300 rounded-lg px-3 py-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-all duration-150 text-sm appearance-none pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.5em",
            }}
            title="Font Family"
          >
            {fonts.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <IconBtn
            title="Decrease Font Size"
            onClick={() =>
              applyToSelected("fontSize", Math.max(1, currentFontSize - 1))
            }
          >
            <FaMinus />
          </IconBtn>
          <input
            type="number"
            value={currentFontSize}
            onChange={(e) =>
              applyToSelected("fontSize", parseNumberInput(e.target.value, 1))
            }
            className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            min="1"
            title="Font Size"
          />
          <IconBtn
            title="Increase Font Size"
            onClick={() => applyToSelected("fontSize", currentFontSize + 1)}
          >
            <FaPlus />
          </IconBtn>
        </div>
      </div>
      <div className="h-8 border-r border-gray-200 mx-2" />
      {/* Group 2: Text Styling */}
      <div className="flex items-center gap-2">
        <IconBtn
          title="Bold (Ctrl+B)"
          onClick={() => toggleProperty("fontWeight", "bold", "normal")}
          isActive={element.fontWeight === "bold"}
        >
          <FaBold />
        </IconBtn>

        <IconBtn
          title="Italic (Ctrl+I)"
          onClick={() => toggleProperty("fontStyle", "italic", "normal")}
          isActive={element.fontStyle === "italic"}
        >
          <FaItalic />
        </IconBtn>

        <IconBtn
          title="Underline (Ctrl+U)"
          onClick={() => toggleProperty("textDecoration", "underline", "none")}
          isActive={element.textDecoration === "underline"}
        >
          <FaUnderline />
        </IconBtn>
      </div>
      <div className="h-8 border-r border-gray-200 mx-2" />
      {/* Group 3: Colors & Effects */}
      <div className="flex items-center gap-2">
        <IconBtn
          title="Text Color"
          btnRef={colorBtnRef}
          onClick={() => togglePopup("color")}
          isActive={activePopup === "color"}
        >
          <FaPalette />
        </IconBtn>

        <IconBtn
          title="Background Color"
          btnRef={bgColorBtnRef}
          onClick={() => togglePopup("backgroundColor")}
          isActive={activePopup === "backgroundColor"}
        >
          <BsFillDropletFill />
        </IconBtn>

        <IconBtn
          title="Stroke"
          btnRef={strokeBtnRef}
          onClick={() => togglePopup("stroke")}
          isActive={activePopup === "stroke"}
        >
          <BsBorderStyle />
        </IconBtn>

        <IconBtn
          title="Opacity"
          btnRef={opacityBtnRef}
          onClick={() => togglePopup("opacity")}
          isActive={activePopup === "opacity"}
        >
          <FaLowVision />
        </IconBtn>

        <IconBtn
          title="Border Radius"
          btnRef={borderRadiusBtnRef}
          onClick={() => togglePopup("borderRadius")}
          isActive={activePopup === "borderRadius"}
        >
          <BsFillDropletFill />
        </IconBtn>
      </div>
      <div className="h-8 border-r border-gray-200 mx-2" />
      {/* Group 4: Alignment & Curve */}
      <div className="flex items-center gap-2">
        <IconBtn
          title="Text Alignment"
          btnRef={textAlignBtnRef}
          onClick={() => togglePopup("textAlign")}
          isActive={activePopup === "textAlign"}
        >
          <FaAlignLeft />
        </IconBtn>

        <IconBtn
          title="Curve Text"
          onClick={() => toggleProperty("isCurved", !element.isCurved, false)}
          isActive={element.isCurved}
        >
          <GiCurvyKnife />
        </IconBtn>
      </div>
      <div className="h-8 border-r border-gray-200 mx-2" />
      {/* Group 5: Layering & Management */}
      <div className="flex items-center gap-2">
        <IconBtn title="Bring to Front" onClick={handleBringToFront}>
          <FaArrowUp />
        </IconBtn>
        <IconBtn title="Send to Back" onClick={handleSendToBack}>
          <FaArrowDown />
        </IconBtn>

        <IconBtn
          title={isLocked ? "Unlock Element" : "Lock Element"}
          onClick={() => toggleProperty("locked", !element.locked, false)}
          isActive={isLocked}
        >
          {isLocked ? <MdLockOpen /> : <MdLockOutline />}
        </IconBtn>

        <IconBtn
          title="Delete Element"
          onClick={() => deleteDesignElement(selectedElementId)}
        >
          <MdDeleteSweep />
        </IconBtn>
      </div>
      {/* Popovers */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            key={activePopup}
            ref={popupRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: popupPos.top,
              left: popupPos.left,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 space-y-3 min-w-[180px] max-w-[250px]"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
              <h4 className="font-semibold text-gray-800 text-md">
                {activePopup === "color" && "Text Color"}
                {activePopup === "backgroundColor" && "Background Color"}
                {activePopup === "stroke" && "Stroke Options"}
                {activePopup === "opacity" && "Opacity"}
                {activePopup === "borderRadius" && "Border Radius"}
                {activePopup === "textAlign" && "Text Alignment"}
              </h4>
              <button
                onClick={() => setActivePopup(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                title="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {activePopup === "color" && (
              <input
                type="color"
                value={element.color || "#000000"}
                onChange={(e) => applyToSelected("color", e.target.value)}
                className="w-full h-10 rounded-lg border-2 border-gray-200 cursor-pointer focus:ring-2 focus:ring-blue-500"
              />
            )}

            {activePopup === "backgroundColor" && (
              <input
                type="color"
                value={element.backgroundColor || "#FFFFFF"}
                onChange={(e) =>
                  applyToSelected("backgroundColor", e.target.value)
                }
                className="w-full h-10 rounded-lg border-2 border-gray-200 cursor-pointer focus:ring-2 focus:ring-blue-500"
              />
            )}

            {activePopup === "stroke" && (
              <>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Stroke Color
                    </label>
                    <input
                      type="color"
                      value={element.stroke || "#000000"}
                      onChange={(e) =>
                        applyToSelected("stroke", e.target.value)
                      }
                      className="w-full h-8 rounded-lg border-2 border-gray-200 cursor-pointer focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Stroke Width
                    </label>
                    <input
                      type="number"
                      value={currentStrokeWidth}
                      onChange={(e) =>
                        applyToSelected(
                          "strokeWidth",
                          parseNumberInput(e.target.value, 0)
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="0"
                      max="20"
                      step="1"
                    />
                  </div>
                </div>
              </>
            )}

            {activePopup === "opacity" && (
              <Slider
                label="Opacity"
                value={currentOpacity}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => applyToSelected("opacity", v)}
              />
            )}

            {activePopup === "borderRadius" && (
              <Slider
                label="Border Radius"
                value={currentBorderRadius}
                min={0}
                max={50}
                step={1}
                onChange={(v) => applyToSelected("borderRadius", v)}
                unit="px"
              />
            )}

            {activePopup === "textAlign" && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "left", icon: <FaAlignLeft /> },
                  { value: "center", icon: <FaAlignCenter /> },
                  { value: "right", icon: <FaAlignRight /> },
                  { value: "justify", icon: <FaAlignJustify /> },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      applyToSelected("textAlign", item.value);
                      setActivePopup(null);
                    }}
                    className={`
                      flex items-center justify-center px-3 py-2 rounded-lg transition-colors duration-150 text-sm
                      ${
                        element.textAlign === item.value
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                      focus:ring-2 focus:ring-blue-400 focus:outline-none
                    `}
                  >
                    <span className="text-lg mr-2">{item.icon}</span>
                    {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(TextToolbar);
