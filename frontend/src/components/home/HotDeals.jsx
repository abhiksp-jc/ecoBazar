import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "../common/ProductCard";

const HotDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/products?type=hot-deals&status=ACTIVE&limit=10`);
        const data = await response.json();
        const allProducts = data?.products || [];

        const discounted = allProducts.filter((item) => Number(item.discount) > 0);
        if (discounted.length > 0) {
          setProducts(discounted.slice(0, 10));
        } else {
          setProducts(allProducts.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching hot deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotDeals();
  }, []);

  return (
    <div className="my-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Hot Deals
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              <Flame size={13} /> Limited Time Deals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Top discounts on fresh produce and daily essentials
          </p>
        </div>
        <Link
          to="/shop?deals=true"
          className="inline-flex items-center text-sm font-semibold text-[#00B207] hover:text-[#008f05] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
          No hot deals currently active.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotDeals;
