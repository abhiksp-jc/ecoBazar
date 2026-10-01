import React from "react";
import { Package, X, Image as ImageIcon, Tag, Calendar, Edit } from "lucide-react";

const ProductViewModal = ({
  viewingProduct,
  setViewingProduct,
  getCategoryName,
  activeModalImage,
  setActiveModalImage,
  getImageUrl,
  openEditForm,
}) => {
  if (!viewingProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{viewingProduct.name}</h2>
              <p className="text-xs text-gray-500">Category: {getCategoryName(viewingProduct)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewingProduct(null)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Product Images Preview */}
          <div className="flex flex-col items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="h-56 w-full max-w-sm flex items-center justify-center overflow-hidden rounded-xl bg-white p-2 border border-gray-100 shadow-xs">
              {viewingProduct.images && viewingProduct.images.length > 0 ? (
                <img
                  src={getImageUrl(viewingProduct.images[activeModalImage] || viewingProduct.images[0])}
                  alt={viewingProduct.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=Product";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={36} className="mb-2 opacity-50" />
                  <span className="text-xs">No images available</span>
                </div>
              )}
            </div>

            {/* Thumbnails if multiple images */}
            {viewingProduct.images && viewingProduct.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 max-w-full">
                {viewingProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveModalImage(idx)}
                    className={`h-12 w-12 rounded-lg border-2 overflow-hidden bg-white p-1 shrink-0 transition ${
                      activeModalImage === idx ? "border-green-600 shadow-xs" : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price & Stock Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-[11px] font-semibold uppercase text-gray-400">Base Price</span>
              <p className="text-base font-bold text-gray-900 mt-0.5">₹{Number(viewingProduct.price).toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-[11px] font-semibold uppercase text-gray-400">Discount</span>
              <p className="text-base font-bold text-red-600 mt-0.5">{viewingProduct.discount || 0}%</p>
            </div>

            <div className="bg-green-50/60 p-3.5 rounded-xl border border-green-200">
              <span className="text-[11px] font-semibold uppercase text-green-700">Final Price</span>
              <p className="text-base font-extrabold text-green-700 mt-0.5">
                ₹{Number(viewingProduct.finalPrice || viewingProduct.price - (viewingProduct.price * (viewingProduct.discount || 0)) / 100).toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-[11px] font-semibold uppercase text-gray-400">Total Stock</span>
              <p className="text-base font-bold text-gray-900 mt-0.5">
                {viewingProduct.stock} {viewingProduct.unit}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {viewingProduct.description || "No description provided."}
            </p>
          </div>

          {/* Metadata details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-gray-400" />
              <span>Status: <strong className={viewingProduct.status === "ACTIVE" ? "text-green-600" : "text-red-500"}>{viewingProduct.status || "ACTIVE"}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span>Created: {viewingProduct.createdAt ? new Date(viewingProduct.createdAt).toLocaleDateString() : "—"}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            type="button"
            onClick={() => {
              const prod = viewingProduct;
              setViewingProduct(null);
              openEditForm(prod);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            <Edit size={15} /> Edit Product
          </button>
          <button
            type="button"
            onClick={() => setViewingProduct(null)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
