import { useEffect, useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import axios from "axios";
import Pagination from "../components/common/Pagination";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data.products || response.data.data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getCategoryName = (category) => {
    if (!category) return "Uncategorized";

    if (typeof category === "object") {
      return category.name || "Uncategorized";
    }

    return "Category";
  };

  const getFinalPrice = (product) => {
    if (product.finalPrice !== undefined && product.finalPrice !== null) {
      return product.finalPrice;
    }

    const price = Number(product.price || 0);
    const discount = Number(product.discount || 0);

    return price - (price * discount) / 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Popular Products
          </h1>

          <p className="text-gray-500 mt-2">
            Fresh groceries at the best prices
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <p className="text-gray-500">
              No products available.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((product) => {
                  const finalPrice = getFinalPrice(product);
                  const discount = Number(product.discount || 0);

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="relative h-56 bg-gray-100">
                        {product.images?.length > 0 ? (
                          <img
                            src={`http://localhost:5000${product.images[0]}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {discount}% OFF
                          </span>
                        )}

                        <button
                          className="absolute bottom-3 right-3 bg-white p-3 rounded-full shadow hover:bg-gray-100"
                          title="Add to cart"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>

                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">
                          {getCategoryName(product.category)}
                        </p>

                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {product.name}
                        </h2>

                        <div className="flex items-center gap-1 mt-2">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />

                          <span className="text-sm text-gray-600">
                            {product.rating || "4.5"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xl font-bold text-green-600">
                            ₹{finalPrice}
                          </span>

                          {discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                          )}
                        </div>

                        <button
                          className="w-full mt-4 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Pagination Slide Bar */}
            {Math.ceil(products.length / itemsPerPage) > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(products.length / itemsPerPage)}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;