import React from "react";
import { Layers, Package, Tag, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";

const BannerCard = ({
  banner,
  categories,
  positionLabels,
  getFullImageUrl,
  handleToggle,
  openEditModal,
  handleDelete,
}) => {
  const bannerCategory = categories.find(
    (c) => c._id === banner.categoryScope || c.name === banner.categoryScope
  )?.name;

  return (
    <div
      className={`group rounded-xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        banner.isActive ? "border-gray-200 hover:border-green-300" : "border-gray-300 opacity-60 bg-gray-50"
      }`}
    >
      <div>
        {/* Banner Image Preview with Position & Status Pills */}
        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
          <img
            src={getFullImageUrl(banner.image)}
            alt={banner.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            onError={(e) => {
              if (e.target.src.includes(":5174")) {
                e.target.src = `http://localhost:5173${banner.image?.startsWith("/") ? "" : "/"}${banner.image}`;
              } else {
                e.target.src = "https://placehold.co/600x300?text=Banner+Image";
              }
            }}
          />
          <span className="absolute top-3 left-3 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-xs">
            {positionLabels[banner.position] || banner.position}
          </span>
          <span
            className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-xs ${
              banner.isActive ? "bg-green-600 text-white" : "bg-gray-700 text-gray-200"
            }`}
          >
            {banner.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap min-h-[22px]">
            {banner.discountText && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 text-red-600 px-2 py-0.5 text-xs font-extrabold border border-red-200">
                🔥 {banner.discountText}
              </span>
            )}
            {banner.badge &&
              banner.badge.toLowerCase().trim() !== banner.title?.toLowerCase().trim() && (
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  {banner.badge}
                </span>
              )}
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-green-700 transition-colors">
            {banner.title}
          </h3>

          {(() => {
            const titleLower = banner.title?.toLowerCase().trim() || "";
            const discLower = banner.discountText?.toLowerCase().trim() || "";
            const badgeLower = banner.badge?.toLowerCase().trim() || "";
            const subLower = banner.subtitle?.toLowerCase().trim() || "";

            const isSubUnique =
              banner.subtitle &&
              subLower !== titleLower &&
              subLower !== discLower &&
              subLower !== badgeLower;

            const isDescUnique =
              banner.description &&
              banner.description.toLowerCase().trim() !== subLower &&
              banner.description.toLowerCase().trim() !== titleLower;

            const displayText = isSubUnique
              ? banner.subtitle
              : isDescUnique
              ? banner.description
              : null;

            if (!displayText) return null;
            return <p className="text-xs text-gray-500 line-clamp-1">{displayText}</p>;
          })()}

          {/* Campaign category & product scope pill */}
          <div className="flex flex-wrap gap-1.5 items-center pt-1">
            {bannerCategory ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                <Layers size={11} /> {bannerCategory}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                <Layers size={11} /> All Categories
              </span>
            )}

            {banner.productFilterType === "specific" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800 border border-blue-200">
                <Package size={11} /> {banner.selectedProducts?.length || 0} Products
              </span>
            )}

            {banner.productFilterType === "discounted" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                <Tag size={11} /> On-Sale Items
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span className="font-medium text-gray-500">Order: #{banner.displayOrder}</span>
            <span className="truncate max-w-[170px]" title={banner.buttonLink || "/shop"}>
              {banner.buttonLink || "/shop"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 p-2.5 bg-gray-50 flex items-center justify-between">
        <button
          onClick={() => handleToggle(banner)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            banner.isActive
              ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
          }`}
          title={banner.isActive ? "Disable Banner" : "Enable Banner"}
        >
          {banner.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
          {banner.isActive ? "Disable" : "Enable"}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(banner)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-green-700 hover:bg-gray-200 rounded-lg transition cursor-pointer"
            title="Edit Banner"
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            onClick={() => handleDelete(banner._id)}
            className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
            title="Delete Banner"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
