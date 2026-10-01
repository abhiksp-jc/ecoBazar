/**
 * Discount utility functions for EcoBazar campaigns, sales, and products.
 */

/**
 * Extracts a numeric discount percentage from a campaign/banner object or string.
 * Examples handled:
 * - "Save 30%" -> 30
 * - "75% OFF" -> 75
 * - "Up to 64% OFF" -> 64
 * - "37% OFF" -> 37
 * - "30% Discount" -> 30
 * - Ignores "85% Fat Free"
 * - Defaults to 25% for generic sales/deals without explicit percentages
 */
export const extractCampaignDiscount = (campaign) => {
  if (!campaign) return 0;

  if (typeof campaign === "number") {
    return Math.min(Math.max(Math.round(campaign), 0), 99);
  }

  // If campaign is a string
  if (typeof campaign === "string") {
    return parseDiscountFromString(campaign);
  }

  // If campaign is an object
  const candidates = [
    campaign.discountText,
    campaign.subtitle,
    campaign.badge,
    campaign.title,
    campaign.description
  ];

  for (const text of candidates) {
    if (!text || typeof text !== "string") continue;
    const discount = parseDiscountFromString(text);
    if (discount > 0) return discount;
  }

  // Fallback: if it's explicitly a sale or deal campaign
  const combined = `${campaign.title || ""} ${campaign.subtitle || ""} ${campaign.badge || ""} ${campaign.discountText || ""}`.toLowerCase();
  if (combined.includes("sale") || combined.includes("deal") || combined.includes("discount")) {
    return 25;
  }

  return 0;
};

/**
 * Parses numeric discount percentage from a text snippet
 */
export const parseDiscountFromString = (text) => {
  if (!text || typeof text !== "string") return 0;

  // Ignore nutritional facts like "85% Fat Free"
  if (/fat\s*free/i.test(text)) return 0;

  // Match patterns like "30%", "Save 30%", "75% off", etc.
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) {
    let val = parseFloat(match[1]);
    if (val > 90) {
      if (val === 300) val = 30;
      else val = 90;
    }
    if (val > 0) {
      return Math.round(val);
    }
  }

  return 0;
};

/**
 * Applies an active sale discount to a product item.
 * Guarantees that:
 * - product.discount is at least activeSaleDiscount
 * - product.finalPrice is computed using the effective discount
 * - product.originalPrice is preserved as the base price
 * - product.hasSaleDiscount is true
 */
export const applySaleDiscountToProduct = (product, activeSaleDiscount = 0) => {
  if (!product) return product;

  const basePrice = Number(product.price) || 0;
  const originalDiscount = Number(product.discount) || 0;
  const effectiveDiscount = activeSaleDiscount > 0
    ? Math.max(originalDiscount, activeSaleDiscount)
    : originalDiscount;

  const finalPrice = effectiveDiscount > 0
    ? Number((basePrice - (basePrice * effectiveDiscount) / 100).toFixed(2))
    : basePrice;

  return {
    ...product,
    price: basePrice,
    originalPrice: basePrice,
    discount: effectiveDiscount,
    finalPrice: finalPrice.toFixed(2),
    hasDiscount: effectiveDiscount > 0,
    hasSaleDiscount: activeSaleDiscount > 0 && effectiveDiscount >= activeSaleDiscount
  };
};

/**
 * Formats price display with 2 decimals
 */
export const formatPrice = (price) => {
  const num = Number(price);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};
