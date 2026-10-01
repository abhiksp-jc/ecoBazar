const express = require("express");
const router = express.Router();

const {
  getFAQs,
  getActiveFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require("../controllers/faqContoller");

const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("faqs", "read"),
  getFAQs
);

router.get(
  "/active",
  getActiveFAQs
);

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("faqs", "create"),
  createFAQ
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("faqs", "edit"),
  updateFAQ
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("faqs", "delete"),
  deleteFAQ
);

module.exports = router;