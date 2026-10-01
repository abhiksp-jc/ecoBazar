import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";

const emptyCategory = () => ({
  name: "",
  description: "",
  image: null,
  preview: null
});

const CategoryForm = ({
  category,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const isEdit = Boolean(category);

  const [categories, setCategories] = useState([
    emptyCategory()
  ]);

  useEffect(() => {
    if (category) {
      setCategories([
        {
          name: category.name || "",
          description: category.description || "",
          image: null,
          preview: category.image
            ? `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}${category.image}`
            : null
        }
      ]);
    } else {
      setCategories([emptyCategory()]);
    }
  }, [category]);

  const handleChange = (index, field, value) => {
    setCategories((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setCategories((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              image: file,
              preview
            }
          : item
      )
    );
  };

  const removeImage = (index) => {
    setCategories((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              image: null,
              preview: null
            }
          : item
      )
    );
  };

  const addCategory = () => {
    setCategories((previous) => [
      ...previous,
      emptyCategory()
    ]);
  };

  const removeCategory = (index) => {
    if (categories.length === 1) return;

    setCategories((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedCategories = categories.map((item) => ({
      name: item.name.trim(),
      description: item.description.trim(),
      image: item.image
    }));

    if (formattedCategories.some((item) => !item.name)) {
      return;
    }

    if (isEdit) {
      await onSubmit(formattedCategories[0]);
      return;
    }

    await onSubmit(formattedCategories);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        {categories.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Category {index + 1}
                </h2>

                {!isEdit && (
                  <p className="mt-1 text-sm text-gray-500">
                    Add category information
                  </p>
                )}
              </div>

              {!isEdit && categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category Name
                </label>

                <input
                  type="text"
                  value={item.name}
                  onChange={(event) =>
                    handleChange(
                      index,
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Enter category name"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <input
                  type="text"
                  value={item.description}
                  onChange={(event) =>
                    handleChange(
                      index,
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Enter category description"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Image
              </label>

              {item.preview ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={item.preview}
                    alt={item.name || "Category"}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex h-40 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-green-500 hover:bg-green-50">
                  <Upload size={28} className="text-gray-400" />

                  <span className="mt-2 text-sm font-medium text-gray-600">
                    Upload image
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    JPG, PNG or WEBP up to 5MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) =>
                      handleImageChange(
                        index,
                        event.target.files?.[0]
                      )
                    }
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isEdit && (
        <button
          type="button"
          onClick={addCategory}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-green-700 px-5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          <Plus size={18} />
          Add Another Category
        </button>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-lg border border-gray-300 px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-lg bg-green-700 px-7 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Category"
            : categories.length > 1
            ? `Save ${categories.length} Categories`
            : "Save Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;