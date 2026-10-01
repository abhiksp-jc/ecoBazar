import React, { createContext, useContext, useState, useEffect } from "react";
import couponService from "../services/couponService";
import { showToast as showSweetToast } from "../utils/sweetalert";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("ecobazar_cart");
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => {
        const basePrice = Number(item.price) || 0;
        const discount = Number(item.discount) || 0;
        const finalPrice =
          item.finalPrice !== undefined && item.finalPrice !== null && !isNaN(Number(item.finalPrice))
            ? Number(item.finalPrice)
            : discount > 0
              ? Number((basePrice - (basePrice * discount) / 100).toFixed(2))
              : basePrice;
        return {
          ...item,
          price: basePrice,
          discount,
          finalPrice,
          quantity: Math.max(1, Number(item.quantity) || 1)
        };
      });
    } catch (error) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem("ecobazar_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [toast, setToast] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  useEffect(() => {
    const handleSessionCleared = () => {
      setCartItems([]);
      setAppliedCoupon(null);
    };
    window.addEventListener("ecobazar_session_cleared", handleSessionCleared);
    return () => window.removeEventListener("ecobazar_session_cleared", handleSessionCleared);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ecobazar_cart", JSON.stringify(cartItems));
    } catch (error) { }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem("ecobazar_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("ecobazar_coupon");
      }
    } catch (error) { }
  }, [appliedCoupon]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    showSweetToast(message, type);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const getItemCartQuantity = (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    return item ? Number(item.quantity) || 0 : 0;
  };

  const getRemainingStock = (product) => {
    if (!product) return 0;
    const totalStock = Number(product.stock) || 0;
    const inCart = getItemCartQuantity(product._id);
    return Math.max(0, totalStock - inCart);
  };

  const addToCart = (product, quantity = 1, openDrawer = true) => {
    if (!product || !product._id) return false;

    const requestedQty = Math.max(1, Number(quantity) || 1);
    const totalStock = product.stock !== undefined && product.stock !== null ? Number(product.stock) : Infinity;
    const unit = product.unit || "kg";

    if (totalStock <= 0) {
      showToast(`Sorry, "${product.name}" is currently out of stock!`, "error");
      return false;
    }

    const existingItemIndex = cartItems.findIndex((item) => item._id === product._id);
    const currentCartQty = existingItemIndex > -1 ? Number(cartItems[existingItemIndex].quantity) || 0 : 0;
    const availableToAdd = totalStock - currentCartQty;

    if (availableToAdd <= 0) {
      showToast(
        `Cannot add more. You already have all ${totalStock} ${unit} (maximum stock) of "${product.name}" in your cart!`,
        "warning"
      );
      return false;
    }

    const basePrice = Number(product.originalPrice || product.price) || 0;
    const discount = Number(product.discount) || 0;
    const finalPrice = product.finalPrice
      ? Number(Number(product.finalPrice).toFixed(2))
      : discount > 0
        ? Number((basePrice - (basePrice * discount) / 100).toFixed(2))
        : basePrice;

    if (requestedQty > availableToAdd) {
      const addedQty = availableToAdd;

      setCartItems((prevItems) => {
        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            stock: totalStock,
            price: basePrice,
            discount,
            finalPrice,
            quantity: totalStock
          };
          return updatedItems;
        } else {
          return [
            ...prevItems,
            {
              _id: product._id,
              name: product.name,
              price: basePrice,
              discount: discount,
              finalPrice: finalPrice,
              image: product.images && product.images.length > 0 ? product.images[0] : "",
              unit: unit,
              stock: totalStock,
              quantity: addedQty
            }
          ];
        }
      });

      showToast(
        `Added ${addedQty} ${unit} of "${product.name}" to cart (reached max available stock of ${totalStock} ${unit})!`,
        "warning"
      );
      if (openDrawer) {
        setIsCartOpen(true);
      }
      return true;
    }

    setCartItems((prevItems) => {
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          stock: totalStock,
          price: basePrice,
          discount,
          finalPrice,
          quantity: (Number(updatedItems[existingItemIndex].quantity) || 0) + requestedQty
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            price: basePrice,
            discount: discount,
            finalPrice: finalPrice,
            image: product.images && product.images.length > 0 ? product.images[0] : "",
            unit: unit,
            stock: totalStock,
            quantity: requestedQty
          }
        ];
      }
    });

    showToast(`Added ${requestedQty} ${unit} "${product.name}" to cart!`, "success");
    if (openDrawer) {
      setIsCartOpen(true);
    }
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    const targetQty = Number(newQuantity);

    if (targetQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cartItems.find((i) => i._id === productId);
    if (!item) return;

    const maxStock = item.stock !== undefined && item.stock !== null ? Number(item.stock) : Infinity;
    const unit = item.unit || "kg";

    if (targetQty > maxStock) {
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i._id === productId ? { ...i, quantity: maxStock } : i
        )
      );
      showToast(
        `Cannot select more than ${maxStock} ${unit}. Maximum stock limit reached for "${item.name}"!`,
        "warning"
      );
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i._id === productId ? { ...i, quantity: targetQty } : i
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    showToast("Cart cleared", "info");
  };

  const totalCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const unitPrice = Number(item.finalPrice ?? item.price ?? 0);
    const qty = Number(item.quantity || 1);
    return sum + unitPrice * qty;
  }, 0);

  // Dynamic coupon discount calculation
  let discountAmount = 0;
  let isCouponMinMet = true;

  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      discountAmount = 0;
      isCouponMinMet = false;
    } else {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
          discountAmount = appliedCoupon.maxDiscount;
        }
      } else {
        discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
      }
      discountAmount = Number(discountAmount.toFixed(2));
    }
  }

  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 5.0;
  const grandTotal = Math.max(0, subtotal - discountAmount) + shippingFee;

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      setCouponError("Please enter a coupon code.");
      showToast("Please enter a coupon code.", "error");
      return { success: false, message: "Please enter a coupon code." };
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      const result = await couponService.validateCoupon(code, subtotal);
      if (result.success && result.coupon) {
        setAppliedCoupon(result.coupon);
        showToast(result.message || "Coupon applied successfully!", "success");
        return { success: true, message: result.message };
      } else {
        throw new Error(result.message || "Invalid coupon code.");
      }
    } catch (err) {
      const msg = err.message || "Failed to apply coupon.";
      setCouponError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    showToast("Coupon removed from cart.", "info");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemCartQuantity,
        getRemainingStock,
        totalCount,
        subtotal: subtotal.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
        appliedCoupon,
        discountAmount: discountAmount.toFixed(2),
        isCouponMinMet,
        applyCoupon,
        removeCoupon,
        couponLoading,
        couponError,
        toastMessage: toast ? toast.message : "",
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        toggleCart
      }}
    >
      {children}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 text-white font-medium text-sm ${toast.type === "error"
              ? "bg-red-600 border border-red-700"
              : toast.type === "warning"
                ? "bg-amber-500 border border-amber-600"
                : toast.type === "info"
                  ? "bg-gray-800 border border-gray-900"
                  : "bg-[#00B207] border border-green-700"
            }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};
