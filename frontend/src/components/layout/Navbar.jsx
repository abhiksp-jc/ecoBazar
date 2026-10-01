import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, PhoneCall } from "lucide-react";

const Navbar = ({ isMobileNavOpen, onCloseMobileNav }) => {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "Dashboard", path: "/account" },
    { name: "My Orders", path: "/my-orders" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);

  return (
    <nav className="bg-[#1A1A1A] text-white relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-7 text-sm font-medium">
          <Link
            to="/"
            className={`py-4 transition-colors flex items-center gap-1 ${
              location.pathname === "/"
                ? "text-[#00B207] font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <span>Home</span>
            <ChevronDown size={14} className="opacity-70" />
          </Link>

          <Link
            to="/shop"
            className={`py-4 transition-colors flex items-center gap-1 ${
              location.pathname.startsWith("/shop")
                ? "text-[#00B207] font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <span>Shop</span>
            <ChevronDown size={14} className="opacity-70" />
          </Link>

          {/* Pages Dropdown */}
          <div
            className="relative py-4"
            onMouseEnter={() => setPagesDropdownOpen(true)}
            onMouseLeave={() => setPagesDropdownOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                location.pathname.startsWith("/account") ||
                location.pathname.startsWith("/faqs")
                  ? "text-[#00B207] font-semibold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <span>Pages</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>

            {pagesDropdownOpen && (
              <div className="absolute top-full left-0 w-52 bg-white text-gray-800 rounded-xl shadow-xl py-2 border border-gray-150 z-50 text-xs">
                <Link
                  to="/account"
                  className="flex items-center px-4 py-2.5 hover:bg-green-50 hover:text-[#00B207] transition font-medium"
                >
                  Customer Dashboard
                </Link>
                <Link
                  to="/account/settings"
                  className="flex items-center px-4 py-2.5 hover:bg-green-50 hover:text-[#00B207] transition font-medium"
                >
                  Account Settings
                </Link>
                <Link
                  to="/my-orders"
                  className="flex items-center px-4 py-2.5 hover:bg-green-50 hover:text-[#00B207] transition font-medium"
                >
                  Order History
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center px-4 py-2.5 hover:bg-green-50 hover:text-[#00B207] transition font-medium"
                >
                  Shopping Cart
                </Link>
                <Link
                  to="/checkout"
                  className="flex items-center px-4 py-2.5 hover:bg-green-50 hover:text-[#00B207] transition font-medium"
                >
                  Checkout
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <Link
                  to="/faqs"
                  className="flex items-center px-4 py-2.5 hover:bg-green-50 hover:text-[#00B207] transition font-medium"
                >
                  FAQs
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/about"
            className={`py-4 transition-colors flex items-center gap-1 ${
              location.pathname === "/about"
                ? "text-[#00B207] font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <span>About Us</span>
          </Link>

          <Link
            to="/contact"
            className={`py-4 transition-colors flex items-center gap-1 ${
              location.pathname === "/contact"
                ? "text-[#00B207] font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <span>Contact Us</span>
          </Link>
        </div>

        {/* Customer Support Phone */}
        <div className="flex items-center gap-2 py-3 lg:py-0 text-white text-sm font-medium">
          <PhoneCall size={16} className="text-[#00B207]" />
          <span>(219) 555-0114</span>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden border-t border-gray-800 px-4 py-3 space-y-1 text-sm bg-[#1A1A1A]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={onCloseMobileNav}
              className="block py-2.5 px-3 rounded-lg text-gray-200 hover:bg-gray-800 hover:text-[#00B207] font-medium transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
