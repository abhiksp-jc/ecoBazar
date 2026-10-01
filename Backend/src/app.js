const express = require("express");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const contentMgtRoutes = require("./routes/contentMgtroutes");
const faqRoutes = require("./routes/faqRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const contactRoutes = require("./routes/contactRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const couponRoutes = require("./routes/couponRoutes");

const app = express();

const allowedOrigins = [
  process.env.ADMIN_FRONTEND_URL,
  process.env.FRONTEND_URL,
  process.env.USER_FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/content-management", contentMgtRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/coupons", couponRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Ecobazar API is running"
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  }
  next();
});

app.use((error, req, res, next) => {
  if (error.name === "MulterError") {
    return res.status(400).json({
      message: `Image upload failed: ${error.message}`
    });
  }

  if (error.message?.includes("images are allowed") || error.message?.includes("Only JPG")) {
    return res.status(400).json({
      message: error.message
    });
  }

  console.error(error);

  res.status(500).json({
    message: "Internal server error"
  });
});

module.exports = app;