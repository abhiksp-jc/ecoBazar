import React from "react";
import { X, Check, Loader2 } from "lucide-react";

const EditAddressModal = ({
  isOpen,
  onClose,
  saveSuccess,
  handleAddressSubmit,
  addressForm,
  setAddressForm,
  saving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-150 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Edit Billing Address
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Update your primary shipping &amp; billing address.
        </p>

        {saveSuccess && (
          <div className="mb-4 p-2.5 rounded-lg bg-green-50 text-[#00B207] text-xs font-semibold flex items-center gap-2">
            <Check size={16} />
            <span>{saveSuccess}</span>
          </div>
        )}

        <form onSubmit={handleAddressSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              required
              value={addressForm.street}
              onChange={(e) =>
                setAddressForm({ ...addressForm, street: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
              placeholder="4140 Parker Rd."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
                placeholder="Allentown"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
                placeholder="New Mexico"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                required
                value={addressForm.zipCode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, zipCode: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
                placeholder="31134"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                required
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
                placeholder="United States"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#00B207] hover:bg-[#009406] text-white px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              <span>Save Address</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;
