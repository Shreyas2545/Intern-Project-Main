// design.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const designElementSchema = new Schema({
  id: { type: String, required: true }, // Unique element ID
  type: {
    type: String,
    enum: ["text", "image", "graphic", "icon", "table"],
    required: true,
  },
  x: { type: Number, default: 0 }, // Position X
  y: { type: Number, default: 0 }, // Position Y
  width: { type: Number, default: 100 }, // Width
  height: { type: Number, default: 100 }, // Height
  zIndex: { type: Number, default: 0 }, // Layering
  rotation: { type: Number, default: 0 }, // Rotation in degrees
  view: { type: String, enum: ["Front", "Back"], default: "Front" }, // View (Front/Back)
  locked: { type: Boolean, default: false }, // Lock status

  // Text-specific properties (from TextToolbar.jsx)
  content: { type: String }, // Text content
  fontFamily: { type: String }, // e.g., "Arial", "Roboto"
  fontSize: { type: Number, min: 1 }, // Font size
  fontWeight: { type: String, enum: ["normal", "bold"] }, // Bold
  fontStyle: { type: String, enum: ["normal", "italic"] }, // Italic
  textDecoration: { type: String, enum: ["none", "underline"] }, // Underline
  textAlign: { type: String, enum: ["left", "center", "right", "justify"] }, // Alignment
  color: { type: String }, // Text color (hex, rgb, etc.)
  backgroundColor: { type: String }, // Background color
  stroke: { type: String }, // Stroke color
  strokeWidth: { type: Number, min: 0, max: 20 }, // Stroke width
  opacity: { type: Number, min: 0, max: 1 }, // Opacity
  isCurved: { type: Boolean, default: false }, // Curved text

  // Image-specific properties (from ImageToolbar.jsx)
  filter: { type: String }, // CSS filter (e.g., "hue-rotate(90deg) brightness(1)")
  hue: { type: Number, min: 0, max: 360 }, // Hue adjustment
  sat: { type: Number, min: 0, max: 2 }, // Saturation adjustment
  br: { type: Number, min: 0, max: 2 }, // Brightness adjustment
  borderRadius: { type: Number, min: 0, max: 50 }, // Border radius

  // Graphic-specific properties (from GraphicsToolbar.jsx)
  shapeType: {
    type: String,
    enum: [
      "square",
      "circle",
      "triangle",
      "star",
      "pentagon",
      "hexagon",
      "diamond",
      "line",
      "arrow",
    ],
  }, // Shape type
  fillColor: { type: String }, // Fill color
  strokeColor: { type: String }, // Stroke color
  strokeStyle: { type: String, enum: ["solid", "dashed", "dotted"] }, // Stroke style
  flip: { type: String, enum: ["horizontal", "vertical", null] }, // Flip direction

  // Icon-specific properties (from IconToolbar.jsx)
  icon: { type: String }, // Icon component name or identifier
});

const designSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    canvasShape: {
      type: String,
      enum: ["square", "rectangle", "circle", "custom"],
      required: true,
    },
    canvasSize: {
      width: { type: Number, default: 1050 },
      height: { type: Number, default: 600 },
    },
    canvasBackground: {
      type: Schema.Types.Mixed, // Supports color, gradient, or image
      default: "#ffffff",
    },
    designElements: {
      type: [designElementSchema],
      default: [],
    },
    previewImage: {
      type: String,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true },
);

export const Design = mongoose.model("Design", designSchema);