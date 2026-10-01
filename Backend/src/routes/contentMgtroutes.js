const express = require("express");
const router = express.Router();

const {
  getContent,
  createContent,
  updateContent
} = require("../controllers/contentMgtController");

const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

router.get(
  "/public/:type",
  getContent
);

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("contentManagement", "create"),
  createContent
);

router.get(
  "/:type",
  authMiddleware,
  permissionMiddleware("contentManagement", "read"),
  getContent
);

router.put(
  "/:type",
  authMiddleware,
  permissionMiddleware("contentManagement", "edit"),
  updateContent
);

module.exports = router;