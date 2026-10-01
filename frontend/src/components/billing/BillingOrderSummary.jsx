import React from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

const BillingOrderSummary = ({
  cartItems,
  subtotal,
  shippingFee,
  appliedCoupon,
  discountAmount,
  grandTotal,
  paymentMethod,
  isProcessing,
  getImageUrl
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs sticky top-28 space-y-6">
      <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
        Order Summary
      </h3>

      {/* Cart Items List */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=Item";
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-800 line-clamp-1 text-xs sm:text-sm">
                  {item.name}
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  Qty: {item.quantity} {item.unit || "unit"}
                </p>
              </div>
            </div>
            <span className="font-bold text-gray-900 shrink-0 text-xs sm:text-sm">
              ${(Number(item.finalPrice || item.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Financial Breakdown */}
      <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping:</span>
          <span className="font-semibold text-gray-900">
            {shippingFee === 0 ? (
              <span className="text-green-600 font-bold">Free</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        {appliedCoupon && discountAmount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Coupon ({appliedCoupon.code}):</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
          <span className="text-base font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-extrabold text-[#00B207]">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Submit / Place Order Button */}
      <button
        type="submit"
        disabled={isProcessing || cartItems.length === 0}
        className="w-full bg-[#00B207] hover:bg-[#009e06] text-white font-bold py-3.5 px-6 rounded-full transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processing Order...</span>
          </>
        ) : (
          <span>
            {paymentMethod === "ONLINE"
              ? `Pay $${grandTotal.toFixed(2)} with Razorpay`
              : "Place Order"}
          </span>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-1">
        <ShieldCheck size={16} className="text-green-600 shrink-0" />
        <span>100% Secure Checkout & Guaranteed Quality</span>
      </div>
    </div>
  );
};

export default BillingOrderSummary;
