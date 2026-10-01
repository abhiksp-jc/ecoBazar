const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getPublicTestimonials,
  submitFeedback,
  getAllTestimonialsAdmin,
  updateTestimonialStatus,
  createAdminTestimonial,
  deleteTestimonial
} = require("../controllers/testimonialController");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads/testimonials");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for avatar upload"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});

// Public endpoints
router.get("/", getPublicTestimonials);
router.post("/", upload.single("avatar"), submitFeedback);

// Admin endpoints
router.get("/admin/all", getAllTestimonialsAdmin);
router.post("/admin", upload.single("avatar"), createAdminTestimonial);
router.patch("/:id/status", updateTestimonialStatus);
router.put("/:id/status", updateTestimonialStatus);
router.delete("/:id", deleteTestimonial);

module.exports = router;
