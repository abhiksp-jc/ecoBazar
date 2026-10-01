const express = require("express");
const {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateMessageStatus,
  deleteContactMessage
} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", getContactMessages);
router.get("/:id", getContactMessageById);
router.patch("/:id/status", updateMessageStatus);
router.put("/:id/status", updateMessageStatus);
router.delete("/:id", deleteContactMessage);

module.exports = router;
