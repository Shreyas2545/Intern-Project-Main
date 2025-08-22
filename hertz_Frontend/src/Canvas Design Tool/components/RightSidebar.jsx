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
  const {
    designElements,
    currentView,
    setCurrentView,
    canvasSize,
    canvasBackground,
  } = useContext(DesignContext);
  const sidebarRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const frontInst = useRef(null);
  const backInst = useRef(null);

  useEffect(() => {
    const w = cmToPx(DEFAULT_SIZE_CM) / SCALE_DIV;
    const h = cmToPx(DEFAULT_SIZE_CM) / SCALE_DIV;

    // Initialize Fabric.js canvases
    if (!frontInst.current) {
      frontInst.current = new fabric.StaticCanvas(frontRef.current, {
        width: w,
        height: h,
      });
    }
    if (!backInst.current) {
      backInst.current = new fabric.StaticCanvas(backRef.current, {
        width: w,
        height: h,
      });
    }

    // Apply canvas background
    const applyBackground = (canvas) => {
      if (typeof canvasBackground === "string") {
        canvas.backgroundColor = canvasBackground;
      } else if (canvasBackground?.type === "gradient") {
        const { colors, angle = 90 } = canvasBackground;
        canvas.backgroundColor = new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: {
            x1: angle === 90 ? 0 : angle === 0 ? 0 : 0.5,
            y1: angle === 90 ? 0 : angle === 0 ? 0.5 : 0,
            x2: angle === 90 ? 0 : angle === 0 ? 1 : 0.5,
            y2: angle === 90 ? 1 : angle === 0 ? 0.5 : 1,
          },
          colorStops: colors.map((color, i) => ({
            offset: i / (colors.length - 1),
            color,
          })),
        });
      } else {
        canvas.backgroundColor = "#ffffff";
      }
    };

    // Clear canvases
    [frontInst.current, backInst.current].forEach((c) => {
      c.clear();
      applyBackground(c);
    });

    // Render design elements
    designElements.forEach((el) => {
      const canvas = el.view === "Back" ? backInst.current : frontInst.current;
      if (el.type === "text") {
        const text = new fabric.Text(el.content || "Text", {
          left: el.x / SCALE_DIV,
          top: el.y / SCALE_DIV,
          fontSize: (el.fontSize || 20) / SCALE_DIV,
          fill: el.color || "#000000",
          fontFamily: el.fontFamily || "Arial",
          fontWeight: el.fontWeight || "normal",
          fontStyle: el.fontStyle || "normal",
          textAlign: el.textAlign || "center",
          underline: el.textDecoration === "underline",
          linethrough: el.textDecoration === "line-through",
          backgroundColor: el.backgroundColor || "transparent",
          stroke: el.stroke || null,
          strokeWidth: el.strokeWidth ? el.strokeWidth / SCALE_DIV : 0,
          opacity: el.opacity || 1,
          angle: el.rotation || 0,
          path: el.isCurved
            ? new fabric.Path(`M 0 0 A 100 100 0 0 1 100 0`, {
                left: el.x / SCALE_DIV,
                top: el.y / SCALE_DIV,
                width: el.width / SCALE_DIV,
                height: el.height / SCALE_DIV,
              })
            : null,
        });
        canvas.add(text);
      } else if (el.type === "image") {
        fabric.Image.fromURL(
          el.content,
          (img) => {
            img.set({
              left: el.x / SCALE_DIV,
              top: el.y / SCALE_DIV,
              scaleX: el.width / (SCALE_DIV * img.width),
              scaleY: el.height / (SCALE_DIV * img.height),
              opacity: el.opacity || 1,
              angle: el.rotation || 0,
              cornerStyle: "circle",
              borderRadius: el.borderRadius ? el.borderRadius / SCALE_DIV : 0,
              filters:
                el.filter !== "none"
                  ? [new fabric.Image.filters[el.filter]()]
                  : [],
            });
            if (el.hue || el.sat !== 1 || el.br !== 1) {
              img.filters.push(
                new fabric.Image.filters.HueRotation({
                  rotation: el.hue / 360,
                }),
                new fabric.Image.filters.Saturation({ saturation: el.sat - 1 }),
                new fabric.Image.filters.Brightness({ brightness: el.br - 1 })
              );
            }
            img.applyFilters();
            canvas.add(img);
          },
          { crossOrigin: "anonymous" }
        );
      } else if (el.type === "graphic") {
        let shape;
        const commonProps = {
          left: el.x / SCALE_DIV,
          top: el.y / SCALE_DIV,
          width: el.width / SCALE_DIV,
          height: el.height / SCALE_DIV,
          fill:
            el.shapeType === "line" || el.shapeType === "arrow"
              ? "none"
              : el.fillColor || "#cccccc",
          stroke: el.strokeColor || "transparent",
          strokeWidth: el.strokeWidth ? el.strokeWidth / SCALE_DIV : 0,
          strokeDashArray:
            el.strokeStyle === "dashed"
              ? [5 / SCALE_DIV, 5 / SCALE_DIV]
              : el.strokeStyle === "dotted"
              ? [2 / SCALE_DIV, 2 / SCALE_DIV]
              : null,
          opacity: el.opacity || 1,
          angle: el.rotation || 0,
          flipX: el.flip === "horizontal",
          flipY: el.flip === "vertical",
        };
        switch (el.shapeType) {
          case "square":
          case "rectangle":
            shape = new fabric.Rect(commonProps);
            break;
          case "circle":
            shape = new fabric.Ellipse({
              ...commonProps,
              rx: el.width / SCALE_DIV / 2,
              ry: el.height / SCALE_DIV / 2,
            });
            break;
          case "triangle":
            shape = new fabric.Polygon(
              [
                { x: el.width / SCALE_DIV / 2, y: 0 },
                { x: el.width / SCALE_DIV, y: el.height / SCALE_DIV },
                { x: 0, y: el.height / SCALE_DIV },
              ],
              commonProps
            );
            break;
          case "line":
            shape = new fabric.Line(
              [0, 0, el.width / SCALE_DIV, el.height / SCALE_DIV],
              commonProps
            );
            break;
          case "arrow":
            shape = new fabric.Line(
              [
                0,
                el.height / SCALE_DIV / 2,
                el.width / SCALE_DIV,
                el.height / SCALE_DIV / 2,
              ],
              {
                ...commonProps,
                strokeLineCap: "round",
                strokeLineJoin: "round",
                // Fabric.js doesn't support arrowheads directly, so we simulate
              }
            );
            break;
          default:
            shape = new fabric.Rect(commonProps);
        }
        canvas.add(shape);
      }
    });

    frontInst.current.renderAll();
    backInst.current.renderAll();
  }, [designElements, currentView, canvasSize, canvasBackground]);

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
