const FAQ = require("../models/faq");

const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get FAQs"
    });
  }
};

const getActiveFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ status: "active" }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get active FAQs"
    });
  }
};

const createFAQ = async (req, res) => {
  try {
    const { question, answer, status } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required"
      });
    }

    const faq = await FAQ.create({
      question,
      answer,
      status: status || "active"
    });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create FAQ"
    });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const { question, answer, status } = req.body;

    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found"
      });
    }

    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (status !== undefined) faq.status = status;

    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update FAQ"
    });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ"
    });
  }
};

module.exports = {
  getFAQs,
  getActiveFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};