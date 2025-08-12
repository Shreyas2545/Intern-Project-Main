// routes/coupon.routes.js
import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  redeemCoupon,
  getCouponStats,
  getPublicCoupons,
  validateCouponCode,
} from "../controllers/coupon.controller.js";
import {
  validateCouponCreation,
  validateCouponUpdate,
  validateCouponApplication,
  validateMongoId,
  validatePagination,
} from "../middlewares/validation.js";

const router = Router();

// Public
router.get("/public", getPublicCoupons);
router.get("/validate/:couponCode", validateCouponCode);

// CRUD
router.get("/", validatePagination, getAllCoupons);
router.post("/", validateCouponCreation, createCoupon);
router.get("/:id", validateMongoId, getCoupon);
router.patch("/:id", validateCouponUpdate, updateCoupon);
router.delete("/:id", validateMongoId, deleteCoupon);

// Apply & Redeem
router.post("/apply", validateCouponApplication, applyCoupon);
router.post("/redeem", redeemCoupon);

// Stats
router.get("/admin/stats", getCouponStats);

export default router;
