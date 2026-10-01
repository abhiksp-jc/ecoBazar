import React from "react";
import BannerProductPicker from "./BannerProductPicker";
import { Edit2, Plus, XCircle, Search } from "lucide-react";

const BannerModal = ({
  modalOpen,
  setModalOpen,
  editingBanner,
  formData,
  setFormData,
  error,
  handleSubmit,
  submitting,
  categories,
  filteredProductsToSelect,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  handleFileChange,
  imagePreview,
  setImagePreview,
  getFullImageUrl
}) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
              {editingBanner ? <Edit2 size={16} /> : <Plus size={18} />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingBanner ? "Edit Sales Campaign & Products" : "Create New Sales Campaign"}
              </h2>
              <p className="text-xs text-gray-500">
                Set sales campaign visuals, linked category, and which products appear in this sale.
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-center gap-2">
              <XCircle size={16} />
              {error}
            </div>
          )}

          {/* Title & Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sales Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Fresh & Healthy Organic Food"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Badge / Tagline
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. SALE UP TO, BEST DEALS, 100% FRESH"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Subtitle & Discount text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Summer Sale, Started at"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Discount / Price Text
              </label>
              <input
                type="text"
                value={formData.discountText}
                onChange={(e) => setFormData({ ...formData, discountText: e.target.value })}
                placeholder="e.g. 64% OFF, $79.99, Save 30%"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description / Supporting Text
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Free shipping on all your order."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            />
          </div>

          {/* CAMPAIGN TARGETING */}
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-green-200/80 pb-3 gap-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                  🎯
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Campaign & Sale Targeting (Category & Products)
                </h3>
              </div>
              <span className="text-xs text-green-700 font-medium">
                Controls which products are shown on the website for this campaign
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Category for this Campaign
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setFormData((prev) => {
                      const updated = { ...prev, category: newCat };
                      if (newCat) {
                        updated.buttonLink = `/shop?category=${newCat}`;
                      } else {
                        updated.buttonLink = "/shop";
                      }
                      return updated;
                    });
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
                >
                  <option value="">All Categories (No specific category)</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  Assigning a category filters the customer shop view directly to this category.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Which Type of Products to Show in Sale?
                </label>
                <select
                  value={formData.productFilterType}
                  onChange={(e) =>
                    setFormData({ ...formData, productFilterType: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-600 focus:outline-none font-medium"
                >
                  <option value="all">🛒 All Products in Category / Catalog</option>
                  <option value="discounted">🔥 On-Sale Products Only (Discounts &gt; 0%)</option>
                  <option value="specific">🎯 Hand-Pick Specific Products for this Sale</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  Choose whether all items, only discounted items, or specific products appear in this sale.
                </p>
              </div>
            </div>

            {/* Specific Hand-Picked Products Selection */}
            <BannerProductPicker
              formData={formData}
              setFormData={setFormData}
              filteredProductsToSelect={filteredProductsToSelect}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              productCategoryFilter={productCategoryFilter}
              setProductCategoryFilter={setProductCategoryFilter}
              categories={categories}
              getFullImageUrl={getFullImageUrl}
            />

          </div>

          {/* Placement & Action Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Position on Homepage
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              >
                <option value="hero_main">Hero Main (Big Left)</option>
                <option value="hero_top_right">Hero Top Right</option>
                <option value="hero_bottom_right">Hero Bottom Right</option>
                <option value="summer_sale">Summer Sale Wide Banner (Middle)</option>
                <option value="promo_middle">Middle 3-Promo Section</option>
                <option value="deal_banner">Deal of the Month Banner</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Shop Now"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Button Link
              </label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="/shop"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Order & Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="isActiveCheck"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <label htmlFor="isActiveCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                Active (Show on Customer Homepage)
              </label>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Upload Image or Set Image Path
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-green-700 hover:file:bg-green-100 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">or enter relative/external URL:</span>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="/maingreen.jpg or https://..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            {imagePreview && (
              <div className="mt-3 relative h-28 w-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imagePreview.startsWith("blob:") ? imagePreview : getFullImageUrl(imagePreview)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving..." : editingBanner ? "Save Changes" : "Create Sales Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerModal;
