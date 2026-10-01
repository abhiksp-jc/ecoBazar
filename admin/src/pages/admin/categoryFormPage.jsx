import { useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import CategoryForm from "../../components/category/CategoryForm";
import { AlertCircle } from "lucide-react";

const CategoryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    categories,
    onCreateCategory,
    onCreateCategoriesBulk,
    onUpdateCategory,
    categoryLoading
  } = useOutletContext();

  const category = id
    ? categories.find((item) => item._id === id)
    : null;

  const handleSubmit = async (data) => {
    setError("");
    setSubmitting(true);

    try {
      if (id) {
        await onUpdateCategory(id, data);
      } else if (data.length > 1) {
        await onCreateCategoriesBulk(data);
      } else {
        await onCreateCategory(data[0]);
      }
    } catch (err) {
      console.error("CATEGORY SAVE ERROR:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to save category. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? "Edit Category" : "Add Category"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {id
            ? "Update category information"
            : "Add one or multiple product categories"}
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <CategoryForm
        category={category}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/categories")}
        loading={submitting || categoryLoading}
      />
    </div>
  );
};

export default CategoryFormPage;