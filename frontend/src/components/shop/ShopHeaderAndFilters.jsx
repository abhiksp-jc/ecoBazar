import React from "react";
import { X } from "lucide-react";

const ShopHeaderAndFilters = ({
  activeCampaign,
  activeSaleDiscount,
  clearCampaignFilter,
  sortBy,
  setSortBy,
  filteredProductsCount,
  selectedCategory,
  activeCategoryObj,
  handleCategorySelect,
  onlyDeals,
  searchParams,
  setSearchParams,
  searchQuery,
  selectedTag,
  setSelectedTag,
  maxPrice,
  setMaxPrice,
  clearFilters
}) => {
  return (
    <>
      {/* Active Campaign Header Bar */}
      {activeCampaign && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-[#00B207] to-green-600 p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-xl text-amber-300 shrink-0 border border-white/25">
              %
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-950 bg-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {activeCampaign.badge || "Campaign Sale"}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {activeCampaign.title}
                </h2>
              </div>
              <p className="text-xs text-white/90 mt-1 flex items-center gap-1.5 flex-wrap">
                {activeCampaign.subtitle && <span>{activeCampaign.subtitle} </span>}
                {activeSaleDiscount > 0 && (
                  <span className="font-bold text-amber-200 bg-black/25 px-2 py-0.5 rounded shadow-2xs">
                    • {activeSaleDiscount}% DISCOUNT APPLIED ON ALL PRODUCTS
                  </span>
                )}
                {activeCampaign.discountText && !activeCampaign.discountText.includes(`${activeSaleDiscount}%`) && (
                  <span className="font-medium text-white/90">• {activeCampaign.discountText} </span>
                )}
                {activeCampaign.productFilterType === "specific" && (
                  <span>• Showing {activeCampaign.selectedProducts?.length || 0} hand-picked campaign products</span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearCampaignFilter}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-green-900 px-4 py-2 text-xs font-semibold backdrop-blur-xs transition shrink-0 border border-white/30 cursor-pointer shadow-xs"
          >
            <X size={14} />
            <span>View All Products</span>
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#00B207] cursor-pointer"
          >
            <option value="default">Latest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>

        <div className="text-xs sm:text-sm text-gray-500">
          <strong className="text-gray-900 font-bold">
            {filteredProductsCount}
          </strong>{" "}
          Results Found
        </div>
      </div>

      {/* Active Filter Tags */}
      {(activeCampaign || selectedCategory || onlyDeals || searchQuery || selectedTag || maxPrice < 1500) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Active Filters:</span>
          {activeCampaign && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-md font-semibold border border-emerald-200">
              <span>Campaign: {activeCampaign.title} {activeSaleDiscount > 0 ? `(${activeSaleDiscount}% OFF)` : ""}</span>
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-950"
                onClick={clearCampaignFilter}
              />
            </span>
          )}
          {onlyDeals && !activeCampaign && (
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-red-200">
              <span>Deals & Sales {activeSaleDiscount > 0 ? `(${activeSaleDiscount}% OFF)` : ""}</span>
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:text-red-950"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete("deals");
                  setSearchParams(params);
                }}
              />
            </span>
          )}
          {activeCategoryObj && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-medium border border-green-200">
              Category: {activeCategoryObj.name}
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:text-green-900"
                onClick={() => handleCategorySelect("")}
              />
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-medium border border-green-200">
              Tag: {selectedTag}
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:text-green-900"
                onClick={() => setSelectedTag("")}
              />
            </span>
          )}
          {maxPrice < 1500 && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-medium border border-green-200">
              Max Price: ${maxPrice}
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:text-green-900"
                onClick={() => setMaxPrice(1500)}
              />
            </span>
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 font-semibold underline ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </>
  );
};

export default ShopHeaderAndFilters;
