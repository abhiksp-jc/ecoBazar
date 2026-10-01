import React from "react";

const ProductFormView = ({
  editingProduct,
  backToList,
  handleSubmit,
  form,
  handleChange,
  categories,
  finalPrice,
  handleImages,
  getImageUrl,
  saving,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={backToList}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h1>

          <p className="text-sm text-gray-500">
            {editingProduct ? "Update product details" : "Add a new product"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Fresh Apple"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Product description"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="200"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Discount %
            </label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              placeholder="10"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Final Price
            </label>
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 font-semibold text-green-700">
              ₹{finalPrice.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              placeholder="50"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Unit *
            </label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            >
              <option value="">Select Unit</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="litre">litre</option>
              <option value="ml">ml</option>
              <option value="piece">piece</option>
              <option value="pack">pack</option>
              <option value="box">box</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            />

            {editingProduct?.images?.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-500">Current images</p>
                <div className="flex gap-3">
                  {editingProduct.images.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt=""
                      className="h-20 w-20 rounded-lg border object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {form.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {form.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="h-20 w-20 rounded-lg border object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={backToList}
            disabled={saving}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormView;
