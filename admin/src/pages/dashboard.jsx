import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { canSeeModule } from "../config/permissions";
import Header from "../components/layout/header";

import {
  getAdmin,
  logout,
  getCategories,
  createCategory,
  createCategoriesBulk,
  updateCategory,
  deleteCategory,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [categories, setCategories] = useState([]);
  const [staff, setStaff] = useState([]);

  const [categoryLoading, setCategoryLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);

      const data = await getCategories();

      setCategories(data.categories || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load categories"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  const loadStaff = async () => {
    if (user?.role !== "ADMIN") {
      return;
    }

    try {
      setStaffLoading(true);

      const data = await getStaff();

      setStaff(data.staff || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load staff"
      );
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    if (canSeeModule(user, "categories")) loadCategories();
    loadStaff();
    if (canSeeModule(user, "products")) loadProducts();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleCreateCategory = async (data) => {
    await createCategory(data);

    await loadCategories();

    setMessage("Category added successfully");

    navigate("/categories");
  };

  const handleCreateCategoriesBulk = async (data) => {
  await createCategoriesBulk(data);

  await loadCategories();

  setMessage(
    `${data.length} categories added successfully`
  );

  navigate("/categories");
};


  const handleUpdateCategory = async (id, data) => {
    await updateCategory(id, data);

    await loadCategories();

    setMessage("Category updated successfully");

    navigate("/categories");
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);

      await loadCategories();

      setMessage("Category deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete category"
      );
    }
  };

  const handleCreateStaff = async (data) => {
    await createStaff(data);

    await loadStaff();

    setMessage(
      "Staff created successfully. Login credentials have been sent by email."
    );

    navigate("/staff");
  };

  const handleUpdateStaff = async (id, data) => {
    await updateStaff(id, data);

    await loadStaff();

    setMessage("Staff updated successfully");

    navigate("/staff");
  };

  const handleDeleteStaff = async (id) => {
    try {
      await deleteStaff(id);

      await loadStaff();

      setMessage("Staff deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete staff"
      );
    }
  };
  const loadProducts = async () => {
  try {
    setProductLoading(true);

    const data = await getProducts();

    setProducts(data.products || []);
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Unable to load products"
    );
  } finally {
    setProductLoading(false);
  }
};
const handleCreateProduct = async (data) => {
  await createProduct(data);

  await loadProducts();

  setMessage("Product added successfully");

  navigate("/products");
};

const handleUpdateProduct = async (id, data) => {
  await updateProduct(id, data);

  await loadProducts();

  setMessage("Product updated successfully");

  navigate("/products");
};

const handleDeleteProduct = async (id) => {
  try {
    await deleteProduct(id);

    await loadProducts();

    setMessage("Product deleted successfully");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Unable to delete product"
    );
  }
};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ${
            sidebarCollapsed
              ? "lg:ml-[76px]"
              : "lg:ml-[240px]"
          }
        `}
      >

        <Header
          user={user}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 sm:p-6 lg:p-7">

          {message && (
            <div className="mb-5 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <span>{message}</span>

              <button
                type="button"
                onClick={() => setMessage("")}
                className="text-lg"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-lg"
              >
                ×
              </button>
            </div>
          )}

          <Outlet
            context={{
              user,

              categories,
              categoryLoading,

              staff,
              staffLoading,

              products,
              productLoading,

              onCreateProduct:
                handleCreateProduct,

              onUpdateProduct:
                handleUpdateProduct,

              onDeleteProduct:
                handleDeleteProduct,

              onCreateCategory:
                handleCreateCategory,

              onCreateCategoriesBulk:
              handleCreateCategoriesBulk,

              onUpdateCategory:
                handleUpdateCategory,

              onDeleteCategory:
                handleDeleteCategory,

              onCreateStaff:
                handleCreateStaff,

              onUpdateStaff:
                handleUpdateStaff,

              onDeleteStaff:
                handleDeleteStaff
            }}
          />

        </main>

      </div>

    </div>
  );
};

export default Dashboard;