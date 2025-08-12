/**
 * @file ElementRenderer.jsx
 * @description Renders the specific content of a design element based on its type.
 * This component acts as a switch, choosing the correct visual representation
 * for text, images, graphics, icons, or tables.
 */

import React from "react";

// --- Specific Renderer for SVG-based Shapes ---
const ShapeRenderer = ({ element }) => {
  const { shapeType, fillColor, strokeColor, strokeWidth, opacity } = element;

  // For lines and arrows, the fill should be the same as the stroke
  const finalFill =
    shapeType === "line" || shapeType === "arrow" ? "none" : fillColor;

  const commonProps = {
    fill: finalFill,
    stroke: strokeColor || "transparent",
    strokeWidth: strokeWidth || 0,
    opacity: opacity || 1,
  };

  // Using SVG defs for arrowheads is the proper way to make them scale with stroke
  const SvgDefs = () => (
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
  );

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
};

const ElementRenderer = ({ element }) => {
  switch (element.type) {
    case "text":
      return (
        <div
          className="w-full h-full flex items-center justify-center p-1 whitespace-pre-wrap break-words"
          style={{
            fontFamily: element.fontFamily,
            fontSize: element.fontSize,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            textDecoration: element.textDecoration,
            color: element.color,
            backgroundColor: element.backgroundColor,
            textAlign: element.textAlign,
            lineHeight: 1.2,
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
          <ShapeRenderer element={element} />
        </svg>
      );

    case "icon":
      const IconComponent = element.icon;
      return IconComponent ? (
        <IconComponent
          className="w-full h-full pointer-events-none"
          style={{
            color: element.color,
            opacity: element.opacity,
          }}
        />
      ) : null;

    case "table":
      // Basic placeholder rendering for a table
      return (
        <div className="w-full h-full border border-gray-400">
          <div className="text-center text-gray-500 text-xs p-2">
            Table: {element.rows} rows, {element.cols} columns
          </div>
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

export default ElementRenderer;
