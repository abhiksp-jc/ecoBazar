const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      default: "PERCENTAGE"
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    maxDiscount: {
      type: Number,
      default: null,
      min: 0
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: true
    },
    usageLimit: {
      type: Number,
      default: null,
      min: 1
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual helper to check if coupon is currently valid based on time and status
couponSchema.methods.isValidNow = function () {
  const now = new Date();
  if (!this.isActive) return { valid: false, reason: "Coupon is currently inactive" };
  if (this.startDate && new Date(this.startDate) > now) {
    return { valid: false, reason: `Coupon starts on ${new Date(this.startDate).toLocaleDateString()}` };
  }
  if (this.expiryDate && new Date(this.expiryDate) < now) {
    return { valid: false, reason: `Coupon expired on ${new Date(this.expiryDate).toLocaleDateString()}` };
  }
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, reason: "Coupon usage limit has been reached" };
  }
  return { valid: true };
};

module.exports = mongoose.model("Coupon", couponSchema);
