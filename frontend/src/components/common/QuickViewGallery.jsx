import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const QuickViewGallery = ({
  imageList,
  selectedImageIndex,
  setSelectedImageIndex,
  handlePrevImage,
  handleNextImage,
  productName,
}) => {
  return (
    <div className="md:col-span-6 flex flex-col sm:flex-row items-center gap-4">
      {/* Vertical Thumbnail Strip */}
      <div className="flex sm:flex-col items-center gap-2 order-2 sm:order-1">
        <button
          type="button"
          onClick={handlePrevImage}
          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronUp size={16} className="hidden sm:block" />
        </button>

        <div className="flex sm:flex-col gap-2">
          {imageList.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              className={`h-16 w-16 sm:h-18 sm:w-18 rounded-lg p-1.5 overflow-hidden transition-all duration-200 bg-gray-50/80 flex items-center justify-center cursor-pointer ${
                selectedImageIndex === idx
                  ? "border-2 border-[#00B207] shadow-xs"
                  : "border border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.src = "https://placehold.co/100x100?text=Preview";
                }}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextImage}
          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronDown size={16} className="hidden sm:block" />
        </button>
      </div>

      {/* Main Active Image Display */}
      <div className="flex-1 order-1 sm:order-2 flex items-center justify-center h-64 sm:h-80 w-full bg-gray-50/50 rounded-xl p-4">
        <img
          src={imageList[selectedImageIndex] || imageList[0]}
          alt={productName}
          className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/350x350?text=Product";
          }}
        />
      </div>
    </div>
  );
};

export default QuickViewGallery;
