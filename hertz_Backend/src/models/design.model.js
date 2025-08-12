// design.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

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
    // keep canvasSize but allow optional/relaxed input (controller will ensure values)
    canvasSize: {
      width: { type: Number, default: 1050 },
      height: { type: Number, default: 600 },
    },
    // canvasBackground can be string or an object (color/gradient/image) -> use Mixed
    canvasBackground: {
      type: Schema.Types.Mixed,
      default: "#ffffff",
    },
    // designElements: store as an array of Mixed so we don't block extra fields
    designElements: {
      type: [Schema.Types.Mixed],
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
