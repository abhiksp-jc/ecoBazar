import React from "react";
import { CreditCard, Truck, Building2 } from "lucide-react";

const BillingAddressForm = ({
  formData,
  handleInputChange,
  errors,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Customer Personal & Address Information */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Billing Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Your first name"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition ${
                errors.firstName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00B207]"
              }`}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Your last name"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition ${
                errors.lastName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00B207]"
              }`}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Company name"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#00B207]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            placeholder="House number and street name"
            className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition ${
              errors.street
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-[#00B207]"
            }`}
          />
          {errors.street && (
            <p className="text-xs text-red-500 mt-1">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Country / Region <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#00B207]"
            >
              <option value="United States">United States</option>
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              State / City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State or City"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition ${
                errors.state
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00B207]"
              }`}
            />
            {errors.state && (
              <p className="text-xs text-red-500 mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Zip Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Zip code"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition ${
                errors.zipCode
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00B207]"
              }`}
            />
            {errors.zipCode && (
              <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00B207]"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone number"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00B207]"
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Order Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="orderNotes"
            rows={3}
            value={formData.orderNotes}
            onChange={handleInputChange}
            placeholder="Notes about your order, e.g. special notes for delivery"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#00B207]"
          />
        </div>
      </div>

      {/* 2. Payment Method Selector */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Payment Method
        </h3>

        <div className="space-y-3">
          {/* Razorpay Online Option */}
          <label
            className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition ${
              paymentMethod === "ONLINE"
                ? "border-[#00B207] bg-green-50/50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
              className="mt-1 text-[#00B207] focus:ring-[#00B207] cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#00B207]" />
                <span className="font-bold text-sm text-gray-900">
                  Razorpay Secure Online Payment
                </span>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pay securely using Cards, UPI, NetBanking, and Wallets via official Razorpay Gateway.
              </p>
            </div>
          </label>

          {/* Cash on Delivery Option */}
          <label
            className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition ${
              paymentMethod === "COD"
                ? "border-[#00B207] bg-green-50/50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="mt-1 text-[#00B207] focus:ring-[#00B207] cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-gray-700" />
                <span className="font-bold text-sm text-gray-900">Cash on Delivery</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pay in cash when your fresh organic groceries arrive at your doorstep.
              </p>
            </div>
          </label>

          {/* Bank Transfer Option */}
          <label
            className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition ${
              paymentMethod === "BANK_TRANSFER"
                ? "border-[#00B207] bg-green-50/50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="BANK_TRANSFER"
              checked={paymentMethod === "BANK_TRANSFER"}
              onChange={() => setPaymentMethod("BANK_TRANSFER")}
              className="mt-1 text-[#00B207] focus:ring-[#00B207] cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-gray-700" />
                <span className="font-bold text-sm text-gray-900">Direct Bank Transfer</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Make your payment directly into our bank account. We dispatch once funds clear.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default BillingAddressForm;
