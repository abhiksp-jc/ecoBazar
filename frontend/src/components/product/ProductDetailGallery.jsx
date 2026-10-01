import React from "react";

const ProductDetailGallery = ({
  imagesList,
  currentImg,
  selectedImage,
  setSelectedImage,
  getImageUrl,
  productName,
  hasDiscount,
  effectiveDiscount
}) => {
  return (
    <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 items-start">
      {/* Vertical thumbnails strip */}
      {imagesList.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[460px] p-1 shrink-0">
          {imagesList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl border-2 p-1.5 bg-white flex items-center justify-center transition-all cursor-pointer ${
                currentImg === img
                  ? "border-[#00B207] shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Large Main Image */}
      <div className="flex-1 w-full aspect-square border border-gray-200 rounded-2xl overflow-hidden bg-white p-6 sm:p-10 flex items-center justify-center relative">
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-[#EA4B48] text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
            {effectiveDiscount}% OFF
          </div>
        )}
        {currentImg ? (
          <img
            src={getImageUrl(currentImg)}
            alt={productName}
            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image available</span>
        )}
      </div>
    </div>
  );
};

export default ProductDetailGallery;
