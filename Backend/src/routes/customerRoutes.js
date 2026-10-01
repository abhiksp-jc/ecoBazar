const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  checkUserExists,
  registerCustomer,
  loginCustomer,
  createOrGetCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer,
  getCurrentProfile,
  updateCustomerProfile,
  updateCustomerBillingAddress,
  changeCustomerPassword,
  uploadProfileImage
} = require("../controllers/customerController");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

const customerUploadPath = path.join(__dirname, "../../uploads/customers");
if (!fs.existsSync(customerUploadPath)) {
  fs.mkdirSync(customerUploadPath, { recursive: true });
}

const customerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, customerUploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `customer-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const uploadCustomer = multer({
  storage: customerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const allowAdminOrOpenCustomers = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authMiddleware(req, res, next);
  }
  if (typeof next === "function") {
    return next();
  }
};

router.get("/check", checkUserExists);
router.post("/check", checkUserExists);
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/", createOrGetCustomer);

// Account Settings endpoints
router.get("/profile", getCurrentProfile);
router.put("/profile", updateCustomerProfile);
router.put("/address", updateCustomerBillingAddress);
router.put("/change-password", changeCustomerPassword);
router.post("/upload-image", uploadCustomer.single("profileImage"), uploadProfileImage);

router.get("/", allowAdminOrOpenCustomers, getCustomers);
router.get("/:id", allowAdminOrOpenCustomers, getCustomerById);
router.delete("/:id", allowAdminOrOpenCustomers, deleteCustomer);

module.exports = router;
