const API_BASE = "http://localhost:5000/api/orders";

export const orderService = {
  // Fetch orders for a specific customer email
  async getCustomerOrders(email) {
    if (!email) return [];
    try {
      const res = await fetch(`${API_BASE}/customer-orders?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to fetch customer orders");
      const data = await res.json();
      return data.orders || [];
    } catch (err) {
      console.warn("Could not fetch customer orders from API:", err.message);
      // Fallback to local storage ONLY if matching this specific customer's email
      try {
        const local = JSON.parse(localStorage.getItem("ecobazar_orders") || "[]");
        return local.filter(
          (o) => (o.customerDetails?.email || "").trim().toLowerCase() === email.trim().toLowerCase()
        );
      } catch {
        return [];
      }
    }
  },

  // Fetch a single order by ID or orderNumber
  async getOrderById(orderId, email = null) {
    if (!orderId) throw new Error("Order ID is required");
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    const res = await fetch(`${API_BASE}/${encodeURIComponent(orderId)}${query}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.message || "Failed to load order details");
      error.status = res.status;
      throw error;
    }

    const data = await res.json();
    return data.order;
  }
};

export default orderService;
