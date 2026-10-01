import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";
import bannerService from "../../services/bannerService";

const PromoBanners = () => {
  // Live ticking countdown timer for Sale of the Month
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "02",
    mins: "18",
    secs: "46"
  });

  const [promoBanners, setPromoBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2 hours, 18 mins, 46 secs countdown target
    const target = Date.now() + (2 * 3600 + 18 * 60 + 46) * 1000;
    const interval = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        mins: String(m).padStart(2, "0"),
        secs: String(s).padStart(2, "0")
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPromoBanners = async () => {
      try {
        setLoading(true);
        const banners = await bannerService.getActiveBanners("promo_middle");
        if (isMounted) {
          setPromoBanners(banners.filter((b) => b.isActive !== false));
        }
      } catch (err) {
        console.warn("Could not load promo banners:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPromoBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="my-10 sm:my-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="rounded-2xl sm:rounded-3xl bg-gray-100 min-h-[480px]" />
          <div className="rounded-2xl sm:rounded-3xl bg-gray-100 min-h-[480px]" />
          <div className="rounded-2xl sm:rounded-3xl bg-gray-100 min-h-[480px]" />
        </div>
      </div>
    );
  }

  // If no active banners exist for promo_middle, hide cleanly
  if (promoBanners.length === 0) {
    return null;
  }

  return (
    <div className="my-10 sm:my-14">
      <div
        className={`grid grid-cols-1 ${
          promoBanners.length === 1
            ? "md:grid-cols-1 max-w-lg mx-auto"
            : promoBanners.length === 2
            ? "md:grid-cols-2 max-w-4xl mx-auto"
            : "md:grid-cols-3"
        } gap-6`}
      >
        {promoBanners.slice(0, 3).map((card, idx) => {
          const bannerUrl = card.image ? getImageUrl(card.image) : "";

          // ================= CARD 1: BLUE - SALE OF THE MONTH =================
          if (idx === 0) {
            return (
              <Link
                key={card._id || idx}
                to={bannerService.getBannerShopLink(card)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col justify-between min-h-[460px] sm:min-h-[490px] lg:min-h-[510px] cursor-pointer bg-[#1E77C4]"
              >
                {/* Background Image anchored to bottom */}
                {bannerUrl && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={bannerUrl}
                      alt={card.title || "Sale of the Month"}
                      className="w-full h-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Top Center Content */}
                <div className="relative z-10 pt-7 sm:pt-9 px-4 sm:px-6 text-center flex flex-col items-center">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-white/90 uppercase mb-2">
                    {card.badge || "BEST DEALS"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-tight mb-3">
                    {card.title || "Sale of the Month"}
                  </h3>

                  {/* Countdown Timer */}
                  <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-white mb-5">
                    <div className="text-center min-w-[32px]">
                      <span className="text-xl sm:text-2xl font-light tracking-tight">
                        {timeLeft.days}
                      </span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-white/80 font-medium mt-0.5">
                        DAYS
                      </span>
                    </div>
                    <span className="text-base sm:text-lg text-white/70 -mt-3.5 font-light">:</span>
                    <div className="text-center min-w-[32px]">
                      <span className="text-xl sm:text-2xl font-light tracking-tight">
                        {timeLeft.hours}
                      </span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-white/80 font-medium mt-0.5">
                        HOURS
                      </span>
                    </div>
                    <span className="text-base sm:text-lg text-white/70 -mt-3.5 font-light">:</span>
                    <div className="text-center min-w-[32px]">
                      <span className="text-xl sm:text-2xl font-light tracking-tight">
                        {timeLeft.mins}
                      </span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-white/80 font-medium mt-0.5">
                        MINS
                      </span>
                    </div>
                    <span className="text-base sm:text-lg text-white/70 -mt-3.5 font-light">:</span>
                    <div className="text-center min-w-[32px]">
                      <span className="text-xl sm:text-2xl font-light tracking-tight">
                        {timeLeft.secs}
                      </span>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-white/80 font-medium mt-0.5">
                        SECS
                      </span>
                    </div>
                  </div>

                  {/* Shop Now Button */}
                  <span className="inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md group-hover:shadow-lg group-hover:bg-gray-50 transition-all duration-300">
                    <span>{card.buttonText || "Shop Now"}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* Empty bottom spacer to keep height balanced above bottom imagery */}
                <div className="relative z-10 h-16 pointer-events-none" />
              </Link>
            );
          }

          // ================= CARD 2: BLACK - LOW-FAT MEAT =================
          if (idx === 1) {
            const rawDiscount = card.discountText || "";
            const priceText = rawDiscount.includes("$")
              ? rawDiscount.replace(/^Started at\s*/i, "").trim()
              : "$79.99";

            return (
              <Link
                key={card._id || idx}
                to={bannerService.getBannerShopLink(card)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col justify-between min-h-[460px] sm:min-h-[490px] lg:min-h-[510px] cursor-pointer bg-black"
              >
                {/* Background Image anchored to bottom */}
                {bannerUrl && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={bannerUrl}
                      alt={card.title || "Low-Fat Meat"}
                      className="w-full h-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Top Center Content */}
                <div className="relative z-10 pt-7 sm:pt-9 px-4 sm:px-6 text-center flex flex-col items-center">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-white/90 uppercase mb-2">
                    {card.badge || "85% FAT FREE"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-tight mb-3">
                    {card.title || "Low-Fat Meat"}
                  </h3>

                  {/* Price subtitle */}
                  <div className="mb-6 text-sm sm:text-base font-normal text-white flex items-center justify-center gap-1.5">
                    <span>Started at</span>
                    <span className="text-[#FF8A00] font-bold text-base sm:text-lg">
                      {priceText}
                    </span>
                  </div>

                  {/* Shop Now Button */}
                  <span className="inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md group-hover:shadow-lg group-hover:bg-gray-50 transition-all duration-300">
                    <span>{card.buttonText || "Shop Now"}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* Empty bottom spacer */}
                <div className="relative z-10 h-16 pointer-events-none" />
              </Link>
            );
          }

          // ================= CARD 3: YELLOW - 100% FRESH FRUIT =================
          const discountPillText = (card.discountText || "64% OFF")
            .replace(/^Up to\s*/i, "")
            .trim();

          return (
            <Link
              key={card._id || idx}
              to={bannerService.getBannerShopLink(card)}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col justify-between min-h-[460px] sm:min-h-[490px] lg:min-h-[510px] cursor-pointer bg-[#FFB800]"
            >
              {/* Background Image anchored to bottom */}
              {bannerUrl && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={bannerUrl}
                    alt={card.title || "100% Fresh Fruit"}
                    className="w-full h-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Top Center Content (Dark Text for yellow card) */}
              <div className="relative z-10 pt-7 sm:pt-9 px-4 sm:px-6 text-center flex flex-col items-center">
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-[#1A1A1A]/90 uppercase mb-2">
                  {card.badge || "SUMMER SALE"}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1A1A1A] tracking-tight leading-tight mb-3">
                  {card.title || "100% Fresh Fruit"}
                </h3>

                {/* Subtitle / badge: "Up to [ 64% OFF ]" */}
                <div className="mb-6 text-sm sm:text-base font-normal text-[#1A1A1A] flex items-center justify-center gap-2">
                  <span>Up to</span>
                  <span className="bg-[#1A1A1A] text-[#FFC107] font-bold text-xs sm:text-sm px-3 py-1 rounded-sm uppercase tracking-wider">
                    {discountPillText}
                  </span>
                </div>

                {/* Shop Now Button */}
                <span className="inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md group-hover:shadow-lg group-hover:bg-gray-50 transition-all duration-300">
                  <span>{card.buttonText || "Shop Now"}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              {/* Empty bottom spacer */}
              <div className="relative z-10 h-16 pointer-events-none" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PromoBanners;
