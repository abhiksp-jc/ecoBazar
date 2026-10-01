const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner
} = require("../controllers/bannerController");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads/banners");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      `banner-${Date.now()}-${Math.round(Math.random() * 1e9)}` +
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
    cb(new Error("Only image files (JPG, PNG, WEBP) are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/", getBanners);
router.get("/active", getBanners);
router.get("/:id", getBannerById);
router.post("/", upload.single("image"), createBanner);
router.put("/:id", upload.single("image"), updateBanner);
router.patch("/:id/status", toggleBannerStatus);
router.delete("/:id", deleteBanner);

module.exports = router;
