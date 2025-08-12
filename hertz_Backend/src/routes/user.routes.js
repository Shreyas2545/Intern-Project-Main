import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  getCurrentUser,
  // --- IMPORT NEW ADDRESS CONTROLLERS ---
  // You will need to create these functions in your user.controller.js
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Public User Routes ---
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// --- Secured User Routes ---
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

router
  .route("/update-profile")
  .patch(verifyJWT, upload.single("avatar"), updateUserProfile);

// =======================================================
// --- NEW: SECURED ADDRESS ROUTES ---
// These routes are for managing user shipping addresses.
// =======================================================

// @route   POST /api/v1/users/add-address
// @desc    Add a new address for the logged-in user
// @access  Private
router.route("/add-address").post(verifyJWT, addAddress);

// @route   GET /api/v1/users/get-addresses
// @desc    Get all addresses for the logged-in user
// @access  Private
router.route("/get-addresses").get(verifyJWT, getAddresses);

// @route   PATCH /api/v1/users/update-address/:id
// @desc    Update a specific address by its ID
// @access  Private
router.route("/update-address/:id").patch(verifyJWT, updateAddress);

// @route   DELETE /api/v1/users/delete-address/:id
// @desc    Delete a specific address by its ID
// @access  Private
router.route("/delete-address/:id").delete(verifyJWT, deleteAddress);

export default router;
