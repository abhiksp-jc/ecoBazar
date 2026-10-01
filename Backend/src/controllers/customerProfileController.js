const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Customer = require("../models/customer");
const Order = require("../models/order");

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const orders = await Order.find({
      $or: [
        { customer: customer._id },
        { "customerDetails.email": customer.email }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      customer,
      orders
    });
  } catch (error) {
    console.error("getCustomerById error:", error);
    return res.status(500).json({
      message: "Failed to fetch customer details"
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Customer record removed successfully"
    });
  } catch (error) {
    console.error("deleteCustomer error:", error);
    return res.status(500).json({
      message: "Failed to delete customer"
    });
  }
};

const getCurrentProfile = async (req, res) => {
  try {
    const email = req.query.email || req.user?.email || req.params?.email;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required to fetch profile" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const customer = await Customer.findOne({ email: normalizedEmail }).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    return res.status(200).json({
      success: true,
      customer
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch profile" });
  }
};

const updateCustomerProfile = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, newEmail, profileImage } = req.body;
    const targetEmail = (email || req.user?.email || "").trim().toLowerCase();

    if (!targetEmail) {
      return res.status(400).json({ message: "Current email is required" });
    }

    let customer = await Customer.findOne({ email: targetEmail });
    if (!customer) {
      const fName = (firstName || "").trim();
      const lName = (lastName || "").trim();
      customer = await Customer.create({
        firstName: fName,
        lastName: lName,
        name: `${fName} ${lName}`.trim() || targetEmail.split("@")[0],
        email: targetEmail,
        phone: (phone || "").trim(),
        profileImage: (profileImage || "").trim()
      });
    } else {
      if (firstName !== undefined) customer.firstName = firstName.trim();
      if (lastName !== undefined) customer.lastName = lastName.trim();
      customer.name = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || customer.name;
      if (phone !== undefined) customer.phone = phone.trim();
      if (profileImage !== undefined && profileImage !== "") {
        customer.profileImage = profileImage;
      }

      if (newEmail && newEmail.trim().toLowerCase() !== targetEmail) {
        const nextEmail = newEmail.trim().toLowerCase();
        const conflict = await Customer.findOne({ email: nextEmail });
        if (conflict && conflict._id.toString() !== customer._id.toString()) {
          return res.status(400).json({ message: "Email is already taken by another account" });
        }
        customer.email = nextEmail;
      }

      await customer.save();
    }

    const safeCustomer = customer.toObject();
    delete safeCustomer.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      customer: safeCustomer
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update profile" });
  }
};

const updateCustomerBillingAddress = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      company,
      street,
      city,
      state,
      zipCode,
      country,
      phone
    } = req.body;

    const targetEmail = (email || req.user?.email || "").trim().toLowerCase();
    if (!targetEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    let customer = await Customer.findOne({ email: targetEmail });

    const addressData = {
      street: (street || "").trim(),
      city: (city || "").trim(),
      state: (state || "").trim(),
      zipCode: (zipCode || "").trim(),
      country: (country || "United States").trim()
    };

    if (!customer) {
      const fName = (firstName || "").trim();
      const lName = (lastName || "").trim();
      customer = await Customer.create({
        firstName: fName,
        lastName: lName,
        name: `${fName} ${lName}`.trim() || targetEmail.split("@")[0],
        email: targetEmail,
        phone: (phone || "").trim(),
        company: (company || "").trim(),
        address: addressData
      });
    } else {
      if (firstName !== undefined) customer.firstName = firstName.trim();
      if (lastName !== undefined) customer.lastName = lastName.trim();
      if (firstName || lastName) {
        customer.name = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || customer.name;
      }
      if (company !== undefined) customer.company = company.trim();
      if (phone !== undefined) customer.phone = phone.trim();
      customer.address = addressData;
      await customer.save();
    }

    const safeCustomer = customer.toObject();
    delete safeCustomer.password;

    return res.status(200).json({
      success: true,
      message: "Billing address updated successfully",
      customer: safeCustomer
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update billing address" });
  }
};

const changeCustomerPassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const targetEmail = (email || req.user?.email || "").trim().toLowerCase();

    if (!targetEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const customer = await Customer.findOne({ email: targetEmail });
    if (!customer) {
      return res.status(404).json({ message: "Customer account not found" });
    }

    if (customer.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const match = await bcrypt.compare(currentPassword, customer.password);
      if (!match) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    customer.password = hashed;
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to change password" });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const email = (req.body.email || req.user?.email || "").trim().toLowerCase();
    const imagePath = `/uploads/customers/${req.file.filename}`;

    if (email) {
      let customer = await Customer.findOne({ email });
      if (!customer) {
        customer = await Customer.create({
          email,
          name: email.split("@")[0],
          profileImage: imagePath
        });
      } else {
        customer.profileImage = imagePath;
        await customer.save();
      }
      const safe = customer.toObject();
      delete safe.password;
      return res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        profileImage: imagePath,
        customer: safe
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      profileImage: imagePath
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to upload profile image" });
  }
};

module.exports = {
  getCustomerById,
  deleteCustomer,
  getCurrentProfile,
  updateCustomerProfile,
  updateCustomerBillingAddress,
  changeCustomerPassword,
  uploadProfileImage
};
