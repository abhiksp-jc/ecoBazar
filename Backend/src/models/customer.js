const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true
    },
    lastName: {
      type: String,
      default: "",
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    password: {
      type: String,
      default: ""
    },
    profileImage: {
      type: String,
      default: ""
    },
    company: {
      type: String,
      trim: true,
      default: ""
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      country: { type: String, default: "United States" }
    },
    orderNotes: {
      type: String,
      default: ""
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Customer", customerSchema);
