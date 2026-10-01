import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const DEFAULT_POPULAR_CATEGORIES = [
  {
    _id: "default-cat-1",
    name: "Fresh Fruit",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80",
    defaultCount: 134
  },
  {
    _id: "default-cat-2",
    name: "Fresh Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80",
    defaultCount: 150
  },
  {
    _id: "default-cat-3",
    name: "Meat & Fish",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=300&q=80",
    defaultCount: 54
  },
  {
    _id: "default-cat-4",
    name: "Snacks",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=300&q=80",
    defaultCount: 47
  },
  {
    _id: "default-cat-5",
    name: "Beverages",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80",
    defaultCount: 43
  },
  {
    _id: "default-cat-6",
    name: "Beauty & Health",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80",
    defaultCount: 38
  },
  {
    _id: "default-cat-7",
    name: "Bread & Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
    defaultCount: 25
  },
  {
    _id: "default-cat-8",
    name: "Baking Needs",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=300&q=80",
    defaultCount: 23
  },
  {
    _id: "default-cat-9",
    name: "Cooking Essentials",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=300&q=80",
    defaultCount: 28
  },
  {
    _id: "default-cat-10",
    name: "Diabetic Food",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80",
    defaultCount: 19
  },
  {
    _id: "default-cat-11",
    name: "Dish Detergents",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80",
    defaultCount: 12
  },
  {
    _id: "default-cat-12",
    name: "Oil & Ghee",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
    defaultCount: 31
  }
];

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const [catRes, prodRes] = await Promise.all([
          fetch(`${apiUrl}/categories`).catch(() => null),
          fetch(`${apiUrl}/products?status=ACTIVE`).catch(() => null)
        ]);

        let activeCategories = [];
        if (catRes && catRes.ok) {
          const catData = await catRes.json();
          activeCategories = (catData?.categories || []).filter(
            (c) => c.status !== "INACTIVE"
          );
        }

        // Merge backend categories with defaults to form 2 full horizontal lines (12 categories)
        const existingNames = new Set(
          activeCategories.map((c) => (c.name || "").toLowerCase().trim())
        );

        const filledCategories = [...activeCategories];
        for (const def of DEFAULT_POPULAR_CATEGORIES) {
          if (filledCategories.length >= 12) break;
          if (!existingNames.has(def.name.toLowerCase().trim())) {
            filledCategories.push(def);
            existingNames.add(def.name.toLowerCase().trim());
          }
        }

        setCategories(filledCategories.slice(0, 12));

        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          const counts = {};
          (prodData?.products || []).forEach((prod) => {
            const catId = typeof prod.category === "object" ? prod.category?._id : prod.category;
            if (catId) {
              counts[catId] = (counts[catId] || 0) + 1;
            }
          });
          setProductCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(DEFAULT_POPULAR_CATEGORIES.slice(0, 12));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    if (category._id && !category._id.startsWith("default-cat-")) {
      navigate(`/shop?category=${category._id}`);
    } else {
      navigate(`/shop?search=${encodeURIComponent(category.name)}`);
    }
  };

  return (
    <div className="my-12">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Popular Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse our most loved organic categories
          </p>
        </div>
        <Link
          to="/categories"
          className="inline-flex items-center text-sm font-semibold text-[#00B207] hover:text-[#008f05] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2 Horizontal Lines Categories Grid (6 per line on desktop = 12 total) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.slice(0, 12).map((category) => {
            const count = productCounts[category._id] ?? category.defaultCount;
            const imgUrl = getImageUrl(
              category.image,
              "https://placehold.co/160x160?text=Category"
            );

            return (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className="group relative flex flex-col items-center justify-between rounded-2xl bg-white p-4 sm:p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,178,7,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#00B207]"
              >
                <div className="relative mb-3 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center overflow-hidden rounded-full bg-gray-50/80 p-2 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={imgUrl}
                    alt={category.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/160x160?text=Category";
                    }}
                  />
                </div>

                <div className="w-full">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 transition-colors group-hover:text-[#00B207] line-clamp-1">
                    {category.name}
                  </h3>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {count !== undefined ? `${count} Products` : "Browse Products"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PopularCategories;
