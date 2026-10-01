import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/login") &&
      !error.config?.url?.includes("/forgot-password") &&
      !error.config?.url?.includes("/reset-password")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const res = await API.post("/admin/login", { email: email.trim(), password });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await API.post("/admin/forgot-password", { email: email.trim() });
  return res.data;
};

export const verifyResetOtp = async (token, otp) => {
  const res = await API.post(`/admin/verify-reset-otp/${token}`, { otp });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await API.post(`/admin/reset-password/${token}`, { password });
  return res.data;
};

export const getToken = () => localStorage.getItem("token");

export const getAdmin = () => {
  const admin = localStorage.getItem("admin");
  if (!admin) return null;
  try {
    const parsed = JSON.parse(admin);
    if (!parsed.name || parsed.name === "Admin") {
      parsed.name = "Abhi";
      localStorage.setItem("admin", JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
};

export const getStaff = async () => {
  const res = await API.get("/admin/staff");
  return res.data;
};

export const createStaff = async (staffData) => {
  const res = await API.post("/admin/staff", staffData);
  return res.data;
};

export const updateStaff = async (id, staffData) => {
  const res = await API.put(`/admin/staff/${id}`, staffData);
  return res.data;
};

export const deleteStaff = async (id) => {
  const res = await API.delete(`/admin/staff/${id}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};

export const createCategory = async (categoryData) => {
  const formData = new FormData();
  formData.append("name", categoryData.name);
  formData.append("description", categoryData.description || "");
  if (categoryData.image instanceof File) {
    formData.append("image", categoryData.image);
  }
  const res = await API.post("/categories", formData);
  return res.data;
};

export const createCategoriesBulk = async (categories) => {
  const formData = new FormData();
  const list = categories.map((c) => ({
    name: c.name.trim(),
    description: c.description?.trim() || ""
  }));
  formData.append("categories", JSON.stringify(list));
  categories.forEach((category, idx) => {
    if (category.image instanceof File) {
      formData.append(`image_${idx}`, category.image);
    }
  });
  const res = await API.post("/categories/bulk", formData);
  return res.data;
};

export const updateCategory = async (id, categoryData) => {
  const formData = new FormData();
  formData.append("name", categoryData.name);
  formData.append("description", categoryData.description || "");
  if (categoryData.image instanceof File) {
    formData.append("image", categoryData.image);
  }
  const res = await API.put(`/categories/${id}`, formData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await API.delete(`/categories/${id}`);
  return res.data;
};

export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const getProduct = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("category", productData.category);
  formData.append("description", productData.description || "");
  formData.append("price", productData.price);
  formData.append("discount", productData.discount || 0);
  formData.append("stock", productData.stock);
  formData.append("unit", productData.unit);
  formData.append("status", productData.status || "ACTIVE");

  if (productData.images?.length) {
    productData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const res = await API.post("/products", formData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  if (productData.name !== undefined) formData.append("name", productData.name);
  if (productData.category !== undefined) formData.append("category", productData.category);
  if (productData.description !== undefined) formData.append("description", productData.description);
  if (productData.price !== undefined) formData.append("price", productData.price);
  if (productData.discount !== undefined) formData.append("discount", productData.discount);
  if (productData.stock !== undefined) formData.append("stock", productData.stock);
  if (productData.unit !== undefined) formData.append("unit", productData.unit);
  if (productData.status !== undefined) formData.append("status", productData.status);

  if (productData.images?.length) {
    productData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const res = await API.put(`/products/${id}`, formData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

export const getCustomers = async (search = "") => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await API.get(`/customers${query}`);
  return res.data;
};

export const getCustomer = async (id) => {
  const res = await API.get(`/customers/${id}`);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await API.delete(`/customers/${id}`);
  return res.data;
};

export const getOrders = async (status = "", search = "") => {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await API.get(`/orders${query}`);
  return res.data;
};

export const getOrder = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id, data) => {
  const res = await API.put(`/orders/${id}/status`, data);
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await API.get("/orders/stats/dashboard");
  return res.data;
};

export const getBanners = async (all = true) => {
  const res = await API.get(`/banners${all ? "?all=true" : ""}`);
  return res.data;
};

export const createBanner = async (bannerData) => {
  let payload = bannerData;
  let headers = {};

  if (bannerData instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const res = await API.post("/banners", payload, { headers });
  return res.data;
};

export const updateBanner = async (id, bannerData) => {
  let payload = bannerData;
  let headers = {};

  if (bannerData instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const res = await API.put(`/banners/${id}`, payload, { headers });
  return res.data;
};

export const toggleBannerStatus = async (id) => {
  const res = await API.patch(`/banners/${id}/status`);
  return res.data;
};

export const deleteBanner = async (id) => {
  const res = await API.delete(`/banners/${id}`);
  return res.data;
};

export const getContactMessages = async (status = "ALL", search = "") => {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await API.get(`/contact${query}`);
  return res.data;
};

export const updateContactMessageStatus = async (id, status) => {
  const res = await API.patch(`/contact/${id}/status`, { status });
  return res.data;
};

export const deleteContactMessage = async (id) => {
  const res = await API.delete(`/contact/${id}`);
  return res.data;
};

export const getAdminProfile = async () => {
  const res = await API.get("/admin/profile");
  return res.data;
};

export const updateAdminProfile = async (profileData) => {
  const res = await API.put("/admin/profile", profileData);
  return res.data;
};

export const getAdminTestimonials = async (status = "ALL", search = "") => {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await API.get(`/testimonials/admin/all${query}`);
  return res.data;
};

export const updateTestimonialStatus = async (id, status, isFeatured) => {
  const payload = { status };
  if (typeof isFeatured === "boolean") payload.isFeatured = isFeatured;
  const res = await API.patch(`/testimonials/${id}/status`, payload);
  return res.data;
};

export const deleteTestimonial = async (id) => {
  const res = await API.delete(`/testimonials/${id}`);
  return res.data;
};

export const createAdminTestimonial = async (testimonialData) => {
  let payload = testimonialData;
  let headers = {};

  if (testimonialData instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const res = await API.post("/testimonials/admin", payload, { headers });
  return res.data;
};

// ========================
// COUPON MANAGEMENT APIS
// ========================
export const getAdminCoupons = async (status = "ALL", search = "") => {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (search) params.append("search", search);
  const queryStr = params.toString() ? `?${params.toString()}` : "";
  const res = await API.get(`/coupons/admin${queryStr}`);
  return res.data;
};

export const createCoupon = async (couponData) => {
  const res = await API.post("/coupons/admin", couponData);
  return res.data;
};

export const updateCoupon = async (id, couponData) => {
  const res = await API.put(`/coupons/admin/${id}`, couponData);
  return res.data;
};

export const toggleCouponStatus = async (id) => {
  const res = await API.patch(`/coupons/admin/${id}/status`);
  return res.data;
};

export const deleteCoupon = async (id) => {
  const res = await API.delete(`/coupons/admin/${id}`);
  return res.data;
};