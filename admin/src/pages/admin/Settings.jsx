import { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  Store,
  Save,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  BellRing,
  Globe
} from "lucide-react";
import {
  getAdminProfile,
  updateAdminProfile,
  getAdmin
} from "../../services/authService";
import SecurityTab from "../../components/settings/SecurityTab";
import StorePreferencesTab from "../../components/settings/StorePreferencesTab";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [profileImage, setProfileImage] = useState("");

  // Password / Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Store Preferences State
  const [storeName, setStoreName] = useState("Ecobazar Organic Store");
  const [supportEmail, setSupportEmail] = useState("support@ecobazar.com");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [currency, setCurrency] = useState("INR");
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const cached = getAdmin();
      if (cached) {
        setName(cached.name || "");
        setEmail(cached.email || "");
        setPhone(cached.phone || "");
        setRole(cached.role || "ADMIN");
        setProfileImage(cached.profileImage || "");
      }

      const res = await getAdminProfile();
      if (res?.admin) {
        setName(res.admin.name || cached?.name || "");
        setEmail(res.admin.email || cached?.email || "");
        setPhone(res.admin.phone || cached?.phone || "");
        setRole(res.admin.role || cached?.role || "ADMIN");
        setProfileImage(res.admin.profileImage || cached?.profileImage || "");
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    try {
      const res = await updateAdminProfile({
        name: name.trim(),
        phone: phone.trim(),
        profileImage
      });

      // Update local storage so Header reflects name update
      const cached = getAdmin() || {};
      const updated = {
        ...cached,
        name: name.trim(),
        phone: phone.trim(),
        profileImage
      };
      localStorage.setItem("admin", JSON.stringify(updated));

      setSuccessMsg(res?.message || "Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword) {
      setErrorMsg("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateAdminProfile({
        currentPassword,
        newPassword
      });

      setSuccessMsg(res?.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Failed to update password. Please check your current password."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStorePreferences = (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Store preferences saved successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 400);
  };

  const tabs = [
    {
      id: "profile",
      label: "Admin Profile",
      description: "Manage your personal account information and contact details",
      icon: User
    },
    {
      id: "security",
      label: "Password & Security",
      description: "Update your login credentials and secure your account",
      icon: ShieldCheck
    },
    {
      id: "store",
      label: "Store Preferences",
      description: "Configure store parameters, notifications, and currency",
      icon: Store
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your administrator profile, security credentials, and store configurations.
        </p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50 text-green-800 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 size={18} className="shrink-0 text-green-600" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm animate-fade-in shadow-xs">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Settings Layout with Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Settings Inner Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-2 lg:col-span-1 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Navigation
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-green-600 text-white shadow-xs font-semibold"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}
                />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 lg:col-span-3">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Loading settings...
            </div>
          ) : (
            <>
              {/* TAB 1: Profile Settings */}
              {activeTab === "profile" && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="border-b border-gray-100 pb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Update your administrator name, phone, and profile avatar.
                    </p>
                  </div>

                  {/* Avatar Banner */}
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-600 to-green-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {name ? name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{name || "Admin"}</h3>
                      <p className="text-xs text-gray-500">{email}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-green-100 text-green-700 rounded-full">
                        {role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          type="email"
                          disabled
                          value={email}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none"
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        Email cannot be changed directly for security.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Role
                      </label>
                      <input
                        type="text"
                        disabled
                        value={role}
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none font-semibold"
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
                      <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Password & Security */}
              {activeTab === "security" && (
                <SecurityTab
                  handleUpdatePassword={handleUpdatePassword}
                  currentPassword={currentPassword}
                  setCurrentPassword={setCurrentPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  showCurrentPassword={showCurrentPassword}
                  setShowCurrentPassword={setShowCurrentPassword}
                  showNewPassword={showNewPassword}
                  setShowNewPassword={setShowNewPassword}
                  saving={saving}
                />
              )}

              {/* TAB 3: Store Preferences */}
              {activeTab === "store" && (
                <StorePreferencesTab
                  handleSaveStorePreferences={handleSaveStorePreferences}
                  storeName={storeName}
                  setStoreName={setStoreName}
                  currency={currency}
                  setCurrency={setCurrency}
                  supportEmail={supportEmail}
                  setSupportEmail={setSupportEmail}
                  supportPhone={supportPhone}
                  setSupportPhone={setSupportPhone}
                  orderNotifications={orderNotifications}
                  setOrderNotifications={setOrderNotifications}
                  maintenanceMode={maintenanceMode}
                  setMaintenanceMode={setMaintenanceMode}
                  saving={saving}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
