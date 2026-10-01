import React from "react";
import { X, Check, Camera, Loader2 } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80";

const EditProfileModal = ({
  isOpen,
  onClose,
  saveSuccess,
  modalAvatar,
  displayName,
  displayAvatar,
  uploadingModalImg,
  modalFileInputRef,
  handleModalImageChange,
  handleProfileSubmit,
  profileForm,
  setProfileForm,
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
          Edit Customer Profile
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Update your personal information displayed on your dashboard.
        </p>

        {saveSuccess && (
          <div className="mb-4 p-2.5 rounded-lg bg-green-50 text-[#00B207] text-xs font-semibold flex items-center gap-2">
            <Check size={16} />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Profile Avatar Selection in Modal */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="relative mb-2">
            <img
              src={modalAvatar ? getImageUrl(modalAvatar, DEFAULT_AVATAR) : displayAvatar}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-150 shadow-xs"
              onError={(e) => {
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            {uploadingModalImg && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                <Loader2 size={20} className="animate-spin" />
              </div>
            )}
          </div>
          <input
            type="file"
            ref={modalFileInputRef}
            onChange={handleModalImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => modalFileInputRef.current?.click()}
            disabled={uploadingModalImg}
            className="text-[#00B207] hover:underline font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Camera size={13} />
            <span>{uploadingModalImg ? "Uploading..." : "Change Photo"}</span>
          </button>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B207]"
              placeholder="(219) 555-0104"
            />
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
