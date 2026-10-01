const fs = require("fs");
const path = require("path");

const defaultBanners = [
  {
    title: "Fresh & Healthy Organic Food",
    subtitle: "Sale up to",
    description: "Free shipping on all your order.",
    badge: "Sale up to",
    discountText: "30% OFF",
    buttonText: "Shop now",
    buttonLink: "/shop",
    image: "/hero-farmer.jpg",
    position: "hero_main",
    isActive: true,
    displayOrder: 1
  },
  {
    title: "SUMMER SALE",
    subtitle: "75% OFF",
    description: "Only Fruit & Vegetable",
    badge: "SUMMER SALE",
    discountText: "75% OFF",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/produce-bag.jpg",
    position: "hero_top_right",
    isActive: true,
    displayOrder: 2
  },
  {
    title: "Special Products Deal of the Month",
    subtitle: "BEST DEAL",
    description: "Special Products Deal of the Month",
    badge: "BEST DEAL",
    discountText: "Deal of Month",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/leaves-pattern.jpg",
    position: "hero_bottom_right",
    isActive: true,
    displayOrder: 3
  },
  {
    title: "Sale of the Month",
    subtitle: "Best Deals",
    description: "Everyday fresh & clean vegetables",
    badge: "BEST DEALS",
    discountText: "Save 30%",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/saleimg.jpg",
    position: "promo_middle",
    isActive: true,
    displayOrder: 4
  },
  {
    title: "Low-Fat Meat",
    subtitle: "85% Fat Free",
    description: "Started at $79.99",
    badge: "85% FAT FREE",
    discountText: "Started at $79.99",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/maingreen.jpg",
    position: "promo_middle",
    isActive: true,
    displayOrder: 5
  },
  {
    title: "Fresh Fruit",
    subtitle: "100% Fresh",
    description: "Healthy breakfast options",
    badge: "100% FRESH",
    discountText: "Up to 64% OFF",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/saleimg.jpg",
    position: "promo_middle",
    isActive: true,
    displayOrder: 6
  },
  {
    title: "Special Products Deal of the Month",
    subtitle: "SUMMER SALE",
    description: "Free on all your order, 100% Fresh & Organic Food",
    badge: "SUMMER SALE",
    discountText: "37% OFF",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/saleimg.jpg",
    position: "deal_banner",
    isActive: true,
    displayOrder: 7
  },
  {
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
  }
];

const copyUploadedImageIfAvailable = () => {
  try {
    const srcImg = "/home/jc-ad1/.gemini/antigravity-ide/brain/503d4db5-62ac-4c8d-86de-33172a86ffc4/.user_uploaded/media_1790748100557.png";
    if (fs.existsSync(srcImg)) {
      const destBackend = path.join(__dirname, "../../uploads/banners/summer-sale-banner.png");
      const destFrontend = path.join(__dirname, "../../../frontend/public/summer-sale-banner.png");
      const destAdmin = path.join(__dirname, "../../../admin/public/summer-sale-banner.png");

      const backendDir = path.dirname(destBackend);
      if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir, { recursive: true });
      fs.copyFileSync(srcImg, destBackend);

      const frontendDir = path.dirname(destFrontend);
      if (fs.existsSync(frontendDir)) fs.copyFileSync(srcImg, destFrontend);

      const adminDir = path.dirname(destAdmin);
      if (fs.existsSync(adminDir)) fs.copyFileSync(srcImg, destAdmin);
    }
  } catch (err) {
    console.error("Banner image copy helper error:", err.message);
  }
};

module.exports = {
  defaultBanners,
  copyUploadedImageIfAvailable
};
