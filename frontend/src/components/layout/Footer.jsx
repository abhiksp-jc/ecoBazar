import React from "react";
import { Link } from "react-router-dom";
import { Lock, Phone, Mail, MapPin } from "lucide-react";
import Logo from "../../assets/Logo.png";

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#121212] text-gray-400 font-sans border-t border-gray-900">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-90 transition">
              <img
                src={Logo}
                alt="Ecobazar"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-5 max-w-sm">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec. We provide farm-fresh organic food directly to your doorstep.
            </p>

            <div className="flex flex-col gap-2 text-xs sm:text-sm">
              <a
                href="tel:2195550114"
                className="inline-flex items-center gap-2 text-white hover:text-[#00B207] transition"
              >
                <Phone size={15} className="text-[#00B207]" />
                <span>(219) 555-0114</span>
              </a>
              <a
                href="mailto:support@ecobazar.com"
                className="inline-flex items-center gap-2 text-white hover:text-[#00B207] transition"
              >
                <Mail size={15} className="text-[#00B207]" />
                <span>abhikashyap252525@gmail.com</span>
              </a>
              <div className="inline-flex items-center gap-2 text-gray-400">
                <MapPin size={15} className="text-[#00B207]" />
                <span>Mohali,punjab ,Haryana</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition"
              >
                <TwitterIcon size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>

          {/* My Account */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              My Account
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/account" className="hover:text-[#00B207] transition">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-[#00B207] transition">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#00B207] transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#00B207] transition">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account/settings" className="hover:text-[#00B207] transition">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Helps */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Helps
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="hover:text-[#00B207] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00B207] transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-[#00B207] transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#00B207] transition">
                  Terms &amp; Condition
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#00B207] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-[#00B207] transition text-gray-400 hover:underline">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Proxy / Categories */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/categories" className="hover:text-[#00B207] transition">
                  Fruit &amp; Vegetables
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#00B207] transition">
                  Meat &amp; Fish
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#00B207] transition">
                  Bread &amp; Bakery
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#00B207] transition">
                  Beauty &amp; Health
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Ecobazar eCommerce © 2026. All Rights Reserved
          </p>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Apple Pay */}
            <div className="flex items-center gap-1 bg-[#1f1f1f] border border-gray-800 rounded px-2.5 py-1 text-white text-[11px] font-semibold">
              <span>Apple Pay</span>
            </div>

            {/* Visa */}
            <div className="bg-white rounded px-2.5 py-1 text-[#00579f] text-[11px] font-black italic">
              VISA
            </div>

            {/* Discover */}
            <div className="flex items-center gap-1 bg-[#1f1f1f] border border-gray-800 rounded px-2.5 py-1 text-white text-[10px] font-bold">
              <span>DISCOVER</span>
            </div>

            {/* Mastercard */}
            <div className="flex items-center bg-[#1f1f1f] border border-gray-800 rounded px-2.5 py-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block -mr-1"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] inline-block"></span>
            </div>

            {/* Secure */}
            <div className="flex items-center gap-1.5 bg-[#1f1f1f] border border-gray-800 rounded px-2.5 py-1">
              <Lock size={12} className="text-[#00B207]" />
              <span className="text-[10px] text-gray-300 font-semibold leading-tight">
                Secure Payment
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
