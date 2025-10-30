import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  memo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion"; // Added framer-motion import
import {
  FaUpload,
  FaCrop,
  FaEraser,
  FaMagic,
  FaSlidersH,
  FaCopy,
  FaTrash,
  FaLock,
  FaUnlock,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaLayerGroup, // Added for potential layering group icon
} from "react-icons/fa";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/* Modern reusable button with improved styling & tooltip */
const IconBtn = memo(
  ({
    title,
    onClick,
    children,
    btnRef,
    isActive = false,
    disabled = false,
  }) => (
    <button
      ref={btnRef}
      title={title} // Tooltip provided by browser default, or custom CSS can be added if needed
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      className={`
        group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ease-in-out
        ${
          isActive
            ? "bg-blue-600 text-white shadow-lg scale-105" // More pronounced active state
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900" // Softer default, clear hover
        }
        ${
          disabled
            ? "opacity-40 cursor-not-allowed" // Clearer disabled state
            : "hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        }
      `}
    >
      <span className="text-xl">{children}</span> {/* Larger icons */}
      {/* Custom Tooltip (Optional - uncomment if you want a custom tooltip)
      <span
        className="
          pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-150
          group-hover:opacity-100 group-focus:opacity-100
        "
      >
        {title}
      </span>
      */}
    </button>
  )
);

