const express = require("express");

const {
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getProfile,
  updateProfile,
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/login", login);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/verify-reset-otp/:token",
  verifyResetOtp
);

router.post(
  "/reset-password/:token",
  resetPassword
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

const Admin = require("../models/admin");

router.get("/public/staff", async (req, res) => {
  try {
    const staff = await Admin.find(
      { role: "STAFF", status: "ACTIVE" },
      "name email phone profileImage role createdAt"
    );
    res.status(200).json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post(
  "/staff",
  authMiddleware,
  adminMiddleware,
  createStaff
);

router.get(
  "/staff",
  authMiddleware,
  adminMiddleware,
  getStaff
);

router.put(
  "/staff/:id",
  authMiddleware,
  adminMiddleware,
  updateStaff
);

router.delete(
  "/staff/:id",
  authMiddleware,
  adminMiddleware,
  deleteStaff
);

module.exports = router;