const API_BASE = import.meta.env?.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/products`
  : "http://localhost:5000/api/products";

export const productService = {
  /**
   * Fetch products with optional search query, category, sort, etc.
   * Supports AbortSignal for debounced cancellation.
   */
  async getProducts(params = {}, signal = null) {
    try {
      const queryParams = new URLSearchParams();
      if (params.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      if (params.category) {
        queryParams.append("category", params.category);
      }
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.sort) {
        queryParams.append("sort", params.sort);
      }
      if (params.limit) {
        queryParams.append("limit", params.limit);
      }

      const queryString = queryParams.toString();
      const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;

      const res = await fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      }
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      if (err.name === "AbortError") {
        // Request cancelled by debounce
        return null;
      }
      console.error("ProductService fetch error:", err);
      throw err;
    }
  }
};

export default productService;
