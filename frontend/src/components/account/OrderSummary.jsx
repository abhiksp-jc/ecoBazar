import React from "react";

const OrderSummary = ({ order }) => {
  const orderId = order?.orderNumber ? `#${order.orderNumber}` : order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "#4152";
  
  const paymentMethod = order?.paymentMethod === "COD" 
    ? "Cash on Delivery" 
    : order?.paymentMethod === "ONLINE" || order?.paymentMethod === "RAZORPAY"
    ? "Paypal"
    : order?.paymentMethod || "Paypal";

  const subtotal = Number(order?.subtotal) || Number(order?.totalAmount) || 365.0;
  const shippingFee = Number(order?.shippingFee) || 0;
  const total = Number(order?.totalAmount) || 84.0;
  
  // Calculate discount if present
  let discountLabel = "20%";
  if (order?.subtotal && order?.totalAmount && order.subtotal > order.totalAmount) {
    const diff = order.subtotal + shippingFee - order.totalAmount;
    if (diff > 0) {
      const pct = Math.round((diff / order.subtotal) * 100);
      discountLabel = pct > 0 ? `${pct}%` : "0%";
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-2xs">
      {/* Order ID & Payment Method */}
      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Order ID:
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 block font-mono">
            {orderId}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Payment Method:
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-800 mt-0.5 block capitalize">
            {paymentMethod}
          </span>
        </div>
      </div>

      {/* Financial Details */}
      <div className="space-y-2 pt-3 text-xs">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <span>Discount:</span>
          <span className="font-semibold text-gray-900">{discountLabel}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <span>Shipping:</span>
          <span className="font-semibold text-gray-900">
            {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm sm:text-base font-bold text-gray-900 border-t border-gray-100 pt-2.5 mt-1">
          <span>Total:</span>
          <span className="text-[#00B207]">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
