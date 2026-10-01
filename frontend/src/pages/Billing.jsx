import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, PackageCheck } from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import BillingSuccessView from "../components/billing/BillingSuccessView";
import BillingAddressForm from "../components/billing/BillingAddressForm";
import BillingOrderSummary from "../components/billing/BillingOrderSummary";
import { useBillingCheckout } from "../hooks/useBillingCheckout";

const Billing = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const {
    cartItems,
    subtotal,
    shippingFee,
    grandTotal,
    appliedCoupon,
    discountAmount,
    formData,
    paymentMethod,
    setPaymentMethod,
    errors,
    isProcessing,
    orderComplete,
    apiError,
    resendEmailInput,
    setResendEmailInput,
    showResendInput,
    setShowResendInput,
    resendStatus,
    isResending,
    getImageUrl,
    handleInputChange,
    handleResendEmail,
    handlePayment
  } = useBillingCheckout();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <TopHeader />
      <div className="sticky top-0 z-40 bg-white shadow-xs">
        <MainHeader isMobileNavOpen={mobileNavOpen} onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <Navbar isMobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} />
      </div>

      <div className="bg-white py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-green-600">Shopping Cart</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Billing & Payment</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {orderComplete ? (
          <BillingSuccessView
            orderComplete={orderComplete}
            isResending={isResending}
            handleResendEmail={handleResendEmail}
            showResendInput={showResendInput}
            setShowResendInput={setShowResendInput}
            resendEmailInput={resendEmailInput}
            setResendEmailInput={setResendEmailInput}
            resendStatus={resendStatus}
          />
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageCheck size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Items to Checkout</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your cart is currently empty. Please add products to proceed with billing and payment.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-sm text-sm"
            >
              Go to Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              Billing & Checkout
            </h1>

            {apiError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={20} className="shrink-0 text-red-600" />
                <span className="font-medium">{apiError}</span>
              </div>
            )}

            <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <BillingAddressForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </div>

              <div className="lg:col-span-5">
                <BillingOrderSummary
                  cartItems={cartItems}
                  subtotal={Number(subtotal) || 0}
                  shippingFee={Number(shippingFee) || 0}
                  appliedCoupon={appliedCoupon}
                  discountAmount={Number(discountAmount) || 0}
                  grandTotal={Number(grandTotal) || 0}
                  paymentMethod={paymentMethod}
                  isProcessing={isProcessing}
                  getImageUrl={getImageUrl}
                />
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Billing;
