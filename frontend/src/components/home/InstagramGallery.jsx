import React from "react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    alt: "Fresh greens"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=80",
    alt: "Organic carrots"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80",
    alt: "Crisp apples"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=400&q=80",
    alt: "Fresh vegetables"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    alt: "Citrus fruits"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80",
    alt: "Spinach salad"
  }
];

const InstagramGallery = () => {
  return (
    <div className="my-14">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Follow us on Instagram
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          @ecobazar_organic
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {galleryImages.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xs hover:shadow-md transition-all duration-300"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "/saleimg.jpg";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramGallery;
