import React from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";

const SecurityTab = ({
  handleUpdatePassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  saving,
}) => {
  return (
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Password &amp; Security
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Ensure your account uses a long, strong password to prevent unauthorized access.
        </p>
      </div>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? "Updating..." : "Update Password"}</span>
        </button>
      </div>
    </form>
  );
};

export default SecurityTab;
