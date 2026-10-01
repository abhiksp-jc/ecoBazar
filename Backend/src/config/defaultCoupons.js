const Coupon = require("../models/coupon");

const seedInitialCoupons = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);

      const sevenDays = new Date();
      sevenDays.setDate(sevenDays.getDate() + 7);

      await Coupon.create([
        {
          code: "ECO20",
          description: "Get 20% off on your entire cart for orders above $30",
          discountType: "PERCENTAGE",
          discountValue: 20,
          minOrderAmount: 30,
          maxDiscount: 40,
          startDate: new Date(),
          expiryDate: thirtyDays,
          usageLimit: 100,
          isActive: true
        },
        {
          code: "SAVE10",
          description: "Flat $10 savings on orders above $40",
          discountType: "FIXED",
          discountValue: 10,
          minOrderAmount: 40,
          startDate: new Date(),
          expiryDate: sevenDays,
          usageLimit: 50,
          isActive: true
        }
      ]);
    }
  } catch (err) {
    console.error("seedInitialCoupons error:", err);
  }
};

module.exports = {
  seedInitialCoupons
};
