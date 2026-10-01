const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    profileImage: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["ADMIN", "STAFF"],
      default: "STAFF"
    },

    permissions: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE"
    },

    lastLogin: {
      type: Date,
      default: null
    },

    resetPasswordToken: {
      type: String,
      default: null,
      select: false
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false
    },

    resetPasswordOtp: {
      type: String,
      default: null,
      select: false
    },

    resetPasswordOtpExpires: {
      type: Date,
      default: null,
      select: false
    },

    resetPasswordOtpVerified: {
      type: Boolean,
      default: false,
      select: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Admin", adminSchema);