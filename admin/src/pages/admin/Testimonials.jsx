import { useState, useEffect } from "react";
import {
  Quote,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Plus,
  Star,
  Eye,
  AlertCircle,
  X,
  MessageSquare
} from "lucide-react";
import {
  getAdminTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
  createAdminTestimonial
} from "../../services/authService";
import TestimonialTableRow from "../../components/testimonials/TestimonialTableRow";
import TestimonialDetailModal from "../../components/testimonials/TestimonialDetailModal";
import TestimonialCreateModal from "../../components/testimonials/TestimonialCreateModal";

const getAvatarUrl = (avatar, name) => {
  if (!avatar) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=00B207&color=fff&size=120`;
  }
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  const backendBase =
    import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";
  return `${backendBase.replace(/\/$/, "")}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  // Add Testimonial Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Customer",
    rating: 5,
    review: "",
    status: "APPROVED"
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
  };

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getAdminTestimonials(statusFilter, searchQuery);
      setTestimonials(data.testimonials || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      showToast("Failed to load customer testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadTestimonials();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTestimonialStatus(id, newStatus);
      showToast(
        newStatus === "APPROVED"
          ? "Review is now live on the homepage."
          : newStatus === "REJECTED"
          ? "Review is now hidden from the homepage."
          : "Review status updated."
      );
      loadTestimonials();
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview((prev) => ({
          ...prev,
          status: newStatus,
          isApproved: newStatus === "APPROVED"
        }));
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await deleteTestimonial(id);
      showToast("Review deleted successfully");
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview(null);
      }
      loadTestimonials();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete review", "error");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.review.trim()) {
      showToast("Please provide customer name and review message", "error");
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("role", formData.role.trim() || "Customer");
      payload.append("rating", formData.rating);
      payload.append("review", formData.review.trim());
      payload.append("status", formData.status);

      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      await createAdminTestimonial(payload);
      showToast("Review created successfully!");
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        role: "Customer",
        rating: 5,
        review: "",
        status: "APPROVED"
      });
      setAvatarFile(null);
      loadTestimonials();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to create review", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Toast Notification */}
      {notification.message && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            notification.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          ) : (
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification({ type: "", message: "" })}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer feedback and control homepage visibility
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00B207] hover:bg-[#009406] text-white text-sm font-semibold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add Review</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "All", count: stats.total },
            { key: "APPROVED", label: "Live on Homepage", count: stats.approved },
            { key: "PENDING", label: "Pending", count: stats.pending, isAlert: stats.pending > 0 },
            { key: "REJECTED", label: "Hidden", count: stats.rejected }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-[#00B207] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.key
                    ? "bg-white/25 text-white"
                    : tab.isAlert
                    ? "bg-amber-100 text-amber-800 font-bold"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search by name, review..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>
      </div>

      {/* Main Reviews Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center py-12 text-gray-400">
            <div className="w-7 h-7 border-2 border-[#00B207] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs">Loading customer reviews...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Quote size={22} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No reviews found</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm">
              {statusFilter === "PENDING"
                ? "There are no pending reviews awaiting approval."
                : "No customer reviews match your search or filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-200 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Rating</th>
                  <th className="px-5 py-3.5 min-w-[280px]">Review</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-center">Homepage Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((item) => (
                  <TestimonialTableRow
                    key={item._id}
                    item={item}
                    getAvatarUrl={getAvatarUrl}
                    setSelectedReview={setSelectedReview}
                    handleStatusChange={handleStatusChange}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Full View Modal */}
      <TestimonialDetailModal
        selectedReview={selectedReview}
        setSelectedReview={setSelectedReview}
        getAvatarUrl={getAvatarUrl}
        handleStatusChange={handleStatusChange}
      />

      {/* Add Review Modal */}
      <TestimonialCreateModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        setAvatarFile={setAvatarFile}
        handleCreateSubmit={handleCreateSubmit}
        formSubmitting={formSubmitting}
      />

    </div>
  );
};

export default Testimonials;
