import React, { createContext, useContext, useState, useEffect } from "react";
import { showToast as showSweetToast } from "../utils/sweetalert";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("ecobazar_wishlist");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Migrate array of string IDs to empty if needed, or handle array of product objects
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && typeof item === "object" && item._id);
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleSessionCleared = () => {
      setWishlistItems([]);
    };
    window.addEventListener("ecobazar_session_cleared", handleSessionCleared);
    return () => window.removeEventListener("ecobazar_session_cleared", handleSessionCleared);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ecobazar_wishlist", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlistItems]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    showSweetToast(message, type);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some((item) => item._id === productId);
  };

  const addToWishlist = (product) => {
    if (!product || !product._id) return false;
    if (isInWishlist(product._id)) {
      showToast(`"${product.name}" is already in your wishlist!`, "info");
      return false;
    }

    const itemToStore = {
      _id: product._id,
      name: product.name,
      price: Number(product.price) || 0,
      discount: Number(product.discount) || 0,
      finalPrice:
        Number(product.finalPrice) ||
        (product.discount > 0
          ? Number((product.price - (product.price * product.discount) / 100).toFixed(2))
          : Number(product.price) || 0),
      images: Array.isArray(product.images) ? product.images : product.image ? [product.image] : [],
      unit: product.unit || "kg",
      stock: product.stock !== undefined ? Number(product.stock) : 50,
      category: product.category || ""
    };

    setWishlistItems((prev) => [itemToStore, ...prev]);
    showToast(`Added "${product.name}" to your wishlist!`, "success");
    return true;
  };

  const removeFromWishlist = (productId) => {
    const item = wishlistItems.find((i) => i._id === productId);
    setWishlistItems((prev) => prev.filter((i) => i._id !== productId));
    showToast(
      item ? `Removed "${item.name}" from your wishlist.` : "Item removed from wishlist.",
      "info"
    );
  };

  const toggleWishlist = (product) => {
    if (!product || !product._id) return;
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    showToast("Wishlist cleared.", "info");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist
      }}
    >
      {children}

      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 text-white font-medium text-sm ${
            toast.type === "error"
              ? "bg-red-600 border border-red-700"
              : toast.type === "info"
              ? "bg-gray-800 border border-gray-900"
              : "bg-[#00B207] border border-green-700"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
