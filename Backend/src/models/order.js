const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: "kg"
  },
  image: {
    type: String,
    default: ""
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
      }
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    shippingFee: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "BANK_TRANSFER", "ONLINE", "RAZORPAY"],
      default: "COD"
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Processing"
    },
    orderNotes: {
      type: String,
      default: ""
    },
    razorpayOrderId: {
      type: String,
      default: ""
    },
    razorpayPaymentId: {
      type: String,
      default: ""
    },
    razorpaySignature: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
