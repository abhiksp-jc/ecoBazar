const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  checkoutProducts
} = require("../controllers/productController");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const uploadDir = path.join(
  __dirname,
  "../../uploads/products"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("products", "create"),
  upload.array("images", 5),
  createProduct
);

router.get(
  "/",
  getProducts
);

router.post(
  "/checkout",
  checkoutProducts
);

router.get(
  "/:id",
  getProduct
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("products", "edit"),
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("products", "delete"),
  deleteProduct
);

module.exports = router;