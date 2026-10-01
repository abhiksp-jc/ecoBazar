import React from "react";
import { Search } from "lucide-react";

const BannerProductPicker = ({
  formData,
  setFormData,
  filteredProductsToSelect,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  categories,
  getFullImageUrl,
}) => {
  if (formData.productFilterType !== "specific") return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3.5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-800">
            Select Products for this Campaign:
          </span>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
            {formData.selectedProducts.length} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const filteredIds = filteredProductsToSelect.map((p) => p._id);
              const merged = Array.from(
                new Set([...formData.selectedProducts, ...filteredIds])
              );
              setFormData({ ...formData, selectedProducts: merged });
            }}
            className="text-xs font-semibold text-green-700 hover:underline cursor-pointer"
          >
            Select All Visible
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, selectedProducts: [] })}
            className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products by name..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full rounded-md border border-gray-200 pl-8 pr-3 py-1.5 text-xs focus:border-green-600 focus:outline-none"
          />
        </div>
        <select
          value={productCategoryFilter}
          onChange={(e) => setProductCategoryFilter(e.target.value)}
          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:border-green-600 focus:outline-none"
        >
          <option value="ALL">Filter by Category: All</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-lg">
        {filteredProductsToSelect.length === 0 ? (
          <p className="p-4 text-center text-xs text-gray-400">
            No matching products found.
          </p>
        ) : (
          filteredProductsToSelect.map((prod) => {
            const isChecked = formData.selectedProducts.includes(prod._id);
            const prodImage = prod.images?.[0]
              ? getFullImageUrl(prod.images[0])
              : "";

            return (
              <label
                key={prod._id}
                className={`flex items-center justify-between p-2.5 hover:bg-green-50/50 cursor-pointer transition ${
                  isChecked ? "bg-green-50/40" : ""
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setFormData((prev) => {
                        const exists = prev.selectedProducts.includes(prod._id);
                        return {
                          ...prev,
                          selectedProducts: exists
                            ? prev.selectedProducts.filter((id) => id !== prod._id)
                            : [...prev.selectedProducts, prod._id],
                        };
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0 cursor-pointer"
                  />
                  {prodImage && (
                    <img
                      src={prodImage}
                      alt=""
                      className="w-9 h-9 rounded object-cover border border-gray-200 shrink-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {prod.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {typeof prod.category === "object"
                        ? prod.category?.name
                        : categories.find((c) => c._id === prod.category)?.name || ""}
                      {prod.stock !== undefined && ` • ${prod.stock} in stock`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="text-xs font-bold text-gray-900">
                    ₹{Number(prod.finalPrice || prod.price).toFixed(2)}
                  </span>
                  {Number(prod.discount) > 0 && (
                    <span className="block text-[10px] font-bold text-red-600">
                      {prod.discount}% OFF
                    </span>
                  )}
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BannerProductPicker;
