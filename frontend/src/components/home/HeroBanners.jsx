
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import bannerService from "../../services/bannerService";

const HeroBanners = () => {
  const [mainBanner, setMainBanner] = useState(null);
  const [topBanner, setTopBanner] = useState(null);
  const [bottomBanner, setBottomBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadBanners = async () => {
      try {
        setLoading(true);

        const banners = await bannerService.getActiveBanners();

        if (!mounted) return;

        const main = banners.find(
          (banner) =>
            banner.position === "hero_main" &&
            banner.isActive !== false
        );

        const top = banners.find(
          (banner) =>
            banner.position === "hero_top_right" &&
            banner.isActive !== false
        );

        const bottom = banners.find(
          (banner) =>
            banner.position === "hero_bottom_right" &&
            banner.isActive !== false
        );

        setMainBanner(main || null);
        setTopBanner(top || null);
        setBottomBanner(bottom || null);
      } catch (error) {
        console.error("Hero banner error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBanners();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-[1200px] mx-auto px-4 my-5">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2">
          <div className="h-[280px] sm:h-[320px] lg:h-[400px] bg-gray-200 rounded-md animate-pulse" />

          <div className="grid grid-cols-1 gap-2">
            <div className="h-[190px] lg:h-[196px] bg-gray-200 rounded-md animate-pulse" />
            <div className="h-[190px] lg:h-[196px] bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const hasMain = Boolean(mainBanner);
  const hasTop = Boolean(topBanner);
  const hasBottom = Boolean(bottomBanner);

  if (!hasMain && !hasTop && !hasBottom) {
    return null;
  }

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 my-5">
      <div
        className={`grid grid-cols-1 ${hasMain && (hasTop || hasBottom)
          ? "lg:grid-cols-[2fr_1fr]"
          : "lg:grid-cols-1"
          } gap-2`}
      >
        {hasMain && (
          <div className="relative h-[280px] sm:h-[330px] lg:h-[400px] overflow-hidden rounded-md group">
            {mainBanner.image && (
              <img
                src={getImageUrl(mainBanner.image)}
                alt={mainBanner.title || "Hero Banner"}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

            <div className="relative z-10 h-full flex items-center">
              <div className="w-full sm:w-[55%] px-6 sm:px-8 lg:px-10 py-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {mainBanner.badge && (
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-white/90 mb-2">
                    {mainBanner.badge}
                  </p>
                )}

                <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold leading-[1.08] max-w-[360px]">
                  {mainBanner.title}
                </h1>

                {(mainBanner.subtitle || mainBanner.discountText) && (
                  <div className="flex items-center gap-2 mt-4">
                    <span className="w-[2px] h-7 bg-white/40 rounded-full" />

                    <div className="flex flex-wrap items-center gap-2">
                      {mainBanner.subtitle && (
                        <span className="text-xs sm:text-sm text-white">
                          {mainBanner.subtitle}
                        </span>
                      )}

                      {mainBanner.discountText && (
                        <span className="bg-[#ff8a00] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded">
                          {mainBanner.discountText}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {mainBanner.description && (
                  <p className="text-[10px] sm:text-xs text-white/90 mt-2 max-w-[260px]">
                    {mainBanner.description}
                  </p>
                )}

                <Link
                  to={bannerService.getBannerShopLink(mainBanner)}
                  className="inline-flex items-center gap-2 mt-5 bg-white text-[#00a63c] hover:bg-gray-100 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md"
                >
                  <span>{mainBanner.buttonText || "Shop now"}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {(hasTop || hasBottom) && (
          <div className="grid grid-cols-1 gap-2">
            {hasTop && (
              <div className="relative h-[190px] lg:h-[196px] overflow-hidden rounded-md group">
                {topBanner.image && (
                  <img
                    src={getImageUrl(topBanner.image)}
                    alt={topBanner.title || "Top Banner"}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="relative z-10 h-full flex items-center">
                  <div className="w-full sm:w-[60%] px-5 sm:px-6 drop-shadow-sm">
                    {topBanner.subtitle && (
                      <p className="text-[8px] sm:text-[9px] uppercase tracking-wide text-gray-700 font-semibold mb-1">
                        {topBanner.subtitle}
                      </p>
                    )}

                    <h2 className="text-lg sm:text-xl lg:text-[24px] font-bold text-gray-900 leading-tight">
                      {topBanner.discountText || topBanner.title}
                    </h2>

                    {topBanner.description && (
                      <p className="text-[8px] sm:text-[9px] text-gray-600 mt-1 line-clamp-1">
                        {topBanner.description}
                      </p>
                    )}

                    <Link
                      to={bannerService.getBannerShopLink(topBanner)}
                      className="inline-flex items-center gap-1 mt-3 text-[9px] sm:text-[10px] font-bold text-[#00a63c] hover:text-[#008a2e] bg-white/90 hover:bg-white px-2.5 py-1 rounded shadow-xs transition"
                    >
                      <span>{topBanner.buttonText || "Shop Now"}</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {hasBottom && (
              <div className="relative h-[190px] lg:h-[196px] overflow-hidden rounded-md bg-[#073b1c] group">
                {bottomBanner.image && (
                  <img
                    src={getImageUrl(bottomBanner.image)}
                    alt={bottomBanner.title || "Bottom Banner"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-[#003d1a]/60" />

                <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-5">
                  <div>
                    {bottomBanner.subtitle && (
                      <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-white/80 font-semibold">
                        {bottomBanner.subtitle}
                      </p>
                    )}

                    <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold leading-tight mt-1 max-w-[240px] mx-auto">
                      {bottomBanner.title}
                    </h3>

                    <Link
                      to={bannerService.getBannerShopLink(bottomBanner)}
                      className="inline-flex items-center gap-1 mt-3 text-[9px] sm:text-[10px] font-bold text-[#72e29a] hover:text-white"
                    >
                      <span>{bottomBanner.buttonText || "Shop Now"}</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanners;

