import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X
} from "lucide-react";

import Button from "../common/Button";
import Table from "../common/Table";
import ConfirmDialog from "../common/Dialog";
import CategoryForm from "./CategoryForm";

const CategorySection = ({
  categories,
  loading,
  onCreate,
  onUpdate,
  onDelete
}) => {
  const [showForm, setShowForm] =
    useState(false);

  const [
    editingCategory,
    setEditingCategory
  ] = useState(null);

  const [deleteId, setDeleteId] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const openCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (
    formData
  ) => {
    try {
      setSubmitting(true);

      if (editingCategory) {
        await onUpdate(
          editingCategory._id,
          formData
        );
      } else {
        await onCreate(formData);
      }

      closeForm();
    } catch (error) {
      console.error(
        "CATEGORY FORM ERROR:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (item) =>
        item.image ? (
          <img
            src={`http://localhost:5000${item.image}`}
            alt={item.name}
            
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )
    },
    {
      key: "name",
      label: "Name"
    },
    {
      key: "description",
      label: "Description",
      render: (item) => (
        <span className="text-gray-500">
          {item.description || "—"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              openEdit(item)
            }
            className="p-2 text-green-600 rounded-lg hover:bg-green-50"
          >
            <Edit size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              setDeleteId(item._id)
            }
            className="p-2 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={17} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Category Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage grocery product
              categories
            </p>
          </div>

          {!showForm && (
            <Button onClick={openCreate}>
              <span className="flex items-center gap-2">
                <Plus size={17} />
                Add Category
              </span>
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {editingCategory
                  ? "Edit Category"
                  : "Add New Category"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {editingCategory
                  ? "Update category details"
                  : "Create a new product category"}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <CategoryForm
              category={
                editingCategory
              }
              onSubmit={handleSubmit}
              onCancel={closeForm}
              loading={submitting}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">
            Category List
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {categories?.length || 0}{" "}
            categor
            {(categories?.length ||
              0) === 1
              ? "y"
              : "ies"}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading categories...
          </div>
        ) : (
          <Table
            columns={columns}
            data={categories || []}
            emptyMessage="No categories found"
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onCancel={() =>
          setDeleteId(null)
        }
        onConfirm={async () => {
          try {
            await onDelete(deleteId);
            setDeleteId(null);
          } catch (error) {
            console.error(
              "DELETE CATEGORY ERROR:",
              error
            );
          }
        }}
      />
    </div>
  );
};

export default CategorySection;