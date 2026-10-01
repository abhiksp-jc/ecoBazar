const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    role: {
      type: String,
      trim: true,
      default: "Customer"
    },
    avatar: {
      type: String,
      trim: true,
      default: ""
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
      default: 5
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure isApproved is always synchronized with status
testimonialSchema.pre("save", function (next) {
  this.isApproved = this.status === "APPROVED";
  if (typeof next === "function") next();
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
