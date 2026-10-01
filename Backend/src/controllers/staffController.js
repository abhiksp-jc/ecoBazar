const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const { normalizePermissions } = require("../config/permissions");
const { sendStaffCredentialsEmail } = require("../services/emailService");

// 1. Create a new Staff member with permissions and email login credentials
const createStaff = async (req, res) => {
  try {
    const { name, email, phone, password, permissions } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Name, email, phone and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingStaff = await Admin.findOne({ email: normalizedEmail });

    if (existingStaff) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role: "STAFF",
      permissions: normalizePermissions(permissions),
      status: "ACTIVE"
    });

    try {
      await sendStaffCredentialsEmail(normalizedEmail, name.trim(), password);
    } catch (emailError) {
      await Admin.findByIdAndDelete(staff._id);
      console.error("STAFF EMAIL ERROR:", emailError);
      return res.status(500).json({
        message: "Staff account could not be created because email could not be sent"
      });
    }

    res.status(201).json({
      message: "Staff created successfully and login credentials sent to email",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        permissions: staff.permissions,
        status: staff.status
      }
    });
  } catch (error) {
    console.error("CREATE STAFF ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get all staff accounts
const getStaff = async (req, res) => {
  try {
    const staff = await Admin.find({ role: "STAFF" }).sort({ createdAt: -1 });

    res.status(200).json({
      count: staff.length,
      staff
    });
  } catch (error) {
    console.error("GET STAFF ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Update staff details, status, password, or permissions
const updateStaff = async (req, res) => {
  try {
    const { name, email, phone, password, permissions, status } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (permissions !== undefined) updateData.permissions = normalizePermissions(permissions);
    if (status !== undefined) updateData.status = status;

    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters"
        });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (updateData.email) {
      const existingStaff = await Admin.findOne({
        email: updateData.email,
        _id: { $ne: req.params.id }
      });

      if (existingStaff) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    const staff = await Admin.findOneAndUpdate(
      { _id: req.params.id, role: "STAFF" },
      updateData,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      staff
    });
  } catch (error) {
    console.error("UPDATE STAFF ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. Delete staff account
const deleteStaff = async (req, res) => {
  try {
    const staff = await Admin.findOneAndDelete({
      _id: req.params.id,
      role: "STAFF"
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("DELETE STAFF ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff
};
