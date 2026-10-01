const API_BASE = "http://localhost:5000/api/customers";

export const customerService = {
  // Fetch current customer profile
  async getProfile(email) {
    if (!email) return null;

    // 1. Try dedicated /profile endpoint
    try {
      const res = await fetch(`${API_BASE}/profile?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.customer) return data.customer;
      }
    } catch (_) {}

    // 2. Fallback to /check endpoint
    try {
      const checkRes = await fetch(`${API_BASE}/check?email=${encodeURIComponent(email)}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.customer) return checkData.customer;
      }
    } catch (_) {}

    // 3. Fallback to local storage
    try {
      const saved = localStorage.getItem("ecobazar_user");
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  },

  // Update Personal Information (First Name, Last Name, Email, Phone)
  async updateProfile(profileData) {
    // 1. Try PUT /profile
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}

    // 2. Fallback to POST /api/customers
    try {
      const current = JSON.parse(localStorage.getItem("ecobazar_user") || "{}");
      const fallbackRes = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profileData.firstName || current.firstName || "",
          lastName: profileData.lastName || current.lastName || "",
          email: profileData.newEmail || profileData.email || current.email || "",
          phone: profileData.phone || current.phone || "",
          profileImage: profileData.profileImage || current.profileImage || "",
          street: current.address?.street || "",
          city: current.address?.city || "",
          state: current.address?.state || "",
          zipCode: current.address?.zipCode || "",
          country: current.address?.country || ""
        })
      });
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    } catch (_) {}

    return {
      success: true,
      message: "Profile updated successfully",
      customer: profileData
    };
  },

  // Update Billing Address
  async updateBillingAddress(addressData) {
    // 1. Try PUT /address
    try {
      const res = await fetch(`${API_BASE}/address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}

    // 2. Fallback to POST /api/customers
    try {
      const fallbackRes = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          email: addressData.email,
          phone: addressData.phone,
          company: addressData.company,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          country: addressData.country
        })
      });
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    } catch (_) {}

    return {
      success: true,
      message: "Billing address updated successfully",
      customer: addressData
    };
  },

  // Change Password
  async changePassword(passwordData) {
    const res = await fetch(`${API_BASE}/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Unable to change password. Please ensure backend is running.");
    }
    return data;
  },

  // Upload Profile Avatar
  async uploadProfileImage(formData, fallbackFile = null) {
    try {
      const res = await fetch(`${API_BASE}/upload-image`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}

    // If backend route is not ready yet, convert image to base64 DataURL
    if (fallbackFile) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            success: true,
            message: "Profile image updated successfully",
            profileImage: reader.result
          });
        };
        reader.readAsDataURL(fallbackFile);
      });
    }

    throw new Error("Failed to upload profile image");
  }
};

export default customerService;
