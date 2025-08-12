import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
export const precreateProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      subcategory,
      description = "",
      price = 0,
      stock = 0,
      tags = [],
      sizes = [],
      colors = [],
      pricingTiers = [],
    } = req.body;

    // Basic validation
    if (!name || !sku) {
      return res.status(400).json({
        success: false,
        message: "Product name and SKU are required.",
      });
    }

    // Validate ObjectId format if provided
    if (category && !mongoose.isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        message: "category is not a valid id.",
      });
    }
    if (subcategory && !mongoose.isValidObjectId(subcategory)) {
      return res.status(400).json({
        success: false,
        message: "subcategory is not a valid id.",
      });
    }

    // Prepare document using safe types
    const productDoc = {
      name: String(name).trim(),
      sku: String(sku).trim(),
      category: category || null,
      subcategory: subcategory || null,
      description: String(description || ""),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      tags: Array.isArray(tags) ? tags : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
      pricingTiers: Array.isArray(pricingTiers) ? pricingTiers : [],
    };

    // Create product
    const created = await Product.create(productDoc);

    return res.status(201).json({
      success: true,
      message: "Product pre-created successfully.",
      data: created,
    });
  } catch (err) {
    console.error("precreateProduct error:", err);

    // Duplicate key (unique index) often results in 11000
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error. A product with the same SKU already exists.",
        error: err.keyValue || null,
      });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error while creating product.",
        error: err.message,
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Internal server error while pre-creating product.",
      error: err.message,
    });
  }
};
// Helper to parse and validate product data from request
const parseProductData = (body) => {
  const {
    name,
    sku,
    category,
    subcategory,
    description,
    price,
    stock,
    tags,
    sizes,
    colors,
    pricingTiers,
  } = body;

  return {
    name,
    sku,
    category,
    subcategory,
    description,
    price: price ? parseFloat(price) : undefined,
    stock: stock ? parseInt(stock) : undefined,
    tags: tags ? JSON.parse(tags) : [],
    sizes: sizes ? JSON.parse(sizes) : [],
    colors: colors ? JSON.parse(colors) : [],
    pricingTiers: pricingTiers ? JSON.parse(pricingTiers) : [],
  };
};

// export const precreateProduct = async (req, res) => {
//   try {
//     const productData = parseProductData(req.body);

//     if (
//       !productData.name ||
//       !productData.sku ||
//       !productData.category ||
//       !productData.subcategory
//     ) {
//       throw new ApiError(
//         400,
//         "Name, SKU, category, and subcategory are required for pre-creation",
//       );
//     }

//     const newProduct = await Product.create(productData);

//     return res
//       .status(201)
//       .json(
//         new ApiResponse(201, newProduct, "Product pre-created successfully"),
//       );
//   } catch (error) {
//     console.error("Error pre-creating product:", error);
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate key error: An item with this SKU already exists.",
//       });
//     }
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message:
//         error.message || "Internal server error while pre-creating product",
//     });
//   }
// };

export const createProduct = async (req, res) => {
  try {
    const productData = parseProductData(req.body);

    if (
      !productData.name ||
      !productData.sku ||
      !productData.category ||
      !productData.description ||
      !productData.price ||
      !productData.stock
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const baseImage = req.files?.baseImage?.[0]?.path || null;
    const gallery = req.files?.gallery?.map((file) => file.path) || [];

    const product = await Product.create({
      ...productData,
      baseImage,
      gallery,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const productData = parseProductData(req.body);
    const baseImage = req.files?.baseImage?.[0]?.path || null;
    const gallery = req.files?.gallery?.map((file) => file.path) || [];

    const product = await Product.findByIdAndUpdate(
      productId,
      { ...productData, baseImage, gallery, updatedAt: new Date() },
      { new: true, runValidators: true },
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
