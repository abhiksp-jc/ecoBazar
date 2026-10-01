import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import ProductFormView from "../../components/products/ProductFormView";
import ProductViewModal from "../../components/products/ProductViewModal";
import ProductTableRow from "../../components/products/ProductTableRow";

const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const Products = () => {
  const {
    products = [],
    categories = [],
    productLoading,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct
  } = useOutletContext();

  const [view, setView] = useState("list");
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [activeModalImage, setActiveModalImage] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const emptyForm = {
    name: "",
    category: "",
    description: "",
    price: "",
    discount: "0",
    stock: "",
    unit: "",
    status: "ACTIVE",
    images: []
  };

  const [form, setForm] = useState(emptyForm);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryId =
        typeof product.category === "object"
          ? product.category?._id
          : product.category;

      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "ALL" ||
        categoryId === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const finalPrice = useMemo(() => {
    const price = Number(form.price) || 0;
    const discount = Number(form.discount) || 0;

    return price - (price * discount) / 100;
  }, [form.price, form.discount]);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE}${image}`;
  };

  const getCategoryName = (product) => {
    if (product.category?.name) {
      return product.category.name;
    }

    const category = categories.find(
      (item) => item._id === product.category
    );

    return category?.name || "Unknown";
  };

  const openAddForm = () => {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      category: categories[0]?._id || ""
    });

    setView("form");
  };

  const openEditForm = (product) => {
    const categoryId =
      typeof product.category === "object"
        ? product.category?._id
        : product.category;

    setEditingProduct(product);

    setForm({
      name: product.name || "",
      category: categoryId || "",
      description: product.description || "",
      price: product.price ?? "",
      discount: product.discount ?? 0,
      stock: product.stock ?? "",
      unit: product.unit || "",
      status: product.status || "ACTIVE",
      images: []
    });

    setView("form");
  };

  const backToList = () => {
    if (saving) return;

    setView("list");
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImages = (e) => {
    setForm((prev) => ({
      ...prev,
      images: Array.from(e.target.files || [])
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!form.category) {
      alert("Please select a category");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      alert("Enter a valid price");
      return;
    }

    if (
      form.discount === "" ||
      Number(form.discount) < 0 ||
      Number(form.discount) > 100
    ) {
      alert("Discount must be between 0 and 100");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      alert("Enter a valid stock");
      return;
    }

    if (!form.unit) {
      alert("Please select a unit");
      return;
    }

    if (!editingProduct && form.images.length === 0) {
      alert("Please select a product image");
      return;
    }

    try {
      setSaving(true);

      if (editingProduct) {
        await onUpdateProduct(
          editingProduct._id,
          form
        );
      } else {
        await onCreateProduct(form);
      }

      setView("list");
      setEditingProduct(null);
      setForm(emptyForm);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    await onDeleteProduct(id);
  };

  if (view === "form") {
    return (
      <ProductFormView
        editingProduct={editingProduct}
        backToList={backToList}
        handleSubmit={handleSubmit}
        form={form}
        handleChange={handleChange}
        categories={categories}
        finalPrice={finalPrice}
        handleImages={handleImages}
        getImageUrl={getImageUrl}
        saving={saving}
      />
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your products
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
          />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
          >
            <option value="ALL">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {productLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Discount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Final Price
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((product) => (
                    <ProductTableRow
                      key={product._id}
                      product={product}
                      getImageUrl={getImageUrl}
                      getCategoryName={getCategoryName}
                      setViewingProduct={setViewingProduct}
                      setActiveModalImage={setActiveModalImage}
                      openEditForm={openEditForm}
                      handleDelete={handleDelete}
                    />
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Slide Bar */}
          {Math.ceil(filteredProducts.length / itemsPerPage) > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
        )}

      </div>

      {/* View Product Modal */}
      <ProductViewModal
        viewingProduct={viewingProduct}
        setViewingProduct={setViewingProduct}
        getCategoryName={getCategoryName}
        activeModalImage={activeModalImage}
        setActiveModalImage={setActiveModalImage}
        getImageUrl={getImageUrl}
        openEditForm={openEditForm}
      />

    </div>
  );
};

export default Products;