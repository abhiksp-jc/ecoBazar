import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    totalCount,
    subtotal
  } = useCart();

  const navigate = useNavigate();

  // Helper to format image URLs
  const getImageUrl = (imgPath) => {
    if (!imgPath) {
      return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80";
    }
    if (imgPath.startsWith("http")) return imgPath;
    return `http://localhost:5000${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  // Close drawer on ESC key press & lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleGoToCart = () => {
    closeCart();
    navigate("/cart");
  };

  const handleProductClick = (id) => {
    closeCart();
    navigate(`/product/${id}`);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] max-w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900">
            Shopping Card ({totalCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition focus:outline-none"
            title="Close Cart"
          >
            <X size={20} className="stroke-[1.8]" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-50 text-[#00B207] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 max-w-[240px] mb-6">
                Discover our fresh organic grocery selection and fill your bag!
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate("/shop");
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00B207] hover:bg-[#009e06] text-white text-sm font-semibold rounded-full transition shadow-xs"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = Number(item.finalPrice ?? item.price ?? 0);
              return (
                <div
                  key={item._id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      onClick={() => handleProductClick(item._id)}
                      className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-50 rounded-lg p-1.5 flex items-center justify-center border border-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition"
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4
                        onClick={() => handleProductClick(item._id)}
                        className="text-sm font-medium text-gray-900 hover:text-[#00B207] transition cursor-pointer truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        <span>
                          {item.quantity} {item.unit || "kg"} x{" "}
                        </span>
                        <span className="font-bold text-gray-900">
                          {itemPrice.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Circular remove button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="w-6 h-6 rounded-full border border-gray-300 hover:border-red-500 text-gray-400 hover:text-red-500 flex items-center justify-center transition shrink-0 ml-1 cursor-pointer"
                    title="Remove item"
                  >
                    <X size={13} strokeWidth={2.2} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white space-y-4">
            {/* Subtotal Row */}
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-gray-700 font-medium">
                {totalCount} Product
              </span>
              <span className="font-bold text-gray-900 text-base sm:text-lg">
                ${subtotal}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm sm:text-base rounded-full text-center transition shadow-xs focus:outline-none cursor-pointer"
              >
                Checkout
              </button>

              <button
                type="button"
                onClick={handleGoToCart}
                className="w-full py-3.5 px-4 bg-[#edf7ee] hover:bg-[#e2f3e3] text-[#00B207] font-semibold text-sm sm:text-base rounded-full text-center transition focus:outline-none cursor-pointer"
              >
                Go To Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
