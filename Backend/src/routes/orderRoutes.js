const express = require("express");
const {
  createRazorpayOrder,
  createOrder,
  getOrders,
  getCustomerOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats,
  resendOrderEmail
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

const allowAdminOrOpenOrders = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authMiddleware(req, res, next);
  }
  if (typeof next === "function") {
    return next();
  }
};

router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/", createOrder);
router.post("/:id/resend-email", resendOrderEmail);
router.get("/customer-orders", getCustomerOrders);
router.get("/stats/dashboard", allowAdminOrOpenOrders, getDashboardStats);
router.get("/", allowAdminOrOpenOrders, getOrders);
router.get("/:id", allowAdminOrOpenOrders, getOrderById);
router.put("/:id/status", allowAdminOrOpenOrders, updateOrderStatus);

module.exports = router;
