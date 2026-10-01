import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AccountBreadcrumb from "../components/account/AccountBreadcrumb";
import AccountSidebar from "../components/account/AccountSidebar";
import ProfileCards from "../components/account/ProfileCards";
import RecentOrdersTable from "../components/account/RecentOrdersTable";
import EcobazarNewsletter from "../components/common/EcobazarNewsletter";
import customerService from "../services/customerService";

const AccountDashboard = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("ecobazar_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!currentUser?.email) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const raw = localStorage.getItem("ecobazar_user");
        setCurrentUser(raw ? JSON.parse(raw) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Sync latest profile from backend so profile image updates immediately
    const raw = localStorage.getItem("ecobazar_user");
    let parsed = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch (_) {}

    if (parsed?.email) {
      customerService
        .getProfile(parsed.email)
        .then((profile) => {
          if (profile) {
            const merged = { ...parsed, ...profile };
            setCurrentUser(merged);
            localStorage.setItem("ecobazar_user", JSON.stringify(merged));
          }
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between">
      <div>
        {/* 1. Top Dark Announcement Bar */}
        <TopHeader />

        {/* 2. Main Header & Navigation Menu */}
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

        {/* 3. Breadcrumb Banner with Dark Vegetable Texture */}
        <AccountBreadcrumb
          title="Dashboard"
          currentPath="Dashboard"
        />

        {/* 4. Main Account Dashboard (2-Column Layout) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Sidebar: Navigation Card (~240-260px) */}
            <aside className="w-full lg:w-64 shrink-0">
              <AccountSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </aside>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0 w-full">
              {/* Profile Information Cards */}
              <ProfileCards
                user={currentUser}
                onUpdateUser={(updated) => setCurrentUser(updated)}
              />

              {/* Recent Order History Table */}
              <RecentOrdersTable
                userEmail={currentUser?.email}
              />
            </div>
          </div>
        </main>

        {/* 5. Newsletter Section with Social Icons */}
        <EcobazarNewsletter />
      </div>

      {/* 6. Dark Footer */}
      <Footer />
    </div>
  );
};

export default AccountDashboard;
