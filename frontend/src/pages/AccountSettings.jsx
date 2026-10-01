import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, User } from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AccountBreadcrumb from "../components/account/AccountBreadcrumb";
import AccountSidebar from "../components/account/AccountSidebar";
import ProfileSettings from "../components/account/ProfileSettings";
import BillingAddress from "../components/account/BillingAddress";
import ChangePassword from "../components/account/ChangePassword";
import EcobazarNewsletter from "../components/common/EcobazarNewsletter";
import customerService from "../services/customerService";

const EMPTY_CUSTOMER = {
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  profileImage: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  }
};

const AccountSettings = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("ecobazar_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const loadCustomerData = async () => {
    setLoading(true);
    if (!currentUser?.email) {
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const profile = await customerService.getProfile(currentUser.email);
      if (profile) {
        const merged = {
          ...EMPTY_CUSTOMER,
          ...currentUser,
          ...profile,
          profileImage: profile.profileImage || currentUser.profileImage || ""
        };
        setCustomer(merged);
      } else {
        setCustomer({ ...EMPTY_CUSTOMER, ...currentUser });
      }
    } catch (err) {
      setCustomer({ ...EMPTY_CUSTOMER, ...currentUser });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();

    const handleStorage = () => {
      try {
        const raw = localStorage.getItem("ecobazar_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          setCustomer((prev) => ({ ...prev, ...parsed }));
        }
      } catch (_) {}
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleProfileUpdated = (updated) => {
    setCustomer((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between">
      <div>
        {/* 1. Announcement Bar */}
        <TopHeader />

        {/* 2. Main Header & Navbar */}
        <div className="sticky top-0 z-40 bg-white shadow-xs">
          <MainHeader
            isMobileNavOpen={mobileNavOpen}
            onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          />
          <Navbar
            isMobileNavOpen={mobileNavOpen}
            onCloseMobileNav={() => setMobileNavOpen(false)}
          />
        </div>

        {/* 3. Breadcrumb Banner */}
        <AccountBreadcrumb
          items={[
            { label: "Account", path: "/account" },
            { label: "Settings", path: null }
          ]}
          currentPath="Settings"
        />

        {/* 4. Main Account Layout (2-Column) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Sidebar (Settings active) */}
            <aside className="w-full lg:w-64 shrink-0">
              <AccountSidebar activeTab="settings" />
            </aside>

            {/* Right Settings Content Area */}
            <div className="flex-1 min-w-0 w-full">
              {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-xs flex flex-col items-center justify-center text-gray-400">
                  <Loader2 className="animate-spin text-[#00B207] mb-3" size={36} />
                  <p className="text-sm font-medium text-gray-600">
                    Loading account settings...
                  </p>
                </div>
              ) : (
                <div>
                  {/* Account Settings (Personal Information & Profile Picture) */}
                  <ProfileSettings
                    customer={customer}
                    onProfileUpdated={handleProfileUpdated}
                  />

                  {/* Billing Address Card */}
                  <BillingAddress
                    customer={customer}
                    onAddressUpdated={handleProfileUpdated}
                  />

                  {/* Change Password Card */}
                  <ChangePassword
                    customerEmail={customer?.email}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 5. Newsletter Section */}
        <EcobazarNewsletter />
      </div>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
};

export default AccountSettings;
