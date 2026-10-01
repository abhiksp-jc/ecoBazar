const Order = require("../models/order");
const Customer = require("../models/customer");
const Product = require("../models/product");
const Category = require("../models/category");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalCustomers,
      allOrders,
      lowStockList,
      recentOrders,
      recentCustomers
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Customer.countDocuments(),
      Order.find().select("totalAmount orderStatus paymentStatus createdAt"),
      Product.find({ stock: { $lte: 10 } }).limit(10),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Customer.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const totalOrdersCount = allOrders.length;
    const totalSales = allOrders
      .filter((o) => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const pendingOrdersCount = allOrders.filter(
      (o) => o.orderStatus === "Pending" || o.orderStatus === "Processing"
    ).length;

    const deliveredOrdersCount = allOrders.filter(
      (o) => o.orderStatus === "Delivered"
    ).length;

    return res.status(200).json({
      success: true,
      stats: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        deliveredOrders: deliveredOrdersCount,
        totalCustomers,
        totalProducts,
        totalCategories,
        lowStockCount: lowStockList.length
      },
      lowStockProducts: lowStockList,
      recentOrders,
      recentCustomers
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch dashboard statistics"
    });
  }
};

const resendOrderEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (email && email.trim()) {
      order.customerDetails = order.customerDetails || {};
      order.customerDetails.email = email.trim().toLowerCase();
      await order.save();
    }

    const emailSent = await sendOrderConfirmationEmail(order);

    return res.status(200).json({
      success: true,
      emailSent,
      recipient: order.customerDetails?.email,
      message: emailSent
        ? `Order confirmation email sent to ${order.customerDetails?.email}`
        : "Failed to send email. Please check server email settings."
    });
  } catch (error) {
    console.error("resendOrderEmail error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to resend confirmation email"
    });
  }
};

module.exports = {
  getDashboardStats,
  resendOrderEmail
};
