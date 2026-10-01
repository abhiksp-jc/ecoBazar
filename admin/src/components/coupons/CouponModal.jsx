import React from "react";
import { X, Sparkles } from "lucide-react";

const CouponModal = ({
  isModalOpen,
  setIsModalOpen,
  editingCoupon,
  formData,
  setFormData,
  handleSubmit,
  submitting,
  generateCode,
  setExpiryDays,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-base font-bold text-gray-900">
            {editingCoupon ? "Edit Coupon" : "Add Coupon"}
          </h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Coupon Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. SUMMER20"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-mono uppercase outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
                title="Generate code automatically"
              >
                <Sparkles size={13} />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Discount {formData.discountType === "PERCENTAGE" ? "(%)" : "($)"} *
              </label>
              <input
                type="number"
                min="1"
                max={formData.discountType === "PERCENTAGE" ? 100 : undefined}
                required
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 font-semibold"
              />
            </div>
          </div>

          {/* Min Order Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Minimum Order Subtotal ($)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0 = No minimum"
              value={formData.minOrderAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minOrderAmount: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-green-500"
            />
          </div>

          {/* Expiry Date & Time */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Expiry Date &amp; Time *
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-400">Quick:</span>
                <button
                  type="button"
                  onClick={() => setExpiryDays(7)}
                  className="text-[11px] text-green-700 hover:underline font-medium"
                >
                  +7 days
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setExpiryDays(30)}
                  className="text-[11px] text-green-700 hover:underline font-medium"
                >
                  +30 days
                </button>
              </div>
            </div>

            <input
              type="datetime-local"
              required
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expiryDate: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-green-500"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="modalIsActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 rounded text-green-600 focus:ring-green-500 cursor-pointer"
            />
            <label
              htmlFor="modalIsActive"
              className="text-xs font-medium text-gray-700 cursor-pointer"
            >
              Enable coupon for shoppers
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-green-600 hover:bg-green-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving..." : editingCoupon ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
