const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    badge: {
      type: String,
      trim: true,
      default: ""
    },
    discountText: {
      type: String,
      trim: true,
      default: ""
    },
    buttonText: {
      type: String,
      trim: true,
      default: "Shop Now"
    },
    buttonLink: {
      type: String,
      trim: true,
      default: "/shop"
    },
    image: {
      type: String,
      trim: true,
      default: ""
    },
    position: {
      type: String,
      enum: [
        "hero_main",
        "hero_top_right",
        "hero_bottom_right",
        "promo_middle",
        "deal_banner",
        "summer_sale",
        "other"
      ],
      default: "hero_main"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    productFilterType: {
      type: String,
      enum: ["all", "category", "discounted", "specific"],
      default: "all"
    },
    selectedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Banner", bannerSchema);
