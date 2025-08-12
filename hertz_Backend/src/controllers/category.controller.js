import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

// --- Main Category Controllers ---

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 */
const createCategory = AsyncHandler(async (req, res) => {
  const { name, description, imageUrl, attributes } = req.body;
  if (!name || !imageUrl) {
    throw new ApiError(400, "Name and image URL are required");
  }
  // Generate a URL-friendly slug from the name
  const slug = name
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const category = await Category.create({
    name,
    description,
    imageUrl,
    slug,
    attributes: attributes || [],
    subcategories: [],
  });
  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 */
const getCategories = AsyncHandler(async (req, res) => {
  const categories = await Category.find();
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

/**
 * @desc    Get a single category by its slug
 * @route   GET /api/v1/categories/slug/:slug
 */
const getCategoryBySlug = AsyncHandler(async (req, res) => {
  const { slug } = req.params;

  // ✅ Crucial debugging logs
  console.log(`[Backend Log] Searching database for slug: "${slug}"`);
  const category = await Category.findOne({ slug });
  console.log("[Backend Log] Found category:", category); // This will be null if not found

  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

/**
 * @desc    Update a category by its slug
 * @route   PUT /api/v1/categories/:slug
 */
const updateCategory = AsyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, description, imageUrl, attributes } = req.body;
  if (!name || !imageUrl) {
    throw new ApiError(400, "Name and image URL are required");
  }
  // Generate a new slug if the name has changed
  const newSlug = name
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const category = await Category.findOneAndUpdate(
    { slug }, // Find by the old slug
    { name, description, imageUrl, slug: newSlug, attributes },
    { new: true, runValidators: true },
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

/**
 * @desc    Delete a category by its slug
 * @route   DELETE /api/v1/categories/:slug
 */
const deleteCategory = AsyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOneAndDelete({ slug });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

// --- ✅ Subcategory Controllers ---

/**
 * @desc    Add a subcategory to a parent category
 * @route   POST /api/v1/categories/:categoryId/subcategories
 */
const addSubcategory = AsyncHandler(async (req, res) => {
  const { categoryId } = req.params; // This is the parent category's _id
  const { name, image } = req.body;

  if (!name || !image) {
    throw new ApiError(400, "Subcategory name and image are required.");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Parent category not found.");
  }

  const slug = name
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  // Add the new subcategory to the parent's array
  category.subcategories.push({ name, image, slug });
  await category.save(); // Save the parent document

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Subcategory added successfully."));
});

/**
 * @desc    Delete a subcategory
 * @route   DELETE /api/v1/categories/:categoryId/subcategories/:subcategoryId
 */
const deleteSubcategory = AsyncHandler(async (req, res) => {
  const { categoryId, subcategoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Parent category not found.");
  }

  // Mongoose's .id() method is a clean way to find and remove a subdocument
  category.subcategories.id(subcategoryId).deleteOne();
  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Subcategory deleted successfully."));
});

export {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  addSubcategory,
  deleteSubcategory,
};
