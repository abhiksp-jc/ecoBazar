import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

const CartItemsTable = ({
  cartItems,
  removeFromCart,
  updateQuantity,
  getImageUrl,
  navigate,
  handleClearCart
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="hidden sm:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-right">Subtotal</div>
        </div>

        <div className="divide-y divide-gray-100">
          {cartItems.map((item) => {
            const itemFinalPrice = Number(item.finalPrice ?? item.price ?? 0);
            const itemPrice = Number(item.price ?? 0);
            const itemQuantity = Number(item.quantity) || 1;
            const itemSubtotal = (itemFinalPrice * itemQuantity).toFixed(2);
            const isMaxStock = item.stock !== undefined && itemQuantity >= item.stock;

            return (
              <div
                key={item._id}
                className="p-4 sm:px-6 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
              >
                <div className="col-span-6 flex items-center gap-4 w-full">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                    className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl p-2 shrink-0 border border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100?text=Product";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="font-semibold text-gray-900 hover:text-green-600 transition cursor-pointer truncate text-sm sm:text-base"
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {Number(item.discount) > 0 && (
                        <span className="text-xs text-red-500 font-medium">
                          {item.discount}% Off
                        </span>
                      )}
                      {item.stock !== undefined && (
                        <span className="text-xs text-gray-500">
                          (Stock: {item.stock} {item.unit || "kg"})
                        </span>
                      )}
                    </div>
                    {isMaxStock && (
                      <span className="text-[11px] text-amber-600 font-medium inline-block mt-0.5">
                        Max stock limit reached
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 text-center w-full sm:w-auto flex justify-between sm:justify-center items-center">
                  <span className="sm:hidden text-xs text-gray-500 font-medium">Price:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      ${itemFinalPrice.toFixed(2)}
                    </span>
                    {Number(item.discount) > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ${itemPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex justify-between sm:justify-center items-center w-full sm:w-auto">
                  <span className="sm:hidden text-xs text-gray-500 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, itemQuantity - 1)}
                      className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={itemQuantity}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9]/g, "");
                        if (clean) {
                          updateQuantity(item._id, parseInt(clean, 10));
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || Number(e.target.value) < 1) {
                          updateQuantity(item._id, 1);
                        }
                      }}
                      className="w-10 text-xs sm:text-sm font-bold text-gray-900 text-center focus:outline-none bg-transparent"
                      aria-label="Item quantity"
                    />
                    <button
                      onClick={() => updateQuantity(item._id, itemQuantity + 1)}
                      disabled={isMaxStock}
                      className={`p-1.5 sm:p-2 transition ${
                        isMaxStock
                          ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-100 cursor-pointer"
                      }`}
                      title={isMaxStock ? "Max stock reached" : "Increase quantity"}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="col-span-2 text-right w-full sm:w-auto flex justify-between sm:justify-end items-center">
                  <span className="sm:hidden text-xs text-gray-500 font-medium">Subtotal:</span>
                  <span className="font-bold text-green-700 text-base sm:text-lg">
                    ${itemSubtotal}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons: Return to Shop & Clear/Update Cart */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/shop"
          className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition"
        >
          Return to shop
        </Link>

        <button
          type="button"
          onClick={handleClearCart}
          className="px-6 py-3 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-sm font-semibold transition cursor-pointer"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartItemsTable;
