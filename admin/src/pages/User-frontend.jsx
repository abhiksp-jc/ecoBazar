import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronDown,
  Search,
  Heart,
  ShoppingBag,
  PhoneCall,
  ArrowRight,
  Truck,
  Headphones,
  ShieldCheck,
  Package,
  Sprout,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";
import { getBanners } from "../services/authService";
import UserFrontendHero from "../components/userFrontend/UserFrontendHero";
import UserFrontendFeatures from "../components/userFrontend/UserFrontendFeatures";

const getBannerImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const backendBase =
    import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";
  return `${backendBase.replace(/\/$/, "")}${img.startsWith("/") ? "" : "/"}${img}`;
};

const getProductImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  return `${base}${img.startsWith("/") ? "" : "/"}${img}`;
};

const UserFrontend = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("Eng");
  const [currency, setCurrency] = useState("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [cartTotal, setCartTotal] = useState("57.00");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Banners from Admin Side
  const [mainBanner, setMainBanner] = useState(null);
  const [topBanner, setTopBanner] = useState(null);
  const [bottomBanner, setBottomBanner] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners(false);
        const list = data.banners || [];
        const foundMain = list.find(
          (b) => b.position === "hero_main" && b.isActive !== false
        );
        const foundTop = list.find(
          (b) => b.position === "hero_top_right" && b.isActive !== false
        );
        const foundBottom = list.find(
          (b) => b.position === "hero_bottom_right" && b.isActive !== false
        );

        setMainBanner(foundMain || null);
        setTopBanner(foundTop || null);
        setBottomBanner(foundBottom || null);
      } catch (err) {
        console.error("Failed to load banners from admin backend:", err);
      }
    };

    fetchBanners();
  }, []);

  // Logon User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ecobazar_user") || localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ecobazar_user");
    localStorage.removeItem("admin");
    setCurrentUser(null);
    setUserDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 1. TOP UTILITY HEADER */}
      <div className="border-b border-gray-200 bg-white text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin size={15} className="text-gray-400 shrink-0" />
            <span>Store Location: Lincoln- 344, Illinois, Chicago, USA</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Language */}
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-green-600 transition">
              <span>{language}</span>
              <ChevronDown size={13} />
            </div>

            {/* Currency */}
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-green-600 transition">
              <span>{currency}</span>
              <ChevronDown size={13} />
            </div>

            {/* Divider */}
            <span className="text-gray-300">|</span>

            {/* Auth Link */}
            <Link
              to="/login"
              className="hover:text-green-600 font-medium transition"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, Wishlist & Cart) */}
      <div className="bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/user-frontend" className="flex items-center gap-2">
            <div className="flex items-center justify-center text-green-600">
              <Sprout size={32} className="stroke-[2.5]" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Ecobazar
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <form
              onSubmit={handleSearch}
              className="w-full flex items-center border border-gray-300 focus-within:border-green-600 rounded-lg overflow-hidden transition shadow-2xs bg-white"
            >
              <div className="pl-3.5 text-gray-400 shrink-0">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search fresh groceries, fruits, vegetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 mr-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-6 py-2.5 transition shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* User Actions (Wishlist, Logon & Cart) */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-green-600 transition relative p-1"
              title="Wishlist"
            >
              <Heart size={26} className="stroke-[1.6]" />
            </Link>

            {/* Separator */}
            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />

            {/* Logon / User Account */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition cursor-pointer focus:outline-none"
                    title="Account Profile"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs border border-green-200 overflow-hidden">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : <User size={16} />}
                    </div>
                    <div className="hidden lg:flex flex-col text-left leading-tight">
                      <span className="text-[10px] text-gray-400 font-medium">Hello,</span>
                      <span className="text-xs font-bold text-gray-800 max-w-[85px] truncate">
                        {currentUser.name?.split(" ")[0] || "User"}
                      </span>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-xl border border-gray-100 z-50 text-xs animate-fade-in">
                      <div className="px-3 py-2 border-b border-gray-100 font-semibold text-gray-800">
                        {currentUser.name || currentUser.email}
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                      >
                        <User size={14} />
                        <span>My Account</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition p-1 cursor-pointer group"
                  title="Sign In / Log In"
                >
                  <User size={25} className="stroke-[1.6] text-gray-700 group-hover:text-green-600 transition" />
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-[10px] text-gray-400 font-medium">Hello,</span>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-green-600 transition">Log In</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Separator */}
            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />

            {/* Shopping Cart */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <ShoppingBag
                  size={28}
                  className="stroke-[1.6] text-gray-800 group-hover:text-green-600 transition"
                />
                <span className="absolute -top-1.5 -right-2 bg-green-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Shopping cart:
                </span>
                <span className="text-sm font-bold text-gray-900">
                  ${cartTotal}
                </span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-green-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 mt-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-300 focus-within:border-green-600 rounded-lg overflow-hidden"
          >
            <div className="pl-3 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-green-600 text-white font-medium text-xs px-4 py-2"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 3. DARK NAVIGATION BAR */}
      <nav className="bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 text-sm font-medium">
            <Link
              to="/user-frontend"
              className="flex items-center gap-1.5 py-4 text-white hover:text-green-400 transition"
            >
              <span>Home</span>
              <ChevronDown size={14} />
            </Link>

            <Link
              to="/shop/products"
              className="flex items-center gap-1.5 py-4 text-gray-300 hover:text-white transition"
            >
              <span>Shop</span>
              <ChevronDown size={14} />
            </Link>

            <div className="flex items-center gap-1.5 py-4 text-gray-300 hover:text-white cursor-pointer transition">
              <span>Pages</span>
              <ChevronDown size={14} />
            </div>

            <div className="flex items-center gap-1.5 py-4 text-gray-300 hover:text-white cursor-pointer transition">
              <span>Blog</span>
              <ChevronDown size={14} />
            </div>

            <Link
              to="/shop/terms"
              className="py-4 text-gray-300 hover:text-white transition"
            >
              About Us
            </Link>

            <Link
              to="/shop/faq"
              className="py-4 text-gray-300 hover:text-white transition"
            >
              Contact Us
            </Link>
          </div>

          {/* Right Phone Contact */}
          <div className="flex items-center gap-2 py-3 lg:py-0 text-white text-sm font-medium">
            <PhoneCall size={17} className="text-white" />
            <span>(219) 555-0114</span>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 px-4 py-3 space-y-2 text-sm">
            <Link
              to="/user-frontend"
              className="block py-2 text-white font-medium hover:text-green-400"
            >
              Home
            </Link>
            <Link
              to="/shop/products"
              className="block py-2 text-gray-300 hover:text-white"
            >
              Shop
            </Link>
            <div className="block py-2 text-gray-300 hover:text-white cursor-pointer">
              Pages
            </div>
            <div className="block py-2 text-gray-300 hover:text-white cursor-pointer">
              Blog
            </div>
            <Link
              to="/shop/terms"
              className="block py-2 text-gray-300 hover:text-white"
            >
              About Us
            </Link>
            <Link
              to="/shop/faq"
              className="block py-2 text-gray-300 hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        )}
      </nav>

      {/* 4. HERO SECTION & FEATURES */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <UserFrontendHero
          mainBanner={mainBanner}
          topBanner={topBanner}
          bottomBanner={bottomBanner}
          getBannerImageUrl={getBannerImageUrl}
        />
        <UserFrontendFeatures />
      </main>
   </div>
  );
};

export default UserFrontend;
