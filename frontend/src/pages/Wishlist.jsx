import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  XCircle,
  Home,
  ChevronRight
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageUrl";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, getRemainingStock } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [addedItems, setAddedItems] = useState({});
  const navigate = useNavigate();

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const remaining = getRemainingStock(product);
    if (remaining > 0) {
      addToCart(product, 1, false);
      setAddedItems((prev) => ({ ...prev, [product._id]: true }));
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [product._id]: false }));
      }, 2000);
    }
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    wishlistItems.forEach((product) => {
      const remaining = getRemainingStock(product);
      if (remaining > 0) {
        addToCart(product, 1, false);
        addedCount++;
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between">
      <div>
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

        {/* Breadcrumb Header */}
        <div className="bg-gray-50 py-3 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-green-600 flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <Heart className="text-[#00B207] fill-[#00B207]" size={28} />
                My Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Keep track of fresh organic products you want to buy later.
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <span className="text-xs font-semibold px-3 py-1 bg-green-50 text-[#00B207] rounded-full border border-green-200 self-start sm:self-auto">
                {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"} Saved
              </span>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300 p-8">
              <div className="w-20 h-20 bg-green-50 text-[#00B207] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Heart size={36} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                You haven't saved any items to your wishlist yet. Browse our selection of fresh organic groceries and click the heart icon to save items!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-[#009406] text-white font-semibold px-6 py-3 rounded-full transition shadow-sm hover:shadow-md text-sm"
              >
                <span>Discover Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            /* Wishlist Items Table */
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Stock Status</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {wishlistItems.map((item) => {
                    const price = Number(item.price) || 0;
                    const discount = Number(item.discount) || 0;
                    const finalPrice =
                      discount > 0
                        ? Number((price - (price * discount) / 100).toFixed(2))
                        : price;
                    const inStock = item.stock === undefined || Number(item.stock) > 0;
                    const rawImage =
                      item.images && item.images.length > 0 ? item.images[0] : "";
                    const imageUrl = getImageUrl(
                      rawImage,
                      "https://placehold.co/100x100?text=Product"
                    );
                    const isAdded = addedItems[item._id];

                    return (
                      <div
                        key={item._id}
                        className="p-4 sm:p-5 flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition hover:bg-gray-50/50"
                      >
                        {/* Product Info */}
                        <div className="col-span-5 flex items-center gap-4 w-full">
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item._id)}
                            title="Remove from wishlist"
                            className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer shrink-0"
                          >
                            <Trash2 size={18} />
                          </button>

                          <div
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="w-16 h-16 sm:w-18 sm:h-18 bg-gray-50 rounded-xl p-2 shrink-0 border border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
                          >
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/100x100?text=Product";
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3
                              onClick={() => navigate(`/product/${item._id}`)}
                              className="font-bold text-gray-900 hover:text-[#00B207] transition cursor-pointer truncate text-sm sm:text-base"
                            >
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              {discount > 0 && (
                                <span className="text-[11px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                  {discount}% OFF
                                </span>
                              )}
                              <span className="text-xs text-gray-400">
                                Unit: {item.unit || "kg"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center w-full md:w-auto flex justify-between md:justify-center items-center">
                          <span className="md:hidden text-xs text-gray-500 font-medium">Price:</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold text-gray-900 text-sm sm:text-base">
                              ${finalPrice.toFixed(2)}
                            </span>
                            {discount > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                ${price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div className="col-span-2 text-center w-full md:w-auto flex justify-between md:justify-center items-center">
                          <span className="md:hidden text-xs text-gray-500 font-medium">Status:</span>
                          {inStock ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold">
                              <XCircle size={12} className="text-rose-600" />
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Action */}
                        <div className="col-span-3 text-right w-full md:w-auto flex justify-end items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(item, e)}
                            disabled={!inStock}
                            className={`w-full md:w-auto px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-xs ${
                              isAdded
                                ? "bg-emerald-600 text-white"
                                : inStock
                                ? "bg-[#00B207] hover:bg-[#009406] text-white shadow-[#00B207]/20"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={16} /> Added!
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={15} /> Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition"
                >
                  <ArrowLeft size={16} /> Return to Shop
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddAllToCart}
                    className="px-6 py-3 rounded-full bg-[#00B207] hover:bg-[#009406] text-white text-sm font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBag size={16} /> Add All to Cart
                  </button>

                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="px-5 py-3 rounded-full border border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-600 text-sm font-semibold transition cursor-pointer"
                  >
                    Clear Wishlist
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
