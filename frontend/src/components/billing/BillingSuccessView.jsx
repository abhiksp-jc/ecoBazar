import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Mail, ArrowRight, ShoppingBag } from "lucide-react";

const BillingSuccessView = ({
  orderComplete,
  isResending,
  handleResendEmail,
  showResendInput,
  setShowResendInput,
  resendEmailInput,
  setResendEmailInput,
  resendStatus
}) => {
  if (!orderComplete) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={36} className="text-[#00B207]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600 text-sm mb-4">
        Thank you for choosing Ecobazar. Your order has been placed and saved in MongoDB.
      </p>

      {/* Email notification section */}
      <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200 text-left">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-green-800 text-xs font-semibold">
            <Mail size={16} className="text-green-600 shrink-0" />
            <span>
              Confirmation email sent to:{" "}
              <span className="font-bold underline">
                {orderComplete.customerDetails?.email}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isResending}
              onClick={() => handleResendEmail(orderComplete.customerDetails?.email)}
              className="text-xs bg-white text-green-700 hover:bg-green-100 border border-green-300 font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              {isResending ? "Sending..." : "Resend Email"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowResendInput(!showResendInput);
                setResendEmailInput(orderComplete.customerDetails?.email || "");
              }}
              className="text-xs text-green-700 hover:underline font-medium cursor-pointer"
            >
              Change Email
            </button>
          </div>
        </div>

        {showResendInput && (
          <div className="mt-3 pt-3 border-t border-green-200 flex items-center gap-2">
            <input
              type="email"
              value={resendEmailInput}
              onChange={(e) => setResendEmailInput(e.target.value)}
              placeholder="Enter recipient email"
              className="flex-1 text-xs px-3 py-2 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="button"
              disabled={isResending}
              onClick={() => handleResendEmail(resendEmailInput)}
              className="text-xs bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isResending ? "Sending..." : "Send Now"}
            </button>
          </div>
        )}

        {resendStatus && (
          <p className="text-xs mt-2 text-green-700 font-medium">{resendStatus}</p>
        )}
      </div>

      {/* Order info receipt */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left border border-gray-100 space-y-3 text-sm">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-gray-500 font-medium">Order Number:</span>
          <span className="text-gray-900 font-bold font-mono text-base">
            {orderComplete.orderNumber}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Customer Name:</span>
          <span className="text-gray-900 font-semibold">
            {orderComplete.customerDetails?.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Email:</span>
          <span className="text-gray-900">{orderComplete.customerDetails?.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Phone:</span>
          <span className="text-gray-900">{orderComplete.customerDetails?.phone}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Payment Method:</span>
          <span className="text-gray-900 font-medium">
            {orderComplete.paymentMethod === "ONLINE"
              ? "Razorpay Online Payment"
              : orderComplete.paymentMethod}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Payment Status:</span>
          <span
            className={`font-bold ${
              orderComplete.paymentStatus === "Paid"
                ? "text-green-600"
                : "text-amber-600"
            }`}
          >
            {orderComplete.paymentStatus}
          </span>
        </div>
        {orderComplete.razorpayPaymentId && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Razorpay Payment ID:</span>
            <span className="text-gray-900 font-mono text-xs">
              {orderComplete.razorpayPaymentId}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-base font-bold text-gray-900">Total Amount:</span>
          <span className="text-xl font-extrabold text-green-700">
            ${(Number(orderComplete.totalAmount) || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to={`/account/orders/${orderComplete._id}`}
          className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-green-700 text-white font-medium text-sm px-6 py-3 rounded-full transition shadow-xs"
        >
          <span>View Order Details</span>
          <ArrowRight size={16} />
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm px-6 py-3 rounded-full transition"
        >
          <ShoppingBag size={16} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default BillingSuccessView;
