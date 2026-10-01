import React from "react";
import { CheckCircle2, Play, Tag, Leaf, Star } from "lucide-react";

const ProductDetailTabs = ({
  activeTab,
  setActiveTab,
  product,
  discountPercent,
  remainingStock
}) => {
  return (
    <section className="mt-16 sm:mt-20">
      {/* Tab Buttons */}
      <div className="flex items-center justify-center border-b border-gray-200 gap-6 sm:gap-12">
        <button
          type="button"
          onClick={() => setActiveTab("descriptions")}
          className={`pb-4 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
            activeTab === "descriptions"
              ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00B207]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Descriptions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("additional")}
          className={`pb-4 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
            activeTab === "additional"
              ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00B207]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Additional Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("feedback")}
          className={`pb-4 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
            activeTab === "feedback"
              ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00B207]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Customer Feedback
        </button>
      </div>

      {/* Tab 1: Descriptions */}
      {activeTab === "descriptions" && (
        <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Full Descriptive text & checkmarks */}
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <p>
              {product.description ||
                "Sed commodo aliquam dui ac porta. Fusce ipsum felis, imperdiet at posuere ac, viverra at mauris. Maecenas tincidunt ligula a sem vestibulum pharetra. Maecenas auctor tortor lacus, nec laoreet nisi porttitor vel. Etiam tincidunt metus vel dui interdum sollicitudin. Mauris sem ante, vestibulum nec orci vitae, aliquam mollis lacus. Sed at condimentum arcu, id molestie tellus. Nulla facilisi. Nam scelerisque vitae justo a convallis. Morbi urna ipsum, placerat quis commodo quis, egestas elementum leo. Donec convallis mollis enim. Aliquam id mi quam. Phasellus nec fringilla elit."}
            </p>
            <p>
              Nulla mauris tellus, feugiat quis pharetra sed, gravida ac dui. Sed iaculis, metus faucibus elementum tincidunt, turpis mi viverra velit, pellentesque tristique neque mi eget nulla. Proin luctus elementum neque et pharetra.
            </p>

            {/* Checkmark points */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                <CheckCircle2 size={16} className="text-[#00B207] shrink-0" />
                <span>100 g of fresh leaves provides.</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                <CheckCircle2 size={16} className="text-[#00B207] shrink-0" />
                <span>Aliquam ac est at augue volutpat elementum.</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                <CheckCircle2 size={16} className="text-[#00B207] shrink-0" />
                <span>Quisque nec enim eget sapien molestie.</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                <CheckCircle2 size={16} className="text-[#00B207] shrink-0" />
                <span>Proin convallis odio volutpat finibus posuere.</span>
              </div>
            </div>

            <p className="pt-2">
              Cras et diam maximus, accumsan sapien et, sollicitudin velit. Nulla blandit eros non turpis lobortis iaculis at ut massa.
            </p>
          </div>

          {/* Right Column: Promotional Delivery / Video Card & Feature Badges */}
          <div className="lg:col-span-5 space-y-4">
            {/* Video / Banner Card */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-gradient-to-br from-green-800 via-emerald-700 to-green-900 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="Delivery Video"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <button
                  type="button"
                  aria-label="Play video"
                  className="w-14 h-14 rounded-full bg-[#00B207] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play size={22} className="fill-white translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Feature Badges Container */}
            <div className="grid grid-cols-2 gap-4 border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#00B207] shrink-0">
                  <Tag size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    {discountPercent > 0 ? `${discountPercent}% Discount` : "64% Discount"}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Save your money with us
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#00B207] shrink-0">
                  <Leaf size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">100% Organic</h4>
                  <p className="text-[11px] text-gray-500">100% Organic Vegetables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Additional Information */}
      {activeTab === "additional" && (
        <div className="py-10 max-w-3xl">
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 text-xs sm:text-sm">
            <div className="grid grid-cols-3 p-3.5 bg-gray-50/80">
              <span className="font-semibold text-gray-800">Weight:</span>
              <span className="col-span-2 text-gray-600">{product.unit || "1 kg"}</span>
            </div>
            <div className="grid grid-cols-3 p-3.5 bg-white">
              <span className="font-semibold text-gray-800">Color:</span>
              <span className="col-span-2 text-gray-600">Fresh Green</span>
            </div>
            <div className="grid grid-cols-3 p-3.5 bg-gray-50/80">
              <span className="font-semibold text-gray-800">Type:</span>
              <span className="col-span-2 text-gray-600">Organic & Farm Harvested</span>
            </div>
            <div className="grid grid-cols-3 p-3.5 bg-white">
              <span className="font-semibold text-gray-800">Category:</span>
              <span className="col-span-2 text-gray-600">{product.category?.name || "Vegetables"}</span>
            </div>
            <div className="grid grid-cols-3 p-3.5 bg-gray-50/80">
              <span className="font-semibold text-gray-800">Stock Status:</span>
              <span className="col-span-2 text-[#00B207] font-medium">
                Available ({remainingStock} {product.unit || "kg"} in stock)
              </span>
            </div>
            <div className="grid grid-cols-3 p-3.5 bg-white">
              <span className="font-semibold text-gray-800">Tags:</span>
              <span className="col-span-2 text-gray-600">
                {product.tags && product.tags.length > 0
                  ? product.tags.join(", ")
                  : "Vegetables, Healthy, Organic, Fresh"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Feedback */}
      {activeTab === "feedback" && (
        <div className="py-10 space-y-6 max-w-3xl">
          <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#00B207]">4.8</div>
              <div className="flex text-[#FF8A00] mt-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#FF8A00] stroke-none" />
                ))}
              </div>
              <span className="text-xs text-gray-400 mt-1 block">128 Reviews</span>
            </div>
            <div className="border-l border-gray-200 pl-6 text-xs text-gray-600 space-y-1">
              <p><strong>98%</strong> of customers recommend this product.</p>
              <p>Hand-harvested daily and tested for certified freshness.</p>
            </div>
          </div>

          {/* Sample Review 1 */}
          <div className="border-b border-gray-100 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">Kristin Watson</span>
                <span className="text-[11px] text-[#00B207] bg-green-50 px-2 py-0.5 rounded font-medium">Verified Buyer</span>
              </div>
              <span className="text-xs text-gray-400">2 days ago</span>
            </div>
            <div className="flex text-[#FF8A00] mt-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-[#FF8A00] stroke-none" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Duis at ullamcorper nulla, eu dictum eros. Nulla et augue sit amet ante facilisis semper. Integer fermentum magna at elementum faucibus.
            </p>
          </div>

          {/* Sample Review 2 */}
          <div className="border-b border-gray-100 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">Jane Cooper</span>
                <span className="text-[11px] text-[#00B207] bg-green-50 px-2 py-0.5 rounded font-medium">Verified Buyer</span>
              </div>
              <span className="text-xs text-gray-400">1 week ago</span>
            </div>
            <div className="flex text-[#FF8A00] mt-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-[#FF8A00] stroke-none" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Keep the soil evenly moist for the healthiest and most vibrant results. Received fresh on the same day!
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetailTabs;
