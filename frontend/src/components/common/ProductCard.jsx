import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Eye, Star, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getImageUrl } from "../../utils/imageUrl";
import ProductQuickViewModal from "./ProductQuickViewModal";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, getRemainingStock } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const isWishlisted = isInWishlist(product._id);

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (remainingStock > 0) {
      addToCart(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const remainingStock = getRemainingStock(product);
  const hasDiscount = Number(product.discount) > 0;
  const originalPrice = Number(product.originalPrice || product.price) || 0;
  const finalPrice = product.finalPrice
    ? Number(product.finalPrice).toFixed(2)
    : hasDiscount
      ? (originalPrice - (originalPrice * product.discount) / 100).toFixed(2)
      : originalPrice.toFixed(2);

  const rawImage = product.images && product.images.length > 0 ? product.images[0] : "";
  const imageUrl = getImageUrl(rawImage, "https://placehold.co/250x250?text=Product");

  const categoryName = typeof product.category === "object" && product.category?.name
    ? product.category.name
    : "";

  return (
    <div
      onClick={() => navigate(`/product/${product._id}${window.location.search || ""}`)}
      className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-green-500 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {hasDiscount && remainingStock > 0 && (
          <span className="rounded-md bg-[#EA4B48] px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs">
            Sale {product.discount}%
          </span>
        )}
        {remainingStock <= 0 && (
          <span className="rounded-md bg-gray-800 px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs">
            Out of Stock
          </span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={handleToggleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-xs transition ${
            isWishlisted
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-500"
          }`}
        >
          <Heart size={15} className={isWishlisted ? "fill-red-500" : ""} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickView(true);
          }}
          title="Quick View"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-xs hover:bg-gray-50 hover:text-green-600 transition"
        >
          <Eye size={15} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50/70 p-3">
        <img
          src={imageUrl}
          alt={product.name}
          className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
            remainingStock <= 0 ? "opacity-40 grayscale" : ""
          }`}
          onError={(e) => {
            e.target.src = "https://placehold.co/250x250?text=Product";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {categoryName && (
            <span className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
              {categoryName}
            </span>
          )}

          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-[#00B207] transition-colors">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="mt-1 flex items-center gap-1">
            <div className="flex text-[#FF8A00]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-[#FF8A00] stroke-none"
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">(4.5)</span>
          </div>

          <div className="mt-1 text-xs text-gray-500">
            {remainingStock > 0 ? (
              <span className="text-green-600 font-medium">
                {remainingStock} {product.unit || "unit"} in stock
              </span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ${finalPrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={remainingStock <= 0}
            title={
              remainingStock <= 0
                ? "Out of Stock"
                : justAdded
                ? "Added!"
                : "Add to Cart"
            }
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 shadow-xs ${
              remainingStock <= 0
                ? "cursor-not-allowed bg-gray-100 text-gray-300"
                : justAdded
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-[#00B207] hover:text-white"
            }`}
          >
            {justAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={product}
      />
    </div>
  );
};

export default ProductCard;
