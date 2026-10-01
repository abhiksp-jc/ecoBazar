import React from "react";
import { Star, ShoppingBag, Heart, Check, Leaf } from "lucide-react";
import SocialShareButtons from "../common/SocialShareButtons";

const ProductDetailInfo = ({
  product,
  remainingStock,
  hasDiscount,
  effectiveDiscount,
  finalPrice,
  quantity,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleQuantityInputChange,
  handleQuantityBlur,
  handleAddToCart,
  addedToCart,
  isWishlisted,
  toggleWishlist
}) => {
  return (
    <div className="lg:col-span-6 flex flex-col justify-between">
      <div>
        {/* Title & In Stock Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            {product?.name || "Product"}
          </h1>
          {remainingStock > 0 ? (
            <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-[#00B207]">
              In Stock
            </span>
          ) : (
            <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              Out of Stock
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center text-[#FF8A00]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product?.rating || product?.averageRating || 4.5)
                    ? "fill-[#FF8A00] stroke-none"
                    : "fill-gray-200 text-gray-200 stroke-none"
                }
              />
            ))}
          </div>
          <span className="text-gray-500 font-medium">
            4 Reviews
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 font-medium">
            SKU: <strong className="text-gray-700 font-semibold">{String(product?._id || product?.id || product?.sku || "ECO001").slice(-6).toUpperCase()}</strong>
          </span>
        </div>

        {/* Price Row */}
        <div className="mt-5 flex items-baseline gap-3">
          {hasDiscount ? (
            <>
              <span className="text-gray-400 line-through text-lg sm:text-xl font-normal">
                ${Number(product?.price || 0).toFixed(2)}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2C742F]">
                ${finalPrice}
              </span>
              <span className="rounded-full bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5">
                {effectiveDiscount}% Off
              </span>
            </>
          ) : (
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2C742F]">
              ${Number(product?.price || 0).toFixed(2)}
            </span>
          )}
        </div>

        {/* Brand & Share row */}
        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Brand:</span>
            <div className="flex items-center gap-1 font-bold text-gray-800">
              <Leaf size={14} className="text-[#00B207]" />
              <span>farmary</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Share item:</span>
            <SocialShareButtons />
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-5 text-xs sm:text-sm text-gray-600 leading-relaxed">
          {product?.description ||
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla nibh diam, blandit vel consequat nec, ultrices et ipsum. Nulla varius magna a consequat pulvinar."}
        </p>

        {/* Quantity + Add to Cart + Wishlist */}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          {/* Quantity Pill */}
          <div className="inline-flex items-center border border-gray-300 rounded-full bg-white px-2 py-1 shadow-xs hover:border-gray-400 focus-within:border-[#00B207] focus-within:ring-2 focus-within:ring-green-100 transition">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              disabled={Number(quantity) <= 1 || remainingStock <= 0}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-30 font-bold cursor-pointer"
              title="Decrease quantity"
            >
              -
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={remainingStock <= 0 ? 0 : quantity}
              onChange={handleQuantityInputChange}
              onBlur={handleQuantityBlur}
              disabled={remainingStock <= 0}
              aria-label="Quantity"
              className="w-12 text-center font-bold text-gray-900 text-sm focus:outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={handleIncreaseQuantity}
              disabled={Number(quantity) >= remainingStock || remainingStock <= 0}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-30 font-bold cursor-pointer"
              title={Number(quantity) >= remainingStock ? "Max stock reached" : "Increase quantity"}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={remainingStock <= 0 || (product?.stock ?? 0) <= 0}
            className={`flex-1 min-w-[200px] h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              addedToCart
                ? "bg-green-700 text-white"
                : remainingStock > 0 && (product?.stock ?? 0) > 0
                ? "bg-[#00B207] hover:bg-[#008f05] text-white cursor-pointer hover:shadow"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {addedToCart ? (
              <>
                <Check size={18} /> Added to Cart!
              </>
            ) : remainingStock <= 0 ? (
              "Out of Stock"
            ) : (
              <>
                <span>Add to Cart</span>
                <ShoppingBag size={18} />
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => product && toggleWishlist(product)}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`w-12 h-12 rounded-full border transition flex items-center justify-center cursor-pointer ${
              isWishlisted
                ? "bg-red-50 border-red-200 text-red-500 shadow-xs"
                : "border-gray-200 bg-gray-50/80 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-600"
            }`}
          >
            <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>

        {/* Category & Tags Footer */}
        <div className="mt-7 pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
          <div>
            <span className="text-gray-900 font-semibold">Category: </span>
            <span className="text-gray-600">
              {product?.category?.name || (typeof product?.category === "string" ? product.category : "Vegetables")}
            </span>
          </div>
          <div>
            <span className="text-gray-900 font-semibold">Tag: </span>
            <span className="text-gray-600">
              {product?.tags && product.tags.length > 0
                ? product.tags.join(", ")
                : "Vegetables, Healthy, Chinese, Cabbage, Green Cabbage"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailInfo;
