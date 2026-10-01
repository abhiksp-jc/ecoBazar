import React from "react";
import { Link } from "react-router-dom";
import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Star,
  ArrowRight
} from "lucide-react";

const ShopSidebar = ({
  showMobileFilters,
  clearFilters,
  categoriesOpen,
  setCategoriesOpen,
  selectedCategory,
  handleCategorySelect,
  categories,
  products,
  getCategoryCount,
  priceOpen,
  setPriceOpen,
  maxPrice,
  setMaxPrice,
  setCurrentPage,
  ratingOpen,
  setRatingOpen,
  selectedRating,
  setSelectedRating,
  tagsOpen,
  setTagsOpen,
  POPULAR_TAGS,
  selectedTag,
  setSelectedTag,
  saleProducts,
  navigate
}) => {
  return (
    <aside
      className={`${
        showMobileFilters ? "block" : "hidden"
      } lg:block lg:col-span-1 space-y-6`}
    >
      {/* Filter Button */}
      <button
        type="button"
        onClick={clearFilters}
        className="w-full flex items-center justify-between bg-[#00B207] hover:bg-[#009e06] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-sm transition cursor-pointer"
      >
        <span>Filter</span>
        <SlidersHorizontal size={18} />
      </button>

      {/* All Categories Accordion */}
      <div className="border-b border-gray-200 pb-5">
        <button
          type="button"
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="flex items-center justify-between w-full text-left font-bold text-base text-gray-900 mb-3 cursor-pointer"
        >
          <span>All Categories</span>
          {categoriesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {categoriesOpen && (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {/* All Option */}
            <label
              onClick={() => handleCategorySelect("")}
              className="flex items-center justify-between text-sm cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                    !selectedCategory ? "border-[#00B207]" : "border-gray-300"
                  }`}
                >
                  {!selectedCategory && (
                    <span className="w-2 h-2 rounded-full bg-[#00B207]" />
                  )}
                </span>
                <span
                  className={`text-sm ${
                    !selectedCategory
                      ? "font-bold text-gray-900"
                      : "text-gray-600 group-hover:text-gray-900"
                  }`}
                >
                  All Categories
                </span>
              </div>
              <span className="text-xs text-gray-400">({products.length})</span>
            </label>

            {/* Category List */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat._id;
              const count = getCategoryCount(cat._id);

              return (
                <label
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat._id)}
                  className="flex items-center justify-between text-sm cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                        isSelected ? "border-[#00B207]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#00B207]" />
                      )}
                    </span>
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "font-bold text-gray-900"
                          : "text-gray-600 group-hover:text-gray-900"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ({count > 0 ? count : 24})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Filter Accordion */}
      <div className="border-b border-gray-200 pb-5">
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full text-left font-bold text-base text-gray-900 mb-3 cursor-pointer"
        >
          <span>Price</span>
          {priceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {priceOpen && (
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="1500"
              step="10"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-[#00B207] cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
              <span>Price: <strong>$0 — ${maxPrice}</strong></span>
              {maxPrice < 1500 && (
                <button
                  type="button"
                  onClick={() => setMaxPrice(1500)}
                  className="text-[#00B207] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter Accordion */}
      <div className="border-b border-gray-200 pb-5">
        <button
          type="button"
          onClick={() => setRatingOpen(!ratingOpen)}
          className="flex items-center justify-between w-full text-left font-bold text-base text-gray-900 mb-3 cursor-pointer"
        >
          <span>Rating</span>
          {ratingOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {ratingOpen && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <label
                key={stars}
                onClick={() => {
                  setSelectedRating(selectedRating === stars ? 0 : stars);
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none group"
              >
                <input
                  type="checkbox"
                  checked={selectedRating === stars}
                  onChange={() => {}}
                  className="rounded border-gray-300 text-[#00B207] focus:ring-[#00B207]"
                />
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < stars
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-500 font-medium">
                  {stars === 5 ? "5.0" : `${stars}.0 & up`}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Popular Tag Accordion */}
      <div className="border-b border-gray-200 pb-5">
        <button
          type="button"
          onClick={() => setTagsOpen(!tagsOpen)}
          className="flex items-center justify-between w-full text-left font-bold text-base text-gray-900 mb-3 cursor-pointer"
        >
          <span>Popular Tag</span>
          {tagsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {tagsOpen && (
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => {
              const isTagActive = selectedTag.toLowerCase() === tag.toLowerCase();

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTag(isTagActive ? "" : tag);
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer ${
                    isTagActive
                      ? "bg-[#00B207] text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar Promotional Discount Banner Widget */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#062414] via-[#0A341E] to-[#125030] p-6 text-white text-center shadow-xs">
        <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay">
          <img
            src="/saleimg.jpg"
            alt="Discount banner texture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <span className="text-[11px] font-bold tracking-widest text-[#FF8A00] uppercase">
            79% Discount
          </span>
          <h4 className="text-xl font-extrabold text-white mt-1 leading-snug">
            on your first order
          </h4>
          <Link
            to="/shop"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-green-400 hover:text-green-300 transition"
          >
            <span>Shop Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Sale Products Widget */}
      {saleProducts.length > 0 && (
        <div className="pt-2">
          <h4 className="font-bold text-base text-gray-900 mb-3">
            Sale Products
          </h4>
          <div className="space-y-3">
            {saleProducts.map((sp) => {
              const finalSpPrice = (
                sp.price - (sp.price * (sp.discount || 0)) / 100
              ).toFixed(2);
              const rawImg = sp.images && sp.images.length > 0 ? sp.images[0] : "";
              const spImgUrl = rawImg.startsWith("http")
                ? rawImg
                : `http://localhost:5000${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;

              return (
                <div
                  key={sp._id}
                  onClick={() => navigate(`/product/${sp._id}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={spImgUrl}
                      alt={sp.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100?text=Sale";
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 hover:text-[#00B207]">
                      {sp.name}
                    </h5>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        ${finalSpPrice}
                      </span>
                      <span className="text-[11px] text-gray-400 line-through">
                        ${Number(sp.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-400 text-[10px] mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ShopSidebar;
