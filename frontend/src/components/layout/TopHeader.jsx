import React, { useState, useEffect } from "react";
import {
  MapPin,
  ChevronDown,
  RotateCw,
  Loader2,
  User,
  LogOut,
  X,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Package
} from "lucide-react";
import { clearCustomerSession, startCustomerSession } from "../../utils/authSession";
import CustomerAuthModal from "./CustomerAuthModal";
import { showToast } from "../../utils/sweetalert";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
  return `http://${host}:5000/api`;
};

const TopHeader = () => {
  const [language] = useState("Eng");
  const [currency] = useState("USD");
  const [location, setLocation] = useState("Detecting location...");
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ecobazar_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const fetchLocationByIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (res.ok) {
        const data = await res.json();
        if (data.city && data.country_name) {
          const formatted = `${data.city}${data.region ? `, ${data.region}` : ""}, ${data.country_name}`;
          setLocation(formatted);
          localStorage.setItem("ecobazar_user_location", formatted);
          return;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch("https://ipwho.is/");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.city) {
          const formatted = `${data.city}${data.region ? `, ${data.region}` : ""}, ${data.country}`;
          setLocation(formatted);
          localStorage.setItem("ecobazar_user_location", formatted);
          return;
        }
      }
    } catch (e) {}

    setLocation("Location Unavailable");
  };

  const fetchLocationByGPS = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      fetchLocationByIP().finally(() => setIsLoading(false));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.localityInfo?.administrative?.[2]?.name || "";
            const state = data.principalSubdivision || "";
            const country = data.countryName || "";

            const parts = [city, state, country].filter(Boolean);
            const formatted = parts.length > 0 ? parts.join(", ") : `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

            setLocation(formatted);
            localStorage.setItem("ecobazar_user_location", formatted);
            setIsLoading(false);
            return;
          }
        } catch (err) {}

        await fetchLocationByIP();
        setIsLoading(false);
      },
      async () => {
        await fetchLocationByIP();
        setIsLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchLocationByGPS();
  }, []);

  const handleLogout = () => {
    clearCustomerSession();
    setCurrentUser(null);
    showToast("Signed out successfully.", "info");
  };

  const parseSafeJson = async (res) => {
    try {
      const text = await res.text();
      if (!text || text.trim().startsWith("<")) return null;
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  return (
    <>
      <div className="border-b border-gray-200 bg-white text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={15} className="text-green-600 shrink-0" />
            <span className="text-gray-500">Store Location:</span>
            <span className="font-medium text-gray-800">{location}</span>
            <button
              type="button"
              onClick={fetchLocationByGPS}
              disabled={isLoading}
              className="text-gray-400 hover:text-green-600 p-0.5 rounded transition disabled:opacity-50 cursor-pointer"
              title="Refresh location"
            >
              {isLoading ? (
                <Loader2 size={13} className="animate-spin text-green-600" />
              ) : (
                <RotateCw size={13} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-green-600 transition">
              <span>{language}</span>
              <ChevronDown size={13} />
            </div>

            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-green-600 transition">
              <span>{currency}</span>
              <ChevronDown size={13} />
            </div>

            <span className="text-gray-300">|</span>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <a
                  href="/account"
                  className="hover:text-green-600 font-medium transition flex items-center gap-1 cursor-pointer"
                  title="My Account Dashboard"
                >
                  <User size={13} className="text-green-600" />
                  <span>Dashboard</span>
                </a>
                <a
                  href="/my-orders"
                  className="hover:text-green-600 font-medium transition flex items-center gap-1 cursor-pointer"
                  title="View My Orders"
                >
                  <Package size={13} className="text-green-600" />
                  <span>My Orders</span>
                </a>
                <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="truncate max-w-[120px]">
                    Hi, {currentUser.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hover:text-green-600 font-medium transition cursor-pointer flex items-center gap-1"
              >
                <User size={13} />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(customer) => setCurrentUser(customer)}
      />

    </>
  );
};

export default TopHeader;
