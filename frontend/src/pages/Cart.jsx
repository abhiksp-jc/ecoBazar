import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Ticket,
  Tag,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X,
  Copy
} from "lucide-react";
import { useCart } from "../context/CartContext";
import couponService from "../services/couponService";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import CartItemsTable from "../components/cart/CartItemsTable";
import { showConfirmAlert, showToast } from "../utils/sweetalert";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    grandTotal,
    appliedCoupon,
    discountAmount,
    isCouponMinMet,
    applyCoupon,
    removeCoupon,
    couponLoading,
    couponError
  } = useCart();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCouponsDrawer, setShowCouponsDrawer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load active public coupons for shopper suggestions
    couponService.getActiveCoupons().then((list) => {
      setAvailableCoupons(list || []);
    });
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://placehold.co/100x100?text=Product";
    if (imgPath.startsWith("http")) return imgPath;
    return `http://localhost:5000${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    if (res.success) {
      setCouponInput("");
    }
  };

  const handleQuickApply = async (code) => {
    setCouponInput(code);
    const res = await applyCoupon(code);
    if (res.success) {
      setCouponInput("");
      setShowCouponsDrawer(false);
    }
  };

  const handleClearCart = async () => {
    const result = await showConfirmAlert({
      title: "Clear your cart?",
      text: "All items will be removed from your shopping cart.",
      confirmButtonText: "Yes, clear cart",
      cancelButtonText: "Keep items"
    });
    if (result.isConfirmed) {
      clearCart();
      showToast("Cart has been cleared.", "info");
    }
  };

  const handleProceedToBilling = () => {
    if (cartItems.length === 0) return;
    navigate("/billing");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <TopHeader />
      <div className="sticky top-0 z-40 bg-white shadow-xs">
        <MainHeader isMobileNavOpen={mobileNavOpen} onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <Navbar isMobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} />
      </div>

      <div className="bg-gray-50 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          My Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Looks like you haven't added any fresh groceries to your cart yet. Explore our shop and discover great deals!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-sm"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <CartItemsTable
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                getImageUrl={getImageUrl}
                navigate={navigate}
                handleClearCart={handleClearCart}
              />


              {/* COUPON CARD SECTION: Matching User Screenshot */}
              <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 bg-white shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      Coupon Code
                    </span>
                    {availableCoupons.length > 0 && !appliedCoupon && (
                      <button
                        type="button"
                        onClick={() => setShowCouponsDrawer(!showCouponsDrawer)}
                        className="inline-flex items-center gap-1 text-xs text-[#00B207] hover:text-[#009406] font-semibold underline cursor-pointer"
                      >
                        <Sparkles size={13} />
                        <span>View Available ({availableCoupons.length})</span>
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    /* Applied Coupon Card */
                    <div className="flex flex-wrap items-center gap-3 bg-emerald-50 border border-emerald-300 rounded-2xl px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-600" />
                        <span className="font-mono font-black text-gray-900 uppercase tracking-wider text-sm">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                          {appliedCoupon.discountType === "PERCENTAGE"
                            ? `${appliedCoupon.discountValue}% OFF`
                            : `$${appliedCoupon.discountValue} OFF`}
                        </span>
                      </div>

                      {Number(discountAmount) > 0 ? (
                        <span className="text-xs font-bold text-emerald-800">
                          Applied: -${discountAmount}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-700 font-semibold">
                          (Min order ${appliedCoupon.minOrderAmount} needed)
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer flex items-center gap-0.5"
                      >
                        <X size={14} /> Remove
                      </button>
                    </div>
                  ) : (
                    /* Coupon Input & Apply Button */
                    <form
                      onSubmit={handleApplyCoupon}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto"
                    >
                      <div className="relative flex-1 sm:w-64">
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="w-full px-5 py-3 rounded-full border border-gray-200 text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]/30 focus:outline-hidden transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-8 py-3 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm transition duration-150 shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {couponLoading ? "Applying..." : "Apply Coupon"}
                      </button>
                    </form>
                  )}
                </div>

                {couponError && (
                  <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-red-500" />
                    <span>{couponError}</span>
                  </div>
                )}

                {/* Collapsible Available Coupons List */}
                {showCouponsDrawer && availableCoupons.length > 0 && !appliedCoupon && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                      Available Coupons for You:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableCoupons.map((c) => (
                        <div
                          key={c.code}
                          className="p-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-900 text-sm">
                                {c.code}
                              </span>
                              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                                {c.discountType === "PERCENTAGE"
                                  ? `${c.discountValue}% OFF`
                                  : `$${c.discountValue} OFF`}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {c.minOrderAmount > 0
                                ? `Orders above $${c.minOrderAmount}`
                                : "No minimum order"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickApply(c.code)}
                            className="px-3 py-1.5 rounded-lg bg-[#00B207] hover:bg-[#009406] text-white text-xs font-bold transition shadow-2xs cursor-pointer shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Total Card */}
            <div className="border border-gray-200 rounded-2xl p-6 sm:p-7 bg-white shadow-xs space-y-5">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                Cart Total
              </h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-gray-900">${subtotal}</span>
                </div>

                {appliedCoupon && Number(discountAmount) > 0 && (
                  <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/80 text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} className="text-emerald-600" />
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span>-${discountAmount}</span>
                  </div>
                )}

                {appliedCoupon && !isCouponMinMet && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    Add <strong>${(appliedCoupon.minOrderAmount - Number(subtotal)).toFixed(2)}</strong> more to unlock coupon {appliedCoupon.code}!
                  </p>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-medium text-gray-900">
                    {Number(shippingFee) === 0 ? (
                      <span className="text-green-600 font-bold">Free</span>
                    ) : (
                      `$${shippingFee}`
                    )}
                  </span>
                </div>

                {Number(subtotal) < 50 && Number(subtotal) > 0 && (
                  <p className="text-[11px] text-amber-600 bg-amber-50 p-2.5 rounded-lg">
                    Add <strong>${(50 - Number(subtotal)).toFixed(2)}</strong> more to get <strong>Free Shipping</strong>!
                  </p>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-extrabold text-green-700">${grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToBilling}
                disabled={cartItems.length === 0}
                className="w-full bg-[#00B207] hover:bg-[#009406] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 text-sm cursor-pointer"
              >
                <span>Proceed to checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                <ShieldCheck size={16} className="text-green-600" />
                <span>100% Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
