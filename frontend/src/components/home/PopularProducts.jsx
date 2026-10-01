import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart, getRemainingStock } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        
        if (data && data.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="mt-12 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
        <Link to="/shop" className="flex items-center text-green-600 font-medium hover:text-green-700">
          View All <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {/* Products Grid (10 on Home screen) */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.slice(0, 10).map((product) => {
            const remainingStock = getRemainingStock(product);

            return (
              <div 
                key={product._id} 
                onClick={() => navigate(`/product/${product._id}`)}
                className="border border-gray-200 p-4 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:border-green-500 hover:z-10 transition-all duration-300 relative group bg-white flex flex-col justify-between cursor-pointer"
              >
                {remainingStock <= 0 && (
                  <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-2.5 py-1 rounded-md z-10 shadow-sm">
                    Out of Stock
                  </div>
                )}

                <div className="aspect-square w-full mb-4 overflow-hidden rounded-lg bg-gray-50/70 relative flex items-center justify-center p-3">
                  <img 
                    src={
                      product.images && product.images.length > 0 
                        ? product.images[0].startsWith("http")
                          ? product.images[0]
                          : `http://localhost:5000${product.images[0].startsWith("/") ? "" : "/"}${product.images[0]}`
                        : 'https://placehold.co/200x200?text=Product'
                    } 
                    alt={product.name}
                    className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
                      remainingStock <= 0 ? "opacity-50 grayscale" : ""
                    }`}
                    onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=Product'; }}
                  />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base text-gray-700 font-medium mb-1 truncate group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-xs text-gray-500 mb-2">
                    {remainingStock > 0 ? (
                      <span>{remainingStock} {product.unit || 'kg'} in stock</span>
                    ) : (
                      <span className="text-red-500 font-medium">Out of stock</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-gray-900 text-base sm:text-lg">
                      ${Number(product.price).toFixed(2)}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (remainingStock > 0) {
                          addToCart(product, 1);
                        }
                      }}
                      disabled={remainingStock <= 0}
                      title={remainingStock <= 0 ? "Out of Stock" : "Add to Cart"}
                      className={`p-2.5 rounded-full transition-colors duration-300 shadow-sm ${
                        remainingStock <= 0
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-green-600 hover:text-white text-gray-800 cursor-pointer"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PopularProducts;
