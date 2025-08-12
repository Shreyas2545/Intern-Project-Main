import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
    tags: {
      type: [String],
      default: [],
    },
    template: {
      type: String,
      trim: true,
    },
    baseImage: {
      type: String, // URL of the product image stored in Cloudinary
    },
    gallery: {
      type: [String], // Array of image URLs stored in Cloudinary
      default: [],
    },
    pricingTiers: [
      {
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    longDescription: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      default: "gifts",
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
