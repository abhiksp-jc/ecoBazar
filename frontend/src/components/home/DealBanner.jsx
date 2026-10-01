import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";
import bannerService from "../../services/bannerService";

const DealBanner = () => {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDealBanner = async () => {
      try {
        setLoading(true);
        const banners = await bannerService.getActiveBanners("deal_banner");
        if (isMounted) {
          const activeDeal = banners.find((b) => b.isActive !== false);
          setDeal(activeDeal || null);
        }
      } catch (err) {
        console.error("DealBanner fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDealBanner();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="my-14 animate-pulse">
        <div className="rounded-3xl bg-gray-100 min-h-[300px] sm:min-h-[360px]" />
      </div>
    );
  }

  // If no active deal banner exists in Admin, cleanly hide the section
  if (!deal) {
    return null;
  }

  const bannerImg = deal.image ? getImageUrl(deal.image) : "";

  return (
    <div className="my-14">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#008f05] via-[#009e06] to-[#00b207] text-white p-8 sm:p-14 shadow-md flex flex-col justify-center min-h-[300px] sm:min-h-[360px]">
        {/* Background Image Uploaded from Backend */}
        {bannerImg && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={bannerImg}
              alt={deal.title || "Organic grocery deal"}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent pointer-events-none z-1" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          {deal.badge && (
            <div className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-100 bg-black/20 backdrop-blur-xs px-3.5 py-1.5 rounded-full mb-3">
              {deal.badge}
            </div>
          )}

          {(deal.discountText || deal.subtitle) && (
            <div className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight">
              {deal.discountText || deal.subtitle}
            </div>
          )}

          {deal.title && (
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
              {deal.title}
            </h3>
          )}

          {deal.description && (
            <p className="mt-3 text-xs sm:text-base text-white/90 max-w-md">
              {deal.description}
            </p>
          )}

          <Link
            to={bannerService.getBannerShopLink(deal)}
            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#00B207] shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all group"
          >
            <span>{deal.buttonText || "Shop Now"}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DealBanner;
