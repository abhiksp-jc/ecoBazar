import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Home, ChevronRight } from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import EcobazarNewsletter from "../components/common/EcobazarNewsletter";
import Footer from "../components/layout/Footer";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <TopHeader />
      <div className="sticky top-0 z-40 bg-white shadow-xs">
        <MainHeader isMobileNavOpen={mobileNavOpen} onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <Navbar isMobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} />
      </div>

      {/* Panoramic Dark Category Breadcrumb Banner */}
      <div className="relative overflow-hidden bg-[#1A1A1A] min-h-[64px] sm:min-h-[72px] flex items-center text-white border-b border-gray-800">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/category_banner_hd.png"
            alt="Category Banner Background"
            className="w-full h-full object-cover object-right"
            onError={(e) => {
              e.target.src = "/category_banner.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 via-35% to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-normal">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              title="Home"
            >
              <Home size={16} />
            </Link>
            <ChevronRight size={13} className="text-gray-500 shrink-0" />
            <span className="text-[#00B207] font-medium">Categories</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Browse all fresh grocery categories</p>
          </div>
          <Link to="/shop" className="text-[#00B207] font-medium hover:text-green-700 flex items-center gap-1 text-sm">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No categories found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => navigate(`/shop?category=${category._id}`)}
                className="group relative flex flex-col items-center justify-between rounded-2xl bg-white p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,178,7,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#00B207]"
              >
                <div className="w-full h-32 sm:h-36 mb-4 flex items-center justify-center bg-gray-50/80 rounded-xl p-3 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={
                      category.image
                        ? category.image.startsWith("http")
                          ? category.image
                          : `http://localhost:5000${category.image.startsWith("/") ? "" : "/"}${category.image}`
                        : "https://placehold.co/150x150?text=Category"
                    }
                    alt={category.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/150x150?text=Category";
                    }}
                  />
                </div>

                <h3 className="text-base font-semibold text-gray-800 group-hover:text-[#00B207] transition-colors line-clamp-1 mb-1">
                  {category.name}
                </h3>
                <span className="text-xs text-gray-400 group-hover:text-[#00B207] font-medium flex items-center gap-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Ecobazar Newsletter */}
      <EcobazarNewsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Categories;
