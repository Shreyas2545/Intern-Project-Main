import React, { useContext, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DesignContext } from "./DesignToolPage";
import * as fabric from "fabric";

// cm to px helper and defaults
const cmToPx = (cm) => cm * 37.795;
const DEFAULT_SIZE_CM = 30.48;
const SCALE_DIV = 10;
const SIDEBAR_WIDTH = 160; // px

const RightSidebar = () => {
  const { designElements, currentView, setCurrentView, canvasSize } =
    useContext(DesignContext);
  const sidebarRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const frontInst = useRef(null);
  const backInst = useRef(null);

  useEffect(() => {
    const w = cmToPx(DEFAULT_SIZE_CM) / SCALE_DIV;
    const h = cmToPx(DEFAULT_SIZE_CM) / SCALE_DIV;
    if (!frontInst.current)
      frontInst.current = new fabric.StaticCanvas(frontRef.current, {
        width: w,
        height: h,
      });
    if (!backInst.current)
      backInst.current = new fabric.StaticCanvas(backRef.current, {
        width: w,
        height: h,
      });

    [frontInst.current, backInst.current].forEach((c) => c.clear());
    designElements.forEach((el) => {
      const canvas = el.view === "Back" ? backInst.current : frontInst.current;
      if (el.type === "text") {
        canvas.add(
          new fabric.Text(el.content, {
            left: el.x / SCALE_DIV,
            top: el.y / SCALE_DIV,
            fontSize: el.fontSize / SCALE_DIV,
            fill: el.color,
            fontFamily: el.fontFamily,
          })
        );
      } else {
        fabric.Image.fromURL(el.content, (img) => {
          img.set({
            left: el.x / SCALE_DIV,
            top: el.y / SCALE_DIV,
            scaleX: el.width / (SCALE_DIV * img.width),
            scaleY: el.height / (SCALE_DIV * img.height),
          });
          canvas.add(img);
        });
      }
    });
    frontInst.current.renderAll();
    backInst.current.renderAll();
  }, [designElements, currentView, canvasSize]);

  return (
    <motion.div
      ref={sidebarRef}
      className="fixed right-6 top-1/2 transform -translate-y-1/2 w-40 rounded-lg p-2 shadow-lg bg-white border border-blue-800/20 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {["Front", "Back"].map((view) => (
        <div key={view} className="flex flex-col items-center mb-4">
          <div
            onClick={() => setCurrentView(view)}
            className={`w-24 h-24 border-2 rounded-lg flex items-center justify-center cursor-pointer transition ${
              currentView === view
                ? "border-blue-800 shadow-md"
                : "border-blue-200 hover:border-blue-600"
            }`}
          >
            <canvas ref={view === "Front" ? frontRef : backRef} />
          </div>
          <button
            onClick={() => setCurrentView(view)}
            className={`mt-2 w-full py-1 text-xs font-medium rounded-md transition ${
              currentView === view
                ? "border-2 border-blue-800 text-blue-800 shadow-md"
                : "border border-blue-200 text-blue-800 hover:border-blue-600"
            }`}
          >
            {view}
          </button>
        </div>
      ))}
    </motion.div>
  );
};

export default RightSidebar;
