import express from "express";
import {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getDesignByProductId,
} from "../controllers/design.controller.js";
// import { auth_middleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// router.use(auth_middleware);

router
  .route("/")
  .post(upload.single("previewImage"), createDesign)
  .get(getDesigns);

router.route("/product/:productId").get(getDesignByProductId);

router
  .route("/:designId")
  .get(getDesignById)
  .put(upload.single("previewImage"), updateDesign)
  .delete(deleteDesign);

export default router;
