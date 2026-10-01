import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const UserFrontendHero = ({
  mainBanner,
  topBanner,
  bottomBanner,
  getBannerImageUrl,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Left Hero Banner (approx 66% width) */}
      <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-[#00B207] min-h-[440px] sm:min-h-[480px] flex flex-col justify-center p-8 sm:p-12 shadow-sm">
        {/* Background Decorative Lighting/Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />

        {/* Right Photo Positioned (from Admin) */}
        {mainBanner?.image && (
          <div className="absolute right-0 bottom-0 top-0 w-1/2 sm:w-7/12 flex items-end justify-end pointer-events-none overflow-hidden">
            <img
              src={getBannerImageUrl(mainBanner.image)}
              alt={mainBanner.title || "Hero Banner"}
              className="w-full h-full object-cover object-center mix-blend-normal opacity-95 transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Left Content (from Admin) */}
        <div className="relative z-10 max-w-md text-white">
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.15] tracking-tight">
            {mainBanner?.title || "Fresh & Healthy Organic Food"}
          </h1>

          {(mainBanner?.subtitle || mainBanner?.badge || mainBanner?.discountText) && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-white/95">
                {mainBanner?.subtitle || mainBanner?.badge || "Sale up to"}
              </span>
              {mainBanner?.discountText && (
                <span className="bg-[#FF8A00] text-white font-bold text-xs uppercase px-2.5 py-1 rounded shadow-sm">
                  {mainBanner.discountText}
                </span>
              )}
            </div>
          )}

          <p className="mt-2 text-xs sm:text-sm text-white/80">
            {mainBanner?.description || "Free shipping on all your order."}
          </p>

          <Link
            to={mainBanner?.buttonLink || "/shop"}
            className="mt-7 inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-gray-100 hover:shadow-lg transition-all transform active:scale-95"
          >
            <span>{mainBanner?.buttonText || "Shop now"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Right Side 2 Stacked Banners (approx 34% width) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Top Card: Summer Sale (from Admin) */}
        <div className="relative rounded-2xl overflow-hidden bg-[#F2F2F2] p-6 sm:p-7 min-h-[225px] flex flex-col justify-between shadow-sm">
          {topBanner?.image && (
            <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end pointer-events-none overflow-hidden">
              <img
                src={getBannerImageUrl(topBanner.image)}
                alt={topBanner.title || "Summer Sale"}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="relative z-10 max-w-[60%]">
            <span className="text-[11px] font-bold tracking-wider text-gray-800 uppercase">
              {topBanner?.badge || topBanner?.subtitle || "SUMMER SALE"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              {topBanner?.discountText || topBanner?.title || "75% OFF"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {topBanner?.description || "Only Fruit & Vegetable"}
            </p>

            <Link
              to={topBanner?.buttonLink || "/shop"}
              className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-green-600 hover:text-green-700 hover:gap-2 transition-all"
            >
              <span>{topBanner?.buttonText || "Shop Now"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom Card: Special Products Deal of the Month */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0A341E] p-6 sm:p-7 min-h-[225px] flex flex-col justify-center items-center text-center text-white shadow-sm">
          {bottomBanner?.image && (
            <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
              <img
                src={getBannerImageUrl(bottomBanner.image)}
                alt={bottomBanner.title || "Special Deal"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="relative z-10">
            <span className="text-[11px] font-bold tracking-widest text-green-300 uppercase">
              {bottomBanner?.badge || bottomBanner?.subtitle || "BEST DEAL"}
            </span>
            <h3 className="text-2xl font-bold text-white leading-snug mt-1">
              {bottomBanner?.title || "Special Products Deal of the Month"}
            </h3>

            <Link
              to={bottomBanner?.buttonLink || "/shop"}
              className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-green-400 hover:text-green-300 hover:gap-2 transition-all"
            >
              <span>{bottomBanner?.buttonText || "Shop Now"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFrontendHero;
