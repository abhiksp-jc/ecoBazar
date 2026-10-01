import React, { useState } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import customerService from "../../services/customerService";

const ChangePassword = ({ customerEmail }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.newPassword || form.newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setSaving(true);

    try {
      const email =
        customerEmail ||
        JSON.parse(localStorage.getItem("ecobazar_user") || "{}").email ||
        "";

      if (!email) {
        setErrorMsg("Please log in to change your password.");
        setSaving(false);
        return;
      }

      await customerService.changePassword({
        email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      setSuccessMsg("Password changed successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => setSuccessMsg(""), 4500);
    } catch (err) {
      setErrorMsg(err.message || "Unable to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-2xs">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-5 border-b border-gray-100 mb-6">
        Change Password
      </h2>

      {successMsg && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-[#00B207] text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#00B207] hover:bg-[#009406] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <span>{saving ? "Saving..." : "Change Password"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
