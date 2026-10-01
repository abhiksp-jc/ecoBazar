/**
 * Centralized Customer Session & Auth State Management
 * Ensures total data isolation between different customer accounts.
 */

export const clearCustomerSession = () => {
  try {
    localStorage.removeItem("ecobazar_user");
    localStorage.removeItem("ecobazar_token");
    localStorage.removeItem("ecobazar_cart");
    localStorage.removeItem("ecobazar_coupon");
    localStorage.removeItem("ecobazar_wishlist");
    localStorage.removeItem("ecobazar_orders");
    
    // Notify all active React contexts (Cart, Wishlist, Headers, Profile) to reset in-memory state
    window.dispatchEvent(new CustomEvent("ecobazar_session_cleared"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Error clearing customer session:", err);
  }
};

export const startCustomerSession = (customer, token = null) => {
  try {
    // If a different user was previously logged in, wipe previous user's cart, wishlist, and orders
    const prevUser = getStoredCustomer();
    if (prevUser && prevUser.email && prevUser.email.toLowerCase() !== customer?.email?.toLowerCase()) {
      clearCustomerSession();
    }

    if (customer) {
      localStorage.setItem("ecobazar_user", JSON.stringify(customer));
    }
    if (token) {
      localStorage.setItem("ecobazar_token", token);
    }
    
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Error starting customer session:", err);
  }
};

export const getStoredCustomer = () => {
  try {
    const raw = localStorage.getItem("ecobazar_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
