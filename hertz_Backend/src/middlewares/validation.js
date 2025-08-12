import { body, param, query, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

// Handle validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new ApiError(400, "Validation Error", errorMessages);
  }
  next();
};

// Coupon validation rules
export const validateCouponCreation = [
  body("code")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("Coupon code can only contain uppercase letters and numbers"),

  body("discountType")
    .isIn(["Percentage", "Flat", "Free Shipping"])
    .withMessage("Discount type must be Percentage, Flat, or Free Shipping"),

  body("discount").trim().notEmpty().withMessage("Discount value is required"),

  body("minOrder")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order must be a positive number"),

  body("validity")
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Validity date must be in the future");
      }
      return true;
    }),

  body("appliesTo")
    .isIn(["All", "Selected"])
    .withMessage("Applies to must be either All or Selected"),

  body("maxUsage")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maximum usage must be at least 1"),

  body("usagePerUser")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage per user must be at least 1"),

  body("autoDiscount")
    .optional()
    .isBoolean()
    .withMessage("Auto discount must be a boolean value"),

  handleValidationErrors,
];

export const validateCouponUpdate = [
  param("id").isMongoId().withMessage("Invalid coupon ID"),

  body("code")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("Coupon code can only contain uppercase letters and numbers"),

  body("discountType")
    .optional()
    .isIn(["Percentage", "Flat", "Free Shipping"])
    .withMessage("Discount type must be Percentage, Flat, or Free Shipping"),

  body("discount")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Discount value is required"),

  body("minOrder")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order must be a positive number"),

  body("validity")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Validity date must be in the future");
      }
      return true;
    }),

  body("appliesTo")
    .optional()
    .isIn(["All", "Selected"])
    .withMessage("Applies to must be either All or Selected"),

  body("maxUsage")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maximum usage must be at least 1"),

  body("usagePerUser")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage per user must be at least 1"),

  body("autoDiscount")
    .optional()
    .isBoolean()
    .withMessage("Auto discount must be a boolean value"),

  handleValidationErrors,
];

export const validateCouponApplication = [
  body("couponCode").trim().notEmpty().withMessage("Coupon code is required"),

  body("orderValue")
    .isFloat({ min: 0 })
    .withMessage("Order value must be a positive number"),

  handleValidationErrors,
];

export const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  handleValidationErrors,
];

export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
];
