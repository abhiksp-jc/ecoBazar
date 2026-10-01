const API_BASE = "http://localhost:5000/api/coupons";

export const couponService = {
  // Validate and apply coupon in customer cart
  async validateCoupon(code, cartTotal) {
    if (!code || !code.trim()) {
      throw new Error("Please enter a coupon code.");
    }

    const res = await fetch(`${API_BASE}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        cartTotal: Number(cartTotal) || 0
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Invalid coupon code.");
    }

    return data;
  },

  // Get active public coupons to show to customers
  async getActiveCoupons() {
    try {
      const res = await fetch(`${API_BASE}/active`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.coupons || [];
    } catch (err) {
      console.warn("Could not fetch active coupons:", err);
      return [];
    }
  }
};

export default couponService;
