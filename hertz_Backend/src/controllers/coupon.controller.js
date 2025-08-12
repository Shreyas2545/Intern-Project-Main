import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.model.js";

// Create coupon
const createCoupon = AsyncHandler(async (req, res) => {
  // Log request body for debugging
  console.log("CreateCoupon body:", req.body);

  const {
    code,
    discountType,
    discount,
    minOrder = 0,
    validity,
    appliesTo = "All",
    selectedProducts = [],
    selectedCategories = [],
    maxUsage,
    usagePerUser = 1,
    autoDiscount = false,
  } = req.body;

  // Log individual fields
  console.log({ code, discountType, discount, validity });

  // Basic validation
  if (!code || !discount || !validity) {
    console.error("Validation failed: missing required fields");
    throw new ApiError(400, "Fields code, discount, and validity are required");
  }

  // Normalize and parse
  const normalizedCode = code.toUpperCase().trim();
  const match = discount.match(/(\d+(?:\.\d+)?)/);
  const discountValue =
    discountType === "Free Shipping" ? 0 : match ? parseFloat(match[1]) : 0;

  // Check duplicate
  const existing = await Coupon.findOne({ code: normalizedCode });
  if (existing) {
    console.error("Duplicate coupon code:", normalizedCode);
    throw new ApiError(409, "Coupon with this code already exists");
  }

  // Create coupon document
  const coupon = await Coupon.create({
    code: normalizedCode,
    discountType,
    discount,
    discountValue,
    minOrder,
    validity,
    appliesTo,
    selectedProducts: appliesTo === "Selected" ? selectedProducts : [],
    selectedCategories: appliesTo === "Selected" ? selectedCategories : [],
    maxUsage,
    usagePerUser,
    autoDiscount,
    createdBy: req.user?._id || null, // Optional in admin context
  });

  // Populate and return
  const created = await Coupon.findById(coupon._id).populate(
    "createdBy",
    "username fullName",
  );
  return res
    .status(201)
    .json(new ApiResponse(201, created, "Coupon created successfully"));
});

// The rest of the controller remains unchanged:

// Get all coupons
const getAllCoupons = AsyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    discountType = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const query = {};
  if (search)
    query.$or = [
      { code: { $regex: search, $options: "i" } },
      { discount: { $regex: search, $options: "i" } },
    ];
  if (status) query.status = status;
  if (discountType) query.discountType = discountType;

  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [coupons, total] = await Promise.all([
    Coupon.find(query)
      .populate("createdBy", "username fullName")
      .populate("usedBy.user", "username fullName")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort),
    Coupon.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        coupons,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      "Coupons fetched successfully",
    ),
  );
});

// Get single coupon
const getCoupon = AsyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate("createdBy", "username fullName")
    .populate("usedBy.user", "username fullName");
  if (!coupon) throw new ApiError(404, "Coupon not found");
  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon fetched successfully"));
});

// Update coupon
const updateCoupon = AsyncHandler(async (req, res) => {
  if (req.body.code) req.body.code = req.body.code.toUpperCase().trim();
  const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "username fullName");
  if (!updated) throw new ApiError(404, "Coupon not found");
  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Coupon updated successfully"));
});

// Delete coupon
const deleteCoupon = AsyncHandler(async (req, res) => {
  const deleted = await Coupon.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, "Coupon not found");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});

// Apply coupon
const applyCoupon = AsyncHandler(async (req, res) => {
  const { couponCode, orderValue } = req.body;
  if (!couponCode || orderValue == null)
    throw new ApiError(400, "couponCode and orderValue required");

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    status: "Active",
  });
  if (!coupon) throw new ApiError(404, "Invalid coupon code");
  if (coupon.validity < new Date()) {
    await coupon.updateOne({ status: "Expired" });
    throw new ApiError(400, "Coupon has expired");
  }
  if (coupon.maxUsage && coupon.usage >= coupon.maxUsage)
    throw new ApiError(400, "Coupon usage limit exceeded");

  const result = coupon.applyCoupon(orderValue, req.user?._id || null);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discount: coupon.discount,
        },
        originalAmount: orderValue,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      },
      "Coupon applied successfully",
    ),
  );
});

// Redeem coupon
const redeemCoupon = AsyncHandler(async (req, res) => {
  const { couponCode, orderValue, orderId } = req.body;
  if (!couponCode || orderValue == null || !orderId)
    throw new ApiError(400, "couponCode, orderValue, and orderId required");

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    status: "Active",
  });
  if (!coupon) throw new ApiError(404, "Invalid coupon code");

  const result = coupon.applyCoupon(orderValue, req.user?._id || null);
  coupon.usage += 1;
  coupon.usedBy.push({
    user: req.user?._id || null,
    usedAt: new Date(),
    orderValue,
    discountApplied: result.discountAmount,
  });
  await coupon.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discount: coupon.discount,
        },
        orderId,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      },
      "Coupon redeemed successfully",
    ),
  );
});

// Coupon statistics
const getCouponStats = AsyncHandler(async (_, res) => {
  const [overview] = await Coupon.aggregate([
    {
      $group: {
        _id: null,
        totalCoupons: { $sum: 1 },
        activeCoupons: {
          $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
        },
        expiredCoupons: {
          $sum: { $cond: [{ $eq: ["$status", "Expired"] }, 1, 0] },
        },
        inactiveCoupons: {
          $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] },
        },
        totalUsage: { $sum: "$usage" },
        averageUsage: { $avg: "$usage" },
      },
    },
  ]);
  const discountTypeStats = await Coupon.aggregate([
    {
      $group: {
        _id: "$discountType",
        count: { $sum: 1 },
        totalUsage: { $sum: "$usage" },
      },
    },
  ]);
  const recentActivity = await Coupon.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("code discountType status createdAt usage");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { overview: overview || {}, discountTypeStats, recentActivity },
        "Coupon statistics fetched successfully",
      ),
    );
});

// Public coupons
// controllers/coupon.controller.js – adjust getPublicCoupons:
const getPublicCoupons = AsyncHandler(async (req, res) => {
  const coupons = await Coupon.find({
    status: "Active",
    validity: { $gt: new Date() },
  })
    .select("code discount discountType minOrder appliesTo")
    .sort({ discountValue: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "Public coupons fetched successfully"));
});

// Validate coupon code
const validateCouponCode = AsyncHandler(async (req, res) => {
  const { couponCode } = req.params;
  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    status: "Active",
  });
  if (!coupon) throw new ApiError(404, "Invalid coupon code");
  if (coupon.validity < new Date())
    throw new ApiError(400, "Coupon has expired");
  if (coupon.maxUsage && coupon.usage >= coupon.maxUsage)
    throw new ApiError(400, "Coupon usage limit exceeded");
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        code: coupon.code,
        discountType: coupon.discountType,
        discount: coupon.discount,
        minOrder: coupon.minOrder,
        validity: coupon.validity,
        appliesTo: coupon.appliesTo,
      },
      "Coupon is valid",
    ),
  );
});

export {
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
};
