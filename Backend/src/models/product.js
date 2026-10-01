const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    images: {
      type: [String],
      default: []
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    unit: {
      type: String,
      required: true,
      trim: true
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

productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

productSchema.set("toJSON", {
  virtuals: true
});

productSchema.set("toObject", {
  virtuals: true
});

module.exports = mongoose.model("Product", productSchema);