import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../common/ProductCard";

const BestSelling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/products?type=best-selling&status=ACTIVE&limit=5`);
        const data = await res.json();

        if (data && data.products && data.products.length > 0) {
          setProducts(data.products.slice(0, 5));
        } else {
          // Fallback to general active products
          const fallbackRes = await fetch(`${apiUrl}/products?status=ACTIVE&limit=5`);
          const fallbackData = await fallbackRes.json();
          setProducts(fallbackData?.products?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error("Failed to load best selling products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Best Selling Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Top customer favorites ordered this month
          </p>
        </div>
        <Link
          to="/shop?sort=best-selling"
          className="inline-flex items-center text-sm font-semibold text-[#00B207] hover:text-[#008f05] transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
          No best selling products available right now.
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

export default BestSelling;
