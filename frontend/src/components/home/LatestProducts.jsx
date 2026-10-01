import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../common/ProductCard";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/products?sort=newest&status=ACTIVE&limit=10`);
        const data = await res.json();
        setProducts(data?.products || []);
      } catch (err) {
        console.error("Failed to load latest products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Latest Products
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-[#00B207]">
              <Sparkles size={12} /> New Arrivals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Freshly harvested and recently added to our catalog
          </p>
        </div>
        <Link
          to="/shop?sort=newest"
          className="inline-flex items-center text-sm font-semibold text-[#00B207] hover:text-[#008f05] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
          No new products added yet.
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

export default LatestProducts;
