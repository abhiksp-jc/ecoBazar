const Banner = require("../models/banner");
const fs = require("fs");
const path = require("path");
const { defaultBanners, copyUploadedImageIfAvailable } = require("../config/defaultBanners");

const seedDefaultBannersIfEmpty = async () => {
  try {
    copyUploadedImageIfAvailable();

    const count = await Banner.countDocuments();
    if (count === 0) {
      await Banner.insertMany(defaultBanners);
      console.log("Seeded default Ecobazar banners into MongoDB");
    } else {
      await Banner.updateMany(
        { position: "hero_main", image: { $in: ["/maingreen.jpg", "/Bannar Big.png", ""] } },
        { $set: { image: "/hero-farmer.jpg" } }
      );
      await Banner.updateMany(
        { position: "hero_top_right", image: { $in: ["/saleimg.jpg", ""] } },
        { $set: { image: "/produce-bag.jpg" } }
      );
      await Banner.updateMany(
        { position: "hero_bottom_right", image: { $in: ["/leaves.jpg", ""] } },
        { $set: { image: "/leaves-pattern.jpg" } }
      );

      // Ensure Summer Sale banner exists
      const existingSummerSale = await Banner.findOne({ position: "summer_sale" });
      if (!existingSummerSale) {
        await Banner.create({
          title: "37% OFF",
          subtitle: "SUMMER SALE",
          description: "Free on all your order, Free Shipping and 30 days money-back guarantee",
          badge: "SUMMER SALE",
          discountText: "37% OFF",
          buttonText: "Shop Now",
          buttonLink: "/shop",
          image: "/uploads/banners/summer-sale-banner.png",
          position: "summer_sale",
          isActive: true,
          displayOrder: 8
        });
        console.log("Created default Summer Sale banner in MongoDB");
      }
    }
  } catch (err) {
    console.error("Banner seed error:", err.message);
  }
};

const getBanners = async (req, res) => {
  try {
    await seedDefaultBannersIfEmpty();

    const { position, all } = req.query;
    const filter = {};

    // If 'all' is not explicitly 'true', only return active banners (for customer homepage)
    if (all !== "true") {
      filter.isActive = true;
    }

    if (position) {
      filter.position = position;
    }

    const banners = await Banner.find(filter)
      .populate("category", "name slug")
      .populate("selectedProducts", "name price discount images category stock status")
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners
    });
  } catch (error) {
    console.error("GET BANNERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners"
    });
  }
};

const mongoose = require("mongoose");

const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    const banner = await Banner.findById(id)
      .populate("category", "name slug")
      .populate("selectedProducts", "name price discount images category stock status");
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    res.status(200).json({
      success: true,
      banner
    });
  } catch (error) {
    console.error("GET BANNER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const createBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      badge,
      discountText,
      buttonText,
      buttonLink,
      position,
      isActive,
      displayOrder,
      imageUrl,
      category,
      productFilterType,
      selectedProducts
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Banner title is required"
      });
    }

    let image = imageUrl ? imageUrl.trim() : "";
    if (req.file) {
      image = `/uploads/banners/${req.file.filename}`;
    }

    let parsedCategory = null;
    if (category && category !== "null" && category !== "undefined" && category !== "") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        parsedCategory = category;
      }
    }

    let parsedSelectedProducts = [];
    if (selectedProducts) {
      if (Array.isArray(selectedProducts)) {
        parsedSelectedProducts = selectedProducts.filter((p) => mongoose.Types.ObjectId.isValid(p));
      } else if (typeof selectedProducts === "string") {
        try {
          const parsed = JSON.parse(selectedProducts);
          if (Array.isArray(parsed)) {
            parsedSelectedProducts = parsed.filter((p) => mongoose.Types.ObjectId.isValid(p));
          } else if (mongoose.Types.ObjectId.isValid(selectedProducts)) {
            parsedSelectedProducts = [selectedProducts];
          }
        } catch {
          if (mongoose.Types.ObjectId.isValid(selectedProducts)) {
            parsedSelectedProducts = [selectedProducts];
          }
        }
      }
    }

    const banner = await Banner.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      description: description ? description.trim() : "",
      badge: badge ? badge.trim() : "",
      discountText: discountText ? discountText.trim() : "",
      buttonText: buttonText ? buttonText.trim() : "Shop Now",
      buttonLink: buttonLink ? buttonLink.trim() : "/shop",
      image,
      position: position || "hero_main",
      isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
      displayOrder: Number(displayOrder) || 0,
      category: parsedCategory,
      productFilterType: productFilterType || "all",
      selectedProducts: parsedSelectedProducts
    });

    await banner.populate("category", "name slug");
    await banner.populate("selectedProducts", "name price discount images category stock status");

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner
    });
  } catch (error) {
    console.error("CREATE BANNER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create banner"
    });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    const {
      title,
      subtitle,
      description,
      badge,
      discountText,
      buttonText,
      buttonLink,
      position,
      isActive,
      displayOrder,
      imageUrl,
      category,
      productFilterType,
      selectedProducts
    } = req.body;

    if (title !== undefined) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (description !== undefined) banner.description = description.trim();
    if (badge !== undefined) banner.badge = badge.trim();
    if (discountText !== undefined) banner.discountText = discountText.trim();
    if (buttonText !== undefined) banner.buttonText = buttonText.trim();
    if (buttonLink !== undefined) banner.buttonLink = buttonLink.trim();
    if (position !== undefined) banner.position = position;
    if (displayOrder !== undefined) banner.displayOrder = Number(displayOrder);
    if (isActive !== undefined) {
      banner.isActive = isActive === "true" || isActive === true;
    }

    if (category !== undefined) {
      banner.category =
        category && category !== "null" && category !== "" && mongoose.Types.ObjectId.isValid(category)
          ? category
          : null;
    }
    if (productFilterType !== undefined) {
      banner.productFilterType = productFilterType;
    }
    if (selectedProducts !== undefined) {
      let parsed = [];
      if (Array.isArray(selectedProducts)) {
        parsed = selectedProducts.filter((p) => mongoose.Types.ObjectId.isValid(p));
      } else if (typeof selectedProducts === "string") {
        try {
          const arr = JSON.parse(selectedProducts);
          if (Array.isArray(arr)) {
            parsed = arr.filter((p) => mongoose.Types.ObjectId.isValid(p));
          } else if (mongoose.Types.ObjectId.isValid(selectedProducts)) {
            parsed = [selectedProducts];
          }
        } catch {
          if (mongoose.Types.ObjectId.isValid(selectedProducts)) {
            parsed = [selectedProducts];
          }
        }
      }
      banner.selectedProducts = parsed;
    }

    if (req.file) {
      // If previous image was in uploads/banners, we could clean up
      banner.image = `/uploads/banners/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      banner.image = imageUrl.trim();
    }

    await banner.save();
    await banner.populate("category", "name slug");
    await banner.populate("selectedProducts", "name price discount images category stock status");

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner
    });
  } catch (error) {
    console.error("UPDATE BANNER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update banner"
    });
  }
};

const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
      banner
    });
  } catch (error) {
    console.error("TOGGLE BANNER STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update banner status"
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    if (banner.image && banner.image.startsWith("/uploads/banners/")) {
      const imagePath = path.join(__dirname, "../../", banner.image.replace(/^\//, ""));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Banner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully"
    });
  } catch (error) {
    console.error("DELETE BANNER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete banner"
    });
  }
};

module.exports = {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner
};
