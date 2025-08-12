import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  values: [{ type: String, trim: true }],
});

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    attributes: [attributeSchema],
    subcategories: [subcategorySchema],
    products: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Category = mongoose.model("Category", categorySchema);
