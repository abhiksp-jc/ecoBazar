const mongoose = require("mongoose");

const contentManagementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["terms", "privacy", "about"],
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ContentManagement",
  contentManagementSchema
);