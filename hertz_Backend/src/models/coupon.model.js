import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "Coupon code must be at least 3 characters long"],
      maxlength: [20, "Coupon code cannot exceed 20 characters"],
      match: [
        /^[A-Z0-9]+$/,
        "Coupon code can only contain uppercase letters and numbers",
      ],
    },
    discountType: {
      type: String,
      required: [true, "Discount type is required"],
      enum: ["Percentage", "Flat", "Free Shipping"],
    },
    discount: {
      type: String,
      required: [true, "Discount value is required"],
      trim: true,
    },
    discountValue: {
      type: Number,
      min: [0, "Discount value cannot be negative"],
      default: 0, // no longer required
    },
    minOrder: {
      type: Number,
      default: 0,
      min: [0, "Minimum order value cannot be negative"],
    },
    validity: {
      type: Date,
      required: [true, "Validity date is required"],
      validate: {
        validator: (v) => v > new Date(),
        message: "Validity date must be in the future",
      },
    },
    appliesTo: {
      type: String,
      enum: ["All", "Selected"],
      default: "All",
    },
    selectedProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    selectedCategories: [{ type: String }],
    usage: {
      type: Number,
      default: 0,
      min: [0, "Usage count cannot be negative"],
    },
    maxUsage: {
      type: Number,
      default: null,
      min: [1, "Maximum usage must be at least 1"],
    },
    usagePerUser: {
      type: Number,
      default: 1,
      min: [1, "Usage per user must be at least 1"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
    },
    autoDiscount: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // optional
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        usedAt: { type: Date, default: Date.now },
        orderValue: Number,
        discountApplied: Number,
      },
    ],
  },
  { timestamps: true },
);

// Pre-save: compute discountValue and expire status
couponSchema.pre("save", function (next) {
  if (this.validity < Date.now()) this.status = "Expired";

  let match;
  if (this.discountType === "Percentage" || this.discountType === "Flat") {
    match = this.discount.match(/(\d+(?:\.\d+)?)/);
    this.discountValue = match ? parseFloat(match[1]) : 0;
  } else {
    this.discountValue = 0;
  }
  next();
});

// Methods...
couponSchema.methods.canUserUseCoupon = function (userId) {
  /* ... */
};
couponSchema.methods.applyCoupon = function (orderValue, userId) {
  /* ... */
};

export const Coupon = mongoose.model("Coupon", couponSchema);
