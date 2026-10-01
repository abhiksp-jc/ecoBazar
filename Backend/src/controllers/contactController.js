const Contact = require("../models/contact");

const createContactMessage = async (req, res) => {
  try {
    const { name, firstName, lastName, email, phone, subject, message } = req.body;

    const fullName = (name || `${firstName || ""} ${lastName || ""}`).trim();

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Your name is required"
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content cannot be empty"
      });
    }

    const newContact = await Contact.create({
      name: fullName,
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      status: "UNREAD"
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Your message has been sent successfully.",
      contact: newContact
    });
  } catch (error) {
    console.error("CREATE CONTACT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later."
    });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "ALL") {
      filter.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), "i");
      filter.$or = [{ name: reg }, { email: reg }, { subject: reg }, { message: reg }];
    }

    const messages = await Contact.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error("GET CONTACT MESSAGES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving contact messages"
    });
  }
};

const getContactMessageById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      contact
    });
  } catch (error) {
    console.error("GET CONTACT MESSAGE BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    if (status) {
      contact.status = status.toUpperCase() === "READ" ? "READ" : "UNREAD";
    } else {
      contact.status = contact.status === "READ" ? "UNREAD" : "READ";
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: `Message marked as ${contact.status}`,
      contact
    });
  } catch (error) {
    console.error("UPDATE CONTACT STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status"
    });
  }
};

const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully"
    });
  } catch (error) {
    console.error("DELETE CONTACT MESSAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message"
    });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateMessageStatus,
  deleteContactMessage
};
