const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createCategory,
  createCategoriesBulk,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("categories", "create"),
  upload.single("image"),
  createCategory
);

router.post(
  "/bulk",
  authMiddleware,
  permissionMiddleware("categories", "create"),
  upload.any(),
  createCategoriesBulk
);

router.get(
  "/",
  getCategories
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("categories", "edit"),
  upload.single("image"),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("categories", "delete"),
  deleteCategory
);

module.exports = router;