/* Slider component with consistent spacing and enhanced styling */
const Slider = memo(
  ({ label, value, min, max, step = 1, onChange, unit = "" }) => (
    <div className="space-y-1.5">
      {" "}
      {/* Adjusted spacing */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
          {" "}
          {/* Rounded corners for value display */}
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
          height: 18px; /* Slightly larger thumb */
          width: 18px; /* Slightly larger thumb */
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25); /* Stronger shadow */
          border: 3px solid #fff; /* Thicker white border */
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

export default function ImageToolbar({
  selectedElementId,
  designElements,
  updateDesignElement,
  deleteDesignElement,
  addDesignElement,
}) {
  const fileInputRef = useRef(null);
  const adjustBtnRef = useRef(null);
  const cropImageRef = useRef(null);

  const [showAdjust, setShowAdjust] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const el = designElements.find((d) => d.id === selectedElementId);
  if (!el || el.type !== "image") return null;

  const [adjustments, setAdjustments] = useState({
    hue: el.hue ?? 0,
    saturation: el.sat ?? 1,
    brightness: el.br ?? 1,
    opacity: el.opacity ?? 1,
  });

  const pushAdjustments = useCallback(
    (newAdjustments) => {
      const { hue, saturation, brightness, opacity } = {
        ...adjustments,
        ...newAdjustments,
      };
      const filter = `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`;
      updateDesignElement(el.id, {
        filter,
        hue,
        sat: saturation,
        br: brightness,
        opacity,
      });
      setAdjustments({ hue, saturation, brightness, opacity });
    },
    [adjustments, updateDesignElement, el.id]
  );

  const handleReplace = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/"))
        return alert("Select a valid image.");
      if (file.size > 10 * 1024 * 1024)
        return alert("Image must be under 10MB.");
      const url = URL.createObjectURL(file);
      updateDesignElement(el.id, { content: url });
      e.target.value = "";
    },
    [updateDesignElement, el.id]
  );

  const handleDuplicate = useCallback(() => {
    const newElement = {
      ...el,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.min(el.x + 20, 800),
      y: Math.min(el.y + 20, 500),
      zIndex: (el.zIndex || 0) + 1, // Place duplicated element slightly above
    };
    addDesignElement(newElement);
  }, [el, addDesignElement]);

  const handleBringToFront = useCallback(() => {
    const maxZ = designElements.reduce(
      (max, current) => Math.max(max, current.zIndex || 0),
      0
    );
    updateDesignElement(el.id, { zIndex: maxZ + 1 });
  }, [designElements, el.id, updateDesignElement]);

  const handleSendToBack = useCallback(() => {
    const minZ = designElements.reduce(
      (min, current) => Math.min(min, current.zIndex || 0),
      0
    );
    updateDesignElement(el.id, { zIndex: minZ - 1 });
  }, [designElements, el.id, updateDesignElement]);

  const onImageLoaded = useCallback((e) => {
    cropImageRef.current = e.target;
    return false;
  }, []);

  const makeClientCrop = useCallback(async () => {
    if (
      !cropImageRef.current ||
      !completedCrop?.width ||
      !completedCrop?.height
    )
      return;
    setIsProcessing(true);
    try {
      const img = cropImageRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixel =
        completedCrop.unit === "%"
          ? {
              x: (completedCrop.x / 100) * img.naturalWidth,
              y: (completedCrop.y / 100) * img.naturalHeight,
              width: (completedCrop.width / 100) * img.naturalWidth,
              height: (completedCrop.height / 100) * img.naturalHeight,
            }
          : {
              x: completedCrop.x * scaleX,
              y: completedCrop.y * scaleY,
              width: completedCrop.width * scaleX,
              height: completedCrop.height * scaleY,
            };
      canvas.width = pixel.width;
      canvas.height = pixel.height;
      ctx.drawImage(
        img,
        pixel.x,
        pixel.y,
        pixel.width,
        pixel.height,
        0,
        0,
        pixel.width,
        pixel.height
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          updateDesignElement(el.id, { content: url });
          setShowCrop(false);
          setCompletedCrop(null);
          setIsProcessing(false);
        },
        "image/jpeg",
        0.95
      );
    } catch {
      alert("Crop failed. Try again.");
      setIsProcessing(false);
    }
  }, [completedCrop, updateDesignElement, el.id]);

  const toggleRemoveBG = useCallback(() => {
    const f = el.filter || "";
    const has = f.includes("invert(1)");
    const nf = has
      ? f.replace(/brightness\(0\)\s*invert\(1\)/, "")
      : `${f} brightness(0) invert(1)`;
    updateDesignElement(el.id, { filter: nf.trim() });
  }, [el.filter, updateDesignElement, el.id]);

  const toggleSharpen = useCallback(() => {
    const f = el.filter || "";
    const has = f.includes("contrast(150%)");
    const nf = has ? f.replace(/contrast\(150%\)/, "") : `${f} contrast(150%)`;
    updateDesignElement(el.id, { filter: nf.trim() });
  }, [el.filter, updateDesignElement, el.id]);

  const [adjustPos, setAdjustPos] = useState({ top: 0, left: 0 });
  useLayoutEffect(() => {
    if (showAdjust && adjustBtnRef.current) {
      const rect = adjustBtnRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      let left = rect.left;
      if (left + 320 > vw) left = vw - 340;
      if (left < 10) left = 10;
      setAdjustPos({ top: rect.bottom + 8, left });
    }
  }, [showAdjust]);

  useLayoutEffect(() => {
    const onClick = (e) => {
      if (
        showAdjust &&
        adjustBtnRef.current &&
        !adjustBtnRef.current.contains(e.target)
      ) {
        const pop = document.querySelector('[data-popover="adjust"]');
        if (pop && !pop.contains(e.target)) setShowAdjust(false);
      }
    };
    if (showAdjust) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [showAdjust]);

  useLayoutEffect(() => {
    if (showCrop) setShowAdjust(false);
  }, [showCrop]);

  return (
    <>
      {/* Main Toolbar Container */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl px-4 py-3">
        {/* Group 1: File/Basic Actions */}
        <div className="flex items-center gap-2">
          <IconBtn
            title="Replace Image"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaUpload />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleReplace}
            />
          </IconBtn>

          <IconBtn
            title="Crop Image"
            onClick={() => setShowCrop(true)}
            isActive={showCrop}
          >
            <FaCrop />
          </IconBtn>

          <IconBtn title="Duplicate Image" onClick={handleDuplicate}>
            <FaCopy />
          </IconBtn>
        </div>
        <div className="h-8 border-r border-gray-200 mx-2" /> {/* Separator */}
        {/* Group 2: Effects */}
        <div className="flex items-center gap-2">
          <IconBtn
            title="Remove Background (Invert)"
            onClick={toggleRemoveBG}
            isActive={el.filter?.includes("invert(1)")}
          >
            <FaEraser />
          </IconBtn>

          <IconBtn
            title="Sharpen Image (Contrast)"
            onClick={toggleSharpen}
            isActive={el.filter?.includes("contrast(150%)")}
          >
            <FaMagic />
          </IconBtn>

          <IconBtn
            title="Adjust Image Properties"
            btnRef={adjustBtnRef}
            onClick={() => setShowAdjust((v) => !v)}
            isActive={showAdjust}
          >
            <FaSlidersH />
          </IconBtn>
        </div>
        <div className="h-8 border-r border-gray-200 mx-2" /> {/* Separator */}
        {/* Group 3: Layering (Bring to Front / Send to Back) */}
        <div className="flex items-center gap-2">
          <IconBtn title="Bring to Front" onClick={handleBringToFront}>
            <FaArrowUp />
          </IconBtn>
          <IconBtn title="Send to Back" onClick={handleSendToBack}>
            <FaArrowDown />
          </IconBtn>
        </div>
        <div className="h-8 border-r border-gray-200 mx-2" /> {/* Separator */}
        {/* Group 4: Element Management */}
        <div className="flex items-center gap-2">
          <IconBtn
            title={el.locked ? "Unlock Element" : "Lock Element"}
            onClick={() => updateDesignElement(el.id, { locked: !el.locked })}
            isActive={el.locked}
          >
            {el.locked ? <FaUnlock /> : <FaLock />}
          </IconBtn>

          <IconBtn
            title="Delete Element"
            onClick={() => deleteDesignElement(el.id)}
          >
            <FaTrash />
          </IconBtn>
        </div>
      </div>

      {/* Adjust Popover */}
      {showAdjust &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            data-popover="adjust"
            style={{
              position: "fixed",
              top: adjustPos.top,
              left: adjustPos.left,
              zIndex: 9999,
            }}
            className="bg-white border border-blue-200 rounded-xl shadow-2xl p-5 space-y-4 min-w-[280px]"
          >
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h4 className="font-semibold text-gray-800">Adjustments</h4>
              <button
                onClick={() => setShowAdjust(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Close Adjustments"
              >
                <FaTimes />
              </button>
            </div>
            <Slider
              label="Hue"
              value={adjustments.hue}
              min={0}
              max={360}
              onChange={(v) => pushAdjustments({ hue: v })}
              unit="°"
            />
            <Slider
              label="Saturation"
              value={adjustments.saturation}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => pushAdjustments({ saturation: v })}
            />
            <Slider
              label="Brightness"
              value={adjustments.brightness}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => pushAdjustments({ brightness: v })}
            />
            <Slider
              label="Opacity"
              value={adjustments.opacity}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => pushAdjustments({ opacity: v })}
            />

            <button
              onClick={() =>
                pushAdjustments({
                  hue: 0,
                  saturation: 1,
                  brightness: 1,
                  opacity: 1,
                })
              }
              className="w-full mt-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset to Default
            </button>
          </motion.div>,
          document.body
        )}

      {/* Crop Modal */}
      {showCrop &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-3xl">
              <div className="flex items-center justify-between bg-gray-100 px-5 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">
                  Crop Image
                </h3>
                <button
                  onClick={() => setShowCrop(false)}
                  className="text-gray-600 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  title="Close Crop"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-auto flex justify-center items-center">
                <ReactCrop
                  crop={crop}
                  onChange={setCrop}
                  onComplete={setCompletedCrop}
                  keepSelection
                  className="max-w-full max-h-[50vh]" // Constrain crop area height
                >
                  <img
                    ref={cropImageRef}
                    src={el.content}
                    alt="Crop preview"
                    onLoad={onImageLoaded}
                    className="w-full h-auto object-contain" // Ensure image fits
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCrop(false)}
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={makeClientCrop}
                  disabled={
                    isProcessing ||
                    !completedCrop?.width ||
                    !completedCrop?.height
                  }
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Apply Crop"
                  )}
                </button>
              </div>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}
