import React, { useState, useRef, useEffect } from "react";
import { User, MapPin, Mail, Phone, Edit2, X, Check, Loader2, Camera } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";
import customerService from "../../services/customerService";
import EditProfileModal from "./EditProfileModal";
import EditAddressModal from "./EditAddressModal";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80";

const ProfileCards = ({ user, onUpdateUser }) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  const modalFileInputRef = useRef(null);
  const [modalAvatar, setModalAvatar] = useState(user?.profileImage || "");
  const [uploadingModalImg, setUploadingModalImg] = useState(false);

  // Real user values or clean placeholders
  const displayName = user?.name || (user?.firstName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "") || "Customer";
  const displayEmail = user?.email || "No email provided";
  const displayPhone = user?.phone || "No phone added";
  const displayAddress = user?.address?.street
    ? `${user.address.street}${user.address.city ? `, ${user.address.city}` : ""}${user.address.state ? `, ${user.address.state}` : ""}${user.address.zipCode ? ` ${user.address.zipCode}` : ""}`
    : "No delivery address added yet";
  const displayAvatar = user?.profileImage
    ? getImageUrl(user.profileImage, DEFAULT_AVATAR)
    : DEFAULT_AVATAR;

  // Sync state when user prop changes
  useEffect(() => {
    setModalAvatar(user?.profileImage || "");
    setProfileForm({
      name: displayName,
      email: user?.email || "",
      phone: user?.phone || ""
    });
    setAddressForm({
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "United States"
    });
  }, [user]);

  // Form states for Edit Profile
  const [profileForm, setProfileForm] = useState({
    name: displayName,
    email: displayEmail,
    phone: displayPhone
  });

  // Form states for Edit Address
  const [addressForm, setAddressForm] = useState({
    street: user?.address?.street || "4140 Parker Rd.",
    city: user?.address?.city || "Allentown",
    state: user?.address?.state || "New Mexico",
    zipCode: user?.address?.zipCode || "31134",
    country: user?.address?.country || "United States"
  });

  const handleModalImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setModalAvatar(objectUrl);

    try {
      setUploadingModalImg(true);
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("email", profileForm.email || user?.email || "");

      const res = await customerService.uploadProfileImage(formData, file);
      if (res.profileImage) {
        const newImg = res.profileImage;
        setModalAvatar(newImg);
        const current = JSON.parse(localStorage.getItem("ecobazar_user") || "{}");
        const updated = {
          ...current,
          ...(res.customer || {}),
          profileImage: newImg
        };
        localStorage.setItem("ecobazar_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
        if (onUpdateUser) onUpdateUser(updated);
      }
    } catch (err) {
      console.warn("Avatar upload error:", err);
    } finally {
      setUploadingModalImg(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess("");

    try {
      const parts = profileForm.name.trim().split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      const activeImage = modalAvatar || user?.profileImage || "";

      const updated = {
        ...(user || {}),
        name: profileForm.name.trim(),
        firstName,
        lastName,
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        profileImage: activeImage
      };

      // Save to localStorage
      localStorage.setItem("ecobazar_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));

      // Try persisting to backend API
      try {
        await customerService.updateProfile({
          email: user?.email || updated.email,
          newEmail: updated.email,
          firstName,
          lastName,
          phone: updated.phone,
          profileImage: activeImage
        });
      } catch (err) {
        // Fallback POST
        try {
          await fetch("http://localhost:5000/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              lastName,
              email: updated.email,
              phone: updated.phone,
              profileImage: activeImage,
              address: user?.address || {
                street: "4140 Parker Rd.",
                city: "Allentown",
                state: "New Mexico",
                zipCode: "31134"
              }
            })
          });
        } catch (_) {}
      }

      if (onUpdateUser) onUpdateUser(updated);
      setSaveSuccess("Profile updated successfully!");
      setTimeout(() => {
        setProfileModalOpen(false);
        setSaveSuccess("");
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess("");

    try {
      const updatedAddress = {
        street: addressForm.street.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        zipCode: addressForm.zipCode.trim(),
        country: addressForm.country.trim()
      };

      const updated = {
        ...(user || {}),
        address: updatedAddress
      };

      localStorage.setItem("ecobazar_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));

      try {
        const parts = displayName.trim().split(" ");
        await fetch("http://localhost:5000/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: parts[0] || user?.firstName || "",
            lastName: parts.slice(1).join(" ") || user?.lastName || "",
            email: displayEmail,
            phone: displayPhone,
            address: updatedAddress
          })
        });
      } catch (err) {}

      if (onUpdateUser) onUpdateUser(updated);
      setSaveSuccess("Address updated successfully!");
      setTimeout(() => {
        setAddressModalOpen(false);
        setSaveSuccess("");
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="relative mb-4">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-150 shadow-xs"
              onError={(e) => {
                e.target.src = DEFAULT_AVATAR;
              }}
            />
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-snug">
            {displayName}
          </h3>

          <p className="text-xs text-gray-400 font-medium mt-0.5 mb-4">
            Customer
          </p>

          <button
            type="button"
            onClick={() => {
              setProfileForm({
                name: displayName,
                email: displayEmail,
                phone: displayPhone
              });
              setProfileModalOpen(true);
            }}
            className="text-[#00B207] hover:text-[#009406] font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition cursor-pointer hover:underline"
          >
            Edit Profile
          </button>
        </div>

        {/* SECOND CARD: Customer / Billing Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Billing Address
            </span>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {displayName}
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3">
              {displayAddress}
            </p>

            <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Email:</span>
                <span className="text-gray-800">{displayEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Phone:</span>
                <span className="text-gray-800">{displayPhone}</span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                setAddressForm({
                  street: user?.address?.street || "4140 Parker Rd.",
                  city: user?.address?.city || "Allentown",
                  state: user?.address?.state || "New Mexico",
                  zipCode: user?.address?.zipCode || "31134",
                  country: user?.address?.country || "United States"
                });
                setAddressModalOpen(true);
              }}
              className="text-[#00B207] hover:text-[#009406] font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition cursor-pointer hover:underline"
            >
              Edit Address
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        saveSuccess={saveSuccess}
        modalAvatar={modalAvatar}
        displayName={displayName}
        displayAvatar={displayAvatar}
        uploadingModalImg={uploadingModalImg}
        modalFileInputRef={modalFileInputRef}
        handleModalImageChange={handleModalImageChange}
        handleProfileSubmit={handleProfileSubmit}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        saving={saving}
      />

      {/* Edit Address Modal */}
      <EditAddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        saveSuccess={saveSuccess}
        handleAddressSubmit={handleAddressSubmit}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        saving={saving}
      />

    </>
  );
};

export default ProfileCards;
