import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  precreateProduct,
} from "../controllers/product.controller.js";
// import { auth_middleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// router.use(auth_middleware);

// This endpoint is now connected to the real controller function
router.route("/precreate").post(precreateProduct);

// Existing routes
router
  .route("/")
  .post(
    upload.fields([
      { name: "baseImage", maxCount: 1 },
      { name: "gallery", maxCount: 5 },
    ]),
    createProduct,
  )
  .get(getProducts);

router
  .route("/:productId")
  .get(getProductById)
  .put(
    upload.fields([
      { name: "baseImage", maxCount: 1 },
      { name: "gallery", maxCount: 5 },
    ]),
    updateProduct,
  )
  .delete(deleteProduct);

export default router;
