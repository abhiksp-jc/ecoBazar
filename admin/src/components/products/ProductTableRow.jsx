import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const ProductTableRow = ({
  product,
  getImageUrl,
  getCategoryName,
  setViewingProduct,
  setActiveModalImage,
  openEditForm,
  handleDelete,
}) => {
  const image = product.images?.[0];

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
            {image ? (
              <img
                src={getImageUrl(image)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">{product.unit}</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-sm text-gray-600">
        {getCategoryName(product)}
      </td>

      <td className="px-5 py-4 text-sm">
        ₹{Number(product.price).toFixed(2)}
      </td>

      <td className="px-5 py-4">
        {Number(product.discount) > 0 ? (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
            {product.discount}% OFF
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      <td className="px-5 py-4 text-sm font-semibold text-green-600">
        ₹{Number(product.finalPrice).toFixed(2)}
      </td>

      <td className="px-5 py-4 text-sm text-gray-600">
        {product.stock} {product.unit}
      </td>

      <td className="px-5 py-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setViewingProduct(product);
              setActiveModalImage(0);
            }}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-100 transition"
            title="View Product Details"
          >
            <Eye size={14} />
            View
          </button>

          <button
            type="button"
            onClick={() => openEditForm(product)}
            className="flex items-center gap-1 rounded-lg border border-green-200 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50 transition"
            title="Edit Product"
          >
            <Edit size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(product._id)}
            className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            title="Delete Product"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
