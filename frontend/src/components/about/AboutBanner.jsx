import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const AboutBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#009406] via-[#00B207] to-[#165032] py-10 sm:py-14 text-white">
      {/* Decorative leaf background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
        <img
          src="/leaves.jpg"
          alt="Leaves texture"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            About Us
          </h1>
          <p className="text-xs sm:text-sm text-green-100 mt-1">
            Learn more about our mission to bring farm-fresh organic food to your home
          </p>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm bg-black/20 backdrop-blur-xs px-4 py-2 rounded-full border border-white/10">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-200 hover:text-white transition"
          >
            <Home size={15} />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-green-300" />
          <span className="text-white font-semibold">About Us</span>
        </nav>
      </div>
    </div>
  );
};

export default AboutBanner;
