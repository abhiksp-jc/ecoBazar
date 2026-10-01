import React, { useState, useRef } from "react";
import { Loader2, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import customerService from "../../services/customerService";
import { getImageUrl } from "../../utils/imageUrl";
import { showToast } from "../../utils/sweetalert";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80";

const ProfileSettings = ({ customer, onProfileUpdated }) => {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: customer?.firstName || (customer?.name ? customer.name.split(" ")[0] : "") || "",
    lastName: customer?.lastName || (customer?.name ? customer.name.split(" ").slice(1).join(" ") : "") || "",
    email: customer?.email || "",
    phone: customer?.phone || ""
  });

  const [previewImage, setPreviewImage] = useState(
    customer?.profileImage ? getImageUrl(customer.profileImage, DEFAULT_AVATAR) : DEFAULT_AVATAR
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state when customer prop is loaded or updated
  React.useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        firstName: customer.firstName || (customer.name ? customer.name.split(" ")[0] : "") || prev.firstName,
        lastName: customer.lastName || (customer.name ? customer.name.split(" ").slice(1).join(" ") : "") || prev.lastName,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone
      }));
      if (customer.profileImage) {
        setPreviewImage(getImageUrl(customer.profileImage, DEFAULT_AVATAR));
      }
    }
  }, [customer]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setSelectedFile(file);

    // Auto upload to backend
    try {
      setUploadingImg(true);
      setErrorMsg("");
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("email", form.email || customer?.email || "");

      const res = await customerService.uploadProfileImage(formData, file);
      if (res.profileImage) {
        const displaySrc = res.profileImage.startsWith("data:")
          ? res.profileImage
          : getImageUrl(res.profileImage, objectUrl);

        setPreviewImage(displaySrc);
        const current = JSON.parse(localStorage.getItem("ecobazar_user") || "{}");
        const updated = {
          ...current,
          ...(res.customer || {}),
          profileImage: res.profileImage
        };
        localStorage.setItem("ecobazar_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
        if (onProfileUpdated) onProfileUpdated(updated);
        setSuccessMsg("Profile image updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.warn("Profile image upload note:", err.message);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.firstName.trim()) {
      setErrorMsg("First name is required");
      setSaving(false);
      return;
    }

    try {
      const current = JSON.parse(localStorage.getItem("ecobazar_user") || "{}");
      const activeImage = current.profileImage || customer?.profileImage || "";

      const payload = {
        email: customer?.email || form.email,
        newEmail: form.email,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        profileImage: activeImage
      };

      const res = await customerService.updateProfile(payload);

      // Update local storage preserving profileImage
      const updatedUser = {
        ...current,
        ...(res.customer || {}),
        profileImage: res.customer?.profileImage || activeImage,
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim()
      };

      localStorage.setItem("ecobazar_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));

      if (onProfileUpdated) onProfileUpdated(updatedUser);

      setSuccessMsg("Profile updated successfully");
      showToast("Profile updated successfully!", "success");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      const msg = err.message || "Unable to update profile";
      setErrorMsg(msg);
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-2xs mb-8">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-5 border-b border-gray-100 mb-6">
        Account Settings
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

      <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-8 lg:gap-12">
        {/* Left: Form Fields */}
        <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
                placeholder="First name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] transition"
              placeholder="(671) 555-0110"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#00B207] hover:bg-[#009406] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>

        {/* Right: Circular Profile Picture & Change Image */}
        <div className="w-full lg:w-48 shrink-0 flex flex-col items-center justify-center text-center">
          <div className="relative mb-3 group">
            <img
              src={previewImage}
              alt={form.firstName}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-150 shadow-xs"
              onError={(e) => {
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            {uploadingImg && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-[#00B207] text-[#00B207] hover:bg-[#00B207] hover:text-white font-bold text-xs px-5 py-2 rounded-full transition cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
          >
            <Camera size={14} />
            <span>Choose Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
