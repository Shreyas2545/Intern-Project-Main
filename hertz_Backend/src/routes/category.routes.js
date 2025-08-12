import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  addSubcategory,
  deleteSubcategory,
} from "../controllers/category.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js"; // Temporarily commented out

const router = Router();

// --- Main Category Routes ---
// POST /api/v1/categories -> Creates a new category (Temporarily unprotected)
// GET  /api/v1/categories -> Gets all categories (Public)
router.route("/").post(createCategory).get(getCategories);

// --- Single Category Routes (by slug) ---
// GET    /api/v1/categories/:slug -> Gets a single category by its slug (Public)
// PUT    /api/v1/categories/:slug -> Updates a category by its slug (Protected)
// DELETE /api/v1/categories/:slug -> Deletes a category by its slug (Protected)
router
  .route("/:slug")
  .get(getCategoryBySlug)
  .put(/* verifyJWT, */ updateCategory)
  .delete(/* verifyJWT, */ deleteCategory);

// --- ✅ Subcategory Routes ---
// POST /api/v1/categories/:categoryId/subcategories -> Adds a subcategory to a parent category (Protected)
// DELETE /api/v1/categories/:categoryId/subcategories/:subcategoryId -> Deletes a subcategory (Protected)
router
  .route("/:categoryId/subcategories")
  .post(/* verifyJWT, */ addSubcategory);
router
  .route("/:categoryId/subcategories/:subcategoryId")
  .delete(/* verifyJWT, */ deleteSubcategory);

export default router;
