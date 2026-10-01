import React from "react";
import { Globe, BellRing, Save } from "lucide-react";

const StorePreferencesTab = ({
  handleSaveStorePreferences,
  storeName,
  setStoreName,
  currency,
  setCurrency,
  supportEmail,
  setSupportEmail,
  supportPhone,
  setSupportPhone,
  orderNotifications,
  setOrderNotifications,
  maintenanceMode,
  setMaintenanceMode,
  saving,
}) => {
  return (
    <form onSubmit={handleSaveStorePreferences} className="space-y-6">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Store Preferences
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Configure store branding, support channels, and general operational toggles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Store Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Default Currency
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 outline-none transition"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Support Email
          </label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Support Hotline
          </label>
          <input
            type="text"
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <BellRing size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Order Email Notifications
              </p>
              <p className="text-xs text-gray-500">
                Receive notifications when customers place new orders.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={orderNotifications}
            onChange={(e) => setOrderNotifications(e.target.checked)}
            className="w-5 h-5 accent-green-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Maintenance Mode
            </p>
            <p className="text-xs text-gray-500">
              Temporarily disable public storefront for regular maintenance.
            </p>
          </div>
          <input
            type="checkbox"
            checked={maintenanceMode}
            onChange={(e) => setMaintenanceMode(e.target.checked)}
            className="w-5 h-5 accent-green-600 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save Preferences"}</span>
        </button>
      </div>
    </form>
  );
};

export default StorePreferencesTab;
