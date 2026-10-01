const API_BASE = import.meta.env?.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/banners`
  : "http://localhost:5000/api/banners";

export const bannerService = {
  /**
   * Fetch active banners from the backend API.
   * Can optionally filter by position ('hero_main', 'hero_top_right', 'hero_bottom_right', 'promo_middle', 'deal_banner').
   * The backend route GET /api/banners automatically filters for isActive=true for customer requests.
   */
  async getActiveBanners(position = null) {
    try {
      const url = position
        ? `${API_BASE}?position=${encodeURIComponent(position)}`
        : API_BASE;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch banners: ${res.statusText}`);
      }

      const data = await res.json();
      return data.banners || [];
    } catch (err) {
      console.error("BannerService fetch error:", err.message);
      return [];
    }
  },

  /**
   * Fetch a single banner by ID (for campaign shop targeting)
   */
  async getBannerById(id) {
    if (!id) return null;
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.banner || null;
    } catch (err) {
      console.error("Error fetching banner by ID:", err.message);
      return null;
    }
  },

  /**
   * Computes the accurate customer link for a banner according to its campaign and category configuration.
   */
  getBannerShopLink(banner) {
    if (!banner) return "/shop";
    // If explicit custom external or non-shop path, use it
    if (banner.buttonLink && !banner.buttonLink.startsWith("/shop")) {
      return banner.buttonLink;
    }

    const params = new URLSearchParams();
    if (banner._id) {
      params.set("campaign", banner._id);
    }

    const catId = typeof banner.category === "object" ? banner.category?._id : banner.category;
    if (catId) {
      params.set("category", catId);
    }

    if (banner.productFilterType === "discounted") {
      params.set("deals", "true");
    }

    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }
};

export default bannerService;
