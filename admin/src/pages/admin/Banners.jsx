import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Search,
  Tag,
  Layers,
  Check,
  Package
} from "lucide-react";
import {
  getBanners,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner,
  getCategories,
  getProducts
} from "../../services/authService";
import Pagination from "../../components/common/Pagination";
import BannerModal from "../../components/banners/BannerModal";
import BannerCard from "../../components/banners/BannerCard";

const positionLabels = {
  hero_main: "Hero Main Banner (Left)",
  hero_top_right: "Hero Top Right Banner",
  hero_bottom_right: "Hero Bottom Right Banner",
  summer_sale: "Summer Sale Wide Banner",
  promo_middle: "Middle Promo Card",
  deal_banner: "Big Deal of Month Banner",
  other: "Other"
};

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bannersPerPage = 6;

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    badge: "",
    discountText: "",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    position: "hero_main",
    displayOrder: 0,
    isActive: true,
    imageUrl: "",
    category: "",
    productFilterType: "all", // "all", "category", "discounted", "specific"
    selectedProducts: []
  });

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [bannersRes, catsRes, prodsRes] = await Promise.all([
        getBanners(true).catch(() => ({ banners: [] })),
        getCategories().catch(() => []),
        getProducts().catch(() => [])
      ]);

      setBanners(bannersRes?.banners || []);

      const catList = Array.isArray(catsRes) ? catsRes : catsRes?.categories || [];
      setCategories(catList);

      const prodList = Array.isArray(prodsRes) ? prodsRes : prodsRes?.products || [];
      setProducts(prodList);
    } catch (err) {
      console.error("Failed to load banners/catalog data:", err);
      setError("Failed to load banners and catalog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      badge: "",
      discountText: "",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      position: "hero_main",
      displayOrder: banners.length + 1,
      isActive: true,
      imageUrl: "",
      category: "",
      productFilterType: "all",
      selectedProducts: []
    });
    setProductSearch("");
    setProductCategoryFilter("ALL");
    setImageFile(null);
    setImagePreview("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      badge: banner.badge || "",
      discountText: banner.discountText || "",
      buttonText: banner.buttonText || "Shop Now",
      buttonLink: banner.buttonLink || "/shop",
      position: banner.position || "hero_main",
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive !== false,
      imageUrl: banner.image || "",
      category: typeof banner.category === "object" ? banner.category?._id || "" : banner.category || "",
      productFilterType: banner.productFilterType || (banner.category ? "category" : "all"),
      selectedProducts: Array.isArray(banner.selectedProducts)
        ? banner.selectedProducts.map((p) => (typeof p === "object" ? p._id : p))
        : []
    });
    setProductSearch("");
    setProductCategoryFilter("ALL");
    setImageFile(null);
    setImagePreview(banner.image || "");
    setError("");
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Sales campaign title is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);
      data.append("badge", formData.badge);
      data.append("discountText", formData.discountText);
      data.append("buttonText", formData.buttonText);
      data.append("buttonLink", formData.buttonLink);
      data.append("position", formData.position);
      data.append("displayOrder", formData.displayOrder);
      data.append("isActive", formData.isActive);

      // Campaign targeting
      data.append("category", formData.category || "");
      data.append("productFilterType", formData.productFilterType || "all");
      data.append("selectedProducts", JSON.stringify(formData.selectedProducts || []));

      if (imageFile) {
        data.append("image", imageFile);
      } else if (formData.imageUrl) {
        data.append("imageUrl", formData.imageUrl);
      }

      if (editingBanner) {
        await updateBanner(editingBanner._id, data);
        setSuccess("Sales campaign updated successfully!");
      } else {
        await createBanner(data);
        setSuccess("Sales campaign created successfully!");
      }

      setModalOpen(false);
      loadData();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Sales save error:", err);
      setError(err.response?.data?.message || "Failed to save sales campaign");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (banner) => {
    try {
      await toggleBannerStatus(banner._id);
      setBanners((prev) =>
        prev.map((b) =>
          b._id === banner._id ? { ...b, isActive: !b.isActive } : b
        )
      );
    } catch (err) {
      alert("Failed to toggle sales campaign status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sales campaign?")) return;
    try {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b._id !== id));
      setSuccess("Sales campaign deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to delete sales campaign");
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x300?text=No+Image";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads/") || img.startsWith("uploads/")) {
      return `http://localhost:5000${img.startsWith("/") ? "" : "/"}${img}`;
    }
    return `http://localhost:5174${img.startsWith("/") ? "" : "/"}${img}`;
  };

  // Products filtered for the picker inside modal
  const filteredProductsToSelect = products.filter((p) => {
    if (productCategoryFilter !== "ALL") {
      const pCat = typeof p.category === "object" ? p.category?._id : p.category;
      if (pCat !== productCategoryFilter) return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, update, enable/disable sales campaigns and promotional banners with targeted categories & products.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white transition hover:bg-green-800 shadow-xs cursor-pointer"
        >
          <Plus size={18} />
          Add Sales
        </button>
      </div>

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700 flex items-center gap-2 border border-green-200">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {error && !modalOpen && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 flex items-center gap-2 border border-red-200">
          <XCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Loading sales & campaigns...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-8 text-center">
          <ImageIcon size={48} className="text-gray-300 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800">No sales found</h2>
          <p className="text-sm text-gray-500 mt-1 mb-4">Add your first sales campaign or promotional banner</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 cursor-pointer"
          >
            <Plus size={16} /> Add Sales
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners
              .map((banner) => (
                <BannerCard
                  key={banner._id}
                  banner={banner}
                  categories={categories}
                  positionLabels={positionLabels}
                  getFullImageUrl={getFullImageUrl}
                  handleToggle={handleToggle}
                  openEditModal={openEditModal}
                  handleDelete={handleDelete}
                />
              ))}
          </div>

          {Math.ceil(banners.length / bannersPerPage) > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(banners.length / bannersPerPage)}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Add / Edit Banner & Campaign Modal */}
      <BannerModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        editingBanner={editingBanner}
        formData={formData}
        setFormData={setFormData}
        error={error}
        handleSubmit={handleSubmit}
        submitting={submitting}
        categories={categories}
        filteredProductsToSelect={filteredProductsToSelect}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        productCategoryFilter={productCategoryFilter}
        setProductCategoryFilter={setProductCategoryFilter}
        handleFileChange={handleFileChange}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        getFullImageUrl={getFullImageUrl}
      />
    </div>
  );
};

export default Banners;
