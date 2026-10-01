const Coupon = require("../models/coupon");

// 1. Customer: Validate and Apply Coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid coupon code."
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const total = Number(cartTotal);

    if (isNaN(total) || total < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart total provided."
      });
    }

    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon code "${cleanCode}" does not exist.`
      });
    }

    // Check validity rules (Active, Start Date, Expiry Date, Usage Limit)
    const validity = coupon.isValidNow();
    if (!validity.valid) {
      return res.status(400).json({
        success: false,
        message: validity.reason
      });
    }

    // Check minimum order requirement
    if (coupon.minOrderAmount && total < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${coupon.minOrderAmount.toFixed(2)} required to apply this coupon. (Current subtotal: $${total.toFixed(2)})`
      });
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (total * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // FIXED discount
      discount = Math.min(coupon.discountValue, total);
    }

    // Format to 2 decimals
    discount = Math.min(total, Number(discount.toFixed(2)));
    const newTotal = Number(Math.max(0, total - discount).toFixed(2));

    return res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" applied successfully! You saved $${discount.toFixed(2)}.`,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
        expiryDate: coupon.expiryDate,
        discountAmount: discount,
        newTotal: newTotal
      }
    });
  } catch (error) {
    console.error("validateCoupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while validating coupon."
    });
  }
};

const { seedInitialCoupons } = require("../config/defaultCoupons");

// 2. Customer: Get Active Coupons Available for Shoppers
const getPublicCoupons = async (req, res) => {
  try {
    await seedInitialCoupons();
    const now = new Date();
    const activeCoupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: now },
      $or: [
        { startDate: { $lte: now } },
        { startDate: { $exists: false } },
        { startDate: null }
      ]
    })
      .select("code description discountType discountValue minOrderAmount maxDiscount expiryDate")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      coupons: activeCoupons
    });
  } catch (error) {
    console.error("getPublicCoupons error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active coupons."
    });
  }
};

// 3. Admin: Get all coupons with filters & statistics
const getAdminCoupons = async (req, res) => {
  try {
    await seedInitialCoupons();
    const { status = "ALL", search = "" } = req.query;
    const now = new Date();

    let query = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ code: searchRegex }, { description: searchRegex }];
    }

    if (status === "ACTIVE") {
      query.isActive = true;
      query.expiryDate = { $gt: now };
    } else if (status === "EXPIRED") {
      query.expiryDate = { $lte: now };
    } else if (status === "INACTIVE") {
      query.isActive = false;
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });

    // Aggregate overall statistics
    const allCoupons = await Coupon.find({});
    const stats = {
      total: allCoupons.length,
      active: allCoupons.filter((c) => c.isActive && new Date(c.expiryDate) > now).length,
      expired: allCoupons.filter((c) => new Date(c.expiryDate) <= now).length,
      totalRedemptions: allCoupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)
    };

    return res.status(200).json({
      success: true,
      coupons,
      stats
    });
  } catch (error) {
    console.error("getAdminCoupons error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin coupons."
    });
  }
};

// 4. Admin: Create a new Coupon (generate code, set discount, adjust time)
const createCoupon = async (req, res) => {
  try {
    let {
      code,
      description,
      discountType = "PERCENTAGE",
      discountValue,
      minOrderAmount = 0,
      maxDiscount = null,
      startDate = new Date(),
      expiryDate,
      usageLimit = null,
      isActive = true
    } = req.body;

    // Auto-generate code if empty
    if (!code || !code.trim()) {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `ECO${discountType === "PERCENTAGE" ? Number(discountValue) || 20 : "SAVE"}${randomSuffix}`;
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon code "${cleanCode}" already exists. Please choose a different code.`
      });
    }

    if (discountValue === undefined || discountValue === null || Number(discountValue) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0."
      });
    }

    if (discountType === "PERCENTAGE" && Number(discountValue) > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%."
      });
    }

    if (!expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon expiry date and time is required."
      });
    }

    const parsedExpiry = new Date(expiryDate);
    const parsedStart = startDate ? new Date(startDate) : new Date();

    if (isNaN(parsedExpiry.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid expiry date format."
      });
    }

    if (parsedExpiry <= parsedStart) {
      return res.status(400).json({
        success: false,
        message: "Expiry date and time must be after the start date."
      });
    }

    const newCoupon = new Coupon({
      code: cleanCode,
      description: description ? description.trim() : "",
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Math.max(0, Number(minOrderAmount) || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      startDate: parsedStart,
      expiryDate: parsedExpiry,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      isActive: Boolean(isActive)
    });

    await newCoupon.save();

    return res.status(201).json({
      success: true,
      message: `Coupon "${cleanCode}" created successfully!`,
      coupon: newCoupon
    });
  } catch (error) {
    console.error("createCoupon error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create coupon."
    });
  }
};

// 5. Admin: Update Coupon (Adjust time, discount, limits)
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      startDate,
      expiryDate,
      usageLimit,
      isActive
    } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found."
      });
    }

    if (code && code.trim().toUpperCase() !== coupon.code) {
      const cleanCode = code.trim().toUpperCase();
      const existing = await Coupon.findOne({ code: cleanCode });
      if (existing && existing._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: `Coupon code "${cleanCode}" is already in use.`
        });
      }
      coupon.code = cleanCode;
    }

    if (description !== undefined) coupon.description = description.trim();
    if (discountType !== undefined) coupon.discountType = discountType;

    if (discountValue !== undefined) {
      const val = Number(discountValue);
      if (val <= 0) {
        return res.status(400).json({ success: false, message: "Discount value must be greater than 0." });
      }
      if (coupon.discountType === "PERCENTAGE" && val > 100) {
        return res.status(400).json({ success: false, message: "Percentage discount cannot exceed 100%." });
      }
      coupon.discountValue = val;
    }

    if (minOrderAmount !== undefined) {
      coupon.minOrderAmount = Math.max(0, Number(minOrderAmount) || 0);
    }

    if (maxDiscount !== undefined) {
      coupon.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    }

    if (startDate !== undefined) {
      coupon.startDate = new Date(startDate);
    }

    // Time adjustment
    if (expiryDate !== undefined) {
      const parsedExpiry = new Date(expiryDate);
      if (isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid expiry date format." });
      }
      coupon.expiryDate = parsedExpiry;
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit = usageLimit ? Number(usageLimit) : null;
    }

    if (isActive !== undefined) {
      coupon.isActive = Boolean(isActive);
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" updated successfully!`,
      coupon
    });
  } catch (error) {
    console.error("updateCoupon error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update coupon."
    });
  }
};

// 6. Admin: Toggle Coupon Active Status
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found."
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" is now ${coupon.isActive ? "ACTIVE" : "INACTIVE"}.`,
      coupon
    });
  } catch (error) {
    console.error("toggleCouponStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle coupon status."
    });
  }
};

// 7. Admin: Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" deleted successfully.`
    });
  } catch (error) {
    console.error("deleteCoupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon."
    });
  }
};

module.exports = {
  validateCoupon,
  getPublicCoupons,
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon
};
