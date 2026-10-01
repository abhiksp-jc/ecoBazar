const Admin = require("../models/admin");

// 1. Get logged-in admin or staff profile
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Update logged-in admin or staff profile details
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id).select("+password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }
      const bcrypt = require("bcryptjs");
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) admin.name = name.trim();
    if (phone) admin.phone = phone.trim();
    if (profileImage !== undefined) admin.profileImage = profileImage;

    await admin.save();

    const sanitizedAdmin = admin.toObject();
    delete sanitizedAdmin.password;

    res.status(200).json({
      message: "Profile updated successfully",
      admin: sanitizedAdmin
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
