import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X, User, LogOut, Package, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getImageUrl } from "../../utils/imageUrl";
import { clearCustomerSession } from "../../utils/authSession";
import { showToast } from "../../utils/sweetalert";
import Logo from "../../assets/Logo.png";

const MainHeader = ({ onToggleMobileNav, isMobileNavOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [isSearching, setIsSearching] = useState(false);
  const lastQueryRef = useRef(searchParams.get("search") || "");

  const { wishlistCount } = useWishlist();
  const [currentUser, setCurrentUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { totalCount, subtotal, openCart } = useCart();

  useEffect(() => {
    const checkUser = () => {
      try {
        const savedUser = localStorage.getItem("ecobazar_user");
        setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  // Sync input if URL search parameter changes externally (e.g., cleared on Shop page)
  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    if (urlQuery !== searchQuery && urlQuery !== lastQueryRef.current) {
      setSearchQuery(urlQuery);
      lastQueryRef.current = urlQuery;
    }
  }, [searchParams]);

  // Execute search navigation / state update
  const executeSearch = (rawQuery) => {
    const trimmed = rawQuery.trim();
    lastQueryRef.current = trimmed;
    setIsSearching(false);

    if (location.pathname === "/shop") {
      const nextParams = new URLSearchParams(searchParams);
      if (trimmed) {
        nextParams.set("search", trimmed);
      } else {
        nextParams.delete("search");
      }
      setSearchParams(nextParams, { replace: true });
    } else {
      if (trimmed) {
        navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  // Real-time Debouncing (400ms delay):
  // 1. User types -> starts timer
  // 2. Keystroke before delay cancels previous pending search
  // 3. Executes search after user pauses typing
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed === lastQueryRef.current) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearch = (e) => {
    e?.preventDefault();
    executeSearch(searchQuery);
    if (location.pathname !== "/shop") {
      const trimmed = searchQuery.trim();
      navigate(trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : "/shop");
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    executeSearch("");
  };

  const handleLogout = () => {
    clearCustomerSession();
    setCurrentUser(null);
    setUserDropdownOpen(false);
    showToast("Signed out successfully.", "info");
    navigate("/");
  };

  return (
    <div className="bg-white py-4 sm:py-5 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 hover:opacity-95 transition">
          <img
            src={Logo}
            alt="Ecobazar"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4 sm:mx-8">
          <form
            onSubmit={handleSearch}
            className="w-full flex items-center border border-gray-300 focus-within:border-[#00B207] rounded-lg overflow-hidden transition shadow-2xs bg-white"
          >
            <div className="pl-3.5 text-gray-400 shrink-0">
              <Search size={19} />
            </div>
            <input
              type="text"
              placeholder="Search fresh groceries, fruits, vegetables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <div className="flex items-center pr-2 shrink-0 h-full">
              {isSearching ? (
                <div className="p-1 text-[#00B207] animate-spin" title="Searching products...">
                  <Loader2 size={16} />
                </div>
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              ) : null}
            </div>
            <button
              type="submit"
              className="bg-[#00B207] hover:bg-[#009406] text-white font-semibold text-sm px-6 py-2.5 transition shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Header Icons & Actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="text-gray-700 hover:text-[#00B207] transition relative p-1 group"
            title="Wishlist"
          >
            <Heart
              size={26}
              className={`stroke-[1.6] transition-all duration-200 group-hover:scale-105 ${
                wishlistCount > 0 ? "text-[#00B207] fill-[#00B207]/20" : ""
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#00B207] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Separator */}
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />

          {/* User Logon / Account State */}
          <div className="relative">
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#00B207] transition focus:outline-none cursor-pointer"
                  title="My Account"
                >
                  <div className="w-8 h-8 rounded-full bg-green-50 text-[#00B207] flex items-center justify-center font-bold text-xs border border-green-200 overflow-hidden shrink-0">
                    {currentUser.profileImage ? (
                      <img
                        src={getImageUrl(currentUser.profileImage)}
                        alt={currentUser.firstName || currentUser.name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      (currentUser.firstName || currentUser.name)
                        ? (currentUser.firstName || currentUser.name)[0].toUpperCase()
                        : <User size={16} />
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col text-left leading-tight">
                    <span className="text-[10px] text-gray-400 font-medium">Hello,</span>
                    <span className="text-xs font-bold text-gray-800 max-w-[80px] truncate">
                      {currentUser.firstName || currentUser.name?.split(" ")[0] || "Account"}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-xl border border-gray-150 z-50 text-xs animate-fade-in">
                    <div className="px-3 py-2 border-b border-gray-100 font-semibold text-gray-800">
                      Hello, {currentUser.firstName || currentUser.name || "User"}
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#00B207] transition"
                    >
                      <User size={15} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#00B207] transition"
                    >
                      <Package size={15} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/account/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#00B207] transition"
                    >
                      <User size={15} />
                      <span>Settings</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-[#00B207] transition p-1 cursor-pointer group"
                title="Sign In / Log In"
              >
                <User size={25} className="stroke-[1.6] text-gray-700 group-hover:text-[#00B207] transition" />
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-[10px] text-gray-400 font-medium">Hello,</span>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#00B207] transition">Log In</span>
                </div>
              </Link>
            )}
          </div>

          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />

          {/* Cart Icon & Total Bill */}
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none"
            aria-label="Open shopping cart"
          >
            <div className="relative">
              <ShoppingBag
                size={28}
                className="stroke-[1.6] text-gray-800 group-hover:text-[#00B207] transition"
              />
              <span className="absolute -top-1.5 -right-2 bg-[#00B207] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalCount}
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] text-gray-500 uppercase tracking-wide leading-none">
                Shopping cart:
              </span>
              <span className="text-sm font-bold text-gray-900 mt-0.5">
                ${subtotal}
              </span>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="lg:hidden p-1.5 text-gray-700 hover:text-[#00B207]"
          >
            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 mt-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center border border-gray-300 focus-within:border-[#00B207] rounded-lg overflow-hidden"
        >
          <div className="pl-3 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-xs text-gray-800 focus:outline-none"
          />
          <div className="flex items-center pr-2 shrink-0">
            {isSearching ? (
              <div className="text-[#00B207] animate-spin">
                <Loader2 size={14} />
              </div>
            ) : searchQuery ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            className="bg-[#00B207] text-white font-semibold text-xs px-4 py-2"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainHeader;
