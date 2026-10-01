import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import ProductCard from "../components/common/ProductCard";
import EcobazarNewsletter from "../components/common/EcobazarNewsletter";
import Footer from "../components/layout/Footer";
import Pagination from "../components/common/Pagination";
import ShopSidebar from "../components/shop/ShopSidebar";
import ShopHeaderAndFilters from "../components/shop/ShopHeaderAndFilters";
import { useShopProducts } from "../hooks/useShopProducts";

const POPULAR_TAGS = [
  "Healthy",
  "Low fat",
  "Vegetarian",
  "Bread",
  "Kid foods",
  "Vitamins",
  "Snacks",
  "Tiffin",
  "Meat"
];

const Shop = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);

  const {
    products,
    categories,
    loading,
    activeCampaign,
    searchParams,
    setSearchParams,
    selectedCategory,
    onlyDeals,
    searchQuery,
    sortBy,
    setSortBy,
    maxPrice,
    setMaxPrice,
    selectedRating,
    setSelectedRating,
    selectedTag,
    setSelectedTag,
    currentPage,
    setCurrentPage,
    handleCategorySelect,
    clearCampaignFilter,
    clearFilters,
    activeCategoryObj,
    getCategoryCount,
    activeSaleDiscount,
    filteredProducts,
    paginatedProducts,
    totalPages,
    saleProducts
  } = useShopProducts();

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between">
      <div>
        {/* 1. Headers */}
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

        {/* 2. Breadcrumbs Banner */}
        <div className="relative overflow-hidden py-10 bg-[#1A1A1A]">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <img
              src="/Hero.png"
              alt="Background texture"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition">
                <Home size={15} />
              </Link>
              <ChevronRight size={13} className="text-gray-500 shrink-0" />
              <Link to="/shop" className="hover:text-white transition">
                Categories
              </Link>
              <ChevronRight size={13} className="text-gray-500 shrink-0" />
              <span className="text-[#00B207] font-medium">
                {activeCategoryObj ? activeCategoryObj.name : "Vegetables"}
              </span>
            </nav>
          </div>
        </div>

        {/* 3. Main Content Section (Sidebar + Product Grid) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between bg-[#00B207] text-white px-6 py-3 rounded-full font-semibold shadow-sm cursor-pointer"
            >
              <span>Filter Products</span>
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ================= LEFT SIDEBAR ================= */}
            <ShopSidebar
              showMobileFilters={showMobileFilters}
              clearFilters={clearFilters}
              categoriesOpen={categoriesOpen}
              setCategoriesOpen={setCategoriesOpen}
              selectedCategory={selectedCategory}
              handleCategorySelect={handleCategorySelect}
              categories={categories}
              products={products}
              getCategoryCount={getCategoryCount}
              priceOpen={priceOpen}
              setPriceOpen={setPriceOpen}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              setCurrentPage={setCurrentPage}
              ratingOpen={ratingOpen}
              setRatingOpen={setRatingOpen}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              tagsOpen={tagsOpen}
              setTagsOpen={setTagsOpen}
              POPULAR_TAGS={POPULAR_TAGS}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              saleProducts={saleProducts}
              navigate={navigate}
            />

            {/* ================= RIGHT MAIN CONTENT ================= */}
            <div id="shop-products-grid" className="lg:col-span-3 scroll-mt-24">
              <ShopHeaderAndFilters
                activeCampaign={activeCampaign}
                activeSaleDiscount={activeSaleDiscount}
                clearCampaignFilter={clearCampaignFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filteredProductsCount={filteredProducts.length}
                selectedCategory={selectedCategory}
                activeCategoryObj={activeCategoryObj}
                handleCategorySelect={handleCategorySelect}
                onlyDeals={onlyDeals}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                clearFilters={clearFilters}
              />

              {/* 3-Column Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchQuery
                      ? `No products matched "${searchQuery.trim()}". Try another search keyword.`
                      : "Try adjusting your category or filter selections."}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#00B207] hover:bg-[#009e06] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition shadow-xs cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 0 && paginatedProducts.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      const gridElement = document.getElementById("shop-products-grid");
                      if (gridElement) {
                        gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
                      } else {
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 4. Newsletter & Footer */}
      <div className="mt-16">
        <EcobazarNewsletter />
        <Footer />
      </div>
    </div>
  );
};

export default Shop;
