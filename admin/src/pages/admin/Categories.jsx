import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Edit, Plus, Trash2, Layers, Eye, X, Calendar, Image } from "lucide-react";

const Categories = () => {
  const {
    user,
    categories,
    categoryLoading,
    onDeleteCategory
  } = useOutletContext();

  const [viewingCategory, setViewingCategory] = useState(null);

  const permissions = user?.permissions || [];
  const isAdmin = !user?.role || String(user?.role).toUpperCase() === "ADMIN";

  const canCreate =
    isAdmin || permissions.includes("categories.create");

  const canEdit =
    isAdmin || permissions.includes("categories.edit");

  const canDelete =
    isAdmin || permissions.includes("categories.delete");

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    await onDeleteCategory(id);
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
    return `${serverUrl}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories and catalogs
          </p>
        </div>

        {canCreate && (
          <Link
            to="/categories/add"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <Plus size={18} />
            Add Category
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {categoryLoading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-sm text-gray-500">
              Loading categories...
            </p>
          </div>
        ) : !categories?.length ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Layers size={26} className="text-gray-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              No categories found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Start by adding your first product category.
            </p>

            {canCreate && (
              <Link
                to="/categories/add"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                <Plus size={17} />
                Add Category
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Image
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {category.image ? (
                        <img
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/100x100?text=Category";
                          }}
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {category.name}
                      </p>
                    </td>

                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate text-sm text-gray-500">
                        {category.description || "No description"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.createdAt
                        ? new Date(
                            category.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setViewingCategory(category)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-100"
                          title="View category details"
                        >
                          <Eye size={17} />
                        </button>

                        {canEdit && (
                          <Link
                            to={`/categories/${category._id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 text-green-700 transition hover:bg-green-50"
                            title="Edit category"
                          >
                            <Edit size={17} />
                          </Link>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(category._id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                            title="Delete category"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Category Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{viewingCategory.name}</h2>
                  <p className="text-xs text-gray-500">Category Details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingCategory(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Category Image */}
              <div className="flex justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                {viewingCategory.image ? (
                  <img
                    src={getImageUrl(viewingCategory.image)}
                    alt={viewingCategory.name}
                    className="max-h-48 max-w-full rounded-lg object-contain shadow-xs"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/300x200?text=Category";
                    }}
                  />
                ) : (
                  <div className="flex h-32 w-full flex-col items-center justify-center text-gray-400">
                    <Image size={32} className="mb-2 opacity-50" />
                    <span className="text-xs">No image provided</span>
                  </div>
                )}
              </div>

              {/* Category Specs */}
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs font-semibold uppercase text-gray-400">Category Name</span>
                  <p className="text-base font-bold text-gray-900">{viewingCategory.name}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase text-gray-400">Description</span>
                  <p className="text-gray-600 text-sm leading-relaxed mt-0.5">
                    {viewingCategory.description || "No description provided for this category."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-gray-400 border-t border-gray-100">
                  <Calendar size={14} />
                  <span>
                    Created:{" "}
                    {viewingCategory.createdAt
                      ? new Date(viewingCategory.createdAt).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-gray-50">
              {canEdit && (
                <Link
                  to={`/categories/${viewingCategory._id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                >
                  <Edit size={15} /> Edit Category
                </Link>
              )}
              <button
                type="button"
                onClick={() => setViewingCategory(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;