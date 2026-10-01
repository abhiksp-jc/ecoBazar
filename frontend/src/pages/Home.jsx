import React, { useState } from "react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import HeroBanners from "../components/home/HeroBanners";
import FeatureCards from "../components/home/FeatureCards";
import PopularCategories from "../components/home/PopularCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PromoBanners from "../components/home/PromoBanners";
import BestSelling from "../components/home/BestSelling";
import LatestProducts from "../components/home/LatestProducts";
import HotDeals from "../components/home/HotDeals";
import DealBanner from "../components/home/DealBanner";
import Testimonials from "../components/home/Testimonials";
import BlogSection from "../components/home/BlogSection";
import InstagramGallery from "../components/home/InstagramGallery";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/layout/Footer";

const Home = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 1. Header (Top bar + Main Header with Search & Cart + Navigation Bar) */}
      <TopHeader />

      <div className="sticky top-0 z-40 bg-white shadow-xs">
        <MainHeader
          isMobileNavOpen={mobileNavOpen}
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
        />

        <Navbar
          isMobileNavOpen={mobileNavOpen}
          onCloseMobileNav={() => setMobileNavOpen(false)}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 overflow-hidden">
        {/* 2. Hero Section */}
        <HeroBanners />

        {/* 3. Feature / Service Bar */}
        <FeatureCards />

        {/* 4. Popular Categories */}
        <PopularCategories />

        {/* 5. Featured Products */}
        <FeaturedProducts />

        {/* 6. Promotional Banners (3-column middle cards) */}
        <PromoBanners />

        {/* 7. Best Selling / Top Products */}
        <BestSelling />

        {/* 8. Latest Products */}
        <LatestProducts />

        {/* 10. Product Grid / Hot Deals */}
        <HotDeals />

        {/* 11. Deal / Discount Banner */}
        <DealBanner />

        {/* 12. Latest News / Blog Section */}
        <BlogSection />

        {/* 13. Testimonials / Feedback Section */}
        <Testimonials />

        {/* 14. Instagram / Social Section */}
        <InstagramGallery />

        {/* 15. Newsletter Section */}
        <Newsletter />
      </main>

      {/* 16. Footer */}
      <Footer />
    </div>
  );
};

export default Home;
