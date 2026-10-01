const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Customer routes
router.post("/validate", couponController.validateCoupon);
router.get("/active", couponController.getPublicCoupons);

// Admin routes (Requires authentication)
router.get("/admin", authMiddleware, couponController.getAdminCoupons);
router.post("/admin", authMiddleware, couponController.createCoupon);
router.put("/admin/:id", authMiddleware, couponController.updateCoupon);
router.patch("/admin/:id/status", authMiddleware, couponController.toggleCouponStatus);
router.delete("/admin/:id", authMiddleware, couponController.deleteCoupon);

module.exports = router;
