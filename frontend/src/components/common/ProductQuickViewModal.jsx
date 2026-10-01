import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  ChevronUp,
  ChevronDown,
  Check
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getImageUrl } from "../../utils/imageUrl";
import QuickViewGallery from "./QuickViewGallery";

const ProductQuickViewModal = ({ isOpen, onClose, product }) => {
  const { addToCart, getRemainingStock } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = product ? isInWishlist(product._id) : false;

  // Lock scroll & handle Escape key when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset internal states on open
  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setJustAdded(false);
    }
  }, [isOpen, product?._id]);

  if (!isOpen || !product) return null;

  const remainingStock = getRemainingStock(product);
  const hasDiscount = Number(product.discount) > 0;
  const originalPrice = Number(product.originalPrice || product.price) || 0;
  const finalPrice = product.finalPrice
    ? Number(product.finalPrice).toFixed(2)
    : hasDiscount
      ? (originalPrice - (originalPrice * product.discount) / 100).toFixed(2)
      : originalPrice.toFixed(2);

  // Prepare images list (up to 4 thumbnails)
  let imageList = [];
  if (product.images && product.images.length > 0) {
    imageList = product.images.map((img) => getImageUrl(img));
  } else if (product.image) {
    imageList = [getImageUrl(product.image)];
  } else {
    imageList = ["https://placehold.co/400x400?text=Product"];
  }

  // Duplicate single image to show 4 angle previews if product only has 1 image
  while (imageList.length < 4) {
    imageList.push(imageList[0]);
  }

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : product.category || "Vegetables";

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  const handleQuantityInputChange = (e) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setQuantity("");
      return;
    }
    const clean = rawValue.replace(/[^0-9]/g, "");
    if (!clean) return;
    const parsed = parseInt(clean, 10);
    if (isNaN(parsed)) return;

    if (remainingStock > 0 && parsed > remainingStock) {
      setQuantity(remainingStock);
    } else {
      setQuantity(parsed);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || isNaN(quantity) || Number(quantity) < 1) {
      setQuantity(1);
    } else if (remainingStock > 0 && Number(quantity) > remainingStock) {
      setQuantity(remainingStock);
    }
  };

  const handleDecreaseQuantity = () => {
    const current = typeof quantity === "number" ? quantity : parseInt(quantity, 10) || 1;
    setQuantity(Math.max(1, current - 1));
  };

  const handleIncreaseQuantity = () => {
    const current = typeof quantity === "number" ? quantity : parseInt(quantity, 10) || 1;
    setQuantity(Math.min(remainingStock || 99, current + 1));
  };

  const handleAddToCart = () => {
    const validQty = typeof quantity === "number" ? quantity : parseInt(quantity, 10) || 1;
    if (remainingStock >= validQty) {
      addToCart(product, validQty);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const tagsList = product.tags && product.tags.length > 0
    ? product.tags
    : [categoryName, "Healthy", "Natural", "Fresh", "Organic"];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 max-h-[92vh] overflow-y-auto transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition"
        >
          <X size={18} />
        </button>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Gallery (Thumbnails + Main Image) */}
          <QuickViewGallery
            imageList={imageList}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            handlePrevImage={handlePrevImage}
            handleNextImage={handleNextImage}
            productName={product.name}
          />

          {/* Right Column: Product Details */}
          <div className="md:col-span-6 flex flex-col">
            {/* Title & Stock Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>
              {remainingStock > 0 ? (
                <span className="bg-[#E8F8EE] text-[#2C742F] text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Rating & SKU */}
            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500">
              <div className="flex text-[#FF8A00]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#FF8A00] stroke-none"
                  />
                ))}
              </div>
              <span className="font-medium text-gray-700">4 Review</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">
                SKU:{" "}
                <span className="text-gray-800 font-medium">
                  {product.sku || product._id?.slice(-6)?.toUpperCase() || "2,519,94"}
                </span>
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-3 mt-4">
              {hasDiscount && (
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-[#2C742F]">
                ${finalPrice}
              </span>
              {hasDiscount && (
                <span className="bg-[#EA4B48]/10 text-[#EA4B48] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {product.discount}% Off
                </span>
              )}
            </div>

            <hr className="my-4 border-gray-100" />

            {/* Brand & Share Item */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Brand:</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#00B207]/15 text-[#00B207] text-xs">
                    🌿
                  </span>
                  {product.brand || "Farmary"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">Share item:</span>
                <div className="flex items-center gap-1.5">
                  {/* Facebook (Green active circle as in reference) */}
                  <button
                    type="button"
                    title="Share on Facebook"
                    className="h-7 w-7 rounded-full bg-[#00B207] text-white flex items-center justify-center text-xs font-bold shadow-xs hover:bg-[#009e06] transition"
                  >
                    f
                  </button>
                  {/* Twitter */}
                  <button
                    type="button"
                    title="Share on Twitter"
                    className="h-7 w-7 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                    </svg>
                  </button>
                  {/* Pinterest */}
                  <button
                    type="button"
                    title="Share on Pinterest"
                    className="h-7 w-7 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center font-bold text-xs transition"
                  >
                    P
                  </button>
                  {/* Instagram */}
                  <button
                    type="button"
                    title="Share on Instagram"
                    className="h-7 w-7 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3">
              {product.description ||
                "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla nibh diam, blandit vel consequat nec, ultrices et ipsum."}
            </p>

            <hr className="my-5 border-gray-100" />

            {/* Quantity + Add to Cart + Wishlist */}
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-gray-200 rounded-full px-2 py-1.5 bg-gray-50/50 focus-within:border-[#00B207] focus-within:ring-2 focus-within:ring-green-100 transition">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  className="h-8 w-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
                  disabled={Number(quantity) <= 1}
                  title="Decrease quantity"
                >
                  <Minus size={13} />
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
                  className="w-12 text-center text-sm font-semibold text-gray-800 focus:outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  className="h-8 w-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
                  disabled={remainingStock > 0 && Number(quantity) >= remainingStock}
                  title={Number(quantity) >= remainingStock ? "Max stock reached" : "Increase quantity"}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={remainingStock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${
                  remainingStock <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : justAdded
                    ? "bg-green-700 text-white"
                    : "bg-[#00B207] hover:bg-[#009e06] text-white active:scale-98"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check size={16} /> Added!
                  </>
                ) : (
                  <>
                    Add to Cart <ShoppingBag size={16} />
                  </>
                )}
              </button>

              {/* Wishlist Button (Light green circle matching reference screenshot) */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`h-11 w-11 rounded-full flex items-center justify-center transition ${
                  isWishlisted
                    ? "bg-red-50 text-red-500 border border-red-200"
                    : "bg-[#E8F8EE] text-[#00B207] hover:bg-[#d5f3df] border border-transparent"
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} className={isWishlisted ? "fill-red-500" : ""} />
              </button>
            </div>

            <hr className="my-5 border-gray-100" />

            {/* Category & Tags metadata */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div>
                <span className="text-gray-500 font-medium">Category: </span>
                <span className="text-gray-800 font-semibold">{categoryName}</span>
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-gray-500 font-medium">Tag: </span>
                <div className="flex flex-wrap gap-1">
                  {tagsList.map((tag, i) => (
                    <span
                      key={i}
                      className="text-gray-700 hover:text-[#00B207] cursor-pointer"
                    >
                      {tag}
                      {i < tagsList.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductQuickViewModal;
