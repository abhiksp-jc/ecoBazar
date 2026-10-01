const ContentManagement = require("../models/terms");

const getContent = async (req, res) => {
  try {
    const { type } = req.params;

    if (!["terms", "privacy", "about"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type"
      });
    }

    const content = await ContentManagement.findOne({ type });

    if (!content) {
      return res.status(200).json({
        success: true,
        content: { type, content: "" }
      });
    }

    res.status(200).json({
      success: true,
      content
    });
  } catch (error) {
    console.error("GET CONTENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get content"
    });
  }
};

const createContent = async (req, res) => {
  try {
    const { type, content } = req.body;

    if (!["terms", "privacy", "about"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type"
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    const existingContent = await ContentManagement.findOne({ type });

    if (existingContent) {
      return res.status(409).json({
        success: false,
        message: `${type} content already exists`
      });
    }

    const newContent = await ContentManagement.create({
      type,
      content
    });

    res.status(201).json({
      success: true,
      message: `${type === "terms" ? "Terms & Conditions" : "Privacy Policy"} created successfully`,
      content: newContent
    });
  } catch (error) {
    console.error("CREATE CONTENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create content"
    });
  }
};

const updateContent = async (req, res) => {
  try {
    const { type } = req.params;
    const { content } = req.body;

    if (!["terms", "privacy", "about"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type"
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    const updatedContent = await ContentManagement.findOneAndUpdate(
      { type },
      { type, content },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: `${type === "terms" ? "Terms & Conditions" : "Privacy Policy"} updated successfully`,
      content: updatedContent
    });
  } catch (error) {
    console.error("UPDATE CONTENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update content"
    });
  }
};

module.exports = {
  getContent,
  createContent,
  updateContent
};
