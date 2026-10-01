const Testimonial = require("../models/testimonial");
const path = require("path");
const fs = require("fs");

const DEFAULT_SEED_TESTIMONIALS = [
  {
    name: "Robert Fox",
    role: "Customer",
    email: "robert.fox@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    review:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum pulvinar purus vehicula. The organic vegetables arrived super fresh and perfectly packed!",
    rating: 5,
    status: "APPROVED",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Dianne Russell",
    role: "Customer",
    email: "dianne.russell@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    review:
      "Duis gravida turpis dui, eget bibendum magna congue nec. Morbi cursus porttitor enim lobortis molestie. Best customer service and the delivery was right on time. Highly recommended for daily groceries!",
    rating: 5,
    status: "APPROVED",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Eleanor Pena",
    role: "Customer",
    email: "eleanor.pena@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    review:
      "Maecenas vulputate, odio in facilisis sodales, sem nisi fringilla leo, ut feugiat quam nisi id nulla. Quality of the organic fruits is unmatched. I won't buy anywhere else!",
    rating: 5,
    status: "APPROVED",
    isApproved: true,
    isFeatured: true
  }
];

// Helper: Seed initial testimonials if database has none
const ensureInitialTestimonials = async () => {
  const count = await Testimonial.countDocuments();
  if (count === 0) {
    try {
      await Testimonial.insertMany(DEFAULT_SEED_TESTIMONIALS);
    } catch (err) {
      console.error("Failed to seed initial testimonials:", err.message);
    }
  }
};

/**
 * GET /api/testimonials
 * Public route to fetch approved reviews for the frontend
 */
const getPublicTestimonials = async (req, res) => {
  try {
    await ensureInitialTestimonials();

    const testimonials = await Testimonial.find({
      status: "APPROVED",
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials
    });
  } catch (error) {
    console.error("GET PUBLIC TESTIMONIALS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer testimonials",
      testimonials: []
    });
  }
};

/**
 * POST /api/testimonials
 * Public route for customer feedback submission
 */
const submitFeedback = async (req, res) => {
  try {
    const { name, email, role, rating, review, avatarUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Your name is required"
      });
    }

    if (!review || !review.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review message cannot be empty"
      });
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));

    let avatarPath = "";
    if (req.file) {
      avatarPath = `/uploads/testimonials/${req.file.filename}`;
    } else if (avatarUrl && typeof avatarUrl === "string" && avatarUrl.trim()) {
      avatarPath = avatarUrl.trim();
    }

    const newTestimonial = await Testimonial.create({
      name: name.trim(),
      email: (email || "").trim().toLowerCase(),
      role: (role || "Customer").trim(),
      avatar: avatarPath,
      rating: numericRating,
      review: review.trim(),
      status: "PENDING",
      isApproved: false
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you for your valuable review! It has been submitted and will appear on our homepage once approved by our team.",
      testimonial: newTestimonial
    });
  } catch (error) {
    console.error("SUBMIT FEEDBACK ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback. Please try again."
    });
  }
};

/**
 * GET /api/testimonials/admin/all
 * Admin route to list all reviews with status filter, search, and statistics
 */
const getAllTestimonialsAdmin = async (req, res) => {
  try {
    await ensureInitialTestimonials();

    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "ALL") {
      filter.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), "i");
      filter.$or = [{ name: reg }, { review: reg }, { email: reg }, { role: reg }];
    }

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });

    const totalCount = await Testimonial.countDocuments();
    const pendingCount = await Testimonial.countDocuments({ status: "PENDING" });
    const approvedCount = await Testimonial.countDocuments({ status: "APPROVED" });
    const rejectedCount = await Testimonial.countDocuments({ status: "REJECTED" });

    return res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      count: testimonials.length,
      testimonials
    });
  } catch (error) {
    console.error("GET ADMIN TESTIMONIALS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving testimonials"
    });
  }
};

/**
 * PATCH /api/testimonials/:id/status
 * Admin route to approve, reject, or set to pending
 */
const updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isFeatured } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    if (status) {
      const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
      const upperStatus = status.toUpperCase();
      if (!validStatuses.includes(upperStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value. Must be PENDING, APPROVED, or REJECTED"
        });
      }
      testimonial.status = upperStatus;
      testimonial.isApproved = upperStatus === "APPROVED";
    }

    if (typeof isFeatured === "boolean") {
      testimonial.isFeatured = isFeatured;
    }

    await testimonial.save();

    return res.status(200).json({
      success: true,
      message: `Review status updated to ${testimonial.status}`,
      testimonial
    });
  } catch (error) {
    console.error("UPDATE TESTIMONIAL STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update review status"
    });
  }
};

/**
 * POST /api/testimonials/admin
 * Admin route to directly create an approved testimonial
 */
const createAdminTestimonial = async (req, res) => {
  try {
    const { name, email, role, rating, review, avatarUrl, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required"
      });
    }

    if (!review || !review.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review text is required"
      });
    }

    let avatarPath = "";
    if (req.file) {
      avatarPath = `/uploads/testimonials/${req.file.filename}`;
    } else if (avatarUrl && typeof avatarUrl === "string") {
      avatarPath = avatarUrl.trim();
    }

    const reviewStatus = (status || "APPROVED").toUpperCase();

    const newTestimonial = await Testimonial.create({
      name: name.trim(),
      email: (email || "").trim().toLowerCase(),
      role: (role || "Customer").trim(),
      avatar: avatarPath,
      rating: Number(rating) || 5,
      review: review.trim(),
      status: reviewStatus,
      isApproved: reviewStatus === "APPROVED"
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial: newTestimonial
    });
  } catch (error) {
    console.error("CREATE ADMIN TESTIMONIAL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create testimonial"
    });
  }
};

/**
 * DELETE /api/testimonials/:id
 * Admin route to delete a testimonial
 */
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    // Optionally cleanup uploaded avatar file if local
    if (deleted.avatar && deleted.avatar.startsWith("/uploads/testimonials/")) {
      const filePath = path.join(__dirname, "../../", deleted.avatar);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    console.error("DELETE TESTIMONIAL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete testimonial"
    });
  }
};

module.exports = {
  getPublicTestimonials,
  submitFeedback,
  getAllTestimonialsAdmin,
  updateTestimonialStatus,
  createAdminTestimonial,
  deleteTestimonial
};
